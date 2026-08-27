#!/usr/bin/env python3
"""
Aplica el fichero de traducciones devuelto.

    python3 15_importar_traducciones.py TRADUCIDO.json [--solo en,de] [--forzar]

Valida ANTES de escribir nada. Si algo falla, no toca ni un fichero: es
preferible un import rechazado a medio sitio con textos rotos.

Comprueba, por entrada e idioma:
  · que el id existe y que el texto en espanol no ha cambiado
  · que los terminos invariantes del glosario siguen sin traducir
  · que las etiquetas HTML y las rutas de imagen, video y enlace se conservan
  · que las cifras del original siguen ahi (precios, anios, cilindradas)
  · que no se ha colado el espanol sin traducir
"""
import json, re, sys, unicodedata
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
COCHES = RAIZ / 'sitio' / 'src' / 'datos' / 'coches'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
ORIGEN = RAIZ / '_migracion' / 'traducciones' / 'PARA-TRADUCIR.json'

INVARIANTES = [
    'Porsche', 'IMS', 'bore scoring', 'backdating', 'Tiptronic', 'PDK', 'PASM',
    'PCCB', 'Targa', 'Speedster', 'transaxle', 'RUF', 'TECHART', 'Nickies',
    'NSC', 'NIKASIL', 'Porsche Partner Network', 'Valentin Motors', 'Boxster',
    'Cayman', 'Cayenne', 'Macan', 'Panamera', 'M96', 'M97', 'Motorsport',
]


def plano(s):
    """Minusculas y sin acentos.

    La marca aparece en el sitio como "Valentin Motors" y como "Valentin
    Motors" con tilde, y la comparacion literal dejaba pasar traducciones que
    se habian comido el nombre."""
    s = unicodedata.normalize('NFD', s.lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')
ETIQUETAS = re.compile(r'<(/?)(strong|em|br|a|video|iframe)\b')
RUTAS = re.compile(r'\]\((/[^)]+)\)|src="(/[^"]+)"')
CIFRAS = re.compile(r'\d[\d.,]*')


def valida(e, idioma, texto, fuente):
    """Devuelve la lista de problemas de una traduccion concreta."""
    p = []
    es = e['es']
    if not texto.strip():
        return ['vacia']
    if texto.strip() == es.strip() and e['tipo'] not in ('nombre-modelo', 'etiqueta'):
        p.append('identica al espanol (¿sin traducir?)')

    # Con limite de palabra: sin el, "inscripciones" contenia "NSC" y
    # "Panamera" contenia... nada, pero el falso positivo era real y ruidoso.
    es_p, tx_p = plano(es), plano(texto)
    for t in INVARIANTES:
        pat = r'\b' + re.escape(plano(t)) + r'\b'
        if len(re.findall(pat, es_p)) > len(re.findall(pat, tx_p)):
            p.append(f'falta el termino invariante "{t}"')

    if sorted(ETIQUETAS.findall(es)) != sorted(ETIQUETAS.findall(texto)):
        p.append('las etiquetas HTML no coinciden con el original')

    rutas_es = {x for g in RUTAS.findall(es) for x in g if x}
    rutas_tr = {x for g in RUTAS.findall(texto) for x in g if x}
    if rutas_es - rutas_tr:
        p.append(f'faltan rutas: {sorted(rutas_es - rutas_tr)[:3]}')

    # Las cifras se conservan; el separador de miles cambia segun el idioma.
    # La puntuacion se quita ANTES de medir la longitud: si no, "tracción 4,"
    # daba la cifra "4," de dos caracteres en el original y "4" de uno en la
    # traduccion, y parecia que faltaba.
    def norm(s):
        fuera = set()
        for x in CIFRAS.findall(s):
            limpio = re.sub(r'[.,\s]', '', x)
            if len(limpio) > 1:
                fuera.add(limpio)
        return fuera
    faltan = norm(es) - norm(texto)
    if faltan:
        p.append(f'faltan cifras del original: {sorted(faltan)[:4]}')

    lim = e.get('limiteCaracteres')
    if lim and len(texto) > lim * 1.25:
        p.append(f'{len(texto)} caracteres, muy por encima del limite de {lim}')
    return p


def textos(d):
    """Todas las cadenas traducibles de una pagina o ficha, en orden estable."""
    fuera = []
    m = d.get('meta', {})
    fuera += [m.get('titulo', ''), m.get('descripcion', '')]
    if 'h1' in d:
        fuera.append(d['h1'])
    for s in d.get('secciones', []):
        fuera += [s['titulo']] + s['parrafos'] + s['items']
    for a in d.get('acordeones', []):
        fuera += [a['modelo']] + a['parrafos'] + a['items']
    for b in ('intro', 'galeria', 'ingenieria', 'exterior', 'interior',
              'procedencia', 'specs', 'opinion', 'kit'):
        x = d.get(b)
        if isinstance(x, dict):
            fuera += [x.get('etiqueta', ''), x.get('titulo', '')] + x.get('parrafos', [])
    if 'hero' in d:
        fuera += [d['hero'].get(k, '') for k in ('eyebrow', 'claim', 'precioLabel')]
    if 'cierre' in d:
        fuera += [d['cierre'].get(k, '') for k in ('cita', 'precioLabel', 'ctaTexto', 'aviso', 'nota')]
    if 'intro' in d:
        fuera.append(d['intro'].get('cita', ''))
    if 'exterior' in d:
        fuera.append(d['exterior'].get('texto', ''))
        fuera += [f.get('caption', '') for f in d['exterior'].get('fotos', [])]
    if 'interior' in d:
        fuera.append(d['interior'].get('editorial', ''))
        fuera += [f.get('caption', '') for f in d['interior'].get('fotos', [])]
    if 'ingenieria' in d:
        fuera += d['ingenieria'].get('tags', [])
        fuera += [x['etiqueta'] for x in d['ingenieria'].get('stats', [])]
    for h in d.get('procedencia', {}).get('hitos', []):
        fuera += [h.get('titulo', ''), h.get('cuerpo', ''), h.get('badge', '')]
    for c in d.get('kit', {}).get('categorias', []):
        fuera += [c['titulo']] + c['items']
    op = d.get('opinion') or {}
    fuera += [op.get(k, '') for k in ('rol', 'bio', 'intro', 'prosTitulo', 'contrasTitulo')]
    fuera += op.get('pros', []) + op.get('contras', [])
    cat = d.get('catalogo') or {}
    fuera += [cat.get(k, '') for k in ('estadoTexto', 'descripcion', 'detalle')]
    for b in ('galeria', 'exterior', 'interior'):
        fuera += [f.get('alt', '') for f in d.get(b, {}).get('fotos', [])]
    for s in d.get('secciones', []):
        fuera += [i.get('alt', '') for i in s.get('imagenes', [])]
    return [x for x in fuera if x and len(x) > 3]


def cobertura(recibidas, esperadas):
    """Cuantas de las cadenas que esta pagina tiene en el export han llegado.

    La primera version contaba cuantas cadenas DIFIERAN del espanol, y daba
    falsos negativos: "Interior", "Motor" o "Perfil lateral" son identicas en
    catalan, y una pagina bien traducida se quedaba por debajo del umbral.
    Lo que importa no es que el texto cambie, sino que el traductor lo haya
    revisado."""
    return {'hechas': recibidas, 'total': esperadas,
            'completa': recibidas >= esperadas}


# ─────────────────────────────────────────────────────── escritura por destino
def aplica_pagina(destino, idioma, texto, cache):
    _, nombre, campo = destino.split(':', 2)
    f = PAGINAS / f'{nombre}.{idioma}.json'
    if f not in cache:
        base = json.loads((PAGINAS / f'{nombre}.json').read_text())
        cache[f] = json.loads(f.read_text()) if f.exists() else base
    d = cache[f]
    if campo == 'meta.titulo':      d['meta']['titulo'] = texto
    elif campo == 'meta.descripcion': d['meta']['descripcion'] = texto
    elif campo == 'h1':             d['h1'] = texto
    elif m := re.fullmatch(r's(\d+)\.titulo', campo):  d['secciones'][int(m[1])]['titulo'] = texto
    elif m := re.fullmatch(r's(\d+)\.p(\d+)', campo):  d['secciones'][int(m[1])]['parrafos'][int(m[2])] = texto
    elif m := re.fullmatch(r's(\d+)\.i(\d+)', campo):  d['secciones'][int(m[1])]['items'][int(m[2])] = texto
    elif m := re.fullmatch(r's(\d+)\.alt(\d+)', campo): d['secciones'][int(m[1])]['imagenes'][int(m[2])]['alt'] = texto
    elif m := re.fullmatch(r'a(\d+)\.modelo', campo):  d['acordeones'][int(m[1])]['modelo'] = texto
    elif m := re.fullmatch(r'a(\d+)\.p(\d+)', campo):  d['acordeones'][int(m[1])]['parrafos'][int(m[2])] = texto
    elif m := re.fullmatch(r'a(\d+)\.i(\d+)', campo):  d['acordeones'][int(m[1])]['items'][int(m[2])] = texto
    else: raise KeyError(f'campo desconocido en {destino}')


def aplica_coche(destino, idioma, texto, cache):
    _, slug, campo = destino.split(':', 2)
    fuente = next(p for p in COCHES.glob('*.json')
                  if '.' not in p.stem and json.loads(p.read_text())['slug'] == slug)
    f = COCHES / f'{fuente.stem}.{idioma}.json'
    if f not in cache:
        cache[f] = json.loads(f.read_text()) if f.exists() else json.loads(fuente.read_text())
    d = cache[f]
    if m := re.fullmatch(r'meta\.(titulo|descripcion)', campo): d['meta'][m[1]] = texto
    elif m := re.fullmatch(r'hero\.(\w+)', campo):    d['hero'][m[1]] = texto
    elif m := re.fullmatch(r'cierre\.(\w+)', campo):  d['cierre'][m[1]] = texto
    elif m := re.fullmatch(r'(\w+)\.(etiqueta|titulo)', campo): d[m[1]][m[2]] = texto
    elif m := re.fullmatch(r'(\w+)\.p(\d+)', campo):  d[m[1]]['parrafos'][int(m[2])] = texto
    elif m := re.fullmatch(r'intro\.dato(\d+)', campo): d['intro']['datos'][int(m[1])]['clave'] = texto
    elif m := re.fullmatch(r'galeria\.cap(\d+)', campo): d['galeria']['fotos'][int(m[1])]['caption'] = texto
    elif m := re.fullmatch(r'specs\.g(\d+)\.titulo', campo): d['specs']['grupos'][int(m[1])]['titulo'] = texto
    elif m := re.fullmatch(r'specs\.g(\d+)\.f(\d+)', campo): d['specs']['grupos'][int(m[1])]['filas'][int(m[2])]['clave'] = texto
    elif campo == 'intro.cita':        d['intro']['cita'] = texto
    elif campo == 'exterior.texto':    d['exterior']['texto'] = texto
    elif campo == 'interior.editorial': d['interior']['editorial'] = texto
    elif m := re.fullmatch(r'ingenieria\.tag(\d+)', campo):  d['ingenieria']['tags'][int(m[1])] = texto
    elif m := re.fullmatch(r'ingenieria\.stat(\d+)', campo): d['ingenieria']['stats'][int(m[1])]['etiqueta'] = texto
    elif m := re.fullmatch(r'procedencia\.h(\d+)\.(titulo|cuerpo|badge)', campo):
        d['procedencia']['hitos'][int(m[1])][m[2]] = texto
    elif m := re.fullmatch(r'kit\.c(\d+)\.titulo', campo): d['kit']['categorias'][int(m[1])]['titulo'] = texto
    elif m := re.fullmatch(r'kit\.c(\d+)\.i(\d+)', campo): d['kit']['categorias'][int(m[1])]['items'][int(m[2])] = texto
    elif m := re.fullmatch(r'opinion\.pro(\d+)', campo):    d['opinion']['pros'][int(m[1])] = texto
    elif m := re.fullmatch(r'opinion\.contra(\d+)', campo): d['opinion']['contras'][int(m[1])] = texto
    elif m := re.fullmatch(r'opinion\.(rol|bio|intro|prosTitulo|contrasTitulo)', campo):
        d['opinion'][m[1]] = texto
    elif m := re.fullmatch(r'catalogo\.(estadoTexto|descripcion|detalle)', campo):
        d['catalogo'][m[1]] = texto
    elif m := re.fullmatch(r'(galeria|exterior|interior)\.alt(\d+)', campo):
        d[m[1]]['fotos'][int(m[2])]['alt'] = texto
    elif m := re.fullmatch(r'(exterior|interior)\.cap(\d+)', campo):
        d[m[1]]['fotos'][int(m[2])]['caption'] = texto
    else: raise KeyError(f'campo desconocido en {destino}')


def aplica_post(destino, idioma, texto, cache):
    _, slug, campo = destino.split(':', 2)
    clave = (slug, idioma)
    if clave not in cache:
        es = (MAGAZINE / 'es' / f'{slug}.md').read_text()
        _, fm, cuerpo = es.split('---', 2)
        cache[clave] = {'fm': fm, 'cuerpo': cuerpo.strip()}
    d = cache[clave]
    if campo == 'title':    d['fm'] = re.sub(r'^title: .*$', f'title: "{texto}"', d['fm'], 1, re.M)
    elif campo == 'excerpt': d['fm'] = re.sub(r'^excerpt: .*$', f'excerpt: "{texto}"', d['fm'], 1, re.M)
    elif campo == 'cta':    d['fm'] = re.sub(r'^  - texto: .*$', f'  - texto: "{texto}"', d['fm'], 1, re.M)
    elif campo == 'cuerpo': d['cuerpo'] = texto
    else: raise KeyError(f'campo desconocido en {destino}')


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    entrada = Path(sys.argv[1])
    solo = None
    if '--solo' in sys.argv:
        solo = set(sys.argv[sys.argv.index('--solo') + 1].split(','))
    forzar = '--forzar' in sys.argv

    doc = json.loads(entrada.read_text())
    ref = {e['id']: e for e in json.loads(ORIGEN.read_text())['entradas']}
    idiomas = doc.get('idiomas', ['en', 'fr', 'de', 'it', 'ca'])

    problemas, aplicables = [], []
    for e in doc['entradas']:
        base = ref.get(e['id'])
        if base is None:
            problemas.append((e['id'], '-', 'id no reconocido'))
            continue
        if e.get('es', base['es']).strip() != base['es'].strip():
            problemas.append((e['id'], '-', 'el texto en espanol ha cambiado'))
            continue
        for i in idiomas:
            if solo and i not in solo:
                continue
            texto = e.get(i, '')
            if not texto.strip():
                continue
            for p in valida(base, i, texto, e):
                problemas.append((e['id'], i, p))
            aplicables.append((base.get('destinos', [e['id']]), i, texto))

    n_dest = sum(len(d) for d, _, _ in aplicables)
    print(f'Entradas en el fichero : {len(doc["entradas"])}')
    print(f'Traducciones a aplicar : {len(aplicables)} ({n_dest} destinos)')
    if problemas:
        graves = [p for p in problemas if 'sin traducir' not in p[2]]
        print(f'\nAvisos y errores ({len(problemas)}):')
        for i, (eid, idi, p) in enumerate(problemas[:30]):
            print(f'  {idi:>3}  {eid[:52]:52} {p}')
        if len(problemas) > 30:
            print(f'  … y {len(problemas) - 30} mas')
        if graves and not forzar:
            print('\nNo se ha escrito nada. Corrige el fichero o repite con --forzar.')
            return 1

    # Cuantas cadenas espera cada pagina o ficha, segun el export
    esperadas = defaultdict(int)
    for e in ref.values():
        for d in e.get('destinos', [e['id']]):
            partes = d.split(':')
            if partes[0] in ('pagina', 'coche'):
                esperadas[(partes[0], partes[1])] += 1

    cache_pag, cache_coche, cache_post = {}, {}, {}
    recibidas = defaultdict(int)
    for destinos, idioma, texto in aplicables:
        for destino in destinos:
            tipo, clave = destino.split(':')[0], destino.split(':')[1]
            if tipo == 'pagina':  aplica_pagina(destino, idioma, texto, cache_pag)
            elif tipo == 'coche': aplica_coche(destino, idioma, texto, cache_coche)
            elif tipo == 'post':  aplica_post(destino, idioma, texto, cache_post)
            if tipo in ('pagina', 'coche'):
                recibidas[(tipo, clave, idioma)] += 1

    # Una pagina solo se publica en un idioma cuando esta ENTERA en ese idioma.
    # Si no, se publicaria una pagina "alemana" con el 90% del texto en espanol:
    # contenido duplicado y una mala experiencia para quien llegue por Google.
    for f, d in cache_pag.items():
        nombre, idioma = f.stem.rsplit('.', 1)
        d['traduccion'] = cobertura(recibidas[('pagina', nombre, idioma)],
                                    esperadas[('pagina', nombre)])
        f.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
    for f, d in cache_coche.items():
        _, idioma = f.stem.rsplit('.', 1)
        d['traduccion'] = cobertura(recibidas[('coche', d['slug'], idioma)],
                                    esperadas[('coche', d['slug'])])
        f.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
    # Un articulo solo se escribe si su CUERPO esta traducido.
    #
    # Sin esto, traducir una cadena compartida como "Mas informacion" -cuyo
    # texto vive en el boton de trece articulos distintos- creaba trece
    # ficheros ingleses con el cuerpo entero en espanol, y se publicaban.
    escritos_post, saltados = 0, []
    for (slug, idioma), d in cache_post.items():
        cuerpo_es = (MAGAZINE / 'es' / f'{slug}.md').read_text().split('---', 2)[2].strip()
        ya_existe = (MAGAZINE / idioma / f'{slug}.md').exists()
        if d['cuerpo'].strip() == cuerpo_es and not ya_existe:
            saltados.append(f'{idioma}/{slug}')
            continue
        fm = re.sub(r'^lang: .*$', f'lang: {idioma}', d['fm'], 1, re.M)
        destino = MAGAZINE / idioma / f'{slug}.md'
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text('---' + fm + '---\n' + d['cuerpo'] + '\n')
        escritos_post += 1

    print(f'\nEscritos: {len(cache_pag)} paginas, {len(cache_coche)} fichas, '
          f'{escritos_post} articulos')
    if saltados:
        print(f'\n{len(saltados)} articulos sin escribir: solo llego una cadena '
              f'suelta y el cuerpo seguia en espanol.')
        for x in saltados[:8]:
            print(f'  {x}')
    incompletas = [(f.name, d['traduccion']) for f, d in
                   list(cache_pag.items()) + list(cache_coche.items())
                   if not d['traduccion']['completa']]
    if incompletas:
        print(f'\n{len(incompletas)} sin terminar; NO se publicaran hasta estarlo:')
        for n, t in incompletas[:15]:
            print(f"  {n:32} {t['hechas']}/{t['total']} cadenas")
    print('Ejecuta `npm run build` en sitio/ para comprobar el hreflang.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
