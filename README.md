# The Ourosi Pantheon

A static wiki of the gods of Ouros. The landing page shows every deity as a
card (symbol, name, portfolio); clicking a card opens that deity's page with
their titles, domains, commandments, and — where one exists — their
sub-pantheon (the other gods listed in that deity's "Appendix" section, such
as the Seldarine or the Morndinsamman), cross-linked to each other's pages.

No build step, no framework, no server-side code. It's plain HTML/CSS/JS that
reads a single generated JSON file. This means it runs identically whether
you open `index.html` directly from disk, serve it locally, or host it on
GitHub Pages.

## Structure

```
index.html              Landing page (deity grid, search, alignment filter)
deity.html               Single deity page template (reads ?d=<slug> from the URL)
assets/
  style.css              All styling
  app.js                 Shared data loading + landing page logic
  deity-page.js          Deity page rendering logic
  icons/<slug>.svg        One placeholder symbol icon per deity
data/
  deities.json            Generated data file the site actually reads
source-markdown/          The original Obsidian-flavoured markdown, one file per deity
tools/
  parse.py                Regenerates data/deities.json from source-markdown/
  gen_icons.py             Regenerates placeholder icons from data/deities.json
```

## Previewing locally

Because the site uses `fetch()` to load `data/deities.json`, opening
`index.html` with a plain `file://` URL will fail in most browsers (fetch is
blocked for local files by default). Serve the folder instead:

```bash
cd site
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Editing deity content

The site never reads the markdown directly — it reads `data/deities.json`.
If you edit a file in `source-markdown/`, regenerate the data:

```bash
python3 tools/parse.py
```

This rewrites `data/deities.json` from scratch. Refresh the browser (no
server restart needed) to see the changes.

### What the parser keeps

Each deity page shows, in order:

1. The intro paragraph(s) and infobox (Alignment, Symbol, Portfolio, Divine
   Realm, Worshippers) from the top `columns` block in the markdown.
2. Titles and Domains.
3. Commandments (if the file has a `### Commandments of X` section with
   bullet points — some deities have none, and the section is simply
   omitted for them).
4. Appendix: the sub-pantheon table, if the file has an `### Appendix`
   section with a member list. Members are automatically linked to their own
   deity page when one exists in this dataset, and rendered as plain
   (non-clickable) text otherwise.

Obsidian-only syntax — `[[wikilinks]]`, the `columns` and `datacards` code
fences, and the dataview queries inside them — is stripped or converted
during parsing; none of it reaches the browser.

### Adding a new deity

1. Drop a new markdown file into `source-markdown/`, following the same
   shape as the existing files (frontmatter with `Portfolio`/`Alignment`/
   `Divine Domains`, a `columns` intro block, a `### Commandments of X`
   section, optionally an `### Appendix` section with a sub-pantheon list).
2. Run `python3 tools/parse.py`.
3. Run `python3 tools/gen_icons.py` to generate a placeholder icon for the
   new deity (skip this step if you're supplying real artwork instead — see
   below).
4. Refresh the browser.

### Replacing placeholder icons with real artwork

Every deity currently gets a generated placeholder icon (initials on a
colored circle, tinted by alignment) at `assets/icons/<slug>.svg`. To swap
in real artwork, just replace that file — any image works as long as the
filename matches the deity's slug (visible in the URL bar on that deity's
page, e.g. `deity.html?d=lolth` → `assets/icons/lolth.svg`). PNG, JPG, and
WEBP all work; if you use a different extension, update the `iconPath()`
function in `assets/app.js`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (the whole `site/` folder should
   become the repo root, or you can point Pages at a `/site` subfolder — see
   below).
2. In the repo settings, under **Pages**, set the source to the branch and
   folder containing this code (e.g. `main` / `/ (root)`).
3. The included `.nojekyll` file tells GitHub Pages not to run Jekyll
   processing, which matters because Jekyll ignores files/folders starting
   with an underscore by default and can otherwise interfere with a plain
   static site.
4. Wait a minute or two for the first deploy, then visit the URL GitHub
   gives you (typically `https://<username>.github.io/<repo>/`).

If you deploy from a subfolder instead of the repo root, no path changes are
needed — all links in this site are relative (`assets/...`, `data/...`,
`deity.html?d=...`), so it works the same regardless of what folder it lives
in within the repo.

## Notes on the data

- A few deities (Melora, Pelor, Saren-Raei/Sarenrae, Torog, Vecna, Zehir)
  have no sub-pantheon appendix in the source material, so their pages end
  after Commandments — this is expected, not a bug.
- Vhaeraun's source file has an empty Commandments section, so that page
  shows only the intro/infobox and Appendix.
- Asmodeus and Eilistraee were trimmed to match the same Commandments +
  Appendix shape as every other deity, even though their original Obsidian
  files contained additional sections (Description, History, Known
  Organizations, Divine Relics, player-options spell lists). That extra
  content still exists in git history / your original vault if you want it
  back later — it's just not part of this site.
- The Portfolio shown on each card and page is built from the frontmatter's
  `Portfolio` field, which follows one of three shapes in the source files:
  `"<Adjective> God of <Thing> | <rest>"` (the `<Thing>` gets merged into
  the front of the list), `"<Epithet> | Greater God of <full list>"` (the
  second half is used as-is), or a plain comma list with no pipe (used
  unchanged). `tools/parse.py`'s `clean_portfolio()` handles all three.

### Placeholder pages for unwritten pantheon members

Every deity's Appendix links to the other members of their pantheon (e.g.
Bane's page links to Maglubiyet, Hruggek, and the rest of the Goblin Host).
Most of those linked names don't have their own markdown file yet. Rather
than showing dead, unclickable text, the parser generates a minimal
**placeholder page** for every such name automatically:

- Placeholder pages show the deity's name and a "this page hasn't been
  written yet" notice — no invented lore.
- On the deity page that links to them, placeholder members are visually
  tagged **unwritten** so it's clear at a glance which links go to a full
  entry and which don't.
- Placeholders never appear on the main landing page grid — that's reserved
  for deities with an actual written entry. They're only reachable by
  clicking through from a real deity's Appendix.
- If the same placeholder name is referenced from more than one deity's
  Appendix (e.g. a shared exarch), all of those links point at the same
  single placeholder page rather than creating duplicates.

To turn a placeholder into a real page, just add a proper markdown file for
that deity to `source-markdown/` (matching the slug shown in the
placeholder's URL) and rerun `tools/parse.py` — the placeholder disappears
and every link that used to point at it now points at the real page
automatically.
