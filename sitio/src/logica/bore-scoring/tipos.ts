/**
 * Tipos del evaluador de bore scoring.
 *
 * Bore scoring (rayado de cilindros) es un dano fisico ADQUIRIDO en cilindro y
 * piston, no una pieza de fabrica. Esa es la diferencia con el IMS y la que
 * gobierna todo lo demas: del modelo y el ano solo sale una susceptibilidad de
 * familia, nunca un diagnostico de la unidad.
 *
 * Por eso el resultado no es un veredicto sino cuatro ejes independientes:
 *
 *   susceptibilidad  frecuencia relativa descrita para esa familia de motor
 *   evidencia        lo que se sabe de ESTA unidad: sintomas, pruebas, boroscopia
 *   urgencia         que conviene hacer y cuando
 *   confianza        calidad de la identificacion, NO probabilidad de fallo
 *
 * Los identificadores de estado se conservan tal como los fija la
 * especificacion (docs/ESPECIFICACION_EVALUADOR_BORE_SCORING_PORSCHE.md), en
 * ingles y en mayusculas: sus tablas de casos y de criterios de aceptacion los
 * nombran uno a uno, y traducirlos obligaria a mantener a mano la equivalencia
 * cada vez que se revise el documento. Los nombres de campo y los textos si van
 * en castellano, como en el resto del proyecto.
 *
 * No se traducen nunca: bore scoring, M96, M97, 9A1/MA1, Mezger, Lokasil,
 * Alusil, Nikasil, APS, PTWA, SUMEbore, VR6, MCT, EA888, EA839, EA825.
 */

export type Familia =
  | '911' | 'boxster' | 'cayman'
  | 'cayenne' | 'panamera' | 'macan' | 'taycan' | 'otro';

/** El ano modelo (MY) no coincide necesariamente con el de matriculacion. */
export type BaseAno = 'modelo' | 'matriculacion' | 'desconocido';

export type Generacion =
  // Deportivos
  | 'pre_996' | '996_1' | '996_2' | '997_1' | '997_2'
  | '991_1' | '991_2' | 'post_991'
  | '986' | '987_1' | '987_2' | '981' | '718'
  // SUV y berlina
  | 'cayenne_955' | 'cayenne_957' | 'cayenne_958_1' | 'cayenne_958_2' | 'cayenne_e3'
  | 'panamera_970' | 'panamera_971'
  | 'macan_95b' | 'macan_95b_2'
  | 'desconocida';

/**
 * Version comercial. Se mantiene deliberadamente corta: solo distingue lo que
 * cambia de arquitectura. Un Carrera 4S y un Targa 4S comparten motor, asi que
 * comparten opcion.
 */
export type Variante =
  | 'carrera' | 'carrera_s' | 'turbo' | 'gt2' | 'gt3'
  | 'base' | 's' | 'gts' | 'spyder_gt4'
  | 'otra' | 'desconocida';

export type Combustible = 'gasolina' | 'diesel' | 'hibrido' | 'electrico' | 'desconocido';

export type Originalidad = 'original' | 'sustituido' | 'reconstruido' | 'desconocida';

/**
 * Tecnologia del cilindro. Es lo que de verdad clasifica: el patron clasico de
 * bore scoring vive en Lokasil y, en menor medida, en Alusil.
 */
export type Tecnologia =
  | 'lokasil'
  | 'alusil'
  | 'nikasil'
  | 'recubrimiento_proyectado'
  | 'hierro'
  | 'no_aplica_electrico'
  | 'desconocida';

/** Susceptibilidad de la CONFIGURACION. Nunca el estado de una unidad. */
export type Susceptibilidad =
  | 'ELEVATED_REPORTED_SUSCEPTIBILITY'
  | 'DOCUMENTED_SUSCEPTIBILITY'
  | 'LOWER_REPORTED_SUSCEPTIBILITY'
  | 'LOWER_BY_BORE_TECHNOLOGY'
  | 'ENGINE_SPECIFIC_CLASSIFICATION'
  | 'OUTSIDE_VALIDATED_SCOPE'
  | 'NOT_APPLICABLE_ELECTRIC';

/** Lo que se sabe de ESTA unidad. `NO_EVIDENCE_REPORTED` no es "motor sano". */
export type Evidencia =
  | 'NO_EVIDENCE_REPORTED'
  | 'ONE_NON_SPECIFIC_SIGNAL'
  | 'MULTIPLE_COMPATIBLE_SIGNALS'
  | 'SUPPORTING_TEST_SUSPICIOUS'
  | 'NEGATIVE_BORESCOPE_REPORTED'
  | 'LIMITED_OR_INCONCLUSIVE_BORESCOPE'
  | 'POSITIVE_BORESCOPE_REPORTED'
  | 'CONFIRMED_BY_SPECIALIST'
  | 'CONFLICTING_EVIDENCE';

export type Urgencia =
  | 'INFORMATION_ONLY'
  | 'PPI_SCOPE_RECOMMENDED'
  | 'BOOK_SPECIALIST_INSPECTION'
  | 'PROMPT_INSPECTION'
  | 'MINIMIZE_USE_AND_CONTACT'
  | 'REPAIR_PLANNING'
  | 'INSUFFICIENT_DATA';

/** Cambia la accion recomendada, nunca la susceptibilidad mecanica. */
export type Situacion =
  | 'compra' | 'propietario' | 'sintoma' | 'prueba';

/** Familias de senal. Se cuentan familias, no casillas: humo, consumo y
 *  hollin pueden venir del mismo proceso y no son tres pruebas. */
export type FamiliaSenal =
  | 'aceite' | 'mecanica' | 'bancada' | 'desgaste' | 'estanqueidad';

export interface Vehiculo {
  familia: Familia;
  ano: number;
  baseAno: BaseAno;
  generacion?: Generacion;
  variante?: Variante;
  combustible?: Combustible;
  /** Cilindrada en litros, p. ej. 3.4. */
  cilindrada?: number;
  /** Codigo de motor, p. ej. "M97.21". Nunca sale del navegador. */
  codigoMotor?: string;
  originalidadMotor?: Originalidad;
  /** Solo si el motor se declara reconstruido o sustituido. */
  tecnologiaReconstruida?: Tecnologia;
  /** Reconstruccion documentada y de alcance conocido. */
  reconstruccionDocumentada?: boolean;
  situacion?: Situacion;
}

export interface Sintomas {
  consumoAceite?: 'estable' | 'aumenta' | 'no_lo_se';
  /** Litros anadidos y km recorridos. Se muestran al taller, no puntuan. */
  litrosAnadidos?: number;
  kmEntreAportaciones?: number;
  fugasDescartadas?: boolean | 'no_lo_se';
  golpeteo?: 'no' | 'solo_frio' | 'frio_y_caliente' | 'no_lo_se';
  golpeteoLocalizado?: boolean | 'no_lo_se';
  hollin?: 'no' | 'asimetrico' | 'ambas' | 'no_comparable' | 'no_lo_se';
  humo?: 'no' | 'bocanada_arranque' | 'arranque_repetido' | 'en_marcha' | 'no_lo_se';
  fallosCombustion?: 'no' | 'codigo_guardado' | 'activo' | 'no_lo_se';
  bujiaAceitosa?: boolean | 'no_lo_se';
  perdidaRendimiento?: boolean | 'no_lo_se';
}

export type CalidadBoroscopia = 'completa' | 'parcial' | 'desconocida';

export interface Pruebas {
  boroscopia?: 'no' | 'normal' | 'no_concluyente' | 'dudosa' | 'positiva';
  /** Por donde se accedio. En M96/M97 solo por bujias no ve la zona critica. */
  viaBoroscopia?: 'bujias' | 'carter' | 'ambas' | 'no_lo_se';
  calidadBoroscopia?: CalidadBoroscopia;
  informeRevisadoPorEspecialista?: boolean;
  sintomasNuevosDesdeBoroscopia?: boolean;
  /** Antiguedad declarada de la prueba, en meses. */
  mesesDesdeBoroscopia?: number;
  analisisAceite?: 'no' | 'una_normal' | 'serie_estable' | 'una_anomala' | 'tendencia_creciente' | 'no_lo_se';
  compresionLeakdown?: 'no' | 'normal' | 'anomala' | 'no_lo_se';
  vacioCarter?: 'no' | 'normal' | 'bajo' | 'no_lo_se';
  filtroOCarter?: 'no' | 'normal' | 'carbonilla' | 'metal' | 'no_lo_se';
}

export interface Valoracion {
  /** La del motor que monta AHORA. Es la que manda en pantalla. */
  susceptibilidad: Susceptibilidad;
  /** La del motor de fabrica. Solo se ensena si difiere de la anterior. */
  susceptibilidadDeFabrica: Susceptibilidad;
  tecnologia: Tecnologia;
  evidencia: Evidencia;
  urgencia: Urgencia;
  /** Calidad de la identificacion. NO es la probabilidad de que falle. */
  confianza: 'alta' | 'media' | 'baja';
  /** Familias de senal encontradas, para explicar por que sale eso. */
  senales: FamiliaSenal[];
  /** Claves de textos.es.ts */
  motivos: string[];
  avisos: string[];
  acciones: string[];
  /** Unico dato que falta para avanzar, si falta alguno. */
  siguientePregunta?: 'generacion' | 'variante' | 'combustible' | 'cilindrada' | 'ano_imposible';
  fuentes: string[];
  versionReglas: string;
}
