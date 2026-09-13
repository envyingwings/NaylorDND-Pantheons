/* Renders an individual deity page (deity.html?d=slug) from deities.json. */

function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("d");
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

function pantheonMemberHtml(m) {
  const nameHtml = m.has_page
    ? `<a class="m-name" href="deity.html?d=${encodeURIComponent(m.slug)}">${renderInline(m.name)}</a>`
    : `<span class="m-name">${renderInline(m.name)}</span>`;
  const blurb = m.blurb ? `<span class="m-blurb">${renderInline(m.blurb)}</span>` : "";
  return `<div class="pantheon-member${m.has_page ? "" : " no-page"}">${nameHtml}${blurb}</div>`;
}

function appendixHtml(d) {
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
  const grid = members.map(pantheonMemberHtml).join("");
  return `
    <section class="deity-section">
      ${heading}
      <div class="pantheon-grid">${grid}</div>
    </section>
  `;
}

function renderDeityPage(d) {
  document.title = `${d.name} — The Ourosi Pantheon`;
  document.getElementById("crumb-name").textContent = d.name;

  const html = `
    <div class="deity-hero">
      <img class="symbol" src="${iconPath(d.slug)}" alt="${escapeHtml(d.name)} symbol">
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
    ${appendixHtml(d)}
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
      renderDeityPage(d);
    })
    .catch((err) => {
      container.innerHTML = `<p class="empty-note">Could not load deity data. (${escapeHtml(err.message)})</p>`;
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", initDeityPage);
