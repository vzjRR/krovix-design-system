# Extraction record

Source: `vzjRR/battle-royal-five-m`, default branch `claude/event-studio-fivem-x11r93`, commit `2ae9ae08f19bbf833e7e1e8153a14d510fb7987e`. Extraction date: 4 October 2026.

| Original | Extracted |
| --- | --- |
| `event_studio/web/themes/base.css` | `src/tokens/base.css`, `tokens/tokens.json` |
| `event_studio/web/themes/*.css` | `src/themes/*.css` |
| `event_studio/shared/themes.lua` | `src/themes/registry.js` |
| `event_studio/web/css/base.css` | `src/styles/controls.css` |
| `event_studio/web/css/panels.css` | `src/styles/panels.css`, optional `event-studio.css` |
| `event_studio/web/css/hud.css` | Optional `src/styles/overlays.css` |
| `event_studio/web/js/icons.js` | `src/icons.js` |
| `event_studio/web/js/ui.js` | Framework-independent DOM portion in `src/dom.js` |
| `event_studio/web/js/theme.js` | Pure color derivation in `src/colors.js`; new `src/theme.js` |
| `event_studio/web/fonts/` | `assets/fonts/`, including original OFL notice |
| `event_studio/web/img/` | `assets/`, including all marks and artwork |
| `event_studio/LICENSE.md` | Unchanged source notice in `notices/` |

## Preserved

Token values, gradients, type choices, theme metadata, SVG icon geometry, font files and artwork retain the source implementation. The source handover mentioned 38 icons; the current source actually exports **40**, all of which are retained. The six signature Krovix themes and both compatibility themes are included.

## Adapted

- `:root` token declarations become scoped `.krovix` declarations. Theme selectors use `data-theme` so several separate containers can use different themes.
- Component CSS is scoped beneath `.krovix` with low-specificity `:where` selectors. The document reset, transparent viewport, hidden overflow and disabled text selection are omitted.
- RTL selectors use `:dir(rtl)` so direction can be inherited. Keyframe names have a `krovix-` prefix to avoid collisions.
- General panels are included in the main stylesheet; complete source panel and HUD patterns are separate optional stylesheets.
- The source's Lua registry becomes a JavaScript registry. Artwork and logo paths are relative to the package root.
- Theme switching sets container attributes and inline derived overrides instead of swapping a global stylesheet link. The browser-layout mutation and server-supplied appearance configuration are omitted.
- Color derivation receives the background as an argument instead of reading global document state. This makes it portable and independently testable.
- Keyboard focus and reduced-motion styles are additive. DOM component helpers and the catalog demonstrate the existing classes without importing product behavior.

The original font CSS aliases Manrope's bundled 400 file to 600/700/800 and Oxanium's 600 file to 700/800. This extraction preserves those declarations; it does not replace files or claim additional font masters. Browser rendering should be reviewed when precise type weight matters.

## Excluded

Lua server/client code, gameplay, NUI RPC, Event Studio state, translations, event data, permissions, admin workflows, phone adapters and runtime configuration do not belong to the shared design library.

The older external brand artifact is referenced by the source handover, but this extraction uses the checked-in implementation as its source of truth. It does not claim to include material only present in that external artifact.

## Maintenance

This separate repository is the home for reusable design work. The game repository remains unchanged and is not automatically linked. Pin package consumers to a tag or commit for repeatable builds; integrate an update into each product intentionally.

`SOURCE.json` records every input file and SHA-256 so the snapshot can be audited. Compare changes against those paths when importing a newer source revision. Update the CSS and JSON tokens together, add or adjust tests for behavior changes, and run all three validation commands before pushing.
