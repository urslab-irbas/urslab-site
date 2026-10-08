// Excel таблицата по образеца на ННП „Сигурност и отбрана“ — генерира се при всеки build от същите данни
// като страницата /projects/nspsd/ (nspsd.ts), така че всяка промяна в списъка влиза и тук.
// Шаблон: scripts/nspsd/template.xlsx · данни, които ги няма в записите на сайта: src/data/nspsdExcel.ts
// · данни на издателя по DOI: src/data/nspsdMeta.json.
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { nspsdPubs } from '../../data/nspsd';
import { nspsdRefFor } from '../../data/nspsdRefs';
import { excelRows, type ExcelRow } from '../../data/nspsdExcel';
import { expectedFor, SJR_YEAR } from '../../data/series';
import meta from '../../data/nspsdMeta.json';
import type { ArchivePub } from '../../data/archive2022';

const NSP = 'ННП „Сигурност и отбрана“ (NSP DS), Договор № Д01-74/19.05.2022 г., МОН';
const META = meta as Record<string, { authors?: string[]; date?: string; volume?: string; issue?: string; page?: string; abstract?: string }>;

// пълни имена за авторите, изписани с инициали на сайта (фамилия → име, както е публикувано)
const FULL: [RegExp, string][] = [
  [/Madzharov|Madjarov/, 'Anastas Madzharov'], [/Hristozov/, 'Stefan Hristozov'], [/Gaidarski/, 'Ivan Gaidarski'],
  [/Chehlarova/, 'Neda Chehlarova'], [/Ale[kx]androv/, 'Alexander Alexandrov'], [/Georgiev/, 'Rumen Georgiev'],
  [/Zahariev/, 'Roman Zahariev'], [/Valchkova/, 'Nina Valchkova'], [/Kutinchev/, 'Pavlin Kutinchev'],
  [/Stanev/, 'Hristo Stanev'], [/Yoshinov/, 'Radoslav Yoshinov'], [/Kotseva/, 'Monka Kotseva'],
  [/Dishkova/, 'Galina Dishkova'], [/Angelov, S/, 'Simeon Angelov'], [/Apter/, 'Nathanel Apter'],
  [/Herrero/, 'Alejandro del Estal Herrero'], [/Tzvetkov|Tsvetkov/, 'Vasil Tsvetkov'], [/Paunski/, 'Yasen Paunski'], [/Angelov, G/, 'Georgi Angelov'], [/Varbanov/, 'Iskren Varbanov'], [/Zlateva/, 'Plamena Zlateva'],
  [/Райков/, 'Пламен Райков'], [/Вълчкова/, 'Нина Вълчкова'], [/Захариев/, 'Роман Захариев'],
  [/Гайдарски/, 'Иван Гайдарски'], [/Кутинчев/, 'Павлин Кутинчев'], [/Маджаров/, 'Анастас Маджаров'], [/Чехларова, Н/, 'Неда Чехларова'],
];
const fullNames = (p: ArchivePub) => {
  const m = p.doi ? META[p.doi.toLowerCase()] : undefined;
  if (m?.authors?.length) return m.authors.join(', ');
  const raw = p.authors.replace(/\s*&\s*/g, ', ');
  const parts = /^[A-ZА-Я]\.\s/.test(raw) ? raw.split(',').map((x) => x.trim())               // „A. Madzharov, S. Hristozov“
    : /,\s*[A-ZА-Я][a-zа-я]?\./.test(raw) ? (raw.match(/[^,]+,\s*[^,]+?\.(?=,|$)/g) ?? [raw])    // „Madzharov, A., Hristozov, S.“
    : raw.split(',').map((x) => x.trim());
  return parts.map((x) => FULL.find(([re]) => re.test(x.trim()))?.[1] ?? x.trim()).join(', ');
};

const CONF_RE = /conf|proc|bisec|ceur|icmcis|envirorisks|amitans|infus|techsys|robotics & mechatronics|artdef|институт по отбрана|сборник|symposium|workshop/i;
const indexLabel = (p: ArchivePub) =>
  ['q1', 'q2', 'q3', 'q4', 'sjr', 'idx'].includes(p.cat) ? 'Scopus' : p.cat === 'nat' ? 'Национален референтен списък' : p.cat === 'sub' ? 'Не е индексирана' : 'Друго';
const isDate = (s?: string) => !!s && !/[a-zа-я]/i.test(s);

const linkTo = (p: ArchivePub, r: ExcelRow) => r.link !== undefined ? r.link : p.doi && !p.doiOff ? `https://doi.org/${p.doi}` : p.url ?? '';

const nspText = (p: ArchivePub, r: ExcelRow) => {
  const t: string[] = [p.fundVia === 'conf' ? `Участието в конференцията е финансирано изцяло по ${NSP}.` : p.fundVia === 'report' ? `Отчетено по ${NSP}, пред ЦИНСО-БАН.` : `Финансирано по ${NSP}.`];
  if (p.task) t.push(`Задача(и): ${p.task}.`);
  if (p.cat === 'sub') {
    const e = expectedFor(p.venue);
    const ex = e ? `; очаквано индексиране: Scopus${/^q\d$/.test(e.cat) ? ` ${e.cat.toUpperCase()}` : ''}, SJR ${e.sjr.toFixed(3)}${/^q\d$/.test(e.cat) ? '' : ' (без квартил)'} (SCImago ${SJR_YEAR})` : '';
    t.push(`${p.st === 'in-press' ? 'Под печат' : 'Подадена'}${ex}.`);
  }
  if (r.note) t.push(r.note);
  return t.join(' ');
};

export const GET: APIRoute = async () => {
  const wb = new ExcelJS.Workbook();
  const tpl = await readFile(join(process.cwd(), 'scripts/nspsd/template.xlsx'));
  await wb.xlsx.load(tpl);
  const ws = wb.getWorksheet('Публикации')!;
  const first = 5;
  const proto = ws.getRow(first);
  const listDv = (a: string) => ({ type: 'list' as const, allowBlank: true, showErrorMessage: true, formulae: [...(ws.getCell(a).dataValidation?.formulae ?? [])] });
  const dv = { B: listDv('B5'), N: listDv('N5'), O: listDv('O5') };

  // публикуваните първо (по-новите отгоре), после подадените / под печат — в реда на nspsdRefs
  const list = nspsdPubs.map((p, i) => ({ p, i })).sort((a, b) =>
    Number(a.p.cat === 'sub') - Number(b.p.cat === 'sub') || b.p.year - a.p.year || a.i - b.i).map((x) => x.p);
  const last = first + list.length - 1;

  list.forEach((p, n) => {
    const ref = nspsdRefFor(p.title);
    const r: ExcelRow = (ref && excelRows[ref.t]) || {};
    const m = (p.doi && META[p.doi.toLowerCase()]) || {};
    const date = p.cat !== 'sub' && r.date && !isDate(r.date) ? undefined : r.date;
    const vals = [
      n + 1,
      r.type ?? (p.cat === 'soft' ? 'Друг научен резултат' : CONF_RE.test(p.venue) ? 'Доклад от конференция' : 'Научна статия'),
      p.title, fullNames(p),
      date ?? m.date ?? (p.cat === 'sub' ? (p.st === 'in-press' ? 'под печат' : 'подадена') : String(p.year)),
      r.venue ?? p.venue,
      r.volume ?? m.volume ?? '', r.issue ?? m.issue ?? '', r.pages ?? m.page ?? '',
      p.doi ?? '', linkTo(p, r),
      r.ids ?? [p.isbn && `ISBN ${p.isbn}`, p.issn && `ISSN ${p.issn}`].filter(Boolean).join('; '),
      r.abstract ?? m.abstract ?? p.abstract ?? '',
      r.lang ?? (/[а-я]/i.test(p.title) ? 'Български' : 'Английски'),
      indexLabel(p), nspText(p, r),
    ];
    const row = ws.getRow(first + n);
    vals.forEach((v, c) => {
      const cell = row.getCell(c + 1);
      cell.style = JSON.parse(JSON.stringify(proto.getCell(c + 1).style ?? {}));
      cell.value = v === '' ? null : v;
      if (p.cat === 'sub') cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7E6' } };
    });
    // височина по съдържанието (резюмето — до 14 реда)
    let lines = 2;
    vals.forEach((v, c) => {
      if (!v) return;
      const w = ws.getColumn(c + 1).width ?? 10;
      let k = Math.ceil(String(v).length / (w * 1.05));
      if (c === 12) k = Math.min(k, 14);
      lines = Math.max(lines, k);
    });
    row.height = Math.min(15 * lines + 4, 409);
  });
  const dvs = (ws as unknown as { dataValidations: { model: Record<string, unknown>; add: (range: string, v: unknown) => void } }).dataValidations;
  dvs.model = {};
  dvs.add(`B${first}:B${last}`, dv.B); dvs.add(`N${first}:N${last}`, dv.N); dvs.add(`O${first}:O${last}`, dv.O);
  // празните номерирани редове от шаблона след последния запис
  for (let r = last + 1; r <= Math.max(34, last); r++) ws.getRow(r).getCell(1).value = null;

  const notes = [
    `Редове ${first}–${last}: ${list.length} публикации по ННП „Сигурност и отбрана“ на работните екипи в Института по роботика към БАН — актуален списък с филтри: https://urs.ir.bas.bg/projects/nspsd/. Публикуваните са отгоре, по години; оцветените редове са под печат / подадени.`,
    'Имената на авторите, том, брой, страници и дата са по данните на издателя (Crossref), където има DOI; иначе — по записите на сайта.',
    'Резюмета: оригиналните резюмета — от таблицата на авторите, по данните на издателя (Crossref, OpenAlex), от публикувания текст в сборника или от сайта на лабораторията; празна клетка — резюмето още не е публикувано.',
    'Колона O: индексиране към момента; за статиите под печат очакваното индексиране е в колона P.',
    `Генерирано автоматично от сайта на Лаборатория „Безпилотни роботизирани системи“, ИР-БАН, на ${new Date().toLocaleDateString('bg-BG')}.`,
  ];
  ws.getCell(`B${last + 2}`).value = 'Бележки';
  ws.getCell(`B${last + 2}`).font = { name: 'Carlito', bold: true };
  notes.forEach((t, k) => { const c = ws.getCell(`B${last + 3 + k}`); c.value = t; c.font = { name: 'Carlito', size: 10 }; });
  ws.views = [{ state: 'frozen', xSplit: 2, ySplit: 4 }];

  const buf = await wb.xlsx.writeBuffer();
  // exceljs записва таблицата от шаблона повредена (добавя autoFilter, сменя заглавния ред) и Excel я „поправя“ —
  // затова връщаме оригиналната дефиниция от шаблона и само разширяваме диапазона ѝ до последния ред
  const out = await JSZip.loadAsync(buf as ArrayBuffer);
  const src = await JSZip.loadAsync(tpl);
  for (const name of Object.keys(src.files).filter((f) => /^xl\/tables\/table\d+\.xml$/.test(f))) {
    const xml = (await src.file(name)!.async('string')).replace(/ref="A4:P\d+"/, `ref="A4:P${last}"`);
    out.file(name, xml);
  }
  const fixed = await out.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  return new Response(fixed, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } });
};
