/**
 * Derives the bento-tile crops from the raw dashboard screenshots.
 * The raw shots are full-page captures; the bento tiles render small, so each
 * tile gets a tight crop of just the panel it is selling.
 *
 * Both directories live outside public/ on purpose. Anything under public/ is
 * web-served whether or not a page links to it, and several raw captures carry
 * personal email addresses. Components pull these in as static imports, so only
 * the images actually referenced are ever bundled and shipped.
 *
 * Re-run after replacing any source shot:
 *   node scripts/crop-product-shots.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SRC = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets",
  "product-shots",
);
const OUT = path.join(SRC, "derived");

/**
 * `tile-session` deliberately starts right of the DEVELOPER column so the
 * capture's real usernames never reach the public site.
 */
/**
 * Crop width should land near 2× the tile's rendered CSS width — that maps 1:1
 * on a 2×-DPR display. Past ~3× the small labels go soft, which is why the
 * narrow (col-4) tiles get tight single-panel crops rather than full rows.
 */
const CROPS = [
  // tile             source                      left   top  width height
  ["tile-overview", "02-overview-panel.png", 390, 140, 1450, 600],
  ["tile-waste", "03-waste.png", 390, 440, 1460, 420],
  ["tile-budget", "05-budget.png", 632, 490, 960, 370],
  ["tile-teams", "team-model-overview.png", 75, 368, 950, 462],
  ["tile-session", "07-session.png", 740, 370, 1100, 440],
  ["tile-export", "08-export.png", 400, 270, 480, 330],
];

for (const [name, src, left, top, width, height] of CROPS) {
  await sharp(path.join(SRC, src))
    .extract({ left, top, width, height })
    .toFile(path.join(OUT, `${name}.png`));
  console.log(`${name}.png  <- ${src}  ${width}x${height}`);
}
