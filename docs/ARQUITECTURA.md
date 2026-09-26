# Arquitectura

## Decisión

**Astro (sitio estático) + TypeScript + Tailwind v4 + GSAP/ScrollTrigger**, desplegado en **Cloudflare Pages**, con una
capa mínima de funciones (Pages Functions) para formularios y CRM.

## Por qué

- **Superficie de ataque mínima:** el sitio público es HTML, CSS y JS estáticos. Sin servidor de aplicación ni base de datos expuesta.
- **Rendimiento y SEO local:** páginas pre-renderizadas, fuentes autoalojadas, imágenes optimizadas.
- **Animación con control total:** GSAP + ScrollTrigger sobre scroll nativo (`scroll-behavior: smooth`).
  Se probó Lenis (scroll suave) en la fase 3 y se descartó: entra en conflicto con la cabecera
  `position: sticky` (fricción documentada entre ambos), y ScrollTrigger funciona igual de bien sin él.
  El isotipo real (`public/brand/spazio-isotipo-*.svg`, con máscaras y raster de degradado del PDF
  original) se muestra tal cual y solo recibe una entrada de conjunto (fade/scale); las formas que se
  "ensamblan" en el hero y como acento en otras secciones son geometría propia (cuartos de círculo, punto)
  que hace eco del isotipo sin decomponer sus paths reales, que son frágiles de animar por partes.
- **Cloudflare:** CDN, WAF y anti-DDoS incluidos, Turnstile para formularios, secretos fuera del repo.

Alternativas descartadas: WordPress (superficie de plugins y temas), Next.js (servidor y componentes de servidor innecesarios para un sitio de marketing), constructores tipo Wix/Webflow/Framer (menos control de seguridad e integración con el CRM).

## Estructura

```
src/
  layouts/     Base.astro (meta/SEO/robots) + Page.astro (Header + slot + Footer + motion.ts)
  components/  Header.astro, Footer.astro
  pages/       index.astro, disciplinas.astro, horarios.astro (rutas del sitio)
  lib/         schedule.ts (lee/agrupa el horario), contact.ts (WhatsApp, dirección, redes)
  scripts/     motion.ts (GSAP/ScrollTrigger: entradas, revelado al scroll, "hoy" del horario)
  styles/      global.css (tokens de marca)
  content/     schedule/general.json (horario real) + content.config.ts (esquema Zod)
public/
  brand/       logos SVG; iconos; _headers (CSP y seguridad)
functions/     (próximo) endpoints de contacto → CRM
docs/          BRAND.md, ARQUITECTURA.md, SITEMAP.md, CRM-DOMINIO.md
```

## Seguridad

- **CSP estricta** (`public/_headers`): sin `unsafe-inline`. Astro se configura para emitir CSS y JS siempre como archivos externos.
- Cabeceras: HSTS, `nosniff`, `frame-ancestors 'none'`, Referrer-Policy y Permissions-Policy restrictivas.
- **Sin indexación** hasta declarar `PUBLIC_ALLOW_INDEXING=true` en producción (evita que previews o staging se indexen).
- Repo público: sin secretos, escaneo con gitleaks, `npm audit` y Dependabot en la CI.
- Formularios (fase 4): validación estricta en servidor, Turnstile, honeypot, límite de peticiones, CORS restringido. Las claves del CRM solo existen del lado servidor.
- Datos personales: aviso de privacidad y consentimiento de madres, padres o tutores para menores (LFPDPPP). Datos mínimos.

## Contenido editable

El horario general se edita en el módulo "Horarios" del CRM (antes se editaba a mano en un tablero /
Artifact que exportaba un JSON commiteado — ver `docs/CRM-DOMINIO.md`). El build de Astro trae el
horario del CRM en cada ejecución (`src/content/loaders/schedule.ts`, un Content Loader personalizado
que hace `fetch` a `/api/v1/public/horarios`), validado con el mismo esquema Zod de siempre
(`src/content.config.ts`) — Disciplinas, Horarios e Inicio se siguen generando a partir de esos datos,
no de texto suelto en las páginas. `src/content/schedule/general.json` queda solo como respaldo si el
CRM no responde en build time. Publicar un cambio de horario = guardar en el CRM y darle "Publicar
ahora" (dispara un Deploy Hook de Cloudflare que reconstruye el sitio) — no hace falta tocar git.

## Fases

1. **Cimientos** ✅: repo, scaffold, marca, seguridad, CI.
2. **Diseño y contenido** ✅ para Inicio/Disciplinas/Horarios: mapa del sitio (`SITEMAP.md`), tipografía
   (Unbounded), horario real integrado. Nosotros/Galería/Contacto siguen esperando contenido real.
3. **Construcción y animaciones** — en curso: Inicio, Disciplinas y Horarios construidas con GSAP/ScrollTrigger.
   Falta Nosotros, Galería y Contacto (bloqueadas por contenido, ver `SITEMAP.md`).
4. **Formularios, WhatsApp y CRM.** WhatsApp ya es el CTA de contacto en todo el sitio construido.
5. **SEO local, analítica y lanzamiento** en el dominio definitivo (ver `CRM-DOMINIO.md`).
6. **CMS**, si se requiere, y el **portal de alumnos** (adelantado a pedido del cliente, 2026-09-24) —
   app aparte en un subdominio, con video vía Cloudflare Stream y accesos gestionados desde el CRM.
   Plan completo en `docs/PORTAL-ALUMNOS.md`.
