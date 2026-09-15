#!/usr/bin/env python3
"""
Generates a placeholder SVG "symbol" icon per deity: a circular emblem with
the deity's initials, tinted by alignment, with a decorative ring.

Run after tools/parse.py (it reads data/deities.json).

Usage:
    python3 tools/gen_icons.py

Replace any generated SVG in assets/icons/<slug>.svg with real artwork at
any time -- the site does not regenerate icons it already finds on disk
unless you delete them first and rerun this script.
"""
import os
import json
import re

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(HERE, "..", "data", "deities.json")
OUT_DIR = os.path.join(HERE, "..", "assets", "icons")

ALIGNMENT_COLORS = {
    "Lawful Good":      ("#d4af37", "#8a6d1a"),
    "Neutral Good":     ("#5b9a68", "#2f5c38"),
    "Chaotic Good":     ("#4f8fb0", "#25516a"),
    "Lawful Neutral":   ("#8b8b8b", "#4a4a4a"),
    "True Neutral": ("#9c8a6a", "#5c4f39"),
    "Chaotic Neutral":  ("#a9743d", "#6b471f"),
    "Lawful Evil":      ("#7a2b3a", "#3d1219"),
    "Neutral Evil":     ("#5a3a6b", "#2c1a35"),
    "Chaotic Evil":     ("#8c2f1e", "#451208"),
}
DEFAULT_COLORS = ("#7a6a52", "#3d3527")


def initials(name):
    first = name.split(",")[0]
    words = re.findall(r"[A-Za-z]+", first)
    stop = {"the", "of", "one-eye", "one", "eye"}
    sig = [w for w in words if w.lower() not in stop]
    if not sig:
        sig = words
    if len(sig) == 1:
        return sig[0][:2].upper()
    return (sig[0][0] + sig[1][0]).upper()


def make_svg(name, alignment, slug):
    primary, secondary = ALIGNMENT_COLORS.get(alignment, DEFAULT_COLORS)
    init = initials(name)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="{name} symbol">
  <defs>
    <radialGradient id="bg-{slug}" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="{primary}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="{secondary}" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="ring-{slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f3e6c8"/>
      <stop offset="100%" stop-color="{primary}"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="94" fill="url(#bg-{slug})" stroke="url(#ring-{slug})" stroke-width="5"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#f3e6c8" stroke-opacity="0.35" stroke-width="1.5"/>
  <circle cx="100" cy="100" r="72" fill="none" stroke="#f3e6c8" stroke-opacity="0.2" stroke-width="1"/>
  <text x="100" y="118" text-anchor="middle" font-family="'Cinzel', 'Georgia', serif" font-size="58" font-weight="700" fill="#f6ecd6" stroke="{secondary}" stroke-width="1.5" paint-order="stroke">{init}</text>
</svg>'''


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    data = json.load(open(DATA_PATH, encoding="utf-8"))
    count = 0
    skipped = 0

    # Flatten: each top-level deity contributes one icon slot, but a
    # multi-aspect deity (e.g. Seha-Angharradh) contributes one per aspect
    # instead, since each aspect can have its own distinct symbol.
    icon_targets = []
    for d in data:
        if d.get("multi_aspect") and d.get("aspects"):
            for a in d["aspects"]:
                if a["aspect_slug"] == d.get("default_aspect"):
                    # The combined/default aspect intentionally shares the
                    # parent record's own symbol (see icon_slug handling in
                    # the frontend) rather than getting its own generated
                    # placeholder -- skip it here so gen_icons.py doesn't
                    # keep recreating an unused file every run.
                    continue
                icon_targets.append({
                    "slug": a["aspect_slug"],
                    "name": a["name"],
                    "alignment": a["alignment"] or d["alignment"],
                })
        else:
            icon_targets.append({"slug": d["slug"], "name": d["name"], "alignment": d["alignment"]})

    for t in icon_targets:
        has_real_art = any(
            os.path.exists(os.path.join(OUT_DIR, f"{t['slug']}.{ext}"))
            for ext in ("webp", "png", "jpg", "jpeg")
        )
        if has_real_art:
            skipped += 1
            continue
        out_path = os.path.join(OUT_DIR, f"{t['slug']}.svg")
        svg = make_svg(t["name"], t["alignment"], t["slug"])
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(svg)
        count += 1
    print(f"Generated {count} icons in {OUT_DIR} ({skipped} skipped, already have real artwork)")


if __name__ == "__main__":
    main()
