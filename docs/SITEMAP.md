# Mapa del sitio y plan de contenido

Fuente de verdad de qué lleva cada página y qué falta por confirmar. Se actualiza a medida que llega
contenido real. **Inicio, Disciplinas, Horarios y Nosotros ya están construidas** (fase 3, 2026-09-24);
Galería y Contacto siguen en fase 2 (contenido pendiente).

## Páginas

```
/                    Inicio
/disciplinas         Disciplinas (ficha por disciplina)
/horarios            Horario general (tabla) + tarifas
/nosotros            Historia, filosofía, instructoras
/galeria              Fotos y video de clases y eventos
/contacto            Ubicación, WhatsApp, formulario de inscripción/prospecto
```

Seis páginas, navegación plana (sin submenús). El menú de `Header.astro` hoy solo enlaza Inicio, Disciplinas
y Horarios (las tres páginas que existen); Nosotros, Galería y Contacto se agregan al menú cuando se
construyan, para no dejar enlaces rotos. Mientras tanto, WhatsApp es el CTA de contacto en toda la web.

## Inicio (`/`) — ✅ construida

| Sección | Contenido | Estado |
|---|---|---|
| Hero | Formas geométricas que se ensamblan al cargar (GSAP), logo, lema, CTA a WhatsApp y a Horarios | ✅ construido |
| Por qué Spazio | 4 puntos factuales derivados del horario real (rango de edades, disciplinas, días, clases particulares) — no son marketing inventado | ✅ construido |
| Disciplinas (resumen) | Tarjetas por categoría con conteo real de clases, enlazan a `/disciplinas` | ✅ construido (de `src/content/schedule`) |
| Testimonios | Citas de alumnos/tutores | ⏳ omitida — falta contenido, no se inventa |
| CTA final | WhatsApp + dirección (sin mapa embebido, por ahora solo texto) | ✅ construido (dato real de Instagram, confirmar vigente) |

No se construyó el widget "hoy/mañana" que planeaba la primera versión de este documento: en su lugar,
el resaltado de "hoy" se implementó en la tabla de `/horarios` (columna del día actual), que es donde
aporta más.

## Disciplinas (`/disciplinas`) — ✅ construida

Una tarjeta por clase (no por ficha individual con foto/descripción larga), agrupadas por categoría,
generadas directamente de `src/content/schedule/general.json` vía `src/lib/schedule.ts` — sin datos
inventados. Cada tarjeta muestra: ícono, nombre, días y horario reales, y un enlace de WhatsApp
prellenado para preguntar por esa clase.

- **Ballet:** Baby Ballet, Ballet Infantil Principiante, Ballet Juvenil Intermedio
- **Contemporáneo y urbano:** Contemporáneo Infantil, Contemporáneo Juvenil, Contempo-Urbano Infantil, Contempo-Urbano Juvenil
- **Ritmos latinos:** Salsa Básico, Salsa Taller, Cumbia Básico, Cumbia Taller, Bachata Nivel Abierto
- **Talleres artísticos:** Teatro Musical, Dibujo y Pintura
- **Clases particulares** (con previa cita)

**Pendiente para enriquecerla** (no bloquea, la página ya funciona sin esto): edad recomendada, nivel,
una foto o video corto y 2-3 líneas de descripción por disciplina — no se inventa el enfoque pedagógico.

## Horarios (`/horarios`) — ✅ construida

- Tabla completa del horario general en CSS Grid (con "rowspan" real para las clases de 2 horas), fondos
  y colores por categoría, y la columna del día actual resaltada según la fecha del visitante.
  Fuente: `src/content/schedule/general.json` (27 sesiones, 6 días) vía `src/lib/schedule.ts`.
  Se actualiza a mano cuando cambie el tablero (Artifact) hasta que haya automatización.
- Tarifas: **no están en esta página todavía.** Solo hay una promoción puntual de septiembre
  ("inscripción gratis + $350/mes") que no sirve como precio estable para la web. Se necesita una lista
  de precios vigente por disciplina/paquete o un solo precio mensual, y si varía por edad o por número
  de clases.

## Nosotros (`/nosotros`) — ✅ construida (copy generada, pendiente de revisión)

Historia, tres valores (Arte/Disciplina/Constancia) y una sección de la directora, con copy **generada
por encargo explícito del cliente** (2026-09-24) a falta de un texto propio de la academia. Evita a
propósito cualquier dato verificable no confirmado: sin año de fundación, sin cifras de alumnos, sin
certificaciones ni nombres de instructoras/es distintos a la directora (único dato confirmado: Lic. en
Danza Angeles Méndez). El código fuente (`src/pages/nosotros.astro`) trae un comentario con el mismo aviso.

**Pendiente:** que la academia revise/ajuste este texto, y agregar foto y nombre de más instructoras/es
si se quiere mostrarlos individualmente.

## Galería (`/galeria`)

- Fotos y video de clases, eventos, recitales. **Falta** — el usuario confirmó que subirán material propio.
  Formato recomendado: WebP para fotos, video corto autoalojado o de YouTube/Instagram embebido bajo demanda
  (no cargar video pesado de entrada, por rendimiento).

## Contacto / inscripción (`/contacto`)

- WhatsApp: `22 13 07 46 45` (confirmar que siga vigente).
- Dirección: Av Soledad #479, Planta Alta, Segundo Barrio, Huejotzingo (confirmar vigente, agregar mapa).
- Instagram: `spazio_centroartistico`, Facebook: Spazio Centro Artístico (confirmar URLs exactas).
- Formulario de inscripción/prospecto: **fase 4**, depende de que el CRM tenga el endpoint
  `POST /api/v1/prospects` (ver `docs/CRM-DOMINIO.md`). Mientras tanto, el CTA principal es WhatsApp directo.

## Pendientes para poder avanzar a fase 3

1. ~~Tipografía de titulares~~ — decidido: Unbounded (ver `docs/BRAND.md`).
2. ~~Texto de "Nosotros"~~ — generado por encargo del cliente (2026-09-24), pendiente de que la academia
   lo revise/ajuste (ver la sección de Nosotros arriba).
3. Lista de precios vigente.
4. Fotos/video propios (al menos una tanda inicial para no lanzar con espacios vacíos).
5. Confirmar que el WhatsApp, dirección e Instagram/Facebook de Instagram siguen vigentes.
6. Nombres, disciplinas y foto de instructoras/es (si se quiere mostrarlos).

No es necesario resolver los seis puntos para empezar a construir: la fase 3 puede arrancar con las
páginas que ya tienen contenido real (Inicio, Disciplinas con nombres y horario, Horarios) y dejar
`Nosotros`/`Galería` con contenido de relleno claramente marcado hasta que llegue el material.
