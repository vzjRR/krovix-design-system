import { h, mount, button, icon, animateModule, cancelMotion } from '../src/index.js';

const host = document.getElementById('command-deck-demo');
let arabic = false;
let module = 0;
const labels = {
    en: ['Operations', 'Event roster', 'Schedule', 'Standings', 'Settings'],
    ar: ['العمليات', 'قائمة الفعاليات', 'الجدول', 'الترتيب', 'الإعدادات'],
};
function render() {
    const lang = arabic ? 'ar' : 'en';
    const tr = (en, ar) => arabic ? ar : en;
    const content = h('div');
    const dialog = h('dialog.kd-dialog',
        h('h3', tr('Pause this demonstration?', 'إيقاف العرض مؤقتاً؟')),
        h('p', tr('This is a presentation example. No game action is performed.', 'هذا مثال للعرض فقط. لا يتم تنفيذ أي إجراء داخل اللعبة.')),
        h('div.kd-controls', button(tr('Cancel', 'إلغاء'), { onClick: () => dialog.close() }), button(tr('Confirm', 'تأكيد'), { variant: 'primary', onClick: () => dialog.close() })));
    const nav = labels[lang].map((label, index) => h('button.kd-command', {
        type: 'button', 'aria-current': module === index ? 'page' : undefined,
        onclick: () => { module = index; render(); },
    }, h('small', String(index + 1).padStart(2, '0')), icon(['gauge', 'list', 'clock', 'trophy', 'settings'][index], 16), label));
    const instruments = h('div.kd-instruments',
        ...[[0, tr('Active events', 'الفعاليات النشطة')], [0, tr('Open lobbies', 'الغرف المفتوحة')], [2, tr('Demo dossiers', 'ملفات تجريبية')], [0, tr('Scheduled', 'المجدولة')]].map(([value, label]) => h('div.kd-instrument', h('b', String(value)), h('span', label))));
    const empty = h('div.kd-empty', h('img.kd-art', { src: '../assets/art/command-deck.svg', alt: '', 'aria-hidden': 'true' }),
        h('span.kd-status', tr('No active operation', 'لا توجد عملية نشطة')),
        h('h3', tr('The next event starts here.', 'الفعالية القادمة تبدأ هنا.')),
        h('p', tr('A quiet command workspace with a clear next action. Artwork is schematic, not live map data.', 'مساحة قيادة هادئة مع إجراء تالٍ واضح. الرسم توضيحي ولا يمثل بيانات خريطة حية.')),
        button(tr('Open event roster', 'فتح قائمة الفعاليات'), { variant: 'primary', onClick: () => { module = 1; render(); } }));
    const roster = h('div.kd-roster', ...['Circuit / 01', 'Arena / 02'].map((name, index) => h('article.kd-entry',
        icon(index ? 'trophy' : 'flag', 24), h('div', h('h3', name), h('small', tr('EXAMPLE / PRESENTATION ONLY', 'مثال / للعرض فقط'))),
        h('span.kd-status', { 'data-state': index ? 'warning' : '' }, tr('Draft', 'مسودة')),
        h('div.kd-controls', button(tr('Inspect', 'فحص'), { small: true, onClick: () => dialog.showModal() })))));
    const primary = h('section.kd-panel', h('div.kd-panel-head', labels[lang][module], h('span.kd-eyebrow', '01 / KROVIX')), module === 1 ? roster : empty);
    const side = h('aside.kd-panel', h('div.kd-panel-head', tr('Operational sequence', 'تسلسل العمليات')),
        h('ol.kd-timeline', ...[tr('Configure the competition', 'إعداد المنافسة'), tr('Review participants', 'مراجعة المشاركين'), tr('Open the lobby', 'فتح الغرفة')].map((text, i) => h('li', h('time', String(i + 1).padStart(2, '0')), text))),
        h('div.kd-controls', { style: { padding: '0 18px 18px' } }, button(tr('Confirmation example', 'مثال التأكيد'), { onClick: () => dialog.showModal() })));
    content.append(h('div.kd-module-head', h('div', h('span.kd-eyebrow', tr('Game interface / command deck', 'واجهة اللعبة / منصة القيادة')), h('h2', labels[lang][module])),
        h('div.kd-controls', button(arabic ? 'English' : 'العربية', { onClick: () => { arabic = !arabic; render(); } }), button(tr('Replay motion', 'إعادة الحركة'), { onClick: () => animateModule(content, { opening: true }) }))), instruments,
        h('div.kd-operations', primary, side));
    const old = host.querySelector('[data-demo-content]');
    if (old) cancelMotion(old);
    content.dataset.demoContent = '';
    mount(host, h('div.kd-shell', { dir: arabic ? 'rtl' : 'ltr', lang },
        h('header.kd-identity', h('img', { src: '../assets/krovix-mark.png', alt: 'Krovix' }), h('div', h('h1', 'KROVIX'), h('small', tr('COMMAND DECK / COMPONENT STUDY', 'منصة القيادة / عرض المكونات'))), h('span.kd-controls.kd-status', tr('Demonstration', 'عرض توضيحي'))),
        h('nav.kd-nav', { 'aria-label': tr('Demonstration modules', 'وحدات العرض') }, nav), content, dialog));
    animateModule(content, { direction: arabic ? 'rtl' : 'ltr' });
}
render();
