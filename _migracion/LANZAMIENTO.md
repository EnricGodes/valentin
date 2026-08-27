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

## 2. Token de Cloudflare Web Analytics

Al crear el proyecto en Cloudflare Pages se genera un token de Web Analytics.
Ponerlo en la variable de entorno `PUBLIC_CF_BEACON` del proyecto. Sin token, el
componente no emite nada y el sitio funciona igual: solo se pierde la medición
sin cookies.

## 3. Search Console

- Reenviar `https://www.valentinmotors.es/sitemap-index.xml`.
- Añadir las cinco propiedades de carpeta (`/en/`, `/fr/`, `/de/`, `/it/`,
  `/ca/`) para poder leer el rendimiento por mercado.
- Inspeccionar a mano las diez páginas con más clics.

## 4. Vigilancia

Comparar semanalmente contra la línea base de `_migracion/baseline/`:
3.390 clics orgánicos y 76.000 impresiones en tres meses, CTR 4,5%, posición
media 9,5.

**Umbral de alarma:** caída superior al 15% de clics orgánicos sostenida siete
días. Squarespace no se cancela hasta pasadas cuatro semanas de vigilancia: es
la única vuelta atrás.

## 5. Datos que faltan de Valentín

- Las fichas de los cinco coches vendidos irrecuperables. Ver el campo
  `pendiente` de `sitio/src/datos/vendidos.json`.
- Cuenta de Meta Business verificada y número remitente, para el aviso a
  WhatsApp del formulario. La alternativa sin verificación es Telegram.
- Confirmar si "Porsche · KAAN" del 356 debería decir Karmann.
