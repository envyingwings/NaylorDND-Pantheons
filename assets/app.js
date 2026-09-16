/* Shared utilities + landing page logic for The Ourosi Pantheon wiki. */

const DATA_URL = "data/deities.json?v=66432436";

/** Load the deity dataset once and cache it on window. */
async function loadDeities() {
  if (window.__deities) return window.__deities;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error("Failed to load deities.json: " + res.status);
  const data = await res.json();
  window.__deities = data;
  return data;
}

/** Very small markdown-lite: **bold** and _italic_ -> <strong>/<em>. Escapes HTML first. */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(str) {
  if (!str) return "";
  let out = escapeHtml(str);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^\w])_(.+?)_($|[^\w])/g, "$1<em>$2</em>$3");
  return out;
}

function iconPath(deity) {
  const ext = deity && deity.icon_ext ? deity.icon_ext : "svg";
  const slug = (deity && deity.icon_slug) || (deity && deity.slug);
  return `assets/icons/${slug}.${ext}`;
}

/** Classic D&D alignment ordering, good-to-evil then lawful-to-chaotic within each. */
const ALIGNMENT_ORDER = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

function alignmentSortIndex(alignment) {
  const idx = ALIGNMENT_ORDER.indexOf(alignment);
  return idx === -1 ? ALIGNMENT_ORDER.length : idx;
}

/** Splits a "Name, Epithet" display name into its two parts. Falls back to
 * treating the whole string as the name if there's no comma. */
function splitNameEpithet(fullName) {
  const idx = fullName.indexOf(",");
  if (idx === -1) return { name: fullName.trim(), epithet: "" };
  return {
    name: fullName.slice(0, idx).trim(),
    epithet: fullName.slice(idx + 1).trim(),
  };
}

/** Renders a deity's name per the current landing-page display mode:
 * "name" -> just the name; "epithet" -> just the epithet (falls back to
 * name if there is none); "both" -> name and epithet stacked on separate
 * lines (no comma). */
function displayNameHtml(d, mode) {
  const { name, epithet } = splitNameEpithet(d.name);
  if (mode === "epithet") {
    return renderInline(epithet || name);
  }
  if (mode === "both") {
    if (!epithet) return renderInline(name);
    return `${renderInline(name)}<span class="epithet-line">${renderInline(epithet)}</span>`;
  }
  return renderInline(name);
}

// For an ordinary (non-multi-aspect) deity known by a genuinely different
// name depending on which pantheon page a reader arrived from -- e.g.
// Aasterinian is the name used on the Draconic Pantheon (Bahamut, Tiamat,
// Sardior's rosters), Avachel is the name used on the Elven Pantheon
// (Corellon's roster) -- rather than one name with the other demoted to an
// epithet. This is deliberately separate from SOURCE_NAME_OVERRIDES in
// deity-page.js: that one selects among an aspect's several *distinct
// identities* sharing one page (Seha-Angharradh's four goddesses); this
// one is just an alternate display name for a single deity with one
// unified page, keyed by slug rather than aspect_slug. Lives here (not
// deity-page.js) because app.js loads on both index.html and deity.html,
// so both the landing-page card and the deity page's own hero/title need
// it. Unlisted deities are unaffected regardless of source.
const DEITY_NAME_OVERRIDES = {
  aasterinian: {
    draconic: "Aasterinian, the Quicksilver Dragon",
    elven: "Avachel, the Quicksilver Dragon",
  },
};

function resolveDeityName(d, source) {
  const overrides = DEITY_NAME_OVERRIDES[d.slug];
  if (overrides && source && overrides[source]) return overrides[source];
  return d.name;
}

// A deity can hold a narrower rank and portfolio within a pantheon they're
// not truly a member of -- Kord is a full Greater God on the Ourosi
// (Greater) Pantheon, but within the Ordning he's honored only as a
// demigod exarch of Annam All-Father, with a correspondingly narrower
// portfolio (Storms/Skies/Athletics/Battle/Heroes/Victory in full,
// Heroism/Victory alone in the giants' own regard). Same shape and
// rationale as DEITY_NAME_OVERRIDES -- keyed by slug then source, lives
// here so both the landing-page card and the deity page's own hero
// tagline/infobox Portfolio row apply it. Unlisted deities (and any
// source without an entry) fall through to the deity's own portfolio
// unchanged.
const DEITY_PORTFOLIO_OVERRIDES = {
  kord: {
    giant: "Demigod of Heroism and Victory",
  },
};

function resolveDeityPortfolio(d, source) {
  const overrides = DEITY_PORTFOLIO_OVERRIDES[d.slug];
  if (overrides && source && overrides[source]) return overrides[source];
  return d.portfolio;
}

/* ---------------- Landing page ---------------- */

function deityCardHtml(d, nameMode, source) {
  const href = d._cardHref || (d.multi_aspect
    ? `deity.html?d=${encodeURIComponent(d.slug)}&source=greater`
    : `deity.html?d=${encodeURIComponent(d.slug)}${source ? `&source=${encodeURIComponent(source)}` : ""}`);
  const iconSource = d._cardIcon || d;
  const stubTag = d.is_placeholder ? `<span class="stub-tag">unwritten</span>` : "";
  const displayName = resolveDeityName(d, source);
  const displayPortfolio = resolveDeityPortfolio(d, source);
  return `
    <a class="deity-card${d.is_placeholder ? " no-page" : ""}" href="${href}" data-slug="${d.slug}">
      <img class="symbol" src="${iconPath(iconSource)}" alt="${escapeHtml(displayName)} symbol" loading="lazy">
      <h2 class="card-name card-name--${nameMode}">${displayNameHtml({ name: displayName }, nameMode)}</h2>
      ${stubTag}
      <p class="portfolio">${renderInline(displayPortfolio || "")}</p>
      ${d.alignment ? `<span class="alignment-tag">${escapeHtml(d.alignment)}</span>` : ""}
    </a>
  `;
}

function initLandingPage() {
  const grid = document.getElementById("deity-grid");
  const searchInput = document.getElementById("search");
  const alignmentFilter = document.getElementById("alignment-filter");
  const nameModeSelect = document.getElementById("name-mode");
  const resultCount = document.getElementById("result-count");
  const tabButtons = Array.from(document.querySelectorAll(".pantheon-tab"));
  if (!grid) return;

  // Which tag identifies membership in each pantheon tab. A deity can carry
  // both tags (e.g. Moradin is Greater Pantheon and head of the Dwarven
  // Pantheon) and will appear on both tabs. An optional `exclude` tag lets a
  // tab omit deities that would otherwise match -- e.g. Eilistraee, Lolth,
  // and Vhaeraun all carry ElvenPantheon (their elven origin) as well as
  // DrowPantheon, but belong on a future Drow tab by default, not here.
  // `expandAspects: true` means a multi-aspect deity (e.g. Seha-Angharradh)
  // shows one card per aspect on this tab instead of a single merged card --
  // used on the Elven tab, where Aerdrie, Hanali, and Sehanine are each
  // full pantheon members in their own right. Tabs without this flag (the
  // Greater Pantheon) show the single merged card instead.
  const PANTHEON_TAGS = {
    greater: { include: "OurosiDeity" },
    dwarven: { include: "DwarfPantheon" },
    elven: { include: "ElvenPantheon", exclude: "DrowPantheon", expandAspects: true },
    drow: { include: "DrowPantheon" },
    draconic: { include: "DragonPantheon", expandAspects: true },
    gnome: { include: "GnomePantheon" },
    goblinoid: { include: "GoblinoidPantheon" },
    giant: { include: "GiantPantheon" },
    orcish: { include: "OrcPantheon" },
    halfling: { include: "HalflingPantheon" },
  };

  loadDeities().then((deities) => {
    // Placeholders (unwritten pantheon members) are tagged with whichever
    // pantheon they were linked from (see parse.py), so they now appear on
    // that pantheon's own tab -- marked "unwritten" -- rather than being
    // hidden everywhere. They still never show up on a tab they have no
    // tag for (the Greater Pantheon tab, in particular, since no
    // placeholder carries OurosiDeity), which the tag-based filtering
    // below already handles without a separate blanket exclusion here.
    const real = deities;

    // Active pantheon tab persists across visits, same as name display mode.
    const TAB_STORAGE_KEY = "ourosi-pantheon-tab";
    let activeTab = "greater";
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      if (saved && PANTHEON_TAGS[saved]) activeTab = saved;
    } catch (e) { /* localStorage unavailable, fall back to default */ }

    // Turns one multi-aspect deity record (e.g. Seha-Angharradh) into
    // several card-view objects, one per aspect, each linking straight to
    // that aspect's tab on the shared page. All four share the merged
    // page's own symbol image (not each aspect's individual icon), and the
    // combined/default aspect displays under its pantheon-context name
    // ("Angharradh" here on the Elven tab) rather than the landing-page
    // name used elsewhere ("Seha-Angharradh").
    // Mirrors SOURCE_NAME_OVERRIDES in deity-page.js: on the Elven Pantheon
    // tab, the combined aspect displays as "Angharradh" rather than the
    // "Seha-Angharradh" name used for its card on the Greater Pantheon tab.
    // Only Seha-Angharradh's combined/default aspect genuinely reads
    // differently depending on which pantheon tab is showing it (Seha-
    // Angharradh vs Angharradh) -- Null's three aspects (Null, Chronepsis,
    // Falazure) are the same names on every tab that lists them, so no
    // override entry is needed for that parent at all. Keyed by parent
    // slug -> {aspect_slug: name}, so this can hold entries for more than
    // one multi-aspect deity without them interfering with each other.
    const ASPECT_NAME_OVERRIDES = {
      "seha-angharradh": { angharradh: "Angharradh, the Moonweaver" },
    };

    function expandToAspectCards(d) {
      const overrides = ASPECT_NAME_OVERRIDES[d.slug] || {};
      return d.aspects.map((a) => ({
        slug: d.slug,
        name: overrides[a.aspect_slug] || a.name,
        portfolio: a.portfolio,
        alignment: a.alignment,
        domains: d.domains,
        // source is the tab this expansion is happening on, not hardcoded
        // to "elven" -- the same expansion now also runs for the Draconic
        // tab's Null/Chronepsis/Falazure cards, and each needs its own
        // cards to link back with the correct source for anything that
        // reads it downstream (e.g. a future per-tab name or portfolio
        // override for one of these aspects).
        _cardHref: `deity.html?d=${encodeURIComponent(d.slug)}&aspect=${encodeURIComponent(a.aspect_slug)}&source=${encodeURIComponent(activeTab)}`,
        // Only the combined/default aspect uses the merged page's own
        // symbol; every other aspect keeps its own distinct icon.
        _cardIcon: a.aspect_slug === d.default_aspect
          ? d
          : { slug: a.aspect_slug, icon_ext: a.icon_ext },
      }));
    }

    function deitiesForActiveTab() {
      const cfg = PANTHEON_TAGS[activeTab];
      const matched = real.filter((d) => {
        const tags = d.tags || [];
        if (!tags.includes(cfg.include)) return false;
        if (cfg.exclude && tags.includes(cfg.exclude)) return false;
        return true;
      });
      let list = matched;
      if (cfg.expandAspects) {
        const expanded = [];
        matched.forEach((d) => {
          if (d.multi_aspect && Array.isArray(d.aspects) && d.aspects.length > 0) {
            expanded.push(...expandToAspectCards(d));
          } else {
            expanded.push(d);
          }
        });
        list = expanded;
      }
      // Sorted here, not once up front, because a deity's alphabetical
      // position can depend on which tab is showing it -- both because of
      // aspect expansion just above (one record becomes several, each
      // under its own name) and because of DEITY_NAME_OVERRIDES, where the
      // same record's *display name itself* changes per tab (Aasterinian
      // on the Draconic tab, but Avachel -- sorting under A-V, not A-A --
      // on the Elven tab). Sorting once before the tab is even known can
      // only ever be correct for whichever name the un-toured record
      // happens to carry natively.
      return [...list].sort((a, b) => resolveDeityName(a, activeTab).localeCompare(resolveDeityName(b, activeTab)));
    }

    // Rebuilds the alignment filter's options to match whichever alignments
    // are actually present among the active tab's deities, in classic D&D
    // order (good-to-evil, lawful-to-chaotic within each). Preserves the
    // current selection if it's still valid for the new tab, otherwise
    // resets to "All alignments".
    function rebuildAlignmentOptions() {
      const previousValue = alignmentFilter.value;
      const tabDeities = deitiesForActiveTab();
      const alignmentsPresent = new Set(tabDeities.map((d) => d.alignment).filter(Boolean));
      const alignments = ALIGNMENT_ORDER.filter((a) => alignmentsPresent.has(a));
      alignmentsPresent.forEach((a) => {
        if (!alignments.includes(a)) alignments.push(a);
      });

      alignmentFilter.innerHTML = "";
      const allOpt = document.createElement("option");
      allOpt.value = "";
      allOpt.textContent = "All alignments";
      alignmentFilter.appendChild(allOpt);
      alignments.forEach((a) => {
        const opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        alignmentFilter.appendChild(opt);
      });
      alignmentFilter.value = alignmentsPresent.has(previousValue) ? previousValue : "";
    }

    // Name display mode persists across visits (landing page only -- deity
    // pages always show the full "Name, Epithet" form regardless).
    const STORAGE_KEY = "ourosi-name-mode";
    let nameMode = "both";
    try {
      nameMode = localStorage.getItem(STORAGE_KEY) || "both";
    } catch (e) { /* localStorage unavailable, fall back to default */ }
    if (nameModeSelect) nameModeSelect.value = nameMode;

    function render() {
      const q = (searchInput.value || "").trim().toLowerCase();
      const alignFilter = alignmentFilter.value;
      const tabDeities = deitiesForActiveTab();
      const filtered = tabDeities.filter((d) => {
        if (alignFilter && d.alignment !== alignFilter) return false;
        if (!q) return true;
        const haystack = [
          d.name,
          d.portfolio,
          d.titles_line,
          ...(d.domains || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });

      resultCount.textContent = `${filtered.length} deit${filtered.length === 1 ? "y" : "ies"} shown`;

      if (filtered.length === 0) {
        grid.innerHTML = `<p class="no-results">No deities match your search.</p>`;
        return;
      }
      grid.innerHTML = filtered.map((d) => deityCardHtml(d, nameMode, activeTab)).join("");
    }

    function setActiveTab(tab) {
      if (!PANTHEON_TAGS[tab]) return;
      activeTab = tab;
      try { localStorage.setItem(TAB_STORAGE_KEY, activeTab); } catch (e) { /* ignore */ }
      tabButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.pantheon === activeTab);
      });
      rebuildAlignmentOptions();
      render();
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => setActiveTab(btn.dataset.pantheon));
    });

    searchInput.addEventListener("input", render);
    alignmentFilter.addEventListener("change", render);
    if (nameModeSelect) {
      nameModeSelect.addEventListener("change", () => {
        nameMode = nameModeSelect.value;
        try { localStorage.setItem(STORAGE_KEY, nameMode); } catch (e) { /* ignore */ }
        render();
      });
    }

    // Apply whichever tab was restored from storage (or the "greater"
    // default) before the first render, so the tab bar's active state and
    // the alignment options match what's actually displayed.
    setActiveTab(activeTab);
  }).catch((err) => {
    grid.innerHTML = `<p class="no-results">Could not load the pantheon data. (${escapeHtml(err.message)})</p>`;
    console.error(err);
  });
}

document.addEventListener("DOMContentLoaded", initLandingPage);
