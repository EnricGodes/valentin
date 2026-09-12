/**
 * Devuelve a src/datos/paginas la tanda de ampliacion de los servicios.
 *
 *   npm run servicios:importar -- [--dir=revision-servicios/<carpeta>] [--probar]
 *
 * Es el par de exportar-servicios.ts. Aquel saca la pagina entera con `actual`
 * de solo lectura y `nuevo` vacio; esto coge `nuevo` y lo escribe.
 *
 * Valida ANTES de tocar un solo fichero: o entra la tanda entera o no entra
 * nada. Un import a medias deja el sitio con nueve paginas nuevas y diez
 * viejas contradiciendose, y eso es peor que no haber importado.
 *
 * Lo que comprueba, y por que:
 *
 *   - Que `actual` siga siendo lo que hay publicado. Si no, el fichero se
 *     exporto hace tiempo, alguien ha tocado la pagina despues y aplicar seria
 *     pisarle el cambio.
 *   - Que los `href` internos existan en el manifiesto de rutas. Un enlace a
 *     una URL que no existe rompe el build, y romperlo aqui es mas barato.
 *   - Que el HTML de los parrafos sea solo <a>, <strong> y <em>. Los `items`
 *     se escapan al pintarse: con HTML dentro se veria el codigo.
 *   - Que los indices de imagen existan y no se repitan. Una foto pintada dos
 *     veces en la misma pagina es un error que nadie mira dos veces.
 *   - Que no queden marcadores `[[COMPROBAR: ...]]`. Son preguntas al taller,
 *     no texto publicable.
 *   - Las reglas de tono del castellano que ya comprueba el build, aqui
 *     tambien: sin guion largo y con `Valentín Motors` con tilde en prosa.
 *
 * Las traducciones entran por el mismo camino, cada una a su `<fichero>.<idioma>.json`,
 * y se les calcula la cobertura para que `idiomasDe()` sepa si la pagina esta
 * entera. Aqui siempre lo esta: la entrega trae las 19 completas.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUTAS, url } from '../src/i18n/routes.ts';
import { IDIOMAS, POR_DEFECTO, type Idioma } from '../src/i18n/config.ts';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');

const probar = process.argv.includes('--probar');
/* La guarda de desfase protege las ediciones a mano sobre una pagina. Una
   segunda tanda escrita sobre el MISMO export original la dispara sin que haya
   nada que proteger: `actual` sigue siendo el texto de partida y la pagina ya
   lleva la primera vuelta. Para ese caso, y solo dicho a proposito, se puede
   pasar por encima; la lista de lo que se sobrescribe se imprime siempre. */
const sobrescribir = process.argv.includes('--sobrescribir');
const dirArg = process.argv.find((a) => a.startsWith('--dir='))?.split('=')[1];

interface SeccionEntrada {
  nivel: number; titulo: string; parrafos: string[]; items: string[];
  /* La tanda de traduccion no lo trae: copia `actual`, que no lleva
     colocacion, y se hereda de la pagina publicada. Ver colocacionPublicada. */
  imagenes?: number[];
}
interface Nuevo {
  meta: { titulo: string; descripcion: string };
  h1: string; menu: string;
  /* `url` solo lo traen las fotos que NO estaban en el catalogo del export.
     Es como se anade una foto nueva a una pagina: la segunda tanda necesito
     tres del Magazine para sus casos documentados y no habia forma de
     pedirlas. Ver servicios-leeme.md. */
  imagenes: { i: number; alt: string; url?: string }[];
  secciones: SeccionEntrada[];
}
interface PaginaEntrada {
  rutaId: string; fichero: string; url: string;
  imagenes: { i: number; url: string; alt: string }[];
  articulos: string[];
  actual: {
    meta: { titulo: string; descripcion: string }; h1: string; menu: string;
    secciones: { nivel: number; titulo: string; parrafos: string[]; items: string[] }[];
  };
  nuevo: Nuevo;
}

// ── Localizar la tanda ─────────────────────────────────────────────────────
function carpeta(): string {
  if (dirArg) return join(raiz, dirArg);
  const base = join(raiz, 'revision-servicios');
  if (!existsSync(base)) fallar('no hay carpeta revision-servicios/');

  /* La entrega puede venir suelta en revision-servicios/ o dentro de su propia
     carpeta, y ahi suele convivir con el export original, que tiene el mismo
     nombre y `nuevo` vacio. Adivinar cual de los dos se quiere es como acabar
     importando el fichero en blanco: si hay mas de uno, se pregunta. */
  const candidatos = [
    ...(existsSync(join(base, 'servicios-es.json')) ? [base] : []),
    ...readdirSync(base, { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(base, e.name, 'servicios-es.json')))
      .map((e) => join(base, e.name)),
  ];
  if (candidatos.length === 1) return candidatos[0];
  if (candidatos.length === 0) fallar('no se encuentra ningun servicios-es.json en revision-servicios/');
  console.error('servicios: hay varias tandas. Elige una con --dir=');
  for (const c of candidatos) console.error(`  --dir=${c.replace(`${raiz}/`, '')}`);
  process.exit(1);
}

function fallar(mensaje: string): never {
  console.error(`servicios: ${mensaje}`);
  process.exit(1);
}

// ── Comprobaciones ─────────────────────────────────────────────────────────
/**
 * Lo que se puede enlazar: las paginas del manifiesto y los articulos del
 * Magazine.
 *
 * Los articulos faltaban. El fichero de export ofrece los 57 en
 * `referencia.magazine` y la guia invita a proponerlos, asi que la segunda
 * tanda enlazo nueve casos reales, y esto los rechazaba todos. Un enlace a un
 * articulo publicado es tan interno como cualquier otro, y ademas es lo que
 * convierte una pagina de servicio en algo que se puede leer.
 */
const URLS_VALIDAS = (() => {
  const salida = new Set(RUTAS.map((r) => url(r.id, 'es')));
  const dir = join(raiz, 'src/content/magazine/es');
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const crudo = readFileSync(join(dir, f), 'utf8');
      const slug = /^slugFinal:\s*"(.*)"$/m.exec(crudo)?.[1] ?? f.replace(/\.md$/, '');
      salida.add(`${url('magazine', 'es')}/${slug}`);
    }
  }
  return salida;
})();
const TAGS = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
const PERMITIDAS = new Set(['a', 'strong', 'em']);

const texto = (n: Nuevo) => [
  n.meta.titulo, n.meta.descripcion, n.h1, n.menu,
  ...n.imagenes.map((im) => im.alt),
  ...n.secciones.flatMap((s) => [s.titulo, ...s.parrafos, ...s.items]),
].join(' ');

function revisaPagina(p: PaginaEntrada, idioma: Idioma, fallos: string[]) {
  const donde = `${idioma}/${p.rutaId}`;
  const n = p.nuevo;

  if (!n.h1?.trim()) fallos.push(`${donde}: falta el h1`);
  if (!n.meta.titulo?.trim()) fallos.push(`${donde}: falta el title`);
  if (!n.meta.descripcion?.trim()) fallos.push(`${donde}: falta la description`);
  if (!n.secciones?.length) fallos.push(`${donde}: sin secciones`);

  const catalogo = new Set([
    ...p.imagenes.map((im) => im.i),
    ...n.imagenes.filter((im) => im.url).map((im) => im.i),
  ]);
  const usados: number[] = [];

  for (const [i, s] of n.secciones.entries()) {
    if (s.nivel !== 2 && s.nivel !== 3) {
      fallos.push(`${donde}: seccion ${i} con nivel ${s.nivel}; el h1 va en nuevo.h1`);
    }
    for (const par of s.parrafos) {
      for (const m of par.matchAll(TAGS)) {
        if (!PERMITIDAS.has(m[1].toLowerCase())) {
          fallos.push(`${donde}: <${m[1]}> en un parrafo; solo <a>, <strong> y <em>`);
        }
      }
      for (const h of par.matchAll(/href="([^"]+)"/g)) {
        const destino = h[1];
        if (destino.startsWith('/') && !URLS_VALIDAS.has(destino)) {
          fallos.push(`${donde}: enlace a ${destino}, que no esta en el manifiesto`);
        }
      }
    }
    for (const it of s.items) {
      if (/<[a-zA-Z/]/.test(it)) fallos.push(`${donde}: HTML en un item; se escapa al pintarlo`);
    }
    usados.push(...imagenesDe(p, s, i));
  }

  for (const i of usados) {
    if (!catalogo.has(i)) fallos.push(`${donde}: imagen ${i}, que no existe en esta pagina`);
  }
  const repes = usados.filter((x, i) => usados.indexOf(x) !== i);
  if (repes.length) fallos.push(`${donde}: imagen ${[...new Set(repes)].join(', ')} repetida`);

  /* Una foto que la tanda anade tiene que llegar descrita, del mapa de alts o
     de la propia tanda. Sin eso entra con alt vacio y no lo canta nadie: es
     como se colo una en la segunda vuelta. */
  for (const im of n.imagenes) {
    if (!im.url) continue;
    if (!ALTS[im.url]?.[idioma] && !im.alt?.trim()) {
      fallos.push(`${donde}: la foto ${im.url} entra sin descripcion. `
        + 'Descríbela en _migracion/contenido/alts.json.');
    }
  }

  const t = texto(n);
  if (t.includes('[[COMPROBAR')) fallos.push(`${donde}: queda un [[COMPROBAR: ...]] sin resolver`);
  if (!t.trim()) fallos.push(`${donde}: nuevo vacio`);
  if (idioma === POR_DEFECTO) {
    if (t.includes('—')) fallos.push(`${donde}: guion largo, que no se usa en castellano`);
    if (/\bValentin Motors\b/.test(t)) fallos.push(`${donde}: "Valentin Motors" sin tilde en prosa`);
  }
}

/**
 * Donde va cada foto cuando la tanda no lo dice.
 *
 * El export de traduccion saca `actual` sin `imagenes` por seccion, y el LEEME
 * pide que `nuevo` copie esa estructura tal cual: la entrega de los seis
 * idiomas llego sin colocacion y el importador se cayo en la primera pagina.
 * Colocar fotos no es traducir. Las 38 ya estan puestas en el castellano
 * publicado y van en el mismo sitio en los seis idiomas, asi que se leen de
 * ahi, numeradas como las numera el exportador: en orden de aparicion.
 * Una tanda que si trae `imagenes` manda sobre esto.
 */
const colocacionPublicada = (() => {
  const cache = new Map<string, number[][]>();
  return (p: PaginaEntrada): number[][] => {
    let col = cache.get(p.fichero);
    if (!col) {
      const ruta = join(raiz, p.fichero);
      const hoy = existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : { secciones: [] };
      let k = 0;
      col = hoy.secciones.map((s: { imagenes?: unknown[] }) => (s.imagenes ?? []).map(() => k++));
      cache.set(p.fichero, col!);
    }
    return col!;
  };
})();
const imagenesDe = (p: PaginaEntrada, s: SeccionEntrada, i: number): number[] =>
  s.imagenes ?? colocacionPublicada(p)[i] ?? [];

/** Que `actual` siga siendo lo publicado: si no, la tanda esta desfasada. */
function revisaDesfase(p: PaginaEntrada, fallos: string[]) {
  const ruta = join(raiz, p.fichero);
  if (!existsSync(ruta)) return fallos.push(`${p.rutaId}: no existe ${p.fichero}`);
  const hoy = JSON.parse(readFileSync(ruta, 'utf8'));
  const igual = hoy.meta.titulo === p.actual.meta.titulo
    && hoy.meta.descripcion === p.actual.meta.descripcion
    && hoy.h1 === p.actual.h1
    && hoy.secciones.length === p.actual.secciones.length;
  if (!igual) {
    const aviso = `${p.rutaId}: la pagina ha cambiado desde que se exporto.`;
    if (sobrescribir) desfasadas.push(aviso);
    else fallos.push(`${aviso} Vuelve a exportar y a escribir sobre lo nuevo, `
      + 'o pasa --sobrescribir si la tanda reescribe la pagina entera.');
  }
}

/**
 * Textos que una tanda ha dejado en castellano dentro de otro idioma.
 *
 * Los mismos cinco vinieron sin traducir en las dos tandas seguidas: el h1 del
 * backdating en frances e italiano, y el encabezado de bore scoring del taller
 * en los tres. Se corrigieron a mano la primera vez y volvieron la segunda, asi
 * que dejan de corregirse a mano. Se buscan por el texto exacto: si un dia la
 * tanda llega bien traducida, esta tabla no encuentra nada y no hace nada.
 */
const TRADUCE: Record<string, Record<string, string>> = {
  fr: {
    'Backdating Porsche 911 pensado para conducir': 'Backdating Porsche 911 pensé pour la conduite',
    'Reparaciones Bore Scoring': 'Réparations bore scoring',
  },
  it: {
    'Backdating Porsche 911 pensado para conducir': 'Backdating Porsche 911 pensato per la guida',
    'Reparaciones Bore Scoring': 'Riparazioni bore scoring',
  },
  de: {
    'Reparaciones Bore Scoring': 'Bore-scoring-Reparaturen',
  },
};

/**
 * Descripciones de imagen del proyecto, por ruta de foto y por idioma.
 *
 * La guia pedia reescribir el `alt` de cada foto porque los de hoy son
 * etiquetas de archivo, y en seis fotos de restauraciones la tanda dejo el
 * nombre del fichero tal cual ("DSC00828.jpg"), que es lo que un lector de
 * pantalla acaba leyendo en voz alta. Las descripciones viven donde ya vivian
 * las del Magazine, `_migracion/contenido/alts.json`, y mandan sobre lo que
 * traiga la entrega: asi hay un solo sitio donde se describe una foto, y
 * volver a importar no deshace la correccion.
 */
const ALTS: Record<string, Partial<Record<Idioma, string>>> = (() => {
  const f = resolve(raiz, '../_migracion/contenido/alts.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
})();

// ── Escritura ──────────────────────────────────────────────────────────────
/**
 * Espaciado antes de los signos. En frances va espacio delante de `:` `;` `!`
 * `?`; en los otros cinco idiomas, no, y el build lo avisa. Es un descuido
 * tipico de una tanda traducida a la vez: el criterio frances se cuela en el
 * italiano. Se corrige aqui y no a mano sobre la pagina, porque una correccion
 * a mano la deshace la siguiente importacion.
 */
function espaciado(t: string, idioma: Idioma): string {
  const limpio = t.replace(/[ \u00a0\u202f]{2,}/g, ' ');
  if (idioma === 'fr') return limpio;
  return limpio.replace(/[ \u00a0\u202f]+([:;,!?])/g, '$1');
}


/** Cuantos textos trae la pagina. Sirve para la cobertura de la traduccion. */
const piezas = (n: Nuevo) =>
  3 + n.imagenes.length
  + n.secciones.reduce((k, s) => k + (s.titulo ? 1 : 0) + s.parrafos.length + s.items.length, 0);

const destinoDe = (fichero: string, idioma: Idioma) =>
  idioma === POR_DEFECTO
    ? join(raiz, fichero)
    : join(raiz, fichero.replace(/\.json$/, `.${idioma}.json`));

function construye(p: PaginaEntrada, idioma: Idioma) {
  const ruta = join(raiz, p.fichero);
  const base = JSON.parse(readFileSync(ruta, 'utf8'));
  const n = p.nuevo;
  const limpia = (t: string) => {
    const corregido = TRADUCE[idioma]?.[t.trim()] ?? t;
    return espaciado(corregido, idioma);
  };
  const urlDe = new Map<number, string>(p.imagenes.map((im) => [im.i, im.url]));
  for (const im of n.imagenes) if (im.url) urlDe.set(im.i, im.url);
  /* El LEEME de traduccion dice que los alt no se traducen porque alts.json
     los tiene en los seis idiomas. No es verdad para la mayoria de las fotos de
     servicios: alts.json describe las del Magazine y unas pocas de paginas, y
     la tanda de los seis idiomas trajo el castellano tal cual, como se le
     pidio. Aplicarlo sin mas pisaba los alt que las tandas anteriores si habian
     traducido. Asi que, sin descripcion en alts.json y con el alt igual al
     castellano, se conserva el que la pagina ya tenia publicado en ese idioma. */
  const altEs = new Map(p.imagenes.map((im) => [im.i, im.alt]));
  const previo = new Map<string, string>();
  if (idioma !== POR_DEFECTO) {
    const ruta = destinoDe(p.fichero, idioma);
    if (existsSync(ruta)) {
      const hoy = JSON.parse(readFileSync(ruta, 'utf8'));
      for (const s of hoy.secciones ?? []) for (const im of s.imagenes ?? []) {
        if (im.alt?.trim()) previo.set(im.url, im.alt);
      }
    }
  }
  const alt = new Map(n.imagenes.map((im) => {
    const url = urlDe.get(im.i) ?? '';
    const descrito = ALTS[url]?.[idioma];
    if (descrito) return [im.i, descrito];
    const sinTraducir = idioma !== POR_DEFECTO && im.alt === altEs.get(im.i);
    return [im.i, sinTraducir && previo.has(url) ? previo.get(url)! : limpia(im.alt)];
  }));

  const salida: Record<string, unknown> = {
    rutaId: base.rutaId,
    tipo: base.tipo,
    ficheroOriginal: base.ficheroOriginal,
    meta: {
      titulo: limpia(n.meta.titulo),
      descripcion: limpia(n.meta.descripcion),
      ogImagen: base.meta.ogImagen ?? '',
    },
    h1: limpia(n.h1),
    /* El rotulo del menu solo se escribe si difiere del h1: `menu` existe
       precisamente para cuando el h1 es demasiado largo para un menu. */
    ...(n.menu && n.menu !== n.h1 ? { menu: limpia(n.menu) } : {}),
    acordeones: base.acordeones ?? [],
    /* Los articulos del pie no los reescribe la tanda: se conservan. */
    ...(base.articulos?.length ? { articulos: base.articulos } : {}),
    secciones: n.secciones.map((s, k) => ({
      nivel: s.nivel,
      titulo: limpia(s.titulo),
      parrafos: s.parrafos.map(limpia),
      items: s.items.map(limpia),
      imagenes: imagenesDe(p, s, k).map((i) => ({ url: urlDe.get(i)!, alt: alt.get(i) ?? '' })),
    })),
    contacto: base.contacto ?? { telefonos: [], emails: [] },
  };

  if (idioma !== POR_DEFECTO) {
    const total = piezas(n);
    salida.traduccion = { hechas: total, total, completa: true };
  }
  return salida;
}

// ── Main ───────────────────────────────────────────────────────────────────
const dir = carpeta();
const tandas: { idioma: Idioma; paginas: PaginaEntrada[] }[] = [];

for (const idioma of IDIOMAS) {
  const f = join(dir, `servicios-${idioma}.json`);
  if (!existsSync(f)) continue;
  const doc = JSON.parse(readFileSync(f, 'utf8'));
  if (doc.formato !== 'valentinmotors-servicios-v1') {
    fallar(`${idioma}: formato inesperado ${JSON.stringify(doc.formato)}`);
  }
  tandas.push({ idioma, paginas: doc.paginas });
}
if (!tandas.length) fallar(`no hay ningun servicios-<idioma>.json en ${dir}`);
if (!tandas.some((t) => t.idioma === POR_DEFECTO)) {
  fallar('falta servicios-es.json: el castellano es el origen y entra siempre');
}

const fallos: string[] = [];
const desfasadas: string[] = [];
const es = tandas.find((t) => t.idioma === POR_DEFECTO)!;
const idsEs = es.paginas.map((p) => p.rutaId);

for (const { idioma, paginas } of tandas) {
  if (paginas.map((p) => p.rutaId).join() !== idsEs.join()) {
    fallos.push(`${idioma}: no trae las mismas paginas que el castellano`);
    continue;
  }
  for (const p of paginas) revisaPagina(p, idioma, fallos);
}
for (const p of es.paginas) revisaDesfase(p, fallos);

if (fallos.length) {
  console.error(`\nservicios: ${fallos.length} problemas. No se ha escrito nada.\n`);
  for (const f of fallos.slice(0, 40)) console.error(`  ${f}`);
  if (fallos.length > 40) console.error(`  ...y ${fallos.length - 40} mas`);
  process.exit(1);
}

if (desfasadas.length) {
  console.warn(`servicios: --sobrescribir, ${desfasadas.length} paginas se reescriben enteras`);
  for (const d of desfasadas.slice(0, 5)) console.warn(`  ${d}`);
  if (desfasadas.length > 5) console.warn(`  ...y ${desfasadas.length - 5} mas`);
}

const escritos: string[] = [];
for (const { idioma, paginas } of tandas) {
  for (const p of paginas) {
    const destino = destinoDe(p.fichero, idioma);
    const contenido = `${JSON.stringify(construye(p, idioma), null, 2)}\n`;
    if (!probar) writeFileSync(destino, contenido);
    escritos.push(destino.replace(`${raiz}/`, ''));
  }
}

const palabras = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const totalEs = es.paginas.reduce((n, p) => n + palabras(texto(p.nuevo)), 0);
const antes = es.paginas.reduce((n, p) => n + palabras([
  p.actual.h1, p.actual.meta.titulo, p.actual.meta.descripcion,
  ...p.actual.secciones.flatMap((s) => [s.titulo, ...s.parrafos, ...s.items]),
].join(' ')), 0);

console.log(`servicios: ${escritos.length} ficheros ${probar ? 'listos' : 'escritos'}`
  + ` en ${tandas.length} idiomas`);
console.log(`  castellano: ${antes} palabras -> ${totalEs}`);
if (probar) console.log('  --probar: no se ha tocado ningun fichero');
