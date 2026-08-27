#!/usr/bin/env python3
"""
Fase 3 - Extraccion de las paginas restantes (servicios, tarifas, centros,
institucional, legales y home) desde el HTML congelado del snapshot.

Squarespace guarda estas paginas como secciones y deja `mainContent` vacio, asi
que el unico sitio donde el contenido existe entero es el HTML renderizado.

Salida: sitio/src/datos/paginas/<slug>.json
"""
import gzip, json, re, sys
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

RAIZ = Path(__file__).resolve().parent.parent.parent
SNAP = RAIZ / '_migracion' / 'snapshot'
DEST = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'

# fichero del snapshot -> (id de ruta en el manifiesto, tipo de pagina)
PAGINAS = {
    '_home':                                    ('home', 'home'),
    'taller-porsche':                           ('taller', 'servicio'),
    'sala-motores':                             ('sala-motores', 'servicio'),
    'restauraciones':                           ('restauraciones', 'servicio'),
    'competicion':                              ('competicion', 'servicio'),
    'porsche-911-mantenimiento-taller':         ('tarifa-911', 'tarifa'),
    'porsche-cayman-boxster-mantenimiento-taller': ('tarifa-cayman', 'tarifa'),
    'porsche-cayenne-macan-mantenimiento-taller-1': ('tarifa-cayenne-macan', 'tarifa'),
    'porsche-gt-mantenimiento-taller':          ('tarifa-gt', 'tarifa'),
    'porsche-turbo-mantenimiento-taller':       ('tarifa-turbo', 'tarifa'),
    'porsche-transaxle-mantenimiento-taller':   ('tarifa-transaxle', 'tarifa'),
    'barcelona':                                ('barcelona', 'centro'),
    'madrid':                                   ('madrid', 'centro'),
    'quienes-somos':                            ('quienes-somos', 'institucional'),
    'contacto':                                 ('contacto', 'contacto'),
    'vende-tu-porsche-con-valentn-motors':      ('vende', 'institucional'),
    'porsche-997-de-segunda-mano':              ('ocasion-997', 'landing'),
    'porsche-996-de-segunda-mano':              ('ocasion-996', 'landing'),
    'porsche-992-de-segunda-mano':              ('ocasion-992', 'landing'),
    'aviso-legal':                              ('aviso-legal', 'legal'),
    'poltica-de-privacidad':                    ('privacidad', 'legal'),
    'poltica-de-cookies':                       ('cookies', 'legal'),
}

# El <button> NO se elimina de entrada: en los acordeones de tarifas el titulo
# del modelo vive dentro de el, y borrarlos dejaba las paginas de precios sin
# el nombre de cada motorizacion.
BASURA = ('script', 'style', 'noscript', 'svg', 'header', 'footer', 'nav')
PERMITIDAS = {'strong', 'em', 'br', 'a'}


def limpio(t):
    return re.sub(r'\s+', ' ', t or '').strip()


def rico(el):
    """HTML interior conservando solo enfasis y enlaces."""
    copia = BeautifulSoup(str(el), 'lxml').find(el.name)
    for d in copia.find_all(True):
        if d.name not in PERMITIDAS:
            d.unwrap()
        else:
            d.attrs = {k: v for k, v in d.attrs.items() if k == 'href'}
    return re.sub(r'\s+', ' ', copia.decode_contents()).strip()


def imagen_de(el):
    for a in ('data-src', 'src'):
        u = el.get(a)
        if u and u.startswith('http') and 'squarespace' in u:
            return u.split('?')[0]
    return None


def acordeones(main):
    """Extrae los acordeones, que es donde viven los precios.

    Las seis paginas de tarifas guardan cada motorizacion en un
    `li.accordion-item`: el nombre en un <span> dentro de un <button> y los
    precios en la descripcion desplegable. Sin esto, las paginas de tarifas se
    quedaban en cuatro parrafos genericos y ningun precio.
    """
    fuera = []
    for it in main.select('li.accordion-item'):
        tit = it.select_one('.accordion-item__title')
        des = it.select_one('.accordion-item__description')
        if not tit:
            continue
        parrafos, items = [], []
        if des:
            for x in des.find_all(['p', 'li']):
                if x.name == 'li':
                    t = limpio(x.get_text(' '))
                    if t:
                        items.append(t)
                else:
                    if len(limpio(x.get_text(' '))) > 2:
                        parrafos.append(rico(x))
        fuera.append({'modelo': limpio(tit.get_text(' ')),
                      'parrafos': parrafos, 'items': items})
        # Ya recogido: que no lo vuelva a coger el recorrido de secciones
        it.decompose()
    return fuera


def secciones(main):
    """Trocea el cuerpo en secciones a partir de los encabezados.

    Squarespace no marca las secciones semanticamente, asi que el unico corte
    fiable es el propio encabezado: todo lo que cuelga de un h2/h3 hasta el
    siguiente encabezado del mismo nivel o superior pertenece a esa seccion.
    """
    fuera = []
    actual = {'nivel': 0, 'titulo': '', 'parrafos': [], 'items': [], 'imagenes': []}
    vistos = set()
    pendientes = []   # imagenes que esperan al encabezado que viene detras

    for el in main.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'li', 'img']):
        if any(id(p) in vistos for p in el.parents):
            continue
        if el.name in ('h1', 'h2', 'h3', 'h4'):
            t = limpio(el.get_text(' '))
            if not t:
                continue
            if actual['titulo'] or actual['parrafos'] or actual['items'] or actual['imagenes']:
                fuera.append(actual)
            actual = {'nivel': int(el.name[1]), 'titulo': t,
                      'parrafos': [], 'items': [], 'imagenes': pendientes}
            pendientes = []
        elif el.name == 'p':
            t = rico(el)
            if len(limpio(el.get_text(' '))) > 2:
                actual['parrafos'].append(t)
        elif el.name == 'li':
            vistos.add(id(el))
            t = limpio(el.get_text(' '))
            if t:
                actual['items'].append(t)
        elif el.name == 'img':
            u = imagen_de(el)
            if not u:
                continue
            # Squarespace coloca la imagen ENCIMA de su titular, asi que en
            # orden de documento cae antes del encabezado al que pertenece. Si
            # entre la imagen y el siguiente encabezado no hay texto, la imagen
            # es de ese encabezado, no del anterior: sin esto la seccion
            # "Barcelona" salia ilustrada con la fachada de Madrid.
            duena = actual
            for sig in el.find_all_next(['h1', 'h2', 'h3', 'h4', 'p']):
                if sig.name == 'p' and len(limpio(sig.get_text(' '))) > 2:
                    break
                if sig.name != 'p':
                    duena = None
                    break
            (duena['imagenes'] if duena is not None
             else pendientes).append({'url': u, 'alt': el.get('alt', '')})

    if actual['titulo'] or actual['parrafos'] or actual['items'] or actual['imagenes']:
        actual['imagenes'] += pendientes
        fuera.append(actual)
    elif pendientes and fuera:
        fuera[-1]['imagenes'] += pendientes
    return fuera


def extraer(fichero, ruta_id, tipo):
    ruta = SNAP / 'html' / f'{fichero}.html.gz'
    html = gzip.decompress(ruta.read_bytes()).decode('utf8', 'replace')
    s = BeautifulSoup(html, 'lxml')

    meta = lambda n, a='name': (s.head.find('meta', attrs={a: n}) or {}).get('content', '')
    d = {
        'rutaId': ruta_id, 'tipo': tipo, 'ficheroOriginal': fichero,
        'meta': {
            'titulo': limpio(s.title.get_text()) if s.title else '',
            'descripcion': meta('description'),
            'ogImagen': meta('og:image', 'property'),
        },
    }

    for t in s.find_all(BASURA):
        t.decompose()
    main = s.find('main') or s.find(id='page') or s.body

    h1 = main.find('h1')
    d['h1'] = limpio(h1.get_text(' ')) if h1 else ''
    d['acordeones'] = acordeones(main)   # antes que secciones(): las consume
    # Los botones que no eran acordeon si son chrome
    for b in main.find_all('button'):
        b.decompose()
    d['secciones'] = secciones(main)

    # Telefonos, emails y direcciones: son datos, no prosa, y se usan en el
    # JSON-LD de LocalBusiness ademas de en la pagina
    texto = main.get_text(' ')
    d['contacto'] = {
        'telefonos': sorted(set(re.findall(r'(?:\+34\s?)?\d{3}[\s.]?\d{3}[\s.]?\d{3}', texto))),
        'emails': sorted(set(re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', texto))),
    }
    return d


def correcciones():
    """Correcciones de contenido aprobadas por el cliente.

    Viven en _migracion/correcciones.json y se aplican DESPUES de extraer, de
    modo que regenerar los datos desde el snapshot de Squarespace no las pierda.
    Sin esto, cada `python3 11_extraer_paginas.py` reintroduciria las cifras
    viejas.
    """
    ruta = RAIZ / '_migracion' / 'correcciones.json'
    if not ruta.exists():
        return []
    datos = json.loads(ruta.read_text())
    return [r for bloque in datos.values() if isinstance(bloque, dict)
            for r in bloque.get('reglas', [])]


def aplicar_correcciones(d, reglas):
    n = 0
    def corrige(txt):
        nonlocal n
        for r in reglas:
            if r['buscar'] in txt:
                txt = txt.replace(r['buscar'], r['reemplazar'])
                n += 1
        return txt
    d['h1'] = corrige(d['h1'])
    d['meta']['descripcion'] = corrige(d['meta']['descripcion'])
    for s_ in d['secciones']:
        s_['titulo'] = corrige(s_['titulo'])
        s_['parrafos'] = [corrige(x) for x in s_['parrafos']]
        s_['items'] = [corrige(x) for x in s_['items']]
    for a in d.get('acordeones', []):
        a['parrafos'] = [corrige(x) for x in a['parrafos']]
        a['items'] = [corrige(x) for x in a['items']]
    return n


def mapa_redirecciones():
    """Enlaces internos que apuntan a una URL redirigida.

    La pagina de servicios enlaza a /magazine/restauracion-motor-964-turbo-dfc3x,
    que hoy es un 404. Dejar enlaces internos hacia redirecciones (o hacia 404)
    gasta presupuesto de rastreo y manda al usuario por un salto de mas.
    """
    import csv
    ruta = RAIZ / '_migracion' / 'informes' / 'inventario_urls.csv'
    if not ruta.exists():
        return {}
    fuera = {}
    for f in csv.DictReader(ruta.open()):
        if f['accion'] == '301' and f['destino'] and f['url'] != f['destino']:
            fuera[f['url']] = f['destino']
    return fuera


def arreglar_enlaces(d, mapa):
    n = 0
    def sustituye(txt):
        nonlocal n
        for viejo, nuevo in mapa.items():
            for pat in (f'"{viejo}"', f'"https://www.valentinmotors.es{viejo}"'):
                if pat in txt:
                    txt = txt.replace(pat, f'"{nuevo}"')
                    n += 1
        return txt
    for s in d['secciones']:
        s['parrafos'] = [sustituye(p) for p in s['parrafos']]
    for a in d.get('acordeones', []):
        a['parrafos'] = [sustituye(p) for p in a['parrafos']]
    return n


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    redir = mapa_redirecciones()
    reglas = correcciones()
    arreglados = corregidos = 0
    print(f'{"pagina":42} {"tipo":14} {"secc":>5} {"parr":>5} {"items":>6} {"imgs":>5} {"acord":>6}')
    print('-' * 90)
    faltan = []
    for fichero, (ruta_id, tipo) in PAGINAS.items():
        if not (SNAP / 'html' / f'{fichero}.html.gz').exists():
            faltan.append(fichero)
            continue
        d = extraer(fichero, ruta_id, tipo)
        arreglados += arreglar_enlaces(d, redir)
        corregidos += aplicar_correcciones(d, reglas)
        (DEST / f'{ruta_id}.json').write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
        p = sum(len(x['parrafos']) for x in d['secciones'])
        i = sum(len(x['items']) for x in d['secciones'])
        im = sum(len(x['imagenes']) for x in d['secciones'])
        ac = len(d['acordeones'])
        print(f'{fichero[:42]:42} {tipo:14} {len(d["secciones"]):>5} {p:>5} {i:>6} {im:>5} {ac:>6}')
    if faltan:
        print(f'\nNo encontradas en el snapshot: {faltan}', file=sys.stderr)
    print(f'\n{len(PAGINAS) - len(faltan)} paginas extraidas en {DEST.relative_to(RAIZ)}')
    print(f'{arreglados} enlaces internos redirigidos a su destino final')
    print(f'{corregidos} correcciones de contenido aplicadas')


if __name__ == '__main__':
    main()
