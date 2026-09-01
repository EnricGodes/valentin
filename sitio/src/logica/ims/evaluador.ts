import type {
  Evaluacion, Generacion, Rodamiento, Vehiculo, Variante,
} from './tipos.ts';
import {
  ANOS_AMBIGUOS_POR_MATRICULACION, CORTES, REGLAS, VARIANTES_MEZGER,
  VERSION_REGLAS, generacionPorAno,
} from './reglas.ts';

/**
 * Evaluador de la calculadora IMS.
 *
 * Funcion pura y determinista: misma entrada, misma salida, sin red y sin DOM.
 * Toda la logica tecnica vive aqui; los componentes solo pintan.
 *
 * La regla que gobierna el resto: ante la duda se devuelve la duda. Un ano de
 * transicion presentado como certeza lleva a pedir la pieza equivocada o a
 * abrir un motor sano, y las dos cosas cuestan mucho mas que una pregunta mas.
 */

const ANO_MIN = 1948;
const ANO_MAX = new Date().getFullYear() + 1;

/** Familias que ni siquiera entran en la familia M96/M97 estudiada. */
const FUERA = new Set(['cayenne', 'panamera', 'macan', 'taycan', 'otro']);

const INCIDENCIA: Record<Rodamiento, Evaluacion['incidenciaRelativa']> = {
  doble_hilera_5204: 'menor',
  una_hilera_6204: 'mayor',
  una_hilera_grande_6305: 'menor',
  mezger_cojinete_liso: 'no_es_este_fallo',
  sin_ims: 'no_es_este_fallo',
  no_aplica: 'no_es_este_fallo',
  desconocido: 'desconocida',
};

const SUSTITUIBILIDAD: Record<Rodamiento, Evaluacion['sustituibilidad']> = {
  doble_hilera_5204: 'sin_abrir_el_bloque',
  una_hilera_6204: 'sin_abrir_el_bloque',
  una_hilera_grande_6305: 'desmontando_el_motor',
  mezger_cojinete_liso: 'no_aplica',
  sin_ims: 'no_aplica',
  no_aplica: 'no_aplica',
  desconocido: 'desconocida',
};

const RESPUESTA: Record<Evaluacion['estado'], Evaluacion['respuesta']> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: 'si',
  AFECTADO_DOBLE_SUSTITUIBLE: 'si_menor_incidencia',
  AFECTADO_GRANDE_NO_SUSTITUIBLE: 'si_menor_incidencia',
  TRANSICION_DOBLE_O_SIMPLE: 'posible',
  TRANSICION_SIMPLE_O_GRANDE: 'posible',
  NO_ES_EL_IMS_CLASICO_MEZGER: 'no',
  SIN_IMS_9A1: 'no',
  NO_APLICA_OTRO_MODELO: 'no',
  DATOS_INSUFICIENTES: 'desconocida',
};

const ACCIONES: Partial<Record<Evaluacion['estado'], string[]>> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: ['evaluacion_previa', 'revisar_documentacion'],
  AFECTADO_DOBLE_SUSTITUIBLE: ['revisar_documentacion', 'evaluacion_previa'],
  AFECTADO_GRANDE_NO_SUSTITUIBLE: ['no_abrir_motor_sano', 'valoracion_especifica'],
  TRANSICION_DOBLE_O_SIMPLE: ['numero_motor', 'identificacion_fisica'],
  TRANSICION_SIMPLE_O_GRANDE: ['numero_motor', 'identificacion_fisica'],
  DATOS_INSUFICIENTES: ['completar_dato'],
};

/** Normaliza el numero de serie: mayusculas y sin separadores. */
export function normalizaSerie(bruto: string): string {
  return bruto.toUpperCase().replace(/[\s.\-/]/g, '');
}

function insuficiente(
  pregunta: Evaluacion['siguientePregunta'], motivo: string,
): Evaluacion {
  return {
    estado: 'DATOS_INSUFICIENTES',
    respuesta: 'desconocida',
    rodamientoDeFabrica: 'desconocido',
    incidenciaRelativa: 'desconocida',
    sustituibilidad: 'desconocida',
    confianza: 'baja',
    motivos: [motivo],
    siguientePregunta: pregunta,
    acciones: ACCIONES.DATOS_INSUFICIENTES!,
    fuentes: [],
    versionReglas: VERSION_REGLAS,
  };
}

/** La generacion declarada manda; si no la hay, se deduce del ano. */
function resuelveGeneracion(v: Vehiculo): Generacion | null {
  if (v.generacion && v.generacion !== 'desconocida') return v.generacion;

  // Con ano de matriculacion, los bordes de generacion no son fiables.
  const ambiguos = ANOS_AMBIGUOS_POR_MATRICULACION[v.familia] ?? [];
  if (v.baseAno !== 'modelo' && ambiguos.includes(v.ano)) return null;

  return generacionPorAno(v.familia, v.ano);
}

/** El 911 996/997.1 exige saber la version: Turbo, GT2 y GT3 son Mezger. */
function necesitaVariante(familia: string, generacion: Generacion, variante?: Variante) {
  if (familia !== '911') return false;
  if (generacion !== '996' && generacion !== '997_1' && generacion !== '997_2') return false;
  return !variante || variante === 'desconocida';
}

function aplicaCorte(v: Vehiculo, base: Evaluacion): Evaluacion {
  const serie = normalizaSerie(v.serieMotor ?? '');
  if (!serie) return base;

  // Motor remanufacturado: el numero ya no identifica el rodamiento de origen.
  if (/X|AT/.test(serie)) {
    return { ...base, motivos: [...base.motivos, 'serie_remanufacturado'] };
  }
  if (!/^\d{6,10}$/.test(serie)) {
    return { ...base, motivos: [...base.motivos, 'serie_ilegible'] };
  }

  const codigo = (v.codigoMotor ?? '').toUpperCase().replace(/\s/g, '');
  const corte = CORTES.find(
    (c) => c.codigoMotor === codigo && c.familias.includes(v.familia),
  );
  if (!corte) return { ...base, motivos: [...base.motivos, 'sin_corte_para_ese_motor'] };

  const n = Number(serie);
  const inferior = n <= corte.hasta;
  const rodamiento = inferior ? corte.rodamientoInferior : corte.rodamientoSuperior;

  return {
    ...base,
    estado: inferior ? corte.estadoInferior : corte.estadoSuperior,
    respuesta: RESPUESTA[inferior ? corte.estadoInferior : corte.estadoSuperior],
    rodamientoDeFabrica: rodamiento,
    incidenciaRelativa: INCIDENCIA[rodamiento],
    sustituibilidad: SUSTITUIBILIDAD[rodamiento],
    // Media, nunca alta: el corte es orientativo y lo que manda es el motor.
    confianza: 'media',
    motivos: [...base.motivos, 'corte_por_numero_de_motor'],
    acciones: [...(ACCIONES[inferior ? corte.estadoInferior : corte.estadoSuperior] ?? []),
               'confirmar_fisicamente'],
    fuentes: [...new Set([...base.fuentes, ...corte.fuentes])],
  };
}

export function evaluarIms(entrada: Vehiculo): Evaluacion {
  const v: Vehiculo = { ...entrada };

  // ── 1. Validacion ────────────────────────────────────────────────────────
  if (!Number.isInteger(v.ano) || v.ano < ANO_MIN || v.ano > ANO_MAX) {
    return insuficiente(undefined, 'ano_fuera_de_rango');
  }

  // ── 2. Familias fuera del alcance ────────────────────────────────────────
  if (FUERA.has(v.familia)) {
    return {
      estado: 'NO_APLICA_OTRO_MODELO',
      respuesta: 'no',
      rodamientoDeFabrica: 'no_aplica',
      incidenciaRelativa: 'no_es_este_fallo',
      sustituibilidad: 'no_aplica',
      confianza: 'alta',
      motivos: ['fuera_de_la_familia_m96_m97'],
      acciones: [],
      fuentes: ['ln-ims-101'],
      versionReglas: VERSION_REGLAS,
    };
  }

  // ── 3. Generacion ────────────────────────────────────────────────────────
  const generacion = resuelveGeneracion(v);
  if (!generacion) {
    return insuficiente('generacion',
      v.baseAno === 'modelo' ? 'ano_solapado' : 'ano_de_matriculacion_en_frontera');
  }

  // ── 4. Version, antes que cualquier rango por ano ────────────────────────
  if (necesitaVariante(v.familia, generacion, v.variante)) {
    return insuficiente('variante', 'falta_version_mezger');
  }

  // ── 5. Clasificacion de fabrica ──────────────────────────────────────────
  const regla = REGLAS.find((r) =>
    r.familias.includes(v.familia)
    && r.generaciones.includes(generacion)
    && (!r.variantes || (v.variante ? r.variantes.includes(v.variante) : false))
    && (r.desde === undefined || v.ano >= r.desde)
    && (r.hasta === undefined || v.ano <= r.hasta));

  if (!regla) return insuficiente('generacion', 'combinacion_no_prevista');

  let salida: Evaluacion = {
    estado: regla.estado,
    respuesta: RESPUESTA[regla.estado],
    rodamientoDeFabrica: regla.rodamiento,
    incidenciaRelativa: INCIDENCIA[regla.rodamiento],
    sustituibilidad: SUSTITUIBILIDAD[regla.rodamiento],
    confianza: 'alta',
    motivos: [`regla_${regla.id}`],
    acciones: ACCIONES[regla.estado] ?? [],
    fuentes: regla.fuentes,
    versionReglas: VERSION_REGLAS,
  };

  // ── 6. Afinado por numero de motor, solo en transiciones ─────────────────
  const enTransicion = salida.estado === 'TRANSICION_DOBLE_O_SIMPLE'
    || salida.estado === 'TRANSICION_SIMPLE_O_GRANDE';
  const motorPropio = (v.originalidadMotor ?? 'desconocida') === 'original';

  if (enTransicion && motorPropio) salida = aplicaCorte(v, salida);
  if (enTransicion && salida.confianza === 'alta') salida.confianza = 'baja';

  // ── 7. Confianza por base del ano y por historial del motor ──────────────
  if (v.baseAno !== 'modelo' && salida.confianza === 'alta') {
    salida = { ...salida, confianza: 'media', motivos: [...salida.motivos, 'ano_no_es_modelo'] };
  }
  if (v.originalidadMotor === 'sustituido') {
    salida = {
      ...salida,
      confianza: 'baja',
      motivos: [...salida.motivos, 'motor_sustituido'],
      acciones: [...salida.acciones, 'identificar_motor_actual'],
    };
  } else if (v.originalidadMotor === 'desconocida' && salida.confianza === 'alta'
             && salida.rodamientoDeFabrica !== 'sin_ims'
             && salida.rodamientoDeFabrica !== 'no_aplica') {
    salida = { ...salida, confianza: 'media', motivos: [...salida.motivos, 'originalidad_desconocida'] };
  }

  // ── 8. La intervencion modifica el estado ACTUAL, no el de fabrica ───────
  if (v.intervencionIms === 'documentada' || v.intervencionIms === 'sin_documentar') {
    salida = {
      ...salida,
      estadoActual: v.intervencionIms === 'documentada'
        ? 'RETROFIT_DOCUMENTADO' : 'RETROFIT_SIN_DOCUMENTAR',
      acciones: [...salida.acciones, 'verificar_factura_y_referencia'],
    };
  }

  return salida;
}

/** Las variantes Mezger, expuestas para la interfaz. */
export const esMezger = (variante?: Variante) =>
  !!variante && VARIANTES_MEZGER.includes(variante);
