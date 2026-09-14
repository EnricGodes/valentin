import type { Evidencia, Susceptibilidad, Tecnologia, Urgencia, Variante } from './tipos.ts';
import type { TextoEje, PreguntaSintoma } from './textos.es.ts';

/** Testi del valutatore di bore scoring, italiano. Stessa forma di textos.es.ts. */

export const SUSCEPTIBILIDAD: Record<Susceptibilidad, TextoEje> = {
  ELEVATED_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Elevata in questa famiglia',
    resumen: 'È uno dei gruppi che gli specialisti trovano più spesso tra i motori interessati.',
    cuerpo: 'Questa configurazione appartiene a uno dei gruppi che compaiono più spesso nell’esperienza pubblicata delle officine che ricostruiscono questi motori. Descrive una famiglia, non questa vettura: non significa che sia danneggiata né consente di calcolare una probabilità individuale.',
  },
  DOCUMENTED_SUSCEPTIBILITY: {
    etiqueta: 'Casi documentati',
    resumen: 'Ci sono casi descritti e un’architettura compatibile, senza arrivare al gruppo M96/M97 più colpito.',
    cuerpo: 'Esistono casi pubblicati e l’architettura del cilindro è compatibile con il danno, ma questa configurazione non va equiparata automaticamente ai M96/M97 che concentrano la maggiore preoccupazione.',
  },
  LOWER_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Comparativamente bassa',
    resumen: 'Questa versione compare meno spesso nell’esperienza tecnica pubblicata.',
    cuerpo: 'Compare meno spesso delle sorelle di cilindrata maggiore in ciò che pubblicano gli specialisti. Meno non è impossibile: se ci sono sintomi, si controlla comunque.',
  },
  LOWER_BY_BORE_TECHNOLOGY: {
    etiqueta: 'Tecnologia meno associata',
    resumen: 'Il cilindro non condivide lo schema classico Lokasil e Alusil valutato qui.',
    cuerpo: 'Secondo l’identificazione fornita, il motore usa Nikasil, un rivestimento ferroso a spruzzo oppure canne e monoblocco in ghisa. Non condivide lo schema principale valutato da questo strumento, il che non garantisce lo stato di nessun cilindro né esclude altra usura.',
  },
  ENGINE_SPECIFIC_CLASSIFICATION: {
    etiqueta: 'Occorre identificare il motore',
    resumen: 'In questo modello e anno convissero architetture diverse.',
    cuerpo: 'Con quanto fornito finora convivono architetture diverse sotto lo stesso nome commerciale. Servono la versione, la cilindrata o il codice motore: classificare senza sarebbe dare una risposta ingannevole.',
  },
  OUTSIDE_VALIDATED_SCOPE: {
    etiqueta: 'Fuori dalla matrice validata',
    resumen: 'Non abbiamo una regola abbastanza affidabile per questa configurazione.',
    cuerpo: 'Questo strumento copre le 911 dalla 996, Boxster e Cayman, e Cayenne, Panamera e Macan con motore identificabile. Per il resto non c’è una regola che possiamo sostenere, e una zona verde generica sarebbe peggio del non dire nulla. Se ci sono sintomi, vanno comunque valutati.',
  },
  NOT_APPLICABLE_ELECTRIC: {
    etiqueta: 'Non applicabile',
    resumen: 'Un veicolo elettrico non ha cilindri a combustione.',
    cuerpo: 'Senza cilindri a combustione questo guasto non può esistere.',
  },
};

export const EVIDENCIA: Record<Evidencia, TextoEje> = {
  NO_EVIDENCE_REPORTED: {
    etiqueta: 'Nessun indizio dichiarato',
    resumen: 'Né sintomi né prove dichiarate. Non è la stessa cosa di un motore sano.',
    cuerpo: 'Non sono stati comunicati sintomi né prove sospette. È l’unica cosa che si può affermare: un danno incipiente può esistere senza dare segnali percepibili dal sedile.',
  },
  ONE_NON_SPECIFIC_SIGNAL: {
    etiqueta: 'Un indizio isolato',
    resumen: 'C’è un sintomo che può avere altre cause.',
    cuerpo: 'Un solo sintomo, senza nulla che lo accompagni, ammette molte spiegazioni: punterie, iniettori, una perdita allo scarico o lo stesso avviamento a freddo. Conviene osservare se persiste o se ne compare un altro.',
  },
  MULTIPLE_COMPATIBLE_SIGNALS: {
    etiqueta: 'Più indizi compatibili',
    resumen: 'Coincidono segnali di due famiglie indipendenti.',
    cuerpo: 'Concorrono segnali di famiglie diverse, per esempio consumo crescente e un battito ritmico, oppure fuliggine asimmetrica con candela oleosa. La coincidenza giustifica un’endoscopia e una diagnosi, non una diagnosi da sola.',
  },
  SUPPORTING_TEST_SUSPICIOUS: {
    etiqueta: 'Una prova sospetta',
    resumen: 'Una prova complementare indica usura, senza confermarla visivamente.',
    cuerpo: 'L’analisi dell’olio, la compressione, il leak-down o quanto trovato nel filtro sostengono il sospetto. Sostengono: la conferma resta visiva.',
  },
  NEGATIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Endoscopia riferita come normale',
    resumen: 'Descrive ciò che si è visto quel giorno e su quelle superfici.',
    cuerpo: 'Un’endoscopia completa e recente riferita come normale è una buona notizia circoscritta: descrive lo stato osservato in quella data e nelle zone che si sono potute vedere. La suscettibilità della famiglia non cambia per questo.',
  },
  LIMITED_OR_INCONCLUSIVE_BORESCOPE: {
    etiqueta: 'Endoscopia limitata o non conclusiva',
    resumen: 'L’ispezione non consente di dare il motore per buono.',
    cuerpo: 'La prova non ha coperto le zone critiche, non ha raggiunto tutti i cilindri necessari o il referto non conclude. In un M96/M97 l’accesso dalle sole sedi delle candele lascia fuori proprio dove di solito comincia la rigatura.',
  },
  POSITIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Endoscopia positiva dichiarata',
    resumen: 'Dichiara un referto positivo che noi non abbiamo esaminato.',
    cuerpo: 'Prendiamo il referto per quello che è: una dichiarazione. Prima di parlare di entità e opzioni conviene che uno specialista esamini le immagini o il motore.',
  },
  CONFIRMED_BY_SPECIALIST: {
    etiqueta: 'Confermato da uno specialista',
    resumen: 'C’è un referto professionale che lo conferma.',
    cuerpo: 'Con una diagnosi professionale, la conversazione smette di essere se esiste e diventa entità, causa e strategia di ricostruzione.',
  },
  CONFLICTING_EVIDENCE: {
    etiqueta: 'Informazioni contraddittorie',
    resumen: 'Una prova normale convive con sintomi che la contraddicono.',
    cuerpo: 'Un’endoscopia vecchia o limitata riferita come normale, seguita da sintomi nuovi, non chiude nulla: impone di ripetere l’ispezione con il protocollo adeguato.',
  },
};

export const URGENCIA: Record<Urgencia, TextoEje> = {
  INFORMATION_ONLY: { etiqueta: 'Informazione e manutenzione', resumen: 'Niente di urgente. Osservi l’evoluzione e tenga l’olio in ordine.' },
  PPI_SCOPE_RECOMMENDED: { etiqueta: 'Includa l’endoscopia nell’ispezione pre-acquisto', resumen: 'Prima di comprarla, che l’ispezione includa un’endoscopia completa.' },
  BOOK_SPECIALIST_INSPECTION: { etiqueta: 'Richieda un controllo specializzato', resumen: 'C’è qualcosa da guardare. Può avere altre cause, ed è per questo che si guarda.' },
  PROMPT_INSPECTION: { etiqueta: 'La faccia controllare al più presto', resumen: 'Gli indizi giustificano endoscopia e diagnosi senza lasciar correre.' },
  MINIMIZE_USE_AND_CONTACT: { etiqueta: 'Riduca l’uso e ci consulti prima di proseguire', resumen: 'Conviene non accumulare altro danno finché il motore non è valutato.' },
  REPAIR_PLANNING: { etiqueta: 'Valuti riparazione o ricostruzione', resumen: 'Con la diagnosi fatta, tocca decidere entità e strategia.' },
  INSUFFICIENT_DATA: { etiqueta: 'Manca un dato essenziale', resumen: 'Senza identificare il motore non possiamo dirle quale controllo abbia senso.' },
};

export const TECNOLOGIA: Record<Tecnologia, string> = {
  lokasil: 'Lokasil, cilindro alluminio-silicio integrato',
  alusil: 'Alusil, monoblocco ipereutettico',
  nikasil: 'Nikasil o rivestimento equivalente',
  recubrimiento_proyectado: 'Rivestimento ferroso a spruzzo, APS o PTWA',
  hierro: 'Canna o monoblocco in ghisa',
  no_aplica_electrico: 'Senza cilindri a combustione',
  desconocida: 'Non identificata',
};

export const CONFIANZA: Record<'alta' | 'media' | 'baja', string> = {
  alta: 'Alta: generazione, versione e motore coerenti',
  media: 'Media: la classificazione è solida, manca qualche dato del motore',
  baja: 'Bassa: manca da identificare qualcosa o i dati si contraddicono',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'L’anno non è valido.',
  ano_solapado: 'In quell’anno convissero due generazioni con motori diversi.',
  ano_de_matriculacion_en_frontera: 'È un anno di immatricolazione a ridosso di un cambio di generazione, e da lì non si può decidere.',
  modelo_y_ano_incompatibles: 'Quel modello non si costruiva in quell’anno. Non lo correggiamo per conto nostro.',
  falta_combustible: 'In una Cayenne, una Panamera o una Macan il carburante determina tutto il resto.',
  falta_version: 'La versione separa architetture diverse sotto lo stesso nome.',
  falta_cilindrada: 'La cilindrata è ciò che separa due gruppi con storie molto diverse.',
  sin_regla_para_esa_combinacion: 'Non abbiamo una regola validata per quella combinazione.',
  reglas_en_conflicto: 'Due regole della matrice si applicano insieme, quindi preferiamo non scegliere per lei.',
  electrico_sin_cilindros: 'Un’elettrica non ha cilindri a combustione.',
  originalidad_desconocida: 'Non risulta se il motore sia quello di fabbrica.',
  motor_sustituido_sin_identificar: 'Il motore è stato sostituito e non è identificato: monta la specifica di quando fu costruito, non quella dell’anno del telaio.',
  reconstruccion_sin_detalle: 'Risulta una ricostruzione, ma non la sua entità né la tecnologia installata.',
  reconstruccion_cambia_tecnologia: 'La ricostruzione dichiarata cambia la tecnologia del cilindro.',
  reconstruccion_misma_tecnologia: 'La ricostruzione dichiarata mantiene la tecnologia originale.',
  boroscopia_confirmada: 'Uno specialista ha esaminato o emesso il referto.',
  boroscopia_positiva_declarada: 'Dichiara un referto positivo che non abbiamo esaminato.',
  boroscopia_no_concluyente: 'L’endoscopia non conclude o mostra segni dubbi.',
  boroscopia_solo_por_bujias: 'Si è acceduto solo dalle sedi delle candele, che in questi motori non raggiungono la zona critica.',
  boroscopia_parcial: 'L’ispezione non ha coperto tutti i cilindri necessari.',
  boroscopia_alcance_desconocido: 'Non risulta l’estensione dell’ispezione.',
  boroscopia_negativa_contra_sintomas: 'Una prova riferita come normale convive con sintomi successivi.',
  dos_familias_de_senal: 'Coincidono segnali di due famiglie indipendenti.',
  prueba_complementaria_sospechosa: 'Una prova complementare indica usura.',
  una_senal_inespecifica: 'C’è un segnale isolato, compatibile con più cause.',
  'regla_911-mezger': 'Turbo, GT2 e GT3 di quella generazione usano il motore Mezger, con Nikasil.',
  'regla_911-991-1-especificos': 'La Turbo e le GT non ereditano la regola della Carrera.',
  'regla_911-pre-996': 'Le 911 precedenti alla 996 restano fuori da questa matrice.',
  'regla_911-996-1-carrera': '996.1 Carrera 3.4, con cilindri Lokasil.',
  'regla_911-996-2-carrera': '996.2 Carrera 3.6, uno dei gruppi più citati.',
  'regla_911-997-1-carrera': '997.1 Carrera 3.6 e S 3.8, il gruppo con più casi pubblicati.',
  'regla_911-997-2-carrera': '997.2 Carrera con 9A1/MA1 e Alusil.',
  'regla_911-991-1-carrera': '991.1 Carrera con 9A1/MA1 e Alusil.',
  'regla_911-991-2-carrera': '991.2 Carrera, con rivestimento ferroso a spruzzo.',
  'regla_911-992': 'Dalla 992 in poi bisogna confermare l’architettura del motore.',
  'regla_bc-986': 'Boxster 986, comparativamente meno citata.',
  'regla_bc-987-1-base': '987.1 base, 2.7, comparativamente meno citata.',
  'regla_bc-987-1-s-3-2': '987.1 S con 3.2, precedente al 3.4.',
  'regla_bc-987-1-s-3-4': '987.1 S con 3.4, il gruppo più citato tra Boxster e Cayman.',
  'regla_bc-987-1-s-hasta-2006': 'La Boxster S 987.1 montò il 3.2 fino al model year 2006.',
  'regla_bc-987-1-s-desde-2007': 'La Boxster S 987.1 monta il 3.4 dal model year 2007.',
  'regla_bc-987-1-cayman-s': 'La Cayman S 987.1 monta il 3.4 dal primo anno.',
  'regla_bc-987-2': '987.2 con 9A1/MA1 e Alusil.',
  'regla_bc-981': '981 con 9A1/MA1 e Alusil.',
  'regla_bc-981-especificos': 'Spyder e GT4 hanno un motore diverso dal resto della 981.',
  'regla_bc-718': '718 quattro cilindri, con rivestimento ferroso a spruzzo.',
  'regla_taycan': 'Una Taycan è elettrica.',
  'regla_electrico': 'Con motore elettrico non ci sono cilindri a combustione.',
  'regla_suv-diesel-hibrido': 'Un diesel o un ibrido non identificato non si classifica dal nome.',
  'regla_cayenne-vr6': 'Cayenne con VR6, monoblocco in ghisa.',
  'regla_cayenne-v8-955-958-1': 'Cayenne V8 M48, con casi documentati.',
  'regla_cayenne-mct-958-2': 'Cayenne 3.6 MCT, Alusil con casi documentati.',
  'regla_cayenne-e3': 'Cayenne di terza generazione, con canne in ghisa o APS.',
  'regla_panamera-970': 'Panamera 970, Alusil con casi documentati.',
  'regla_panamera-970-base': 'Nella 970 base bisogna identificare il motore.',
  'regla_panamera-971': 'Panamera 971, con canne in ghisa o APS.',
  'regla_macan-2-0': 'Macan 2.0 EA888, fuori dallo schema Alusil classico.',
  'regla_macan-v6-mct': 'Macan V6 MCT, Alusil con casi documentati.',
  'regla_macan-v6-ea839': 'Macan V6 EA839, con canne in ghisa.',
  'regla_otro-porsche': 'Quella Porsche non è nella matrice validata.',
};

export const AVISOS: Record<string, string> = {
  menor_no_es_inmune: 'Minore suscettibilità non è immunità: se compaiono sintomi, si controlla come qualsiasi altra.',
  sin_indicios_no_es_sano: 'Non aver dichiarato indizi non è un motore sano: il danno incipiente può non dare segnali.',
  negativa_es_de_esa_fecha: 'Un’endoscopia normale descrive quella data e quelle superfici, non il futuro del motore.',
  no_declarar_solucionado: 'Una fattura di ricostruzione senza entità nota non permette di darlo per risolto.',
  motor_sustituido: 'Non essendo il motore di fabbrica, la suscettibilità della vettura dipende dal motore che monta ora.',
  motor_sin_verificar: 'Non risulta se il motore sia quello di fabbrica, quindi la classificazione può non corrispondere a questa vettura.',
  ano_no_es_modelo: 'L’anno usato non è il model year, quindi il risultato perde precisione.',
  consumo_para_el_taller: 'Il consumo annotato si conserva per mostrarlo all’officina: non lo usiamo per calcolare il rischio.',
};

export const ACCIONES: Record<string, string> = {
  vigilar_evolucion: 'Annoti consumo, rumori e fumo con le date: la tendenza vale più di una misura isolata.',
  mantenimiento_preventivo: 'Tenga in ordine olio e filtro, ed eviti di prolungare i cicli a freddo.',
  boroscopia_en_precompra: 'Chieda che l’ispezione pre-acquisto includa un’endoscopia completa, non solo dalle sedi delle candele.',
  pedir_historial: 'Raccolga fatture, analisi dell’olio precedenti e qualsiasi referto precedente del motore.',
  revision_especializada: 'Chieda un controllo specializzato che faccia la diagnosi differenziale: punterie, iniettori e scarico danno sintomi simili.',
  preparar_datos: 'Porti i dati in ordine: quando è iniziato, a freddo o a caldo, litri aggiunti e chilometri tra i rabbocchi.',
  boroscopia_y_diagnostico: 'Prenoti endoscopia e diagnosi: è la via per vedere il cilindro ed escludere altre cause.',
  reducir_uso: 'Riduca l’uso finché il motore non è valutato, ed eviti le serie di forti accelerazioni.',
  valorar_reparacion: 'Valutiamo causa, entità e strategia di ricostruzione prima di toccare qualsiasi cosa.',
  enviar_informe: 'Condivida referto e immagini con l’officina per valutare l’entità reale.',
  identificar_motor: 'Identifichi il motore: l’etichetta del monoblocco, la documentazione o una foto del codice lo risolvono.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generazione', porque: 'In quell’anno convissero due generazioni con cilindri diversi.' },
  variante: { etiqueta: 'Versione', porque: 'Sotto lo stesso nome convivono architetture motore diverse.' },
  combustible: { etiqueta: 'Motore', porque: 'In una Cayenne, una Panamera o una Macan, nome e anno non dicono che motore monta.' },
  cilindrada: { etiqueta: 'Cilindrata', porque: 'È ciò che separa due gruppi con storie molto diverse.' },
  ano_imposible: { etiqueta: 'Controlli l’anno o il modello', porque: 'Quel modello non si costruiva in quell’anno, e preferiamo non correggerlo per conto nostro.' },
};

export const AVISO = 'Risultato indicativo basato sulla configurazione di fabbrica e sui dati che ha dichiarato. L’assenza di sintomi non esclude un danno incipiente e i sintomi descritti possono avere altre cause. Solo un’ispezione endoscopica eseguita e interpretata correttamente può confermare visivamente il bore scoring. Questo strumento non sostituisce un’ispezione meccanica.';

export const CONFIRMACION = 'I sintomi possono orientare, ma solo un’ispezione endoscopica adeguata consente di confermare visivamente il bore scoring.';

export const AFINAR = {
  titulo: 'Affinare il risultato con sintomi e prove',
  ayuda: 'Domande brevi su sintomi, prove e storia del motore. Basta quello che sa: «non lo so» è una risposta valida e non peggiora il risultato.',
};

export const UI = {
  modelo: 'Modello',
  ano: 'Anno',
  anoAyuda: 'Se può, usi il model year. Può non coincidere con l’immatricolazione.',
  baseAno: 'Quell’anno è',
  calcular: 'Controlla la mia Porsche',
  situacion: 'In che situazione si trova?',
  ejeConfiguracion: 'Configurazione del motore',
  ejeSusceptibilidad: 'Suscettibilità del motore',
  ejeEvidencia: 'Informazioni su questa vettura',
  ejeConfianza: 'Qualità dell’identificazione',
  siguientePaso: 'Cosa faremmo ora',
  porqueEsto: 'Perché questo risultato',
  aTenerEnCuenta: 'Da tenere presente',
  deFabrica: 'Di fabbrica',
  motorActual: 'Motore montato ora',
  consumoDeclarado: 'Consumo dichiarato',
  consumoUnidad: 'l/1.000 km',
  fuentes: 'Fonti',
  reglas: 'Regole',
  ctaArticulo: 'Capire il bore scoring',
  ctaIms: 'Controllare anche l’IMS',
  imsPuente: 'Questo motore appartiene anche a una generazione valutata dal calcolatore IMS. Sono due controlli distinti e non si combinano in un unico punteggio.',
  errorAno: 'Inserisca un anno tra il 1948 e il ' + (new Date().getFullYear() + 1) + '.',
  noLoSe: 'Non lo so',
  detallesConsumo: 'Se lo ha annotato',
};

export const CTA: Record<Urgencia, string> = {
  INFORMATION_ONLY: 'Consultare la manutenzione preventiva',
  PPI_SCOPE_RECOMMENDED: 'Richiedere un’ispezione pre-acquisto con endoscopia',
  BOOK_SPECIALIST_INSPECTION: 'Richiedere un controllo specializzato',
  PROMPT_INSPECTION: 'Prenotare diagnosi ed endoscopia',
  MINIMIZE_USE_AND_CONTACT: 'Prenotare diagnosi ed endoscopia',
  REPAIR_PLANNING: 'Valutare le opzioni di riparazione',
  INSUFFICIENT_DATA: 'Ci aiuti a identificare il motore',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 o precedente', '996_1': '996.1', '996_2': '996.2', '997_1': '997.1', '997_2': '997.2',
  '991_1': '991.1', '991_2': '991.2', post_991: '992 o successiva', '986': '986', '987_1': '987.1', '987_2': '987.2',
  '981': '981', '718': '718',
  cayenne_955: '955 · 2003-2006', cayenne_957: '957 · 2008-2010', cayenne_958_1: '958.1 · 2011-2014',
  cayenne_958_2: '958.2 · 2015-2018', cayenne_e3: 'E3 · dal 2019',
  panamera_970: '970 · 2009-2016', panamera_971: '971 · dal 2017',
  macan_95b: '95B · 2014-2018', macan_95b_2: '95B · dal 2019',
  desconocida: 'Non lo so',
};

export const VARIANTE: Record<Variante, string> = {
  carrera: 'Carrera / Carrera 4', carrera_s: 'Carrera S / 4S / Targa', turbo: 'Turbo / Turbo S', gt2: 'GT2',
  gt3: 'GT3 / GT3 RS', base: 'Versione base', s: 'S', gts: 'GTS', spyder_gt4: 'Spyder / GT4',
  otra: 'Altra', desconocida: 'Non lo so',
};

export const OPCIONES = {
  familia: [
    { valor: '911', etiqueta: '911' }, { valor: 'boxster', etiqueta: 'Boxster' }, { valor: 'cayman', etiqueta: 'Cayman' },
    { valor: 'cayenne', etiqueta: 'Cayenne' }, { valor: 'panamera', etiqueta: 'Panamera' }, { valor: 'macan', etiqueta: 'Macan' },
    { valor: 'taycan', etiqueta: 'Taycan' }, { valor: 'otro', etiqueta: 'Altra Porsche' },
  ],
  baseAno: [
    { valor: 'modelo', etiqueta: 'Model year' }, { valor: 'matriculacion', etiqueta: 'Anno di immatricolazione' }, { valor: 'desconocido', etiqueta: 'Non lo so' },
  ],
  combustible: [
    { valor: 'gasolina', etiqueta: 'Benzina' }, { valor: 'diesel', etiqueta: 'Diesel' }, { valor: 'hibrido', etiqueta: 'Ibrida' },
    { valor: 'electrico', etiqueta: 'Elettrica' }, { valor: 'desconocido', etiqueta: 'Non lo so' },
  ],
  situacion: [
    { valor: 'compra', etiqueta: 'Sto valutando di comprarla' }, { valor: 'propietario', etiqueta: 'È già mia' },
    { valor: 'sintoma', etiqueta: 'Ho notato un sintomo' }, { valor: 'prueba', etiqueta: 'Ho già una prova o una diagnosi' },
  ],
  originalidad: [
    { valor: 'original', etiqueta: 'Sì, quello di fabbrica' }, { valor: 'sustituido', etiqueta: 'No, è stato sostituito' },
    { valor: 'reconstruido', etiqueta: 'È stato ricostruito' }, { valor: 'desconocida', etiqueta: 'Non lo so' },
  ],
  tecnologiaReconstruida: [
    { valor: '', etiqueta: 'Non lo so' }, { valor: 'lokasil', etiqueta: 'L’originale' }, { valor: 'alusil', etiqueta: 'Alusil ricondizionato' },
    { valor: 'hierro', etiqueta: 'Canna in ghisa' }, { valor: 'nikasil', etiqueta: 'Nikasil o NSC' }, { valor: 'recubrimiento_proyectado', etiqueta: 'Rivestimento a spruzzo' },
  ],
};

export const SINTOMAS: PreguntaSintoma[] = [
  { campo: 'consumoAceite', etiqueta: 'È aumentato il consumo d’olio?', ayuda: 'Rispetto al solito di questa vettura, non a una cifra di catalogo.',
    opciones: [{ valor: 'estable', etiqueta: 'No, è stabile' }, { valor: 'aumenta', etiqueta: 'Sì, è aumentato' }, { valor: 'no_lo_se', etiqueta: 'Non posso saperlo' }] },
  { campo: 'golpeteo', etiqueta: 'Si sente un battito ritmico nel motore?', ayuda: 'Il «tic-tic» solo a freddo lo fanno anche punterie e iniettori.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'solo_frio', etiqueta: 'Solo a freddo' }, { valor: 'frio_y_caliente', etiqueta: 'Anche a caldo' }, { valor: 'no_lo_se', etiqueta: 'Non lo so' }] },
  { campo: 'humo', etiqueta: 'Emette fumo visibile?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'bocanada_arranque', etiqueta: 'Uno sbuffo occasionale all’avviamento' }, { valor: 'arranque_repetido', etiqueta: 'Ripetuto all’avviamento' }, { valor: 'en_marcha', etiqueta: 'Al minimo o in marcia' }, { valor: 'no_lo_se', etiqueta: 'Non lo so' }] },
  { campo: 'hollin', etiqueta: 'Un terminale di scarico accumula più fuliggine oleosa dell’altro?', ayuda: 'Serve solo dove ogni terminale corrisponde a una bancata.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'asimetrico', etiqueta: 'Sì, uno molto di più' }, { valor: 'ambas', etiqueta: 'Entrambi allo stesso modo' }, { valor: 'no_comparable', etiqueta: 'Lo scarico non permette il confronto' }, { valor: 'no_lo_se', etiqueta: 'Non lo so' }] },
  { campo: 'fallosCombustion', etiqueta: 'Ci sono mancate accensioni o spia motore?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'codigo_guardado', etiqueta: 'Un errore memorizzato senza causa nota' }, { valor: 'activo', etiqueta: 'Errore attivo o candela oleosa' }, { valor: 'no_lo_se', etiqueta: 'Non lo so' }] },
];

export const PRUEBAS: PreguntaSintoma[] = [
  { campo: 'boroscopia', etiqueta: 'Esiste un’endoscopia recente?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'normal', etiqueta: 'Sì, riferita come normale' }, { valor: 'no_concluyente', etiqueta: 'Sì, limitata o non conclusiva' }, { valor: 'dudosa', etiqueta: 'Sì, con segni dubbi' }, { valor: 'positiva', etiqueta: 'Sì, con bore scoring diagnosticato' }] },
  { campo: 'analisisAceite', etiqueta: 'C’è un’analisi dell’olio?', ayuda: 'Un solo campione non conferma né esclude nulla; la tendenza sì dice qualcosa.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'una_normal', etiqueta: 'Un campione normale' }, { valor: 'serie_estable', etiqueta: 'Una serie stabile' }, { valor: 'una_anomala', etiqueta: 'Un campione con metalli alti' }, { valor: 'tendencia_creciente', etiqueta: 'Tendenza crescente di alluminio, ferro o silicio' }, { valor: 'no_lo_se', etiqueta: 'Non lo so' }] },
  { campo: 'compresionLeakdown', etiqueta: 'Sono state misurate compressione o leak-down?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'normal', etiqueta: 'Sì, con lettura normale' }, { valor: 'anomala', etiqueta: 'Sì, con lettura anomala' }, { valor: 'no_lo_se', etiqueta: 'Non lo so' }] },
];

export const BOROSCOPIA_DETALLE: PreguntaSintoma[] = [
  { campo: 'viaBoroscopia', etiqueta: 'Via di accesso', ayuda: 'Su M96/M97, dalle sole sedi delle candele non si raggiunge la zona critica.',
    opciones: [{ valor: 'bujias', etiqueta: 'Dalle candele' }, { valor: 'carter', etiqueta: 'Dalla coppa' }, { valor: 'ambas', etiqueta: 'Da entrambe' }, { valor: 'no_lo_se', etiqueta: 'Non lo so' }] },
  { campo: 'calidadBoroscopia', etiqueta: 'Estensione',
    opciones: [{ valor: 'completa', etiqueta: 'Tutti i cilindri' }, { valor: 'parcial', etiqueta: 'Solo alcuni' }, { valor: 'desconocida', etiqueta: 'Non lo so' }] },
  { campo: 'sintomasNuevosDesdeBoroscopia', etiqueta: 'Sono comparsi sintomi nuovi da allora?',
    opciones: [{ valor: '', etiqueta: 'No' }, { valor: 'si', etiqueta: 'Sì' }] },
];

export const HISTORIAL: PreguntaSintoma = {
  campo: 'originalidadMotor', etiqueta: 'Conserva il motore originale?', opciones: OPCIONES.originalidad,
};

export const PAGINA = {
  titulo: 'Calcolatore di bore scoring Porsche per modello e anno · Valentin Motors',
  descripcion: 'Selezioni modello, anno e motore per conoscere la suscettibilità alla rigatura dei cilindri e sapere quando conviene un’endoscopia.',
  eyebrow: 'Strumento',
  h1: 'La sua Porsche può soffrire di bore scoring?',
  intro: 'Selezioni modello e anno per conoscere la suscettibilità del suo motore. Poi può aggiungere sintomi o prove per sapere quale controllo ha senso.',
  explicacionTitulo: 'Cosa conferma un’endoscopia e cosa no',
  explicacion: [
    'Il bore scoring (rigatura dei cilindri) è un danno fisico alla parete del cilindro e al mantello del pistone. Non è un componente di fabbrica deducibile da modello e anno: si acquisisce con l’uso, può iniziare in fretta e aggravarsi dopo. Per questo lo strumento separa ciò che si sa di una famiglia di motori da ciò che si sa della sua vettura.',
    'La conferma è visiva. Un’endoscopia fatta bene entra da dove deve, percorre tutti i cilindri necessari ed è interpretata da chi distingue una riga da un riflesso o da un deposito carbonioso. Sui M96 e M97, l’accesso dalle sole sedi delle candele lascia fuori proprio la zona dove la rigatura di solito comincia: una prova così, riferita come normale, non permette di dare il motore per buono.',
    'I sintomi orientano e le prove complementari sostengono, ma nessuno conferma. Consumo d’olio, battito ritmico, fuliggine asimmetrica o una mancata accensione hanno altre cause possibili: punterie, iniettori, una perdita allo scarico, fasce usurate senza rigatura. La diagnosi differenziale è parte del lavoro, non una formalità.',
    'Non esiste nemmeno una cura con additivi o con un olio più denso. Quando la rigatura è confermata, la conversazione è sull’entità: quali cilindri, con quale tecnologia si ricostruiscono e con quale garanzia. Si decide con il motore davanti.',
  ],
  faqTitulo: 'Domande frequenti',
  faq: [
    ['Questo strumento può dirmi se la mia auto ha il bore scoring?', 'No, e nessuno che usi solo modello e anno può farlo. Le dice se la sua configurazione appartiene a un gruppo con più casi pubblicati, cosa dicono gli indizi che fornisce e quale controllo ha senso ora.'],
    ['Tutte le 997.1 e le Cayman S 3.4 sono interessate?', 'No. Sono i gruppi che compaiono di più nell’esperienza degli specialisti, che è un’altra cosa. Ci sono molte vetture sane con molti chilometri.'],
    ['Le Porsche dal 2009 sono esenti?', 'No. La 997.2 e la 987.2 hanno lasciato l’IMS classico, ma i loro motori 9A1/MA1 con Alusil hanno anch’essi casi documentati di rigatura.'],
    ['Un 2.5, 2.7 o 3.2 non si guasta mai?', 'Compaiono molto meno in ciò che si pubblica. Meno non è mai: se ci sono sintomi, si controllano come qualsiasi altro.'],
    ['La mia endoscopia è risultata normale, posso dimenticarmene?', 'Descrive ciò che si è visto quel giorno e sulle superfici che si sono potute vedere. Se la prova era parziale, o se da allora sono comparsi sintomi nuovi, conviene ripeterla con il protocollo adeguato.'],
    ['Serve l’analisi dell’olio?', 'Come supporto, e soprattutto in serie. Un solo campione normale non esclude nulla, e un solo campione alto non conferma nulla. Ciò che dice qualcosa è la tendenza di alluminio, ferro e silicio nel tempo.'],
  ],
  revisadas: 'riviste il',
};
