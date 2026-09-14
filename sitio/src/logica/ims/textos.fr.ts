import type { Estado, Rodamiento } from './tipos.ts';
import type { TextoEstado } from './textos.es.ts';

/** Textes du calculateur IMS, français. Même forme que textos.es.ts. */

export const ESTADOS: Record<Estado, TextoEstado> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: {
    veredicto: 'Oui, cette voiture est concernée',
    resumen: 'Elle monte le roulement 6204 à une rangée. Il se remplace sans ouvrir le bloc.',
    cuerpo: 'Cette configuration montait normalement le petit roulement IMS à une rangée. C’est la révision au taux de défaillance historique le plus élevé. Il peut être remplacé préventivement sans ouvrir le bloc, mais il faut déposer la boîte et le volant moteur ou le flexplate.',
  },
  AFECTADO_DOBLE_SUSTITUIBLE: {
    veredicto: 'Oui, cette voiture est concernée',
    resumen: 'Elle monte le roulement à double rangée. Il se remplace sans ouvrir le bloc.',
    cuerpo: 'Cette configuration montait normalement un roulement IMS à double rangée. Il a montré moins de défaillances que le 6204 simple, mais l’âge et l’historique restent déterminants.',
    accion: 'Vérifiez les documents et incluez l’IMS dans une inspection spécialisée ; évaluez le remplacement selon l’état, l’usage et l’historique.',
  },
  TRANSICION_DOBLE_O_SIMPLE: {
    veredicto: 'Cela dépend du numéro de moteur',
    resumen: 'En 2000 et 2001 les deux roulements ont été montés. Le numéro de moteur tranche.',
    cuerpo: 'Le modèle et l’année ne suffisent pas à distinguer la double rangée du 6204 simple. Les deux se remplacent, mais leur taux de défaillance et la pièce diffèrent.',
    accion: 'Saisissez le numéro de moteur si vous l’avez, et confirmez-le physiquement avant de commander des pièces ou d’approuver une intervention.',
  },
  TRANSICION_SIMPLE_O_GRANDE: {
    veredicto: 'Cela dépend du numéro de moteur',
    resumen: 'En 2005 les deux roulements ont été montés. Le numéro de moteur tranche.',
    cuerpo: 'Certaines voitures montent le petit roulement remplaçable et d’autres le grand 6305, dont le remplacement exige normalement d’ouvrir le moteur.',
    accion: 'Utilisez le numéro de moteur lorsqu’une règle fiable existe et confirmez l’historique ou la configuration physique avant d’intervenir.',
  },
  AFECTADO_GRANDE_NO_SUSTITUIBLE: {
    veredicto: 'Oui, cette voiture est concernée',
    resumen: 'Elle monte le grand roulement 6305. Le remplacer exige de démonter le moteur.',
    cuerpo: 'Cette configuration conserve un roulement IMS à billes, mais utilise la révision 6305, plus grande. Son taux de défaillance connu est inférieur à celui du petit 6204, sans être nul. Il ne peut normalement pas être extrait par le logement sans démonter le moteur.',
    accion: 'Rassemblez l’historique et demandez une évaluation spécialisée ; si le moteur est refait, incluez l’IMS dans le périmètre.',
  },
  NO_ES_EL_IMS_CLASICO_MEZGER: {
    veredicto: 'Non, c’est un moteur Mezger',
    resumen: 'Il a un palier lisse lubrifié sous pression, pas le roulement étanche qui lâche.',
    cuerpo: 'Cette version utilise une architecture différente, avec des paliers lisses lubrifiés sous pression sur l’arbre intermédiaire. Le remplacement préventif du roulement étanche fait sur les Carrera, Boxster et Cayman M96/M97 ne la concerne pas.',
  },
  SIN_IMS_9A1: {
    veredicto: 'Non, il n’y a pas d’arbre intermédiaire',
    resumen: 'Depuis l’année modèle 2009, ce moteur entraîne la distribution sans IMS.',
    cuerpo: 'Depuis l’année modèle 2009, les 997.2 et 987.2 ont adopté une nouvelle architecture qui entraîne la distribution sans arbre intermédiaire. La panne évaluée par ce calculateur ne s’applique pas.',
  },
  NO_APLICA_OTRO_MODELO: {
    veredicto: 'Non',
    resumen: 'Ce modèle n’appartient pas à la famille M96/M97 au roulement étanche.',
    cuerpo: 'Ce modèle ne fait pas partie des 911 Carrera, Boxster ou Cayman au roulement étanche étudié ici. La réponse n’est pas un bilan général de fiabilité.',
  },
  DATOS_INSUFICIENTES: {
    veredicto: 'On ne sait pas',
    resumen: 'Sans cette donnée on ne peut pas dire lequel elle monte. Le numéro de moteur ou une inspection de la bride tranche.',
    cuerpo: 'Cette année-là ont coexisté des moteurs ou des générations différents. Nous préférons le dire plutôt que de donner une fausse certitude.',
  },
};

export const RODAMIENTOS: Record<Rodamiento, string> = {
  doble_hilera_5204: 'Double rangée, famille 5204',
  una_hilera_6204: 'Petite à une rangée, famille 6204',
  una_hilera_grande_6305: 'Grande à une rangée, 6305',
  mezger_cojinete_liso: 'Mezger, palier lisse sous pression',
  sin_ims: 'Sans arbre intermédiaire',
  no_aplica: 'Sans objet',
  desconocido: 'Indéterminé',
};

export const SUSTITUIBILIDAD: Record<string, string> = {
  sin_abrir_el_bloque: 'Sans ouvrir le bloc',
  desmontando_el_motor: 'Exige de démonter le moteur',
  no_aplica: 'Sans objet',
  desconocida: 'Indéterminé',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'L’année n’est pas valide.',
  ano_solapado: 'Cette année-là ont coexisté deux générations aux moteurs différents.',
  ano_de_matriculacion_en_frontera: 'C’est une année d’immatriculation voisine d’un changement de génération, et cela ne permet pas de trancher.',
  falta_version_mezger: 'Turbo, GT2 et GT3 utilisent le moteur Mezger et sont hors de cette panne : la version est nécessaire.',
  combinacion_no_prevista: 'Cette combinaison de modèle, génération et année n’est pas prévue dans les règles.',
  fuera_de_la_familia_m96_m97: 'Le modèle n’appartient pas à la famille M96/M97 étudiée.',
  ano_no_es_modelo: 'L’année utilisée n’est pas l’année modèle, le résultat perd donc en précision.',
  motor_sustituido: 'Le moteur n’est pas celui d’origine : il monte le roulement en vigueur lors de sa fabrication, pas celui de l’année du châssis.',
  corte_por_numero_de_motor: 'La coupure indicative par numéro de moteur a été appliquée.',
  serie_remanufacturado: 'Le numéro porte une marque de moteur reconditionné, la coupure ne s’applique donc pas.',
  serie_ilegible: 'Le numéro de moteur n’a pas un format comparable.',
  sin_corte_para_ese_motor: 'Il n’existe pas de coupure publiée pour ce type de moteur.',
};

export const ACCIONES: Record<string, string> = {
  evaluacion_previa: 'Demandez une évaluation préalable du moteur avant de décider d’une intervention.',
  revisar_documentacion: 'Rassemblez factures, référence du kit, date et kilométrage : c’est la première étape et elle n’exige aucun démontage.',
  numero_motor: 'Ajoutez le numéro de moteur si vous l’avez sous la main.',
  identificacion_fisica: 'Quand les documents ne suffisent pas, faites inspecter physiquement la bride.',
  valoracion_especifica: 'Cette configuration nécessite une évaluation spécifique de l’atelier.',
  confirmar_fisicamente: 'La coupure est indicative : confirmez-la avant de commander des pièces.',
  identificar_motor_actual: 'Identifiez le moteur que la voiture monte aujourd’hui.',
  verificar_factura_y_referencia: 'Vérifiez facture, référence, date et kilométrage de l’intervention.',
  completar_dato: 'Complétez la donnée demandée et nous recalculons.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Génération', porque: 'Cette année-là ont coexisté deux générations aux moteurs différents.' },
  variante: { etiqueta: 'Version', porque: 'Turbo, GT2 et GT3 montent le moteur Mezger et sont hors de cette panne.' },
  base_ano: { etiqueta: 'Cette année est', porque: 'L’année d’immatriculation ne suffit pas ici.' },
  motor: { etiqueta: 'Moteur', porque: 'Le moteur est nécessaire pour affiner.' },
};

export const RETROFIT = {
  RETROFIT_DOCUMENTADO: {
    titular: 'Concernée d’origine ; une intervention est documentée',
    cuerpo: 'La voiture appartient à une famille concernée, mais vous déclarez que l’IMS a été traité. La situation actuelle dépend du système installé, de son montage et de son intervalle d’entretien. Sans la référence précise, nous ne pouvons ni dire que le problème est résolu ni calculer une échéance.',
  },
  RETROFIT_SIN_DOCUMENTAR: {
    titular: 'Concernée d’origine ; l’intervention n’est pas documentée',
    cuerpo: 'Sans facture ni référence, impossible de savoir ce qui a été installé ni quel entretien s’applique. Considérez-le comme à vérifier.',
  },
};

export const AVISO = 'Résultat indicatif fondé sur la configuration d’usine. Le calculateur ne diagnostique pas l’état mécanique de la voiture et ne remplace pas une inspection spécialisée.';

export const AFINAR = {
  transicion: {
    titulo: 'Tranchez avec le numéro de moteur',
    ayuda: 'C’est la seule chose qui distingue un roulement de l’autre sans rien démonter.',
  },
};

export const UI = {
  modelo: 'Modèle',
  ano: 'Année',
  anoAyuda: 'Utilisez l’année modèle si vous la connaissez.',
  baseAno: 'Cette année est',
  calcular: 'Vérifier ma Porsche',
  continuar: 'Continuer',
  porqueEsto: 'Pourquoi ce résultat',
  generacion: 'Génération',
  variante: 'Version',
  codigoMotor: 'Type de moteur',
  codigoAyuda: 'Chaque moteur a sa propre coupure de série : le type dit laquelle s’applique.',
  ladoDelCorte: 'Numéro de moteur',
  ladoAyuda: 'Comparez-le au numéro gravé sur le moteur.',
  ladoNoSe: 'Je ne sais pas',
  ladoInferior: (hasta: number) => `${hasta} ou antérieur`,
  ladoSuperior: (hasta: number) => `${hasta + 1} ou postérieur`,
  deFabrica: 'D’usine',
  configuracion: 'Configuration',
  sustitucion: 'Remplacement',
  porQue: 'Pourquoi',
  siguientePaso: 'Étape suivante',
  situacionActual: 'Situation déclarée',
  ctaTitulo: 'Vous voulez le confirmer sur votre voiture ?',
  ctaTexto: 'Nous vérifions l’historique et la configuration de votre moteur avant de recommander une intervention.',
  ctaBoton: 'Demander un diagnostic IMS',
  ctaArticulo: 'Comprendre le fonctionnement de l’IMS',
  errorAno: 'Saisissez une année entre 1948 et ' + (new Date().getFullYear() + 1) + '.',
  errorModelo: 'Choisissez un modèle.',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 ou antérieure', '996': '996', '997_1': '997.1', '997_2': '997.2', post_997: '991 ou postérieure',
  '986': '986', '987_1': '987.1', '987_2': '987.2 ou postérieure', post_987: 'Postérieure', desconocida: 'Je ne sais pas',
};

export const OPCIONES = {
  familia: [
    { valor: '911', etiqueta: '911' }, { valor: 'boxster', etiqueta: 'Boxster' }, { valor: 'cayman', etiqueta: 'Cayman' },
    { valor: 'cayenne', etiqueta: 'Cayenne' }, { valor: 'panamera', etiqueta: 'Panamera' }, { valor: 'macan', etiqueta: 'Macan' },
    { valor: 'taycan', etiqueta: 'Taycan' }, { valor: 'otro', etiqueta: 'Autre Porsche' },
  ],
  baseAno: [
    { valor: 'modelo', etiqueta: 'Année modèle' }, { valor: 'matriculacion', etiqueta: 'Année d’immatriculation' }, { valor: 'desconocido', etiqueta: 'Je ne sais pas' },
  ],
  generacion: {
    911: [
      { valor: 'pre_996', etiqueta: '993 ou antérieure' }, { valor: '996', etiqueta: '996' }, { valor: '997_1', etiqueta: '997.1' },
      { valor: '997_2', etiqueta: '997.2' }, { valor: 'post_997', etiqueta: '991 ou postérieure' }, { valor: 'desconocida', etiqueta: 'Je ne sais pas' },
    ],
    boxster: [
      { valor: '986', etiqueta: '986' }, { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 ou postérieure' }, { valor: 'desconocida', etiqueta: 'Je ne sais pas' },
    ],
    cayman: [
      { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 ou postérieure' }, { valor: 'desconocida', etiqueta: 'Je ne sais pas' },
    ],
  } as Record<string, { valor: string; etiqueta: string }[]>,
  variante: [
    { valor: 'carrera_atmosferico', etiqueta: 'Carrera / Carrera 4 / Targa' },
    { valor: 'carrera_s_atmosferico', etiqueta: 'Carrera S / Carrera 4S / Targa 4S' },
    { valor: 'turbo', etiqueta: 'Turbo / Turbo S' }, { valor: 'gt2', etiqueta: 'GT2' },
    { valor: 'gt3', etiqueta: 'GT3 / GT3 RS' }, { valor: 'desconocida', etiqueta: 'Je ne sais pas' },
  ],
};

export const PAGINA = {
  titulo: 'Calculateur IMS Porsche : vérifiez modèle et année · Valentin Motors',
  descripcion: 'Sélectionnez votre modèle et votre année pour savoir quel type d’IMS il peut monter, son niveau d’exposition et quelles vérifications il nécessite.',
  eyebrow: 'Outil',
  h1: 'Votre Porsche est-elle concernée par l’IMS ?',
};
