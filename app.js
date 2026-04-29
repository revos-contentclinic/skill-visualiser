(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const SVG_W = 1400;
  const SVG_H = 1100;
  const NODE_W = 210;
  const NODE_H = 78;
  const LAYER_HEIGHT = 140;
  const LAYER_PAD_TOP = 60;

  const POSITIONS = {
    "gaia-protocol":         { x: 700, layer: 1 },
    "roi-of-calm":           { x: 700, layer: 2 },
    "belief-mechanics":      { x: 480, layer: 3 },
    "growth-strategy":       { x: 920, layer: 3 },
    "revos-frameworks":      { x: 700, layer: 4 },
    "narrative-positioning": { x: 700, layer: 5 },
    "wfts-juror-panel":      { x: 400, layer: 6 },
    "aliz-diagnostic":       { x: 760, layer: 6 },
    "writing-frameworks":    { x: 480, layer: 7 },
    "aliz-voice":            { x: 920, layer: 7 }
  };

  function layerYCenter(layer) {
    return LAYER_PAD_TOP + (layer - 0.5) * LAYER_HEIGHT;
  }

  function getNodeRect(skillId) {
    const pos = POSITIONS[skillId];
    const cx = pos.x;
    const cy = layerYCenter(pos.layer);
    return { x: cx - NODE_W / 2, y: cy - NODE_H / 2, w: NODE_W, h: NODE_H, cx, cy, layer: pos.layer };
  }

  function getNodeEdgePoint(skillId, tx, ty) {
    const r = getNodeRect(skillId);
    const dx = tx - r.cx;
    const dy = ty - r.cy;
    if (dx === 0 && dy === 0) return { x: r.cx, y: r.cy };
    const ax = NODE_W / 2;
    const ay = NODE_H / 2;
    const scaleX = Math.abs(dx) > 0 ? ax / Math.abs(dx) : Infinity;
    const scaleY = Math.abs(dy) > 0 ? ay / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);
    return { x: r.cx + dx * scale, y: r.cy + dy * scale };
  }

  function bezierPath(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (Math.abs(dy) < 8) {
      const cx = (from.x + to.x) / 2;
      const cy = from.y - Math.min(45, Math.abs(dx) * 0.18);
      return `M ${from.x} ${from.y} Q ${cx} ${cy}, ${to.x} ${to.y}`;
    }
    const c1x = from.x;
    const c1y = from.y + dy * 0.5;
    const c2x = to.x;
    const c2y = to.y - dy * 0.5;
    return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
  }

  function el(tag, attrs, children) {
    const e = document.createElementNS(SVG_NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (children) children.forEach(c => e.appendChild(c));
    return e;
  }

  function renderLayerBands() {
    const g = document.getElementById("layer-bands");
    g.innerHTML = "";
    window.LAYERS.forEach(layer => {
      const top = LAYER_PAD_TOP + (layer.num - 1) * LAYER_HEIGHT;
      g.appendChild(el("rect", {
        class: `layer-band layer-${layer.num}`,
        x: 0, y: top, width: SVG_W, height: LAYER_HEIGHT
      }));
      const labelY = top + 22;
      const lbl = el("text", { class: "layer-label", x: 28, y: labelY });
      lbl.textContent = `L${layer.num} · ${layer.label}`;
      g.appendChild(lbl);
      const sub = el("text", { class: "layer-sublabel", x: 28, y: labelY + 14 });
      sub.textContent = layer.subtitle;
      g.appendChild(sub);
    });
  }

  function renderEdges() {
    const g = document.getElementById("edges");
    const labelG = document.getElementById("edge-labels");
    g.innerHTML = "";
    labelG.innerHTML = "";

    window.EDGES.forEach(edge => {
      const fromR = getNodeRect(edge.from);
      const toR = getNodeRect(edge.to);
      const fromPt = getNodeEdgePoint(edge.from, toR.cx, toR.cy);
      const toPt = getNodeEdgePoint(edge.to, fromR.cx, fromR.cy);
      const path = bezierPath(fromPt, toPt);

      const attrs = {
        class: `edge edge-${edge.type}`,
        d: path,
        "data-from": edge.from,
        "data-to": edge.to,
        "data-type": edge.type,
        "marker-end": `url(#arrow-${edge.type})`
      };
      if (edge.bidirectional) attrs["marker-start"] = `url(#arrow-${edge.type})`;
      g.appendChild(el("path", attrs));

      const midX = (fromPt.x + toPt.x) / 2;
      const midY = (fromPt.y + toPt.y) / 2;

      const bg = el("rect", {
        class: "edge-label-bg",
        x: midX - edge.label.length * 3 - 4,
        y: midY - 8,
        width: edge.label.length * 6 + 8,
        height: 14,
        rx: 3,
        "data-from": edge.from,
        "data-to": edge.to
      });
      labelG.appendChild(bg);

      const label = el("text", {
        class: "edge-label",
        x: midX, y: midY + 3,
        "text-anchor": "middle",
        "data-from": edge.from, "data-to": edge.to
      });
      label.textContent = edge.label;
      labelG.appendChild(label);
    });
  }

  function renderNodes() {
    const g = document.getElementById("nodes");
    g.innerHTML = "";

    window.SKILLS.forEach(skill => {
      const r = getNodeRect(skill.id);
      const node = el("g", {
        class: "node",
        "data-id": skill.id,
        transform: `translate(${r.x}, ${r.y})`
      });

      node.appendChild(el("rect", {
        class: `node-rect layer-${skill.layer}`,
        x: 0, y: 0, width: NODE_W, height: NODE_H, rx: 12
      }));

      const name = el("text", { class: "node-name", x: NODE_W / 2, y: 28 });
      name.textContent = skill.name;
      node.appendChild(name);

      const version = el("text", { class: "node-version", x: NODE_W / 2, y: 46 });
      version.textContent = `v${skill.version}`;
      node.appendChild(version);

      const roleText = skill.role.length > 42 ? skill.role.substring(0, 40) + "…" : skill.role;
      const role = el("text", { class: "node-role", x: NODE_W / 2, y: 64 });
      role.textContent = roleText;
      node.appendChild(role);

      node.addEventListener("mouseenter", () => onNodeHover(skill.id));
      node.addEventListener("mouseleave", () => onNodeLeave());
      node.addEventListener("click", () => onNodeClick(skill.id));

      g.appendChild(node);
    });
  }

  let activeSkill = null;
  let activeFlow = "all";

  function getConnectedSkills(skillId) {
    const set = new Set();
    window.EDGES.forEach(e => {
      if (e.from === skillId) set.add(e.to);
      if (e.to === skillId) set.add(e.from);
    });
    return set;
  }

  function applySkillHighlight(skillId) {
    const connected = getConnectedSkills(skillId);
    document.querySelectorAll("#edges .edge").forEach(e => {
      e.classList.remove("highlight", "dimmed");
      const f = e.getAttribute("data-from");
      const t = e.getAttribute("data-to");
      if (f === skillId || t === skillId) e.classList.add("highlight");
      else e.classList.add("dimmed");
    });
    document.querySelectorAll("#nodes .node").forEach(n => {
      n.classList.remove("dimmed", "active");
      const id = n.getAttribute("data-id");
      if (id === skillId) n.classList.add("active");
      else if (!connected.has(id)) n.classList.add("dimmed");
    });
    document.querySelectorAll("#edge-labels .edge-label, #edge-labels .edge-label-bg").forEach(l => {
      l.classList.remove("visible");
      const f = l.getAttribute("data-from");
      const t = l.getAttribute("data-to");
      if (f === skillId || t === skillId) l.classList.add("visible");
    });
    showSkillDetail(skillId);
  }

  function clearVisualHighlight() {
    document.querySelectorAll("#edges .edge").forEach(e => e.classList.remove("highlight", "dimmed"));
    document.querySelectorAll("#nodes .node").forEach(n => n.classList.remove("dimmed", "active"));
    document.querySelectorAll("#edge-labels .edge-label, #edge-labels .edge-label-bg").forEach(l => l.classList.remove("visible"));
  }

  function onNodeHover(skillId) {
    if (activeSkill) return;
    applySkillHighlight(skillId);
  }

  function onNodeLeave() {
    if (activeSkill) {
      applySkillHighlight(activeSkill);
      return;
    }
    if (activeFlow !== "all") {
      applyFlow(activeFlow);
      return;
    }
    clearVisualHighlight();
    showDefaultDetail();
  }

  function onNodeClick(skillId) {
    if (activeSkill === skillId) {
      activeSkill = null;
      onNodeLeave();
      document.querySelectorAll(".skill-list li").forEach(li => li.classList.remove("active"));
      return;
    }
    activeSkill = skillId;
    applySkillHighlight(skillId);
    document.querySelectorAll(".skill-list li").forEach(li => {
      li.classList.toggle("active", li.dataset.id === skillId);
    });
  }

  function applyFlow(flowId) {
    activeFlow = flowId;
    activeSkill = null;
    document.querySelectorAll(".skill-list li").forEach(li => li.classList.remove("active"));

    const flow = window.FLOWS.find(f => f.id === flowId);
    document.querySelectorAll(".flow").forEach(f => f.classList.toggle("active", f.dataset.id === flowId));
    document.getElementById("flow-desc").textContent = flow.description;

    if (!flow.highlightEdges) {
      clearVisualHighlight();
      showDefaultDetail();
      return;
    }

    const edgeKeys = new Set(flow.highlightEdges.map(e => `${e[0]}|${e[1]}`));
    document.querySelectorAll("#edges .edge").forEach(e => {
      e.classList.remove("highlight", "dimmed");
      const key = `${e.getAttribute("data-from")}|${e.getAttribute("data-to")}`;
      if (edgeKeys.has(key)) e.classList.add("highlight");
      else e.classList.add("dimmed");
    });
    document.querySelectorAll("#nodes .node").forEach(n => {
      n.classList.remove("dimmed", "active");
      if (!flow.highlightNodes.includes(n.getAttribute("data-id"))) n.classList.add("dimmed");
    });
    document.querySelectorAll("#edge-labels .edge-label, #edge-labels .edge-label-bg").forEach(l => l.classList.remove("visible"));
  }

  const LAYER_COLORS = ["", "#888", "#7a6cb0", "#5e8bb1", "#5fa07f", "#a87a4f", "#9866a5", "#a86666"];

  function showSkillDetail(skillId) {
    const skill = window.SKILLS.find(s => s.id === skillId);
    if (!skill) return;
    const c = LAYER_COLORS[skill.layer];
    const panel = document.getElementById("detail-panel");
    panel.innerHTML = `
      <div class="skill-detail">
        <h2>${skill.name}</h2>
        <div class="meta">
          <span class="badge">v${skill.version}</span>
          <span class="layer-pill" style="background:${c}26;color:${c};border:1px solid ${c}80;">L${skill.layer} · ${skill.layerLabel}</span>
        </div>
        <p class="role">${skill.role}</p>
        <p class="description">${skill.description}</p>
        <h4>Triggers</h4>
        <div class="triggers">
          ${skill.triggers.map(t => `<span class="trigger-pill">${t}</span>`).join("")}
        </div>
        <h4>How it fires</h4>
        <p class="fires">${skill.fires}</p>
      </div>
    `;
  }

  function showDefaultDetail() {
    document.getElementById("detail-panel").innerHTML = `
      <h3>Inspect a skill</h3>
      <p class="muted">Hover or click a node to see its role, triggers, and connections. Click flow tabs at left to highlight a path.</p>
    `;
  }

  function renderSidebar() {
    const flowsEl = document.getElementById("flows");
    flowsEl.innerHTML = "";
    window.FLOWS.forEach(flow => {
      const btn = document.createElement("button");
      btn.className = "flow" + (flow.id === "all" ? " active" : "");
      btn.dataset.id = flow.id;
      btn.textContent = flow.name;
      btn.addEventListener("click", () => applyFlow(flow.id));
      flowsEl.appendChild(btn);
    });
    document.getElementById("flow-desc").textContent = window.FLOWS[0].description;

    const layerEl = document.getElementById("layer-list");
    layerEl.innerHTML = "";
    window.LAYERS.forEach(layer => {
      const li = document.createElement("li");
      li.style.borderLeftColor = LAYER_COLORS[layer.num];
      li.innerHTML = `
        <span class="layer-num">L${layer.num}</span>
        <span class="layer-name">${layer.label}</span>
        <span class="layer-sub">${layer.subtitle}</span>
      `;
      layerEl.appendChild(li);
    });

    const skillEl = document.getElementById("skill-list");
    skillEl.innerHTML = "";
    window.SKILLS.forEach(skill => {
      const li = document.createElement("li");
      li.dataset.id = skill.id;
      li.innerHTML = `
        <span>${skill.name}</span>
        <span class="skill-version">v${skill.version}</span>
      `;
      li.addEventListener("click", () => onNodeClick(skill.id));
      li.addEventListener("mouseenter", () => onNodeHover(skill.id));
      li.addEventListener("mouseleave", () => onNodeLeave());
      skillEl.appendChild(li);
    });
  }

  function init() {
    renderLayerBands();
    renderEdges();
    renderNodes();
    renderSidebar();

    document.getElementById("legend-btn").addEventListener("click", () => {
      document.getElementById("legend-modal").hidden = false;
    });
    document.getElementById("legend-close").addEventListener("click", () => {
      document.getElementById("legend-modal").hidden = true;
    });
    document.getElementById("legend-modal").addEventListener("click", (e) => {
      if (e.target.id === "legend-modal") e.target.hidden = true;
    });
  }

  init();
})();
