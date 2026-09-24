# Portal de alumnos

## Decisión (2026-09-24)

- **Admin de accesos:** se extiende el CRM existente (repo privado
  `github.com/vrayonfreelance/SpazioCA`, carpeta `dance-academy/`) — no se creó un panel nuevo ni se
  duplicó la lista de alumnos.
- **Login de alumnos:** usuario y contraseña individual (uno por alumno).
- **Video:** Cloudflare Stream, privado, con URLs de reproducción firmadas de 10 minutos.
- **Subdominio del portal:** `alumnos.spaziocentroartistico.com`.
- **Arquitectura:** app aparte, no parte de este sitio estático (fase 6 de `docs/ARQUITECTURA.md`,
  adelantada a pedido del cliente).

## Estado

### 1. CRM — ✅ backend construido y probado (commit local, sin subir todavía)

Rama `feature/portal-alumnos` sobre el repo del CRM (no sobre `main`). Probado de punta a punta contra
un Postgres local real (Docker), no solo revisado a ojo:

- Modelos nuevos: `PortalAccess` (username, hash bcrypt, activo, último ingreso — 1:1 con `Student`) y
  `PortalVideo` (título, disciplina, id del video en Cloudflare Stream, orden, activo).
- `POST /api/v1/portal/login` — usuario/contraseña, con límite de intentos (10 cada 15 min); devuelve un
  token corto (12h), no una cookie de sesión — el CRM hoy no tenía rate limiting en ningún login.
- `GET /api/v1/portal/videos` — requiere el token, devuelve los videos activos con una URL de
  reproducción firmada por video (pide un token nuevo a la API de Cloudflare Stream en cada
  petición, nunca guarda ni reutiliza un enlace fijo). Si Cloudflare Stream aún no está configurado,
  responde una lista vacía en vez de romperse.
- Nueva sección de administración `/portal`: alta/baja de accesos de alumnos (contraseña temporal
  generada al azar, mostrada una sola vez), y catálogo de videos — mismo patrón que el resto del panel
  (permisos por sección, bitácora). La bitácora nunca guarda el hash de la contraseña.
- Migración de base de datos probada de verdad (aplicada contra Postgres limpio), no solo escrita a
  mano.

**Pendiente:** revisar el diff, decidir si se abre como Pull Request o se fusiona directo, y hacer push
de la rama (no se subió nada todavía, solo está en local).

### 2. Portal (app nueva, subdominio propio) — ⏳ sin empezar

Necesita: pantalla de login, pantalla de videos con reproductor embebido, y un backend ligero
(Cloudflare Pages Functions) que guarde el token en una cookie `HttpOnly`/`Secure` propia del
subdominio y lo reenvíe al CRM — el navegador del alumno nunca ve directamente la API del CRM.

### 3. Cloudflare Stream — ⏳ sin activar

Confirmado con el cliente (2026-09-24): **todavía no está contratado** en la cuenta de Cloudflare.
Recomendado: Starter Bundle, $5 USD/mes (1,000 min almacenados, 5,000 min vistos/mes). Requiere vincular
un método de pago — lo activa el cliente directamente en el dashboard, no algo que se haga por él.

Una vez activo, hacen falta dos datos para las variables de entorno del CRM: el **Account ID** de
Cloudflare, y un **API Token** con permiso "Stream: Edit" (se crea en
`dash.cloudflare.com/profile/api-tokens`).

## Hallazgos de seguridad detectados al construir esto (no relacionados con el portal en sí)

Encontrados con acceso directo al código del CRM, más allá de lo que ya decía `docs/private/CRM.md`:

1. **Credencial de administrador real y específica en el seed** (`prisma/seed.js`): crea
   `daniel@spazioca.com.mx` con contraseña `123123` si esa cuenta no existe. Como el seed corre en cada
   despliegue (`npm run start:prod`), y solo crea la cuenta la primera vez, es muy probable que esa sea
   la contraseña real hoy en producción si nunca se cambió manualmente. **Urgente**: entrar con esa
   cuenta y cambiarle la contraseña de inmediato si aplica.
2. **Desfase entre `schema.prisma` y las migraciones ya aplicadas**: al generar la migración de este
   cambio, Prisma detectó que las tablas existentes tienen `DEFAULT gen_random_uuid()` a nivel de base
   de datos en su columna `id`, pero el schema actual ya no lo declara (Prisma genera el UUID del lado
   de la aplicación). No es peligroso por sí solo — la app funciona igual porque siempre inserta por
   Prisma Client — pero puede causar advertencias o migraciones accidentales la próxima vez que alguien
   corra `prisma migrate dev` sin darse cuenta. Se dejó fuera de la migración de este cambio a propósito
   (ver el commit) para no mezclar algo no relacionado con el portal.
3. **`node_modules/` está versionado en el repo** (3,224 archivos) pese a estar en `.gitignore` — se
   agregó al `.gitignore` después de haberse subido una vez. No es un riesgo de seguridad, pero infla el
   repo y genera diffs enormes con cada `npm install`. Se puede limpiar con `git rm -r --cached
   node_modules` en un commit aparte.
4. **`.env` real está versionado** (ver hallazgo ya reportado): sin secretos reales expuestos
   (credenciales de Postgres local por defecto, campos de Twilio vacíos), pero es una práctica a corregir.

Ninguno de estos cuatro se tocó: son de otras partes del sistema, fuera del alcance de esta tarea.

## Resuelto (ya no está pendiente)

1. ~~¿Acceso al código del CRM?~~ — sí, repo de GitHub, confirmado con acceso de lectura y escritura.
2. ~~Subdominio~~ — `alumnos.spaziocentroartistico.com`.
3. ~~¿Cloudflare Stream activo?~~ — no, pendiente de que el cliente lo active.
4. ~~Prioridad~~ — se adelantó, es el trabajo en curso.
