# Integration

## Static HTML and native modules

Copy `src/`, `assets/` and `tokens/` into a directory such as `/vendor/krovix/` while preserving their relative layout. Serve through HTTP so native modules and fonts load correctly.

```html
<link rel="stylesheet" href="/vendor/krovix/src/styles/index.css">
<div id="app"></div>
<script type="module">
  import { applyTheme, button, field } from '/vendor/krovix/src/index.js';
  const root = document.getElementById('app');
  applyTheme('krovix-sapphire', { root });
  root.append(field('Name', { id: 'name', placeholder: 'Your name' }));
  root.append(button('Save', { variant: 'primary' }));
</script>
```

CSS alone also works. Load `src/styles/index.css`, then put controls inside:

```html
<main class="krovix" data-theme="krovix-obsidian" data-shape="cut" data-title="plain">
  <button class="btn primary" type="button">Continue</button>
  <span class="chip open">Ready</span>
</main>
```

Use `data-shape="round"` for Gilded, Sapphire, Emerald, Arctic, Classic and Light; `cut` for Obsidian and Crimson. Use `data-title="metal"` for Gilded and Emerald; `plain` for all others. `applyTheme` sets these attributes automatically and resolves artwork. Add your own `--art` for CSS-only artwork.

## API

| Export | Usage |
| --- | --- |
| `themes`, `DEFAULT_THEME` | Registry and default id, `krovix-gilded` |
| `themeOf(id)` | Theme metadata; rejects unknown ids |
| `applyTheme(id, options)` | Apply to `options.root`; default is the document root |
| `colorVars(colors, background)` | Pure object of derived CSS variables |
| `assetUrl(path, baseUrl)` | Absolute URL for a bundled `assets/` path |
| `h(selector, attrs?, ...children)` | DOM builder; string children use text nodes |
| `clear`, `mount`, `$`, `show` | DOM convenience helpers |
| `icon(name, size)`, `hasIcon`, `ICON_NAMES` | SVG icon API; unknown names return `null` |
| `glyph`, `flagUK`, `flagOman` | Original glyph fallback and language flags |
| `button(label, options)` | `variant`, `small`, `icon`, `onClick`, native attributes |
| `chip(label, state)` | `open`, `live`, `starting`, `full`, `cancelled`, `upcoming` |
| `badge(name, size)` | `normal`, `small`, `large` |
| `field(label, options)` | Labelled input with `id`, optional `help` and input attributes |
| `stat(value, label)` | Metric block |
| `progress(value, max, label)` | Clamped progress with ARIA values |
| `card(options)` | `title`, `description`, `icon`, `status`, `statusLabel`, `meta`, `actions` |

Color override keys: `accent`, `accent2`, `background`, `panel`, `text`, `good`, `warn`, `bad`. Values are 3-, 6- or 8-digit hex strings; the original derivation uses RGB and discards alpha from 8-digit input. Invalid values are ignored. Derived variables are cleared on subsequent `applyTheme` calls to that root. Set all desired overrides on each call. Caller-owned inline variables that the API has never overwritten remain intact. Unknown theme ids throw before changing the container.

```js
applyTheme('krovix-gilded', {
  root: document.querySelector('#app'),
  colors: { accent: '#ff8800', background: '#101820' },
  artwork: false
});
```

Set `dir="rtl"` on the container or an ancestor for right-to-left layout. The bundled fonts are Latin subsets; Arabic uses the original Segoe UI/Tahoma fallback. Text selection remains available. Label icon-only buttons with `aria-label`. Buttons do not perform game actions; the caller owns behavior and any loading, routing or permissions.

## React and other frameworks

Use CSS classes in your framework's native elements. DOM helpers return actual elements, so do not call them inside JSX.

```jsx
import { useEffect, useRef } from 'react';
import '@krovix/design-system/styles.css';
import { applyTheme } from '@krovix/design-system';

export function KrovixPanel() {
  const ref = useRef(null);
  useEffect(() => { applyTheme('krovix-gilded', { root: ref.current, artwork: false }); }, []);
  return <section ref={ref} className="krovix">
    <button type="button" className="btn primary">Continue</button>
  </section>;
}
```

When a bundler moves JavaScript, copy `assets/` to a public directory and pass an absolute `baseUrl`, for example `new URL('/vendor/krovix/', location.href)`. Theme metadata paths resolve relative to that root. Preserve font URL resolution with your CSS bundler or retain the original directory structure.

## Optional product patterns

```js
import '@krovix/design-system/overlays.css';
import '@krovix/design-system/event-studio.css';
```

`overlays.css` contains original visual treatments and fixed positions for `.hud`, `.toasts`, `.results`, `.countdown`, `.modepanel`, `.host-prompt` and other game overlays. `event-studio.css` contains compact, docked, full, phone and tablet patterns from the source. These are presentation styles; application code must supply data and behavior. They are separated from the common CSS entry point.

## FiveM NUI

Vendor the package files into the resource's `web/vendor/krovix/`, include them in `fxmanifest.lua`'s files list, and import the CSS and native modules using relative paths. Apply the system to the document root for a full NUI. Keep your application's transparent background, focus handling, message listener and NUI callbacks in the product itself. This library does not register callbacks, communicate with a server or infer resource names.

The existing Event Studio is still using its original files. A migration must update imports, remove duplicate styles, adapt its theme registry and test the product before replacing those files.
