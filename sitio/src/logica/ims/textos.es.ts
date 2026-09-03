import type { Estado, Rodamiento } from './tipos.ts';

/**
 * Textos de la calculadora IMS, en castellano.
 *
 * Viven fuera del componente y fuera del evaluador: cambiar una frase no debe
 * obligar a tocar una regla tecnica, y anadir un idioma debe ser anadir un
 * fichero hermano (textos.en.ts) sin mover nada mas.
 *
 * No se traducen nunca: IMS, IMSB, M96, M97, Mezger, 9A1/MA1, 6204, 6305.
 */

export interface TextoEstado {
  /** El titular. Una linea, lo primero y lo mas grande que se lee. */
  veredicto: string;
  /** Una linea. Lo que basta para entender la respuesta sin abrir nada. */
  resumen: string;
  etiqueta: string;
  /** Explicacion completa. Vive dentro del detalle, no en la primera lectura. */
  cuerpo: string;
  accion?: string;
}

export const ESTADOS: Record<Estado, TextoEstado> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: {
    veredicto: 'Sí, esta unidad está afectada',
    resumen: 'Monta el rodamiento 6204 de una hilera. Se sustituye sin abrir el bloque.',
    etiqueta: 'IMS 6204 · una hilera · sustituible',
    cuerpo: 'Con motor original, esta configuración montaba normalmente el rodamiento IMS pequeño de una hilera. Es la revisión con mayor incidencia histórica. Puede sustituirse preventivamente sin abrir el bloque, aunque hay que retirar la transmisión y el volante motor o el flexplate.',
  },
  AFECTADO_DOBLE_SUSTITUIBLE: {
    veredicto: 'Sí, esta unidad está afectada',
    resumen: 'Monta el rodamiento de doble hilera. Se sustituye sin abrir el bloque.',
    etiqueta: 'IMS de doble hilera · sustituible',
    cuerpo: 'Con motor original, esta configuración montaba normalmente un rodamiento IMS de doble hilera. Ha mostrado menor incidencia que el 6204 simple, pero la antigüedad y el historial siguen siendo relevantes.',
    accion: 'Verifica la documentación e incluye el IMS en una inspección especializada; valora la sustitución según estado, uso e historial.',
  },
  TRANSICION_DOBLE_O_SIMPLE: {
    veredicto: 'Depende del número de motor',
    resumen: 'En 2000 y 2001 se montaron los dos rodamientos. El número de motor lo resuelve.',
    etiqueta: 'Año de transición 2000–2001',
    cuerpo: 'El modelo y el año no bastan para distinguir entre doble hilera y 6204 simple. Los dos son sustituibles, pero su incidencia relativa y el recambio son distintos.',
    accion: 'Introduce el número de motor si lo tienes, y confírmalo físicamente antes de pedir piezas o aprobar una intervención.',
  },
  TRANSICION_SIMPLE_O_GRANDE: {
    veredicto: 'Depende del número de motor',
    resumen: 'En 2005 se montaron los dos rodamientos. El número de motor lo resuelve.',
    etiqueta: 'MY 2005 · 6204 o 6305',
    cuerpo: 'Algunas unidades montan el rodamiento pequeño sustituible y otras el 6305 grande, que normalmente exige abrir el motor para sustituirse.',
    accion: 'Usa el número de motor cuando exista una regla fiable y confirma el historial o la configuración física antes de intervenir.',
  },
  AFECTADO_GRANDE_NO_SUSTITUIBLE: {
    veredicto: 'Sí, esta unidad está afectada',
    resumen: 'Monta el rodamiento 6305 grande. Sustituirlo exige desmontar el motor.',
    etiqueta: 'IMS 6305 · grande · intervención distinta',
    cuerpo: 'Esta configuración conserva un rodamiento IMS de bolas, pero usa la revisión 6305 de mayor tamaño. Su incidencia conocida es menor que la del 6204 pequeño, aunque no es cero. Normalmente no puede extraerse por el alojamiento sin desmontar el motor.',
    accion: 'No abras un motor sano por lo que diga esta calculadora. Reúne el historial y pide una valoración especializada; si el motor se reconstruye, incluye el IMS en el alcance.',
  },
  NO_ES_EL_IMS_CLASICO_MEZGER: {
    veredicto: 'No, es un motor Mezger',
    resumen: 'Lleva cojinete liso lubricado a presión, no el rodamiento sellado que falla.',
    etiqueta: 'Motor Mezger',
    cuerpo: 'Esta versión usa una arquitectura diferente, con cojinetes lisos lubricados a presión en el eje intermedio. No le corresponde la sustitución preventiva del rodamiento sellado que se hace en Carrera, Boxster y Cayman M96/M97.',
    accion: 'Esto no significa que el motor no pueda tener otras averías.',
  },
  SIN_IMS_9A1: {
    veredicto: 'No, no lleva eje intermedio',
    resumen: 'Desde el año modelo 2009 este motor acciona la distribución sin IMS.',
    etiqueta: '9A1/MA1 o arquitectura posterior',
    cuerpo: 'Desde el año modelo 2009, los 997.2 y 987.2 incorporaron una nueva arquitectura que acciona la distribución sin eje intermedio. El fallo que evalúa esta calculadora no aplica.',
  },
  NO_APLICA_OTRO_MODELO: {
    veredicto: 'No',
    resumen: 'Este modelo no pertenece a la familia M96/M97 con el rodamiento sellado.',
    etiqueta: 'Fuera de la familia M96/M97 afectada',
    cuerpo: 'Este modelo no forma parte de los 911 Carrera, Boxster o Cayman con el rodamiento sellado que se estudia aquí. La respuesta no es una revisión general de fiabilidad.',
  },
  DATOS_INSUFICIENTES: {
    veredicto: 'No se sabe',
    resumen: 'Sin ese dato no se puede decir cuál monta. Lo resuelve el número de motor o una inspección de la brida.',
    etiqueta: 'Falta identificar generación, versión o motor',
    cuerpo: 'En este año convivieron motores o generaciones diferentes, o el motor fue sustituido. Preferimos decirlo a darte una certeza falsa.',
  },
};

export const RODAMIENTOS: Record<Rodamiento, string> = {
  doble_hilera_5204: 'Doble hilera, familia 5204',
  una_hilera_6204: 'Una hilera pequeña, familia 6204',
  una_hilera_grande_6305: 'Una hilera grande, 6305',
  mezger_cojinete_liso: 'Mezger, cojinete liso a presión',
  sin_ims: 'Sin eje intermedio',
  no_aplica: 'No aplica',
  desconocido: 'Sin determinar',
};

export const SUSTITUIBILIDAD: Record<string, string> = {
  sin_abrir_el_bloque: 'Sin abrir el bloque',
  desmontando_el_motor: 'Exige desmontar el motor',
  no_aplica: 'No aplica',
  desconocida: 'Sin determinar',
};

/** Por que la calculadora ha llegado a este resultado. */
export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'El año no es válido.',
  ano_solapado: 'En ese año convivieron dos generaciones con motores distintos.',
  ano_de_matriculacion_en_frontera: 'Es un año de matriculación junto a un cambio de generación, y por ahí no se puede decidir.',
  falta_version_mezger: 'Turbo, GT2 y GT3 usan motor Mezger y quedan fuera de este fallo, así que hace falta la versión.',
  combinacion_no_prevista: 'Esa combinación de modelo, generación y año no está prevista en las reglas.',
  fuera_de_la_familia_m96_m97: 'El modelo no pertenece a la familia M96/M97 estudiada.',
  ano_no_es_modelo: 'El año usado no es el año modelo, así que el resultado pierde precisión.',
  motor_sustituido: 'El motor no es el de fábrica: monta el rodamiento que tocaba cuando se fabricó ese motor, no el del año del chasis.',
  corte_por_numero_de_motor: 'Se ha aplicado el corte orientativo por número de motor.',
  serie_remanufacturado: 'El número lleva marca de motor remanufacturado, así que el corte no sirve.',
  serie_ilegible: 'El número de motor no tiene un formato que se pueda comparar.',
  sin_corte_para_ese_motor: 'No hay un corte publicado para ese tipo de motor.',
};

export const ACCIONES: Record<string, string> = {
  evaluacion_previa: 'Pide una evaluación previa del motor antes de decidir cualquier intervención.',
  revisar_documentacion: 'Reúne facturas, referencia del kit, fecha y kilometraje: es el primer paso y no exige desmontar nada.',
  numero_motor: 'Añade el número de motor si lo tienes a mano.',
  identificacion_fisica: 'Cuando la documentación no basta, manda la inspección física de la brida.',
  no_abrir_motor_sano: 'No abras un motor sano solo por este resultado.',
  valoracion_especifica: 'Esta configuración necesita una valoración específica del taller.',
  confirmar_fisicamente: 'El corte es orientativo: confírmalo antes de pedir piezas.',
  identificar_motor_actual: 'Identifica el motor que monta ahora el coche.',
  verificar_factura_y_referencia: 'Verifica factura, referencia, fecha y kilometraje de la intervención.',
  completar_dato: 'Completa el dato que te pedimos y volvemos a calcular.',
};

/* La aclaracion NO es un resultado fallido: es un paso normal. Va junto al
   campo que hay que rellenar, en una linea, y no en una tarjeta de error. */
export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: {
    etiqueta: 'Generación',
    porque: 'Ese año convivieron dos generaciones con motores distintos.',
  },
  variante: {
    etiqueta: 'Versión',
    porque: 'Turbo, GT2 y GT3 llevan motor Mezger y quedan fuera de este fallo.',
  },
  base_ano: { etiqueta: 'Ese año es', porque: 'El año de matriculación no basta aquí.' },
  motor: { etiqueta: 'Motor', porque: 'Hace falta el motor para afinar.' },
};

export const RETROFIT = {
  RETROFIT_DOCUMENTADO: {
    titular: 'De origen afectado; consta una intervención',
    cuerpo: 'El coche pertenece a una familia afectada, pero declaras que el IMS fue intervenido. La situación actual depende del sistema instalado, de cómo se montó y de su intervalo de servicio. Sin la referencia concreta no podemos decir que el problema esté resuelto ni calcular un vencimiento.',
  },
  RETROFIT_SIN_DOCUMENTAR: {
    titular: 'De origen afectado; la intervención no está documentada',
    cuerpo: 'Sin factura ni referencia no se puede saber qué se instaló ni qué mantenimiento le corresponde. Trátalo como pendiente de verificar.',
  },
};

/** Aviso fijo, siempre visible junto al resultado. */
export const AVISO = 'Resultado orientativo basado en la configuración de fábrica. El año de matriculación, un motor sustituido o una intervención previa pueden cambiarlo. La calculadora no diagnostica el estado mecánico del coche ni sustituye una inspección especializada.';

/* Titulo de la caja de afinado. Solo la hay donde el dato cambia el resultado:
   en un año de transicion. Con el veredicto cerrado no se pregunta nada mas. */
export const AFINAR = {
  transicion: {
    titulo: 'Resuélvelo con el número de motor',
    ayuda: 'Es lo único que distingue un rodamiento del otro sin desmontar nada.',
  },
};

export const UI = {
  modelo: 'Modelo',
  ano: 'Año',
  anoAyuda: 'Usa el año modelo si lo sabes.',
  baseAno: 'Ese año es',
  calcular: 'Comprobar mi Porsche',
  continuar: 'Continuar',
  porqueEsto: 'Por qué sale esto',
  generacion: 'Generación',
  variante: 'Versión',
  motorOriginal: '¿Conserva el motor original?',
  codigoMotor: 'Tipo de motor',
  serieMotor: 'Número de motor',
  serieAyuda: 'Se queda en tu navegador. No se guarda ni se envía.',
  deFabrica: 'De fábrica',
  configuracion: 'Configuración',
  sustitucion: 'Sustitución',
  porQue: 'Por qué',
  siguientePaso: 'Siguiente paso',
  situacionActual: 'Situación declarada',
  ctaTitulo: '¿Quieres confirmarlo en tu unidad?',
  ctaTexto: 'Revisamos el historial y la configuración de tu motor antes de recomendar cualquier intervención.',
  ctaBoton: 'Solicitar diagnóstico IMS',
  errorAno: 'Introduce un año entre 1948 y ' + (new Date().getFullYear() + 1) + '.',
  errorModelo: 'Elige un modelo.',
};

/** Etiqueta corta de cada generacion, para los botones de la aclaracion. */
export const GENERACION: Record<string, string> = {
  pre_996: '993 o anterior',
  '996': '996',
  '997_1': '997.1',
  '997_2': '997.2',
  post_997: '991 o posterior',
  '986': '986',
  '987_1': '987.1',
  '987_2': '987.2 o posterior',
  post_987: 'Posterior',
  desconocida: 'No lo sé',
};

export const OPCIONES = {
  familia: [
    { valor: '911', etiqueta: '911' },
    { valor: 'boxster', etiqueta: 'Boxster' },
    { valor: 'cayman', etiqueta: 'Cayman' },
    { valor: 'cayenne', etiqueta: 'Cayenne' },
    { valor: 'panamera', etiqueta: 'Panamera' },
    { valor: 'macan', etiqueta: 'Macan' },
    { valor: 'taycan', etiqueta: 'Taycan' },
    { valor: 'otro', etiqueta: 'Otro Porsche' },
  ],
  baseAno: [
    { valor: 'modelo', etiqueta: 'Año modelo' },
    { valor: 'matriculacion', etiqueta: 'Año de matriculación' },
    { valor: 'desconocido', etiqueta: 'No lo sé' },
  ],
  generacion: {
    911: [
      { valor: 'pre_996', etiqueta: '993 o anterior' },
      { valor: '996', etiqueta: '996' },
      { valor: '997_1', etiqueta: '997.1' },
      { valor: '997_2', etiqueta: '997.2' },
      { valor: 'post_997', etiqueta: '991 o posterior' },
      { valor: 'desconocida', etiqueta: 'No lo sé' },
    ],
    boxster: [
      { valor: '986', etiqueta: '986' },
      { valor: '987_1', etiqueta: '987.1' },
      { valor: '987_2', etiqueta: '987.2 o posterior' },
      { valor: 'desconocida', etiqueta: 'No lo sé' },
    ],
    cayman: [
      { valor: '987_1', etiqueta: '987.1' },
      { valor: '987_2', etiqueta: '987.2 o posterior' },
      { valor: 'desconocida', etiqueta: 'No lo sé' },
    ],
  } as Record<string, { valor: string; etiqueta: string }[]>,
  variante: [
    { valor: 'carrera_atmosferico', etiqueta: 'Carrera / Carrera 4 / Targa' },
    { valor: 'carrera_s_atmosferico', etiqueta: 'Carrera S / Carrera 4S / Targa 4S' },
    { valor: 'turbo', etiqueta: 'Turbo / Turbo S' },
    { valor: 'gt2', etiqueta: 'GT2' },
    { valor: 'gt3', etiqueta: 'GT3 / GT3 RS' },
    { valor: 'desconocida', etiqueta: 'No lo sé' },
  ],
  /* "No lo sé" va primero a proposito: es el valor por defecto de un campo
     que nadie ha contestado todavia. Con "Sí, el original" delante, la
     calculadora daba confianza ALTA por un dato que el usuario no habia
     afirmado, y la confianza alta es justo lo que no se puede regalar. */
  originalidad: [
    { valor: 'desconocida', etiqueta: 'No lo sé' },
    { valor: 'original', etiqueta: 'Sí, el original' },
    { valor: 'sustituido', etiqueta: 'No, se sustituyó' },
  ],
};
