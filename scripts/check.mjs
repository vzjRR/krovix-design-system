import { readFile, readdir, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes, ICON_NAMES } from '../src/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const tokens = JSON.parse(await readFile(path.join(root, 'tokens/tokens.json'), 'utf8'));
const cssValues = text => Object.fromEntries(Array.from(text.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g), match => [match[1], match[2]]));
assert.deepEqual(cssValues(await readFile(path.join(root, 'src/tokens/base.css'), 'utf8')), tokens.base);
assert.equal(themes.length, 8);
assert.equal(new Set(themes.map(t => t.id)).size, 8);
assert.equal(ICON_NAMES.length, 40);
for (const theme of themes) {
    const themeCSS = await readFile(path.join(root, 'src/themes', theme.file + '.css'), 'utf8');
    assert.deepEqual({ ...tokens.base, ...cssValues(themeCSS) }, tokens.themes[theme.id]);
    for (const file of [theme.logo, theme.art].filter(Boolean)) await access(path.join(root, file));
    const values = tokens.themes[theme.id];
    for (const [name, value] of Object.entries(values)) {
        for (const [, alias] of value.matchAll(/var\((--[\w-]+)/g)) assert.ok(values[alias], `Missing ${alias} referenced by ${name}`);
    }
}
async function inspect(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) { await inspect(file); continue; }
        if (!file.endsWith('.css')) continue;
        const css = await readFile(file, 'utf8');
        assert.ok(!css.replace(/\/\*[\s\S]*?\*\//g, '').includes('*/'), `Unmatched comment in ${file}`);
        for (const [, ref] of css.matchAll(/(?:url\(\s*|@import\s*)['"]([^'"#]+)['"]/g)) {
            if (/^https?:/.test(ref)) continue;
            await access(path.resolve(path.dirname(file), ref));
        }
        if (file.includes(path.join('src', 'styles'))) {
            assert.ok(!/(?:^|\n)\s*(?:html|body)\s*[,\{]/.test(css), 'Unexpected page-wide reset');
        }
    }
}
await inspect(path.join(root, 'src'));
await inspect(path.join(root, 'assets'));
console.log(`Validated ${themes.length} themes, ${Object.keys(tokens.base).length} base tokens, ${ICON_NAMES.length} icons and local CSS assets.`);
