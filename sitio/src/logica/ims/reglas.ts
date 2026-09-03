import type { Familia, Generacion, Variante, Rodamiento, Estado } from './tipos.ts';

/**
 * Reglas de la calculadora IMS. Datos, no logica: el evaluador vive aparte.
 *
 * Cada regla lleva fuente. Si dos fuentes discrepan se devuelve incertidumbre,
 * nunca la respuesta mas comoda.
 */

export const VERSION_REGLAS = '1.0.0';
export const REVISADO = '2026-09-01';

/** Fuentes citadas por las reglas. Ver README.md para la lista completa. */
export const FUENTES: Record<string, string> = {
  'ln-ims-101': 'LN Engineering, IMS 101',
  'ln-cual-rodamiento': 'LN Engineering, Which IMS bearing does my Porsche engine have?',
  'ln-serie-2000': 'LN Engineering, 2000–2001 IMS bearing type by engine serial number',
  'ln-serie-2005': 'LN Engineering, 2005–2008 IMS bearing type by engine serial number',
  'ln-6305': 'LN Engineering, MY 2006–2008 IMS bearing',
  'ln-guia': 'LN Engineering, Definitive IMS guide',
  'porsche-996': 'Porsche Newsroom, 25 years of the 996 generation',
  'porsche-classic': 'Porsche Newsroom, PCCM Plus for retrofitting (997/987 MY 2005–2008)',
};

/* ── Generacion a partir de modelo y ano ───────────────────────────────────
   `null` significa que el ano NO basta y hay que preguntar. Un 911 de 1998
   puede ser un 993 o un 996, y uno de 2005 un 996 o un 997.1: resolverlo por
   nuestra cuenta seria inventarse el dato. */
type Tramo = { desde: number; hasta: number; generacion: Generacion | null };

const TRAMOS: Record<'911' | 'boxster' | 'cayman', Tramo[]> = {
  911: [
    { desde: 0, hasta: 1997, generacion: 'pre_996' },
    { desde: 1998, hasta: 1998, generacion: null },   // 993 tardio o 996 temprano
    { desde: 1999, hasta: 2004, generacion: '996' },
    { desde: 2005, hasta: 2005, generacion: null },   // 996 tardio o 997.1
    { desde: 2006, hasta: 2008, generacion: '997_1' },
    { desde: 2009, hasta: 2012, generacion: '997_2' },
    { desde: 2013, hasta: 9999, generacion: 'post_997' },
  ],
  boxster: [
    { desde: 0, hasta: 1996, generacion: 'pre_996' },
    { desde: 1997, hasta: 2004, generacion: '986' },
    { desde: 2005, hasta: 2005, generacion: null },   // 986 tardio o 987.1
    { desde: 2006, hasta: 2008, generacion: '987_1' },
    { desde: 2009, hasta: 2012, generacion: '987_2' },
    { desde: 2013, hasta: 9999, generacion: 'post_987' },
  ],
  cayman: [
    // El Cayman se presento como 987.1: antes de 2006 no existe.
    { desde: 0, hasta: 2005, generacion: null },
    { desde: 2006, hasta: 2008, generacion: '987_1' },
    { desde: 2009, hasta: 2012, generacion: '987_2' },
    { desde: 2013, hasta: 9999, generacion: 'post_987' },
  ],
};

export function generacionPorAno(familia: Familia, ano: number): Generacion | null {
  const tramos = TRAMOS[familia as keyof typeof TRAMOS];
  if (!tramos) return null;
  return tramos.find((t) => ano >= t.desde && ano <= t.hasta)?.generacion ?? null;
}

/**
 * Generaciones que ese modelo pudo tener ese ano. Se toman los tramos que
 * tocan la ventana [ano-1, ano+1]: sirve tanto para un ano modelo solapado
 * (911 de 2005: 996 o 997.1) como para uno de matriculacion en la frontera.
 *
 * Preguntar con la lista completa era ofrecer imposibles: un 911 de 2005 no
 * puede ser un 993, y ahi estaba, ademas preseleccionado.
 */
export function generacionesCandidatas(familia: Familia, ano: number): Generacion[] {
  const tramos = TRAMOS[familia as keyof typeof TRAMOS];
  if (!tramos) return [];
  const vistas = new Set<Generacion>();
  for (const tr of tramos) {
    if (tr.generacion && ano + 1 >= tr.desde && ano - 1 <= tr.hasta) vistas.add(tr.generacion);
  }
  return [...vistas];
}

/* El ano de matriculacion se adelanta o se retrasa respecto al de modelo, asi
   que alrededor de un cambio de generacion deja de servir para decidir. */
export const ANOS_AMBIGUOS_POR_MATRICULACION: Record<string, number[]> = {
  911: [1997, 1998, 1999, 2004, 2005, 2006, 2008, 2009],
  boxster: [1996, 1997, 2004, 2005, 2006, 2008, 2009],
  cayman: [2005, 2006, 2008, 2009],
};

/** Las versiones Mezger quedan fuera del fallo clasico M96/M97. */
export const VARIANTES_MEZGER: Variante[] = ['turbo', 'gt2', 'gt3'];

/* ── Clasificacion de fabrica ──────────────────────────────────────────────
   Una regla especifica gana a una generica; se recorren en orden. */
export interface Regla {
  id: string;
  familias: Familia[];
  generaciones: Generacion[];
  /** Si se omite, la regla no mira la variante. */
  variantes?: Variante[];
  desde?: number;
  hasta?: number;
  rodamiento: Rodamiento;
  estado: Estado;
  fuentes: string[];
}

export const REGLAS: Regla[] = [
  // Mezger primero: gana a cualquier rango por ano.
  {
    id: 'mezger',
    familias: ['911'],
    generaciones: ['996', '997_1', '997_2', 'post_997'],
    variantes: VARIANTES_MEZGER,
    rodamiento: 'mezger_cojinete_liso',
    estado: 'NO_ES_EL_IMS_CLASICO_MEZGER',
    fuentes: ['ln-guia'],
  },

  // 9A1/MA1: desde MY 2009 la distribucion no usa eje intermedio.
  {
    id: 'sin-ims-997-2',
    familias: ['911'],
    generaciones: ['997_2'],
    rodamiento: 'sin_ims',
    estado: 'SIN_IMS_9A1',
    fuentes: ['ln-serie-2005', 'ln-guia'],
  },
  {
    id: 'sin-ims-987-2',
    familias: ['boxster', 'cayman'],
    generaciones: ['987_2'],
    rodamiento: 'sin_ims',
    estado: 'SIN_IMS_9A1',
    fuentes: ['ln-serie-2005', 'ln-guia'],
  },

  // Fuera de la familia estudiada.
  {
    id: 'fuera-pre-996',
    familias: ['911', 'boxster', 'cayman'],
    generaciones: ['pre_996'],
    rodamiento: 'no_aplica',
    estado: 'NO_APLICA_OTRO_MODELO',
    fuentes: ['ln-ims-101'],
  },
  {
    id: 'fuera-post-997',
    familias: ['911', 'boxster', 'cayman'],
    generaciones: ['post_997', 'post_987'],
    rodamiento: 'no_aplica',
    estado: 'NO_APLICA_OTRO_MODELO',
    fuentes: ['ln-guia'],
  },

  // ── Boxster 986 ─────────────────────────────────────────────────────────
  {
    id: 'boxster-986-1997-1999',
    familias: ['boxster'], generaciones: ['986'], desde: 1997, hasta: 1999,
    rodamiento: 'doble_hilera_5204', estado: 'AFECTADO_DOBLE_SUSTITUIBLE',
    fuentes: ['ln-ims-101'],
  },
  {
    id: 'boxster-986-2000-2001',
    familias: ['boxster'], generaciones: ['986'], desde: 2000, hasta: 2001,
    rodamiento: 'desconocido', estado: 'TRANSICION_DOBLE_O_SIMPLE',
    fuentes: ['ln-serie-2000'],
  },
  {
    id: 'boxster-986-2002-2005',
    familias: ['boxster'], generaciones: ['986'], desde: 2002, hasta: 2005,
    rodamiento: 'una_hilera_6204', estado: 'AFECTADO_SIMPLE_SUSTITUIBLE',
    fuentes: ['ln-ims-101'],
  },

  // ── Boxster / Cayman 987.1 ──────────────────────────────────────────────
  {
    id: 'boxster-987-1-2005',
    familias: ['boxster'], generaciones: ['987_1'], desde: 2005, hasta: 2005,
    rodamiento: 'desconocido', estado: 'TRANSICION_SIMPLE_O_GRANDE',
    fuentes: ['ln-serie-2005'],
  },
  {
    id: 'boxster-cayman-987-1-2006-2008',
    familias: ['boxster', 'cayman'], generaciones: ['987_1'], desde: 2006, hasta: 2008,
    rodamiento: 'una_hilera_grande_6305', estado: 'AFECTADO_GRANDE_NO_SUSTITUIBLE',
    fuentes: ['ln-6305'],
  },

  // ── 911 996 atmosferico ─────────────────────────────────────────────────
  {
    id: '996-carrera-1998-1999',
    familias: ['911'], generaciones: ['996'], desde: 1998, hasta: 1999,
    rodamiento: 'doble_hilera_5204', estado: 'AFECTADO_DOBLE_SUSTITUIBLE',
    fuentes: ['ln-ims-101', 'porsche-996'],
  },
  {
    id: '996-carrera-2000-2001',
    familias: ['911'], generaciones: ['996'], desde: 2000, hasta: 2001,
    rodamiento: 'desconocido', estado: 'TRANSICION_DOBLE_O_SIMPLE',
    fuentes: ['ln-serie-2000'],
  },
  {
    id: '996-carrera-2002-2005',
    familias: ['911'], generaciones: ['996'], desde: 2002, hasta: 2005,
    rodamiento: 'una_hilera_6204', estado: 'AFECTADO_SIMPLE_SUSTITUIBLE',
    fuentes: ['ln-ims-101'],
  },

  // ── 911 997.1 atmosferico ───────────────────────────────────────────────
  {
    id: '997-1-carrera-2005',
    familias: ['911'], generaciones: ['997_1'], desde: 2005, hasta: 2005,
    rodamiento: 'desconocido', estado: 'TRANSICION_SIMPLE_O_GRANDE',
    fuentes: ['ln-serie-2005', 'porsche-classic'],
  },
  {
    id: '997-1-carrera-2006-2008',
    familias: ['911'], generaciones: ['997_1'], desde: 2006, hasta: 2008,
    rodamiento: 'una_hilera_grande_6305', estado: 'AFECTADO_GRANDE_NO_SUSTITUIBLE',
    fuentes: ['ln-6305', 'porsche-classic'],
  },
];

/* ── Cortes por numero de serie del motor ──────────────────────────────────
   Orientativos. Solo se aplican si coinciden modelo Y tipo de motor, y solo si
   el motor se declara original: un motor de sustitucion monta el rodamiento
   que tocaba cuando SE FABRICO EL MOTOR, no el del ano del chasis. */
export interface Corte {
  id: string;
  codigoMotor: string;
  familias: Familia[];
  /** Ultimo numero, incluido, del tramo inferior. */
  hasta: number;
  rodamientoInferior: Rodamiento;
  rodamientoSuperior: Rodamiento;
  estadoInferior: Estado;
  estadoSuperior: Estado;
  fuentes: string[];
}

export const CORTES: Corte[] = [
  {
    id: 'corte-boxster-2.7-m96.22', codigoMotor: 'M96.22', familias: ['boxster'],
    hasta: 65112851,
    rodamientoInferior: 'doble_hilera_5204', rodamientoSuperior: 'una_hilera_6204',
    estadoInferior: 'AFECTADO_DOBLE_SUSTITUIBLE', estadoSuperior: 'AFECTADO_SIMPLE_SUSTITUIBLE',
    fuentes: ['ln-serie-2000'],
  },
  {
    id: 'corte-boxster-s-3.2-m96.21', codigoMotor: 'M96.21', familias: ['boxster'],
    hasta: 67111237,
    rodamientoInferior: 'doble_hilera_5204', rodamientoSuperior: 'una_hilera_6204',
    estadoInferior: 'AFECTADO_DOBLE_SUSTITUIBLE', estadoSuperior: 'AFECTADO_SIMPLE_SUSTITUIBLE',
    fuentes: ['ln-serie-2000'],
  },
  {
    id: 'corte-996-carrera-3.4', codigoMotor: 'M96.04', familias: ['911'],
    hasta: 66114164,
    rodamientoInferior: 'doble_hilera_5204', rodamientoSuperior: 'una_hilera_6204',
    estadoInferior: 'AFECTADO_DOBLE_SUSTITUIBLE', estadoSuperior: 'AFECTADO_SIMPLE_SUSTITUIBLE',
    fuentes: ['ln-serie-2000'],
  },
  {
    id: 'corte-997-1-carrera-3.6-m96.05', codigoMotor: 'M96.05', familias: ['911'],
    hasta: 69507475,
    rodamientoInferior: 'una_hilera_6204', rodamientoSuperior: 'una_hilera_grande_6305',
    estadoInferior: 'AFECTADO_SIMPLE_SUSTITUIBLE',
    estadoSuperior: 'AFECTADO_GRANDE_NO_SUSTITUIBLE',
    fuentes: ['ln-serie-2005'],
  },
  {
    id: 'corte-997-1-carrera-s-3.8-m97.01', codigoMotor: 'M97.01', familias: ['911'],
    hasta: 68509790,
    rodamientoInferior: 'una_hilera_6204', rodamientoSuperior: 'una_hilera_grande_6305',
    estadoInferior: 'AFECTADO_SIMPLE_SUSTITUIBLE',
    estadoSuperior: 'AFECTADO_GRANDE_NO_SUSTITUIBLE',
    fuentes: ['ln-serie-2005'],
  },
];

/** Codigos de motor que ofrece la interfaz, por familia y generacion. */
/** El corte de ese motor, si lo hay. Sin corte, el numero no decide nada. */
export function corteDe(familia: Familia, codigoMotor?: string): Corte | undefined {
  const codigo = (codigoMotor ?? '').toUpperCase().replace(/\s/g, '');
  if (!codigo) return undefined;
  return CORTES.find((c) => c.codigoMotor === codigo && c.familias.includes(familia));
}

/**
 * Los motores con corte publicado, con el coche al que corresponde cada uno.
 *
 * Generacion y variante estan aqui para no volver a preguntar lo contestado:
 * un 997.1 Carrera S solo puede montar el M97.01, y ofrecerle tres motores es
 * pedir dos veces el mismo dato. Donde la combinacion no basta (un Boxster,
 * cuya version no se pregunta) quedan varios y entonces si hay que elegir.
 */
export interface Motor {
  codigo: string;
  etiqueta: string;
  familias: Familia[];
  generaciones: Generacion[];
  variantes: Variante[];
}

export const MOTORES: Motor[] = [
  {
    codigo: 'M96.22', etiqueta: 'M96.22 · Boxster 2.7',
    familias: ['boxster'], generaciones: ['986'], variantes: ['boxster_base'],
  },
  {
    codigo: 'M96.21', etiqueta: 'M96.21 · Boxster S 3.2',
    familias: ['boxster'], generaciones: ['986'], variantes: ['boxster_s'],
  },
  {
    codigo: 'M96.04', etiqueta: 'M96.04 · 911 Carrera 3.4',
    familias: ['911'], generaciones: ['996'], variantes: ['carrera_atmosferico'],
  },
  {
    codigo: 'M96.05', etiqueta: 'M96.05 · 997.1 Carrera 3.6',
    familias: ['911'], generaciones: ['997_1'], variantes: ['carrera_atmosferico'],
  },
  {
    codigo: 'M97.01', etiqueta: 'M97.01 · 997.1 Carrera S 3.8',
    familias: ['911'], generaciones: ['997_1'], variantes: ['carrera_s_atmosferico'],
  },
];

/**
 * Los motores compatibles con lo que ya se sabe del coche. Un dato que no se
 * ha contestado no descarta nada: no preguntar la version de un Boxster no
 * puede significar que ningun motor le encaje.
 */
export function motoresPosibles(
  familia: Familia, generacion?: Generacion, variante?: Variante,
): Motor[] {
  return MOTORES.filter((m) => {
    if (!m.familias.includes(familia)) return false;
    if (generacion && generacion !== 'desconocida'
        && !m.generaciones.includes(generacion)) return false;
    if (variante && variante !== 'desconocida'
        && !m.variantes.includes(variante)) return false;
    return true;
  });
}
