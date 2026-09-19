// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: reemplazar por el dominio real (o definir SITE_URL en el entorno de build).
const site = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  build: {
    // CSS y JS siempre como archivos externos: permite una CSP estricta sin 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
  },
});
