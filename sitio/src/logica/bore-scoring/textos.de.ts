import type { Evidencia, Susceptibilidad, Tecnologia, Urgencia, Variante } from './tipos.ts';
import type { TextoEje, PreguntaSintoma } from './textos.es.ts';

/** Texte des Bore-scoring-Checks, Deutsch. Gleiche Form wie textos.es.ts. */

export const SUSCEPTIBILIDAD: Record<Susceptibilidad, TextoEje> = {
  ELEVATED_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Erhöht in dieser Familie',
    resumen: 'Eine der Gruppen, die Spezialisten am häufigsten unter den betroffenen Motoren finden.',
    cuerpo: 'Diese Konfiguration gehört zu den Gruppen, die in der veröffentlichten Erfahrung der Werkstätten, die diese Motoren überholen, am häufigsten auftauchen. Das beschreibt eine Familie, nicht dieses Fahrzeug: Es bedeutet nicht, dass ein Schaden vorliegt, und erlaubt keine individuelle Wahrscheinlichkeit.',
  },
  DOCUMENTED_SUSCEPTIBILITY: {
    etiqueta: 'Dokumentierte Fälle',
    resumen: 'Es gibt beschriebene Fälle und eine kompatible Architektur, ohne die am stärksten betroffene M96/M97-Gruppe zu erreichen.',
    cuerpo: 'Es gibt veröffentlichte Fälle, und die Zylinderarchitektur ist mit dem Schaden kompatibel, aber diese Konfiguration darf nicht automatisch mit den M96/M97 gleichgesetzt werden, auf die sich die größte Sorge konzentriert.',
  },
  LOWER_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Vergleichsweise gering',
    resumen: 'Diese Version taucht in der veröffentlichten technischen Erfahrung seltener auf.',
    cuerpo: 'Sie erscheint seltener als ihre hubraumstärkeren Schwestern in dem, was Spezialisten veröffentlichen. Seltener heißt nicht unmöglich: Bei Symptomen wird trotzdem geprüft.',
  },
  LOWER_BY_BORE_TECHNOLOGY: {
    etiqueta: 'Weniger betroffene Technologie',
    resumen: 'Der Zylinder folgt nicht dem klassischen Lokasil- und Alusil-Muster, das hier bewertet wird.',
    cuerpo: 'Laut der angegebenen Identifikation nutzt der Motor Nikasil, eine gespritzte Eisenbeschichtung oder Laufbuchsen und Block aus Guss. Er teilt nicht das Hauptmuster, das dieses Werkzeug bewertet, was den Zustand keines Zylinders garantiert und anderen Verschleiß nicht ausschließt.',
  },
  ENGINE_SPECIFIC_CLASSIFICATION: {
    etiqueta: 'Der Motor muss identifiziert werden',
    resumen: 'Bei diesem Modell und Jahr existierten verschiedene Architekturen nebeneinander.',
    cuerpo: 'Mit den bisherigen Angaben existieren unter demselben Handelsnamen verschiedene Architekturen. Version, Hubraum oder Motorcode werden benötigt: Ohne sie zu klassifizieren wäre eine irreführende Antwort.',
  },
  OUTSIDE_VALIDATED_SCOPE: {
    etiqueta: 'Außerhalb der validierten Matrix',
    resumen: 'Für diese Konfiguration haben wir keine ausreichend verlässliche Regel.',
    cuerpo: 'Dieses Werkzeug deckt den 911 ab dem 996, Boxster und Cayman sowie Cayenne, Panamera und Macan mit identifizierbarem Motor ab. Für den Rest gibt es keine Regel, hinter der wir stehen könnten, und eine pauschale grüne Zone wäre schlimmer als nichts zu sagen. Symptome müssen trotzdem bewertet werden.',
  },
  NOT_APPLICABLE_ELECTRIC: {
    etiqueta: 'Nicht zutreffend',
    resumen: 'Ein Elektrofahrzeug hat keine Verbrennungszylinder.',
    cuerpo: 'Ohne Verbrennungszylinder kann dieser Schaden nicht auftreten.',
  },
};

export const EVIDENCIA: Record<Evidencia, TextoEje> = {
  NO_EVIDENCE_REPORTED: {
    etiqueta: 'Keine Anzeichen angegeben',
    resumen: 'Keine Symptome und keine Prüfungen angegeben. Das ist nicht dasselbe wie ein gesunder Motor.',
    cuerpo: 'Es wurden keine Symptome oder verdächtigen Prüfungen mitgeteilt. Mehr lässt sich nicht sagen: Ein beginnender Schaden kann bestehen, ohne vom Sitz aus spürbare Zeichen zu geben.',
  },
  ONE_NON_SPECIFIC_SIGNAL: {
    etiqueta: 'Ein einzelnes Anzeichen',
    resumen: 'Es gibt ein Symptom, das andere Ursachen haben kann.',
    cuerpo: 'Ein einzelnes Symptom ohne Begleiterscheinungen lässt viele Erklärungen zu: Hydrostößel, Einspritzdüsen, ein Auspuffleck oder der Kaltstart selbst. Es lohnt sich zu beobachten, ob es bleibt oder ein weiteres hinzukommt.',
  },
  MULTIPLE_COMPATIBLE_SIGNALS: {
    etiqueta: 'Mehrere passende Anzeichen',
    resumen: 'Zeichen aus zwei unabhängigen Familien fallen zusammen.',
    cuerpo: 'Zeichen aus verschiedenen Familien treffen zusammen, etwa steigender Verbrauch und rhythmisches Klopfen oder asymmetrischer Ruß mit verölter Zündkerze. Das Zusammentreffen rechtfertigt eine Endoskopie und eine Diagnose, nicht eine Diagnose für sich.',
  },
  SUPPORTING_TEST_SUSPICIOUS: {
    etiqueta: 'Eine verdächtige Prüfung',
    resumen: 'Eine ergänzende Prüfung deutet auf Verschleiß hin, ohne ihn visuell zu bestätigen.',
    cuerpo: 'Ölanalyse, Kompression, Druckverlust oder der Filterbefund stützen den Verdacht. Stützen: Die Bestätigung bleibt visuell.',
  },
  NEGATIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Endoskopie als unauffällig gemeldet',
    resumen: 'Sie beschreibt, was an dem Tag auf diesen Flächen zu sehen war.',
    cuerpo: 'Eine vollständige, aktuelle und als unauffällig gemeldete Endoskopie ist eine begrenzte gute Nachricht: Sie beschreibt den Zustand an diesem Datum in den einsehbaren Bereichen. Die Anfälligkeit der Familie ändert sich dadurch nicht.',
  },
  LIMITED_OR_INCONCLUSIVE_BORESCOPE: {
    etiqueta: 'Begrenzte oder nicht schlüssige Endoskopie',
    resumen: 'Die Inspektion erlaubt nicht, den Motor als gut einzustufen.',
    cuerpo: 'Die Prüfung erfasste die kritischen Bereiche nicht, erreichte nicht alle nötigen Zylinder, oder der Bericht zieht keinen Schluss. Beim M96/M97 lässt der Zugang allein über die Kerzenschächte genau den Bereich aus, in dem die Riefen meist beginnen.',
  },
  POSITIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Positive Endoskopie angegeben',
    resumen: 'Sie geben einen positiven Befund an, den wir nicht geprüft haben.',
    cuerpo: 'Wir nehmen den Befund als das, was er ist: eine Angabe. Bevor über Umfang und Optionen gesprochen wird, sollte ein Spezialist die Bilder oder den Motor prüfen.',
  },
  CONFIRMED_BY_SPECIALIST: {
    etiqueta: 'Von einem Spezialisten bestätigt',
    resumen: 'Ein fachlicher Befund bestätigt es.',
    cuerpo: 'Mit einer professionellen Diagnose geht es nicht mehr um das Ob, sondern um Umfang, Ursache und Überholungsstrategie.',
  },
  CONFLICTING_EVIDENCE: {
    etiqueta: 'Widersprüchliche Angaben',
    resumen: 'Eine unauffällige Prüfung steht neben Symptomen, die ihr widersprechen.',
    cuerpo: 'Eine alte oder begrenzte, als unauffällig gemeldete Endoskopie, gefolgt von neuen Symptomen, schließt nichts ab: Sie verlangt eine Wiederholung der Inspektion mit dem richtigen Protokoll.',
  },
};

export const URGENCIA: Record<Urgencia, TextoEje> = {
  INFORMATION_ONLY: { etiqueta: 'Information und Wartung', resumen: 'Nichts Eiliges. Beobachten Sie die Entwicklung und halten Sie das Öl aktuell.' },
  PPI_SCOPE_RECOMMENDED: { etiqueta: 'Endoskopie in die Ankaufsuntersuchung aufnehmen', resumen: 'Vor dem Kauf sollte die Untersuchung eine vollständige Endoskopie enthalten.' },
  BOOK_SPECIALIST_INSPECTION: { etiqueta: 'Fachprüfung anfragen', resumen: 'Es gibt etwas anzusehen. Es kann andere Ursachen haben, und genau deshalb sieht man nach.' },
  PROMPT_INSPECTION: { etiqueta: 'So bald wie möglich prüfen lassen', resumen: 'Die Anzeichen rechtfertigen Endoskopie und Diagnose ohne Aufschub.' },
  MINIMIZE_USE_AND_CONTACT: { etiqueta: 'Nutzung reduzieren und vor dem Weiterfahren Rücksprache halten', resumen: 'Besser keinen weiteren Schaden anhäufen, bis der Motor bewertet ist.' },
  REPAIR_PLANNING: { etiqueta: 'Reparatur oder Überholung erwägen', resumen: 'Mit der Diagnose geht es um Umfang und Strategie.' },
  INSUFFICIENT_DATA: { etiqueta: 'Eine wesentliche Angabe fehlt', resumen: 'Ohne Identifizierung des Motors können wir nicht sagen, welche Prüfung sinnvoll ist.' },
};

export const TECNOLOGIA: Record<Tecnologia, string> = {
  lokasil: 'Lokasil, integrierter Aluminium-Silizium-Zylinder',
  alusil: 'Alusil, übereutektischer Block',
  nikasil: 'Nikasil oder gleichwertige Beschichtung',
  recubrimiento_proyectado: 'Gespritzte Eisenbeschichtung, APS oder PTWA',
  hierro: 'Laufbuchse oder Block aus Guss',
  no_aplica_electrico: 'Ohne Verbrennungszylinder',
  desconocida: 'Nicht identifiziert',
};

export const CONFIANZA: Record<'alta' | 'media' | 'baja', string> = {
  alta: 'Hoch: Generation, Version und Motor stimmig',
  media: 'Mittel: Die Einordnung ist solide, eine Motorangabe fehlt',
  baja: 'Niedrig: Etwas ist nicht identifiziert oder die Angaben widersprechen sich',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'Das Jahr ist ungültig.',
  ano_solapado: 'In diesem Jahr existierten zwei Generationen mit verschiedenen Motoren nebeneinander.',
  ano_de_matriculacion_en_frontera: 'Es ist ein Zulassungsjahr an einem Generationswechsel, und daraus lässt sich nichts entscheiden.',
  modelo_y_ano_incompatibles: 'Dieses Modell wurde in dem Jahr nicht gebaut. Wir korrigieren das nicht eigenmächtig.',
  falta_combustible: 'Bei Cayenne, Panamera oder Macan bestimmt der Kraftstoff alles Weitere.',
  falta_version: 'Die Version trennt verschiedene Architekturen unter demselben Namen.',
  falta_cilindrada: 'Der Hubraum trennt zwei Gruppen mit sehr unterschiedlicher Geschichte.',
  sin_regla_para_esa_combinacion: 'Für diese Kombination haben wir keine validierte Regel.',
  reglas_en_conflicto: 'Zwei Regeln der Matrix passen gleichzeitig, deshalb wählen wir lieber nicht für Sie.',
  electrico_sin_cilindros: 'Ein Elektroauto hat keine Verbrennungszylinder.',
  originalidad_desconocida: 'Es ist nicht bekannt, ob der Motor der werkseitige ist.',
  motor_sustituido_sin_identificar: 'Der Motor wurde ersetzt und ist nicht identifiziert: Er trägt die Spezifikation seiner Fertigung, nicht die des Fahrgestelljahres.',
  reconstruccion_sin_detalle: 'Eine Überholung ist belegt, aber weder ihr Umfang noch die eingebaute Technologie.',
  reconstruccion_cambia_tecnologia: 'Die angegebene Überholung ändert die Zylindertechnologie.',
  reconstruccion_misma_tecnologia: 'Die angegebene Überholung behält die ursprüngliche Technologie bei.',
  boroscopia_confirmada: 'Ein Spezialist hat den Befund geprüft oder erstellt.',
  boroscopia_positiva_declarada: 'Sie geben einen positiven Befund an, den wir nicht geprüft haben.',
  boroscopia_no_concluyente: 'Die Endoskopie zieht keinen Schluss oder zeigt zweifelhafte Spuren.',
  boroscopia_solo_por_bujias: 'Der Zugang erfolgte nur über die Kerzenschächte, die bei diesen Motoren den kritischen Bereich nicht erreichen.',
  boroscopia_parcial: 'Die Inspektion erfasste nicht alle nötigen Zylinder.',
  boroscopia_alcance_desconocido: 'Der Umfang der Inspektion ist nicht bekannt.',
  boroscopia_negativa_contra_sintomas: 'Eine als unauffällig gemeldete Prüfung steht neben späteren Symptomen.',
  dos_familias_de_senal: 'Zeichen aus zwei unabhängigen Familien fallen zusammen.',
  prueba_complementaria_sospechosa: 'Eine ergänzende Prüfung deutet auf Verschleiß hin.',
  una_senal_inespecifica: 'Es gibt ein einzelnes Zeichen, das mit mehreren Ursachen vereinbar ist.',
  'regla_911-mezger': 'Turbo, GT2 und GT3 dieser Generation nutzen den Mezger-Motor mit Nikasil.',
  'regla_911-991-1-especificos': 'Turbo und GT erben die Carrera-Regel nicht.',
  'regla_911-pre-996': '911 vor dem 996 liegen außerhalb dieser Matrix.',
  'regla_911-996-1-carrera': '996.1 Carrera 3.4 mit Lokasil-Zylindern.',
  'regla_911-996-2-carrera': '996.2 Carrera 3.6, eine der meistgenannten Gruppen.',
  'regla_911-997-1-carrera': '997.1 Carrera 3.6 und S 3.8, die Gruppe mit den meisten veröffentlichten Fällen.',
  'regla_911-997-2-carrera': '997.2 Carrera mit 9A1/MA1 und Alusil.',
  'regla_911-991-1-carrera': '991.1 Carrera mit 9A1/MA1 und Alusil.',
  'regla_911-991-2-carrera': '991.2 Carrera mit gespritzter Eisenbeschichtung.',
  'regla_911-992': 'Ab dem 992 muss die Motorarchitektur bestätigt werden.',
  'regla_bc-986': 'Boxster 986, vergleichsweise seltener genannt.',
  'regla_bc-987-1-base': '987.1 Basis, 2.7, vergleichsweise seltener genannt.',
  'regla_bc-987-1-s-3-2': '987.1 S mit 3.2, vor dem 3.4.',
  'regla_bc-987-1-s-3-4': '987.1 S mit 3.4, die meistgenannte Boxster- und Cayman-Gruppe.',
  'regla_bc-987-1-s-hasta-2006': 'Der Boxster S 987.1 trug den 3.2 bis Modelljahr 2006.',
  'regla_bc-987-1-s-desde-2007': 'Der Boxster S 987.1 trägt den 3.4 ab Modelljahr 2007.',
  'regla_bc-987-1-cayman-s': 'Der Cayman S 987.1 trägt den 3.4 vom ersten Jahr an.',
  'regla_bc-987-2': '987.2 mit 9A1/MA1 und Alusil.',
  'regla_bc-981': '981 mit 9A1/MA1 und Alusil.',
  'regla_bc-981-especificos': 'Spyder und GT4 haben einen anderen Motor als der übrige 981.',
  'regla_bc-718': '718 Vierzylinder mit gespritzter Eisenbeschichtung.',
  'regla_taycan': 'Ein Taycan ist elektrisch.',
  'regla_electrico': 'Mit Elektromotor gibt es keine Verbrennungszylinder.',
  'regla_suv-diesel-hibrido': 'Ein nicht identifizierter Diesel oder Hybrid wird nicht nach dem Namen eingeordnet.',
  'regla_cayenne-vr6': 'Cayenne mit VR6, Gussblock.',
  'regla_cayenne-v8-955-958-1': 'Cayenne V8 M48 mit dokumentierten Fällen.',
  'regla_cayenne-mct-958-2': 'Cayenne 3.6 MCT, Alusil mit dokumentierten Fällen.',
  'regla_cayenne-e3': 'Cayenne der dritten Generation mit Gussbuchsen oder APS.',
  'regla_panamera-970': 'Panamera 970, Alusil mit dokumentierten Fällen.',
  'regla_panamera-970-base': 'Beim 970 Basis muss der Motor identifiziert werden.',
  'regla_panamera-971': 'Panamera 971 mit Gussbuchsen oder APS.',
  'regla_macan-2-0': 'Macan 2.0 EA888, außerhalb des klassischen Alusil-Musters.',
  'regla_macan-v6-mct': 'Macan V6 MCT, Alusil mit dokumentierten Fällen.',
  'regla_macan-v6-ea839': 'Macan V6 EA839 mit Gussbuchsen.',
  'regla_otro-porsche': 'Dieser Porsche ist nicht in der validierten Matrix.',
};

export const AVISOS: Record<string, string> = {
  menor_no_es_inmune: 'Geringere Anfälligkeit ist keine Immunität: Treten Symptome auf, wird geprüft wie bei jedem anderen.',
  sin_indicios_no_es_sano: 'Keine angegebenen Anzeichen bedeuten keinen gesunden Motor: Ein beginnender Schaden kann ohne Zeichen bleiben.',
  negativa_es_de_esa_fecha: 'Eine unauffällige Endoskopie beschreibt dieses Datum und diese Flächen, nicht die Zukunft des Motors.',
  no_declarar_solucionado: 'Eine Überholungsrechnung ohne bekannten Umfang erlaubt nicht, das Problem als gelöst zu betrachten.',
  motor_sustituido: 'Da es nicht der werkseitige Motor ist, hängt die Anfälligkeit des Fahrzeugs vom jetzt verbauten Motor ab.',
  motor_sin_verificar: 'Es ist nicht bekannt, ob der Motor der werkseitige ist; die Einordnung passt daher möglicherweise nicht zu diesem Fahrzeug.',
  ano_no_es_modelo: 'Das verwendete Jahr ist nicht das Modelljahr, daher verliert das Ergebnis an Genauigkeit.',
  consumo_para_el_taller: 'Der notierte Verbrauch wird für die Werkstatt aufbewahrt: Wir nutzen ihn nicht zur Risikobewertung.',
};

export const ACCIONES: Record<string, string> = {
  vigilar_evolucion: 'Notieren Sie Verbrauch, Geräusche und Rauch mit Datum: Der Trend zählt mehr als eine einzelne Messung.',
  mantenimiento_preventivo: 'Halten Sie Öl und Filter aktuell und vermeiden Sie verlängerte Kaltphasen.',
  boroscopia_en_precompra: 'Verlangen Sie, dass die Ankaufsuntersuchung eine vollständige Endoskopie enthält, nicht nur über die Kerzenschächte.',
  pedir_historial: 'Sammeln Sie Rechnungen, frühere Ölanalysen und jeden früheren Motorbefund.',
  revision_especializada: 'Fordern Sie eine Fachprüfung mit Differenzialdiagnose an: Hydrostößel, Einspritzdüsen und Auspuff geben ähnliche Symptome.',
  preparar_datos: 'Bringen Sie die Daten geordnet mit: Beginn, kalt oder warm, nachgefüllte Liter und Kilometer zwischen den Nachfüllungen.',
  boroscopia_y_diagnostico: 'Buchen Sie Endoskopie und Diagnose: So sieht man den Zylinder und schließt andere Ursachen aus.',
  reducir_uso: 'Reduzieren Sie die Nutzung bis zur Bewertung des Motors und vermeiden Sie harte Beschleunigungsserien.',
  valorar_reparacion: 'Wir bewerten Ursache, Umfang und Überholungsstrategie, bevor wir etwas anfassen.',
  enviar_informe: 'Teilen Sie Befund und Bilder mit der Werkstatt, um den tatsächlichen Umfang zu bewerten.',
  identificar_motor: 'Identifizieren Sie den Motor: das Blockschild, die Unterlagen oder ein Foto des Codes genügen.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generation', porque: 'In diesem Jahr existierten zwei Generationen mit verschiedenen Zylindern nebeneinander.' },
  variante: { etiqueta: 'Version', porque: 'Unter demselben Namen existieren verschiedene Motorarchitekturen.' },
  combustible: { etiqueta: 'Motor', porque: 'Bei Cayenne, Panamera oder Macan sagen Name und Jahr nicht, welcher Motor verbaut ist.' },
  cilindrada: { etiqueta: 'Hubraum', porque: 'Er trennt zwei Gruppen mit sehr unterschiedlicher Geschichte.' },
  ano_imposible: { etiqueta: 'Jahr oder Modell prüfen', porque: 'Dieses Modell wurde in dem Jahr nicht gebaut, und wir korrigieren das lieber nicht eigenmächtig.' },
};

export const AVISO = 'Orientierendes Ergebnis auf Basis der Werkskonfiguration und Ihrer Angaben. Das Fehlen von Symptomen schließt einen beginnenden Schaden nicht aus, und die beschriebenen Symptome können andere Ursachen haben. Nur eine korrekt durchgeführte und ausgewertete Endoskopie kann bore scoring visuell bestätigen. Dieses Werkzeug ersetzt keine mechanische Inspektion.';

export const CONFIRMACION = 'Symptome können Hinweise geben, aber nur eine geeignete Endoskopie erlaubt die visuelle Bestätigung von bore scoring.';

export const AFINAR = {
  titulo: 'Ergebnis mit Symptomen und Prüfungen verfeinern',
  ayuda: 'Kurze Fragen zu Symptomen, Prüfungen und Motorhistorie. Was Sie wissen, genügt: „Weiß ich nicht“ ist eine gültige Antwort und verschlechtert das Ergebnis nicht.',
};

export const UI = {
  modelo: 'Modell',
  ano: 'Jahr',
  anoAyuda: 'Verwenden Sie nach Möglichkeit das Modelljahr. Es kann von der Zulassung abweichen.',
  baseAno: 'Dieses Jahr ist',
  calcular: 'Meinen Porsche prüfen',
  situacion: 'In welcher Situation sind Sie?',
  ejeConfiguracion: 'Motorkonfiguration',
  ejeSusceptibilidad: 'Anfälligkeit des Motors',
  ejeEvidencia: 'Angaben zu diesem Fahrzeug',
  ejeConfianza: 'Qualität der Identifikation',
  siguientePaso: 'Was wir jetzt tun würden',
  porqueEsto: 'Warum dieses Ergebnis',
  aTenerEnCuenta: 'Zu beachten',
  deFabrica: 'Ab Werk',
  motorActual: 'Jetzt verbauter Motor',
  consumoDeclarado: 'Angegebener Verbrauch',
  consumoUnidad: 'l/1.000 km',
  fuentes: 'Quellen',
  reglas: 'Regeln',
  ctaArticulo: 'Bore scoring verstehen',
  ctaIms: 'Auch das IMS prüfen',
  imsPuente: 'Dieser Motor gehört außerdem zu einer Generation, die der IMS-Rechner bewertet. Es sind zwei getrennte Prüfungen, die nicht zu einer Note zusammengefasst werden.',
  errorAno: 'Geben Sie ein Jahr zwischen 1948 und ' + (new Date().getFullYear() + 1) + ' ein.',
  noLoSe: 'Weiß ich nicht',
  detallesConsumo: 'Falls Sie es notiert haben',
};

export const CTA: Record<Urgencia, string> = {
  INFORMATION_ONLY: 'Vorbeugende Wartung ansehen',
  PPI_SCOPE_RECOMMENDED: 'Ankaufsuntersuchung mit Endoskopie anfragen',
  BOOK_SPECIALIST_INSPECTION: 'Fachprüfung anfragen',
  PROMPT_INSPECTION: 'Diagnose und Endoskopie buchen',
  MINIMIZE_USE_AND_CONTACT: 'Diagnose und Endoskopie buchen',
  REPAIR_PLANNING: 'Reparaturoptionen bewerten',
  INSUFFICIENT_DATA: 'Helfen Sie uns, den Motor zu identifizieren',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 oder früher', '996_1': '996.1', '996_2': '996.2', '997_1': '997.1', '997_2': '997.2',
  '991_1': '991.1', '991_2': '991.2', post_991: '992 oder später', '986': '986', '987_1': '987.1', '987_2': '987.2',
  '981': '981', '718': '718',
  cayenne_955: '955 · 2003-2006', cayenne_957: '957 · 2008-2010', cayenne_958_1: '958.1 · 2011-2014',
  cayenne_958_2: '958.2 · 2015-2018', cayenne_e3: 'E3 · ab 2019',
  panamera_970: '970 · 2009-2016', panamera_971: '971 · ab 2017',
  macan_95b: '95B · 2014-2018', macan_95b_2: '95B · ab 2019',
  desconocida: 'Weiß ich nicht',
};

export const VARIANTE: Record<Variante, string> = {
  carrera: 'Carrera / Carrera 4', carrera_s: 'Carrera S / 4S / Targa', turbo: 'Turbo / Turbo S', gt2: 'GT2',
  gt3: 'GT3 / GT3 RS', base: 'Basisversion', s: 'S', gts: 'GTS', spyder_gt4: 'Spyder / GT4',
  otra: 'Andere', desconocida: 'Weiß ich nicht',
};

export const OPCIONES = {
  familia: [
    { valor: '911', etiqueta: '911' }, { valor: 'boxster', etiqueta: 'Boxster' }, { valor: 'cayman', etiqueta: 'Cayman' },
    { valor: 'cayenne', etiqueta: 'Cayenne' }, { valor: 'panamera', etiqueta: 'Panamera' }, { valor: 'macan', etiqueta: 'Macan' },
    { valor: 'taycan', etiqueta: 'Taycan' }, { valor: 'otro', etiqueta: 'Anderer Porsche' },
  ],
  baseAno: [
    { valor: 'modelo', etiqueta: 'Modelljahr' }, { valor: 'matriculacion', etiqueta: 'Zulassungsjahr' }, { valor: 'desconocido', etiqueta: 'Weiß ich nicht' },
  ],
  combustible: [
    { valor: 'gasolina', etiqueta: 'Benzin' }, { valor: 'diesel', etiqueta: 'Diesel' }, { valor: 'hibrido', etiqueta: 'Hybrid' },
    { valor: 'electrico', etiqueta: 'Elektrisch' }, { valor: 'desconocido', etiqueta: 'Weiß ich nicht' },
  ],
  situacion: [
    { valor: 'compra', etiqueta: 'Ich überlege, ihn zu kaufen' }, { valor: 'propietario', etiqueta: 'Er gehört mir schon' },
    { valor: 'sintoma', etiqueta: 'Ich habe ein Symptom bemerkt' }, { valor: 'prueba', etiqueta: 'Ich habe bereits eine Prüfung oder Diagnose' },
  ],
  originalidad: [
    { valor: 'original', etiqueta: 'Ja, der werkseitige' }, { valor: 'sustituido', etiqueta: 'Nein, er wurde ersetzt' },
    { valor: 'reconstruido', etiqueta: 'Er wurde überholt' }, { valor: 'desconocida', etiqueta: 'Weiß ich nicht' },
  ],
  tecnologiaReconstruida: [
    { valor: '', etiqueta: 'Weiß ich nicht' }, { valor: 'lokasil', etiqueta: 'Die ursprüngliche' }, { valor: 'alusil', etiqueta: 'Aufbereitetes Alusil' },
    { valor: 'hierro', etiqueta: 'Gussbuchse' }, { valor: 'nikasil', etiqueta: 'Nikasil oder NSC' }, { valor: 'recubrimiento_proyectado', etiqueta: 'Gespritzte Beschichtung' },
  ],
};

export const SINTOMAS: PreguntaSintoma[] = [
  { campo: 'consumoAceite', etiqueta: 'Ist der Ölverbrauch gestiegen?', ayuda: 'Im Vergleich zum Üblichen bei diesem Auto, nicht zu einem Katalogwert.',
    opciones: [{ valor: 'estable', etiqueta: 'Nein, er ist stabil' }, { valor: 'aumenta', etiqueta: 'Ja, er ist gestiegen' }, { valor: 'no_lo_se', etiqueta: 'Kann ich nicht wissen' }] },
  { campo: 'golpeteo', etiqueta: 'Ist ein rhythmisches Klopfen im Motor zu hören?', ayuda: 'Ein „Tick-Tick“ nur im kalten Zustand machen auch Hydrostößel und Einspritzdüsen.',
    opciones: [{ valor: 'no', etiqueta: 'Nein' }, { valor: 'solo_frio', etiqueta: 'Nur kalt' }, { valor: 'frio_y_caliente', etiqueta: 'Auch warm' }, { valor: 'no_lo_se', etiqueta: 'Weiß ich nicht' }] },
  { campo: 'humo', etiqueta: 'Gibt es sichtbaren Rauch?',
    opciones: [{ valor: 'no', etiqueta: 'Nein' }, { valor: 'bocanada_arranque', etiqueta: 'Gelegentlich eine Wolke beim Start' }, { valor: 'arranque_repetido', etiqueta: 'Wiederholt beim Start' }, { valor: 'en_marcha', etiqueta: 'Im Leerlauf oder beim Fahren' }, { valor: 'no_lo_se', etiqueta: 'Weiß ich nicht' }] },
  { campo: 'hollin', etiqueta: 'Sammelt ein Endrohr mehr öligen Ruß als das andere?', ayuda: 'Nur aussagekräftig, wenn jedes Endrohr einer Zylinderbank entspricht.',
    opciones: [{ valor: 'no', etiqueta: 'Nein' }, { valor: 'asimetrico', etiqueta: 'Ja, eines deutlich mehr' }, { valor: 'ambas', etiqueta: 'Beide gleich' }, { valor: 'no_comparable', etiqueta: 'Der Auspuff erlaubt keinen Vergleich' }, { valor: 'no_lo_se', etiqueta: 'Weiß ich nicht' }] },
  { campo: 'fallosCombustion', etiqueta: 'Gibt es Zündaussetzer oder eine Motorkontrollleuchte?',
    opciones: [{ valor: 'no', etiqueta: 'Nein' }, { valor: 'codigo_guardado', etiqueta: 'Ein gespeicherter Fehler ohne bekannte Ursache' }, { valor: 'activo', etiqueta: 'Aktiver Fehler oder verölte Zündkerze' }, { valor: 'no_lo_se', etiqueta: 'Weiß ich nicht' }] },
];

export const PRUEBAS: PreguntaSintoma[] = [
  { campo: 'boroscopia', etiqueta: 'Gibt es eine aktuelle Endoskopie?',
    opciones: [{ valor: 'no', etiqueta: 'Nein' }, { valor: 'normal', etiqueta: 'Ja, als unauffällig gemeldet' }, { valor: 'no_concluyente', etiqueta: 'Ja, begrenzt oder nicht schlüssig' }, { valor: 'dudosa', etiqueta: 'Ja, mit zweifelhaften Spuren' }, { valor: 'positiva', etiqueta: 'Ja, mit diagnostiziertem bore scoring' }] },
  { campo: 'analisisAceite', etiqueta: 'Gibt es eine Ölanalyse?', ayuda: 'Eine einzelne Probe bestätigt oder widerlegt nichts; der Trend sagt etwas aus.',
    opciones: [{ valor: 'no', etiqueta: 'Nein' }, { valor: 'una_normal', etiqueta: 'Eine unauffällige Probe' }, { valor: 'serie_estable', etiqueta: 'Eine stabile Reihe' }, { valor: 'una_anomala', etiqueta: 'Eine Probe mit hohen Metallwerten' }, { valor: 'tendencia_creciente', etiqueta: 'Steigender Trend bei Aluminium, Eisen oder Silizium' }, { valor: 'no_lo_se', etiqueta: 'Weiß ich nicht' }] },
  { campo: 'compresionLeakdown', etiqueta: 'Wurden Kompression oder Druckverlust gemessen?',
    opciones: [{ valor: 'no', etiqueta: 'Nein' }, { valor: 'normal', etiqueta: 'Ja, mit normalem Wert' }, { valor: 'anomala', etiqueta: 'Ja, mit auffälligem Wert' }, { valor: 'no_lo_se', etiqueta: 'Weiß ich nicht' }] },
];

export const BOROSCOPIA_DETALLE: PreguntaSintoma[] = [
  { campo: 'viaBoroscopia', etiqueta: 'Zugangsweg', ayuda: 'Beim M96/M97 erreicht man allein über die Kerzenschächte den kritischen Bereich nicht.',
    opciones: [{ valor: 'bujias', etiqueta: 'Über die Zündkerzen' }, { valor: 'carter', etiqueta: 'Über die Ölwanne' }, { valor: 'ambas', etiqueta: 'Über beide' }, { valor: 'no_lo_se', etiqueta: 'Weiß ich nicht' }] },
  { campo: 'calidadBoroscopia', etiqueta: 'Umfang',
    opciones: [{ valor: 'completa', etiqueta: 'Alle Zylinder' }, { valor: 'parcial', etiqueta: 'Nur einige' }, { valor: 'desconocida', etiqueta: 'Weiß ich nicht' }] },
  { campo: 'sintomasNuevosDesdeBoroscopia', etiqueta: 'Sind seitdem neue Symptome aufgetreten?',
    opciones: [{ valor: '', etiqueta: 'Nein' }, { valor: 'si', etiqueta: 'Ja' }] },
];

export const HISTORIAL: PreguntaSintoma = {
  campo: 'originalidadMotor', etiqueta: 'Hat er noch den Originalmotor?', opciones: OPCIONES.originalidad,
};

export const PAGINA = {
  titulo: 'Bore-scoring-Rechner für Porsche nach Modell und Baujahr · Valentin Motors',
  descripcion: 'Wählen Sie Modell, Baujahr und Motor, um die Anfälligkeit für Zylinderriefen zu erfahren und zu wissen, wann eine Endoskopie sinnvoll ist.',
  eyebrow: 'Werkzeug',
  h1: 'Kann Ihr Porsche bore scoring bekommen?',
  intro: 'Wählen Sie Modell und Baujahr, um die Anfälligkeit des Motors zu erfahren. Danach können Sie Symptome oder Prüfungen ergänzen, um zu wissen, welche Kontrolle sinnvoll ist.',
  explicacionTitulo: 'Was eine Endoskopie bestätigt und was nicht',
  explicacion: [
    'Bore scoring (Zylinderriefen) ist ein physischer Schaden an Zylinderwand und Kolbenhemd. Es ist kein Werksteil, das sich aus Modell und Baujahr ableiten lässt: Es entsteht im Gebrauch, kann schnell beginnen und sich danach verschlimmern. Deshalb trennt dieses Werkzeug das Wissen über eine Motorenfamilie vom Wissen über Ihr Fahrzeug.',
    'Die Bestätigung ist visuell. Eine gut gemachte Endoskopie geht dort hinein, wo es nötig ist, erfasst alle erforderlichen Zylinder und wird von jemandem ausgewertet, der eine Riefe von einer Spiegelung oder einer Ölkohleablagerung unterscheiden kann. Beim M96 und M97 lässt der Zugang allein über die Kerzenschächte genau den Bereich aus, in dem die Riefen meist beginnen: Eine solche, als unauffällig gemeldete Prüfung erlaubt nicht, den Motor als gut einzustufen.',
    'Symptome geben Hinweise, ergänzende Prüfungen stützen sie, aber keines bestätigt. Ölverbrauch, rhythmisches Klopfen, asymmetrischer Ruß oder ein Zündaussetzer haben andere mögliche Ursachen: Hydrostößel, Einspritzdüsen, ein Auspuffleck, verschlissene Kolbenringe ohne Riefen. Die Differenzialdiagnose ist Teil der Arbeit, keine Formalität.',
    'Es gibt auch keine Heilung durch Additive oder dickeres Öl. Sind die Riefen bestätigt, geht es um den Umfang: welche Zylinder, mit welcher Technologie sie überholt werden und welche Garantie es gibt. Das wird mit dem Motor vor sich entschieden.',
  ],
  faqTitulo: 'Häufig gestellte Fragen',
  faq: [
    ['Kann mir dieses Werkzeug sagen, ob mein Auto bore scoring hat?', 'Nein, und kein Werkzeug, das nur Modell und Baujahr nutzt, kann das. Es sagt Ihnen, ob die Konfiguration zu einer Gruppe mit mehr veröffentlichten Fällen gehört, was die von Ihnen gelieferten Anzeichen aussagen und welche Prüfung jetzt sinnvoll ist.'],
    ['Sind alle 997.1 und Cayman S 3.4 betroffen?', 'Nein. Es sind die Gruppen, die in der Erfahrung der Spezialisten am häufigsten vorkommen, was etwas anderes ist. Es gibt viele gesunde Fahrzeuge mit hoher Laufleistung.'],
    ['Sind Porsche ab 2009 frei davon?', 'Nein. 997.2 und 987.2 ließen das klassische IMS hinter sich, aber ihre 9A1/MA1-Motoren mit Alusil haben ebenfalls dokumentierte Fälle von Riefen.'],
    ['Fällt ein 2.5, 2.7 oder 3.2 nie aus?', 'Sie kommen in den Veröffentlichungen deutlich seltener vor. Seltener heißt nicht nie: Bei Symptomen werden sie geprüft wie jeder andere.'],
    ['Meine Endoskopie war unauffällig, kann ich das Thema vergessen?', 'Sie beschreibt, was an dem Tag auf den einsehbaren Flächen zu sehen war. War die Prüfung unvollständig oder sind seitdem neue Symptome aufgetreten, sollte sie mit dem richtigen Protokoll wiederholt werden.'],
    ['Hilft eine Ölanalyse?', 'Als Unterstützung, vor allem in Serie. Eine einzelne unauffällige Probe schließt nichts aus, eine einzelne hohe Probe bestätigt nichts. Aussagekräftig ist der Trend von Aluminium, Eisen und Silizium über die Zeit.'],
  ],
  revisadas: 'geprüft am',
};
