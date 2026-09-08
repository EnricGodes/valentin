# Evaluador de bore scoring

Motor de reglas del evaluador de bore scoring (rayado de cilindros). Es una
función pura: misma entrada, misma salida, sin red y sin DOM. Los componentes
solo pintan.

Especificación funcional completa:
`docs/ESPECIFICACION_EVALUADOR_BORE_SCORING_PORSCHE.md`.

```
tipos.ts             tipos del dominio y los cuatro ejes del resultado
reglas-vehiculo.ts   matriz por modelo, generación, versión y motor
reglas-evidencia.ts  familias de señal, lectura de la boroscopia y urgencia
evaluador.ts         la función evaluarBoreScoring()
textos.es.ts         todo lo que se lee en pantalla
evaluador.test.ts    los 48 casos obligatorios y las precedencias
```

**Versión de reglas:** `1.0.0` · **revisadas el** 2026-09-08.
Las dos constantes viven en `reglas-vehiculo.ts` y se muestran en la página bajo
las fuentes. Cualquier cambio de regla las sube.

## En qué se diferencia de la calculadora IMS

Comparten el armazón visual (`.herr-*` en `system.css`), el patrón de la
aclaración y la analítica. **No comparten motor de decisión, y no deben
compartirlo.**

| | IMS | Bore scoring |
|---|---|---|
| Qué es | Configuración de fábrica de una pieza | Daño físico adquirido, que evoluciona |
| Modelo y año | Identifican casi toda la configuración | Solo una susceptibilidad de familia |
| Resultado | Un veredicto | Cuatro ejes independientes |
| Confirmación | Documentación o inspección de la brida | Boroscopia bien hecha e interpretada |

Los dos resultados no se combinan nunca en una nota de «salud del motor»: son
dos preguntas distintas y juntarlas inventaría una tercera.

## Los cuatro ejes

- **Susceptibilidad**: frecuencia relativa descrita para esa familia de motor.
  No dice nada de esta unidad.
- **Evidencia**: lo que se sabe de esta unidad. `NO_EVIDENCE_REPORTED` significa
  «sin indicios comunicados», nunca «motor sano».
- **Urgencia**: qué conviene hacer y cuándo.
- **Confianza**: calidad de la identificación. No es la probabilidad de que
  falle.

Los identificadores de estado se conservan en inglés y en mayúsculas tal como
los fija la especificación (`ELEVATED_REPORTED_SUSCEPTIBILITY` y hermanos). Sus
tablas de casos y de criterios de aceptación los nombran uno a uno; traducirlos
obligaría a mantener a mano la equivalencia en cada revisión del documento. Los
nombres de campo y los textos sí van en castellano.

## Ejecutar las pruebas

```bash
node --test src/logica/bore-scoring/evaluador.test.ts
```

62 pruebas: los 48 casos de la sección 19 de la especificación, los bordes de
cada tramo de generación **por los dos lados** y las cosas que la herramienta no
puede hacer nunca. Esas últimas son las que importan:

- ninguna combinación de modelo y año diagnostica bore scoring;
- la ausencia de síntomas no descarta el daño;
- no aparece ningún porcentaje ni puntuación en la salida;
- humo, consumo y hollín del mismo proceso no cuentan como tres familias.

## Cómo se comporta la interfaz

Las mismas tres reglas que salieron de rehacer la calculadora IMS, más un
segundo nivel propio:

1. **Formulario.** Modelo, año y tipo de año. Nada más.
2. **Aclaración**, si el año no basta. Una línea que dice por qué se pregunta y
   las opciones **reales de ese coche**, sin nada preseleccionado. Elegir
   resuelve: no hay que volver a pulsar el botón. Se pregunta una cosa cada vez
   y en orden: combustible, generación, versión, cilindrada.
3. **Resultado.** El titular es la susceptibilidad, que es lo que se ha venido a
   preguntar. Debajo, los cuatro ejes, y después «Qué haríamos ahora» con la
   urgencia y el CTA que le corresponde.
4. **Afinar con síntomas y pruebas**, voluntario. Se abre solo si el usuario ha
   dicho que viene por un síntoma o con una prueba.

El resultado se adapta:

- Un eje que diría «sin identificar» no se pinta.
- La configuración de fábrica solo sale si difiere de la del motor actual.
- El detalle de una pregunta aparece solo cuando la respuesta lo pide: la vía de
  acceso de una boroscopia que no existe no se pregunta.
- A un eléctrico no se le enseña el cuestionario de cilindros.
- Elegir la situación cambia el siguiente paso, no abre el cuestionario.
- El cuestionario y la situación quedan fuera del `aria-live`: se repintan a
  cada respuesta, y sin eso un lector de pantalla leería las nueve preguntas
  otra vez cada vez que se contesta una.

## Modificar una regla de motor

1. Toca `REGLAS` en `reglas-vehiculo.ts`. Nunca en el evaluador ni en el
   componente: si una condición de año acaba en un `.astro`, la próxima revisión
   no la encontrará.
2. Añade o reutiliza la clave de `FUENTES`. Una regla sin fuente no entra, y la
   prueba «Cada regla de la matriz tiene fuente y texto propio» lo comprueba.
3. Añade su texto en `MOTIVOS` de `textos.es.ts`, con la clave `regla_<id>`.
4. Sube `VERSION_REGLAS` y `REVISADO`.
5. Añade la prueba **antes** de cambiar la regla, y compruébala por los dos
   lados si es un corte por año.

Reglas del motor que no se negocian:

- Mezger y las tecnologías posteriores se resuelven por prioridad, **antes** que
  cualquier rango por año.
- Una regla específica gana a una genérica; se ordenan por `prioridad`.
- Si dos reglas de la misma prioridad encajan, es un fallo de datos: la salida
  devuelve incertidumbre en vez de elegir una al azar.
- Turbo, GT2, GT3, Spyder y GT4 nunca heredan la regla del Carrera o del S.
- «Otra versión» no cae en la regla del Carrera: cae en
  `ENGINE_SPECIFIC_CLASSIFICATION`.
- Un motor sustituido o reconstruido cambia la susceptibilidad **actual**, no la
  de fábrica, y las dos se enseñan por separado.
- Una factura de reconstrucción sin alcance conocido no permite declarar nada
  resuelto.

## Modificar una regla de evidencia

Vive en `reglas-evidencia.ts`, separada a propósito de la matriz de vehículo.

- Las **familias de señal** están en el objeto `senales`. Se cuentan familias,
  no casillas: humo, consumo y hollín pueden venir del mismo proceso.
- La **precedencia** de evidencia está en `derivaEvidencia()`, de arriba abajo.
  Una boroscopia positiva gana a la ausencia de ruido; una negativa limitada no
  gana a los síntomas nuevos.
- La **urgencia** sale de `derivaUrgencia()`. Lo más fuerte que puede decir es
  reducir el uso y llamar al taller: nunca «no conduzcas».
- **No hay ningún umbral numérico de consumo en la decisión.** Los litros y los
  kilómetros se recogen para enseñárselos al taller y se muestran en
  `l/1.000 km`, nada más. Si algún día Valentin Motors fija un criterio propio,
  entra como configuración editorial con unidades, fuente y fecha, no dentro de
  `derivaUrgencia()`.

## Revisar las fuentes

`FUENTES` en `reglas-vehiculo.ts` mapea cada clave a su documento; la lista con
URLs está en la sección 23 de la especificación. Revisar al menos una vez al
año. Sus límites, que conviene tener presentes al tocar una regla:

- Porsche no publica una tabla de incidencia por modelo, motor y kilometraje.
- LN Engineering y Hartech son especialistas con mucha experiencia práctica,
  pero ven una población seleccionada por averías.
- Varias fuentes usan años del mercado estadounidense o año civil, no MY.
- Un «sin bore scoring», «resuelto» o «inmune» de cualquier fuente se convierte
  aquí en **susceptibilidad comparativamente baja**, salvo una exclusión física
  como la de un eléctrico.
- Si dos fuentes discrepan, la regla conserva la incertidumbre.

## Añadir un idioma

1. Copia `textos.es.ts` a `textos.<idioma>.ts` y traduce. **No se traducen**
   `bore scoring`, `M96`, `M97`, `9A1/MA1`, `Mezger`, `Lokasil`, `Alusil`,
   `Nikasil`, `APS`, `PTWA`, `SUMEbore`, `VR6`, `MCT`, `EA888`, `EA839` ni
   `EA825`. La primera aparición se traduce como «bore scoring (rayado de
   cilindros)» en el idioma que toque.
2. En `src/scripts/evaluador-bore-scoring.ts`, elige el diccionario por
   `document.documentElement.lang`.
3. En `src/components/EvaluadorBoreScoring.astro`, lo mismo para las opciones.
4. Genera la página en ese idioma: los slugs ya están en el manifiesto
   (`src/i18n/routes.ts`, id `evaluador-bore-scoring`).
5. Quita el filtro `idioma === 'es'` de `src/components/Nav.astro`.

## Privacidad

El código de motor y el consumo declarado se procesan en el navegador y no salen
de él: ni a la analítica, ni a la URL del CTA, ni a un log. Los eventos llevan
familia, generación, familia de motor, década, susceptibilidad, evidencia,
urgencia, contexto y versión de reglas. Nunca VIN, matrícula, código completo de
motor, informes, imágenes ni texto libre.

## Pendiente de confirmar con Valentin Motors

La sección 22 de la especificación lista catorce decisiones comerciales que no
bloquean el motor de reglas pero sí cierran los textos: el protocolo exacto de
boroscopia para M96/M97 y para Alusil, qué cilindros se inspeccionan y qué
incluye el informe, la diferencia comercial entre inspección precompra,
boroscopia y diagnóstico, la frase exacta sobre seguir conduciendo, qué
soluciones de reconstrucción ofrece el taller de verdad, el destino del CTA por
sede y si se muestran precios.

Hasta que se cierren, el evaluador **no** cita intervalos propios, ni aceites,
ni marcas de reconstrucción, ni precios.
