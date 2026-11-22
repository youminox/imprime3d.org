import Link from "next/link";
import { getAllCategories, SITE_NAME } from "@/lib/data";

export default function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-slate-950 font-black">
                3D
              </div>
              <span className="text-xl font-extrabold text-white">
                Imprime<span className="text-sky-400">3D</span>.org
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Enciclopedia técnica en español sobre impresión 3D: guías de
              compra de impresoras FDM y de resina, mantenimiento preventivo,
              configuración de laminadores (slicer), solución de errores como el
              efecto warping y proyectos rentables.
            </p>
            <div className="pt-1">
              <Link
                href="/hola-hablamos/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300"
              >
                Dirección editorial: Charlie Lingán →
              </Link>
            </div>
          </div>

          {/* Column 2: All Categories Part 1 */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Categorías Principales
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}/`}
                    className="text-slate-400 hover:text-sky-400 transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: All Categories Part 2 */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Aprendizaje y Soluciones
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {categories.slice(6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}/`}
                    className="text-slate-400 hover:text-sky-400 transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Essential Pillar Guides & Legal */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Guías Esenciales & Legal
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link
                  href="/tutoriales/como-evitar-errores-de-warping-en-impresion-3d/"
                  className="hover:text-sky-400 transition-colors font-semibold text-sky-300"
                >
                  ★ Cómo Evitar el Efecto Warping en 3D
                </Link>
              </li>
              <li>
                <Link
                  href="/principios-basicos/que-es-y-como-funciona-una-impresora-3d/"
                  className="hover:text-sky-400 transition-colors"
                >
                  ¿Qué es y cómo funciona una impresora 3D?
                </Link>
              </li>
              <li>
                <Link
                  href="/guias/impresora-3d-de-resina-vs-filamento-cual-es-mejor-para-ti/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Impresora 3D de Resina vs Filamento
                </Link>
              </li>
              <li>
                <Link
                  href="/problemas-y-soluciones/que-hacer-si-la-boquilla-de-la-impresora-3d-se-obstruye/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Solución a Boquilla (Nozzle) Obstruida
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <Link
                  href="/hola-hablamos/"
                  className="hover:text-white transition-colors"
                >
                  Sobre Nosotros / Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-privacidad/"
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/aviso-legal/"
                  className="hover:text-white transition-colors"
                >
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-cookies/"
                  className="hover:text-white transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p>
              © {SITE_NAME} (imprime3d.org). Todos los derechos reservados. Guías
              técnicas y comparativas verificadas.
            </p>
            <p className="text-[11px] text-slate-500">
              En calidad de Afiliado de Amazon (imprime3d0c-21 / imprime3d-20),
              obtenemos ingresos por las compras adscritas que cumplen los
              requisitos aplicables.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-slate-300">
              Mapa del Sitio (XML)
            </Link>
            <span>·</span>
            <Link href="/hola-hablamos/" className="hover:text-slate-300">
              Charlie Lingán
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
