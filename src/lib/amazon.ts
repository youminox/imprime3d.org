export const AMAZON_TAG_US = "imprime3d-20";
export const AMAZON_TAG_ES = "imprime3d0c-21";

export type AmazonStoreRegion = "ES" | "US";

export interface AmazonProductRecommendation {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  features: string[];
  rating: string;
  reviewsCount: string;
  categoryType:
    | "printer_fdm"
    | "printer_resin"
    | "filament"
    | "nozzle"
    | "bed_adhesion"
    | "maintenance";
  /** Direct ASIN on Amazon.com if fixed product */
  asinUS?: string;
  /** Direct ASIN on Amazon.es if fixed product */
  asinES?: string;
  /** Search query fallback or primary dynamic search on Amazon.com */
  queryUS: string;
  /** Search query fallback or primary dynamic search on Amazon.es */
  queryES: string;
  ctaLabel: string;
}

/**
 * Generates an official Amazon Affiliate link with automatic geolocation store support:
 * - Spain & Europe (ES): amazon.es with tag=imprime3d0c-21
 * - USA & Latin America (US): amazon.com with tag=imprime3d-20
 */
export function buildAmazonUrl(
  product: AmazonProductRecommendation,
  region: AmazonStoreRegion
): string {
  if (region === "ES") {
    if (product.asinES) {
      return `https://www.amazon.es/dp/${product.asinES}?tag=${AMAZON_TAG_ES}`;
    }
    const q = encodeURIComponent(product.queryES);
    return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG_ES}`;
  }

  if (product.asinUS) {
    return `https://www.amazon.com/dp/${product.asinUS}?tag=${AMAZON_TAG_US}`;
  }
  const q = encodeURIComponent(product.queryUS);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG_US}`;
}

/**
 * Detects whether the user is browsing from Spain/Europe or Americas
 * based on browser timezone and language locale.
 */
export function detectUserAmazonRegion(): AmazonStoreRegion {
  if (typeof window === "undefined") {
    return "ES";
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language || "").toLowerCase();

    if (
      tz === "Europe/Madrid" ||
      tz === "Atlantic/Canary" ||
      tz === "Europe/Ceuta" ||
      lang === "es-es" ||
      tz.startsWith("Europe/")
    ) {
      return "ES";
    }

    return "US";
  } catch {
    return "ES";
  }
}

// ============================================================================
// CURATED 3D PRINTING HARDWARE, FILAMENTS & TOOLS CATALOG
// ============================================================================

export const CATALOG = {
  CREALITY_K1C: {
    id: "creality-k1c",
    badge: "🏆 #1 Impresora 3D FDM Alta Velocidad",
    title: "Creality K1C — Impresora 3D CoreXY Cerrada (600 mm/s + Cámara IA)",
    subtitle:
      "Impresora FDM cerrada de alta velocidad lista para PLA, PETG, ABS, ASA, TPU y filamentos con fibra de carbono sin warping.",
    features: [
      "Velocidad de hasta 600 mm/s con aceleración de 20.000 mm/s² y autonivelado 100% automático",
      "Extrusor Direct Drive metálico anti-atascos con boquilla trimetálica Unicorn hasta 300 °C",
      "Cámara cerrada térmica con filtro de carbón activo y cámara IA que detecta fallos en vivo",
    ],
    rating: "4.7",
    reviewsCount: "+2.400",
    categoryType: "printer_fdm",
    queryUS: "Creality K1C 3D Printer 600mm/s CoreXY",
    queryES: "Creality K1C impresora 3D alta velocidad",
    ctaLabel: "Ver oferta en Amazon",
  } satisfies AmazonProductRecommendation,

  ENDER_3_V3: {
    id: "ender-3-v3",
    badge: "⭐ Mejor Calidad/Precio para Empezar",
    title: "Creality Ender-3 V3 SE / KE — Impresora 3D FDM con Autonivelado CR-Touch",
    subtitle:
      "La impresora 3D más recomendada para principiantes, cosplay, maquetas y proyectos en casa: se monta en 15 minutos y nivela sola.",
    features: [
      "Autonivelado automático CR-Touch + Sensor de Z-Offset sin usar hoja de papel",
      "Extrusor directo Sprite compatible con PLA, PETG y TPU flexible de 1.75 mm",
      "Doble eje Z sincronizado y placa flexible magnética PEI para despegar piezas fácilmente",
    ],
    rating: "4.6",
    reviewsCount: "+6.800",
    categoryType: "printer_fdm",
    queryUS: "Creality Ender 3 V3 SE KE 3D Printer Auto Leveling",
    queryES: "Creality Ender 3 V3 SE KE impresora 3D autonivelado",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  FLASHFORGE_5M: {
    id: "flashforge-adventurer-5m",
    badge: "⚡ CoreXY Ultrarrápida Plug & Play",
    title: "FLASHFORGE Adventurer 5M / 5M Pro — Impresora 3D CoreXY 600 mm/s",
    subtitle:
      "Estructura CoreXY de precisión industrial con cambio de boquilla en 3 segundos sin herramientas y primera capa perfecta.",
    features: [
      "Nivelación automática de cama en 1 clic sin ajustes manuales",
      "Boquilla de cambio rápido (0.25 / 0.4 / 0.6 / 0.8 mm) que alcanza 200 °C en 35 segundos",
      "Placa PEI de doble cara y compensación activa de vibraciones contra el ghosting",
    ],
    rating: "4.7",
    reviewsCount: "+1.950",
    categoryType: "printer_fdm",
    queryUS: "FLASHFORGE Adventurer 5M CoreXY 3D Printer",
    queryES: "FLASHFORGE Adventurer 5M impresora 3D",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  ANYCUBIC_KOBRA_2_NEO: {
    id: "anycubic-kobra-2-neo",
    badge: "💸 Mejor Impresora 3D Económica",
    title: "Anycubic Kobra 2 Neo / Kobra 3 — Impresora 3D FDM Rápida con LeviQ 2.0",
    subtitle:
      "Ideal para iniciarse en impresión 3D con bajo presupuesto sin renunciar a extrusor directo ni autonivelado de 25 puntos.",
    features: [
      "Velocidad de impresión de hasta 250–300 mm/s con extrusor directo integrado",
      "Sistema de autonivelado inteligente LeviQ 2.0 con ajuste automático de Z-Offset",
      "Superficie magnética de acero PEI resistente y reanudación tras corte de luz",
    ],
    rating: "4.6",
    reviewsCount: "+3.200",
    categoryType: "printer_fdm",
    queryUS: "Anycubic Kobra 2 Neo 3D Printer Auto Leveling",
    queryES: "Anycubic Kobra 2 Neo impresora 3D",
    ctaLabel: "Ver oferta en Amazon",
  } satisfies AmazonProductRecommendation,

  ELEGOO_MARS_4_MSLA: {
    id: "elegoo-mars-4-msla",
    badge: "💎 #1 en Resina para Joyería y Miniaturas",
    title: "ELEGOO Mars 4 / Mars 5 Ultra — Impresora 3D de Resina MSLA 9K Ultra Precisa",
    subtitle:
      "Resolución microscópica de 18 micras ideal para bisutería, joyería, figuras de colección, odontología y miniaturas sin líneas de capa.",
    features: [
      "Pantalla monocromática 9K con fuente de luz COB + lente Fresnel de uniformidad >92%",
      "Plataforma grabada con láser para máxima adherencia de la primera capa en resina",
      "Incluye purificador de aire con carbón activo para imprimir en casa con mínimo olor",
    ],
    rating: "4.7",
    reviewsCount: "+4.100",
    categoryType: "printer_resin",
    queryUS: "ELEGOO Mars 4 MSLA 9K Resin 3D Printer",
    queryES: "ELEGOO Mars 4 impresora 3D resina 9K",
    ctaLabel: "Ver oferta en Amazon",
  } satisfies AmazonProductRecommendation,

  ANYCUBIC_PHOTON_M5S_PRO: {
    id: "anycubic-photon-mono-m5s-pro",
    badge: "🔬 Resina 14K de Gran Formato sin Nivelar",
    title: "Anycubic Photon Mono M5s Pro — Impresora 3D Resina 14K con Calefactor",
    subtitle:
      "La impresora de resina profesional sin nivelación manual: incorpora calentador de resina para climas fríos y detección IA.",
    features: [
      "Pantalla 10.1 pulgadas 14K de altísima definición para moldes, figuras y piezas dentales",
      "Calentador y purificador de aire integrados para evitar fallos de resina por baja temperatura",
      "Velocidad de hasta 105 mm/h con película ACF de tercera generación",
    ],
    rating: "4.6",
    reviewsCount: "+1.450",
    categoryType: "printer_resin",
    queryUS: "Anycubic Photon Mono M5s Pro 14K Resin 3D Printer",
    queryES: "Anycubic Photon Mono M5s Pro impresora 3D resina",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  WASH_AND_CURE_STATION: {
    id: "wash-and-cure-station",
    badge: "🧪 Imprescindible para Resina SLA",
    title: "Estación 2 en 1 de Lavado y Curado UV 360° (Elegoo Mercury / Anycubic Wash & Cure)",
    subtitle:
      "Limpia el exceso de resina líquida y cura tus piezas en 360° con luz UV de 405 nm sin ensuciarte las manos ni dejar zonas blandas.",
    features: [
      "Cubeta hermética de lavado por vórtice magnético compatible con IPA o agua",
      "Plataforma giratoria 360° con matriz de LEDs UV 405 nm para curado uniforme",
      "Tapa con bloqueo anti-UV del 99.9% y temporizador digital de 1 a 30 minutos",
    ],
    rating: "4.8",
    reviewsCount: "+7.300",
    categoryType: "printer_resin",
    queryUS: "3D Printer Wash and Cure Station 2 in 1 Elegoo Anycubic",
    queryES: "estacion lavado y curado resina 3D Wash and Cure",
    ctaLabel: "Ver estación 2 en 1 en Amazon",
  } satisfies AmazonProductRecommendation,

  RESIN_WATER_WASHABLE: {
    id: "resin-water-washable",
    badge: "💧 Resina UV Sin Alcohol (Bajo Olor)",
    title: "Resina UV 405nm Lavable con Agua 1000g — Alta Precisión y Bajo Olor",
    subtitle:
      "Olvídate del alcohol isopropílico: limpia tus impresiones de resina directamente bajo el grifo de agua con acabado liso y duro.",
    features: [
      "Baja contracción volumétrica y curado rápido para impresoras LCD/MSLA 4K, 8K, 9K y 14K",
      "Fórmula de bajo olor ideal para talleres domésticos, figuras, bisutería y prototipos",
      "Disponible en gris cerámico, blanco, negro, transparente y tonos joyero",
    ],
    rating: "4.7",
    reviewsCount: "+14.200",
    categoryType: "printer_resin",
    queryUS: "Water Washable 3D Printer Resin 405nm 1000g",
    queryES: "resina impresora 3D lavable con agua 405nm 1kg",
    ctaLabel: "Ver colores de resina en Amazon",
  } satisfies AmazonProductRecommendation,

  FILAMENT_PLA_PLUS_PACK: {
    id: "filament-pla-plus-pack",
    badge: "🧵 #1 Más Vendido en Filamento 1.75 mm",
    title: "Filamento PLA+ / Hyper PLA 1.75 mm (Bobina 1 kg ±0.02 mm Sin Enredos)",
    subtitle:
      "Hasta 10 veces más resistente que el PLA normal: bobinado automático perfecto sin nudos, sin burbujas y cero atascos.",
    features: [
      "Tolerancia dimensional estricta de ±0.02 mm para capas uniformes sin subextrusión",
      "Excelente adherencia entre capas y mínimo warping (imprime a 200–215 °C / cama 55–60 °C)",
      "100% compatible con Creality, Bambu Lab (AMS), Anycubic, Prusa, Elegoo y Flashforge",
    ],
    rating: "4.7",
    reviewsCount: "+28.500",
    categoryType: "filament",
    queryUS: "PLA Plus 3D Printer Filament 1.75mm 1kg neatly wound",
    queryES: "filamento PLA+ 1.75mm 1kg impresora 3D",
    ctaLabel: "Ver bobinas PLA+ en Amazon",
  } satisfies AmazonProductRecommendation,

  FILAMENT_PETG_PRO: {
    id: "filament-petg-pro",
    badge: "🛡️ Alta Resistencia Mecánica y Térmica",
    title: "Filamento PETG Profesional 1.75 mm (1 kg) — Piezas Funcionales y Exteriores",
    subtitle:
      "Combina la facilidad del PLA con la dureza del ABS: resistente al agua, golpes, productos químicos y calor hasta 75 °C.",
    features: [
      "Ideal para soportes mecánicos, macetas de jardinería, organizadores, moldes y repuestos",
      "Sin olor durante la impresión y baja contracción térmica (no requiere cámara cerrada)",
      "Sellado al vacío con bolsa desecante para garantizar 0% de humedad al abrir",
    ],
    rating: "4.7",
    reviewsCount: "+12.900",
    categoryType: "filament",
    queryUS: "PETG 3D Printer Filament 1.75mm 1kg Tough",
    queryES: "filamento PETG 1.75mm 1kg impresora 3D",
    ctaLabel: "Ver filamento PETG en Amazon",
  } satisfies AmazonProductRecommendation,

  FILAMENT_TPU_FLEXIBLE: {
    id: "filament-tpu-flexible",
    badge: "🤸 Especial Material Flexible (Shore 95A)",
    title: "Filamento TPU Flexible 95A 1.75 mm — Alta Elasticidad y Resistencia a Abrasión",
    subtitle:
      "Elastómero flexible de dureza Shore 95A formulado para fluir sin atascos en extrusores Direct Drive y Bowden cortos.",
    features: [
      "Perfecto para fundas, juntas herméticas, ruedas de robótica, amortiguadores y calzado",
      "Recuperación elástica superior sin agrietarse ni deslaminarse entre capas",
      "Bobinado libre de tensión con diámetro estable de 1.75 mm ±0.03 mm",
    ],
    rating: "4.6",
    reviewsCount: "+8.400",
    categoryType: "filament",
    queryUS: "TPU Flexible Filament 1.75mm 95A 3D Printer",
    queryES: "filamento TPU flexible 95A 1.75mm impresora 3D",
    ctaLabel: "Ver filamento TPU en Amazon",
  } satisfies AmazonProductRecommendation,

  FILAMENT_DRYER_BOX: {
    id: "filament-dryer-box",
    badge: "🔥 Adiós a la Humedad y los Hilos (Stringing)",
    title: "Secador Digital de Filamento 3D con Calefacción PTC 360° e Higrómetro",
    subtitle:
      "Elimina la humedad absorbida por tus bobinas de PLA, PETG, TPU, ABS y Nylon mientras imprimes directamente desde la caja.",
    features: [
      "Pantalla táctil con perfiles de temperatura (45–70 °C) y sensor de humedad relativa en vivo",
      "Elimina burbujas, chasquidos en la boquilla, hilos (stringing) y capas quebradizas",
      "Rodamientos internos para alimentar el filamento directamente a la impresora mientras seca",
    ],
    rating: "4.8",
    reviewsCount: "+9.700",
    categoryType: "filament",
    queryUS: "3D Printer Filament Dryer Box with Fan Digital Hygrometer",
    queryES: "secador de filamento 3D caja secadora Sunlu Creality",
    ctaLabel: "Ver secador de filamento en Amazon",
  } satisfies AmazonProductRecommendation,

  VACUUM_BAGS_FILAMENT: {
    id: "vacuum-bags-filament",
    badge: "🔒 Conservación Hermética de Bobinas",
    title: "Kit de 10 Bolsas de Almacenamiento al Vacío para Filamento 3D + Bomba USB y Sílice",
    subtitle:
      "Protege tus bobinas abiertas del polvo y la humedad ambiental durante meses sin que pierdan adherencia ni flexibilidad.",
    features: [
      "Incluye 10 bolsas reutilizables de doble cierre, bomba de vacío, pinzas e indicadores de humedad",
      "Incluye sobres de gel de sílice desecante recargables para mantener <15% de humedad",
      "Tamaño universal compatible con todas las bobinas de 0.5 kg y 1 kg",
    ],
    rating: "4.7",
    reviewsCount: "+6.100",
    categoryType: "filament",
    queryUS: "3D Printer Filament Vacuum Storage Bags Kit with Electric Pump",
    queryES: "bolsas vacio filamento 3D con bomba y silice",
    ctaLabel: "Ver kit de bolsas al vacío en Amazon",
  } satisfies AmazonProductRecommendation,

  PEI_MAGNETIC_BED: {
    id: "pei-magnetic-bed",
    badge: "🧲 #1 Contra el Warping y Primera Capa",
    title: "Placa Magnética Flexible de Acero PEI Texturizado / Liso Doble Cara",
    subtitle:
      "La mejora definitiva para tu cama caliente: las piezas se agarran con fuerza al imprimir y se sueltan solas al enfriarse.",
    features: [
      "Recubrimiento original de polvo PEI resistente hasta 260 °C (PLA, PETG, ABS, TPU y ASA)",
      "Doble cara (texturizada rugosa dorada + lisa) con base magnética adhesiva 3M",
      "Basta con doblar ligeramente la lámina de acero flexible para que la pieza salte sin usar espátula",
    ],
    rating: "4.8",
    reviewsCount: "+15.400",
    categoryType: "bed_adhesion",
    queryUS: "Textured PEI Sheet Magnetic Flexible Build Plate 3D Printer",
    queryES: "cama magnetica flexible PEI texturizada impresora 3D",
    ctaLabel: "Ver placa magnética PEI en Amazon",
  } satisfies AmazonProductRecommendation,

  ADHESIVE_3DLAC_MAGIGOO: {
    id: "adhesive-3dlac",
    badge: "🛡️ Cero Esquinas Levantadas (Anti-Warping)",
    title: "Spray / Stick Adhesivo Térmico Especial Impresión 3D (3DLAC / Magigoo)",
    subtitle:
      "Fórmula termoactiva profesional: fija la primera capa a más de 50 °C y libera la pieza automáticamente cuando la cama baja de 30 °C.",
    features: [
      "Previene al 100% el efecto warping en piezas grandes, moldes, arquitectura y ABS/PETG",
      "Una sola aplicación dura decenas de impresiones y se limpia fácilmente con agua",
      "Compatible con camas de cristal borosilicato, aluminio, carborundum y placas PEI",
    ],
    rating: "4.7",
    reviewsCount: "+11.800",
    categoryType: "bed_adhesion",
    queryUS: "3D Printer Bed Adhesive Glue Spray Stick Anti Warping",
    queryES: "3DLAC spray adhesivo cama impresora 3D anti warping",
    ctaLabel: "Ver adhesivo anti-warping en Amazon",
  } satisfies AmazonProductRecommendation,

  THERMAL_ENCLOSURE: {
    id: "thermal-enclosure",
    badge: "🏠 Cámara Térmica Ignífuga Antirruido",
    title: "Cerramiento Térmico Ignífugo (Enclosure) con Iluminación LED para Impresora 3D",
    subtitle:
      "Bloquea las corrientes de aire frío, mantiene temperatura estable para ABS/ASA, reduce el ruido un 60% y aísla del polvo.",
    features: [
      "Interior de fibra de vidrio recubierta de aluminio ignífugo que conserva el calor de la cama",
      "Elimina grietas entre capas (delaminación) y warping en habitaciones frías o sin ventilación",
      "Ventana panorámica transparente, tira LED integrada y puerto para tubo de extracción",
    ],
    rating: "4.7",
    reviewsCount: "+5.200",
    categoryType: "bed_adhesion",
    queryUS: "3D Printer Enclosure Fireproof Tent Constant Temperature",
    queryES: "cerramiento termico impresora 3D caja ignifuga enclosure",
    ctaLabel: "Ver cerramiento térmico en Amazon",
  } satisfies AmazonProductRecommendation,

  NOZZLE_HARDENED_KIT: {
    id: "nozzle-hardened-kit",
    badge: "⚙️ Kit Completo de Boquillas + Limpieza",
    title: "Kit de 24 Boquillas de Acero Endurecido y Latón (0.2 / 0.4 / 0.6 / 0.8 mm) + Agujas",
    subtitle:
      "Incluye boquillas de alta conductividad en latón y acero endurecido para filamentos abrasivos, llaves de cambio y agujas desatascadoras.",
    features: [
      "Pared interior pulida con rugosidad Ra < 0.4 que evita atascos y mejora el flujo de extrusión",
      "Incluye 10 agujas de acero inoxidable flexible, pinzas curvas y llave de vaso para cambio seguro",
      "Diámetros de 0.2 mm (máximo detalle) hasta 0.8 mm (impresión rápida de moldes y cajas)",
    ],
    rating: "4.7",
    reviewsCount: "+13.600",
    categoryType: "nozzle",
    queryUS: "3D Printer Nozzles Kit Hardened Steel Brass 0.4mm Cleaning Needles",
    queryES: "kit boquillas impresora 3D acero endurecido laton 0.4mm agujas limpieza",
    ctaLabel: "Ver kit de boquillas en Amazon",
  } satisfies AmazonProductRecommendation,

  DUAL_GEAR_EXTRUDER: {
    id: "dual-gear-extruder",
    badge: "🔩 Tracción Firme Sin Patinar",
    title: "Extrusor Metálico de Doble Engranaje (Dual Gear / Direct Drive Upgrade) + Tubo Capricorn",
    subtitle:
      "Soluciona de raíz el problema del extrusor que no empuja el filamento o hace clic al iniciar impresiones largas.",
    features: [
      "Doble rueda dentada de acero endurecido que tracciona el filamento por ambos lados sin morderlo",
      "Incluye tubo PTFE Capricorn original resistente hasta 260 °C de baja fricción",
      "Fuerza de empuje regulable por resorte: ideal para PLA, PETG, ABS y TPU flexible",
    ],
    rating: "4.7",
    reviewsCount: "+8.900",
    categoryType: "nozzle",
    queryUS: "Dual Gear Metal Extruder Upgrade Kit Capricorn PTFE Tube 3D Printer",
    queryES: "extrusor doble engranaje metalico impresora 3D tubo Capricorn",
    ctaLabel: "Ver extrusor Dual Gear en Amazon",
  } satisfies AmazonProductRecommendation,

  CLEANING_FILAMENT_PTFE: {
    id: "cleaning-filament-ptfe",
    badge: "🧹 Desatasco Interno de Hotend",
    title: "Filamento Limpiador de Boquillas 1.75 mm + Cortador de Tubo PTFE y Agujas",
    subtitle:
      "Purga restos carbonizados de PLA, PETG o ABS dentro del hotend al cambiar de material o después de impresiones largas.",
    features: [
      "Rango térmico amplio (160–280 °C) que arrastra residuos quemados sin desmontar el extrusor",
      "Perfecto para realizar la técnica Cold Pull (tirón en frío) en menos de 3 minutos",
      "Previene atascos parciales y contaminación de color al pasar de tonos oscuros a claros",
    ],
    rating: "4.6",
    reviewsCount: "+4.700",
    categoryType: "nozzle",
    queryUS: "3D Printer Cleaning Filament 1.75mm Nozzle Cleaner Purge",
    queryES: "filamento limpieza boquillas impresora 3D 1.75mm",
    ctaLabel: "Ver filamento limpiador en Amazon",
  } satisfies AmazonProductRecommendation,

  AUTO_LEVEL_CR_TOUCH: {
    id: "auto-level-cr-touch",
    badge: "🎯 Nivelación Micrométrica Automática",
    title: "Sensor Oficial de Autonivelado CR-Touch / BLTouch con Soportes Metálicos",
    subtitle:
      "Mide la inclinación de tu cama caliente en múltiples puntos con precisión de 0.005 mm y compensa automáticamente el eje Z.",
    features: [
      "Sonda óptica y metálica de larga duración (+100.000 ciclos de palpado sin desgaste)",
      "Incluye 3 soportes de montaje metálicos, cables de conexión a placa base y tornillería",
      "Garantiza una primera capa uniforme en toda la superficie incluso en camas ligeramente curvas",
    ],
    rating: "4.7",
    reviewsCount: "+10.300",
    categoryType: "maintenance",
    queryUS: "Creality CR Touch Auto Bed Leveling Sensor Kit BLTouch",
    queryES: "sensor autonivelado CR Touch BLTouch impresora 3D",
    ctaLabel: "Ver sensor de autonivelado en Amazon",
  } satisfies AmazonProductRecommendation,

  SILICONE_BED_MOUNTS_CALIPER: {
    id: "silicone-bed-mounts-caliper",
    badge: "📏 Calibración Exacta de Ejes y Cama",
    title: "Calibre Digital Pie de Rey Acero Inox (0.01 mm) + Columnas de Silicona Térmica para Cama",
    subtitle:
      "Mide con exactitud tus cubos de calibración XYZ, verifica el diámetro de filamento y estabiliza la cama caliente sin que se desnivele.",
    features: [
      "Pie de rey digital en acero inoxidable con pantalla LCD grande (precisión ±0.01 mm)",
      "Las columnas sólidas de silicona reemplazan los muelles débiles y mantienen la nivelación meses",
      "Imprescindible para ajustar flujo (Flow), pasos por milímetro (E-Steps) y tolerancias en Cura",
    ],
    rating: "4.8",
    reviewsCount: "+16.200",
    categoryType: "maintenance",
    queryUS: "Digital Caliper Stainless Steel 3D Printing + Silicone Bed Leveling Mounts",
    queryES: "calibre digital pie de rey acero inoxidable impresion 3D",
    ctaLabel: "Ver calibre digital en Amazon",
  } satisfies AmazonProductRecommendation,

  PTFE_LUBRICANT_GREASE: {
    id: "ptfe-lubricant-grease",
    badge: "🧴 Lubricación Silenciosa de Ejes y Husillos",
    title: "Grasa Sintética con PTFE (Teflón) para Guías Lineales, Rodamientos y Husillo Eje Z",
    subtitle:
      "Elimina chirridos, vibraciones y desgaste prematuro en motores, varillas roscadas y rieles lineales de impresoras 3D.",
    features: [
      "Fórmula con micropartículas de PTFE que no atrae polvo ni daña plásticos ni correas",
      "Reduce la fricción mecánica y evita pérdida de pasos en los motores X, Y y Z",
      "Incluye boquilla aplicadora de precisión para lubricar rodamientos LM8UU y husillos T8",
    ],
    rating: "4.8",
    reviewsCount: "+9.100",
    categoryType: "maintenance",
    queryUS: "Super Lube Synthetic Grease with PTFE 3D Printer Z Axis Linear Rails",
    queryES: "grasa PTFE teflon lubricante guias lineales husillo impresora 3D",
    ctaLabel: "Ver lubricante PTFE en Amazon",
  } satisfies AmazonProductRecommendation,

  GT2_BELTS_TENSIONER_KIT: {
    id: "gt2-belts-tensioner-kit",
    badge: "🔧 Repuesto de Correas y Tensores X/Y",
    title: "Kit de Correas Dentadas GT2 Reforzadas con Fibra de Vidrio (6 mm) + Tensores y Poleas",
    subtitle:
      "Elimina las capas desplazadas (Layer Shifting), holguras y ondas en las paredes (Ringing/Ghosting) de tus impresiones.",
    features: [
      "Correa de neopreno con núcleo de fibra de vidrio anti-estiramiento (paso 2 mm, ancho 6 mm)",
      "Incluye poleas dentadas de aluminio de 20 dientes, tensores de torsión y abrazaderas",
      "Compatible con el 95% de las impresoras 3D FDM de escritorio y formato grande",
    ],
    rating: "4.7",
    reviewsCount: "+5.800",
    categoryType: "maintenance",
    queryUS: "GT2 Timing Belt 6mm Fiberglass Pulley Tensioner Kit 3D Printer",
    queryES: "correa dentada GT2 6mm poleas tensor impresora 3D",
    ctaLabel: "Ver kit de correas GT2 en Amazon",
  } satisfies AmazonProductRecommendation,

  POST_PROCESSING_TOOLKIT: {
    id: "post-processing-toolkit",
    badge: "🧰 Kit Maker de Acabado y Limpieza 3D",
    title: "Kit Profesional de Herramientas de Impresión 3D (42 Piezas: Desbarbador, Alicates, Espátulas)",
    subtitle:
      "Todo lo que necesitas para retirar soportes limpiamente, alisar bordes de cosplay y figuras, y mantener tu impresora impecable.",
    features: [
      "Desbarbador giratorio metálico con 10 cuchillas para eliminar el borde Brim/pie de elefante",
      "Alicates de corte al ras, espátulas redondeadas anti-rayaduras, limas de diamante y pinzas",
      "Incluye cepillos de latón/nylon para limpiar el bloque calefactor y agujas de 0.4 mm",
    ],
    rating: "4.7",
    reviewsCount: "+11.400",
    categoryType: "maintenance",
    queryUS: "3D Printer Tool Kit Deburring Tool Flush Cutters Spatula Cleaning",
    queryES: "kit herramientas impresion 3D desbarbador espatula alicates limpieza",
    ctaLabel: "Ver maletín de herramientas en Amazon",
  } satisfies AmazonProductRecommendation,
};

// ============================================================================
// CONTEXTUAL 3D PRINTING PRODUCT MATCHER (COVERS 100% OF THE 521 PAGES)
// ============================================================================

export function getContextualAmazonProducts(
  slug: string,
  category: string,
  title: string
): {
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
} {
  const text = `${slug} ${category} ${title}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 1. Specific Printer Model Reviews (/resenas/ or model mentions)
  if (text.includes("photon-mono-m5s") || text.includes("m5s-pro")) {
    return {
      sectionTitle: "Oferta Oficial: Anycubic Photon Mono M5s Pro y Accesorios Resina",
      sectionSubtitle:
        "Consigue la Anycubic Photon Mono M5s Pro 14K junto con su estación de lavado/curado y resina UV de alta precisión:",
      products: [
        CATALOG.ANYCUBIC_PHOTON_M5S_PRO,
        CATALOG.WASH_AND_CURE_STATION,
        CATALOG.RESIN_WATER_WASHABLE,
      ],
    };
  }

  if (text.includes("photon-mono-2") || text.includes("photon-mono")) {
    return {
      sectionTitle: "Impresora de Resina Anycubic Photon Mono y Kit de Curado UV",
      sectionSubtitle:
        "Equipamiento completo para imprimir figuras, miniaturas y joyería con detalle microscópico:",
      products: [
        CATALOG.ANYCUBIC_PHOTON_M5S_PRO,
        CATALOG.RESIN_WATER_WASHABLE,
        CATALOG.WASH_AND_CURE_STATION,
      ],
    };
  }

  if (text.includes("elegoo-mars") || text.includes("mars-4")) {
    return {
      sectionTitle: "Oferta Oficial: ELEGOO Mars MSLA y Resina Lavable con Agua",
      sectionSubtitle:
        "La impresora de resina número 1 en ventas junto con los consumibles esenciales para piezas perfectas:",
      products: [
        CATALOG.ELEGOO_MARS_4_MSLA,
        CATALOG.WASH_AND_CURE_STATION,
        CATALOG.RESIN_WATER_WASHABLE,
      ],
    };
  }

  if (text.includes("flashforge") || text.includes("adventurer-5m")) {
    return {
      sectionTitle: "Oferta Oficial: FLASHFORGE Adventurer 5M CoreXY y Filamento Alta Velocidad",
      sectionSubtitle:
        "Aprovecha los 600 mm/s de la Adventurer 5M con filamento Hyper PLA+ y kit de acabado profesional:",
      products: [
        CATALOG.FLASHFORGE_5M,
        CATALOG.FILAMENT_PLA_PLUS_PACK,
        CATALOG.POST_PROCESSING_TOOLKIT,
      ],
    };
  }

  if (text.includes("creality-k1c") || text.includes("k1c")) {
    return {
      sectionTitle: "Oferta Oficial: Creality K1C CoreXY Cerrada y Consumibles",
      sectionSubtitle:
        "La impresora 3D cerrada de 600 mm/s más completa de Creality con cámara IA y extrusor hasta 300 °C:",
      products: [
        CATALOG.CREALITY_K1C,
        CATALOG.FILAMENT_PLA_PLUS_PACK,
        CATALOG.FILAMENT_DRYER_BOX,
      ],
    };
  }

  if (text.includes("kobra-2") || text.includes("anycubic-kobra")) {
    return {
      sectionTitle: "Oferta Oficial: Anycubic Kobra 2 Neo y Filamento PLA+ Antienredos",
      sectionSubtitle:
        "Excelente relación calidad/precio con autonivelado LeviQ 2.0 y extrusor directo:",
      products: [
        CATALOG.ANYCUBIC_KOBRA_2_NEO,
        CATALOG.FILAMENT_PLA_PLUS_PACK,
        CATALOG.PEI_MAGNETIC_BED,
      ],
    };
  }

  // 2. Warping, Primera Capa que se Despega & Adherencia en la Cama
  if (
    text.includes("warping") ||
    text.includes("despegue") ||
    text.includes("despega") ||
    text.includes("primera-capa") ||
    text.includes("primera capa") ||
    text.includes("adherencia") ||
    text.includes("cama-caliente") ||
    text.includes("cama de impresion")
  ) {
    return {
      sectionTitle: "Solución Definitiva contra el Warping y Despegue de Primera Capa",
      sectionSubtitle:
        "Los 3 productos más eficaces para lograr una adherencia perfecta en PLA, PETG, ABS y ASA sin esquinas levantadas:",
      products: [
        CATALOG.PEI_MAGNETIC_BED,
        CATALOG.ADHESIVE_3DLAC_MAGIGOO,
        CATALOG.THERMAL_ENCLOSURE,
      ],
    };
  }

  // 3. Boquillas (Nozzles), Extrusor que no empuja, Atascos y Flujo
  if (
    text.includes("boquilla") ||
    text.includes("nozzle") ||
    text.includes("extrusor") ||
    text.includes("extruye") ||
    text.includes("atasco") ||
    text.includes("flujo") ||
    text.includes("doble-engranaje")
  ) {
    return {
      sectionTitle: "Recambios Oficiales de Boquillas (Nozzles) y Extrusor Anti-Atascos",
      sectionSubtitle:
        "Elimina la subextrusión y los atascos con boquillas de acero/latón pulidas, extrusor Dual Gear y filamento limpiador:",
      products: [
        CATALOG.NOZZLE_HARDENED_KIT,
        CATALOG.DUAL_GEAR_EXTRUDER,
        CATALOG.CLEANING_FILAMENT_PTFE,
      ],
    };
  }

  // 4. Humedad en Filamentos, Secado, Almacenamiento y Ahorro de Filamento
  if (
    text.includes("humedad") ||
    text.includes("secar") ||
    text.includes("almacenar") ||
    text.includes("conservar") ||
    text.includes("burbujas") ||
    text.includes("reciclar-filamento") ||
    text.includes("ahorrar-filamento")
  ) {
    return {
      sectionTitle: "Protección Anti-Humedad y Secado Profesional de Filamentos 3D",
      sectionSubtitle:
        "Recupera tus bobinas húmedas y elimina los hilos (stringing) y chasquidos con calefacción 360° y sellado al vacío:",
      products: [
        CATALOG.FILAMENT_DRYER_BOX,
        CATALOG.VACUUM_BAGS_FILAMENT,
        CATALOG.FILAMENT_PLA_PLUS_PACK,
      ],
    };
  }

  // 5. Resina SLA / MSLA, Bisutería, Joyería, Figuras, Miniaturas y Odontología
  if (
    text.includes("resina") ||
    text.includes("sla") ||
    text.includes("msla") ||
    text.includes("bisuteria") ||
    text.includes("joyeria") ||
    text.includes("figuras") ||
    text.includes("odontologia") ||
    text.includes("medica")
  ) {
    return {
      sectionTitle: "Equipamiento Recomendado para Alta Precisión, Bisutería y Figuras 3D",
      sectionSubtitle:
        "Impresoras y consumibles con resolución microscópica para acabados lisos de calidad comercial:",
      products: [
        CATALOG.ELEGOO_MARS_4_MSLA,
        CATALOG.WASH_AND_CURE_STATION,
        CATALOG.RESIN_WATER_WASHABLE,
      ],
    };
  }

  // 6. Filamentos Flexibles TPU y Combinación de Materiales
  if (
    text.includes("flexible") ||
    text.includes("tpu") ||
    text.includes("multicolor") ||
    text.includes("combinar-filamentos")
  ) {
    return {
      sectionTitle: "Materiales Especiales: Filamento TPU Flexible y Extrusión Directa",
      sectionSubtitle:
        "Imprime piezas elásticas, juntas y accesorios resistentes al impacto sin atascos en el extrusor:",
      products: [
        CATALOG.FILAMENT_TPU_FLEXIBLE,
        CATALOG.DUAL_GEAR_EXTRUDER,
        CATALOG.FILAMENT_DRYER_BOX,
      ],
    };
  }

  // 7. Sensores de Autonivelado, Calibración de Altura de Capa y Slicer Cura
  if (
    text.includes("autonivelado") ||
    text.includes("sensor") ||
    text.includes("nivelar") ||
    text.includes("calibrar") ||
    text.includes("altura-de-capa") ||
    text.includes("cura") ||
    text.includes("slicer") ||
    category === "tutoriales-2" ||
    category === "trucos"
  ) {
    return {
      sectionTitle: "Herramientas de Calibración, Autonivelado y Precisión en Slicer",
      sectionSubtitle:
        "Logra tolerancias exactas de 0.01 mm y una primera capa automática sin esfuerzo manual:",
      products: [
        CATALOG.AUTO_LEVEL_CR_TOUCH,
        CATALOG.SILICONE_BED_MOUNTS_CALIPER,
        CATALOG.FILAMENT_PLA_PLUS_PACK,
      ],
    };
  }

  // 8. Mantenimiento, Lubricación de Guías Lineales, Ejes, Correas y Motores
  if (
    category === "mantenimiento" ||
    category === "problemas-y-soluciones" ||
    text.includes("lubricacion") ||
    text.includes("guias-lineales") ||
    text.includes("correas") ||
    text.includes("motor") ||
    text.includes("ruido") ||
    text.includes("limpiar") ||
    text.includes("mantenimiento")
  ) {
    return {
      sectionTitle: "Kit de Mantenimiento Preventivo, Lubricación PTFE y Repuestos 3D",
      sectionSubtitle:
        "Alarga la vida útil de tu impresora 3D, elimina ruidos en los ejes X/Y/Z y evita fallos en impresiones largas:",
      products: [
        CATALOG.PTFE_LUBRICANT_GREASE,
        CATALOG.GT2_BELTS_TENSIONER_KIT,
        CATALOG.POST_PROCESSING_TOOLKIT,
      ],
    };
  }

  // 9. Diseños 3D, Cosplay, Maquetas, Moldes, Hogar, Jardinería y Emprendimiento
  if (
    category === "disenos" ||
    category === "aplicacion" ||
    text.includes("cosplay") ||
    text.includes("maquetas") ||
    text.includes("moldes") ||
    text.includes("arquitectura") ||
    text.includes("emprender") ||
    text.includes("vender") ||
    text.includes("jardineria") ||
    text.includes("hogar")
  ) {
    return {
      sectionTitle: "Impresoras 3D y Filamentos Recomendados para tus Proyectos y Diseños",
      sectionSubtitle:
        "Alta velocidad, fiabilidad continua y acabados profesionales para cosplay, maquetas, moldes y venta online:",
      products: [
        CATALOG.CREALITY_K1C,
        CATALOG.FILAMENT_PETG_PRO,
        CATALOG.POST_PROCESSING_TOOLKIT,
      ],
    };
  }

  // 10. Default / Guías de Compra, Principios Básicos & Home
  return {
    sectionTitle: "Las Impresoras 3D y Filamentos Más Vendidos y Recomendados en Amazon",
    sectionSubtitle:
      "Selección verificada por su fiabilidad, autonivelado automático y excelente relación calidad/precio:",
    products: [
      CATALOG.CREALITY_K1C,
      CATALOG.ENDER_3_V3,
      CATALOG.FILAMENT_PLA_PLUS_PACK,
    ],
  };
}
