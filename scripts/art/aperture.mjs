#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   Aperture: the site's light, rendered.

   A dark gallery room. In the far wall, a monumental opening in the outline
   of the PlanckSpace mark (a rectangle with two true 45° chamfers, the
   320 × 300 box of MARK_SHARP without its counter). Through it, blue-hour
   sky; in the sky, faint stars that sit on an exact square lattice of the
   mark's own module grid, only some sites lit. A polished floor mirrors the
   opening and dissolves into night (#06080D). Haze carries the light onto
   the wall; a few motes hang in it.

   Everything is computed here, deterministically (seeded), in linear light:
   an analytic, supersampled edge; the sky from an OKLab ramp; haze and lens
   glare as stacked Gaussian blurs of what the opening emits; wall light that
   falls off from the opening's edge; the reflection as a mirror blurred more
   the further it travels from the wall, with a gloss lobe; a filmic
   shoulder; sRGB; then a 1-LSB triangular dither, only enough to stop
   banding. No film grain is baked in: the page adds it with `.grain`.
   Every served width is rendered natively, not downsampled from one master,
   so the lattice never beats against the pixel grid (see MIN_SIGMA).

   Run (from the repo root):
     node scripts/art/aperture.mjs                     every variant → public/art
     node scripts/art/aperture.mjs hero close          only these
     node scripts/art/aperture.mjs hero --png <dir>    also write the largest
                                                       width as a lossless PNG
     node scripts/art/aperture.mjs hero --preview 2300 --png <dir>
                                                       one width, PNG only

   Needs only `sharp`, which Next already installs. Same code and seed, same
   pixels. Variants and their served widths are in VARIANTS at the bottom;
   ApertureArt.tsx lists the same files.
   ═══════════════════════════════════════════════════════════════════════════ */

import { mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/* ─── numbers ─────────────────────────────────────────────────────────────── */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/* ─── colour ──────────────────────────────────────────────────────────────── */

const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (h) => hex(h).map(toLin);

function linToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function oklabToLin([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** A smooth ramp through sRGB stops, interpolated in OKLab, kinks blurred out. */
function ramp(stops, n = 2048, soften = 0.045) {
  const labs = stops.map(([t, h]) => [t, linToOklab(lin(h))]);
  const raw = new Float64Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let k = 0;
    while (k < labs.length - 2 && t > labs[k + 1][0]) k++;
    const [t0, c0] = labs[k];
    const [t1, c1] = labs[k + 1];
    const u = clamp((t - t0) / (t1 - t0));
    for (let c = 0; c < 3; c++) raw[i * 3 + c] = lerp(c0[c], c1[c], u);
  }
  // soften the stops: a small Gaussian along the ramp, clamped at the ends
  const sig = soften * n;
  const rad = Math.ceil(sig * 3);
  const w = [];
  for (let j = -rad; j <= rad; j++) w.push(Math.exp(-(j * j) / (2 * sig * sig)));
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let s0 = 0,
      s1 = 0,
      s2 = 0,
      ws = 0;
    for (let j = -rad; j <= rad; j++) {
      const k = Math.min(n - 1, Math.max(0, i + j));
      const wt = w[j + rad];
      s0 += raw[k * 3] * wt;
      s1 += raw[k * 3 + 1] * wt;
      s2 += raw[k * 3 + 2] * wt;
      ws += wt;
    }
    const rgb = oklabToLin([s0 / ws, s1 / ws, s2 / ws]);
    for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.max(0, rgb[c]);
  }
  return (t) => {
    const f = clamp(t) * (n - 1);
    const i = Math.min(n - 2, Math.floor(f));
    const u = f - i;
    return [lerp(out[i * 3], out[i * 3 + 3], u), lerp(out[i * 3 + 1], out[i * 3 + 4], u), lerp(out[i * 3 + 2], out[i * 3 + 5], u)];
  };
}

/* ─── images: planar float RGB ───────────────────────────────────────────── */

const img = (W, H) => ({ W, H, c: [new Float32Array(W * H), new Float32Array(W * H), new Float32Array(W * H)] });
const plane = (W, H) => new Float32Array(W * H);

function boxesForGauss(sigma, n = 3) {
  const wIdeal = Math.sqrt((12 * sigma * sigma) / n + 1);
  let wl = Math.floor(wIdeal);
  if (wl % 2 === 0) wl--;
  const wu = wl + 2;
  const mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
  const m = Math.round(mIdeal);
  const sizes = [];
  for (let i = 0; i < n; i++) sizes.push(i < m ? wl : wu);
  return sizes.map((s) => Math.max(0, (s - 1) / 2));
}

function boxH(src, dst, W, H, r) {
  if (r < 1) return dst.set(src);
  const inv = 1 / (2 * r + 1);
  for (let y = 0; y < H; y++) {
    const o = y * W;
    let acc = (r + 1) * src[o];
    for (let i = 1; i <= r; i++) acc += src[o + Math.min(i, W - 1)];
    for (let x = 0; x < W; x++) {
      dst[o + x] = acc * inv;
      acc += src[o + Math.min(x + r + 1, W - 1)] - src[o + Math.max(x - r, 0)];
    }
  }
}
function boxV(src, dst, W, H, r) {
  if (r < 1) return dst.set(src);
  const inv = 1 / (2 * r + 1);
  const acc = new Float64Array(W);
  for (let x = 0; x < W; x++) {
    let a = (r + 1) * src[x];
    for (let i = 1; i <= r; i++) a += src[Math.min(i, H - 1) * W + x];
    acc[x] = a;
  }
  for (let y = 0; y < H; y++) {
    const o = y * W;
    const add = Math.min(y + r + 1, H - 1) * W;
    const sub = Math.max(y - r, 0) * W;
    for (let x = 0; x < W; x++) {
      dst[o + x] = acc[x] * inv;
      acc[x] += src[add + x] - src[sub + x];
    }
  }
}

/** Anisotropic Gaussian of one plane (three box passes per axis). */
function gaussPlane(p, W, H, sx, sy = sx) {
  const a = Float32Array.from(p);
  const b = new Float32Array(W * H);
  if (sx > 0.3)
    for (const r of boxesForGauss(sx)) {
      boxH(a, b, W, H, Math.round(r));
      a.set(b);
    }
  if (sy > 0.3)
    for (const r of boxesForGauss(sy)) {
      boxV(a, b, W, H, Math.round(r));
      a.set(b);
    }
  return a;
}

/** Blur at a reduced resolution, then bilinear back up: same result for wide kernels, far cheaper. */
function gaussPlaneFast(p, W, H, sx, sy = sx) {
  const f = Math.max(1, Math.min(8, Math.floor(Math.min(sx, sy) / 6)));
  if (f === 1) return gaussPlane(p, W, H, sx, sy);
  const w = Math.ceil(W / f);
  const h = Math.ceil(H / f);
  const small = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let s = 0,
        n = 0;
      for (let j = 0; j < f; j++) {
        const yy = y * f + j;
        if (yy >= H) break;
        for (let i = 0; i < f; i++) {
          const xx = x * f + i;
          if (xx >= W) break;
          s += p[yy * W + xx];
          n++;
        }
      }
      small[y * w + x] = s / n;
    }
  const bl = gaussPlane(small, w, h, sx / f, sy / f);
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const fy = clamp((y + 0.5) / f - 0.5, 0, h - 1);
    const y0 = Math.floor(fy);
    const y1 = Math.min(h - 1, y0 + 1);
    const v = fy - y0;
    for (let x = 0; x < W; x++) {
      const fx = clamp((x + 0.5) / f - 0.5, 0, w - 1);
      const x0 = Math.floor(fx);
      const x1 = Math.min(w - 1, x0 + 1);
      const u = fx - x0;
      const a = bl[y0 * w + x0] * (1 - u) + bl[y0 * w + x1] * u;
      const b = bl[y1 * w + x0] * (1 - u) + bl[y1 * w + x1] * u;
      out[y * W + x] = a * (1 - v) + b * v;
    }
  }
  return out;
}

const gauss = (im, sx, sy = sx) => ({ W: im.W, H: im.H, c: im.c.map((p) => gaussPlaneFast(p, im.W, im.H, sx, sy)) });

/* ─── noise (plaster, floor) ─────────────────────────────────────────────── */

function perlin(seed) {
  const rnd = mulberry32(seed);
  const perm = new Uint16Array(512);
  const p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const gx = new Float32Array(256);
  const gy = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const a = rnd() * Math.PI * 2;
    gx[i] = Math.cos(a);
    gy[i] = Math.sin(a);
  }
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const X = xi & 255;
    const Y = yi & 255;
    const g = (i, j, dx, dy) => {
      const h = perm[perm[X + i] + Y + j];
      return gx[h] * dx + gy[h] * dy;
    };
    const u = fade(xf);
    const v = fade(yf);
    const n00 = g(0, 0, xf, yf);
    const n10 = g(1, 0, xf - 1, yf);
    const n01 = g(0, 1, xf, yf - 1);
    const n11 = g(1, 1, xf - 1, yf - 1);
    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v) * 1.41;
  };
}

/* ─── the aperture ───────────────────────────────────────────────────────── */

// MARK_SHARP's outer silhouette, clockwise, in its 320 × 300 box.
const MARK = [
  [90, 0],
  [320, 0],
  [320, 155],
  [175, 300],
  [0, 300],
  [0, 90],
];

function polygon(x0, y0, w) {
  const k = w / 320;
  const pts = MARK.map(([x, y]) => [x0 + x * k, y0 + y * k]);
  // inward-facing edge normals (clockwise polygon in y-down space)
  const edges = pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const len = Math.hypot(dx, dy);
    return { px: p[0], py: p[1], nx: -dy / len, ny: dx / len };
  });
  /** signed distance, positive outside (exact for this convex shape away from vertices) */
  const sd = (x, y) => {
    let m = -Infinity;
    for (const e of edges) {
      const d = -((x - e.px) * e.nx + (y - e.py) * e.ny);
      if (d > m) m = d;
    }
    return m;
  };
  /** euclidean distance to the outline, 0 inside: round, even contours for the light that falls off it */
  const segs = pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
  const dist = (x, y) => {
    if (sd(x, y) <= 0) return 0;
    let m = Infinity;
    for (const [[ax, ay], [bx, by]] of segs) {
      const vx = bx - ax;
      const vy = by - ay;
      const t = clamp(((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy));
      const d = Math.hypot(x - ax - t * vx, y - ay - t * vy);
      if (d < m) m = d;
    }
    return m;
  };
  return { pts, sd, dist, x0, y0, w, h: (w * 300) / 320 };
}

/** Area coverage of each pixel by the opening: 16 × 16 samples on edge pixels. */
function coverage(W, H, poly) {
  const C = plane(W, H);
  const N = 16;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const d = poly.sd(x + 0.5, y + 0.5);
      if (d < -1) C[y * W + x] = 1;
      else if (d < 1) {
        let n = 0;
        for (let j = 0; j < N; j++)
          for (let i = 0; i < N; i++) if (poly.sd(x + (i + 0.5) / N, y + (j + 0.5) / N) <= 0) n++;
        C[y * W + x] = n / (N * N);
      }
    }
  return C;
}

/** Add a soft point (Gaussian) of colour col × amp. */
function dab(im, x, y, sigma, amp, col) {
  const r = Math.ceil(sigma * 3.5);
  const { W, H, c } = im;
  for (let j = Math.floor(y - r); j <= Math.ceil(y + r); j++) {
    if (j < 0 || j >= H) continue;
    for (let i = Math.floor(x - r); i <= Math.ceil(x + r); i++) {
      if (i < 0 || i >= W) continue;
      const dx = i + 0.5 - x;
      const dy = j + 0.5 - y;
      const g = amp * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
      if (g < 1e-6) continue;
      const o = j * W + i;
      c[0][o] += g * col[0];
      c[1][o] += g * col[1];
      c[2][o] += g * col[2];
    }
  }
}

/* Regular marks (the lattice's stars and dots) must survive resampling: a
   1px mark on a fixed pitch beats against the pixel grid when the file is
   scaled, and reads as stripes. Every served width is rendered natively, and
   no mark is drawn narrower than MIN_SIGMA output px; a widened mark gives up
   peak to keep its energy, so it looks the same at every width. */
const MIN_SIGMA = 0.85;
function markSigma(nominal) {
  const sig = Math.max(nominal, MIN_SIGMA);
  return [sig, (nominal / sig) ** 2];
}

/** An out-of-focus mote: a soft disc, a little brighter toward one side, a faint rim. */
function bokeh(im, x, y, R, amp, col, soft, seed = 1) {
  const { W, H, c } = im;
  const r = R + soft * 2;
  const rnd = mulberry32(seed);
  const ang = rnd() * Math.PI * 2;
  const ax = Math.cos(ang);
  const ay = Math.sin(ang);
  for (let j = Math.floor(y - r); j <= Math.ceil(y + r); j++) {
    if (j < 0 || j >= H) continue;
    for (let i = Math.floor(x - r); i <= Math.ceil(x + r); i++) {
      if (i < 0 || i >= W) continue;
      const dx = i + 0.5 - x;
      const dy = j + 0.5 - y;
      const d = Math.hypot(dx, dy);
      const edge = 1 - smooth(R - soft, R + soft, d);
      if (edge <= 0) continue;
      const rim = 0.7 + 0.3 * smooth(R * 0.5, R, d) ** 2;
      const side = 1 + 0.25 * ((dx * ax + dy * ay) / R);
      const g = amp * edge * rim * side;
      const o = j * W + i;
      c[0][o] += g * col[0];
      c[1][o] += g * col[1];
      c[2][o] += g * col[2];
    }
  }
}

/* ─── the scene ──────────────────────────────────────────────────────────── */

const NIGHT = lin("#06080D");

const SKY = ramp([
  [0.0, "#081853"],
  [0.16, "#0B1F6B"],
  [0.5, "#1F50D4"],
  [0.66, "#2E6BF2"],
  [0.84, "#9DBCFB"],
  [0.955, "#E3EBFE"],
  [0.993, "#F7F3EC"],
  [1.0, "#FBF5EB"],
]);

/**
 * Render one frame. Geometry is in design px (CSS px at the size the frame
 * is designed for); `scale` is master px per design px.
 */
function render(spec) {
  const t0 = Date.now();
  const S = spec.scale;
  const W = Math.round(spec.size[0] * S);
  const H = Math.round(spec.size[1] * S);
  const rnd = mulberry32(spec.seed);
  const o = spec.opening;
  const hasFloor = spec.floor != null;
  const floorY = hasFloor ? spec.floor * S : H * 10;
  const ow = o.w * S;
  const oh = (ow * 300) / 320;
  const oy = hasFloor ? floorY - (spec.sill ?? 0) * S - oh : o.y * S;
  const ox = o.x * S;
  const poly = polygon(ox, oy, ow);
  const skyT0 = spec.skyTop != null ? spec.skyTop : 0; // ramp t at the opening's top
  const skyT1 = spec.skyBottom != null ? spec.skyBottom : 1; // ramp t at its bottom

  /* 1 · the opening and the sky through it */
  const C = coverage(W, H, poly);
  const sky = img(W, H);
  for (let y = 0; y < H; y++) {
    const t = lerp(skyT0, skyT1, (y + 0.5 - oy) / oh);
    const col = SKY(t);
    for (let x = 0; x < W; x++) {
      const k = C[y * W + x];
      if (k === 0) continue;
      // a breath of lateral variation, brighter toward the right
      const u = (x - ox) / ow;
      const lat = 1 + (spec.skyLateral ?? 0.06) * (u - 0.5);
      for (let c = 0; c < 3; c++) sky.c[c][y * W + x] = col[c] * lat;
    }
  }

  /* 2 · stars on the mark's module grid, only some sites lit */
  const step = (ow / 32) * spec.lattice;
  const starCol = [0.82, 0.9, 1.0];
  let stars = 0;
  for (let j = -64; j < 128; j++)
    for (let i = -64; i < 128; i++) {
      const x = ox + i * step;
      const y = oy + j * step;
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const lit = rnd();
      const bright = rnd();
      const jitter = rnd();
      if (poly.sd(x, y) > -step * 0.45) continue;
      if (lit > spec.stars.p) continue;
      const t = lerp(skyT0, skyT1, (y - oy) / oh);
      const vis = 1 - smooth(spec.stars.fadeFrom, spec.stars.fadeTo, t);
      if (vis <= 0.01) continue;
      const st = spec.stars;
      const b = st.amp * (st.floor + (1 - st.floor) * bright ** st.gamma) * vis;
      const [sig, k] = markSigma(S * (0.5 + 0.12 * bright + 0.04 * jitter));
      dab(sky, x, y, sig, b * k, starCol);
      stars++;
    }

  /* 3 · what the opening emits, and its glare/haze at several radii */
  const radii = spec.haze.radii.map((r) => r * S);
  const blurred = radii.map((r) => gauss(sky, r));

  /* 4 · the wall: plaster lit by the room's scattered light. It falls off
     with distance from the opening's edge: brightest hugging it, then a long
     Lorentzian tail, so the light visibly reaches across the room. Its colour
     is the sky's as the widest haze carries it, greyed by the plaster. */
  const noise = perlin(spec.seed * 7 + 1);
  const noise2 = perlin(spec.seed * 13 + 5);
  const wall = img(W, H);
  const amb = spec.wall.ambient;
  const L = spec.wall.light;
  const tint = spec.wall.tint;
  const desat = spec.wall.desat ?? 0;
  const big = blurred[blurred.length - 1];
  const sm = SKY(0.75);
  const smY = 0.2126 * sm[0] + 0.7152 * sm[1] + 0.0722 * sm[2];
  const plaster = plane(W, H);
  const ca = Math.cos(0.38);
  const sa = Math.sin(0.38);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const X = x / S;
      const Y = y / S;
      // limewash: broad clouds, softer trowel strokes laid at an angle, a little tooth
      const u = X * ca + Y * sa;
      const v = -X * sa + Y * ca;
      const n =
        0.42 * noise(X / 300, Y / 300) + 0.3 * noise(X / 85 + 11.3, Y / 85 + 4.1) + 0.26 * noise2(u / 150 + 3.7, v / 34 + 8.9) + 0.12 * noise2(X / 20 + 1.3, Y / 20 + 5.5);
      plaster[y * W + x] = 1 + spec.wall.texture * n;
    }
  for (let y = 0; y < H; y++) {
    // the floor bounces a little light onto the bottom of the wall, in front of the opening
    const nearFloor = hasFloor ? Math.exp(-Math.max(0, floorY - y) / (spec.wall.bounceH * S)) : 0;
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const d = poly.dist(x + 0.5, y + 0.5) / S;
      const outside = Math.max(0, ox - x, x - (ox + ow)) / S;
      const bounce = 1 + spec.wall.bounce * nearFloor * Math.exp(-outside / (spec.wall.bounceW ?? 200));
      // lit from below (the floor bounces the sky), darker toward the ceiling
      const vert = hasFloor ? lerp(L.top ?? 0.45, 1, smooth(-0.2 * floorY, floorY, y)) : 1;
      const e = vert * (L.edge * Math.exp(-d / L.edgeR) + L.a / (1 + (d / L.r) ** 2));
      const by = 0.2126 * big.c[0][i] + 0.7152 * big.c[1][i] + 0.0722 * big.c[2][i];
      for (let c = 0; c < 3; c++) {
        const hue = by > 1e-5 ? big.c[c][i] / by : sm[c] / smY;
        const col = lerp(hue, 1, desat) * tint[c];
        wall.c[c][i] = plaster[i] * (amb[c] + e * col * bounce);
      }
    }
  }

  /* 5 · the lattice continuing on the wall as 1px dots, lit by the same light */
  if (spec.dots) {
    const [dsig, dk] = markSigma(spec.dots.r * S);
    const R = dsig * 3;
    for (let j = -64; j < 128; j++)
      for (let i = -64; i < 128; i++) {
        const x = ox + i * step;
        const y = oy + j * step;
        if (x < -2 || y < -2 || x >= W + 2 || y >= floorY - 3 * S) continue;
        if (poly.sd(x, y) < spec.dots.clear * S) continue;
        const xi = Math.min(W - 1, Math.max(0, Math.round(x)));
        const yi = Math.min(H - 1, Math.max(0, Math.round(y)));
        const ii = yi * W + xi;
        const lum = 0.2126 * wall.c[0][ii] + 0.7152 * wall.c[1][ii] + 0.0722 * wall.c[2][ii];
        // only where the wall is lit: the grid fades out of the light
        const lit = smooth(spec.dots.from, spec.dots.to, lum);
        if (lit <= 0) continue;
        const g = spec.dots.gain * lit * dk;
        for (let yy = Math.floor(y - R); yy <= Math.ceil(y + R); yy++)
          for (let xx = Math.floor(x - R); xx <= Math.ceil(x + R); xx++) {
            if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
            const dx = xx + 0.5 - x;
            const dy = yy + 0.5 - y;
            const a = Math.exp(-(dx * dx + dy * dy) / (2 * dsig * dsig));
            if (a < 1e-3) continue;
            const q = yy * W + xx;
            for (let c = 0; c < 3; c++) wall.c[c][q] += wall.c[c][q] * g * a;
          }
      }
  }

  /* 6 · the surface above the floor: sky through the opening, wall around it */
  const scene = img(W, H);
  for (let i = 0; i < W * H; i++) {
    const k = C[i];
    for (let c = 0; c < 3; c++) scene.c[c][i] = k * sky.c[c][i] + (1 - k) * wall.c[c][i];
  }
  // a hairline of contact shadow where the wall meets the floor
  if (hasFloor) {
    for (let y = Math.max(0, Math.floor(floorY - 6 * S)); y < floorY && y < H; y++) {
      const a = 1 - 0.35 * smooth(floorY - 6 * S, floorY, y);
      for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) scene.c[c][y * W + x] *= a;
    }
  }

  /* 7 · the polished floor: a mirror that blurs with distance, and a pool of light */
  if (hasFloor && floorY < H) {
    const fy = Math.floor(floorY);
    const Hf = H - fy;
    const pad = Math.ceil(spec.floorSpec.maxSigma * S * 2.2);
    const Hm = Hf + pad;
    const M = img(W, Hm);
    for (let y = 0; y < Hm; y++) {
      const src = Math.max(0, 2 * fy - 1 - (fy + y));
      for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) M.c[c][y * W + x] = scene.c[c][src * W + x];
    }
    const levels = spec.floorSpec.levels.map((s) => s * S);
    const ratio = spec.floorSpec.xRatio;
    const stack = levels.map((s) => (s === 0 ? M : gauss(M, s * ratio + 0.4 * S, s)));
    const cy = spec.camera.horizon * H;
    const f = spec.camera.focal * W;
    const hc = (floorY - cy) / f; // camera height / wall distance
    const cxp = spec.camera.cx * W;
    const R0 = 0.04;
    const pool = spec.floorSpec.pool;
    const poolCol = SKY(0.86);
    const noiseF = perlin(spec.seed * 31 + 9);
    for (let y = 0; y < Hf; y++) {
      const Y = fy + y;
      const dist = y / S; // design px below the floor line
      const sig = Math.min(spec.floorSpec.maxSigma, spec.floorSpec.k * dist + spec.floorSpec.b) * S;
      let li = 0;
      while (li < levels.length - 2 && sig > levels[li + 1]) li++;
      const u = clamp((sig - levels[li]) / (levels[li + 1] - levels[li]));
      // depth of this floor row, as a fraction of the wall's distance
      const zr = (floorY - cy) / Math.max(1e-3, Y + 0.5 - cy);
      const tanT = hc / zr;
      const sinT = tanT / Math.sqrt(1 + tanT * tanT);
      const fres = (R0 + (1 - R0) * (1 - sinT) ** 5) * spec.floorSpec.gloss;
      const s = 1 - zr; // distance from the wall, in wall distances
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        // where on the wall line this floor point sits
        const Xw = cxp + (x + 0.5 - cxp) * zr;
        const spread = (pool.spread * s * W) / 1;
        const lat = smooth(ox - spread, ox + spread * 0.6 + 1, Xw) * (1 - smooth(ox + ow - spread * 0.6 - 1, ox + ow + spread, Xw));
        const along = smooth(0, pool.rise, s) * Math.exp(-s / pool.reach);
        const mott = 1 + spec.floorSpec.mottle * noiseF((x / S) / 160, (Y / S) / 40);
        const o = Y * W + x;
        for (let c = 0; c < 3; c++) {
          const refl = lerp(stack[li].c[c][i], stack[li + 1].c[c][i], u);
          const diffuse = pool.amp * lat * along * poolCol[c] + amb[c] * 0.6;
          scene.c[c][o] = fres * mott * refl + spec.floorSpec.albedo * diffuse;
        }
      }
    }
  }

  /* 7b · the floor's gloss lobe: the reflection spreads sideways and toward
     the viewer, so the floor carries a sheen well past it */
  if (hasFloor && floorY < H && spec.floorSpec.sheen) {
    const sh = spec.floorSpec.sheen;
    const fy = Math.floor(floorY);
    const refl = img(W, H);
    for (let y = fy; y < H; y++) for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) refl.c[c][y * W + x] = scene.c[c][y * W + x];
    const g = gauss(refl, sh.sx * S, sh.sy * S);
    for (let y = fy; y < H; y++) {
      const a = sh.w * smooth(0, 6 * S, y - fy);
      for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) scene.c[c][y * W + x] += a * g.c[c][y * W + x];
    }
  }

  /* 8 · haze and lens glare over everything */
  const hw = spec.haze.weights;
  for (let i = 0; i < W * H; i++)
    for (let c = 0; c < 3; c++) {
      let v = 0;
      for (let k = 0; k < hw.length; k++) v += hw[k] * blurred[k].c[c][i];
      scene.c[c][i] += v;
    }
  // the reflection glows a little too
  if (hasFloor && spec.haze.floor) {
    const refl = img(W, H);
    for (let y = Math.floor(floorY); y < H; y++)
      for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) refl.c[c][y * W + x] = scene.c[c][y * W + x];
    const g = gauss(refl, spec.haze.floor.r * S);
    for (let i = 0; i < W * H; i++) for (let c = 0; c < 3; c++) scene.c[c][i] += spec.haze.floor.w * g.c[c][i];
  }

  /* 9 · motes in the light: a few sharp points, a few soft discs */
  const veilAt = (x, y) => {
    const xi = Math.min(W - 1, Math.max(0, Math.round(x)));
    const yi = Math.min(H - 1, Math.max(0, Math.round(y)));
    const b = blurred[blurred.length - 2];
    return 0.2126 * b.c[0][yi * W + xi] + 0.7152 * b.c[1][yi * W + xi] + 0.0722 * b.c[2][yi * W + xi];
  };
  const moteCol = [0.86, 0.92, 1.0];
  for (const [n, m] of (spec.motes ?? []).entries()) {
    const x = (m.x * S) | 0;
    const y = (m.y * S) | 0;
    const light = Math.min(1, veilAt(x, y) / (spec.moteLight ?? 0.02));
    if (m.r) bokeh(scene, m.x * S, m.y * S, m.r * S, m.a * (0.35 + 0.65 * light), moteCol, m.r * (m.soft ?? 0.3) * S, spec.seed + n);
    else {
      const [sig, k] = markSigma((m.s ?? 0.55) * S);
      dab(scene, m.x * S, m.y * S, sig, m.a * (0.3 + 0.7 * light) * k, moteCol);
    }
  }

  /* 10 · vignette, then the dissolve into night */
  const V = spec.vignette ?? 0.2;
  const [vcx, vcy] = spec.vignetteCenter ?? [0.62, 0.42];
  // edgeFade { left, right, top }: fractions of the frame over which it dies to exactly night
  const ef = spec.edgeFade ?? {};
  const edge = (a, t) => (a > 0 ? smooth(0, a, t) : 1);
  const night = new Uint8Array(W * H); // exactly night: no dither there
  for (let y = 0; y < H; y++) {
    const fadeB = spec.fade ? smooth(spec.fade[0], spec.fade[1], y / H) : 0;
    const keepY = (1 - fadeB) * edge(ef.top ?? 0, y / H);
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const dx = x / W - vcx;
      const dy = (y / H - vcy) * (H / W);
      const vig = 1 - V * smooth(0, 0.55, Math.hypot(dx, dy) * 1.1);
      const keep = keepY * edge(ef.left ?? 0, x / W) * edge(ef.right ?? 0, 1 - x / W);
      if (keep <= 0) night[i] = 1;
      for (let c = 0; c < 3; c++) scene.c[c][i] = lerp(NIGHT[c], scene.c[c][i] * vig, keep);
    }
  }

  /* 11 · filmic shoulder, sRGB, 1-LSB triangular dither, 8 bit */
  const out = new Uint8Array(W * H * 3);
  const shoulder = spec.shoulder ?? 0.78;
  const tone = (v) => (v <= shoulder ? v : shoulder + (1 - shoulder) * (1 - Math.exp(-(v - shoulder) / (1 - shoulder))));
  const drnd = mulberry32(spec.seed * 101 + 3);
  for (let i = 0; i < W * H; i++)
    for (let c = 0; c < 3; c++) {
      const v = toSrgb(clamp(tone(Math.max(0, scene.c[c][i])))) * 255;
      const d = drnd() - drnd();
      out[i * 3 + c] = night[i] ? Math.round(v) : clamp(Math.round(v + d), 0, 255);
    }

  console.log(`  ${spec.name}: ${W}×${H}, ${stars} stars, ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return { W, H, data: out, poly, floorY };
}

/* ─── variants ───────────────────────────────────────────────────────────── */

const BASE = {
  seed: 1729,
  lattice: 2,
  skyLateral: 0.06,
  // most stars faint, a few bright, and enough sites lit that rows and
  // columns can be followed for a few steps before the sky outshines them
  stars: { p: 0.55, amp: 0.45, floor: 0.06, gamma: 3.4, fadeFrom: 0.3, fadeTo: 0.68 },
  haze: { radii: [2.5, 9, 28, 80, 220, 520], weights: [0.026, 0.018, 0.014, 0.01, 0.005, 0], floor: { r: 26, w: 0.05 } },
  wall: {
    ambient: [0.0029, 0.0037, 0.006],
    // design px: an edge term, then a Lorentzian tail of half-width r
    light: { edge: 0.03, edgeR: 45, a: 0.04, r: 360, top: 0.45 },
    tint: [0.9, 0.95, 1.0],
    desat: 0.6,
    texture: 0.22,
    bounce: 0.35,
    bounceH: 60,
    bounceW: 220,
  },
  // the lattice on the wall: only inside the lit zone (wall luminance 2–5%)
  dots: { r: 0.5, gain: 0.55, clear: 6, from: 0.02, to: 0.05 },
  floorSpec: {
    levels: [0, 1, 2.5, 5, 10, 18, 32, 55],
    maxSigma: 55,
    k: 0.11,
    b: 0.25,
    xRatio: 0.28,
    gloss: 0.7,
    albedo: 0.05,
    mottle: 0.12,
    pool: { amp: 0.32, spread: 0.08, rise: 0.04, reach: 0.22 },
    sheen: { sx: 150, sy: 28, w: 0.3 },
  },
  camera: { horizon: 0.5, focal: 0.95, cx: 0.5 },
  vignette: 0.18,
  shoulder: 0.8,
};

const merge = (a, b) => {
  const o = { ...a };
  for (const [k, v] of Object.entries(b)) o[k] = v && typeof v === "object" && !Array.isArray(v) && a[k] && typeof a[k] === "object" ? merge(a[k], v) : v;
  return o;
};

/** Seeded motes in a box (design px): `points` sharp specks, `discs` soft ones. */
function motesIn(seed, [x0, y0, x1, y1], points, discs, scale = 1) {
  const r = mulberry32(seed);
  const out = [];
  for (let i = 0; i < points; i++) out.push({ x: lerp(x0, x1, r()), y: lerp(y0, y1, r()), a: 0.025 + 0.045 * r(), s: 0.45 + 0.1 * r() });
  for (let i = 0; i < discs; i++) out.push({ x: lerp(x0, x1, r()), y: lerp(y0, y1, r()), r: (6 + 14 * r()) * scale, a: 0.0035 + 0.003 * r(), soft: 0.28 + 0.1 * r() });
  return out;
}

// AVIF at q90+ keeps the one-step dither that stops banding; lower, the
// encoder smooths it away and the dark gradients step. 4:4:4 keeps the blue
// edge clean. Each width is a few tens of KB, far inside the budget.
const AVIF = { quality: 92, effort: 6 };
const WEBP = { quality: 90, effort: 6 };

/* Served widths are chosen so the browser never scales a file by much
   (ratio ≥ ~0.8) for the boxes the layouts draw; ApertureArt's `sizes`
   describe the same boxes. Every width is rendered natively. */
const VARIANTS = {
  /* The hero, landscape: 2300 × 900 design px. From 1024px the frame is the
     hero's height (capped at 62.5vw), and its opening's left edge is pinned
     0.68em past "accounted for."; the frame runs wide on both sides so it
     covers the screen at any width up to ~2560, and its far edges die into
     night. Shown at 2300 CSS px on a 1440 × 900 screen. 640–1023: a 4:3 box
     under the copy, opening centred. */
  hero: {
    spec: merge(BASE, {
      name: "hero",
      size: [2300, 900],
      opening: { x: 1300, w: 531 },
      floor: 640,
      sill: 14,
      motes: motesIn(97, [1190, 190, 1560, 700], 11, 4),
      fade: [0.8, 0.995],
      // the far edges and the ceiling die into night: no seam where the
      // frame ends, nor where the 640–1023 box starts under the copy
      edgeFade: { left: 0.05, right: 0.05, top: 0.1 },
      vignetteCenter: [0.68, 0.42],
      camera: { horizon: 0.5, focal: 0.71, cx: 0.6 },
    }),
    widths: [4600, 3600, 2900, 2300, 1800, 1400],
  },

  /* The hero on a phone: the whole mark, under the copy, in a 430 × 640 box
     the width of the screen; the tools panel sits over the reflection. Its
     top edge dies into the night the copy sits on. */
  "hero-portrait": {
    spec: merge(BASE, {
      name: "hero-portrait",
      size: [430, 640],
      opening: { x: 92, w: 246 },
      floor: 326,
      sill: 6,
      haze: { radii: [2, 7, 22, 60, 160, 380] },
      wall: { light: { edge: 0.012, edgeR: 10, a: 0.042, r: 120 } },
      floorSpec: { sheen: { sx: 50, sy: 14, w: 0.3 } },
      motes: motesIn(41, [60, 70, 380, 330], 8, 2, 0.7),
      fade: [0.86, 0.995],
      edgeFade: { top: 0.12 },
      vignetteCenter: [0.5, 0.35],
      camera: { horizon: 0.45, focal: 1.6, cx: 0.5 },
    }),
    widths: [1290, 860, 480],
  },

  /* The close: the same room from further back, the opening small and
     centred low, a long reflection, dark above for a headline. The wall and
     the floor line die to exactly night at the left, right and top edges,
     so it needs no mask. Shown in a 4:3 box 640–1184 CSS px wide. */
  close: {
    spec: merge(BASE, {
      name: "close",
      size: [1440, 1080],
      opening: { x: 504, w: 432 },
      floor: 718,
      sill: 10,
      haze: { radii: [2, 7, 22, 64, 180, 440] },
      wall: { light: { edge: 0.012, edgeR: 22, a: 0.045, r: 330 } },
      floorSpec: { k: 0.09, sheen: { sx: 130, sy: 26, w: 0.3 } },
      motes: motesIn(53, [420, 260, 1020, 760], 10, 4),
      fade: [0.82, 0.996],
      edgeFade: { left: 0.2, right: 0.2, top: 0.22 },
      vignetteCenter: [0.5, 0.52],
      camera: { horizon: 0.52, focal: 1.0, cx: 0.5 },
    }),
    widths: [2400, 1920, 1440, 1200, 960, 720],
  },
  /* …and on a phone: a 1:2 box the width of the screen. */
  "close-portrait": {
    spec: merge(BASE, {
      name: "close-portrait",
      size: [430, 860],
      opening: { x: 95, w: 240 },
      floor: 550,
      sill: 6,
      haze: { radii: [2, 6, 18, 48, 130, 320] },
      wall: { light: { edge: 0.012, edgeR: 8, a: 0.042, r: 110 } },
      floorSpec: { k: 0.09, sheen: { sx: 45, sy: 14, w: 0.3 } },
      motes: motesIn(67, [60, 280, 380, 600], 7, 2, 0.7),
      fade: [0.82, 0.996],
      edgeFade: { left: 0.14, right: 0.14, top: 0.2 },
      vignetteCenter: [0.5, 0.55],
      camera: { horizon: 0.55, focal: 1.6, cx: 0.5 },
    }),
    widths: [1290, 860, 640, 400],
  },

  /* A corner for the dark Setup panel: only the chamfered corner of the
     opening, entering from the top right. From 1024px it covers the panel
     fitted by height (about 1700 CSS px wide); below that, 185% of the panel
     width, pinned top right. */
  corner: {
    spec: merge(BASE, {
      name: "corner",
      size: [1136, 640],
      opening: { x: 790, y: 44, w: 900 },
      floor: null,
      skyTop: 0,
      skyBottom: 0.78,
      skyLateral: 0,
      stars: { fadeFrom: 0.32, fadeTo: 0.62 },
      haze: { radii: [2.5, 9, 28, 80, 200, 460], weights: [0.022, 0.016, 0.012, 0.01, 0.005, 0] },
      wall: { bounce: 0, light: { edge: 0.012, edgeR: 20, a: 0.042, r: 240 } },
      motes: [...motesIn(79, [640, 140, 960, 600], 7, 0), { x: 742, y: 352, r: 9, a: 0.004, soft: 0.32 }],
      vignetteCenter: [0.82, 0.22],
      vignette: 0.28,
    }),
    widths: [3400, 2800, 2200, 1760, 1400],
  },
};

/* ─── encode ─────────────────────────────────────────────────────────────── */

async function main() {
  const args = process.argv.slice(2);
  const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
  const pngDir = opt("--png");
  // --preview <width>: render that one width to <png dir> only, no encode
  const preview = opt("--preview");
  const names = args.filter((a, i) => !a.startsWith("--") && !["--png", "--preview"].includes(args[i - 1]));
  const pick = names.length ? names : Object.keys(VARIANTS);
  const outDir = path.join(ROOT, "public/art");
  mkdirSync(outDir, { recursive: true });

  for (const name of pick) {
    const v = VARIANTS[name];
    if (!v) throw new Error(`unknown variant ${name}`);
    const widths = preview ? [Number(preview)] : [...v.widths].sort((a, b) => b - a);
    if (!preview) {
      // drop widths this variant no longer serves
      const re = new RegExp(`^aperture-${name}-(\\d+)\\.(avif|webp)$`);
      for (const f of readdirSync(outDir)) {
        const m = f.match(re);
        if (m && !widths.includes(Number(m[1]))) unlinkSync(path.join(outDir, f));
      }
    }
    for (const [n, w] of widths.entries()) {
      const r = render({ ...v.spec, scale: w / v.spec.size[0] });
      const raw = { raw: { width: r.W, height: r.H, channels: 3 } };
      if (pngDir && n === 0) {
        mkdirSync(pngDir, { recursive: true });
        await sharp(r.data, raw).png({ compressionLevel: 6 }).toFile(path.join(pngDir, `aperture-${name}${preview ? `-${w}` : ""}.png`));
      }
      if (preview) continue;
      const a = path.join(outDir, `aperture-${name}-${w}.avif`);
      const b = path.join(outDir, `aperture-${name}-${w}.webp`);
      await sharp(r.data, raw).avif({ chromaSubsampling: "4:4:4", ...AVIF }).toFile(a);
      await sharp(r.data, raw).webp({ smartSubsample: true, ...WEBP }).toFile(b);
      console.log(`    ${w}×${r.H}  avif ${(statSync(a).size / 1024).toFixed(1)} KB · webp ${(statSync(b).size / 1024).toFixed(1)} KB`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
