/* Renders an individual deity page (deity.html?d=slug) from deities.json. */

function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("d");
}

/* Reshapes one entry from a multi-aspect deity's `aspects` array into an
 * object the existing single-deity render helpers (infoboxHtml, introHtml,
 * metaRowHtml, commandmentsHtml, appendixHtml, iconPath) can consume
 * unchanged, as if it were an ordinary flat deity record. */
function aspectAsDeity(parent, aspect) {
  return {
    slug: aspect.aspect_slug,
    name: aspect.name,
    portfolio: aspect.portfolio,
    alignment: aspect.alignment,
    domains: parent.domains,
    status: parent.status,
    intro: aspect.intro,
    infobox: aspect.infobox,
    titles_line: aspect.titles_line,
    domains_line: aspect.domains_line,
    commandments: aspect.commandments,
    appendix: aspect.appendix,
    icon_ext: aspect.icon_ext,
  };
}

function aspectTabsHtml(parent, activeAspectSlug) {
  const tabs = parent.aspects
    .map((a) => {
      const isActive = a.aspect_slug === activeAspectSlug;
      const shortLabel = a.name.split(",")[0];
      return `<button type="button" class="aspect-tab${isActive ? " active" : ""}" data-aspect="${escapeHtml(a.aspect_slug)}">${escapeHtml(shortLabel)}</button>`;
    })
    .join("");
  return `<div class="aspect-tabs" id="aspect-tabs">${tabs}</div>`;
}

function renderMultiAspectPage(parent, placeholderSlugs) {
  const params = new URLSearchParams(window.location.search);
  const requestedAspect = params.get("aspect");
  const validSlugs = new Set(parent.aspects.map((a) => a.aspect_slug));
  const activeSlug = validSlugs.has(requestedAspect) ? requestedAspect : parent.default_aspect;

  document.title = `${parent.name} — The Ourosi Pantheon`;
  document.getElementById("crumb-name").textContent = parent.name;

  function renderAspect(aspectSlug) {
    const aspect = parent.aspects.find((a) => a.aspect_slug === aspectSlug);
    const view = aspectAsDeity(parent, aspect);
    const html = `
      ${aspectTabsHtml(parent, aspectSlug)}
      <div class="deity-hero">
        <img class="symbol" src="${iconPath(view)}" alt="${escapeHtml(view.name)} symbol">
        <div class="deity-hero-text">
          <h1>${renderInline(view.name)}</h1>
          <p class="portfolio">${renderInline(view.portfolio || "")}</p>
          ${metaRowHtml(view)}
        </div>
      </div>
      ${infoboxHtml(view)}
      ${introHtml(view)}
      ${titlesDomainsHtml(view)}
      ${commandmentsHtml(view)}
      ${appendixHtml(view, placeholderSlugs)}
    `;
    document.getElementById("deity-content").innerHTML = html;

    // Update the URL (without reloading) so the active tab is shareable/
    // bookmarkable and survives a refresh, then wire up the new tab buttons.
    const url = new URL(window.location.href);
    url.searchParams.set("aspect", aspectSlug);
    window.history.replaceState({}, "", url);

    document.querySelectorAll(".aspect-tab").forEach((btn) => {
      btn.addEventListener("click", () => renderAspect(btn.dataset.aspect));
    });
  }

  renderAspect(activeSlug);
}

function infoboxHtml(d) {
  const rows = [];
  const box = d.infobox || {};
  const order = ["Alignment", "Symbol", "Portfolio", "Divine Realm", "Worshippers"];
  order.forEach((key) => {
    if (box[key]) rows.push([key, box[key]]);
  });
  // Any leftover keys not in the standard order
  Object.keys(box).forEach((key) => {
    if (!order.includes(key)) rows.push([key, box[key]]);
  });
  if (rows.length === 0) return "";
  const dl = rows
    .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${renderInline(v)}</dd>`)
    .join("");
  return `<div class="infobox"><dl>${dl}</dl></div>`;
}

function metaRowHtml(d) {
  const pills = [];
  if (d.alignment) pills.push(`<span class="meta-pill alignment">${escapeHtml(d.alignment)}</span>`);
  (d.domains || []).forEach((dom) => pills.push(`<span class="meta-pill">${escapeHtml(dom)} Domain</span>`));
  (d.status || []).forEach((s) => pills.push(`<span class="meta-pill">${escapeHtml(s)}</span>`));
  if (pills.length === 0) return "";
  return `<div class="meta-row">${pills.join("")}</div>`;
}

function introHtml(d) {
  if (!d.intro || d.intro.length === 0) return "";
  const paras = d.intro.map((p) => `<p>${renderInline(p)}</p>`).join("");
  return `<div class="deity-section intro">${paras}</div>`;
}

function titlesDomainsHtml(d) {
  const lines = [];
  if (d.titles_line) lines.push(`<p><strong>Titles:</strong> ${renderInline(d.titles_line)}</p>`);
  if (d.domains_line) lines.push(`<p><strong>Domains:</strong> ${renderInline(d.domains_line)}</p>`);
  if (lines.length === 0) return "";
  return `<div class="deity-section" style="margin-bottom:24px;">${lines.join("")}</div>`;
}

function commandmentsHtml(d) {
  if (!d.commandments || d.commandments.length === 0) return "";
  const items = d.commandments.map((c) => `<li>${renderInline(c)}</li>`).join("");
  return `
    <section class="deity-section">
      <h2>Commandments</h2>
      <ul class="commandments">${items}</ul>
    </section>
  `;
}

// Maps an appendix member's original link text to the specific aspect it
// should open on a multi-aspect page, so following "Aerdrie Faenya" from
// (say) Corellon's appendix lands on the Aerdrie tab rather than whichever
// aspect happens to be the page's default. Matched case-insensitively
// against the start of the member's display name.
const ASPECT_LINK_HINTS = [
  { match: /^aerdrie/i, slug: "seha-angharradh", aspect: "aerdrie" },
  { match: /^hanali/i, slug: "seha-angharradh", aspect: "hanali" },
  { match: /^sehanine/i, slug: "seha-angharradh", aspect: "sehanine" },
  { match: /^angharradh/i, slug: "seha-angharradh", aspect: "angharradh" },
  { match: /^seha-angharradh/i, slug: "seha-angharradh", aspect: "angharradh" },
];

function resolveMemberHref(m) {
  const hint = ASPECT_LINK_HINTS.find((h) => h.slug === m.slug && h.match.test(m.name));
  const aspectParam = hint ? `&aspect=${encodeURIComponent(hint.aspect)}` : "";
  return `deity.html?d=${encodeURIComponent(m.slug)}${aspectParam}`;
}

function pantheonMemberHtml(m, placeholderSlugs) {
  const isPlaceholder = placeholderSlugs.has(m.slug);
  const nameHtml = `<a class="m-name" href="${resolveMemberHref(m)}">${renderInline(m.name)}</a>`;
  const blurb = m.blurb ? `<span class="m-blurb">${renderInline(m.blurb)}</span>` : "";
  const stubTag = isPlaceholder ? `<span class="stub-tag">unwritten</span>` : "";
  return `<div class="pantheon-member${isPlaceholder ? " no-page" : ""}">${nameHtml}${stubTag}${blurb}</div>`;
}

function appendixHtml(d, placeholderSlugs) {
  if (!d.appendix) return "";
  const { title, members } = d.appendix;
  const heading = title ? `<h2>${renderInline(title)}</h2>` : `<h2>Appendix</h2>`;
  if (!members || members.length === 0) {
    return `
      <section class="deity-section">
        ${heading}
        <p class="empty-note">No pantheon members listed.</p>
      </section>
    `;
  }
  const grid = members.map((m) => pantheonMemberHtml(m, placeholderSlugs)).join("");
  return `
    <section class="deity-section">
      ${heading}
      <div class="pantheon-grid">${grid}</div>
    </section>
  `;
}

function renderDeityPage(d, placeholderSlugs) {
  document.title = `${d.name} — The Ourosi Pantheon`;
  document.getElementById("crumb-name").textContent = d.name;

  if (d.is_placeholder) {
    document.getElementById("deity-content").innerHTML = `
      <div class="deity-hero">
        <img class="symbol" src="${iconPath(d)}" alt="${escapeHtml(d.name)} symbol">
        <div class="deity-hero-text">
          <h1>${renderInline(d.name)}</h1>
          <p class="portfolio">This deity's page has not been written yet.</p>
        </div>
      </div>
      <div class="deity-section">
        <p class="empty-note">${escapeHtml(d.name)} is named as part of a pantheon elsewhere on this wiki, but doesn't have a full entry of their own yet. Check back later, or follow a link back to the deity whose page mentioned them.</p>
      </div>
    `;
    return;
  }

  const html = `
    <div class="deity-hero">
      <img class="symbol" src="${iconPath(d)}" alt="${escapeHtml(d.name)} symbol">
      <div class="deity-hero-text">
        <h1>${renderInline(d.name)}</h1>
        <p class="portfolio">${renderInline(d.portfolio || "")}</p>
        ${metaRowHtml(d)}
      </div>
    </div>
    ${infoboxHtml(d)}
    ${introHtml(d)}
    ${titlesDomainsHtml(d)}
    ${commandmentsHtml(d)}
    ${appendixHtml(d, placeholderSlugs)}
  `;
  document.getElementById("deity-content").innerHTML = html;
}

function initDeityPage() {
  const container = document.getElementById("deity-content");
  const slug = getSlugFromQuery();
  if (!slug) {
    container.innerHTML = `<p class="empty-note">No deity specified.</p>`;
    return;
  }
  loadDeities()
    .then((deities) => {
      const d = deities.find((x) => x.slug === slug);
      if (!d) {
        container.innerHTML = `<p class="empty-note">No deity found for "${escapeHtml(slug)}".</p>`;
        return;
      }
      const placeholderSlugs = new Set(deities.filter((x) => x.is_placeholder).map((x) => x.slug));
      if (d.multi_aspect && Array.isArray(d.aspects) && d.aspects.length > 0) {
        renderMultiAspectPage(d, placeholderSlugs);
      } else {
        renderDeityPage(d, placeholderSlugs);
      }
    })
    .catch((err) => {
      container.innerHTML = `<p class="empty-note">Could not load deity data. (${escapeHtml(err.message)})</p>`;
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", initDeityPage);
