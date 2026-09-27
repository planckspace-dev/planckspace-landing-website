/* ─────────────────────────────────────────────────────────────────────────
   Token stream: the hero's WebGL2 scene.

   Every particle is a token. Its whole life is a closed-form function of time
   evaluated in the vertex shader, so nothing is simulated on the CPU and a
   frame costs one draw call per program:

     inflow   a tool-coloured current sweeps in from the top-left and funnels
              toward the mark's counter (the hollow in the Aperture mark),
     throat   it drops through the channel, the mark's only opening, turning
              lime as it is counted,
     outflow  it slides into one column of the ledger and is absorbed at the
              bar's cap.

   The ledger is a second program: a dot-matrix bar chart, one column per
   day, with unlit dots drawn faintly so it reads as an instrument panel.
   Both programs share colHeight(), so tokens land exactly on the bars.

   Coordinates are CSS pixels, y down, converted to clip space at the end.
   ───────────────────────────────────────────────────────────────────────── */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StreamLayout {
  width: number;
  height: number;
  /** Where the currents come from (off-canvas). */
  src: { x: number; y: number };
  /** Centre of the mark's counter: where tokens converge. */
  ap: { x: number; y: number };
  /** Bottom of the mark's channel: where counted tokens leave. */
  exit: { x: number; y: number };
  apSize: number;
  ledger: Rect;
  cols: number;
  /** Text block to keep quiet behind (particles dim inside it). */
  calm: Rect | null;
  /** Point size multiplier, smaller on small screens. */
  scale: number;
}

const LANE_COLORS: [number, number, number][] = [
  [0.851, 0.467, 0.341], // Claude Code  #D97757
  [0.361, 0.553, 1.0], //   Cursor       #5C8DFF (brand blue lifted for ink)
  [0.122, 0.78, 0.651], //  Windsurf     #1FC7A6
  [0.788, 0.78, 0.753], //  API          #C9C7C0
];
const LIME: [number, number, number] = [0.776, 1.0, 0.239];
const LANE_WEIGHTS = [0.44, 0.3, 0.1, 0.16];

const COMMON = /* glsl */ `
float hash(float n) { return fract(sin(n) * 43758.5453123); }

// Daily spend shape: an upward month with quiet weekends and some noise.
// Shared by both programs so tokens land on the bars they feed.
float colHeight(float c, float cols, float t) {
  float dow = mod(c + 3.0, 7.0);
  float weekend = step(5.0, dow);
  float trend = 0.52 + 0.4 * (c / max(cols - 1.0, 1.0));
  float noise = hash(c * 7.131 + 1.7) * 0.2 - 0.1;
  float h = trend * (1.0 - weekend * 0.5) + noise;
  h += 0.018 * sin(t * 0.8 + c * 1.3);
  return clamp(h, 0.1, 0.98);
}
`;

const PARTICLE_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec4 a_seed;
layout(location = 1) in float a_lane;

uniform vec2 u_res;
uniform float u_dpr;
uniform float u_time;
uniform float u_intro;
uniform float u_bars;
uniform vec2 u_src;
uniform vec2 u_ap;
uniform vec2 u_exit;
uniform float u_apSize;
uniform vec4 u_ledger;
uniform vec2 u_grid;
uniform vec2 u_mouse;
uniform float u_mouseAmt;
uniform vec4 u_calm;
uniform float u_scale;
uniform float u_funnel;
uniform float u_direct;
uniform float u_wobble;
uniform vec3 u_colors[4];
uniform vec3 u_lime;

out vec3 v_col;
out float v_alpha;

${COMMON}

float rectMask(vec2 p, vec4 r, float feather) {
  if (r.z <= 0.0) return 0.0;
  vec2 lo = r.xy;
  vec2 hi = r.xy + r.zw;
  vec2 d = max(lo - p, p - hi);
  float outside = max(d.x, d.y);
  return 1.0 - smoothstep(-feather, feather, outside);
}

void main() {
  float T = mix(8.0, 12.5, a_seed.x);
  float t = fract(u_time / T + a_seed.y);

  const float S_IN = 0.6;
  const float S_THROAT = 0.665;
  const float S_OUT = 0.8;

  int lane = int(a_lane + 0.5);
  vec3 col = u_colors[lane];
  vec2 d = normalize(u_ap - u_src);
  vec2 n = vec2(-d.y, d.x);
  float L = length(u_ap - u_src);
  float laneOff = a_lane - 1.5;

  // column this token belongs to, and the top of its bar
  float c = floor(a_seed.z * u_grid.x);
  float cw = u_ledger.z / u_grid.x;
  float h = colHeight(c, u_grid.x, u_time) * u_bars;
  vec2 target = vec2(u_ledger.x + (c + 0.5) * cw, u_ledger.y + u_ledger.w * (1.0 - h));

  vec2 pos;
  float alpha = 1.0;
  float size = 1.0;

  if (u_direct > 0.5) {
    // direct: each current flies straight into its column and is counted (lime) as it lands
    if (t < S_OUT) {
      float p = t / S_OUT;
      float s = p * p * (3.0 - 2.0 * p);
      float spread = a_seed.z - 0.5;
      vec2 S = u_src + n * (laneOff * L * 0.12 + spread * L * 0.1) - d * (a_seed.w * L * 0.12);
      vec2 C = mix(u_src, target, 0.55) + n * (laneOff * L * 0.09 + spread * L * 0.04);
      float is = 1.0 - s;
      pos = is * is * S + 2.0 * is * s * C + s * s * target;
      float falloff = pow(1.0 - p, 1.5);
      pos += n * sin(p * 8.5 - u_time * 1.05 + a_seed.w * 6.2831 + laneOff * 1.7) * L * 0.02 * falloff;
      vec2 dm = pos - u_mouse;
      float dist = length(dm);
      pos += (dm / max(dist, 1.0)) * u_mouseAmt * 78.0 * smoothstep(180.0, 0.0, dist) * (0.25 + falloff);
      alpha = smoothstep(0.0, 0.08, p) * (0.5 + 0.5 * p);
      col = mix(col, u_lime, smoothstep(0.72, 0.97, p));
    } else {
      float q = (t - S_OUT) / (1.0 - S_OUT);
      pos = target + vec2((a_seed.w - 0.5) * cw * 0.35, q * cw * 0.9);
      col = u_lime;
      alpha = 1.0 - smoothstep(0.0, 0.4, q);
      size = 1.0 - q * 0.4;
    }
  } else if (t < S_IN) {
    float p = t / S_IN;
    float s = pow(p, 1.3);
    float spread = a_seed.z - 0.5;
    vec2 S = u_src + n * (laneOff * L * 0.12 + spread * L * 0.1) - d * (a_seed.w * L * 0.12);
    vec2 C = mix(u_src, u_ap, 0.56) + n * (laneOff * L * 0.085 + spread * L * 0.045);
    vec2 A = u_ap + n * spread * u_apSize * 0.18;
    float is = 1.0 - s;
    pos = is * is * S + 2.0 * is * s * C + s * s * A;

    float falloff = pow(1.0 - p, 1.5);
    pos += n * sin(p * 8.5 - u_time * 1.05 + a_seed.w * 6.2831 + laneOff * 1.7) * L * 0.02 * falloff * u_wobble;
    pos += d * sin(p * 4.0 + u_time * 0.6 + a_seed.z * 6.2831) * L * 0.012 * falloff * u_wobble;

    vec2 dm = pos - u_mouse;
    float dist = length(dm);
    pos += (dm / max(dist, 1.0)) * u_mouseAmt * 78.0 * smoothstep(180.0, 0.0, dist) * (0.25 + falloff);

    alpha = smoothstep(0.0, 0.1, p) * (0.42 + 0.58 * p);
    col = mix(col, vec3(1.0), smoothstep(0.78, 1.0, p) * 0.4);
    size = 1.0 + 0.55 * smoothstep(0.82, 1.0, p);
  } else if (t < S_THROAT) {
    float q = (t - S_IN) / (S_THROAT - S_IN);
    pos = mix(u_ap, u_exit, q * q);
    pos.x += (a_seed.z - 0.5) * u_apSize * 0.12 * (1.0 - q);
    col = mix(mix(col, vec3(1.0), 0.4), u_lime, q);
    size = 1.3;
  } else if (t < S_OUT) {
    float q = (t - S_THROAT) / (S_OUT - S_THROAT);
    float e = 1.0 - pow(1.0 - q, 3.0);
    vec2 ctrl = vec2(u_exit.x + (target.x - u_exit.x) * 0.08, target.y + (u_exit.y - target.y) * 0.08);
    ctrl.y = max(ctrl.y, u_exit.y + 12.0);
    float ie = 1.0 - e;
    pos = ie * ie * u_exit + 2.0 * ie * e * ctrl + e * e * target;
    col = u_lime;
    size = 1.0;
  } else {
    float q = (t - S_OUT) / (1.0 - S_OUT);
    pos = target + vec2((a_seed.w - 0.5) * cw * 0.35, q * cw * 0.9);
    col = u_lime;
    alpha = 1.0 - smoothstep(0.0, 0.4, q);
    size = 1.0 - q * 0.4;
  }

  // no funnel: currents dissolve well short of the mark, nothing enters or leaves it
  if (u_funnel < 0.5 && u_direct < 0.5) {
    alpha *= t < S_IN ? 1.5 * (1.0 - smoothstep(0.66, 0.9, t / S_IN)) : 0.0;
  }

  alpha *= smoothstep(a_seed.y * 0.75, a_seed.y * 0.75 + 0.25, u_intro);
  alpha *= 1.0 - 0.8 * rectMask(pos, u_calm, 40.0);

  v_col = col;
  v_alpha = alpha;
  gl_PointSize = (1.15 + a_seed.w * 1.55) * size * u_scale * u_dpr;
  vec2 clip = (pos / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const PARTICLE_FS = /* glsl */ `#version 300 es
precision mediump float;
in vec3 v_col;
in float v_alpha;
out vec4 outColor;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.08, d) * v_alpha;
  outColor = vec4(v_col * a, a);
}
`;

const LEDGER_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_cell;   // column, row (row 0 = bottom)

uniform vec2 u_res;
uniform float u_dpr;
uniform float u_time;
uniform float u_bars;
uniform vec4 u_ledger;
uniform vec2 u_grid;
uniform vec3 u_lime;

out vec3 v_col;
out float v_alpha;

${COMMON}

void main() {
  float cw = u_ledger.z / u_grid.x;
  float rows = u_grid.y;
  float c = a_cell.x;
  float r = a_cell.y;
  float h = colHeight(c, u_grid.x, u_time) * u_bars;
  float lit = floor(h * rows + 0.5);
  bool on = r < lit;
  bool cap = r == lit - 1.0;
  bool today = c == u_grid.x - 1.0;

  float scan = mod(u_time * 5.0, u_grid.x + 14.0) - 7.0;
  float sweep = smoothstep(3.0, 0.0, abs(c - scan));

  float a;
  vec3 col = u_lime;
  if (on) {
    a = mix(0.3, 0.78, r / max(lit - 1.0, 1.0));
    if (cap) a = 1.0;
    a = min(1.0, a + sweep * 0.25);
    if (today) a *= 0.55 + 0.45 * (0.5 + 0.5 * sin(u_time * 3.2));
  } else {
    a = 0.07 + sweep * 0.05;
    col = vec3(0.97, 0.96, 0.94);
  }

  vec2 center = vec2(u_ledger.x + (c + 0.5) * cw, u_ledger.y + u_ledger.w - (r + 0.5) * cw);
  v_col = col;
  v_alpha = a;
  gl_PointSize = cw * 0.64 * u_dpr;
  vec2 clip = (center / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const LEDGER_FS = /* glsl */ `#version 300 es
precision mediump float;
in vec3 v_col;
in float v_alpha;
out vec4 outColor;
void main() {
  outColor = vec4(v_col * v_alpha, v_alpha);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`shader: ${log}`);
  }
  return s;
}

function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`link: ${gl.getProgramInfoLog(p)}`);
  return p;
}

/** Deterministic PRNG so the scene is identical on every load and in SSR'd posters. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class TokenStreamEngine {
  private gl: WebGL2RenderingContext;
  private pProg: WebGLProgram;
  private lProg: WebGLProgram;
  private pVao: WebGLVertexArrayObject;
  private lVao: WebGLVertexArrayObject | null = null;
  private lBuf: WebGLBuffer | null = null;
  private pBuf: WebGLBuffer | null = null;
  private lCount = 0;
  private count: number;
  private dpr = 1;
  private layout: StreamLayout | null = null;
  private pointer = { x: -9999, y: -9999, amt: 0, target: 0 };
  private pU: Record<string, WebGLUniformLocation | null> = {};
  private lU: Record<string, WebGLUniformLocation | null> = {};
  private gridRows = 0;
  /** Draw the token stream; off leaves only the ledger. */
  particles = true;
  /** Tokens converge into the mark and flow out to the ledger; off keeps the currents clear of it. */
  funnel = true;
  /** Tokens fly straight into the ledger, no mark in between. */
  direct = false;
  /** 0..1, how much the currents snake as they travel; low reads as falling, not swirling. */
  wobble = 1;

  constructor(private canvas: HTMLCanvasElement, count: number) {
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("webgl2 unavailable");
    // getContext hands back the canvas's existing context, lost or not
    if (gl.isContextLost()) throw new Error("webgl2 context lost");
    this.gl = gl;
    this.count = count;

    this.pProg = program(gl, PARTICLE_VS, PARTICLE_FS);
    this.lProg = program(gl, LEDGER_VS, LEDGER_FS);
    for (const n of [
      "u_res", "u_dpr", "u_time", "u_intro", "u_bars", "u_src", "u_ap", "u_exit", "u_apSize",
      "u_ledger", "u_grid", "u_mouse", "u_mouseAmt", "u_calm", "u_scale", "u_funnel", "u_direct", "u_wobble", "u_colors", "u_lime",
    ]) this.pU[n] = gl.getUniformLocation(this.pProg, n);
    for (const n of ["u_res", "u_dpr", "u_time", "u_bars", "u_ledger", "u_grid", "u_lime"])
      this.lU[n] = gl.getUniformLocation(this.lProg, n);

    // particle attributes: seed (vec4) + lane (float)
    const rand = mulberry32(20260927);
    const data = new Float32Array(count * 5);
    for (let i = 0; i < count; i++) {
      const r = rand();
      let lane = 0;
      let acc = LANE_WEIGHTS[0];
      while (r > acc && lane < LANE_WEIGHTS.length - 1) acc += LANE_WEIGHTS[++lane];
      data[i * 5 + 0] = rand();
      data[i * 5 + 1] = rand();
      data[i * 5 + 2] = rand();
      data[i * 5 + 3] = rand();
      data[i * 5 + 4] = lane;
    }
    this.pVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.pVao);
    this.pBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 20, 16);
    gl.bindVertexArray(null);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
  }

  resize(width: number, height: number, dpr: number) {
    this.dpr = dpr;
    const w = Math.max(1, Math.round(width * dpr));
    const h = Math.max(1, Math.round(height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
  }

  setLayout(layout: StreamLayout) {
    this.layout = layout;
    const cw = layout.ledger.w / layout.cols;
    const rows = Math.max(4, Math.floor(layout.ledger.h / cw));
    if (rows === this.gridRows && this.lVao) return;
    this.gridRows = rows;

    const gl = this.gl;
    const cells = new Float32Array(layout.cols * rows * 2);
    let k = 0;
    for (let c = 0; c < layout.cols; c++)
      for (let r = 0; r < rows; r++) {
        cells[k++] = c;
        cells[k++] = r;
      }
    this.lCount = layout.cols * rows;
    if (!this.lVao) this.lVao = gl.createVertexArray();
    gl.bindVertexArray(this.lVao);
    if (!this.lBuf) this.lBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lBuf);
    gl.bufferData(gl.ARRAY_BUFFER, cells, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
    gl.bindVertexArray(null);
  }

  setPointer(x: number, y: number, active: boolean) {
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.target = active ? 1 : 0;
  }

  /** How far the ledger has grown in, 0..1. Exposed so the DOM total can count up in step. */
  static barsAt(time: number) {
    const p = Math.min(1, Math.max(0, (time - 0.35) / 2.6));
    return 1 - Math.pow(1 - p, 4);
  }

  render(time: number, intro: number) {
    const l = this.layout;
    if (!l) return;
    const gl = this.gl;
    this.pointer.amt += (this.pointer.target - this.pointer.amt) * 0.06;
    const bars = TokenStreamEngine.barsAt(time);
    const cw = l.ledger.w / l.cols;
    // the dot grid is bottom-aligned inside the ledger box
    const gridH = this.gridRows * cw;
    const top = l.ledger.y + l.ledger.h - gridH;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ledger first (normal premultiplied blend), tokens over it (additive)
    if (this.lVao) {
      gl.useProgram(this.lProg);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform2f(this.lU.u_res, l.width, l.height);
      gl.uniform1f(this.lU.u_dpr, this.dpr);
      gl.uniform1f(this.lU.u_time, time);
      gl.uniform1f(this.lU.u_bars, bars);
      gl.uniform4f(this.lU.u_ledger, l.ledger.x, top, l.ledger.w, gridH);
      gl.uniform2f(this.lU.u_grid, l.cols, this.gridRows);
      gl.uniform3f(this.lU.u_lime, LIME[0], LIME[1], LIME[2]);
      gl.bindVertexArray(this.lVao);
      gl.drawArrays(gl.POINTS, 0, this.lCount);
    }

    // the ledger can stand alone (the hero draws no token stream)
    if (!this.particles) return;

    gl.useProgram(this.pProg);
    gl.blendFunc(gl.ONE, gl.ONE);
    const u = this.pU;
    gl.uniform2f(u.u_res, l.width, l.height);
    gl.uniform1f(u.u_dpr, this.dpr);
    gl.uniform1f(u.u_time, time);
    gl.uniform1f(u.u_intro, intro);
    gl.uniform1f(u.u_bars, bars);
    gl.uniform2f(u.u_src, l.src.x, l.src.y);
    gl.uniform2f(u.u_ap, l.ap.x, l.ap.y);
    gl.uniform2f(u.u_exit, l.exit.x, l.exit.y);
    gl.uniform1f(u.u_apSize, l.apSize);
    gl.uniform4f(u.u_ledger, l.ledger.x, top, l.ledger.w, gridH);
    gl.uniform2f(u.u_grid, l.cols, this.gridRows);
    gl.uniform2f(u.u_mouse, this.pointer.x, this.pointer.y);
    gl.uniform1f(u.u_mouseAmt, this.pointer.amt);
    const c = l.calm;
    gl.uniform4f(u.u_calm, c ? c.x : 0, c ? c.y : 0, c ? c.w : 0, c ? c.h : 0);
    gl.uniform1f(u.u_scale, l.scale);
    gl.uniform1f(u.u_funnel, this.funnel ? 1 : 0);
    gl.uniform1f(u.u_direct, this.direct ? 1 : 0);
    gl.uniform1f(u.u_wobble, this.wobble);
    gl.uniform3fv(u.u_colors, LANE_COLORS.flat());
    gl.uniform3f(u.u_lime, LIME[0], LIME[1], LIME[2]);
    gl.bindVertexArray(this.pVao);
    gl.drawArrays(gl.POINTS, 0, this.count);
    gl.bindVertexArray(null);
  }

  /* Frees what this engine created and leaves the context alive. Forcing
     WEBGL_lose_context here looked tidy but broke remounts: an effect that
     runs again on the same <canvas> (Strict Mode in development, route
     transitions) gets the very context that was killed, and a lost context
     paints the canvas white. */
  destroy() {
    const gl = this.gl;
    if (gl.isContextLost()) return;
    gl.deleteProgram(this.pProg);
    gl.deleteProgram(this.lProg);
    gl.deleteVertexArray(this.pVao);
    if (this.lVao) gl.deleteVertexArray(this.lVao);
    if (this.pBuf) gl.deleteBuffer(this.pBuf);
    if (this.lBuf) gl.deleteBuffer(this.lBuf);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}
