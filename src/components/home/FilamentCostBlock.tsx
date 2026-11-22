"use client";

import Link from "next/link";
import { useState } from "react";
import OpenChatButton from "@/components/OpenChatButton";

export type FilamentTechOption = {
  key: string;
  label: string;
  tier: string;
  costPerKgEur: number;
  tempSpec: string;
  gramsPerHour: number;
  img: string;
  alt: string;
  desc: string;
  components: string;
  href: string;
};

/**
 * Calculadora interactiva de Costo de Filamento / Resina y Rendimiento de Bobina:
 * Alterna entre 3 tecnologías (FDM Estándar PLA+, FDM Técnico PETG/ABS/TPU y Resina MSLA 9K)
 * y calcula el costo real por pieza, cuántas piezas salen por bobina de 1 kg y el tiempo estimado.
 */
export default function FilamentCostBlock({
  options,
}: {
  options: FilamentTechOption[];
}) {
  const [k, setK] = useState(options[0].key);
  const [partGrams, setPartGrams] = useState(65);

  const p = options.find((o) => o.key === k) || options[0];
  const costPerPart = ((partGrams / 1000) * p.costPerKgEur).toFixed(2);
  const partsPerKg = Math.max(1, Math.floor(1000 / Math.max(1, partGrams)));
  const printHours = Math.max(0.5, Number((partGrams / p.gramsPerHour).toFixed(1)));

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="card card-static spot relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#06b6d4]/15 blur-3xl" />
        <div className="relative">
          <div
            className="inline-flex flex-wrap rounded-full bg-[#f0f9ff] border border-[var(--line)] p-1"
            role="tablist"
            aria-label="Tecnología de Impresión 3D"
          >
            {options.map((o) => (
              <button
                key={o.key}
                role="tab"
                type="button"
                aria-selected={o.key === k}
                onClick={() => setK(o.key)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  o.key === k
                    ? "bg-[#0284c7] text-white shadow"
                    : "text-[var(--muted)] hover:text-slate-900"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_1.15fr]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[250px] overflow-hidden rounded-2xl border border-[var(--line)] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={p.img}
                src={p.img}
                alt={p.alt}
                className="h-full w-full object-cover"
                style={{ animation: "fadeup .45s ease both" }}
              />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0284c7]">
                {p.tier}
              </p>
              <p
                className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
                aria-live="polite"
              >
                ~{p.costPerKgEur} € / kg
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#0369a1]">
                Parámetros · {p.tempSpec}
              </p>
              <p className="mt-2.5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {p.desc}
              </p>
              <p className="mt-2 rounded-xl bg-[#f0f9ff] border border-sky-200 px-3 py-2 text-xs text-slate-900">
                <strong>Equipo recomendado:</strong> {p.components}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={p.href}
              className="btn btn-buy shine flex-1 text-sm"
              data-magnetic
            >
              Ver guía de {p.label.toLowerCase()} →
            </Link>
            <OpenChatButton
              label="Pedir recomendación IA"
              prompt={`Quiero imprimir con ${p.label} (${p.components}). ¿Qué impresora 3D, temperaturas y filamento me recomiendas?`}
              className="btn btn-ghost text-sm"
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#071324] via-[#0c1d36] to-[#034066] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#38bdf8]/15 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#67e8f9]">
          Calculadora de Costo por Pieza y Rendimiento de Bobina (1 kg)
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          ¿Cuánto cuesta imprimir tu pieza en 3D?
        </h3>
        <p className="mt-2 text-sm text-white/75">
          Desliza el peso estimado en gramos que te marca UltiMaker Cura o PrusaSlicer. Calculamos
          el costo exacto de material, cuántas piezas rinde una bobina de 1 kg y el tiempo de
          impresión.
        </p>

        <label
          htmlFor="i3d-grams"
          className="mt-6 flex items-center justify-between text-sm font-semibold"
        >
          <span>Peso de la pieza en el Slicer</span>
          <span className="rounded-full bg-white/10 px-3.5 py-1 font-display text-lg text-[#67e8f9]">
            {partGrams} g
          </span>
        </label>
        <input
          id="i3d-grams"
          type="range"
          min={10}
          max={400}
          step={5}
          value={partGrams}
          onChange={(e) => setPartGrams(Number(e.target.value))}
          className="mt-3 w-full accent-[#38bdf8]"
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-white/45">
          {[10, 50, 100, 200, 300, 400].map((n) => (
            <span key={n}>{n}g</span>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Costo material", `${costPerPart} €`],
            ["Piezas / bobina", `${partsPerKg} uds.`],
            ["Tiempo aprox.", `~${printHours} h`],
          ].map(([l, val], i) => (
            <div
              key={l}
              className={`glass flex flex-col-reverse p-3 ${
                i === 0 ? "border-[#38bdf8]/50 bg-[#38bdf8]/10" : ""
              }`}
            >
              <dt className="mt-1 text-[0.7rem] leading-tight text-white/65">{l}</dt>
              <dd
                className={`font-display font-extrabold ${
                  i === 0
                    ? "text-xl text-[#67e8f9] sm:text-2xl"
                    : "text-xl sm:text-2xl"
                }`}
              >
                {val}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs text-white/65">
          Una pieza de <strong>{partGrams} gramos</strong> (con relleno Gyroid al 15–20%) consume
          apenas <strong className="text-[#67e8f9]">{costPerPart} € / USD</strong> en material y te
          permite fabricar hasta <strong>{partsPerKg} unidades</strong> con un solo rollo o botella
          de 1.000 g.
        </p>
      </div>
    </div>
  );
}
