# -*- coding: utf-8 -*-
"""
Reescribe el cuerpo de los 252 posts (42 x 6 idiomas) desde el modelo de
bloques, expresando cada modulo como una directiva de Markdown.

Por que directivas y no JSON: mantiene los ficheros .md, el frontmatter, el
render() de Astro, post.body (del que salen el FAQ y la imagen de portada) y
las traducciones tal cual estan. Un CMS de modulos serializa exactamente a
esto, asi que no se pierde nada por el camino.

  ::: galeria {diseno=cuadricula porFila=3 proporcion=standard lightbox}
  ![alt](/img/magazine/a.jpg)
  ![alt](/img/magazine/b.jpg)
  :::

Las traducciones se resuelven por posicion: los 210 ficheros traducidos tienen
exactamente el mismo numero de parrafos que el espanol (comprobado), asi que
el parrafo i del espanol es el parrafo i del aleman. Las imagenes, los videos
y la configuracion de cada galeria son iguales en los seis idiomas.
"""
import json, re, sys
from difflib import SequenceMatcher
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
BLOQUES = RAIZ / '_migracion/contenido/bloques'
CONTENIDO = RAIZ / 'sitio/src/content/magazine'
IDIOMAS = ['es', 'en', 'fr', 'it', 'de', 'ca']


def partes(texto):
    """Cuerpo -> lista de parrafos, en el mismo criterio que la comprobacion
    de alineacion: se ignoran imagenes, HTML suelto y separadores."""
    trozos = [x.strip() for x in re.split(r'\n\s*\n', texto)]
    return [x for x in trozos
            if x and not x.startswith('![') and not x.startswith('<')
            and not x.startswith(':::') and x != '---']


def cuerpo_de(fichero):
    t = fichero.read_text(encoding='utf-8')
    if t.count('---') >= 2:
        cab, _, cuerpo = t.partition('---')
        _, _, cuerpo = cuerpo.partition('---')
        return t[:len(t) - len(cuerpo)], cuerpo
    return '', t


def directiva(tipo, atributos, dentro=""):
    """Sintaxis de remark-directive: `:::nombre{clave="valor"}`.

    Sin espacio tras los dos puntos y sin espacio antes de las llaves. Con
    espacio el parser no reconoce la directiva y los `:::` se publican en
    crudo dentro del articulo.
    """
    at = " ".join(k if isinstance(v, bool) else '{}="{}"'.format(k, v)
                  for k, v in atributos.items() if v not in (None, False, ""))
    cab = ":::" + tipo + ("{" + at + "}" if at else "")
    return cab + "\n" + dentro + "\n:::" if dentro else cab + "\n:::"


def alts_de(cuerpo):
    """Ruta de imagen -> texto alternativo, tal y como esta publicado.

    Los alt estan traducidos en cada idioma y no viajan con los bloques, que
    salen del espanol. Se mapean por ruta, no por posicion: asi aguantan que
    un post repita una foto o que el orden cambie."""
    m = {}
    for alt, src in re.findall(r'!\[([^\]]*)\]\(([^)\s]+)', cuerpo):
        if src not in m and alt.strip():
            m[src] = alt.strip()
    return m


def norm(s):
    s = re.sub(r'[*_`#>]', '', s)
    return re.sub(r'\W+', ' ', s.lower()).strip()


def prosa_de(bloques):
    """Recorre los bloques en orden de documento y devuelve la prosa que
    contienen. Los pies de foto cuentan: en el Markdown se leen bajo la
    imagen, son texto del articulo."""
    for b in bloques:
        if b['tipo'] == 'texto':
            for p in partes(b['md']):
                yield b, p
        elif b['tipo'] == 'imagen':
            if (b.get('pie') or '').strip():
                yield b, b['pie']
        elif b['tipo'] == 'galeria':
            for foto in b['fotos']:
                if (foto.get('pie') or '').strip():
                    yield (b, foto), foto['pie']


def mapear(bloques, parrafos_es):
    """Empareja cada parrafo de los bloques con su posicion en el Markdown
    espanol publicado. Devuelve la lista de indices.

    Se empareja por texto y avanzando. El texto publicado lleva 26
    correcciones aprobadas encima del original de Squarespace (la direccion
    de Varsovia, los guiones largos fuera), asi que ya no coincide letra a
    letra y hace falta buscar por parecido. Manda siempre lo publicado.
    """
    indices, cursor = [], 0
    claves = [norm(p) for p in parrafos_es]
    for _, texto in prosa_de(bloques):
        objetivo = norm(texto)
        if not objetivo:
            indices.append(None)
            continue

        i = claves.index(objetivo, cursor) if objetivo in claves[cursor:] else -1

        if i < 0:
            mejor, puntos = -1, 0.0
            for j in range(cursor, len(claves)):
                r = SequenceMatcher(None, objetivo, claves[j]).ratio()
                if r > puntos:
                    mejor, puntos = j, r
            i = mejor if puntos >= 0.75 else -1

        if i < 0:
            indices.append(None)
            continue

        indices.append(i)
        cursor = i + 1
    return indices


def escribir(bloques, parrafos, indices, alts):
    """Genera el cuerpo.

    Se emite por TRAMOS del texto publicado, no parrafo a parrafo: cada bloque
    de prosa se lleva todos los parrafos hasta el siguiente modulo. Asi, si el
    emparejador no reconoce un parrafo (porque lleva una correccion aprobada
    encima del original de Squarespace), ese parrafo se publica igual en su
    sitio en vez de perderse. Lo publicado nunca se tira.
    """
    salida = []
    it = iter(indices)
    limpio = lambda s: re.sub(r'^\*+|\*+$', '', s.strip())
    cursor = 0

    def hasta(fin):
        """Parrafos publicados desde el cursor hasta `fin` inclusive."""
        nonlocal cursor
        if fin is None or fin < cursor:
            return []
        trozo = parrafos[cursor:fin + 1]
        cursor = fin + 1
        return trozo

    for b in bloques:
        if b['tipo'] == 'texto':
            marcas = [next(it) for _ in range(len(partes(b['md'])))]
            reales = [i for i in marcas if i is not None]
            trozo = hasta(max(reales)) if reales else []
            if trozo:
                salida.append('\n\n'.join(trozo))

        elif b['tipo'] == 'galeria':
            lineas = []
            for f in b['fotos']:
                pie = ''
                if (f.get('pie') or '').strip():
                    i = next(it)
                    pie = limpio(parrafos[i]) if i is not None else ''
                    if i is not None:
                        cursor = max(cursor, i + 1)
                alt = alts.get(f['src']) or (f.get('alt') or '').strip() or pie
                titulo = f' "{pie}"' if pie and pie != alt else ''
                lineas.append(f'![{alt}]({f["src"]}{titulo})')
            salida.append(directiva('galeria', {
                'diseno': b['diseno'], 'porFila': b['porFila'],
                'proporcion': b['proporcion'], 'lightbox': b['lightbox'],
            }, '\n'.join(lineas)))

        elif b['tipo'] == 'imagen':
            pie = ''
            if (b.get('pie') or '').strip():
                i = next(it)
                pie = limpio(parrafos[i]) if i is not None else ''
                if i is not None:
                    cursor = max(cursor, i + 1)
            alt = alts.get(b['src']) or (b.get('alt') or '').strip() or pie
            salida.append(f'![{alt}]({b["src"]})' + (f'\n\n*{pie}*' if pie else ''))

        elif b['tipo'] == 'video':
            salida.append(directiva('video', {
                'src': b['src'], 'ancho': b.get('ancho'), 'alto': b.get('alto'),
            }))

        elif b['tipo'] == 'youtube':
            salida.append(directiva('youtube', {'id': b['id']}))

        elif b['tipo'] == 'herramienta':
            # Calculadora incrustada. Va en el modelo de bloques y no solo en
            # el Markdown para que una pasada de este script no la borre.
            salida.append(directiva('herramienta', {'id': b['id']}))

    # Lo que quede sin colocar va al final antes que perderse.
    resto = parrafos[cursor:]
    if resto:
        salida.append('\n\n'.join(resto))

    return '\n\n'.join(x for x in salida if x).strip() + '\n'


def main():
    # slugSquarespace -> bloques
    porslug = {}
    for f in BLOQUES.glob('*.json'):
        d = json.loads(f.read_text(encoding='utf-8'))
        porslug[d['slugSquarespace']] = d['bloques']

    # slugSquarespace -> fichero espanol
    ficheros_es = {}
    for p in (CONTENIDO / 'es').glob('*.md'):
        m = re.search(r'^slugSquarespace:\s*"([^"]+)"', p.read_text(encoding='utf-8'), re.M)
        if m:
            ficheros_es[m.group(1)] = p

    escritos = 0
    saltados = []
    for slug, bloques in sorted(porslug.items()):
        if slug not in ficheros_es:
            saltados.append(slug)
            continue
        nombre = ficheros_es[slug].name
        _, cuerpo_es = cuerpo_de(ficheros_es[slug])
        parrafos_es = partes(cuerpo_es)

        indices = mapear(bloques, parrafos_es)
        if indices is None:
            saltados.append(f'{nombre}: no casa el texto con el espanol')
            continue

        for idioma in IDIOMAS:
            f = CONTENIDO / idioma / nombre
            if not f.exists():
                continue
            cab, cuerpo = cuerpo_de(f)
            props = partes(cuerpo)
            # Los seis idiomas tienen el mismo numero de parrafos: si no, el
            # indice apuntaria a otra frase y se colaria texto cambiado.
            if len(props) != len(parrafos_es):
                saltados.append(f'{idioma}/{nombre} ({len(props)} vs {len(parrafos_es)})')
                continue
            f.write_text(cab + '\n' + escribir(bloques, props, indices, alts_de(cuerpo)),
                         encoding='utf-8')
            escritos += 1

    print(f'cuerpos reescritos: {escritos}')
    if saltados:
        print(f'\nSALTADOS ({len(saltados)}):')
        for s in saltados[:12]:
            print(f'  {s}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
