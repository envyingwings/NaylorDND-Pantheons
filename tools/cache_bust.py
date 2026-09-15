#!/usr/bin/env python3
"""
Cache-busting for the Ourosi Pantheon site.

Computes a short content hash for each versioned asset (CSS, JS, and the
deities.json data file) and rewrites references to it as `path?v=<hash>` in
the HTML files and in app.js's DATA_URL. Run this after any change to those
files -- including after tools/parse.py regenerates deities.json -- so
browsers always fetch the latest version instead of a stale cached copy.

Usage: python3 tools/cache_bust.py
"""
import hashlib
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")

# Files whose content determines the version hash, keyed by the path used
# in href/src attributes (relative to the site root).
VERSIONED_FILES = [
    "assets/style.css",
    "assets/admin.css",
    "assets/app.js",
    "assets/deity-page.js",
    "assets/admin.js",
    "data/deities.json",
]

HTML_FILES = ["index.html", "deity.html", "admin.html"]


def file_hash(rel_path):
    abs_path = os.path.join(ROOT, rel_path)
    with open(abs_path, "rb") as f:
        content = f.read()
    return hashlib.sha256(content).hexdigest()[:8]


def strip_existing_query(path_with_maybe_query):
    return path_with_maybe_query.split("?", 1)[0]


def main():
    # Two-pass hashing: app.js's own content changes when we rewrite its
    # DATA_URL line, so its script-tag hash must be computed *after* that
    # rewrite, not before -- otherwise the hash embedded in the HTML
    # wouldn't match the file's actual on-disk content.
    static_files = [p for p in VERSIONED_FILES if p != "assets/app.js"]
    hashes = {p: file_hash(p) for p in static_files if os.path.exists(os.path.join(ROOT, p))}

    # --- Rewrite DATA_URL in app.js first ---
    app_js_path = os.path.join(ROOT, "assets/app.js")
    data_hash = hashes.get("data/deities.json")
    if data_hash and os.path.exists(app_js_path):
        with open(app_js_path, "r", encoding="utf-8") as f:
            text = f.read()
        new_text = re.sub(
            r'const DATA_URL = "data/deities\.json(?:\?v=[0-9a-f]+)?";',
            f'const DATA_URL = "data/deities.json?v={data_hash}";',
            text,
        )
        if new_text != text:
            with open(app_js_path, "w", encoding="utf-8") as f:
                f.write(new_text)
            print("updated assets/app.js (DATA_URL)")

    # Now hash app.js, reflecting the DATA_URL rewrite above.
    if os.path.exists(app_js_path):
        hashes["assets/app.js"] = file_hash("assets/app.js")

    for p, h in hashes.items():
        print(f"{p} -> {h}")

    # --- Rewrite href/src in HTML files ---
    for html_name in HTML_FILES:
        html_path = os.path.join(ROOT, html_name)
        if not os.path.exists(html_path):
            continue
        with open(html_path, "r", encoding="utf-8") as f:
            text = f.read()

        def repl(m):
            attr, quote, value = m.group(1), m.group(2), m.group(3)
            bare = strip_existing_query(value)
            if bare in hashes:
                return f'{attr}={quote}{bare}?v={hashes[bare]}{quote}'
            return m.group(0)

        # Matches href="assets/style.css" or src="assets/app.js", with or
        # without an existing ?v=... query string.
        pattern = re.compile(r'(href|src)=(["\'])([^"\']+?)\2')
        new_text = pattern.sub(repl, text)

        if new_text != text:
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(new_text)
            print(f"updated {html_name}")


if __name__ == "__main__":
    main()
