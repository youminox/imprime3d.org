import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import PrinterAdvisor from "@/components/PrinterAdvisor";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import {
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
  title: `${SITE_NAME} — Mejores Impresoras 3D, Guías de Compra, Calibración y Solución de Fallos`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const PILLAR_HUBS = [
  {
    slug: "guias",
    tag: "Comparativas & Compra",
    title: "Guías de Compra de Impresoras 3D",
    desc: "Comparativas de impresoras FDM y de resina según tu presupuesto, nivel de experiencia, precisión y volumen de construcción.",
    badge: "167 guías",
    accent: "from-slate-900 to-sky-950",
  },
  {
    slug: "mantenimiento",
    tag: "Cuidado & Durabilidad",
    title: "Mantenimiento y Limpieza Técnica",
    desc: "Cómo limpiar boquillas (nozzles), extrusores de doble engranaje, camas PEI, ventiladores y tanques de resina sin dañar componentes.",
    badge: "84 guías",
    accent: "from-sky-950 to-slate-900",
  },
  {
    slug: "problemas-y-soluciones",
    tag: "Diagnóstico de Errores",
    title: "Problemas y Soluciones en Impresión 3D",
    desc: "Soluciones paso a paso cuando la primera capa no pega, el extrusor no empuja filamento, hay capas desplazadas o fallos térmicos.",
    badge: "56 guías",
    accent: "from-slate-950 to-slate-900",
  },
  {
    slug: "disenos",
    tag: "Proyectos & Negocio",
    title: "Diseños Útiles y Modelos para Vender",
    desc: "Ideas rentables para imprimir en casa: organizadores de escritorio, accesorios de cocina, macetas minimalistas, moldes y regalos.",
    badge: "42 guías",
    accent: "from-slate-900 to-indigo-950",
  },
  {
    slug: "trucos",
    tag: "Calidad & Acabados",
    title: "Trucos y Ajustes Avanzados",
    desc: "Optimiza la retracción para evitar hilos (stringing), mejora la precisión dimensional y logra piezas sólidas en cualquier clima.",
    badge: "35 guías",
    accent: "from-sky-950 to-slate-950",
  },
  {
    slug: "tutoriales-2",
    tag: "Calibración & Software",
    title: "Tutoriales de Calibración y Slicer",
    desc: "Aprende a nivelar la cama paso a paso, instalar sensores de autonivelado, ajustar el Z-Offset y dominar tu laminador 3D.",
    badge: "35 guías",
    accent: "from-slate-900 to-slate-800",
  },
];

const HOME_FAQS = [
  {
    q: "¿Qué es mejor para empezar a imprimir en 3D: una impresora de filamento (FDM) o de resina (MSLA)?",
    a: "Para la mayoría de principiantes y uso en el hogar, una impresora de filamento (FDM) utilizando PLA es la opción más recomendable: es limpia, económica, no emite olores fuertes y permite fabricar piezas funcionales, soportes y objetos medianos o grandes. Las impresoras de resina UV (MSLA) son ideales si tu prioridad principal es crear miniaturas, figuras de colección o joyería con detalles microscópicos.",
  },
  {
    q: "¿Qué es el efecto Warping en impresión 3D y cómo se evita?",
    a: "El efecto Warping ocurre cuando las esquinas inferiores de una pieza impresa en 3D se contraen al enfriarse y se despegan de la cama caliente, deformando la base. Para evitarlo, nivela con precisión la primera capa, limpia la placa PEI con alcohol isopropílico, activa una balsa o borde ('Brim') en el Slicer, mantén la temperatura adecuada en la cama y evita corrientes de aire frío.",
  },
  {
    q: "¿Qué filamento es más fácil de imprimir y cuál es más resistente?",
    a: "El PLA (Ácido Poliláctico) es el material más fácil de imprimir porque funde a baja temperatura (195 °C–215 °C) y apenas sufre deformación térmica. Si necesitas mayor resistencia mecánica, térmica y química sin la dificultad del ABS, el PETG es la alternativa más equilibrada para piezas de uso rudo y exteriores.",
  },
  {
    q: "¿Cada cuánto tiempo se debe limpiar la boquilla (nozzle) y hacer mantenimiento a una impresora 3D?",
    a: "Se recomienda limpiar la superficie de la cama antes de cada impresión, revisar residuos externos en la boquilla cada 20 a 30 horas de trabajo, y realizar un mantenimiento preventivo mensual que incluya limpieza de ventiladores, revisión de tensión de correas de los ejes X/Y y lubricación del husillo del eje Z.",
  },
];

export default function HomePage() {
  const buyingGuides = getFeaturedBuyingGuides(6);
  const troubleshootingGuides = getTroubleshootingGuides(6);
  const topSeoPosts = getTopSeoPosts(9);
  const categories = getAllCategories();

  // Balanced set of 60 posts across all 11 categories for the interactive explorer
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
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* Hero Section with Instant Search */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0b192c] to-slate-900 py-20 sm:py-24 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/15 border border-sky-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300">
              🧊 Enciclopedia Técnica de Impresión 3D y Fabricación Aditiva
            </span>
            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Domina las{" "}
              <span className="text-sky-400">Impresoras en 3D</span>: Guías de
              Compra, Calibración y Solución de Fallos
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
              Explora más de <strong className="text-white">505 manuales</strong>{" "}
              verificados sobre impresoras de filamento (FDM) y resina (MSLA),
              configuración de Slicer, mantenimiento de boquillas y proyectos
              rentables para fabricar en casa.
            </p>

            <div className="mt-9">
              <HeroSearch />
            </div>

            {/* Quick Category Pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <Link
                href="/guias/"
                className="rounded-full bg-sky-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-sky-300 transition shadow-md"
              >
                🏆 Guías de Compra (167)
              </Link>
              <Link
                href="/problemas-y-soluciones/"
                className="rounded-full bg-orange-500 px-4 py-2 text-xs font-extrabold text-white hover:bg-orange-400 transition shadow-md"
              >
                🛠️ Problemas y Soluciones (56)
              </Link>
              <Link
                href="/mantenimiento/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🔧 Mantenimiento (84)
              </Link>
              <Link
                href="/disenos/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                💡 Diseños y Proyectos (42)
              </Link>
              <Link
                href="/tutoriales-2/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                📐 Calibración y Slicer (35)
              </Link>
              <Link
                href="/trucos/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                ⚡ Trucos de Impresión (35)
              </Link>
              <Link
                href="/resenas/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🔬 Reseñas de Modelos
              </Link>
              <Link
                href="/principios-basicos/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                📘 Principios Básicos
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive 3D Printer Advisor & Diagnostic Section */}
        <section className="py-14 bg-light-bg border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PrinterAdvisor />
          </div>
        </section>

        {/* AdSense Banner #1 */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          <AdBanner />
        </div>

        {/* Section 1: Featured Buying Guides & Printer Reviews */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Comparativas de Equipos FDM y Resina UV
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Guías Esenciales para Elegir y Comparar tu Impresora 3D
                </h2>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/guias/"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver 167 Guías de Compra →
                </Link>
                <span className="text-slate-300">|</span>
                <Link
                  href="/resenas/"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver Reseñas a Fondo →
                </Link>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {buyingGuides.map((post) => (
                <Link
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                    <img
                      src={getImageUrl(post.featuredImageUrl)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-bold text-sky-300">
                      {post.categoryName}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                      <span>⏱️ {post.readTime} de lectura</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">
                        ✓ Análisis Verificado
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      Leer análisis completo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Major Pillar Hubs (Unlocking the 419 formerly orphaned articles!) */}
        <section className="py-16 bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">
                Arquitectura Técnica Completa
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">
                Explora Nuestros Manuales por Especialidad
              </h2>
              <p className="mt-3 text-slate-400 text-sm sm:text-base">
                Accede directamente a nuestras bibliotecas especializadas en
                comparativas de compra, mantenimiento preventivo, solución de
                errores de extrusión, calibración y modelos rentables.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PILLAR_HUBS.map((card) => {
                const samplePosts = getPostsByCategory(card.slug).slice(0, 3);
                return (
                  <div
                    key={card.slug}
                    className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${card.accent} p-6 flex flex-col justify-between transition hover:border-sky-500/60`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-extrabold text-sky-300">
                          {card.tag}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {card.badge}
                        </span>
                      </div>
                      <Link href={`/${card.slug}/`}>
                        <h3 className="mt-4 text-xl font-extrabold text-white hover:text-sky-300 transition-colors">
                          {card.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {card.desc}
                      </p>

                      <ul className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
                        {samplePosts.map((sp) => (
                          <li key={sp.id}>
                            <Link
                              href={getPostUrl(sp)}
                              className="hover:text-sky-300 transition-colors line-clamp-1 flex items-center gap-1.5"
                            >
                              <span className="text-sky-400 font-bold">›</span>
                              <span>{sp.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/${card.slug}/`}
                      className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-sky-400 hover:text-slate-950 px-4 py-2.5 text-xs font-extrabold text-white transition"
                    >
                      Explorar {card.badge} →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Troubleshooting & SEO Power Guides (Boosting #1 Warping Cluster) */}
        <section className="py-16 bg-light-bg border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                🔥 Soluciones Técnicas Más Consultadas en Habla Hispana
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Soluciona el Efecto Warping, Atascos de Boquilla y Fallos de
                Adherencia
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Nuestros manuales de diagnóstico más leídos para conseguir
                primeras capas perfectas y acabados profesionales sin errores.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topSeoPosts.map((post) => (
                <Link
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-primary hover:shadow-md"
                >
                  <img
                    src={getImageUrl(post.featuredImageUrl)}
                    alt={post.title}
                    className="h-22 w-24 shrink-0 rounded-xl object-cover bg-slate-100"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-primary">
                        {post.categoryName}
                      </span>
                      <h3 className="mt-0.5 text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      ⏱️ {post.readTime} · Leer solución →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* AdSense Banner #2 */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          <AdBanner />
        </div>

        {/* Section 4: Interactive Article Explorer */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Biblioteca Interactiva (505 Artículos)
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Filtra Nuestras Guías por Categoría
              </h2>
            </div>

            <BlogExplorerClient
              initialPosts={explorerPosts}
              categories={categories}
            />
          </div>
        </section>

        {/* Section 5: Charlie Lingán Author & E-E-A-T Section */}
        <section className="py-16 bg-light-bg border-t border-slate-200">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <img
                src="/images/charlie-lingan.jpg"
                alt="Charlie Lingán — Fundador de Imprime en 3D"
                className="h-32 w-32 sm:h-36 sm:w-36 rounded-2xl object-cover shadow-md shrink-0 border-2 border-primary"
                loading="lazy"
              />
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-primary-dark">
                  Dirección Editorial y Experiencia Empresarial
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  ¡Hola! Soy Charlie Lingán, apasionado por la innovación y el
                  ecommerce
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  En <strong>Imprime en 3D (imprime3d.org)</strong> reunimos
                  guías técnicas verificadas, comparativas honestas de equipos
                  de fabricación aditiva y manuales de mantenimiento para ayudar
                  a makers, profesionales y emprendedores a transformar sus
                  ideas en productos reales de alta calidad.
                </p>
                <div className="pt-2">
                  <Link
                    href="/hola-hablamos/"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-sky-300 hover:bg-primary hover:text-white transition"
                  >
                    Conoce mi trayectoria y contáctame →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Home FAQ Section */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Preguntas Frecuentes
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dudas Comunes sobre Impresoras 3D, Filamentos y Resinas
              </h2>
            </div>

            <div className="space-y-4">
              {HOME_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-light-bg/60 p-6"
                >
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
