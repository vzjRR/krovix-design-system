// Optional native presentation motion. Calling code owns element lifetime and focus.
const running = new WeakMap();

export function cancelMotion(element) {
    const animation = element && running.get(element);
    if (animation) { running.delete(element); animation.cancel(); }
}

/** Reveal immediately on reduced motion or unsupported runtimes. No action is delayed. */
export function animateModule(element, { opening = false, direction } = {}) {
    cancelMotion(element);
    if (!element || typeof element.animate !== 'function') return null;
    const view = element.ownerDocument?.defaultView || globalThis;
    if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;
    const rtl = direction ? direction === 'rtl' : view.getComputedStyle?.(element).direction === 'rtl';
    const animation = element.animate([
        { opacity: 0, transform: opening ? 'scale(.985)' : `translateX(${rtl ? -10 : 10}px)` },
        { opacity: 1, transform: opening ? 'scale(1)' : 'translateX(0)' },
    ], { duration: opening ? 300 : 180, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'none' });
    running.set(element, animation);
    const cleanup = () => { if (running.get(element) === animation) running.delete(element); };
    animation.finished.then(cleanup, cleanup);
    return animation;
}
