/**
 * Comprobacion del middleware de idioma.
 *
 * Las cinco reglas del middleware no se pueden verificar mirando el codigo: o
 * se prueban con peticiones reales, o se descubre en produccion que Googlebot
 * lleva tres semanas viendo solo la version inglesa.
 *
 *   node scripts/probar-middleware.mjs
 */
import { onRequest } from '../functions/_middleware.ts';

const next = async () =>
  new Response('<html>ok</html>', { headers: { 'content-type': 'text/html' } });

const pide = (ruta, cabeceras = {}) =>
  onRequest({
    request: new Request('https://www.valentinmotors.es' + ruta, {
      headers: { accept: 'text/html', ...cabeceras },
    }),
    next,
  });

const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

// nombre, ruta, cabeceras, estado esperado, destino esperado
const CASOS = [
  ['navegador aleman en la home', '/', { 'accept-language': 'de-DE,de;q=0.9' }, 302, '/de'],
  ['navegador aleman en el taller', '/taller-porsche', { 'accept-language': 'de-DE,de;q=0.9' }, 302, '/de/porsche-werkstatt'],
  ['navegador espanol', '/taller-porsche', { 'accept-language': 'es-ES,es;q=0.9' }, 200, null],
  ['espanol de Mexico', '/taller-porsche', { 'accept-language': 'es-419,es;q=0.9' }, 200, null],
  ['con cookie puesta manda la cookie', '/taller-porsche', { 'accept-language': 'de-DE', cookie: 'idioma=es' }, 200, null],
  ['Googlebot ve siempre el castellano', '/taller-porsche', { 'accept-language': 'en-US', 'user-agent': GOOGLEBOT }, 200, null],
  ['una URL con idioma no se toca', '/en/porsche-workshop', { 'accept-language': 'en-US' }, 200, null],
  ['pagina sin traducir no redirige', '/storage-porsche', { 'accept-language': 'de-DE' }, 200, null],
  ['articulo del Magazine', '/magazine/que-es-el-ims-de-porsche', { 'accept-language': 'fr-FR' }, 302, '/fr/magazine/que-es-el-ims-de-porsche'],
  ['idioma que no tenemos', '/taller-porsche', { 'accept-language': 'ja-JP,ja;q=0.9' }, 200, null],
  ['respeta la q del Accept-Language', '/taller-porsche', { 'accept-language': 'de;q=0.5,en;q=0.9' }, 302, '/en/porsche-workshop'],
  ['sin Accept-Language', '/taller-porsche', {}, 200, null],
];

let fallos = 0;
for (const [nombre, ruta, cab, estado, destino] of CASOS) {
  const res = await pide(ruta, cab);
  const loc = res.headers.get('location');
  const vary = (res.headers.get('vary') ?? '').toLowerCase();
  const bien = res.status === estado && (destino === null || loc === destino);
  // Regla 5: la cabecera va en TODAS, redirija o no.
  const conVary = vary.includes('accept-language');
  if (!bien || !conVary) fallos++;
  console.log(`${bien && conVary ? '  ok ' : 'FALLA'} ${nombre.padEnd(38)} ${res.status}${loc ? ' ' + loc : ''}${conVary ? '' : '  [le falta Vary]'}`);
}

console.log(fallos === 0
  ? `\nmiddleware de idioma: ${CASOS.length} comprobaciones, todas pasan`
  : `\nmiddleware de idioma: ${fallos} de ${CASOS.length} fallan`);
process.exit(fallos === 0 ? 0 : 1);
