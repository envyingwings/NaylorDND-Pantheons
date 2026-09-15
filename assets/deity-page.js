/* Renders an individual deity page (deity.html?d=slug) from deities.json. */

function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("d");
}

/* Reshapes one entry from a multi-aspect deity's `aspects` array into an
 * object the existing single-deity render helpers (infoboxHtml, introHtml,
 * metaRowHtml, commandmentsHtml, appendixHtml, iconPath) can consume
 * unchanged, as if it were an ordinary flat deity record. */
// The combined/default aspect (Angharradh) is the only one whose name is
// genuinely ambiguous depending on where the reader arrived from: the
// Greater Pantheon knows her as Seha-Angharradh, the Elven Pantheon lists
// her as Angharradh. Every other aspect (Aerdrie, Hanali, Sehanine) has one
// unambiguous name regardless of source. SOURCE_NAME_OVERRIDES supplies the
// full replacement name (used everywhere the name appears on the page: tab
// label, hero title, page title, breadcrumb) for the combined aspect only,
// keyed by the `source` URL param a link into this page was built with.
const SOURCE_NAME_OVERRIDES = {
  greater: { angharradh: "Seha-Angharradh, the Moonweaver" },
  elven: { angharradh: "Angharradh, the Moonweaver" },
};

function resolveAspectName(parent, aspect, source) {
  const overrides = SOURCE_NAME_OVERRIDES[source];
  if (overrides && overrides[aspect.aspect_slug]) return overrides[aspect.aspect_slug];
  return aspect.name;
}

function aspectAsDeity(parent, aspect, source) {
  return {
    slug: aspect.aspect_slug,
    name: resolveAspectName(parent, aspect, source),
    portfolio: aspect.portfolio,
    alignment: aspect.alignment,
    domains: parent.domains,
    status: parent.status,
    intro: aspect.intro,
    infobox: aspect.infobox,
    titles_line: aspect.titles_line,
    domains_line: aspect.domains_line,
    commandments: aspect.commandments,
    // Only the Angharradh block in the source carries its own ### Appendix
    // section; the other three aspects fall back to it here so the
    // Seldarine roster shows on every tab of this page, not just one.
    appendix: aspect.appendix || parent.appendix,
    // Only the combined/Angharradh aspect uses the merged page's own symbol
    // (the one shown on the Greater Pantheon page); Aerdrie, Hanali, and
    // Sehanine each keep their own distinct icon.
    icon_slug: aspect.aspect_slug === parent.default_aspect ? parent.slug : aspect.aspect_slug,
    icon_ext: aspect.aspect_slug === parent.default_aspect ? parent.icon_ext : aspect.icon_ext,
  };
}

function aspectTabsHtml(parent, activeAspectSlug, source) {
  const tabs = parent.aspects
    .map((a) => {
      const isActive = a.aspect_slug === activeAspectSlug;
      const shortLabel = resolveAspectName(parent, a, source).split(",")[0];
      return `<button type="button" class="aspect-tab${isActive ? " active" : ""}" data-aspect="${escapeHtml(a.aspect_slug)}">${escapeHtml(shortLabel)}</button>`;
    })
    .join("");
  return `<div class="aspect-tabs" id="aspect-tabs">${tabs}</div>`;
}

function renderMultiAspectPage(parent, placeholderSlugs, deities) {
  const params = new URLSearchParams(window.location.search);
  const requestedAspect = params.get("aspect");
  const validSlugs = new Set(parent.aspects.map((a) => a.aspect_slug));
  const activeSlug = validSlugs.has(requestedAspect) ? requestedAspect : parent.default_aspect;

  // Which pantheon's page linked here determines the vocabulary used
  // throughout this page for the combined/default aspect's name (see
  // SOURCE_NAME_OVERRIDES) -- "greater" if unspecified, since that's the
  // page's own top-level identity when reached without a specific source
  // hint (e.g. a direct URL or a bookmark).
  const source = SOURCE_NAME_OVERRIDES[params.get("source")] ? params.get("source") : "greater";

  function renderAspect(aspectSlug) {
    const aspect = parent.aspects.find((a) => a.aspect_slug === aspectSlug);
    const view = aspectAsDeity(parent, aspect, source);

    document.title = `${view.name} — The Ourosi Pantheon`;
    document.getElementById("crumb-name").textContent = view.name;

    const html = `
      ${aspectTabsHtml(parent, aspectSlug, source)}
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
      ${appendixHtml(view, placeholderSlugs, deities)}
    `;
    document.getElementById("deity-content").innerHTML = html;

    // Update the URL (without reloading) so the active tab and source
    // context are shareable/bookmarkable and survive a refresh, then wire
    // up the new tab buttons.
    const url = new URL(window.location.href);
    url.searchParams.set("aspect", aspectSlug);
    url.searchParams.set("source", source);
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

function resolveMemberHref(m, source) {
  const hint = ASPECT_LINK_HINTS.find((h) => h.slug === m.slug && h.match.test(m.name));
  const aspectParam = hint ? `&aspect=${encodeURIComponent(hint.aspect)}` : "";
  const sourceParam = hint && source ? `&source=${encodeURIComponent(source)}` : "";
  return `deity.html?d=${encodeURIComponent(m.slug)}${aspectParam}${sourceParam}`;
}

function pantheonMemberHtml(m, placeholderSlugs, source, iconLookup) {
  const isPlaceholder = placeholderSlugs.has(m.slug);
  const nameHtml = `<a class="m-name" href="${resolveMemberHref(m, source)}">${renderInline(m.name)}</a>`;
  const blurb = m.blurb ? `<span class="m-blurb">${renderInline(m.blurb)}</span>` : "";
  const stubTag = isPlaceholder ? `<span class="stub-tag">unwritten</span>` : "";
  const iconDeity = iconLookup ? iconLookup.get(m.slug) : null;
  const iconHtml = iconDeity
    ? `<img class="m-symbol" src="${iconPath(iconDeity)}" alt="${escapeHtml(m.name)} symbol" loading="lazy">`
    : "";
  return `<div class="pantheon-member${isPlaceholder ? " no-page" : ""}">${iconHtml}<div class="m-text">${nameHtml}${stubTag}${blurb}</div></div>`;
}

// Most pantheon member pages only carry an `### Appendix` heading (a link
// back to the roster) with no member bullets of their own -- only the
// pantheon's roster-holder page (e.g. Moradin for the Morndinsamman) has the
// full member list in its source file. resolveAppendix finds that populated
// roster elsewhere in `deities` by matching the appendix title, so every
// member of a pantheon shows the same roster grid as the roster-holder does,
// the same way aspectAsDeity already falls back to the parent's appendix.
function resolveAppendix(appendix, deities) {
  if (!appendix) return null;
  if (appendix.members && appendix.members.length > 0) return appendix;
  if (!appendix.title || !deities) return appendix;
  const holder = deities.find(
    (x) => x.appendix && x.appendix.title === appendix.title && x.appendix.members && x.appendix.members.length > 0
  );
  return holder ? holder.appendix : appendix;
}

function appendixHtml(d, placeholderSlugs, deities) {
  const appendix = resolveAppendix(d.appendix, deities);
  if (!appendix) return "";
  const { title, members } = appendix;
  // The appendix's own title identifies which pantheon it represents (e.g.
  // "Seldarine — Elven Pantheon"), which is exactly the "source" a reader
  // following one of its links should be considered to have come from --
  // independent of whatever pantheon the currently-viewed deity itself
  // belongs to.
  const source = title && /elven/i.test(title) ? "elven" : "greater";
  const heading = title ? `<h2>${renderInline(title)}</h2>` : `<h2>Appendix</h2>`;
  if (!members || members.length === 0) {
    return `
      <section class="deity-section">
        ${heading}
        <p class="empty-note">No pantheon members listed.</p>
      </section>
    `;
  }
  // Each member card shows the same symbol its own page uses, including the
  // auto-generated placeholder icon for members without a full page yet --
  // looked up here (by slug) rather than duplicated onto every member
  // record, since `deities` already carries icon_ext for every deity.
  const iconLookup = new Map((deities || []).map((x) => [x.slug, x]));
  const grid = members.map((m) => pantheonMemberHtml(m, placeholderSlugs, source, iconLookup)).join("");
  return `
    <section class="deity-section">
      ${heading}
      <div class="pantheon-grid">${grid}</div>
    </section>
  `;
}

function renderDeityPage(d, placeholderSlugs, deities) {
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
    ${appendixHtml(d, placeholderSlugs, deities)}
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
        renderMultiAspectPage(d, placeholderSlugs, deities);
      } else {
        renderDeityPage(d, placeholderSlugs, deities);
      }
    })
    .catch((err) => {
      container.innerHTML = `<p class="empty-note">Could not load deity data. (${escapeHtml(err.message)})</p>`;
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", initDeityPage);
