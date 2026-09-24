# Portal de alumnos

## Decisión (2026-09-24)

- **Admin de accesos:** se extiende el CRM existente (ya tiene `Student` y `User`/roles) — no se crea un
  panel de administración nuevo ni se duplica la lista de alumnos.
- **Login de alumnos:** usuario y contraseña individual (uno por alumno, fácil de dar de alta/baja).
- **Video:** Cloudflare Stream, privado, con URLs de reproducción firmadas (no un enlace fijo que se
  pueda compartir fuera del portal).
- **Arquitectura:** app aparte en un subdominio propio, tal como estaba previsto desde la fase 1
  (`docs/ARQUITECTURA.md`, fase 6). El sitio público sigue siendo 100% estático — esta decisión existe
  justamente para no meterle sesiones, contraseñas ni datos de alumnos a lo que hoy no tiene ninguna
  superficie de ataque.

## Piezas a construir

### 1. CRM (fuera de este repo — vive en Render)

- Nuevo modelo Prisma para el acceso al portal (username, hash de contraseña con bcrypt, activo/inactivo,
  fechas), separado del login administrativo de `User`.
- Nuevo modelo para el catálogo de videos: título, disciplina (Salsa/Cumbia/Bachata), identificador del
  video en Cloudflare Stream, orden, activo/inactivo.
- Nueva sección de administración (solo con permiso) para dar de alta/baja accesos de alumnos y gestionar
  el catálogo de videos.
- Nuevos endpoints, separados del login administrativo:
  - `POST /api/v1/portal/login` — valida usuario/contraseña, devuelve un token de sesión de corta duración.
  - `GET /api/v1/portal/videos` — requiere sesión válida, devuelve la lista de videos con un token de
    reproducción firmado de Cloudflare Stream (nunca la URL sin firmar).
  - Con límite de intentos desde el arranque: el CRM hoy no tiene rate limiting en ningún login
    (`docs/private/CRM.md`) — este endpoint nuevo debe nacer ya con esa protección.

### 2. Portal (app nueva, subdominio propio)

- No puede ser parte del sitio estático actual sin cambiarle la arquitectura: necesita mantener una
  sesión de servidor. Se construye como un proyecto aparte.
- Dos pantallas: login, y lista de videos con reproductor embebido de Cloudflare Stream.
- El token de sesión vive en una cookie `HttpOnly`, `Secure`, `SameSite` puesta por un backend ligero
  (Cloudflare Pages Functions) — nunca en `localStorage` del navegador, para reducir el riesgo si algún
  día hay una vulnerabilidad XSS.

### 3. Cloudflare Stream

- Hay que activarlo en la cuenta de Cloudflare (tiene costo por almacenamiento y minutos entregados).
- Subir ahí los videos de salsa, cumbia y bachata.
- Generar las claves de firma que el endpoint del CRM usará para emitir URLs de reproducción temporales.

## Pendiente de definir con el cliente

1. ¿El código del CRM está accesible para trabajar directo en él (otra carpeta local, otro repo de
   GitHub), o seguimos con el método ya usado en este proyecto (instrucciones/prompt para pasarle al
   ChatGPT que lo construyó)?
2. Subdominio exacto del portal — propuesta: `alumnos.spaziocentroartistico.com`.
3. ¿Ya está activado Cloudflare Stream en la cuenta?
4. Prioridad: ¿esto ahora, o primero el contenido pendiente del sitio público (fotos, precios, Galería,
   Contacto — ver `docs/SITEMAP.md`)?
