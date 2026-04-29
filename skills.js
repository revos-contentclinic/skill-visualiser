// 10-skill ecosystem — architecture map data
// Last verified: 2026-04-29 (Phase A audit complete + Path A/B framing cleanup)

window.SKILLS = [
  {
    id: "gaia-protocol",
    name: "gaia-protocol",
    version: "7.3.2",
    layer: 1,
    layerLabel: "BEDROCK",
    layerSubtitle: "silent guardrail underneath everything",
    role: "Constitutional bedrock — 5 Immutable Laws, 4 Laws of Transmission, Prime Identity Program",
    description: "Reality is a projection of belief. Circumstances are neutral. Force states are diagnostic signals, not problems to fix. Constitutional rules govern all downstream skills.",
    triggers: ["alignment check", "first principles", "Five Laws", "Four Laws of Transmission", "Prime Identity Program", "transmission physics", "predatory marketing check"],
    fires: "almost never directly — runs silently as premise underneath other skills"
  },
  {
    id: "roi-of-calm",
    name: "roi-of-calm",
    version: "3.3.3",
    layer: 2,
    layerLabel: "BRAND PHILOSOPHY",
    layerSubtitle: "always-on ethical filter",
    role: "8 Core Operating Principles · Cortisol-Free · Predatory Spectrum · Fiduciary (P2)",
    description: "Brand-philosophy stance applied inside any framework. Filter for Force-based language, manufactured scarcity, shame triggers, dark patterns. Power-based alternatives.",
    triggers: ["ROI of Calm", "cortisol-free", "is this ethical", "predatory check", "Humane Marketing", "Invitational Marketing", "stress audit"],
    fires: "filter runs always — no explicit load needed; engages automatically across diagnostic, writing, polishing"
  },
  {
    id: "belief-mechanics",
    name: "belief-mechanics",
    version: "3.0.4",
    layer: 3,
    layerLabel: "OPERATIONAL ENGINES",
    layerSubtitle: "diagnostic and strategic engines",
    role: "Belief diagnostic + neutraliser engine",
    description: "Black Box (27 tactics + 24 neutralisers) · Spectrum of Fear (11 levels) · Force Diagnostics (Hawkins as internal reference) · six-brick geometry · Resolution Through Inclusion",
    triggers: ["why are they stuck", "belief underneath", "map the Force state", "identify Black Box tactic", "find the neutraliser", "Spectrum of Fear", "audience belief diagnostic"],
    fires: "via aliz-diagnostic Steps 3/4/5 (NLM queries); rarely loaded directly — premises run silently"
  },
  {
    id: "growth-strategy",
    name: "growth-strategy",
    version: "3.3.3",
    layer: 3,
    layerLabel: "OPERATIONAL ENGINES",
    layerSubtitle: "diagnostic and strategic engines",
    role: "Jay Abraham + Rev11 biz strategy",
    description: "Three Growth Levers · Strategy of Preeminence · Rev11 (11 metrics across 6 Revenue Math + 4 Strategic Architecture + 1 Ideology, with CBBA goal-state) · client acquisition · retention/LTV",
    triggers: ["Rev11", "growth lever", "Jay", "preeminence", "sticking point", "risk reversal", "market pressure", "design this offer"],
    fires: "directly on Rev11 / growth questions; feeds Preeminence to wfts-juror-panel and pressure types to aliz-diagnostic; Rev11 = parallel walker to aliz-diagnostic"
  },
  {
    id: "revos-frameworks",
    name: "revos-frameworks",
    version: "2.8.3",
    layer: 4,
    layerLabel: "RevOS-IP CATALOGUE",
    layerSubtitle: "the 7 RevOS-unique frameworks",
    role: "7 RevOS-IP frameworks + GOLD ecosystem-reference + EPS designated future",
    description: "Trust Formula · Clarity Formula (AIPOVDA + 6-Step POV) · VVP (absorbed inside Clarity) · Clarity-to-Commitment · Criteria Gravity · Proprietary Value Stack · Referral Blueprint · GOLD (Rusydi's, taught inside RevOS) · EPS designated future",
    triggers: ["Trust Formula", "Clarity Formula", "VVP", "GOLD", "Clarity-to-Commitment", "Criteria Gravity", "Proprietary Value Stack"],
    fires: "via aliz-diagnostic Steps 5/6 (handhold surfacing) and writing-frameworks (Clarity Formula default + EPS reference)"
  },
  {
    id: "narrative-positioning",
    name: "narrative-positioning",
    version: "3.0.4",
    layer: 5,
    layerLabel: "LIVING SYNTHESIS",
    layerSubtitle: "per-project state cache",
    role: "Living skill v3.0.0+ — synthesizes project state across audience/pressure/landscape/brand/offer/messaging",
    description: "State files: np-state-aliz.md (workspace root), RevUP Clients/[X]/np-state.md (per client). Sync commands pull from MemPalace + NLM. Diff confirmation gate before any state write.",
    triggers: ["switch to project X", "sync NP", "show NP state", "USP", "Mechanism", "what's our positioning", "audience snapshot"],
    fires: "loaded when active project declared; feeds USP/Mechanism into aliz-diagnostic, writing-frameworks, aliz-voice"
  },
  {
    id: "aliz-diagnostic",
    name: "aliz-diagnostic",
    version: "1.8.0",
    layer: 6,
    layerLabel: "DIAGNOSTIC LAYER",
    layerSubtitle: "parallel walkers — audience and biz",
    role: "AUDIENCE psychology clay-maker · 6-step walker + Step 4.5 HITL checkpoint",
    description: "Pressure → Force State → Black Box Tactic → POV/Neutraliser → Benefits. Two paths: Short (juror profile pre-fills 1-5) / Full (client work, runs all 6 cold).",
    triggers: ["diagnose time", "check black box", "ad to write", "diagnose this audience", "what's the angle here", "I'm consulting on X", "I need to write X"],
    fires: "front door for ALL writing/consulting; juror name routes here via wfts-juror-panel Short Path"
  },
  {
    id: "wfts-juror-panel",
    name: "wfts-juror-panel",
    version: "4.2.4",
    layer: 6,
    layerLabel: "DIAGNOSTIC LAYER",
    layerSubtitle: "parallel walkers — audience and biz",
    role: "RevOS audience intelligence · 6 jurors",
    description: "Group 1: Gladys, Elena, Priya (philosophy/warmth entry). Group 2: Marcus, Jordan, Sam (evidence/demonstration entry). Each profile pre-fills Steps 1-5 of aliz-diagnostic.",
    triggers: ["Gladys", "Elena", "Priya", "Marcus", "Jordan", "Sam", "the panel", "stress-test the content", "juror panel"],
    fires: "RevOS-only — juror name fires Short Path through aliz-diagnostic; never for client audiences"
  },
  {
    id: "writing-frameworks",
    name: "writing-frameworks",
    version: "1.5.1",
    layer: 7,
    layerLabel: "WRITING LAYER",
    layerSubtitle: "Aliz personal voice only",
    role: "Framework selector for Aliz's personal-voice content",
    description: "Tree: Clarity Formula (AIPOVDA, parent default) + Cortisol-Free Writing Science (biochemistry filter, always-on) + EPS Framework (designated future RevOS-IP, three-part arc).",
    triggers: ["which framework", "compare frameworks", "Clarity Formula", "AIPOVDA", "EPS", "frameworks side-by-side"],
    fires: "auto-loaded by aliz-diagnostic at handoff stage; not a user-facing entry. Path A only."
  },
  {
    id: "aliz-voice",
    name: "aliz-voice",
    version: "4.5.1",
    layer: 7,
    layerLabel: "WRITING LAYER",
    layerSubtitle: "Aliz personal voice only",
    role: "Drafter + Zero-Point Polish (4-filter ethics chain)",
    description: "Drafts in Aliz's voice for personal-voice content. Mode A/B (Connection/Conversion) × Aliz-writes/Claude-writes. Zero-Point Polish: ROC Force Detection → Cortisol-Free → Autonomy Close → Service+Intention Clarity.",
    triggers: ["write this for me", "draft it in my voice", "give me the full draft", "run zero-point polish", "polish this", "cortisol-check this draft"],
    fires: "loaded by writing-frameworks at handoff if Claude drafts; standalone-callable for Polish. Path A only."
  }
];

window.EDGES = [
  { from: "gaia-protocol", to: "roi-of-calm", type: "bedrock", label: "silent bedrock" },
  { from: "gaia-protocol", to: "aliz-voice", type: "bedrock", label: "Four Laws of Transmission underneath Polish" },

  { from: "roi-of-calm", to: "aliz-diagnostic", type: "filter", label: "always-on filter" },
  { from: "roi-of-calm", to: "aliz-voice", type: "filter", label: "always-on filter" },
  { from: "roi-of-calm", to: "writing-frameworks", type: "filter", label: "always-on filter" },
  { from: "roi-of-calm", to: "wfts-juror-panel", type: "filter", label: "always-on filter" },

  { from: "belief-mechanics", to: "aliz-diagnostic", type: "query", label: "Force · BlackBox · Neutralisers" },
  { from: "growth-strategy", to: "wfts-juror-panel", type: "query", label: "Preeminence · Three Growth Levers" },

  { from: "wfts-juror-panel", to: "aliz-diagnostic", type: "trigger", label: "juror name fires Short Path" },

  { from: "aliz-diagnostic", to: "writing-frameworks", type: "handoff", label: "diagnostic clay" },
  { from: "writing-frameworks", to: "aliz-voice", type: "handoff", label: "if Claude drafts" },

  { from: "narrative-positioning", to: "aliz-diagnostic", type: "state", label: "state read/write", bidirectional: true },
  { from: "narrative-positioning", to: "writing-frameworks", type: "state", label: "USP · Mechanism" },
  { from: "narrative-positioning", to: "aliz-voice", type: "state", label: "audience snapshot" },

  { from: "revos-frameworks", to: "aliz-diagnostic", type: "lookup", label: "candidate handhold (Steps 5/6)" },
  { from: "revos-frameworks", to: "writing-frameworks", type: "lookup", label: "Clarity Formula · EPS" },
  { from: "revos-frameworks", to: "aliz-voice", type: "lookup", label: "Trust Formula reference" },

  { from: "growth-strategy", to: "aliz-diagnostic", type: "peer", label: "Rev11 parallel walker · pressure types feed", bidirectional: true }
];

window.FLOWS = [
  {
    id: "all",
    name: "All connections",
    description: "Every edge in the system.",
    highlightNodes: null,
    highlightEdges: null
  },
  {
    id: "cold",
    name: "Cold audience / client work",
    description: "Full Path — runs all 7 diagnostic steps, picks framework, drafts with voice.",
    highlightNodes: ["aliz-diagnostic", "writing-frameworks", "aliz-voice", "belief-mechanics", "growth-strategy", "narrative-positioning", "revos-frameworks", "roi-of-calm", "gaia-protocol"],
    highlightEdges: [
      ["aliz-diagnostic", "writing-frameworks"],
      ["writing-frameworks", "aliz-voice"],
      ["belief-mechanics", "aliz-diagnostic"],
      ["growth-strategy", "aliz-diagnostic"],
      ["revos-frameworks", "aliz-diagnostic"],
      ["revos-frameworks", "writing-frameworks"],
      ["narrative-positioning", "aliz-diagnostic"],
      ["narrative-positioning", "writing-frameworks"],
      ["narrative-positioning", "aliz-voice"],
      ["roi-of-calm", "aliz-diagnostic"],
      ["roi-of-calm", "writing-frameworks"],
      ["roi-of-calm", "aliz-voice"],
      ["gaia-protocol", "aliz-voice"]
    ]
  },
  {
    id: "juror",
    name: "RevOS juror flow",
    description: "Juror name fires Short Path — profile pre-fills Steps 1-5, walker resumes at Step 6.",
    highlightNodes: ["wfts-juror-panel", "aliz-diagnostic", "writing-frameworks", "aliz-voice", "growth-strategy", "roi-of-calm"],
    highlightEdges: [
      ["wfts-juror-panel", "aliz-diagnostic"],
      ["aliz-diagnostic", "writing-frameworks"],
      ["writing-frameworks", "aliz-voice"],
      ["growth-strategy", "wfts-juror-panel"],
      ["roi-of-calm", "wfts-juror-panel"],
      ["roi-of-calm", "aliz-diagnostic"],
      ["roi-of-calm", "writing-frameworks"],
      ["roi-of-calm", "aliz-voice"]
    ]
  },
  {
    id: "biz",
    name: "Biz strategy (Rev11)",
    description: "Parallel walker — Rev11 inside growth-strategy. Doesn't enter the writing layer.",
    highlightNodes: ["growth-strategy", "aliz-diagnostic"],
    highlightEdges: [
      ["growth-strategy", "aliz-diagnostic"]
    ]
  },
  {
    id: "filters",
    name: "Always-on filters",
    description: "GAIA bedrock and ROC filter — what runs underneath everything.",
    highlightNodes: ["gaia-protocol", "roi-of-calm", "aliz-diagnostic", "aliz-voice", "writing-frameworks", "wfts-juror-panel"],
    highlightEdges: [
      ["gaia-protocol", "roi-of-calm"],
      ["gaia-protocol", "aliz-voice"],
      ["roi-of-calm", "aliz-diagnostic"],
      ["roi-of-calm", "aliz-voice"],
      ["roi-of-calm", "writing-frameworks"],
      ["roi-of-calm", "wfts-juror-panel"]
    ]
  }
];

window.LAYERS = [
  { num: 1, label: "BEDROCK", subtitle: "silent guardrail underneath everything" },
  { num: 2, label: "BRAND PHILOSOPHY", subtitle: "always-on ethical filter" },
  { num: 3, label: "OPERATIONAL ENGINES", subtitle: "diagnostic and strategic engines" },
  { num: 4, label: "RevOS-IP CATALOGUE", subtitle: "the 7 RevOS-unique frameworks" },
  { num: 5, label: "LIVING SYNTHESIS", subtitle: "per-project state cache" },
  { num: 6, label: "DIAGNOSTIC LAYER", subtitle: "parallel walkers — audience and biz" },
  { num: 7, label: "WRITING LAYER", subtitle: "Aliz personal voice only" }
];
