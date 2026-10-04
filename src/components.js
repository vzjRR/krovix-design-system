import { h } from './dom.js';
import { icon } from './icons.js';

let fieldId = 0;
const states = new Set(['open', 'live', 'starting', 'full', 'cancelled', 'upcoming']);
const variants = new Set(['primary', 'danger', 'good', 'ghost']);

export function button(label, { variant, small = false, icon: name, onClick, ...attrs } = {}) {
    if (variant && !variants.has(variant)) throw new RangeError(`Unknown button variant: ${variant}`);
    return h('button.btn' + (variant ? '.' + variant : '') + (small ? '.sm' : ''),
        { type: 'button', ...attrs, onclick: onClick }, name ? icon(name, 16) : null, label);
}

export function chip(label, state = 'upcoming') {
    if (!states.has(state)) throw new RangeError(`Unknown chip state: ${state}`);
    return h('span.chip.' + state, label);
}

export function badge(name, size = 'normal') {
    const classes = { normal: 'badge', small: 'badge-sm', large: 'badge-lg' };
    if (!classes[size]) throw new RangeError(`Unknown badge size: ${size}`);
    return h('span.' + classes[size], icon(name, size === 'large' ? 22 : 18));
}

export function stat(value, label) {
    return h('div.stat', h('b.display', value), h('span', label));
}

/** A real label, input and optional help text; pass a stable id when persisting forms. */
export function field(label, { id = `krovix-field-${++fieldId}`, help, ...attrs } = {}) {
    return h('div.field', h('label', { for: id }, label),
        h('input', { ...attrs, id, 'aria-describedby': help ? id + '-help' : undefined }),
        help ? h('span.help', { id: id + '-help' }, help) : null);
}

export function progress(value, max = 100, label = 'Progress') {
    if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) throw new TypeError('Progress requires a finite value and positive maximum');
    const current = Math.min(max, Math.max(0, value));
    return h('div.fill', { role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': current },
        h('i', { style: { width: `${current / max * 100}%` } }));
}

/** Presentation only: callers own actions, data loading and navigation. */
export function card({ title, description, icon: name = 'star', status, statusLabel, meta = [], actions = [] } = {}) {
    return h('article.card', h('div.card-banner', h('span.icon', icon(name, 22)), status ? chip(statusLabel || status, status) : null),
        h('div.card-body', h('h3.card-title.display', title), h('p.muted', description),
            h('div.card-meta', meta.map(([label, value]) => h('span', label, ' ', h('b', value)))),
            actions.length ? h('div.card-foot', actions) : null));
}
