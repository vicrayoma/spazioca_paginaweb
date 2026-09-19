# Spazio Centro Artístico — sitio web

Sitio web de **Spazio Centro Artístico**, academia de danza y artes en Huejotzingo, Puebla.
*Arte, disciplina y constancia.*

## Stack

Astro · TypeScript · Tailwind CSS v4 · GSAP · Lenis · Cloudflare Pages.
Decisiones y fases en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md); identidad en [`docs/BRAND.md`](docs/BRAND.md).

## Desarrollo

Requiere Node 22 (ver `.nvmrc`).

```bash
npm install
npm run dev      # servidor local en http://localhost:4321
npm run check    # tipos y diagnósticos de Astro
npm run build    # genera dist/
```

## Variables de entorno

| Variable | Uso |
|---|---|
| `SITE_URL` | Dominio público, para canonical, sitemap y Open Graph |
| `PUBLIC_ALLOW_INDEXING` | `true` solo en producción; sin ella, se pide a los buscadores no indexar |

Los secretos (claves del CRM, Turnstile) **nunca** se guardan en el repo: ver [`SECURITY.md`](SECURITY.md).
