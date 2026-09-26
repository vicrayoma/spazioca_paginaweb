import type { Loader } from 'astro/loaders';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Respaldo si el CRM no responde en build time (red caída, CRM reiniciando, etc.): el mismo JSON
// que era la fuente de verdad antes de conectar el CRM. Así un CRM caído no tumba el build del sitio.
const FALLBACK_PATH = 'src/content/schedule/general.json';

/**
 * Trae el horario general del CRM (fuente de verdad hoy) en build time, con el mismo esquema Zod
 * que antes validaba el JSON local commiteado (content.config.ts no cambia). Si el CRM no responde,
 * cae al JSON de respaldo para no romper el build.
 */
export function crmScheduleLoader(): Loader {
  return {
    name: 'crm-schedule-loader',
    load: async ({ store, parseData, config, logger }) => {
      const apiUrl = process.env.CRM_SCHEDULE_API_URL;
      let raw: Record<string, unknown>;

      try {
        if (!apiUrl) throw new Error('CRM_SCHEDULE_API_URL no está definida.');
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`el CRM respondió ${response.status}`);
        raw = await response.json();
        logger.info(`Horario cargado desde el CRM (${apiUrl}).`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.warn(`No se pudo obtener el horario del CRM (${message}). Usando el respaldo local en ${FALLBACK_PATH}.`);
        const fallbackUrl = new URL(FALLBACK_PATH, config.root);
        const contents = await readFile(fileURLToPath(fallbackUrl), 'utf-8');
        const parsed = JSON.parse(contents);
        raw = Array.isArray(parsed) ? parsed[0] : parsed;
      }

      const id = 'general';
      const parsedData = await parseData({ id, data: raw });
      store.clear();
      store.set({ id, data: parsedData });
    },
  };
}
