# Política de seguridad

## Reportar una vulnerabilidad

Si encuentras un problema de seguridad en este proyecto, **no abras un issue público**.
Usa el reporte privado de GitHub: pestaña **Security → Report a vulnerability** de este repositorio.

## Reglas del repositorio (es público)

- Nunca se versionan secretos: claves de API, tokens, contraseñas ni datos personales de alumnos.
  Las claves viven como secretos del hosting (Cloudflare) o en `.env` local, que está en `.gitignore`.
- Detalles internos del CRM van en `docs/private/`, también ignorado por git.
- Las dependencias se revisan semanalmente (Dependabot) y en cada cambio (`npm audit`, gitleaks).
- Pendiente de activar en GitHub (Settings): protección de la rama `main` con CI obligatoria,
  secret scanning con push protection y private vulnerability reporting.
