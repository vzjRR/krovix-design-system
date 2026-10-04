import { themes, DEFAULT_THEME } from './themes/registry.js';
import { colorVars } from './colors.js';

const owned = new WeakMap();
const packageRoot = new URL('../', import.meta.url);

export function themeOf(id = DEFAULT_THEME) {
    const theme = themes.find((entry) => entry.id === id);
    if (!theme) throw new RangeError(`Unknown Krovix theme: ${id}`);
    return theme;
}

/** Resolve a bundled asset for native modules, bundlers or an explicit hosted package root. */
export function assetUrl(path, baseUrl = packageRoot) {
    if (!/^assets\/[\w./-]+$/.test(path) || path.includes('..')) throw new TypeError('Expected a bundled assets/ path');
    return new URL(path, baseUrl).href;
}

/** Apply a theme to any container; imports and use do not require FiveM. */
export function applyTheme(id = DEFAULT_THEME, { root = document.documentElement, colors = {}, artwork = true, baseUrl = packageRoot } = {}) {
    const theme = themeOf(id);
    root.classList.add('krovix');
    root.dataset.theme = theme.id;
    root.dataset.shape = theme.shape;
    root.dataset.title = theme.title;
    for (const name of owned.get(root) || []) root.style.removeProperty(name);
    const values = {
        '--art': artwork && theme.art ? `url("${assetUrl(theme.art, baseUrl)}")` : 'none',
        ...colorVars(colors, theme.preview[0]),
    };
    for (const [name, value] of Object.entries(values)) root.style.setProperty(name, value);
    owned.set(root, Object.keys(values));
    return theme;
}

export { themes, DEFAULT_THEME, colorVars };
