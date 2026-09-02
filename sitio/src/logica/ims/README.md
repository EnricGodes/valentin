# Calculadora IMS

Motor de reglas de la calculadora del rodamiento del eje intermedio. Es una
función pura: misma entrada, misma salida, sin red y sin DOM. Los componentes
solo pintan.

Especificación funcional completa: `docs/ESPECIFICACION_CALCULADORA_IMS_PORSCHE.md`.

```
tipos.ts             tipos del dominio
reglas.ts            datos: tramos por año, reglas, cortes por nº de motor, fuentes
evaluador.ts         la función evaluarIms()
textos.es.ts         todo lo que se lee en pantalla
evaluador.test.ts    los 36 casos obligatorios y los bordes de cada corte
```

**Versión de reglas:** `1.0.0` · **revisadas el** 2026-09-01.
Las dos constantes viven en `reglas.ts` y se muestran en pantalla bajo el
formulario. Cualquier cambio de regla las sube.

## Ejecutar las pruebas

```bash
node --test src/logica/ims/evaluador.test.ts
```

43 pruebas. Cada corte por número de motor se comprueba **por los dos lados**:
un `<=` escrito como `<` manda a media flota al tramo equivocado y no lo nota
nadie.

## Como se comporta la interfaz

Tres estados, y en pantalla solo lo que hace falta para el siguiente:

1. **Formulario.** Modelo, año y tipo de año. Nada más.
2. **Aclaración**, si el año no basta. Una línea que dice por qué se pregunta y
   las opciones **reales de ese coche** (`generacionesCandidatas`), sin nada
   preseleccionado. Elegir resuelve: no hay que volver a pulsar el botón.
3. **Resultado.** Veredicto, una línea, los datos que aportan algo en ESE caso,
   y la acción. La explicación larga, el porqué y el aviso legal viven dentro
   de «Ver el detalle técnico».

El resultado se adapta:

- Las filas de datos que dirían «no aplica» no se pintan.
- La caja de afinado solo sale si puede cambiar ESE resultado, y solo con los
  campos que lo cambian: número de motor en una transición, historial en un
  afectado, nada en un Cayenne.
- Los motores del desplegable se filtran por modelo.
- Si el resultado es `no`, no se ofrece el diagnóstico IMS: no se le vende a
  quien no lo necesita.
- Contestar «No lo sé» a una aclaración devuelve un resultado que lo dice, no
  la misma pregunta otra vez.

## Modificar una regla

1. Toca `REGLAS` o `CORTES` en `reglas.ts`. Nunca en el evaluador ni en el
   componente: si una condición de año acaba en un `.astro`, la próxima
   revisión no la encontrará.
2. Añade o reutiliza la clave de `FUENTES`. Una regla sin fuente no entra.
3. Sube `VERSION_REGLAS` y `REVISADO`.
4. Añade la prueba **antes** de cambiar la regla, y compruébala por los dos
   lados si es un corte.
5. Anota en el commit qué fuente justifica el cambio.

Reglas del motor que no se negocian:

- Mezger y 9A1/MA1 se resuelven **antes** que cualquier rango por año.
- Una regla específica gana a una genérica; se recorren en orden.
- Un año de transición nunca sale con confianza alta.
- Los cortes por número de serie solo se aplican si el motor se declara
  original: un motor de sustitución monta el rodamiento que tocaba cuando se
  fabricó ese motor, no el del año del chasis.
- Ante la duda se devuelve la duda. `DATOS_INSUFICIENTES` con una sola pregunta
  es mejor resultado que una certeza inventada.

## Revisar las fuentes

`FUENTES` en `reglas.ts` mapea cada clave a su documento; la lista completa con
URLs está en la sección 19 de la especificación. Revisar al menos una vez al
año, o cuando cambie el servicio que ofrece el taller. Si dos fuentes técnicas
discrepan, se devuelve incertidumbre: nunca la respuesta más comercial.

## Añadir un idioma

1. Copia `textos.es.ts` a `textos.<idioma>.ts` y traduce. **No se traducen**
   `IMS`, `IMSB`, `M96`, `M97`, `Mezger`, `9A1/MA1`, `6204` ni `6305`.
2. En `src/scripts/calculadora-ims.ts`, elige el diccionario por
   `document.documentElement.lang`.
3. En `src/components/CalculadoraIms.astro`, lo mismo para las opciones.
4. Genera la página en ese idioma: los slugs ya están en el manifiesto
   (`src/i18n/routes.ts`, ids `herramientas` y `calculadora-ims`).
5. Quita el filtro `idioma === 'es'` de `src/components/Nav.astro`.
6. Si se quiere dentro del artículo traducido, añade la directiva
   `:::herramienta{id="calculadora-ims"}` a ese Markdown **y** al modelo de
   bloques (`_migracion/contenido/bloques/`), o la borrará la próxima pasada de
   `23_aplicar_bloques.py`.

## Privacidad

El número de motor se procesa en el navegador y no sale de él: ni a la
analítica, ni a la URL del CTA, ni a un log. Los eventos que se envían llevan
familia, generación, década, estado, confianza y versión de reglas. Nunca VIN,
número de motor, matrícula ni texto libre.

## Pendiente de confirmar con Valentin Motors

La sección 18 de la especificación lista seis decisiones comerciales que no
bloquean el motor de reglas pero sí los textos: qué marca de IMS reforzado se
instala hoy, si «20.000 km o 4 años» es inspección o sustitución, qué se ofrece
para el 6305 de MY 2006–2008, qué incluye el diagnóstico IMS, el destino
definitivo del CTA y si se muestra precio. Hasta que se cierren, la calculadora
**no** cita intervalos propios ni recomienda una referencia concreta.
