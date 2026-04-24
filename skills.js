// Pre-bundled seed: the 10 main skills' frontmatter.
// Stored as raw markdown strings so the same parser handles both seed and uploads.
window.SEED_SKILLS = [
{ filename: "gaia-protocol/SKILL.md", raw: `---
name: gaia-protocol
description: >
  Constitutional bedrock for all Aliz/ROI of Calm work — the immutable laws governing
  reality, consciousness, belief, and transmission. Use to validate frameworks, ground
  strategy in first principles, arbitrate when skills contradict, or diagnose why a
  piece of output isn't landing. Loads the Five Immutable Laws, Five Levels of Being,
  Four Laws of Transmission, and Prime Identity Program. Triggers: "does this align
  with GAIA", "check against first principles", "Five Laws", "Five Levels", "Four Laws
  of Transmission", "Prime Identity Program", "why isn't this landing", "transmission
  physics", "predatory marketing check". Do NOT load for routine copy drafting or
  cortisol checks (those are roi-of-calm / aliz-voice) — GAIA runs silently as premise
  underneath other skills.
metadata:
  author: GAIA Protocol
  version: 7.2.1
  category: foundational-operating-system
---
` },
{ filename: "belief-mechanics/SKILL.md", raw: `---
name: belief-mechanics
description: >
  Operational engine for diagnosing and shifting beliefs — how they create reality, why
  people stay stuck in Force states, how to exit cleanly. Use for audience psychology
  diagnostics, Black Box tactic ID, Spectrum of Fear mapping, neutraliser selection,
  coaching interventions, and marketing psychology (ethical vs predatory mechanics).
  Triggers: "why are they stuck", "what's the belief underneath", "map the Force state",
  "identify the Black Box tactic", "find the right neutraliser", "Spectrum of Fear",
  "audience belief diagnostic", "why is this client frozen". For constitutional depth
  (Five Laws, Four Laws of Transmission, Prime Identity Program) load \`gaia-protocol\`.
metadata:
  author: GAIA Protocol
  version: 3.0.2
  category: belief-operating-system
---
` },
{ filename: "aliz-voice/SKILL.md", raw: `---
name: aliz-voice
description: >
  Aliz's draft-generator + Zero-Point Polish filter. Writes finished prose in Aliz's voice
  from a completed diagnostic (aliz-diagnostic) + chosen framework (writing-frameworks).
  Encodes tonal DNA, rhythm, vocabulary, anti-patterns. Also runs the Zero-Point Polish
  filter chain (ROC Force Detection → Cortisol-Free Writing Science → Autonomy Close →
  Service Check) on any draft — standalone-callable. Triggers: "write this for me", "draft
  it in my voice", "give me the draft", "give me the skeleton", "write the full thing",
  "zero-point polish", "polish this", "force-language check", "cortisol check", "run the
  filters". Do NOT use for strategic thinking — use aliz-diagnostic.
metadata:
  author: Aliz
  version: 4.4.2
  category: voice-and-routing
---
` },
{ filename: "roi-of-calm/SKILL.md", raw: `---
name: roi-of-calm
description: >
  Brand philosophy + always-on ethical filter. Not a framework — a philosophical stance for
  how to think when writing using any framework: cortisol-free marketing, Humane Marketing
  7Ps, Invitational Marketing, radical transparency, calm UX/design, stress audits,
  predatory-spectrum positioning. EPS is a separate, brand-agnostic framework — not married
  to ROC. Triggers: "ROI of Calm", "cortisol-free", "is this ethical", "dark patterns",
  "Humane Marketing", "Invitational Marketing", "stress audit".
metadata:
  author: GAIA Protocol
  version: 3.2.2
  category: brand-philosophy
---
` },
{ filename: "narrative-positioning/SKILL.md", raw: `---
name: narrative-positioning
description: >
  Strategic alignment layer + 2026 audience pressure reference. Four operational layers
  (USP, Mechanism, Pressure Point, Product Positioning) plus the canonical 2026 pressure
  point the ecosystem is structurally built to answer. Holds the trusted-advisor narrative
  everything routes through — Preeminence embodied. Triggers: "what's our USP", "what's
  the mechanism", "how do we position this", "run an alignment audit", "our audience's
  market pressure", "RevOS market pressure", "2026 pressure point", "audience pressure
  point", "what's our pressure point", "why us not them", "trusted advisor positioning".
  Do NOT use for client-side market-pressure diagnostics — use growth-strategy for that.
metadata:
  author: Aliz
  version: 2.3.2
  category: strategic-alignment
---
` },
{ filename: "growth-strategy/SKILL.md", raw: `---
name: growth-strategy
description: >
  Jay Abraham marketing-strategy engine for solopreneurs and coaches. Covers Three Growth
  Levers, Strategy of Preeminence, client acquisition, retention, sticking point diagnostics,
  offer architecture, market pressure, content cadence, maven positioning. Triggers: "how do
  we grow this", "what's the growth lever", "design this offer", "sticking point",
  "preeminence", "risk reversal", "market pressure". Do NOT use for inner-state or belief
  work (use belief-mechanics) or brand philosophy (use roi-of-calm).
metadata:
  author: GAIA Protocol / Jay Abraham Tradition
  version: 3.2.2
  category: marketing-strategy
---
` },
{ filename: "aliz-diagnostic/SKILL.md", raw: `---
name: aliz-diagnostic
description: >
  Aliz's diagnostic walker for copy and strategic consulting. Two paths: Short Path for
  RevOS/WFTS audience (juror profile completes Steps 1–5 — skip straight to offer + intent)
  and Full Path for client work (runs all 7 steps cold). Sequenced as Pressure → Force
  State → Black Box Tactic → POV/Neutraliser → Benefits → Intent. Produces the raw
  material before a framework is picked. Triggers: "I need to write X", "help me think
  through this copy", "diagnose this audience", "what's the angle here", "I'm consulting
  on X". For juror-named content (Gladys/Elena/Priya/Marcus/Jordan/Sam) the juror panel
  loads first; this skill walks the diagnostic after. Hands off to writing-frameworks
  (framework pick) and aliz-voice (draft, opt-in).
metadata:
  author: Aliz
  version: 1.4.2
  category: diagnostic-router
---
` },
{ filename: "wfts-juror-panel/SKILL.md", raw: `---
name: wfts-juror-panel
description: >
  Synthetic audience panel of 6 jurors for RevOS / WFTS ecosystem campaign content
  (2026 AI-era). Group 1: Gladys, Elena, Priya (philosophy + warmth entry). Group 2:
  Marcus, Jordan, Sam (evidence + demonstration entry). Shared bleeding-neck: all need
  more clients. Triggers: "Gladys", "Elena", "Priya", "Marcus", "Jordan", "Sam", "juror
  panel", "stress-test the content", "which audience group in RevOS". ONLY for Aliz's
  RevOS / WFTS audience — never for client audiences (use aliz-diagnostic Case B).
metadata:
  author: Aliz
  version: 4.2.2
  category: audience-intelligence
---
` },
{ filename: "revos-frameworks/SKILL.md", raw: `---
name: revos-frameworks
description: >
  Router for 8 RevOS-unique IP frameworks (Aliz-originated with Jay /
  behavioural-science lineage) + 1 ecosystem-reference (Rusydi's GOLD —
  taught inside RevOS, not RevOS IP). Frameworks are MODULAR — deploy by
  phase and surface (email, ad, sales page, proposal, call). Sequence is
  surface-emergent (sales page = Clarity Formula → Proprietary Value Stack
  → Clarity-to-Commitment; email close = often Clarity-to-Commitment solo).
  Power Parthenon + Nine Drivers is the strategic audit lens: reads business
  math, outputs the framework(s) to deploy. Does NOT auto-route on keywords
  — diagnostic-first. Full deployment docs live in NLM SRL. Use AFTER raw
  diagnostic data exists. Do NOT use for Jay Abraham source material —
  that's \`growth-strategy\`.
metadata:
  author: Aliz
  version: 2.7.1
  category: framework-router
---
` },
{ filename: "writing-frameworks/SKILL.md", raw: `---
name: writing-frameworks
description: >
  Aliz's writing framework catalogue + selector. Clarity Formula (AIPOVDA) is the parent
  architecture; Cortisol-Free Writing Science applies throughout; EPS is standalone. Use
  when picking, comparing, or nesting frameworks after the diagnostic. Triggers: "what
  framework should I use", "which formula fits", "Clarity Formula", "AIPOVDA", "EPS".
metadata:
  author: Aliz
  version: 1.4.0
  category: writing-framework-catalogue
  default_framework: clarity-formula-aipovda
---
` }
];
