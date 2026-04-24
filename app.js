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
    .on("click", (e, d) => inspectSkill(d.skill));

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
    .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; });
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
    const h = document.createElement("h3");
    h.textContent = "Shared triggers (potential double routing)";
    h.style.cssText = "color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; margin: 0 0 12px;";
    root.appendChild(h);
    shared.forEach(([trigger, owners]) => {
      const card = document.createElement("div");
      card.className = "conflict-card";
      card.innerHTML = `
        <h4><span class="badge shared">shared</span> "${trigger}"</h4>
        <p class="muted">Listed as a trigger by ${owners.length} skills. Pick one owner or qualify the phrasing.</p>
        <div class="skills-row">${owners.map(n => skillChipHtml(n)).join("")}</div>
      `;
      root.appendChild(card);
    });
  }

  if (antis.length) {
    const h = document.createElement("h3");
    h.textContent = "Anti-routes (do NOT use X — use Y)";
    h.style.cssText = "color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; margin: 18px 0 12px;";
    root.appendChild(h);
    antis.forEach(a => {
      const card = document.createElement("div");
      card.className = "conflict-card";
      card.innerHTML = `
        <h4><span class="badge anti">anti-route</span> ${a.from} → ${a.to}</h4>
        <p class="muted">"${escapeHtml(a.ctx)}"</p>
      `;
      root.appendChild(card);
    });
  }
}

function skillChipHtml(name) {
  const s = STATE.skills.find(x => x.name === name);
  const c = s ? colorFor(s.category) : "#94a3b8";
  return `<span class="skill-chip" data-skill="${name}"><span class="swatch" style="background:${c}"></span>${name}</span>`;
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
  `;
  detail.querySelectorAll("[data-skill]").forEach(el =>
    el.onclick = () => {
      const tgt = STATE.skills.find(x => x.name === el.dataset.skill);
      if (tgt) inspectSkill(tgt);
    });
  detail.querySelectorAll("[data-trigger]").forEach(el =>
    el.onclick = () => inspectTrigger(el.dataset.trigger));
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

// boot
ingest(window.SEED_SKILLS);
rebuildAll();
