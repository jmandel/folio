# Copy pass: AI-slop review

- Checklist with sources: [slop-checklist.md](slop-checklist.md) (Wikipedia "Signs of AI writing", Pangram Labs, tropes.fyi, Blake Stockton).
- Audit, every change with file:line, marker and replacement: [slop-audit.md](slop-audit.md).
- Files changed: site/src/views/Home.tsx, site/src/story/dka.ts, site/src/App.tsx, site/index.html, site/src/views/About.tsx, Record.tsx, Sources.tsx, Compiler.tsx. Sharing view and components not touched.
- Rendered front page after the rewrite: [copy-screens/home-1280x720-light-full.png](copy-screens/home-1280x720-light-full.png).
- `bun run site:build` and `bun run site:check` pass (1478 items verified, 0 failures; front page 6 excerpts and 7 citations verified; all deep links land).

Examples:
- "One fact in four records" -> "Empagliflozin reaction in each source"
- "Four systems, four shapes" -> "Source schemas and planted traps"
- "Plain code runs the cached mapper. No AI is involved." -> "The cached mapper runs as ordinary code, with no model call."
- "The signatures still verify, but one sentence about her low sodium now reads differently." -> "Every shared item still verifies. Without the sertraline, the nephrology note suggests chlorthalidone is the only suspected cause of her low sodium."
- "It is a reference stack, small enough to read: a draft format, four example sources, and the tools around them. It is not a product." -> "This is a reference implementation of a draft format, with four synthetic sources and the code that signs, verifies and shares their records."
