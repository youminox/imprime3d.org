"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    t: "Laminado CAD/STL y Parámetros en el Slicer (Cura)",
    d: "El modelo 3D se divide en cientos de capas de 0.12 a 0.20 mm definiendo relleno Gyroid, retracción y temperaturas exactas.",
  },
  {
    n: "02",
    t: "Primera Capa Perfecta y Fusión en Cama Caliente PEI",
    d: "El sensor CR-Touch nivela el Z-Offset y la boquilla de 0.4 mm deposita el filamento fundido (200–240 °C) con adherencia total sin warping.",
  },
  {
    n: "03",
    t: "Extrusión Capa a Capa y Enfriamiento Controlado",
    d: "La pieza crece con precisión micrométrica y al enfriarse la placa PEI a menos de 30 °C se libera limpia y lista para usar.",
  },
];

/** Escena fijada con GSAP ScrollTrigger: del archivo STL a la pieza 3D terminada sobre la cama caliente PEI. */
export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        if (reduce) {
          gsap.set(q(".printed-model"), { opacity: 1, scaleY: 1 });
          gsap.set(q(".extruder-head"), { y: -85 });
          gsap.set(q(".heat-waves, .night, .moon, .stars, .warm-glow"), { opacity: 1 });
          gsap.set(q(".step"), { opacity: 1 });
          gsap.set(q(".bar"), { scaleX: 1 });
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2000",
            scrub: 0.7,
            pin: q(".pin")[0],
            anticipatePin: 1,
          },
        });

        tl.to(q(".step-0"), { opacity: 1, duration: 0.2 }, 0)
          .to(q(".step-0 .dot"), { backgroundColor: "#0284c7", color: "#fff", duration: 0.2 }, 0)
          .fromTo(
            q(".wireframe-preview"),
            { opacity: 0, scale: 0.85 },
            { opacity: 0.75, scale: 1, duration: 0.8, ease: "power2.out" },
            0
          )
          .to(q(".step-0"), { opacity: 0.8, duration: 0.2 }, 1.05)
          .to(q(".step-1"), { opacity: 1, duration: 0.2 }, 1.05)
          .to(q(".step-1 .dot"), { backgroundColor: "#0369a1", color: "#fff", duration: 0.2 }, 1.05)
          .to(q(".bed-heat"), { opacity: 1, duration: 0.5 }, 1.05)
          .fromTo(
            q(".first-layer"),
            { scaleX: 0, transformOrigin: "center" },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            1.15
          )
          .to(q(".nozzle-spark"), { opacity: 1, scale: 1.3, duration: 0.35 }, 1.45)
          .to(q(".step-1"), { opacity: 0.8, duration: 0.2 }, 2.15)
          .to(q(".step-2"), { opacity: 1, duration: 0.2 }, 2.15)
          .to(
            q(".step-2 .dot"),
            { backgroundColor: "#06b6d4", color: "#061626", duration: 0.2 },
            2.15
          )
          .fromTo(
            q(".printed-model"),
            { scaleY: 0.05, opacity: 0.9, transformOrigin: "50% 100%" },
            { scaleY: 1, opacity: 1, duration: 1.1, ease: "power1.inOut" },
            2.0
          )
          .fromTo(
            q(".extruder-head"),
            { y: 0 },
            { y: -92, duration: 1.1, ease: "power1.inOut" },
            2.0
          )
          .to(q(".warm-glow"), { opacity: 0.95, duration: 0.5 }, 2.25)
          .to(q(".heat-waves"), { opacity: 1, duration: 0.4 }, 2.4)
          .to(q(".night"), { opacity: 1, duration: 0.6 }, 2.6)
          .fromTo(q(".moon"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 2.75)
          .to(q(".stars"), { opacity: 1, duration: 0.5 }, 2.85)
          .to(q(".done"), { opacity: 1, y: 0, duration: 0.4 }, 3.1)
          .to(q(".bar"), { scaleX: 1, duration: 3.5 }, 0);
      }, el);
    };

    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io?.disconnect();
          init();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="del-stl-a-la-pieza"
      ref={root}
      className="relative bg-gradient-to-b from-white via-[#f0f9ff] to-white"
    >
      <div className="pin flex min-h-[100svh] items-center overflow-hidden py-10 lg:py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="eyebrow">Del archivo STL a la pieza real</span>
            <h2 className="section-title mt-3">
              Tres etapas. <span className="text-[#0284c7]">La impresión 3D sin fallos.</span>
            </h2>
            <div className="mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded bg-[var(--line)]">
              <div className="bar h-full origin-left scale-x-0 bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#f97316]" />
            </div>
            <ol className="mt-6 space-y-3 sm:mt-8 sm:space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`step step-${i} flex gap-4`} style={{ opacity: 0.8 }}>
                  <span className="dot grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white font-display font-extrabold text-slate-900 shadow-md">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold sm:text-xl">{s.t}</p>
                    <p className="text-sm text-slate-600 sm:text-base">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p
              className="done mt-6 hidden text-sm text-[var(--muted)] sm:block"
              style={{ opacity: 0, transform: "translateY(10px)" }}
            >
              Regla de oro Maker: “El 90% del éxito de una impresión 3D de 15 horas se decide en la
              nivelación y temperatura de los primeros 3 minutos de la primera capa.”
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[360px] lg:max-w-[430px]">
            <svg
              viewBox="0 0 400 440"
              className="relative w-full drop-shadow-[0_30px_50px_rgba(2,132,199,0.25)]"
              role="img"
              aria-label="Animación: una impresora 3D lamina el archivo STL, deposita la primera capa caliente en la placa PEI y construye la pieza 3D capa a capa"
            >
              <defs>
                <linearGradient id="i3d-day" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e0f2fe" />
                  <stop offset="1" stopColor="#f8fafc" />
                </linearGradient>
                <linearGradient id="i3d-night" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#040b16" />
                  <stop offset="0.65" stopColor="#0a192f" />
                  <stop offset="1" stopColor="#0f294a" />
                </linearGradient>
                <linearGradient id="i3d-frame" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#1e293b" />
                  <stop offset="1" stopColor="#0f172a" />
                </linearGradient>
                <radialGradient id="i3d-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#06b6d4" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
                <clipPath id="i3d-panel">
                  <rect x="0" y="0" width="400" height="440" rx="36" />
                </clipPath>
              </defs>

              <g clipPath="url(#i3d-panel)">
                {/* Cielo Día / Noche de Taller */}
                <rect width="400" height="440" fill="url(#i3d-day)" />
                <circle cx="330" cy="65" r="22" fill="#38bdf8" opacity="0.55" />
                <rect className="night" width="400" height="440" fill="url(#i3d-night)" opacity="0" />
                <g className="stars" opacity="0" fill="#bae6fd">
                  {[
                    [40, 38, 1.5],
                    [92, 76, 1.1],
                    [150, 28, 1.4],
                    [225, 62, 1],
                    [58, 118, 1.2],
                    [265, 32, 1.5],
                    [362, 115, 1.1],
                    [188, 92, 0.9],
                  ].map(([x, y, r], i) => (
                    <circle key={i} cx={x} cy={y} r={r} />
                  ))}
                </g>
                <g className="moon" opacity="0">
                  <circle cx="324" cy="66" r="23" fill="#e0f2fe" />
                  <circle cx="334" cy="58" r="19" fill="#071527" />
                </g>

                {/* Halo cian del taller 3D */}
                <circle className="warm-glow" cx="200" cy="250" r="175" fill="url(#i3d-glow)" opacity="0" />

                {/* Pórtico (Gantry) de la Impresora 3D */}
                <rect x="64" y="88" width="16" height="270" rx="5" fill="url(#i3d-frame)" stroke="#334155" strokeWidth="2" />
                <rect x="320" y="88" width="16" height="270" rx="5" fill="url(#i3d-frame)" stroke="#334155" strokeWidth="2" />
                <rect x="56" y="76" width="288" height="18" rx="6" fill="url(#i3d-frame)" stroke="#38bdf8" strokeWidth="1.5" />

                {/* Bobina de filamento superior */}
                <circle cx="200" cy="48" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                <circle cx="200" cy="48" r="16" fill="none" stroke="#f97316" strokeWidth="6" />
                <circle cx="200" cy="48" r="6" fill="#94a3b8" />

                {/* Base de la Impresora 3D + Pantalla LCD */}
                <rect x="46" y="346" width="308" height="54" rx="14" fill="url(#i3d-frame)" stroke="#0284c7" strokeWidth="2.5" />
                <rect x="282" y="357" width="54" height="32" rx="6" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.5" />
                <text x="309" y="371" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff">
                  210° / 60°C
                </text>
                <text x="309" y="382" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#bae6fd">
                  100% OK
                </text>

                {/* Cama caliente PEI */}
                <rect x="92" y="328" width="216" height="12" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <rect
                  className="bed-heat"
                  x="96"
                  y="324"
                  width="208"
                  height="6"
                  rx="3"
                  fill="#f97316"
                  opacity="0.35"
                />

                {/* Previsualización Malla Wireframe CAD/STL */}
                <g className="wireframe-preview" opacity="0">
                  <polygon
                    points="200,224 146,254 146,324 254,324 254,254"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                  />
                  <line x1="146" y1="278" x2="254" y2="278" stroke="#38bdf8" strokeDasharray="3 3" />
                  <line x1="146" y1="302" x2="254" y2="302" stroke="#38bdf8" strokeDasharray="3 3" />
                  <line x1="200" y1="224" x2="200" y2="324" stroke="#38bdf8" strokeDasharray="3 3" />
                </g>

                {/* Primera capa adherida */}
                <rect
                  className="first-layer"
                  x="140"
                  y="321"
                  width="120"
                  height="4"
                  rx="2"
                  fill="#f97316"
                />

                {/* Pieza 3D impresa creciendo capa por capa */}
                <g className="printed-model" style={{ opacity: 0 }}>
                  <polygon
                    points="200,226 146,256 146,324 254,324 254,256"
                    fill="#0284c7"
                    fillOpacity="0.88"
                    stroke="#67e8f9"
                    strokeWidth="2"
                  />
                  {[248, 262, 276, 290, 304, 316].map((ly) => (
                    <line
                      key={ly}
                      x1="148"
                      y1={ly}
                      x2="252"
                      y2={ly}
                      stroke="rgba(255,255,255,0.32)"
                      strokeWidth="1.5"
                    />
                  ))}
                </g>

                {/* Eje X móvil + Cabezal Extrusor Direct Drive + Boquilla 0.4mm */}
                <g className="extruder-head">
                  {/* Barra horizontal eje X */}
                  <rect x="78" y="274" width="244" height="10" rx="3" fill="#475569" />
                  {/* Carro del extrusor */}
                  <rect
                    x="174"
                    y="252"
                    width="52"
                    height="46"
                    rx="9"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  {/* Ventilador frontal */}
                  <circle cx="200" cy="274" r="13" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
                  <circle cx="200" cy="274" r="4" fill="#38bdf8" />
                  {/* Bloque calefactor + Boquilla de latón */}
                  <rect x="192" y="298" width="16" height="10" rx="2" fill="#94a3b8" />
                  <polygon points="195,308 205,308 200,320" fill="#fbbf24" />
                  {/* Destello térmico de fusión */}
                  <circle
                    className="nozzle-spark"
                    cx="200"
                    cy="321"
                    r="6"
                    fill="#f97316"
                    opacity="0"
                  />
                </g>

                {/* Ondas térmicas controladas */}
                <g
                  className="heat-waves steam"
                  opacity="0"
                  fill="none"
                  stroke="#67e8f9"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                >
                  <path d="M145 200 C135 178 158 164 145 140" />
                  <path d="M200 192 C190 168 212 152 200 126" />
                  <path d="M255 200 C245 178 268 164 255 140" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
