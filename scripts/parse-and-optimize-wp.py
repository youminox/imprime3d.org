import xml.etree.ElementTree as ET
import json
import os
import re
import html
from collections import Counter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XML_PATH = os.path.join(ROOT_DIR, "imprimeen3d.WordPress.2026-11-04.xml")
DATA_DIR = os.path.join(ROOT_DIR, "data")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

CATEGORY_DESCRIPTIONS = {
    "guias": "Comparativas técnicas, análisis de características y guías de compra para elegir la impresora 3D FDM o de resina ideal según tu nivel, presupuesto y tipo de proyecto.",
    "mantenimiento": "Manuales paso a paso de mantenimiento preventivo, limpieza de boquillas (nozzles), cuidado de camas calientes, lubricación de ejes y conservación de impresoras 3D.",
    "problemas-y-soluciones": "Diagnóstico y solución definitiva a los fallos más frecuentes en impresión 3D: atascos de extrusor, capas desplazadas, falta de adherencia, warping y errores térmicos.",
    "disenos": "Ideas rentables, modelos funcionales para el hogar, accesorios útiles, organizadores y proyectos creativos listos para fabricar y comercializar con tu impresora 3D.",
    "trucos": "Ajustes avanzados de laminado (slicer), optimización de retracción, velocidad, altura de capa y técnicas expertas para conseguir acabados profesionales.",
    "tutoriales-2": "Guías prácticas paso a paso sobre calibración de ejes, nivelación de cama, configuración de sensores de autonivelado, cambio de filamento y dominio del software slicer.",
    "principios-basicos": "Fundamentos esenciales de la fabricación aditiva: qué es una impresora 3D, cómo funciona, partes principales, tipos de tecnologías (FDM, SLA, MSLA) y materiales.",
    "aplicacion": "Aplicaciones reales de la impresión 3D en arquitectura, medicina, odontología, industria automotriz, educación, gastronomía, joyería y manufactura moderna.",
    "tutoriales": "Tutoriales detallados para principiantes y usuarios avanzados: cómo evitar el efecto warping, imprimir en múltiples colores, reciclar filamentos y proteger piezas de la humedad.",
    "consejos": "Recomendaciones prácticas para ahorrar filamento, reducir el ruido, almacenar bobinas sin humedad, imprimir con TPU flexible y mejorar la estabilidad estructural.",
    "resenas": "Análisis a fondo de modelos destacados de impresoras 3D de filamento y resina UV: especificaciones técnicas, precisión, velocidad de impresión y ventajas competitivas.",
}

CATEGORY_NAMES_CLEAN = {
    "guias": "Guías de Compra y Comparativas",
    "mantenimiento": "Mantenimiento y Cuidado",
    "problemas-y-soluciones": "Problemas y Soluciones Técnicas",
    "disenos": "Diseños y Proyectos 3D",
    "trucos": "Trucos y Ajustes de Impresión",
    "tutoriales-2": "Tutoriales de Calibración y Slicer",
    "principios-basicos": "Principios Básicos",
    "aplicacion": "Aplicaciones Industriales y Creativas",
    "tutoriales": "Tutoriales Paso a Paso",
    "consejos": "Consejos de Optimización",
    "resenas": "Reseñas de Impresoras 3D",
}

# 4 duplicate -2 slugs that will be 301-redirected to their primary canonical post
DUPLICATE_DASH2_REDIRECTS = {
    "que-es-y-como-funciona-una-impresora-3d-2": "/principios-basicos/que-es-y-como-funciona-una-impresora-3d/",
    "como-usar-impresoras-3d-en-la-arquitectura-2": "/aplicacion/como-usar-impresoras-3d-en-la-arquitectura/",
    "como-solucionar-problemas-comunes-en-impresoras-3d-2": "/tutoriales/como-solucionar-problemas-comunes-en-impresoras-3d/",
    "consejos-para-mejorar-la-adherencia-en-la-cama-de-impresion-2": "/consejos/consejos-para-mejorar-la-adherencia-en-la-cama-de-impresion/",
}

# Priority SEO & High-Retention Slugs (including #1 Ahrefs Warping winner + core pillar guides)
TOP_SEO_SLUGS = {
    "como-evitar-errores-de-warping-en-impresion-3d",  # #1 in Spain for "efecto warping" & #7 "warping impresora 3d"
    "que-es-y-como-funciona-una-impresora-3d",
    "mejores-impresoras-3d-para-principiantes-en-casa",
    "impresora-3d-de-resina-vs-filamento-cual-es-mejor-para-ti",
    "como-elegir-tu-primera-impresora-3d",
    "que-materiales-se-utilizan-en-la-impresion-3d",
    "que-software-se-necesita-para-imprimir-en-3d",
    "que-hacer-si-la-boquilla-de-la-impresora-3d-se-obstruye",
    "el-filamento-no-se-adhiere-a-la-cama-soluciones-efectivas",
    "como-nivelar-correctamente-la-cama-de-impresion-paso-a-paso",
    "modelos-para-imprimir-y-vender-en-linea-que-tienen-demanda",
    "que-cosas-utiles-puedes-imprimir-en-casa-con-tu-impresora-3d",
    "tutorial-para-configurar-el-slicer-y-obtener-mejores-resultados",
    "errores-comunes-al-imprimir-en-3d-y-como-evitarlos",
    "como-limpiar-correctamente-la-boquilla-de-tu-impresora-3d",
    "cada-cuanto-debes-hacer-mantenimiento-preventivo-a-tu-impresora-3d",
    "impresion-3d-con-capas-desplazadas-como-corregir",
    "como-configurar-la-retraccion-para-evitar-hilos-cuando-se-imprime-con-abs",
    "descubre-la-impresora-3d-creality-k1c-2024-innovacion-y-precision-en-impresion-3d",
    "elegoo-mars-4-msla-la-impresora-en-3d-ideal-para-impresiones-de-alta-precision",
    "impresora-3d-anycubic-photon-mono-m5s-pro-la-mejor-eleccion-para-impresion-de-alta-calidad",
    "descubre-la-impresora-en-3d-anycubic-kobra-2-neo-innovacion-y-velocidad-al-maximo",
    "descubre-la-impresora-3d-flashforge-adventurer-5m-innovacion-y-velocidad-en-impresion-3d",
    "mejores-marcas-de-impresoras-3d",
}

MOLDES_FULL_CONTENT = """
<h2>¿Por qué elegir una impresora 3D FDM fácil de mantener para fabricar moldes?</h2>
<p>La fabricación de <strong>moldes mediante impresión 3D FDM</strong> (Modelado por Deposición Fundida) ha transformado la creación de prototipos, piezas de silicona, resina epoxi, jabones artesanales, velas, concreto arquitectónico y repostería personalizada. Sin embargo, dado que los moldes suelen requerir sesiones de impresión prolongadas y una alta precisión dimensional en las paredes internas, contar con un equipo de <strong>fácil mantenimiento y calibración estable</strong> es determinante para evitar fallos a mitad del trabajo.</p>
<p>Una impresora 3D FDM optimizada para moldes debe ofrecer acceso rápido al bloque calentador, boquillas intercambiables sin herramientas complejas, extrusor directo de doble engranaje y una superficie de impresión magnética flexible que facilite el despegado sin alterar la nivelación de la base.</p>

<h2>Características clave de las impresoras 3D FDM ideales para moldes</h2>
<h3>1. Sistema de extrusión directa (Direct Drive) de fácil acceso</h3>
<p>Para imprimir moldes —especialmente cuando se emplean filamentos flexibles como <strong>TPU</strong> o materiales resistentes a la temperatura como <strong>PETG y ABS</strong>—, un extrusor directo con engranajes de acero endurecido reduce drásticamente los atascos. Los diseños modulares actuales permiten desmontar el ventilador frontal y acceder al conducto de filamento en pocos minutos para realizar limpiezas preventivas.</p>

<h3>2. Nivelación automática de cama (Auto-Leveling) con compensación en malla</h3>
<p>Un molde necesita una primera capa completamente uniforme para evitar fugas de líquido durante el vaciado posterior. Los sensores inductivos o de galga extensométrica calibran decenas de puntos sobre la placa antes de cada trabajo, eliminando el ajuste manual constante de resortes y tuercas.</p>

<h3>3. Placa de construcción magnética de acero PEI</h3>
<p>Las láminas de <strong>PEI texturizado o liso</strong> garantizan una adherencia firme mientras la cama está caliente y liberan el molde de forma automática al enfriarse. Además, su mantenimiento únicamente requiere limpieza periódica con alcohol isopropílico para eliminar restos de grasa o polvo.</p>

<h2>Mejores materiales FDM para imprimir moldes duraderos</h2>
<ul>
<li><strong>PLA Pro / PLA+:</strong> Excelente rigidez y facilidad de impresión para moldes maestros (positivos) o moldes de vaciado en frío con silicona de platino.</li>
<li><strong>PETG:</strong> Gran resistencia química, baja contracción térmica y superficie naturalmente brillante que facilita el desmoldeo sin necesidad de aplicar grandes cantidades de desmoldante.</li>
<li><strong>TPU (Filamento Flexible):</strong> Ideal para imprimir moldes directos en los que se verterá yeso, cemento, cera o jabón, ya que la elasticidad de las paredes permite extraer la pieza sólida sin romper detalles finos.</li>
<li><strong>ABS y ASA:</strong> Recomendados cuando el molde debe soportar resinas que generan reacciones exotérmicas o cuando se requiere alisar las líneas de capa mediante vapor de acetona para lograr un acabado espejo.</li>
</ul>

<h2>Rutina de mantenimiento rápido para impresoras dedicadas a moldes</h2>
<h3>Limpieza exterior e interior de la boquilla (Nozzle)</h3>
<p>Al terminar una tanda de moldes, calienta el hotend a la temperatura de trabajo del material y pasa un cepillo de cerdas suaves o una toalla sin pelusa para retirar cualquier residuo adherido al exterior de la boquilla. Esto evita que pequeñas gotas quemadas caigan sobre las cavidades internas del siguiente molde.</p>

<h3>Revisión de correas y lubricación de guías</h3>
<p>Para que las dos mitades de un molde bipartito encajen con precisión milimétrica en los pines de registro, verifica mensualmente la tensión de las correas de los ejes X e Y y aplica una capa ligera de grasa de litio o lubricante con PTFE en los husillos del eje Z.</p>

<h2>Preguntas frecuentes sobre impresión 3D FDM de moldes</h2>
<h3>¿Cómo eliminar las líneas de capa dentro de un molde impreso en 3D?</h3>
<p>Puedes reducir la altura de capa a 0.12 mm o 0.16 mm en tu laminador (slicer), activar el planchado (ironing) en las superficies superiores y aplicar un sellador acrílico en spray o una capa fina de resina de recubrimiento antes de realizar el vaciado final.</p>

<h3>¿Qué ángulo de desmoldeo debo incluir en el diseño 3D?</h3>
<p>Si imprimes un molde rígido en PLA o PETG, se recomienda diseñar las paredes verticales con una inclinación mínima de 2° a 3° (ángulo de salida) para facilitar la extracción de la pieza fundida sin dañar el molde.</p>
""".strip()


def clean_evergreen_title(raw_title: str) -> str:
    if not raw_title:
        return ""
    t = html.unescape(raw_title).strip()

    # 1. Strip AI prompt prefixes like 'Título SEO sugerido: "', 'Claro, aquí tienes un título SEO optimizado para tu post: "'
    t = re.sub(
        r"^(?:¡?claro[,!]?\s*)?(?:aqu[ií]\s+tienes\s+[^:\"]+?:\s*)?(?:t[ií]tulo\s+seo(?:\s+sugerido|\s+optimizado)?\s*:\s*)?",
        "",
        t,
        flags=re.I,
    )
    t = re.sub(r"^.*?(?:t[ií]tulo\s+seo[^:]*:\s*)", "", t, flags=re.I)

    # 2. Strip surrounding quotes or stray quotes
    t = t.strip("`\"'“”‘’ ")
    t = t.replace('"', "").replace("“", "").replace("”", "")

    # 3. Replace all year references (2020-2029, 1980-2019) with Evergreen phrasing
    t = re.sub(r"\bCreality\s+K1C\s+20\d\d\b", "Creality K1C", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+Completa\s+20\d\d\b", "Guía Completa y Actualizada", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+de\s+Compra\s+20\d\d\b", "Guía de Compra Actualizada", t, flags=re.I)
    t = re.sub(r"-\s*Gu[ií]a\s+20\d\d\b", "— Guía Completa", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+20\d\d\b", "Guía Completa", t, flags=re.I)
    t = re.sub(r"\s+en\s+20\d\d\?", " Hoy en Día?", t, flags=re.I)
    t = re.sub(r"\s+en\s+20\d\d\b", "", t, flags=re.I)
    t = re.sub(r"\s+del?\s+20\d\d\b", "", t, flags=re.I)
    t = re.sub(r"\s+20\d\d\b", "", t)
    t = re.sub(r"\b(?:19\d\d|20\d\d)\b", "", t)

    t = re.sub(r"\s{2,}", " ", t).strip(" -–—:;,")
    return t


def make_text_evergreen(text_segment: str) -> str:
    """Remove all year mentions (19xx, 20xx) from visible text while keeping grammar natural."""
    s = text_segment
    s = re.sub(r"\bCreality\s+K1C\s+20\d\d\b", "Creality K1C", s, flags=re.I)
    s = re.sub(r"\bK1C\s+20\d\d\b", "K1C", s, flags=re.I)
    s = re.sub(r"Gu[ií]a\s+Completa\s+20\d\d\b", "Guía Completa", s, flags=re.I)
    s = re.sub(r"Gu[ií]a\s+de\s+Compra\s+20\d\d\b", "Guía de Compra", s, flags=re.I)
    s = re.sub(r"Gu[ií]a\s+20\d\d\b", "Guía Completa", s, flags=re.I)
    s = re.sub(r"\bEn\s+el\s+a[ñn]o\s+(?:19|20)\d\d\s*,?", "En la actualidad,", s)
    s = re.sub(r"\ben\s+el\s+a[ñn]o\s+(?:19|20)\d\d\b", "en la actualidad", s, flags=re.I)
    s = re.sub(r"\bEn\s+20\d\d\s*,", "En la actualidad,", s)
    s = re.sub(r"\ben\s+20\d\d\s*\?", "hoy en día?", s, flags=re.I)
    s = re.sub(r"\ben\s+20\d\d\b", "en la actualidad", s, flags=re.I)
    s = re.sub(r"\bpara\s+20\d\d\b", "para la actualidad", s, flags=re.I)
    s = re.sub(r"\bdel\s+20\d\d\b", "actual", s, flags=re.I)
    s = re.sub(r"\bde\s+20\d\d\b", "actual", s, flags=re.I)
    s = re.sub(r"\bFundada\s+en\s+(?:19|20)\d\d\s*,", "Desde su fundación,", s)
    s = re.sub(r"\bfundada\s+en\s+(?:19|20)\d\d\b", "desde su fundación", s, flags=re.I)
    s = re.sub(r"\bdesde\s+su\s+fundaci[óo]n\s+en\s+(?:19|20)\d\d\b", "desde su fundación", s, flags=re.I)
    s = re.sub(r"\ba\s+mediados\s+de\s+la\s+d[ée]cada\s+de\s+1980\b", "en las primeras etapas de la manufactura aditiva", s, flags=re.I)
    s = re.sub(r"\bd[ée]cada\s+de\s+(?:19|20)\d\d\b", "etapa pionera", s, flags=re.I)
    # Catch any remaining standalone 19xx/20xx year in visible text
    s = re.sub(r"\b(?:19\d\d|20\d\d)\b", "", s)
    s = re.sub(r"\s{2,}", " ", s)
    s = re.sub(r"\s+([,.;:?!])", r"\1", s)
    return s


def apply_evergreen_outside_tags(html_str: str) -> str:
    """Apply evergreen year removal only to text nodes outside HTML tags (<...>) so URLs in src/href stay intact."""
    parts = re.split(r"(<[^>]+>)", html_str)
    for i in range(0, len(parts), 2):
        if parts[i]:
            parts[i] = make_text_evergreen(parts[i])
    return "".join(parts)


def extract_aib_related_links(raw_html: str):
    """Extract internal links from [aib_post_related url='...' title='...'] and clean their titles."""
    links = []
    seen_urls = set()
    for m in re.finditer(r"\[aib_post_related([^\]]*)\]", raw_html, flags=re.I):
        attrs = m.group(1)
        url_m = re.search(r"url=['\"]([^'\"]+)['\"]", attrs)
        title_m = re.search(r"title=['\"]([^'\"]+)['\"]", attrs)
        if url_m and title_m:
            u = url_m.group(1).strip()
            t = clean_evergreen_title(title_m.group(1))
            if not u.startswith("/"):
                u = "/" + u
            if not u.endswith("/"):
                u = u + "/"
            # Map any -2 duplicate URL to its primary URL
            slug_part = u.strip("/").split("/")[-1]
            if slug_part in DUPLICATE_DASH2_REDIRECTS:
                u = DUPLICATE_DASH2_REDIRECTS[slug_part]
            if u not in seen_urls and t:
                seen_urls.add(u)
                links.append({"url": u, "title": t})
    return links


def extract_orbital_amazon_products(raw_html: str):
    """Extract custom-links from wp:orbital/cluster for backup before removing them."""
    products = []
    for m in re.finditer(r"<!--\s*wp:orbital/cluster\s+(\{.*?\})\s*/?-->", raw_html, flags=re.S):
        try:
            data = json.loads(m.group(1))
            if data.get("display") == "custom-links" and "settings" in data:
                settings = json.loads(data["settings"])
                for key, item in settings.items():
                    if isinstance(item, dict) and item.get("link"):
                        products.append(
                            {
                                "heading": item.get("heading", ""),
                                "link": item.get("link", ""),
                                "urlThumbnail": item.get("urlThumbnail", ""),
                                "button": item.get("button", "Ver Oferta en Amazon"),
                            }
                        )
        except Exception:
            pass
    return products


def clean_content(slug: str, raw_html: str) -> str:
    if slug == "impresoras-3d-fdm-para-imprimir-moldes-mas-faciles-de-mantener":
        return MOLDES_FULL_CONTENT

    if not raw_html:
        return ""

    h = raw_html

    # 1. Remove all WordPress block comments (including wp:orbital/cluster with Amazon links)
    h = re.sub(r"<!--\s*/?wp:[^>]*-->", "", h)

    # 2. Remove broken <div id='video-container'> blocks (502 posts)
    h = re.sub(
        r"<div\s+id=['\"]video-container['\"][\s\S]*?</noscript>\s*</div>",
        "",
        h,
        flags=re.I,
    )
    h = re.sub(
        r"<div\s+id=['\"]video-container['\"][\s\S]*?</div>\s*</div>",
        "",
        h,
        flags=re.I,
    )

    # 3. Remove [aib_post_related ...] and other shortcodes
    h = re.sub(r"\[aib_post_related[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[insertar[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[caption[^\]]*\](.*?)\[/caption\]", r"\1", h, flags=re.S | re.I)
    h = re.sub(r"\[gallery[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[embed\](.*?)\[/embed\]", r"\1", h, flags=re.S | re.I)

    # 4. Convert leftover **bold** markdown to <strong> (found in 97 posts)
    h = re.sub(r"\*\*([^*<>]+)\*\*", r"<strong>\1</strong>", h)

    # 5. Normalize internal imprime3d.org URLs (strip domain and ensure trailing slash)
    h = re.sub(
        r"https?://(?:www\.)?imprime3d\.org/([a-z0-9-_]+/[a-z0-9-_]+)/?(?=['\"\s>])",
        r"/\1/",
        h,
        flags=re.I,
    )

    # 6. Apply Evergreen transformation to all visible text outside HTML tags
    h = apply_evergreen_outside_tags(h)

    # 7. Remove empty paragraphs and excessive line breaks
    h = re.sub(r"<p>\s*(?:&nbsp;|\s|<br\s*/?>)*\s*</p>", "", h, flags=re.I)
    h = re.sub(r"(\s*<br\s*/?>\s*){2,}", "<br />", h, flags=re.I)
    h = re.sub(r"\n{3,}", "\n\n", h)

    return h.strip()


def generate_clean_excerpt(content_html: str, max_length: int = 158) -> str:
    if not content_html:
        return ""
    paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", content_html, flags=re.I | re.S)
    text_source = " ".join(paragraphs[:3]) if paragraphs else content_html
    text = re.sub(r"<[^>]*>", " ", text_source)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= max_length:
        return text
    truncated = text[:max_length]
    last_space = truncated.rfind(" ")
    if last_space > max_length * 0.6:
        truncated = truncated[:last_space]
    return truncated.rstrip(".,;: ") + "..."


def calculate_read_time(content_html: str) -> str:
    text = re.sub(r"<[^>]*>", " ", content_html)
    words = len(text.split())
    minutes = max(4, round(words / 200))
    return f"{minutes} min"


def generate_disavow_file():
    """Generate Google Search Console Disavow file blocking the toxic spam domains from Ahrefs PDFs."""
    disavow_content = """# Archivo Disavow para Google Search Console - imprime3d.org
# Generado a partir de la auditoria de Ahrefs (670 dominios de referencia / 724 backlinks SPAM)
# Subir en: https://search.google.com/search-console/disavow-links

domain:factmags.com
domain:backlinker.shop
domain:buybacklinks.agency
domain:strongboosthub.shop
domain:vividranklab.shop
domain:linkrankpro.shop
domain:ranklinkerpro.shop
domain:seorankflow.shop
domain:buyseobacklinks.shop
domain:rankshiftseo.shop
domain:rankboostly.shop
domain:linkseopro.shop
domain:seolinkpro.shop
domain:seoexpress.shop
domain:kmoshops.shop
domain:thebacklinks.shop
domain:seoexpress.site
domain:theseorankinghigh.shop
domain:seoexpress.website
domain:thehighseo.shop
domain:seo-high-ranking.shop
domain:123webshop.shop
domain:theguestposts.shop
domain:seoexpress.online
domain:link-baron-optimal-organic-collective.store
domain:thehighrankseo.shop
domain:simplywebshop.shop
domain:ekenkoshop.shop
domain:mysky-shop.shop
domain:seorankinghigh.shop
domain:agile-footer-link-system-link-baron.store
domain:m98ufa.com
domain:kawaiishop.shop
domain:therankinghighseo.shop
domain:rankinghighseo.shop
domain:exclusive-traffic-experts-seoexpress.store
domain:highseo.shop
domain:lixil-reformshop.shop
domain:link-baron-pro-press-release.store
domain:therankboostseo.shop
domain:link-baron-wiki-leading-system.store
domain:advanced-search-seoexpress-pros.store
domain:high-outrank-hq-dofollow-platform.store
domain:exclusive-link-baron-search-syndicate.store
domain:outrank-hq-engine-dofollow.store
domain:best-seoexpress-off-page-network.store
domain:master-rank-forge-pbn-league.store
domain:seoexpress-master-digital-portal.store
domain:link-baron-center-backlink.store
domain:seoexpress-dr-90-group.store
domain:clearranklab.shop
domain:creativeposts.top
domain:indexviro.shop
domain:easylinkpro.shop
domain:master-seoexpress-search-agency.store
domain:indexrivo.shop
domain:outrank-hq-master-anchor-text.store
domain:37486415.xyz
domain:linksnatcher.com
domain:linkharvest.shop
domain:bitproperty.online
domain:ranktexa.shop
domain:outrank-hq-ultimate-ranking.store
domain:professional-seo-link-directory.verified-digital-firm-seoexpress.store
domain:high-authority-link-directory.epic-syndicate-link-baron-keyword.store
domain:flenro.shop
domain:seoexpress-white-hat-group.store
domain:fashionclothingnews.com
domain:rankstock.shop
domain:official-anchor-text-seoexpress-system.store
domain:serpqira.shop
domain:37486131.xyz
domain:domainrankboost.shop
domain:supreme-anchor-text-provider-seoexpress.store
domain:searchrankbuilders.shop
domain:certified-seoexpress-organic-services.store
domain:37486427.xyz
domain:37486412.xyz
domain:easyranklab.shop
domain:master-off-page-seoexpress-directory.store
domain:byteshort.xyz
domain:37486369.xyz
domain:ctr-agency-rank-forge.store
domain:seolinkexpress.shop
domain:getranked.site
domain:link-building-and-digital-pr-trusted-partners.store
domain:modern-link-baron-marketing-portal.store
domain:37486428.xyz
domain:seomart.shop
domain:seozaro.shop
domain:37486170.xyz
domain:boldranklab.shop
domain:37486140.xyz
"""
    disavow_path = os.path.join(ROOT_DIR, "disavow-google-search-console.txt")
    with open(disavow_path, "w", encoding="utf-8") as f:
        f.write(disavow_content)


def main():
    print("📖 Parsing WordPress XML:", XML_PATH)
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    channel = root.find("channel")

    ns = {
        "wp": "http://wordpress.org/export/1.2/",
        "content": "http://purl.org/rss/1.0/modules/content/",
        "excerpt": "http://purl.org/rss/1.0/modules/excerpt/",
        "dc": "http://purl.org/dc/elements/1.1/",
    }

    # 1. Extract categories
    categories = []
    cat_by_slug = {}
    for cat_el in channel.findall("wp:category", namespaces=ns):
        cid = int(cat_el.findtext("wp:term_id", default="0", namespaces=ns))
        slug = (cat_el.findtext("wp:category_nicename", default="", namespaces=ns) or "").strip()
        raw_name = (cat_el.findtext("wp:cat_name", default="", namespaces=ns) or "").strip()
        parent = (cat_el.findtext("wp:category_parent", default="", namespaces=ns) or "").strip()
        desc = CATEGORY_DESCRIPTIONS.get(slug) or (
            cat_el.findtext("wp:category_description", default="", namespaces=ns) or ""
        ).strip()
        clean_name = CATEGORY_NAMES_CLEAN.get(slug, raw_name)
        cat_obj = {
            "id": cid,
            "slug": slug,
            "name": clean_name,
            "parent": parent,
            "description": desc,
            "count": 0,
        }
        categories.append(cat_obj)
        cat_by_slug[slug] = cat_obj

    # 2. First pass: collect attachments and ads.txt
    attachments = {}
    image_urls = set()
    ads_txt_content = "google.com, pub-1070738569472471, DIRECT, f08c47fec0942fa0\n"

    for item in channel.findall("item"):
        pt = item.findtext("wp:post_type", default="", namespaces=ns)
        if pt == "attachment":
            pid = int(item.findtext("wp:post_id", default="0", namespaces=ns))
            url = (item.findtext("wp:attachment_url", default="", namespaces=ns) or "").strip()
            if url:
                attachments[pid] = url
                image_urls.add(url)
        elif pt == "adstxt":
            c = (item.findtext("content:encoded", default="", namespaces=ns) or "").strip()
            if c:
                ads_txt_content = c + "\n"

    with open(os.path.join(PUBLIC_DIR, "ads.txt"), "w", encoding="utf-8") as f:
        f.write(ads_txt_content)

    # Ensure Charlie Lingan author photo & site logo are included
    image_urls.add("https://imprime3d.org/wp-content/uploads/2024/08/charlie-lingan-1.jpg")
    image_urls.add("https://imprime3d.org/wp-content/uploads/2024/06/cropped-IMPRIME-EN-3D.png")

    # 3. Second pass: collect posts, pages, and backup Amazon products
    posts = []
    pages = []
    amazon_backup = {}
    seen_titles = Counter()
    skipped_duplicates = []

    for item in channel.findall("item"):
        pt = item.findtext("wp:post_type", default="", namespaces=ns)
        st = item.findtext("wp:status", default="", namespaces=ns)
        if pt not in ("post", "page") or st != "publish":
            continue

        pid = int(item.findtext("wp:post_id", default="0", namespaces=ns))
        raw_title = item.findtext("title", default="") or ""
        slug = (item.findtext("wp:post_name", default="", namespaces=ns) or "").strip()
        date_str = (item.findtext("wp:post_date", default="", namespaces=ns) or "").strip()
        mod_str = (item.findtext("wp:post_modified", default="", namespaces=ns) or "").strip()
        raw_content = item.findtext("content:encoded", default="", namespaces=ns) or ""

        # Skip the 4 duplicate -2 posts (they are 301-redirected in next.config.ts)
        if pt == "post" and slug in DUPLICATE_DASH2_REDIRECTS:
            skipped_duplicates.append(slug)
            continue

        # Backup any orbital Amazon products before stripping them
        amz_prods = extract_orbital_amazon_products(raw_content)
        if amz_prods:
            amazon_backup[slug] = amz_prods
            for prod in amz_prods:
                if prod.get("urlThumbnail"):
                    image_urls.add(prod["urlThumbnail"])

        # Extract inline aib_post_related links
        inline_related = extract_aib_related_links(raw_content)

        # Extract categories
        post_cats = []
        for c in item.findall("category"):
            if c.attrib.get("domain") == "category":
                c_slug = c.attrib.get("nicename", "").strip()
                c_name = CATEGORY_NAMES_CLEAN.get(c_slug, (c.text or "").strip())
                if c_slug:
                    post_cats.append({"slug": c_slug, "name": c_name})

        primary_cat = post_cats[0] if post_cats else {"slug": "guias", "name": "Guías de Compra y Comparativas"}

        # Featured image ID
        thumb_id = None
        for meta in item.findall("wp:postmeta", namespaces=ns):
            if meta.findtext("wp:meta_key", default="", namespaces=ns) == "_thumbnail_id":
                val = meta.findtext("wp:meta_value", default="", namespaces=ns)
                if val and val.isdigit():
                    thumb_id = int(val)
                break

        featured_url = attachments.get(thumb_id, "") if thumb_id else ""
        if not featured_url and pt == "post":
            # Fallback image for the 1 post without a thumbnail
            featured_url = "https://imprime3d.org/wp-content/uploads/2026/02/impresoras-3D-FDM-para-imprimir-moldes-con-mayor-precision-de-detalles.jpg"
        if featured_url:
            image_urls.add(featured_url)

        # Extract any inline wp-content image URLs
        for m in re.finditer(
            r"https?://(?:www\.)?imprime3d\.org/wp-content/uploads/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp|gif)",
            raw_content,
            flags=re.I,
        ):
            image_urls.add(m.group(0).replace("http://", "https://").replace("//www.", "//"))

        cleaned_html = clean_content(slug, raw_content)

        if slug == "impresoras-3d-fdm-para-imprimir-moldes-mas-faciles-de-mantener":
            cleaned_title = "Las Mejores Impresoras 3D FDM para Imprimir Moldes: Fáciles de Mantener y Calibrar"
        else:
            cleaned_title = clean_evergreen_title(raw_title) if pt == "post" else (raw_title or slug)

        if pt == "post":
            seen_titles[cleaned_title.lower()] += 1
            if seen_titles[cleaned_title.lower()] > 1:
                cleaned_title = f"{cleaned_title} — Guía Práctica"

        excerpt = generate_clean_excerpt(cleaned_html)
        read_time = calculate_read_time(cleaned_html)
        is_top_seo = slug in TOP_SEO_SLUGS

        record = {
            "id": pid,
            "title": cleaned_title,
            "slug": slug,
            "category": primary_cat["slug"],
            "categoryName": primary_cat["name"],
            "categories": post_cats,
            "date": date_str,
            "modified": mod_str or date_str,
            "readTime": read_time,
            "content": cleaned_html,
            "excerpt": excerpt,
            "featuredImageId": thumb_id,
            "featuredImageUrl": featured_url,
            "inlineRelated": inline_related[:4],
            "isTopSeo": is_top_seo,
            "type": pt,
            "status": st,
        }

        if pt == "page":
            pages.append(record)
        else:
            posts.append(record)

    # Sort posts: newest first
    posts.sort(key=lambda x: x["date"], reverse=True)

    # Count categories
    for c in categories:
        c["count"] = 0
    for p in posts:
        matched_slugs = {p["category"]} | {c["slug"] for c in p["categories"]}
        for s in matched_slugs:
            if s in cat_by_slug:
                cat_by_slug[s]["count"] += 1

    active_categories = [c for c in categories if c["count"] > 0]
    active_categories.sort(key=lambda x: x["count"], reverse=True)

    # Save JSON files
    with open(os.path.join(DATA_DIR, "posts.json"), "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "categories.json"), "w", encoding="utf-8") as f:
        json.dump(active_categories, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "image-urls.json"), "w", encoding="utf-8") as f:
        json.dump(sorted(image_urls), f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "amazon-products-backup.json"), "w", encoding="utf-8") as f:
        json.dump(amazon_backup, f, ensure_ascii=False, indent=2)

    # Save lightweight search-index.json in public/
    search_index = [
        {
            "t": p["title"],
            "s": p["slug"],
            "c": p["category"],
            "n": p["categoryName"],
            "r": p["readTime"],
        }
        for p in posts
    ]
    with open(os.path.join(PUBLIC_DIR, "search-index.json"), "w", encoding="utf-8") as f:
        json.dump(search_index, f, ensure_ascii=False)

    # Generate Google Search Console Disavow file
    generate_disavow_file()

    # Strict Evergreen & Quality Audits
    remaining_amz = sum(1 for p in posts if "amzn.to" in p["content"])
    remaining_vid = sum(1 for p in posts if "video-container" in p["content"])
    remaining_aib = sum(1 for p in posts if "[aib_post_related" in p["content"])
    remaining_ai_titles = sum(
        1 for p in posts if re.search(r"t[ií]tulo\s*seo|claro.*t[ií]tulo", p["title"], re.I)
    )
    remaining_title_years = sum(
        1 for p in posts if re.search(r"\b(?:19\d\d|20\d\d)\b", p["title"])
    )
    remaining_content_years = 0
    for p in posts:
        plain_text = re.sub(r"<[^>]+>", " ", p["content"])
        if re.search(r"\b(?:19\d\d|20\d\d)\b", plain_text):
            remaining_content_years += 1

    top_seo_count = sum(1 for p in posts if p["isTopSeo"])

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ Published unique posts processed:   {len(posts)} (4 '-2' duplicates consolidated via 301)")
    print(f"✅ Top SEO priority posts flagged:     {top_seo_count}")
    print(f"✅ Published pages processed:          {len(pages)}")
    print(f"✅ Active categories:                  {len(active_categories)}")
    print(f"✅ Unique image URLs to download:      {len(image_urls)}")
    print(f"✅ Search index items generated:       {len(search_index)}")
    print(f"✅ Amazon links left in HTML:          {remaining_amz} (Backed up {len(amazon_backup)} clusters)")
    print(f"✅ Broken video containers left:       {remaining_vid}")
    print(f"✅ Raw [aib_post_related] left:        {remaining_aib}")
    print(f"✅ AI prompt leaks in titles left:     {remaining_ai_titles}")
    print(f"✅ Years left in titles (Evergreen):   {remaining_title_years}")
    print(f"✅ Years left in content (Evergreen):  {remaining_content_years}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


if __name__ == "__main__":
    main()
