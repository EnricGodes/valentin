import type { Estado, Rodamiento } from './tipos.ts';
import type { TextoEstado } from './textos.es.ts';

/** Texte des IMS-Rechners, Deutsch. Gleiche Form wie textos.es.ts. */

export const ESTADOS: Record<Estado, TextoEstado> = {
  AFECTADO_SIMPLE_SUSTITUIBLE: {
    veredicto: 'Ja, dieses Fahrzeug ist betroffen',
    resumen: 'Es trägt das einreihige Lager 6204. Es lässt sich ohne Öffnen des Gehäuses ersetzen.',
    cuerpo: 'Diese Konfiguration trug normalerweise das kleine einreihige IMS-Lager. Es ist die Revision mit der höchsten bekannten Ausfallrate. Es kann vorbeugend ersetzt werden, ohne das Gehäuse zu öffnen, allerdings müssen Getriebe und Schwungrad oder Flexplate ausgebaut werden.',
  },
  AFECTADO_DOBLE_SUSTITUIBLE: {
    veredicto: 'Ja, dieses Fahrzeug ist betroffen',
    resumen: 'Es trägt das zweireihige Lager. Es lässt sich ohne Öffnen des Gehäuses ersetzen.',
    cuerpo: 'Diese Konfiguration trug normalerweise ein zweireihiges IMS-Lager. Es zeigte eine geringere Ausfallrate als das einreihige 6204, doch Alter und Historie bleiben entscheidend.',
    accion: 'Prüfen Sie die Unterlagen und nehmen Sie das IMS in eine Fachinspektion auf; erwägen Sie den Austausch je nach Zustand, Nutzung und Historie.',
  },
  TRANSICION_DOBLE_O_SIMPLE: {
    veredicto: 'Das hängt von der Motornummer ab',
    resumen: '2000 und 2001 wurden beide Lager verbaut. Die Motornummer entscheidet.',
    cuerpo: 'Modell und Baujahr reichen nicht, um das zweireihige vom einreihigen 6204 zu unterscheiden. Beide sind ersetzbar, aber ihre Ausfallrate und das Ersatzteil sind verschieden.',
    accion: 'Geben Sie die Motornummer ein, falls vorhanden, und bestätigen Sie sie physisch, bevor Sie Teile bestellen oder einen Eingriff freigeben.',
  },
  TRANSICION_SIMPLE_O_GRANDE: {
    veredicto: 'Das hängt von der Motornummer ab',
    resumen: '2005 wurden beide Lager verbaut. Die Motornummer entscheidet.',
    cuerpo: 'Manche Fahrzeuge tragen das kleine ersetzbare Lager, andere das große 6305, dessen Austausch normalerweise das Öffnen des Motors erfordert.',
    accion: 'Nutzen Sie die Motornummer, wo eine verlässliche Regel existiert, und bestätigen Sie Historie oder physische Konfiguration vor jedem Eingriff.',
  },
  AFECTADO_GRANDE_NO_SUSTITUIBLE: {
    veredicto: 'Ja, dieses Fahrzeug ist betroffen',
    resumen: 'Es trägt das große Lager 6305. Der Austausch erfordert die Zerlegung des Motors.',
    cuerpo: 'Diese Konfiguration behält ein IMS-Kugellager, verwendet aber die größere Revision 6305. Ihre bekannte Ausfallrate ist geringer als beim kleinen 6204, aber nicht null. Es lässt sich normalerweise nicht durch die Aufnahme ziehen, ohne den Motor zu zerlegen.',
    accion: 'Sammeln Sie die Historie und holen Sie eine Fachbewertung ein; wird der Motor überholt, nehmen Sie das IMS in den Umfang auf.',
  },
  NO_ES_EL_IMS_CLASICO_MEZGER: {
    veredicto: 'Nein, es ist ein Mezger-Motor',
    resumen: 'Er hat ein druckgeschmiertes Gleitlager, nicht das gekapselte Lager, das versagt.',
    cuerpo: 'Diese Version nutzt eine andere Architektur mit druckgeschmierten Gleitlagern auf der Zwischenwelle. Der vorbeugende Austausch des gekapselten Lagers, wie er bei Carrera, Boxster und Cayman M96/M97 erfolgt, gilt hier nicht.',
  },
  SIN_IMS_9A1: {
    veredicto: 'Nein, er hat keine Zwischenwelle',
    resumen: 'Ab Modelljahr 2009 treibt dieser Motor die Steuerung ohne IMS an.',
    cuerpo: 'Ab Modelljahr 2009 erhielten 997.2 und 987.2 eine neue Architektur, die die Steuerung ohne Zwischenwelle antreibt. Der Schaden, den dieser Rechner bewertet, trifft nicht zu.',
  },
  NO_APLICA_OTRO_MODELO: {
    veredicto: 'Nein',
    resumen: 'Dieses Modell gehört nicht zur M96/M97-Familie mit dem gekapselten Lager.',
    cuerpo: 'Dieses Modell gehört nicht zu den 911 Carrera, Boxster oder Cayman mit dem hier untersuchten gekapselten Lager. Die Antwort ist keine allgemeine Zuverlässigkeitsbewertung.',
  },
  DATOS_INSUFICIENTES: {
    veredicto: 'Unbekannt',
    resumen: 'Ohne diese Angabe lässt sich nicht sagen, welches verbaut ist. Die Motornummer oder eine Inspektion des Flansches entscheidet.',
    cuerpo: 'In diesem Jahr existierten verschiedene Motoren oder Generationen nebeneinander. Wir sagen das lieber, als eine falsche Gewissheit zu geben.',
  },
};

export const RODAMIENTOS: Record<Rodamiento, string> = {
  doble_hilera_5204: 'Zweireihig, Familie 5204',
  una_hilera_6204: 'Klein einreihig, Familie 6204',
  una_hilera_grande_6305: 'Groß einreihig, 6305',
  mezger_cojinete_liso: 'Mezger, druckgeschmiertes Gleitlager',
  sin_ims: 'Ohne Zwischenwelle',
  no_aplica: 'Nicht zutreffend',
  desconocido: 'Unbestimmt',
};

export const SUSTITUIBILIDAD: Record<string, string> = {
  sin_abrir_el_bloque: 'Ohne Öffnen des Gehäuses',
  desmontando_el_motor: 'Erfordert Zerlegung des Motors',
  no_aplica: 'Nicht zutreffend',
  desconocida: 'Unbestimmt',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'Das Jahr ist ungültig.',
  ano_solapado: 'In diesem Jahr existierten zwei Generationen mit verschiedenen Motoren nebeneinander.',
  ano_de_matriculacion_en_frontera: 'Es ist ein Zulassungsjahr an einem Generationswechsel, und daraus lässt sich nichts entscheiden.',
  falta_version_mezger: 'Turbo, GT2 und GT3 nutzen den Mezger-Motor und sind von diesem Schaden nicht betroffen, daher wird die Version benötigt.',
  combinacion_no_prevista: 'Diese Kombination aus Modell, Generation und Jahr ist in den Regeln nicht vorgesehen.',
  fuera_de_la_familia_m96_m97: 'Das Modell gehört nicht zur untersuchten M96/M97-Familie.',
  ano_no_es_modelo: 'Das verwendete Jahr ist nicht das Modelljahr, daher verliert das Ergebnis an Genauigkeit.',
  motor_sustituido: 'Der Motor ist nicht der werkseitige: Er trägt das Lager, das bei seiner Herstellung verbaut wurde, nicht das des Fahrgestelljahres.',
  corte_por_numero_de_motor: 'Die orientierende Grenze nach Motornummer wurde angewendet.',
  serie_remanufacturado: 'Die Nummer trägt die Kennzeichnung eines Austauschmotors, daher gilt die Grenze nicht.',
  serie_ilegible: 'Die Motornummer hat kein vergleichbares Format.',
  sin_corte_para_ese_motor: 'Für diesen Motortyp gibt es keine veröffentlichte Grenze.',
};

export const ACCIONES: Record<string, string> = {
  evaluacion_previa: 'Lassen Sie den Motor vorab bewerten, bevor Sie über einen Eingriff entscheiden.',
  revisar_documentacion: 'Sammeln Sie Rechnungen, Kit-Referenz, Datum und Kilometerstand: Das ist der erste Schritt und erfordert keine Demontage.',
  numero_motor: 'Ergänzen Sie die Motornummer, falls Sie sie zur Hand haben.',
  identificacion_fisica: 'Wenn die Unterlagen nicht reichen, lassen Sie den Flansch physisch prüfen.',
  valoracion_especifica: 'Diese Konfiguration braucht eine spezifische Bewertung durch die Werkstatt.',
  confirmar_fisicamente: 'Die Grenze ist orientierend: Bestätigen Sie sie, bevor Sie Teile bestellen.',
  identificar_motor_actual: 'Ermitteln Sie den Motor, den das Fahrzeug heute trägt.',
  verificar_factura_y_referencia: 'Prüfen Sie Rechnung, Referenz, Datum und Kilometerstand des Eingriffs.',
  completar_dato: 'Ergänzen Sie die erbetene Angabe, und wir rechnen neu.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generation', porque: 'In diesem Jahr existierten zwei Generationen mit verschiedenen Motoren nebeneinander.' },
  variante: { etiqueta: 'Version', porque: 'Turbo, GT2 und GT3 tragen den Mezger-Motor und sind von diesem Schaden nicht betroffen.' },
  base_ano: { etiqueta: 'Dieses Jahr ist', porque: 'Das Zulassungsjahr reicht hier nicht.' },
  motor: { etiqueta: 'Motor', porque: 'Zur Präzisierung wird der Motor benötigt.' },
};

export const RETROFIT = {
  RETROFIT_DOCUMENTADO: {
    titular: 'Ab Werk betroffen; ein Eingriff ist belegt',
    cuerpo: 'Das Fahrzeug gehört zu einer betroffenen Familie, aber Sie geben an, dass am IMS gearbeitet wurde. Der aktuelle Zustand hängt vom eingebauten System, seiner Montage und seinem Serviceintervall ab. Ohne die konkrete Referenz können wir weder sagen, dass das Problem gelöst ist, noch eine Fälligkeit berechnen.',
  },
  RETROFIT_SIN_DOCUMENTAR: {
    titular: 'Ab Werk betroffen; der Eingriff ist nicht belegt',
    cuerpo: 'Ohne Rechnung oder Referenz lässt sich nicht feststellen, was eingebaut wurde und welche Wartung ansteht. Behandeln Sie es als zu prüfen.',
  },
};

export const AVISO = 'Orientierendes Ergebnis auf Basis der Werkskonfiguration. Der Rechner diagnostiziert nicht den mechanischen Zustand des Fahrzeugs und ersetzt keine Fachinspektion.';

export const AFINAR = {
  transicion: {
    titulo: 'Klären Sie es mit der Motornummer',
    ayuda: 'Nur sie unterscheidet das eine Lager vom anderen, ohne etwas zu zerlegen.',
  },
};

export const UI = {
  modelo: 'Modell',
  ano: 'Jahr',
  anoAyuda: 'Verwenden Sie das Modelljahr, falls bekannt.',
  baseAno: 'Dieses Jahr ist',
  calcular: 'Meinen Porsche prüfen',
  continuar: 'Weiter',
  porqueEsto: 'Warum dieses Ergebnis',
  generacion: 'Generation',
  variante: 'Version',
  codigoMotor: 'Motortyp',
  codigoAyuda: 'Jeder Motor hat seine eigene Seriengrenze: Der Typ sagt, welche gilt.',
  ladoDelCorte: 'Motornummer',
  ladoAyuda: 'Vergleichen Sie sie mit der auf dem Motor eingeschlagenen Nummer.',
  ladoNoSe: 'Weiß ich nicht',
  ladoInferior: (hasta: number) => `${hasta} oder früher`,
  ladoSuperior: (hasta: number) => `${hasta + 1} oder später`,
  deFabrica: 'Ab Werk',
  configuracion: 'Konfiguration',
  sustitucion: 'Austausch',
  porQue: 'Warum',
  siguientePaso: 'Nächster Schritt',
  situacionActual: 'Angegebene Situation',
  ctaTitulo: 'Möchten Sie es an Ihrem Fahrzeug bestätigen?',
  ctaTexto: 'Wir prüfen Historie und Konfiguration Ihres Motors, bevor wir einen Eingriff empfehlen.',
  ctaBoton: 'IMS-Diagnose anfragen',
  ctaArticulo: 'Verstehen, wie das IMS funktioniert',
  errorAno: 'Geben Sie ein Jahr zwischen 1948 und ' + (new Date().getFullYear() + 1) + ' ein.',
  errorModelo: 'Wählen Sie ein Modell.',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 oder früher', '996': '996', '997_1': '997.1', '997_2': '997.2', post_997: '991 oder später',
  '986': '986', '987_1': '987.1', '987_2': '987.2 oder später', post_987: 'Später', desconocida: 'Weiß ich nicht',
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
  generacion: {
    911: [
      { valor: 'pre_996', etiqueta: '993 oder früher' }, { valor: '996', etiqueta: '996' }, { valor: '997_1', etiqueta: '997.1' },
      { valor: '997_2', etiqueta: '997.2' }, { valor: 'post_997', etiqueta: '991 oder später' }, { valor: 'desconocida', etiqueta: 'Weiß ich nicht' },
    ],
    boxster: [
      { valor: '986', etiqueta: '986' }, { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 oder später' }, { valor: 'desconocida', etiqueta: 'Weiß ich nicht' },
    ],
    cayman: [
      { valor: '987_1', etiqueta: '987.1' }, { valor: '987_2', etiqueta: '987.2 oder später' }, { valor: 'desconocida', etiqueta: 'Weiß ich nicht' },
    ],
  } as Record<string, { valor: string; etiqueta: string }[]>,
  variante: [
    { valor: 'carrera_atmosferico', etiqueta: 'Carrera / Carrera 4 / Targa' },
    { valor: 'carrera_s_atmosferico', etiqueta: 'Carrera S / Carrera 4S / Targa 4S' },
    { valor: 'turbo', etiqueta: 'Turbo / Turbo S' }, { valor: 'gt2', etiqueta: 'GT2' },
    { valor: 'gt3', etiqueta: 'GT3 / GT3 RS' }, { valor: 'desconocida', etiqueta: 'Weiß ich nicht' },
  ],
};

export const PAGINA = {
  titulo: 'Porsche IMS-Rechner: Modell und Baujahr prüfen · Valentin Motors',
  descripcion: 'Wählen Sie Modell und Baujahr, um zu erfahren, welchen IMS-Typ Ihr Fahrzeug tragen kann, wie stark es betroffen ist und welche Prüfungen es braucht.',
  eyebrow: 'Werkzeug',
  h1: 'Ist Ihr Porsche vom IMS betroffen?',
};
