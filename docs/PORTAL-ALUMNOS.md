# Portal de alumnos

## Decisión (2026-09-24)

- **Admin de accesos:** se extiende el CRM existente (repo privado
  `github.com/vrayonfreelance/SpazioCA`, carpeta `dance-academy/`) — no se creó un panel nuevo ni se
  duplicó la lista de alumnos.
- **Login de alumnos:** usuario y contraseña individual (uno por alumno).
- **Video:** Cloudflare Stream, privado, con URLs de reproducción firmadas de 10 minutos.
- **Subdominio del portal:** `alumnos.spaziocentroartistico.com` (aún no apuntado; hoy se prueba en local).
- **Arquitectura:** app aparte, no parte de este sitio estático (fase 6 de `docs/ARQUITECTURA.md`,
  adelantada a pedido del cliente). Vive en `E:\Desarrollo de Software\workspace_claude\portal_spazio`,
  repo de git propio (`portal_spazio`), todavía no subido a GitHub.

## Estado: MVP funcionando de punta a punta (2026-09-24)

Probado con una alumna real (acceso activo, contraseña real) viendo un video real de Cloudflare Stream,
no solo con datos de prueba.

### 1. CRM — ✅ en producción

Se fusionó `feature/portal-alumnos` a `main` y Render lo desplegó automáticamente. Confirmado sano
después del despliegue (`/health` y un login de prueba respondiendo bien).

- Modelos `PortalAccess` (username, hash bcrypt, activo, último ingreso — 1:1 con `Student`) y
  `PortalVideo` (título, disciplina, id del video en Cloudflare Stream, orden, activo).
- `POST /api/v1/portal/login` — con límite de intentos (10 cada 15 min); devuelve un token corto (12h).
- `GET /api/v1/portal/videos` — requiere el token, devuelve los videos activos con una URL de
  reproducción firmada por video, pedida a la API de Cloudflare Stream en cada petición.
- Sección de administración `/portal`: alta/baja de accesos (contraseña temporal mostrada una sola vez)
  y catálogo de videos. La bitácora nunca guarda el hash de la contraseña.
- Variables de entorno ya configuradas en Render: `PORTAL_JWT_SECRET`, `CLOUDFLARE_ACCOUNT_ID`,
  `CLOUDFLARE_STREAM_API_TOKEN`.
- Ya hay un video real dado de alta: "Salsa Nivel Abierto - clase 3", y una alumna real con acceso
  (Victoria Tobón Rosas).

### 2. Cloudflare Stream — ✅ activo

Starter Bundle contratado ($5/mes, 1,000 min almacenados / 5,000 min vistos). Account ID:
`a884a2c6d016e15398b678b4e9f2d318`. Token de API creado con permiso "Stream: Edit" únicamente.

### 3. Portal (app nueva) — ✅ MVP construido y probado, sin desplegar todavía

Proyecto Astro con `output: 'server'` + adaptador `@astrojs/cloudflare` (corre como Cloudflare Pages
Functions). Tres páginas:

- `/login` — usuario/contraseña, llama a `POST /api/v1/portal/login`, guarda el token en una cookie
  propia (`portal_session`: `HttpOnly`, `Secure` en producción, `SameSite=Lax`, 12h). El navegador del
  alumno nunca ve el token del CRM ni le habla directo.
- `/` (protegida) — lee la cookie, pide `GET /api/v1/portal/videos`, agrupa por disciplina y muestra
  cada video en un iframe de Cloudflare Stream. Sesión inválida o vencida → redirige a `/login`.
- `/logout` — limpia la cookie.
- Variable de entorno `CRM_API_URL` manejada con `astro:env` (no `Astro.locals.runtime.env`: la versión
  instalada de `@astrojs/cloudflare` ya no expone `env` ahí, cambió a favor del sistema nativo de Astro).

**Probado en local** (`npm run dev`, contra el CRM real en producción): página de login con la marca,
error correcto con credenciales inválidas, redirección sin sesión, y el video real reproduciéndose para
Victoria tras iniciar sesión con su contraseña real.

### 4. Despliegue — ✅ en producción (Cloudflare Workers, no Pages)

Repo subido a GitHub (`github.com/vicrayoma/portal_spazio`, privado). Desplegado en
`https://portal-spazio.vicrayoma.workers.dev`, probado en vivo (pantalla de login real, rechazo
correcto con credenciales inválidas).

**Hallazgo importante:** `@astrojs/cloudflare` v14 dejó de soportar Cloudflare Pages — genera un
Worker con assets (`dist/client` + `dist/server/entry.mjs` + un `wrangler.json` propio), no el
`_worker.js` que el flujo clásico de Pages espera. Un primer intento de desplegar como proyecto de
Pages (`portal-spazio.pages.dev`) solo subió los archivos como estáticos sueltos, sin correr nunca
el servidor (404 en toda ruta) — **ese proyecto de Pages quedó roto y sin uso, pendiente decidir si
se borra**. El despliegue real usa "Workers Builds" (el sucesor de Pages para integración con Git):

- `wrangler.jsonc` en la raíz del repo identifica el Worker ante Workers Builds.
- Comando de build: `npm run build`. Comando de deploy: `npx wrangler deploy --config
  dist/server/wrangler.json --var CRM_API_URL:https://www.spaziocentroartistico.com` — el `--var` es
  necesario porque el `wrangler.json` que genera cada build no declara variables por sí solo; sin él,
  cada push a `main` borraría `CRM_API_URL` del Worker desplegado.
- `session: false` en `astro.config.mjs`: el portal no usa `Astro.session` (la sesión es la cookie
  propia con el token del CRM), así que se desactivó el binding de KV que el adaptador provisiona por
  defecto para sesiones.

**Pendiente:**
- ~~Decidir si se borra el proyecto de Pages roto~~ — hecho, se borró.
- ~~Apuntar `alumnos.spaziocentroartistico.com` a este Worker~~ — hecho (2026-09-25): el dominio
  completo se migró a Cloudflare (ver `docs/CRM-DOMINIO.md`), lo que permitió agregar
  `alumnos.spaziocentroartistico.com` como dominio personalizado directo del Worker. Verificado en vivo
  con el login real del portal.
- Ver varios videos/disciplinas a la vez, no solo uno.

## Hallazgos de seguridad detectados al construir esto (no relacionados con el portal en sí)

Encontrados con acceso directo al código del CRM, más allá de lo que ya decía `docs/private/CRM.md`:

1. **Credencial de administrador real y específica en el seed** (`prisma/seed.js`): crea
   `daniel@spazioca.com.mx` con contraseña `123123` si esa cuenta no existe. Como el seed corre en cada
   despliegue (`npm run start:prod`), y solo crea la cuenta la primera vez, es muy probable que esa sea
   la contraseña real hoy en producción si nunca se cambió manualmente. **Urgente, sigue sin
   confirmarse si ya se cambió.**
2. **Desfase entre `schema.prisma` y las migraciones ya aplicadas**: al generar la migración de este
   cambio, Prisma detectó que las tablas existentes tienen `DEFAULT gen_random_uuid()` a nivel de base
   de datos en su columna `id`, pero el schema actual ya no lo declara (Prisma genera el UUID del lado
   de la aplicación). No es peligroso por sí solo — la app funciona igual porque siempre inserta por
   Prisma Client — pero puede causar advertencias o migraciones accidentales la próxima vez que alguien
   corra `prisma migrate dev` sin darse cuenta. Se dejó fuera de la migración de este cambio a propósito
   para no mezclar algo no relacionado con el portal.
3. **`node_modules/` está versionado en el repo** (3,224 archivos) pese a estar en `.gitignore` — se
   agregó al `.gitignore` después de haberse subido una vez. No es un riesgo de seguridad, pero infla el
   repo y genera diffs enormes con cada `npm install`. Se puede limpiar con `git rm -r --cached
   node_modules` en un commit aparte.
4. **`.env` real está versionado** (ver hallazgo ya reportado): sin secretos reales expuestos
   (credenciales de Postgres local por defecto, campos de Twilio vacíos), pero es una práctica a corregir.

Ninguno de estos cuatro se tocó: son de otras partes del sistema, fuera del alcance de esta tarea.
