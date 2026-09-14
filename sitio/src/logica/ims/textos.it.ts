import type { Estado, Rodamiento } from './tipos.ts';
import type { TextoEstado } from './textos.es.ts';

/** Testi del calcolatore IMS, italiano. Stessa forma di textos.es.ts. */

export const ESTADOS: Record<Estado, TextoEstado> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: {
    veredicto: 'Sì, questa vettura è interessata',
    resumen: 'Monta il cuscinetto 6204 a una fila. Si sostituisce senza aprire il monoblocco.',
    cuerpo: 'Questa configurazione montava di norma il piccolo cuscinetto IMS a una fila. È la revisione con la maggiore incidenza storica di guasti. Può essere sostituito preventivamente senza aprire il monoblocco, anche se occorre rimuovere il cambio e il volano o il flexplate.',
  },
  AFECTADO_DOBLE_SUSTITUIBLE: {
    veredicto: 'Sì, questa vettura è interessata',
    resumen: 'Monta il cuscinetto a doppia fila. Si sostituisce senza aprire il monoblocco.',
    cuerpo: 'Questa configurazione montava di norma un cuscinetto IMS a doppia fila. Ha mostrato un’incidenza minore del 6204 semplice, ma età e storia restano rilevanti.',
    accion: 'Verifichi la documentazione e includa l’IMS in un’ispezione specializzata; valuti la sostituzione secondo stato, uso e storia.',
  },
  TRANSICION_DOBLE_O_SIMPLE: {
    veredicto: 'Dipende dal numero di motore',
    resumen: 'Nel 2000 e 2001 furono montati entrambi i cuscinetti. Il numero di motore lo risolve.',
    cuerpo: 'Modello e anno non bastano a distinguere la doppia fila dal 6204 semplice. Entrambi sono sostituibili, ma l’incidenza relativa e il ricambio sono diversi.',
    accion: 'Inserisca il numero di motore se lo ha, e lo confermi fisicamente prima di ordinare ricambi o approvare un intervento.',
  },
  TRANSICION_SIMPLE_O_GRANDE: {
    veredicto: 'Dipende dal numero di motore',
    resumen: 'Nel 2005 furono montati entrambi i cuscinetti. Il numero di motore lo risolve.',
    cuerpo: 'Alcune vetture montano il piccolo cuscinetto sostituibile e altre il grande 6305, che di norma richiede l’apertura del motore per la sostituzione.',
    accion: 'Usi il numero di motore quando esiste una regola affidabile e confermi la storia o la configurazione fisica prima di intervenire.',
  },
  AFECTADO_GRANDE_NO_SUSTITUIBLE: {
    veredicto: 'Sì, questa vettura è interessata',
    resumen: 'Monta il cuscinetto grande 6305. Sostituirlo richiede lo smontaggio del motore.',
    cuerpo: 'Questa configurazione conserva un cuscinetto IMS a sfere, ma usa la revisione 6305 di dimensioni maggiori. La sua incidenza nota è minore di quella del piccolo 6204, ma non è zero. Di norma non può essere estratto dalla sede senza smontare il motore.',
    accion: 'Raccolga la storia e chieda una valutazione specializzata; se il motore viene ricostruito, includa l’IMS nel lavoro.',
  },
  NO_ES_EL_IMS_CLASICO_MEZGER: {
    veredicto: 'No, è un motore Mezger',
    resumen: 'Ha una bronzina lubrificata a pressione, non il cuscinetto sigillato che cede.',
    cuerpo: 'Questa versione usa un’architettura diversa, con bronzine lubrificate a pressione sull’albero intermedio. La sostituzione preventiva del cuscinetto sigillato che si fa su Carrera, Boxster e Cayman M96/M97 non la riguarda.',
  },
  SIN_IMS_9A1: {
    veredicto: 'No, non ha albero intermedio',
    resumen: 'Dal model year 2009 questo motore comanda la distribuzione senza IMS.',
    cuerpo: 'Dal model year 2009, le 997.2 e 987.2 hanno adottato una nuova architettura che comanda la distribuzione senza albero intermedio. Il guasto valutato da questo calcolatore non si applica.',
  },
  NO_APLICA_OTRO_MODELO: {
    veredicto: 'No',
    resumen: 'Questo modello non appartiene alla famiglia M96/M97 con il cuscinetto sigillato.',
    cuerpo: 'Questo modello non fa parte delle 911 Carrera, Boxster o Cayman con il cuscinetto sigillato studiato qui. La risposta non è un giudizio generale di affidabilità.',
  },
  DATOS_INSUFICIENTES: {
    veredicto: 'Non si sa',
    resumen: 'Senza quel dato non si può dire quale monta. Lo risolve il numero di motore o un’ispezione della flangia.',
    cuerpo: 'In quell’anno convissero motori o generazioni diversi. Preferiamo dirlo piuttosto che dare una falsa certezza.',
  },
};

export const RODAMIENTOS: Record<Rodamiento, string> = {
  doble_hilera_5204: 'Doppia fila, famiglia 5204',
  una_hilera_6204: 'Piccolo a una fila, famiglia 6204',
  una_hilera_grande_6305: 'Grande a una fila, 6305',
  mezger_cojinete_liso: 'Mezger, bronzina a pressione',
  sin_ims: 'Senza albero intermedio',
  no_aplica: 'Non applicabile',
  desconocido: 'Non determinato',
};

export const SUSTITUIBILIDAD: Record<string, string> = {
  sin_abrir_el_bloque: 'Senza aprire il monoblocco',
  desmontando_el_motor: 'Richiede lo smontaggio del motore',
  no_aplica: 'Non applicabile',
  desconocida: 'Non determinato',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'L’anno non è valido.',
  ano_solapado: 'In quell’anno convissero due generazioni con motori diversi.',
  ano_de_matriculacion_en_frontera: 'È un anno di immatricolazione a ridosso di un cambio di generazione, e da lì non si può decidere.',
  falta_version_mezger: 'Turbo, GT2 e GT3 usano il motore Mezger e restano fuori da questo guasto, quindi serve la versione.',
  combinacion_no_prevista: 'Quella combinazione di modello, generazione e anno non è prevista dalle regole.',
  fuera_de_la_familia_m96_m97: 'Il modello non appartiene alla famiglia M96/M97 studiata.',
  ano_no_es_modelo: 'L’anno usato non è il model year, quindi il risultato perde precisione.',
  motor_sustituido: 'Il motore non è quello di fabbrica: monta il cuscinetto in uso quando quel motore fu costruito, non quello dell’anno del telaio.',
  corte_por_numero_de_motor: 'È stato applicato il limite indicativo per numero di motore.',
  serie_remanufacturado: 'Il numero porta il marchio di motore rigenerato, quindi il limite non vale.',
  serie_ilegible: 'Il numero di motore non ha un formato confrontabile.',
  sin_corte_para_ese_motor: 'Non esiste un limite pubblicato per quel tipo di motore.',
};

export const ACCIONES: Record<string, string> = {
  evaluacion_previa: 'Chieda una valutazione preventiva del motore prima di decidere qualsiasi intervento.',
  revisar_documentacion: 'Raccolga fatture, riferimento del kit, data e chilometraggio: è il primo passo e non richiede di smontare nulla.',
  numero_motor: 'Aggiunga il numero di motore se lo ha a portata di mano.',
  identificacion_fisica: 'Quando la documentazione non basta, faccia ispezionare fisicamente la flangia.',
  valoracion_especifica: 'Questa configurazione richiede una valutazione specifica dell’officina.',
  confirmar_fisicamente: 'Il limite è indicativo: lo confermi prima di ordinare ricambi.',
  identificar_motor_actual: 'Identifichi il motore che la vettura monta ora.',
  verificar_factura_y_referencia: 'Verifichi fattura, riferimento, data e chilometraggio dell’intervento.',
  completar_dato: 'Completi il dato richiesto e ricalcoliamo.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generazione', porque: 'In quell’anno convissero due generazioni con motori diversi.' },
  variante: { etiqueta: 'Versione', porque: 'Turbo, GT2 e GT3 montano il motore Mezger e restano fuori da questo guasto.' },
  base_ano: { etiqueta: 'Quell’anno è', porque: 'L’anno di immatricolazione qui non basta.' },
  motor: { etiqueta: 'Motore', porque: 'Serve il motore per affinare.' },
};

export const RETROFIT = {
  RETROFIT_DOCUMENTADO: {
    titular: 'Interessata in origine; risulta un intervento',
    cuerpo: 'La vettura appartiene a una famiglia interessata, ma dichiara che l’IMS è stato oggetto di intervento. La situazione attuale dipende dal sistema installato, da come è stato montato e dal suo intervallo di servizio. Senza il riferimento preciso non possiamo dire che il problema sia risolto né calcolare una scadenza.',
  },
  RETROFIT_SIN_DOCUMENTAR: {
    titular: 'Interessata in origine; l’intervento non è documentato',
    cuerpo: 'Senza fattura né riferimento non si può sapere cosa sia stato installato né quale manutenzione gli spetti. Lo consideri da verificare.',
  },
};

export const AVISO = 'Risultato indicativo basato sulla configurazione di fabbrica. Il calcolatore non diagnostica lo stato meccanico della vettura né sostituisce un’ispezione specializzata.';

export const AFINAR = {
  transicion: {
    titulo: 'Lo risolva con il numero di motore',
    ayuda: 'È l’unica cosa che distingue un cuscinetto dall’altro senza smontare nulla.',
  },
};

export const UI = {
  modelo: 'Modello',
  ano: 'Anno',
  anoAyuda: 'Usi il model year se lo conosce.',
  baseAno: 'Quell’anno è',
  calcular: 'Controlla la mia Porsche',
  continuar: 'Continua',
  porqueEsto: 'Perché questo risultato',
  generacion: 'Generazione',
  variante: 'Versione',
  codigoMotor: 'Tipo di motore',
  codigoAyuda: 'Ogni motore ha il proprio limite di serie: il tipo dice quale si applica.',
  ladoDelCorte: 'Numero di motore',
  ladoAyuda: 'Lo confronti con il numero inciso sul motore.',
  ladoNoSe: 'Non lo so',
  ladoInferior: (hasta: number) => `${hasta} o precedente`,
  ladoSuperior: (hasta: number) => `${hasta + 1} o successivo`,
  deFabrica: 'Di fabbrica',
  configuracion: 'Configurazione',
  sustitucion: 'Sostituzione',
  porQue: 'Perché',
  siguientePaso: 'Prossimo passo',
  situacionActual: 'Situazione dichiarata',
  ctaTitulo: 'Vuole confermarlo sulla sua vettura?',
  ctaTexto: 'Verifichiamo la storia e la configurazione del suo motore prima di consigliare qualsiasi intervento.',
  ctaBoton: 'Richiedi una diagnosi IMS',
  ctaArticulo: 'Capire come funziona l’IMS',
  errorAno: 'Inserisca un anno tra il 1948 e il ' + (new Date().getFullYear() + 1) + '.',
  errorModelo: 'Scelga un modello.',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 o precedente', '996': '996', '997_1': '997.1', '997_2': '997.2', post_997: '991 o successiva',
  '986': '986', '987_1': '987.1', '987_2': '987.2 o successiva', post_987: 'Successiva', desconocida: 'Non lo so',
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
  generacion: {
    911: [
      { valor: 'pre_996', etiqueta: '993 o precedente' }, { valor: '996', etiqueta: '996' }, { valor: '997_1', etiqueta: '997.1' },
      { valor: '997_2', etiqueta: '997.2' }, { valor: 'post_997', etiqueta: '991 o successiva' }, { valor: 'desconocida', etiqueta: 'Non lo so' },
    ],
    boxster: [
      { valor: '986', etiqueta: '986' }, { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 o successiva' }, { valor: 'desconocida', etiqueta: 'Non lo so' },
    ],
    cayman: [
      { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 o successiva' }, { valor: 'desconocida', etiqueta: 'Non lo so' },
    ],
  } as Record<string, { valor: string; etiqueta: string }[]>,
  variante: [
    { valor: 'carrera_atmosferico', etiqueta: 'Carrera / Carrera 4 / Targa' },
    { valor: 'carrera_s_atmosferico', etiqueta: 'Carrera S / Carrera 4S / Targa 4S' },
    { valor: 'turbo', etiqueta: 'Turbo / Turbo S' }, { valor: 'gt2', etiqueta: 'GT2' },
    { valor: 'gt3', etiqueta: 'GT3 / GT3 RS' }, { valor: 'desconocida', etiqueta: 'Non lo so' },
  ],
};

export const PAGINA = {
  titulo: 'Calcolatore IMS Porsche: verifica modello e anno · Valentin Motors',
  descripcion: 'Selezioni modello e anno per sapere che tipo di IMS può montare, il suo livello di esposizione e quali controlli richiede.',
  eyebrow: 'Strumento',
  h1: 'La sua Porsche è interessata dall’IMS?',
};
