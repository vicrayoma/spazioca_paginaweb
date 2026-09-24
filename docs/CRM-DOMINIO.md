# CRM y dominio principal

> Este documento es público. **No** guardar aquí detalles internos del CRM (endpoints, esquema, claves,
> hallazgos de seguridad con detalle explotable). Eso va en `docs/private/CRM.md`, que git ignora.

## Situación (confirmada 2026-09-24)

Dominio: **spaziocentroartistico.com**, registrado en GoDaddy. Hoy el apex sirve el login del CRM
(sistema propio de gestión de alumnos/cobranza, Node + Express + PostgreSQL en Render). No existe un
módulo de prospectos. Dos aplicaciones no pueden compartir el mismo host, así que el CRM pasa a un
subdominio y el apex queda libre para la web pública.

## Estructura objetivo

| Host | Sirve | Dónde |
|---|---|---|
| `spaziocentroartistico.com` y `www.` | Web pública (Astro) | Cloudflare Pages |
| `crm.spaziocentroartistico.com` | Sistema de gestión (uso interno) | Render (donde ya vive), con dominio personalizado nuevo |

## Antes de migrar: seguridad del CRM

El CRM guarda datos de menores. El informe técnico (`docs/private/CRM.md`) identificó puntos que conviene
resolver **antes** de conectarle un formulario público: credencial de administrador fija en el código,
ausencia de protección CSRF y de límite de intentos en el login, y credenciales de Twilio guardadas sin
cifrar en la base de datos. Ninguno depende de este repositorio; los resuelve quien mantiene el CRM.

## Plan de migración (sin apagar nada hasta el final)

1. Publicar el CRM en `crm.spaziocentroartistico.com` como dominio personalizado en Render, sin tocar el apex todavía.
2. Copiar todos los registros DNS actuales de GoDaddy (A, CNAME, MX, TXT de SPF/DKIM/DMARC) antes de cualquier cambio. Es lo crítico: perder los MX o TXT tumba el correo.
3. Validar el CRM funcionando por completo en el subdominio (login, permisos, pagos, mensualidades, WhatsApp, kiosko).
4. Mover los nameservers a Cloudflare, con los registros ya copiados.
5. Apuntar el apex y `www` a Cloudflare Pages (la web).
6. Si hace falta preservar enlaces antiguos, redirecciones 301 desde el apex hacia `crm.`.

La cookie de sesión del CRM no lleva atributo `Domain`, así que apex y subdominio quedan con sesiones
aisladas de forma automática — no se necesita trabajo extra para eso.

## Integración web → CRM (prospectos)

El CRM no tiene hoy un endpoint para prospectos. Se agregará uno nuevo, separado del login de usuarios:

```
Navegador → /api/contacto (Cloudflare Pages Function) → POST /api/v1/prospects (CRM, firma HMAC)
```

- La web nunca expone credenciales del CRM: viven como secretos de Cloudflare.
- Autenticación servidor-a-servidor por firma HMAC (no una clave de API visible en el navegador).
- Protecciones en el endpoint de la web: validación estricta, Turnstile, honeypot, límite de peticiones, CORS restringido al propio dominio.

## Prompt para el ChatGPT que diseñó el CRM

Ya usado una vez (respuesta completa guardada en `docs/private/CRM.md`). Sirve para pedir un endurecimiento
de seguridad antes de conectar el formulario público, o para retomar el diseño del endpoint de prospectos:

```text
Antes de conectar un formulario público al sistema, necesito que prioricemos seguridad porque maneja datos
de menores. Con base en lo que ya revisamos (versionado v1.6.66):

1. Quita la credencial de administrador fija del seed y reemplázala por un procedimiento de bootstrap de
   una sola vez (o una variable de entorno que se define en el primer arranque).
2. Agrega protección CSRF a las rutas POST/PUT/PATCH/DELETE.
3. Agrega límite de intentos en /login (rate limiting + bloqueo temporal tras varios fallos).
4. Cifra las credenciales de Twilio guardadas en NotificationConfig, o muévelas por completo a variables
   de entorno y quita el fallback en base de datos.
5. Corrige el bug de auditoría: el router de paquetes registra una acción ENABLE que no existe en el enum
   AuditAction (solo CREATE/UPDATE/DISABLE).
6. Corrige el logout: usa el valor de SESSION_COOKIE_NAME en el clearCookie, en vez del nombre fijo
   "dance.sid".
7. Diseña e implementa POST /api/v1/prospects: modelo Prospect separado de Student, autenticación por
   firma HMAC (no clave de API en el navegador), validación estricta del body, límite de peticiones e
   Idempotency-Key.

Para cada punto dime qué archivos tocaste y cómo lo pruebo antes de desplegar.
```
