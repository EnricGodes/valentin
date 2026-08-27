#!/usr/bin/env python3
"""
Aplica las traducciones de _migracion/traducciones/ sobre los datos del sitio.

Las traducciones viven en JSON, no en el codigo, para que se puedan revisar y
editar sin tocar Python. Este script solo comprueba y coloca.

Lo que comprueba antes de escribir, porque es lo que se rompe en silencio:
  · misma cantidad de secciones y de parrafos que el original
  · los terminos invariantes del glosario siguen sin traducir
  · no quedan restos de texto sin acentuar en aleman, italiano o catalan
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
TRAD = RAIZ / '_migracion' / 'traducciones'
DATOS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'

# Del glosario: no se traducen en ningun idioma
INVARIANTES = ['IMS', 'bore scoring', 'TECHART', 'P.P.N.', 'Porsche Partner Network',
               'Porsche', 'GT3', 'GT2', 'Turbo', 'Cayman', 'Boxster', 'Cayenne',
               'Macan', 'transaxle', 'Motorsport', 'Valentin Motors']

# Senales de texto sin acentuar. Solo formas que NO existen en el idioma: en
# catalan "al mes" es correcto sin acento (mes = month), asi que no vale como
# senal; "instal.lacio" sin ele geminada si.
SOSPECHOSO = {
    'de': [r'\bfuer\b', r'\bueber\b', r'\bkoennen\b', r'\bmoeglich\b',
           r'\bWerkstaetten\b', r'\bgroesse\b', r'\bausserdem\b'],
    'it': [r'\bpiu\b', r'\bperche\b', r'\bgia\b', r'\bsara\b', r'\bqualita\b',
           r'\bspecialita\b', r'\bnovita\b'],
    'ca': [r'\binstallaci', r'\bconeixer\b', r'\bexperiencia\b', r'\brestauracio\b',
           r'\binspeccio\b', r'\bdecisio\b', r'\btecnic\b'],
}


def comprueba(idioma, base, trad):
    fallos = []
    if len(trad['secciones']) != len(base['secciones']):
        fallos.append(f"{len(trad['secciones'])} secciones frente a {len(base['secciones'])}")
    for i, (s, (titulo, parrafos)) in enumerate(zip(base['secciones'], trad['secciones'])):
        if len(parrafos) != len(s['parrafos']):
            fallos.append(f"seccion {i} ({titulo[:26]}): {len(parrafos)} parrafos frente a {len(s['parrafos'])}")

    texto = json.dumps(trad, ensure_ascii=False)
    base_txt = json.dumps(base, ensure_ascii=False)
    # Sin distinguir mayusculas: el aleman escribe "Transaxle Modelle" con
    # mayuscula y el ingles "motorsport preparation" en minuscula, y las dos
    # formas son correctas. Lo que se comprueba es que el termino siga ahi.
    texto_min, base_min = texto.lower(), base_txt.lower()
    for term in INVARIANTES:
        t = term.lower()
        if t in base_min and t not in texto_min:
            fallos.append(f'termino invariante desaparecido: "{term}"')
    for patron in SOSPECHOSO.get(idioma, []):
        m = re.search(patron, texto)
        if m:
            fallos.append(f'posible texto sin acentuar: "{m.group(0)}"')
    return fallos


def aplicar(pagina, idioma):
    base = json.loads((DATOS / f'{pagina}.json').read_text())
    trad = json.loads((TRAD / f'{pagina}.{idioma}.json').read_text())
    fallos = comprueba(idioma, base, trad)
    if fallos:
        return None, fallos

    base['meta']['titulo'] = trad['meta_titulo']
    base['meta']['descripcion'] = trad['meta_desc']
    base['h1'] = trad['h1']
    for s, (titulo, parrafos) in zip(base['secciones'], trad['secciones']):
        s['titulo'] = titulo
        s['parrafos'] = parrafos
    destino = DATOS / f'{pagina}.{idioma}.json'
    destino.write_text(json.dumps(base, indent=2, ensure_ascii=False) + '\n')
    return destino, []


def main():
    pendientes = sorted(TRAD.glob('*.*.json'))
    if not pendientes:
        print('No hay traducciones en _migracion/traducciones/')
        return 0
    errores = 0
    for f in pendientes:
        pagina, idioma, _ = f.name.rsplit('.', 2)
        destino, fallos = aplicar(pagina, idioma)
        if fallos:
            errores += 1
            print(f'  FALLA  {f.name}')
            for x in fallos:
                print(f'           {x}')
        else:
            n = len(json.dumps(json.loads(destino.read_text()), ensure_ascii=False))
            print(f'  ok     {destino.name:24} {n:>6} bytes')
    print(f'\n{len(pendientes) - errores}/{len(pendientes)} traducciones aplicadas')
    return 1 if errores else 0


if __name__ == '__main__':
    sys.exit(main())
