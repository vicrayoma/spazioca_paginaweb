import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

// `astro check` marca `z` como "deprecated" por un aviso de tipos de Zod v4 sobre su propio
// namespace; es cosmético (0 errores, 0 warnings reales) y no afecta el build ni la validación.

// Horario general. Fuente de verdad hoy: el tablero (Artifact) que edita el equipo y exporta un HTML
// con estos mismos datos embebidos. Este JSON se actualiza a mano con lo que exporte ese tablero hasta
// que se conecte una automatización (ver docs/ARQUITECTURA.md).
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
  loader: file('src/content/schedule/general.json'),
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
