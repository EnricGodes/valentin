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

### Porsche 997 RUF Kompressor R (ruf.html)
- Sin notas pendientes
