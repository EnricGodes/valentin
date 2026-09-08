import type {
  Combustible, Familia, Generacion, Susceptibilidad, Tecnologia, Variante,
} from './tipos.ts';

/**
 * Matriz de vehiculo del evaluador de bore scoring. Datos, no logica.
 *
 * De aqui sale UNA sola cosa: la susceptibilidad de la configuracion y la
 * tecnologia de cilindro que le corresponde. Los sintomas y las pruebas se
 * clasifican aparte, en reglas-evidencia.ts, y no entran aqui ni de refilon:
 * mezclarlos seria dejar que un ruido cambie la historia de una familia de
 * motores, que es exactamente lo que la herramienta no debe hacer.
 *
 * Cada regla lleva fuente. Cuando dos fuentes discrepan se conserva la
 * incertidumbre: nunca la version mas comoda de vender.
 */

export const VERSION_REGLAS = '1.0.0';
export const REVISADO = '2026-09-08';

/** Fuentes citadas por las reglas. La lista con URLs vive en el README. */
export const FUENTES: Record<string, string> = {
  S01: 'Porsche Newsroom, 60 Years of Porsche 911',
  S02: 'LN Engineering, What is Porsche Cylinder Bore Scoring?',
  S03: 'LN Engineering, Understanding Porsche Bore Scoring',
  S04: 'Hartech, Engine Guide (technical)',
  S05: 'LN Engineering, How to Bore Scope Your Porsche Engine',
  S06: 'LN Engineering, Are 997.2 and 991.1 9A1/MA1 Engines Susceptible?',
  S07: 'LN Engineering, Which Porsche Models Do Not Suffer from Bore Scoring?',
  S08: 'LN Engineering, Macan, Cayenne & Panamera Bore Technologies',
  S09: 'LN Engineering, Identifying the Porsche Bore Scoring Problem',
  S10: 'LN Engineering, My Porsche Engine Has Scored Bores. What Can I Do?',
  S12: 'LN Engineering, Porsche 987.1 Boxster and Cayman Buyer’s Guide',
  S13: 'Charles Navarro, Understanding Bore Scoring in Al-Si Cylinder Systems',
  S14: 'Porsche Club of America, Bore Scoring and How to Prevent It',
};

/* ── Generacion a partir de modelo y ano ───────────────────────────────────
   `null` significa que el ano NO basta y hay que preguntar; `false`, que esa
   combinacion de modelo y ano no existio y hay que confirmarla en vez de
   corregirla por nuestra cuenta.

   Los tramos son de ano modelo. Se han puesto ambiguos TODOS los solapes de
   generacion, tambien los del 991: un 911 de 2016 puede ser 991.1 o 991.2 y
   son dos tecnologias de cilindro distintas, que es justo lo que se evalua. */
type Tramo = { desde: number; hasta: number; generacion: Generacion | null | false };

const TRAMOS: Partial<Record<Familia, Tramo[]>> = {
  911: [
    { desde: 0, hasta: 1997, generacion: 'pre_996' },
    { desde: 1998, hasta: 1998, generacion: null },      // 993 tardio o 996.1
    { desde: 1999, hasta: 2001, generacion: '996_1' },
    { desde: 2002, hasta: 2004, generacion: '996_2' },
    { desde: 2005, hasta: 2005, generacion: null },      // 996.2 o 997.1
    { desde: 2006, hasta: 2008, generacion: '997_1' },
    { desde: 2009, hasta: 2011, generacion: '997_2' },
    { desde: 2012, hasta: 2012, generacion: null },      // 997.2 o 991.1
    { desde: 2013, hasta: 2015, generacion: '991_1' },
    { desde: 2016, hasta: 2016, generacion: null },      // 991.1 o 991.2
    { desde: 2017, hasta: 2019, generacion: '991_2' },
    { desde: 2020, hasta: 9999, generacion: 'post_991' },
  ],
  boxster: [
    { desde: 0, hasta: 1996, generacion: false },        // el 986 llega en MY1997
    { desde: 1997, hasta: 2004, generacion: '986' },
    { desde: 2005, hasta: 2005, generacion: null },      // 986 tardio o 987.1
    { desde: 2006, hasta: 2008, generacion: '987_1' },
    { desde: 2009, hasta: 2012, generacion: '987_2' },
    { desde: 2013, hasta: 2016, generacion: '981' },
    { desde: 2017, hasta: 9999, generacion: '718' },
  ],
  cayman: [
    { desde: 0, hasta: 2005, generacion: false },        // el Cayman llega en MY2006
    { desde: 2006, hasta: 2008, generacion: '987_1' },
    { desde: 2009, hasta: 2012, generacion: '987_2' },
    { desde: 2013, hasta: 2016, generacion: '981' },
    { desde: 2017, hasta: 9999, generacion: '718' },
  ],
  cayenne: [
    { desde: 0, hasta: 2002, generacion: false },
    { desde: 2003, hasta: 2006, generacion: 'cayenne_955' },
    { desde: 2007, hasta: 2007, generacion: null },      // 955 tardio o 957
    { desde: 2008, hasta: 2010, generacion: 'cayenne_957' },
    { desde: 2011, hasta: 2014, generacion: 'cayenne_958_1' },
    { desde: 2015, hasta: 2017, generacion: 'cayenne_958_2' },
    { desde: 2018, hasta: 2018, generacion: null },      // 958.2 tardio o E3
    { desde: 2019, hasta: 9999, generacion: 'cayenne_e3' },
  ],
  panamera: [
    { desde: 0, hasta: 2008, generacion: false },
    { desde: 2009, hasta: 2015, generacion: 'panamera_970' },
    { desde: 2016, hasta: 2016, generacion: null },      // 970 tardio o 971
    { desde: 2017, hasta: 9999, generacion: 'panamera_971' },
  ],
  macan: [
    { desde: 0, hasta: 2013, generacion: false },
    { desde: 2014, hasta: 2018, generacion: 'macan_95b' },
    { desde: 2019, hasta: 9999, generacion: 'macan_95b_2' },
  ],
};

export function generacionPorAno(
  familia: Familia, ano: number,
): Generacion | null | false {
  const tramos = TRAMOS[familia];
  if (!tramos) return null;
  const tr = tramos.find((t) => ano >= t.desde && ano <= t.hasta);
  return tr ? tr.generacion : null;
}

/**
 * Generaciones que ese modelo pudo tener ese ano. Igual que en la calculadora
 * IMS, se toman los tramos que tocan la ventana [ano-1, ano+1]: sirve para un
 * ano modelo solapado y para uno de matriculacion en la frontera.
 *
 * Ofrecer la lista entera seria ofrecer imposibles: un 911 de 2005 no puede
 * ser un 992.
 */
export function generacionesCandidatas(familia: Familia, ano: number): Generacion[] {
  const tramos = TRAMOS[familia];
  if (!tramos) return [];
  const vistas = new Set<Generacion>();
  for (const tr of tramos) {
    if (tr.generacion && ano + 1 >= tr.desde && ano - 1 <= tr.hasta) vistas.add(tr.generacion);
  }
  return [...vistas];
}

/* El ano de matriculacion se adelanta o se retrasa respecto al de modelo, asi
   que junto a un cambio de generacion deja de decidir. */
export const ANOS_AMBIGUOS_POR_MATRICULACION: Partial<Record<Familia, number[]>> = {
  911: [1997, 1998, 1999, 2001, 2002, 2004, 2005, 2006, 2008, 2009,
        2011, 2012, 2013, 2015, 2016, 2017, 2019, 2020],
  boxster: [1996, 1997, 2004, 2005, 2006, 2008, 2009, 2012, 2013, 2016, 2017],
  cayman: [2005, 2006, 2008, 2009, 2012, 2013, 2016, 2017],
  cayenne: [2002, 2003, 2006, 2007, 2008, 2010, 2011, 2014, 2015, 2017, 2018, 2019],
  panamera: [2008, 2009, 2015, 2016, 2017],
  macan: [2013, 2014, 2018, 2019],
};

/** Variantes que en 911 llevan motor Mezger y quedan fuera del patron M96/M97. */
export const VARIANTES_MEZGER: Variante[] = ['turbo', 'gt2', 'gt3'];

/* ── Reglas ────────────────────────────────────────────────────────────────
   Se recorren de mayor a menor prioridad; la primera que encaja gana. Si dos
   de la MISMA prioridad encajan, el evaluador lo trata como error de datos y
   devuelve incertidumbre: una matriz ambigua no puede dar una respuesta firme. */
export interface ReglaVehiculo {
  id: string;
  familias: Familia[];
  generaciones?: Generacion[];
  /** Si se omite, la regla no mira la version. */
  variantes?: Variante[];
  combustibles?: Combustible[];
  /** Cilindradas en litros que acepta la regla. */
  cilindradas?: number[];
  desde?: number;
  hasta?: number;
  tecnologia: Tecnologia;
  susceptibilidad: Susceptibilidad;
  prioridad: number;
  fuentes: string[];
}

/* Solo Carrera y Carrera S. "Otra version" NO entra aqui: un 911 R o un Sport
   Classic monta un motor que no es el del Carrera, y meterlo en esta regla es
   justo el error que la especificacion prohibe, clasificar por el nombre de la
   generacion cuando hay otra arquitectura debajo. Cae en ENGINE_SPECIFIC. */
const CARRERA: Variante[] = ['carrera', 'carrera_s'];

export const REGLAS: ReglaVehiculo[] = [
  // ── Fuera del alcance por electrificacion ────────────────────────────────
  {
    id: 'taycan',
    familias: ['taycan'],
    tecnologia: 'no_aplica_electrico',
    susceptibilidad: 'NOT_APPLICABLE_ELECTRIC',
    prioridad: 100, fuentes: ['S08'],
  },
  {
    id: 'electrico',
    familias: ['cayenne', 'panamera', 'macan'],
    combustibles: ['electrico'],
    tecnologia: 'no_aplica_electrico',
    susceptibilidad: 'NOT_APPLICABLE_ELECTRIC',
    prioridad: 100, fuentes: ['S08'],
  },

  // ── 911 ──────────────────────────────────────────────────────────────────
  // Mezger primero: gana a cualquier rango por ano, como en el IMS.
  {
    id: '911-mezger',
    familias: ['911'],
    generaciones: ['996_1', '996_2', '997_1', '997_2'],
    variantes: VARIANTES_MEZGER,
    tecnologia: 'nikasil',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 90, fuentes: ['S07'],
  },
  // El GT3 991.1 no hereda la regla del Carrera: es otra arquitectura, y el
  // Turbo tampoco. Se pide identificar el motor en vez de suponerlo.
  {
    id: '911-991-1-especificos',
    familias: ['911'],
    generaciones: ['991_1', '991_2'],
    variantes: ['turbo', 'gt2', 'gt3'],
    tecnologia: 'desconocida',
    susceptibilidad: 'ENGINE_SPECIFIC_CLASSIFICATION',
    prioridad: 90, fuentes: ['S06', 'S07'],
  },
  {
    id: '911-pre-996',
    familias: ['911'], generaciones: ['pre_996'],
    tecnologia: 'desconocida',
    susceptibilidad: 'OUTSIDE_VALIDATED_SCOPE',
    prioridad: 80, fuentes: ['S01'],
  },
  {
    id: '911-996-1-carrera',
    familias: ['911'], generaciones: ['996_1'], variantes: CARRERA,
    tecnologia: 'lokasil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S02', 'S03', 'S04'],
  },
  {
    id: '911-996-2-carrera',
    familias: ['911'], generaciones: ['996_2'], variantes: CARRERA,
    tecnologia: 'lokasil',
    susceptibilidad: 'ELEVATED_REPORTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S02', 'S03', 'S04'],
  },
  {
    id: '911-997-1-carrera',
    familias: ['911'], generaciones: ['997_1'], variantes: CARRERA,
    tecnologia: 'lokasil',
    susceptibilidad: 'ELEVATED_REPORTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S02', 'S03', 'S04'],
  },
  {
    id: '911-997-2-carrera',
    familias: ['911'], generaciones: ['997_2'], variantes: CARRERA,
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S06', 'S07'],
  },
  {
    id: '911-991-1-carrera',
    familias: ['911'], generaciones: ['991_1'], variantes: CARRERA,
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S06'],
  },
  {
    id: '911-991-2-carrera',
    familias: ['911'], generaciones: ['991_2'], variantes: CARRERA,
    tecnologia: 'recubrimiento_proyectado',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 50, fuentes: ['S06', 'S07'],
  },
  {
    id: '911-992',
    familias: ['911'], generaciones: ['post_991'],
    tecnologia: 'desconocida',
    susceptibilidad: 'ENGINE_SPECIFIC_CLASSIFICATION',
    prioridad: 50, fuentes: ['S07'],
  },

  // ── Boxster y Cayman ─────────────────────────────────────────────────────
  {
    id: 'bc-986',
    familias: ['boxster'], generaciones: ['986'],
    tecnologia: 'lokasil',
    susceptibilidad: 'LOWER_REPORTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S02', 'S03', 'S05'],
  },
  // El 987.1 es el tramo donde la version y la cilindrada deciden de verdad:
  // el S 3.4 esta en el grupo mas afectado y el 2.7 y el 3.2 no.
  {
    id: 'bc-987-1-base',
    familias: ['boxster', 'cayman'], generaciones: ['987_1'], variantes: ['base'],
    tecnologia: 'lokasil',
    susceptibilidad: 'LOWER_REPORTED_SUSCEPTIBILITY',
    prioridad: 60, fuentes: ['S02', 'S05', 'S12'],
  },
  {
    id: 'bc-987-1-s-3-2',
    familias: ['boxster'], generaciones: ['987_1'], variantes: ['s'],
    cilindradas: [3.2],
    tecnologia: 'lokasil',
    susceptibilidad: 'LOWER_REPORTED_SUSCEPTIBILITY',
    prioridad: 70, fuentes: ['S02', 'S05', 'S12'],
  },
  {
    id: 'bc-987-1-s-3-4',
    familias: ['boxster', 'cayman'], generaciones: ['987_1'], variantes: ['s', 'gts'],
    cilindradas: [3.4],
    tecnologia: 'lokasil',
    susceptibilidad: 'ELEVATED_REPORTED_SUSCEPTIBILITY',
    prioridad: 70, fuentes: ['S02', 'S03', 'S05', 'S12'],
  },
  // Sin cilindrada declarada, el ano modelo la resuelve: el Boxster S 987.1
  // monta 3.2 hasta MY2006 y 3.4 desde MY2007.
  {
    id: 'bc-987-1-s-hasta-2006',
    familias: ['boxster'], generaciones: ['987_1'], variantes: ['s'],
    hasta: 2006,
    tecnologia: 'lokasil',
    susceptibilidad: 'LOWER_REPORTED_SUSCEPTIBILITY',
    prioridad: 60, fuentes: ['S02', 'S05', 'S12'],
  },
  {
    id: 'bc-987-1-s-desde-2007',
    familias: ['boxster'], generaciones: ['987_1'], variantes: ['s', 'gts'],
    desde: 2007,
    tecnologia: 'lokasil',
    susceptibilidad: 'ELEVATED_REPORTED_SUSCEPTIBILITY',
    prioridad: 60, fuentes: ['S02', 'S03', 'S05', 'S12'],
  },
  // El Cayman S 987.1 es 3.4 desde el primer ano.
  {
    id: 'bc-987-1-cayman-s',
    familias: ['cayman'], generaciones: ['987_1'], variantes: ['s', 'gts'],
    tecnologia: 'lokasil',
    susceptibilidad: 'ELEVATED_REPORTED_SUSCEPTIBILITY',
    prioridad: 60, fuentes: ['S02', 'S03', 'S05', 'S12'],
  },
  {
    id: 'bc-987-2',
    familias: ['boxster', 'cayman'], generaciones: ['987_2'],
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S06'],
  },
  {
    id: 'bc-981-especificos',
    familias: ['boxster', 'cayman'], generaciones: ['981'], variantes: ['spyder_gt4'],
    tecnologia: 'desconocida',
    susceptibilidad: 'ENGINE_SPECIFIC_CLASSIFICATION',
    prioridad: 70, fuentes: ['S06'],
  },
  {
    id: 'bc-981',
    familias: ['boxster', 'cayman'], generaciones: ['981'],
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S06'],
  },
  {
    id: 'bc-718',
    familias: ['boxster', 'cayman'], generaciones: ['718'],
    tecnologia: 'recubrimiento_proyectado',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 50, fuentes: ['S06', 'S07'],
  },

  // ── Cayenne ──────────────────────────────────────────────────────────────
  // El diesel y el hibrido sin identificar no se clasifican por el nombre.
  {
    id: 'suv-diesel-hibrido',
    familias: ['cayenne', 'panamera', 'macan'],
    combustibles: ['diesel', 'hibrido'],
    tecnologia: 'desconocida',
    susceptibilidad: 'ENGINE_SPECIFIC_CLASSIFICATION',
    prioridad: 85, fuentes: ['S08'],
  },
  {
    id: 'cayenne-vr6',
    familias: ['cayenne'],
    generaciones: ['cayenne_955', 'cayenne_957', 'cayenne_958_1', 'cayenne_958_2'],
    variantes: ['base'],
    tecnologia: 'hierro',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 60, fuentes: ['S08'],
  },
  {
    id: 'cayenne-v8-955-958-1',
    familias: ['cayenne'],
    generaciones: ['cayenne_955', 'cayenne_957', 'cayenne_958_1'],
    variantes: ['s', 'gts', 'turbo'],
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S08'],
  },
  {
    id: 'cayenne-mct-958-2',
    familias: ['cayenne'], generaciones: ['cayenne_958_2'],
    variantes: ['s', 'gts', 'turbo'],
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S08'],
  },
  {
    id: 'cayenne-e3',
    familias: ['cayenne'], generaciones: ['cayenne_e3'],
    tecnologia: 'hierro',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 50, fuentes: ['S08'],
  },

  // ── Panamera ─────────────────────────────────────────────────────────────
  {
    id: 'panamera-970',
    familias: ['panamera'], generaciones: ['panamera_970'],
    variantes: ['s', 'gts', 'turbo'],
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S08'],
  },
  {
    id: 'panamera-970-base',
    familias: ['panamera'], generaciones: ['panamera_970'], variantes: ['base'],
    tecnologia: 'desconocida',
    susceptibilidad: 'ENGINE_SPECIFIC_CLASSIFICATION',
    prioridad: 60, fuentes: ['S08'],
  },
  {
    id: 'panamera-971',
    familias: ['panamera'], generaciones: ['panamera_971'],
    tecnologia: 'hierro',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 50, fuentes: ['S07', 'S08'],
  },

  // ── Macan ────────────────────────────────────────────────────────────────
  {
    id: 'macan-2-0',
    familias: ['macan'], variantes: ['base'],
    tecnologia: 'hierro',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 60, fuentes: ['S07', 'S08'],
  },
  {
    id: 'macan-v6-mct',
    familias: ['macan'], generaciones: ['macan_95b'],
    variantes: ['s', 'gts', 'turbo'],
    tecnologia: 'alusil',
    susceptibilidad: 'DOCUMENTED_SUSCEPTIBILITY',
    prioridad: 50, fuentes: ['S08'],
  },
  {
    id: 'macan-v6-ea839',
    familias: ['macan'], generaciones: ['macan_95b_2'],
    variantes: ['s', 'gts', 'turbo'],
    tecnologia: 'hierro',
    susceptibilidad: 'LOWER_BY_BORE_TECHNOLOGY',
    prioridad: 50, fuentes: ['S07', 'S08'],
  },

  // ── Todo lo demas ────────────────────────────────────────────────────────
  // 356, 912, 914, transaxle, Carrera GT, 918: hay bloques Alusil entre ellos,
  // pero no heredan la frecuencia de los M96/M97 sin una matriz propia.
  {
    id: 'otro-porsche',
    familias: ['otro'],
    tecnologia: 'desconocida',
    susceptibilidad: 'OUTSIDE_VALIDATED_SCOPE',
    prioridad: 10, fuentes: ['S07'],
  },
];

/** Las reglas que encajan con el vehiculo descrito, ya ordenadas. */
export function reglasQueEncajan(entrada: {
  familia: Familia; generacion?: Generacion; variante?: Variante;
  combustible?: Combustible; cilindrada?: number; ano: number;
}): ReglaVehiculo[] {
  const { familia, generacion, variante, combustible, cilindrada, ano } = entrada;
  return REGLAS
    .filter((r) => {
      if (!r.familias.includes(familia)) return false;
      if (r.generaciones && (!generacion || !r.generaciones.includes(generacion))) return false;
      if (r.variantes && (!variante || !r.variantes.includes(variante))) return false;
      if (r.combustibles && (!combustible || !r.combustibles.includes(combustible))) return false;
      if (r.cilindradas && (cilindrada === undefined
          || !r.cilindradas.includes(cilindrada))) return false;
      if (r.desde !== undefined && ano < r.desde) return false;
      if (r.hasta !== undefined && ano > r.hasta) return false;
      return true;
    })
    .sort((a, b) => b.prioridad - a.prioridad);
}

/* ── Que hace falta preguntar ─────────────────────────────────────────────
   Una pregunta cada vez, y solo si su respuesta puede cambiar el resultado.
   Preguntar la version de un 986, donde base y S salen igual, es alargar el
   formulario sin ganar nada. */

/** Generaciones de 911 donde la version separa Mezger de Carrera. */
const GEN_911_CON_VERSION: Generacion[] = ['996_1', '996_2', '997_1', '997_2', '991_1', '991_2'];
/** Generaciones de Boxster/Cayman donde la version cambia la clasificacion. */
const GEN_BC_CON_VERSION: Generacion[] = ['987_1', '981'];

export function necesitaVariante(familia: Familia, generacion: Generacion): boolean {
  if (familia === '911') return GEN_911_CON_VERSION.includes(generacion);
  if (familia === 'boxster' || familia === 'cayman') {
    return GEN_BC_CON_VERSION.includes(generacion);
  }
  // En SUV y berlina el nombre comercial nunca basta.
  return ['cayenne', 'panamera', 'macan'].includes(familia);
}

/** El combustible se pregunta antes que la version: ordena el resto. */
export function necesitaCombustible(familia: Familia): boolean {
  return ['cayenne', 'panamera', 'macan'].includes(familia);
}

/**
 * La cilindrada solo se pregunta donde de verdad decide: el Boxster S 987.1,
 * que fue 3.2 y despues 3.4, cuando el ano no es de fiar para separarlos.
 */
export function necesitaCilindrada(entrada: {
  familia: Familia; generacion?: Generacion; variante?: Variante;
  baseAno: string; cilindrada?: number;
}): boolean {
  if (entrada.cilindrada !== undefined) return false;
  if (entrada.familia !== 'boxster') return false;
  if (entrada.generacion !== '987_1' || entrada.variante !== 's') return false;
  return entrada.baseAno !== 'modelo';
}

/** Cilindradas que ofrecer, ya filtradas por el coche descrito. */
export function cilindradasPosibles(familia: Familia, generacion?: Generacion): number[] {
  if (generacion === '987_1') return familia === 'cayman' ? [2.7, 3.4] : [2.7, 3.2, 3.4];
  if (generacion === '986') return [2.5, 2.7, 3.2];
  return [];
}

/** Versiones que ofrecer para ese coche. Las imposibles no se ensenan. */
export function variantesPosibles(familia: Familia, generacion?: Generacion): Variante[] {
  if (familia === '911') return ['carrera', 'carrera_s', 'turbo', 'gt2', 'gt3', 'otra'];
  if (familia === 'boxster' || familia === 'cayman') {
    return generacion === '981'
      ? ['base', 's', 'gts', 'spyder_gt4', 'otra']
      : ['base', 's', 'gts', 'otra'];
  }
  return ['base', 's', 'gts', 'turbo', 'otra'];
}
