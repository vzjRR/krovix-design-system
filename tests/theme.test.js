import test from 'node:test';
import assert from 'node:assert/strict';
import { applyTheme, colorVars, themeOf, themes, assetUrl } from '../src/index.js';

function root() {
    const values = new Map();
    return { dataset: {}, classList: { add() {} }, style: {
        setProperty: (name, value) => values.set(name, value),
        removeProperty: (name) => values.delete(name),
        getPropertyValue: (name) => values.get(name),
    } };
}

test('Every registered theme can be applied without a game runtime', () => {
    const element = root();
    for (const theme of themes) {
        applyTheme(theme.id, { root: element });
        assert.equal(element.dataset.theme, theme.id);
        assert.equal(element.dataset.shape, theme.shape);
        assert.equal(element.dataset.title, theme.title);
        assert.equal(element.style.getPropertyValue('--art') === 'none', !theme.art);
    }
});

test('Switching themes removes derived overrides and preserves caller properties', () => {
    const element = root();
    element.style.setProperty('--customer-space', '20px');
    applyTheme('krovix-gilded', { root: element, colors: { accent: '#f80', text: '#fff' } });
    assert.equal(element.style.getPropertyValue('--accent'), '#ff8800');
    assert.ok(element.style.getPropertyValue('--grad-accent').includes('#ff8800'));
    applyTheme('light', { root: element, artwork: false });
    assert.equal(element.style.getPropertyValue('--accent'), undefined);
    assert.equal(element.style.getPropertyValue('--text-dim'), undefined);
    assert.equal(element.style.getPropertyValue('--customer-space'), '20px');
    assert.equal(element.style.getPropertyValue('--art'), 'none');
});

test('Overrides are isolated per container', () => {
    const a = root(), b = root();
    applyTheme('classic', { root: a, colors: { accent: '#123456' } });
    applyTheme('light', { root: b, colors: { accent: '#abcdef' } });
    applyTheme('krovix-arctic', { root: a });
    assert.equal(b.style.getPropertyValue('--accent'), '#abcdef');
});

test('Invalid overrides are ignored and text shades use the supplied background', () => {
    assert.deepEqual(colorVars({ accent: 'red; color: black', panel: 'garbage' }), {});
    assert.equal(colorVars({ accent: '#ffffff' })['--accent-text'], '#0b0f16');
    assert.equal(colorVars({ accent: '#000000' })['--accent-text'], '#ffffff');
    assert.equal(colorVars({ text: '#ffffff' }, '#000000')['--text-dim'], '#b8b8b8');
});

test('Unknown themes and traversing asset paths are rejected', () => {
    assert.throws(() => themeOf('../other'), RangeError);
    assert.throws(() => assetUrl('assets/../secrets'), TypeError);
    assert.equal(assetUrl('assets/krovix-mark.png', 'https://example.com/system/'), 'https://example.com/system/assets/krovix-mark.png');
});
