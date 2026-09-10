# Traducciones

## Cómo funciona

```bash
# 1. Generar el fichero con todo lo que falta por traducir
python3 _migracion/scripts/14_exportar_para_traducir.py
#    -> _migracion/traducciones/PARA-TRADUCIR.json

# 2. Rellenar las casillas de idioma y devolver el fichero

# 3. Aplicarlo (valida antes de escribir nada)
python3 _migracion/scripts/15_importar_traducciones.py TRADUCIDO.json

# 4. Comprobar
cd sitio && npm run build
```

## El fichero

Cada entrada es un texto del sitio con su `id`, el original en `es` y una
casilla vacía por idioma pendiente:

```json
{
  "id": "pagina:restauraciones:meta.titulo",
  "tipo": "meta-titulo",
  "contexto": "Página /restauraciones (servicio) — título del resultado en Google",
  "limiteCaracteres": 60,
  "es": "Restauraciones Porsche — Valentín Motors",
  "en": "", "fr": "", "de": "", "it": "", "ca": ""
}
```

**No cambies `id` ni `es`.** Si una entrada trae `destinos`, ese texto se repite
en varios sitios y basta traducirlo una vez: el importador lo reparte.

Lo ya traducido no aparece en el fichero. Se puede regenerar en cualquier
momento y solo saldrá lo que siga pendiente.

## Qué valida el importador

Si algo falla **no escribe ningún fichero**. Un import rechazado es mejor que
medio sitio con textos rotos.

| Comprobación | Por qué |
|---|---|
| El `id` existe y el `es` no ha cambiado | Detecta ficheros desincronizados |
| Términos invariantes presentes | IMS, bore scoring, Porsche, TECHART… no se traducen. Compara sin acentos: la marca aparece como *Valentin* y como *Valentín* |
| Etiquetas HTML idénticas | `<strong>`, `<br/>`, `<a href>` son contenido, no maquetado |
| Rutas conservadas | `/img/...`, `/contacto`, `/magazine/...` |
| Cifras conservadas | Precios, años, cilindradas |
| No idéntica al español | Casilla rellenada con el original |
| Longitud razonable | Los `<title>` con límite |

## Publicación parcial

Una página **solo se publica en un idioma cuando está entera**. El importador
calcula la cobertura y la guarda en el propio fichero:

```json
"traduccion": { "hechas": 2, "total": 28, "completa": false }
```

Por debajo del 90% no se genera esa URL ni se declara en el `hreflang`. Evita
publicar una página alemana con el noventa por ciento del texto en español,
que sería contenido duplicado y no podría autorreferenciarse.

## Qué se guarda y qué se tira

Una entrega aplicada se borra. Lo que entró vive en `sitio/src`, y dejarla al
lado invita a reimportarla encima del trabajo posterior, que es justo lo que
estuvo a punto de pasar con la segunda vuelta de servicios.

Se quedan solo las que un script sigue leyendo:

| Fichero | Quién lo lee |
|---|---|
| `PARA-TRADUCIR.json` | 14, 15, 16, 19, 29 y 30, como referencia del original |
| `TRADUCIDO.json` | 15 y 18 |
| `METAS-PARA-TRADUCIR.json`, `METAS-TRADUCIDAS.json` | 29 y 30 |
| `VALENTIN-MOTORS-GUIAS-PORSCHE-TRADUCCIONES/` | 31, que regenera las 90 guías |

Las tandas de `sitio/revision/` y `sitio/revision-servicios/` no se versionan y
se borran en cuanto están aplicadas: se regeneran con su `:exportar`.

## Glosario

`sitio/src/i18n/glosario.md`: 63 términos, la tabla de equivalencias en los seis
idiomas y las reglas de tono y longitud.
