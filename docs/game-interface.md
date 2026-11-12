# Command Deck game interfaces

Command Deck is an optional presentation layer for operational game windows. It ships no game actions, permissions, telemetry, data models or network calls.

```js
import '@krovix/design-system/styles.css';
import '@krovix/design-system/command-deck.css';
import { animateModule, cancelMotion } from '@krovix/design-system/motion';
```

Place the window within a `.krovix` themed container. Compose `.kd-shell`, `.kd-identity`, `.kd-nav` and `.kd-module-head`; render navigation buttons as `.kd-command` with `aria-current="page"` for the selected module. The horizontal command bank wraps at narrow sizes instead of hiding essential modules. Host code owns routing and keyboard behavior.

Use `.kd-instruments` / `.kd-instrument` for actual metrics, `.kd-operations` for an asymmetric workspace, `.kd-panel` / `.kd-panel-head` for operational groups, `.kd-roster` / `.kd-entry` for compact dossiers, and `.kd-timeline` for a sequence. `.kd-status` supports `data-state="live|warning|error"` alongside text, so color is never the sole state cue. `.kd-controls` aligns ordinary controls; hosts should put destructive controls in a distinct group. `.kd-dialog` styles native dialogs without replacing their semantics or performing confirmation actions.

`.kd-empty` and a decorative `.kd-art` image provide an intentional quiet workspace. Use empty alt text and `aria-hidden="true"` for the illustration. Never present the schematic as actual geographical coordinates or telemetry. Numeric values in the preview are explicitly demonstration data.

All surfaces, typography, accents and statuses consume the existing semantic tokens. No foundational tokens, eight-theme registry values or global resets changed. Container themes, customer color overrides and inherited RTL remain functional. Logical properties position timelines, instrument markers and controls correctly in Arabic. The optional stylesheet is about 7 KB uncompressed and contains no external dependencies, font downloads, continuous rendering or animation loops.

The interactive preview's **Game Interface / Command Deck** section exercises navigation, rosters, empty states, instrumentation, a native confirmation dialog, Arabic language/direction, theme variations and replayable motion. Existing catalog theme controls apply immediately. Reduced motion follows the operating-system preference.

## Product integration

Pin an approved commit when copying or installing the library. Preserve local CSS/module paths and bundle assets for offline runtime use. A product can add adapter styles to match its viewport and map these classes onto its existing data-backed components. Keep its focus release, NUI lifecycle, RPC gateway, permissions and localization in the product. Test its actual CEF runtime independently of desktop-browser rendering.

## Asset inventory

| Asset | Purpose | Provenance |
| --- | --- | --- |
| `assets/art/command-deck.svg` | Decorative competition-control schematic for empty states | Original Krovix Team geometric artwork, created for this change; no geographical data, stock art or third-party dependency |

The existing Krovix marks and fonts remain unmodified. `SOURCE.json` retains the historical extraction record; this additive work does not rewrite original provenance.
