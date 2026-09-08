import type {
  Generacion, Pruebas, Sintomas, Susceptibilidad, Tecnologia, Valoracion, Vehiculo,
} from './tipos.ts';
import {
  ANOS_AMBIGUOS_POR_MATRICULACION, VERSION_REGLAS,
  generacionPorAno, necesitaCilindrada, necesitaCombustible, necesitaVariante,
  reglasQueEncajan,
} from './reglas-vehiculo.ts';
import { consumoPorMilKm, derivaEvidencia, derivaUrgencia } from './reglas-evidencia.ts';

/**
 * Evaluador de bore scoring.
 *
 * Funcion pura y determinista: misma entrada, misma salida, sin red y sin DOM.
 *
 * Lo que NO hace, y es el motivo de que exista tal como esta:
 *
 *   - no responde "tu coche tiene bore scoring" a partir del modelo y el ano:
 *     es un dano adquirido, no una pieza de fabrica;
 *   - no descarta el dano por ausencia de sintomas;
 *   - no calcula un porcentaje ni una barra de 0 a 100: no hay una base
 *     publica que relacione motor, uso y clima con una probabilidad individual,
 *     y las fuentes disponibles son talleres que ven motores ya averiados;
 *   - no convierte el kilometraje, el cambio ni el clima en puntos.
 *
 * Devuelve cuatro ejes que se leen por separado: susceptibilidad de la
 * configuracion, evidencia sobre la unidad, urgencia y calidad de la
 * identificacion.
 */

const ANO_MIN = 1948;
const ANO_MAX = new Date().getFullYear() + 1;

const ACCIONES: Record<Valoracion['urgencia'], string[]> = {
  INFORMATION_ONLY: ['vigilar_evolucion', 'mantenimiento_preventivo'],
  PPI_SCOPE_RECOMMENDED: ['boroscopia_en_precompra', 'pedir_historial'],
  BOOK_SPECIALIST_INSPECTION: ['revision_especializada', 'preparar_datos'],
  PROMPT_INSPECTION: ['boroscopia_y_diagnostico', 'preparar_datos'],
  MINIMIZE_USE_AND_CONTACT: ['reducir_uso', 'boroscopia_y_diagnostico'],
  REPAIR_PLANNING: ['valorar_reparacion', 'enviar_informe'],
  INSUFFICIENT_DATA: ['identificar_motor'],
};

/** Susceptibilidades que no describen un motor, sino un dato que falta. */
const SIN_CLASIFICAR: Susceptibilidad[] = [
  'ENGINE_SPECIFIC_CLASSIFICATION', 'OUTSIDE_VALIDATED_SCOPE',
];

function base(_v: Vehiculo): Valoracion {
  return {
    susceptibilidad: 'ENGINE_SPECIFIC_CLASSIFICATION',
    susceptibilidadDeFabrica: 'ENGINE_SPECIFIC_CLASSIFICATION',
    tecnologia: 'desconocida',
    evidencia: 'NO_EVIDENCE_REPORTED',
    urgencia: 'INSUFFICIENT_DATA',
    confianza: 'baja',
    senales: [],
    motivos: [],
    avisos: [],
    acciones: ACCIONES.INSUFFICIENT_DATA,
    fuentes: [],
    versionReglas: VERSION_REGLAS,
  };
}

function faltaDato(
  v: Vehiculo, pregunta: Valoracion['siguientePregunta'], motivo: string,
): Valoracion {
  return { ...base(v), motivos: [motivo], siguientePregunta: pregunta };
}

/** La generacion declarada manda; si no la hay, se deduce del ano. */
function resuelveGeneracion(v: Vehiculo): Generacion | null | false {
  if (v.generacion && v.generacion !== 'desconocida') return v.generacion;

  // Con ano de matriculacion, los bordes de generacion no son fiables.
  const ambiguos = ANOS_AMBIGUOS_POR_MATRICULACION[v.familia] ?? [];
  if (v.baseAno !== 'modelo' && ambiguos.includes(v.ano)) return null;

  return generacionPorAno(v.familia, v.ano);
}

/**
 * El motor que monta AHORA. Un motor usado o reconstruido puede cambiar por
 * completo la susceptibilidad, y una factura sin alcance no la cambia en nada:
 * "reconstruido" no es sinonimo de "solucionado".
 */
function motorActual(
  v: Vehiculo, deFabrica: Susceptibilidad, tecnologiaFabrica: Tecnologia,
): { susceptibilidad: Susceptibilidad; tecnologia: Tecnologia; motivos: string[]; avisos: string[] } {
  const sinCambio = {
    susceptibilidad: deFabrica, tecnologia: tecnologiaFabrica,
    motivos: [] as string[], avisos: [] as string[],
  };
  if (!v.originalidadMotor || v.originalidadMotor === 'original') return sinCambio;

  if (v.originalidadMotor === 'desconocida') {
    return {
      susceptibilidad: deFabrica, tecnologia: tecnologiaFabrica,
      motivos: ['originalidad_desconocida'], avisos: ['motor_sin_verificar'],
    };
  }

  if (v.originalidadMotor === 'sustituido') {
    // Sin codigo, la susceptibilidad actual no se puede clasificar. La de
    // fabrica se sigue ensenando: es informacion, pero de otro motor.
    if (!v.codigoMotor && !v.tecnologiaReconstruida) {
      return {
        susceptibilidad: 'ENGINE_SPECIFIC_CLASSIFICATION', tecnologia: 'desconocida',
        motivos: ['motor_sustituido_sin_identificar'], avisos: ['motor_sustituido'],
      };
    }
  }

  const tec = v.tecnologiaReconstruida;
  if (!tec || tec === 'desconocida') {
    return {
      susceptibilidad: deFabrica, tecnologia: tecnologiaFabrica,
      motivos: ['reconstruccion_sin_detalle'], avisos: ['no_declarar_solucionado'],
    };
  }

  /* Una reconstruccion con Nikasil o con camisa de hierro saca al motor del
     patron clasico. Documentada o no cambia la confianza, no la mecanica. */
  const menor = tec === 'nikasil' || tec === 'hierro' || tec === 'recubrimiento_proyectado';
  return {
    susceptibilidad: menor ? 'LOWER_BY_BORE_TECHNOLOGY' : deFabrica,
    tecnologia: tec,
    motivos: [menor ? 'reconstruccion_cambia_tecnologia' : 'reconstruccion_misma_tecnologia'],
    avisos: v.reconstruccionDocumentada ? [] : ['no_declarar_solucionado'],
  };
}

function calculaConfianza(entrada: {
  v: Vehiculo; evidencia: Valoracion['evidencia']; motivos: string[];
}): Valoracion['confianza'] {
  const { v, evidencia, motivos } = entrada;

  const bajas = ['motor_sustituido_sin_identificar', 'reconstruccion_sin_detalle',
                 'originalidad_desconocida', 'reglas_en_conflicto'];
  if (motivos.some((m) => bajas.includes(m))) return 'baja';
  if (evidencia === 'LIMITED_OR_INCONCLUSIVE_BORESCOPE'
      || evidencia === 'CONFLICTING_EVIDENCE') return 'baja';
  if (v.baseAno !== 'modelo') return 'baja';

  // Sin version declarada donde la version cuenta, la identificacion es parcial.
  if (!v.variante || v.variante === 'desconocida') return 'media';
  if (v.originalidadMotor === 'reconstruido' && !v.reconstruccionDocumentada) return 'media';
  return 'alta';
}

export function evaluarBoreScoring(
  entrada: Vehiculo, sintomas: Sintomas = {}, pruebas: Pruebas = {},
): Valoracion {
  const v: Vehiculo = { ...entrada };

  // ── 1. Validacion ────────────────────────────────────────────────────────
  if (!Number.isInteger(v.ano) || v.ano < ANO_MIN || v.ano > ANO_MAX) {
    return faltaDato(v, undefined, 'ano_fuera_de_rango');
  }

  // ── 2. Electricos: no tienen cilindros de combustion ─────────────────────
  if (v.familia === 'taycan' || v.combustible === 'electrico') {
    return {
      ...base(v),
      susceptibilidad: 'NOT_APPLICABLE_ELECTRIC',
      susceptibilidadDeFabrica: 'NOT_APPLICABLE_ELECTRIC',
      tecnologia: 'no_aplica_electrico',
      urgencia: 'INFORMATION_ONLY',
      confianza: 'alta',
      motivos: ['electrico_sin_cilindros'],
      acciones: [],
      fuentes: ['S08'],
    };
  }

  // ── 3. Generacion ────────────────────────────────────────────────────────
  const generacion = resuelveGeneracion(v);

  /* Un Cayman de 2004 no existe. No se corrige en silencio: se pide confirmar
     el ano o el modelo, que es lo unico honesto que se puede hacer. */
  if (generacion === false) {
    return faltaDato(v, 'ano_imposible', 'modelo_y_ano_incompatibles');
  }
  if (generacion === null) {
    return faltaDato(v, 'generacion',
      v.baseAno === 'modelo' ? 'ano_solapado' : 'ano_de_matriculacion_en_frontera');
  }

  // ── 4. Combustible y version, en ese orden ───────────────────────────────
  if (necesitaCombustible(v.familia)
      && (!v.combustible || v.combustible === 'desconocido')) {
    return faltaDato(v, 'combustible', 'falta_combustible');
  }
  if (necesitaVariante(v.familia, generacion)
      && (!v.variante || v.variante === 'desconocida')) {
    return faltaDato(v, 'variante', 'falta_version');
  }
  if (necesitaCilindrada({ ...v, generacion })) {
    return faltaDato(v, 'cilindrada', 'falta_cilindrada');
  }

  // ── 5. Susceptibilidad de la configuracion de fabrica ────────────────────
  const candidatas = reglasQueEncajan({ ...v, generacion });
  const motivos: string[] = [];
  let deFabrica: Susceptibilidad = 'ENGINE_SPECIFIC_CLASSIFICATION';
  let tecnologia: Tecnologia = 'desconocida';
  let fuentes: string[] = [];

  if (candidatas.length === 0) {
    motivos.push('sin_regla_para_esa_combinacion');
  } else if (candidatas.length > 1 && candidatas[0].prioridad === candidatas[1].prioridad) {
    /* Dos reglas de la misma prioridad encajan: la matriz es ambigua. En
       desarrollo es un fallo de datos que hay que arreglar; en produccion se
       devuelve incertidumbre en vez de elegir una al azar. */
    motivos.push('reglas_en_conflicto');
    fuentes = candidatas[0].fuentes;
  } else {
    const regla = candidatas[0];
    deFabrica = regla.susceptibilidad;
    tecnologia = regla.tecnologia;
    fuentes = regla.fuentes;
    motivos.push(`regla_${regla.id}`);
  }

  // ── 6. Motor actual, que puede no ser el de fabrica ──────────────────────
  const actual = motorActual(v, deFabrica, tecnologia);
  motivos.push(...actual.motivos);

  // ── 7. Evidencia sobre ESTA unidad ───────────────────────────────────────
  const ev = derivaEvidencia(sintomas, pruebas, actual.tecnologia);
  motivos.push(...ev.motivos);

  // ── 8. Urgencia ──────────────────────────────────────────────────────────
  const faltaIdentificar = SIN_CLASIFICAR.includes(actual.susceptibilidad)
    || motivos.includes('reglas_en_conflicto')
    || motivos.includes('sin_regla_para_esa_combinacion');

  const urgencia = derivaUrgencia({
    susceptibilidad: actual.susceptibilidad,
    evidencia: ev.evidencia,
    situacion: v.situacion,
    sintomas,
    faltaIdentificar,
  });

  // ── 9. Avisos que no dependen del resultado ──────────────────────────────
  const avisos = [...actual.avisos];
  if (v.baseAno !== 'modelo') avisos.push('ano_no_es_modelo');
  if (actual.susceptibilidad === 'LOWER_REPORTED_SUSCEPTIBILITY'
      || actual.susceptibilidad === 'LOWER_BY_BORE_TECHNOLOGY') {
    avisos.push('menor_no_es_inmune');
  }
  if (ev.evidencia === 'NO_EVIDENCE_REPORTED') avisos.push('sin_indicios_no_es_sano');
  if (ev.evidencia === 'NEGATIVE_BORESCOPE_REPORTED') avisos.push('negativa_es_de_esa_fecha');
  if (consumoPorMilKm(sintomas) !== undefined) avisos.push('consumo_para_el_taller');

  return {
    susceptibilidad: actual.susceptibilidad,
    susceptibilidadDeFabrica: deFabrica,
    tecnologia: actual.tecnologia,
    evidencia: ev.evidencia,
    urgencia,
    confianza: calculaConfianza({ v, evidencia: ev.evidencia, motivos }),
    senales: ev.senales,
    motivos,
    avisos: [...new Set(avisos)],
    acciones: ACCIONES[urgencia],
    fuentes,
    versionReglas: VERSION_REGLAS,
  };
}

export { consumoPorMilKm };
