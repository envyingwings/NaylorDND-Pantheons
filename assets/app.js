/* Shared utilities + landing page logic for The Ourosi Pantheon wiki. */

const DATA_URL = "data/deities.json";

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

function iconPath(slug) {
  return `assets/icons/${slug}.svg`;
}

/* ---------------- Landing page ---------------- */

function deityCardHtml(d) {
  return `
    <a class="deity-card" href="deity.html?d=${encodeURIComponent(d.slug)}" data-slug="${d.slug}">
      <img class="symbol" src="${iconPath(d.slug)}" alt="${escapeHtml(d.name)} symbol" loading="lazy">
      <h2>${renderInline(d.name)}</h2>
      <p class="portfolio">${renderInline(d.portfolio || "")}</p>
      <span class="alignment-tag">${escapeHtml(d.alignment || "Unaligned")}</span>
    </a>
  `;
}

function initLandingPage() {
  const grid = document.getElementById("deity-grid");
  const searchInput = document.getElementById("search");
  const alignmentFilter = document.getElementById("alignment-filter");
  const resultCount = document.getElementById("result-count");
  if (!grid) return;

  loadDeities().then((deities) => {
    // Placeholders (unwritten pantheon members) don't appear in the main
    // directory -- only real, fully-written deity pages do. Placeholders
    // are still reachable by following a link from a deity's Appendix.
    const real = deities.filter((d) => !d.is_placeholder);

    // Sort alphabetically by display name (ignoring leading articles/titles noise)
    const sorted = [...real].sort((a, b) => a.name.localeCompare(b.name));

    // Populate alignment filter options
    const alignments = [...new Set(sorted.map((d) => d.alignment).filter(Boolean))].sort();
    alignments.forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      alignmentFilter.appendChild(opt);
    });

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
      grid.innerHTML = filtered.map(deityCardHtml).join("");
    }

    searchInput.addEventListener("input", render);
    alignmentFilter.addEventListener("change", render);
    render();
  }).catch((err) => {
    grid.innerHTML = `<p class="no-results">Could not load the pantheon data. (${escapeHtml(err.message)})</p>`;
    console.error(err);
  });
}

document.addEventListener("DOMContentLoaded", initLandingPage);
