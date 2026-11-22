"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import HeroSearch from "@/components/HeroSearch";
import OpenChatButton from "@/components/OpenChatButton";

/** Partículas en canvas (cian láser / azul eléctrico / naranja extrusor) que el puntero repele. */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let running = false;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const COLORS = [
      "56,189,248",
      "6,182,212",
      "2,132,199",
      "249,115,22",
      "251,191,36",
      "103,232,249",
    ];
    const N = w < 700 ? 44 : 105;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.4 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: Math.random() * 0.55 + 0.25,
    }));
    let mx = -999,
      my = -999;
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mx,
          dy = p.y - my,
          d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (16000 - d2) / 16000;
          p.vx += (dx / 4000) * f;
          p.vy += (dy / 4000) * f;
        }
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 - 0.006;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ric = (window as any).requestIdleCallback || ((f: () => void) => setTimeout(f, 300));
    ric(() => io.observe(c));
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-[1] h-full w-full"
      aria-hidden
    />
  );
}

export default function Hero({
  totalPosts = 505,
  totalCategories = 11,
}: {
  totalPosts?: number;
  totalCategories?: number;
}) {
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = card.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 20;
      ty = -(e.clientY / window.innerHeight - 0.5) * 15;
      kick();
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-16, Math.min(16, e.gamma / 2));
      ty = Math.max(-12, Math.min(12, (e.beta - 45) / 3));
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onOrient, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  const words = ["Imprime", "en", "3D"];

  return (
    <section className="hero min-h-[100svh] pt-6">
      <div className="hero-aurora" />
      <div className="hero-grid" />
      <Particles />

      <div className="wrap grid min-h-[calc(100svh-76px)] items-center gap-10 py-12 lg:grid-cols-[1.12fr_1fr] lg:gap-12 lg:py-8">
        <div className="relative z-20">
          <span className="chip">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#38bdf8]" />
            🖨️ Enciclopedia de Impresión 3D · FDM & Resina MSLA · Filamentos · Calibración y Fallos
          </span>

          <h1 className="hero-title mt-5">
            <span className="block">
              {words.map((w, i) => (
                <span key={w}>
                  <span
                    className="hw"
                    style={{ animationDelay: `${0.08 + i * 0.14}s, ${-i * 1.2}s` }}
                  >
                    {w}
                  </span>
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </span>{" "}
            <span className="mt-4 block text-[0.41em] font-bold leading-[1.22] tracking-[-0.02em] text-white/90">
              {["Domina", "tu", "impresora", "3D,", "filamentos", "y"].map((w, i) => (
                <Fragment key={w + i}>
                  <span className="reveal-word">
                    <span style={{ animationDelay: `${0.38 + i * 0.06}s` }}>{w}</span>
                  </span>{" "}
                </Fragment>
              ))}
              <span className="reveal-word">
                <span style={{ animationDelay: "0.78s" }} className="text-[#67e8f9]">
                  logra piezas sin errores
                </span>
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/80">
            Comparativas técnicas de impresoras FDM y de resina, parámetros térmicos de PLA, PETG,
            ABS y TPU, solución definitiva al <strong className="text-white">warping</strong> y{" "}
            <strong className="text-white">
              {totalPosts.toLocaleString("es-PE")} manuales verificados
            </strong>{" "}
            junto a nuestro <strong className="text-[#67e8f9]">Asesor Técnico IA</strong> en vivo.
          </p>

          <div className="mt-6 max-w-xl">
            <HeroSearch />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <OpenChatButton
              label="Consultar al Asesor Técnico IA 3D"
              className="btn btn-lime shine text-sm sm:text-base"
              magnetic
            />
            <Link
              href="/tutoriales/como-evitar-errores-de-warping-en-impresion-3d/"
              className="btn btn-glass text-sm sm:text-base"
              data-magnetic
            >
              Guía Definitiva Anti-Warping →
            </Link>
          </div>

          <ul
            className="mt-8 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-3"
            aria-label="Cifras de Imprime en 3D"
          >
            {[
              [totalPosts.toLocaleString("es-PE"), "guías", "técnicas y tutoriales"],
              ["FDM & SLA", "100%", "parámetros verificados"],
              [`${totalCategories}`, "pilares", "de fabricación aditiva"],
            ].map(([v, u, l], i) => (
              <li
                key={l}
                className="glass px-3 py-3 sm:px-4"
                style={{
                  animation: `fadeup .8s ${0.85 + i * 0.1}s cubic-bezier(.2,.8,.2,1) both`,
                }}
              >
                <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                  {v}
                  {u && <span className="ml-1 text-xs font-bold text-[#67e8f9]">{u}</span>}
                </p>
                <p className="text-[0.72rem] leading-tight text-white/75 sm:text-xs">{l}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 3D Tilt Stage */}
        <div className="tilt-stage relative z-10 mx-auto w-full max-w-[560px]">
          <div ref={card} className="tilt-card relative py-6">
            <div className="tilt-glow" />
            <div className="halo-ring" />

            <div className="relative" style={{ transform: "translateZ(50px)" }}>
              <div className="float-y relative mx-auto aspect-[4/3] w-full max-w-[490px] overflow-hidden rounded-[32px] border-2 border-cyan-300/30 shadow-[0_40px_70px_rgba(0,0,0,0.75)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Como-evitar-errores-de-warping-en-impresion-3D.jpg"
                  alt="Impresora 3D depositando capas de precisión sobre cama caliente"
                  width={800}
                  height={600}
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/95 via-[#071324]/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                  <div>
                    <span className="inline-block rounded-full bg-[#0284c7] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cyan-100">
                      Power Page #1 en Google
                    </span>
                    <p className="mt-1 font-display text-xl sm:text-2xl font-extrabold leading-tight">
                      Cómo Evitar el Efecto Warping en Impresión 3D
                    </p>
                  </div>
                  <Link
                    href="/tutoriales/como-evitar-errores-de-warping-en-impresion-3d/"
                    className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur hover:bg-white/30"
                  >
                    Leer →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sello circular giratorio SVG */}
            <div
              className="price-badge right-0 top-0 sm:right-2 sm:top-1"
              aria-label="505 guías técnicas de impresión 3D FDM y Resina"
            >
              <svg viewBox="0 0 124 124" aria-hidden>
                <defs>
                  <path
                    id="pb-circle"
                    d="M62,62 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0"
                  />
                </defs>
                <text fontSize="8.7" fontWeight="800" fill="#061626">
                  <textPath href="#pb-circle" textLength="300" lengthAdjust="spacing">
                    IMPRESIÓN 3D · FDM & RESINA · CALIBRACIÓN ·
                  </textPath>
                </text>
              </svg>
              <div className="relative">
                <p className="font-display text-[1.45rem] font-extrabold leading-none">
                  {totalPosts.toLocaleString("es-PE")}
                </p>
                <p className="mt-0.5 text-[0.6rem] font-extrabold uppercase">Guías 3D</p>
              </div>
            </div>

            {/* Tarjeta flotante 3D izquierda */}
            <Link
              href="/principios-basicos/que-es-y-como-funciona-una-impresora-3d/"
              className="absolute -left-2 bottom-4 hidden items-center gap-3 rounded-2xl border border-cyan-400/25 bg-[#071324]/90 p-2.5 pr-4 text-white shadow-2xl backdrop-blur sm:flex hover:border-[#38bdf8] transition"
              style={{ transform: "translateZ(85px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Que-es-y-como-funciona-una-impresora-3D.jpg"
                alt="Qué es y cómo funciona una impresora 3D"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#67e8f9]">
                  Fundamentos 3D
                </p>
                <p className="font-display text-sm font-bold">Cómo Funciona una Impresora 3D</p>
              </div>
            </Link>

            {/* Chip 3D derecha */}
            <div
              className="absolute bottom-[36%] right-[-6px] hidden rounded-full border border-cyan-400/30 bg-[#071324]/90 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur md:block"
              style={{ transform: "translateZ(120px)" }}
            >
              🎯 Precisión ±0.02 mm · Cama PEI
            </div>
          </div>
        </div>
      </div>

      <a
        href="#que-es"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/50 lg:flex"
        aria-label="Bajar a explorar Imprime en 3D"
      >
        <span className="h-10 w-6 rounded-full border border-white/30 p-1">
          <span className="block h-2 w-full animate-bounce rounded-full bg-[#38bdf8]" />
        </span>
      </a>
    </section>
  );
}
