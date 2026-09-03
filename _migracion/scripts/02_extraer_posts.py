#!/usr/bin/env python3
"""
Fase 1 - Extraccion: convierte los posts del Magazine de Squarespace a Markdown.

Lee snapshot/json/magazine_*.json, convierte el `body` HTML a Markdown limpio y
verifica que NO se pierde ni una palabra por el camino. El criterio de aceptacion
del blog es diff vacio: si un post pierde texto, el script lo marca y falla.

Salidas:
  contenido/magazine/es/<slug>.md   post con frontmatter YAML
  contenido/imagenes.json           inventario de imagenes a rehospedar
  informes/paridad_posts.json       resultado de la verificacion palabra a palabra
"""
import json, re, sys, unicodedata
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
SNAP = ROOT / "snapshot" / "json"
OUT = ROOT / "contenido" / "magazine" / "es"
INF = ROOT / "informes"

BASURA = ("style", "script", "noscript", "svg", "button")
# texto solo para lectores de pantalla del lightbox de galeria ("Ver tamano completo")
CHROME_CLASES = ("v6-visually-hidden", "sr-only", "visually-hidden")
BLOQUE = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "figure", "hr",
          "blockquote", "table", "img", "iframe", "video"}


# ---------------------------------------------------------------- utilidades
def norm(t):
    """Normaliza texto para comparar: sin acentos de forma, espacios colapsados."""
    t = unicodedata.normalize("NFC", t)
    return re.sub(r"\s+", " ", t).strip()


def palabras(t):
    return re.findall(r"\w+", norm(t).lower(), re.UNICODE)


def img_url(tag):
    """Squarespace pone la URL real en data-src (lazy load); src suele ser un placeholder."""
    for a in ("data-src", "src", "data-image"):
        u = tag.get(a)
        if u and u.startswith("http") and "squarespace-cdn" in u:
            return u.split("?")[0]
    for a in ("data-src", "src"):
        u = tag.get(a)
        if u and u.startswith("http"):
            return u.split("?")[0]
    return None


# ------------------------------------------------------------------ inline
def inline(node, imgs=None):
    """Serializa contenido inline a Markdown. `imgs` recoge imagenes incrustadas."""
    if isinstance(node, NavigableString):
        return re.sub(r"\s+", " ", str(node))
    if not isinstance(node, Tag):
        return ""
    if node.name in BASURA:
        return ""
    if node.name == "img":
        # imagen dentro de un parrafo o un enlace: no se pierde
        u = img_url(node)
        if not u:
            return ""
        alt = norm(node.get("alt") or "")
        if imgs is not None:
            imgs.append({"url": u, "alt": alt, "caption": ""})
        return f"![{alt}]({u})"
    hijos = "".join(inline(c, imgs) for c in node.children)
    n = node.name
    if n in ("strong", "b"):
        return f"**{hijos.strip()}**" if hijos.strip() else ""
    if n in ("em", "i"):
        return f"*{hijos.strip()}*" if hijos.strip() else ""
    if n == "code":
        return f"`{hijos.strip()}`"
    if n == "br":
        return "\n"
    if n == "a":
        href = (node.get("href") or "").strip()
        txt = hijos.strip()
        if not txt:
            return ""
        return f"[{txt}]({href})" if href else txt
    return hijos


# ------------------------------------------------------------------ bloques
def bloques(soup, imgs):
    """Recorre el arbol y emite bloques Markdown en orden de documento."""
    out = []
    vistos = set()

    for el in soup.find_all(True):
        if el.name not in BLOQUE:
            continue
        if id(el) in vistos:
            continue
        # no procesar un bloque que ya cuelga de otro bloque emitido
        if any(id(p) in vistos for p in el.parents):
            continue
        # un <figure> sin imagen es un bloque de cita de Squarespace: no lo
        # consumimos, dejamos que el recorrido procese el blockquote de dentro
        if el.name == "figure" and not el.find("img"):
            continue
        vistos.add(id(el))
        for d in el.find_all(True):
            vistos.add(id(d))

        n = el.name

        if n in ("h1", "h2", "h3", "h4", "h5", "h6"):
            txt = norm(inline(el, imgs))
            if txt:
                # los h1 del cuerpo bajan a h2: el h1 de la pagina es el titulo del post
                lvl = max(2, int(n[1]))
                out.append("#" * lvl + " " + txt)

        elif n == "p":
            txt = inline(el, imgs).strip()
            txt = re.sub(r"[ \t]+\n", "\n", txt)
            if norm(txt):
                out.append(txt)

        elif n in ("ul", "ol"):
            marca = (lambda i: "- ") if n == "ul" else (lambda i: f"{i}. ")
            items = []
            for i, li in enumerate(el.find_all("li", recursive=False), 1):
                t = norm(inline(li, imgs))
                if t:
                    items.append(marca(i) + t)
            if items:
                out.append("\n".join(items))

        elif n == "blockquote":
            t = norm(inline(el, imgs))
            if t:
                out.append("> " + t)
                # el autor de la cita vive en el <figcaption> hermano
                fig = el.find_parent("figure")
                cap = fig.find("figcaption") if fig else None
                if cap:
                    a = norm(inline(cap))
                    a = a.lstrip("\u2014\u2013- ").strip()
                    if a:
                        out.append("> " + chr(8212) + " " + a)
                        vistos.add(id(cap))
                        for d in cap.find_all(True):
                            vistos.add(id(d))

        elif n == "hr":
            out.append("---")

        elif n == "figure":
            im = el.find("img")
            cap = el.find("figcaption")
            u = img_url(im) if im else None
            alt = norm(im.get("alt") or "") if im else ""
            ct = norm(inline(cap)) if cap else ""
            if u:
                imgs.append({"url": u, "alt": alt, "caption": ct})
                out.append(f"![{alt or ct}]({u})")
            if ct:
                out.append(f"*{ct}*")

        elif n == "img":
            u = img_url(el)
            alt = norm(el.get("alt") or "")
            if u:
                imgs.append({"url": u, "alt": alt, "caption": ""})
                out.append(f"![{alt}]({u})")

        elif n == "iframe":
            src = el.get("src") or el.get("data-src") or ""
            if src:
                out.append(f"<iframe src=\"{src}\" loading=\"lazy\" "
                           f"allowfullscreen></iframe>")

        elif n == "video":
            attrs = " ".join(
                k if v == "" else f'{k}="{v}"'
                for k, v in el.attrs.items() if k in
                ("src", "width", "height", "controls", "preload", "playsinline"))
            out.append(f"<video {attrs}></video>")

    # deduplica bloques contiguos identicos (Squarespace repite imagenes en noscript)
    limpio = []
    for b in out:
        if limpio and limpio[-1] == b:
            continue
        limpio.append(b)
    return limpio


def normalizar_videos(soup):
    """Convierte los bloques de video de Squarespace en un <video> normal.

    Seis posts llevan video alojado en Squarespace (`sqs-native-video`,
    servido por HLS). El fichero MP4 lo rescata 10_descargar_videos.py y lo
    nombra por su systemDataId, asi que aqui se puede apuntar a el sin
    consultarlo. Sin esto, el post del IMS tenia un titulo "Video explicativo
    sobre el IMS" seguido de nada.
    """
    import html as _html
    for v in soup.select('.sqs-native-video'):
        cfg = v.get('data-config-video')
        if not cfg:
            continue
        try:
            c = json.loads(_html.unescape(cfg))
        except json.JSONDecodeError:
            continue
        vid = c.get('systemDataId') or c.get('id')
        if not vid:
            continue
        # systemDataVariants viene como "1080:1920,360:640" (ancho:alto).
        # aspectRatio existe pero es un float, asi que no sirve para el markup.
        variantes = str(c.get('systemDataVariants') or '')
        medida = variantes.split(',')[0].split(':')
        nuevo = soup.new_tag('video', src=f'/video/magazine/{vid}.mp4')
        nuevo.attrs.update({'controls': '', 'preload': 'metadata', 'playsinline': ''})
        if len(medida) == 2 and all(x.isdigit() for x in medida):
            nuevo.attrs['width'], nuevo.attrs['height'] = medida[0], medida[1]
        # Se sustituye el bloque entero, no solo el nodo, para no dejar el
        # andamiaje de Squarespace alrededor
        contenedor = v.find_parent(class_='sqs-block') or v
        contenedor.replace_with(nuevo)
    return soup


def limpiar(soup):
    """Elimina el chrome de Squarespace que no es contenido editorial."""
    normalizar_videos(soup)
    # Squarespace envuelve en <button> las imagenes que abren el lightbox. Ese
    # boton es chrome, pero la foto de dentro es contenido: se desenvuelve en
    # vez de destruirse, o el post pierde la imagen entera.
    for b in soup.find_all("button"):
        if b.find("img"):
            b.unwrap()
    for t in soup.find_all(BASURA):
        t.decompose()
    for c in CHROME_CLASES:
        for t in soup.find_all(class_=c):
            t.decompose()
    return soup


def extraer_ctas(soup):
    """Los botones de Squarespace son CTA, no cuerpo: van al frontmatter."""
    ctas = []
    for a in soup.select("a[class*=sqs-block-button-element]"):
        txt = norm(a.get_text(" "))
        if txt:
            ctas.append({"texto": txt, "href": (a.get("href") or "").strip()})
        a.decompose()
    return ctas


def convertir(body, imgs):
    soup = limpiar(BeautifulSoup(body, "lxml"))
    ctas = extraer_ctas(soup)
    return "\n\n".join(bloques(soup, imgs)), ctas


def texto_plano_html(body):
    """Texto de referencia: mismo criterio de limpieza que la conversion,
    para que el diff mida perdida real de contenido y no chrome descartado."""
    soup = limpiar(BeautifulSoup(body, "lxml"))
    extraer_ctas(soup)
    return soup.get_text(" ")


BLOQUES_TEXTO = ("p", "li", "h1", "h2", "h3", "h4", "h5", "h6",
                 "blockquote", "figcaption", "td", "th")


def subsecuencia(agujas, pajar):
    """True si `agujas` aparece como sublista contigua dentro de `pajar`."""
    n, m = len(agujas), len(pajar)
    if n == 0:
        return True
    if n > m:
        return False
    primera = agujas[0]
    for i in range(m - n + 1):
        if pajar[i] == primera and pajar[i:i + n] == agujas:
            return True
    return False


def bloques_texto(body):
    """Texto de cada bloque de contenido del original.

    Comparar bloque a bloque en vez de contar palabras evita dos falsos
    positivos: que Squarespace duplique bloques para desktop y movil (los
    deduplicamos a proposito) y que una palabra cambie de sitio.
    """
    soup = limpiar(BeautifulSoup(body, "lxml"))
    extraer_ctas(soup)
    fuera = []
    for el in soup.find_all(BLOQUES_TEXTO):
        # solo hojas: si contiene otro bloque de texto, ya se mide por dentro
        if el.find(BLOQUES_TEXTO):
            continue
        t = norm(el.get_text(" "))
        if len(t) > 2:
            fuera.append(t)
    return fuera


def texto_plano_md(md):
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", md)          # imagenes fuera
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)         # enlaces -> texto
    t = re.sub(r"<iframe[^>]*></iframe>", " ", t)
    t = re.sub(r"[#>*`_-]", " ", t)
    return t


def yaml_esc(s):
    return '"' + (s or "").replace("\\", "\\\\").replace('"', '\\"') + '"'


# -------------------------------------------------------------------- main
def main():
    OUT.mkdir(parents=True, exist_ok=True)
    INF.mkdir(parents=True, exist_ok=True)
    ficheros = sorted(f for f in SNAP.glob("magazine_*.json") if "category" not in f.name)

    todas_imgs, informe, fallos = [], [], 0

    for f in ficheros:
        d = json.loads(f.read_text())
        it = d.get("item")
        if not it or not it.get("body"):
            continue

        imgs = []
        md, ctas = convertir(it["body"], imgs)
        for i in imgs:
            i["post"] = it["urlId"]
        todas_imgs.extend(imgs)

        # --- verificacion de paridad: ningun bloque de texto se pierde
        # Se compara por secuencia de palabras, no por texto literal: asi la
        # comprobacion mide perdida de contenido y no diferencias de puntuacion
        # o de sintaxis Markdown.
        origen = bloques_texto(it["body"])
        md_w = palabras(texto_plano_md(md))
        faltan = [b for b in dict.fromkeys(origen) if not subsecuencia(palabras(b), md_w)]
        ok = not faltan
        if not ok:
            fallos += 1
        informe.append({"slug": it["urlId"], "title": it["title"],
                        "bloques_origen": len(origen),
                        "palabras_markdown": len(palabras(texto_plano_md(md))),
                        "ok": ok, "bloques_faltantes": [b[:120] for b in faltan[:10]],
                        "n_faltantes": len(faltan), "imagenes": len(imgs),
                        "ctas": ctas})

        fecha = it.get("publishOn")
        fecha = (__import__("datetime").datetime.utcfromtimestamp(fecha / 1000).isoformat() + "Z") if fecha else ""
        fm = [
            "---",
            f"title: {yaml_esc(it['title'])}",
            # No usar "slug": Astro lo trata como identificador reservado de la
            # entrada, asi que las seis versiones de idioma colisionaban en el
            # mismo id y solo sobrevivia una.
            f"slugSquarespace: {yaml_esc(it['urlId'])}",
            f"date: {fecha}",
            f"lang: es",
            "categories: [" + ", ".join(yaml_esc(c) for c in (it.get("categories") or [])) + "]",
            f"excerpt: {yaml_esc(norm(BeautifulSoup(it.get('excerpt') or '', 'lxml').get_text(' ')))}",
            f"author: {yaml_esc((it.get('author') or {}).get('displayName', ''))}",
            f"squarespaceId: {yaml_esc(it['id'])}",
            f"originalUrl: {yaml_esc('https://www.valentinmotors.es/magazine/' + it['urlId'])}",
            "ctas:" + ("" if ctas else " []"),
        ] + [f"  - texto: {yaml_esc(c['texto'])}\n    href: {yaml_esc(c['href'])}" for c in ctas] + [
            "---",
            "",
        ]
        nombre = re.sub(r"[^A-Za-z0-9._-]", "_", it["urlId"]) + ".md"
        (OUT / nombre).write_text("\n".join(fm) + md + "\n")

    (ROOT / "contenido" / "imagenes.json").write_text(
        json.dumps({"total": len(todas_imgs),
                    "unicas": len({i["url"] for i in todas_imgs}),
                    "imagenes": todas_imgs}, indent=2, ensure_ascii=False))
    (INF / "paridad_posts.json").write_text(json.dumps(informe, indent=2, ensure_ascii=False))

    print(f"Posts convertidos : {len(informe)}")
    print(f"Imagenes          : {len(todas_imgs)} ({len({i['url'] for i in todas_imgs})} unicas)")
    print(f"Paridad           : {len(informe) - fallos}/{len(informe)} sin perdida de contenido")
    print(f"Bloques de texto  : {sum(r['bloques_origen'] for r in informe)} verificados")
    if fallos:
        print(f"\n!! {fallos} posts con bloques perdidos:")
        for r in informe:
            if not r["ok"]:
                print(f"   {r['slug']}: {r['n_faltantes']} bloques")
                for b in r["bloques_faltantes"][:3]:
                    print(f"      - {b!r}")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
