import type { Evidencia, Susceptibilidad, Tecnologia, Urgencia, Variante } from './tipos.ts';
import type { TextoEje, PreguntaSintoma } from './textos.es.ts';

/** Bore scoring evaluator texts, English. Same shape as textos.es.ts. */

export const SUSCEPTIBILIDAD: Record<Susceptibilidad, TextoEje> = {
  ELEVATED_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Elevated in this family',
    resumen: 'It is one of the groups specialists most often find among affected engines.',
    cuerpo: 'This configuration belongs to one of the groups that appear most often in the published experience of the workshops that rebuild these engines. That describes a family, not this car: it does not mean it has damage and does not allow an individual probability to be calculated.',
  },
  DOCUMENTED_SUSCEPTIBILITY: {
    etiqueta: 'Documented cases',
    resumen: 'There are described cases and a compatible architecture, without reaching the most affected M96/M97 group.',
    cuerpo: 'There are published cases and the cylinder architecture is compatible with the damage, but this configuration should not automatically be equated with the M96/M97 engines that concentrate the greatest concern.',
  },
  LOWER_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Comparatively low',
    resumen: 'This version appears less often in the published technical experience.',
    cuerpo: 'It appears less often than its larger-capacity siblings in what specialists publish. Lower is not impossible: if there are symptoms, it is checked all the same.',
  },
  LOWER_BY_BORE_TECHNOLOGY: {
    etiqueta: 'Technology less associated',
    resumen: 'The cylinder does not share the classic Lokasil and Alusil pattern assessed here.',
    cuerpo: 'According to the identification provided, the engine uses Nikasil, a sprayed iron coating or iron liners and block. It does not share the main pattern this tool assesses, which does not guarantee the condition of any cylinder or rule out other wear.',
  },
  ENGINE_SPECIFIC_CLASSIFICATION: {
    etiqueta: 'The engine must be identified',
    resumen: 'In this model and year different architectures coexisted.',
    cuerpo: 'With what has been provided so far, different architectures coexist under the same commercial name. The version, the displacement or the engine code is needed: classifying without it would be a misleading answer.',
  },
  OUTSIDE_VALIDATED_SCOPE: {
    etiqueta: 'Outside the validated matrix',
    resumen: 'We do not have a sufficiently reliable rule for this configuration.',
    cuerpo: 'This tool covers the 911 from the 996, Boxster and Cayman, and Cayenne, Panamera and Macan with an identifiable engine. For the rest there is no rule we can stand behind, and a generic green zone would be worse than saying nothing. If there are symptoms, they must be assessed all the same.',
  },
  NOT_APPLICABLE_ELECTRIC: {
    etiqueta: 'Not applicable',
    resumen: 'An electric vehicle has no combustion cylinders.',
    cuerpo: 'Without combustion cylinders this failure cannot exist.',
  },
};

export const EVIDENCIA: Record<Evidencia, TextoEje> = {
  NO_EVIDENCE_REPORTED: {
    etiqueta: 'No signs reported',
    resumen: 'No symptoms or tests reported. That is not the same as a healthy engine.',
    cuerpo: 'No symptoms or suspicious tests have been reported. That is all that can be stated: incipient damage can exist without giving signs noticeable from the seat.',
  },
  ONE_NON_SPECIFIC_SIGNAL: {
    etiqueta: 'One isolated sign',
    resumen: 'There is a symptom that may have other causes.',
    cuerpo: 'A single symptom, with nothing accompanying it, admits many explanations: lifters, injectors, an exhaust leak or cold starting itself. It is worth watching whether it persists or whether another appears.',
  },
  MULTIPLE_COMPATIBLE_SIGNALS: {
    etiqueta: 'Several compatible signs',
    resumen: 'Signs from two independent families coincide.',
    cuerpo: 'Signs from different families concur, for example rising consumption and a rhythmic knock, or asymmetric soot with an oily spark plug. The coincidence justifies a borescope inspection and a diagnosis, not a diagnosis on its own.',
  },
  SUPPORTING_TEST_SUSPICIOUS: {
    etiqueta: 'A suspicious test',
    resumen: 'A supporting test points to wear, without confirming it visually.',
    cuerpo: 'Oil analysis, compression, leak-down or what was found in the filter support the suspicion. Support: confirmation remains visual.',
  },
  NEGATIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Borescope reported as normal',
    resumen: 'It describes what was seen that day and on those surfaces.',
    cuerpo: 'A complete and recent borescope inspection reported as normal is bounded good news: it describes the condition observed on that date and in the areas that could be seen. The family’s susceptibility does not change because of it.',
  },
  LIMITED_OR_INCONCLUSIVE_BORESCOPE: {
    etiqueta: 'Limited or inconclusive borescope',
    resumen: 'The inspection does not allow the engine to be passed as good.',
    cuerpo: 'The test did not cover the critical areas, did not reach all the necessary cylinders or the report does not conclude. On an M96/M97, access through the spark plug holes alone leaves out precisely where scoring usually begins.',
  },
  POSITIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Positive borescope declared',
    resumen: 'You declare a positive report that we have not reviewed.',
    cuerpo: 'We take the report for what it is: a declaration. Before talking about extent and options, a specialist should review the images or the engine.',
  },
  CONFIRMED_BY_SPECIALIST: {
    etiqueta: 'Confirmed by a specialist',
    resumen: 'There is a professional report confirming it.',
    cuerpo: 'With a professional diagnosis, the conversation stops being whether it exists and becomes the extent, the cause and the rebuild strategy.',
  },
  CONFLICTING_EVIDENCE: {
    etiqueta: 'Conflicting information',
    resumen: 'A normal test coexists with symptoms that contradict it.',
    cuerpo: 'An old or limited borescope inspection reported as normal, followed by new symptoms, closes nothing: it calls for repeating the inspection with the proper protocol.',
  },
};

export const URGENCIA: Record<Urgencia, TextoEje> = {
  INFORMATION_ONLY: { etiqueta: 'Information and maintenance', resumen: 'Nothing urgent. Watch how it evolves and keep the oil up to date.' },
  PPI_SCOPE_RECOMMENDED: { etiqueta: 'Include a borescope in the pre-purchase inspection', resumen: 'Before buying it, make sure the inspection includes a complete borescope check.' },
  BOOK_SPECIALIST_INSPECTION: { etiqueta: 'Book a specialist check', resumen: 'There is something to look at. It may have other causes, which is why it is looked at.' },
  PROMPT_INSPECTION: { etiqueta: 'Have it checked as soon as possible', resumen: 'The signs justify a borescope inspection and diagnosis without letting it go.' },
  MINIMIZE_USE_AND_CONTACT: { etiqueta: 'Reduce use and contact us before going on', resumen: 'Best not to accumulate more damage until the engine is assessed.' },
  REPAIR_PLANNING: { etiqueta: 'Consider repair or rebuild', resumen: 'With the diagnosis made, it is time to decide extent and strategy.' },
  INSUFFICIENT_DATA: { etiqueta: 'An essential detail is missing', resumen: 'Without identifying the engine we cannot tell you which check makes sense.' },
};

export const TECNOLOGIA: Record<Tecnologia, string> = {
  lokasil: 'Lokasil, integrated aluminium-silicon cylinder',
  alusil: 'Alusil, hypereutectic block',
  nikasil: 'Nikasil or equivalent coating',
  recubrimiento_proyectado: 'Sprayed iron coating, APS or PTWA',
  hierro: 'Iron liner or block',
  no_aplica_electrico: 'No combustion cylinders',
  desconocida: 'Unidentified',
};

export const CONFIANZA: Record<'alta' | 'media' | 'baja', string> = {
  alta: 'High: generation, version and engine consistent',
  media: 'Medium: the classification is solid, some engine detail is missing',
  baja: 'Low: something is unidentified or the data conflict',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'The year is not valid.',
  ano_solapado: 'In that year two generations with different engines coexisted.',
  ano_de_matriculacion_en_frontera: 'It is a registration year next to a generation change, and that cannot be decided from it.',
  modelo_y_ano_incompatibles: 'That model was not built that year. We do not correct it on our own.',
  falta_combustible: 'On a Cayenne, a Panamera or a Macan the fuel determines everything else.',
  falta_version: 'The version separates different architectures under the same name.',
  falta_cilindrada: 'Displacement is what separates two groups with very different histories.',
  sin_regla_para_esa_combinacion: 'We do not have a validated rule for that combination.',
  reglas_en_conflicto: 'Two rules in the matrix fit at once, so we prefer not to choose for you.',
  electrico_sin_cilindros: 'An electric car has no combustion cylinders.',
  originalidad_desconocida: 'It is not known whether the engine is the factory one.',
  motor_sustituido_sin_identificar: 'The engine was replaced and is not identified: it carries the specification of when it was built, not that of the chassis year.',
  reconstruccion_sin_detalle: 'A rebuild is on record, but not its extent or the technology installed.',
  reconstruccion_cambia_tecnologia: 'The declared rebuild changes the cylinder technology.',
  reconstruccion_misma_tecnologia: 'The declared rebuild keeps the original technology.',
  boroscopia_confirmada: 'A specialist has reviewed or issued the report.',
  boroscopia_positiva_declarada: 'You declare a positive report that we have not reviewed.',
  boroscopia_no_concluyente: 'The borescope inspection does not conclude or shows doubtful marks.',
  boroscopia_solo_por_bujias: 'Access was only through the spark plug holes, which on these engines does not reach the critical area.',
  boroscopia_parcial: 'The inspection did not cover all the necessary cylinders.',
  boroscopia_alcance_desconocido: 'The extent of the inspection is not on record.',
  boroscopia_negativa_contra_sintomas: 'A test reported as normal coexists with later symptoms.',
  dos_familias_de_senal: 'Signs from two independent families coincide.',
  prueba_complementaria_sospechosa: 'A supporting test points to wear.',
  una_senal_inespecifica: 'There is an isolated sign, compatible with several causes.',
  'regla_911-mezger': 'Turbo, GT2 and GT3 of that generation use the Mezger engine, with Nikasil.',
  'regla_911-991-1-especificos': 'The Turbo and the GT cars do not inherit the Carrera rule.',
  'regla_911-pre-996': '911s before the 996 are outside this matrix.',
  'regla_911-996-1-carrera': '996.1 Carrera 3.4, with Lokasil cylinders.',
  'regla_911-996-2-carrera': '996.2 Carrera 3.6, one of the most cited groups.',
  'regla_911-997-1-carrera': '997.1 Carrera 3.6 and S 3.8, the group with the most published cases.',
  'regla_911-997-2-carrera': '997.2 Carrera with 9A1/MA1 and Alusil.',
  'regla_911-991-1-carrera': '991.1 Carrera with 9A1/MA1 and Alusil.',
  'regla_911-991-2-carrera': '991.2 Carrera, with sprayed iron coating.',
  'regla_911-992': 'From the 992 onwards the engine architecture has to be confirmed.',
  'regla_bc-986': 'Boxster 986, comparatively less cited.',
  'regla_bc-987-1-base': 'Entry-level 987.1, 2.7, comparatively less cited.',
  'regla_bc-987-1-s-3-2': '987.1 S with 3.2, before the 3.4.',
  'regla_bc-987-1-s-3-4': '987.1 S with 3.4, the most cited Boxster and Cayman group.',
  'regla_bc-987-1-s-hasta-2006': 'The 987.1 Boxster S carried the 3.2 up to model year 2006.',
  'regla_bc-987-1-s-desde-2007': 'The 987.1 Boxster S carries the 3.4 from model year 2007.',
  'regla_bc-987-1-cayman-s': 'The 987.1 Cayman S carries the 3.4 from its first year.',
  'regla_bc-987-2': '987.2 with 9A1/MA1 and Alusil.',
  'regla_bc-981': '981 with 9A1/MA1 and Alusil.',
  'regla_bc-981-especificos': 'Spyder and GT4 carry a different engine from the rest of the 981.',
  'regla_bc-718': 'Four-cylinder 718, with sprayed iron coating.',
  'regla_taycan': 'A Taycan is electric.',
  'regla_electrico': 'With an electric motor there are no combustion cylinders.',
  'regla_suv-diesel-hibrido': 'An unidentified diesel or hybrid is not classified by name.',
  'regla_cayenne-vr6': 'Cayenne with VR6, iron block.',
  'regla_cayenne-v8-955-958-1': 'Cayenne V8 M48, with documented cases.',
  'regla_cayenne-mct-958-2': 'Cayenne 3.6 MCT, Alusil with documented cases.',
  'regla_cayenne-e3': 'Third-generation Cayenne, with iron liners or APS.',
  'regla_panamera-970': 'Panamera 970, Alusil with documented cases.',
  'regla_panamera-970-base': 'On the entry-level 970 the engine has to be identified.',
  'regla_panamera-971': 'Panamera 971, with iron liners or APS.',
  'regla_macan-2-0': 'Macan 2.0 EA888, outside the classic Alusil pattern.',
  'regla_macan-v6-mct': 'Macan V6 MCT, Alusil with documented cases.',
  'regla_macan-v6-ea839': 'Macan V6 EA839, with iron liners.',
  'regla_otro-porsche': 'That Porsche is not in the validated matrix.',
};

export const AVISOS: Record<string, string> = {
  menor_no_es_inmune: 'Lower susceptibility is not immunity: if symptoms appear, it is checked like any other.',
  sin_indicios_no_es_sano: 'Not having reported signs is not a healthy engine: incipient damage may give no signs.',
  negativa_es_de_esa_fecha: 'A normal borescope describes that date and those surfaces, not the engine’s future.',
  no_declarar_solucionado: 'A rebuild invoice with unknown extent does not allow it to be considered solved.',
  motor_sustituido: 'As it is not the factory engine, the car’s susceptibility depends on the engine it carries now.',
  motor_sin_verificar: 'It is not known whether the engine is the factory one, so the classification may not correspond to this car.',
  ano_no_es_modelo: 'The year used is not the model year, so the result loses precision.',
  consumo_para_el_taller: 'The consumption you noted is kept to show the workshop: we do not use it to score risk.',
};

export const ACCIONES: Record<string, string> = {
  vigilar_evolucion: 'Note consumption, noises and smoke with dates: the trend is worth more than a single reading.',
  mantenimiento_preventivo: 'Keep the oil and filter up to date, and avoid extending cold cycles.',
  boroscopia_en_precompra: 'Ask for the pre-purchase inspection to include a complete borescope check, not only through the spark plug holes.',
  pedir_historial: 'Gather invoices, previous oil analyses and any earlier engine report.',
  revision_especializada: 'Ask for a specialist check that does the differential diagnosis: lifters, injectors and exhaust give similar symptoms.',
  preparar_datos: 'Bring the data in order: when it started, cold or hot, litres added and kilometres between top-ups.',
  boroscopia_y_diagnostico: 'Book a borescope inspection and diagnosis: it is the way to see the cylinder and rule out other causes.',
  reducir_uso: 'Reduce use until the engine is assessed, and avoid hard acceleration runs.',
  valorar_reparacion: 'We assess cause, extent and rebuild strategy before touching anything.',
  enviar_informe: 'Share the report and images with the workshop to assess the real extent.',
  identificar_motor: 'Identify the engine: the block label, the paperwork or a photo of the code settles it.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generation', porque: 'That year two generations with different cylinders coexisted.' },
  variante: { etiqueta: 'Version', porque: 'Under the same name different engine architectures coexist.' },
  combustible: { etiqueta: 'Engine', porque: 'On a Cayenne, a Panamera or a Macan, the name and the year do not say which engine it carries.' },
  cilindrada: { etiqueta: 'Displacement', porque: 'It is what separates two groups with very different histories.' },
  ano_imposible: { etiqueta: 'Check the year or the model', porque: 'That model was not built that year, and we prefer not to correct it on our own.' },
};

export const AVISO = 'Indicative result based on the factory configuration and on the data you have declared. The absence of symptoms does not rule out incipient damage and the symptoms described may have other causes. Only a borescope inspection performed and interpreted correctly can visually confirm bore scoring. This tool does not replace a mechanical inspection.';

export const CONFIRMACION = 'Symptoms can guide, but only a proper borescope inspection allows bore scoring to be confirmed visually.';

export const AFINAR = {
  titulo: 'Refine the result with symptoms and tests',
  ayuda: 'Short questions about symptoms, tests and the engine’s history. What you know is enough: “I don’t know” is a valid answer and does not worsen the result.',
};

export const UI = {
  modelo: 'Model',
  ano: 'Year',
  anoAyuda: 'If you can, use the model year. It may not match the registration.',
  baseAno: 'That year is',
  calcular: 'Check my Porsche',
  situacion: 'What is your situation?',
  ejeConfiguracion: 'Engine configuration',
  ejeSusceptibilidad: 'Engine susceptibility',
  ejeEvidencia: 'Information about this car',
  ejeConfianza: 'Quality of the identification',
  siguientePaso: 'What we would do now',
  porqueEsto: 'Why this result',
  aTenerEnCuenta: 'Bear in mind',
  deFabrica: 'From the factory',
  motorActual: 'Engine it carries now',
  consumoDeclarado: 'Declared consumption',
  consumoUnidad: 'l/1,000 km',
  fuentes: 'Sources',
  reglas: 'Rules',
  ctaArticulo: 'Understand bore scoring',
  ctaIms: 'Also check the IMS',
  imsPuente: 'This engine also belongs to a generation assessed by the IMS calculator. They are two separate checks and are not combined into one score.',
  errorAno: 'Enter a year between 1948 and ' + (new Date().getFullYear() + 1) + '.',
  noLoSe: 'I don’t know',
  detallesConsumo: 'If you have it noted',
};

export const CTA: Record<Urgencia, string> = {
  INFORMATION_ONLY: 'See preventive maintenance',
  PPI_SCOPE_RECOMMENDED: 'Request a pre-purchase inspection with borescope',
  BOOK_SPECIALIST_INSPECTION: 'Request a specialist check',
  PROMPT_INSPECTION: 'Book diagnosis and borescope',
  MINIMIZE_USE_AND_CONTACT: 'Book diagnosis and borescope',
  REPAIR_PLANNING: 'Assess repair options',
  INSUFFICIENT_DATA: 'Help us identify the engine',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 or earlier', '996_1': '996.1', '996_2': '996.2', '997_1': '997.1', '997_2': '997.2',
  '991_1': '991.1', '991_2': '991.2', post_991: '992 or later', '986': '986', '987_1': '987.1', '987_2': '987.2',
  '981': '981', '718': '718',
  cayenne_955: '955 · 2003-2006', cayenne_957: '957 · 2008-2010', cayenne_958_1: '958.1 · 2011-2014',
  cayenne_958_2: '958.2 · 2015-2018', cayenne_e3: 'E3 · from 2019',
  panamera_970: '970 · 2009-2016', panamera_971: '971 · from 2017',
  macan_95b: '95B · 2014-2018', macan_95b_2: '95B · from 2019',
  desconocida: 'I don’t know',
};

export const VARIANTE: Record<Variante, string> = {
  carrera: 'Carrera / Carrera 4', carrera_s: 'Carrera S / 4S / Targa', turbo: 'Turbo / Turbo S', gt2: 'GT2',
  gt3: 'GT3 / GT3 RS', base: 'Entry-level version', s: 'S', gts: 'GTS', spyder_gt4: 'Spyder / GT4',
  otra: 'Other', desconocida: 'I don’t know',
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
  combustible: [
    { valor: 'gasolina', etiqueta: 'Petrol' }, { valor: 'diesel', etiqueta: 'Diesel' }, { valor: 'hibrido', etiqueta: 'Hybrid' },
    { valor: 'electrico', etiqueta: 'Electric' }, { valor: 'desconocido', etiqueta: 'I don’t know' },
  ],
  situacion: [
    { valor: 'compra', etiqueta: 'I am considering buying it' }, { valor: 'propietario', etiqueta: 'It is already mine' },
    { valor: 'sintoma', etiqueta: 'I have noticed a symptom' }, { valor: 'prueba', etiqueta: 'I already have a test or diagnosis' },
  ],
  originalidad: [
    { valor: 'original', etiqueta: 'Yes, the factory one' }, { valor: 'sustituido', etiqueta: 'No, it was replaced' },
    { valor: 'reconstruido', etiqueta: 'It was rebuilt' }, { valor: 'desconocida', etiqueta: 'I don’t know' },
  ],
  tecnologiaReconstruida: [
    { valor: '', etiqueta: 'I don’t know' }, { valor: 'lokasil', etiqueta: 'The original' }, { valor: 'alusil', etiqueta: 'Reconditioned Alusil' },
    { valor: 'hierro', etiqueta: 'Iron liner' }, { valor: 'nikasil', etiqueta: 'Nikasil or NSC' }, { valor: 'recubrimiento_proyectado', etiqueta: 'Sprayed coating' },
  ],
};

export const SINTOMAS: PreguntaSintoma[] = [
  { campo: 'consumoAceite', etiqueta: 'Has oil consumption increased?', ayuda: 'Compared with what is usual for this car, not with a catalogue figure.',
    opciones: [{ valor: 'estable', etiqueta: 'No, it is stable' }, { valor: 'aumenta', etiqueta: 'Yes, it has increased' }, { valor: 'no_lo_se', etiqueta: 'I cannot tell' }] },
  { campo: 'golpeteo', etiqueta: 'Is there a rhythmic knock from the engine?', ayuda: 'A “tick-tick” only when cold is also made by lifters and injectors.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'solo_frio', etiqueta: 'Only when cold' }, { valor: 'frio_y_caliente', etiqueta: 'Also when warm' }, { valor: 'no_lo_se', etiqueta: 'I don’t know' }] },
  { campo: 'humo', etiqueta: 'Does it emit visible smoke?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'bocanada_arranque', etiqueta: 'An occasional puff on start-up' }, { valor: 'arranque_repetido', etiqueta: 'Repeatedly on start-up' }, { valor: 'en_marcha', etiqueta: 'At idle or while driving' }, { valor: 'no_lo_se', etiqueta: 'I don’t know' }] },
  { campo: 'hollin', etiqueta: 'Does one exhaust outlet collect more oily soot than the other?', ayuda: 'Only useful where each outlet corresponds to one bank.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'asimetrico', etiqueta: 'Yes, one much more' }, { valor: 'ambas', etiqueta: 'Both equally' }, { valor: 'no_comparable', etiqueta: 'The exhaust does not allow comparison' }, { valor: 'no_lo_se', etiqueta: 'I don’t know' }] },
  { campo: 'fallosCombustion', etiqueta: 'Are there misfires or an engine warning light?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'codigo_guardado', etiqueta: 'A stored fault without known cause' }, { valor: 'activo', etiqueta: 'Active fault or oily spark plug' }, { valor: 'no_lo_se', etiqueta: 'I don’t know' }] },
];

export const PRUEBAS: PreguntaSintoma[] = [
  { campo: 'boroscopia', etiqueta: 'Is there a recent borescope inspection?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'normal', etiqueta: 'Yes, reported as normal' }, { valor: 'no_concluyente', etiqueta: 'Yes, limited or inconclusive' }, { valor: 'dudosa', etiqueta: 'Yes, with doubtful marks' }, { valor: 'positiva', etiqueta: 'Yes, with bore scoring diagnosed' }] },
  { campo: 'analisisAceite', etiqueta: 'Is there an oil analysis?', ayuda: 'A single sample neither confirms nor rules out anything; the trend does say something.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'una_normal', etiqueta: 'One normal sample' }, { valor: 'serie_estable', etiqueta: 'A stable series' }, { valor: 'una_anomala', etiqueta: 'One sample with high metals' }, { valor: 'tendencia_creciente', etiqueta: 'Rising trend of aluminium, iron or silicon' }, { valor: 'no_lo_se', etiqueta: 'I don’t know' }] },
  { campo: 'compresionLeakdown', etiqueta: 'Has compression or leak-down been measured?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'normal', etiqueta: 'Yes, with a normal reading' }, { valor: 'anomala', etiqueta: 'Yes, with an abnormal reading' }, { valor: 'no_lo_se', etiqueta: 'I don’t know' }] },
];

export const BOROSCOPIA_DETALLE: PreguntaSintoma[] = [
  { campo: 'viaBoroscopia', etiqueta: 'Access route', ayuda: 'On M96/M97, through the spark plug holes alone the critical area is not reached.',
    opciones: [{ valor: 'bujias', etiqueta: 'Through the spark plugs' }, { valor: 'carter', etiqueta: 'Through the sump' }, { valor: 'ambas', etiqueta: 'Through both' }, { valor: 'no_lo_se', etiqueta: 'I don’t know' }] },
  { campo: 'calidadBoroscopia', etiqueta: 'Extent',
    opciones: [{ valor: 'completa', etiqueta: 'All cylinders' }, { valor: 'parcial', etiqueta: 'Only some' }, { valor: 'desconocida', etiqueta: 'I don’t know' }] },
  { campo: 'sintomasNuevosDesdeBoroscopia', etiqueta: 'Have new symptoms appeared since then?',
    opciones: [{ valor: '', etiqueta: 'No' }, { valor: 'si', etiqueta: 'Yes' }] },
];

export const HISTORIAL: PreguntaSintoma = {
  campo: 'originalidadMotor', etiqueta: 'Does it keep the original engine?', opciones: OPCIONES.originalidad,
};

export const PAGINA = {
  titulo: 'Porsche bore scoring calculator by model and year · Valentin Motors',
  descripcion: 'Select model, year and engine to learn its susceptibility to cylinder scoring and when a borescope inspection is worthwhile.',
  eyebrow: 'Tool',
  h1: 'Can your Porsche suffer bore scoring?',
  intro: 'Select model and year to learn your engine’s susceptibility. Then you can add symptoms or tests to find out which check makes sense.',
  explicacionTitulo: 'What a borescope inspection confirms, and what it does not',
  explicacion: [
    'Bore scoring is physical damage to the cylinder wall and the piston skirt. It is not a factory part that can be deduced from model and year: it is acquired with use, can start quickly and worsen afterwards. That is why this tool separates what is known about a family of engines from what is known about your car.',
    'Confirmation is visual. A borescope inspection done properly goes in where it should, covers all the necessary cylinders and is interpreted by someone who can tell a score from a reflection or a carbon deposit. On the M96 and M97, access through the spark plug holes alone leaves out precisely the area where scoring usually begins: such a test, reported as normal, does not allow the engine to be passed as good.',
    'Symptoms guide and supporting tests back it up, but none confirms. Oil consumption, rhythmic knock, asymmetric soot or a misfire have other possible causes: lifters, injectors, an exhaust leak, worn rings without scoring. Differential diagnosis is part of the job, not a formality.',
    'Nor is there a cure by additive or by thicker oil. When scoring is confirmed, the conversation is about extent: which cylinders, with which technology they are rebuilt and what warranty it carries. That is decided with the engine in front of us.',
  ],
  faqTitulo: 'Frequently asked questions',
  faq: [
    ['Can this tool tell me whether my car has bore scoring?', 'No, and none that uses only model and year can. It tells you whether its configuration belongs to a group with more published cases, what the signs you provide say, and which check makes sense now.'],
    ['Are all 997.1s and Cayman S 3.4s affected?', 'No. They are the groups that appear most in specialists’ experience, which is a different thing. There are many healthy cars with many miles.'],
    ['Are Porsches from 2009 free of it?', 'No. The 997.2 and 987.2 left the classic IMS behind, but their 9A1/MA1 engines with Alusil also have documented cases of scoring.'],
    ['Does a 2.5, 2.7 or 3.2 never fail?', 'They appear far less in what is published. Less is not never: if there are symptoms, they are checked like any other.'],
    ['My borescope came back normal, can I forget about it?', 'It describes what was seen that day and on the surfaces that could be seen. If the test was partial, or if new symptoms have appeared since, it is worth repeating with the proper protocol.'],
    ['Is oil analysis useful?', 'As support, and above all in series. A single normal sample rules out nothing, and a single high sample confirms nothing. What says something is the trend of aluminium, iron and silicon over time.'],
  ],
  revisadas: 'reviewed on',
};
