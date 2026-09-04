# Contenido despublicado

Lo que hay aquí **no se publica**: está fuera de `src/content/magazine`, que es
la base del glob de la colección, así que no lo ve ninguna de las siete páginas
que listan artículos. Sacarlo del directorio es más seguro que filtrarlo en
cada listado, donde tarde o temprano se olvida uno.

Sigue en git, con su historia. Para volver a publicarlo basta con moverlo de
vuelta a `src/content/magazine/<idioma>/` y quitar su redirección de
`_migracion/scripts/04_inventario_urls.py`.

| Contenido | Fecha | Por qué |
|---|---|---|
| `revision-gratuita-esenciales` | feb. 2023 | Campaña caducada. Ofrecía una revisión gratuita que ya no está vigente y seguía publicada, con 0 clics y 0 impresiones en tres meses. Redirige a `/taller-porsche`. |
