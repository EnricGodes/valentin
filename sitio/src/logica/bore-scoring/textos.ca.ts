import type { Evidencia, Susceptibilidad, Tecnologia, Urgencia, Variante } from './tipos.ts';
import type { TextoEje, PreguntaSintoma } from './textos.es.ts';

/** Textos de l’avaluador de bore scoring, català. Mateixa forma que textos.es.ts. */

export const SUSCEPTIBILIDAD: Record<Susceptibilidad, TextoEje> = {
  ELEVATED_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Elevada en aquesta família',
    resumen: 'És un dels grups que els especialistes troben amb més freqüència entre els motors afectats.',
    cuerpo: 'Aquesta configuració pertany a un dels grups que apareixen amb més freqüència en l’experiència publicada dels tallers que reconstrueixen aquests motors. Això descriu una família, no aquesta unitat: no vol dir que tingui dany ni permet calcular una probabilitat individual.',
  },
  DOCUMENTED_SUSCEPTIBILITY: {
    etiqueta: 'Casos documentats',
    resumen: 'Hi ha casos descrits i una arquitectura compatible, sense arribar al grup M96/M97 més afectat.',
    cuerpo: 'Existeixen casos publicats i l’arquitectura del cilindre és compatible amb el dany, però aquesta configuració no s’ha d’equiparar automàticament als M96/M97 que concentren la major preocupació.',
  },
  LOWER_REPORTED_SUSCEPTIBILITY: {
    etiqueta: 'Comparativament baixa',
    resumen: 'Aquesta versió apareix amb menys freqüència en l’experiència tècnica publicada.',
    cuerpo: 'Apareix amb menys freqüència que les seves germanes de més cilindrada en el que publiquen els especialistes. Menys no és impossible: si hi ha símptomes, es revisa igual.',
  },
  LOWER_BY_BORE_TECHNOLOGY: {
    etiqueta: 'Tecnologia menys associada',
    resumen: 'El cilindre no comparteix el patró clàssic de Lokasil i Alusil que s’avalua aquí.',
    cuerpo: 'Segons la identificació aportada, el motor fa servir Nikasil, un recobriment ferri projectat o camises i bloc de ferro. No comparteix el patró principal que avalua aquesta eina, cosa que no garanteix l’estat de cap cilindre ni exclou un altre desgast.',
  },
  ENGINE_SPECIFIC_CLASSIFICATION: {
    etiqueta: 'Cal identificar el motor',
    resumen: 'En aquest model i any van conviure arquitectures diferents.',
    cuerpo: 'Amb el que s’ha aportat fins aquí conviuen arquitectures diferents sota el mateix nom comercial. Cal la versió, la cilindrada o el codi de motor: classificar sense això seria donar una resposta enganyosa.',
  },
  OUTSIDE_VALIDATED_SCOPE: {
    etiqueta: 'Fora de la matriu validada',
    resumen: 'No tenim una regla prou fiable per a aquesta configuració.',
    cuerpo: 'Aquesta eina cobreix 911 des del 996, Boxster i Cayman, i Cayenne, Panamera i Macan amb motor identificable. Per a la resta no hi ha una regla que puguem sostenir, i una zona verda genèrica seria pitjor que no dir res. Si hi ha símptomes, s’han d’avaluar igualment.',
  },
  NOT_APPLICABLE_ELECTRIC: {
    etiqueta: 'No aplica',
    resumen: 'Un vehicle elèctric no té cilindres de combustió.',
    cuerpo: 'Sense cilindres de combustió no pot existir aquesta avaria.',
  },
};

export const EVIDENCIA: Record<Evidencia, TextoEje> = {
  NO_EVIDENCE_REPORTED: {
    etiqueta: 'No has declarat indicis',
    resumen: 'Sense símptomes ni proves declarades. Això no és el mateix que un motor sa.',
    cuerpo: 'No s’han comunicat símptomes ni proves sospitoses. És l’únic que es pot afirmar: el dany incipient pot existir sense donar senyals que es notin des del seient.',
  },
  ONE_NON_SPECIFIC_SIGNAL: {
    etiqueta: 'Un indici aïllat',
    resumen: 'Hi ha un símptoma que pot tenir altres causes.',
    cuerpo: 'Un sol símptoma, sense res que l’acompanyi, admet moltes explicacions: taquets, injectors, una fuita d’escapament o la mateixa arrencada en fred. Convé vigilar si persisteix o si n’apareix algun més.',
  },
  MULTIPLE_COMPATIBLE_SIGNALS: {
    etiqueta: 'Diversos indicis compatibles',
    resumen: 'Coincideixen senyals de dues famílies independents.',
    cuerpo: 'Concorren senyals de famílies diferents, per exemple consum creixent i un cop rítmic, o sutge asimètric amb bugia oliosa. La coincidència justifica una boroscòpia i un diagnòstic, no un diagnòstic per si sola.',
  },
  SUPPORTING_TEST_SUSPICIOUS: {
    etiqueta: 'Una prova sospitosa',
    resumen: 'Una prova complementària apunta a desgast, sense confirmar-lo visualment.',
    cuerpo: 'L’anàlisi d’oli, la compressió, el leak-down o el que s’ha trobat al filtre donen suport a la sospita. Donen suport: la confirmació continua sent visual.',
  },
  NEGATIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Boroscòpia informada com a normal',
    resumen: 'Descriu el que es va veure aquell dia i en aquelles superfícies.',
    cuerpo: 'Una boroscòpia completa i recent informada com a normal és una bona notícia acotada: descriu l’estat observat en aquella data i en les zones que es van arribar a veure. La susceptibilitat de la família no canvia per això.',
  },
  LIMITED_OR_INCONCLUSIVE_BORESCOPE: {
    etiqueta: 'Boroscòpia limitada o no concloent',
    resumen: 'La inspecció no permet donar el motor per bo.',
    cuerpo: 'La prova no va cobrir les zones crítiques, no va arribar a tots els cilindres necessaris o l’informe no conclou. En un M96/M97 l’accés només pels allotjaments de bugia deixa fora precisament on sol començar el ratllat.',
  },
  POSITIVE_BORESCOPE_REPORTED: {
    etiqueta: 'Boroscòpia positiva declarada',
    resumen: 'Declares un informe positiu que nosaltres no hem revisat.',
    cuerpo: 'Prenem l’informe com el que és: una declaració. Abans de parlar d’abast i d’opcions convé que un especialista revisi les imatges o el motor.',
  },
  CONFIRMED_BY_SPECIALIST: {
    etiqueta: 'Confirmat per un especialista',
    resumen: 'Hi ha un informe professional que ho confirma.',
    cuerpo: 'Amb un diagnòstic professional, la conversa deixa de ser si existeix i passa a ser l’abast, la causa i l’estratègia de reconstrucció.',
  },
  CONFLICTING_EVIDENCE: {
    etiqueta: 'Informació contradictòria',
    resumen: 'Una prova normal conviu amb símptomes que la contradiuen.',
    cuerpo: 'Una boroscòpia antiga o limitada informada com a normal, seguida de símptomes nous, no tanca res: mana repetir la inspecció amb el protocol adequat.',
  },
};

export const URGENCIA: Record<Urgencia, TextoEje> = {
  INFORMATION_ONLY: { etiqueta: 'Informació i manteniment', resumen: 'Res que corri pressa. Vigila l’evolució i mantén l’oli al dia.' },
  PPI_SCOPE_RECOMMENDED: { etiqueta: 'Inclou boroscòpia a la inspecció precompra', resumen: 'Abans de comprar-lo, que la inspecció inclogui una boroscòpia completa.' },
  BOOK_SPECIALIST_INSPECTION: { etiqueta: 'Sol·licita una revisió especialitzada', resumen: 'Hi ha alguna cosa a mirar. Pot tenir altres causes, i per això es mira.' },
  PROMPT_INSPECTION: { etiqueta: 'Revisa-ho com més aviat millor', resumen: 'Els indicis justifiquen boroscòpia i diagnòstic sense deixar-ho passar.' },
  MINIMIZE_USE_AND_CONTACT: { etiqueta: 'Redueix l’ús i consulta’ns abans de continuar', resumen: 'Convé no acumular més dany fins a valorar el motor.' },
  REPAIR_PLANNING: { etiqueta: 'Valora reparació o reconstrucció', resumen: 'Amb el diagnòstic fet, toca decidir abast i estratègia.' },
  INSUFFICIENT_DATA: { etiqueta: 'Falta una dada essencial', resumen: 'Sense identificar el motor no et podem dir quina comprovació té sentit.' },
};

export const TECNOLOGIA: Record<Tecnologia, string> = {
  lokasil: 'Lokasil, cilindre d’alumini-silici integrat',
  alusil: 'Alusil, bloc hipereutèctic',
  nikasil: 'Nikasil o recobriment equivalent',
  recubrimiento_proyectado: 'Recobriment ferri projectat, APS o PTWA',
  hierro: 'Camisa o bloc de ferro',
  no_aplica_electrico: 'Sense cilindres de combustió',
  desconocida: 'Sense identificar',
};

export const CONFIANZA: Record<'alta' | 'media' | 'baja', string> = {
  alta: 'Alta: generació, versió i motor coherents',
  media: 'Mitjana: la classificació és sòlida, falta alguna dada del motor',
  baja: 'Baixa: falta identificar alguna cosa o les dades es contradiuen',
};

export const MOTIVOS: Record<string, string> = {
  ano_fuera_de_rango: 'L’any no és vàlid.',
  ano_solapado: 'Aquell any van conviure dues generacions amb motors diferents.',
  ano_de_matriculacion_en_frontera: 'És un any de matriculació al costat d’un canvi de generació, i per aquí no es pot decidir.',
  modelo_y_ano_incompatibles: 'Aquell model no es fabricava aquell any. No ho corregim pel nostre compte.',
  falta_combustible: 'En un Cayenne, un Panamera o un Macan el combustible ordena tota la resta.',
  falta_version: 'La versió separa arquitectures diferents sota el mateix nom.',
  falta_cilindrada: 'La cilindrada és el que separa dos grups amb històries molt diferents.',
  sin_regla_para_esa_combinacion: 'No tenim una regla validada per a aquesta combinació.',
  reglas_en_conflicto: 'Dues regles de la matriu encaixen alhora, així que preferim no triar per tu.',
  electrico_sin_cilindros: 'Un elèctric no té cilindres de combustió.',
  originalidad_desconocida: 'No consta si el motor és el de fàbrica.',
  motor_sustituido_sin_identificar: 'El motor va ser substituït i no està identificat: munta l’especificació de quan es va fabricar, no la de l’any del bastidor.',
  reconstruccion_sin_detalle: 'Consta una reconstrucció, però no el seu abast ni la tecnologia instal·lada.',
  reconstruccion_cambia_tecnologia: 'La reconstrucció declarada canvia la tecnologia del cilindre.',
  reconstruccion_misma_tecnologia: 'La reconstrucció declarada manté la tecnologia original.',
  boroscopia_confirmada: 'Un especialista ha revisat o emès l’informe.',
  boroscopia_positiva_declarada: 'Declares un informe positiu que no hem revisat.',
  boroscopia_no_concluyente: 'La boroscòpia no conclou o mostra marques dubtoses.',
  boroscopia_solo_por_bujias: 'Es va accedir només pels allotjaments de bugia, que en aquests motors no arriben a la zona crítica.',
  boroscopia_parcial: 'La inspecció no va cobrir tots els cilindres necessaris.',
  boroscopia_alcance_desconocido: 'No consta l’abast de la inspecció.',
  boroscopia_negativa_contra_sintomas: 'Una prova informada com a normal conviu amb símptomes posteriors.',
  dos_familias_de_senal: 'Coincideixen senyals de dues famílies independents.',
  prueba_complementaria_sospechosa: 'Una prova complementària apunta a desgast.',
  una_senal_inespecifica: 'Hi ha un senyal aïllat, compatible amb diverses causes.',
  'regla_911-mezger': 'Turbo, GT2 i GT3 d’aquella generació fan servir motor Mezger, amb Nikasil.',
  'regla_911-991-1-especificos': 'El Turbo i els GT no hereten la regla del Carrera.',
  'regla_911-pre-996': 'Els 911 anteriors al 996 queden fora d’aquesta matriu.',
  'regla_911-996-1-carrera': '996.1 Carrera 3.4, amb cilindres Lokasil.',
  'regla_911-996-2-carrera': '996.2 Carrera 3.6, un dels grups més citats.',
  'regla_911-997-1-carrera': '997.1 Carrera 3.6 i S 3.8, el grup amb més casos publicats.',
  'regla_911-997-2-carrera': '997.2 Carrera amb 9A1/MA1 i Alusil.',
  'regla_911-991-1-carrera': '991.1 Carrera amb 9A1/MA1 i Alusil.',
  'regla_911-991-2-carrera': '991.2 Carrera, amb recobriment ferri projectat.',
  'regla_911-992': 'Del 992 endavant cal confirmar l’arquitectura del motor.',
  'regla_bc-986': 'Boxster 986, comparativament menys citat.',
  'regla_bc-987-1-base': '987.1 d’accés, 2.7, comparativament menys citat.',
  'regla_bc-987-1-s-3-2': '987.1 S amb 3.2, anterior al 3.4.',
  'regla_bc-987-1-s-3-4': '987.1 S amb 3.4, el grup més citat de Boxster i Cayman.',
  'regla_bc-987-1-s-hasta-2006': 'El Boxster S 987.1 va muntar 3.2 fins a l’any model 2006.',
  'regla_bc-987-1-s-desde-2007': 'El Boxster S 987.1 munta 3.4 des de l’any model 2007.',
  'regla_bc-987-1-cayman-s': 'El Cayman S 987.1 munta 3.4 des del primer any.',
  'regla_bc-987-2': '987.2 amb 9A1/MA1 i Alusil.',
  'regla_bc-981': '981 amb 9A1/MA1 i Alusil.',
  'regla_bc-981-especificos': 'Spyder i GT4 porten un motor diferent del de la resta del 981.',
  'regla_bc-718': '718 de quatre cilindres, amb recobriment ferri projectat.',
  'regla_taycan': 'Un Taycan és elèctric.',
  'regla_electrico': 'Amb motor elèctric no hi ha cilindres de combustió.',
  'regla_suv-diesel-hibrido': 'Un dièsel o un híbrid sense identificar no es classifica pel nom.',
  'regla_cayenne-vr6': 'Cayenne amb VR6, de bloc de ferro.',
  'regla_cayenne-v8-955-958-1': 'Cayenne V8 M48, amb casos documentats.',
  'regla_cayenne-mct-958-2': 'Cayenne 3.6 MCT, Alusil amb casos documentats.',
  'regla_cayenne-e3': 'Cayenne de tercera generació, amb camises de ferro o APS.',
  'regla_panamera-970': 'Panamera 970, Alusil amb casos documentats.',
  'regla_panamera-970-base': 'En el 970 d’accés cal identificar el motor.',
  'regla_panamera-971': 'Panamera 971, amb camises de ferro o APS.',
  'regla_macan-2-0': 'Macan 2.0 EA888, fora del patró Alusil clàssic.',
  'regla_macan-v6-mct': 'Macan V6 MCT, Alusil amb casos documentats.',
  'regla_macan-v6-ea839': 'Macan V6 EA839, amb camises de ferro.',
  'regla_otro-porsche': 'Aquell Porsche no és a la matriu validada.',
};

export const AVISOS: Record<string, string> = {
  menor_no_es_inmune: 'Menys susceptibilitat no és immunitat: si apareixen símptomes, es revisa igual que en qualsevol altre.',
  sin_indicios_no_es_sano: 'No haver declarat indicis no és un motor sa: el dany incipient pot no donar senyals.',
  negativa_es_de_esa_fecha: 'Una boroscòpia normal descriu aquella data i aquelles superfícies, no el futur del motor.',
  no_declarar_solucionado: 'Una factura de reconstrucció sense abast conegut no permet donar-ho per resolt.',
  motor_sustituido: 'En no ser el motor de fàbrica, la susceptibilitat de la unitat depèn del motor que munta ara.',
  motor_sin_verificar: 'No consta si el motor és el de fàbrica, així que la classificació pot no correspondre a aquesta unitat.',
  ano_no_es_modelo: 'L’any usat no és l’any model, així que el resultat perd precisió.',
  consumo_para_el_taller: 'El consum que has anotat es guarda per ensenyar-lo al taller: no el fem servir per puntuar risc.',
};

export const ACCIONES: Record<string, string> = {
  vigilar_evolucion: 'Anota consum, sorolls i fum amb dates: la tendència val més que una mesura solta.',
  mantenimiento_preventivo: 'Mantén al dia l’oli i el filtre, i evita allargar els cicles en fred.',
  boroscopia_en_precompra: 'Demana que la inspecció precompra inclogui una boroscòpia completa, no només pels allotjaments de bugia.',
  pedir_historial: 'Reuneix factures, anàlisis d’oli anteriors i qualsevol informe previ del motor.',
  revision_especializada: 'Demana una revisió especialitzada que faci el diagnòstic diferencial: taquets, injectors i escapament donen símptomes semblants.',
  preparar_datos: 'Porta les dades ordenades: quan va començar, en fred o en calent, litres afegits i quilòmetres entre aportacions.',
  boroscopia_y_diagnostico: 'Reserva boroscòpia i diagnòstic: és la via per veure el cilindre i descartar altres causes.',
  reducir_uso: 'Redueix l’ús fins a valorar el motor, i evita les sèries d’acceleració forta.',
  valorar_reparacion: 'Valorem causa, abast i estratègia de reconstrucció abans de tocar res.',
  enviar_informe: 'Comparteix l’informe i les imatges amb el taller per valorar l’abast real.',
  identificar_motor: 'Identifica el motor: l’etiqueta del bloc, la documentació o una foto del codi ho resolen.',
};

export const PREGUNTAS: Record<string, { etiqueta: string; porque: string }> = {
  generacion: { etiqueta: 'Generació', porque: 'Aquell any van conviure dues generacions amb cilindres diferents.' },
  variante: { etiqueta: 'Versió', porque: 'Sota el mateix nom conviuen arquitectures de motor diferents.' },
  combustible: { etiqueta: 'Motor', porque: 'En un Cayenne, un Panamera o un Macan, el nom i l’any no diuen quin motor porta.' },
  cilindrada: { etiqueta: 'Cilindrada', porque: 'És el que separa dos grups amb històries molt diferents.' },
  ano_imposible: { etiqueta: 'Revisa l’any o el model', porque: 'Aquell model no es fabricava aquell any, i preferim no corregir-ho pel nostre compte.' },
};

export const AVISO = 'Resultat orientatiu basat en la configuració de fàbrica i en les dades que has declarat. L’absència de símptomes no descarta dany incipient i els símptomes descrits poden tenir altres causes. Només una inspecció boroscòpica feta i interpretada correctament pot confirmar visualment el bore scoring. Aquesta eina no substitueix una inspecció mecànica.';

export const CONFIRMACION = 'Els símptomes poden orientar, però només una inspecció boroscòpica adequada permet confirmar visualment el bore scoring.';

export const AFINAR = {
  titulo: 'Afinar el resultat amb símptomes i proves',
  ayuda: 'Preguntes curtes sobre símptomes, proves i historial del motor. Amb el que sàpigues n’hi ha prou: «no ho sé» és una resposta vàlida i no empitjora el resultat.',
};

export const UI = {
  modelo: 'Model',
  ano: 'Any',
  anoAyuda: 'Si pots, fes servir l’any model. Pot no coincidir amb la matriculació.',
  baseAno: 'Aquell any és',
  calcular: 'Comprovar el meu Porsche',
  situacion: 'En quina situació estàs?',
  ejeConfiguracion: 'Configuració del motor',
  ejeSusceptibilidad: 'Susceptibilitat del motor',
  ejeEvidencia: 'Informació sobre aquesta unitat',
  ejeConfianza: 'Qualitat de la identificació',
  siguientePaso: 'Què faríem ara',
  porqueEsto: 'Per què surt això',
  aTenerEnCuenta: 'A tenir en compte',
  deFabrica: 'De fàbrica',
  motorActual: 'Motor que munta ara',
  consumoDeclarado: 'Consum declarat',
  consumoUnidad: 'l/1.000 km',
  fuentes: 'Fonts',
  reglas: 'Regles',
  ctaArticulo: 'Entendre el bore scoring',
  ctaIms: 'Comprovar també l’IMS',
  imsPuente: 'Aquest motor pertany a més a una generació que avalua la calculadora IMS. Són dues comprovacions diferents i no es combinen en una sola nota.',
  errorAno: 'Introdueix un any entre 1948 i ' + (new Date().getFullYear() + 1) + '.',
  noLoSe: 'No ho sé',
  detallesConsumo: 'Si ho tens anotat',
};

export const CTA: Record<Urgencia, string> = {
  INFORMATION_ONLY: 'Consultar manteniment preventiu',
  PPI_SCOPE_RECOMMENDED: 'Sol·licitar inspecció precompra amb boroscòpia',
  BOOK_SPECIALIST_INSPECTION: 'Sol·licitar revisió especialitzada',
  PROMPT_INSPECTION: 'Reservar diagnòstic i boroscòpia',
  MINIMIZE_USE_AND_CONTACT: 'Reservar diagnòstic i boroscòpia',
  REPAIR_PLANNING: 'Valorar opcions de reparació',
  INSUFFICIENT_DATA: 'Ajuda’ns a identificar el motor',
};

export const GENERACION: Record<string, string> = {
  pre_996: '993 o anterior', '996_1': '996.1', '996_2': '996.2', '997_1': '997.1', '997_2': '997.2',
  '991_1': '991.1', '991_2': '991.2', post_991: '992 o posterior', '986': '986', '987_1': '987.1', '987_2': '987.2',
  '981': '981', '718': '718',
  cayenne_955: '955 · 2003-2006', cayenne_957: '957 · 2008-2010', cayenne_958_1: '958.1 · 2011-2014',
  cayenne_958_2: '958.2 · 2015-2018', cayenne_e3: 'E3 · des de 2019',
  panamera_970: '970 · 2009-2016', panamera_971: '971 · des de 2017',
  macan_95b: '95B · 2014-2018', macan_95b_2: '95B · des de 2019',
  desconocida: 'No ho sé',
};

export const VARIANTE: Record<Variante, string> = {
  carrera: 'Carrera / Carrera 4', carrera_s: 'Carrera S / 4S / Targa', turbo: 'Turbo / Turbo S', gt2: 'GT2',
  gt3: 'GT3 / GT3 RS', base: 'Versió d’accés', s: 'S', gts: 'GTS', spyder_gt4: 'Spyder / GT4',
  otra: 'Una altra', desconocida: 'No ho sé',
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
  combustible: [
    { valor: 'gasolina', etiqueta: 'Gasolina' }, { valor: 'diesel', etiqueta: 'Dièsel' }, { valor: 'hibrido', etiqueta: 'Híbrid' },
    { valor: 'electrico', etiqueta: 'Elèctric' }, { valor: 'desconocido', etiqueta: 'No ho sé' },
  ],
  situacion: [
    { valor: 'compra', etiqueta: 'Estic valorant comprar-lo' }, { valor: 'propietario', etiqueta: 'Ja és meu' },
    { valor: 'sintoma', etiqueta: 'He observat un símptoma' }, { valor: 'prueba', etiqueta: 'Ja tinc una prova o diagnòstic' },
  ],
  originalidad: [
    { valor: 'original', etiqueta: 'Sí, el de fàbrica' }, { valor: 'sustituido', etiqueta: 'No, va ser substituït' },
    { valor: 'reconstruido', etiqueta: 'Va ser reconstruït' }, { valor: 'desconocida', etiqueta: 'No ho sé' },
  ],
  tecnologiaReconstruida: [
    { valor: '', etiqueta: 'No ho sé' }, { valor: 'lokasil', etiqueta: 'L’original' }, { valor: 'alusil', etiqueta: 'Alusil recondicionat' },
    { valor: 'hierro', etiqueta: 'Camisa de ferro' }, { valor: 'nikasil', etiqueta: 'Nikasil o NSC' }, { valor: 'recubrimiento_proyectado', etiqueta: 'Recobriment projectat' },
  ],
};

export const SINTOMAS: PreguntaSintoma[] = [
  { campo: 'consumoAceite', etiqueta: 'Ha augmentat el consum d’oli?', ayuda: 'Comparat amb l’habitual en aquest cotxe, no amb una xifra de catàleg.',
    opciones: [{ valor: 'estable', etiqueta: 'No, es manté' }, { valor: 'aumenta', etiqueta: 'Sí, ha augmentat' }, { valor: 'no_lo_se', etiqueta: 'No ho puc saber' }] },
  { campo: 'golpeteo', etiqueta: 'Se sent un cop rítmic al motor?', ayuda: 'El «tic-tic» només en fred també el fan taquets i injectors.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'solo_frio', etiqueta: 'Només en fred' }, { valor: 'frio_y_caliente', etiqueta: 'També en calent' }, { valor: 'no_lo_se', etiqueta: 'No ho sé' }] },
  { campo: 'humo', etiqueta: 'Emet fum visible?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'bocanada_arranque', etiqueta: 'Una glopada ocasional en arrencar' }, { valor: 'arranque_repetido', etiqueta: 'Repetit en arrencar' }, { valor: 'en_marcha', etiqueta: 'Al ralentí o circulant' }, { valor: 'no_lo_se', etiqueta: 'No ho sé' }] },
  { campo: 'hollin', etiqueta: 'Una sortida d’escapament acumula més sutge oliós que l’altra?', ayuda: 'Només serveix on cada sortida correspon a una bancada.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'asimetrico', etiqueta: 'Sí, una molt més' }, { valor: 'ambas', etiqueta: 'Totes dues per igual' }, { valor: 'no_comparable', etiqueta: 'L’escapament no permet comparar-ho' }, { valor: 'no_lo_se', etiqueta: 'No ho sé' }] },
  { campo: 'fallosCombustion', etiqueta: 'Hi ha fallades d’encesa o testimoni de motor?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'codigo_guardado', etiqueta: 'Una fallada registrada sense causa coneguda' }, { valor: 'activo', etiqueta: 'Fallada activa o bugia oliosa' }, { valor: 'no_lo_se', etiqueta: 'No ho sé' }] },
];

export const PRUEBAS: PreguntaSintoma[] = [
  { campo: 'boroscopia', etiqueta: 'Existeix una boroscòpia recent?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'normal', etiqueta: 'Sí, informada com a normal' }, { valor: 'no_concluyente', etiqueta: 'Sí, limitada o no concloent' }, { valor: 'dudosa', etiqueta: 'Sí, amb marques dubtoses' }, { valor: 'positiva', etiqueta: 'Sí, amb bore scoring diagnosticat' }] },
  { campo: 'analisisAceite', etiqueta: 'Hi ha anàlisi d’oli?', ayuda: 'Una sola mostra no confirma ni descarta res; la tendència sí que diu alguna cosa.',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'una_normal', etiqueta: 'Una mostra normal' }, { valor: 'serie_estable', etiqueta: 'Una sèrie estable' }, { valor: 'una_anomala', etiqueta: 'Una mostra amb metalls alts' }, { valor: 'tendencia_creciente', etiqueta: 'Tendència creixent d’alumini, ferro o silici' }, { valor: 'no_lo_se', etiqueta: 'No ho sé' }] },
  { campo: 'compresionLeakdown', etiqueta: 'S’ha mesurat compressió o leak-down?',
    opciones: [{ valor: 'no', etiqueta: 'No' }, { valor: 'normal', etiqueta: 'Sí, amb lectura normal' }, { valor: 'anomala', etiqueta: 'Sí, amb lectura anormal' }, { valor: 'no_lo_se', etiqueta: 'No ho sé' }] },
];

export const BOROSCOPIA_DETALLE: PreguntaSintoma[] = [
  { campo: 'viaBoroscopia', etiqueta: 'Via d’accés', ayuda: 'En M96/M97, només pels allotjaments de bugia no s’arriba a la zona crítica.',
    opciones: [{ valor: 'bujias', etiqueta: 'Per les bugies' }, { valor: 'carter', etiqueta: 'Pel càrter' }, { valor: 'ambas', etiqueta: 'Per totes dues' }, { valor: 'no_lo_se', etiqueta: 'No ho sé' }] },
  { campo: 'calidadBoroscopia', etiqueta: 'Abast',
    opciones: [{ valor: 'completa', etiqueta: 'Tots els cilindres' }, { valor: 'parcial', etiqueta: 'Només alguns' }, { valor: 'desconocida', etiqueta: 'No ho sé' }] },
  { campo: 'sintomasNuevosDesdeBoroscopia', etiqueta: 'Han aparegut símptomes nous des de llavors?',
    opciones: [{ valor: '', etiqueta: 'No' }, { valor: 'si', etiqueta: 'Sí' }] },
];

export const HISTORIAL: PreguntaSintoma = {
  campo: 'originalidadMotor', etiqueta: 'Conserva el motor original?', opciones: OPCIONES.originalidad,
};

export const PAGINA = {
  titulo: 'Calculadora de bore scoring Porsche per model i any · Valentin Motors',
  descripcion: 'Selecciona model, any i motor per conèixer la seva susceptibilitat al ratllat de cilindres i saber quan convé fer una boroscòpia.',
  eyebrow: 'Eina',
  h1: 'El teu Porsche pot patir bore scoring?',
  intro: 'Selecciona model i any per conèixer la susceptibilitat del seu motor. Després pots afegir símptomes o proves per saber quina comprovació té sentit.',
  explicacionTitulo: 'Què confirma una boroscòpia i què no',
  explicacion: [
    'El bore scoring (ratllat de cilindres) és un dany físic a la paret del cilindre i a la faldilla del pistó. No és una peça de fàbrica que es pugui deduir del model i de l’any: s’adquireix amb l’ús, pot començar de pressa i agreujar-se després. Per això aquesta eina separa el que se sap d’una família de motors del que se sap de la teva unitat.',
    'La confirmació és visual. Una boroscòpia ben feta entra per on toca, recorre tots els cilindres necessaris i la interpreta algú que distingeix una ratlla d’un reflex o d’un dipòsit de carbonissa. Als M96 i M97, l’accés només pels allotjaments de bugia deixa fora precisament la zona on el ratllat sol començar: una prova així, informada com a normal, no permet donar el motor per bo.',
    'Els símptomes orienten i les proves complementàries donen suport, però cap confirma. El consum d’oli, el cop rítmic, el sutge asimètric o una fallada d’encesa tenen altres causes possibles: taquets, injectors, una fuita d’escapament, segments desgastats sense ratllat. El diagnòstic diferencial és part de la feina, no un tràmit.',
    'Tampoc no existeix una cura per additiu ni per un oli més espès. Quan el ratllat està confirmat, la conversa és d’abast: quins cilindres, amb quina tecnologia es reconstrueixen i quina garantia porta. Això es decideix amb el motor al davant.',
  ],
  faqTitulo: 'Preguntes freqüents',
  faq: [
    ['Pot dir-me aquesta eina si el meu cotxe té bore scoring?', 'No, i cap que faci servir només model i any pot fer-ho. Et diu si la seva configuració pertany a un grup amb més casos publicats, què diuen els indicis que aportis i quina comprovació té sentit ara.'],
    ['Tots els 997.1 i els Cayman S 3.4 estan afectats?', 'No. Són els grups que més apareixen en l’experiència dels especialistes, que és una cosa diferent. Hi ha moltes unitats sanes amb molts quilòmetres.'],
    ['Els Porsche des de 2009 estan lliures?', 'No. El 997.2 i el 987.2 van deixar enrere l’IMS clàssic, però els seus motors 9A1/MA1 amb Alusil també tenen casos documentats de ratllat.'],
    ['Un 2.5, 2.7 o 3.2 mai no falla?', 'Apareixen força menys en el que es publica. Menys no és mai: si hi ha símptomes, es revisen igual que qualsevol altre.'],
    ['La meva boroscòpia va sortir normal, ja me’n puc oblidar?', 'Descriu el que es va veure aquell dia i en les superfícies que es van arribar a veure. Si la prova va ser parcial, o si després han aparegut símptomes nous, convé repetir-la amb el protocol adequat.'],
    ['Serveix l’anàlisi d’oli?', 'Com a suport, i sobretot en sèrie. Una sola mostra normal no descarta res, i una sola mostra alta no confirma res. El que diu alguna cosa és la tendència d’alumini, ferro i silici al llarg del temps.'],
  ],
  revisadas: 'revisades el',
};
