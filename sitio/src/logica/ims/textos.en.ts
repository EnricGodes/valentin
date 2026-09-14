import type { Estado, Rodamiento } from './tipos.ts';
import type { TextoEstado } from './textos.es.ts';

/** IMS calculator texts, English. Same shape as textos.es.ts. */

export const ESTADOS: Record<Estado, TextoEstado> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: {
    veredicto: 'Yes, this car is affected',
    resumen: 'It carries the single-row 6204 bearing. It can be replaced without opening the engine case.',
    cuerpo: 'This configuration normally carried the small single-row IMS bearing. It is the revision with the highest historical failure rate. It can be replaced preventively without opening the case, although the gearbox and the flywheel or flexplate have to come off.',
  },
  AFECTADO_DOBLE_SUSTITUIBLE: {
    veredicto: 'Yes, this car is affected',
    resumen: 'It carries the double-row bearing. It can be replaced without opening the engine case.',
    cuerpo: 'This configuration normally carried a double-row IMS bearing. It has shown a lower failure rate than the single-row 6204, but age and history still matter.',
    accion: 'Check the paperwork and include the IMS in a specialist inspection; consider replacement according to condition, use and history.',
  },
  TRANSICION_DOBLE_O_SIMPLE: {
    veredicto: 'It depends on the engine number',
    resumen: 'In 2000 and 2001 both bearings were fitted. The engine number settles it.',
    cuerpo: 'Model and year are not enough to tell the double-row from the single-row 6204. Both can be replaced, but their failure rates and the parts differ.',
    accion: 'Enter the engine number if you have it, and confirm it physically before ordering parts or approving work.',
  },
  TRANSICION_SIMPLE_O_GRANDE: {
    veredicto: 'It depends on the engine number',
    resumen: 'In 2005 both bearings were fitted. The engine number settles it.',
    cuerpo: 'Some cars carry the small replaceable bearing and others the large 6305, which normally requires opening the engine to replace.',
    accion: 'Use the engine number where a reliable rule exists, and confirm the history or the physical configuration before any work.',
  },
  AFECTADO_GRANDE_NO_SUSTITUIBLE: {
    veredicto: 'Yes, this car is affected',
    resumen: 'It carries the large 6305 bearing. Replacing it means stripping the engine.',
    cuerpo: 'This configuration keeps a ball-type IMS bearing but uses the larger 6305 revision. Its known failure rate is lower than the small 6204, though not zero. It normally cannot be pulled through the housing without stripping the engine.',
    accion: 'Gather the history and ask for a specialist assessment; if the engine is rebuilt, include the IMS in the scope.',
  },
  NO_ES_EL_IMS_CLASICO_MEZGER: {
    veredicto: 'No, it is a Mezger engine',
    resumen: 'It has a pressure-fed plain bearing, not the sealed bearing that fails.',
    cuerpo: 'This version uses a different architecture, with pressure-lubricated plain bearings on the intermediate shaft. The preventive replacement of the sealed bearing done on M96/M97 Carrera, Boxster and Cayman does not apply.',
  },
  SIN_IMS_9A1: {
    veredicto: 'No, it has no intermediate shaft',
    resumen: 'From model year 2009 this engine drives the timing without an IMS.',
    cuerpo: 'From model year 2009, the 997.2 and 987.2 introduced a new architecture that drives the timing without an intermediate shaft. The failure this calculator assesses does not apply.',
  },
  NO_APLICA_OTRO_MODELO: {
    veredicto: 'No',
    resumen: 'This model does not belong to the M96/M97 family with the sealed bearing.',
    cuerpo: 'This model is not one of the 911 Carrera, Boxster or Cayman with the sealed bearing studied here. The answer is not a general reliability review.',
  },
  DATOS_INSUFICIENTES: {
    veredicto: 'Unknown',
    resumen: 'Without that detail we cannot say which one it carries. The engine number or an inspection of the flange settles it.',
    cuerpo: 'In this year different engines or generations coexisted. We would rather say so than give you false certainty.',
  },
};

export const RODAMIENTOS: Record<Rodamiento, string> = {
  doble_hilera_5204: 'Double row, 5204 family',
  una_hilera_6204: 'Small single row, 6204 family',
  una_hilera_grande_6305: 'Large single row, 6305',
  mezger_cojinete_liso: 'Mezger, pressure-fed plain bearing',
  sin_ims: 'No intermediate shaft',
  no_aplica: 'Not applicable',
  desconocido: 'Undetermined',
};

export const SUSTITUIBILIDAD: Record<string, string> = {
  sin_abrir_el_bloque: 'Without opening the case',
  desmontando_el_motor: 'Requires stripping the engine',
  no_aplica: 'Not applicable',
  desconocida: 'Undetermined',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'The year is not valid.',
  ano_solapado: 'In that year two generations with different engines coexisted.',
  ano_de_matriculacion_en_frontera: 'It is a registration year next to a generation change, and that cannot be decided from it.',
  falta_version_mezger: 'Turbo, GT2 and GT3 use the Mezger engine and are outside this failure, so the version is needed.',
  combinacion_no_prevista: 'That combination of model, generation and year is not covered by the rules.',
  fuera_de_la_familia_m96_m97: 'The model does not belong to the M96/M97 family studied.',
  ano_no_es_modelo: 'The year used is not the model year, so the result loses precision.',
  motor_sustituido: 'The engine is not the factory one: it carries the bearing that was fitted when that engine was built, not the one for the chassis year.',
  corte_por_numero_de_motor: 'The indicative engine-number cut-off has been applied.',
  serie_remanufacturado: 'The number carries a remanufactured-engine mark, so the cut-off does not apply.',
  serie_ilegible: 'The engine number is not in a format that can be compared.',
  sin_corte_para_ese_motor: 'There is no published cut-off for that engine type.',
};

export const ACCIONES: Record<string, string> = {
  evaluacion_previa: 'Ask for a prior engine assessment before deciding on any work.',
  revisar_documentacion: 'Gather invoices, kit reference, date and mileage: it is the first step and requires no dismantling.',
  numero_motor: 'Add the engine number if you have it to hand.',
  identificacion_fisica: 'When the paperwork is not enough, have the flange physically inspected.',
  valoracion_especifica: 'This configuration needs a specific assessment by the workshop.',
  confirmar_fisicamente: 'The cut-off is indicative: confirm it before ordering parts.',
  identificar_motor_actual: 'Identify the engine the car carries now.',
  verificar_factura_y_referencia: 'Check invoice, reference, date and mileage of the work.',
  completar_dato: 'Complete the detail we ask for and we will recalculate.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generation', porque: 'That year two generations with different engines coexisted.' },
  variante: { etiqueta: 'Version', porque: 'Turbo, GT2 and GT3 carry the Mezger engine and are outside this failure.' },
  base_ano: { etiqueta: 'That year is', porque: 'The registration year is not enough here.' },
  motor: { etiqueta: 'Engine', porque: 'The engine is needed to refine the answer.' },
};

export const RETROFIT = {
  RETROFIT_DOCUMENTADO: {
    titular: 'Affected from the factory; work is on record',
    cuerpo: 'The car belongs to an affected family, but you state that the IMS was worked on. Its current situation depends on the system installed, how it was fitted and its service interval. Without the specific reference we cannot say the problem is solved or calculate when it is due.',
  },
  RETROFIT_SIN_DOCUMENTAR: {
    titular: 'Affected from the factory; the work is not documented',
    cuerpo: 'Without an invoice or reference there is no way to know what was installed or what maintenance it needs. Treat it as pending verification.',
  },
};

export const AVISO = 'Indicative result based on the factory configuration. The calculator does not diagnose the mechanical condition of the car and does not replace a specialist inspection.';

export const AFINAR = {
  transicion: {
    titulo: 'Settle it with the engine number',
    ayuda: 'It is the only thing that tells one bearing from the other without dismantling anything.',
  },
};

export const UI = {
  modelo: 'Model',
  ano: 'Year',
  anoAyuda: 'Use the model year if you know it.',
  baseAno: 'That year is',
  calcular: 'Check my Porsche',
  continuar: 'Continue',
  porqueEsto: 'Why this result',
  generacion: 'Generation',
  variante: 'Version',
  codigoMotor: 'Engine type',
  codigoAyuda: 'Each engine has its own serial cut-off: the type says which one applies.',
  ladoDelCorte: 'Engine number',
  ladoAyuda: 'Compare it with the number stamped on the engine.',
  ladoNoSe: 'I don’t know',
  ladoInferior: (hasta: number) => `${hasta} or earlier`,
  ladoSuperior: (hasta: number) => `${hasta + 1} or later`,
  deFabrica: 'From the factory',
  configuracion: 'Configuration',
  sustitucion: 'Replacement',
  porQue: 'Why',
  siguientePaso: 'Next step',
  situacionActual: 'Declared situation',
  ctaTitulo: 'Want to confirm it on your car?',
  ctaTexto: 'We check the history and configuration of your engine before recommending any work.',
  ctaBoton: 'Request an IMS diagnosis',
  ctaArticulo: 'Understand how the IMS works',
  errorAno: 'Enter a year between 1948 and ' + (new Date().getFullYear() + 1) + '.',
  errorModelo: 'Choose a model.',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 or earlier', '996': '996', '997_1': '997.1', '997_2': '997.2', post_997: '991 or later',
  '986': '986', '987_1': '987.1', '987_2': '987.2 or later', post_987: 'Later', desconocida: 'I don’t know',
};

export const OPCIONES = {
  familia: [
    { valor: '911', etiqueta: '911' }, { valor: 'boxster', etiqueta: 'Boxster' }, { valor: 'cayman', etiqueta: 'Cayman' },
    { valor: 'cayenne', etiqueta: 'Cayenne' }, { valor: 'panamera', etiqueta: 'Panamera' }, { valor: 'macan', etiqueta: 'Macan' },
    { valor: 'taycan', etiqueta: 'Taycan' }, { valor: 'otro', etiqueta: 'Another Porsche' },
  ],
  baseAno: [
    { valor: 'modelo', etiqueta: 'Model year' }, { valor: 'matriculacion', etiqueta: 'Registration year' }, { valor: 'desconocido', etiqueta: 'I don’t know' },
  ],
  generacion: {
    911: [
      { valor: 'pre_996', etiqueta: '993 or earlier' }, { valor: '996', etiqueta: '996' }, { valor: '997_1', etiqueta: '997.1' },
      { valor: '997_2', etiqueta: '997.2' }, { valor: 'post_997', etiqueta: '991 or later' }, { valor: 'desconocida', etiqueta: 'I don’t know' },
    ],
    boxster: [
      { valor: '986', etiqueta: '986' }, { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 or later' }, { valor: 'desconocida', etiqueta: 'I don’t know' },
    ],
    cayman: [
      { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 or later' }, { valor: 'desconocida', etiqueta: 'I don’t know' },
    ],
  } as Record<string, { valor: string; etiqueta: string }[]>,
  variante: [
    { valor: 'carrera_atmosferico', etiqueta: 'Carrera / Carrera 4 / Targa' },
    { valor: 'carrera_s_atmosferico', etiqueta: 'Carrera S / Carrera 4S / Targa 4S' },
    { valor: 'turbo', etiqueta: 'Turbo / Turbo S' }, { valor: 'gt2', etiqueta: 'GT2' },
    { valor: 'gt3', etiqueta: 'GT3 / GT3 RS' }, { valor: 'desconocida', etiqueta: 'I don’t know' },
  ],
};

export const PAGINA = {
  titulo: 'Porsche IMS calculator: check model and year · Valentin Motors',
  descripcion: 'Select your model and year to find out which type of IMS it may carry, how affected it is and which checks it needs.',
  eyebrow: 'Tool',
  h1: 'Is your Porsche affected by the IMS?',
};
