# Spazio Centro Artístico — guía del proyecto

Sitio web de una academia de danza (Huejotzingo, Puebla). Astro estático + Tailwind v4 + GSAP/Lenis, en Cloudflare Pages.
Contexto: [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) · marca: [docs/BRAND.md](docs/BRAND.md) · CRM y dominio: [docs/CRM-DOMINIO.md](docs/CRM-DOMINIO.md).

## Convenciones

- Contenido visible y documentación en español (es-MX); identificadores de código en inglés.
- Colores y tipografía solo desde los tokens de `src/styles/global.css`; no valores sueltos.
- Animaciones: solo `transform` y `opacity`; respetar `prefers-reduced-motion`; el isotipo es el hilo visual.
- El logo se usa siempre desde `public/brand/*.svg`, nunca reescrito con una fuente.

## Seguridad (el repo es público)

- Nunca versionar secretos ni datos de alumnos. Detalles internos del CRM van en `docs/private/` (ignorado por git).
- CSP estricta en `public/_headers`: sin scripts ni estilos inline. Al añadir un tercero, ampliar la CSP de forma mínima y explícita.
- Validar toda entrada en servidor; las claves del CRM solo del lado servidor.

## Comandos

```
npm run dev      # desarrollo
npm run check    # tipos (debe pasar sin errores)
npm run build    # producción (debe pasar antes de subir cambios)
```

Al iniciar el servidor de desarrollo con el agente, usar modo background: `astro dev --background`
(gestión con `astro dev stop`, `astro dev status`, `astro dev logs`).

Documentación de Astro: https://docs.astro.build
