# Imprime3D.org — Portal de Impresión 3D y Fabricación Aditiva

Sitio web oficial de **Imprime en 3D (`https://imprime3d.org`)**, migrado de WordPress a **Next.js 16 (App Router + SSG)** y desplegado en **Vercel**.

## Características Principales
- **505 Artículos Técnicos Evergreen**: Sin años caducos ni artefactos de prompts en títulos o contenido, con imágenes optimizadas servidas localmente desde `public/images/`.
- **Diseño Editorial Estilo `Dinamica.pe`**: Páginas de artículos con layout de 2 columnas, Tabla de Contenidos (TOC) automática, cajas de enlaces internos contextuales, autoría E-E-A-T (Charlie Lingán) y barra lateral sticky.
- **Home de Alta Retención**:
  - Buscador instantáneo en tiempo real (`HeroSearch.tsx`) sobre los 505 artículos.
  - Herramienta interactiva de **Diagnóstico de Fallos de Impresión 3D y Selector de Impresora Ideal** (`PrinterAdvisor.tsx`).
  - Hubs temáticos que conectan las 11 categorías del sitio.
- **SEO & Google AdSense (`ca-pub-1070738569472471`)**:
  - Preservación 100% de la estructura de URLs `/{category}/{slug}/` con `trailingSlash: true`.
  - Redirecciones 301 permanentes para los 4 artículos duplicados `-2` y rutas heredadas de WordPress.
  - Sitemap XML dinámico (`/sitemap.xml`), `robots.txt`, `ads.txt` y datos estructurados JSON-LD (`BlogPosting`, `FAQPage`, `BreadcrumbList`, `CollectionPage`, `WebSite`).
