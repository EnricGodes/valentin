/**
 * Tipos de la calculadora IMS.
 *
 * IMS es el eje intermedio (Intermediate Shaft) e IMSB su rodamiento
 * (Intermediate Shaft Bearing). El fallo que evalua esta herramienta es el del
 * rodamiento de bolas SELLADO de determinados motores M96/M97: no es una
 * valoracion general de cualquier eje intermedio ni de cualquier Porsche.
 *
 * Ninguno de estos identificadores se traduce.
 */

export type Familia =
  | '911' | 'boxster' | 'cayman'
  | 'cayenne' | 'panamera' | 'macan' | 'taycan' | 'otro';

/** El ano modelo (MY) no coincide necesariamente con el de matriculacion. */
export type BaseAno = 'modelo' | 'matriculacion' | 'desconocido';

export type Generacion =
  | 'pre_996' | '996' | '997_1' | '997_2' | 'post_997'
  | '986' | '987_1' | '987_2' | 'post_987'
  | 'desconocida';

export type Variante =
  | 'carrera_atmosferico' | 'carrera_s_atmosferico'
  | 'turbo' | 'gt2' | 'gt3'
  | 'boxster_base' | 'boxster_s'
  | 'cayman_base' | 'cayman_s'
  | 'desconocida';

export type Originalidad = 'original' | 'sustituido' | 'desconocida';

/**
 * De que lado del corte de serie cae la unidad.
 *
 * No existe una lista de numeros de motor: cada tipo tiene UN umbral, y el
 * numero grabado en el bloque solo sirve para saber si queda por debajo o por
 * encima. Quien lo tiene delante puede decir el lado sin teclear ocho cifras.
 */
export type LadoDelCorte = 'inferior' | 'superior';

export type Rodamiento =
  | 'doble_hilera_5204'
  | 'una_hilera_6204'
  | 'una_hilera_grande_6305'
  | 'mezger_cojinete_liso'
  | 'sin_ims'
  | 'no_aplica'
  | 'desconocido';

export type Estado =
  | 'AFECTADO_SIMPLE_SUSTITUIBLE'
  | 'AFECTADO_DOBLE_SUSTITUIBLE'
  | 'TRANSICION_DOBLE_O_SIMPLE'
  | 'TRANSICION_SIMPLE_O_GRANDE'
  | 'AFECTADO_GRANDE_NO_SUSTITUIBLE'
  | 'NO_ES_EL_IMS_CLASICO_MEZGER'
  | 'SIN_IMS_9A1'
  | 'NO_APLICA_OTRO_MODELO'
  | 'DATOS_INSUFICIENTES';

export type Intervencion = 'documentada' | 'sin_documentar' | 'ninguna' | 'desconocida';

export interface Vehiculo {
  familia: Familia;
  ano: number;
  baseAno: BaseAno;
  generacion?: Generacion;
  variante?: Variante;
  /** Tipo de motor, p. ej. "M96.22". Se usa para los cortes de serie. */
  codigoMotor?: string;
  /** Numero de serie del motor. No se guarda ni se envia a ningun sitio. */
  serieMotor?: string;
  /** Alternativa al numero: el lado del corte, elegido en vez de escrito. */
  ladoDelCorte?: LadoDelCorte;
  originalidadMotor?: Originalidad;
  intervencionIms?: Intervencion;
}

export interface Evaluacion {
  estado: Estado;
  /** La respuesta corta, para el titular. */
  respuesta: 'si' | 'si_menor_incidencia' | 'posible' | 'no' | 'desconocida';
  rodamientoDeFabrica: Rodamiento;
  /** Incidencia RELATIVA entre configuraciones. No es una probabilidad. */
  incidenciaRelativa: 'mayor' | 'menor' | 'no_es_este_fallo' | 'desconocida';
  sustituibilidad: 'sin_abrir_el_bloque' | 'desmontando_el_motor' | 'no_aplica' | 'desconocida';
  /** La confianza es del DATO, no del riesgo. Son cosas distintas. */
  confianza: 'alta' | 'media' | 'baja';
  /** Por que se ha llegado aqui; claves de textos.es.ts */
  motivos: string[];
  /** Unico dato que falta para avanzar, si falta alguno. */
  siguientePregunta?: 'generacion' | 'variante' | 'base_ano' | 'motor';
  acciones: string[];
  estadoActual?: 'RETROFIT_DOCUMENTADO' | 'RETROFIT_SIN_DOCUMENTAR';
  fuentes: string[];
  versionReglas: string;
}
