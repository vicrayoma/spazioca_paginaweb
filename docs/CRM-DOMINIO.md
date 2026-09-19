# CRM y dominio principal

> Este documento es público. **No** guardar aquí detalles internos del CRM (endpoints, esquema, claves).
> Eso va en `docs/private/`, que git ignora.

## Situación

El CRM está publicado en el dominio principal (apex), y la web pública también debe vivir ahí.
Dos aplicaciones no pueden ocupar el mismo nombre de host, así que el CRM pasa a un subdominio.

## Estructura objetivo

| Host | Sirve | Dónde |
|---|---|---|
| `dominio.com` y `www.dominio.com` | Web pública (Astro) | Cloudflare Pages |
| `crm.dominio.com` | CRM (uso interno) | Donde esté hoy, con dominio personalizado nuevo |

## Plan de migración (sin apagar nada hasta el final)

1. **Inventario** del CRM (usar el prompt de abajo): dónde está alojado, cómo se sirve en el apex, qué URLs, cookies, OAuth y webhooks dependen del dominio.
2. **Copia de todos los registros DNS** de GoDaddy (A, CNAME, MX, TXT de SPF/DKIM/DMARC…). Es lo crítico: si se pierden los MX o TXT, se cae el correo.
3. **Publicar el CRM en `crm.dominio.com`** mientras el apex sigue funcionando. Actualizar sus URL base, redirect URIs, orígenes CORS y cookies. Probar por completo.
4. **Mover los nameservers a Cloudflare** (registro en GoDaddy, DNS en Cloudflare), con los registros ya copiados y verificados.
5. **Apuntar el apex y `www` a Cloudflare Pages.** Añadir redirecciones 301 de las rutas antiguas del CRM en el apex hacia `crm.dominio.com`, para que marcadores y enlaces enviados no se rompan.
6. **Aislar la sesión del CRM:** cookies de sesión sin atributo `Domain` (solo del host `crm.`), `Secure`, `HttpOnly`, `SameSite`.

## Integración web → CRM

```
Navegador → /api/contacto (Pages Function) → CRM (API con clave o firma HMAC)
```

- La web nunca expone credenciales del CRM: viven como secretos de Cloudflare.
- El CRM debe ofrecer un endpoint de alta de prospectos autenticado (clave de API o firma), separado de su login de usuarios.
- Protecciones en el endpoint de la web: validación estricta, Turnstile, honeypot, límite de peticiones y CORS restringido.

## Prompt para el ChatGPT que diseñó el CRM

Pégalo en la misma conversación donde se creó el CRM. Pide un informe técnico sin datos sensibles.

```text
Necesito un informe técnico completo del CRM que diseñamos juntos, para integrarlo con una página web nueva y
moverlo del dominio principal a un subdominio (crm.midominio.com). Responde en Markdown con exactamente estas
secciones. Si algo no lo sabes o depende de cómo lo desplegué, dilo: no inventes.

IMPORTANTE: no incluyas contraseñas, tokens, claves ni valores reales de variables de entorno. Solo sus NOMBRES.

1. Resumen: qué hace el CRM y quién lo usa (roles).
2. Stack: lenguaje, framework, base de datos, ORM, librerías principales y sus versiones.
3. Alojamiento: qué proveedor/servicio lo sirve hoy, cómo se despliega y cómo está conectado al dominio principal
   (servidor web, proxy, plataforma, registros DNS que necesita).
4. Estructura del proyecto: árbol de carpetas y qué hace cada una.
5. Modelo de datos: tablas/colecciones y campos (sobre todo prospectos, alumnos, tutores, grupos, pagos), con tipos.
6. Autenticación y autorización: cómo inician sesión los usuarios, cómo se guardan las contraseñas, cómo se manejan
   sesiones o tokens, roles y permisos.
7. API: lista de todos los endpoints (método, ruta, autenticación requerida, cuerpo esperado y respuesta).
   Indica si YA existe uno para crear un prospecto y cómo se autentica; si no existe, propón el diseño de uno
   (con clave de API o firma HMAC, validación y límite de peticiones).
8. Dependencias del dominio: todo lo que asuma que vive en la raíz del dominio (rutas absolutas, URL base, cookies con
   atributo Domain, CORS, redirect URIs de OAuth, webhooks, enlaces en correos, integraciones).
9. Variables de entorno: lista de nombres y para qué sirve cada una (sin valores).
10. Seguridad: qué controles existen hoy (validación de entradas, protección contra inyección SQL/XSS/CSRF, límite de
    intentos de login, cabeceras, HTTPS, registros de auditoría) y qué riesgos ves.
11. Datos personales: qué datos de menores y de tutores se guardan, dónde, si hay cifrado y respaldos.
12. Migración a subdominio: pasos exactos, en orden, con lo que hay que cambiar en el código y en la configuración,
    y cómo verificar que todo funciona antes de cortar el dominio principal.
13. Preguntas abiertas: todo lo que necesitas que yo te confirme.
```
