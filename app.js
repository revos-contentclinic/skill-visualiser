// ─────────────────────────────────────────────────────────────────────────────
// Skill Visualiser — parses SKILL.md frontmatter, renders network graph,
// trigger cloud, and conflict report.
// ─────────────────────────────────────────────────────────────────────────────

const STATE = {
  skills: [],          // [{name, description, category, version, triggers[], routes[{target,type,context}]}]
  triggerIndex: {},    // trigger -> [skillName...]
  selected: null,      // currently inspected skill name or trigger
};

// ── Parser ───────────────────────────────────────────────────────────────────
function parseSkillMarkdown(raw, filename = "uploaded.md") {
  // Extract frontmatter between first two --- lines
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];

  const name = fieldValue(fm, "name");
  if (!name) return null;
  const description = foldedValue(fm, "description");
  const version = fieldValue(fm, "version");
  const category = fieldValue(fm, "category") || "uncategorised";

  const triggers = extractTriggers(description);
  const body = raw.slice(fmMatch[0].length);

  return {
    name,
    description: description || "",
    version: version || "",
    category,
    filename,
    triggers,
    body,
    raw, // full original markdown — used by the editor
    routes: [], // filled later when we know all skill names
  };
}

function fieldValue(fm, key) {
  const m = fm.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"));
  return m ? m[1].trim() : "";
}

// Folded scalar (description: > followed by indented lines)
function foldedValue(fm, key) {
  const re = new RegExp(`^\\s*${key}:\\s*>?\\s*\\n((?:[ \\t]+.+\\n?)+)`, "m");
  const m = fm.match(re);
  if (!m) {
    const inline = fieldValue(fm, key);
    return inline;
  }
  return m[1]
    .split("\n")
    .map(l => l.replace(/^\s+/, ""))
    .filter(Boolean)
    .join(" ")
    .trim();
}

function extractTriggers(description) {
  if (!description) return [];
  // Look for "Triggers:" segment, then collect quoted strings until the next sentence/period+space
  const triggers = new Set();
  // Find all "Triggers:" or "Triggers " sections
  const segRe = /Triggers?:\s*(.+?)(?:\.\s+[A-Z]|$)/gs;
  let m;
  while ((m = segRe.exec(description)) !== null) {
    const seg = m[1];
    const quoted = seg.match(/["']([^"']+)["']/g);
    if (quoted) quoted.forEach(q => triggers.add(q.replace(/^["']|["']$/g, "").toLowerCase().trim()));
  }
  // Also harvest any standalone quoted phrases close to trigger-language verbs (light fallback)
  return [...triggers];
}

// ── Routing extraction ──────────────────────────────────────────────────────
// For each skill, scan its description for OTHER skill names. Classify each
// occurrence as "anti-route" (negative routing) or "handoff" (positive routing)
// based on surrounding context.
function extractRoutes(skill, allNames) {
  const routes = [];
  const desc = skill.description.toLowerCase();
  for (const target of allNames) {
    if (target === skill.name) continue;
    let i = 0;
    while ((i = desc.indexOf(target.toLowerCase(), i)) !== -1) {
      const start = Math.max(0, i - 90);
      const end = Math.min(desc.length, i + target.length + 30);
      const ctx = desc.slice(start, end);
      const isAnti = /\b(do not|don't|never|rather than|those are|that's|use\s+\w[\w-]*\s+for that)\b/.test(ctx);
      routes.push({
        target,
        type: isAnti ? "anti" : "handoff",
        context: skill.description.slice(start, end).trim(),
      });
      i += target.length;
    }
  }
  // Dedupe (target+type)
  const seen = new Set();
  return routes.filter(r => {
    const k = r.target + "|" + r.type;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ── Build STATE ─────────────────────────────────────────────────────────────
function ingest(rawArr) {
  const parsed = rawArr
    .map(({ raw, filename }) => parseSkillMarkdown(raw, filename))
    .filter(Boolean);
  // Merge with existing, dedupe by name
  const byName = new Map(STATE.skills.map(s => [s.name, s]));
  parsed.forEach(s => byName.set(s.name, s));
  STATE.skills = [...byName.values()];

  const names = STATE.skills.map(s => s.name);
  STATE.skills.forEach(s => { s.routes = extractRoutes(s, names); });

  // Trigger index
  STATE.triggerIndex = {};
  STATE.skills.forEach(s => {
    s.triggers.forEach(t => {
      (STATE.triggerIndex[t] ||= []).push(s.name);
    });
  });
}

// ── Rendering ───────────────────────────────────────────────────────────────
const CATEGORY_VAR = {
  "foundational-operating-system": "--cat-foundational",
  "belief-operating-system": "--cat-belief",
  "voice-and-routing": "--cat-voice",
  "brand-philosophy": "--cat-brand",
  "strategic-alignment": "--cat-strategy",
  "marketing-strategy": "--cat-marketing",
  "diagnostic-router": "--cat-diagnostic",
  "audience-intelligence": "--cat-audience",
  "framework-router": "--cat-framework",
  "writing-framework-catalogue": "--cat-writing",
};
function colorFor(category) {
  const v = CATEGORY_VAR[category] || "--cat-default";
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#94a3b8";
}

// ── Graph ────────────────────────────────────────────────────────────────────
function renderGraph() {
  const svg = d3.select("#graph");
  svg.selectAll("*").remove();

  const el = document.getElementById("graph");
  const width = el.clientWidth;
  const height = el.clientHeight;
  svg.attr("viewBox", [0, 0, width, height]);

  const nodes = STATE.skills.map(s => ({
    id: s.name,
    category: s.category,
    triggers: s.triggers.length,
    skill: s,
  }));

  const links = [];
  // handoff + anti edges
  STATE.skills.forEach(s => {
    s.routes.forEach(r => {
      links.push({ source: s.name, target: r.target, type: r.type, context: r.context });
    });
  });
  // shared-trigger edges
  Object.entries(STATE.triggerIndex).forEach(([trigger, owners]) => {
    if (owners.length < 2) return;
    for (let i = 0; i < owners.length; i++) {
      for (let j = i + 1; j < owners.length; j++) {
        links.push({ source: owners[i], target: owners[j], type: "shared", trigger });
      }
    }
  });

  // Apply filters
  const enabled = {
    handoff: document.getElementById("f-handoff").checked,
    anti: document.getElementById("f-anti").checked,
    shared: document.getElementById("f-shared").checked,
  };
  const filteredLinks = links.filter(l => enabled[l.type]);

  const sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(filteredLinks).id(d => d.id).distance(140).strength(0.5))
    .force("charge", d3.forceManyBody().strength(-450))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(50));

  // Zoomable root group — all graph contents go inside this
  const root = svg.append("g").attr("class", "zoom-root");

  const zoom = d3.zoom()
    .scaleExtent([0.2, 5])
    .filter(event => {
      // Allow wheel zoom always; for drag-pan, ignore drags that start on a node
      if (event.type === "wheel") return true;
      return !event.target.closest(".node");
    })
    .on("zoom", e => root.attr("transform", e.transform));

  svg.call(zoom).on("dblclick.zoom", () => {
    svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
  });

  const linkSel = root.append("g")
    .attr("stroke-width", 1.6)
    .selectAll("line")
    .data(filteredLinks)
    .join("line")
    .attr("class", d => `link ${d.type}`)
    .on("mouseover", (e, d) => {
      const ctx = d.type === "shared" ? `Shared trigger: "${d.trigger}"` : d.context || "";
      inspectEdge(d, ctx);
    });

  const nodeSel = root.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .call(drag(sim))
    .on("click", (e, d) => inspectSkill(d.skill))
    .on("dblclick", (e, d) => {
      // Release a pinned node back to the simulation
      d.fx = null; d.fy = null;
      d3.select(e.currentTarget).classed("pinned", false);
      sim.alpha(0.3).restart();
      e.stopPropagation();
    });

  nodeSel.append("circle")
    .attr("r", d => 14 + Math.min(10, d.triggers))
    .attr("fill", d => colorFor(d.category))
    .attr("stroke", "#0e0f13")
    .attr("stroke-width", 2);

  nodeSel.append("text")
    .attr("dy", d => 28 + Math.min(10, d.triggers))
    .text(d => d.id);

  sim.on("tick", () => {
    linkSel
      .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);
  });
}

function drag(sim) {
  return d3.drag()
    .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
    .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on("end", function (e, d) {
      if (!e.active) sim.alphaTarget(0);
      // Pin the node where the user dropped it — don't snap back.
      // Double-click releases it.
      d.fx = e.x; d.fy = e.y;
      d3.select(this).classed("pinned", true);
    });
}

// ── Trigger Cloud ────────────────────────────────────────────────────────────
function renderCloud() {
  const cloud = document.getElementById("cloud");
  cloud.innerHTML = "";
  const entries = Object.entries(STATE.triggerIndex)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  entries.forEach(([trigger, owners]) => {
    const span = document.createElement("span");
    span.className = "trigger" + (owners.length > 1 ? " shared" : "");
    span.style.fontSize = (12 + Math.min(8, trigger.length / 6)) + "px";
    span.innerHTML = `${trigger}<span class="count">${owners.length}</span>`;
    span.onclick = () => inspectTrigger(trigger);
    cloud.appendChild(span);
  });
}

// ── Conflicts panel ─────────────────────────────────────────────────────────
function renderConflicts() {
  const root = document.getElementById("conflicts");
  root.innerHTML = "";

  // 1) Shared triggers
  const shared = Object.entries(STATE.triggerIndex).filter(([_, owners]) => owners.length > 1);
  // 2) Anti-routes
  const antis = [];
  STATE.skills.forEach(s => s.routes.forEach(r => { if (r.type === "anti") antis.push({ from: s.name, to: r.target, ctx: r.context }); }));

  if (!shared.length && !antis.length) {
    root.innerHTML = `<p class="muted">No shared triggers and no anti-routes detected.</p>`;
    return;
  }

  if (shared.length) {
    root.appendChild(sectionHeader("Shared triggers (potential double routing)"));
    shared.forEach(([trigger, owners]) => {
      root.appendChild(buildConflictCard({
        kind: "shared",
        title: `"${trigger}"`,
        subtitle: `Listed as a trigger by ${owners.length} skills. Pick one owner or qualify the phrasing.`,
        skills: owners,
      }));
    });
  }

  if (antis.length) {
    root.appendChild(sectionHeader("Anti-routes (do NOT use X — use Y)"));
    antis.forEach(a => {
      root.appendChild(buildConflictCard({
        kind: "anti",
        title: `${a.from} → ${a.to}`,
        subtitle: `"${a.ctx}"`,
        skills: [a.from, a.to],
      }));
    });
  }
}

function sectionHeader(text) {
  const h = document.createElement("h3");
  h.textContent = text;
  h.style.cssText = "color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; margin: 18px 0 12px;";
  return h;
}

function buildConflictCard({ kind, title, subtitle, skills }) {
  const card = document.createElement("div");
  card.className = "conflict-card";
  card.innerHTML = `
    <h4><span class="badge ${kind}">${kind === "shared" ? "shared" : "anti-route"}</span> ${escapeHtml(title)}</h4>
    <p class="muted">${escapeHtml(subtitle)}</p>
    <div class="skills-row">${skills.map(n => skillChipHtml(n)).join("")}</div>
    <button class="details-toggle" type="button">▸ View descriptions</button>
    <div class="details-body" hidden></div>
  `;

  // Skill chips → inspect on the right
  card.querySelectorAll(".skill-chip[data-skill]").forEach(el => {
    el.addEventListener("click", () => {
      const s = STATE.skills.find(x => x.name === el.dataset.skill);
      if (s) inspectSkill(s);
    });
  });

  // Expand/collapse details
  const toggle = card.querySelector(".details-toggle");
  const body = card.querySelector(".details-body");
  toggle.addEventListener("click", () => {
    const open = !body.hidden;
    if (open) {
      body.hidden = true;
      toggle.textContent = "▸ View descriptions";
    } else {
      body.innerHTML = renderDetailsBody(skills);
      body.hidden = false;
      toggle.textContent = "▾ Hide descriptions";
      // Wire inspect/edit per skill block
      body.querySelectorAll("[data-inspect]").forEach(b => b.addEventListener("click", () => {
        const s = STATE.skills.find(x => x.name === b.dataset.inspect);
        if (s) inspectSkill(s);
      }));
      body.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => {
        const s = STATE.skills.find(x => x.name === b.dataset.edit);
        if (s) openEditor(s);
      }));
    }
  });

  return card;
}

function renderDetailsBody(skillNames) {
  return skillNames
    .map(name => {
      const s = STATE.skills.find(x => x.name === name);
      if (!s) return `<div class="detail-block missing">⚠ <strong>${escapeHtml(name)}</strong> — referenced but not loaded. Add the SKILL.md to fix this.</div>`;
      const triggers = s.triggers
        .map(t => {
          const isShared = (STATE.triggerIndex[t] || []).length > 1;
          return `<span class="pill${isShared ? " shared" : ""}">${escapeHtml(t)}</span>`;
        })
        .join("");
      return `
        <div class="detail-block">
          <div class="detail-head">
            <span class="swatch" style="background:${colorFor(s.category)}"></span>
            <strong>${escapeHtml(s.name)}</strong>
            <span class="muted">v${escapeHtml(s.version || "?")} · ${escapeHtml(s.category)}</span>
            <span class="spacer"></span>
            <button class="mini" data-inspect="${escapeAttr(s.name)}">Inspect</button>
            <button class="mini primary" data-edit="${escapeAttr(s.name)}">✎ Edit</button>
          </div>
          <p class="detail-desc">${escapeHtml(s.description)}</p>
          ${triggers ? `<div class="triggers">${triggers}</div>` : ""}
        </div>
      `;
    })
    .join("");
}

function skillChipHtml(name) {
  const s = STATE.skills.find(x => x.name === name);
  const c = s ? colorFor(s.category) : "#94a3b8";
  const missing = s ? "" : " missing";
  return `<span class="skill-chip${missing}" data-skill="${escapeAttr(name)}"><span class="swatch" style="background:${c}"></span>${escapeHtml(name)}${s ? "" : " ⚠"}</span>`;
}

// ── Inspect panel ────────────────────────────────────────────────────────────
function inspectSkill(s) {
  STATE.selected = s.name;
  highlightSelectedListItem();
  const detail = document.getElementById("detail");
  const handoffs = s.routes.filter(r => r.type === "handoff");
  const antis = s.routes.filter(r => r.type === "anti");
  detail.innerHTML = `
    <h3>Inspect</h3>
    <h4 style="color:${colorFor(s.category)};">${s.name}</h4>
    <div class="row">v${s.version || "?"} · ${s.category}</div>
    <div class="row">${s.triggers.length} triggers · ${handoffs.length} handoffs · ${antis.length} anti-routes</div>
    <div class="desc">${escapeHtml(s.description)}</div>
    ${s.triggers.length ? `<div class="row"><strong style="color:var(--text)">Triggers</strong></div>
      <div class="triggers">${s.triggers.map(t => {
        const shared = STATE.triggerIndex[t] && STATE.triggerIndex[t].length > 1;
        return `<span class="pill${shared ? " shared" : ""}" data-trigger="${escapeAttr(t)}">${t}</span>`;
      }).join("")}</div>` : ""}
    ${handoffs.length ? `<div class="row"><strong style="color:var(--handoff)">Handoffs</strong></div>
      <div class="triggers">${handoffs.map(h => `<span class="pill" data-skill="${h.target}">→ ${h.target}</span>`).join("")}</div>` : ""}
    ${antis.length ? `<div class="row"><strong style="color:var(--anti)">Anti-routes</strong></div>
      <div class="triggers">${antis.map(h => `<span class="pill" data-skill="${h.target}">⊘ ${h.target}</span>`).join("")}</div>` : ""}
    <button class="edit-btn" data-edit="${s.name}">✎ Edit this skill</button>
  `;
  detail.querySelectorAll("[data-skill]").forEach(el =>
    el.onclick = () => {
      const tgt = STATE.skills.find(x => x.name === el.dataset.skill);
      if (tgt) inspectSkill(tgt);
    });
  detail.querySelectorAll("[data-trigger]").forEach(el =>
    el.onclick = () => inspectTrigger(el.dataset.trigger));
  detail.querySelector(".edit-btn").onclick = () => openEditor(s);
}

// ── Editor ───────────────────────────────────────────────────────────────────
// Live preview only. Edits stay in browser memory and update the visualisation
// on Apply. Nothing is written to disk — the user copies the description back
// into the original SKILL.md themselves and re-uploads to Claude.

function openEditor(s) {
  const detail = document.getElementById("detail");
  detail.innerHTML = `
    <h3>Edit · ${escapeHtml(s.name)}</h3>
    <div class="editor-note">
      You can edit the description here temporarily to see the new connections.
      Once you're satisfied, <strong>copy this description</strong> and replace the original one you have.
      Remember to upload to Claude again.
    </div>
    <div class="editor">
      <textarea id="editor-area" spellcheck="false">${escapeHtml(s.raw || "")}</textarea>
      <div class="editor-actions">
        <button class="primary" id="editor-apply">Apply changes</button>
        <button id="editor-cancel">Cancel</button>
      </div>
    </div>
  `;
  document.getElementById("editor-cancel").onclick = () => inspectSkill(s);
  document.getElementById("editor-apply").onclick = () => applyEdit(s);
}

function applyEdit(originalSkill) {
  const newRaw = document.getElementById("editor-area").value;
  const reparsed = parseSkillMarkdown(newRaw, originalSkill.filename || originalSkill.name + ".md");
  if (!reparsed) {
    toast("Couldn't parse — frontmatter missing or malformed.");
    return;
  }
  reparsed.raw = newRaw;
  // Replace in STATE by ORIGINAL name (in case the name was changed in the edit)
  const idx = STATE.skills.findIndex(x => x.name === originalSkill.name);
  if (idx === -1) STATE.skills.push(reparsed); else STATE.skills[idx] = reparsed;
  // Recompute routes for ALL skills — names may have shifted
  const names = STATE.skills.map(s => s.name);
  STATE.skills.forEach(s => { s.routes = extractRoutes(s, names); });
  // Trigger index
  STATE.triggerIndex = {};
  STATE.skills.forEach(s => s.triggers.forEach(t => (STATE.triggerIndex[t] ||= []).push(s.name)));

  rebuildAll();
  toast("Preview updated. Copy the description and replace it in your original SKILL.md.");
  inspectSkill(reparsed);
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function inspectTrigger(trigger) {
  const owners = STATE.triggerIndex[trigger] || [];
  const detail = document.getElementById("detail");
  detail.innerHTML = `
    <h3>Inspect</h3>
    <h4>"${trigger}"</h4>
    <div class="row">${owners.length} skill${owners.length === 1 ? "" : "s"} declare this trigger</div>
    <div class="triggers">${owners.map(n => skillChipHtml(n)).join("")}</div>
    ${owners.length > 1 ? `<p class="muted" style="margin-top:12px;">⚠ Same phrase in multiple skills — model may pick either, or both. Decide one owner.</p>` : ""}
  `;
  detail.querySelectorAll("[data-skill]").forEach(el =>
    el.onclick = () => {
      const tgt = STATE.skills.find(x => x.name === el.dataset.skill);
      if (tgt) inspectSkill(tgt);
    });
}

function inspectEdge(link, ctx) {
  const detail = document.getElementById("detail");
  const a = typeof link.source === "object" ? link.source.id : link.source;
  const b = typeof link.target === "object" ? link.target.id : link.target;
  detail.innerHTML = `
    <h3>Inspect</h3>
    <h4>${a} ↔ ${b}</h4>
    <div class="row">type: ${link.type}</div>
    <p class="desc">${escapeHtml(ctx)}</p>
  `;
}

function escapeHtml(s) { return (s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function escapeAttr(s) { return escapeHtml(s); }

// ── Skill list (left sidebar) ────────────────────────────────────────────────
function renderSkillList() {
  const ul = document.getElementById("skills-ul");
  ul.innerHTML = "";
  STATE.skills.sort((a, b) => a.name.localeCompare(b.name)).forEach(s => {
    const li = document.createElement("li");
    li.dataset.name = s.name;
    li.innerHTML = `<span class="swatch" style="background:${colorFor(s.category)}"></span>${s.name}`;
    li.onclick = () => inspectSkill(s);
    ul.appendChild(li);
  });
  document.getElementById("count").textContent = STATE.skills.length;
}

function highlightSelectedListItem() {
  document.querySelectorAll("#skills-ul li").forEach(li => {
    li.classList.toggle("active", li.dataset.name === STATE.selected);
  });
}

// ── View switching ──────────────────────────────────────────────────────────
function setView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
  if (name === "graph") renderGraph();
  if (name === "cloud") renderCloud();
  if (name === "conflicts") renderConflicts();
}

// ── Wire up ─────────────────────────────────────────────────────────────────
function rebuildAll() {
  renderSkillList();
  renderGraph();
  renderCloud();
  renderConflicts();
}

document.getElementById("upload").addEventListener("change", async e => {
  const files = [...e.target.files];
  const reads = await Promise.all(files.map(f => f.text().then(raw => ({ raw, filename: f.name }))));
  ingest(reads);
  rebuildAll();
  e.target.value = "";
});

document.getElementById("reset-btn").addEventListener("click", () => {
  STATE.skills = [];
  STATE.triggerIndex = {};
  ingest(window.SEED_SKILLS);
  rebuildAll();
});

document.querySelectorAll(".tab").forEach(t =>
  t.addEventListener("click", () => setView(t.dataset.view)));

["f-handoff", "f-anti", "f-shared"].forEach(id =>
  document.getElementById(id).addEventListener("change", () => renderGraph()));

window.addEventListener("resize", () => {
  if (document.getElementById("view-graph").classList.contains("active")) renderGraph();
});

// ── Guide modal ─────────────────────────────────────────────────────────────
const GUIDE = {
  edges: `
    <h3>How edges in the Network view are derived</h3>
    <p>Every edge is computed automatically by parsing each skill's frontmatter <code>description</code>. Edges fall into three categories:</p>

    <div class="edge-block handoff">
      <strong>Green — Handoff / loads / refers</strong>
      Skill A names skill B in its description in a positive way: "load <code>belief-mechanics</code>", "hands off to <code>writing-frameworks</code>", "use <code>aliz-voice</code> for the draft".
      <p><strong>What this means:</strong> the model is told to follow A → B in this situation. The chain is intentional.</p>
      <p><strong>When it's a problem:</strong> chains that loop (A → B → A), references to skills that don't exist, or vague handoffs that don't say <em>when</em> to follow them.</p>
    </div>

    <div class="edge-block anti">
      <strong>Red dashed — Anti-route ("do NOT use this — use that")</strong>
      Skill A explicitly tells the model <em>not</em> to use it for some case, and points to skill B instead. Detected from phrases like "Do NOT use for X — use Y", "rather than", "those are roi-of-calm".
      <p><strong>Why this is good:</strong> negative routing is the strongest disambiguation signal Claude has. The PDF guide calls this "negative triggers" and recommends them whenever two skills are adjacent.</p>
      <p><strong>When it's a problem:</strong> two skills both anti-route at each other in conflicting ways → confusion. Or an anti-route to a skill that doesn't exist → broken reference.</p>
    </div>

    <div class="edge-block shared">
      <strong>Amber dotted — Shared trigger</strong>
      Two or more skills list the same exact phrase in their <code>Triggers:</code> list. The visualiser draws a dotted line between every pair that shares one.
      <p><strong>Why this is bad:</strong> when the user types that phrase, Claude must pick one skill. With identical triggers it picks roughly at random — or worse, loads both. This is the most common cause of routing accidents.</p>
      <p><strong>The fix:</strong> pick a single owner for each phrase. Tighten the loser's trigger with a qualifier ("market pressure <em>for clients</em>"), or remove it entirely and let the anti-route do the work.</p>
    </div>

    <div class="callout">
      <strong>Inspector tip:</strong> click any node to see its triggers (amber pills = shared), handoffs (→), and anti-routes (⊘). Click a trigger to see who else owns it.
    </div>
  `,
  anatomy: `
    <h3>Progressive Disclosure — the 3-level architecture</h3>
    <p>Every skill has three layers. Knowing which layer is doing the work is the difference between a skill that fires correctly and one that bloats context.</p>
    <ul>
      <li><strong>Level 1 — YAML frontmatter</strong> (always loaded). Routing layer. Tells Claude <em>whether</em> to load the rest.</li>
      <li><strong>Level 2 — SKILL.md body</strong> (loaded only if Level 1 routes). Instruction layer. The actual recipe.</li>
      <li><strong>Level 3 — linked files</strong> in <code>/references/</code>, <code>/assets/</code>. Discovery layer. Claude opens these only when needed.</li>
    </ul>
    <p>The visualiser only looks at Level 1, because that's where every routing decision is made.</p>

    <h3>Required frontmatter fields</h3>
    <ul>
      <li><code>name</code> — kebab-case, no spaces, no "claude" or "anthropic"</li>
      <li><code>description</code> — under 1024 chars, no XML tags, must say <em>what</em> the skill does AND <em>when</em> to use it</li>
    </ul>

    <h3>Recommended fields</h3>
    <ul>
      <li><code>metadata.version</code> — semantic version</li>
      <li><code>metadata.category</code> — used by the visualiser for colouring</li>
      <li><code>metadata.author</code></li>
    </ul>
  `,
  descriptions: `
    <h3>What makes a description good</h3>
    <p>The description field is the most important sentence in the whole skill. It's the only thing Claude sees when deciding whether to route.</p>
    <ul>
      <li><strong>Dual-purpose</strong> — what the skill does + when to use it. Both, in the first sentence.</li>
      <li><strong>Actionable specificity</strong> — "Generates developer handoff documentation from Figma files" beats "Helps with design".</li>
      <li><strong>User-centric phrasing</strong> — write triggers in the words a human would actually say, not technical jargon.</li>
      <li><strong>File types</strong> — if the skill handles ".csv" or ".pdf", say so explicitly.</li>
      <li><strong>Negative routing</strong> — "Do NOT use for X — use <code>other-skill</code>" is a strong disambiguator.</li>
    </ul>

    <h3>Common description anti-patterns</h3>
    <ul>
      <li><strong>Vague</strong>: "Helps with projects", "Provides assistance"</li>
      <li><strong>Implementation-focused</strong>: "Implements the Project entity model" — describes code, not a user task</li>
      <li><strong>Over-verbose</strong>: dumping the whole instruction set into Level 1. Wastes tokens and dilutes the routing signal.</li>
      <li><strong>Broad overlaps</strong>: "Documents" without saying which kind</li>
    </ul>

    <div class="callout">
      <strong>Limit:</strong> 1024 characters total for the description. If you need more, push detail into the body or <code>/references/</code>.
    </div>
  `,
  triggers: `
    <h3>Writing triggers that actually fire</h3>
    <p>Triggers are the phrases inside the description (or the body of a skill) that signal "this is when to load me". The model treats them as patterns to match against the user's words.</p>
    <ul>
      <li>Use the <em>verbs</em> and <em>nouns</em> a real user would say: "fix the bug", "design this offer", "write this for me".</li>
      <li>Bake in domain context: "RevOS market pressure" beats "market pressure" if other skills also cover that phrase.</li>
      <li>Include paraphrases. Don't rely on a single phrasing — give 4–8 variations.</li>
    </ul>

    <h3>Trigger anti-patterns (cause over- and under-triggering)</h3>
    <ul>
      <li><strong>Generic words</strong>: "data", "documents", "content" — match too much.</li>
      <li><strong>Internal jargon only</strong>: phrases the team uses but the user doesn't.</li>
      <li><strong>Identical triggers</strong> across skills — the visualiser shows these as amber edges and pills.</li>
    </ul>

    <h3>Test your triggers</h3>
    <ul>
      <li>Does the skill fire on the obvious task?</li>
      <li>Does it fire on paraphrased versions of the same task?</li>
      <li>Does it stay silent on unrelated topics?</li>
    </ul>
  `,
  conflicts: `
    <h3>Reading the Conflicts panel</h3>
    <p>The Conflicts view shows two things the visualiser flagged automatically.</p>

    <h3>Shared triggers</h3>
    <p>The same phrase appears in 2+ skills' trigger lists. When a user types that phrase, Claude has no deterministic way to pick — it may pick either, or load both.</p>
    <p><strong>Fix options:</strong></p>
    <ul>
      <li>Pick one owner. Remove the trigger from the others.</li>
      <li>Add a qualifier so the phrase becomes unique ("market pressure" → "RevOS market pressure" vs "client market pressure").</li>
      <li>Add an explicit anti-route in the loser's description so it pushes back when accidentally loaded.</li>
    </ul>

    <h3>Anti-routes</h3>
    <p>These are <em>good</em> — they're the deliberate "do NOT use X — use Y" boundaries. The panel surfaces them so you can audit:</p>
    <ul>
      <li>Does the target skill exist? (broken targets = a name that doesn't match anything in the visualiser)</li>
      <li>Are there pairs of skills that anti-route at <em>each other</em>? That's a sign of overlap that needs a clearer split.</li>
      <li>Does every skill that <em>should</em> have an anti-route have one? Adjacent skills almost always need at least one.</li>
    </ul>

    <h3>Other things to look for in the Network view</h3>
    <ul>
      <li><strong>Orphan nodes</strong> — no edges in or out. Either it's truly standalone or its description is too vague to route.</li>
      <li><strong>Hub nodes</strong> — many handoffs going through one skill. Usually fine for a "router" skill (e.g. <code>aliz-diagnostic</code>), suspicious for a tactical one.</li>
      <li><strong>Loops</strong> — A → B → A. Not always wrong, but worth confirming.</li>
    </ul>

    <div class="callout">
      <strong>Editing workflow:</strong> click a flagged skill → "✎ Edit this skill" → tweak the description → Apply changes. The graph updates instantly so you can preview the new connections. Once you're happy, copy the description back into your original SKILL.md and re-upload it to Claude. The visualiser never writes to your files.
    </div>
  `,
};

function renderGuide(tab) {
  document.getElementById("guide-body").innerHTML = GUIDE[tab];
  document.querySelectorAll(".guide-tab").forEach(b => b.classList.toggle("active", b.dataset.guide === tab));
}

document.getElementById("guide-btn").addEventListener("click", () => {
  document.getElementById("guide-modal").hidden = false;
  renderGuide("edges");
});
document.getElementById("guide-close").addEventListener("click", () => {
  document.getElementById("guide-modal").hidden = true;
});
document.getElementById("guide-modal").addEventListener("click", e => {
  if (e.target.id === "guide-modal") e.target.hidden = true;
});
document.querySelectorAll(".guide-tab").forEach(b =>
  b.addEventListener("click", () => renderGuide(b.dataset.guide)));

// boot
ingest(window.SEED_SKILLS);
rebuildAll();
