# Segunda vuelta de los servicios: quitarles la plantilla

La primera tanda amplió las 19 páginas de servicio de 5.810 a 15.259 palabras. El
contenido es correcto y no se tira. Lo que hay que rehacer es **la forma**: las
19 páginas salieron con el mismo esqueleto, y eso se nota al leer dos seguidas.

Este documento fue el encargo de la segunda vuelta. El circuito de exportar e
importar ya no existe: las 19 páginas están cerradas en los seis idiomas y se
editan directamente en `src/datos/paginas/`. Lo que sigue vigente es el
criterio, que `validar-servicios.ts` comprueba en cada build.

---

## Lo que está mal, medido

Sobre las 19 páginas publicadas hoy:

| Qué | Cuántas |
|---|---:|
| «El servicio empieza por definir el problema» como primer H2 | **19 de 19** |
| «Diagnóstico, alcance y autorización» como segundo H2 | **19 de 19** |
| «Qué puede esperar el propietario» | **19 de 19** |
| Páginas que abren con las palabras «En Valentín Motors entendemos que…» | **19 de 19** |
| Parecido literal medio del texto de «Diagnóstico, alcance y autorización» entre páginas | **51 %** |
| «Qué hacemos» | 10 de 19 |
| «Cómo preparar la primera consulta» | 8 de 19 |

Dos consecuencias, y ninguna es estética:

**Para quien lee.** Las dos primeras secciones de cada página, que es lo que
entra en la primera pantalla, hablan de método y no del servicio. Alguien que
llega buscando «cambiar el IMS» lee dos párrafos sobre cómo definimos el
problema antes de saber si le abrimos el motor. Y si mira una segunda página,
reconoce la misma página otra vez.

**Para Google.** Diecinueve páginas con los mismos H2 en el mismo orden y una
sección con la mitad del texto compartido compiten entre ellas. El buscador
tiene que decidir cuál de las diecinueve responde a «reparación IMS Porsche», y
lo que le hemos dado son diecinueve formas casi iguales.

---

## Regla que gobierna toda la vuelta

> **Un encabezado no puede repetirse en más de tres de las diecinueve páginas,
> ni la misma fórmula con el nombre del servicio detrás.**

Se salvan dos, que son estructura y no contenido: `Preguntas frecuentes` y
`Servicios relacionados`. Todo lo demás se escribe para esa página.

**La segunda mitad de la regla no estaba en la primera versión de este
documento, y se nota.** La segunda vuelta cumplió la primera mitad al pie de la
letra y dejó el esqueleto intacto: las cuatro secciones comunes se renombraron
añadiéndoles el nombre del servicio.

| Primera vuelta | Segunda vuelta | En cuántas |
|---|---|---:|
| El servicio empieza por definir el problema | El punto de partida para **X** | 19 |
| Diagnóstico, alcance y autorización | Decidir el alcance de **X** | 19 |
| Qué puede esperar el propietario | Qué queda al entregar **X** | 19 |
| — | Lo que no incluye **X** | 19 |

Diecinueve encabezados literalmente distintos y una sola plantilla. Cambiarle
el final a una fórmula no la hace distinta: quien lee dos páginas seguidas ve
la misma escalera.

Es comprobable, y ya se comprueba: `scripts/validar-servicios.ts` corre dentro de `npm run build`. Tumba el
build si un encabezado se repite en más de tres páginas, si una abre con la
fórmula de la primera vuelta o si le faltan bloques de lista. Y **avisa**, sin
tumbar, cuando seis o más páginas comparten las tres primeras palabras de un
encabezado: es lo que hoy dice de las cuatro secciones de la tabla de arriba.

Ese aviso es el trabajo pendiente. Se apaga cuando las cuatro dejen de estar en
las diecinueve, no antes, y entonces puede pasar a ser fallo.

---

## El pendiente concreto de la tercera vuelta

Cuatro secciones, presentes en las 19 páginas, que hay que resolver de otra
manera. No se trata de renombrarlas otra vez:

- **Fundirlas donde repiten.** «El punto de partida» y «Decidir el alcance»
  dicen casi lo mismo en la mitad de las páginas. Donde así sea, una sola.
- **Moverlas donde estorban.** En `taller-ims` las cuatro caen al final, después
  del caso documentado, y «El punto de partida» aparece como octava sección. Un
  punto de partida que llega el octavo no es un punto de partida.
- **Quitarlas donde no aportan.** `storage` tiene siete secciones y cuatro son
  estas. La página se queda en tres cosas propias.
- **Escribirlas como contenido donde sí valen.** En un proyecto largo, decidir
  el alcance importa de verdad: ahí que hable de plazos, de fases y de quién
  autoriza qué, no de método en abstracto.

## Cuatro formas, no una

El error no fue tener una estructura: fue tener **una sola**. Las 19 páginas no
son la misma clase de página. Cada una elige la forma que le corresponde y
escribe sus propios encabezados dentro de ella.

### A · Avería concreta

`taller-ims`, `taller-bore-scoring`, `taller-cajas`, `taller-motores`,
`taller-pintura`

Quien llega ya tiene un síntoma y quiere saber si le afecta y qué cuesta
averiguarlo.

1. Qué es y a qué modelos y años afecta. Con nombres de motor y de generación.
2. Cómo se reconoce. Señales, y cuáles se confunden con otra cosa.
3. Cómo se confirma. Qué prueba lo decide y por qué no basta con el síntoma.
4. Qué incluye la intervención, con lo que **no** incluye dicho igual de claro.
5. Un trabajo real, enlazado al artículo del Magazine que lo enseña.

### B · Mantenimiento recurrente

`taller-mantenimiento`, `taller-tarifas`, `taller-servicio-tecnico`

Quien llega quiere saber qué entra, cada cuánto y cuánto.

1. Qué entra en cada revisión, en lista, no en prosa.
2. Cada cuánto, y de qué depende: uso, año, motor.
3. Qué cambia de un modelo a otro y por qué la tarifa no es una sola.
4. Qué se decide antes de tocar nada.

### C · Proyecto largo

`restauraciones` y sus cuatro hijas, `sala-motores`

Quien llega está decidiendo si meterse. Necesita entender el alcance y el
criterio, no el procedimiento administrativo.

1. Qué se puede recuperar y qué no, con franqueza.
2. Cómo se decide el alcance: aquí sí cabe lo de la autorización, **una vez**,
   escrito para esta página.
3. Fases, y qué se ve en cada una.
4. Qué queda documentado al terminar.
5. Un proyecto real, con fotos y enlace.

### D · Decisión antes de comprar o de guardar

`taller-pre-compra`, `storage`, `competicion`

Quien llega compara opciones y quiere saber qué cubre y qué no.

1. Qué se comprueba o qué se ofrece, punto por punto.
2. **Qué no cubre.** Explícito. Es lo que más confianza da y lo que ninguna
   página de la competencia escribe.
3. Qué recibe el propietario: informe, fotos, acceso, condiciones.
4. Cuándo tiene sentido y cuándo no hace falta.

---

## La primera frase

Ninguna página vuelve a empezar por «En Valentín Motors entendemos que». La
primera frase de cada página tiene que contener **un modelo, una pieza, una
cifra o un síntoma**. Si se puede mover a otra página sin cambiar una palabra,
está mal.

Mal, y es lo que hay hoy:

> En Valentín Motors entendemos que la intervención sobre el IMS comienza
> identificando qué rodamiento corresponde al modelo, al año y, en años de
> transición, al número de motor.

Bien:

> El rodamiento del árbol intermedio se sustituye sin abrir el bloque en los
> M96 y M97 de 1997 a 2005. Desde el año modelo 2006 el 6305 es más grande y ya
> no sale por la brida: ahí la conversación es otra.

---

## Variar el tipo de sección, no solo el título

Hoy las 19 páginas son prosa de principio a fin. Cambiar los títulos y dejar la
misma sucesión de párrafos deja la sensación de plantilla intacta. Cada página
debe llevar **al menos dos** bloques que no sean prosa, elegidos entre:

- **Lista de comprobación** (`items`): qué se revisa, qué entra, qué se mide.
- **Qué no incluye**: la lista incómoda. Va en las cuatro formas.
- **Señales y confusiones**: para las páginas de avería. «Suena a taqués» es más
  útil que un párrafo sobre metodología.
- **Un caso real**: dos frases y el enlace al artículo del Magazine, con su
  foto. Los artículos ya están, y las páginas ya los enlazan al pie.
- **Tabla de tarifas**, donde exista precio publicado.

Las fotos van con esto: catorce páginas salieron con una foto o ninguna, y hay
41 candidatas ya elegidas del Magazine, casi todas de los artículos que la
propia página enlaza.

---

## Traducciones

La primera tanda vino en seis idiomas de una vez y llegaron siete textos sin
traducir del todo, entre ellos un párrafo de `competicion` mitad castellano
mitad italiano y otro mitad alemán. Ya están corregidos, pero conviene saber por
dónde se coló.

Para esta vuelta:

1. **Primero el castellano, cerrado y revisado.** Después las cinco
   traducciones. No a la vez.
2. Variar los encabezados multiplica las cadenas nuevas: cada H2 propio de una
   página es una cadena que antes no existía. Contadlas antes de encargar.
3. Los invariantes del glosario se escriben igual en los seis: `IMS`,
   `bore scoring`, `backdating`, `transaxle`, `Tiptronic`, `PDK`, `Targa`,
   `Coupé`. `bore scoring` en minúscula dentro de un titular también.
4. El espaciado antes de `:` `;` `!` `?` solo es francés. El importador ya lo
   normaliza, pero si aparece en el original es señal de que esa página se
   tradujo en bloque sin releer.
5. `es`, `ca`: tuteo. `fr`, `de`, `it`: usted. `en`: neutro.

---

## Lo que no se toca

- `rutaId`, `url`, `fichero`, `imagenes`, `articulos` ni `actual`. Son lo que
  devuelve cada texto a su sitio.
- Las URLs. Ninguna se mueve.
- Los datos: precios, plazos, garantías y certificaciones solo pueden salir de
  `actual`. Lo que falte se marca `[[COMPROBAR: ...]]` y lo resuelve el taller.
- El tono: contenido, preciso y editorial. Sin guion largo en castellano, sin
  exclamaciones, sin lenguaje de concesionario.

---

## Orden de trabajo sugerido

1. Las cinco de **avería concreta**. Son las que más tráfico genérico pueden
   captar y las que hoy más se parecen entre sí.
2. Las tres de **mantenimiento**, que es donde están las tarifas y dos de las
   diez páginas con más clics del sitio.
3. Las seis de **proyecto largo**.
4. Las tres de **decisión**.
5. `taller` y `restauraciones`, las dos cabeceras, al final: se escriben cuando
   ya se sabe qué dice cada hija.
