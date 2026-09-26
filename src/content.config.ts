import { defineCollection, z } from 'astro:content';
import { crmScheduleLoader } from './content/loaders/schedule';

// `astro check` marca `z` como "deprecated" por un aviso de tipos de Zod v4 sobre su propio
// namespace; es cosmético (0 errores, 0 warnings reales) y no afecta el build ni la validación.

// Horario general. Fuente de verdad: el módulo de Horarios del CRM (ver docs/CRM-DOMINIO.md y
// docs/PORTAL-ALUMNOS.md para el patrón equivalente del portal). El loader hace fetch a
// /api/v1/public/horarios en cada build; src/content/schedule/general.json queda solo como
// respaldo si el CRM no responde (ver src/content/loaders/schedule.ts).
//
// Color de letra y de fondo se eligen por separado en el CRM, de una paleta amplia (no limitada a
// los tokens de marca) — ver los tokens --color-horario-* en src/styles/global.css y la paleta
// equivalente en SpazioCA/dance-academy/src/scheduleData.js (fuente de verdad de la lista).
const textColorToken = z.enum([
  'rojo', 'rosa', 'morado', 'violeta', 'indigo', 'azul', 'celeste', 'cian', 'verde-azulado',
  'verde', 'verde-claro', 'lima', 'amarillo', 'ambar', 'naranja', 'naranja-oscuro', 'cafe',
  'gris', 'gris-azulado', 'tinta', 'papel',
]);
const bgColorToken = z.enum([
  'rojo', 'rojo-tenue', 'rosa', 'rosa-tenue', 'morado', 'morado-tenue', 'violeta', 'violeta-tenue',
  'indigo', 'indigo-tenue', 'azul', 'azul-tenue', 'celeste', 'celeste-tenue', 'cian', 'cian-tenue',
  'verde-azulado', 'verde-azulado-tenue', 'verde', 'verde-tenue', 'verde-claro', 'verde-claro-tenue',
  'lima', 'lima-tenue', 'amarillo', 'amarillo-tenue', 'ambar', 'ambar-tenue', 'naranja',
  'naranja-tenue', 'naranja-oscuro', 'naranja-oscuro-tenue', 'cafe', 'cafe-tenue', 'gris',
  'gris-tenue', 'gris-azulado', 'gris-azulado-tenue', 'niebla', 'papel',
]);

const schedule = defineCollection({
  loader: crmScheduleLoader(),
  schema: z.object({
    updatedAt: z.coerce.date(),
    days: z.array(z.string()).min(1),
    rows: z.array(z.string()).min(1),
    sessions: z.array(
      z.object({
        id: z.string(),
        day: z.number().int().min(0),
        row: z.number().int().min(1),
        span: z.number().int().min(1),
        textColor: textColorToken,
        bgColor: bgColorToken,
        icon: z.string(),
        text: z.string(),
      }),
    ),
  }),
});

export const collections = { schedule };
