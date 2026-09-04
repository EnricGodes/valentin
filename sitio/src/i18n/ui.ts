import type { Idioma } from './config.ts';

/** Cadenas de interfaz. El contenido editorial vive en el CMS, no aqui. */
export const UI = {
  'nav.coches':      { es: 'Porsche en venta', en: 'Porsche for sale', fr: 'Porsche à vendre', it: 'Porsche in vendita', de: 'Porsche kaufen', ca: 'Porsche en venda' },
  'nav.taller':      { es: 'Taller', en: 'Workshop', fr: 'Atelier', it: 'Officina', de: 'Werkstatt', ca: 'Taller' },
  'nav.servicios':   { es: 'Servicios', en: 'Services', fr: 'Services', it: 'Servizi', de: 'Leistungen', ca: 'Serveis' },
  'nav.tarifas':     { es: 'Tarifas', en: 'Pricing', fr: 'Tarifs', it: 'Tariffe', de: 'Preise', ca: 'Tarifes' },
  'nav.magazine':    { es: 'Magazine', en: 'Magazine', fr: 'Magazine', it: 'Magazine', de: 'Magazine', ca: 'Magazine' },
  'nav.herramientas': { es: 'Herramientas', en: 'Tools', fr: 'Outils', it: 'Strumenti', de: 'Werkzeuge', ca: 'Eines' },
  'nav.nosotros':    { es: 'Nosotros', en: 'About', fr: 'À propos', it: 'Chi siamo', de: 'Über uns', ca: 'Nosaltres' },
  'nav.contacto':    { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatti', de: 'Kontakt', ca: 'Contacte' },

  'a11y.saltar':     { es: 'Saltar al contenido', en: 'Skip to content', fr: 'Aller au contenu', it: 'Vai al contenuto', de: 'Zum Inhalt springen', ca: 'Salta al contingut' },
  'a11y.galeria':    { es: 'Galería de fotografías', en: 'Photo gallery', fr: 'Galerie photo', it: 'Galleria fotografica', de: 'Fotogalerie', ca: 'Galeria de fotografies' },
  'a11y.anterior':   { es: 'Foto anterior', en: 'Previous photo', fr: 'Photo précédente', it: 'Foto precedente', de: 'Vorheriges Foto', ca: 'Foto anterior' },
  'a11y.siguiente':  { es: 'Foto siguiente', en: 'Next photo', fr: 'Photo suivante', it: 'Foto successiva', de: 'Nächstes Foto', ca: 'Foto següent' },
  'a11y.irFoto':     { es: 'Ir a la foto', en: 'Go to photo', fr: 'Aller à la photo', it: 'Vai alla foto', de: 'Zum Foto', ca: 'Ves a la foto' },
  'a11y.idioma':     { es: 'Cambiar idioma', en: 'Change language', fr: 'Changer de langue', it: 'Cambia lingua', de: 'Sprache wechseln', ca: 'Canvia idioma' },

  'scroll':          { es: 'Desliza', en: 'Scroll', fr: 'Défiler', it: 'Scorri', de: 'Scrollen', ca: 'Llisca' },
  'precio':          { es: 'Precio', en: 'Price', fr: 'Prix', it: 'Prezzo', de: 'Preis', ca: 'Preu' },
  'estado.disponible': { es: 'Disponible', en: 'Available', fr: 'Disponible', it: 'Disponibile', de: 'Verfügbar', ca: 'Disponible' },
  'estado.reservado':  { es: 'Reservado', en: 'Reserved', fr: 'Réservé', it: 'Riservato', de: 'Reserviert', ca: 'Reservat' },
  'estado.vendido':    { es: 'Vendido', en: 'Sold', fr: 'Vendu', it: 'Venduta', de: 'Verkauft', ca: 'Venut' },
  'cta.info':        { es: 'Más información', en: 'Enquire', fr: 'Plus d’informations', it: 'Maggiori informazioni', de: 'Mehr erfahren', ca: 'Més informació' },
  'cta.ficha':       { es: 'Ver ficha', en: 'View details', fr: 'Voir la fiche', it: 'Vedi scheda', de: 'Details ansehen', ca: 'Veure fitxa' },

  'post.fecha':      { es: 'Fecha', en: 'Date', fr: 'Date', it: 'Data', de: 'Datum', ca: 'Data' },
  'post.seccion':    { es: 'Sección', en: 'Section', fr: 'Rubrique', it: 'Sezione', de: 'Rubrik', ca: 'Secció' },
  'post.texto':      { es: 'Texto', en: 'Words', fr: 'Texte', it: 'Testo', de: 'Text', ca: 'Text' },
  'post.volver':     { es: 'Volver al Magazine', en: 'Back to Magazine', fr: 'Retour au Magazine', it: 'Torna al Magazine', de: 'Zurück zum Magazine', ca: 'Torna al Magazine' },

  'pie.legal':       { es: 'Aviso legal', en: 'Legal notice', fr: 'Mentions légales', it: 'Note legali', de: 'Impressum', ca: 'Avis legal' },
  'pie.privacidad':  { es: 'Privacidad', en: 'Privacy', fr: 'Confidentialité', it: 'Privacy', de: 'Datenschutz', ca: 'Privacitat' },
  'pie.cookies':     { es: 'Cookies', en: 'Cookies', fr: 'Cookies', it: 'Cookie', de: 'Cookies', ca: 'Cookies' },
  'pie.soloEspanol': { es: '', en: 'in Spanish', fr: 'en espagnol', it: 'in spagnolo', de: 'auf Spanisch', ca: 'en castellà' },

  'catalogo.titulo': {
    es: 'Porsche de colección en venta · Valentín Motors',
    en: 'Collector Porsche for sale · Valentín Motors',
    fr: 'Porsche de collection à vendre · Valentín Motors',
    it: 'Porsche da collezione in vendita · Valentín Motors',
    de: 'Sammler-Porsche zu verkaufen · Valentín Motors',
    ca: 'Porsche de col·lecció en venda · Valentín Motors' },
  'catalogo.descripcion': {
    es: 'Selección de Porsche verificados por un especialista independiente desde 1979. Cada coche con historial documentado y 12 meses de garantía.',
    en: 'A selection of Porsche vetted by an independent specialist since 1979. Every car with documented history and a 12-month warranty.',
    fr: 'Une sélection de Porsche vérifiées par un spécialiste indépendant depuis 1979. Chaque voiture avec historique documenté et douze mois de garantie.',
    it: 'Una selezione di Porsche verificate da uno specialista indipendente dal 1979. Ogni vettura con storia documentata e dodici mesi di garanzia.',
    de: 'Eine Auswahl von Porsche, geprüft von einem freien Spezialisten seit 1979. Jedes Fahrzeug mit dokumentierter Historie und zwölf Monaten Garantie.',
    ca: 'Selecció de Porsche verificats per un especialista independent des de 1979. Cada cotxe amb historial documentat i dotze mesos de garantia.' },

  'cookies.titulo':  { es: 'Cookies', en: 'Cookies', fr: 'Cookies', it: 'Cookie', de: 'Cookies', ca: 'Galetes' },
  'cookies.texto': {
    es: 'Usamos analítica sin cookies para saber qué páginas se leen. Si aceptas, añadimos Google Analytics para entender mejor de dónde llegas.',
    en: 'We use cookieless analytics to see which pages get read. If you accept, we add Google Analytics to better understand where you come from.',
    fr: 'Nous utilisons une analyse sans cookies pour savoir quelles pages sont lues. Si vous acceptez, nous ajoutons Google Analytics pour mieux comprendre d’où vous venez.',
    it: 'Usiamo analisi senza cookie per sapere quali pagine vengono lette. Se accetta, aggiungiamo Google Analytics per capire meglio da dove arriva.',
    de: 'Wir nutzen eine Analyse ohne Cookies, um zu sehen, welche Seiten gelesen werden. Wenn Sie zustimmen, ergänzen wir Google Analytics, um besser zu verstehen, woher Sie kommen.',
    ca: 'Fem servir analítica sense galetes per saber quines pàgines es llegeixen. Si ho acceptes, hi afegim Google Analytics per entendre millor d’on arribes.' },
  'cookies.aceptar':  { es: 'Aceptar', en: 'Accept', fr: 'Accepter', it: 'Accetto', de: 'Zustimmen', ca: 'Accepta' },
  'cookies.rechazar': { es: 'Solo lo necesario', en: 'Essential only', fr: 'Strictement nécessaire', it: 'Solo il necessario', de: 'Nur das Nötige', ca: 'Només el necessari' },
  'cookies.masInfo':  { es: 'Política de cookies', en: 'Cookie policy', fr: 'Politique de cookies', it: 'Informativa cookie', de: 'Cookie-Richtlinie', ca: 'Política de galetes' },

  'vendido.explicacion': {
    es: 'Este Porsche ya se ha vendido. Mantenemos su página porque forma parte del stock que ha pasado por nuestras manos, y porque quien buscaba este modelo merece encontrar algo mejor que un error.',
    en: 'This Porsche has been sold. We keep its page because it is part of the stock that has passed through our hands, and because anyone searching for this model deserves to find something better than an error.',
    fr: 'Cette Porsche a été vendue. Nous conservons sa page parce qu’elle fait partie des voitures passées entre nos mains, et parce que celui qui cherchait ce modèle mérite mieux qu’une page d’erreur.',
    it: 'Questa Porsche è stata venduta. Manteniamo la sua pagina perché fa parte delle vetture passate per le nostre mani, e perché chi cercava questo modello merita qualcosa di meglio di un errore.',
    de: 'Dieser Porsche ist verkauft. Wir behalten seine Seite, weil er zu den Fahrzeugen gehört, die durch unsere Hände gegangen sind, und weil wer dieses Modell sucht Besseres verdient als eine Fehlerseite.',
    ca: 'Aquest Porsche ja s’ha venut. Mantenim la seva pàgina perquè forma part de l’estoc que ha passat per les nostres mans, i perquè qui buscava aquest model mereix trobar alguna cosa millor que un error.' },
  'vendido.avisame': {
    es: 'Avísame si entra uno similar', en: 'Tell me if a similar one comes in',
    fr: 'Prévenez-moi si une similaire arrive', it: 'Avvisatemi se ne arriva una simile',
    de: 'Benachrichtigen Sie mich bei einem ähnlichen', ca: 'Avisa’m si n’entra un de similar' },
  'vendido.verStock': {
    es: 'Ver los Porsche disponibles', en: 'See available Porsche',
    fr: 'Voir les Porsche disponibles', it: 'Vedi le Porsche disponibili',
    de: 'Verfügbare Porsche ansehen', ca: 'Veure els Porsche disponibles' },

  // --- Formulario de contacto ---
  'form.titulo': {
    es: 'Escríbenos', en: 'Write to us', fr: 'Écrivez-nous',
    it: 'Scrivici', de: 'Schreiben Sie uns', ca: 'Escriu-nos' },
  'form.intro': {
    es: 'Cuéntanos qué necesitas. Te contestamos el mismo día laborable, en tu idioma.',
    en: 'Tell us what you need. We reply the same working day, in your language.',
    fr: 'Dites-nous ce dont vous avez besoin. Nous répondons le jour ouvré même, dans votre langue.',
    it: 'Ci dica di cosa ha bisogno. Rispondiamo entro la stessa giornata lavorativa, nella sua lingua.',
    de: 'Sagen Sie uns, was Sie brauchen. Wir antworten am selben Werktag, in Ihrer Sprache.',
    ca: 'Explica’ns què necessites. Et contestem el mateix dia laborable, en el teu idioma.' },
  'form.nombre': {
    es: 'Nombre', en: 'Name', fr: 'Nom', it: 'Nome', de: 'Name', ca: 'Nom' },
  'form.email': {
    es: 'Email', en: 'Email', fr: 'E-mail', it: 'Email', de: 'E-Mail', ca: 'Correu' },
  'form.telefono': {
    es: 'Teléfono', en: 'Phone', fr: 'Téléphone', it: 'Telefono', de: 'Telefon', ca: 'Telèfon' },
  'form.opcional': {
    es: 'opcional', en: 'optional', fr: 'facultatif', it: 'facoltativo', de: 'optional', ca: 'opcional' },
  'form.asunto': {
    es: 'Motivo', en: 'Subject', fr: 'Motif', it: 'Motivo', de: 'Anliegen', ca: 'Motiu' },
  'form.asunto.taller': {
    es: 'Cita de taller', en: 'Workshop appointment', fr: 'Rendez-vous atelier',
    it: 'Appuntamento in officina', de: 'Werkstatttermin', ca: 'Cita de taller' },
  'form.asunto.compra': {
    es: 'Comprar un Porsche', en: 'Buying a Porsche', fr: 'Acheter une Porsche',
    it: 'Comprare una Porsche', de: 'Einen Porsche kaufen', ca: 'Comprar un Porsche' },
  'form.asunto.venta': {
    es: 'Vender mi Porsche', en: 'Selling my Porsche', fr: 'Vendre ma Porsche',
    it: 'Vendere la mia Porsche', de: 'Meinen Porsche verkaufen', ca: 'Vendre el meu Porsche' },
  'form.asunto.restauracion': {
    es: 'Restauración', en: 'Restoration', fr: 'Restauration',
    it: 'Restauro', de: 'Restaurierung', ca: 'Restauració' },
  'form.asunto.otro': {
    es: 'Otro', en: 'Other', fr: 'Autre', it: 'Altro', de: 'Sonstiges', ca: 'Altre' },
  'form.modelo': {
    es: 'Tu Porsche', en: 'Your Porsche', fr: 'Votre Porsche',
    it: 'La sua Porsche', de: 'Ihr Porsche', ca: 'El teu Porsche' },
  'form.modelo.ayuda': {
    es: 'Modelo y año. Por ejemplo: 997 Carrera S, 2006',
    en: 'Model and year. For example: 997 Carrera S, 2006',
    fr: 'Modèle et année. Par exemple : 997 Carrera S, 2006',
    it: 'Modello e anno. Per esempio: 997 Carrera S, 2006',
    de: 'Modell und Baujahr. Zum Beispiel: 997 Carrera S, 2006',
    ca: 'Model i any. Per exemple: 997 Carrera S, 2006' },
  'form.centro': {
    es: 'Centro', en: 'Location', fr: 'Centre', it: 'Sede', de: 'Standort', ca: 'Centre' },
  'form.centro.cualquiera': {
    es: 'Me da igual', en: 'No preference', fr: 'Peu importe',
    it: 'Indifferente', de: 'Egal', ca: 'M’és igual' },
  'form.mensaje': {
    es: 'Mensaje', en: 'Message', fr: 'Message', it: 'Messaggio', de: 'Nachricht', ca: 'Missatge' },
  'form.rgpd': {
    es: 'He leído y acepto la',
    en: 'I have read and accept the',
    fr: 'J’ai lu et j’accepte la',
    it: 'Ho letto e accetto l’',
    de: 'Ich habe die Datenschutzerklärung gelesen und akzeptiere sie',
    ca: 'He llegit i accepto la' },
  'form.rgpd.enlace': {
    es: 'política de privacidad', en: 'privacy policy', fr: 'politique de confidentialité',
    it: 'informativa sulla privacy', de: 'Datenschutzerklärung', ca: 'política de privacitat' },
  'form.enviar': {
    es: 'Enviar', en: 'Send', fr: 'Envoyer', it: 'Invia', de: 'Senden', ca: 'Envia' },
  'form.enviando': {
    es: 'Enviando', en: 'Sending', fr: 'Envoi', it: 'Invio', de: 'Wird gesendet', ca: 'Enviant' },
  'form.ok': {
    es: 'Mensaje recibido. Te contestamos en breve.',
    en: 'Message received. We will reply shortly.',
    fr: 'Message reçu. Nous vous répondons sous peu.',
    it: 'Messaggio ricevuto. Le risponderemo a breve.',
    de: 'Nachricht erhalten. Wir melden uns in Kürze.',
    ca: 'Missatge rebut. Et contestem ben aviat.' },
  'form.error': {
    es: 'No hemos podido enviar el mensaje. Escríbenos a info@valentinmotors.es o llámanos al 933 479 856.',
    en: 'We could not send the message. Write to info@valentinmotors.es or call +34 933 479 856.',
    fr: 'Nous n’avons pas pu envoyer le message. Écrivez à info@valentinmotors.es ou appelez le +34 933 479 856.',
    it: 'Non siamo riusciti a inviare il messaggio. Scriva a info@valentinmotors.es o chiami il +34 933 479 856.',
    de: 'Die Nachricht konnte nicht gesendet werden. Schreiben Sie an info@valentinmotors.es oder rufen Sie +34 933 479 856 an.',
    ca: 'No hem pogut enviar el missatge. Escriu-nos a info@valentinmotors.es o truca al 933 479 856.' },
  'form.faltan': {
    es: 'Revisa los campos marcados.', en: 'Please check the highlighted fields.',
    fr: 'Vérifiez les champs signalés.', it: 'Controlli i campi segnalati.',
    de: 'Bitte prüfen Sie die markierten Felder.', ca: 'Revisa els camps marcats.' },
  'form.interes': {
    es: 'Me interesa este Porsche', en: 'I am interested in this Porsche',
    fr: 'Cette Porsche m’intéresse', it: 'Mi interessa questa Porsche',
    de: 'Ich interessiere mich für diesen Porsche', ca: 'M’interessa aquest Porsche' },

  'footer.desde':    { es: 'Especialistas Porsche desde 1979', en: 'Porsche specialists since 1979', fr: 'Spécialistes Porsche depuis 1979', it: 'Specialisti Porsche dal 1979', de: 'Porsche-Spezialisten seit 1979', ca: 'Especialistes Porsche des de 1979' },
  'tarifas.familia':   { es: 'Familia', en: 'Family', fr: 'Famille', it: 'Famiglia', de: 'Familie', ca: 'Família' },
  'tarifas.modelo':    { es: 'Modelo', en: 'Model', fr: 'Modèle', it: 'Modello', de: 'Modell', ca: 'Model' },
  'tarifas.nota':      { es: 'Precios sin IVA. Son tarifas cerradas de referencia: el presupuesto en firme depende del estado de la unidad.', en: 'Prices exclude VAT. These are reference fixed rates: the firm quote depends on the condition of the car.', fr: 'Prix hors TVA. Tarifs forfaitaires de référence : le devis ferme dépend de l\'état de la voiture.', it: 'Prezzi IVA esclusa. Tariffe fisse di riferimento: il preventivo definitivo dipende dalle condizioni della vettura.', de: 'Preise ohne MwSt. Richtwerte als Festpreis: das verbindliche Angebot hängt vom Zustand des Fahrzeugs ab.', ca: 'Preus sense IVA. Són tarifes tancades de referència: el pressupost en ferm depèn de l\'estat de la unitat.' },
  'catalogo.generaciones': { es: 'Por generación', en: 'By generation', fr: 'Par génération', it: 'Per generazione', de: 'Nach Generation', ca: 'Per generació' },
  'catalogo.vende':        { es: 'Te ayudamos a vender el tuyo', en: 'We help you sell yours', fr: 'Nous vous aidons à vendre la vôtre', it: 'Ti aiutiamo a vendere la tua', de: 'Wir helfen Ihnen, Ihren zu verkaufen', ca: 'T\'ajudem a vendre el teu' },
  'nav.builds':        { es: 'Builds', en: 'Builds', fr: 'Builds', it: 'Builds', de: 'Builds', ca: 'Builds' },
  'nav.centros':       { es: 'Centros', en: 'Locations', fr: 'Centres', it: 'Sedi', de: 'Standorte', ca: 'Centres' },
  'nav.verTodo':       { es: 'Ver todo', en: 'See all', fr: 'Tout voir', it: 'Vedi tutto', de: 'Alle ansehen', ca: 'Veure-ho tot' },
  'nav.abrir':         { es: 'Abrir el submenú', en: 'Open submenu', fr: 'Ouvrir le sous-menu', it: 'Apri il sottomenu', de: 'Untermenü öffnen', ca: 'Obre el submenú' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type ClaveUI = keyof typeof UI;

/** Devuelve el traductor para un idioma. */
export const traductor = (idioma: Idioma) => (clave: ClaveUI): string => UI[clave][idioma];
