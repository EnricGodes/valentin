import type { Estado, Rodamiento } from './tipos.ts';
import type { TextoEstado } from './textos.es.ts';

/** Textos de la calculadora IMS, català. Mateixa forma que textos.es.ts. */

export const ESTADOS: Record<Estado, TextoEstado> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: {
    veredicto: 'Sí, aquesta unitat està afectada',
    resumen: 'Munta el rodament 6204 d’una filera. Se substitueix sense obrir el bloc.',
    cuerpo: 'Aquesta configuració muntava normalment el rodament IMS petit d’una filera. És la revisió amb més incidència històrica. Es pot substituir preventivament sense obrir el bloc, tot i que cal retirar la transmissió i el volant motor o el flexplate.',
  },
  AFECTADO_DOBLE_SUSTITUIBLE: {
    veredicto: 'Sí, aquesta unitat està afectada',
    resumen: 'Munta el rodament de doble filera. Se substitueix sense obrir el bloc.',
    cuerpo: 'Aquesta configuració muntava normalment un rodament IMS de doble filera. Ha mostrat menys incidència que el 6204 simple, però l’antiguitat i l’historial continuen sent rellevants.',
    accion: 'Verifica la documentació i inclou l’IMS en una inspecció especialitzada; valora la substitució segons estat, ús i historial.',
  },
  TRANSICION_DOBLE_O_SIMPLE: {
    veredicto: 'Depèn del número de motor',
    resumen: 'El 2000 i el 2001 es van muntar els dos rodaments. El número de motor ho resol.',
    cuerpo: 'El model i l’any no basten per distingir entre doble filera i 6204 simple. Tots dos són substituïbles, però la seva incidència relativa i el recanvi són diferents.',
    accion: 'Introdueix el número de motor si el tens, i confirma’l físicament abans de demanar peces o aprovar una intervenció.',
  },
  TRANSICION_SIMPLE_O_GRANDE: {
    veredicto: 'Depèn del número de motor',
    resumen: 'El 2005 es van muntar els dos rodaments. El número de motor ho resol.',
    cuerpo: 'Algunes unitats munten el rodament petit substituïble i altres el 6305 gran, que normalment exigeix obrir el motor per substituir-lo.',
    accion: 'Fes servir el número de motor quan hi hagi una regla fiable i confirma l’historial o la configuració física abans d’intervenir.',
  },
  AFECTADO_GRANDE_NO_SUSTITUIBLE: {
    veredicto: 'Sí, aquesta unitat està afectada',
    resumen: 'Munta el rodament 6305 gran. Substituir-lo exigeix desmuntar el motor.',
    cuerpo: 'Aquesta configuració conserva un rodament IMS de boles, però fa servir la revisió 6305, més gran. La seva incidència coneguda és menor que la del 6204 petit, tot i que no és zero. Normalment no es pot extreure per l’allotjament sense desmuntar el motor.',
    accion: 'Reuneix l’historial i demana una valoració especialitzada; si el motor es reconstrueix, inclou l’IMS en l’abast.',
  },
  NO_ES_EL_IMS_CLASICO_MEZGER: {
    veredicto: 'No, és un motor Mezger',
    resumen: 'Porta coixinet llis lubricat a pressió, no el rodament segellat que falla.',
    cuerpo: 'Aquesta versió fa servir una arquitectura diferent, amb coixinets llisos lubricats a pressió a l’eix intermedi. No li correspon la substitució preventiva del rodament segellat que es fa als Carrera, Boxster i Cayman M96/M97.',
  },
  SIN_IMS_9A1: {
    veredicto: 'No, no porta eix intermedi',
    resumen: 'Des de l’any model 2009 aquest motor acciona la distribució sense IMS.',
    cuerpo: 'Des de l’any model 2009, els 997.2 i 987.2 van incorporar una nova arquitectura que acciona la distribució sense eix intermedi. La fallada que avalua aquesta calculadora no s’aplica.',
  },
  NO_APLICA_OTRO_MODELO: {
    veredicto: 'No',
    resumen: 'Aquest model no pertany a la família M96/M97 amb el rodament segellat.',
    cuerpo: 'Aquest model no forma part dels 911 Carrera, Boxster o Cayman amb el rodament segellat que s’estudia aquí. La resposta no és una revisió general de fiabilitat.',
  },
  DATOS_INSUFICIENTES: {
    veredicto: 'No se sap',
    resumen: 'Sense aquesta dada no es pot dir quin munta. Ho resol el número de motor o una inspecció de la brida.',
    cuerpo: 'Aquell any van conviure motors o generacions diferents. Preferim dir-ho a donar-te una certesa falsa.',
  },
};

export const RODAMIENTOS: Record<Rodamiento, string> = {
  doble_hilera_5204: 'Doble filera, família 5204',
  una_hilera_6204: 'Una filera petita, família 6204',
  una_hilera_grande_6305: 'Una filera gran, 6305',
  mezger_cojinete_liso: 'Mezger, coixinet llis a pressió',
  sin_ims: 'Sense eix intermedi',
  no_aplica: 'No aplica',
  desconocido: 'Sense determinar',
};

export const SUSTITUIBILIDAD: Record<string, string> = {
  sin_abrir_el_bloque: 'Sense obrir el bloc',
  desmontando_el_motor: 'Exigeix desmuntar el motor',
  no_aplica: 'No aplica',
  desconocida: 'Sense determinar',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'L’any no és vàlid.',
  ano_solapado: 'Aquell any van conviure dues generacions amb motors diferents.',
  ano_de_matriculacion_en_frontera: 'És un any de matriculació al costat d’un canvi de generació, i per aquí no es pot decidir.',
  falta_version_mezger: 'Turbo, GT2 i GT3 fan servir motor Mezger i queden fora d’aquesta fallada, així que cal la versió.',
  combinacion_no_prevista: 'Aquesta combinació de model, generació i any no està prevista a les regles.',
  fuera_de_la_familia_m96_m97: 'El model no pertany a la família M96/M97 estudiada.',
  ano_no_es_modelo: 'L’any usat no és l’any model, així que el resultat perd precisió.',
  motor_sustituido: 'El motor no és el de fàbrica: munta el rodament que tocava quan es va fabricar aquell motor, no el de l’any del bastidor.',
  corte_por_numero_de_motor: 'S’ha aplicat el tall orientatiu per número de motor.',
  serie_remanufacturado: 'El número porta marca de motor remanufacturat, així que el tall no serveix.',
  serie_ilegible: 'El número de motor no té un format que es pugui comparar.',
  sin_corte_para_ese_motor: 'No hi ha un tall publicat per a aquest tipus de motor.',
};

export const ACCIONES: Record<string, string> = {
  evaluacion_previa: 'Demana una avaluació prèvia del motor abans de decidir cap intervenció.',
  revisar_documentacion: 'Reuneix factures, referència del kit, data i quilometratge: és el primer pas i no exigeix desmuntar res.',
  numero_motor: 'Afegeix el número de motor si el tens a mà.',
  identificacion_fisica: 'Quan la documentació no basta, fes inspeccionar físicament la brida.',
  valoracion_especifica: 'Aquesta configuració necessita una valoració específica del taller.',
  confirmar_fisicamente: 'El tall és orientatiu: confirma’l abans de demanar peces.',
  identificar_motor_actual: 'Identifica el motor que munta ara el cotxe.',
  verificar_factura_y_referencia: 'Verifica factura, referència, data i quilometratge de la intervenció.',
  completar_dato: 'Completa la dada que et demanem i tornem a calcular.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generació', porque: 'Aquell any van conviure dues generacions amb motors diferents.' },
  variante: { etiqueta: 'Versió', porque: 'Turbo, GT2 i GT3 porten motor Mezger i queden fora d’aquesta fallada.' },
  base_ano: { etiqueta: 'Aquell any és', porque: 'L’any de matriculació no basta aquí.' },
  motor: { etiqueta: 'Motor', porque: 'Cal el motor per afinar.' },
};

export const RETROFIT = {
  RETROFIT_DOCUMENTADO: {
    titular: 'D’origen afectat; consta una intervenció',
    cuerpo: 'El cotxe pertany a una família afectada, però declares que l’IMS va ser intervingut. La situació actual depèn del sistema instal·lat, de com es va muntar i del seu interval de servei. Sense la referència concreta no podem dir que el problema estigui resolt ni calcular un venciment.',
  },
  RETROFIT_SIN_DOCUMENTAR: {
    titular: 'D’origen afectat; la intervenció no està documentada',
    cuerpo: 'Sense factura ni referència no es pot saber què es va instal·lar ni quin manteniment li correspon. Tracta-ho com a pendent de verificar.',
  },
};

export const AVISO = 'Resultat orientatiu basat en la configuració de fàbrica. La calculadora no diagnostica l’estat mecànic del cotxe ni substitueix una inspecció especialitzada.';

export const AFINAR = {
  transicion: {
    titulo: 'Resol-ho amb el número de motor',
    ayuda: 'És l’únic que distingeix un rodament de l’altre sense desmuntar res.',
  },
};

export const UI = {
  modelo: 'Model',
  ano: 'Any',
  anoAyuda: 'Fes servir l’any model si el saps.',
  baseAno: 'Aquell any és',
  calcular: 'Comprovar el meu Porsche',
  continuar: 'Continuar',
  porqueEsto: 'Per què surt això',
  generacion: 'Generació',
  variante: 'Versió',
  codigoMotor: 'Tipus de motor',
  codigoAyuda: 'Cada motor té el seu propi tall de sèrie: el tipus diu quin s’aplica.',
  ladoDelCorte: 'Número de motor',
  ladoAyuda: 'Compara’l amb el número gravat al motor.',
  ladoNoSe: 'No ho sé',
  ladoInferior: (hasta: number) => `${hasta} o anterior`,
  ladoSuperior: (hasta: number) => `${hasta + 1} o posterior`,
  deFabrica: 'De fàbrica',
  configuracion: 'Configuració',
  sustitucion: 'Substitució',
  porQue: 'Per què',
  siguientePaso: 'Següent pas',
  situacionActual: 'Situació declarada',
  ctaTitulo: 'Vols confirmar-ho a la teva unitat?',
  ctaTexto: 'Revisem l’historial i la configuració del teu motor abans de recomanar cap intervenció.',
  ctaBoton: 'Sol·licitar diagnòstic IMS',
  ctaArticulo: 'Entendre com funciona l’IMS',
  errorAno: 'Introdueix un any entre 1948 i ' + (new Date().getFullYear() + 1) + '.',
  errorModelo: 'Tria un model.',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 o anterior', '996': '996', '997_1': '997.1', '997_2': '997.2', post_997: '991 o posterior',
  '986': '986', '987_1': '987.1', '987_2': '987.2 o posterior', post_987: 'Posterior', desconocida: 'No ho sé',
};

export const OPCIONES = {
  familia: [
    { valor: '911', etiqueta: '911' }, { valor: 'boxster', etiqueta: 'Boxster' }, { valor: 'cayman', etiqueta: 'Cayman' },
    { valor: 'cayenne', etiqueta: 'Cayenne' }, { valor: 'panamera', etiqueta: 'Panamera' }, { valor: 'macan', etiqueta: 'Macan' },
    { valor: 'taycan', etiqueta: 'Taycan' }, { valor: 'otro', etiqueta: 'Un altre Porsche' },
  ],
  baseAno: [
    { valor: 'modelo', etiqueta: 'Any model' }, { valor: 'matriculacion', etiqueta: 'Any de matriculació' }, { valor: 'desconocido', etiqueta: 'No ho sé' },
  ],
  generacion: {
    911: [
      { valor: 'pre_996', etiqueta: '993 o anterior' }, { valor: '996', etiqueta: '996' }, { valor: '997_1', etiqueta: '997.1' },
      { valor: '997_2', etiqueta: '997.2' }, { valor: 'post_997', etiqueta: '991 o posterior' }, { valor: 'desconocida', etiqueta: 'No ho sé' },
    ],
    boxster: [
      { valor: '986', etiqueta: '986' }, { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 o posterior' }, { valor: 'desconocida', etiqueta: 'No ho sé' },
    ],
    cayman: [
      { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 o posterior' }, { valor: 'desconocida', etiqueta: 'No ho sé' },
    ],
  } as Record<string, { valor: string; etiqueta: string }[]>,
  variante: [
    { valor: 'carrera_atmosferico', etiqueta: 'Carrera / Carrera 4 / Targa' },
    { valor: 'carrera_s_atmosferico', etiqueta: 'Carrera S / Carrera 4S / Targa 4S' },
    { valor: 'turbo', etiqueta: 'Turbo / Turbo S' }, { valor: 'gt2', etiqueta: 'GT2' },
    { valor: 'gt3', etiqueta: 'GT3 / GT3 RS' }, { valor: 'desconocida', etiqueta: 'No ho sé' },
  ],
};

export const PAGINA = {
  titulo: 'Calculadora IMS Porsche: comprova model i any · Valentin Motors',
  descripcion: 'Selecciona el teu model i any per saber quin tipus d’IMS pot muntar, el seu nivell d’afectació i quines comprovacions necessita.',
  eyebrow: 'Eina',
  h1: 'El teu Porsche està afectat per l’IMS?',
};
