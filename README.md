# Skill Visualiser

Visual map of how Claude Code skills are connected, triggered, and routed — to spot contradictions, double triggers, and confusing handoffs.

Reads SKILL.md frontmatter (name, description, triggers, anti-routes) and renders three views:

- **Network** — force-directed graph. Green = handoff, red dashed = anti-route ("do NOT use X — use Y"), amber dotted = shared trigger between two skills.
- **Triggers** — every trigger phrase across all skills. Amber pills are shared by 2+ skills.
- **Conflicts** — auto-generated report of shared triggers and anti-routes.

## Usage

Open `index.html` in a browser. The 10 main skills load by default.

Click **+ Upload SKILL.md** to add more — each file is parsed client-side. **Reset** restores the seed.

## Deploy

Static site, no build. Drop into Vercel as-is.
