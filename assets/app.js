/* Shared utilities + landing page logic for The Ourosi Pantheon wiki. */

const DATA_URL = "data/deities.json?v=b36db3d3";

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
  return `assets/icons/${deity.slug}.${ext}`;
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

/* ---------------- Landing page ---------------- */

function deityCardHtml(d, nameMode) {
  return `
    <a class="deity-card" href="deity.html?d=${encodeURIComponent(d.slug)}" data-slug="${d.slug}">
      <img class="symbol" src="${iconPath(d)}" alt="${escapeHtml(d.name)} symbol" loading="lazy">
      <h2 class="card-name card-name--${nameMode}">${displayNameHtml(d, nameMode)}</h2>
      <p class="portfolio">${renderInline(d.portfolio || "")}</p>
      <span class="alignment-tag">${escapeHtml(d.alignment || "Unaligned")}</span>
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
  const PANTHEON_TAGS = {
    greater: { include: "OurosiDeity" },
    dwarven: { include: "DwarfPantheon" },
    elven: { include: "ElvenPantheon", exclude: "DrowPantheon" },
  };

  loadDeities().then((deities) => {
    // Placeholders (unwritten pantheon members) don't appear in the main
    // directory -- only real, fully-written deity pages do. Placeholders
    // are still reachable by following a link from a deity's Appendix.
    const real = deities.filter((d) => !d.is_placeholder);

    // Sort alphabetically by display name (ignoring leading articles/titles noise)
    const sorted = [...real].sort((a, b) => a.name.localeCompare(b.name));

    // Active pantheon tab persists across visits, same as name display mode.
    const TAB_STORAGE_KEY = "ourosi-pantheon-tab";
    let activeTab = "greater";
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      if (saved && PANTHEON_TAGS[saved]) activeTab = saved;
    } catch (e) { /* localStorage unavailable, fall back to default */ }

    function deitiesForActiveTab() {
      const cfg = PANTHEON_TAGS[activeTab];
      return sorted.filter((d) => {
        const tags = d.tags || [];
        if (!tags.includes(cfg.include)) return false;
        if (cfg.exclude && tags.includes(cfg.exclude)) return false;
        return true;
      });
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
      grid.innerHTML = filtered.map((d) => deityCardHtml(d, nameMode)).join("");
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
