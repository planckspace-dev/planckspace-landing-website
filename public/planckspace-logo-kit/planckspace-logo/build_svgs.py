#!/usr/bin/env python3
"""Generate every Planckspace logo SVG variant from one shared mark definition.
Master mark = "the peek": faded-violet rounded tile, white astronaut helmet,
violet visor band with a white // glint, antenna dot, two hands gripping a faint ledge.
"""
import os

SVG = "/home/claude/planckspace-logo/svg"

# ---- shared gradient + the mark drawn inside a 0..100 tile ----
def grad(id_="vg"):
    return (f'<linearGradient id="{id_}" x1="0" y1="0" x2="1" y2="1">'
            f'<stop offset="0" stop-color="#7463F0"/>'
            f'<stop offset="1" stop-color="#5847E5"/></linearGradient>')

def clip(id_="cp"):
    return f'<clipPath id="{id_}"><rect width="100" height="100" rx="24"/></clipPath>'

# Full mark: helmet + visor // + antenna + hands + faint ledge. detail="full"|"mid"|"min"
def mark(tile_fill, helmet="#FFFFFF", visor="#5847E5", glint="#FFFFFF",
         antenna="#FFFFFF", hands="#FFFFFF", ledge_opacity=0.14, detail="full",
         tile_stroke=None):
    stroke = f' stroke="{tile_stroke}" stroke-width="1"' if tile_stroke else ""
    parts = [f'<rect width="100" height="100" rx="24" fill="{tile_fill}"{stroke}/>']
    parts.append('<g clip-path="url(#cp)">')
    parts.append(f'<circle cx="50" cy="45" r="24" fill="{helmet}"/>')
    if detail in ("full", "mid") and ledge_opacity > 0:
        parts.append(f'<rect y="64" width="100" height="36" fill="{helmet}" opacity="{ledge_opacity}"/>')
    if detail == "full":
        parts.append(f'<rect x="29" y="60" width="11" height="9" rx="4.5" fill="{hands}"/>')
        parts.append(f'<rect x="60" y="60" width="11" height="9" rx="4.5" fill="{hands}"/>')
    parts.append('</g>')
    # visor band
    parts.append(f'<rect x="31" y="38" width="38" height="16" rx="8" fill="{visor}"/>')
    # // glint
    sw = 3.0 if detail == "full" else (4.0 if detail == "mid" else 4.2)
    if detail != "min":
        parts.append(f'<line x1="45" y1="50.5" x2="49" y2="41.5" stroke="{glint}" stroke-width="{sw}" stroke-linecap="round"/>')
        parts.append(f'<line x1="52" y1="50.5" x2="56" y2="41.5" stroke="{glint}" stroke-width="{sw}" stroke-linecap="round"/>')
    # antenna
    if detail == "full":
        parts.append(f'<line x1="50" y1="21" x2="50" y2="14" stroke="{antenna}" stroke-width="2.4" stroke-linecap="round"/>')
        parts.append(f'<circle cx="50" cy="11" r="3.2" fill="{antenna}"/>')
    return "".join(parts)

def tile_svg(filename, inner_defs, body, size_attr=True):
    sz = ' width="512" height="512"' if size_attr else ""
    svg = (f'<svg{sz} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" '
           f'role="img" aria-label="Planckspace">'
           f'<defs>{inner_defs}</defs>{body}</svg>')
    with open(os.path.join(SVG, filename), "w") as f:
        f.write(svg)
    return filename

built = []

# 1. MASTER — full detail, gradient violet, white astronaut
built.append(tile_svg("planckspace-mark-master.svg",
    grad() + clip(),
    mark("url(#vg)", detail="full")))

# 2. APP ICON — same as master (rounded tile is the app icon shape)
built.append(tile_svg("planckspace-app-icon.svg",
    grad() + clip(),
    mark("url(#vg)", detail="full")))

# 3. FAVICON — simplified (mid: drops hands + antenna, keeps helmet + visor //)
built.append(tile_svg("planckspace-favicon.svg",
    grad() + clip(),
    mark("url(#vg)", detail="mid", ledge_opacity=0)))

# 4. FLAT — single solid violet, no gradient (for places gradients don't render)
built.append(tile_svg("planckspace-mark-flat.svg",
    clip(),
    mark("#5847E5", visor="#3A2D9E", detail="full")))

# 5. MONO WHITE — all white on transparent (for dark bgs / loading state).
#    tile transparent, everything white, visor = a subtle outline so // reads.
def mono(color, tile="none", tile_stroke=None):
    stroke = f' stroke="{tile_stroke}" stroke-width="1.5"' if tile_stroke else ""
    parts = [f'<rect width="100" height="100" rx="24" fill="{tile}"{stroke}/>']
    parts.append('<g clip-path="url(#cp)">')
    parts.append(f'<circle cx="50" cy="45" r="24" fill="none" stroke="{color}" stroke-width="3"/>')
    parts.append(f'<rect x="29" y="60" width="11" height="9" rx="4.5" fill="{color}"/>')
    parts.append(f'<rect x="60" y="60" width="11" height="9" rx="4.5" fill="{color}"/>')
    parts.append('</g>')
    parts.append(f'<rect x="31" y="38" width="38" height="16" rx="8" fill="{color}"/>')
    # glint cut as the tile-colored slashes would need a bg; instead draw slashes in tile color if tile given, else use a contrasting trick:
    # For mono we draw the // by leaving the visor solid and cutting slashes via the negative — simpler: draw slashes in the tile color only when tile!=none.
    slash_color = tile if tile != "none" else "#5847E5"
    parts.append(f'<line x1="45" y1="50.5" x2="49" y2="41.5" stroke="{slash_color}" stroke-width="3" stroke-linecap="round"/>')
    parts.append(f'<line x1="52" y1="50.5" x2="56" y2="41.5" stroke="{slash_color}" stroke-width="3" stroke-linecap="round"/>')
    parts.append(f'<line x1="50" y1="21" x2="50" y2="14" stroke="{color}" stroke-width="2.4" stroke-linecap="round"/>')
    parts.append(f'<circle cx="50" cy="11" r="3.2" fill="{color}"/>')
    return "".join(parts)

# mono white: white strokes, the // shows as ink-violet because we put a solid visor.
# Cleaner mono: solid white helmet shape so // reads as violet negative — use the flat approach with white tile.
built.append(tile_svg("planckspace-mark-mono-white.svg",
    clip(),
    mark("none", helmet="#FFFFFF", visor="#FFFFFF", glint="#11131A",
         antenna="#FFFFFF", hands="#FFFFFF", ledge_opacity=0.0, detail="full")))

# 6. MONO INK — all ink (#11131A) for light bgs / single-color print
built.append(tile_svg("planckspace-mark-mono-ink.svg",
    clip(),
    mark("none", helmet="#11131A", visor="#11131A", glint="#FFFFFF",
         antenna="#11131A", hands="#11131A", ledge_opacity=0.0, detail="full")))

# 7. INK TILE variant (dark tile, white astronaut, violet visor) — for white pages where the violet tile feels too loud
built.append(tile_svg("planckspace-mark-ink-tile.svg",
    clip(),
    mark("#11131A", detail="full")))

# 8. LOADING / THINKING glyph — just helmet + // (E-style, no tile), violet on transparent
loading = ('<circle cx="50" cy="50" r="31" fill="#5847E5"/>'
           '<line x1="42" y1="56" x2="47" y2="43" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>'
           '<line x1="53" y1="56" x2="58" y2="43" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>')
built.append(tile_svg("planckspace-glyph-loading.svg", "", loading))

print("SVGs built:")
for b in built:
    print("  " + b)
