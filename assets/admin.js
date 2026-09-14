/* Admin editor for The Ourosi Pantheon. Runs entirely client-side against
 * an in-memory copy of deities.json. Nothing here writes back to disk or
 * to GitHub automatically -- see admin.html's banner and the README. */

let ADMIN_DATA = null;       // full array, loaded once, edited in place
let CURRENT_SLUG = null;     // slug of the deity currently shown in the editor
let DIRTY_SLUGS = new Set(); // slugs with unsaved edits since last load/download

const ALIGNMENT_OPTIONS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

function setStatus(msg, kind) {
  const el = document.getElementById("admin-status");
  el.textContent = msg;
  el.className = "admin-status" + (kind ? " " + kind : "");
}

function blankDeity(slug) {
  return {
    slug,
    name: "",
    portfolio: "",
    alignment: "",
    domains: [],
    status: [],
    warlock_province: [],
    tags: [],
    cover_file: null,
    intro: [],
    infobox: { Alignment: "", Symbol: "", Portfolio: "", "Divine Realm": "", Worshippers: "" },
    titles_line: "",
    domains_line: "",
    commandments: [],
    appendix: null,
    source_file: null,
    is_placeholder: false,
  };
}

/* ---------------- Loading ---------------- */

async function loadData(forceNetwork) {
  const res = await fetch("data/deities.json" + (forceNetwork ? `?t=${Date.now()}` : ""));
  if (!res.ok) throw new Error("Failed to load data/deities.json: " + res.status);
  ADMIN_DATA = await res.json();
  DIRTY_SLUGS = new Set();
  CURRENT_SLUG = null;
}

function findDeity(slug) {
  return ADMIN_DATA.find((d) => d.slug === slug);
}

/* ---------------- Sidebar list ---------------- */

function renderSidebarList(filterText) {
  const list = document.getElementById("admin-deity-list");
  const q = (filterText || "").trim().toLowerCase();
  const sorted = [...ADMIN_DATA].sort((a, b) => {
    if (a.is_placeholder !== b.is_placeholder) return a.is_placeholder ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
  const filtered = q
    ? sorted.filter((d) => d.name.toLowerCase().includes(q) || d.slug.includes(q))
    : sorted;

  if (filtered.length === 0) {
    list.innerHTML = '<li class="empty-note" style="cursor:default;">No matches.</li>';
    return;
  }

  list.innerHTML = filtered.map((d) => {
    const active = d.slug === CURRENT_SLUG ? " active" : "";
    const dirty = DIRTY_SLUGS.has(d.slug) ? '<span class="tag-unsaved" title="Unsaved changes">\u25CF</span>' : "";
    const placeholderTag = d.is_placeholder ? '<span class="tag-placeholder">stub</span>' : "";
    return '<li data-slug="' + escapeHtml(d.slug) + '" class="' + active.trim() + '">' +
      '<span>' + escapeHtml(d.name || "(untitled)") + '</span>' +
      '<span style="display:flex;gap:6px;align-items:center;">' + placeholderTag + dirty + '</span>' +
      '</li>';
  }).join("");

  list.querySelectorAll("li[data-slug]").forEach((li) => {
    li.addEventListener("click", () => {
      CURRENT_SLUG = li.dataset.slug;
      renderSidebarList(document.getElementById("admin-search").value);
      renderEditor(CURRENT_SLUG);
    });
  });
}

/* ---------------- Editor form ---------------- */

function markDirty(slug) {
  DIRTY_SLUGS.add(slug);
  renderSidebarList(document.getElementById("admin-search").value);
  setStatus("Unsaved changes in this browser tab. Download when ready.", "");
}

function fieldGroup(labelText, inputHtml, hint) {
  return '<div class="field-group"><label>' + escapeHtml(labelText) + '</label>' + inputHtml +
    (hint ? '<p class="field-hint">' + escapeHtml(hint) + '</p>' : "") + '</div>';
}

function textInput(id, value) {
  return '<input type="text" class="admin-input" id="' + id + '" value="' + escapeHtml(value || "") + '">';
}

function textArea(id, value, rows) {
  return '<textarea class="admin-textarea" id="' + id + '" rows="' + (rows || 3) + '">' + escapeHtml(value || "") + '</textarea>';
}

function alignmentSelect(id, value) {
  const opts = ALIGNMENT_OPTIONS.map((a) =>
    '<option value="' + a + '" ' + (a === value ? "selected" : "") + '>' + a + '</option>'
  ).join("");
  return '<select class="admin-select" id="' + id + '"><option value="">\u2014 none \u2014</option>' + opts + '</select>';
}

function renderListEditor(containerId, items, placeholder, isTextarea) {
  const rows = items.map((val, i) => {
    const input = isTextarea ? textArea(containerId + "-item-" + i, val, 2) : textInput(containerId + "-item-" + i, val);
    return '<div class="list-editor-item" data-index="' + i + '">' + input +
      '<button type="button" class="icon-btn danger" data-remove-index="' + i + '" title="Remove">\u2715</button></div>';
  }).join("");
  return '<div class="list-editor" id="' + containerId + '">' + rows + '</div>' +
    '<button type="button" class="btn btn-secondary btn-small" data-add-to="' + containerId + '" style="margin-top:8px;">+ Add ' + escapeHtml(placeholder) + '</button>';
}

function renderAppendixEditor(appendix) {
  const app = appendix || { title: "", members: [] };
  const memberRows = (app.members || []).map((m, i) => {
    return '<div class="appendix-member-row" data-index="' + i + '">' +
      '<div class="row-header"><strong style="color:var(--ink-faint); font-size:0.78rem;">Member ' + (i + 1) + '</strong>' +
      '<button type="button" class="icon-btn danger" data-remove-member="' + i + '" title="Remove member">\u2715</button></div>' +
      '<div class="field-row">' +
      fieldGroup("Name", textInput("appendix-member-name-" + i, m.name)) +
      fieldGroup("Slug (for linking)", textInput("appendix-member-slug-" + i, m.slug)) +
      '</div>' +
      fieldGroup("Blurb (optional)", textArea("appendix-member-blurb-" + i, m.blurb, 2)) +
      '</div>';
  }).join("");

  return fieldGroup("Appendix / Sub-pantheon Title", textInput("appendix-title", app.title),
      'e.g. "Vassals of Asmodeus \u2014 Archdukes of Baator". Leave blank if this deity has no sub-pantheon.') +
    '<div class="field-group"><label>Pantheon Members</label>' +
    '<div id="appendix-members-list">' + (memberRows || '<p class="empty-note">No members yet.</p>') + '</div>' +
    '<button type="button" class="btn btn-secondary btn-small" id="add-appendix-member" style="margin-top:8px;">+ Add Member</button></div>';
}

function renderEditor(slug) {
  const editor = document.getElementById("admin-editor");
  const d = findDeity(slug);
  if (!d) {
    editor.innerHTML = '<p class="empty-note">Deity not found.</p>';
    return;
  }

  const infobox = d.infobox || {};
  const subtitleBits = ["Slug: " + escapeHtml(d.slug)];
  if (d.is_placeholder) subtitleBits.push("placeholder page");
  if (d.source_file) subtitleBits.push("from " + escapeHtml(d.source_file));

  editor.innerHTML =
    '<h2>' + escapeHtml(d.name || "(untitled)") + '</h2>' +
    '<p class="editor-subtitle">' + subtitleBits.join(" \u00B7 ") + '</p>' +

    fieldGroup("Display Name", textInput("f-name", d.name),
      'Format: "Name, Epithet" (e.g. "Asmodeus, Lord of the Nine Hells"). The landing page can show just the name, just the epithet, or both.') +

    '<div class="field-row">' +
    fieldGroup("Slug (URL identifier)", textInput("f-slug", d.slug), "Changing this breaks any existing links to this page. Use lowercase-with-hyphens.") +
    fieldGroup("Alignment", alignmentSelect("f-alignment", d.alignment)) +
    '</div>' +

    fieldGroup("Portfolio", textInput("f-portfolio", d.portfolio), 'Shown under the name on cards and the deity page, e.g. "Greater God of Virtue, Honour, and Justice".') +

    '<div class="field-group"><label><input type="checkbox" id="f-is-placeholder" ' + (d.is_placeholder ? "checked" : "") + '> This is a placeholder (unwritten) page</label>' +
    '<p class="field-hint">Placeholder pages show a "not yet written" notice and don\'t appear on the main landing grid.</p></div>' +

    '<hr class="section-divider">' +

    '<div class="field-group"><label>Intro Paragraph(s)</label>' + renderListEditor("f-intro", d.intro || [], "Paragraph", true) + '</div>' +

    '<hr class="section-divider">' +

    '<h3 style="font-family:var(--display); color:var(--ink); font-size:1rem; margin-bottom:14px;">Infobox</h3>' +
    '<div class="field-row">' +
    fieldGroup("Symbol", textInput("f-infobox-symbol", infobox.Symbol)) +
    fieldGroup("Divine Realm", textInput("f-infobox-realm", infobox["Divine Realm"])) +
    '</div>' +
    fieldGroup("Worshippers", textInput("f-infobox-worshippers", infobox.Worshippers)) +

    '<hr class="section-divider">' +

    '<div class="field-row">' +
    fieldGroup("Titles", textInput("f-titles-line", d.titles_line), "Comma-separated list shown as \"Titles: ...\" on the deity page.") +
    fieldGroup("Domains (display line)", textInput("f-domains-line", d.domains_line), "Comma-separated list shown as \"Domains: ...\" on the deity page.") +
    '</div>' +

    '<hr class="section-divider">' +

    '<div class="field-group"><label>Commandments</label>' + renderListEditor("f-commandments", d.commandments || [], "Commandment", true) + '</div>' +

    '<hr class="section-divider">' +

    '<h3 style="font-family:var(--display); color:var(--ink); font-size:1rem; margin-bottom:14px;">Appendix / Sub-pantheon</h3>' +
    '<div id="appendix-editor-container">' + renderAppendixEditor(d.appendix) + '</div>' +

    '<div class="danger-zone"><button type="button" class="btn" id="delete-deity-btn" style="border-color:#7a2b3a; color:#c9645f;">Delete this deity</button></div>';

  wireEditorEvents(d);
}

/* ---------------- Wiring form -> data model ---------------- */

function collectListValues(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];
  return [...container.querySelectorAll(".list-editor-item")].map((row) => {
    const input = row.querySelector("input, textarea");
    return input ? input.value : "";
  }).filter((v) => v.trim() !== "");
}

function wireEditorEvents(d) {
  const editor = document.getElementById("admin-editor");

  function onAnyChange() {
    saveFormIntoModel(d);
    markDirty(d.slug);
  }

  editor.querySelectorAll(".admin-input, .admin-textarea, .admin-select").forEach((el) => {
    el.addEventListener("input", onAnyChange);
    el.addEventListener("change", onAnyChange);
  });
  const placeholderCheckbox = document.getElementById("f-is-placeholder");
  if (placeholderCheckbox) placeholderCheckbox.addEventListener("change", onAnyChange);

  editor.querySelectorAll("[data-add-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const containerId = btn.dataset.addTo;
      const container = document.getElementById(containerId);
      const index = container.querySelectorAll(".list-editor-item").length;
      const row = document.createElement("div");
      row.className = "list-editor-item";
      row.dataset.index = index;
      row.innerHTML = textArea(containerId + "-item-" + index, "", 2) +
        '<button type="button" class="icon-btn danger" data-remove-index="' + index + '" title="Remove">\u2715</button>';
      container.appendChild(row);
      row.querySelector("textarea").addEventListener("input", onAnyChange);
      row.querySelector("[data-remove-index]").addEventListener("click", () => {
        row.remove();
        onAnyChange();
      });
      row.querySelector("textarea").focus();
    });
  });
  editor.querySelectorAll("[data-remove-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".list-editor-item").remove();
      onAnyChange();
    });
  });

  const addMemberBtn = document.getElementById("add-appendix-member");
  if (addMemberBtn) {
    addMemberBtn.addEventListener("click", () => {
      saveFormIntoModel(d);
      if (!d.appendix) d.appendix = { title: "", members: [] };
      d.appendix.members.push({ name: "", slug: "", blurb: "", has_page: true });
      renderEditor(d.slug);
      markDirty(d.slug);
    });
  }
  editor.querySelectorAll("[data-remove-member]").forEach((btn) => {
    btn.addEventListener("click", () => {
      saveFormIntoModel(d);
      const idx = parseInt(btn.dataset.removeMember, 10);
      d.appendix.members.splice(idx, 1);
      renderEditor(d.slug);
      markDirty(d.slug);
    });
  });

  const deleteBtn = document.getElementById("delete-deity-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (!confirm('Delete "' + d.name + '" from this dataset? This cannot be undone in this session (though you can reload from disk to get it back, losing all other unsaved edits).')) return;
      ADMIN_DATA = ADMIN_DATA.filter((x) => x.slug !== d.slug);
      DIRTY_SLUGS.delete(d.slug);
      CURRENT_SLUG = null;
      renderSidebarList(document.getElementById("admin-search").value);
      document.getElementById("admin-editor").innerHTML = '<p class="empty-note">Deity deleted. Select another from the list.</p>';
      setStatus('Deleted "' + d.name + '" in this session. Download to make it permanent.', "");
    });
  }
}

function saveFormIntoModel(d) {
  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : undefined;
  };

  const newSlug = (val("f-slug") || d.slug).trim();
  const slugChanged = newSlug !== d.slug;

  d.name = val("f-name") || "";
  d.portfolio = val("f-portfolio") || "";
  d.alignment = val("f-alignment") || "";
  const placeholderCb = document.getElementById("f-is-placeholder");
  d.is_placeholder = placeholderCb ? !!placeholderCb.checked : d.is_placeholder;

  d.infobox = d.infobox || {};
  d.infobox.Alignment = d.alignment;
  d.infobox.Symbol = val("f-infobox-symbol") || "";
  d.infobox.Portfolio = d.portfolio;
  d.infobox["Divine Realm"] = val("f-infobox-realm") || "";
  d.infobox.Worshippers = val("f-infobox-worshippers") || "";

  d.titles_line = val("f-titles-line") || "";
  d.domains_line = val("f-domains-line") || "";

  d.intro = collectListValues("f-intro");
  d.commandments = collectListValues("f-commandments");

  const appendixTitle = val("appendix-title");
  const memberRows = [...document.querySelectorAll(".appendix-member-row")];
  if ((appendixTitle && appendixTitle.trim()) || memberRows.length > 0) {
    const members = memberRows.map((row, i) => ({
      name: val("appendix-member-name-" + i) || "",
      slug: val("appendix-member-slug-" + i) || "",
      blurb: val("appendix-member-blurb-" + i) || "",
      has_page: true,
    })).filter((m) => m.name.trim() !== "");
    d.appendix = { title: appendixTitle || "", members };
  } else {
    d.appendix = null;
  }

  if (slugChanged) {
    if (ADMIN_DATA.some((x) => x !== d && x.slug === newSlug)) {
      setStatus('Slug "' + newSlug + '" is already used by another deity \u2014 rename skipped.', "error");
    } else {
      DIRTY_SLUGS.delete(d.slug);
      d.slug = newSlug;
      CURRENT_SLUG = newSlug;
      DIRTY_SLUGS.add(newSlug);
    }
  }
}

/* ---------------- New deity / download / reload ---------------- */

function createNewDeity() {
  let base = "new-deity";
  let n = 1;
  let slug = base;
  while (findDeity(slug)) {
    n += 1;
    slug = base + "-" + n;
  }
  const d = blankDeity(slug);
  ADMIN_DATA.push(d);
  CURRENT_SLUG = slug;
  DIRTY_SLUGS.add(slug);
  renderSidebarList(document.getElementById("admin-search").value);
  renderEditor(slug);
  setStatus("New deity created. Fill in the fields below.", "");
}

function downloadData() {
  if (CURRENT_SLUG) {
    const d = findDeity(CURRENT_SLUG);
    if (d) saveFormIntoModel(d);
  }
  const blob = new Blob([JSON.stringify(ADMIN_DATA, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "deities.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setStatus("Downloaded deities.json with " + ADMIN_DATA.length + " entries. Replace data/deities.json with this file, then commit and push.", "success");
}

async function reloadData() {
  if (DIRTY_SLUGS.size > 0) {
    if (!confirm("You have unsaved changes in this tab. Reloading will discard them. Continue?")) return;
  }
  try {
    await loadData(true);
    renderSidebarList("");
    document.getElementById("admin-editor").innerHTML = '<p class="empty-note">Select a deity from the list, or click "New Deity" to create one.</p>';
    document.getElementById("admin-search").value = "";
    setStatus("Reloaded from data/deities.json.", "success");
  } catch (err) {
    setStatus("Could not reload: " + err.message, "error");
  }
}

/* ---------------- Init ---------------- */

async function initAdmin() {
  try {
    await loadData(false);
  } catch (err) {
    document.getElementById("admin-editor").innerHTML =
      '<p class="empty-note">Could not load data/deities.json (' + escapeHtml(err.message) + '). Make sure you\'re viewing this page through a local server, not a file:// URL.</p>';
    return;
  }

  renderSidebarList("");

  document.getElementById("admin-search").addEventListener("input", (e) => {
    renderSidebarList(e.target.value);
  });
  document.getElementById("new-deity-btn").addEventListener("click", createNewDeity);
  document.getElementById("download-btn").addEventListener("click", downloadData);
  document.getElementById("reload-btn").addEventListener("click", reloadData);

  window.addEventListener("beforeunload", (e) => {
    if (DIRTY_SLUGS.size > 0) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", initAdmin);
