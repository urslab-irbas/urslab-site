const pptxgen = require('pptxgenjs');
const fs = require('fs');
const sharp = require('sharp');
const React = require('react');
const RDS = require('react-dom/server');
const fa = require('react-icons/fa');
const { applyTheme } = require('/root/.claude/skills/synced/8aad1fcd-3bf4-4a73-b414-029e650b2f1c_6f82bf5f-30d4-4450-b0e6-bef4b5e8240e/pptx/scripts/apply_theme.js');

const IMG = '/tmp/claude-0/deck/img/';
const OUT = '/tmp/claude-0/deck/URSlab-rakovodstvo.pptx';
const THEME = {
  name: 'URSlab',
  headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: {
    dk1: '0B1622', lt1: 'FFFFFF', dk2: '13243A', lt2: 'F3F5F7',
    accent1: 'E0892B', accent2: '5FB3D9', accent3: '2E7D4F', accent4: 'C0392B', accent5: '9A5410', accent6: '8EA3B6',
    hlink: '9A5410', folHlink: '6B3A0B',
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'Сайтът на URSlab — ръководство за нов член на екипа';
pres.author = 'URSlab, ИР–БАН';
pres.company = 'Институт по роботика – БАН';
const C = pres.SchemeColor;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: 'TITLE', background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.5, w: 8.2, h: 1.6, fontSize: 38, bold: true, color: C.background1, valign: 'bottom', align: 'left', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.25, w: 8.2, h: 0.9, fontSize: 16, color: C.accent6, valign: 'top', align: 'left', margin: 0 }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'SECTION', background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 2.2, y: 1.9, w: 7.2, h: 1.0, fontSize: 34, bold: true, color: C.background1, valign: 'middle', align: 'left', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 2.2, y: 2.95, w: 7.2, h: 0.9, fontSize: 15, color: C.accent6, valign: 'top', align: 'left', margin: 0 }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'CONTENT', background: { color: C.background1 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9.0, h: 0.7, fontSize: 26, bold: true, color: C.text1, valign: 'middle', align: 'left', margin: 0 }, text: '' } },
    { text: { text: 'URSlab · Ръководство за нов член на екипа', options: { x: 0.5, y: 5.25, w: 6, h: 0.25, fontSize: 9, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.25, w: 0.5, h: 0.25, fontSize: 9, color: C.accent6, align: 'right' },
});

// ---------- helpers ----------
async function icon(Comp, color = '#FFFFFF') {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}
async function imgFit(slide, file, x, y, maxW, maxH, name) {
  const m = await sharp(IMG + file).metadata();
  const r = Math.min(maxW / m.width, maxH / m.height);
  const w = m.width * r, h = m.height * r;
  const ix = x + (maxW - w) / 2, iy = y;
  slide.addShape(pres.shapes.RECTANGLE, { x: ix, y: iy, w, h, fill: { color: C.background2 }, line: { color: 'DDE2E6', width: 0.75 },
    shadow: { type: 'outer', color: '0B1622', opacity: 0.18, blur: 6, offset: 2, angle: 90 }, objectName: name + ' frame' });
  slide.addImage({ path: IMG + file, x: ix, y: iy, w, h, objectName: name, altText: name });
  return { x: ix, y: iy, w, h };
}
function badge(slide, n, x, y, d = 0.42, fill = C.accent1) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: 'badge ' + n });
  slide.addText(String(n), { x, y, w: d, h: d, fontSize: d > 0.5 ? 20 : 14, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
}
function bullets(slide, items, x, y, w, h, size = 13) {
  slide.addText(items.map((t, i) => {
    const runs = Array.isArray(t) ? t : [{ text: t }];
    return runs.map((r, j) => ({ text: r.text, options: { ...(r.options || {}), bullet: j === 0 ? { indent: 14 } : undefined, breakLine: j === runs.length - 1 && i < items.length - 1, paraSpaceAfter: 5 } }));
  }).flat(), { x, y, w, h, fontSize: size, color: C.text1, valign: 'top', margin: 0, isTextBox: true });
}
const b = (t) => ({ text: t, options: { bold: true } });
const n = (t) => ({ text: t });

(async () => {
  const I = {
    globe: await icon(fa.FaGlobeEurope), flask: await icon(fa.FaFlask), book: await icon(fa.FaBook), users: await icon(fa.FaUsers),
    plus: await icon(fa.FaPlusCircle), github: await icon(fa.FaGithub), sync: await icon(fa.FaSyncAlt), q: await icon(fa.FaQuestionCircle),
    check: await icon(fa.FaCheckCircle, '#2E7D4F'), times: await icon(fa.FaTimesCircle, '#C0392B'), plane: await icon(fa.FaPaperPlane),
    edit: await icon(fa.FaPen), file: await icon(fa.FaFileCsv), user: await icon(fa.FaUserEdit), lock: await icon(fa.FaLock),
  };
  const iconCircle = (slide, data, x, y, d = 0.55, fill = C.accent1) => {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
    slide.addImage({ data, x: x + d * 0.22, y: y + d * 0.22, w: d * 0.56, h: d * 0.56 });
  };
  const sec = (title) => pres.addSection({ title });
  const S = (master, section) => pres.addSlide({ masterName: master, sectionTitle: section });
  const section = (num, title, sub, ic, secName) => {
    sec(secName);
    const s = S('SECTION', secName);
    s.addShape(pres.shapes.OVAL, { x: 0.6, y: 1.85, w: 1.2, h: 1.2, fill: { color: C.accent1 }, line: { color: C.accent1 } });
    s.addText(String(num), { x: 0.6, y: 1.85, w: 1.2, h: 1.2, fontSize: 40, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0, isTextBox: true, fontFace: 'Cambria' });
    s.addText(title, { placeholder: 'title' });
    s.addText(sub, { placeholder: 'body' });
    return s;
  };

  // 1. Title
  sec('Въведение');
  let s = S('TITLE', 'Въведение');
  s.addText('Сайтът на URSlab — ръководство за нов член на екипа', { placeholder: 'title' });
  s.addText('urs.ir.bas.bg · Лаборатория „Безпилотни роботизирани системи“, Институт по роботика – БАН', { placeholder: 'body' });
  s.addText('Как да ползвате сайта, как да въведете нова публикация и как сайтът се обновява', { x: 0.6, y: 4.45, w: 8.5, h: 0.4, fontSize: 13, italic: true, color: C.accent1, margin: 0, isTextBox: true });
  s.addNotes('Презентацията е за обучение на нов член на колектива. Отделете около 20 минути; препоръчително е да разглеждате сайта паралелно.');

  // 2. Agenda
  s = S('CONTENT', 'Въведение');
  s.addText('Съдържание', { placeholder: 'title' });
  const agenda = [
    [I.globe, 'Какво има в сайта', 'Меню, двата езика, начална страница'],
    [I.flask, 'Изследвания', 'Направления, броячи, модел на Кумер'],
    [I.book, 'Публикации', 'Филтри, годишни страници, отчет, CSV'],
    [I.users, 'Състав', 'Карти, „Обобщен отчет“ за всеки член'],
    [I.plus, 'Нова публикация', 'Форма, APA стил, проверка, GitHub'],
    [I.sync, 'Обновяване на сайта', 'Pull Request → Merge → публикуване'],
  ];
  agenda.forEach(([ic, t, d], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6, y = 1.25 + row * 1.2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.3, h: 1.0, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 } });
    iconCircle(s, ic, x + 0.2, y + 0.22);
    s.addText([{ text: `${i + 1}. ${t}`, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 11.5, color: C.text2 } }],
      { x: x + 0.95, y: y + 0.12, w: 3.2, h: 0.76, valign: 'middle', margin: 0, color: C.text1, isTextBox: true });
  });

  // ---------- Section 1 ----------
  section(1, 'Какво има в сайта', 'Статичен двуезичен сайт: български на urs.ir.bas.bg, английски на /en/', I.globe, 'Сайтът');
  s = S('CONTENT', 'Сайтът');
  s.addText('Начална страница и меню', { placeholder: 'title' });
  await imgFit(s, 'home.jpg', 0.5, 1.15, 5.4, 3.9, 'Начална страница');
  bullets(s, [
    [b('Меню: '), n('Начало, Изследвания, Състав, Проекти, Публикации, Услуги, Контакти.')],
    [b('Език: '), n('бутонът „English“ горе вдясно води до същата страница на английски.')],
    [b('Живият модел '), n('на началната страница показва идеята за плавен завой по клотоида.')],
    [b('Статистика: '), n('посещенията се броят без бисквитки (GoatCounter).')],
  ], 6.15, 1.2, 3.4, 3.8, 12.5);
  s.addNotes('Всяка страница съществува и на двата езика. Съдържанието се поддържа в src/data/ — не в самите страници.');

  // ---------- Section 2 ----------
  section(2, 'Изследвания', 'Шест научни направления, свързани с публикациите', I.flask, 'Изследвания');
  s = S('CONTENT', 'Изследвания');
  s.addText('Научни направления', { placeholder: 'title' });
  await imgFit(s, 'research.jpg', 0.5, 1.15, 5.4, 3.9, 'Изследвания');
  bullets(s, [
    [b('Всяка карта '), n('показва колко публикации има в направлението.')],
    [b('Броят се обновява сам '), n('при всяка нова публикация, въведена от колектива.')],
    [b('Клик върху картата '), n('отваря всички публикации на направлението с филтри и отчет.')],
    [b('„Автономна навигация“ '), n('води към страницата с уникалния модел и приносите.')],
  ], 6.15, 1.2, 3.4, 3.8, 12.5);
  s.addNotes('Направлението на публикацията се определя от темите, които отбелязвате при въвеждане.');

  s = S('CONTENT', 'Изследвания');
  s.addText('Модел на Кумер („Автономна навигация“)', { placeholder: 'title' });
  await imgFit(s, 'model.jpg', 0.5, 1.15, 4.3, 3.9, 'Модел на Кумер');
  bullets(s, [
    [b('Изчислява се на живо '), n('в браузъра по уравненията от статията.')],
    [b('Плъзгачи: '), n('скорост W (до 150 m/s) и максимален крен γmax (от 28°).')],
    [b('Изберете завой '), n('на картата или в таблицата — вижда се увеличение с точките b₁ и b₂.')],
    [b('Графики: '), n('пътен ъгъл и странично ускорение, сравнени с класическия завой.')],
    [b('Над модела '), n('са научните и научно-приложните приноси на статията.')],
  ], 5.1, 1.2, 4.45, 3.8, 12.5);

  // ---------- Section 3 ----------
  section(3, 'Публикации', 'Текущ списък, годишни страници и обобщение за отчет', I.book, 'Публикации');
  s = S('CONTENT', 'Публикации');
  s.addText('Страница „Публикации“', { placeholder: 'title' });
  await imgFit(s, 'pubs.jpg', 0.5, 1.15, 5.4, 3.9, 'Публикации');
  bullets(s, [
    [b('Филтри '), n('„По направление“ и „По тема“ — показват само съответните публикации.')],
    [b('Заглавието '), n('е връзка към публикацията (DOI), ако има такава.')],
    [b('„Архив“ '), n('в края на страницата: годишни страници 2026, 2025, 2022 – 2024 и до 2021 г.')],
    [b('Всяка публикация '), n('е на страницата за годината си.')],
  ], 6.15, 1.2, 3.4, 3.8, 12.5);

  s = S('CONTENT', 'Публикации');
  s.addText('Годишни страници и обобщение за отчет', { placeholder: 'title' });
  await imgFit(s, 'summary.jpg', 0.5, 1.15, 9.0, 1.95, 'Обобщение за отчет');
  const tiles = [
    [I.flask, 'Филтри', 'направление, тема, индексиране/квартил, година, автор — комбинират се'],
    [I.check, 'Обобщение', 'брой, WoS/Scopus, квартили, Σ SJR, Σ IF, DOI, дял ИР — за избраното'],
    [I.file, 'CSV и печат', '„Изтегли CSV“ отваря се в Excel; „Печат“ — без менюто'],
  ];
  tiles.forEach(([ic, t, d], i) => {
    const x = 0.5 + i * 3.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.45, w: 2.85, h: 1.55, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 } });
    iconCircle(s, ic, x + 0.18, 3.62, 0.48, i === 1 ? C.accent3 : C.accent1);
    s.addText(t, { x: x + 0.8, y: 3.62, w: 1.95, h: 0.48, fontSize: 14, bold: true, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
    s.addText(d, { x: x + 0.18, y: 4.2, w: 2.55, h: 0.75, fontSize: 11, color: C.text2, valign: 'top', margin: 0, isTextBox: true });
  });
  s.addNotes('Обобщението е предназначено за отчети пред ръководството на института. Резултатът зависи от избраните филтри.');

  // ---------- Section 4 ----------
  section(4, 'Състав', 'Карта на всеки член, обобщен отчет и бутон за нова публикация', I.users, 'Състав');
  s = S('CONTENT', 'Състав');
  s.addText('Картата на член от колектива', { placeholder: 'title' });
  await imgFit(s, 'card.jpg', 0.5, 1.15, 3.6, 3.9, 'Карта на член');
  const cardItems = [
    [1, 'Звание, име, роля и научни интереси'],
    [2, '„Обобщен отчет“ — всички публикации на човека от целия сайт'],
    [3, '„+ Нова публикация“ — само за членове с GitHub акаунт'],
    [4, 'ORCID, Google Scholar / ResearchGate, имейл'],
  ];
  cardItems.forEach(([k, t], i) => {
    const y = 1.3 + i * 0.9;
    badge(s, k, 4.5, y, 0.45);
    s.addText(t, { x: 5.1, y: y - 0.05, w: 4.4, h: 0.55, fontSize: 13.5, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
  });
  s.addText('Профилът си редактирате във файла src/data/team/<фамилия>.ts — вижте CONTRIBUTING.md.', { x: 4.5, y: 4.85, w: 5.0, h: 0.3, fontSize: 10.5, italic: true, color: C.accent5, margin: 0, isTextBox: true });

  s = S('CONTENT', 'Състав');
  s.addText('Обобщен отчет на член от колектива', { placeholder: 'title' });
  await imgFit(s, 'report.jpg', 0.5, 1.15, 5.0, 3.9, 'Обобщен отчет');
  bullets(s, [
    [b('Всички публикации '), n('на човека от целия сайт, без повторения (по DOI или заглавие).')],
    [b('Филтър „Съавтор“ '), n('показва общите публикации с колега.')],
    [b('Категориите '), n('включват и „Подадени / под печат“ и „Софтуер“.')],
    [b('CSV и печат '), n('— готово за годишния отчет.')],
    [b('Липсва публикация? '), n('Въведете я през формата — отчетът се обновява сам.')],
  ], 5.8, 1.2, 3.75, 3.8, 12.5);

  // ---------- Section 5 ----------
  section(5, 'Нова публикация', 'От формата на сайта до публикуването — пет стъпки', I.plus, 'Нова публикация');
  s = S('CONTENT', 'Нова публикация');
  s.addText('Целият път на една нова публикация', { placeholder: 'title' });
  const flow = [
    [I.edit, 'Попълване', 'Състав → вашата карта → „+ Нова публикация“'],
    [I.check, 'Запиши', 'проверка във формата; грешките са в червено'],
    [I.github, 'GitHub', 'вход с вашия акаунт → зелен бутон „Create“'],
    [I.sync, 'Проверка', 'DOI / ISSN / ISBN в регистрите: ✅ или ❌'],
    [I.globe, 'На сайта', 'автоматично, до около минута'],
  ];
  flow.forEach(([ic, t, d], i) => {
    const x = 0.5 + i * 1.84;
    iconCircle(s, ic, x + 0.5, 1.35, 0.7, i === 4 ? C.accent3 : C.accent1);
    badge(s, i + 1, x + 0.38, 1.25, 0.3, C.text1);
    if (i < 4) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 1.38, y: 1.58, w: 0.42, h: 0.24, fill: { color: C.accent6 }, line: { color: C.accent6 } });
    s.addText(t, { x, y: 2.2, w: 1.7, h: 0.4, fontSize: 14, bold: true, color: C.text1, align: 'center', margin: 0, isTextBox: true });
    s.addText(d, { x, y: 2.6, w: 1.7, h: 0.9, fontSize: 11, color: C.text2, align: 'center', valign: 'top', margin: 0, isTextBox: true });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.75, w: 9.0, h: 1.25, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 } });
  iconCircle(s, I.lock, 0.75, 4.08, 0.6, C.text1);
  s.addText([
    { text: 'Защо GitHub? ', options: { bold: true } },
    { text: 'Сайтът няма собствен вход и не пази пароли. Самоличността се проверява от GitHub: заявка се приема само от акаунта на члена (или на ръководителя). Хранилището е публично — за статии под рецензия въвеждайте само резюме, никога пълен текст.' },
  ], { x: 1.55, y: 3.85, w: 7.8, h: 1.05, fontSize: 12, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });

  s = S('CONTENT', 'Нова публикация');
  s.addText('Формата: полета и подсказки', { placeholder: 'title' });
  await imgFit(s, 'form.jpg', 0.5, 1.15, 4.6, 3.9, 'Формата');
  const rows = [
    ['Поле', 'Какво се въвежда'],
    ['Автори *', 'APA: „Фамилия, И.“, запетаи, „&“ преди последния'],
    ['Година *', 'година на публикуване → годишната страница'],
    ['Заглавие *', 'точно както е публикувано, без точка накрая'],
    ['Състояние *', 'публикувана / под печат / подадена'],
    ['Категория *', 'Q1–Q4, SJR…; непубликувана → „Подадени“'],
    ['Списание *', 'пълно име; за книги — „Издател“'],
    ['Том, брой, стр.', 'само числата; „45–67“ или № на статия'],
    ['DOI', 'напр. 10.3390/… — проверява се в doi.org'],
    ['ISSN / ISBN **', 'без DOI: вид + номер; проверява се в регистрите'],
    ['SJR / IF', 'задължително за Q1–Q4 и „SJR без квартил“'],
    ['Теми *', 'поне една — свързват с направленията'],
  ];
  s.addTable(rows.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0 || j === 0, color: i === 0 ? HEX.lt1 : HEX.dk1, fill: { color: i === 0 ? HEX.dk1 : (i % 2 ? 'FFFFFF' : HEX.lt2) } } }))),
    { x: 5.35, y: 1.15, w: 4.15, colW: [1.25, 2.9], fontSize: 10, rowH: 0.32, border: { type: 'solid', pt: 0.5, color: 'DDE2E6' }, valign: 'middle', margin: [2, 5, 2, 5] });

  s = S('CONTENT', 'Нова публикация');
  s.addText('Авторите в APA стил', { placeholder: 'title' });
  const rules = [
    [1, 'Всеки автор: фамилия, запетая, инициали с точка.'],
    [2, 'Авторите се разделят със запетая.'],
    [3, 'Преди последния автор: „&“ (запетая пред него при 3+ автори).'],
    [4, 'Редът е като в статията; без „et al.“'],
    [5, 'Частиците остават малки: „del Estad Herrero, A.“'],
  ];
  rules.forEach(([k, t], i) => { badge(s, k, 0.5, 1.25 + i * 0.7, 0.42); s.addText(t, { x: 1.1, y: 1.22 + i * 0.7, w: 3.9, h: 0.5, fontSize: 13.5, color: C.text1, valign: 'middle', margin: 0, isTextBox: true }); });
  const ex = [
    ['✓', 'Madzharov, A.'],
    ['✓', 'Gaidarski, I., & Madzharov, A.'],
    ['✓', 'Madzharov, A., Hristozov, S., & Gaidarski, I.'],
    ['✓', 'Чехларова, Н., & Чехларова, К.'],
    ['✗', 'Madzharov A., Hristozov S.'],
    ['✗', 'A. Madzharov, S. Hristozov'],
  ];
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.3, y: 1.15, w: 4.2, h: 3.85, rectRadius: 0.08, fill: { color: C.text1 }, line: { color: C.text1 } });
  s.addText('Примери', { x: 5.55, y: 1.3, w: 3.7, h: 0.35, fontSize: 13, bold: true, color: C.accent1, margin: 0, isTextBox: true });
  s.addText(ex.map(([m, t], i) => [
    { text: m + '  ', options: { bold: true, color: m === '✓' ? '6FCF97' : 'FF8A80' } },
    { text: t, options: { color: 'E9EEF2', breakLine: i < ex.length - 1 } },
  ]).flat(), { x: 5.55, y: 1.75, w: 3.8, h: 3.1, fontSize: 12.5, fontFace: 'Courier New', valign: 'top', paraSpaceAfter: 8, margin: 0, isTextBox: true });

  s = S('CONTENT', 'Нова публикация');
  s.addText('Проверка във формата: грешка и успех', { placeholder: 'title' });
  const e1 = await imgFit(s, 'form-err.jpg', 0.5, 1.15, 4.4, 3.3, 'Грешки');
  const e2 = await imgFit(s, 'form-ok.jpg', 5.1, 1.15, 4.4, 3.3, 'Успех');
  s.addImage({ data: I.times, x: 0.5, y: 4.62, w: 0.32, h: 0.32 });
  s.addText('Грешните полета се оцветяват в червено с обяснение. Поправете и натиснете „Запиши“ отново.', { x: 0.92, y: 4.55, w: 4.0, h: 0.5, fontSize: 11, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
  s.addImage({ data: I.check, x: 5.1, y: 4.62, w: 0.32, h: 0.32 });
  s.addText('Прегледът в APA стил е готов; GitHub се отваря в нов прозорец с готова заявка.', { x: 5.52, y: 4.55, w: 4.0, h: 0.5, fontSize: 11, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });

  s = S('CONTENT', 'Нова публикация');
  s.addText('В GitHub: заявка, проверка, публикуване', { placeholder: 'title' });
  const gh = [
    [I.github, C.text1, 'Create', 'Влезте със своя акаунт и натиснете зеления бутон „Create“. Не променяйте текста на заявката.'],
    [I.check, C.accent3, 'Приета', 'DOI, ISSN или ISBN е намерен в регистрите (doi.org, Crossref, НАЦИД НРС, ISSN Portal, Open Library) — публикацията излиза на сайта сама.'],
    [I.times, C.accent4, 'Грешка', 'Грешка или номер, който не е в регистрите — списък и връзка „Поправете във формата“ (данните са попълнени). Поправете и „Запиши“ отново.'],
    [I.users, C.accent1, 'Контрол', 'Всяко публикуване е в дневник; ръководителят получава уведомление и може да го върне с едно щракване (отметка „Върни“).'],
  ];
  gh.forEach(([ic, col, t, d], i) => {
    const y = 1.2 + i * 0.97;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 9.0, h: 0.82, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 } });
    s.addShape(pres.shapes.OVAL, { x: 0.68, y: y + 0.13, w: 0.56, h: 0.56, fill: { color: i === 1 || i === 2 ? C.background1 : col }, line: { color: col, width: 1.5 } });
    s.addImage({ data: i === 1 || i === 2 ? ic : ic, x: 0.8, y: y + 0.25, w: 0.32, h: 0.32 });
    s.addText(t, { x: 1.45, y, w: 1.45, h: 0.82, fontSize: 15, bold: true, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
    s.addText(d, { x: 2.95, y, w: 6.4, h: 0.82, fontSize: 12, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
  });

  // ---------- Section 6 ----------
  section(6, 'Обновяване на сайта', 'Merge в main = сайтът се обновява сам за около минута', I.sync, 'Обновяване');
  s = S('CONTENT', 'Обновяване');
  s.addText('Как и кога се обновява сайтът', { placeholder: 'title' });
  const tl = [
    ['Merge', 'ръководителят одобрява Pull Request-а'],
    ['Build', 'GitHub изгражда сайта (≈ 30 s)'],
    ['Deploy', 'качване на urs.ir.bas.bg (≈ 30 s)'],
    ['Готово', 'Ctrl+F5 в браузъра'],
  ];
  s.addShape(pres.shapes.LINE, { x: 1.2, y: 1.95, w: 7.6, h: 0, line: { color: C.accent6, width: 2 } });
  tl.forEach(([t, d], i) => {
    const x = 0.7 + i * 2.53;
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 1.6, w: 0.7, h: 0.7, fill: { color: i === 3 ? C.accent3 : C.accent1 }, line: { color: C.background1, width: 3 } });
    s.addText(String(i + 1), { x: x + 0.3, y: 1.6, w: 0.7, h: 0.7, fontSize: 18, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    s.addText(t, { x: x - 0.3, y: 2.45, w: 1.9, h: 0.4, fontSize: 15, bold: true, color: C.text1, align: 'center', margin: 0, isTextBox: true });
    s.addText(d, { x: x - 0.3, y: 2.85, w: 1.9, h: 0.6, fontSize: 11, color: C.text2, align: 'center', valign: 'top', margin: 0, isTextBox: true });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.75, w: 9.0, h: 1.25, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 } });
  bullets(s, [
    [b('Къде се появява новата публикация: '), n('на годишната страница (Публикации → Архив), в „Обобщен отчет“ на всеки съавтор и в броя на научните направления.')],
    [b('Не виждате промяната? '), n('Натиснете Ctrl+F5 или отворете страницата в прозорец „инкогнито“.')],
  ], 0.75, 3.88, 8.6, 1.05, 12);

  s = S('CONTENT', 'Обновяване');
  s.addText('Помощ и полезни връзки', { placeholder: 'title' });
  await imgFit(s, 'help.jpg', 0.5, 1.15, 4.4, 3.9, 'Помощ във формата');
  bullets(s, [
    [b('Помощ във формата: '), n('бутон „Помощ“ — APA, проверки, обновяване.')],
    [b('Форма: '), n('urs.ir.bas.bg/publications/new/')],
    [b('Заявки в GitHub: '), n('github.com/urslab-irbas/urslab-site/issues')],
    [b('Инструкция за редакция на профила: '), n('CONTRIBUTING.md в хранилището.')],
    [b('Въпроси: '), n('ръководителят на лабораторията — доц. д-р инж. А. Маджаров.')],
  ], 5.2, 1.2, 4.35, 3.8, 12.5);

  // closing
  s = S('TITLE', 'Обновяване');
  s.addText('Добре дошли в URSlab!', { placeholder: 'title' });
  s.addText('Първа стъпка: отворете „Състав“, намерете вашата карта и разгледайте своя „Обобщен отчет“.', { placeholder: 'body' });

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('written', OUT);
})();
