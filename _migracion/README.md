# Migración valentinmotors.es

Lo que queda del espacio de trabajo de la migración de Squarespace a Astro en
Cloudflare Pages, en seis idiomas (plan aprobado el 2026-08-26). La migración y
la traducción están terminadas: todo el contenido vive en `sitio/src` y los
scripts que lo extrajeron, tradujeron y validaron se borraron cuando dejaron de
tener trabajo (git los conserva).

## Contenido

```
_migracion/
├── snapshot/            Foto congelada del sitio Squarespace (2026-08-26)
│   ├── html/            96 páginas, HTML crudo comprimido (.html.gz)
│   ├── json/            96 representaciones JSON de Squarespace
│   └── manifest.json    inventario: status, peso, title, description, h1
├── baseline/            Línea base de GA4 y GSC (2026-08-26)
├── contenido/
│   ├── imagenes/        Fotos originales del Magazine (no versionadas, 415 MB)
│   ├── imagenes-paginas/ Fotos originales de las páginas
│   └── videos/          Vídeos originales (no versionados)
├── informes/
│   └── inventario_urls.csv   Inventario de URLs del sitio viejo
└── LANZAMIENTO.md       Plan y checklist del lanzamiento
```

## Qué lee el sitio de aquí

- `sitio/scripts/sincronizar-imagenes.mjs` y `optimizar-imagenes.mjs` copian y
  optimizan `contenido/imagenes` e `imagenes-paginas` a `sitio/public/img`.
- `optimizar-videos.mjs` hace lo mismo con `contenido/videos`.
- `validar-rutas.ts` comprueba el manifiesto de rutas contra
  `informes/inventario_urls.csv`: ninguna URL del sitio viejo puede perderse.

## Por qué se conserva el snapshot

El 62 % del tráfico del sitio es búsqueda orgánica. El snapshot fue la fuente de
verdad contra la que se validó que el sitio nuevo no perdía contenido, y es la
red de seguridad: el día que se cancele Squarespace, todo lo que no esté aquí
deja de existir.
