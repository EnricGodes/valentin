# -*- coding: utf-8 -*-
"""
Reextrae el cuerpo de los posts como BLOQUES, no como Markdown plano.

Por que existe: 02_extraer_posts.py leia el texto y las imagenes de Squarespace
y tiraba el `data-block-json` de cada bloque. Las 67 galerias de 33 posts se
aplanaron en imagenes sueltas: un post con 187 fotos en dos galerias hoy son
187 imagenes a pantalla completa, una detras de otra. Ninguna foto se perdio;
se perdio la estructura, y estaba en el snapshot todo el tiempo.

Modelo de salida. La prosa sigue siendo Markdown dentro de un bloque de texto,
que es lo que mantiene intactas las traducciones y los validadores de glosario:

  [{"tipo": "texto",   "md": "## Titulo\\n\\nParrafo..."},
   {"tipo": "galeria", "diseno": "grid", "porFila": 3, "proporcion": "standard",
                       "lightbox": true, "fotos": [{"src","alt","ancho","alto"}]},
   {"tipo": "video",   "src": "...", "ancho": 1920, "alto": 1080},
   {"tipo": "youtube", "id": "vqCyZV_Wneo"},
   {"tipo": "cita",    "md": "..."}]

Los bloques de prosa contiguos se funden en uno solo: quien escribe redacta
seguido y solo corta cuando inserta un modulo.
"""
import json, re, html, sys
from pathlib import Path
from collections import Counter
from bs4 import BeautifulSoup

RAIZ = Path(__file__).resolve().parents[2]
SNAP = RAIZ / '_migracion/snapshot/json'
MAPA = json.loads((RAIZ / '_migracion/contenido/imagenes_mapa.json').read_text())['mapa']
SALIDA = RAIZ / '_migracion/contenido/bloques'

DISENOS = {'grid': 'cuadricula', 'slideshow': 'pase', 'slider': 'carrusel', 'stacked': 'apilada'}


def local(url):
    """URL del CDN de Squarespace -> ruta local ya descargada."""
    if not url:
        return None
    limpia = url.split('?')[0]
    if limpia in MAPA:
        return MAPA[limpia]
    for k, v in MAPA.items():
        if k.split('?')[0] == limpia:
            return v
    return None


def dim(tag):
    for a, b in (('data-image-dimensions', None), ('width', 'height')):
        if b is None:
            d = tag.get(a) or ''
            m = re.match(r'(\d+)x(\d+)', d)
            if m:
                return int(m.group(1)), int(m.group(2))
        elif tag.get(a) and tag.get(b):
            try:
                return int(tag[a]), int(tag[b])
            except ValueError:
                pass
    return None, None


def url_img(tag):
    for a in ('data-src', 'src', 'data-image'):
        v = tag.get(a)
        if v and 'squarespace-cdn' in v:
            return v
    return tag.get('data-src') or tag.get('src')


def galeria(bloque):
    """Un sqs-block gallery-block -> bloque de galeria con su configuracion."""
    try:
        cfg = json.loads(html.unescape(bloque.get('data-block-json', '{}')))
    except Exception:
        cfg = {}

    fotos, vistas = [], set()
    for img in bloque.select('img'):
        u = url_img(img)
        ruta = local(u)
        if not ruta or ruta in vistas:
            continue
        vistas.add(ruta)
        a, al = dim(img)
        fig = img.find_parent('figure')
        cap = fig.find('figcaption') if fig is not None else None
        pie = ((img.get('data-description') or '').strip()
               or (inline_md(cap).strip() if cap is not None else ''))
        fotos.append({'src': ruta, 'alt': (img.get('alt') or '').strip(),
                      'ancho': a, 'alto': al, **({'pie': pie} if pie else {})})
    if not fotos:
        return None

    return {
        'tipo': 'galeria',
        'diseno': DISENOS.get(cfg.get('design'), 'cuadricula'),
        'porFila': cfg.get('thumbnails-per-row') or 3,
        'proporcion': cfg.get('aspect-ratio') or 'standard',
        'lightbox': bool(cfg.get('lightbox')),
        'fotos': fotos,
    }


def inline_md(nodo):
    """Serializa un nodo a Markdown, conservando enfasis y enlaces."""
    partes = []
    for hijo in nodo.children:
        if isinstance(hijo, str):
            partes.append(hijo)
        elif hijo.name in ('strong', 'b'):
            partes.append(f'**{inline_md(hijo).strip()}**')
        elif hijo.name in ('em', 'i'):
            partes.append(f'*{inline_md(hijo).strip()}*')
        elif hijo.name == 'a' and hijo.get('href'):
            partes.append(f'[{inline_md(hijo).strip()}]({hijo["href"]})')
        elif hijo.name == 'br':
            partes.append('  \n')
        else:
            partes.append(inline_md(hijo))
    return ''.join(partes)


def prosa(bloque):
    """Un bloque de texto de Squarespace -> Markdown."""
    trozos = []
    for el in bloque.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'blockquote'],
                              recursive=True):
        if el.find_parent(['ul', 'ol']) and el.name in ('p',):
            continue
        t = inline_md(el).strip()
        if not t:
            continue
        if el.name.startswith('h'):
            trozos.append('#' * int(el.name[1]) + ' ' + t)
        elif el.name in ('ul', 'ol'):
            items = [inline_md(li).strip() for li in el.find_all('li', recursive=False)]
            marca = (lambda i: '- ') if el.name == 'ul' else (lambda i: f'{i+1}. ')
            trozos.append('\n'.join(marca(i) + x for i, x in enumerate(items) if x))
        elif el.name == 'blockquote':
            trozos.append('\n'.join('> ' + l for l in t.split('\n')))
        else:
            trozos.append(t)
    return '\n\n'.join(trozos).strip()


def extraer(body):
    soup = BeautifulSoup(body, 'lxml')
    salida = []

    for bloque in soup.select('div.sqs-block'):
        # Solo bloques de primer nivel: los anidados ya van dentro del padre.
        if bloque.find_parent('div', class_='sqs-block'):
            continue
        clases = bloque.get('class', [])

        if 'gallery-block' in clases:
            g = galeria(bloque)
            if g:
                salida.append(g)
            continue

        nativo = bloque.select_one('.sqs-native-video[data-config-video]')
        if nativo is not None:
            try:
                cfg = json.loads(html.unescape(nativo['data-config-video']))
            except Exception:
                cfg = {}
            m = re.search(r'/([0-9a-f-]{36})/', cfg.get('alexandriaUrl') or '')
            if m:
                # "1080:1920" -> ancho y alto del original
                var = (cfg.get('systemDataVariants') or '').split(',')[0]
                anc, alt = (var.split(':') + [None, None])[:2]
                salida.append({'tipo': 'video',
                               'src': f'/video/magazine/{m.group(1)}.mp4',
                               'ancho': int(anc) if (anc or '').isdigit() else None,
                               'alto': int(alt) if (alt or '').isdigit() else None,
                               'segundos': round(cfg.get('durationSeconds') or 0, 1) or None})
                continue

        if 'video-block' in clases or bloque.find('video'):
            v = bloque.find('video')
            if v is not None and v.get('src'):
                salida.append({'tipo': 'video', 'src': v['src'],
                               'ancho': int(v.get('width') or 0) or None,
                               'alto': int(v.get('height') or 0) or None})
                continue

        marco = bloque.find('iframe')
        if marco is not None and marco.get('src'):
            m = re.search(r'youtube\.com/embed/([\w-]+)', marco['src'])
            if m:
                salida.append({'tipo': 'youtube', 'id': m.group(1)})
                continue

        if 'image-block' in clases:
            img = bloque.find('img')
            ruta = local(url_img(img)) if img is not None else None
            if ruta:
                a, al = dim(img)
                # El pie va en un <figcaption> y se ve bajo la foto: es texto
                # del articulo, no metadato. Perderlo es perder contenido.
                cap = bloque.find('figcaption')
                pie = inline_md(cap).strip() if cap is not None else ''
                salida.append({'tipo': 'imagen', 'src': ruta,
                               'alt': (img.get('alt') or '').strip(),
                               'ancho': a, 'alto': al,
                               **({'pie': pie} if pie else {})})
            continue

        md = prosa(bloque)
        if md:
            salida.append({'tipo': 'texto', 'md': md})

    # Fusiona bloques de prosa contiguos.
    fundido = []
    for b in salida:
        if b['tipo'] == 'texto' and fundido and fundido[-1]['tipo'] == 'texto':
            fundido[-1]['md'] += '\n\n' + b['md']
        else:
            fundido.append(b)
    return fundido


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    cuenta = Counter()
    fallos = []

    for f in sorted(SNAP.glob('magazine_*.json')):
        if '_category_' in f.name:
            continue
        d = json.loads(f.read_text(encoding='utf-8'))
        item = d.get('item') or {}
        body = item.get('body') or ''
        if not body:
            continue
        slug = item.get('urlId', '')
        bloques = extraer(body)
        if not bloques:
            fallos.append(slug)
            continue
        for b in bloques:
            cuenta[b['tipo']] += 1
        (SALIDA / f'{slug.replace("/", "-")}.json').write_text(
            json.dumps({'slugSquarespace': slug, 'bloques': bloques},
                       indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    print(f'posts con bloques: {len(list(SALIDA.glob("*.json")))}')
    print('bloques extraidos:')
    for k, v in cuenta.most_common():
        print(f'  {v:5}  {k}')
    if fallos:
        print(f'\nSIN BLOQUES ({len(fallos)}): {", ".join(fallos[:8])}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
