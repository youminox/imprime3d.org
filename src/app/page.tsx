import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrinterAdvisor from "@/components/PrinterAdvisor";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import AmazonAffiliateBox from "@/components/AmazonAffiliateBox";
import ReadingProgress from "@/components/ReadingProgress";
import ClientEffects from "@/components/ClientEffects";
import SplitHeading from "@/components/SplitHeading";
import OpenChatButton from "@/components/OpenChatButton";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import ThermalExtrusionSvg from "@/components/home/ThermalExtrusionSvg";
import PrinterOrbit, { type OrbitItem } from "@/components/home/PrinterOrbit";
import PrinterCounters, { type CounterItem } from "@/components/home/PrinterCounters";
import DayNightSlider from "@/components/home/DayNightSlider";
import MomentsCarousel, { type Moment } from "@/components/home/MomentsCarousel";
import FilamentCostBlock, { type FilamentTechOption } from "@/components/home/FilamentCostBlock";
import { getContextualAmazonProducts } from "@/lib/amazon";
import {
  getAllPosts,
  getFeaturedBuyingGuides,
  getTroubleshootingGuides,
  getTopSeoPosts,
  getPostsByCategory,
  getAllCategories,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
} from "@/lib/data";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Mejores Impresoras 3D, Guías de Compra, Calibración y Solución de Fallos`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const CLAIMS = [
  "Impresoras 3D FDM Alta Velocidad",
  "Resina UV MSLA 4K / 9K / 14K",
  "Filamentos PLA+, PETG, ABS, ASA y TPU",
  "Boquillas 0.4 mm Latón y Acero Endurecido",
  "Autonivelado CR-Touch y BLTouch",
  "Extrusor Direct Drive Dual Gear",
  "Placas Magnéticas Flexibles PEI",
  "Parámetros Verificados en UltiMaker Cura",
];

const CLAIMS_2 = [
  "Solución Definitiva al Efecto Warping",
  "Primera Capa 100% Adherida",
  "Desatasco y Limpieza de Hotend",
  "Secado y Conservación de Bobinas",
  "Impresión 3D para Cosplay y Figuras",
  "Moldes, Bisutería y Maquetas",
  "Lubricación de Guías Lineales y Ejes",
  "Proyectos Rentables para Emprender",
];

const HOME_FAQS = [
  {
    q: "¿Qué es mejor para empezar a imprimir en 3D: una impresora de filamento (FDM) o de resina (MSLA)?",
    a: "Para la mayoría de principiantes y uso en el hogar, una impresora de filamento (FDM) utilizando PLA+ es la opción más recomendable: es limpia, económica, no emite olores fuertes y permite fabricar piezas funcionales, soportes, cosplay y objetos medianos o grandes. Las impresoras de resina UV (MSLA) son ideales si tu prioridad principal es crear miniaturas, figuras de colección, odontología o bisutería con detalles microscópicos.",
  },
  {
    q: "¿Qué es el efecto Warping en impresión 3D y cómo se evita al 100%?",
    a: "El efecto Warping ocurre cuando las esquinas inferiores de una pieza impresa en 3D se contraen al enfriarse y se despegan de la cama caliente, curvando la base. Para evitarlo, nivela con precisión el Z-Offset de la primera capa, limpia la placa PEI con alcohol isopropílico IPA 99%, aplica adhesivo térmico (3DLAC), activa un borde ('Brim') de 5 a 8 mm en el Slicer y evita corrientes de aire frío o usa cerramiento térmico en ABS/ASA.",
  },
  {
    q: "¿Cómo funciona el Asesor Técnico IA de Imprime3D.org?",
    a: "Haz clic en el botón flotante 'Asesor IA 3D' en cualquier momento y pregúntale qué impresora 3D comprar según tu proyecto y presupuesto, qué temperaturas usar para PLA, PETG, ABS o TPU, cómo desatascar la boquilla o cómo corregir capas desplazadas. Te responde al instante con parámetros exactos y te enlaza a las guías verificadas de nuestra enciclopedia.",
  },
  {
    q: "¿Qué filamento es más fácil de imprimir y cuál es más resistente?",
    a: "El PLA / PLA+ es el material más fácil de imprimir porque funde a baja temperatura (195 °C–215 °C, cama 55–60 °C) y apenas sufre contracción térmica. Si necesitas mayor resistencia mecánica, térmica y al exterior sin la complejidad del ABS, el PETG (230–245 °C, cama 70–80 °C) es la alternativa más equilibrada para piezas funcionales.",
  },
  {
    q: "¿Cada cuánto tiempo se debe limpiar la boquilla (nozzle) y hacer mantenimiento a una impresora 3D?",
    a: "Se recomienda limpiar la superficie de la cama PEI con alcohol isopropílico antes de cada impresión, revisar residuos en la boquilla cada 25 a 40 horas de trabajo, y realizar un mantenimiento preventivo mensual que incluya limpieza de ventiladores, revisión de tensión de correas GT2 en los ejes X/Y y lubricación con grasa PTFE en el husillo del eje Z.",
  },
  {
    q: "¿Por qué salen hilos (stringing) o burbujas al imprimir y cómo se soluciona?",
    a: "Los hilos finos y los pequeños chasquidos en la boquilla suelen deberse a dos causas: humedad absorbida por la bobina de filamento o una distancia/velocidad de retracción insuficiente en el Slicer. Secar la bobina a 50–55 °C en un secador de filamento durante 4 horas y calibrar la retracción (0.8–1.5 mm en Direct Drive, 4–6 mm en Bowden) elimina el problema.",
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  guias: "🏆",
  mantenimiento: "🧰",
  "problemas-y-soluciones": "🛠️",
  disenos: "💡",
  trucos: "⚡",
  "tutoriales-2": "📐",
  aplicacion: "🏗️",
  consejos: "🎯",
  "principios-basicos": "🧊",
  tutoriales: "📘",
  resenas: "🔬",
};

export default function HomePage() {
  const allPosts = getAllPosts();
  const buyingGuides = getFeaturedBuyingGuides(6);
  const troubleshootingGuides = getTroubleshootingGuides(6);
  const topSeoPosts = getTopSeoPosts(9);
  const categories = getAllCategories();
  const homeAmazon = getContextualAmazonProducts(
    "home-imprime3d",
    "guias",
    "Mejores Impresoras 3D FDM Resina y Filamentos PLA+"
  );

  const explorerPosts = [
    ...buyingGuides,
    ...troubleshootingGuides,
    ...topSeoPosts,
    ...getPostsByCategory("guias").slice(0, 8),
    ...getPostsByCategory("mantenimiento").slice(0, 8),
    ...getPostsByCategory("problemas-y-soluciones").slice(0, 8),
    ...getPostsByCategory("disenos").slice(0, 8),
    ...getPostsByCategory("trucos").slice(0, 6),
    ...getPostsByCategory("tutoriales-2").slice(0, 6),
    ...getPostsByCategory("principios-basicos").slice(0, 5),
    ...getPostsByCategory("aplicacion").slice(0, 5),
    ...getPostsByCategory("tutoriales").slice(0, 5),
    ...getPostsByCategory("consejos").slice(0, 5),
  ].filter(
    (post, index, self) => self.findIndex((p) => p.id === post.id) === index
  );

  const orbit: OrbitItem[] = [
    {
      k: "anti-warping",
      name: "Cama Caliente PEI y Adhesión",
      img: "/images/Como-evitar-errores-de-warping-en-impresion-3D.jpg",
      role: "El cimiento térmico contra el efecto Warping",
      d: "Mantener la cama entre 55–60 °C en PLA y 75–80 °C en PETG sobre acero flexible PEI limpio con alcohol isopropílico garantiza que las esquinas nunca se levanten.",
      href: "/tutoriales/como-evitar-errores-de-warping-en-impresion-3d/",
    },
    {
      k: "boquilla-nozzle",
      name: "Boquilla (Nozzle) Latón y Acero",
      img: "/images/Como-limpiar-correctamente-la-boquilla-de-tu-impresora-3D.jpg",
      role: "Precisión de flujo de 0.2 mm a 0.8 mm",
      d: "Las boquillas de latón ofrecen máxima conductividad térmica para PLA y PETG, mientras que las de acero endurecido son obligatorias para filamentos con fibra de carbono, madera o brillo en la oscuridad.",
      href: "/mantenimiento/como-limpiar-correctamente-la-boquilla-de-tu-impresora-3d/",
    },
    {
      k: "extrusor-dual",
      name: "Extrusor de Doble Engranaje",
      img: "/images/que-productos-usar-para-limpiar-sin-danar-la-superficie-en-extrusores-de-doble-engranaje.jpg",
      role: "Tracción constante sin patinar ni subextrusión",
      d: "Un extrusor Dual Gear empuja el filamento por ambos lados con fuerza uniforme, evitando que el motor pierda pasos en impresiones rápidas o con TPU flexible.",
      href: "/problemas-y-soluciones/problemas-con-el-extrusor-que-no-empuja-el-filamento/",
    },
    {
      k: "autonivelado",
      name: "Sensor de Autonivelado",
      img: "/images/pasos-para-instalar-un-sensor-de-autonivelado-al-imprimir-piezas-funcionales.jpg",
      role: "Malla de compensación Z-Offset automática",
      d: "Los sensores ópticos y mecánicos palpan la superficie en 25 o 49 puntos antes de imprimir para compensar cualquier microcurvatura del aluminio.",
      href: "/tutoriales-2/pasos-para-instalar-un-sensor-de-autonivelado-en-impresoras-3d-con-doble-extrusor/",
    },
    {
      k: "resina-vs-fdm",
      name: "FDM vs. Resina MSLA",
      img: "/images/Impresora-3D-de-resina-vs-filamento-cual-es-mejor-para-ti.jpg",
      role: "Resistencia estructural vs. detalle microscópico",
      d: "El filamento FDM domina en piezas mecánicas, cajas, cosplay y gran volumen; la resina UV 405 nm domina en joyería, miniaturas, figuras y odontología.",
      href: "/guias/impresora-3d-de-resina-vs-filamento-cual-es-mejor-para-ti/",
    },
    {
      k: "slicer-cura",
      name: "Laminador Slicer (Cura)",
      img: "/images/Tutorial-para-configurar-el-slicer-y-obtener-mejores-resultados.jpg",
      role: "Altura de capa, relleno Gyroid y retracción",
      d: "El software Slicer traduce tu diseño STL a código G-Code controlando aceleraciones, enfriamiento por puente, costuras ocultas y soportes árbol fáciles de retirar.",
      href: "/tutoriales-2/tutorial-para-configurar-el-slicer-y-obtener-mejores-resultados/",
    },
    {
      k: "capas-correas",
      name: "Guiado Lineal y Correas GT2",
      img: "/images/Impresion-3D-con-capas-desplazadas-como-corregir.jpg",
      role: "Cero desplazamiento de capas ni Ghosting",
      d: "Mantener las correas X/Y tensadas y los husillos lubricados con grasa PTFE evita vibraciones, resonancias en las paredes y desplazamientos a mitad de pieza.",
      href: "/problemas-y-soluciones/impresion-3d-con-capas-desplazadas-como-corregir/",
    },
    {
      k: "disenos-negocio",
      name: "Diseños, Cosplay y Negocio 3D",
      img: "/images/Modelos-para-imprimir-y-vender-en-linea-que-tienen-demanda.jpg",
      role: "42 guías de proyectos rentables y moldes",
      d: "Desde cascos de cosplay, bisutería y maquetas arquitectónicas hasta gadgets de oficina y moldes personalizados de alta rotación en tiendas online.",
      href: "/disenos/modelos-para-imprimir-y-vender-en-linea-que-tienen-demanda/",
    },
  ];

  const counters: CounterItem[] = [
    {
      v: allPosts.length,
      dec: 0,
      u: "guías",
      l: "Enciclopedia Total 3D",
      pct: 100,
      note: "Manuales técnicos, comparativas y diagnóstico",
    },
    {
      v: 167,
      dec: 0,
      u: "comparativas",
      l: "Guías de Compra 3D",
      pct: 95,
      note: "Impresoras FDM y Resina por proyecto",
    },
    {
      v: 84,
      dec: 0,
      u: "manuales",
      l: "Mantenimiento Técnico",
      pct: 88,
      note: "Limpieza de extrusor, boquillas, ejes y correas",
    },
    {
      v: 56,
      dec: 0,
      u: "soluciones",
      l: "Diagnóstico de Fallos",
      pct: 85,
      note: "Atascos, subextrusión, warping y motores",
    },
    {
      v: 70,
      dec: 0,
      u: "tutoriales",
      l: "Slicer, Cura y Trucos",
      pct: 86,
      note: "Calibración de altura de capa, flujo y sensores",
    },
    {
      v: 62,
      dec: 0,
      u: "proyectos",
      l: "Diseños y Aplicaciones",
      pct: 82,
      note: "Arquitectura, medicina, moldes y venta online",
    },
  ];

  const moments: Moment[] = [
    {
      img: "/images/Como-evitar-errores-de-warping-en-impresion-3D.jpg",
      t: "Adiós Definitivo al Warping",
      d: "Por qué se levantan las esquinas de tus piezas y cómo fijar la primera capa en PLA, PETG y ABS.",
      href: "/tutoriales/como-evitar-errores-de-warping-en-impresion-3d/",
      alt: "Cómo evitar errores de warping en impresión 3D",
      tag: "Power Page #1",
    },
    {
      img: "/images/Que-es-y-como-funciona-una-impresora-3D.jpg",
      t: "¿Cómo Funciona una Impresora 3D?",
      d: "Anatomía completa paso a paso: del motor paso a paso y el hotend al laminado por capas.",
      href: "/principios-basicos/que-es-y-como-funciona-una-impresora-3d/",
      alt: "Qué es y cómo funciona una impresora 3D",
      tag: "Fundamentos",
    },
    {
      img: "/images/El-filamento-no-se-adhiere-a-la-cama-soluciones-efectivas.jpg",
      t: "Primera Capa que No Pega",
      d: "Calibración exacta del Z-Offset, temperatura de cama, limpieza IPA y placas PEI texturizadas.",
      href: "/problemas-y-soluciones/el-filamento-no-se-adhiere-a-la-cama-soluciones-efectivas/",
      alt: "Soluciones cuando el filamento no se adhiere a la cama",
      tag: "Adherencia",
    },
    {
      img: "/images/Impresora-3D-de-resina-vs-filamento-cual-es-mejor-para-ti.jpg",
      t: "Resina MSLA vs. Filamento FDM",
      d: "Comparativa honesta de costos, resistencia, detalle, post-procesado y ventilación para elegir bien.",
      href: "/guias/impresora-3d-de-resina-vs-filamento-cual-es-mejor-para-ti/",
      alt: "Comparativa impresora 3D de resina vs filamento",
      tag: "Guía de Compra",
    },
    {
      img: "/images/Como-limpiar-correctamente-la-boquilla-de-tu-impresora-3D.jpg",
      t: "Limpieza de Boquilla y Extrusor",
      d: "Técnica Cold Pull (tirón en frío), agujas de precisión y purgado sin dañar la rosca del bloque calefactor.",
      href: "/mantenimiento/como-limpiar-correctamente-la-boquilla-de-tu-impresora-3d/",
      alt: "Cómo limpiar correctamente la boquilla de tu impresora 3D",
      tag: "Mantenimiento",
    },
    {
      img: "/images/Tutorial-para-configurar-el-slicer-y-obtener-mejores-resultados.jpg",
      t: "Dominando el Slicer (Cura)",
      d: "Altura de capa, velocidad, retracción anti-hilos y soportes árbol para acabados de fábrica.",
      href: "/tutoriales-2/tutorial-para-configurar-el-slicer-y-obtener-mejores-resultados/",
      alt: "Tutorial para configurar el slicer en impresión 3D",
      tag: "Software Slicer",
    },
    {
      img: "/images/Modelos-para-imprimir-y-vender-en-linea-que-tienen-demanda.jpg",
      t: "Diseños Rentables para Vender",
      d: "Qué productos impresos en 3D tienen mayor margen y demanda real en tiendas online y ferias.",
      href: "/disenos/modelos-para-imprimir-y-vender-en-linea-que-tienen-demanda/",
      alt: "Modelos 3D para imprimir y vender en línea",
      tag: "Emprendimiento 3D",
    },
  ];

  const filamentTechOptions: FilamentTechOption[] = [
    {
      key: "fdm-pla",
      label: "FDM Estándar (PLA+)",
      tier: "Ideal para Casa, Cosplay, Maquetas y Prototipos · Cero Olor",
      costPerKgEur: 19,
      tempSpec: "Boquilla 200–215 °C · Cama PEI 55–60 °C · Ventilador 100%",
      gramsPerHour: 28,
      img: "/images/impresoras-3D-FDM-para-realizar-cosplay-con-mejor-calidad-de-impresion.jpg",
      alt: "Impresora 3D FDM imprimiendo con filamento PLA+",
      desc: "La tecnología más versátil, limpia y económica: permite imprimir cascos de cosplay, organizadores, decoración y prototipos con mínima contracción térmica.",
      components: "Impresora FDM con Autonivelado + Placa Magnética PEI + Bobina PLA+ 1.75 mm.",
      href: "/guias/impresoras-3d-fdm-para-realizar-cosplay-con-mejor-calidad-de-impresion/",
    },
    {
      key: "fdm-tecnico",
      label: "FDM Técnico (PETG / ABS / TPU)",
      tier: "Alta Resistencia Mecánica, Exterior, Moldes y Piezas Flexibles",
      costPerKgEur: 23,
      tempSpec: "Boquilla 230–255 °C · Cama 75–100 °C · Cámara Cerrada / Direct Drive",
      gramsPerHour: 24,
      img: "/images/Impresoras-3D-ideales-para-imprimir-piezas-funcionales.jpg",
      alt: "Impresión 3D de piezas funcionales en PETG y ABS",
      desc: "Pensado para piezas sometidas a esfuerzo, calor o intemperie: soportes mecánicos, moldes industriales, juntas flexibles en TPU 95A y repuestos automotrices.",
      components: "Impresora CoreXY Cerrada + Extrusor Direct Drive Dual Gear + Secador de Filamento.",
      href: "/guias/impresoras-3d-ideales-para-imprimir-piezas-funcionales/",
    },
    {
      key: "resina-msla",
      label: "Resina UV MSLA (9K / 14K)",
      tier: "Detalle Microscópico (0.02 mm) para Joyería, Bisutería y Miniaturas",
      costPerKgEur: 27,
      tempSpec: "Luz UV 405 nm · Capas 0.02–0.05 mm · Lavado y Curado 360°",
      gramsPerHour: 32,
      img: "/images/impresoras-3D-FDM-para-crear-bisuteria-con-mayor-precision-de-detalles.jpg",
      alt: "Impresión 3D de alta precisión para joyería y figuras",
      desc: "Acabado ultra liso sin líneas de capa visibles: la tecnología preferida por joyeros, creadores de miniaturas de colección, escultores digitales y laboratorios dentales.",
      components: "Impresora MSLA Monocromática + Estación Wash & Cure 2 en 1 + Resina Lavable al Agua.",
      href: "/guias/impresora-3d-de-resina-vs-filamento-cual-es-mejor-para-ti/",
    },
  ];

  const bentoOrder = [
    "guias",
    "mantenimiento",
    "problemas-y-soluciones",
    "disenos",
    "trucos",
    "tutoriales-2",
  ];
  const bentoCats = bentoOrder
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <ReadingProgress />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* 1–2. Hero 3D con Partículas, Buscador Instantáneo y Escenario Tilt */}
        <Hero totalPosts={allPosts.length} totalCategories={categories.length} />

        {/* 3. Doble Cinta Marquee de Tecnologías 3D y Soluciones */}
        <div className="relative border-b border-[var(--line)] bg-white py-5">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track font-display text-lg font-bold text-slate-900/85"
                aria-hidden={k === 1}
              >
                {CLAIMS.map((t) => (
                  <span key={t} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-[#38bdf8] to-[#0284c7]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee reverse mt-3" aria-hidden>
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-sm font-semibold uppercase tracking-[0.14em] text-[#0369a1]/80"
              >
                {CLAIMS_2.map((t) => (
                  <span key={t} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 4. ¿Qué es Imprime en 3D? + Mosaico Spotlight */}
        <section id="que-es" className="wrap py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Ingeniería y fabricación aditiva
              </span>
              <SplitHeading
                text="La impresión 3D FDM y de resina,"
                accent={{
                  text: "explicada con parámetros reales",
                  className: "text-[#0284c7]",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                <strong className="text-slate-900">Imprime en 3D (imprime3d.org)</strong> es la
                enciclopedia técnica en español dedicada a la fabricación aditiva. Reunimos{" "}
                <strong className="text-slate-900">
                  {allPosts.length.toLocaleString("es-PE")} guías de compra, manuales de
                  calibración y diagnósticos paso a paso
                </strong>{" "}
                para que elijas la impresora 3D ideal, elimines de raíz el efecto <em>warping</em> y
                los atascos de boquilla, y fabriques piezas con acabado profesional.
              </p>
              <div
                className="mt-6 rounded-2xl border border-sky-300/70 bg-sky-50/80 p-5"
                data-reveal
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0369a1]">
                  🖨️ Lo que encontrarás en nuestra enciclopedia técnica
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.95rem] text-slate-900">
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-[#0284c7]">•</span>
                    167 comparativas de impresoras 3D FDM y Resina MSLA por tipo de proyecto
                    (cosplay, bisutería, maquetas, moldes y piezas funcionales).
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-[#0284c7]">•</span>
                    140 manuales de mantenimiento preventivo, desatasco de boquillas, lubricación de
                    ejes y solución a fallos térmicos.
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-[#0284c7]">•</span>
                    Asesor Técnico IA en tiempo real entrenado con nuestras 505 guías para
                    diagnosticar tu impresora al instante.
                  </li>
                </ul>
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link href="/guias/" className="btn btn-ghost" data-magnetic>
                  Explorar 167 Guías de Compra 3D
                </Link>
                <Link href="/problemas-y-soluciones/" className="btn btn-ghost" data-magnetic>
                  Ver 56 Soluciones a Fallos Técnicos
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-3xl shadow-[0_30px_60px_-35px_rgba(7,19,36,0.65)]"
                data-reveal
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Que-es-y-como-funciona-una-impresora-3D-1.jpg"
                  alt="Impresora 3D FDM calibrada trabajando en taller"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#0369a1]">
                  Parámetros Verificados · FDM & Resina UV 405 nm
                </span>
              </div>
              {[
                [
                  "🏆",
                  "Comparativas de Impresoras",
                  "Qué equipo elegir según volumen, velocidad CoreXY y precisión en micras.",
                ],
                [
                  "🔥",
                  "Cero Warping y Primera Capa",
                  "Temperaturas exactas de boquilla y cama PEI para PLA, PETG, ABS y TPU.",
                ],
                [
                  "⚙️",
                  "Extrusores y Boquillas",
                  "Limpieza Cold Pull, cambio entre latón y acero endurecido y lubricación PTFE.",
                ],
                [
                  "💡",
                  "Diseños y Negocios 3D",
                  "Modelos con alta demanda para imprimir desde casa y vender online.",
                ],
              ].map(([e, t, d], i) => (
                <div
                  key={t}
                  className="card spot p-5"
                  data-reveal
                  data-reveal-delay={String(i)}
                >
                  <p className="text-2xl" aria-hidden>
                    {e}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight text-slate-900">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Historia fijada GSAP: del archivo STL a la pieza terminada */}
        <ScrollStory />

        {/* 6. Termodinámica de la extrusión y adhesión (SVG animado) */}
        <section className="relative isolate overflow-hidden bg-[#071324] py-24 text-white">
          <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[#0284c7]/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#f97316]/25 blur-3xl" />
          <div className="hero-grid opacity-50" />
          <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow !text-[#67e8f9]" data-reveal>
                Termodinámica de polímeros, sin humo
              </span>
              <SplitHeading
                text="Cómo se logra una adhesión"
                accent={{ text: "sin warping ni deslaminación", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-white/80" data-reveal>
                En la impresión 3D por deposición fundida (FDM), el polímero sale por la{" "}
                <strong className="text-white">boquilla de 0.4 mm entre 200 °C y 255 °C</strong>. Si
                la capa inferior se enfría bruscamente por debajo de su{" "}
                <strong className="text-white">temperatura de transición vítrea ($T_g$)</strong>, el
                plástico se contrae hacia el centro y despega las esquinas (efecto{" "}
                <em>warping</em>).
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3" data-reveal>
                {[
                  ["🌡️", "Transición Vítrea Tg"],
                  ["🧲", "Placa PEI 60°–100°C"],
                  ["💨", "Flujo Laminar Slicer"],
                ].map(([e, t]) => (
                  <div key={t} className="glass p-4 text-center">
                    <p className="text-2xl" aria-hidden>
                      {e}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{t}</p>
                  </div>
                ))}
              </div>
              <div className="glass mt-6 p-5 text-sm text-white/80" data-reveal>
                <strong className="text-[#67e8f9]">Regla térmica de taller:</strong> en la primera
                capa mantén siempre el ventilador de capa al <strong>0%</strong> y la velocidad a{" "}
                <strong>20–25 mm/s</strong> para que el polímero fundido penetre la microtextura del
                PEI antes de solidificar.
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/tutoriales/como-evitar-errores-de-warping-en-impresion-3d/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Guía maestra contra el Warping
                </Link>
                <Link
                  href="/consejos/consejos-para-mejorar-la-adherencia-en-la-cama-de-impresion/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Cómo fijar la primera capa
                </Link>
              </div>
            </div>
            <div data-reveal>
              <ThermalExtrusionSvg />
            </div>
          </div>
        </section>

        {/* 7. Órbita interactiva de componentes de la impresora 3D y materiales */}
        <section className="wrap py-24">
          <PrinterOrbit
            items={orbit}
            center="/images/Que-es-y-como-funciona-una-impresora-3D.jpg"
          />
          <p className="mt-10 text-center text-sm text-[var(--muted)]">
            ¿Buscas una guía para un fallo, filamento o impresora específica?{" "}
            <Link href="#explorador" className="font-bold text-[#0284c7] underline">
              Explorar el buscador interactivo de las {allPosts.length.toLocaleString("es-PE")}{" "}
              guías →
            </Link>
          </p>
        </section>

        {/* 8. Contadores animados y Tabla Oficial de Temperaturas de Impresión 3D */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#071324] via-[#0b1d36] to-[#042f4b] py-24 text-white">
          <div className="hero-aurora opacity-40" />
          <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="eyebrow !text-[#67e8f9]" data-reveal>
                La enciclopedia 3D en números reales
              </span>
              <SplitHeading
                text="Nuestro archivo técnico y de diseño,"
                accent={{ text: "cifra por cifra", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-4 max-w-xl text-white/75" data-reveal>
                Desde la elección de tu primera impresora FDM o de resina hasta el mantenimiento de
                extrusores de doble engranaje, guías lineales y proyectos para emprender desde casa.
              </p>
              <div className="mt-8">
                <PrinterCounters data={counters} />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/principios-basicos/que-es-y-como-funciona-una-impresora-3d/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Fundamentos de la Impresión 3D
                </Link>
                <Link
                  href="/mantenimiento/cada-cuanto-debes-hacer-mantenimiento-preventivo-a-tu-impresora-3d/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Calendario de Mantenimiento 3D
                </Link>
              </div>
            </div>

            <div
              className="mx-auto w-full max-w-[440px] rounded-3xl bg-white p-6 text-slate-900 shadow-2xl"
              data-reveal
            >
              <div className="border-b-4 border-slate-900 pb-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#0284c7]">
                  Referencia Rápida de Taller
                </p>
                <h3 className="font-display text-3xl font-extrabold leading-tight">
                  Tabla Térmica Oficial 3D
                </h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Parámetros verificados de boquilla, cama caliente y ventilación por material
                </p>
              </div>
              <dl className="mt-4 divide-y divide-slate-200 text-sm">
                {[
                  [
                    "🟢 PLA / PLA+ / Hyper PLA",
                    "200–215 °C",
                    "Cama 55–60 °C · Ventilador 100% · Muy fácil",
                  ],
                  [
                    "🔵 PETG Funcional",
                    "230–245 °C",
                    "Cama 70–80 °C · Ventilador 30–50% · Sin olor",
                  ],
                  [
                    "🟠 ABS / ASA Técnico",
                    "240–260 °C",
                    "Cama 95–110 °C · Ventilador 0% · Cerramiento",
                  ],
                  [
                    "🟣 TPU Flexible (95A)",
                    "215–230 °C",
                    "Cama 45–60 °C · Vel. 25 mm/s · Direct Drive",
                  ],
                  [
                    "💎 Resina UV MSLA 405nm",
                    "25–30 °C amb.",
                    "Exp. normal 1.8–2.5 s · Base 25–30 s · Lavado",
                  ],
                ].map(([k, v, sub]) => (
                  <div key={k} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <dt className="font-bold text-slate-900">{k}</dt>
                      <dd className="text-xs text-[var(--muted)]">{sub}</dd>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#f0f9ff] border border-sky-300/80 px-3 py-1 font-extrabold text-xs text-[#0369a1]">
                      {v}
                    </span>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-2xl bg-sky-50 p-3.5 text-xs text-[#0369a1]">
                <strong>Consejo anti-atascos:</strong> nunca dejes el hotend precalentado a +200 °C
                sin extruir durante más de 10 minutos; el plástico estancado se carboniza y obstruye
                la boquilla.
              </div>
            </div>
          </div>
        </section>

        {/* 9. Escena Día ↔ Noche: del prototipado diurno a la impresión nocturna */}
        <section className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Fabricación 24/7 sin interrupciones
              </span>
              <SplitHeading
                text="Del calibrado diurno a la impresión nocturna,"
                accent={{
                  text: "tu taller nunca se detiene",
                  className: "text-[#0284c7]",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-lg text-[var(--muted)]" data-reveal>
              Arrastra la escena para cambiar la hora en el taller 3D. De día diseñas en CAD y
              ajustas el Slicer; de noche dejas corriendo impresiones de +18 horas con{" "}
              <strong className="text-slate-900">
                cama PEI limpia, secador de filamento activo y mantenimiento al día
              </strong>
              .
            </p>
          </div>

          <div data-reveal>
            <DayNightSlider />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [
                "1. Preparación y Nivelación",
                "Limpieza IPA 99%, Z-Offset y verificación de primera capa",
                "/images/El-filamento-no-se-adhiere-a-la-cama-soluciones-efectivas.jpg",
                "/problemas-y-soluciones/el-filamento-no-se-adhiere-a-la-cama-soluciones-efectivas/",
              ],
              [
                "2. Ajustes Óptimos en Cura",
                "Altura de capa, relleno Gyroid, retracción y soportes árbol",
                "/images/Tutorial-para-configurar-el-slicer-y-obtener-mejores-resultados.jpg",
                "/tutoriales-2/tutorial-para-configurar-el-slicer-y-obtener-mejores-resultados/",
              ],
              [
                "3. Mantenimiento Post-Impresión",
                "Protocolo tras impresiones largas para conservar ejes y extrusor",
                "/images/Cada-cuanto-debes-hacer-mantenimiento-preventivo-a-tu-impresora-3D.jpg",
                "/mantenimiento/cada-cuanto-debes-hacer-mantenimiento-preventivo-a-tu-impresora-3d/",
              ],
            ].map(([t, d, src, href], i) => (
              <Link
                key={t}
                href={href}
                className="card spot overflow-hidden group"
                data-reveal
                data-reveal-delay={String(i)}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={t}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#071324] font-display font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-tight group-hover:text-[#0284c7] transition-colors">
                      {t}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{d}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 10. Carrusel Horizontal 4:5 de Soluciones y Proyectos Reales */}
        <section className="overflow-hidden bg-[#f0f9ff] py-24 border-y border-[var(--line)]">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Las guías más consultadas en español
              </span>
              <SplitHeading
                text="Soluciones técnicas y"
                accent={{ text: "dudas reales de taller", className: "text-[#0369a1]" }}
                className="section-title mt-3"
              />
            </div>
            <MomentsCarousel items={moments} />
          </div>
        </section>

        {/* 11. Calculadora de Costo por Pieza y Filamento + Asesor Diagnóstico Interactivo */}
        <section id="planificador" className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Calculadora Maker de Materiales y Costos
              </span>
              <SplitHeading
                text="Elige tu tecnología 3D."
                accent={{
                  text: "Calcula el costo real de cada pieza.",
                  className: "text-[#0284c7]",
                }}
                className="section-title mt-3"
              />
            </div>
            <ul className="grid gap-2 text-[var(--muted)] text-sm" data-reveal>
              {[
                "Cálculo directo según gramos en UltiMaker Cura / PrusaSlicer",
                "Rendimiento real de piezas por cada bobina o botella de 1 kg",
                "Parámetros térmicos recomendados por tipo de polímero",
                "Diagnóstico interactivo en 2 clics para encontrar tu guía exacta",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-bold text-[#0369a1]">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <FilamentCostBlock options={filamentTechOptions} />
          </div>

          <div className="mt-14" data-reveal>
            <PrinterAdvisor />
          </div>
        </section>

        {/* Top Leaderboard AdSense Unit */}
        <div className="wrap">
          <AdBanner className="my-4" />
        </div>

        {/* 12. Bento Grid de las 11 Categorías + Vitrina Amazon + Power Pages + Explorador */}
        <section className="bg-gradient-to-b from-white via-[#f0f9ff]/60 to-white py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Biblioteca técnica organizada por pilares
              </span>
              <SplitHeading
                text="Todo sobre impresión 3D,"
                accent={{
                  text: "ordenado por especialidad",
                  className: "text-[#0369a1]",
                }}
                className="section-title mt-3"
              />
            </div>

            <div className="grid auto-rows-[minmax(195px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4">
              {bentoCats.map((c, i) => {
                const catPosts = getPostsByCategory(c.slug);
                const big = i === 0;
                const wide = i === 1 || i === 4 || i === 5;
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    className={`card spot group flex flex-col p-7 ${
                      big
                        ? "spot-dark border-transparent bg-gradient-to-br from-[#071324] via-[#0369a1] to-[#0284c7] text-white md:col-span-2 lg:row-span-2"
                        : ""
                    } ${wide ? "lg:col-span-2" : ""}`}
                    data-reveal
                    data-reveal-delay={String(i % 4)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                          big ? "bg-white/15" : "bg-sky-50 border border-sky-200/60"
                        }`}
                        aria-hidden
                      >
                        {CATEGORY_ICONS[c.slug] || "🖨️"}
                      </span>
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          big ? "text-[#67e8f9]" : "text-[#0284c7]"
                        }`}
                      >
                        {c.count} guías
                      </span>
                    </div>
                    <h3
                      className={`mt-5 font-display font-extrabold ${
                        big ? "text-3xl sm:text-4xl" : "text-2xl text-slate-900"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <p className={`mt-2 text-sm ${big ? "text-white/80" : "text-[var(--muted)]"}`}>
                      {c.description}
                    </p>
                    {big && (
                      <ul className="mt-6 space-y-2 text-sm text-white/90">
                        {catPosts.slice(0, 5).map((a) => (
                          <li key={a.id} className="truncate">
                            → {a.title}
                          </li>
                        ))}
                      </ul>
                    )}
                    {i === 1 && (
                      <p className="mt-4 font-display text-3xl font-extrabold text-[#0284c7]">
                        Extrusores & Boquillas{" "}
                        <span className="text-sm font-bold text-[var(--muted)]">
                          · Guías Lineales · Ejes · Correas
                        </span>
                      </p>
                    )}
                    <span
                      className={`mt-auto pt-5 font-bold text-sm ${
                        big ? "text-[#67e8f9]" : "text-[#0284c7]"
                      }`}
                    >
                      Explorar categoría →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Resto de categorías (11 en total) en chips rápidos */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5" data-reveal>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}/`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-2xs transition hover:border-[#0284c7] hover:text-[#0284c7]"
                >
                  <span>{CATEGORY_ICONS[cat.slug] || "🖨️"}</span>
                  <span>{cat.name}</span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-extrabold text-[#0369a1]">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>

            {/* Vitrina Amazon Affiliate Box en la Home */}
            <div className="mt-14" data-reveal>
              <AmazonAffiliateBox
                variant="showcase"
                sectionTitle={homeAmazon.sectionTitle}
                sectionSubtitle={homeAmazon.sectionSubtitle}
                products={homeAmazon.products}
              />
            </div>

            {/* Power Pages: Lo Más Consultado en Google */}
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <span className="eyebrow" data-reveal>
                    Power Pages · Top Rankings
                  </span>
                  <h3
                    className="font-display text-2xl font-extrabold sm:text-3xl mt-1 text-slate-900"
                    data-reveal
                  >
                    Las Guías Técnicas Más Consultadas en Hispanoamérica
                  </h3>
                </div>
                <Link
                  href="/tutoriales/"
                  className="text-sm font-bold text-[#0284c7] hover:underline"
                >
                  Ver todos los tutoriales →
                </Link>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {topSeoPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={getPostUrl(post)}
                    className="card spot group flex items-start gap-4 p-5"
                    data-reveal
                    data-reveal-delay={String(idx % 3)}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#071324] font-display text-sm font-black text-white shadow-sm">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284c7]">
                        {post.categoryName} · ⏱️ {post.readTime}
                      </span>
                      <h4 className="mt-1 font-display text-base font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Explorador Interactivo con Pestañas y Buscador */}
            <div id="explorador" className="mt-20">
              <BlogExplorerClient initialPosts={explorerPosts} categories={categories} />
            </div>
          </div>
        </section>

        {/* 13. Criterio Técnico y Dirección Editorial (E-E-A-T Charlie Lingán) */}
        <section className="wrap py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Rigor técnico y pruebas de taller
              </span>
              <SplitHeading
                text="Parámetros verificados,"
                accent={{
                  text: "no teoría genérica",
                  className: "text-[#0284c7]",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                Un mal consejo de temperatura o de limpieza puede atascar tu hotend, rayar tu placa
                PEI o arruinar una impresión de 20 horas. En{" "}
                <strong className="text-slate-900">Imprime3D.org</strong> documentamos rangos
                térmicos reales, tolerancias en milímetros y pasos de diagnóstico seguros.
              </p>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link href="/hola-hablamos/" className="btn btn-ghost" data-magnetic>
                  Conocer a Charlie Lingán →
                </Link>
                <OpenChatButton
                  label="Consultar al Asesor Técnico IA"
                  className="btn btn-buy"
                  magnetic
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card spot p-6" data-reveal>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                  ✓ Estándar Técnico Imprime3D.org
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Temperaturas exactas de boquilla y cama por material</li>
                  <li>• Diagnóstico de extrusores Direct Drive y Bowden</li>
                  <li>• Ajustes reales para UltiMaker Cura y PrusaSlicer</li>
                  <li>• Contenido 100% Evergreen actualizado y verificado</li>
                </ul>
              </div>
              <div className="card spot p-6" data-reveal data-reveal-delay="1">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  ⚠️ Errores frecuentes en foros
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Subir la temperatura sin secar antes el filamento húmedo</li>
                  <li>• Usar espátulas metálicas afiladas que dañan el recubrimiento PEI</li>
                  <li>• Cambiar boquillas en frío provocando fugas en el bloque calefactor</li>
                  <li>• Ignorar la tensión de las correas GT2 y la lubricación del eje Z</li>
                </ul>
              </div>
              <div className="card spot sm:col-span-2 p-6 flex flex-col sm:flex-row items-center gap-5" data-reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/charlie-lingan.jpg"
                  alt="Charlie Lingán — Fundador y Editor de Imprime en 3D"
                  className="h-20 w-20 rounded-2xl object-cover shrink-0 border-2 border-[#0284c7] shadow-md"
                  loading="lazy"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href="/hola-hablamos/"
                      className="font-display text-lg font-extrabold text-slate-900 hover:text-[#0284c7]"
                    >
                      Charlie Lingán
                    </Link>
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-[#0369a1]">
                      Fundador & Director Editorial
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    Experto en ecommerce, innovación tecnológica y emprendimiento. Creador de{" "}
                    <strong>imprime3d.org</strong> con la misión de democratizar la fabricación
                    aditiva y ayudar a makers, estudiantes y emprendedores en toda Hispanoamérica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14. Preguntas Frecuentes (FAQ) con Schema FAQPage */}
        <section className="wrap pb-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Preguntas frecuentes sobre impresión 3D
              </span>
              <SplitHeading
                text="Respuestas rápidas de taller"
                className="section-title mt-3"
              />
              <p className="mt-4 text-[var(--muted)]" data-reveal>
                ¿Tienes un fallo específico en tu impresora 3D o dudas entre dos modelos? Nuestro
                Asesor Técnico IA te responde al instante con parámetros exactos.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton
                  label="Preguntar al Asesor IA 3D"
                  className="btn btn-buy"
                  magnetic
                />
                <Link
                  href="/principios-basicos/que-es-y-como-funciona-una-impresora-3d/"
                  className="btn btn-ghost"
                >
                  Guía para principiantes
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {HOME_FAQS.map((f, idx) => (
                <details
                  key={f.q}
                  open={idx === 0}
                  className="card card-static group p-5 open:shadow-lg"
                  data-reveal
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-slate-900">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-50 text-[#0284c7] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 15. CTA Final con Aurora, Rejilla e Imagen Flotante */}
        <section className="wrap pb-14">
          <div className="relative isolate overflow-hidden rounded-[36px] bg-gradient-to-br from-[#071324] via-[#0b2545] to-[#0284c7] px-6 py-14 text-white sm:px-14 sm:py-20 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Como-evitar-errores-de-warping-en-impresion-3D.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-[2] h-full w-full object-cover opacity-15 mix-blend-luminosity"
            />
            <div className="hero-grid opacity-60" />
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#38bdf8]/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-[#f97316]/25 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div className="text-center lg:text-left">
                <SplitHeading
                  text="Tu próxima impresión 3D,"
                  accent={{
                    text: "calibrada a la primera y sin warping",
                    className: "text-[#67e8f9]",
                  }}
                  className="text-3xl font-extrabold sm:text-5xl"
                />
                <p className="mt-4 text-base sm:text-lg text-white/85">
                  Explora nuestras{" "}
                  <strong>{allPosts.length.toLocaleString("es-PE")} guías verificadas</strong> o
                  consúltale en vivo a nuestro <strong>Asesor Técnico IA</strong> cualquier duda
                  sobre impresoras FDM, resina MSLA, filamentos y configuración de Slicer.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <OpenChatButton
                    label="Abrir Asesor Técnico IA 3D Ahora"
                    className="btn btn-lime shine text-base"
                    magnetic
                  />
                  <Link href="/guias/" className="btn btn-glass" data-magnetic>
                    Explorar Guías de Compra
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[340px]">
                <div className="absolute inset-[10%] rounded-full bg-[#38bdf8]/25 blur-3xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Que-es-y-como-funciona-una-impresora-3D.jpg"
                  alt="Impresora 3D calibrada en Imprime3D.org"
                  width={400}
                  height={320}
                  loading="lazy"
                  className="float-y relative h-auto w-full rounded-3xl border-2 border-cyan-300/35 object-cover shadow-[0_30px_50px_rgba(0,0,0,0.65)]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ClientEffects />
    </>
  );
}
