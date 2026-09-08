import type {
  Evidencia, Susceptibilidad, Tecnologia, Urgencia, Variante,
} from './tipos.ts';

/**
 * Textos del evaluador de bore scoring, en castellano.
 *
 * Viven fuera del componente y fuera del evaluador: cambiar una frase no debe
 * obligar a tocar una regla tecnica, y anadir un idioma debe ser anadir un
 * fichero hermano (textos.en.ts) sin mover nada mas.
 *
 * No se traducen nunca: bore scoring, M96, M97, 9A1/MA1, Mezger, Lokasil,
 * Alusil, Nikasil, APS, PTWA, SUMEbore, VR6, MCT, EA888, EA839, EA825.
 *
 * Frases prohibidas, de la especificacion: "tu Porsche esta afectado" con solo
 * modelo y ano, "no esta afectado" por ausencia de sintomas, "riesgo cero",
 * "motor sano" tras una boroscopia limitada, "quedan X kilometros", "un aceite
 * mas espeso lo soluciona", "todos los 997 estan afectados", "desde 2009 estan
 * libres" y "el 3.2 nunca falla".
 */

export interface TextoEje {
  /** La etiqueta corta de la tarjeta. */
  etiqueta: string;
  /** Una linea. Lo que basta para entenderla sin abrir nada. */
  resumen: string;
  /** Explicacion completa, dentro del detalle. */
  cuerpo?: string;
}

/* ── Eje 1: susceptibilidad de la configuracion ──────────────────────────── */
export const SUSCEPTIBILIDAD: Record<Susceptibilidad, TextoEje> = {
  ELEVATED_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Elevada en esta familia',
    resumen: 'Es uno de los grupos que los especialistas encuentran con más frecuencia entre los motores afectados.',
    cuerpo: 'Esta configuración pertenece a uno de los grupos que aparecen con más frecuencia en la experiencia publicada de los talleres que reconstruyen estos motores. Eso describe una familia, no esta unidad: no significa que tenga daño ni permite calcular una probabilidad individual.',
  },
  DOCUMENTED_SUSCEPTIBILITY: {
    etiqueta: 'Casos documentados',
    resumen: 'Hay casos descritos y una arquitectura compatible, sin llegar al grupo M96/M97 más afectado.',
    cuerpo: 'Existen casos publicados y la arquitectura del cilindro es compatible con el daño, pero esta configuración no debe equipararse automáticamente a los M96/M97 que concentran la mayor preocupación.',
  },
  LOWER_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Comparativamente baja',
    resumen: 'Esta versión aparece con menor frecuencia en la experiencia técnica publicada.',
    cuerpo: 'Aparece con menos frecuencia que sus hermanas de mayor cilindrada en lo que publican los especialistas. Menor no es imposible: si hay síntomas, se revisa igual.',
  },
  LOWER_BY_BORE_TECHNOLOGY: {
    etiqueta: 'Tecnología menos asociada',
    resumen: 'El cilindro no comparte el patrón clásico de Lokasil y Alusil que se evalúa aquí.',
    cuerpo: 'Según la identificación aportada, el motor usa Nikasil, un recubrimiento férreo proyectado o camisas y bloque de hierro. No comparte el patrón principal que evalúa esta herramienta, lo que no garantiza el estado de ningún cilindro ni excluye otro desgaste.',
  },
  ENGINE_SPECIFIC_CLASSIFICATION: {
    etiqueta: 'Hay que identificar el motor',
    resumen: 'En este modelo y año convivieron arquitecturas diferentes.',
    cuerpo: 'Con lo aportado hasta aquí conviven arquitecturas distintas bajo el mismo nombre comercial. Hace falta la versión, la cilindrada o el código de motor: clasificar sin eso sería dar una respuesta engañosa.',
  },
  OUTSIDE_VALIDATED_SCOPE: {
    etiqueta: 'Fuera de la matriz validada',
    resumen: 'No tenemos una regla suficientemente fiable para esta configuración.',
    cuerpo: 'Esta herramienta cubre 911 desde el 996, Boxster y Cayman, y Cayenne, Panamera y Macan con motor identificable. Para el resto no hay una regla que podamos sostener, y una zona verde genérica sería peor que no decir nada. Si hay síntomas, deben evaluarse igualmente.',
  },
  NOT_APPLICABLE_ELECTRIC: {
    etiqueta: 'No aplica',
    resumen: 'Un vehículo eléctrico no tiene cilindros de combustión.',
    cuerpo: 'Sin cilindros de combustión no puede existir esta avería.',
  },
};

/* ── Eje 2: evidencia sobre la unidad ────────────────────────────────────── */
export const EVIDENCIA: Record<Evidencia, TextoEje> = {
  NO_EVIDENCE_REPORTED: {
    etiqueta: 'No has declarado indicios',
    resumen: 'Sin síntomas ni pruebas declaradas. Eso no es lo mismo que un motor sano.',
    cuerpo: 'No se han comunicado síntomas ni pruebas sospechosas. Es lo único que se puede afirmar: el daño incipiente puede existir sin dar señales que se noten desde el asiento.',
  },
  ONE_NON_SPECIFIC_SIGNAL: {
    etiqueta: 'Un indicio aislado',
    resumen: 'Hay un síntoma que puede tener otras causas.',
    cuerpo: 'Un solo síntoma, sin nada que lo acompañe, admite muchas explicaciones: taqués, inyectores, una fuga de escape o el propio arranque en frío. Conviene vigilar si persiste o si aparece alguno más.',
  },
  MULTIPLE_COMPATIBLE_SIGNALS: {
    etiqueta: 'Varios indicios compatibles',
    resumen: 'Coinciden señales de dos familias independientes.',
    cuerpo: 'Concurren señales de familias distintas, por ejemplo consumo creciente y un golpeteo rítmico, o hollín asimétrico con bujía aceitosa. La coincidencia justifica una boroscopia y un diagnóstico, no un diagnóstico por sí sola.',
  },
  SUPPORTING_TEST_SUSPICIOUS: {
    etiqueta: 'Una prueba sospechosa',
    resumen: 'Una prueba complementaria apunta a desgaste, sin confirmarlo visualmente.',
    cuerpo: 'El análisis de aceite, la compresión, el leak-down o lo encontrado en el filtro apoyan la sospecha. Apoyan: la confirmación sigue siendo visual.',
  },
  NEGATIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Boroscopia informada como normal',
    resumen: 'Describe lo que se vio ese día y en esas superficies.',
    cuerpo: 'Una boroscopia completa y reciente informada como normal es una buena noticia acotada: describe el estado observado en esa fecha y en las zonas que se llegaron a ver. La susceptibilidad de la familia no cambia por ella.',
  },
  LIMITED_OR_INCONCLUSIVE_BORESCOPE: {
    etiqueta: 'Boroscopia limitada o no concluyente',
    resumen: 'La inspección no permite dar el motor por bueno.',
    cuerpo: 'La prueba no cubrió las zonas críticas, no llegó a todos los cilindros necesarios o el informe no concluye. En un M96/M97 el acceso solo por los alojamientos de bujía deja fuera precisamente donde suele empezar el rayado.',
  },
  POSITIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Boroscopia positiva declarada',
    resumen: 'Declaras un informe positivo que nosotros no hemos revisado.',
    cuerpo: 'Tomamos el informe como lo que es: una declaración. Antes de hablar de alcance y de opciones conviene que un especialista revise las imágenes o el motor.',
  },
  CONFIRMED_BY_SPECIALIST: {
    etiqueta: 'Confirmado por un especialista',
    resumen: 'Hay un informe profesional que lo confirma.',
    cuerpo: 'Con un diagnóstico profesional, la conversación deja de ser si existe y pasa a ser el alcance, la causa y la estrategia de reconstrucción.',
  },
  CONFLICTING_EVIDENCE: {
    etiqueta: 'Información contradictoria',
    resumen: 'Una prueba normal convive con síntomas que la contradicen.',
    cuerpo: 'Una boroscopia antigua o limitada informada como normal, seguida de síntomas nuevos, no cierra nada: manda repetir la inspección con el protocolo adecuado.',
  },
};

/* ── Eje 3: urgencia ─────────────────────────────────────────────────────── */
export const URGENCIA: Record<Urgencia, TextoEje> = {
  INFORMATION_ONLY: {
    etiqueta: 'Información y mantenimiento',
    resumen: 'Nada que corra prisa. Vigila la evolución y mantén el aceite al día.',
  },
  PPI_SCOPE_RECOMMENDED: {
    etiqueta: 'Incluye boroscopia en la inspección precompra',
    resumen: 'Antes de comprarlo, que la inspección incluya una boroscopia completa.',
  },
  BOOK_SPECIALIST_INSPECTION: {
    etiqueta: 'Solicita una revisión especializada',
    resumen: 'Hay algo que mirar. Puede tener otras causas, y por eso se mira.',
  },
  PROMPT_INSPECTION: {
    etiqueta: 'Revísalo cuanto antes',
    resumen: 'Los indicios justifican boroscopia y diagnóstico sin dejarlo pasar.',
  },
  MINIMIZE_USE_AND_CONTACT: {
    etiqueta: 'Reduce el uso y consúltanos antes de seguir',
    resumen: 'Conviene no acumular más daño hasta valorar el motor.',
  },
  REPAIR_PLANNING: {
    etiqueta: 'Valora reparación o reconstrucción',
    resumen: 'Con el diagnóstico hecho, toca decidir alcance y estrategia.',
  },
  INSUFFICIENT_DATA: {
    etiqueta: 'Falta un dato esencial',
    resumen: 'Sin identificar el motor no podemos decirte qué comprobación tiene sentido.',
  },
};

export const TECNOLOGIA: Record<Tecnologia, string> = {
  lokasil: 'Lokasil, cilindro de aluminio-silicio integrado',
  alusil: 'Alusil, bloque hipereutéctico',
  nikasil: 'Nikasil o recubrimiento equivalente',
  recubrimiento_proyectado: 'Recubrimiento férreo proyectado, APS o PTWA',
  hierro: 'Camisa o bloque de hierro',
  no_aplica_electrico: 'Sin cilindros de combustión',
  desconocida: 'Sin identificar',
};

export const CONFIANZA: Record<'alta' | 'media' | 'baja', string> = {
  alta: 'Alta: generación, versión y motor coherentes',
  media: 'Media: la clasificación es sólida, falta algún dato del motor',
  baja: 'Baja: falta identificar algo o los datos se contradicen',
};

/** Por que la herramienta ha llegado a este resultado. */
export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'El año no es válido.',
  ano_solapado: 'En ese año convivieron dos generaciones con motores distintos.',
  ano_de_matriculacion_en_frontera: 'Es un año de matriculación junto a un cambio de generación, y por ahí no se puede decidir.',
  modelo_y_ano_incompatibles: 'Ese modelo no se fabricaba ese año. No lo corregimos por nuestra cuenta.',
  falta_combustible: 'En un Cayenne, un Panamera o un Macan el combustible ordena todo lo demás.',
  falta_version: 'La versión separa arquitecturas distintas bajo el mismo nombre.',
  falta_cilindrada: 'La cilindrada es lo que separa dos grupos con historias muy diferentes.',
  sin_regla_para_esa_combinacion: 'No tenemos una regla validada para esa combinación.',
  reglas_en_conflicto: 'Dos reglas de la matriz encajan a la vez, así que preferimos no elegir por ti.',
  electrico_sin_cilindros: 'Un eléctrico no tiene cilindros de combustión.',
  originalidad_desconocida: 'No consta si el motor es el de fábrica.',
  motor_sustituido_sin_identificar: 'El motor fue sustituido y no está identificado: monta la especificación de cuando se fabricó, no la del año del chasis.',
  reconstruccion_sin_detalle: 'Consta una reconstrucción, pero no su alcance ni la tecnología instalada.',
  reconstruccion_cambia_tecnologia: 'La reconstrucción declarada cambia la tecnología del cilindro.',
  reconstruccion_misma_tecnologia: 'La reconstrucción declarada mantiene la tecnología original.',
  boroscopia_confirmada: 'Un especialista ha revisado o emitido el informe.',
  boroscopia_positiva_declarada: 'Declaras un informe positivo que no hemos revisado.',
  boroscopia_no_concluyente: 'La boroscopia no concluye o muestra marcas dudosas.',
  boroscopia_solo_por_bujias: 'Se accedió solo por los alojamientos de bujía, que en estos motores no llega a la zona crítica.',
  boroscopia_parcial: 'La inspección no cubrió todos los cilindros necesarios.',
  boroscopia_alcance_desconocido: 'No consta el alcance de la inspección.',
  boroscopia_negativa_contra_sintomas: 'Una prueba informada como normal convive con síntomas posteriores.',
  dos_familias_de_senal: 'Coinciden señales de dos familias independientes.',
  prueba_complementaria_sospechosa: 'Una prueba complementaria apunta a desgaste.',
  una_senal_inespecifica: 'Hay una señal aislada, compatible con varias causas.',
  // Reglas de la matriz. Se nombran por lo que dicen, no por su id.
  'regla_911-mezger': 'Turbo, GT2 y GT3 de esa generación usan motor Mezger, con Nikasil.',
  'regla_911-991-1-especificos': 'El Turbo y los GT no heredan la regla del Carrera.',
  'regla_911-pre-996': 'Los 911 anteriores al 996 quedan fuera de esta matriz.',
  'regla_911-996-1-carrera': '996.1 Carrera 3.4, con cilindros Lokasil.',
  'regla_911-996-2-carrera': '996.2 Carrera 3.6, uno de los grupos más citados.',
  'regla_911-997-1-carrera': '997.1 Carrera 3.6 y S 3.8, el grupo con más casos publicados.',
  'regla_911-997-2-carrera': '997.2 Carrera con 9A1/MA1 y Alusil.',
  'regla_911-991-1-carrera': '991.1 Carrera con 9A1/MA1 y Alusil.',
  'regla_911-991-2-carrera': '991.2 Carrera, con recubrimiento férreo proyectado.',
  'regla_911-992': 'Del 992 en adelante hay que confirmar la arquitectura del motor.',
  'regla_bc-986': 'Boxster 986, comparativamente menos citado.',
  'regla_bc-987-1-base': '987.1 de acceso, 2.7, comparativamente menos citado.',
  'regla_bc-987-1-s-3-2': '987.1 S con 3.2, anterior al 3.4.',
  'regla_bc-987-1-s-3-4': '987.1 S con 3.4, el grupo más citado de Boxster y Cayman.',
  'regla_bc-987-1-s-hasta-2006': 'El Boxster S 987.1 montó 3.2 hasta el año modelo 2006.',
  'regla_bc-987-1-s-desde-2007': 'El Boxster S 987.1 monta 3.4 desde el año modelo 2007.',
  'regla_bc-987-1-cayman-s': 'El Cayman S 987.1 monta 3.4 desde el primer año.',
  'regla_bc-987-2': '987.2 con 9A1/MA1 y Alusil.',
  'regla_bc-981': '981 con 9A1/MA1 y Alusil.',
  'regla_bc-981-especificos': 'Spyder y GT4 llevan un motor distinto al del resto del 981.',
  'regla_bc-718': '718 de cuatro cilindros, con recubrimiento férreo proyectado.',
  'regla_taycan': 'Un Taycan es eléctrico.',
  'regla_electrico': 'Con motor eléctrico no hay cilindros de combustión.',
  'regla_suv-diesel-hibrido': 'Un diésel o un híbrido sin identificar no se clasifica por el nombre.',
  'regla_cayenne-vr6': 'Cayenne con VR6, de bloque de hierro.',
  'regla_cayenne-v8-955-958-1': 'Cayenne V8 M48, con casos documentados.',
  'regla_cayenne-mct-958-2': 'Cayenne 3.6 MCT, Alusil con casos documentados.',
  'regla_cayenne-e3': 'Cayenne de tercera generación, con camisas de hierro o APS.',
  'regla_panamera-970': 'Panamera 970, Alusil con casos documentados.',
  'regla_panamera-970-base': 'En el 970 de acceso hay que identificar el motor.',
  'regla_panamera-971': 'Panamera 971, con camisas de hierro o APS.',
  'regla_macan-2-0': 'Macan 2.0 EA888, fuera del patrón Alusil clásico.',
  'regla_macan-v6-mct': 'Macan V6 MCT, Alusil con casos documentados.',
  'regla_macan-v6-ea839': 'Macan V6 EA839, con camisas de hierro.',
  'regla_otro-porsche': 'Ese Porsche no está en la matriz validada.',
};

/** Lo que hay que decir aunque no se pregunte. */
export const AVISOS: Record<string, string> = {
  menor_no_es_inmune: 'Menor susceptibilidad no es inmunidad: si aparecen síntomas, se revisa igual que en cualquier otro.',
  sin_indicios_no_es_sano: 'No haber declarado indicios no es un motor sano: el daño incipiente puede no dar señales.',
  negativa_es_de_esa_fecha: 'Una boroscopia normal describe esa fecha y esas superficies, no el futuro del motor.',
  no_declarar_solucionado: 'Una factura de reconstrucción sin alcance conocido no permite darlo por resuelto.',
  motor_sustituido: 'Al no ser el motor de fábrica, la susceptibilidad de la unidad depende del motor que monta ahora.',
  motor_sin_verificar: 'No consta si el motor es el de fábrica, así que la clasificación puede no corresponder a esta unidad.',
  ano_no_es_modelo: 'El año usado no es el año modelo, así que el resultado pierde precisión.',
  consumo_para_el_taller: 'El consumo que has anotado se guarda para enseñárselo al taller: no lo usamos para puntuar riesgo.',
};

export const ACCIONES: Record<string, string> = {
  vigilar_evolucion: 'Anota consumo, ruidos y humo con fechas: la tendencia vale más que una medición suelta.',
  mantenimiento_preventivo: 'Mantén al día el aceite y el filtro, y evita alargar los ciclos en frío.',
  boroscopia_en_precompra: 'Pide que la inspección precompra incluya una boroscopia completa, no solo por los alojamientos de bujía.',
  pedir_historial: 'Reúne facturas, análisis de aceite anteriores y cualquier informe previo del motor.',
  revision_especializada: 'Pide una revisión especializada que haga el diagnóstico diferencial: taqués, inyectores y escape dan síntomas parecidos.',
  preparar_datos: 'Lleva los datos ordenados: cuándo empezó, en frío o en caliente, litros añadidos y kilómetros entre aportaciones.',
  boroscopia_y_diagnostico: 'Reserva boroscopia y diagnóstico: es la vía para ver el cilindro y descartar otras causas.',
  reducir_uso: 'Reduce el uso hasta valorar el motor, y evita las series de aceleración fuerte.',
  valorar_reparacion: 'Valoramos causa, alcance y estrategia de reconstrucción antes de tocar nada.',
  enviar_informe: 'Comparte el informe y las imágenes con el taller para valorar el alcance real.',
  identificar_motor: 'Identifica el motor: la etiqueta del bloque, la documentación o una foto del código lo resuelven.',
};

/* La aclaracion NO es un resultado fallido: es un paso normal. Va junto al
   campo que hay que rellenar, en una linea, y no en una tarjeta de error. */
export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: {
    etiqueta: 'Generación',
    porque: 'Ese año convivieron dos generaciones con cilindros distintos.',
  },
  variante: {
    etiqueta: 'Versión',
    porque: 'Bajo el mismo nombre conviven arquitecturas de motor diferentes.',
  },
  combustible: {
    etiqueta: 'Motor',
    porque: 'En un Cayenne, un Panamera o un Macan, el nombre y el año no dicen qué motor lleva.',
  },
  cilindrada: {
    etiqueta: 'Cilindrada',
    porque: 'Es lo que separa dos grupos con historias muy distintas.',
  },
  ano_imposible: {
    etiqueta: 'Revisa el año o el modelo',
    porque: 'Ese modelo no se fabricaba ese año, y preferimos no corregirlo por nuestra cuenta.',
  },
};

/** Aviso fijo, siempre visible junto al resultado. */
export const AVISO = 'Resultado orientativo basado en la configuración de fábrica y en los datos que has declarado. La ausencia de síntomas no descarta daño incipiente y los síntomas descritos pueden tener otras causas. Solo una inspección boroscópica realizada e interpretada correctamente puede confirmar visualmente el bore scoring. Esta herramienta no sustituye una inspección mecánica.';

/** La regla de confirmacion, en un solo sitio y siempre a la vista. */
export const CONFIRMACION = 'Los síntomas pueden orientar, pero solo una inspección boroscópica adecuada permite confirmar visualmente el bore scoring.';

export const AFINAR = {
  titulo: 'Afinar el resultado con síntomas y pruebas',
  ayuda: 'Preguntas cortas sobre síntomas, pruebas e historial del motor. Con lo que sepas basta: «no lo sé» es una respuesta válida y no empeora el resultado.',
};

export const UI = {
  modelo: 'Modelo',
  ano: 'Año',
  anoAyuda: 'Si puedes, usa el año modelo. Puede no coincidir con la matriculación.',
  baseAno: 'Ese año es',
  calcular: 'Comprobar mi Porsche',
  situacion: '¿En qué situación estás?',
  ejeConfiguracion: 'Configuración del motor',
  ejeSusceptibilidad: 'Susceptibilidad del motor',
  ejeEvidencia: 'Información sobre esta unidad',
  ejeConfianza: 'Calidad de la identificación',
  siguientePaso: 'Qué haríamos ahora',
  porqueEsto: 'Por qué sale esto',
  aTenerEnCuenta: 'A tener en cuenta',
  deFabrica: 'De fábrica',
  motorActual: 'Motor que monta ahora',
  consumoDeclarado: 'Consumo declarado',
  consumoUnidad: 'l/1.000 km',
  fuentes: 'Fuentes',
  reglas: 'Reglas',
  ctaArticulo: 'Entender el bore scoring',
  ctaIms: 'Comprobar también el IMS',
  imsPuente: 'Este motor pertenece además a una generación que evalúa la calculadora IMS. Son dos comprobaciones distintas y no se combinan en una sola nota.',
  errorAno: 'Introduce un año entre 1948 y ' + (new Date().getFullYear() + 1) + '.',
  noLoSe: 'No lo sé',
  detallesConsumo: 'Si lo tienes anotado',
};

/** El CTA cambia con el resultado: se ofrece lo que toca, no siempre lo mismo. */
export const CTA: Record<Urgencia, string> = {
  INFORMATION_ONLY: 'Consultar mantenimiento preventivo',
  PPI_SCOPE_RECOMMENDED: 'Solicitar inspección precompra con boroscopia',
  BOOK_SPECIALIST_INSPECTION: 'Solicitar revisión especializada',
  PROMPT_INSPECTION: 'Reservar diagnóstico y boroscopia',
  MINIMIZE_USE_AND_CONTACT: 'Reservar diagnóstico y boroscopia',
  REPAIR_PLANNING: 'Valorar opciones de reparación',
  INSUFFICIENT_DATA: 'Ayúdanos a identificar el motor',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 o anterior',
  '996_1': '996.1',
  '996_2': '996.2',
  '997_1': '997.1',
  '997_2': '997.2',
  '991_1': '991.1',
  '991_2': '991.2',
  post_991: '992 o posterior',
  '986': '986',
  '987_1': '987.1',
  '987_2': '987.2',
  '981': '981',
  '718': '718',
  cayenne_955: '955 · 2003-2006',
  cayenne_957: '957 · 2008-2010',
  cayenne_958_1: '958.1 · 2011-2014',
  cayenne_958_2: '958.2 · 2015-2018',
  cayenne_e3: 'E3 · desde 2019',
  panamera_970: '970 · 2009-2016',
  panamera_971: '971 · desde 2017',
  macan_95b: '95B · 2014-2018',
  macan_95b_2: '95B · desde 2019',
  desconocida: 'No lo sé',
};

export const VARIANTE: Record<Variante, string> = {
  carrera: 'Carrera / Carrera 4',
  carrera_s: 'Carrera S / 4S / Targa',
  turbo: 'Turbo / Turbo S',
  gt2: 'GT2',
  gt3: 'GT3 / GT3 RS',
  base: 'Versión de acceso',
  s: 'S',
  gts: 'GTS',
  spyder_gt4: 'Spyder / GT4',
  otra: 'Otra',
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
  combustible: [
    { valor: 'gasolina', etiqueta: 'Gasolina' },
    { valor: 'diesel', etiqueta: 'Diésel' },
    { valor: 'hibrido', etiqueta: 'Híbrido' },
    { valor: 'electrico', etiqueta: 'Eléctrico' },
    { valor: 'desconocido', etiqueta: 'No lo sé' },
  ],
  situacion: [
    { valor: 'compra', etiqueta: 'Estoy valorando comprarlo' },
    { valor: 'propietario', etiqueta: 'Ya es mío' },
    { valor: 'sintoma', etiqueta: 'He observado un síntoma' },
    { valor: 'prueba', etiqueta: 'Ya tengo una prueba o diagnóstico' },
  ],
  originalidad: [
    { valor: 'original', etiqueta: 'Sí, el de fábrica' },
    { valor: 'sustituido', etiqueta: 'No, fue sustituido' },
    { valor: 'reconstruido', etiqueta: 'Fue reconstruido' },
    { valor: 'desconocida', etiqueta: 'No lo sé' },
  ],
  tecnologiaReconstruida: [
    { valor: '', etiqueta: 'No lo sé' },
    { valor: 'lokasil', etiqueta: 'La original' },
    { valor: 'alusil', etiqueta: 'Alusil reacondicionado' },
    { valor: 'hierro', etiqueta: 'Camisa de hierro' },
    { valor: 'nikasil', etiqueta: 'Nikasil o NSC' },
    { valor: 'recubrimiento_proyectado', etiqueta: 'Recubrimiento proyectado' },
  ],
};

/* ── Las preguntas del paso 2 ─────────────────────────────────────────────
   Cortas, con "no lo sé" siempre disponible, y con detalle solo cuando la
   respuesta lo pide. El orden es el de la conversacion en el taller. */
export interface PreguntaSintoma {
  campo: string;
  etiqueta: string;
  ayuda?: string;
  opciones: { valor: string; etiqueta: string }[];
}

export const SINTOMAS: PreguntaSintoma[] = [
  {
    campo: 'consumoAceite',
    etiqueta: '¿Ha aumentado el consumo de aceite?',
    ayuda: 'Comparado con lo habitual en este coche, no con una cifra de catálogo.',
    opciones: [
      { valor: 'estable', etiqueta: 'No, se mantiene' },
      { valor: 'aumenta', etiqueta: 'Sí, ha aumentado' },
      { valor: 'no_lo_se', etiqueta: 'No puedo saberlo' },
    ],
  },
  {
    campo: 'golpeteo',
    etiqueta: '¿Se escucha un golpeteo rítmico en el motor?',
    ayuda: 'El «tic-tic» solo en frío lo hacen también taqués e inyectores.',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'solo_frio', etiqueta: 'Solo en frío' },
      { valor: 'frio_y_caliente', etiqueta: 'También en caliente' },
      { valor: 'no_lo_se', etiqueta: 'No lo sé' },
    ],
  },
  {
    campo: 'humo',
    etiqueta: '¿Emite humo visible?',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'bocanada_arranque', etiqueta: 'Una bocanada ocasional al arrancar' },
      { valor: 'arranque_repetido', etiqueta: 'Repetido al arrancar' },
      { valor: 'en_marcha', etiqueta: 'Al ralentí o circulando' },
      { valor: 'no_lo_se', etiqueta: 'No lo sé' },
    ],
  },
  {
    campo: 'hollin',
    etiqueta: '¿Una salida de escape acumula más hollín aceitoso que la otra?',
    ayuda: 'Solo sirve donde cada salida corresponde a una bancada.',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'asimetrico', etiqueta: 'Sí, una mucho más' },
      { valor: 'ambas', etiqueta: 'Ambas por igual' },
      { valor: 'no_comparable', etiqueta: 'El escape no permite compararlo' },
      { valor: 'no_lo_se', etiqueta: 'No lo sé' },
    ],
  },
  {
    campo: 'fallosCombustion',
    etiqueta: '¿Hay fallos de encendido o testigo de motor?',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'codigo_guardado', etiqueta: 'Un fallo registrado sin causa conocida' },
      { valor: 'activo', etiqueta: 'Fallo activo o bujía aceitosa' },
      { valor: 'no_lo_se', etiqueta: 'No lo sé' },
    ],
  },
];

export const PRUEBAS: PreguntaSintoma[] = [
  {
    campo: 'boroscopia',
    etiqueta: '¿Existe una boroscopia reciente?',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'normal', etiqueta: 'Sí, informada como normal' },
      { valor: 'no_concluyente', etiqueta: 'Sí, limitada o no concluyente' },
      { valor: 'dudosa', etiqueta: 'Sí, con marcas dudosas' },
      { valor: 'positiva', etiqueta: 'Sí, con bore scoring diagnosticado' },
    ],
  },
  {
    campo: 'analisisAceite',
    etiqueta: '¿Hay análisis de aceite?',
    ayuda: 'Una sola muestra no confirma ni descarta nada; la tendencia sí dice algo.',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'una_normal', etiqueta: 'Una muestra normal' },
      { valor: 'serie_estable', etiqueta: 'Una serie estable' },
      { valor: 'una_anomala', etiqueta: 'Una muestra con metales altos' },
      { valor: 'tendencia_creciente', etiqueta: 'Tendencia creciente de aluminio, hierro o silicio' },
      { valor: 'no_lo_se', etiqueta: 'No lo sé' },
    ],
  },
  {
    campo: 'compresionLeakdown',
    etiqueta: '¿Se ha medido compresión o leak-down?',
    opciones: [
      { valor: 'no', etiqueta: 'No' },
      { valor: 'normal', etiqueta: 'Sí, con lectura normal' },
      { valor: 'anomala', etiqueta: 'Sí, con lectura anormal' },
      { valor: 'no_lo_se', etiqueta: 'No lo sé' },
    ],
  },
];

/** Detalle de la boroscopia: solo si se ha declarado una. */
export const BOROSCOPIA_DETALLE: PreguntaSintoma[] = [
  {
    campo: 'viaBoroscopia',
    etiqueta: 'Vía de acceso',
    ayuda: 'En M96/M97, solo por los alojamientos de bujía no se llega a la zona crítica.',
    opciones: [
      { valor: 'bujias', etiqueta: 'Por las bujías' },
      { valor: 'carter', etiqueta: 'Por el cárter' },
      { valor: 'ambas', etiqueta: 'Por ambas' },
      { valor: 'no_lo_se', etiqueta: 'No lo sé' },
    ],
  },
  {
    campo: 'calidadBoroscopia',
    etiqueta: 'Alcance',
    opciones: [
      { valor: 'completa', etiqueta: 'Todos los cilindros' },
      { valor: 'parcial', etiqueta: 'Solo algunos' },
      { valor: 'desconocida', etiqueta: 'No lo sé' },
    ],
  },
  {
    campo: 'sintomasNuevosDesdeBoroscopia',
    etiqueta: '¿Han aparecido síntomas nuevos desde entonces?',
    opciones: [
      { valor: '', etiqueta: 'No' },
      { valor: 'si', etiqueta: 'Sí' },
    ],
  },
];

/** Historial del motor. Cambia la susceptibilidad ACTUAL, no la de fabrica. */
export const HISTORIAL: PreguntaSintoma = {
  campo: 'originalidadMotor',
  etiqueta: '¿Conserva el motor original?',
  opciones: OPCIONES.originalidad,
};
