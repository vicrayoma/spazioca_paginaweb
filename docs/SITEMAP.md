# Mapa del sitio y plan de contenido

Fase 2. Este documento es la fuente de verdad de qué lleva cada página y qué falta por confirmar antes
de construirla (fase 3). Se actualiza a medida que llega contenido real.

## Páginas

```
/                    Inicio
/disciplinas         Disciplinas (ficha por disciplina)
/horarios            Horario general (tabla) + tarifas
/nosotros            Historia, filosofía, instructoras
/galeria              Fotos y video de clases y eventos
/contacto            Ubicación, WhatsApp, formulario de inscripción/prospecto
```

Seis páginas, navegación plana (sin submenús). En móvil, menú hamburguesa; en escritorio, barra fija que
se comprime al hacer scroll (una de las animaciones "firma" del sitio, ver `docs/BRAND.md`).

## Inicio (`/`)

| Sección | Contenido | Estado |
|---|---|---|
| Hero | Isotipo animado (las formas se ensamblan), lema "Arte, disciplina y constancia", CTA a WhatsApp y a Horarios | ✅ listo (marca + copy) |
| Disciplinas (resumen) | 4-6 tarjetas con las disciplinas más buscadas, enlazan a `/disciplinas` | ✅ listo (de `src/content/schedule`) |
| Por qué Spazio | 3-4 puntos cortos (instructoras certificadas, grupos por edad, ambiente familiar...) | ⏳ falta texto real, no inventar |
| Horario destacado | Vista compacta de "hoy/mañana", enlaza a `/horarios` | ✅ listo (dato real) |
| Testimonios | Citas de alumnos/tutores | ⏳ falta (si no hay, se omite esta sección) |
| CTA final | WhatsApp + dirección + mapa | ✅ listo (dato real de Instagram, confirmar vigente) |

## Disciplinas (`/disciplinas`)

Una ficha por disciplina, agrupadas por categoría. **Lista real** (extraída del horario, `src/content/schedule/general.json`):

- **Ballet:** Baby Ballet, Ballet Infantil Principiante, Ballet Juvenil Intermedio
- **Contemporáneo / urbano:** Contemporáneo Infantil, Contemporáneo Juvenil, Contempo-Urbano Infantil, Contempo-Urbano Juvenil
- **Ritmos latinos:** Salsa Básico, Salsa Taller, Cumbia Básico, Cumbia Taller, Bachata Nivel Abierto
- **Talleres:** Teatro Musical, Dibujo y Pintura
- **Clase particular** (con previa cita)

Cada ficha necesita: edad recomendada, nivel, una foto o video corto, 2-3 líneas de descripción.
**Falta:** fotos/video propios y las descripciones (el nombre y el horario ya están, la descripción
editorial no — no se debe inventar el enfoque pedagógico de cada clase).

## Horarios y tarifas (`/horarios`)

- Tabla del horario general: **lista, dato real**, ya integrada en `src/content/schedule/general.json`
  (27 sesiones, 6 días). Se actualiza a mano cuando cambie el tablero (Artifact) hasta que haya
  automatización.
- Tarifas: **falta.** Solo hay una promoción puntual de septiembre ("inscripción gratis + $350/mes") que
  no sirve como precio estable para la web. Se necesita una lista de precios vigente por disciplina/paquete
  o un solo precio mensual, y si varía por edad o por número de clases.

## Nosotros (`/nosotros`)

- Historia y filosofía de la academia. **Falta por completo** — solo se conoce el lema y que la dirige la
  Lic. en Danza Angeles Méndez. No inventar biografía ni año de fundación.
- Instructoras/es: nombre, disciplina que imparten, una línea de formación, foto. **Falta.**

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
2. Texto real de "Por qué Spazio" y de "Nosotros" (historia, filosofía).
3. Lista de precios vigente.
4. Fotos/video propios (al menos una tanda inicial para no lanzar con espacios vacíos).
5. Confirmar que el WhatsApp, dirección e Instagram/Facebook de Instagram siguen vigentes.
6. Nombres, disciplinas y foto de instructoras/es (si se quiere mostrarlos).

No es necesario resolver los seis puntos para empezar a construir: la fase 3 puede arrancar con las
páginas que ya tienen contenido real (Inicio, Disciplinas con nombres y horario, Horarios) y dejar
`Nosotros`/`Galería` con contenido de relleno claramente marcado hasta que llegue el material.
