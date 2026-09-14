import type { Evidencia, Susceptibilidad, Tecnologia, Urgencia, Variante } from './tipos.ts';
import type { TextoEje, PreguntaSintoma } from './textos.es.ts';

/** Textes de l’évaluateur de bore scoring, français. Même forme que textos.es.ts. */

export const SUSCEPTIBILIDAD: Record<Susceptibilidad, TextoEje> = {
  ELEVATED_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Élevée dans cette famille',
    resumen: 'C’est l’un des groupes que les spécialistes rencontrent le plus souvent parmi les moteurs touchés.',
    cuerpo: 'Cette configuration appartient à l’un des groupes qui reviennent le plus souvent dans l’expérience publiée des ateliers qui refont ces moteurs. Cela décrit une famille, pas cette voiture : cela ne signifie pas qu’elle est endommagée et ne permet pas de calculer une probabilité individuelle.',
  },
  DOCUMENTED_SUSCEPTIBILITY: {
    etiqueta: 'Cas documentés',
    resumen: 'Il existe des cas décrits et une architecture compatible, sans atteindre le groupe M96/M97 le plus touché.',
    cuerpo: 'Il existe des cas publiés et l’architecture du cylindre est compatible avec le dommage, mais cette configuration ne doit pas être assimilée automatiquement aux M96/M97 qui concentrent l’inquiétude.',
  },
  LOWER_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Comparativement faible',
    resumen: 'Cette version apparaît moins souvent dans l’expérience technique publiée.',
    cuerpo: 'Elle apparaît moins souvent que ses sœurs de plus grosse cylindrée dans ce que publient les spécialistes. Moins n’est pas impossible : s’il y a des symptômes, on contrôle quand même.',
  },
  LOWER_BY_BORE_TECHNOLOGY: {
    etiqueta: 'Technologie moins associée',
    resumen: 'Le cylindre ne partage pas le schéma classique Lokasil et Alusil évalué ici.',
    cuerpo: 'D’après l’identification fournie, le moteur utilise du Nikasil, un revêtement ferreux projeté ou des chemises et un bloc en fonte. Il ne partage pas le schéma principal qu’évalue cet outil, ce qui ne garantit l’état d’aucun cylindre ni n’exclut une autre usure.',
  },
  ENGINE_SPECIFIC_CLASSIFICATION: {
    etiqueta: 'Il faut identifier le moteur',
    resumen: 'Sur ce modèle et cette année, des architectures différentes ont coexisté.',
    cuerpo: 'Avec ce qui a été fourni jusqu’ici, des architectures différentes coexistent sous le même nom commercial. Il faut la version, la cylindrée ou le code moteur : classer sans cela serait donner une réponse trompeuse.',
  },
  OUTSIDE_VALIDATED_SCOPE: {
    etiqueta: 'Hors de la matrice validée',
    resumen: 'Nous n’avons pas de règle assez fiable pour cette configuration.',
    cuerpo: 'Cet outil couvre les 911 à partir de la 996, Boxster et Cayman, et Cayenne, Panamera et Macan à moteur identifiable. Pour le reste, il n’y a pas de règle que nous puissions défendre, et une zone verte générique serait pire que de ne rien dire. S’il y a des symptômes, ils doivent être évalués quand même.',
  },
  NOT_APPLICABLE_ELECTRIC: {
    etiqueta: 'Sans objet',
    resumen: 'Un véhicule électrique n’a pas de cylindres de combustion.',
    cuerpo: 'Sans cylindres de combustion, cette panne ne peut pas exister.',
  },
};

export const EVIDENCIA: Record<Evidencia, TextoEje> = {
  NO_EVIDENCE_REPORTED: {
    etiqueta: 'Aucun indice déclaré',
    resumen: 'Ni symptômes ni essais déclarés. Ce n’est pas la même chose qu’un moteur sain.',
    cuerpo: 'Aucun symptôme ni essai suspect n’a été communiqué. C’est tout ce que l’on peut affirmer : un dommage naissant peut exister sans donner de signes perceptibles depuis le siège.',
  },
  ONE_NON_SPECIFIC_SIGNAL: {
    etiqueta: 'Un indice isolé',
    resumen: 'Il y a un symptôme qui peut avoir d’autres causes.',
    cuerpo: 'Un seul symptôme, sans rien qui l’accompagne, admet beaucoup d’explications : poussoirs, injecteurs, une fuite d’échappement ou le démarrage à froid lui-même. Il convient de surveiller s’il persiste ou si un autre apparaît.',
  },
  MULTIPLE_COMPATIBLE_SIGNALS: {
    etiqueta: 'Plusieurs indices compatibles',
    resumen: 'Des signes de deux familles indépendantes coïncident.',
    cuerpo: 'Des signes de familles différentes concordent, par exemple une consommation croissante et un cognement rythmique, ou de la suie asymétrique avec une bougie huileuse. La coïncidence justifie une endoscopie et un diagnostic, pas un diagnostic à elle seule.',
  },
  SUPPORTING_TEST_SUSPICIOUS: {
    etiqueta: 'Un essai suspect',
    resumen: 'Un essai complémentaire indique une usure, sans la confirmer visuellement.',
    cuerpo: 'L’analyse d’huile, la compression, le leak-down ou ce qui a été trouvé dans le filtre appuient le soupçon. Appuient : la confirmation reste visuelle.',
  },
  NEGATIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Endoscopie rapportée normale',
    resumen: 'Elle décrit ce qui a été vu ce jour-là et sur ces surfaces.',
    cuerpo: 'Une endoscopie complète et récente rapportée normale est une bonne nouvelle circonscrite : elle décrit l’état observé à cette date et dans les zones qui ont pu être vues. La susceptibilité de la famille ne change pas pour autant.',
  },
  LIMITED_OR_INCONCLUSIVE_BORESCOPE: {
    etiqueta: 'Endoscopie limitée ou non concluante',
    resumen: 'L’inspection ne permet pas de déclarer le moteur bon.',
    cuerpo: 'L’essai n’a pas couvert les zones critiques, n’a pas atteint tous les cylindres nécessaires ou le rapport ne conclut pas. Sur un M96/M97, l’accès par les seuls puits de bougie laisse de côté précisément là où le rayage commence d’habitude.',
  },
  POSITIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Endoscopie positive déclarée',
    resumen: 'Vous déclarez un rapport positif que nous n’avons pas examiné.',
    cuerpo: 'Nous prenons le rapport pour ce qu’il est : une déclaration. Avant de parler d’ampleur et d’options, un spécialiste devrait examiner les images ou le moteur.',
  },
  CONFIRMED_BY_SPECIALIST: {
    etiqueta: 'Confirmé par un spécialiste',
    resumen: 'Un rapport professionnel le confirme.',
    cuerpo: 'Avec un diagnostic professionnel, la conversation cesse d’être « existe-t-il » pour devenir l’ampleur, la cause et la stratégie de reconstruction.',
  },
  CONFLICTING_EVIDENCE: {
    etiqueta: 'Informations contradictoires',
    resumen: 'Un essai normal coexiste avec des symptômes qui le contredisent.',
    cuerpo: 'Une endoscopie ancienne ou limitée rapportée normale, suivie de nouveaux symptômes, ne clôt rien : elle impose de refaire l’inspection avec le bon protocole.',
  },
};

export const URGENCIA: Record<Urgencia, TextoEje> = {
  INFORMATION_ONLY: { etiqueta: 'Information et entretien', resumen: 'Rien de pressé. Surveillez l’évolution et gardez l’huile à jour.' },
  PPI_SCOPE_RECOMMENDED: { etiqueta: 'Incluez une endoscopie dans l’inspection avant achat', resumen: 'Avant de l’acheter, que l’inspection comprenne une endoscopie complète.' },
  BOOK_SPECIALIST_INSPECTION: { etiqueta: 'Demandez un contrôle spécialisé', resumen: 'Il y a quelque chose à regarder. Il peut avoir d’autres causes, et c’est pour cela qu’on regarde.' },
  PROMPT_INSPECTION: { etiqueta: 'Faites-le contrôler au plus vite', resumen: 'Les indices justifient endoscopie et diagnostic sans attendre.' },
  MINIMIZE_USE_AND_CONTACT: { etiqueta: 'Réduisez l’usage et consultez-nous avant de continuer', resumen: 'Mieux vaut ne pas accumuler plus de dommages avant d’évaluer le moteur.' },
  REPAIR_PLANNING: { etiqueta: 'Envisagez réparation ou reconstruction', resumen: 'Le diagnostic fait, il reste à décider l’ampleur et la stratégie.' },
  INSUFFICIENT_DATA: { etiqueta: 'Une donnée essentielle manque', resumen: 'Sans identifier le moteur, nous ne pouvons pas dire quel contrôle a du sens.' },
};

export const TECNOLOGIA: Record<Tecnologia, string> = {
  lokasil: 'Lokasil, cylindre aluminium-silicium intégré',
  alusil: 'Alusil, bloc hypereutectique',
  nikasil: 'Nikasil ou revêtement équivalent',
  recubrimiento_proyectado: 'Revêtement ferreux projeté, APS ou PTWA',
  hierro: 'Chemise ou bloc en fonte',
  no_aplica_electrico: 'Sans cylindres de combustion',
  desconocida: 'Non identifié',
};

export const CONFIANZA: Record<'alta' | 'media' | 'baja', string> = {
  alta: 'Élevée : génération, version et moteur cohérents',
  media: 'Moyenne : la classification est solide, une donnée moteur manque',
  baja: 'Faible : quelque chose reste à identifier ou les données se contredisent',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'L’année n’est pas valide.',
  ano_solapado: 'Cette année-là ont coexisté deux générations aux moteurs différents.',
  ano_de_matriculacion_en_frontera: 'C’est une année d’immatriculation voisine d’un changement de génération, et cela ne permet pas de trancher.',
  modelo_y_ano_incompatibles: 'Ce modèle n’était pas fabriqué cette année-là. Nous ne le corrigeons pas de nous-mêmes.',
  falta_combustible: 'Sur un Cayenne, une Panamera ou un Macan, le carburant commande tout le reste.',
  falta_version: 'La version sépare des architectures différentes sous le même nom.',
  falta_cilindrada: 'La cylindrée est ce qui sépare deux groupes aux histoires très différentes.',
  sin_regla_para_esa_combinacion: 'Nous n’avons pas de règle validée pour cette combinaison.',
  reglas_en_conflicto: 'Deux règles de la matrice s’appliquent à la fois, nous préférons donc ne pas choisir à votre place.',
  electrico_sin_cilindros: 'Une électrique n’a pas de cylindres de combustion.',
  originalidad_desconocida: 'On ne sait pas si le moteur est celui d’origine.',
  motor_sustituido_sin_identificar: 'Le moteur a été remplacé et n’est pas identifié : il porte la spécification de sa fabrication, pas celle de l’année du châssis.',
  reconstruccion_sin_detalle: 'Une reconstruction est documentée, mais ni son ampleur ni la technologie installée.',
  reconstruccion_cambia_tecnologia: 'La reconstruction déclarée change la technologie du cylindre.',
  reconstruccion_misma_tecnologia: 'La reconstruction déclarée conserve la technologie d’origine.',
  boroscopia_confirmada: 'Un spécialiste a examiné ou émis le rapport.',
  boroscopia_positiva_declarada: 'Vous déclarez un rapport positif que nous n’avons pas examiné.',
  boroscopia_no_concluyente: 'L’endoscopie ne conclut pas ou montre des marques douteuses.',
  boroscopia_solo_por_bujias: 'L’accès s’est fait uniquement par les puits de bougie, qui sur ces moteurs n’atteignent pas la zone critique.',
  boroscopia_parcial: 'L’inspection n’a pas couvert tous les cylindres nécessaires.',
  boroscopia_alcance_desconocido: 'L’ampleur de l’inspection n’est pas connue.',
  boroscopia_negativa_contra_sintomas: 'Un essai rapporté normal coexiste avec des symptômes postérieurs.',
  dos_familias_de_senal: 'Des signes de deux familles indépendantes coïncident.',
  prueba_complementaria_sospechosa: 'Un essai complémentaire indique une usure.',
  una_senal_inespecifica: 'Il y a un signe isolé, compatible avec plusieurs causes.',
  'regla_911-mezger': 'Turbo, GT2 et GT3 de cette génération utilisent le moteur Mezger, avec Nikasil.',
  'regla_911-991-1-especificos': 'La Turbo et les GT n’héritent pas de la règle de la Carrera.',
  'regla_911-pre-996': 'Les 911 antérieures à la 996 sont hors de cette matrice.',
  'regla_911-996-1-carrera': '996.1 Carrera 3.4, cylindres Lokasil.',
  'regla_911-996-2-carrera': '996.2 Carrera 3.6, l’un des groupes les plus cités.',
  'regla_911-997-1-carrera': '997.1 Carrera 3.6 et S 3.8, le groupe aux cas publiés les plus nombreux.',
  'regla_911-997-2-carrera': '997.2 Carrera avec 9A1/MA1 et Alusil.',
  'regla_911-991-1-carrera': '991.1 Carrera avec 9A1/MA1 et Alusil.',
  'regla_911-991-2-carrera': '991.2 Carrera, avec revêtement ferreux projeté.',
  'regla_911-992': 'À partir de la 992, il faut confirmer l’architecture du moteur.',
  'regla_bc-986': 'Boxster 986, comparativement moins cité.',
  'regla_bc-987-1-base': '987.1 d’accès, 2.7, comparativement moins cité.',
  'regla_bc-987-1-s-3-2': '987.1 S en 3.2, avant le 3.4.',
  'regla_bc-987-1-s-3-4': '987.1 S en 3.4, le groupe le plus cité chez Boxster et Cayman.',
  'regla_bc-987-1-s-hasta-2006': 'Le Boxster S 987.1 a monté le 3.2 jusqu’à l’année modèle 2006.',
  'regla_bc-987-1-s-desde-2007': 'Le Boxster S 987.1 monte le 3.4 à partir de l’année modèle 2007.',
  'regla_bc-987-1-cayman-s': 'Le Cayman S 987.1 monte le 3.4 dès la première année.',
  'regla_bc-987-2': '987.2 avec 9A1/MA1 et Alusil.',
  'regla_bc-981': '981 avec 9A1/MA1 et Alusil.',
  'regla_bc-981-especificos': 'Spyder et GT4 ont un moteur différent du reste du 981.',
  'regla_bc-718': '718 quatre cylindres, avec revêtement ferreux projeté.',
  'regla_taycan': 'Un Taycan est électrique.',
  'regla_electrico': 'Avec un moteur électrique, pas de cylindres de combustion.',
  'regla_suv-diesel-hibrido': 'Un diesel ou un hybride non identifié ne se classe pas par son nom.',
  'regla_cayenne-vr6': 'Cayenne VR6, bloc en fonte.',
  'regla_cayenne-v8-955-958-1': 'Cayenne V8 M48, avec cas documentés.',
  'regla_cayenne-mct-958-2': 'Cayenne 3.6 MCT, Alusil avec cas documentés.',
  'regla_cayenne-e3': 'Cayenne de troisième génération, chemises en fonte ou APS.',
  'regla_panamera-970': 'Panamera 970, Alusil avec cas documentés.',
  'regla_panamera-970-base': 'Sur la 970 d’accès, il faut identifier le moteur.',
  'regla_panamera-971': 'Panamera 971, chemises en fonte ou APS.',
  'regla_macan-2-0': 'Macan 2.0 EA888, hors du schéma Alusil classique.',
  'regla_macan-v6-mct': 'Macan V6 MCT, Alusil avec cas documentés.',
  'regla_macan-v6-ea839': 'Macan V6 EA839, chemises en fonte.',
  'regla_otro-porsche': 'Cette Porsche n’est pas dans la matrice validée.',
};

export const AVISOS: Record<string, string> = {
  menor_no_es_inmune: 'Une moindre susceptibilité n’est pas une immunité : si des symptômes apparaissent, on contrôle comme sur n’importe quel autre.',
  sin_indicios_no_es_sano: 'N’avoir déclaré aucun indice n’est pas un moteur sain : un dommage naissant peut ne donner aucun signe.',
  negativa_es_de_esa_fecha: 'Une endoscopie normale décrit cette date et ces surfaces, pas l’avenir du moteur.',
  no_declarar_solucionado: 'Une facture de reconstruction à l’ampleur inconnue ne permet pas de considérer le problème résolu.',
  motor_sustituido: 'Le moteur n’étant pas celui d’origine, la susceptibilité de la voiture dépend du moteur qu’elle porte aujourd’hui.',
  motor_sin_verificar: 'On ne sait pas si le moteur est celui d’origine, la classification peut donc ne pas correspondre à cette voiture.',
  ano_no_es_modelo: 'L’année utilisée n’est pas l’année modèle, le résultat perd donc en précision.',
  consumo_para_el_taller: 'La consommation notée est conservée pour la montrer à l’atelier : nous ne l’utilisons pas pour noter le risque.',
};

export const ACCIONES: Record<string, string> = {
  vigilar_evolucion: 'Notez consommation, bruits et fumée avec les dates : la tendance vaut plus qu’une mesure isolée.',
  mantenimiento_preventivo: 'Gardez l’huile et le filtre à jour, et évitez de prolonger les cycles à froid.',
  boroscopia_en_precompra: 'Demandez que l’inspection avant achat comprenne une endoscopie complète, pas seulement par les puits de bougie.',
  pedir_historial: 'Rassemblez factures, analyses d’huile antérieures et tout rapport précédent sur le moteur.',
  revision_especializada: 'Demandez un contrôle spécialisé avec diagnostic différentiel : poussoirs, injecteurs et échappement donnent des symptômes proches.',
  preparar_datos: 'Apportez les données en ordre : quand cela a commencé, à froid ou à chaud, litres ajoutés et kilomètres entre les appoints.',
  boroscopia_y_diagnostico: 'Réservez endoscopie et diagnostic : c’est le moyen de voir le cylindre et d’écarter d’autres causes.',
  reducir_uso: 'Réduisez l’usage jusqu’à l’évaluation du moteur, et évitez les séries de fortes accélérations.',
  valorar_reparacion: 'Nous évaluons cause, ampleur et stratégie de reconstruction avant de toucher à quoi que ce soit.',
  enviar_informe: 'Partagez le rapport et les images avec l’atelier pour évaluer l’ampleur réelle.',
  identificar_motor: 'Identifiez le moteur : l’étiquette du bloc, les documents ou une photo du code suffisent.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Génération', porque: 'Cette année-là ont coexisté deux générations aux cylindres différents.' },
  variante: { etiqueta: 'Version', porque: 'Sous le même nom coexistent des architectures moteur différentes.' },
  combustible: { etiqueta: 'Moteur', porque: 'Sur un Cayenne, une Panamera ou un Macan, le nom et l’année ne disent pas quel moteur est monté.' },
  cilindrada: { etiqueta: 'Cylindrée', porque: 'C’est ce qui sépare deux groupes aux histoires très différentes.' },
  ano_imposible: { etiqueta: 'Vérifiez l’année ou le modèle', porque: 'Ce modèle n’était pas fabriqué cette année-là, et nous préférons ne pas le corriger de nous-mêmes.' },
};

export const AVISO = 'Résultat indicatif fondé sur la configuration d’usine et sur les données que vous avez déclarées. L’absence de symptômes n’exclut pas un dommage naissant et les symptômes décrits peuvent avoir d’autres causes. Seule une endoscopie réalisée et interprétée correctement peut confirmer visuellement le bore scoring. Cet outil ne remplace pas une inspection mécanique.';

export const CONFIRMACION = 'Les symptômes peuvent orienter, mais seule une endoscopie adéquate permet de confirmer visuellement le bore scoring.';

export const AFINAR = {
  titulo: 'Affiner le résultat avec symptômes et essais',
  ayuda: 'Questions courtes sur les symptômes, les essais et l’historique du moteur. Ce que vous savez suffit : « je ne sais pas » est une réponse valable et n’aggrave pas le résultat.',
};

export const UI = {
  modelo: 'Modèle',
  ano: 'Année',
  anoAyuda: 'Si possible, utilisez l’année modèle. Elle peut différer de l’immatriculation.',
  baseAno: 'Cette année est',
  calcular: 'Vérifier ma Porsche',
  situacion: 'Dans quelle situation êtes-vous ?',
  ejeConfiguracion: 'Configuration du moteur',
  ejeSusceptibilidad: 'Susceptibilité du moteur',
  ejeEvidencia: 'Informations sur cette voiture',
  ejeConfianza: 'Qualité de l’identification',
  siguientePaso: 'Ce que nous ferions maintenant',
  porqueEsto: 'Pourquoi ce résultat',
  aTenerEnCuenta: 'À prendre en compte',
  deFabrica: 'D’usine',
  motorActual: 'Moteur monté aujourd’hui',
  consumoDeclarado: 'Consommation déclarée',
  consumoUnidad: 'l/1 000 km',
  fuentes: 'Sources',
  reglas: 'Règles',
  ctaArticulo: 'Comprendre le bore scoring',
  ctaIms: 'Vérifier aussi l’IMS',
  imsPuente: 'Ce moteur appartient aussi à une génération évaluée par le calculateur IMS. Ce sont deux vérifications distinctes, non combinées en une seule note.',
  errorAno: 'Saisissez une année entre 1948 et ' + (new Date().getFullYear() + 1) + '.',
  noLoSe: 'Je ne sais pas',
  detallesConsumo: 'Si vous l’avez noté',
};

export const CTA: Record<Urgencia, string> = {
  INFORMATION_ONLY: 'Consulter l’entretien préventif',
  PPI_SCOPE_RECOMMENDED: 'Demander une inspection avant achat avec endoscopie',
  BOOK_SPECIALIST_INSPECTION: 'Demander un contrôle spécialisé',
  PROMPT_INSPECTION: 'Réserver diagnostic et endoscopie',
  MINIMIZE_USE_AND_CONTACT: 'Réserver diagnostic et endoscopie',
  REPAIR_PLANNING: 'Évaluer les options de réparation',
  INSUFFICIENT_DATA: 'Aidez-nous à identifier le moteur',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 ou antérieure', '996_1': '996.1', '996_2': '996.2', '997_1': '997.1', '997_2': '997.2',
  '991_1': '991.1', '991_2': '991.2', post_991: '992 ou postérieure', '986': '986', '987_1': '987.1', '987_2': '987.2',
  '981': '981', '718': '718',
  cayenne_955: '955 · 2003-2006', cayenne_957: '957 · 2008-2010', cayenne_958_1: '958.1 · 2011-2014',
  cayenne_958_2: '958.2 · 2015-2018', cayenne_e3: 'E3 · depuis 2019',
  panamera_970: '970 · 2009-2016', panamera_971: '971 · depuis 2017',
  macan_95b: '95B · 2014-2018', macan_95b_2: '95B · depuis 2019',
  desconocida: 'Je ne sais pas',
};

export const VARIANTE: Record<Variante, string> = {
  carrera: 'Carrera / Carrera 4', carrera_s: 'Carrera S / 4S / Targa', turbo: 'Turbo / Turbo S', gt2: 'GT2',
  gt3: 'GT3 / GT3 RS', base: 'Version d’accès', s: 'S', gts: 'GTS', spyder_gt4: 'Spyder / GT4',
  otra: 'Autre', desconocida: 'Je ne sais pas',
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
  combustible: [
    { valor: 'gasolina', etiqueta: 'Essence' }, { valor: 'diesel', etiqueta: 'Diesel' }, { valor: 'hibrido', etiqueta: 'Hybride' },
    { valor: 'electrico', etiqueta: 'Électrique' }, { valor: 'desconocido', etiqueta: 'Je ne sais pas' },
  ],
  situacion: [
    { valor: 'compra', etiqueta: 'J’envisage de l’acheter' }, { valor: 'propietario', etiqueta: 'Elle est déjà à moi' },
    { valor: 'sintoma', etiqueta: 'J’ai observé un symptôme' }, { valor: 'prueba', etiqueta: 'J’ai déjà un essai ou un diagnostic' },
  ],
  originalidad: [
    { valor: 'original', etiqueta: 'Oui, celui d’origine' }, { valor: 'sustituido', etiqueta: 'Non, il a été remplacé' },
    { valor: 'reconstruido', etiqueta: 'Il a été reconstruit' }, { valor: 'desconocida', etiqueta: 'Je ne sais pas' },
  ],
  tecnologiaReconstruida: [
    { valor: '', etiqueta: 'Je ne sais pas' }, { valor: 'lokasil', etiqueta: 'L’origine' }, { valor: 'alusil', etiqueta: 'Alusil reconditionné' },
    { valor: 'hierro', etiqueta: 'Chemise en fonte' }, { valor: 'nikasil', etiqueta: 'Nikasil ou NSC' }, { valor: 'recubrimiento_proyectado', etiqueta: 'Revêtement projeté' },
  ],
};

export const SINTOMAS: PreguntaSintoma[] = [
  { campo: 'consumoAceite', etiqueta: 'La consommation d’huile a-t-elle augmenté ?', ayuda: 'Par rapport à l’habitude de cette voiture, pas à un chiffre de catalogue.',
    opciones: [{ valor: 'estable', etiqueta: 'Non, elle est stable' }, { valor: 'aumenta', etiqueta: 'Oui, elle a augmenté' }, { valor: 'no_lo_se', etiqueta: 'Je ne peux pas le savoir' }] },
  { campo: 'golpeteo', etiqueta: 'Entend-on un cognement rythmique dans le moteur ?', ayuda: 'Le « tic-tic » seulement à froid, poussoirs et injecteurs le font aussi.',
    opciones: [{ valor: 'no', etiqueta: 'Non' }, { valor: 'solo_frio', etiqueta: 'Seulement à froid' }, { valor: 'frio_y_caliente', etiqueta: 'Aussi à chaud' }, { valor: 'no_lo_se', etiqueta: 'Je ne sais pas' }] },
  { campo: 'humo', etiqueta: 'Émet-elle de la fumée visible ?',
    opciones: [{ valor: 'no', etiqueta: 'Non' }, { valor: 'bocanada_arranque', etiqueta: 'Une bouffée occasionnelle au démarrage' }, { valor: 'arranque_repetido', etiqueta: 'Répétée au démarrage' }, { valor: 'en_marcha', etiqueta: 'Au ralenti ou en roulant' }, { valor: 'no_lo_se', etiqueta: 'Je ne sais pas' }] },
  { campo: 'hollin', etiqueta: 'Une sortie d’échappement accumule-t-elle plus de suie huileuse que l’autre ?', ayuda: 'Utile seulement quand chaque sortie correspond à une rangée de cylindres.',
    opciones: [{ valor: 'no', etiqueta: 'Non' }, { valor: 'asimetrico', etiqueta: 'Oui, une beaucoup plus' }, { valor: 'ambas', etiqueta: 'Les deux également' }, { valor: 'no_comparable', etiqueta: 'L’échappement ne permet pas de comparer' }, { valor: 'no_lo_se', etiqueta: 'Je ne sais pas' }] },
  { campo: 'fallosCombustion', etiqueta: 'Y a-t-il des ratés d’allumage ou un voyant moteur ?',
    opciones: [{ valor: 'no', etiqueta: 'Non' }, { valor: 'codigo_guardado', etiqueta: 'Un défaut enregistré sans cause connue' }, { valor: 'activo', etiqueta: 'Défaut actif ou bougie huileuse' }, { valor: 'no_lo_se', etiqueta: 'Je ne sais pas' }] },
];

export const PRUEBAS: PreguntaSintoma[] = [
  { campo: 'boroscopia', etiqueta: 'Existe-t-il une endoscopie récente ?',
    opciones: [{ valor: 'no', etiqueta: 'Non' }, { valor: 'normal', etiqueta: 'Oui, rapportée normale' }, { valor: 'no_concluyente', etiqueta: 'Oui, limitée ou non concluante' }, { valor: 'dudosa', etiqueta: 'Oui, avec des marques douteuses' }, { valor: 'positiva', etiqueta: 'Oui, avec bore scoring diagnostiqué' }] },
  { campo: 'analisisAceite', etiqueta: 'Y a-t-il une analyse d’huile ?', ayuda: 'Un seul échantillon ne confirme ni n’exclut rien ; la tendance, elle, dit quelque chose.',
    opciones: [{ valor: 'no', etiqueta: 'Non' }, { valor: 'una_normal', etiqueta: 'Un échantillon normal' }, { valor: 'serie_estable', etiqueta: 'Une série stable' }, { valor: 'una_anomala', etiqueta: 'Un échantillon aux métaux élevés' }, { valor: 'tendencia_creciente', etiqueta: 'Tendance croissante d’aluminium, fer ou silicium' }, { valor: 'no_lo_se', etiqueta: 'Je ne sais pas' }] },
  { campo: 'compresionLeakdown', etiqueta: 'A-t-on mesuré compression ou leak-down ?',
    opciones: [{ valor: 'no', etiqueta: 'Non' }, { valor: 'normal', etiqueta: 'Oui, lecture normale' }, { valor: 'anomala', etiqueta: 'Oui, lecture anormale' }, { valor: 'no_lo_se', etiqueta: 'Je ne sais pas' }] },
];

export const BOROSCOPIA_DETALLE: PreguntaSintoma[] = [
  { campo: 'viaBoroscopia', etiqueta: 'Voie d’accès', ayuda: 'Sur M96/M97, par les seuls puits de bougie on n’atteint pas la zone critique.',
    opciones: [{ valor: 'bujias', etiqueta: 'Par les bougies' }, { valor: 'carter', etiqueta: 'Par le carter' }, { valor: 'ambas', etiqueta: 'Par les deux' }, { valor: 'no_lo_se', etiqueta: 'Je ne sais pas' }] },
  { campo: 'calidadBoroscopia', etiqueta: 'Ampleur',
    opciones: [{ valor: 'completa', etiqueta: 'Tous les cylindres' }, { valor: 'parcial', etiqueta: 'Seulement certains' }, { valor: 'desconocida', etiqueta: 'Je ne sais pas' }] },
  { campo: 'sintomasNuevosDesdeBoroscopia', etiqueta: 'De nouveaux symptômes sont-ils apparus depuis ?',
    opciones: [{ valor: '', etiqueta: 'Non' }, { valor: 'si', etiqueta: 'Oui' }] },
];

export const HISTORIAL: PreguntaSintoma = {
  campo: 'originalidadMotor', etiqueta: 'A-t-elle conservé son moteur d’origine ?', opciones: OPCIONES.originalidad,
};

export const PAGINA = {
  titulo: 'Calculateur de bore scoring Porsche par modèle et année · Valentin Motors',
  descripcion: 'Sélectionnez modèle, année et moteur pour connaître sa susceptibilité au rayage des cylindres et savoir quand une endoscopie a du sens.',
  eyebrow: 'Outil',
  h1: 'Votre Porsche peut-elle souffrir de bore scoring ?',
  intro: 'Sélectionnez modèle et année pour connaître la susceptibilité de son moteur. Vous pourrez ensuite ajouter symptômes ou essais pour savoir quel contrôle a du sens.',
  explicacionTitulo: 'Ce qu’une endoscopie confirme, et ce qu’elle ne confirme pas',
  explicacion: [
    'Le bore scoring (rayage des cylindres) est un dommage physique de la paroi du cylindre et de la jupe du piston. Ce n’est pas une pièce d’usine que l’on déduit du modèle et de l’année : il s’acquiert à l’usage, peut commencer vite et s’aggraver ensuite. C’est pourquoi cet outil sépare ce que l’on sait d’une famille de moteurs de ce que l’on sait de votre voiture.',
    'La confirmation est visuelle. Une endoscopie bien faite entre par où il faut, parcourt tous les cylindres nécessaires et est interprétée par quelqu’un qui distingue une rayure d’un reflet ou d’un dépôt de calamine. Sur les M96 et M97, l’accès par les seuls puits de bougie laisse de côté précisément la zone où le rayage commence d’habitude : un tel essai, rapporté normal, ne permet pas de déclarer le moteur bon.',
    'Les symptômes orientent et les essais complémentaires appuient, mais aucun ne confirme. La consommation d’huile, le cognement rythmique, la suie asymétrique ou un raté d’allumage ont d’autres causes possibles : poussoirs, injecteurs, fuite d’échappement, segments usés sans rayage. Le diagnostic différentiel fait partie du travail, ce n’est pas une formalité.',
    'Il n’existe pas non plus de remède par additif ni par une huile plus épaisse. Quand le rayage est confirmé, la conversation porte sur l’ampleur : quels cylindres, avec quelle technologie on les refait et quelle garantie. Cela se décide avec le moteur devant soi.',
  ],
  faqTitulo: 'Foire aux questions',
  faq: [
    ['Cet outil peut-il me dire si ma voiture a du bore scoring ?', 'Non, et aucun outil qui n’utilise que le modèle et l’année ne le peut. Il vous dit si sa configuration appartient à un groupe aux cas publiés plus nombreux, ce que disent les indices que vous fournissez et quel contrôle a du sens maintenant.'],
    ['Toutes les 997.1 et les Cayman S 3.4 sont-elles touchées ?', 'Non. Ce sont les groupes qui reviennent le plus dans l’expérience des spécialistes, ce qui est autre chose. Il y a beaucoup de voitures saines avec beaucoup de kilomètres.'],
    ['Les Porsche à partir de 2009 sont-elles épargnées ?', 'Non. La 997.2 et la 987.2 ont abandonné l’IMS classique, mais leurs moteurs 9A1/MA1 en Alusil ont aussi des cas documentés de rayage.'],
    ['Un 2.5, 2.7 ou 3.2 ne casse-t-il jamais ?', 'Ils apparaissent nettement moins dans ce qui est publié. Moins n’est pas jamais : s’il y a des symptômes, on contrôle comme n’importe quel autre.'],
    ['Mon endoscopie était normale, puis-je oublier ?', 'Elle décrit ce qui a été vu ce jour-là et sur les surfaces qui ont pu être vues. Si l’essai était partiel, ou si de nouveaux symptômes sont apparus depuis, il convient de le refaire avec le bon protocole.'],
    ['L’analyse d’huile est-elle utile ?', 'En appui, et surtout en série. Un seul échantillon normal n’exclut rien, et un seul échantillon élevé ne confirme rien. Ce qui dit quelque chose, c’est la tendance de l’aluminium, du fer et du silicium dans le temps.'],
  ],
  revisadas: 'révisées le',
};
