import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imprime3d.org",
        pathname: "/wp-content/uploads/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      // 4 Duplicate '-2' Articles -> 301 Consolidated Canonical URLs
      {
        source: "/principios-basicos/que-es-y-como-funciona-una-impresora-3d-2/",
        destination: "/principios-basicos/que-es-y-como-funciona-una-impresora-3d/",
        permanent: true,
      },
      {
        source: "/principios-basicos/que-es-y-como-funciona-una-impresora-3d-2",
        destination: "/principios-basicos/que-es-y-como-funciona-una-impresora-3d/",
        permanent: true,
      },
      {
        source: "/aplicacion/como-usar-impresoras-3d-en-la-arquitectura-2/",
        destination: "/aplicacion/como-usar-impresoras-3d-en-la-arquitectura/",
        permanent: true,
      },
      {
        source: "/aplicacion/como-usar-impresoras-3d-en-la-arquitectura-2",
        destination: "/aplicacion/como-usar-impresoras-3d-en-la-arquitectura/",
        permanent: true,
      },
      {
        source: "/tutoriales/como-solucionar-problemas-comunes-en-impresoras-3d-2/",
        destination: "/tutoriales/como-solucionar-problemas-comunes-en-impresoras-3d/",
        permanent: true,
      },
      {
        source: "/tutoriales/como-solucionar-problemas-comunes-en-impresoras-3d-2",
        destination: "/tutoriales/como-solucionar-problemas-comunes-en-impresoras-3d/",
        permanent: true,
      },
      {
        source: "/consejos/consejos-para-mejorar-la-adherencia-en-la-cama-de-impresion-2/",
        destination: "/consejos/consejos-para-mejorar-la-adherencia-en-la-cama-de-impresion/",
        permanent: true,
      },
      {
        source: "/consejos/consejos-para-mejorar-la-adherencia-en-la-cama-de-impresion-2",
        destination: "/consejos/consejos-para-mejorar-la-adherencia-en-la-cama-de-impresion/",
        permanent: true,
      },
      // Legacy WordPress Sitemaps -> Next.js Sitemap
      {
        source: "/wp-sitemap/:path*",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      // WordPress category pagination & category URL compatibility
      {
        source: "/category/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      // Legacy WordPress author, tag, feed & attachment URLs
      {
        source: "/author/:path*",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:category/:slug/attachment/:att*/",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/:slug/attachment/:att*",
        destination: "/:category/:slug/",
        permanent: true,
      },
      // Common legal & contact aliases
      {
        source: "/privacy-policy/",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-de-privacidad/",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-de-privacidad",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/contacto/",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      // Legacy WordPress Home page slug & blog alias
      {
        source: "/290-2/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/290-2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/",
        destination: "/guias/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/guias/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
