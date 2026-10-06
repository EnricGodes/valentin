# Valentin Motors — Microsites de coches en venta

## Qué es este proyecto

Microsites editoriales de lujo para la venta de coches Porsche de colección. Cada coche tiene su propia página HTML independiente con diseño cinematográfico (fondo negro, tipografía editorial, galerías a pantalla completa). El `index.html` es el catálogo general con tarjetas de acceso a cada ficha.

Valentin Motors es especialista Porsche desde 1979. El tono es contenido, preciso y editorial — nunca comercial ni exagerado.

---

## Estructura de archivos

```
/
├── index.html              — Catálogo de coches (6 tarjetas)
├── ruf.html                — Porsche 997 RUF Kompressor R
├── 356.html                — Porsche 356 B Cabriolet 1960
├── CLAUDE.md               — Este archivo
├── design_system.md        — Sistema de diseño completo
├── contenido_web.md        — Notas generales de contenido
│
├── img/
│   ├── ruf/                — Fotos del RUF (JPG, ~300–500 KB)
│   │   ├── hero.jpg
│   │   ├── exterior1–5.jpg
│   │   ├── interior1–4.jpg
│   │   ├── close-up1–4.jpg
│   │   └── jordi.jpg
│   └── 356/                — Fotos del 356 (JPG, ~300–460 KB)
│       ├── hero.jpg
│       ├── exterior1–5.jpg
│       ├── interior1–3.jpg
│       └── close-up1–3.jpg
│
└── docs/
    ├── design_system.md    — Design system (fuente de verdad visual)
    ├── ruf.md              — Ficha de contenido del RUF
    ├── porsche_356_b_cabriolet.md  — Ficha de contenido del 356
    ├── Web/
    │   ├── ruf/            — Fotos en alta del RUF (PNG, originales)
    │   └── 356 cabrio/     — Fotos en alta del 356 (PNG, originales)
    └── coches/
        └── porsche_356_b_cabriolet_fotos/  — WebPs originales del 356
```

---

## Cómo añadir un coche nuevo

Checklist para incorporar cada nuevo vehículo:

### 1. Preparar el contenido
- Leer la ficha del coche en `docs/<nombre_coche>.md`
- Identificar: modelo, año, km, color exterior, interior, precio, historia, specs

### 2. Elegir el color de realce
- Cada coche tiene un color de realce único que reemplaza el verde del RUF
- El verde del RUF es: `--green-deep: #003E2C` / `--green-brit: #004225`
- El gris plata del 356 es: `--silver-deep: #4A5057` / `--silver-brit: #5A636B`
- El color de realce se usa en: cursor dot, stat box highlight, shimmer-line (no — esa es siempre bronce)
- El bronce `#B28A5B` y el amarillo `#D9A400` son constantes en todos los coches
- Elegir el color en función del color exterior del coche (relacionado pero no idéntico)

### 3. Redimensionar las fotos
- Fuente: `docs/Web/<carpeta del coche>/` (PNG en alta)
- Destino: `img/<slug>/` (JPG redimensionados)
- Herramienta: `sips` (macOS nativo)
- Comando para cada imagen:
  ```bash
  sips -s format jpeg -s formatOptions 85 -Z 1400 "origen.png" --out "img/<slug>/destino.jpg"
  ```
- Nomenclatura estándar: `hero.jpg`, `exterior1–N.jpg`, `interior1–N.jpg`, `close-up1–N.jpg`
- Tamaño objetivo: < 500 KB por imagen

### 4. Crear la página HTML
- Copiar `356.html` (o `ruf.html`) como base: `cp 356.html <slug>.html`
- Cambiar en el CSS las variables de color de realce (`--silver-deep`, `--silver-brit` o equivalentes)
- Actualizar todas las rutas `img/<slug>/`
- Adaptar todo el contenido de texto a la ficha del coche:
  - Hero: título, claim, eyebrow
  - Intro: párrafos editoriales + tabla de datos rápidos
  - Galería: 5 slides con captions
  - Engineering: stats (potencia, par, cilindrada, velocidades) + texto + tags
  - Restauración/Kit: 4 categorías con items
  - Exterior: texto editorial + grid de close-ups con captions
  - Interior: grid de fotos + texto editorial
  - Provenance (timeline): 3 hitos documentados
  - Specs: tabla completa
  - Jordi Review: opinión + pros/contras
  - Closing: frase de cierre + precio
  - Footer: modelo · color · precio
- Actualizar el JS: rutas de `img0.src` e `img1.src`

### 5. Actualizar `index.html`
- Buscar el placeholder correspondiente (por orden de posición)
- Reemplazar `<div class="car-card ...">` por `<a href="<slug>.html" class="car-card available ...">`
- Añadir imagen: `<img src="img/<slug>/exterior1.jpg" ...>`
- Cambiar badge a `badge-available`
- Añadir nombre, año/km/color, descripción corta, precio y enlace

### 6. Commit y push a GitHub
Después de cada cambio relevante (nuevo coche, corrección de contenido, ajuste de diseño):

```bash
git add -A
git commit -m "Add <slug>: Porsche <modelo> <año>"
git push
```

Ejemplos de mensajes de commit:
- `Add 356: Porsche 356 B Cabriolet 1960`
- `Fix ruf: correct gallery overlay`
- `Update index: add 993 card`
- `Content: update 356 tonneau copy`

El repositorio está en GitHub. Cada push actualiza la versión publicada. Hacer commit y push al terminar cada sesión de trabajo, no acumular cambios sin publicar.

---

## Design system

Ver `design_system.md` para todos los detalles visuales. Resumen:

- **Fondo**: `#0B0B0B` (negro carbón)
- **Tipografías**: Inter (body), IBM Plex Mono (datos técnicos y labels)
- **Bronce**: `#B28A5B` — acento cálido universal (shimmer lines, labels, badges)
- **Color de realce**: específico de cada coche (reemplaza el verde del RUF)
- **Tono verbal**: contenido, preciso, editorial. Sin exclamaciones, sin lenguaje de concesionario
- **Puntuación**: no usar guiones largos (—) en los textos. En español se sustituyen por coma, punto y coma o dos puntos según el contexto
- **Overlays**: solo en hero y closing. En galería y grids de fotos: sin oscurecimiento (o mínimo en captions)

---

## Notas activas

### Porsche 356 B Cabriolet (356.html)
1. **Motor no matching**: el motor 800.350 corresponde a su época pero no es el original de fábrica — ya indicado en la ficha con precisión
2. **Tonneau cover**: la fuente escribe "tuneeau" — normalizado a "tonneau cover" en la web
3. **100 km**: aparece como kilómetros desde restauración — validar con Valentin si es el dato comercial correcto
4. **Garantía**: unificada como "garantía mecánica de motor y caja de cambios, 12 meses"
5. **Carrocería KAAN**: es KAAN, el especialista austriaco. No es Karmann. Confirmado por Enric el 2026-09-01; queda cerrado, no volver a plantearlo

### Porsche 997 RUF Kompressor R (ruf.html)
1. **Archivo fotográfico** (2026-10-06): 57 fotos extra (`docs/coches/ruf/extras`, sesión "mottatrece") en `img/ruf/extras/` (1400 px) y `img/ruf/extras/mini/` (900 px), en cinco grupos: exterior, detalles, motor, interior, cabina. Están en `ruf.html` (sección `#fotografias`, con visor propio) y en `sitio/` (bloque `fotografias` del JSON, seis idiomas). Los textos de `ruf.html` se generaron desde el JSON en castellano: si se cambian, cambiar los dos
2. **Kilómetros**: el cuentakilómetros de las fotos marca 52.665 km; la ficha dice 52.492. Validar con Valentin cuál es el dato comercial

### Porsche 911 Carrera 3.2 Coupé 1984 (911carrera32.html)
1. **Sin opinión de Jordi**: la ficha no la trae y no se inventa; la sección está fuera de la página hasta que Jordi la escriba
2. **231 CV / 284 Nm**: cifras de catálogo del motor 930/20 que da la ficha, no vienen en ella. Es versión Suecia (062) con centralita de emisiones (154): validar con Valentin la potencia real
3. **Interior "piel beige"**: sale de las fotos, la ficha no dice color ni material
4. En `sitio/` tiene ficha en seis idiomas (slug `porsche-911-carrera-3-2-coupe-1984`), traducida a mano: no copiar las etiquetas de las otras fichas traducidas, que salieron de traductor automático ("Tapez", "Boxtyp")

### Porsche 991 Carrera S Cabrio y 997.1 Carrera 4S Tiptronic
- Vendidos (2026-10-06). Fuera del catálogo; `991scabrio.html` y `997tiptronic.html` se quedan marcados como vendidos. En `sitio/` siguen sus fichas con estado vendido en seis idiomas

### Porsche 997.1 Carrera 4S manual
- Vendido (2026-09-26). Fuera del catálogo; `997.html` se queda marcado como vendido. En `sitio/` sigue su ficha con estado vendido

### Coches vendidos: nunca borrar el HTML
- Cada ficha está incrustada en su página de valentinmotors.es (`/porsche-en-venta/<slug>`) con un iframe a `valentin.up.railway.app/<ficha>.html?embed=1`. Borrar el HTML deja esa página en blanco (404)
- Al vender: quitar la tarjeta de `index.html` y marcar la ficha como vendida (aviso «Vehículo vendido» en hero y cierre, precio tachado, nota y botón de contacto). Las fotos de `img/` tampoco se borran

---

## Sitio Astro (`sitio/`)

El sitio publicado ya no son los microsites de la raíz sino la app Astro de `sitio/` (seis idiomas, `npm run build` con validadores). Notas que no se deducen del código:

### Landings por generación (`ocasion-<gen>`)
- Una por modelo (22): 356, 911 clásico, 930, 964, 993, 996, 997, 991, 992, 986, 987, 981, 718, 912, 914, 924, 928, 944, 968, Cayenne, Macan, Panamera. Sin Taycan a propósito.
- Slug ES `porsche-<gen>-de-segunda-mano`: "segunda mano" se busca 9 veces más que "ocasión" y 17 más que "en venta" (Trends España, sept. 2026). No renombrar.
- Los coches se asignan por el slug de la ficha (`src/datos/generacion.ts`). El RUF cuenta como 997. Un coche nuevo aparece solo en su landing.
- Para añadir una generación: ruta en `routes.ts`, tipo en `generacion.ts` si es un número nuevo, y los seis JSON `ocasion-<gen>[.idioma].json` con la misma estructura (intro, qué revisamos, comprar).
- No van en el menú: las enlazan el catálogo, las migas de cada ficha, el pie y entre sí.
