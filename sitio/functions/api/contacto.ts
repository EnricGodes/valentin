/**
 * Endpoint del formulario de contacto. Es una Pages Function de Cloudflare:
 * se despliega con el sitio, sin servidor que mantener.
 *
 * Hace tres cosas y en este orden, porque el orden importa:
 *   1. filtra (honeypot, campos, Turnstile) antes de gastar cuota de Resend;
 *   2. envia el email a los tres buzones, y si eso falla devuelve error;
 *   3. avisa al movil. El aviso es best-effort: si WhatsApp o Telegram fallan
 *      el lead ya esta en el correo, asi que no se le dice al cliente que
 *      el envio ha fallado.
 *
 * Variables de entorno (panel de Cloudflare Pages, no en el repo):
 *   RESEND_API_KEY      obligatoria
 *   DESTINATARIOS       "info@…,olga@…,jordi@…"  — cambiarlas no requiere deploy
 *   REMITENTE           "Valentin Motors <web@valentinmotors.es>"
 *   TURNSTILE_SECRET    opcional; sin ella no se valida el captcha
 *   WHATSAPP_TOKEN + WHATSAPP_PHONE_ID + WHATSAPP_DESTINO + WHATSAPP_PLANTILLA
 *   TELEGRAM_TOKEN + TELEGRAM_CHAT     alternativa gratis a WhatsApp
 */

interface Env {
  RESEND_API_KEY: string;
  DESTINATARIOS?: string;
  REMITENTE?: string;
  TURNSTILE_SECRET?: string;
  WHATSAPP_TOKEN?: string;
  WHATSAPP_PHONE_ID?: string;
  WHATSAPP_DESTINO?: string;
  WHATSAPP_PLANTILLA?: string;
  TELEGRAM_TOKEN?: string;
  TELEGRAM_CHAT?: string;
}

const IDIOMAS = ['es', 'en', 'fr', 'it', 'de', 'ca'] as const;
type Idioma = (typeof IDIOMAS)[number];

const NOMBRE_IDIOMA: Record<Idioma, string> = {
  es: 'espanol', en: 'ingles', fr: 'frances', it: 'italiano', de: 'aleman', ca: 'catalan',
};

/** Lo que el cliente ve si llega aqui sin JavaScript. */
const GRACIAS: Record<Idioma, string> = {
  es: 'Mensaje recibido. Te contestamos en breve.',
  en: 'Message received. We will reply shortly.',
  fr: 'Message recu. Nous vous repondons sous peu.',
  it: 'Messaggio ricevuto. Le risponderemo a breve.',
  de: 'Nachricht erhalten. Wir melden uns in Kuerze.',
  ca: 'Missatge rebut. Et contestem ben aviat.',
};

/** Errores, en el idioma de la pagina: sin JavaScript es lo unico que se ve. */
type TipoError = 'malformada' | 'faltan' | 'privacidad' | 'verificacion' | 'envio' | 'origen';
const ERRORES: Record<TipoError, Record<Idioma, string>> = {
  malformada: {
    es: 'No hemos podido leer el formulario. Vuelve atrás e inténtalo de nuevo.',
    en: 'We could not read the form. Please go back and try again.',
    fr: 'Nous n’avons pas pu lire le formulaire. Revenez en arrière et réessayez.',
    it: 'Non siamo riusciti a leggere il modulo. Torni indietro e riprovi.',
    de: 'Das Formular konnte nicht gelesen werden. Bitte gehen Sie zurück und versuchen Sie es erneut.',
    ca: 'No hem pogut llegir el formulari. Torna enrere i torna-ho a provar.' },
  faltan: {
    es: 'Faltan datos obligatorios: nombre, un email válido y el mensaje. Vuelve atrás para completarlos.',
    en: 'Some required details are missing: name, a valid email and your message. Please go back and complete them.',
    fr: 'Il manque des informations obligatoires : nom, e-mail valide et message. Revenez en arrière pour les compléter.',
    it: 'Mancano dati obbligatori: nome, un’email valida e il messaggio. Torni indietro per completarli.',
    de: 'Es fehlen Pflichtangaben: Name, eine gültige E-Mail und Ihre Nachricht. Bitte gehen Sie zurück und ergänzen Sie sie.',
    ca: 'Falten dades obligatòries: nom, un correu vàlid i el missatge. Torna enrere per completar-les.' },
  privacidad: {
    es: 'Para enviar el mensaje hay que aceptar la política de privacidad. Vuelve atrás para marcarla.',
    en: 'You need to accept the privacy policy to send your message. Please go back and tick the box.',
    fr: 'Vous devez accepter la politique de confidentialité pour envoyer le message. Revenez en arrière pour cocher la case.',
    it: 'Per inviare il messaggio occorre accettare l’informativa privacy. Torni indietro per spuntarla.',
    de: 'Zum Senden müssen Sie der Datenschutzerklärung zustimmen. Bitte gehen Sie zurück und setzen Sie das Häkchen.',
    ca: 'Per enviar el missatge cal acceptar la política de privacitat. Torna enrere per marcar-la.' },
  verificacion: {
    es: 'No hemos podido verificar el envío. Vuelve atrás e inténtalo de nuevo.',
    en: 'We could not verify the submission. Please go back and try again.',
    fr: 'Nous n’avons pas pu vérifier l’envoi. Revenez en arrière et réessayez.',
    it: 'Non siamo riusciti a verificare l’invio. Torni indietro e riprovi.',
    de: 'Der Versand konnte nicht verifiziert werden. Bitte gehen Sie zurück und versuchen Sie es erneut.',
    ca: 'No hem pogut verificar l’enviament. Torna enrere i torna-ho a provar.' },
  envio: {
    es: 'No hemos podido enviar el mensaje. Escríbenos a info@valentinmotors.es o llámanos al 933 479 856.',
    en: 'We could not send your message. Please write to info@valentinmotors.es or call +34 933 479 856.',
    fr: 'Nous n’avons pas pu envoyer votre message. Écrivez-nous à info@valentinmotors.es ou appelez le +34 933 479 856.',
    it: 'Non siamo riusciti a inviare il messaggio. Ci scriva a info@valentinmotors.es o chiami il +34 933 479 856.',
    de: 'Ihre Nachricht konnte nicht gesendet werden. Schreiben Sie an info@valentinmotors.es oder rufen Sie +34 933 479 856 an.',
    ca: 'No hem pogut enviar el missatge. Escriu-nos a info@valentinmotors.es o truca’ns al 933 479 856.' },
  origen: {
    es: 'Envío no permitido.', en: 'Submission not allowed.', fr: 'Envoi non autorisé.',
    it: 'Invio non consentito.', de: 'Versand nicht erlaubt.', ca: 'Enviament no permès.' },
};

const VOLVER: Record<Idioma, string> = {
  es: 'Volver', en: 'Back', fr: 'Retour', it: 'Indietro', de: 'Zurück', ca: 'Tornar',
};

/** Valores que puede traer cada desplegable. Lo demas se descarta. */
const ASUNTOS = ['taller', 'compra', 'venta', 'restauracion', 'otro'];
const CENTROS = ['barcelona', 'madrid', ''];
const ORIGENES: Record<string, string> = {
  ims: 'Calculadora IMS', 'bore-scoring': 'Evaluador de bore scoring',
};

/** Tope del cuerpo de la peticion: el formulario mas largo no llega a 10 KB. */
const MAX_BYTES = 64 * 1024;

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const texto = (v: FormDataEntryValue | null, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/** Campo de una linea: sin saltos ni caracteres de control. Van al asunto del
 *  correo, y un salto de linea ahi es una inyeccion de cabeceras. */
const linea = (v: FormDataEntryValue | null, max: number) =>
  texto(v, max).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();

/** Suficiente para descartar basura; la validacion real es que el email rebote. */
const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

async function turnstileOk(env: Env, token: string, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true; // sin configurar: no se bloquea a nadie
  const cuerpo = new FormData();
  cuerpo.append('secret', env.TURNSTILE_SECRET);
  cuerpo.append('response', token);
  if (ip) cuerpo.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: cuerpo });
    return ((await r.json()) as { success: boolean }).success === true;
  } catch {
    return true; // si Cloudflare no responde, no se pierde el lead
  }
}

async function avisarMovil(env: Env, resumen: string): Promise<void> {
  const intentos: Promise<unknown>[] = [];

  if (env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_ID && env.WHATSAPP_DESTINO) {
    intentos.push(fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
                 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: env.WHATSAPP_DESTINO,
        type: 'template',
        template: {
          name: env.WHATSAPP_PLANTILLA ?? 'nuevo_lead_web',
          language: { code: 'es' },
          components: [{ type: 'body', parameters: [{ type: 'text', text: resumen }] }],
        },
      }),
    }));
  }

  if (env.TELEGRAM_TOKEN && env.TELEGRAM_CHAT) {
    intentos.push(fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT, text: `Nuevo lead web\n${resumen}` }),
    }));
  }

  await Promise.allSettled(intentos);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const quiereJson = (request.headers.get('Accept') ?? '').includes('application/json');
  let volverA = '/';
  const responder = (estado: number, idioma: Idioma, mensaje: string) =>
    quiereJson
      ? new Response(JSON.stringify({ ok: estado < 400, mensaje }),
          { status: estado, headers: { 'Content-Type': 'application/json' } })
      : new Response(
          `<!doctype html><html lang="${idioma}"><meta charset="utf-8">` +
          `<title>Valentin Motors</title>` +
          `<body style="background:#0B0B0B;color:#F0EDE8;font:17px/1.6 system-ui;` +
          `display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px">` +
          `<div><p>${escapar(mensaje)}</p><p><a href="${escapar(volverA)}" style="color:#B28A5B">` +
          `${VOLVER[idioma]}</a></p></div>`,
          { status: estado, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  /* Solo se aceptan envios desde el propio sitio. Sin CORS otro dominio no
     puede leer la respuesta, pero si podria hacer el POST y usar el formulario
     como lanzadera de spam hacia los buzones de la casa. */
  const origen = request.headers.get('Origin');
  const sitio = request.headers.get('Sec-Fetch-Site');
  if ((origen && new URL(origen).host !== new URL(request.url).host) ||
      (sitio && sitio !== 'same-origin' && sitio !== 'none')) {
    return responder(403, 'es', ERRORES.origen.es);
  }

  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BYTES) {
    return responder(413, 'es', ERRORES.malformada.es);
  }

  let datos: FormData;
  try {
    datos = await request.formData();
  } catch {
    return responder(400, 'es', ERRORES.malformada.es);
  }

  const idiomaCrudo = texto(datos.get('idioma'), 2);
  const idioma = (IDIOMAS as readonly string[]).includes(idiomaCrudo)
    ? (idiomaCrudo as Idioma) : 'es';
  const pagina = linea(datos.get('pagina'), 300);
  if (pagina.startsWith('/') && !pagina.startsWith('//')) volverA = pagina;

  // 1. Filtros. El honeypot devuelve 200: un bot que ve un error reintenta.
  if (texto(datos.get('web'), 200)) return responder(200, idioma, GRACIAS[idioma]);

  const nombre  = linea(datos.get('nombre'), 120);
  const email   = linea(datos.get('email'), 180);
  const mensaje = texto(datos.get('mensaje'), 4000);
  if (!nombre || !emailValido(email) || !mensaje) {
    return responder(400, idioma, ERRORES.faltan[idioma]);
  }
  if (datos.get('rgpd') !== 'si') {
    return responder(400, idioma, ERRORES.privacidad[idioma]);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const token = texto(datos.get('cf-turnstile-response'), 4000);
  if (!(await turnstileOk(env, token, ip))) {
    return responder(400, idioma, ERRORES.verificacion[idioma]);
  }

  const telefono = linea(datos.get('telefono'), 40);
  const asuntoCrudo = linea(datos.get('asunto'), 40);
  const asunto   = ASUNTOS.includes(asuntoCrudo) ? asuntoCrudo : 'otro';
  const modelo   = linea(datos.get('modelo'), 120);
  const centroCrudo = linea(datos.get('centro'), 20);
  const centro   = CENTROS.includes(centroCrudo) ? centroCrudo : '';
  const coche    = linea(datos.get('coche'), 120);
  /* De que herramienta viene el contacto (calculadora IMS, bore scoring). */
  const origenLead = ORIGENES[linea(datos.get('origen'), 40)] ?? '';
  /* Un aviso de demanda: el cliente busca algo que hoy no hay en stock
     ("Porsche 997"). Es el dato que mas vale de todo el formulario, asi que
     va en el asunto del correo, antes que el nombre, y encabeza la tabla. */
  const busca    = linea(datos.get('busca'), 120);

  // 2. Email. Es el paso que no puede fallar en silencio.
  const filas: [string, string][] = [
    ...(busca ? [['BUSCA', busca] as [string, string]] : []),
    ['Nombre', nombre], ['Email', email], ['Telefono', telefono || '—'],
    ['Motivo', asunto], ['Su Porsche', modelo || '—'],
    ['Centro', centro || 'sin preferencia'],
    ['Idioma', `${NOMBRE_IDIOMA[idioma]} — contestar en este idioma`],
    ['Coche de la ficha', coche || '—'],
    ...(origenLead ? [['Viene de', origenLead] as [string, string]] : []),
    ['Pagina', pagina || '—'],
  ];

  const html =
    `<div style="font:15px/1.6 -apple-system,system-ui,sans-serif;color:#111">` +
    `<h2 style="font-weight:600;margin:0 0 4px">${escapar(nombre)}</h2>` +
    `<p style="margin:0 0 20px;color:#666">${escapar(asunto)}` +
    (busca ? ` · busca <strong>${escapar(busca)}</strong>` : '') +
    (coche ? ` · ${escapar(coche)}` : '') + `</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">` +
    filas.map(([k, v]) =>
      `<tr><td style="padding:5px 20px 5px 0;color:#888;white-space:nowrap">${k}</td>` +
      `<td style="padding:5px 0">${escapar(v)}</td></tr>`).join('') +
    `</table>` +
    `<div style="border-left:3px solid #B28A5B;padding-left:16px;white-space:pre-wrap">` +
    `${escapar(mensaje)}</div></div>`;

  const destinatarios = (env.DESTINATARIOS ??
    'info@valentinmotors.es,olga@valentinmotors.es,jordi@valentinmotors.es')
    .split(',').map((d) => d.trim()).filter(Boolean);

  if (!env.RESEND_API_KEY) {
    console.error('contacto: falta RESEND_API_KEY');
    return responder(502, idioma, ERRORES.envio[idioma]);
  }

  const envio = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`,
               'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.REMITENTE ?? 'Valentin Motors <web@valentinmotors.es>',
      to: destinatarios,
      reply_to: email,
      subject: busca
        ? `Web · BUSCA ${busca} · ${nombre}`
        : `Web · ${asunto}${coche ? ` · ${coche}` : ''} · ${nombre}`,
      html,
    }),
  });

  if (!envio.ok) {
    console.error('resend', envio.status, await envio.text());
    return responder(502, idioma, ERRORES.envio[idioma]);
  }

  // 3. Aviso al movil, sin bloquear la respuesta al cliente.
  const resumen = [busca && `BUSCA ${busca}`, nombre, telefono || email, asunto,
                   coche || modelo, NOMBRE_IDIOMA[idioma]].filter(Boolean).join(' · ');
  waitUntil(avisarMovil(env, resumen));

  return responder(200, idioma, GRACIAS[idioma]);
};

/** Un GET a /api/contacto no es un error del usuario: se le manda al formulario. */
export const onRequestGet: PagesFunction<Env> = ({ request }) =>
  Response.redirect(new URL('/contacto', request.url).href, 303);

/** HEAD, igual que GET: UptimeRobot vigila esta URL con HEAD y sin esto Pages
 *  contesta 404, que el monitor toma por caida. */
export const onRequestHead = onRequestGet;
