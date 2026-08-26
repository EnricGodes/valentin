# Migración valentinmotors.es

Espacio de trabajo de la migración de Squarespace a Astro + Sanity en Cloudflare Pages,
en seis idiomas. Plan completo aprobado el 2026-08-26.

## Contenido

```
_migracion/
├── snapshot/          Fase 0 — foto congelada del sitio Squarespace
│   ├── html/          96 páginas, HTML crudo comprimido (.html.gz)
│   ├── json/          96 representaciones JSON de Squarespace
│   └── manifest.json  inventario: status, peso, title, description, h1
├── baseline/          Fase 0 — línea base de GA4 y GSC (2026-08-26)
└── scripts/           utilidades de extracción y validación
```

## Por qué existe el snapshot

El 62% del tráfico del sitio es búsqueda orgánica. El snapshot es la fuente de verdad
contra la que se valida que el sitio nuevo no pierde contenido: el criterio de aceptación
del blog es **diff vacío** entre el texto renderizado nuevo y el de `snapshot/`.

También es la red de seguridad: el día que se cancele Squarespace, todo lo que no esté
aquí deja de existir, incluidas las ~1.900 imágenes alojadas en `images.squarespace-cdn.com`.

## Scripts

| Script | Qué hace |
|---|---|
| `01_snapshot.py` | Descarga las 96 URLs del sitemap (HTML + JSON) y genera el manifest |

## Regenerar el snapshot

```bash
python3 _migracion/scripts/01_snapshot.py
```

Idempotente: sobrescribe. Tarda ~1 min. No ejecutar después de cancelar Squarespace,
por razones evidentes.
