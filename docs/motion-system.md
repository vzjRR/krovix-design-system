# Command Deck motion

`animateModule(element, { opening, direction })` is an optional native Web Animations utility. Opening uses a 300 ms opacity/scale reveal; module changes use a 180 ms opacity/10 px directional entrance. Only opacity and transform animate. Pass `direction: 'rtl'` or inherit computed direction. The utility uses the element's owning window, so embedded documents retain their own motion preference.

The utility immediately returns the animation, or `null` for missing/unsupported elements and reduced-motion environments. It never delays rendering, requests, dangerous actions, focus changes or close operations. There is no exit animation gate. The host should call it after inserting visible content.

Each element has at most one tracked animation. Repeated calls cancel the previous one; old completion callbacks cannot clear a newer animation. `cancelMotion(element)` cancels and releases the animation on close or teardown. Promise rejection from cancellation is handled. `fill: 'none'` prevents retained animation styles. No timer, persistent listener or loop is created.

```js
workspace.replaceChildren(nextModule);
animateModule(nextModule);
// On close or replacing this module:
cancelMotion(nextModule);
```

Command navigation uses 140–160 ms color, surface and selection-line transitions. `prefers-reduced-motion: reduce` removes those transitions. Controls remain immediately actionable at any point. The showcase replay button demonstrates the reveal without blocking any behavior.

Native unit tests verify reduced motion, absent APIs, rapid cancellation, inherited RTL, bounded opening duration and style cleanup. Browser checks exercise computed layout, container isolation and every theme. Native game frame pacing requires measurement in each consuming product.
