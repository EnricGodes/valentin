/**
 * Detección del idioma del navegador.
 *
 * Manda al visitante a la versión de la página en su idioma la primera vez que
 * llega, y solo la primera. Es una Pages Function de Cloudflare: se despliega
 * con el sitio y corre en el borde, antes de servir el HTML.
 *
 * Redirigir por idioma es fácil de hacer mal y caro de arreglar, así que hay
 * cinco reglas que no se pueden saltar:
 *
 *  1. SOLO en rutas sin prefijo de idioma. Quien pide /en/porsche-workshop ya
 *     ha elegido, y volver a decidir por él es quitarle el control.
 *  2. LA COOKIE MANDA. Si existe `idioma`, se respeta y no se redirige. El
 *     selector del pie la escribe al elegir, así que una decisión explícita
 *     gana siempre y no se repite la redirección en cada visita.
 *  3. LOS BOTS NO SE REDIRIGEN. Googlebot rastrea desde Estados Unidos con
 *     `Accept-Language: en`. Si se le redirige, solo indexa el inglés y las
 *     otras cinco versiones desaparecen de Google. Es el error que mata el
 *     trabajo multiidioma entero.
 *  4. 302, NUNCA 301. La redirección depende de quién pide, no del recurso.
 *     Un 301 se cachea en el navegador y deja al visitante encerrado en un
 *     idioma para siempre, sin forma de volver.
 *  5. `Vary: Accept-Language` SIEMPRE. Sin esa cabecera, la CDN cachea la
 *     primera respuesta y se la sirve a todo el mundo: el primer visitante
 *     alemán deja en alemán a los siguientes. No se ve hasta producción.
 *
 * Y solo se redirige a un idioma que EXISTA para esa página: el mapa lo genera
 * `scripts/generar-mapa-idiomas.ts` en cada build, con las traducciones
 * realmente publicadas.
 */
import mapa from './mapa-idiomas.json' with { type: 'json' };

const IDIOMAS = ['en', 'fr', 'it', 'de', 'ca'] as const;
type Idioma = (typeof IDIOMAS)[number];

/** Un prefijo de idioma al principio de la ruta significa elección explícita. */
const YA_TIENE_IDIOMA = /^\/(en|fr|it|de|ca)(\/|$)/;

/* Buscadores y agentes de IA. La lista no tiene que ser exhaustiva: lo que no
   se reconozca como bot y venga con Accept-Language se tratará como persona,
   y una persona redirigida no rompe nada. Lo que sí rompe es redirigir a
   Googlebot, y Googlebot está aquí. */
const BOT = /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|gptbot|claudebot|perplexity|ccbot|applebot|duckduck|yandex|baidu|semrush|ahrefs|lighthouse|headless/i;

/** El idioma preferido del navegador, entre los que tenemos. */
function idiomaPreferido(cabecera: string | null): Idioma | null {
  if (!cabecera) return null;
  const candidatos = cabecera
    .split(',')
    .map((parte) => {
      const [etiqueta, ...params] = parte.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { etiqueta: etiqueta.trim().toLowerCase(), q: q ? Number(q.split('=')[1]) : 1 };
    })
    .filter((c) => c.etiqueta && !Number.isNaN(c.q))
    .sort((a, b) => b.q - a.q);

  for (const { etiqueta } of candidatos) {
    // "es-419", "es-ES" y "es" son español: el visitante ya está en su idioma.
    const base = etiqueta.split('-')[0];
    if (base === 'es' || etiqueta === '*') return null;
    if ((IDIOMAS as readonly string[]).includes(base)) return base as Idioma;
  }
  return null;
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  const responder = async () => {
    const res = await next();
    /* Se marca SIEMPRE, también cuando no se redirige: si no, la CDN podría
       guardar esta respuesta y servírsela a un visitante de otro idioma. */
    const copia = new Response(res.body, res);
    copia.headers.append('Vary', 'Accept-Language, Cookie');
    return copia;
  };

  // Solo documentos: ni imágenes, ni el endpoint del formulario, ni assets.
  const esDocumento = request.method === 'GET' &&
    (request.headers.get('accept') ?? '').includes('text/html');
  if (!esDocumento || YA_TIENE_IDIOMA.test(url.pathname)) return responder();
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/img/')) return responder();

  // Regla 2: una elección explícita no se discute.
  if ((request.headers.get('cookie') ?? '').includes('idioma=')) return responder();

  // Regla 3: los buscadores ven siempre el castellano, que es el x-default.
  if (BOT.test(request.headers.get('user-agent') ?? '')) return responder();

  const idioma = idiomaPreferido(request.headers.get('accept-language'));
  if (!idioma) return responder();

  const ruta = url.pathname.replace(/\/$/, '') || '/';
  const destino = (mapa as Record<string, Record<string, string>>)[ruta]?.[idioma];
  if (!destino) return responder();   // esa página no existe en su idioma

  // Regla 4: 302, y con Vary, porque la respuesta depende de quién pregunta.
  return new Response(null, {
    status: 302,
    headers: {
      Location: destino + url.search,
      'Vary': 'Accept-Language, Cookie',
      'Cache-Control': 'no-store',
    },
  });
};
