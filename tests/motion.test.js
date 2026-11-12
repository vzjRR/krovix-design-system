import test from 'node:test';
import assert from 'node:assert/strict';
import { animateModule, cancelMotion } from '../src/motion.js';

function element({ reduced = false, rtl = false } = {}) {
    const calls = [];
    const animations = [];
    return { calls, animations, ownerDocument: { defaultView: {
        matchMedia: () => ({ matches: reduced }), getComputedStyle: () => ({ direction: rtl ? 'rtl' : 'ltr' }),
    } }, animate(frames, options) {
        let resolve;
        const animation = { cancelled: false, finished: new Promise(r => { resolve = r; }), cancel() { this.cancelled = true; resolve(); } };
        calls.push({ frames, options }); animations.push(animation); return animation;
    } };
}
test('Reduced motion and unsupported elements create no animation', () => {
    const e = element({ reduced: true });
    assert.equal(animateModule(e), null); assert.equal(e.calls.length, 0);
    assert.equal(animateModule({}), null); assert.equal(animateModule(null), null);
});
test('Rapid navigation cancels the previous animation without delaying the next', async () => {
    const e = element(); const first = animateModule(e); const next = animateModule(e);
    assert.equal(first.cancelled, true); assert.equal(next.cancelled, false);
    await Promise.resolve(); cancelMotion(e); assert.equal(next.cancelled, true);
    cancelMotion(e); cancelMotion(null);
});
test('RTL transitions follow inherited direction and opening uses bounded scale', () => {
    const e = element({ rtl: true }); animateModule(e);
    assert.equal(e.calls[0].frames[0].transform, 'translateX(-10px)');
    animateModule(e, { opening: true }); assert.equal(e.calls[1].frames[0].transform, 'scale(.985)');
    assert.equal(e.calls[1].options.duration, 300); assert.equal(e.calls[1].options.fill, 'none');
    cancelMotion(e);
});
