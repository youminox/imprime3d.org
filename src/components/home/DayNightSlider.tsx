"use client";

import { useCallback, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Escena arrastrable día ↔ noche: cambia la luz sobre el taller de impresión 3D, del prototipado diurno a las impresiones largas nocturnas. */
export default function DayNightSlider() {
  const [v, setV] = useState(25);
  const [touched, setTouched] = useState(false);
  const scene = useRef<HTMLDivElement>(null);

  const t = v / 100;
  const dusk = clamp(1 - Math.abs(t - 0.5) * 2.4);
  const night = clamp((t - 0.45) / 0.45);
  const stars = clamp((t - 0.62) / 0.3);
  const sunX = 110 + t * 520;
  const sunY = 95 + Math.pow(t, 1.6) * 330;
  const sunO = 1 - clamp((t - 0.55) / 0.2);
  const moonY = 420 - clamp((t - 0.5) / 0.5) * 320;
  const hour = 8 + t * 15;
  const hh = Math.floor(hour);
  const mm = Math.round(((hour - hh) * 60) / 15) * 15;
  const time = `${String((hh + (mm === 60 ? 1 : 0)) % 24).padStart(2, "0")}:${String(
    mm === 60 ? 0 : mm
  ).padStart(2, "0")}`;

  const phase =
    t < 0.34
      ? "Mañana · Diseño CAD & Calibración"
      : t < 0.67
      ? "Tarde · Prototipado Rápido FDM / Resina"
      : "Noche · Impresiones Largas (+18 h Silenciosas)";

  const ritualNote =
    t < 0.34
      ? "Nivela la cama PEI, limpia con alcohol isopropílico IPA 99% y verifica la primera capa"
      : t < 0.67
      ? "Imprime a 250–600 mm/s en PLA+, PETG o resina MSLA con parámetros térmicos estables"
      : "Drivers silenciosos TMC2209, cámara cerrada sin corrientes de aire y secador activo";

  const fromPointer = useCallback((clientX: number) => {
    const el = scene.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setV(Math.round(clamp((clientX - r.left) / r.width) * 100));
    setTouched(true);
  }, []);

  return (
    <div className="daynight bg-[#071324] shadow-[0_40px_80px_-40px_rgba(7,19,36,0.75)]">
      <div
        ref={scene}
        className="relative aspect-[4/5] cursor-ew-resize select-none sm:aspect-[16/9]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") e.preventDefault();
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === "touch") {
            if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId))
              fromPointer(e.clientX);
          }
        }}
      >
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="dn-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7cc8f2" />
              <stop offset="1" stopColor="#e0f2fe" />
            </linearGradient>
            <linearGradient id="dn-dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1e3a8a" />
              <stop offset="0.52" stopColor="#0284c7" />
              <stop offset="1" stopColor="#fdba74" />
            </linearGradient>
            <linearGradient id="dn-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#040914" />
              <stop offset="0.7" stopColor="#0a1628" />
              <stop offset="1" stopColor="#0f2744" />
            </linearGradient>
            <radialGradient id="dn-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fff7d1" />
              <stop offset="0.5" stopColor="#ffd166" />
              <stop offset="1" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dn-lamp" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="450" fill="url(#dn-day)" />
          <rect width="800" height="450" fill="url(#dn-dusk)" opacity={dusk} />
          <rect width="800" height="450" fill="url(#dn-night)" opacity={night} />

          {/* Estrellas */}
          <g opacity={stars} fill="#e0f2fe">
            {[
              [60, 40, 1.6],
              [140, 90, 1.1],
              [230, 30, 1.4],
              [320, 70, 1],
              [410, 25, 1.5],
              [500, 85, 1.1],
              [590, 35, 1.3],
              [690, 70, 1],
              [760, 30, 1.4],
              [100, 160, 1],
              [380, 140, 0.9],
              [720, 150, 1.2],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>

          {/* Sol */}
          <g opacity={sunO}>
            <circle cx={sunX} cy={sunY} r="90" fill="url(#dn-sun)" />
            <circle cx={sunX} cy={sunY} r="30" fill="#ffe08a" />
          </g>

          {/* Luna */}
          <g transform={`translate(640 ${moonY})`} opacity={clamp((t - 0.5) / 0.25)}>
            <circle r="30" fill="#e0f2fe" />
            <circle cx="12" cy="-8" r="26" fill="#071324" opacity={0.9 * night + 0.1} />
          </g>

          {/* Horizonte */}
          <path
            d="M0 330 C120 290 210 300 300 320 C400 280 520 290 620 315 C700 300 760 305 800 310 L800 450 L0 450 Z"
            fill={night > 0.5 ? "#0b192c" : "#94a3b8"}
            opacity="0.9"
          />
          <path
            d="M0 330 C120 290 210 300 300 320 C400 280 520 290 620 315 C700 300 760 305 800 310 L800 450 L0 450 Z"
            fill="#071324"
            opacity={night}
          />
          <g fill={t > 0.5 ? "#091526" : "#64748b"}>
            {[
              [40, 300, 40, 150],
              [90, 270, 36, 180],
              [135, 310, 50, 140],
              [520, 285, 40, 165],
              [565, 255, 46, 195],
              [618, 300, 36, 150],
              [660, 275, 44, 175],
              [712, 305, 48, 145],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="3" />
            ))}
          </g>
          <g fill="#7dd3fc" opacity={night}>
            {[
              [100, 285],
              [112, 310],
              [100, 335],
              [150, 325],
              [530, 300],
              [578, 270],
              [590, 300],
              [578, 330],
              [672, 290],
              [684, 320],
              [725, 318],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="7" height="9" rx="1" />
            ))}
          </g>

          {/* Luz LED nocturna de la impresora 3D */}
          <circle cx="400" cy="335" r="205" fill="url(#dn-lamp)" opacity={night} />

          {/* Mesa de trabajo Maker */}
          <rect x="0" y="392" width="800" height="58" fill={night > 0.5 ? "#0f172a" : "#475569"} />
          <rect x="0" y="392" width="800" height="58" fill="#071324" opacity={night * 0.72} />
          <rect x="0" y="388" width="800" height="6" fill="#38bdf8" opacity="0.28" />

          {/* Secador de Filamento Digital a la izquierda */}
          <g transform="translate(205 322)">
            <rect width="58" height="68" rx="10" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
            <circle cx="29" cy="30" r="18" fill="#0f172a" stroke="#f97316" strokeWidth="4" />
            <rect x="14" y="54" width="30" height="10" rx="3" fill="#0284c7" />
            <text x="29" y="61" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff">
              50°C 15%
            </text>
          </g>

          {/* Impresora 3D Central CoreXY / Pórtico */}
          <rect
            x="295"
            y="258"
            width="210"
            height="132"
            rx="12"
            fill="rgba(15, 23, 42, 0.85)"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
          <rect
            x="310"
            y="272"
            width="180"
            height="96"
            rx="8"
            fill="rgba(56, 189, 248, 0.08)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
          />
          {/* Cama PEI y pieza iluminada dentro */}
          <rect x="330" y="352" width="140" height="6" rx="2" fill="#f97316" />
          <polygon
            points="400,305 370,324 370,352 430,352 430,324"
            fill="#06b6d4"
            fillOpacity="0.88"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />
          {/* Eje X y cabezal extrusor */}
          <line x1="316" y1="294" x2="484" y2="294" stroke="#94a3b8" strokeWidth="4" />
          <rect x="386" y="284" width="28" height="22" rx="4" fill="#0284c7" stroke="#fff" strokeWidth="1.2" />

          {/* Estación de Lavado y Curado UV a la derecha */}
          <g transform="translate(535 314)">
            <rect width="54" height="76" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
            <rect x="8" y="8" width="38" height="46" rx="4" fill="rgba(6, 182, 212, 0.25)" stroke="#67e8f9" strokeWidth="1.2" />
            <circle cx="27" cy="64" r="5" fill="#38bdf8" />
          </g>

          {/* Ondas térmicas controladas */}
          <g
            className="steam"
            fill="none"
            stroke="#67e8f9"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
          >
            <path d="M368 248 C355 224 382 208 368 182" />
            <path d="M398 244 C385 218 412 200 398 170" />
            <path d="M428 248 C415 224 442 208 428 182" />
          </g>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/30 bg-black/45 px-4 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cyan-300">
            {phase}
          </p>
          <p className="font-display text-3xl font-extrabold tabular-nums">{time}</p>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 max-w-[54%] rounded-2xl border border-white/30 bg-black/45 px-4 py-3 text-right text-white backdrop-blur-md sm:right-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#67e8f9]">
            Producción continua y estable
          </p>
          <p className="font-display text-xs font-bold leading-snug sm:text-base">{ritualNote}</p>
        </div>

        {!touched && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-lg sm:bottom-5 sm:px-4 sm:py-2 sm:text-sm">
            ← Arrastra para pasar del calibrado diurno a la impresión nocturna →
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 bg-[#071324] px-5 py-4 text-white sm:px-7">
        <span aria-hidden>☀️</span>
        <label className="sr-only" htmlFor="dn-range">
          Hora del día en el taller de impresión 3D
        </label>
        <input
          id="dn-range"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            setV(Number(e.target.value));
            setTouched(true);
          }}
          aria-valuetext={`${phase}, ${time}`}
        />
        <span aria-hidden>🌙</span>
      </div>
    </div>
  );
}
