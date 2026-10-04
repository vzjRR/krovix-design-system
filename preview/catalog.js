import { h, mount, icon, themes, applyTheme, assetUrl, ICON_NAMES, button, chip, card, stat, field, progress } from '../src/index.js';

const root = document.documentElement;
const $ = (id) => document.getElementById(id);
const url = new URL(location.href);
let current = themes.some(t => t.id === url.searchParams.get('theme')) ? url.searchParams.get('theme') : 'krovix-gilded';
let accent;
let feedbackTimer;
const tokenNames = Object.keys((await (await fetch('../tokens/tokens.json')).json()).base);

function feedback(message) {
    $('feedback').textContent = message;
    $('feedback').classList.remove('hidden');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => $('feedback').classList.add('hidden'), 2400);
}

mount($('theme-select'), themes.map(t => h('option', { value: t.id }, t.name)));
mount($('theme-grid'), themes.map(t => h('button.theme-choice', { type: 'button', 'data-theme-choice': t.id, onclick: () => selectTheme(t.id) },
    h('span.theme-palette', t.preview.map(color => h('i', { style: { background: color } }))),
    h('b', t.name), h('small', `${t.shape === 'cut' ? 'CUT CORNERS' : 'ROUNDED'} / ${t.title === 'metal' ? 'METALLIC' : 'PLAIN'}`))));

function inspectTokens() {
    const style = getComputedStyle(root);
    const value = (name) => style.getPropertyValue(name).trim();
    $('font-label').textContent = 'Body: ' + value('--font').split(',')[0] + ' / Display: ' + value('--font-display').split(',')[0];
    mount($('color-tokens'), ['--bg-solid', '--panel', '--accent', '--accent-2', '--text', '--good', '--warn', '--bad', '--info', '--gold', '--silver', '--bronze'].map(name =>
        h('div.color-token', h('i', { style: { background: `var(${name})` } }), h('b', name), h('span', value(name)))));
    mount($('token-rows'), tokenNames.map(name => h('tr', h('td', name), h('td', value(name)))));
    $('accent-color').value = /^#[0-9a-f]{6}$/i.test(value('--accent')) ? value('--accent') : '#d4b26a';
}

function selectTheme(id, reset = true) {
    current = id;
    if (reset) accent = undefined;
    const theme = applyTheme(id, { colors: accent ? { accent } : {} });
    $('theme-select').value = id;
    $('active-name').textContent = theme.name.replace('Krovix ', '').toUpperCase();
    $('theme-logo').src = assetUrl(theme.logo || 'assets/krovix-mark.png');
    for (const choice of document.querySelectorAll('[data-theme-choice]')) choice.setAttribute('aria-pressed', String(choice.dataset.themeChoice === id));
    url.searchParams.set('theme', id);
    history.replaceState(null, '', url);
    inspectTokens();
}

$('theme-select').addEventListener('change', (event) => selectTheme(event.target.value));
$('accent-color').addEventListener('input', (event) => { accent = event.target.value; selectTheme(current, false); });
$('reset-accent').addEventListener('click', () => selectTheme(current));
$('direction').addEventListener('click', () => {
    const rtl = root.dir !== 'rtl';
    root.dir = rtl ? 'rtl' : 'ltr';
    $('direction').setAttribute('aria-pressed', String(rtl));
});
if (url.searchParams.get('dir') === 'rtl') { root.dir = 'rtl'; $('direction').setAttribute('aria-pressed', 'true'); }

mount($('stage-icon'), icon('bolt', 24));
mount($('note-icon'), icon('check', 14));
mount($('hud-icon'), icon('gauge', 18));
mount($('stage-stats'), stat('24', 'Active members'), stat('08', 'Projects created'));
$('demo-action').addEventListener('click', () => feedback('Preview action: Create project'));

mount($('buttons'),
    button('Continue', { variant: 'primary', icon: 'arrow', onClick: () => feedback('Primary button selected') }),
    button('Secondary', { onClick: () => feedback('Secondary button selected') }),
    button('Ghost', { variant: 'ghost', onClick: () => feedback('Ghost button selected') }),
    button('Confirm', { variant: 'good', icon: 'check', onClick: () => feedback('Success action selected') }),
    button('Delete', { variant: 'danger', icon: 'close', onClick: () => feedback('Preview action: Delete') }),
    button('Disabled', { disabled: true }), button('Small', { small: true, onClick: () => feedback('Small button selected') }));
mount($('chips'), chip('Ready', 'open'), chip('Active', 'live'), chip('Starting', 'starting'), chip('Upcoming', 'upcoming'), chip('Full', 'full'));
mount($('fields'), field('Project name', { id: 'project-name', value: 'Krovix Studio', placeholder: 'Enter a project name', help: 'Give your workspace a recognizable name.' }),
    h('div.field', h('label', { for: 'visibility' }, 'Visibility'), h('select', { id: 'visibility' }, h('option', 'Team workspace'), h('option', 'Private workspace'))));
mount($('cards'),
    card({ title: 'Studio workspace', description: 'A shared place for your next idea.', icon: 'grid', status: 'live', statusLabel: 'Active', meta: [['Members', '24'], ['Projects', '8']], actions: [progress(72, 100, 'Workspace completion'), button('Open', { variant: 'primary', small: true, onClick: () => feedback('Preview action: Open workspace') })] }),
    card({ title: 'Team dashboard', description: 'A clear view of what comes next.', icon: 'chart', status: 'upcoming', statusLabel: 'Upcoming', meta: [['Updates', '12'], ['Tasks', '36']], actions: [progress(40, 100, 'Dashboard completion'), button('View', { small: true, onClick: () => feedback('Preview action: View dashboard') })] }),
    card({ title: 'Member profile', description: 'Bring every contribution into focus.', icon: 'users', status: 'open', statusLabel: 'Ready', meta: [['Level', '18'], ['Points', '2480']], actions: [progress(92, 100, 'Profile completion'), button('Explore', { small: true, onClick: () => feedback('Preview action: Explore profile') })] }));

for (const tab of document.querySelectorAll('.sample-tabs .tab')) tab.addEventListener('click', () => {
    for (const sibling of tab.parentElement.children) {
        sibling.classList.toggle('active', sibling === tab);
        sibling.setAttribute('aria-pressed', String(sibling === tab));
    }
    feedback('Preview view: ' + tab.textContent);
});

function renderIcons(filter = '') {
    const names = ICON_NAMES.filter(name => name.includes(filter.toLowerCase().trim()));
    mount($('icon-grid'), names.map(name => h('div.icon-tile', icon(name, 24), h('span', name))));
    $('icon-empty').classList.toggle('hidden', names.length > 0);
}
$('icon-search').addEventListener('input', (event) => renderIcons(event.target.value));
renderIcons();
selectTheme(current);
