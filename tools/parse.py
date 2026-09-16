#!/usr/bin/env python3
"""
Parses the Ourosi deity markdown files (Obsidian-flavoured) into a single
data/deities.json consumed by the static site. Run this from anywhere; it
locates paths relative to this script.

Usage:
    python3 tools/parse.py

Converts:
  - YAML frontmatter -> deity metadata
  - [[Wikilink]] / [[Wikilink|Display]] -> plain text
  - ```columns ... === ... === ... ``` blocks -> plain paragraphs (columns dropped)
  - ```datacards ... ``` blocks -> dropped (replaced by generated pantheon link list)
  - Bullet lists under "Appendix" -> pantheon member links, cross-linked to
    real deity pages where a match exists in this same dataset.
"""
import os
import re
import json
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(HERE, "..", "source-markdown")
OUT_PATH = os.path.join(HERE, "..", "data", "deities.json")

WIKILINK_RE = re.compile(r"\[\[([^\]|]+)\|([^\]]+)\]\]|\[\[([^\]]+)\]\]")
IMAGE_RE = re.compile(r"!\[\[([^\]|]+)(\|[^\]]+)?\]\]")


def slugify(name):
    s = name.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    return s.strip("-")


def clean_wikilinks(text):
    """Replace [[Target|Display]] and [[Target]] with just display text (or target)."""
    def repl(m):
        if m.group(1) is not None:
            return m.group(2)
        return m.group(3)
    return WIKILINK_RE.sub(repl, text)


def strip_images(text):
    return IMAGE_RE.sub("", text)


def parse_infobox(block_text):
    """Parse the ```\n**Alignment.** ... \n``` style infobox inside the columns block."""
    info = {}
    for line in block_text.split("\n"):
        line = line.strip()
        m = re.match(r"\*\*([^*]+)\.\*\*\s*(.*)", line)
        if m:
            key = m.group(1).strip()
            val = clean_wikilinks(m.group(2).strip())
            info[key] = val
    return info


def find_section(body, header_pattern, next_header_pattern=r"^#{2,3} "):
    """Return the text of a section starting at a header matching header_pattern
    up to (not including) the next header at level 2 or 3."""
    m = re.search(header_pattern, body, flags=re.MULTILINE)
    if not m:
        return None
    start = m.end()
    rest = body[start:]
    m2 = re.search(next_header_pattern, rest, flags=re.MULTILINE)
    end = start + m2.start() if m2 else len(body)
    return body[start:end].strip()


def parse_bullets(text):
    """Extract top-level '- ...' bullet lines, cleaning wikilinks."""
    bullets = []
    for line in text.split("\n"):
        m = re.match(r"^-\s+(.*)", line.strip())
        if m:
            bullets.append(clean_wikilinks(m.group(1)).strip())
    return bullets


def parse_appendix(body):
    """
    Finds the '### Appendix' section and every '#### <Pantheon Name>'
    subsection within it, each with its own bullet-list of pantheon member
    links (read only up to the next #### subheading or the end of the
    section, so multiple subsections never bleed into each other).

    Almost every deity has exactly one subsection (they belong to one
    pantheon), but a deity that's a genuine member of two pantheons under
    different names -- e.g. Aasterinian/Avachel, listed on both the
    Draconic and Elven rosters -- has two. Returns:
      {"groups": [{"title": ..., "members": [...]}, ...], "title": <first
      group's title, for backward compatibility>, "members": <first
      group's members, ditto>} or None if there's no Appendix section at
      all.
    """
    m = re.search(r"^### Appendix\s*$", body, flags=re.MULTILINE)
    if not m:
        return None
    rest = body[m.end():]

    # Split on every #### subheading. re.split with a capturing group
    # yields [pre-text-before-first-####, heading1, body1, heading2,
    # body2, ...]; the pre-text is discarded (an Appendix section always
    # opens with its first #### heading in every file in this vault).
    parts = re.split(r"^####\s+(.+)$", rest, flags=re.MULTILINE)
    sub_titles = parts[1::2]
    sub_bodies = parts[2::2]
    if not sub_titles:
        # No #### subheading at all -- treat the whole section as one
        # untitled group, same as the old single-group behavior.
        sub_titles = [None]
        sub_bodies = [rest]

    groups = [_parse_appendix_members(title, body) for title, body in zip(sub_titles, sub_bodies)]
    return {
        "groups": groups,
        "title": groups[0]["title"] if groups else None,
        "members": groups[0]["members"] if groups else [],
    }


def _parse_appendix_members(title, section_body):
    """Parses one #### subsection's bullet-list of member links, after its
    own datacards fence. Shared by parse_appendix for however many
    subsections a deity's Appendix has."""
    title = title.strip() if title else None
    rest_wo_fence = re.sub(r"```datacards.*?```", "", section_body, flags=re.DOTALL)

    members = []
    for line in rest_wo_fence.split("\n"):
        line = line.strip()
        if not line.startswith("-"):
            continue
        raw = line.lstrip("-").strip()
        wl = re.search(r"\[\[([^\]|]+)\|([^\]]+)\]\]|\[\[([^\]]+)\]\]", raw)
        if wl:
            display = wl.group(2) or wl.group(3)
            target = wl.group(1) or wl.group(3)
        else:
            display = raw
            target = raw
        display_clean = re.sub(r"^\*\*|\*\*$", "", display).strip()
        after = raw[wl.end():].strip() if wl else ""
        after = re.sub(r"^[\*\.\,\s]+", "", after)
        blurb = clean_wikilinks(after).strip()
        name_clean = re.sub(r"\*\*", "", display_clean).strip(" .")
        if not name_clean:
            continue
        members.append({
            "name": name_clean,
            # Slugified the same way parse_file computes a real page's own
            # slug (split at the first comma, then slugify only that first
            # part) rather than slugifying the whole target string -- the
            # two must agree, or a link written as "Name, Epithet" (the
            # site's standard name/epithet format) can never resolve to a
            # same-named real page, which only slugifies its own "Name"
            # half. No-op for the more common "Name — Epithet" (em-dash,
            # no comma) target style already used throughout this vault,
            # since split(",")[0] is the whole string when there's no
            # comma to split on.
            "slug": slugify(target.split(",")[0]),
            "blurb": blurb
        })
    return {"title": title, "members": members}


# Hand-curated canonical portfolios. The source frontmatter/infobox Portfolio
# fields are inconsistent (different shapes, some incomplete, some carrying
# race names or "patron of X" phrasing that shouldn't appear in the display
# portfolio), so rather than trying to regex every edge case correctly, each
# deity's clean portfolio is written out explicitly here. All follow the
# same "Greater God/Goddess of <comma list>" shape, with no patron-of-race
# or specific-race mentions (e.g. "Elves", "good-aligned dragons",
# "patron of Goblinoids" are omitted; the underlying domain like "Conflict"
# or "Creation" is kept).
CANONICAL_PORTFOLIOS = {
    "asmodeus": "Greater God of the Hells, Indulgence, Sin and Negotiation",
    "avandra": "Greater Goddess of Change, Freedom, Revolution, Travel, and Luck",
    "bahamut": "Greater God of Virtue, Honour, and Justice",
    "bane": "Greater God of Conflict, Discipline, Oppression, and Warfare",
    "corellon-larethian": "Greater God of Stars, Magic, Artistry, and Reincarnation",
    "eilistraee": "Greater Goddess of Individuality, Night, and Witchcraft",
    "erathis": "Greater Goddess of Law, Civilization, Commerce, Peace, and Progress",
    "garl-glittergold": "Greater God of Artifice, Celebration, Jewels, and Wealth",
    "gruumsh-one-eye": "Greater God of Natural Disasters, Curses, Outcasts, and Strength",
    "ioun": "Greater Goddess of Truth, Knowledge, Lore, Skill, and Wizardry",
    "kord": "Greater God of Storms, Skies, Athletics, Battle, Heroes, and Victory",
    "lamashtu": "Greater Goddess of Monsters, Corruption, Famine, Evolution, and Vermin",
    "lolth": "Greater Goddess of Nightmares, Betrayal, Espionage, Manipulation, and Seduction",
    "the-raven-queen": "Greater Goddess of Death, the Afterlife, Fate, Psychopomps, and Winter",
    "melora": "Greater Goddess of Nature, Beasts, Hunters, Seas, and Wilderness",
    "moradin": "Greater God of Creation, Artisans, Harmony, Loyalty, Labour, and Machines",
    "pelor": "Greater God of Dawn, Agriculture, Martyrs, Summer, and the Sun",
    "sarenraei": "Greater Goddess of Redemption, Altruism, Fire, and Healing",
    "sardior": "Greater God of Psionics, Philosophy, and Enlightenment",
    "seha-angharradh": "Greater Goddess of Dreams, Moon, Intimacy, Mystery, and Shapechanging",
    "tharizdun": "Greater God of the Abyss, Insanity, Entropy, Extinction, and Calamity",
    "tiamat": "Greater Goddess of Ambition, Greed, and Piracy",
    "torog": "Greater God of Pain, Suffering, Disability, and Imprisonment",
    "vecna": "Greater God of Secrets, Archaeology, Forbidden Knowledge, and Undeath",
    "vhaeraun": "Greater God of Theatre, Thieves, Territory, and Rebellion",
    "yondalla": "Greater Goddess of Bounty, Fertility, Friendship, Home, Husbandry, and Medicine",
    "zehir": "Greater God of Blood, Poison, Murder, Obsession, Reptiles, and Transmutation",
}


def clean_portfolio(raw, slug, is_greater_pantheon=False):
    """Return the hand-curated canonical portfolio for this deity slug, if
    one exists; otherwise fall back to a best-effort clean of the raw
    frontmatter string (used for any future deity not yet in the table
    above).

    The "Greater God/Goddess of X" formula only applies to members of the
    Greater Pantheon (is_greater_pantheon=True) -- for every other deity
    (dwarven, elven, etc.) the second half of the raw string (the plain
    "Dwarven god of..." / "Elven god of..." description) is already the
    correct, complete portfolio text and must be returned as-is rather than
    prefixed with an unearned "Greater God of ..." lead-in."""
    if slug in CANONICAL_PORTFOLIOS:
        return CANONICAL_PORTFOLIOS[slug]

    if not raw:
        return raw
    if "|" not in raw:
        return raw.strip().rstrip(".")

    left, right = [p.strip() for p in raw.split("|", 1)]
    right_clean = right.rstrip(".")

    if not is_greater_pantheon:
        return right_clean

    if re.match(r"^Greater\s+(God|Goddess)\s+of\s+", right, flags=re.IGNORECASE):
        return right_clean

    m = re.search(r"\bof\s+(.+)$", left, flags=re.IGNORECASE)
    if m:
        thing = m.group(1).strip().rstrip(".")
        return f"Greater God of {thing}, {right_clean}"

    return right_clean


def detect_icon_ext(slug):
    """Check assets/icons/<slug>.<ext> on disk and return whichever real
    extension exists (webp/png/jpg preferred over the generated svg
    placeholder), so the frontend never has to guess or fail a request."""
    icons_dir = os.path.join(HERE, "..", "assets", "icons")
    for ext in ("webp", "png", "jpg", "jpeg"):
        if os.path.exists(os.path.join(icons_dir, f"{slug}.{ext}")):
            return ext
    if os.path.exists(os.path.join(icons_dir, f"{slug}.svg")):
        return "svg"
    return None


def parse_aspect_block(block_text, aspect_slug):
    """Parses one `## Aspect: x` block using the same columns/infobox/
    Commandments logic as a normal single-deity file, returning a dict
    shaped like a normal deity record (minus frontmatter-only fields)."""
    cm = re.search(r"```columns\nid:.*?\n===\n", block_text)
    intro_paragraphs = []
    infobox = {}
    display_name = None
    titles_line = None
    domains_line = None

    if cm:
        after_first_sep = cm.end()
        next_sep = block_text.find("\n===\n", after_first_sep)
        intro_block = block_text[after_first_sep:next_sep] if next_sep != -1 else ""
        intro_lines = []
        for line in intro_block.split("\n"):
            if re.match(r"^\s*-\s*\[\[#", line):
                continue
            intro_lines.append(line)
        intro_text = "\n".join(intro_lines).strip()
        intro_paragraphs = [p.strip() for p in re.split(r"\n\s*\n", intro_text) if p.strip()]
        intro_paragraphs = [clean_wikilinks(strip_images(p)) for p in intro_paragraphs]

        if next_sep != -1:
            infobox_start = next_sep + len("\n===\n")
            fence_end = block_text.find("\n```", infobox_start)
            infobox_block = block_text[infobox_start:fence_end] if fence_end != -1 else ""
            lines = infobox_block.split("\n")
            cursor = 0
            if cursor < len(lines) and lines[cursor].startswith("### "):
                display_name = lines[cursor][4:].strip()
                cursor += 1
            if cursor < len(lines) and lines[cursor].strip() and not lines[cursor].startswith("!") and "**" not in lines[cursor]:
                cursor += 1
            if cursor < len(lines) and lines[cursor].strip().startswith("!"):
                cursor += 1
            infobox = parse_infobox("\n".join(lines[cursor:]))

    tm = re.search(r"\*\*Titles:?\*\*\s*(.*)", block_text)
    if tm:
        titles_line = clean_wikilinks(tm.group(1).strip())
    dm = re.search(r"\*\*Domains:?\*\*\s*(.*)", block_text)
    if dm:
        domains_line = clean_wikilinks(dm.group(1).strip())

    commandments = []
    cmd_m = re.search(r"^#{3,4} Commandments of .+$", block_text, flags=re.MULTILINE)
    if cmd_m:
        section_text = find_section(block_text, re.escape(cmd_m.group(0)))
        if section_text:
            commandments = parse_bullets(section_text)

    appendix = parse_appendix(block_text)

    portfolio_raw = infobox.get("Portfolio", "")
    # Aspect portfolio text always comes from the rendered infobox line
    # (never the raw "Title | Description" frontmatter format), so it has
    # no pipe to split and is_greater_pantheon has no effect here -- passed
    # through for consistency with the other call site regardless.
    portfolio = clean_portfolio(portfolio_raw, aspect_slug, is_greater_pantheon=True) if portfolio_raw else portfolio_raw

    return {
        "aspect_slug": aspect_slug,
        "name": display_name or aspect_slug,
        "portfolio": portfolio,
        "alignment": infobox.get("Alignment", ""),
        "intro": intro_paragraphs,
        "infobox": infobox,
        "titles_line": titles_line,
        "domains_line": domains_line,
        "commandments": commandments,
        "appendix": appendix,
        "icon_ext": detect_icon_ext(aspect_slug),
    }


def parse_multi_aspect_file(path):
    """Parses a multi-aspect deity file (frontmatter has `multi_aspect: true`)
    into one JSON record with an `aspects` list, one entry per `## Aspect: x`
    block found in the body. The record's own top-level slug/name are drawn
    from the `default_aspect`, so ordinary cross-linking (appendix matching,
    the firstword_to_slug lookup in main()) still finds it like any other
    deity -- multi_aspect and aspects are what tell the frontend to render
    a tab bar instead of a flat page."""
    raw = open(path, encoding="utf-8").read()
    fm_match = re.match(r"^---\n(.*?)\n---\n", raw, flags=re.DOTALL)
    frontmatter = {}
    body = raw
    if fm_match:
        try:
            frontmatter = yaml.safe_load(fm_match.group(1)) or {}
        except yaml.YAMLError:
            frontmatter = {}
        body = raw[fm_match.end():]

    aspect_order = frontmatter.get("aspects", [])
    default_aspect = frontmatter.get("default_aspect", aspect_order[0] if aspect_order else None)

    blocks = re.split(r"^## Aspect: (\S+)\s*$", body, flags=re.MULTILINE)
    # re.split with a capturing group yields [pre-text, tag1, block1, tag2, block2, ...]
    aspects = {}
    for i in range(1, len(blocks), 2):
        tag = blocks[i].strip()
        block_text = blocks[i + 1]
        aspects[tag] = parse_aspect_block(block_text, tag)

    ordered_aspects = [aspects[a] for a in aspect_order if a in aspects]
    default = aspects.get(default_aspect, ordered_aspects[0] if ordered_aspects else None)
    if default is None:
        raise ValueError(f"No aspects parsed from {path}")

    name_guess = os.path.splitext(os.path.basename(path))[0].replace("__", ", ").replace("_", " ")
    slug = slugify(os.path.splitext(os.path.basename(path))[0].split("__")[0])

    tags = frontmatter.get("tags", [])
    status = frontmatter.get("Status", [])
    warlock = frontmatter.get("Warlock Province", [])
    domains_fm = frontmatter.get("Divine Domains", [])

    return {
        "slug": slug,
        "name": name_guess,
        "portfolio": default["portfolio"],
        "alignment": default["alignment"],
        "domains": domains_fm if isinstance(domains_fm, list) else ([domains_fm] if domains_fm else []),
        "status": status if isinstance(status, list) else ([status] if status else []),
        "warlock_province": warlock if isinstance(warlock, list) else ([warlock] if warlock else []),
        "tags": tags if isinstance(tags, list) else ([tags] if tags else []),
        "cover_file": None,
        "intro": default["intro"],
        "infobox": default["infobox"],
        "titles_line": default["titles_line"],
        "domains_line": default["domains_line"],
        "commandments": default["commandments"],
        "appendix": default["appendix"],
        "icon_ext": detect_icon_ext(slug),
        "source_file": os.path.basename(path),
        "multi_aspect": True,
        "default_aspect": default_aspect,
        "aspects": ordered_aspects,
    }


def parse_file(path):
    raw = open(path, encoding="utf-8").read()
    fm_match = re.match(r"^---\n(.*?)\n---\n", raw, flags=re.DOTALL)
    frontmatter = {}
    body = raw
    if fm_match:
        try:
            frontmatter = yaml.safe_load(fm_match.group(1)) or {}
        except yaml.YAMLError:
            frontmatter = {}
        body = raw[fm_match.end():]

    cm = re.search(r"```columns\nid:.*?\n===\n", body)
    intro_paragraphs = []
    infobox = {}
    display_name = None
    titles_line = None
    domains_line = None

    if cm:
        after_first_sep = cm.end()
        next_sep = body.find("\n===\n", after_first_sep)
        intro_block = body[after_first_sep:next_sep] if next_sep != -1 else ""
        intro_lines = []
        for line in intro_block.split("\n"):
            if re.match(r"^\s*-\s*\[\[#", line):
                continue
            intro_lines.append(line)
        intro_text = "\n".join(intro_lines).strip()
        intro_paragraphs = [p.strip() for p in re.split(r"\n\s*\n", intro_text) if p.strip()]
        intro_paragraphs = [clean_wikilinks(strip_images(p)) for p in intro_paragraphs]

        if next_sep != -1:
            infobox_start = next_sep + len("\n===\n")
            fence_end = body.find("\n```", infobox_start)
            infobox_block = body[infobox_start:fence_end] if fence_end != -1 else ""
            lines = infobox_block.split("\n")
            cursor = 0
            if cursor < len(lines) and lines[cursor].startswith("### "):
                display_name = lines[cursor][4:].strip()
                cursor += 1
            if cursor < len(lines) and lines[cursor].strip() and not lines[cursor].startswith("!") and "**" not in lines[cursor]:
                cursor += 1  # skip wiki-links reference line
            if cursor < len(lines) and lines[cursor].strip().startswith("!"):
                cursor += 1  # skip image line
            infobox = parse_infobox("\n".join(lines[cursor:]))

    tm = re.search(r"\*\*Titles:?\*\*\s*(.*)", body)
    if tm:
        titles_line = clean_wikilinks(tm.group(1).strip())
    dm = re.search(r"\*\*Domains:?\*\*\s*(.*)", body)
    if dm:
        domains_line = clean_wikilinks(dm.group(1).strip())

    commandments = []
    cmd_m = re.search(r"^#{3,4} Commandments of .+$", body, flags=re.MULTILINE)
    if cmd_m:
        section_text = find_section(body, re.escape(cmd_m.group(0)))
        if section_text:
            commandments = parse_bullets(section_text)

    appendix = parse_appendix(body)

    cover_raw = frontmatter.get("cover", "") or ""
    cover_m = re.match(r"\[\[([^\]|]+)", cover_raw)
    cover_file = cover_m.group(1) if cover_m else None

    name_guess = display_name or os.path.splitext(os.path.basename(path))[0].replace("__", ", ").replace("_", " ")
    slug = slugify(name_guess.split(",")[0])

    portfolio_raw = frontmatter.get("Portfolio", "")
    tags_fm = frontmatter.get("tags", [])
    tags_list = tags_fm if isinstance(tags_fm, list) else ([tags_fm] if tags_fm else [])
    is_greater = "OurosiDeity" in tags_list
    portfolio = clean_portfolio(portfolio_raw, slug, is_greater_pantheon=is_greater)
    # The infobox's own **Portfolio.** line is hand-typed separately in the
    # source and has repeatedly drifted from (or been left truncated
    # relative to) the canonical portfolio above -- e.g. race/patron
    # mentions the canonical text deliberately omits, or a line simply cut
    # off mid-sentence. The canonical portfolio is always correct and
    # complete, so it always wins: overwrite the infobox's displayed
    # Portfolio row with it rather than trusting the separately-typed line.
    if portfolio:
        infobox["Portfolio"] = portfolio
    alignment = frontmatter.get("Alignment", infobox.get("Alignment", ""))
    # Same drift as Portfolio above: the infobox's own **Alignment.** line is
    # hand-typed separately from frontmatter and has been caught out of date
    # after the standing "Neutral/Unaligned -> True Neutral" fix was applied
    # to frontmatter but not mirrored here. Frontmatter (or its fallback to
    # the infobox value when frontmatter has none) is always the canonical
    # alignment, so it always wins on the displayed row too.
    if alignment:
        infobox["Alignment"] = alignment
    domains_fm = frontmatter.get("Divine Domains", [])
    status = frontmatter.get("Status", [])
    warlock = frontmatter.get("Warlock Province", [])
    tags = frontmatter.get("tags", [])

    return {
        "slug": slug,
        "name": name_guess,
        "portfolio": portfolio,
        "alignment": alignment,
        "domains": domains_fm if isinstance(domains_fm, list) else ([domains_fm] if domains_fm else []),
        "status": status if isinstance(status, list) else ([status] if status else []),
        "warlock_province": warlock if isinstance(warlock, list) else ([warlock] if warlock else []),
        "tags": tags if isinstance(tags, list) else ([tags] if tags else []),
        "cover_file": cover_file,
        "intro": intro_paragraphs,
        "infobox": infobox,
        "titles_line": titles_line,
        "domains_line": domains_line,
        "commandments": commandments,
        "appendix": appendix,
        "icon_ext": detect_icon_ext(slug),
        "source_file": os.path.basename(path),
    }


def is_multi_aspect_file(path):
    """Cheap frontmatter peek to decide which parser to use, without
    duplicating the full parse."""
    raw = open(path, encoding="utf-8").read()
    fm_match = re.match(r"^---\n(.*?)\n---\n", raw, flags=re.DOTALL)
    if not fm_match:
        return False
    try:
        frontmatter = yaml.safe_load(fm_match.group(1)) or {}
    except yaml.YAMLError:
        return False
    return bool(frontmatter.get("multi_aspect"))


def main():
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    deities = []
    for fname in sorted(os.listdir(SRC_DIR)):
        if not fname.endswith(".md"):
            continue
        path = os.path.join(SRC_DIR, fname)
        try:
            if is_multi_aspect_file(path):
                d = parse_multi_aspect_file(path)
            else:
                d = parse_file(path)
            deities.append(d)
        except Exception as e:
            print(f"ERROR parsing {fname}: {e}")

    slug_set = {d["slug"] for d in deities}

    # Explicit alias map for cases the automatic firstword/slug matching can't
    # cover on its own -- chiefly, appendix links elsewhere on the site that
    # still refer to a folded-in aspect by its own former standalone name
    # (e.g. "Aerdrie Faenya" or "Angharradh") rather than the multi-aspect
    # page's own slug. Add an entry here whenever a new multi-aspect page
    # absorbs deities that other pages already link to by their old names.
    ALIAS_SLUGS = {
        "aerdrie-faenya-she-of-azure-plumage": "seha-angharradh",
        "aerdrie-faenya": "seha-angharradh",
        "hanali-celanil-fountains-rose": "seha-angharradh",
        "hanali-celanil-fountain-s-rose": "seha-angharradh",
        "hanali-celanil": "seha-angharradh",
        "angharradh": "seha-angharradh",
        "sehanine": "seha-angharradh",
        "sehanine-moonbow": "seha-angharradh",
    }

    firstword_to_slug = {}
    for d in deities:
        first = d["name"].split(",")[0].split(" ")[0].strip().lower()
        first = re.sub(r"[^\w-]", "", first)
        if first:
            firstword_to_slug.setdefault(first, d["slug"])

    for d in deities:
        if d["appendix"]:
            groups = d["appendix"].get("groups") or [
                {"title": d["appendix"].get("title"), "members": d["appendix"].get("members", [])}
            ]
            for group in groups:
                for member in group["members"]:
                    member_first = re.sub(
                        r"[^\w-]", "",
                        member["name"].split(",")[0].split(" ")[0].split("—")[0].strip().lower()
                    )
                    matched_slug = None
                    if member["slug"] in ALIAS_SLUGS:
                        matched_slug = ALIAS_SLUGS[member["slug"]]
                    elif member_first in ALIAS_SLUGS:
                        matched_slug = ALIAS_SLUGS[member_first]
                    elif member["slug"] in slug_set:
                        matched_slug = member["slug"]
                    elif member_first in firstword_to_slug:
                        matched_slug = firstword_to_slug[member_first]
                    member["has_page"] = matched_slug is not None
                    if matched_slug:
                        member["slug"] = matched_slug

    # Every appendix member without a real page gets a minimal placeholder
    # "deity" entry instead, so links always resolve to something rather
    # than rendering as dead, unclickable text. Deduplicated by slug, since
    # the same member can appear in more than one deity's appendix (e.g. a
    # goblinoid god listed under both Bane and their own future page).
    #
    # A placeholder is tagged with the pantheon tag matching the appendix
    # group it was linked from, so it shows up on that pantheon's landing
    # page tab like any real deity would -- keyed by the same keyword
    # found in the group's own "#### <Pantheon Name>" title as the
    # frontend's sourceFromAppendixTitle()/PANTHEON_TAGS use, so a
    # placeholder appears on exactly the tab a reader would expect after
    # following the link that created it. Titles that don't match any
    # pantheon tab (e.g. "Abyssal Lords", "Vassals of Asmodeus") leave the
    # placeholder untagged, same as before -- those groupings have no tab.
    APPENDIX_TITLE_TO_TAG = [
        (re.compile(r"draconic", re.IGNORECASE), "DragonPantheon"),
        (re.compile(r"drow", re.IGNORECASE), "DrowPantheon"),
        (re.compile(r"dwarven", re.IGNORECASE), "DwarfPantheon"),
        (re.compile(r"elven", re.IGNORECASE), "ElvenPantheon"),
        (re.compile(r"giant", re.IGNORECASE), "GiantPantheon"),
        (re.compile(r"gnome", re.IGNORECASE), "GnomePantheon"),
        (re.compile(r"goblinoid", re.IGNORECASE), "GoblinoidPantheon"),
        (re.compile(r"halfling", re.IGNORECASE), "HalflingPantheon"),
        (re.compile(r"orcish", re.IGNORECASE), "OrcPantheon"),
    ]

    def tag_for_appendix_title(title):
        if not title:
            return None
        for pattern, tag in APPENDIX_TITLE_TO_TAG:
            if pattern.search(title):
                return tag
        return None

    placeholder_slugs_seen = set()
    # First pass: collect every pantheon tag a given slug is linked under,
    # across ALL deities' appendices -- a slug can be reached from more
    # than one deity's roster (e.g. a goblinoid god listed under both Bane
    # and their own future page) and, in principle, from more than one
    # pantheon group, so this must finish before any placeholder record is
    # built rather than accumulating tags as we go; building the record on
    # first sight would miss tags contributed by a later deity in the loop.
    placeholder_tags = {}  # slug -> set of pantheon tags
    for d in deities:
        if not d["appendix"]:
            continue
        groups = d["appendix"].get("groups") or [
            {"title": d["appendix"].get("title"), "members": d["appendix"].get("members", [])}
        ]
        for group in groups:
            group_tag = tag_for_appendix_title(group.get("title"))
            if not group_tag:
                continue
            for member in group["members"]:
                placeholder_tags.setdefault(member["slug"], set()).add(group_tag)

    placeholders = []
    for d in deities:
        if not d["appendix"]:
            continue
        groups = d["appendix"].get("groups") or [
            {"title": d["appendix"].get("title"), "members": d["appendix"].get("members", [])}
        ]
        for group in groups:
            for member in group["members"]:
                if member["has_page"]:
                    continue
                slug = member["slug"]
                if slug in slug_set or slug in placeholder_slugs_seen:
                    # Already a real page, or already created as a placeholder from
                    # an earlier deity's appendix -- just point this member at it.
                    member["has_page"] = True
                    placeholder_slugs_seen.add(slug)
                    continue
                placeholder_slugs_seen.add(slug)
                placeholders.append({
                    "slug": slug,
                    "name": member["name"],
                    "portfolio": "",
                    "alignment": "",
                    "domains": [],
                    "status": [],
                    "warlock_province": [],
                    "tags": sorted(placeholder_tags.get(slug, [])),
                    "cover_file": None,
                    "intro": [],
                    "infobox": {},
                    "titles_line": None,
                    "domains_line": None,
                    "commandments": [],
                    "appendix": None,
                    "source_file": None,
                    "icon_ext": detect_icon_ext(slug),
                    "is_placeholder": True,
                })
                member["has_page"] = True

    for d in deities:
        d.setdefault("is_placeholder", False)

    deities.extend(placeholders)

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(deities, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(deities)} deities to {OUT_PATH}")


if __name__ == "__main__":
    main()
