import { getCollection, type CollectionEntry } from 'astro:content';

export type ScheduleData = CollectionEntry<'schedule'>['data'];
export type ScheduleSession = ScheduleData['sessions'][number];

/** Carga la única entrada de horario ("general"). Lanza si falta: el sitio no tiene horario sin datos. */
export async function getSchedule(): Promise<ScheduleData> {
  const [entry] = await getCollection('schedule');
  if (!entry) throw new Error('No hay datos de horario en src/content/schedule/');
  return entry.data;
}

/** "8:00 A.M. A\n9:00 A.M." -> "8:00 a.m. a 9:00 a.m." */
export function formatTimeRange(row: string): string {
  return row.replace(/\n/g, ' ').replace(/\bA\.M\./g, 'a.m.').replace(/\bP\.M\./g, 'p.m.').replace(/ A /, ' a ');
}

/**
 * `session.row` es 0-indexado y coincide directo con la posición en `data.rows` (confirmado contra la
 * lógica de render del tablero original: `for (r = 0; r < data.rows.length; r++)`, sin desfase).
 */
function timeLabelFor(data: ScheduleData, row: number): string {
  return formatTimeRange(data.rows[row]);
}

/** "BALLET INFANTIL\nPRINCIPIANTE" -> "Ballet infantil principiante" */
export function toSentenceCase(text: string): string {
  const clean = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.charAt(0) + clean.slice(1).toLowerCase();
}

interface CategoryRule {
  test: RegExp;
  category: string;
}

// Taxonomía de agrupación para la página de disciplinas. No es contenido editorial: solo clasifica
// los nombres reales del horario en familias, para no listarlas 15 en una sola fila.
const CATEGORY_RULES: CategoryRule[] = [
  { test: /BALLET/, category: 'Ballet' },
  { test: /CONTEMPOR[ÁA]NEO|URBANO/, category: 'Contemporáneo y urbano' },
  { test: /SALSA|CUMBIA|BACHATA/, category: 'Ritmos latinos' },
  { test: /TEATRO|DIBUJO|PINTURA/, category: 'Talleres artísticos' },
  { test: /PARTICULAR/, category: 'Clases particulares' },
];

function categoryFor(text: string): string {
  return CATEGORY_RULES.find((rule) => rule.test.test(text))?.category ?? 'Otras clases';
}

export interface Discipline {
  name: string;
  category: string;
  icon: string;
  style: ScheduleSession['style'];
  /** Días y horario en los que se imparte, ya formateados y sin duplicados. */
  slots: { day: string; time: string }[];
}

/** Agrupa las sesiones repetidas de una misma clase (p. ej. "Ballet infantil" lunes y miércoles). */
export function groupByDiscipline(data: ScheduleData): Discipline[] {
  const byName = new Map<string, Discipline>();

  for (const session of data.sessions) {
    const name = toSentenceCase(session.text);
    const day = data.days[session.day];
    const time = timeLabelFor(data, session.row);

    let discipline = byName.get(name);
    if (!discipline) {
      discipline = { name, category: categoryFor(session.text), icon: session.icon, style: session.style, slots: [] };
      byName.set(name, discipline);
    }
    if (!discipline.slots.some((s) => s.day === day && s.time === time)) {
      discipline.slots.push({ day, time });
    }
  }

  return [...byName.values()];
}

const CATEGORY_ORDER = CATEGORY_RULES.map((r) => r.category).concat('Otras clases');

export function groupByCategory(disciplines: Discipline[]): Map<string, Discipline[]> {
  const byCategory = new Map<string, Discipline[]>();
  for (const d of disciplines) {
    const list = byCategory.get(d.category) ?? [];
    list.push(d);
    byCategory.set(d.category, list);
  }
  // Orden fijo (el de CATEGORY_RULES) en vez del orden de aparición en el horario.
  return new Map(CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((c) => [c, byCategory.get(c)!]));
}

/**
 * Índices de fila (0-indexados) con al menos una sesión, incluyendo las filas que solo están cubiertas
 * por el `span` vertical de otra sesión (p. ej. un taller de 2 horas que ocupa dos franjas). No se
 * muestran huecos horarios vacíos toda la semana.
 */
export function nonEmptyRows(data: ScheduleData): number[] {
  return data.rows
    .map((_, row) => row)
    .filter((row) => data.sessions.some((s) => s.row <= row && s.row + s.span > row));
}

export interface ScheduleGrid {
  /** Filas visibles, en orden. */
  rows: number[];
  /** Posición (0-indexada) de cada fila original dentro de `rows`, para usar en `grid-row`. */
  rowPosition: Map<number, number>;
}

export function buildGrid(data: ScheduleData): ScheduleGrid {
  const rows = nonEmptyRows(data);
  return { rows, rowPosition: new Map(rows.map((row, i) => [row, i])) };
}

// Colores por estilo de sesión, derivados solo de los tokens de marca + los funcionales del horario
// (ver src/styles/global.css). "block-*" son celdas de fondo sólido; el resto, tenues.
export const STYLE_META: Record<ScheduleSession['style'], { bg: string; fg: string }> = {
  navy: { bg: 'var(--color-niebla)', fg: 'var(--color-morado)' },
  purple: { bg: 'var(--color-niebla)', fg: 'var(--color-morado)' },
  pink: { bg: 'color-mix(in srgb, var(--color-magenta) 12%, white)', fg: 'var(--color-magenta)' },
  green: { bg: 'color-mix(in srgb, var(--color-horario-verde) 12%, white)', fg: 'var(--color-horario-verde)' },
  red: { bg: 'color-mix(in srgb, var(--color-horario-rojo) 12%, white)', fg: 'var(--color-horario-rojo)' },
  blue: { bg: 'color-mix(in srgb, var(--color-cian) 12%, white)', fg: 'var(--color-cian)' },
  orange: { bg: 'color-mix(in srgb, var(--color-horario-naranja) 12%, white)', fg: 'var(--color-horario-naranja)' },
  'block-orange': { bg: 'var(--color-horario-naranja)', fg: 'var(--color-papel)' },
  'block-green': { bg: 'var(--color-horario-verde)', fg: 'var(--color-papel)' },
  'block-lavender': { bg: 'var(--color-niebla)', fg: 'var(--color-morado)' },
};
