#!/usr/bin/env python3
"""
Rescata las imagenes de las paginas (home, servicios, centros...) del CDN de
Squarespace y reescribe las rutas en los JSON de datos.

Mismo motivo que con las del Magazine: el dia que se cancele la cuenta,
images.squarespace-cdn.com deja de servir.

Salida: contenido/imagenes-paginas/ y los JSON con rutas /img/paginas/<f>
"""
import hashlib, json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

RAIZ = Path(__file__).resolve().parent.parent.parent
DATOS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
DEST = RAIZ / '_migracion' / 'contenido' / 'imagenes-paginas'
RUTA_WEB = '/img/paginas/'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'


def nombre_local(url):
    h = hashlib.sha1(url.encode()).hexdigest()[:8]
    base = urllib.parse.unquote(url.rsplit('/', 1)[-1])
    base = re.sub(r'[^A-Za-z0-9._-]', '-', base).strip('-.') or 'imagen'
    base = re.sub(r'-{2,}', '-', base)[:80]
    if '.' not in base:
        base += '.jpg'
    return f'{h}-{base}'


def bajar(url):
    dest = DEST / nombre_local(url)
    if dest.exists() and dest.stat().st_size > 0:
        return url, dest.name, 'cache'
    for intento in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            if not data:
                raise ValueError('respuesta vacia')
            dest.write_bytes(data)
            return url, dest.name, 'ok'
        except Exception as e:
            if intento == 2:
                return url, None, f'{type(e).__name__}: {e}'
            time.sleep(1.5 * (intento + 1))


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    jsons = sorted(DATOS.glob('*.json'))
    urls = sorted({i['url'] for f in jsons
                   for s in json.loads(f.read_text())['secciones']
                   for i in s['imagenes']})
    if not urls:
        print('No hay imagenes que rescatar.')
        return 0

    print(f'{len(urls)} imagenes unicas\n')
    with ThreadPoolExecutor(max_workers=6) as ex:
        res = list(ex.map(bajar, urls))

    mapa = {u: RUTA_WEB + n for u, n, _ in res if n}
    fallos = [(u, e) for u, n, e in res if not n]

    tocados = pendientes = 0
    for f in jsons:
        t = orig = f.read_text()
        for u, local in mapa.items():
            t = t.replace(u, local)
        if t != orig:
            f.write_text(t)
            tocados += 1
        pendientes += len(re.findall(r'images\.squarespace-cdn\.com', t))

    mb = sum((DEST / n).stat().st_size for _, n, _ in res if n) / 1024 / 1024
    print(f'Descargadas : {len(mapa)}/{len(urls)}  ({mb:.1f} MB)')
    print(f'JSON        : {tocados} reescritos')
    print(f'Pendientes  : {pendientes} referencias al CDN de Squarespace')
    for u, e in fallos[:10]:
        print(f'  ERROR {e[:60]}  {u[:70]}')
    return 1 if (fallos or pendientes) else 0


if __name__ == '__main__':
    sys.exit(main())
