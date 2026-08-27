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

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const texto = (v: FormDataEntryValue | null, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

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
  const responder = (estado: number, idioma: Idioma, mensaje: string) =>
    quiereJson
      ? new Response(JSON.stringify({ ok: estado < 400, mensaje }),
          { status: estado, headers: { 'Content-Type': 'application/json' } })
      : new Response(
          `<!doctype html><html lang="${idioma}"><meta charset="utf-8">` +
          `<title>Valentin Motors</title>` +
          `<body style="background:#0B0B0B;color:#F0EDE8;font:17px/1.6 system-ui;` +
          `display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px">` +
          `<div><p>${escapar(mensaje)}</p><p><a href="/" style="color:#B28A5B">valentinmotors.es</a></p></div>`,
          { status: estado, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  let datos: FormData;
  try {
    datos = await request.formData();
  } catch {
    return responder(400, 'es', 'Peticion mal formada.');
  }

  const idiomaCrudo = texto(datos.get('idioma'), 2);
  const idioma = (IDIOMAS as readonly string[]).includes(idiomaCrudo)
    ? (idiomaCrudo as Idioma) : 'es';

  // 1. Filtros. El honeypot devuelve 200: un bot que ve un error reintenta.
  if (texto(datos.get('web'), 200)) return responder(200, idioma, GRACIAS[idioma]);

  const nombre  = texto(datos.get('nombre'), 120);
  const email   = texto(datos.get('email'), 180);
  const mensaje = texto(datos.get('mensaje'), 4000);
  if (!nombre || !emailValido(email) || !mensaje) {
    return responder(400, idioma, 'Faltan datos obligatorios.');
  }
  if (datos.get('rgpd') !== 'si') {
    return responder(400, idioma, 'Falta aceptar la politica de privacidad.');
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const token = texto(datos.get('cf-turnstile-response'), 4000);
  if (!(await turnstileOk(env, token, ip))) {
    return responder(400, idioma, 'No hemos podido verificar el envio.');
  }

  const telefono = texto(datos.get('telefono'), 40);
  const asunto   = texto(datos.get('asunto'), 40) || 'otro';
  const modelo   = texto(datos.get('modelo'), 120);
  const centro   = texto(datos.get('centro'), 20);
  const coche    = texto(datos.get('coche'), 120);
  const pagina   = texto(datos.get('pagina'), 300);

  // 2. Email. Es el paso que no puede fallar en silencio.
  const filas: [string, string][] = [
    ['Nombre', nombre], ['Email', email], ['Telefono', telefono || '—'],
    ['Motivo', asunto], ['Su Porsche', modelo || '—'],
    ['Centro', centro || 'sin preferencia'],
    ['Idioma', `${NOMBRE_IDIOMA[idioma]} — contestar en este idioma`],
    ['Coche de la ficha', coche || '—'],
    ['Pagina', pagina || '—'],
  ];

  const html =
    `<div style="font:15px/1.6 -apple-system,system-ui,sans-serif;color:#111">` +
    `<h2 style="font-weight:600;margin:0 0 4px">${escapar(nombre)}</h2>` +
    `<p style="margin:0 0 20px;color:#666">${escapar(asunto)}` +
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

  const envio = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`,
               'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.REMITENTE ?? 'Valentin Motors <web@valentinmotors.es>',
      to: destinatarios,
      reply_to: email,
      subject: `Web · ${asunto}${coche ? ` · ${coche}` : ''} · ${nombre}`,
      html,
    }),
  });

  if (!envio.ok) {
    console.error('resend', envio.status, await envio.text());
    return responder(502, idioma, 'No hemos podido enviar el mensaje.');
  }

  // 3. Aviso al movil, sin bloquear la respuesta al cliente.
  const resumen = [nombre, telefono || email, asunto, coche || modelo,
                   NOMBRE_IDIOMA[idioma]].filter(Boolean).join(' · ');
  waitUntil(avisarMovil(env, resumen));

  return responder(200, idioma, GRACIAS[idioma]);
};

/** Un GET a /api/contacto no es un error del usuario: se le manda al formulario. */
export const onRequestGet: PagesFunction<Env> = () =>
  Response.redirect('https://www.valentinmotors.es/contacto', 303);
