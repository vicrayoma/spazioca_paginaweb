# Marca — Spazio Centro Artístico

Base de un manual de marca, extraída de `SPAZIO LOGOTIPO.pdf` (Illustrator, noviembre 2024) y de los logos web.
Los tokens de código viven en `src/styles/global.css`.

## Esencia

- **Lema:** Arte, disciplina y constancia.
- **Tono:** cálido, enérgico e invitador ("¿Y tú todavía no sabes bailar?"). Cercano, sin perder profesionalismo.
- **Público:** niñas, niños, jóvenes y adultos. Muchas alumnas y alumnos son menores, así que la web habla a madres, padres y tutores además de a los propios alumnos.

## Logotipo

Seis versiones vectoriales en `public/brand/`, más el isotipo solo:

| Archivo | Uso |
|---|---|
| `spazio-horizontal-{color,negro,blanco}.svg` | Encabezados, pies de página, documentos |
| `spazio-vertical-{color,negro,blanco}.svg` | Portadas, redes, espacios cuadrados |
| `spazio-isotipo-{color,negro,blanco}.svg` | Iconos, favicon, sellos (solo el símbolo) |

- Versión **color** sobre fondo claro; **blanco** sobre morado, ciruela o fotografía oscura; **negro** para impresión en una tinta.
- El isotipo (cuartos de círculo, cuadrados y un punto) forma una figura en movimiento. La superposición de formas oscurece donde se cruzan: es la idea visual de toda la web.
- No deformar, recolorear ni añadir sombras. Respetar un margen libre mínimo igual a la altura del punto azul.

## Color

Valores medidos del logo RGB para pantalla:

| Token | Hex | Uso | Contraste sobre blanco |
|---|---|---|---|
| `morado` | `#542583` | Principal: texto, fondos, botones | ~10:1 (AAA) |
| `magenta` | `#C5297D` | Acento y llamadas a la acción | ~5:1 (AA) |
| `cian` | `#0097DA` | Acento puntual (como el punto del logo) | ~3.3:1, solo decoración o texto grande |
| `ciruela` | `#2E032E` | Sombras, fondos profundos | — |
| `tinta` | `#1F1F1D` | Texto de lectura | — |
| `niebla` | `#F6F2F9` | Fondos suaves | — |

> **Pendiente de confirmar con quien diseñó el logo:** el PDF declara los colores en una conversión CMYK
> (`#542E91`, `#C02E86`, `#009EDE`), algo más apagados que los del logo RGB para pantalla. Se usan los RGB
> de pantalla; conviene fijar los valores oficiales.

## Tipografía

- **Wordmark "SPAZIO"**: dibujo a medida (geométrico, ancho, A sin travesaño). Siempre como SVG, nunca con una fuente.
- **"CENTRO ARTÍSTICO"**: sans geométrica tipo Futura, en mayúsculas con mucho espaciado.
- **Texto web (provisional):** Jost, alternativa libre a Futura, autoalojada.
- **Titulares (decidido 2026-09-24):** Unbounded, geométrica y ancha, cercana en peso al wordmark.
  Autoalojada vía `@fontsource-variable/unbounded`, token `--font-display` en `src/styles/global.css`.

## Movimiento

Principios para las animaciones:

1. Las formas del isotipo son el hilo conductor: se ensamblan, se superponen y se desplazan.
2. Fluidas y con propósito: aparecen al hacer scroll, guían la mirada, nunca estorban la lectura.
3. Solo se animan `transform` y `opacity`.
4. Se respeta `prefers-reduced-motion`: sin movimiento para quien lo pide.
