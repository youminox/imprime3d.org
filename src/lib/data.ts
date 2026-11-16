import postsData from "../../data/posts.json";
import pagesData from "../../data/pages.json";
import categoriesData from "../../data/categories.json";

export const SITE_NAME = "Imprime en 3D";
export const SITE_URL = "https://imprime3d.org";
/**
 * Fecha estable de la última revisión editorial del contenido (sitemaps).
 * Actualizar SOLO cuando el contenido cambie de verdad; un lastmod que cambia
 * en cada build hace que Google ignore la señal.
 */
export const CONTENT_LAST_REVIEWED = "2026-11-04";
export const SITE_DESCRIPTION =
  "Portal especializado en impresión 3D: comparativas de impresoras 3D de filamento (FDM) y resina (MSLA), mantenimiento, solución de problemas técnicos, calibración de slicer y proyectos rentables.";
export const ADSENSE_CLIENT = "ca-pub-1070738569472471";
export const GA_ID = "G-98Z28T2MZS";

export interface PostCategory {
  slug: string;
  name: string;
}

export interface InlineRelatedLink {
  url: string;
  title: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  categories: PostCategory[];
  date: string;
  modified: string;
  readTime: string;
  content: string;
  excerpt: string;
  featuredImageId: number | null;
  featuredImageUrl: string;
  inlineRelated?: InlineRelatedLink[];
  isTopSeo?: boolean;
  type: string;
  status: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parent: string;
  description: string;
  count: number;
}

const posts: Post[] = postsData as Post[];
const pages: Post[] = pagesData as Post[];
const categories: Category[] = categoriesData as Category[];

const postBySlugMap = new Map<string, Post>();
for (const p of posts) {
  postBySlugMap.set(p.slug, p);
}

const categoryBySlugMap = new Map<string, Category>();
for (const c of categories) {
  categoryBySlugMap.set(c.slug, c);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return postBySlugMap.get(slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlugMap.get(slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter(
    (p) =>
      p.category === categorySlug ||
      p.categories.some((c) => c.slug === categorySlug)
  );
}

export function getTopSeoPosts(limit = 12): Post[] {
  const topPosts = posts.filter((p) => p.isTopSeo);
  return topPosts.slice(0, limit);
}

const PRIORITY_BUYING_AND_REVIEW_SLUGS = [
  "mejores-impresoras-3d-para-principiantes-en-casa",
  "impresora-3d-de-resina-vs-filamento-cual-es-mejor-para-ti",
  "como-elegir-tu-primera-impresora-3d",
  "mejores-marcas-de-impresoras-3d",
  "descubre-la-impresora-3d-creality-k1c-2024-innovacion-y-precision-en-impresion-3d",
  "elegoo-mars-4-msla-la-impresora-en-3d-ideal-para-impresiones-de-alta-precision",
  "impresora-3d-anycubic-photon-mono-m5s-pro-la-mejor-eleccion-para-impresion-de-alta-calidad",
  "descubre-la-impresora-en-3d-anycubic-kobra-2-neo-innovacion-y-velocidad-al-maximo",
  "descubre-la-impresora-3d-flashforge-adventurer-5m-innovacion-y-velocidad-en-impresion-3d",
  "descubre-la-impresora-3d-anycubic-photon-mono-2-precision-y-eficiencia-en-un-solo-dispositivo",
  "diferencias-entre-impresoras-3d-caseras-y-profesionales",
  "que-tener-en-cuenta-al-comprar-una-impresora-3d-economica",
];

export function getFeaturedBuyingGuides(limit = 6): Post[] {
  const result: Post[] = [];
  for (const slug of PRIORITY_BUYING_AND_REVIEW_SLUGS) {
    const found = postBySlugMap.get(slug);
    if (found) {
      result.push(found);
    }
    if (result.length >= limit) break;
  }
  if (result.length < limit) {
    for (const p of posts) {
      if (
        (p.category === "guias" || p.category === "resenas") &&
        !result.some((r) => r.id === p.id)
      ) {
        result.push(p);
        if (result.length >= limit) break;
      }
    }
  }
  return result;
}

const PRIORITY_TROUBLESHOOTING_SLUGS = [
  "como-evitar-errores-de-warping-en-impresion-3d",
  "que-hacer-si-la-boquilla-de-la-impresora-3d-se-obstruye",
  "el-filamento-no-se-adhiere-a-la-cama-soluciones-efectivas",
  "como-nivelar-correctamente-la-cama-de-impresion-paso-a-paso",
  "impresion-3d-con-capas-desplazadas-como-corregir",
  "como-configurar-la-retraccion-para-evitar-hilos-cuando-se-imprime-con-abs",
  "como-limpiar-correctamente-la-boquilla-de-tu-impresora-3d",
  "problemas-con-el-extrusor-que-no-empuja-el-filamento",
  "mi-impresora-3d-no-calienta-correctamente-causas-comunes",
];

export function getTroubleshootingGuides(limit = 6): Post[] {
  const result: Post[] = [];
  for (const slug of PRIORITY_TROUBLESHOOTING_SLUGS) {
    const found = postBySlugMap.get(slug);
    if (found) {
      result.push(found);
    }
    if (result.length >= limit) break;
  }
  return result;
}

export function getRecentPosts(limit = 24): Post[] {
  return posts.slice(0, limit);
}

export function getRelatedPosts(currentPost: Post, limit = 4): Post[] {
  const sameCategory = posts.filter(
    (p) => p.id !== currentPost.id && p.category === currentPost.category
  );
  const topInCat = sameCategory.filter((p) => p.isTopSeo);
  const regularInCat = sameCategory.filter((p) => !p.isTopSeo);
  const combined = [...topInCat, ...regularInCat];
  if (combined.length >= limit) {
    const result: Post[] = [];
    if (topInCat.length > 0) {
      result.push(topInCat[currentPost.id % topInCat.length]);
    }
    const startIdx = currentPost.id % Math.max(1, regularInCat.length);
    for (let i = 0; i < regularInCat.length && result.length < limit; i++) {
      const candidate = regularInCat[(startIdx + i) % regularInCat.length];
      if (!result.some((r) => r.id === candidate.id)) {
        result.push(candidate);
      }
    }
    return result.slice(0, limit);
  }
  return combined.slice(0, limit);
}

export function getContextualRelatedPosts(currentPost: Post, limit = 3): Post[] {
  const result: Post[] = [];

  // 1. First use extracted [aib_post_related] internal links if they match valid posts
  if (currentPost.inlineRelated && currentPost.inlineRelated.length > 0) {
    for (const item of currentPost.inlineRelated) {
      const parts = item.url.replace(/^\/|\/$/g, "").split("/");
      const targetSlug = parts[parts.length - 1];
      const targetPost = postBySlugMap.get(targetSlug);
      if (
        targetPost &&
        targetPost.id !== currentPost.id &&
        !result.some((r) => r.id === targetPost.id)
      ) {
        result.push(targetPost);
      }
      if (result.length >= limit) return result;
    }
  }

  // 2. Fallback to same category posts with deterministic offset so every post gets rich internal links
  const sameCat = posts.filter(
    (p) => p.id !== currentPost.id && p.category === currentPost.category
  );
  if (sameCat.length > 0) {
    const offset = (currentPost.id * 7) % sameCat.length;
    for (let i = 0; i < sameCat.length && result.length < limit; i++) {
      const candidate = sameCat[(offset + i) % sameCat.length];
      if (!result.some((r) => r.id === candidate.id)) {
        result.push(candidate);
      }
    }
  }

  return result;
}

export function getPageBySlug(slug: string): Post | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getPostUrl(post: Post): string {
  return `/${post.category}/${post.slug}/`;
}

export function getImageUrl(url: string): string {
  if (!url) {
    return "/images/Que-es-y-como-funciona-una-impresora-3D-1.jpg";
  }
  if (url.startsWith("/images/")) {
    return url;
  }
  const filename = url.split("/").pop()?.split("?")[0] || "";
  return `/images/${filename}`;
}

export function generateExcerpt(html: string, maxLength = 158): string {
  if (!html) return SITE_DESCRIPTION;
  const plain = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  const cut = plain.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]+$/, "") + "...";
}
