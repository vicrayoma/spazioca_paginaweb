# Arquitectura

## Decisión

**Astro (sitio estático) + TypeScript + Tailwind v4 + GSAP/Lenis**, desplegado en **Cloudflare Pages**, con una
capa mínima de funciones (Pages Functions) para formularios y CRM.

## Por qué

- **Superficie de ataque mínima:** el sitio público es HTML, CSS y JS estáticos. Sin servidor de aplicación ni base de datos expuesta.
- **Rendimiento y SEO local:** páginas pre-renderizadas, fuentes autoalojadas, imágenes optimizadas.
- **Animación con control total:** GSAP + ScrollTrigger sobre SVG del isotipo, con Lenis para scroll fluido.
- **Cloudflare:** CDN, WAF y anti-DDoS incluidos, Turnstile para formularios, secretos fuera del repo.

Alternativas descartadas: WordPress (superficie de plugins y temas), Next.js (servidor y componentes de servidor innecesarios para un sitio de marketing), constructores tipo Wix/Webflow/Framer (menos control de seguridad e integración con el CRM).

## Estructura

```
src/
  layouts/     Base.astro (meta, SEO, robots según entorno)
  pages/       rutas del sitio
  styles/      global.css (tokens de marca)
  content/     (próximo) disciplinas, horarios, eventos como colecciones tipadas
public/
  brand/       logos SVG; iconos; _headers (CSP y seguridad)
functions/     (próximo) endpoints de contacto → CRM
docs/          BRAND.md, ARQUITECTURA.md, CRM-DOMINIO.md
```

## Seguridad

- **CSP estricta** (`public/_headers`): sin `unsafe-inline`. Astro se configura para emitir CSS y JS siempre como archivos externos.
- Cabeceras: HSTS, `nosniff`, `frame-ancestors 'none'`, Referrer-Policy y Permissions-Policy restrictivas.
- **Sin indexación** hasta declarar `PUBLIC_ALLOW_INDEXING=true` en producción (evita que previews o staging se indexen).
- Repo público: sin secretos, escaneo con gitleaks, `npm audit` y Dependabot en la CI.
- Formularios (fase 4): validación estricta en servidor, Turnstile, honeypot, límite de peticiones, CORS restringido. Las claves del CRM solo existen del lado servidor.
- Datos personales: aviso de privacidad y consentimiento de madres, padres o tutores para menores (LFPDPPP). Datos mínimos.

## Contenido editable

El horario general se edita hoy en un tablero (Artifact) que exporta los cambios. Plan: el export será un JSON
validado con un esquema (Zod) en `src/content/`, y al confirmarlo en el repo se publica automáticamente.
Si más adelante se requiere edición sin pasar por git, se añade un CMS (Keystatic o Sanity).

## Fases

1. **Cimientos** (esta): repo, scaffold, marca, seguridad, CI.
2. **Diseño y contenido:** mapa del sitio, wireframes, sistema tipográfico, manual de marca.
3. **Construcción y animaciones** por secciones, con el isotipo reconstruido como SVG animable.
4. **Formularios, WhatsApp y CRM.**
5. **SEO local, analítica y lanzamiento** en el dominio definitivo (ver `CRM-DOMINIO.md`).
6. **CMS** y, si se requiere, portal de alumnos como app separada en un subdominio.
