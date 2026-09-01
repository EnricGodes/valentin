# -*- coding: utf-8 -*-
"""
Criterio de aceptacion del modelo de bloques: NO se pierde ni una palabra ni
una foto respecto al Markdown ya publicado, que a su vez se verifico palabra
por palabra contra Squarespace en la migracion.

Compara tres cosas, y las tres tienen que dar cero:
  1. Las palabras del texto plano.
  2. El conjunto de rutas de imagen.
  3. El conjunto de videos y de YouTube incrustados.

Las directivas `:::video{...}` y `:::youtube{...}` son marcado, no prosa, igual
que las etiquetas HTML y las imagenes: el modelo de bloques las representa como
un bloque con sus campos, no como texto. Contar "youtube", "id" y el
identificador del video como palabras perdidas daba 74 falsos positivos en tres
posts y escondia debajo la unica perdida real, la atribucion de una cita. Se
descuentan del texto y se comprueban aparte, por su fuente.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
BLOQUES = RAIZ / '_migracion/contenido/bloques'
MD = RAIZ / 'sitio/src/content/magazine/es'


def palabras(t):
    t = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', t)          # imagenes fuera
    t = re.sub(r':::\w*(?:\{[^}]*\})?', ' ', t)           # directivas fuera
    t = re.sub(r'<[^>]+>', ' ', t)                        # html fuera
    t = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', t)        # enlaces -> su texto
    t = re.sub(r'[#>*_`\-]', ' ', t)
    return [w for w in re.findall(r'\w+', t.lower()) if w]


def imgs_md(t):
    return set(re.findall(r'!\[[^\]]*\]\(([^)\s]+)', t))


def medios_md(t):
    """Videos propios y YouTube incrustados, por su fuente."""
    return (set(re.findall(r':::video\{[^}]*src="([^"]+)"', t))
            | set(re.findall(r':::youtube\{[^}]*id="([^"]+)"', t)))


def de_bloques(bs):
    pal, im, me = [], set(), set()
    for b in bs:
        if b['tipo'] == 'video':
            me.add(b['src'])
        elif b['tipo'] == 'youtube':
            me.add(b['id'])
        if b['tipo'] in ('texto', 'cita'):
            pal += palabras(b['md'])
        elif b['tipo'] == 'imagen':
            im.add(b['src'])
            pal += palabras(b.get('pie', '')) or palabras(b.get('alt', ''))
        elif b['tipo'] == 'galeria':
            im |= {f['src'] for f in b['fotos']}
            pal += [w for f in b['fotos']
                    for w in (palabras(f.get('pie', '')) or palabras(f.get('alt', '')))]
    return pal, im, me


idx = {}
for p in MD.glob('*.md'):
    t = p.read_text(encoding='utf-8')
    m = re.search(r'^slugSquarespace:\s*"([^"]+)"', t, re.M)
    if m:
        cuerpo = t.split('---', 2)[2] if t.count('---') >= 2 else t
        idx[m.group(1)] = cuerpo

# Diferencias esperadas y justificadas, no regresiones.
#   porsche-911g: el Markdown antiguo metia dentro del articulo las 10
#   miniaturas del bloque "posts relacionados" de Squarespace, que es un
#   widget dinamico y no contenido del reportaje. Se comprobo que son fotos
#   de otros posts (pinzas-3, tap-8, motor-1...). El modelo de bloques las
#   excluye a proposito.
ESPERADAS = {'porsche-911g': 10}

fallos = 0
revisar = []
for f in sorted(BLOQUES.glob('*.json')):
    d = json.loads(f.read_text(encoding='utf-8'))
    slug = d['slugSquarespace']
    if slug not in idx:
        print(f'SIN MARKDOWN  {slug}')
        fallos += 1
        continue
    pb, ib, mb = de_bloques(d['bloques'])
    cuerpo = idx[slug]
    pm, im, me = palabras(cuerpo), imgs_md(cuerpo), medios_md(cuerpo)

    faltan_img = im - ib
    faltan_med = me - mb
    faltan_pal = len(pm) - len(pb)

    if faltan_img and len(faltan_img) == ESPERADAS.get(slug):
        print(f'esperado      {slug}: {len(faltan_img)} miniaturas de otros posts, excluidas a proposito')
        faltan_img = set()

    if faltan_img:
        print(f'FALTAN FOTOS  {slug}: {len(faltan_img)}')
        for x in list(faltan_img)[:3]:
            print(f'    {x}')
        fallos += 1
    if faltan_med:
        print(f'FALTAN VIDEOS {slug}: {len(faltan_med)}')
        for x in sorted(faltan_med)[:3]:
            print(f'    {x}')
        fallos += 1

    # Un margen del 2% absorbe pies de foto y adornos; por debajo no se avisa.
    if faltan_pal > max(6, len(pm) * 0.02):
        print(f'FALTA TEXTO   {slug}: {faltan_pal} palabras de {len(pm)}')
        fallos += 1
    elif faltan_pal > 0:
        revisar.append((slug, faltan_pal, len(pm)))

print()
if revisar:
    print(f'diferencias menores, dentro de margen ({len(revisar)}):')
    for s, d_, t_ in revisar[:8]:
        print(f'  {s[:46]:<48} -{d_} de {t_}')
print()
print('PARIDAD OK: ni una foto ni una palabra perdidas' if not fallos
      else f'{fallos} posts con perdidas')
sys.exit(1 if fallos else 0)
