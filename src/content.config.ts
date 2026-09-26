import { defineCollection, z } from 'astro:content';
import { crmScheduleLoader } from './content/loaders/schedule';

// `astro check` marca `z` como "deprecated" por un aviso de tipos de Zod v4 sobre su propio
// namespace; es cosmético (0 errores, 0 warnings reales) y no afecta el build ni la validación.

// Horario general. Fuente de verdad: el módulo de Horarios del CRM (ver docs/CRM-DOMINIO.md y
// docs/PORTAL-ALUMNOS.md para el patrón equivalente del portal). El loader hace fetch a
// /api/v1/public/horarios en cada build; src/content/schedule/general.json queda solo como
// respaldo si el CRM no responde (ver src/content/loaders/schedule.ts).
const scheduleSessionStyle = z.enum([
  'navy',
  'pink',
  'green',
  'red',
  'blue',
  'purple',
  'orange',
  'block-orange',
  'block-green',
  'block-lavender',
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
        style: scheduleSessionStyle,
        icon: z.string(),
        text: z.string(),
      }),
    ),
  }),
});

export const collections = { schedule };
