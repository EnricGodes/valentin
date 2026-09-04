#!/usr/bin/env python3
"""
Fase 1 - Inventario: cruza el sitemap con el trafico real de GA4 y GSC y propone
un destino para cada URL en el sitio nuevo.

Salidas:
  informes/inventario_urls.csv   tabla completa, para revisar
  informes/inventario_urls.md    la misma tabla, legible
  ../public/_redirects           borrador del mapa 301 derivado de este inventario
"""
import csv, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INF = ROOT / "informes"

# --- trafico GA4 (1 jul - 25 ago 2026), vistas por ruta
GA4 = {
 "/":2921, "/porsche-en-venta":2818, "/porsche-en-venta/porsche-997-manual":794,
 "/porsche-en-venta/porsche-997-carrera-4s-triptronic":719, "/porsche-en-venta/997-ruf-kompressor":564,
 "/madrid":549, "/porsche-en-venta/porsche-911-22-t-targa":547,
 "/porsche-en-venta/porsche-porsche-991-carrera-s-cabrio":453,
 "/porsche-en-venta/porsche-356-b-cabriolet-1960":381, "/porsche-911-mantenimiento-taller":377,
 "/magazine/que-es-el-ims-de-porsche":319, "/barcelona":306, "/taller-porsche":223,
 "/contacto":208, "/magazine":188,
 "/magazine/10-cosas-que-debes-saber-antes-de-comprar-un-porsche-911":119,
 "/quienes-somos":109, "/porsche-en-venta/porsche-981-cayman-gts":108, "/restauraciones":106,
 "/porsche-cayman-boxster-mantenimiento-taller":102, "/porsche-cayenne-macan-mantenimiento-taller-1":99,
 "/magazine/porsche-bore-scoring":89, "/porsche-997-de-segunda-mano":88,
 "/magazine/10-pelculas-del-siglo-xxi-en-las-que-aparecen-coches-porsche":87,
 "/porsche-macan-mantenimiento-taller-1":73, "/porsche-996-de-segunda-mano":56, "/sala-motores":52,
 "/magazine/porsche-911g":51, "/porsche-992-de-segunda-mano":49, "/porsche-turbo-mantenimiento-taller":40,
 "/competicion":39, "/magazine/club-de-propietarios-porsche":39,
 "/magazine/porscheupgard40m97-bore-scoring-f3whn":30, "/porsche-gt-mantenimiento-taller":29,
 "/porsche-transaxle-mantenimiento-taller":29, "/magazine/nuevo-taller-barcelona":27,
 "/magazine/porsche-964":27, "/magazine/category/restauraciones":25,
 "/magazine/restauracion964backdating2023-kdlc4-mjz6r":24, "/magazine/restauracion-pinzas-freno":23,
 "/porsche-en-venta/category/911":23, "/magazine/nuevo-centro-valentin-motors-en-madrid":19,
 "/magazine/porscheclassicseries2023-z4gbf":19, "/magazine/restauracion-de-un-porsche-911-930-turbo":19,
 "/magazine/porschem911pa10/01":18, "/magazine/presentacionpa10-01/madrid":17,
 "/magazine/category/eventos":16, "/magazine/category/articulos":15, "/magazine/porsche968-abx98":13,
 "/magazine/porscheroturasmotorm96valentin":13, "/magazine/restauracion-porsche-964-turbo-1991":12,
 "/magazine/restauracion-motor-964-36":11, "/magazine/porsche9971noselift-f3whn-trwdw":10,
 "/nuevo-centro-valentin-motors-madrid":10, "/magazine/porscheclassicseries2023":9,
 "/poltica-de-privacidad":9, "/magazine/restauracion-sctarga1979oakgreen":8,
 "/plan-mantenimiento-oferta":8, "/magazine/category/iconos":7, "/magazine/porsche968":7,
 "/magazine/restauracion-motor-964-m64":7, "/aviso-legal":6,
 "/magazine/restauracion-incendio-930-turbo-1976":6, "/magazine/restauracion-porsche-911-1965":6,
 "/magazine/porschem9738a40":5, "/magazine/restauracion-motor-1971-22":5,
 "/mantenimiento-porsche-te-regalamos-un-alineado-de-precision-gratis":5,
 "/magazine/porsche9971turbo":4, "/magazine/porschem9738a40-y4b85":4,
 "/magazine/restauracion-motor-965-turbo-33":4, "/magazine/restauracion27stargalimegreen-kdlc4":4,
 "/vende-tu-porsche-con-valentn-motors":4, "/magazine/porschepinturaclasica964-9fcrx":3,
 "/magazine/porscheroturasmotorm96valentin-9pb35":3, "/magazine/tapicera-original-de-911-serie-f":3,
 "/magazine/porschepinturaclasica911":2, "/magazine/rehabilitacion-motor-22-1970-serief":2,
 "/magazine/restauracionsistemacis":2, "/magazine/revision-gratuita-esenciales":2,
 "/poltica-de-cookies":2,
}

# --- clics e impresiones organicos (GSC, 3 meses)
GSC = {
 "/":(1311,15749), "/magazine/que-es-el-ims-de-porsche":(401,13548), "/porsche-en-venta":(401,6104),
 "/madrid":(291,9329), "/magazine/10-pelculas-del-siglo-xxi-en-las-que-aparecen-coches-porsche":(111,5681),
 "/magazine/porsche-bore-scoring":(111,2856), "/taller-porsche":(96,7556),
 "/porsche-cayenne-macan-mantenimiento-taller-1":(95,3111), "/porsche-911-mantenimiento-taller":(85,2247),
 "/barcelona":(46,4339),
}

# --- decisiones explicitas: ruta -> (accion, destino, motivo)
DECISION = {
 "/home": ("301", "/", "duplicado de la raiz que genera Squarespace"),
 "/barcelona-old": ("301", "/barcelona", "version antigua del centro"),
 "/campana-suv-septiembre-2023": ("301", "/porsche-cayenne-macan-mantenimiento-taller-1", "campana caducada"),
 "/diagnostico-global-porsche-gratis-en-valentin-barcelona": ("301", "/barcelona", "campana caducada"),
 "/mantenimiento-porsche-te-regalamos-un-alineado-de-precision-gratis": ("301", "/taller-porsche/mantenimiento", "campana caducada; su tema es el mantenimiento"),
 "/plan-mantenimiento-oferta": ("301", "/taller-porsche/mantenimiento", "campana caducada; el plan a precio cerrado tiene pagina propia"),
 # Campana de febrero de 2023, despublicada por decision del cliente. El
    # contenido vive en sitio/src/content/_despublicado/, fuera de la coleccion.
    "/magazine/revision-gratuita-esenciales": ("301", "/taller-porsche", "campana caducada y despublicada"),
 "/nuevo-centro-valentin-motors-madrid": ("301", "/madrid", "duplica el post del Magazine"),
 "/porsche-macan-mantenimiento-taller-1": ("301", "/porsche-cayenne-macan-mantenimiento-taller-1", "fusion: dos paginas casi identicas"),
 "/proyecto-rs": ("301", "/restauraciones/restomod", "sin trafico; su tema son los proyectos propios"),

 # Categorias del Magazine que ya no tiene ningun post. Estaban en el sitemap y
 # siguen indexadas, asi que no pueden quedarse en 404.
 "/magazine/category/930": ("301", "/magazine", "categoria sin posts"),
 "/magazine/category/IMS": ("301", "/magazine/que-es-el-ims-de-porsche", "categoria sin posts: al articulo de referencia"),
 "/magazine/category/Modelos": ("301", "/magazine", "categoria sin posts"),
 "/magazine/category/art%C3%ADculos": ("301", "/magazine/category/articulos", "misma categoria con la tilde codificada"),
 "/magazine/category/bore+scoring": ("301", "/magazine/porsche-bore-scoring", "categoria sin posts: al articulo de referencia"),
 "/magazine/category/compra+veh%C3%ADculos": ("301", "/porsche-en-venta", "categoria sin posts"),
 "/magazine/category/taller": ("301", "/taller-porsche", "categoria sin posts"),

 # Categorias del listado de coches: Squarespace las generaba solas y no
 # aportan nada que el listado no cubra.
 "/porsche-en-venta/category/911": ("301", "/porsche-en-venta", "categoria del listado"),
 "/porsche-en-venta/category/911+3.2": ("301", "/porsche-en-venta", "categoria del listado"),
 "/porsche-en-venta/category/966": ("301", "/porsche-en-venta", "categoria del listado"),
 "/porsche-en-venta/category/992": ("301", "/porsche-en-venta", "categoria del listado"),
 "/porsche-en-venta/category/993": ("301", "/porsche-en-venta", "categoria del listado"),
 "/porsche-en-venta/category/996": ("301", "/porsche-en-venta", "categoria del listado"),
 "/porsche-en-venta/category/997": ("301", "/porsche-en-venta", "categoria del listado"),
}

SLUGS_NUEVOS = {
 "/magazine/porscheroturasmotorm96valentin-ey2wg": "/magazine/rehabilitacion-motor-32-serie-g-1985",
 "/magazine/porscheroturasmotorm96valentin-9pb35": "/magazine/backdating-base-964",
 "/magazine/porscheroturasmotorm96valentin": "/magazine/996-m96-34-rotura-arbol-intermedio-ims",
 "/magazine/porsche968-abx98": "/magazine/porsche-spain-meeting-2026-jarama",
 "/magazine/porsche968": "/magazine/reconstruccion-motor-968",
 "/magazine/porschem9738a40-y4b85": "/magazine/motor-serie-g-32",
 "/magazine/porschem9738a40": "/magazine/motor-m97-38-a-40",
 "/magazine/porschem911pa10/01": "/magazine/pa10-01",
 "/magazine/presentacionpa10-01/madrid": "/magazine/presentacion-pa10-01-madrid",
 "/magazine/porschepinturaclasica911": "/magazine/proceso-pintura-911-clase-g",
 "/magazine/porschepinturaclasica964-9fcrx": "/magazine/proceso-pintura-964",
 "/magazine/porsche9971turbo": "/magazine/9971-turbo-rehabilitacion-motor",
 "/magazine/porsche9971noselift-f3whn-trwdw": "/magazine/nose-lift-997-1",
 "/magazine/porscheupgard40m97-bore-scoring-f3whn": "/magazine/997-m9701-38-a-40-nickies",
 "/magazine/porscheclassicseries2023-z4gbf": "/magazine/9-eleven-headlights-964",
 "/magazine/restauracion964backdating2023-kdlc4-mjz6r": "/magazine/backdating-964-2023",
 "/magazine/restauracion27stargalimegreen-kdlc4": "/magazine/restauracion-27-s-targa-lime-green",
 "/magazine/restauracionsistemacis": "/magazine/restauracion-sistema-inyeccion-cis",
 "/poltica-de-privacidad": "/politica-de-privacidad",
 "/poltica-de-cookies": "/politica-de-cookies",
 "/vende-tu-porsche-con-valentn-motors": "/vende-tu-porsche",
}

# 404 heredados que se revivien como ficha VENDIDO
REVIVIR = [
 "/porsche-en-venta/porsche-981-cayman-gts", "/porsche-en-venta/porsche912pepita1966",
 "/porsche-en-venta/porsche996coupecarreratiptronic",
 "/porsche-en-venta/porsche986boxstersspeedgelb",
 "/porsche-en-venta/porsche930turbo1977r4granprixwhite", "/porsche-en-venta/porsche993carrerausa",
]
REDIR_404 = {
 # Dos URLs de Squarespace para el mismo coche: el 981 Cayman GTS Amarillo P3
 "/porsche-en-venta/porsche981gtscaymanamarillo": "/porsche-en-venta/porsche-981-cayman-gts",
 "/porsche-en-venta/porschrrkompressorruf": "/porsche-en-venta/997-ruf-kompressor",
 "/porsche-en-venta/porsche356cabriolet": "/porsche-en-venta/porsche-356-b-cabriolet-1960",
 "/magazine/restauracion-motor-964-turbo-dfc3x": "/magazine/restauracion-porsche-964-turbo-1991",
 "/magazine/reparacion-motor-ims": "/magazine/que-es-el-ims-de-porsche",
 "/porsche-en-venta/porsche-997-carrera-4s-triptonic": "/porsche-en-venta/porsche-997-carrera-4s-triptronic",
 "/porsche-en-venta/porsche-997-manual-f682k": "/porsche-en-venta/porsche-997-manual",
 "/porsche-en-venta/porsche-911-22-t-targa-nbpl5": "/porsche-en-venta/porsche-911-22-t-targa",
 "/porsche-en-venta/porsche718boxsters76d2-lztlp-fre2j": "/porsche-en-venta",
 "/contact": "/contacto", "/contact-us": "/contacto", "/contactez-nous": "/contacto",
 "/cart": "/",
}


def tipo(p):
    if p == "/": return "home"
    if p.startswith("/magazine/category/"): return "categoria blog"
    if p.startswith("/magazine/"): return "post"
    if p == "/magazine": return "indice blog"
    if p.startswith("/porsche-en-venta/category/"): return "categoria coches"
    if p.startswith("/porsche-en-venta/"): return "ficha coche"
    if p == "/porsche-en-venta": return "listado coches"
    if p in ("/barcelona", "/madrid"): return "centro"
    if "mantenimiento-taller" in p: return "tarifa"
    if p in ("/taller-porsche", "/sala-motores", "/restauraciones", "/competicion"): return "servicio"
    if "segunda-mano" in p: return "landing SEO"
    if p in ("/aviso-legal", "/poltica-de-privacidad", "/poltica-de-cookies"): return "legal"
    return "pagina"


def main():
    INF.mkdir(exist_ok=True)
    man = json.loads((ROOT / "snapshot" / "manifest.json").read_text())
    filas = []

    for pg in man["pages"]:
        p = pg["path"]
        if p == "/home" and pg["status"] == 200:
            pass
        clics, impr = GSC.get(p, (0, 0))
        if p in DECISION:
            acc, dest, motivo = DECISION[p]
        elif p in SLUGS_NUEVOS:
            acc, dest, motivo = "301", SLUGS_NUEVOS[p], "slug ilegible: se publica con slug nuevo y el viejo redirige"
        else:
            acc, dest, motivo = "CONSERVAR", p, "URL con posicionamiento: no se toca"
        filas.append({"url": p, "tipo": tipo(p), "estado_actual": pg["status"],
                      "ga4_vistas_56d": GA4.get(p, 0), "gsc_clics_3m": clics,
                      "gsc_impresiones_3m": impr, "accion": acc, "destino": dest,
                      "motivo": motivo, "title_actual": pg.get("title") or ""})

    for p in REVIVIR:
        filas.append({"url": p, "tipo": "ficha coche (vendido)", "estado_actual": 404,
                      "ga4_vistas_56d": GA4.get(p, 0), "gsc_clics_3m": 0, "gsc_impresiones_3m": 0,
                      "accion": "REVIVIR", "destino": p,
                      "motivo": "coche vendido borrado: se republica con badge VENDIDO", "title_actual": ""})
    for p, d in REDIR_404.items():
        filas.append({"url": p, "tipo": "404 heredado", "estado_actual": 404,
                      "ga4_vistas_56d": GA4.get(p, 0), "gsc_clics_3m": 0, "gsc_impresiones_3m": 0,
                      "accion": "301", "destino": d, "motivo": "404 heredado o ruido de bots",
                      "title_actual": ""})

    filas.sort(key=lambda r: (-r["gsc_clics_3m"], -r["ga4_vistas_56d"], r["url"]))

    cols = ["url", "tipo", "estado_actual", "ga4_vistas_56d", "gsc_clics_3m",
            "gsc_impresiones_3m", "accion", "destino", "motivo", "title_actual"]
    with (INF / "inventario_urls.csv").open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(filas)

    # --- resumen legible
    from collections import Counter
    ca, ct = Counter(r["accion"] for r in filas), Counter(r["tipo"] for r in filas)
    md = ["# Inventario de URLs — valentinmotors.es", "",
          f"{len(filas)} URLs: {len(man['pages'])} del sitemap + {len(REVIVIR) + len(REDIR_404)} "
          "404 heredados y ruido detectados en GA4/GSC.", "",
          "## Acciones", "", "| Accion | URLs |", "|---|---:|"]
    md += [f"| {k} | {v} |" for k, v in ca.most_common()]
    md += ["", "## Tipos", "", "| Tipo | URLs |", "|---|---:|"]
    md += [f"| {k} | {v} |" for k, v in ct.most_common()]
    md += ["", "## Todas las URLs, ordenadas por clics organicos", "",
           "| URL | Tipo | Vistas | Clics | Impr. | Accion | Destino |", "|---|---|---:|---:|---:|---|---|"]
    for r in filas:
        d = "" if r["accion"] == "CONSERVAR" else r["destino"]
        md.append(f"| `{r['url']}` | {r['tipo']} | {r['ga4_vistas_56d']} | {r['gsc_clics_3m']} "
                  f"| {r['gsc_impresiones_3m']} | {r['accion']} | `{d}` |" if d else
                  f"| `{r['url']}` | {r['tipo']} | {r['ga4_vistas_56d']} | {r['gsc_clics_3m']} "
                  f"| {r['gsc_impresiones_3m']} | {r['accion']} | |")
    (INF / "inventario_urls.md").write_text("\n".join(md) + "\n")

    # --- borrador de _redirects
    red = ["# Mapa de redirecciones 301 - generado por 04_inventario_urls.py",
           "# NO editar a mano: editar el script y regenerar.", ""]
    for r in filas:
        if r["accion"] == "301":
            red.append(f"{r['url']}  {r['destino']}  301")
    red += ["", "# comodines: borradores fantasma y ruido heredado",
            "/porsche-en-venta/porsche-981-cayman-gts-*  /porsche-en-venta/porsche-981-cayman-gts  301",
            "/archives/*  /magazine  301", "/administrator/*  /  301"]
    (INF / "_redirects.borrador").write_text("\n".join(red) + "\n")
    publico = ROOT.parent / "sitio" / "public" / "_redirects"
    if publico.parent.exists():
        publico.write_text("\n".join(red) + "\n")
        print(f"escrito tambien en {publico.relative_to(ROOT.parent)}")

    print(f"URLs inventariadas: {len(filas)}")
    for k, v in ca.most_common():
        print(f"  {k:12} {v}")
    print(f"\nRedirecciones 301 generadas: {sum(1 for r in filas if r['accion'] == '301')}")
    cons = [r for r in filas if r["accion"] == "CONSERVAR"]
    print(f"URLs que conservan path exacto: {len(cons)} "
          f"({sum(r['gsc_clics_3m'] for r in cons)} de {sum(r['gsc_clics_3m'] for r in filas)} clics organicos)")


if __name__ == "__main__":
    main()
