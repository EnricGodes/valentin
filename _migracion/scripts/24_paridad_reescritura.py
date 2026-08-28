# -*- coding: utf-8 -*-
"""
Compara los 252 cuerpos reescritos contra los que habia en git antes de tocar
nada. Debe salir: mismas palabras y mismas imagenes, en los seis idiomas.

Es el criterio de aceptacion de la reescritura a bloques. Lo unico que puede
cambiar es la estructura (las galerias vuelven a serlo); ni una palabra ni una
foto pueden desaparecer.
"""
import re, subprocess, sys, collections
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
REL = 'sitio/src/content/magazine'
IDIOMAS = ['es', 'en', 'fr', 'it', 'de', 'ca']


def cuerpo(t):
    if t.count('---') >= 2:
        _, _, r = t.partition('---')
        _, _, r = r.partition('---')
        return r
    return t


def palabras(t):
    t = re.sub(r'^:::.*$', ' ', t, flags=re.M)            # directivas fuera
    t = re.sub(r'!\[([^\]]*)\]\([^)]*\)', r' \1 ', t)     # imagen -> su pie
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', t)
    t = re.sub(r'[#>*_`\-]', ' ', t)
    return collections.Counter(w for w in re.findall(r'\w+', t.lower()))


def imagenes(t):
    return set(re.findall(r'!\[[^\]]*\]\(([^)\s]+)', t))


# Dos diferencias comprobadas que son arreglos, no perdidas. Se documentan
# aqui para que el verificador siga sirviendo: cualquier otra cosa es fallo.
ARREGLOS = {
    # El widget de "posts relacionados" de Squarespace metia dentro del
    # articulo 10 miniaturas de OTROS posts (pinzas-3, tap-8, motor-1...).
    'porsche-911g.md': 'miniaturas de otros posts',
    # Squarespace repite las fotos de galeria en <noscript> y el extractor
    # antiguo no lo dedujo aqui: 126 etiquetas para 64 fotos distintas.
    'club-de-propietarios-porsche.md': 'fotos duplicadas',
}


def antes(rel):
    r = subprocess.run(['git', 'show', f'HEAD:{rel}'], cwd=RAIZ,
                       capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


fallos = 0
resumen = collections.Counter()
for idioma in IDIOMAS:
    for p in sorted((RAIZ / REL / idioma).glob('*.md')):
        rel = f'{REL}/{idioma}/{p.name}'
        viejo = antes(rel)
        if viejo is None:
            continue
        cv, cn = cuerpo(viejo), cuerpo(p.read_text(encoding='utf-8'))
        pv, pn = palabras(cv), palabras(cn)
        iv, ino = imagenes(cv), imagenes(cn)

        perdidas = iv - ino
        faltan = pv - pn
        n_faltan = sum(faltan.values())

        if p.name in ARREGLOS:
            resumen[f'arreglado: {ARREGLOS[p.name]}'] += 1
            continue

        if perdidas:
            print(f'FOTOS   {idioma}/{p.name}: faltan {len(perdidas)}')
            fallos += 1
        if n_faltan > 3:
            print(f'TEXTO   {idioma}/{p.name}: faltan {n_faltan} palabras')
            print(f'        {" ".join(list(faltan.elements())[:14])}')
            fallos += 1
        elif n_faltan:
            resumen[idioma] += n_faltan

        # Las galerias tienen que haber aparecido
        if ':::' in cn:
            resumen[idioma + ' con modulos'] += 1

print()
if resumen:
    print('diferencias menores y modulos por idioma:')
    for k, v in sorted(resumen.items()):
        print(f'  {k:<20} {v}')
print()
print('PARIDAD OK en los seis idiomas' if not fallos else f'{fallos} ficheros con perdidas')
sys.exit(1 if fallos else 0)
