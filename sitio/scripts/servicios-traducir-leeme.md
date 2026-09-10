# Servicios: traducir el castellano a los cinco idiomas

`servicios-es.json` trae las **19 páginas de servicio** del sitio, ya cerradas en
castellano. Esta vuelta **no se reescribe nada**: se traduce.

El castellano de este fichero es el bueno. Salió de tres vueltas y de quitarle
4.500 palabras de plantilla, así que si algo parece repetitivo o corto, lo es a
propósito. No lo alargues ni lo mejores.

---

## Qué se devuelve

Cinco ficheros, uno por idioma, con el mismo nombre y el sufijo del idioma:

```
servicios-en.json    servicios-fr.json    servicios-it.json
servicios-de.json    servicios-ca.json
```

Cada uno es una copia de `servicios-es.json` en la que:

- El campo superior `idioma` pasa a ser el del fichero.
- **`nuevo` se rellena con la traducción de `actual`.** `actual` es el castellano
  publicado hoy; `nuevo` es ese mismo contenido en el idioma que toca, con la
  misma estructura: mismas secciones, mismo orden, mismos niveles, mismo número
  de párrafos y de items.
- Todo lo demás se queda **exactamente igual**: `rutaId`, `url`, `fichero`,
  `imagenes`, `articulos` y `actual`.

El castellano también se devuelve, con `nuevo` = `actual`, para que la tanda
entre de una vez y las seis versiones queden alineadas.

---

## Lo que NO hay que traducir

- **Los `alt` de las fotos.** Van en `nuevo.imagenes` porque el formato lo pide,
  pero el importador los sobrescribe con las descripciones de
  `_migracion/contenido/alts.json`, que ya están en los seis idiomas. Copia el
  castellano y no pierdas tiempo ahí.
- **Los `href`.** Se quedan en castellano, tal como vienen. El sitio los resuelve
  al idioma de la página al pintarla (`enlazaEnIdioma()` en `src/i18n/routes.ts`),
  así que traducirlos no ayuda y romperlos sí molesta.
- **Los términos invariantes del glosario.** `IMS`, `bore scoring`, `backdating`,
  `transaxle`, `Tiptronic`, `PDK`, `Targa`, `Coupé`, `Cabriolet`, `Carrera`,
  `Boxster`, `Cayman`, `Macan`, `M96`, `M97`, `915`, `G50`, `TECHART`. Van igual
  en los seis. `bore scoring` también dentro de un titular, y en minúscula.
- **Las cifras.** 250 €, veintitrés puntos, treinta puntos, 57 modelos, 1979.

---

## Lo que se comprueba al importar, y falla si no se cumple

`npm run servicios:importar` valida antes de escribir. O entra la tanda entera o
no entra nada.

| Comprobación | Por qué |
|---|---|
| Mismas páginas y mismo orden que el castellano | Es lo que devuelve cada texto a su sitio |
| `nivel` solo 2 o 3 | El h1 va en `nuevo.h1`, nunca como sección |
| En los párrafos, solo `<a>`, `<strong>` y `<em>` | Cada elemento del array ya es un párrafo |
| `items` sin HTML | Se escapan al pintarse y se vería el código |
| Índices de imagen existentes y sin repetir | Una foto pintada dos veces en la misma página |
| Ningún `[[COMPROBAR]]` | Son preguntas al taller, no texto publicable |
| Ningún encabezado repetido en más de tres páginas | Ver más abajo |

Y hay dos que el build comprueba después, en `npm run build`:

- **`validar-glosario.ts`**: si un término invariante está en el castellano y no
  en tu idioma, el build cae. Es la comprobación que pilla un `bore scoring`
  traducido.
- **`validar-servicios.ts`**: encabezados repetidos, aperturas prohibidas y
  bloques de lista.

---

## Los encabezados, que es donde se ha caído dos veces

El castellano tiene **161 encabezados distintos** en las 19 páginas. Solo dos se
repiten a propósito, porque son navegación: `Servicios relacionados` y
`Preguntas frecuentes`.

En las dos tandas anteriores las traducciones convirtieron eso en una plantilla:
la misma fórmula con el nombre del servicio detrás, en las 19 páginas. El
validador lo avisa en cada build y hoy canta 28 fórmulas repetidas, todas en los
cinco idiomas, precisamente por eso.

**La regla, en tu idioma igual que en castellano:** ningún encabezado de
contenido en más de tres páginas, **ni la misma fórmula con el nombre del
servicio detrás**. Si en castellano dice «Un ruido no siempre es la caja»,
tradúcelo por lo que dice, no por «Diagnóstico de Cajas de cambios».

---

## Tono

- `es` y `ca`: tuteo. `fr`, `de` e `it`: usted. `en`: neutro.
- Sin exclamaciones y sin lenguaje de concesionario.
- Guion largo: prohibido en castellano y en catalán; en inglés, uso normal.
- **Espacio antes de `:` `;` `!` `?` solo en francés.** El importador lo
  normaliza, pero si aparece en italiano o alemán es señal de que esa página se
  tradujo en bloque sin releer, que es exactamente como se coló la última vez.
- El vocabulario técnico fijado está en `referencia.terminosCastellano` y su
  equivalencia en los seis idiomas, en `src/i18n/glosario.md`.

---

## Cinco textos que ya vinieron mal dos veces

Estos llegaron sin traducir en las dos tandas anteriores, idénticos las dos
veces. Están corregidos en una tabla del importador, así que aunque vuelvan a
llegar mal no entrarán, pero conviene no repetirlos:

- El h1 de `restauraciones-backdating`, en francés e italiano.
- El encabezado de bore scoring dentro de `taller`, en francés, italiano y
  alemán.

Y un párrafo de `competicion` llegó mitad castellano mitad italiano, y otro
mitad alemán. Repasa esa página con calma.

---

## Recuento

19 páginas, 10.690 palabras en castellano. El alemán alarga entre un 20 % y un
35 % sobre el castellano y el italiano en torno a un 15 %: es lo esperable y no
hay que recortar para cuadrar.
