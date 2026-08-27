#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Traduce los title y las meta description reescritos en 19_reescribir_titles.py.

No es una traduccion literal del espanol: cada mercado busca con palabras
distintas. En aleman "Porsche Werkstatt" tiene volumen y "atelier" no significa
nada; en ingles se busca "servicing", no "maintenance tariffs".

Google corta el title por ANCHURA en pixeles (~580 en escritorio). El aleman
alarga entre un 20% y un 35% sobre el espanol, asi que es el idioma que hay que
vigilar: el script avisa de cualquiera que se pase.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
IDIOMAS = ['en', 'fr', 'de', 'it', 'ca']

PAGS = {
 'taller': {
  'en': ("Porsche workshop: services and servicing prices · Barcelona and Madrid",
         "Independent Porsche workshop since 1979. Fixed-price servicing, IMS and bore scoring repair, engine and gearbox restoration."),
  'fr': ("Atelier Porsche : prestations et tarifs · Barcelone et Madrid",
         "Atelier Porsche indépendant depuis 1979. Entretien à prix ferme, réparation IMS et bore scoring, réfection de moteurs et de boîtes."),
  'de': ("Porsche Werkstatt: Leistungen und Preise · Barcelona und Madrid",
         "Freie Porsche Werkstatt seit 1979. Wartung zum Festpreis, IMS- und Bore-Scoring-Reparatur, Motor- und Getriebeüberholung."),
  'it': ("Officina Porsche: servizi e tariffe · Barcellona e Madrid",
         "Officina Porsche indipendente dal 1979. Manutenzione a prezzo chiuso, riparazione IMS e bore scoring, restauro di motori e cambi."),
  'ca': ("Taller Porsche: serveis i tarifes · Barcelona i Madrid",
         "Taller Porsche independent des de 1979. Manteniment a preu tancat, reparació d’IMS i bore scoring, restauració de motors i caixes de canvis."),
 },
 'barcelona': {
  'en': ("Porsche workshop in Barcelona · Independent since 1979",
         "Porsche specialists at Varsòvia 65, next to the Ronda del Mig. Servicing, restoration, bodywork and sales across more than 1,300 m²."),
  'fr': ("Atelier Porsche à Barcelone · Indépendant depuis 1979",
         "Spécialistes Porsche au 65 Varsòvia, en bordure de la Ronda del Mig. Entretien, restauration, carrosserie et vente sur plus de 1 300 m²."),
  'de': ("Porsche Werkstatt in Barcelona · Frei seit 1979",
         "Porsche Spezialisten in der Varsòvia 65, an der Ronda del Mig. Wartung, Restaurierung, Karosserie und Verkauf auf mehr als 1.300 m²."),
  'it': ("Officina Porsche a Barcellona · Indipendente dal 1979",
         "Specialisti Porsche in Varsòvia 65, a fianco della Ronda del Mig. Manutenzione, restauro, carrozzeria e vendita in oltre 1.300 m²."),
  'ca': ("Taller Porsche a Barcelona · Independent des de 1979",
         "Especialistes Porsche a Varsòvia 65, al costat de la Ronda del Mig. Manteniment, restauració, xapa i pintura i venda en més de 1.300 m²."),
 },
 'madrid': {
  'en': ("Porsche workshop in Madrid · Leganés, since 1979",
         "Porsche specialists at Puig Adam 10, Leganés, twenty minutes from the centre. Servicing, full restoration and sales across more than 2,500 m²."),
  'fr': ("Atelier Porsche à Madrid · Leganés, depuis 1979",
         "Spécialistes Porsche au 10 Puig Adam, Leganés, à vingt minutes du centre. Entretien, restauration intégrale et vente sur plus de 2 500 m²."),
  'de': ("Porsche Werkstatt in Madrid · Leganés, seit 1979",
         "Porsche Spezialisten in der Puig Adam 10, Leganés, zwanzig Minuten vom Zentrum. Wartung, Restaurierung und Verkauf auf mehr als 2.500 m²."),
  'it': ("Officina Porsche a Madrid · Leganés, dal 1979",
         "Specialisti Porsche in Puig Adam 10, Leganés, a venti minuti dal centro. Manutenzione, restauro integrale e vendita in oltre 2.500 m²."),
  'ca': ("Taller Porsche a Madrid · Leganés, des de 1979",
         "Especialistes Porsche a Puig Adam 10, Leganés, a vint minuts del centre. Manteniment, restauració integral i venda en més de 2.500 m²."),
 },
 'tarifa-cayenne-macan': {
  'en': ("Porsche Cayenne and Macan servicing · Fixed prices",
         "Fixed servicing prices for the Cayenne and the Macan in Barcelona and Madrid. Minor and major service, common faults and no surprises."),
  'fr': ("Entretien Porsche Cayenne et Macan · Prix fermes",
         "Tarifs fermes d’entretien pour Cayenne et Macan à Barcelone et Madrid. Petit et grand entretien, pannes fréquentes et aucune surprise."),
  'de': ("Porsche Cayenne und Macan Wartung · Festpreise",
         "Feste Wartungspreise für Cayenne und Macan in Barcelona und Madrid. Kleine und große Inspektion, häufige Schäden, keine Überraschungen."),
  'it': ("Manutenzione Porsche Cayenne e Macan · Prezzi chiusi",
         "Tariffe chiuse di manutenzione per Cayenne e Macan a Barcellona e Madrid. Tagliando minore e maggiore, guasti frequenti e nessuna sorpresa."),
  'ca': ("Manteniment Porsche Cayenne i Macan · Preus tancats",
         "Tarifes tancades de manteniment per a Cayenne i Macan a Barcelona i Madrid. Servei menor i major, avaries freqüents i cap sorpresa."),
 },
 'tarifa-911': {
  'en': ("Porsche 911 servicing · Fixed prices by model",
         "Fixed servicing prices for the 911, from the Pre 74 to the 992. Minor service from €450, major service from €525. Barcelona and Madrid."),
  'fr': ("Entretien Porsche 911 · Prix fermes par modèle",
         "Tarifs fermes d’entretien de la 911, de la Pre 74 à la 992. Petit entretien dès 450 €, grand entretien dès 525 €. Barcelone et Madrid."),
  'de': ("Porsche 911 Wartung · Festpreise je Modell",
         "Feste Wartungspreise für den 911, vom Pre 74 bis zum 992. Kleine Inspektion ab 450 €, große ab 525 €. Barcelona und Madrid."),
  'it': ("Manutenzione Porsche 911 · Prezzi chiusi per modello",
         "Tariffe chiuse di manutenzione della 911, dalla Pre 74 alla 992. Tagliando minore da 450 €, maggiore da 525 €. Barcellona e Madrid."),
  'ca': ("Manteniment Porsche 911 · Preus tancats per model",
         "Tarifes tancades de manteniment del 911, del Pre 74 al 992. Servei menor des de 450 €, major des de 525 €. Barcelona i Madrid."),
 },
}

POSTS = {
 'que-es-el-ims-de-porsche': {
  'en': ("Porsche IMS: how to tell if your car is affected and how it is fixed",
         "The IMS affects the M96 and M97 engines from 1997 to 2008: 996, 997, Boxster and Cayman. How to tell if yours is affected, how it fails and the fix."),
  'fr': ("IMS Porsche : savoir si votre voiture est concernée et la réparer",
         "L’IMS concerne les moteurs M96 et M97 de 1997 à 2008 : 996, 997, Boxster et Cayman. Comment savoir si la vôtre est touchée et quelle est la solution."),
  'de': ("Porsche IMS: erkennen, ob Ihr Fahrzeug betroffen ist, und reparieren",
         "Die IMS betrifft die Motoren M96 und M97 von 1997 bis 2008: 996, 997, Boxster und Cayman. Wie Sie erkennen, ob Ihrer betroffen ist, und die Lösung."),
  'it': ("IMS Porsche: come sapere se la tua auto è interessata e ripararla",
         "L’IMS interessa i motori M96 e M97 dal 1997 al 2008: 996, 997, Boxster e Cayman. Come sapere se la tua è interessata, come cede e la soluzione."),
  'ca': ("IMS Porsche: com saber si el teu cotxe està afectat i com es repara",
         "L’IMS afecta els motors M96 i M97 del 1997 al 2008: 996, 997, Boxster i Cayman. Com saber si el teu Porsche està afectat i quina solució té."),
 },
 'porsche-bore-scoring': {
  'en': ("Porsche bore scoring: causes, symptoms and the fix",
         "Bore scoring affects the M96 and M97 from 1997 to 2008. How to spot it, why the sixth cylinder suffers most and why NSC sleeving is the only fix."),
  'fr': ("Bore scoring Porsche : causes, symptômes et solution",
         "Le bore scoring touche les M96 et M97 de 1997 à 2008. Comment le reconnaître, pourquoi le sixième cylindre souffre et pourquoi le NSC est la solution."),
  'de': ("Bore Scoring bei Porsche: Ursachen, Symptome, Lösung",
         "Bore Scoring betrifft die M96 und M97 von 1997 bis 2008. Woran man es erkennt, warum der sechste Zylinder leidet und warum NSC die einzige Lösung ist."),
  'it': ("Bore scoring Porsche: cause, sintomi e soluzione",
         "Il bore scoring interessa i M96 e M97 dal 1997 al 2008. Come riconoscerlo, perché soffre il sesto cilindro e perché l’NSC è l’unica soluzione."),
  'ca': ("Bore scoring en Porsche: causes, símptomes i solució",
         "El bore scoring afecta els M96 i M97 del 1997 al 2008. Com reconèixer-lo, per què pateix el sisè cilindre i per què el NSC és l’única solució."),
 },
 '10-pelculas-del-siglo-xxi-en-las-que-aparecen-coches-porsche': {
  'en': ("10 films of this century with a Porsche in the shot",
         "A spoiler-free selection: ten films of this century in which a Porsche takes the scene. Which model appears in each one, and in which scene."),
  'fr': ("10 films de ce siècle avec une Porsche à l’écran",
         "Une sélection sans spoilers : dix films de ce siècle où une Porsche vole la scène. Quel modèle apparaît dans chacun, et dans quelle scène."),
  'de': ("10 Filme dieses Jahrhunderts mit einem Porsche im Bild",
         "Eine Auswahl ohne Spoiler: zehn Filme dieses Jahrhunderts, in denen ein Porsche die Szene bestimmt. Welches Modell wo auftaucht, und in welcher Szene."),
  'it': ("10 film di questo secolo con una Porsche in scena",
         "Una selezione senza spoiler: dieci film di questo secolo in cui una Porsche si prende la scena. Quale modello compare in ognuno, e in quale scena."),
  'ca': ("10 pel·lícules d’aquest segle amb un Porsche en escena",
         "Una selecció sense spoilers: deu pel·lícules d’aquest segle en què un Porsche es porta el pla. Quin model surt a cadascuna, i en quina escena."),
 },
}


def ancho(t):
    return sum(11 if c.isupper() else 4 if c in 'iljt.,:;!¡ ' else 8 for c in t)


def main():
    problemas = []
    print(f'{"":3} {"pagina":26} {"px":>4} {"meta":>5}  title')
    print('-' * 108)
    for slug, por_idioma in PAGS.items():
        for i, (titulo, meta) in por_idioma.items():
            f = PAGINAS / f'{slug}.{i}.json'
            if not f.exists():
                problemas.append(f'{f.name} no existe'); continue
            d = json.loads(f.read_text())
            d['meta']['titulo'], d['meta']['descripcion'] = titulo, meta
            f.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
            aviso = ''
            if ancho(titulo) > 580: aviso = '  !! el title se corta'; problemas.append(f'{slug}.{i}: title de {ancho(titulo)} px')
            if len(meta) > 160: aviso += '  !! meta larga'; problemas.append(f'{slug}.{i}: meta de {len(meta)}')
            print(f'{i:>3} {slug[:26]:26} {ancho(titulo):>4} {len(meta):>5}  {titulo[:52]}{aviso}')

    for slug, por_idioma in POSTS.items():
        for i, (titulo, meta) in por_idioma.items():
            f = MAGAZINE / i / f'{slug}.md'
            if not f.exists():
                problemas.append(f'{i}/{slug}.md no existe'); continue
            t = f.read_text()
            _, fm, cuerpo = t.split('---', 2)
            fm = re.sub(r'^meta(Titulo|Descripcion): .*\n', '', fm, flags=re.M)
            fm = re.sub(r'^(title: .*)$',
                        lambda m: f'{m[1]}\nmetaTitulo: "{titulo}"\nmetaDescripcion: "{meta}"',
                        fm, count=1, flags=re.M)
            f.write_text('---' + fm + '---' + cuerpo)
            aviso = ''
            if ancho(titulo) > 580: aviso = '  !! el title se corta'; problemas.append(f'{slug}.{i}')
            if len(meta) > 160: aviso += '  !! meta larga'; problemas.append(f'{slug}.{i}: meta de {len(meta)}')
            print(f'{i:>3} {slug[:26]:26} {ancho(titulo):>4} {len(meta):>5}  {titulo[:52]}{aviso}')

    print()
    if problemas:
        print(f'{len(problemas)} a revisar:')
        for p in problemas: print(f'  {p}')
        return 1
    print('Los 40 titles caben y las 40 metas estan dentro de limite.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
