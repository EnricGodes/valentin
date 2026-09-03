# Revisión ortográfica y de estilo del castellano

Los ficheros `es-NN.json` traen toda la prosa en castellano del sitio, troceada
en lotes que caben de una vez en cualquier herramienta de revisión.

## Cómo se revisa

Cada fila tiene tres campos:

```json
{ "id": "src/content/magazine/es/porsche-964.md#b3",
  "texto": "El texto tal como está hoy",
  "corregido": "" }
```

Se rellena **`corregido` solo donde haya algo que cambiar**. Lo que se deja
vacío no se toca. `id` y `texto` no se tocan nunca: son los que devuelven la
pieza a su sitio.

## Qué corregir

- Faltas de ortografía y tildes.
- Puntuación: interrogaciones y exclamaciones sin abrir, mayúscula después de
  dos puntos (en castellano va minúscula salvo nombre propio o cita).
- Mayúsculas caprichosas dentro de la frase ("Reimaginado de forma Integral").
- Concordancia y frases que no cierran.
- Tono: contenido, preciso, editorial. Sin exclamaciones ni lenguaje de
  concesionario. Sin guion largo (—): en castellano va coma, punto y coma o
  dos puntos.

## Qué NO tocar

- El marcado: `**negritas**`, `[enlaces](/ruta)`, `![imágenes]()`, `:::directivas`
  y etiquetas HTML. El importador rechaza cualquier pieza donde cambie el número
  de esas marcas.
- Los términos técnicos, que se escriben igual en los seis idiomas: IMS, IMSB,
  M96, M97, Mezger, 9A1/MA1, 6204, 6305, bore scoring, backdating.
- Nombres propios, referencias de motor y matrículas.
- Las cifras.

## Cómo vuelve

```bash
npm run revision:importar -- --probar   # dice qué haría, sin tocar nada
npm run revision:importar               # lo aplica
npm run ortotipografia && npm run build # comprueba que todo sigue en pie
```

Una pieza no se aplica si el fichero ya no contiene el texto que se exportó
(alguien lo editó mientras tanto) o si la corrección altera el marcado. En los
dos casos el importador lo dice y sigue con las demás.

Solo castellano: las traducciones se dan por buenas y no se regeneran.
