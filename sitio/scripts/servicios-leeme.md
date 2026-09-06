# Ampliación de las páginas de servicio

`servicios-es.json` trae las **19 páginas de servicio** del sitio en castellano.
Hoy suman 5.810 palabras: hay páginas de 108. Se trata de reescribirlas y
ampliarlas, no de corregirlas.

Cada página tiene dos bloques:

- **`actual`**: lo que hay publicado hoy. Es solo lectura. Está para que sepas
  qué se ofrece de verdad y no lo contradigas.
- **`nuevo`**: vacío. Es lo único que se rellena y lo único que se importa.

---

## Cómo se devuelve

El mismo fichero, con `nuevo` relleno. No cambies `rutaId`, `url`, `fichero`,
`imagenes` ni `actual`: son los que devuelven cada texto a su sitio.

`nuevo.secciones` es la página entera, no un parche sobre `actual`. Puedes
crear, partir, fusionar y reordenar secciones libremente.

```jsonc
"nuevo": {
  "meta": {
    "titulo": "Restauración de motores Porsche · Sala propia · Valentín Motors",
    "descripcion": "Reconstruimos motores Porsche de cualquier época en sala propia..."
  },
  "h1": "Restauración y reconstrucción de motores Porsche",
  "menu": "Motores",
  "imagenes": [
    { "i": 0, "alt": "Bloque de un bóxer 3.2 desmontado sobre el banco" }
  ],
  "secciones": [
    {
      "nivel": 2,
      "titulo": "Qué motores pasan por la sala",
      "parrafos": ["Texto con <a href=\"/sala-motores\">enlace interno</a>."],
      "items": [],
      "imagenes": [0]
    }
  ]
}
```

### Reglas del formato

| Campo | Qué admite |
|---|---|
| `nivel` | `2` para un H2, `3` para un H3. **Nunca 1**: el H1 va en `nuevo.h1`. |
| `titulo` | Texto plano. Puede ir vacío si la sección no lleva encabezado. |
| `parrafos` | HTML **en línea y solo estos tres**: `<a href="...">`, `<strong>`, `<em>`. Nada de `<p>`, `<ul>`, `<h2>` ni atributos de estilo: cada elemento del array ya es un párrafo. |
| `items` | **Texto plano, sin HTML**: se escapa y se vería el código. Son los bullets. |
| `imagenes` | Índices (`i`) del catálogo `imagenes` de esa página. Cada índice se usa una sola vez en toda la página. |

El `alt` de cada foto se reescribe en `nuevo.imagenes`. Los de ahora son
etiquetas de archivo ("Restauración de motores"): descríbelas de verdad.

Una sección con foto se pinta a dos columnas, texto a la izquierda. Si le pones
dos o tres, van en rejilla. Piensa dónde cae cada una.

---

## Qué se busca, con los datos delante

De Search Console, tres meses:

- **`/taller-porsche`: 7.556 impresiones y 96 clics. CTR del 1,27 %.** Google ya
  la enseña; nadie entra. Es la página con más recorrido de todo el sitio.
- **8 de las 10 consultas principales son la marca** (*valentin motors*,
  *valentinmotors*, *valentin motors madrid*…) y suman el 24 % de los clics.
  El crecimiento está en el genérico, que hoy solo despunta en un sitio: `IMS`.
- **`ims porsche`: 1.635 impresiones, 60 clics, 3,67 % de CTR.** Es la única
  keyword no de marca con volumen propio.

De ahí lo que hay que atacar, por orden:

**1. El par title + description.** En `/taller-porsche` es más rentable que
cualquier palabra que añadamos: el problema medido no es que falte contenido,
es que el resultado de Google no invita a entrar.

- `meta.titulo`: **máximo 60 caracteres**, la keyword al principio, y termina en
  `· Valentín Motors`. Que se lea distinto de los otros 18: hoy varios se
  parecen entre sí y Google elige por él.
- `meta.descripcion`: **entre 120 y 160 caracteres**. Concreta y con lo que nos
  separa de un taller cualquiera: sala de motores propia, especialista Porsche
  desde 1979, recogida en toda España, dos centros. Nada de "los mejores
  profesionales a su servicio".
- El `h1` **no repite el `meta.titulo`**. El title se escribe para el resultado
  de búsqueda; el h1, para quien ya ha entrado.

**2. Un H2 por intención de búsqueda.** Alguien que busca *rehabilitación motor
Porsche* y alguien que busca *cuánto cuesta abrir un motor Porsche* no buscan lo
mismo. Cada uno merece su H2, con la respuesta debajo en el primer párrafo. Los
H2 en forma de pregunta funcionan bien aquí.

**3. Enlaces internos.** Cada página debe enlazar a **entre 2 y 4** rutas de
`referencia.rutas`, dentro del texto y con un anchor que diga a dónde va. Las
páginas de taller y las de restauración están hoy casi aisladas entre sí.

**4. Términos que se buscan en su forma real.** `IMS`, `bore scoring`,
`backdating` y `transaxle` se escriben así, sin traducir y sin explicar en un
paréntesis cada vez. La lista entera está en `referencia.invariantes`.

---

## Tono: esto lo comprueba el build y falla si no se cumple

El registro del proyecto es **contenido, preciso y editorial. Nunca comercial**.
El texto de `actual` ya está en ese tono: es la referencia.

- **Prohibido el guion largo (—)**, que es regla del proyecto en castellano. Se
  resuelve con coma, punto y coma o dos puntos.
- **Sin exclamaciones.**
- **Sin lenguaje de concesionario**: nada de *oportunidad única*, *no te lo
  pierdas*, *el coche de tus sueños*, *pasión por el automóvil*, *equipo de
  profesionales altamente cualificados*.
- **Tuteo**, como el resto de la web en castellano.
- **Ortotipografía**: se abren interrogaciones y exclamaciones (`¿` `¡`),
  tildes puestas, sin dobles espacios, y **sin espacio antes de los dos puntos**
  (eso solo es correcto en francés).
- **Vocabulario fijado**: usa los términos de `referencia.terminosCastellano`.
  Es "caja de cambios", no "transmisión"; "sala de motores", no "taller de
  motores"; "inspección pre-compra", no "peritaje".

Los cinco idiomas restantes se traducen después desde este castellano. Escribe
solo en castellano.

---

## Longitud

Cada página trae su `objetivoPalabras`:

- **Cabecera** (`taller`, `restauraciones`, `sala-motores`): 1.200 a 1.600
  palabras. Cargan con la vista de conjunto y con los enlaces a las páginas que
  cuelgan de ellas.
- **Hoja** (las otras 16): 600 a 900 palabras.

El objetivo es el suelo, no la meta. Si una página se queda en 650 palabras
buenas antes que llegar a 900 con relleno, mejor 650. Un párrafo que no aporta
un dato, un criterio o una consecuencia sobra.

---

## Lo que no hay que hacer

- **No inventar datos.** Precios, plazos, garantías, certificaciones,
  homologaciones, años de experiencia, número de coches o de empleados,
  premios. Si un texto pide un dato que no está en `actual`, escribe
  `[[COMPROBAR: plazo medio de una rehabilitación de motor]]` y sigue. Se
  resuelve con el taller antes de publicar.
- **No prometer servicios que no aparecen en `actual`.** Si crees que falta
  uno, márcalo igual con `[[COMPROBAR: ...]]`.
- **No tocar `rutaId` ni `url`.** Son las URLs que hoy posicionan y no se
  mueven: es la regla que sostuvo toda la migración.
- **No crear páginas nuevas** ni enlazar rutas que no estén en
  `referencia.rutas`. Un enlace a una URL que no existe rompe el build.
- **No usar `Valentin Motors` sin tilde** dentro del texto. En prosa es
  *Valentín Motors*.

---

## Referencia incluida en el JSON

- `referencia.rutas`: las 44 rutas internas enlazables, con su URL en
  castellano. Es la única lista válida para los `href`.
- `referencia.magazine`: los 57 artículos del Magazine, con su título. El campo
  `articulos` de cada página son los que ya se muestran al pie; puedes proponer
  otros de esta lista.
- `referencia.invariantes`: términos que se escriben siempre igual.
- `referencia.terminosCastellano`: el vocabulario técnico fijado del proyecto.
