// 10-skill ecosystem — architecture map data
// Last verified: 2026-05-12 (post-v4.2.0 evals + Rev11 canonical + best-practices fix)

window.SKILLS = [
  {
    id: "gaia-protocol",
    name: "gaia-protocol",
    version: "7.3.3",
    layer: 1,
    layerLabel: "BEDROCK",
    layerSubtitle: "silent guardrail underneath everything",
    role: "Constitutional bedrock — 5 Immutable Laws, 4 Laws of Transmission, Prime Identity Program",
    description: "Reality is a projection of consciousness, not the other way around. Circumstances are neutral; meaning is assigned. Excitement is the compass, pain is the diagnostic. No force, only flow. Every output is a transmission. Predatory marketing is self-defeating at the physics level, not only the ethics level.",
    triggers: ["alignment check", "first principles", "let's design a new framework", "Four Laws of Transmission", "prime identity", "GAIA alignment check", "why isn't this landing", "transmission physics"],
    fires: "almost never directly — runs silently as constitutional premise; loaded explicitly for framework arbitration or first-principles checks"
  },
  {
    id: "roi-of-calm",
    name: "roi-of-calm",
    version: "3.4.1",
    layer: 2,
    layerLabel: "BRAND PHILOSOPHY",
    layerSubtitle: "always-on ethical filter",
    role: "Cortisol-Free Brand Philosophy · 8 Core Operating Principles · Humane Marketing 7Ps · Five Mechanisms of Followership · Predatory Spectrum",
    description: "Brand-philosophy stance applied inside any framework. Filter for Force-based language, manufactured scarcity, shame triggers, dark patterns. Power-based alternatives. Invitational Marketing. Stress audits. Trusted Advisor mechanics.",
    triggers: ["is this on-brand", "stress-audit this funnel", "ROI of Calm check", "is this UX too pushy", "is this manipulative", "soften this", "predatory spectrum", "is this cortisol-free", "five mechanisms", "trusted advisor mechanics", "invitational marketing", "humane marketing", "brand audit"],
    fires: "filter runs always — engages automatically across diagnostic, writing, polishing, brand work"
  },
  {
    id: "belief-mechanics",
    name: "belief-mechanics",
    version: "3.1.1",
    layer: 3,
    layerLabel: "OPERATIONAL ENGINES",
    layerSubtitle: "diagnostic and strategic engines",
    role: "Belief diagnostic + neutraliser engine — 12 mechanical models, Black Box (27 tactics + 24 neutralisers + 11-level Spectrum of Fear), Foundational Architecture (Five Levels of Being)",
    description: "Diagnoses negative beliefs and selects neutralisers. Holds Five Levels of Being (Existence → Knowing → Belief → Emotion → Thought) as Foundational Architecture for belief-shift work. Force Diagnostics via Hawkins map. Six-brick geometry. Presence diagnostics. Breaking-point signal.",
    triggers: ["diagnose this belief", "which Black Box tactic is running", "matching neutraliser", "force state diagnostic", "Hawkins map", "Spectrum of Fear", "six-brick", "breaking point", "presence diagnostic", "belief mechanics", "twelve models"],
    fires: "queried by aliz-diagnostic at Steps 3/4 (Force state + Black Box tactic); referenced by narrative-positioning for USP work + Naming Unspoken anchor"
  },
  {
    id: "growth-strategy",
    name: "growth-strategy",
    version: "3.6.1",
    layer: 3,
    layerLabel: "OPERATIONAL ENGINES",
    layerSubtitle: "diagnostic and strategic engines",
    role: "Jay Abraham marketing strategy + Rev11 strategic audit lens + 7-stage HITL Protocol",
    description: "Three Growth Levers · Strategy of Preeminence · Rev11 (11 metrics across 3 layers — 6 Revenue Math + 4 Strategic Architecture + 1 Ideology goal-state; CBBA at GAIA altitude / RevONE at RevOS commercial altitude — same destination) · 7-stage HITL protocol (Pattern Identification → Pillar Surface → Framework Candidates → Strategic Decision Filter → Value Rank Payoffs → One-Thing Sharpening → Sign-Off) · Sticking Point Diagnostics · Market Pressure types · Client Acquisition · Retention/LTV.",
    triggers: ["Rev11", "growth lever", "Jay", "preeminence", "sticking point", "risk reversal", "market pressure", "design this offer", "which framework should we deploy", "strategic audit", "stuck at $X MRR", "how do I grow this"],
    fires: "directly on Rev11 / growth questions; Rev11 routes framework recommendations to revos-frameworks (deployment); offer/biz-state feeds narrative-positioning via context"
  },
  {
    id: "revos-frameworks",
    name: "revos-frameworks",
    version: "3.2.2",
    layer: 4,
    layerLabel: "RevOS-IP CATALOGUE",
    layerSubtitle: "14 RevOS-unique frameworks — manual invocation only",
    role: "MANUAL INVOCATION ROUTER — 14 RevOS-IP frameworks (deployment depth in local references + NLM)",
    description: "Trust Formula · Clarity Formula (AIPOVDA + 6-Step POV; VVP absorbed) · Clarity-to-Commitment · Criteria Gravity · Proprietary Value Stack · Referral Blueprint · CALM Authority · Reactivation Mechanism · Offer Stack · IP Lock · Founder OS · Growth Partnerships · IP Vehicle · (+1 more). GOLD = Rusydi's ecosystem-reference, taught inside but not RevOS IP. EPS designated future RevOS-IP (parked elevation work).",
    triggers: ["/revos-frameworks (slash command ONLY)"],
    fires: "manual invocation ONLY — does NOT auto-load on keyword triggers; receives framework recommendations from Rev11 (growth-strategy); deployment is last mile of workflow"
  },
  {
    id: "narrative-positioning",
    name: "narrative-positioning",
    version: "4.1.0",
    layer: 5,
    layerLabel: "LIVING SYNTHESIS",
    layerSubtitle: "synthesises fresh from 3 streams — no stored state",
    role: "Living Synthesiser — 3-stream synthesis (psychology + offer/biz state + positioning IP)",
    description: "NO STORED STATE. No sync commands. No state files. Synthesises fresh each invocation from: psychology stream (aliz-diagnostic context), offer/biz-state stream (Rev11 context OR Aliz-supplied), positioning IP stream (this skill's body + refs). Holds Master Through-Line, Audience Canonical Truth, Trusted Advisor stance, 5 Preeminence Beats, Copy Thinking forward-motion craft, 6Qs completeness, Content-as-Neutraliser principle, Naming the Unspoken, UVP (BSI + Disruptive Idea + Single Belief), Weave Principle, 7 Positioning Principles, 4 Operational Layers, Alignment Audit.",
    triggers: ["load positioning thinking", "preeminence check", "alignment audit", "USP work", "mechanism work", "narrative positioning", "positioning audit", "audience canonical", "is this on brand", "should I position this as"],
    fires: "auto-loaded by writing-frameworks Stage 1 (every writing task); direct invocation for positioning analysis, alignment audit, preeminence check. NEVER auto-invokes aliz-diagnostic or Rev11 — one-way data flow."
  },
  {
    id: "aliz-diagnostic",
    name: "aliz-diagnostic",
    version: "2.2.0",
    layer: 6,
    layerLabel: "DIAGNOSTIC LAYER",
    layerSubtitle: "psychology clay-maker + parallel walkers",
    role: "AUDIENCE psychology clay-maker · pure 5-step walker + Step 4.5 HITL checkpoint",
    description: "Walks Pressure → Force State → Black Box Tactic (with HITL checkpoint) → POV/Neutraliser. Stops at Step 5 — no Step 6 Benefits row (REMOVED v2.2.0). Output is 5-row diagnostic block (Audience / Pressure / Force State + Spectrum / Active Tactics / POV + Neutraliser). NEVER engages downstream skills — output feeds NP via context inspection only (one-way data flow).",
    triggers: ["diagnose time", "check black box", "ad to write", "diagnose this audience", "what's the angle here", "I'm consulting on X", "I need to write X"],
    fires: "front door for ALL writing/consulting; output feeds narrative-positioning via context; juror name routes here via wfts-juror-panel Short Path"
  },
  {
    id: "wfts-juror-panel",
    name: "wfts-juror-panel",
    version: "4.3.2",
    layer: 6,
    layerLabel: "DIAGNOSTIC LAYER",
    layerSubtitle: "psychology clay-maker + parallel walkers",
    role: "RevOS audience intelligence · 6-juror synthetic panel (2026 AI-era)",
    description: "Group 1 (philosophy/warmth entry): Gladys, Elena, Priya. Group 2 (evidence/demonstration entry): Marcus, Jordan, Sam. Each juror profile pre-fills aliz-diagnostic Steps 1-5 (pressure, Force state, Spectrum, tactics, POV/neutraliser). Two modes: write FOR a juror OR stress-test content AGAINST the panel. RevOS / WFTS audience ONLY.",
    triggers: ["Gladys", "Elena", "Priya", "Marcus", "Jordan", "Sam", "the panel", "juror panel", "stress-test against the panel", "would this land with [juror]"],
    fires: "RevOS / WFTS audience only — juror name fires Short Path through aliz-diagnostic; NEVER for client audiences (use aliz-diagnostic for those)"
  },
  {
    id: "writing-frameworks",
    name: "writing-frameworks",
    version: "3.2.0",
    layer: 7,
    layerLabel: "WRITING LAYER",
    layerSubtitle: "operational writing engine + voice unit",
    role: "Operational writing engine — turns diagnostic clay + NP synthesis into voiced prose",
    description: "5 stages: Mode Pick (Connection or Conversion) + Awareness HITL + NP load (always) → Framework Pick (Clarity Formula default / Organic-Content / EPS) → Output Mode (Skeleton / Full Draft / Audit) → Drafting with voice DURING (full-draft mode only) → optional Polish (6 filters incl Banned-Pattern Scan + 3Q Trust Test) + Stress-Test (6 checks + Conversion-only Jay's 6). Pre-Draft Tonal Calibration HITL for belief-shifting content (I-POV Steps 4-6).",
    triggers: ["draft this", "write this", "write me a [piece]", "skeleton or full draft", "which framework should I use", "audit this draft", "review my draft", "polish this", "stress-test this", "is this Conversion or Connection"],
    fires: "post-diagnostic writing entry point; Stage 1 ALWAYS auto-loads narrative-positioning; Stage 4 Full Draft loads copy-craft-deep + aliz-voice; Stage 4 Audit/Polish/Stress-Test loads copy-craft-editing-discipline"
  },
  {
    id: "aliz-voice",
    name: "aliz-voice",
    version: "6.0.0",
    layer: 7,
    layerLabel: "WRITING LAYER",
    layerSubtitle: "operational writing engine + voice unit",
    role: "Pure voice unit — stylometry, vocabulary, structural moves, coaching DNA, metaphor instinct, never-do list",
    description: "Voice profile data for Aliz. Both written voice (LinkedIn posts, emails, long-form) and spoken voice (coaching, looser conversational pieces) blended. Read by writing-frameworks during drafting (full-draft mode) so prose comes out voiced from the start, NOT stickered after. Standalone-callable for voicing an existing draft post-hoc. Does NOT decide structure, pick frameworks, run diagnostics, or run polish.",
    triggers: ["voice this", "Aliz-ify this", "in my voice"],
    fires: "auto-loaded by writing-frameworks Stage 4 in Full Draft Mode; standalone for post-hoc voicing of existing draft. Does NOT draft from scratch — that's writing-frameworks territory."
  }
];

window.EDGES = [
  // Bedrock — silent constitutional layer underneath everything
  { from: "gaia-protocol", to: "roi-of-calm", type: "bedrock", label: "constitutional bedrock" },
  { from: "gaia-protocol", to: "belief-mechanics", type: "bedrock", label: "Five Immutable Laws bedrock" },
  { from: "gaia-protocol", to: "narrative-positioning", type: "bedrock", label: "Four Laws of Transmission underneath" },

  // Brand philosophy — always-on filter
  { from: "roi-of-calm", to: "aliz-diagnostic", type: "filter", label: "always-on ethical filter" },
  { from: "roi-of-calm", to: "writing-frameworks", type: "filter", label: "always-on ethical filter" },
  { from: "roi-of-calm", to: "narrative-positioning", type: "filter", label: "Five Mechanisms of Followership sourced from here" },
  { from: "roi-of-calm", to: "growth-strategy", type: "filter", label: "ethical guardrails on growth tactics" },

  // Operational engines query
  { from: "belief-mechanics", to: "aliz-diagnostic", type: "query", label: "Force · Black Box · Neutralisers (Steps 3-4)" },
  { from: "belief-mechanics", to: "narrative-positioning", type: "query", label: "USP layer + Naming Unspoken anchor" },

  // Diagnostic clay-makers feed living synthesis (one-way via context, NEVER auto-invoke)
  { from: "aliz-diagnostic", to: "narrative-positioning", type: "stream", label: "psychology stream (via context only)" },
  { from: "growth-strategy", to: "narrative-positioning", type: "stream", label: "Rev11 offer/biz stream (via context only)" },

  // wfts-juror-panel feeds aliz-diagnostic Short Path
  { from: "wfts-juror-panel", to: "aliz-diagnostic", type: "trigger", label: "juror name fires Short Path (pre-fills Steps 1-5)" },
  { from: "growth-strategy", to: "wfts-juror-panel", type: "query", label: "Preeminence + market pressure typing" },

  // Living synthesis feeds writing
  { from: "narrative-positioning", to: "writing-frameworks", type: "handoff", label: "3-stream synthesis (auto-loaded at WF Stage 1)" },

  // Writing engine drives drafting + voice
  { from: "writing-frameworks", to: "aliz-voice", type: "handoff", label: "Stage 4 Full Draft Mode auto-load" },

  // RevOS-IP catalogue — manual invocation only
  { from: "revos-frameworks", to: "growth-strategy", type: "lookup", label: "Rev11 routes framework recommendation here" },
  { from: "revos-frameworks", to: "writing-frameworks", type: "lookup", label: "Clarity Formula reference (manual)" },

  // Anti-routes — what does NOT happen (architectural locks)
  { from: "aliz-diagnostic", to: "writing-frameworks", type: "anti", label: "AD does NOT auto-load WF (v2.2.0 lock)" },
  { from: "narrative-positioning", to: "aliz-diagnostic", type: "anti", label: "NP NEVER auto-invokes AD (one-way data flow)" },
  { from: "narrative-positioning", to: "growth-strategy", type: "anti", label: "NP NEVER auto-invokes Rev11 (one-way data flow)" }
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
    id: "writing",
    name: "Writing pipeline (cold audience)",
    description: "Full pipeline — AD produces psychology clay → NP synthesises 3 streams → WF drafts + voices.",
    highlightNodes: ["aliz-diagnostic", "narrative-positioning", "writing-frameworks", "aliz-voice", "belief-mechanics", "roi-of-calm", "gaia-protocol"],
    highlightEdges: [
      ["aliz-diagnostic", "narrative-positioning"],
      ["narrative-positioning", "writing-frameworks"],
      ["writing-frameworks", "aliz-voice"],
      ["belief-mechanics", "aliz-diagnostic"],
      ["belief-mechanics", "narrative-positioning"],
      ["roi-of-calm", "aliz-diagnostic"],
      ["roi-of-calm", "writing-frameworks"],
      ["roi-of-calm", "narrative-positioning"],
      ["gaia-protocol", "roi-of-calm"],
      ["gaia-protocol", "narrative-positioning"]
    ]
  },
  {
    id: "juror",
    name: "RevOS juror flow",
    description: "Juror name fires Short Path through aliz-diagnostic (profile pre-fills Steps 1-5).",
    highlightNodes: ["wfts-juror-panel", "aliz-diagnostic", "narrative-positioning", "writing-frameworks", "aliz-voice", "growth-strategy", "roi-of-calm"],
    highlightEdges: [
      ["wfts-juror-panel", "aliz-diagnostic"],
      ["aliz-diagnostic", "narrative-positioning"],
      ["narrative-positioning", "writing-frameworks"],
      ["writing-frameworks", "aliz-voice"],
      ["growth-strategy", "wfts-juror-panel"],
      ["roi-of-calm", "writing-frameworks"]
    ]
  },
  {
    id: "biz",
    name: "Biz strategy (Rev11 → revos-frameworks)",
    description: "Rev11 (growth-strategy) audits founder state across 11 metrics + 7-stage HITL. Routes framework recommendation to revos-frameworks for deployment.",
    highlightNodes: ["growth-strategy", "revos-frameworks", "roi-of-calm", "gaia-protocol"],
    highlightEdges: [
      ["revos-frameworks", "growth-strategy"],
      ["roi-of-calm", "growth-strategy"],
      ["gaia-protocol", "roi-of-calm"]
    ]
  },
  {
    id: "filters",
    name: "Always-on filters",
    description: "GAIA bedrock + ROC filter — what runs underneath everything silently.",
    highlightNodes: ["gaia-protocol", "roi-of-calm", "aliz-diagnostic", "writing-frameworks", "narrative-positioning", "growth-strategy"],
    highlightEdges: [
      ["gaia-protocol", "roi-of-calm"],
      ["gaia-protocol", "belief-mechanics"],
      ["gaia-protocol", "narrative-positioning"],
      ["roi-of-calm", "aliz-diagnostic"],
      ["roi-of-calm", "writing-frameworks"],
      ["roi-of-calm", "narrative-positioning"],
      ["roi-of-calm", "growth-strategy"]
    ]
  },
  {
    id: "anti",
    name: "Architectural locks (anti-routes)",
    description: "What does NOT happen. One-way data flow locks enforced by v4.1.0 (NP) + v2.2.0 (AD).",
    highlightNodes: ["aliz-diagnostic", "narrative-positioning", "growth-strategy", "writing-frameworks"],
    highlightEdges: [
      ["aliz-diagnostic", "writing-frameworks"],
      ["narrative-positioning", "aliz-diagnostic"],
      ["narrative-positioning", "growth-strategy"]
    ]
  }
];

window.LAYERS = [
  { num: 1, label: "BEDROCK", subtitle: "silent guardrail underneath everything" },
  { num: 2, label: "BRAND PHILOSOPHY", subtitle: "always-on ethical filter" },
  { num: 3, label: "OPERATIONAL ENGINES", subtitle: "diagnostic and strategic engines" },
  { num: 4, label: "RevOS-IP CATALOGUE", subtitle: "14 RevOS-unique frameworks — manual invocation only" },
  { num: 5, label: "LIVING SYNTHESIS", subtitle: "synthesises fresh from 3 streams — no stored state" },
  { num: 6, label: "DIAGNOSTIC LAYER", subtitle: "psychology clay-maker + parallel walkers" },
  { num: 7, label: "WRITING LAYER", subtitle: "operational writing engine + voice unit" }
];
