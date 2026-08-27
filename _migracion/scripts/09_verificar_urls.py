#!/usr/bin/env python3
"""
Verificacion de paridad de URLs: ninguna URL del sitio viejo puede acabar en 404.

Para cada URL del inventario comprueba, sin levantar servidor, si el sitio nuevo
la sirve (existe el HTML en dist/) o si hay una regla en public/_redirects que la
capture. Y verifica ademas que el destino de cada 301 existe de verdad: una
redireccion a una pagina que no existe es un 404 con pasos extra.

Uso: `npm run build` en sitio/, luego este script.
"""
import csv, re, sys
from pathlib import Path
from urllib.parse import unquote

RAIZ = Path(__file__).resolve().parent.parent.parent
DIST = RAIZ / 'sitio' / 'dist'
REDIRECTS = RAIZ / 'sitio' / 'public' / '_redirects'
INVENTARIO = RAIZ / '_migracion' / 'informes' / 'inventario_urls.csv'


def paginas():
    """Rutas que el sitio nuevo sirve, tal y como quedan en dist/.

    La raiz NO se da por servida: se comprueba que exista dist/index.html como
    cualquier otra. La primera version de este script la anadia a mano y por eso
    informaba de "0 clics en riesgo" mientras faltaba la home, que es la pagina
    con mas trafico del sitio. Una red de seguridad que miente es peor que no
    tenerla.
    """
    fuera = set()
    for f in DIST.rglob('*.html'):
        r = '/' + str(f.relative_to(DIST)).replace('\\', '/')
        r = r[:-len('.html')]
        if r == '/index':
            fuera.add('/')
            continue
        fuera.add(r)
        if r.endswith('/index'):
            fuera.add(r[:-len('/index')])
    return fuera


def reglas():
    fuera = []
    if not REDIRECTS.exists():
        return fuera
    for linea in REDIRECTS.read_text().splitlines():
        linea = linea.strip()
        if not linea or linea.startswith('#'):
            continue
        partes = linea.split()
        if len(partes) >= 2:
            fuera.append((partes[0], partes[1]))
    return fuera


def casa(patron, ruta):
    """Coincidencia estilo _redirects de Cloudflare: * es comodin."""
    if '*' not in patron:
        return patron == ruta
    return re.fullmatch(re.escape(patron).replace(r'\*', '.*'), ruta) is not None


def resolver(ruta, reglas_, servidas, saltos=0):
    """Devuelve (estado, destino_final)."""
    if ruta in servidas:
        return '200', ruta
    if unquote(ruta) in servidas:
        return '200', unquote(ruta)
    for patron, destino in reglas_:
        if casa(patron, ruta):
            if saltos >= 5:
                return 'BUCLE', destino
            estado, final = resolver(destino, reglas_, servidas, saltos + 1)
            return ('301' if estado == '200' else f'301->{estado}'), final
    return '404', ruta


def main():
    if not DIST.exists():
        sys.exit('No existe sitio/dist. Ejecuta `npm run build` en sitio/ primero.')

    servidas, reglas_ = paginas(), reglas()
    filas = list(csv.DictReader(INVENTARIO.open()))

    conteo, problemas = {}, []
    for f in filas:
        url = f['url']
        clics, vistas = int(f['gsc_clics_3m']), int(f['ga4_vistas_56d'])
        estado, final = resolver(url, reglas_, servidas)
        # Las fichas a revivir todavia no existen: es trabajo pendiente, no un fallo
        if f['accion'] == 'REVIVIR' and estado == '404':
            estado = 'PENDIENTE'
        conteo[estado] = conteo.get(estado, 0) + 1
        if estado not in ('200', '301'):
            problemas.append((estado, url, final, clics, vistas))

    print(f'{len(filas)} URLs del sitio viejo verificadas contra el sitio nuevo\n')
    for k in sorted(conteo):
        print(f'  {k:12} {conteo[k]}')

    graves = [p for p in problemas if p[0] not in ('PENDIENTE',)]
    if problemas:
        print(f'\nA resolver ({len(problemas)}):')
        for estado, url, final, clics, vistas in sorted(problemas, key=lambda x: -x[3]):
            trafico = f'{clics} clics' if clics else (f'{vistas} vistas' if vistas else 'sin trafico')
            print(f'  {estado:10} {url[:60]:60} {trafico}')

    perdidos = sum(p[3] for p in graves)
    print(f'\nClics organicos en riesgo: {perdidos}')
    return 1 if graves else 0


if __name__ == '__main__':
    sys.exit(main())
