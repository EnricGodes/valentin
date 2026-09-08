import type {
  Evidencia, FamiliaSenal, Pruebas, Sintomas, Situacion,
  Susceptibilidad, Tecnologia, Urgencia,
} from './tipos.ts';

/**
 * Reglas de evidencia y urgencia. Separadas a proposito de la matriz de
 * vehiculo: una es la historia de una familia de motores y la otra el estado
 * declarado de UNA unidad, y solo se juntan al final, para decidir que hacer.
 *
 * Tres cosas gobiernan este fichero:
 *
 *   1. Se cuentan FAMILIAS de senal, no casillas. Humo, consumo y hollin
 *      pueden venir del mismo proceso; marcarlas todas no son tres pruebas
 *      independientes y no pueden sumar como tres.
 *   2. No hay puntuacion. Ni de 0 a 100, ni oculta. Cada estado sale de una
 *      condicion que se puede leer.
 *   3. Ningun umbral de consumo diagnostica nada. Se recogen litros y
 *      kilometros para ensenarselos al taller, y lo que decide es la
 *      tendencia y con que otras senales coincide.
 */

/** Cuando una prueba deja de describir el estado actual del motor. */
export const MESES_BOROSCOPIA_RECIENTE = 12;

/* ── Familias de senal ─────────────────────────────────────────────────────
   Cada funcion responde a una sola pregunta: si esa familia esta presente.
   "No lo se" nunca cuenta como senal: una duda no es un sintoma. */

const senales: Record<FamiliaSenal, (s: Sintomas, p: Pruebas) => boolean> = {
  /* Aceite y combustion de aceite. Una bocanada aislada al arrancar NO entra:
     en un boxer tiene otras causas y por si sola no es una senal. */
  aceite: (s) =>
    s.consumoAceite === 'aumenta'
    || s.humo === 'arranque_repetido' || s.humo === 'en_marcha',

  /* Mecanica. El tic solo en frio se queda fuera: lo hacen taques e
     inyectores, y convertirlo en piston slap es el error mas facil de todos. */
  mecanica: (s) =>
    s.golpeteo === 'frio_y_caliente' || s.golpeteoLocalizado === true,

  /* Bancada o cilindro concreto. */
  bancada: (s) =>
    s.hollin === 'asimetrico' || s.bujiaAceitosa === true
    || s.fallosCombustion === 'activo',

  /* Pruebas de desgaste: apoyan, no confirman. */
  desgaste: (_s, p) =>
    p.analisisAceite === 'tendencia_creciente' || p.analisisAceite === 'una_anomala'
    || p.filtroOCarter === 'metal',

  /* Estanqueidad y funcionamiento. Pueden tener otras causas. */
  estanqueidad: (_s, p) =>
    p.compresionLeakdown === 'anomala' || p.vacioCarter === 'bajo',
};

/** Familias de SINTOMA presentes. Las de prueba se tratan aparte. */
export const FAMILIAS_SINTOMA: FamiliaSenal[] = ['aceite', 'mecanica', 'bancada'];
export const FAMILIAS_PRUEBA: FamiliaSenal[] = ['desgaste', 'estanqueidad'];

export function familiasPresentes(s: Sintomas, p: Pruebas): FamiliaSenal[] {
  return (Object.keys(senales) as FamiliaSenal[]).filter((f) => senales[f](s, p));
}

/**
 * Senales debiles: existen, pero no bastan para llamarlas familia. Sirven para
 * distinguir "no has declarado nada" de "hay algo que vigilar".
 */
export function hayIndicioDebil(s: Sintomas): boolean {
  return s.humo === 'bocanada_arranque'
    || s.golpeteo === 'solo_frio'
    || s.fallosCombustion === 'codigo_guardado'
    || s.perdidaRendimiento === true;
}

/* ── Boroscopia ────────────────────────────────────────────────────────────
   Es la via de confirmacion, pero depende de la tecnica y de la lectura. Una
   prueba mal hecha informada como normal no es un motor sano. */

export interface LecturaBoroscopia {
  estado: 'ninguna' | 'negativa' | 'limitada' | 'positiva' | 'confirmada';
  motivos: string[];
}

export function leeBoroscopia(p: Pruebas, tecnologia: Tecnologia): LecturaBoroscopia {
  const motivos: string[] = [];
  if (!p.boroscopia || p.boroscopia === 'no') return { estado: 'ninguna', motivos };

  if (p.boroscopia === 'positiva') {
    return p.informeRevisadoPorEspecialista
      ? { estado: 'confirmada', motivos: ['boroscopia_confirmada'] }
      : { estado: 'positiva', motivos: ['boroscopia_positiva_declarada'] };
  }

  if (p.boroscopia === 'dudosa' || p.boroscopia === 'no_concluyente') {
    return { estado: 'limitada', motivos: ['boroscopia_no_concluyente'] };
  }

  // Informada como normal: hay que mirar como se hizo antes de creerla.
  const porBujias = p.viaBoroscopia === 'bujias';
  const lokasilPorBujias = porBujias && (tecnologia === 'lokasil' || tecnologia === 'alusil');
  if (lokasilPorBujias) motivos.push('boroscopia_solo_por_bujias');
  if (p.calidadBoroscopia === 'parcial') motivos.push('boroscopia_parcial');
  if (p.calidadBoroscopia === 'desconocida' || !p.calidadBoroscopia) {
    motivos.push('boroscopia_alcance_desconocido');
  }
  if (lokasilPorBujias || p.calidadBoroscopia === 'parcial') {
    return { estado: 'limitada', motivos };
  }

  return { estado: 'negativa', motivos };
}

/** Una boroscopia normal deja de describir el presente si el coche ha cambiado. */
export function boroscopiaDesfasada(p: Pruebas): boolean {
  return p.sintomasNuevosDesdeBoroscopia === true
    || (p.mesesDesdeBoroscopia !== undefined
        && p.mesesDesdeBoroscopia > MESES_BOROSCOPIA_RECIENTE);
}

/* ── Evidencia ─────────────────────────────────────────────────────────────
   Orden de precedencia, de arriba abajo. La primera que se cumple gana. */

export function derivaEvidencia(
  s: Sintomas, p: Pruebas, tecnologia: Tecnologia,
): { evidencia: Evidencia; senales: FamiliaSenal[]; motivos: string[] } {
  const familias = familiasPresentes(s, p);
  const sintomaticas = familias.filter((f) => FAMILIAS_SINTOMA.includes(f));
  const probatorias = familias.filter((f) => FAMILIAS_PRUEBA.includes(f));
  const boro = leeBoroscopia(p, tecnologia);
  const motivos = [...boro.motivos];

  if (boro.estado === 'confirmada') {
    return { evidencia: 'CONFIRMED_BY_SPECIALIST', senales: familias, motivos };
  }
  if (boro.estado === 'positiva') {
    return { evidencia: 'POSITIVE_BORESCOPE_REPORTED', senales: familias, motivos };
  }

  /* Una prueba normal contra sintomas nuevos no es tranquilidad, es un
     conflicto: manda repetirla, no dar el motor por bueno. */
  if (boro.estado === 'negativa'
      && (sintomaticas.length > 0 || probatorias.length > 0 || boroscopiaDesfasada(p))) {
    return {
      evidencia: 'CONFLICTING_EVIDENCE', senales: familias,
      motivos: [...motivos, 'boroscopia_negativa_contra_sintomas'],
    };
  }

  if (boro.estado === 'limitada') {
    return { evidencia: 'LIMITED_OR_INCONCLUSIVE_BORESCOPE', senales: familias, motivos };
  }

  if (sintomaticas.length >= 2) {
    return {
      evidencia: 'MULTIPLE_COMPATIBLE_SIGNALS', senales: familias,
      motivos: [...motivos, 'dos_familias_de_senal'],
    };
  }
  if (probatorias.length > 0) {
    return {
      evidencia: 'SUPPORTING_TEST_SUSPICIOUS', senales: familias,
      motivos: [...motivos, 'prueba_complementaria_sospechosa'],
    };
  }
  if (boro.estado === 'negativa') {
    return { evidencia: 'NEGATIVE_BORESCOPE_REPORTED', senales: familias, motivos };
  }
  if (sintomaticas.length === 1 || hayIndicioDebil(s)) {
    return {
      evidencia: 'ONE_NON_SPECIFIC_SIGNAL', senales: familias,
      motivos: [...motivos, 'una_senal_inespecifica'],
    };
  }

  return { evidencia: 'NO_EVIDENCE_REPORTED', senales: familias, motivos };
}

/* ── Urgencia ──────────────────────────────────────────────────────────────
   Sale de la evidencia y del contexto, nunca del modelo por si solo. La
   herramienta no ordena "no conduzcas": lo mas fuerte que dice es reducir el
   uso y llamar al taller. */

const SUSCEPTIBILIDAD_QUE_PIDE_BOROSCOPIA: Susceptibilidad[] = [
  'ELEVATED_REPORTED_SUSCEPTIBILITY', 'DOCUMENTED_SUSCEPTIBILITY',
];

/**
 * Deterioro que conviene no seguir acumulando: consumo que crece junto a
 * combustion de aceite en un cilindro, o ruido mecanico con perdida de
 * rendimiento. Son coincidencias de familias distintas, no una cifra.
 */
function deterioroMarcado(s: Sintomas): boolean {
  const consumo = s.consumoAceite === 'aumenta';
  const cilindro = s.fallosCombustion === 'activo' || s.bujiaAceitosa === true;
  const ruidoFuerte = s.golpeteo === 'frio_y_caliente' && s.perdidaRendimiento === true;
  return (consumo && cilindro) || ruidoFuerte;
}

export function derivaUrgencia(entrada: {
  susceptibilidad: Susceptibilidad;
  evidencia: Evidencia;
  situacion?: Situacion;
  sintomas: Sintomas;
  faltaIdentificar: boolean;
}): Urgencia {
  const { susceptibilidad, evidencia, situacion, sintomas, faltaIdentificar } = entrada;

  if (susceptibilidad === 'NOT_APPLICABLE_ELECTRIC') return 'INFORMATION_ONLY';

  if (evidencia === 'CONFIRMED_BY_SPECIALIST') return 'REPAIR_PLANNING';
  if (evidencia === 'POSITIVE_BORESCOPE_REPORTED') return 'PROMPT_INSPECTION';

  if (deterioroMarcado(sintomas)) return 'MINIMIZE_USE_AND_CONTACT';

  if (evidencia === 'MULTIPLE_COMPATIBLE_SIGNALS'
      || evidencia === 'SUPPORTING_TEST_SUSPICIOUS'
      || evidencia === 'CONFLICTING_EVIDENCE') return 'PROMPT_INSPECTION';

  if (evidencia === 'LIMITED_OR_INCONCLUSIVE_BORESCOPE') return 'BOOK_SPECIALIST_INSPECTION';

  if (evidencia === 'ONE_NON_SPECIFIC_SIGNAL') {
    /* Una bocanada breve al arrancar, sola y sin cambio de consumo, no sube la
       urgencia: se vigila. Cualquier otra senal aislada si merece una mirada. */
    const soloBocanada = sintomas.humo === 'bocanada_arranque'
      && sintomas.consumoAceite !== 'aumenta'
      && sintomas.golpeteo !== 'frio_y_caliente' && sintomas.golpeteo !== 'solo_frio'
      && sintomas.fallosCombustion !== 'codigo_guardado'
      && sintomas.perdidaRendimiento !== true;
    return soloBocanada ? 'INFORMATION_ONLY' : 'BOOK_SPECIALIST_INSPECTION';
  }

  /* Sin indicios. Si ni siquiera se ha podido identificar el motor, eso es lo
     que hay que decir: falta un dato, no que este todo bien. */
  if (faltaIdentificar) return 'INSUFFICIENT_DATA';

  if (situacion === 'compra' && SUSCEPTIBILIDAD_QUE_PIDE_BOROSCOPIA.includes(susceptibilidad)) {
    return 'PPI_SCOPE_RECOMMENDED';
  }
  return 'INFORMATION_ONLY';
}

/**
 * Consumo declarado en litros por 1.000 km, solo para ensenarselo al taller.
 * NO entra en ninguna decision: no existe un umbral universal que sirva de
 * diagnostico y convertir un recuerdo en una cifra da una precision falsa.
 */
export function consumoPorMilKm(s: Sintomas): number | undefined {
  if (!s.litrosAnadidos || !s.kmEntreAportaciones) return undefined;
  if (s.kmEntreAportaciones <= 0) return undefined;
  return Math.round((s.litrosAnadidos / s.kmEntreAportaciones) * 1000 * 100) / 100;
}
