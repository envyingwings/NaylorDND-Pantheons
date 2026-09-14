/* Shared utilities + landing page logic for The Ourosi Pantheon wiki. */

const DATA_URL = "data/deities.json?v=b73002f5";

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
  if (!grid) return;

  loadDeities().then((deities) => {
    // Placeholders (unwritten pantheon members) don't appear in the main
    // directory -- only real, fully-written deity pages do. Placeholders
    // are still reachable by following a link from a deity's Appendix.
    const real = deities.filter((d) => !d.is_placeholder);

    // Sort alphabetically by display name (ignoring leading articles/titles noise)
    const sorted = [...real].sort((a, b) => a.name.localeCompare(b.name));

    // Populate alignment filter options in classic D&D order (good-to-evil,
    // lawful-to-chaotic within each), not plain alphabetical.
    const alignmentsPresent = new Set(sorted.map((d) => d.alignment).filter(Boolean));
    const alignments = ALIGNMENT_ORDER.filter((a) => alignmentsPresent.has(a));
    // Catch any alignment string in the data that isn't in our known order list
    alignmentsPresent.forEach((a) => {
      if (!alignments.includes(a)) alignments.push(a);
    });
    alignments.forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      alignmentFilter.appendChild(opt);
    });

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
      const filtered = sorted.filter((d) => {
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

    searchInput.addEventListener("input", render);
    alignmentFilter.addEventListener("change", render);
    if (nameModeSelect) {
      nameModeSelect.addEventListener("change", () => {
        nameMode = nameModeSelect.value;
        try { localStorage.setItem(STORAGE_KEY, nameMode); } catch (e) { /* ignore */ }
        render();
      });
    }
    render();
  }).catch((err) => {
    grid.innerHTML = `<p class="no-results">Could not load the pantheon data. (${escapeHtml(err.message)})</p>`;
    console.error(err);
  });
}

document.addEventListener("DOMContentLoaded", initLandingPage);
