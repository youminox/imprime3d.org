"use client";

import { useState } from "react";
import Link from "next/link";

const ADVISOR_PROFILES = [
  {
    id: "principiante",
    badge: "Principiantes & Hogar",
    title: "Mi Primera Impresora 3D en Casa",
    tech: "FDM con Autonivelado y Cama PEI",
    material: "Filamento PLA / PLA+ (No tóxico y sin olor)",
    summary:
      "Si buscas empezar sin complicaciones técnicas, necesitas una impresora 3D de filamento (FDM) con nivelación automática de un toque, sensor de fin de filamento y placa magnética flexible PEI.",
    pros: [
      "Configuración inicial en menos de 20 minutos",
      "Filamento económico, biodegradable y sin necesidad de ventilación industrial",
      "Mantenimiento sencillo y repuestos universales",
    ],
    guides: [
      {
        title: "Las Mejores Impresoras 3D para Principiantes en Casa",
        href: "/guias/mejores-impresoras-3d-para-principiantes-en-casa/",
      },
      {
        title: "¿Cómo Elegir Tu Primera Impresora 3D? Consejos Expertos",
        href: "/principios-basicos/como-elegir-tu-primera-impresora-3d/",
      },
      {
        title: "Reseña: Impresora 3D Anycubic Kobra 2 Neo",
        href: "/resenas/descubre-la-impresora-en-3d-anycubic-kobra-2-neo-innovacion-y-velocidad-al-maximo/",
      },
    ],
  },
  {
    id: "resina",
    badge: "Miniaturas, Joyería & Figuras",
    title: "Máxima Precisión y Detalles Microscópicos",
    tech: "Resina UV MSLA (Pantalla Monocromática 9K/12K)",
    material: "Resina Estándar, Lavable en Agua o Tipo ABS",
    summary:
      "Para figuras de colección, miniaturas de juegos de rol, odontología o joyería donde las líneas de capa deben ser invisibles, la tecnología MSLA de resina fotopolimérica supera a cualquier impresora de filamento.",
    pros: [
      "Superficies completamente lisas con resolución de micras",
      "Imprime múltiples figuras al mismo tiempo sin aumentar el tiempo total",
      "Ideal para moldes de fundición y prototipos estéticos",
    ],
    guides: [
      {
        title: "Impresora 3D de Resina vs Filamento: ¿Cuál es Mejor para Ti?",
        href: "/guias/impresora-3d-de-resina-vs-filamento-cual-es-mejor-para-ti/",
      },
      {
        title: "Reseña: ELEGOO Mars 4 MSLA de Alta Precisión",
        href: "/resenas/elegoo-mars-4-msla-la-impresora-en-3d-ideal-para-impresiones-de-alta-precision/",
      },
      {
        title: "Reseña: ANYCUBIC Photon Mono M5s Pro",
        href: "/resenas/impresora-3d-anycubic-photon-mono-m5s-pro-la-mejor-eleccion-para-impresion-de-alta-calidad/",
      },
    ],
  },
  {
    id: "funcional",
    badge: "Ingeniería & Repuestos",
    title: "Piezas Mecánicas, Engranajes y Alta Velocidad",
    tech: "FDM Cerrada CoreXY de Alta Temperatura",
    material: "PETG, ABS, ASA, TPU Flexible y Fibra de Carbono",
    summary:
      "Para fabricar repuestos automotrices, soportes estructurales o carcasas resistentes al calor y al impacto, necesitas una impresora con cámara cerrada (evita el warping) y extrusor directo de alta temperatura.",
    pros: [
      "Cámara cerrada que mantiene temperatura constante para ABS y ASA",
      "Velocidades CoreXY de hasta 600 mm/s con compensación de vibraciones",
      "Boquilla endurecida compatible con filamentos técnicos y flexibles",
    ],
    guides: [
      {
        title: "Reseña: Impresora 3D Creality K1C de Alta Velocidad",
        href: "/resenas/descubre-la-impresora-3d-creality-k1c-2024-innovacion-y-precision-en-impresion-3d/",
      },
      {
        title: "Top 10 Impresoras 3D Ideales para Imprimir Piezas Funcionales",
        href: "/guias/impresoras-3d-ideales-para-imprimir-piezas-funcionales/",
      },
      {
        title: "Diferencias Clave entre Impresoras 3D Abiertas y Cerradas",
        href: "/guias/diferencias-entre-impresoras-3d-abiertas-y-cerradas/",
      },
    ],
  },
  {
    id: "negocio",
    badge: "Emprendimiento & Ventas",
    title: "Emprender desde Casa y Vender Impresiones 3D",
    tech: "Granja Mixta FDM + MSLA de Bajo Mantenimiento",
    material: "PLA Seda/Multicolor, PETG y Resina de Alta Durabilidad",
    summary:
      "Si tu objetivo es rentabilizar tu impresora vendiendo organizadores, macetas minimalistas, soportes personalizados, llaveros o moldes en tiendas online y ferias, prioriza velocidad, fiabilidad en tandas largas y bajo costo por gramo.",
    pros: [
      "Retorno de inversión rápido con productos personalizados de alto margen",
      "Producción continua con mantenimiento preventivo simplificado",
      "Alta demanda en decoración, organización de escritorio y accesorios",
    ],
    guides: [
      {
        title: "Los Mejores Modelos para Imprimir y Vender en Línea con Demanda",
        href: "/disenos/modelos-para-imprimir-y-vender-en-linea-que-tienen-demanda/",
      },
      {
        title: "10 Cosas Útiles que Puedes Imprimir en Casa con tu Impresora 3D",
        href: "/disenos/que-cosas-utiles-puedes-imprimir-en-casa-con-tu-impresora-3d/",
      },
      {
        title: "Las Mejores Impresoras 3D de Resina para Emprender Desde Casa",
        href: "/guias/impresoras-3d-de-resina-para-emprender-desde-casa-mas-duraderas-a-largo-plazo/",
      },
    ],
  },
];

const DIAGNOSTIC_ISSUES = [
  {
    id: "warping",
    symptom: "📐 Las esquinas de la pieza se levantan y despegan (Efecto Warping)",
    cause:
      "Contracción térmica brusca del plástico al enfriarse en las primeras capas, cama mal nivelada o corrientes de aire frío alrededor de la impresora.",
    fix: [
      "Aumenta la temperatura de la cama caliente (+5 °C a +10 °C) y apaga el ventilador de capa durante las primeras 3 capas.",
      "Activa una balsa o borde ('Brim' de 6 a 8 mm) en tu software Slicer para sujetar las esquinas.",
      "Limpia la superficie PEI con alcohol isopropílico o usa adhesivo térmico si imprimes ABS/PETG.",
    ],
    mainGuide: {
      title: "Guía Completa para Evitar el Warping en Impresión 3D (Causas y Soluciones)",
      href: "/tutoriales/como-evitar-errores-de-warping-en-impresion-3d/",
    },
    extraGuide: {
      title: "La Impresión Se Despega de la Base: Solución Definitiva",
      href: "/problemas-y-soluciones/la-impresion-se-despega-de-la-base-solucion-definitiva/",
    },
  },
  {
    id: "boquilla",
    symptom: "🔥 No sale filamento o el flujo es intermitente (Boquilla Obstruida)",
    cause:
      "Residuos carbonizados dentro del nozzle, 'heat creep' por ventilación insuficiente del disipador o temperatura de extrusión demasiado baja.",
    fix: [
      "Realiza la técnica de 'Cold Pull' (tirón en frío) con filamento de limpieza o nylon para extraer el tapón desde la raíz.",
      "Utiliza una aguja de acupuntura de 0.4 mm con el hotend caliente a 210 °C–230 °C.",
      "Verifica que el engranaje del extrusor no tenga polvo de filamento molido.",
    ],
    mainGuide: {
      title: "¿Qué Hacer si la Boquilla de tu Impresora 3D se Obstruye? Soluciones Efectivas",
      href: "/problemas-y-soluciones/que-hacer-si-la-boquilla-de-la-impresora-3d-se-obstruye/",
    },
    extraGuide: {
      title: "Cómo Limpiar Correctamente la Boquilla de tu Impresora 3D Paso a Paso",
      href: "/mantenimiento/como-limpiar-correctamente-la-boquilla-de-tu-impresora-3d/",
    },
  },
  {
    id: "primera-capa",
    symptom: "📏 El filamento no se pega a la cama en la primera capa",
    cause:
      "El Z-Offset (altura inicial del nozzle) está demasiado alto, la velocidad inicial es excesiva o la cama tiene restos de grasa de las manos.",
    fix: [
      "Ajusta el Z-Offset bajando la boquilla en incrementos de 0.02 mm hasta que la línea quede ligeramente aplastada sobre la cama.",
      "Reduce la velocidad de la primera capa a 20–25 mm/s y aumenta el ancho de línea inicial al 120%.",
      "Nivela la cama en caliente a la temperatura real de impresión.",
    ],
    mainGuide: {
      title: "El Filamento No Se Adhiere a la Cama: Soluciones Efectivas",
      href: "/problemas-y-soluciones/el-filamento-no-se-adhiere-a-la-cama-soluciones-efectivas/",
    },
    extraGuide: {
      title: "Cómo Ajustar la Altura Inicial del Nozzle de Forma Precisa",
      href: "/tutoriales-2/como-ajustar-la-altura-inicial-del-nozzle-de-forma-precisa/",
    },
  },
  {
    id: "stringing",
    symptom: "🕸️ Aparecen hilos finos o 'telarañas' entre las partes (Stringing)",
    cause:
      "Distancia o velocidad de retracción insuficiente, temperatura del hotend demasiado elevada o filamento con exceso de humedad acumulada.",
    fix: [
      "Ajusta la distancia de retracción (0.8–1.5 mm en extrusor directo; 4–6 mm en sistema Bowden).",
      "Baja la temperatura de impresión en bloques de 5 °C e imprime una torre de temperatura.",
      "Seca la bobina de filamento si escuchas pequeños chasquidos al extruir.",
    ],
    mainGuide: {
      title: "Cómo Configurar la Retracción para Evitar Hilos al Imprimir",
      href: "/trucos/como-configurar-la-retraccion-para-evitar-hilos-cuando-se-imprime-con-abs/",
    },
    extraGuide: {
      title: "Cómo Proteger Tus Impresiones y Filamentos de la Humedad",
      href: "/tutoriales/como-proteger-tus-impresiones-3d-de-la-humedad/",
    },
  },
  {
    id: "capas-desplazadas",
    symptom: "🪜 Las capas quedan desplazadas como una escalera (Layer Shifting)",
    cause:
      "Correas de los ejes X o Y flojas, poleas con prisioneros sueltos, aceleración excesiva o choque de la boquilla contra la pieza.",
    fix: [
      "Revisa y tensa las correas dentadas de los ejes X e Y y aprieta los tornillos prisioneros de las poleas del motor.",
      "Activa el 'Z-Hop' (salto en Z al retraer) en el Slicer para evitar que la boquilla golpee bordes levantados.",
      "Reduce la aceleración de viaje si imprimes piezas altas y pesadas.",
    ],
    mainGuide: {
      title: "Impresión 3D con Capas Desplazadas: Cómo Corregir Este Problema Paso a Paso",
      href: "/problemas-y-soluciones/impresion-3d-con-capas-desplazadas-como-corregir/",
    },
    extraGuide: {
      title: "Guía Definitiva para Calibrar los Ejes de Tu Impresora 3D",
      href: "/tutoriales-2/guia-para-calibrar-los-ejes-de-tu-impresora-3d/",
    },
  },
];

export default function PrinterAdvisor() {
  const [mode, setMode] = useState<"advisor" | "diagnostic">("diagnostic");
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState(0);

  const activeProfile = ADVISOR_PROFILES[selectedProfile];
  const activeIssue = DIAGNOSTIC_ISSUES[selectedIssue];

  return (
    <div
      id="asesor-3d"
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg"
    >
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-dark">
            ⚡ Herramienta Interactiva Gratuita
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Centro de Diagnóstico 3D y Selector de Impresora Ideal
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Soluciona al instante cualquier fallo de impresión o descubre qué
            tecnología (FDM vs Resina) necesitas según tu proyecto.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 self-start">
          <button
            type="button"
            onClick={() => setMode("diagnostic")}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              mode === "diagnostic"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🛠️ Diagnosticar Fallo de Impresión
          </button>
          <button
            type="button"
            onClick={() => setMode("advisor")}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              mode === "advisor"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎯 Elegir Impresora 3D Ideal
          </button>
        </div>
      </div>

      {/* MODE 1: DIAGNOSTIC TROUBLESHOOTER */}
      {mode === "diagnostic" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              1. Selecciona el síntoma que presenta tu impresión:
            </p>
            {DIAGNOSTIC_ISSUES.map((issue, idx) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => setSelectedIssue(idx)}
                className={`w-full text-left rounded-2xl border p-4 transition cursor-pointer ${
                  selectedIssue === idx
                    ? "border-primary bg-sky-50/80 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p
                  className={`text-sm font-extrabold ${
                    selectedIssue === idx ? "text-primary-dark" : "text-slate-800"
                  }`}
                >
                  {issue.symptom}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-800">
                Diagnóstico Técnico Inmediato
              </span>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900">
                {activeIssue.symptom}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900">Causa raíz:</strong>{" "}
                {activeIssue.cause}
              </p>

              <div className="mt-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-primary-dark mb-2.5">
                  Pasos de corrección recomendados:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {activeIssue.fix.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-slate-200 grid gap-3 sm:grid-cols-2">
              <Link
                href={activeIssue.mainGuide.href}
                className="flex flex-col justify-between rounded-xl bg-primary p-4 text-white transition hover:bg-primary-dark shadow-xs"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">
                  ★ Guía Paso a Paso Recomendada
                </span>
                <span className="mt-1 text-xs sm:text-sm font-extrabold leading-snug">
                  {activeIssue.mainGuide.title} →
                </span>
              </Link>
              <Link
                href={activeIssue.extraGuide.href}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-slate-900 transition hover:border-primary hover:text-primary"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Lectura Complementaria
                </span>
                <span className="mt-1 text-xs sm:text-sm font-bold leading-snug">
                  {activeIssue.extraGuide.title} →
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: PRINTER & MATERIAL ADVISOR */
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              1. ¿Cuál es tu objetivo principal con la impresión 3D?
            </p>
            {ADVISOR_PROFILES.map((prof, idx) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => setSelectedProfile(idx)}
                className={`w-full text-left rounded-2xl border p-4 transition cursor-pointer ${
                  selectedProfile === idx
                    ? "border-primary bg-sky-50/80 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-[11px] font-extrabold uppercase text-primary">
                  {prof.badge}
                </span>
                <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                  {prof.title}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-primary-dark">
                  Tecnología: {activeProfile.tech}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                  Material: {activeProfile.material}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                {activeProfile.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {activeProfile.summary}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {activeProfile.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-extrabold">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                Guías y Comparativas Recomendadas para este Perfil:
              </p>
              <div className="space-y-2">
                {activeProfile.guides.map((g) => (
                  <Link
                    key={g.href}
                    href={g.href}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 hover:border-primary hover:text-primary transition"
                  >
                    <span>{g.title}</span>
                    <span className="text-primary font-extrabold">Ver →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
