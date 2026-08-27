# Checklist de lanzamiento

Lo que solo se puede hacer con el sitio ya publicado, y por tanto no está hecho.

## 1. Marcar los key events en GA4

**No se puede hacer antes.** GA4 solo deja marcar un evento como key event
cuando ya lo ha recibido al menos una vez, y estos eventos aún no existen en la
propiedad porque el sitio no está en producción. Se comprobó en el panel:
`Admin → Data display → Events` solo ofrece "Customised events" y
"Modifications", no crear un key event por nombre.

Con el sitio ya en producción y tráfico real:

1. Entrar en la propiedad **Valentin Motors website** (`G-7BXF6VQQMP`).
2. `Admin → Data display → Events → Recent events`.
3. Marcar la estrella en estos seis:

   | Evento | Qué mide |
   |---|---|
   | `generate_lead` | Envío del formulario de contacto |
   | `solicitar_info_coche` | CTA desde la ficha de un coche |
   | `click_telefono` | Clic en un teléfono |
   | `click_email` | Clic en un email |
   | `click_whatsapp` | Clic en WhatsApp |
   | `ver_ficha_coche` | Entrada a una ficha desde el catálogo |

4. Registrar como **dimensiones personalizadas** (`Custom definitions`), o los
   informes no podrán segmentar por ellas:

   | Parámetro | Ámbito | Para qué |
   |---|---|---|
   | `coche` | Evento | Saber **qué coche** genera cada contacto |
   | `tipo_pagina` | Evento | Ficha, servicio, centro, artículo |
   | `idioma` | Evento | Qué mercado convierte |
   | `ruta` | Evento | Página exacta de origen |

`ficha_coche_leida` (30 segundos sobre una ficha) no debería ser key event: es
una señal de interés, no una conversión.

## 2. Formulario de contacto

El endpoint es `functions/api/contacto.ts`, una Pages Function que se despliega
con el sitio. Al crear el proyecto en Cloudflare Pages hay que poner **Root
directory: `sitio`**, o Cloudflare no encontrará ni `functions/` ni `dist/`.

Variables de entorno del proyecto (Settings → Environment variables). Las tres
primeras son las únicas obligatorias:

| Variable | Valor | Obligatoria |
|---|---|---|
| `RESEND_API_KEY` | clave de resend.com | sí |
| `DESTINATARIOS` | `info@valentinmotors.es,olga@valentinmotors.es,jordi@valentinmotors.es` | no, ese es el valor por defecto |
| `REMITENTE` | `Valentín Motors <web@valentinmotors.es>` | no |
| `TURNSTILE_SECRET` | secreto del widget | no |
| `PUBLIC_TURNSTILE_KEY` | clave pública del widget (build) | no |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_DESTINO`, `WHATSAPP_PLANTILLA` | Meta Cloud API | no |
| `TELEGRAM_TOKEN`, `TELEGRAM_CHAT` | alternativa gratuita al WhatsApp | no |

Los destinatarios están en variable de entorno a propósito: cambiar a quién
llegan los leads no debe requerir un deploy.

### Lo que hay que dar de alta antes

1. **Resend**: crear cuenta, verificar `valentinmotors.es` por DNS (tres
   registros: SPF, DKIM y el de retorno). Con el DNS ya en Cloudflare son cinco
   minutos. Plan gratuito: 3.000 correos al mes, de sobra.
2. **Turnstile**: crear el widget en el panel de Cloudflare, modo *Managed*.
   Sin él el formulario sigue funcionando y el honeypot filtra la mayor parte
   del spam, pero conviene tenerlo.
3. **WhatsApp**: la Cloud API de Meta exige cuenta de Meta Business verificada,
   un número remitente dedicado y una plantilla de utilidad aprobada (un solo
   parámetro de cuerpo, que recibe el resumen del lead). La verificación tarda
   días. **Si no quieres pasar por ahí, Telegram funciona igual de bien, es
   instantáneo y gratis**: crear un bot con @BotFather, añadirlo a un grupo con
   Olga y Jordi, y poner el token y el id del grupo. La Function admite las dos
   a la vez o ninguna.

### Comprobación antes de abrir al público

- Enviar un mensaje de prueba **desde cada idioma** y confirmar que llega a los
  tres buzones, que el `Reply-To` es el del cliente y que el correo indica en
  qué idioma hay que contestar.
- Probar con JavaScript desactivado: el `<form>` tiene `action` y `method`, así
  que debe hacer el POST y devolver una página de gracias.
- Confirmar en GA4 que el evento `generate_lead` entra tras un envío correcto.

## 3. Token de Cloudflare Web Analytics

Al crear el proyecto en Cloudflare Pages se genera un token de Web Analytics.
Ponerlo en la variable de entorno `PUBLIC_CF_BEACON` del proyecto. Sin token, el
componente no emite nada y el sitio funciona igual: solo se pierde la medición
sin cookies.

## 4. Search Console

- Reenviar `https://www.valentinmotors.es/sitemap-index.xml`.
- Añadir las cinco propiedades de carpeta (`/en/`, `/fr/`, `/de/`, `/it/`,
  `/ca/`) para poder leer el rendimiento por mercado.
- Inspeccionar a mano las diez páginas con más clics.

## 5. Vigilancia

Comparar semanalmente contra la línea base de `_migracion/baseline/`:
3.390 clics orgánicos y 76.000 impresiones en tres meses, CTR 4,5%, posición
media 9,5.

**Umbral de alarma:** caída superior al 15% de clics orgánicos sostenida siete
días. Squarespace no se cancela hasta pasadas cuatro semanas de vigilancia: es
la única vuelta atrás.

## 6. Datos que faltan de Valentín

- Las fichas de los cinco coches vendidos irrecuperables. Ver el campo
  `pendiente` de `sitio/src/datos/vendidos.json`.
- Cuenta de Meta Business verificada y número remitente, para el aviso a
  WhatsApp del formulario. La alternativa sin verificación es Telegram.
- Confirmar si "Porsche · KAAN" del 356 debería decir Karmann.
