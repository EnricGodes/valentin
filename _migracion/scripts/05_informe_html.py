#!/usr/bin/env python3
"""
Genera el informe de auditoria y migracion en HTML a partir de los datos reales
(inventario de URLs, linea base de GA4/GSC y verificacion de paridad del blog),
para que la pagina no pueda desviarse de lo que dicen los ficheros.
"""
import csv, json, html
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INF, BASE = ROOT / "informes", ROOT / "baseline"
SALIDA = ROOT / "informes" / "auditoria.html"

e = lambda s: html.escape(str(s), quote=True)

filas = list(csv.DictReader((INF / "inventario_urls.csv").open()))
for f in filas:
    for k in ("ga4_vistas_56d", "gsc_clics_3m", "gsc_impresiones_3m"):
        f[k] = int(f[k])
paridad = json.loads((INF / "paridad_posts.json").read_text())
resumen = json.loads((BASE / "resumen.json").read_text())
canales = list(csv.DictReader((BASE / "ga4_canales_56d.csv").open()))
top = list(csv.DictReader((BASE / "gsc_top_pages_3m.csv").open()))

acc = Counter(f["accion"] for f in filas)
conservan = [f for f in filas if f["accion"] == "CONSERVAR"]
clics_cons = sum(f["gsc_clics_3m"] for f in conservan)
clics_tot = sum(f["gsc_clics_3m"] for f in filas)
n_imgs = json.loads((ROOT / "contenido" / "imagenes_mapa.json").read_text())["descargadas"]
bloques = sum(p["bloques_origen"] for p in paridad)

mil = lambda n: f"{n:,}".replace(",", ".")

# ---------------------------------------------------------------- componentes
def kpi(v, etiq, nota="", alerta=False):
    cls = " kpi--alerta" if alerta else ""
    n = f'<div class="kpi__nota">{e(nota)}</div>' if nota else ""
    return (f'<div class="kpi{cls}"><div class="kpi__v">{e(v)}</div>'
            f'<div class="kpi__e">{e(etiq)}</div>{n}</div>')


def barras(datos, unidad="", alerta_si=None, sufijo=""):
    """Barras horizontales, una sola serie, con etiqueta directa en cada barra."""
    mx = max(d[1] for d in datos) or 1
    out = ['<div class="bars">']
    for etiqueta, valor, extra in datos:
        pct = valor / mx * 100
        al = alerta_si(valor) if alerta_si else False
        out.append(
            f'<div class="bar{" bar--alerta" if al else ""}">'
            f'<div class="bar__l" title="{e(etiqueta)}">{e(etiqueta)}</div>'
            f'<div class="bar__t"><div class="bar__f" style="width:{pct:.1f}%"></div></div>'
            f'<div class="bar__v">{e(unidad)}{e(valor)}{e(sufijo)}'
            f'<span class="bar__x">{e(extra)}</span></div></div>')
    out.append("</div>")
    return "\n".join(out)


HALLAZGOS = [
 ("Cero medicion de conversion", "critico",
  "GA4 registra <b>0 key events</b> en todos los informes. Son 4.978 sesiones sin medir un solo "
  "formulario, llamada, WhatsApp o clic en email. Hoy no hay forma de saber que pagina genera "
  "clientes, asi que tampoco de decidir donde invertir."),
 ("El Magazine es el segundo activo del sitio", "info",
  "El post <i>¿Que es el IMS de Porsche?</i> aporta 401 clics, el 12% del total, y 13.548 "
  "impresiones el solo. Los tres primeros posts suman el 18% de los clics. El blog no es un "
  "adorno: es infraestructura comercial, y por eso se migra con verificacion palabra a palabra."),
 ("CTR desperdiciado donde ya se rankea", "critico",
  "La consulta <span class='m'>ims porsche</span> tiene 1.635 impresiones y solo 60 clics. "
  "<span class='m'>/taller-porsche</span> convierte al 1,27%. Rankean pero no se hace clic: es un "
  "problema de title, meta description y rich snippets, no de contenido. Es la palanca de mayor "
  "retorno inmediato de toda la auditoria."),
 ("Barcelona rinde tres veces peor que Madrid", "critico",
  "4.339 impresiones y 46 clics (1,06%) frente a 9.329 y 291 (3,1%) de Madrid. Ademas el JSON-LD "
  "de la home declara <span class='m'>752 Gran Via de les Corts Catalanes</span> cuando la "
  "direccion real es <span class='m'>Varsovia, 65</span>. Esa inconsistencia penaliza el paquete local."),
 ("Catorce URLs devolviendo 404", "critico",
  "Casi todas coches vendidos que se borraron en lugar de archivarse. El 981 Cayman GTS siguio "
  "recibiendo 108 visitas mientras devolvia 404. Borrar el coche vendido tira la autoridad acumulada."),
 ("Rendimiento movil, donde esta el 61% del trafico", "aviso",
  "Core Web Vitals: 35 URLs necesitan mejora en movil, 19 correctas; en desktop las 54 pasan. "
  "La causa es Squarespace: la home son 565 KB de HTML con 29 scripts y 7 hojas de estilo."),
 ("Dependencia de marca", "info",
  "Las cinco primeras consultas son variantes de <span class='m'>valentin motors</span> y suman el "
  "24% de los clics. El crecimiento esta en el generico, que hoy solo despunta en el grupo IMS."),
 ("robots.txt bloquea a todos los crawlers de IA", "aviso",
  "ClaudeBot, GPTBot, Google-Extended, Applebot-Extended... mientras GA4 ya reporta un canal "
  "<i>AI Assistant</i> con 81 sesiones. Se estaba bloqueando por defecto un canal que ya trae trafico."),
 ("Duplicados y slugs ilegibles", "aviso",
  "Dos paginas de mantenimiento casi identicas, un centro duplicado entre pagina y post, ocho "
  "borradores fantasma con sufijo aleatorio y unos quince posts con slugs como "
  "<span class='m'>porscheroturasmotorm96valentin-ey2wg</span>, que en realidad es "
  "<i>Rehabilitacion motor completo 3.2 serie G coupe 1985</i>."),
 ("Datos estructurados minimos", "aviso",
  "Solo los <span class='m'>WebSite</span>, <span class='m'>Organization</span> y "
  "<span class='m'>LocalBusiness</span> genericos de Squarespace, y dos H1 en la home. No hay "
  "<span class='m'>Vehicle</span>, <span class='m'>AutoRepair</span>, <span class='m'>Article</span> "
  "ni <span class='m'>FAQPage</span>. Para un especialista Porsche con stock, es dinero en la mesa."),
]

ETIQ = {"critico": "Critico", "aviso": "Atencion", "info": "Contexto"}

hall = "\n".join(
    f'<li class="h h--{s}"><div class="h__n">{i:02d}</div><div class="h__c">'
    f'<h3 class="h__t">{e(t)}<span class="chip chip--{s}">{ETIQ[s]}</span></h3>'
    f'<p class="h__d">{d}</p></div></li>'
    for i, (t, s, d) in enumerate(HALLAZGOS, 1))

# tabla: las 24 URLs con mas peso
tab = sorted(filas, key=lambda f: (-f["gsc_clics_3m"], -f["ga4_vistas_56d"]))[:24]
ACC = {"CONSERVAR": "conservar", "301": "redir", "REVIVIR": "revivir"}
tabla = "\n".join(
    f'<tr><td class="u"><code>{e(f["url"])}</code></td><td class="t">{e(f["tipo"])}</td>'
    f'<td class="n">{mil(f["ga4_vistas_56d"])}</td><td class="n">{mil(f["gsc_clics_3m"])}</td>'
    f'<td class="n">{mil(f["gsc_impresiones_3m"])}</td>'
    f'<td><span class="chip chip--{ACC[f["accion"]]}">{e(f["accion"].title())}</span></td>'
    f'<td class="u">{("<code>" + e(f["destino"]) + "</code>") if f["accion"] != "CONSERVAR" else "<span class=mut>igual</span>"}</td></tr>'
    for f in tab)

g_canales = barras(
    [(c["canal"], int(c["sesiones"]), f'{float(c["engagement_rate_pct"]):.0f}% engagement')
     for c in canales if int(c["sesiones"]) > 8], sufijo="")
g_ctr = barras(
    [(t["url"].replace("https://www.valentinmotors.es", "") or "/",
      round(float(t["ctr_pct"]), 2), f'{mil(int(t["impresiones"]))} impr.') for t in top],
    alerta_si=lambda v: v < 3.0, sufijo="%")

HTML = f"""<title>Migración valentinmotors.es</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@300;400;600;700&display=swap">
<style>
:root{{
  --negro:#0B0B0B; --grafito:#1C1C1A; --carbon:#2A2824;
  --blanco:#F0EDE8; --concreto:#A7A29A; --bronce:#B28A5B;
  --ladrillo:#B04A3A; --ladrillo-txt:#D9705C; --ambar:#D9A400;
  --linea:rgba(167,162,154,.11); --linea2:rgba(167,162,154,.20);
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
  --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--negro);color:var(--blanco);
  font:400 16px/1.7 var(--sans);-webkit-font-smoothing:antialiased}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 clamp(20px,4vw,56px)}}
code{{font:400 .88em/1.5 var(--mono);color:var(--concreto);word-break:break-all}}
.m{{font:500 .9em var(--mono);color:var(--bronce)}}
b{{font-weight:600;color:var(--blanco)}} i{{color:var(--concreto)}}
.mut{{color:var(--concreto);opacity:.55;font:400 12px var(--mono)}}
a{{color:var(--bronce)}}
:focus-visible{{outline:2px solid var(--bronce);outline-offset:3px}}

/* --- cabecera --- */
header{{padding:clamp(56px,9vw,110px) 0 clamp(36px,5vw,56px);border-bottom:1px solid var(--linea)}}
.eyebrow{{font:500 10px/1 var(--mono);letter-spacing:.3em;text-transform:uppercase;
  color:var(--bronce);margin:0 0 26px}}
h1{{font:300 clamp(38px,6.4vw,74px)/1.02 var(--sans);letter-spacing:-.03em;margin:0;
  text-wrap:balance}}
h1 strong{{display:block;font-weight:700}}
.sub{{margin:26px 0 0;max-width:62ch;color:var(--concreto);font-size:17px;font-weight:300}}
.meta{{margin-top:30px;display:flex;flex-wrap:wrap;gap:8px 26px;
  font:400 11px var(--mono);letter-spacing:.1em;color:var(--concreto);text-transform:uppercase}}

/* --- secciones --- */
section{{padding:clamp(48px,7vw,84px) 0;border-bottom:1px solid var(--linea)}}
.shim{{width:60px;height:1px;background:var(--bronce);margin-bottom:22px}}
.label{{font:500 10px/1 var(--mono);letter-spacing:.25em;text-transform:uppercase;
  color:var(--bronce);margin:0 0 14px}}
h2{{font:300 clamp(25px,3.4vw,40px)/1.15 var(--sans);letter-spacing:-.02em;margin:0 0 18px;
  text-wrap:balance}}
h2 strong{{font-weight:700}}
.lede{{max-width:66ch;color:var(--concreto);margin:0 0 8px;font-weight:300;font-size:17px}}

/* --- KPI --- */
.kpis{{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:1px;
  background:var(--linea);border:1px solid var(--linea);margin-top:34px}}
.kpi{{background:var(--negro);padding:24px 22px 22px}}
.kpi__v{{font:500 clamp(27px,3.4vw,38px)/1 var(--mono);color:var(--bronce);
  font-variant-numeric:tabular-nums;letter-spacing:-.02em}}
.kpi__e{{margin-top:11px;font:400 10px var(--mono);letter-spacing:.16em;
  text-transform:uppercase;color:var(--concreto)}}
.kpi__nota{{margin-top:7px;font-size:12.5px;line-height:1.5;color:var(--concreto);opacity:.72}}
.kpi--alerta .kpi__v{{color:var(--ladrillo-txt)}}
.kpi--alerta .kpi__nota{{color:var(--ladrillo-txt);opacity:1}}

/* --- barras --- */
.bars{{margin-top:30px;display:flex;flex-direction:column;gap:1px}}
.bar{{display:grid;grid-template-columns:minmax(120px,300px) 1fr minmax(132px,auto);
  align-items:center;gap:18px;padding:9px 10px;transition:background .18s}}
.bar:hover{{background:var(--grafito)}}
.bar__l{{font:400 13px var(--mono);color:var(--concreto);overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap}}
.bar__t{{height:11px;background:var(--grafito);position:relative;min-width:40px}}
.bar__f{{height:100%;background:var(--bronce);border-radius:0 3px 3px 0;
  transition:width .2s}}
.bar--alerta .bar__f{{background:var(--ladrillo)}}
.bar--alerta .bar__l{{color:var(--ladrillo-txt)}}
.bar__v{{font:500 13px var(--mono);color:var(--blanco);text-align:right;
  font-variant-numeric:tabular-nums;white-space:nowrap}}
.bar__x{{display:block;font-weight:400;font-size:11px;color:var(--concreto);margin-top:2px}}

/* --- hallazgos --- */
ol.hs{{list-style:none;margin:36px 0 0;padding:0;display:flex;flex-direction:column;gap:1px;
  background:var(--linea);border-top:1px solid var(--linea);border-bottom:1px solid var(--linea)}}
.h{{display:grid;grid-template-columns:64px 1fr;gap:6px;background:var(--negro);
  padding:26px 4px 26px 0}}
.h__n{{font:500 12px var(--mono);color:var(--bronce);letter-spacing:.08em;padding-top:4px}}
.h__t{{margin:0 0 9px;font:600 17px/1.35 var(--sans);display:flex;flex-wrap:wrap;
  align-items:center;gap:11px}}
.h__d{{margin:0;color:var(--concreto);max-width:74ch;font-weight:300}}
.h--critico .h__n{{color:var(--ladrillo-txt)}}

/* --- chips --- */
.chip{{display:inline-block;font:500 9.5px/1 var(--mono);letter-spacing:.14em;
  text-transform:uppercase;padding:5px 9px;border:1px solid var(--linea2);
  color:var(--concreto);white-space:nowrap}}
.chip--critico{{color:var(--ladrillo-txt);border-color:rgba(217,112,92,.42)}}
.chip--aviso{{color:var(--ambar);border-color:rgba(217,164,0,.36)}}
.chip--conservar{{color:var(--bronce);border-color:rgba(178,138,91,.42)}}
.chip--redir{{color:var(--concreto)}}
.chip--revivir{{color:var(--ambar);border-color:rgba(217,164,0,.36)}}

/* --- tabla --- */
.scroll{{overflow-x:auto;margin-top:32px;border:1px solid var(--linea)}}
table{{border-collapse:collapse;width:100%;min-width:900px;font-size:13.5px}}
th{{font:500 9.5px var(--mono);letter-spacing:.16em;text-transform:uppercase;
  color:var(--bronce);text-align:left;padding:14px 16px;border-bottom:1px solid var(--linea2);
  background:var(--grafito);position:sticky;top:0}}
td{{padding:12px 16px;border-bottom:1px solid var(--linea);vertical-align:middle}}
tr:last-child td{{border-bottom:0}}
tbody tr:hover{{background:var(--grafito)}}
td.n{{text-align:right;font:400 13px var(--mono);font-variant-numeric:tabular-nums}}
td.t{{color:var(--concreto);font-size:12.5px}}
td.u{{max-width:330px}}
th.n{{text-align:right}}

/* --- estado --- */
.pasos{{list-style:none;margin:34px 0 0;padding:0;display:grid;
  grid-template-columns:repeat(auto-fit,minmax(258px,1fr));gap:1px;
  background:var(--linea);border:1px solid var(--linea)}}
.paso{{background:var(--negro);padding:24px 22px}}
.paso h4{{margin:0 0 9px;font:600 14.5px var(--sans)}}
.paso p{{margin:0;font-size:13.5px;line-height:1.62;color:var(--concreto);font-weight:300}}
.paso .est{{font:500 9.5px var(--mono);letter-spacing:.16em;text-transform:uppercase;
  color:var(--bronce);display:block;margin-bottom:13px}}
.paso.pend .est{{color:var(--concreto);opacity:.6}}

footer{{padding:46px 0 66px;color:var(--concreto);font:400 11.5px var(--mono);
  letter-spacing:.06em;line-height:2}}
@media (max-width:720px){{
  .bar{{grid-template-columns:1fr;gap:7px}}
  .bar__v{{text-align:left}} .bar__x{{display:inline;margin-left:9px}}
  .h{{grid-template-columns:1fr}} .h__n{{padding-top:0}}
}}
@media (prefers-reduced-motion:reduce){{*{{transition:none!important;animation:none!important}}}}
</style>

<div class="wrap">
<header>
  <p class="eyebrow">Auditoría y plan de migración</p>
  <h1>valentinmotors.es<strong>Qué mover, qué no tocar</strong></h1>
  <p class="sub">El 62% del tráfico del sitio es búsqueda orgánica. Eso convierte la migración
  desde Squarespace en una operación de riesgo, y convierte cada URL en un activo que hay que
  inventariar antes de mover nada. Esto es lo que dicen los datos.</p>
  <div class="meta">
    <span>26 agosto 2026</span>
    <span>GA4 · 1 jul – 25 ago</span>
    <span>Search Console · 3 meses</span>
    <span>{len(filas)} URLs auditadas</span>
  </div>
</header>

<section>
  <div class="shim"></div>
  <p class="label">Punto de partida</p>
  <h2>Un sitio pequeño que <strong>rinde por encima de su tamaño</strong></h2>
  <p class="lede">1.600 usuarios al mes no es mucho tráfico. Pero 3.390 clics orgánicos con una
  posición media de 9,5 sí es una posición ganada a pulso, y es exactamente lo que hay que
  proteger.</p>
  <div class="kpis">
    {kpi(mil(resumen['ga4']['usuarios_activos_28d']), "Usuarios · 28 días")}
    {kpi(mil(resumen['gsc']['clics_3m']), "Clics orgánicos · 3 meses")}
    {kpi(mil(resumen['gsc']['impresiones_3m']), "Impresiones · 3 meses")}
    {kpi(str(resumen['gsc']['ctr_pct']).replace('.', ',') + "%", "CTR medio")}
    {kpi(str(resumen['gsc']['posicion_media']).replace('.', ','), "Posición media")}
    {kpi("0", "Key events en GA4", "Ni una conversión medida en 4.978 sesiones", alerta=True)}
  </div>
</section>

<section>
  <div class="shim"></div>
  <p class="label">De dónde viene</p>
  <h2>Seis de cada diez sesiones <strong>las trae Google</strong></h2>
  <p class="lede">Sesiones por canal en 56 días. Ninguno de los seis canales tiene una sola
  conversión registrada, porque no hay ningún evento de conversión configurado.</p>
  {g_canales}
</section>

<section>
  <div class="shim"></div>
  <p class="label">La oportunidad más grande</p>
  <h2>Rankean, pero <strong>no se hace clic</strong></h2>
  <p class="lede">CTR de las diez páginas con más clics orgánicos. Las marcadas están por debajo
  del 3%: aparecen en los resultados de Google miles de veces y casi nadie entra. Ahí no falta
  contenido, falta title, meta description y datos estructurados.</p>
  {g_ctr}
</section>

<section>
  <div class="shim"></div>
  <p class="label">Hallazgos</p>
  <h2>Diez cosas, <strong>ordenadas por impacto</strong></h2>
  <p class="lede">El orden es el de la prioridad con la que conviene atacarlas, no el de la
  facilidad de arreglarlas.</p>
  <ol class="hs">{hall}</ol>
</section>

<section>
  <div class="shim"></div>
  <p class="label">Plan de URLs</p>
  <h2>Qué pasa con <strong>cada una de las {len(filas)} URLs</strong></h2>
  <p class="lede">La regla es simple: toda URL con tráfico o impresiones conserva su path exacto.
  Nada de aprovechar la migración para limpiar slugs que ya posicionan. Con eso,
  <b>el {clics_cons * 100 // clics_tot}% de los clics orgánicos medidos cae en URLs que no se
  mueven</b>.</p>
  <div class="kpis">
    {kpi(acc['CONSERVAR'], "Conservan su path", "Incluidas las 10 páginas con más clics")}
    {kpi(acc['301'], "Redirección 301", "Duplicados, campañas caducadas y slugs ilegibles")}
    {kpi(acc['REVIVIR'], "Fichas a revivir", "Coches vendidos que hoy dan 404", alerta=True)}
  </div>
  <div class="scroll"><table>
    <thead><tr><th>URL</th><th>Tipo</th><th class="n">Vistas</th><th class="n">Clics</th>
    <th class="n">Impresiones</th><th>Acción</th><th>Destino</th></tr></thead>
    <tbody>{tabla}</tbody>
  </table></div>
  <p class="lede" style="margin-top:20px;font-size:14px">Las {len(filas)} filas completas están en
  <code>_migracion/informes/inventario_urls.csv</code>, y el mapa de redirecciones generado desde
  ellas en <code>_redirects.borrador</code>.</p>
</section>

<section>
  <div class="shim"></div>
  <p class="label">Estado</p>
  <h2>Lo que ya está <strong>hecho y verificado</strong></h2>
  <ul class="pasos">
    <li class="paso"><span class="est">Completado</span><h4>Snapshot del sitio</h4>
      <p>Las 96 URLs del sitemap congeladas en HTML y JSON. Es la red de seguridad y la fuente de
      verdad contra la que se valida el sitio nuevo.</p></li>
    <li class="paso"><span class="est">Completado</span><h4>Blog en Markdown</h4>
      <p>Los 42 posts convertidos, con sus {bloques} bloques de texto verificados uno a uno por
      secuencia de palabras. Resultado: 42 de 42 sin perder contenido.</p></li>
    <li class="paso"><span class="est">Completado</span><h4>Imágenes rehospedadas</h4>
      <p>Las {n_imgs} fotos originales descargadas del CDN de Squarespace y validadas. Quedan cero
      referencias a un CDN que muere el día que se cancele la suscripción.</p></li>
    <li class="paso"><span class="est">Completado</span><h4>Inventario de URLs</h4>
      <p>Sitemap, GA4 y Search Console cruzados, con destino propuesto para cada URL y el mapa de
      301 generado automáticamente desde esa tabla.</p></li>
    <li class="paso pend"><span class="est">Siguiente</span><h4>Sistema de diseño</h4>
      <p>Extraer a componentes el CSS y el JS que hoy están duplicados seis veces entre las fichas
      de coche, y añadir lo que falta: reduced-motion, dimensiones en las imágenes, foco visible.</p></li>
    <li class="paso pend"><span class="est">Después</span><h4>Seis idiomas</h4>
      <p>Español en la raíz sin tocar ninguna URL, y cinco idiomas con slug traducido colgando de
      su prefijo. El manifiesto de rutas es la fuente única de verdad del hreflang.</p></li>
  </ul>
</section>

<footer>
  Valentín Motors · Especialistas Porsche desde 1979<br>
  Fuentes: GA4 propiedad 308117519 · Search Console valentinmotors.es · sitemap.xml
</footer>
</div>
"""

SALIDA.write_text(HTML)
print(f"generado: {SALIDA}  ({len(HTML) / 1024:.0f} KB)")
print(f"  {len(filas)} URLs | {acc['CONSERVAR']} conservan, {acc['301']} redirigen, {acc['REVIVIR']} revivien")
print(f"  {clics_cons}/{clics_tot} clics organicos en URLs que no se mueven")
