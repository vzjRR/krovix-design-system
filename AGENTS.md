# Krovix design-system contributors

Read README.md and docs/extraction.md before editing. This repository contains presentation foundations; keep game, server and product business logic in their consumers.

- Use Krovix Team as the publisher. Preserve source notices and font licenses.
- Keep original theme values unless intentionally changing the design. Update CSS, registry and token JSON together.
- Scope component styles beneath .krovix; avoid document resets and application-wide overflow rules.
- Insert user text as text nodes. Use the built-in SVG icons rather than emoji for interface controls.
- Keep modules usable without FiveM. Support per-container themes, keyboard focus and inherited RTL.
- Run npm test, npm run check and npm pack --dry-run before pushing.
- Never rewrite someone else's Git history or put AI model names in code, commits or documentation.
