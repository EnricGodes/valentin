#!/usr/bin/env python3
"""
Fase 3 - Extraccion de las fichas de coche.

Convierte las seis fichas HTML escritas a mano en datos estructurados, para que
las paginas del sitio nuevo se rendericen desde contenido y no desde markup
copiado. Extraer en vez de reescribir evita que el texto se desvie del original.

Salida: sitio/src/datos/coches/<slug>.json
"""
import json, re, sys
from pathlib import Path
from bs4 import BeautifulSoup, Tag
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent.parent
DEST = RAIZ / "sitio" / "src" / "datos" / "coches"

FICHAS = {
    'ruf':          ('997-ruf-kompressor',                 'realce--ruf'),
    '356':          ('porsche-356-b-cabriolet-1960',       'realce--356'),
    '997':          ('porsche-997-manual',                 'realce--997'),
    '997tiptronic': ('porsche-997-carrera-4s-triptronic',  'realce--997tiptronic'),
    '911targa':     ('porsche-911-22-t-targa',             'realce--911targa'),
    '991scabrio':   ('porsche-porsche-991-carrera-s-cabrio','realce--991scabrio'),
    # Vendido. Su ficha se recupero del commit 7fc2d2e, que la borro. Seguia
    # recibiendo 108 visitas al mes dando 404: borrar el coche vendido tira la
    # autoridad acumulada y deja fuera la long tail de quien busca ese modelo.
    'cayman':       ('porsche-981-cayman-gts', 'realce--cayman'),
}

PERMITIDAS = {'strong', 'em', 'br', 'span'}


_MEDIDAS: dict[str, tuple[int, int]] = {}


def medidas(src):
    """Dimensiones reales del fichero.

    Sin width/height el navegador no reserva sitio y la pagina salta al cargar
    (CLS). Se leen del JPG en vez de inventarlas: poner 600x450 en una foto que
    es 1600x900 le da al navegador una pista falsa.
    """
    if src in _MEDIDAS:
        return _MEDIDAS[src]
    ruta = RAIZ / src.lstrip('/')
    try:
        with Image.open(ruta) as im:
            _MEDIDAS[src] = im.size
    except Exception:
        _MEDIDAS[src] = (0, 0)
    return _MEDIDAS[src]


def foto(img, caption_el=None):
    src = img['src']
    a, h = medidas(src)
    return {'src': src, 'alt': img.get('alt', ''), 'ancho': a, 'alto': h,
            'caption': limpio(caption_el.get_text()) if caption_el else ''}


def limpio(t):
    return re.sub(r'\s+', ' ', t or '').strip()


def rico(el):
    """HTML interior conservando solo el enfasis editorial."""
    if el is None:
        return ''
    copia = BeautifulSoup(str(el), 'lxml').find(el.name)
    for d in copia.find_all(True):
        if d.name not in PERMITIDAS:
            d.unwrap()
        else:
            d.attrs = {}
    return re.sub(r'\s+', ' ', copia.decode_contents()).strip()


def cabecera(cont):
    """Etiqueta y titulo de una cabecera de seccion.

    El titulo se guarda como HTML integro y no troceado en "titulo + destacado".
    El <strong> no siempre va al final: en la seccion de ingenieria del RUF el
    original es "Ingenieria<br><strong>RUF Kompressor.</strong><br>Sin lag.", y
    partirlo por el <strong> reordenaba la frase.
    """
    if cont is None:
        return {}
    lab = cont.find(class_='section-label')
    tit = cont.find(class_='section-title')
    etiqueta = limpio(lab.get_text()) if lab else ''
    if tit is None:
        return {'etiqueta': etiqueta}
    return {'etiqueta': etiqueta, 'titulo': rico(tit)}


def stat(st):
    """Valor y unidad de una caja de estadistica.

    La unidad vive en un <span class="unit"> DENTRO del valor, asi que hay que
    sacarla antes de leer el texto: si no, "3.8" + "L" se lee como "3.8L" y al
    volver a pintar la unidad quedaria "3.8L L".
    """
    val = st.find(class_='eng-stat-val')
    unidad_el = val.find(class_='unit') if val else None
    unidad = limpio(unidad_el.get_text()) if unidad_el else ''
    animado = st.find(class_='count-up')
    if animado is not None:
        valor = int(animado['data-target'])
    else:
        copia = BeautifulSoup(str(val), 'lxml').find(val.name)
        u = copia.find(class_='unit')
        if u:
            u.decompose()
        valor = limpio(copia.get_text())
    return {'valor': valor, 'animado': animado is not None, 'unidad': unidad,
            'etiqueta': limpio(st.find(class_='eng-stat-label').get_text()),
            'destacada': 'highlight' in (st.get('class') or [])}


def fondo_de(estilo):
    m = re.search(r"url\('([^']+)'\)", estilo or '')
    return m.group(1) if m else None


def extraer(slug_archivo, slug_url, realce):
    html = (RAIZ / f'{slug_archivo}.html').read_text(encoding='utf8')
    cabeza = BeautifulSoup(html, 'lxml').head
    css = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
    s = BeautifulSoup(re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1), 'lxml')
    for t in s.find_all('script'):
        t.decompose()

    d = {'slug': slug_url, 'archivoOriginal': f'{slug_archivo}.html', 'realce': realce}

    # ── meta
    meta = lambda n, a='name': (cabeza.find('meta', attrs={a: n}) or {}).get('content')
    d['meta'] = {
        'titulo': limpio(cabeza.title.get_text()) if cabeza.title else '',
        'descripcion': meta('description') or '',
        'ogImagen': meta('og:image', 'property') or '',
    }

    # ── hero
    hero = s.find(id='hero')
    h1 = hero.find(class_='hero-title')
    em = h1.find('em')
    sub = rico(em) if em else ''
    copia = BeautifulSoup(str(h1), 'lxml').find('h1')
    if copia.find('em'):
        copia.find('em').decompose()
    for x in copia.find_all(True):
        if x.name not in PERMITIDAS:
            x.unwrap()
        else:
            x.attrs = {}
    badge = hero.find(class_='hero-badge')
    d['hero'] = {
        'eyebrow': limpio(hero.find(class_='hero-eyebrow').get_text()),
        'subtitulo': sub,
        'titulo': re.sub(r'^(<br/?>\s*)+', '', re.sub(r'\s+', ' ', copia.decode_contents()).strip()),
        'claim': limpio(hero.find(class_='hero-claim').get_text()) if hero.find(class_='hero-claim') else '',
        'imagen': fondo_de(re.search(r'#hero-bg\s*\{[^}]*\}', css).group(0)),
        'precio': limpio(badge.find(class_='hero-badge-price').get_text()) if badge else '',
        'precioLabel': limpio(badge.find(class_='hero-badge-label').get_text()) if badge else '',
        'scrollLabel': limpio(hero.find(class_='hero-scroll').find('span').get_text()),
    }

    # ── intro
    intro = s.find(id='intro')
    txt = intro.find(class_='intro-text')
    d['intro'] = cabecera(txt)
    cuerpo = txt.find('div', class_=re.compile(r'\breveal\b')) if txt else None
    parrafos = []
    for div in txt.find_all('div', recursive=False):
        if 'intro-highlight' in (div.get('class') or []):
            continue
        parrafos += [rico(p) for p in div.find_all('p', recursive=False)]
    d['intro']['parrafos'] = [p for p in parrafos if p]
    alto = txt.find(class_='intro-highlight')
    d['intro']['cita'] = rico(alto.find('p')) if alto else ''
    d['intro']['datos'] = [{
        'clave': limpio(f.find(class_='intro-data-key').get_text()),
        'valor': limpio(f.find(class_='intro-data-val').get_text()),
        'acento': 'accent' in (f.find(class_='intro-data-val').get('class') or []),
    } for f in intro.find_all(class_='intro-data-row')]

    # ── galeria
    g = s.find(id='gallery')
    d['galeria'] = cabecera(g.find(class_='gallery-header'))
    d['galeria']['fotos'] = [foto(sl.find('img'), sl.find(class_='gallery-caption'))
                             for sl in g.find_all(class_='gallery-slide')]

    # ── ingenieria
    e = s.find(id='engineering')
    d['ingenieria'] = cabecera(e)
    d['ingenieria']['stats'] = [stat(st) for st in e.find_all(class_='eng-stat')]
    et = e.find(class_='engineering-text')
    d['ingenieria']['parrafos'] = [rico(p) for p in et.find_all('p', recursive=False)] if et else []
    d['ingenieria']['tags'] = [limpio(x.get_text()) for x in e.find_all(class_='eng-tag')]

    # ── kit / restauracion
    k = s.find(id='rufkit') or s.find(id='restauracion')
    if k:
        d['kit'] = cabecera(k)
        d['kit']['ancla'] = k.get('id')
        pr = k.find(class_=re.compile(r'(rufkit|kit)-price'))
        d['kit']['precio'] = limpio(pr.get_text()) if pr else ''
        d['kit']['categorias'] = [{
            'titulo': limpio(c.find(class_='kit-cat-title').get_text()),
            'items': [limpio(li.get_text()) for li in c.find_all('li')],
        } for c in k.find_all(class_='kit-category')]

    # ── exterior
    x = s.find(id='exterior')
    d['exterior'] = cabecera(x)
    ext = x.find(class_='exterior-text')
    d['exterior']['texto'] = rico(ext) if ext else ''
    d['exterior']['fotos'] = [foto(it.find('img'), it.find(class_='closeup-caption'))
                              for it in x.find_all(class_='closeup-item')]

    # ── interior
    i = s.find(id='interior')
    d['interior'] = cabecera(i)
    d['interior']['fotos'] = [foto(it.find('img'), it.find(class_='interior-caption'))
                              for it in i.find_all(class_='interior-item')]
    ed = i.find(class_='interior-editorial')
    d['interior']['editorial'] = rico(ed.find('p')) if ed and ed.find('p') else ''

    # ── procedencia
    p = s.find(id='provenance')
    d['procedencia'] = cabecera(p)
    d['procedencia']['hitos'] = [{
        'anio': limpio(it.find(class_='timeline-year').get_text()),
        'titulo': limpio(it.find(class_='timeline-title').get_text()),
        'cuerpo': rico(it.find(class_='timeline-body')),
        'badge': limpio(it.find(class_='timeline-badge').get_text()) if it.find(class_='timeline-badge') else '',
    } for it in p.find_all(class_='timeline-item')]

    # ── specs
    sp = s.find(id='specs')
    d['specs'] = cabecera(sp)
    d['specs']['grupos'] = [{
        'titulo': limpio(gr.find(class_='specs-group-title').get_text()),
        'filas': [{'clave': limpio(f.find(class_='spec-key').get_text()),
                   'valor': limpio(f.find(class_='spec-val').get_text())}
                  for f in gr.find_all(class_='spec-row')],
    } for gr in sp.find_all(class_='specs-group')]

    # ── opinion
    j = s.find(id='jordi')
    if j:
        fotoj = j.find(class_='jordi-photo-wrap')
        pros = j.find(class_='jordi-pros')
        cons = j.find(class_='jordi-cons')
        cuerpoj = j.find(class_='jordi-body')
        d['opinion'] = {
            **cabecera(j),
            'foto': fotoj.find('img')['src'] if fotoj and fotoj.find('img') else '',
            'fotoAncho': medidas(fotoj.find('img')['src'])[0] if fotoj and fotoj.find('img') else 0,
            'fotoAlto': medidas(fotoj.find('img')['src'])[1] if fotoj and fotoj.find('img') else 0,
            'nombre': limpio(j.find(class_='jordi-name').get_text()) if j.find(class_='jordi-name') else '',
            'rol': limpio(j.find(class_='jordi-role').get_text()) if j.find(class_='jordi-role') else '',
            'bio': rico(j.find(class_='jordi-bio')),
            'intro': rico(j.find(class_='jordi-review-intro')),
            'parrafos': [rico(x) for x in cuerpoj.find_all('p', recursive=False)] if cuerpoj else [],
            'prosTitulo': limpio(pros.find(class_='jordi-verdict-title').get_text()) if pros else '',
            'pros': [limpio(li.get_text()) for li in pros.find_all('li')] if pros else [],
            'contrasTitulo': limpio(cons.find(class_='jordi-verdict-title').get_text()) if cons else '',
            'contras': [limpio(li.get_text()) for li in cons.find_all('li')] if cons else [],
        }

    # ── cierre
    c = s.find(id='closing')
    contenido = c.find(class_='closing-content')
    cta = c.find('a')
    precio_el = c.find(class_='closing-price')
    vendedor = c.find(class_='closing-seller')
    # En cinco de las seis fichas el .closing-seller solo contiene el boton de
    # CTA, que ya se captura aparte: si no se excluye, la "nota" acabaria
    # diciendo "Mas informacion".
    nota = ''
    if vendedor:
        copia_v = BeautifulSoup(str(vendedor), 'lxml').find(vendedor.name)
        for a in copia_v.find_all('a'):
            a.decompose()
        nota = limpio(copia_v.get_text())

    # Un coche reservado o vendido lleva en el cierre el precio tachado y dos
    # avisos que en el original van con estilos en linea. Son contenido, no
    # decoracion: sin ellos la ficha del 997 diria que esta en venta.
    aviso = ''
    for p_ in contenido.find_all('p', recursive=False):
        if 'closing-quote' in (p_.get('class') or []):
            continue
        t = limpio(p_.get_text())
        if t:
            aviso = t
            break

    d['cierre'] = {
        'imagen': fondo_de(re.search(r'#closing-bg\s*\{[^}]*\}', css).group(0)),
        'cita': rico(c.find(class_='closing-quote')),
        'precio': limpio(precio_el.get_text()) if precio_el else '',
        'precioTachado': 'line-through' in (precio_el.get('style') or '') if precio_el else False,
        'precioLabel': limpio(c.find(class_='closing-price-label').get_text()) if c.find(class_='closing-price-label') else '',
        'aviso': aviso,
        'nota': nota,
        'ctaTexto': limpio(cta.get_text()) if cta else '',
        'ctaHref': cta.get('href') if cta else '',
    }
    return d


def tarjetas():
    """Datos de catalogo de index.html, indexados por archivo de ficha.

    Viven en el index y no en la ficha, asi que se extraen aparte y se guardan
    dentro del JSON del coche: que la tarjeta y la ficha se desincronicen es
    justo el tipo de error que nadie ve hasta que un cliente lo ve.
    """
    html = (RAIZ / 'index.html').read_text(encoding='utf8')
    s = BeautifulSoup(re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1), 'lxml')
    for t in s.find_all('script'):
        t.decompose()
    fuera = {}
    for a in s.find_all('a', class_='car-card'):
        archivo = (a.get('href') or '').replace('.html', '')
        badge = a.find(class_='car-status-badge')
        clases = badge.get('class') if badge else []
        estado = ('vendido' if 'badge-sold' in clases else
                  'reservado' if 'badge-reserved' in clases else
                  'proximamente' if 'badge-soon' in clases else 'disponible')
        precio_el = a.find(class_='car-price')
        campo = lambda c: limpio(a.find(class_=c).get_text()) if a.find(class_=c) else ''
        img = a.find('img')
        fuera[archivo] = {
            'estado': estado,
            'estadoTexto': limpio(badge.get_text()) if badge else '',
            'marca': campo('car-make'),
            'nombre': campo('car-name'),
            'detalle': campo('car-year'),
            'descripcion': campo('car-desc'),
            'precio': limpio(precio_el.get_text()) if precio_el else '',
            'precioPorConsultar': 'tbd' in (precio_el.get('class') or []) if precio_el else False,
            'imagen': '/' + img['src'].lstrip('/') if img else '',
            'imagenAncho': medidas('/' + img['src'].lstrip('/'))[0] if img else 0,
            'imagenAlto': medidas('/' + img['src'].lstrip('/'))[1] if img else 0,
        }
    return fuera


def tarjeta_de_vendido(d, slug):
    """Tarjeta de catalogo para un coche ya vendido.

    Su tarjeta desaparecio de index.html al venderse, asi que se reconstruye
    desde la propia ficha. El precio no se publica: un coche vendido no tiene
    precio, tiene historia."""
    limpiar = lambda t: re.sub(r'<[^>]+>', ' ', t or '')
    nombre = limpio(limpiar(f"{d['hero']['subtitulo']} {d['hero']['titulo']}"))
    dato = lambda pat: next((x['valor'] for x in d['intro']['datos']
                             if re.search(pat, x['clave'], re.I)), '')
    partes = [x for x in (dato(r'^a.o'), dato(r'kil.metros'), dato(r'color')) if x]
    return {
        'estado': 'vendido', 'estadoTexto': 'Vendido',
        'marca': 'Porsche', 'nombre': nombre.replace('Porsche ', '', 1),
        'detalle': ' · '.join(partes),
        'descripcion': limpio(limpiar(d['meta']['descripcion']))[:180],
        'precio': '', 'precioPorConsultar': False,
        'imagen': d['galeria']['fotos'][0]['src'] if d['galeria']['fotos'] else '',
        'imagenAncho': d['galeria']['fotos'][0]['ancho'] if d['galeria']['fotos'] else 0,
        'imagenAlto': d['galeria']['fotos'][0]['alto'] if d['galeria']['fotos'] else 0,
    }


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    cat = tarjetas()
    resumen = []
    for archivo, (slug, realce) in FICHAS.items():
        d = extraer(archivo, slug, realce)
        d['catalogo'] = cat.get(archivo) or tarjeta_de_vendido(d, slug)
        if d['catalogo']['estado'] == 'vendido':
            # El cierre deja de ser una oferta: precio tachado y aviso claro
            d['cierre']['precioTachado'] = True
            d['cierre']['aviso'] = 'Vehículo vendido'
            d['cierre']['nota'] = ('Este vehículo ya no está disponible. '
                                   'Escríbenos si buscas una unidad similar.')
            d['hero']['precio'] = ''
            d['hero']['precioLabel'] = ''
        (DEST / f'{slug}.json').write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
        resumen.append((slug, len(d['galeria']['fotos']), len(d['intro']['parrafos']),
                        len(d.get('kit', {}).get('categorias', [])),
                        len(d['specs']['grupos']), len(d['procedencia']['hitos'])))
    print(f'{len(resumen)} fichas extraidas\n')
    print(f'{"slug":42} {"fotos":>5} {"parr":>5} {"kit":>4} {"spec":>5} {"hitos":>6}')
    for r in resumen:
        print(f'{r[0]:42} {r[1]:>5} {r[2]:>5} {r[3]:>4} {r[4]:>5} {r[5]:>6}')


if __name__ == '__main__':
    main()
