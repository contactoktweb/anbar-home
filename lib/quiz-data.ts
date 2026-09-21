// ─────────────────────────────────────────────────────────────────────────────
// Encuesta Anbar Home – Comportamiento de compra de productos decorativos
// TFM · Universidad Internacional de Valencia (VIU)
// ─────────────────────────────────────────────────────────────────────────────

export const APP_VERSION = "2.0.0";
export const DRAFT_STORAGE_KEY = "anbarSurveyDraftV2";
export const RECORDS_STORAGE_KEY = "anbarSurveyRecordsV2";
export const SUBMISSION_ENDPOINT = "";
export const RECOMMENDATIONS_URL = "";

export interface Stage {
  number: number;
  title: string;
  description: string;
  quote: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  visualLabel?: string;
  theme?: string;
  image?: string;
}

export interface MatrixRow {
  id: string;
  label: string;
}

export type QuestionType =
  | 'single'
  | 'multi'
  | 'scale'
  | 'matrix'
  | 'demographics'
  | 'textarea'
  | 'likert'
  | 'matrix_scale';

export interface Question {
  id: string;
  number: string;
  stage: string;
  type: QuestionType;
  title: string;
  help?: string;
  required: boolean;
  max?: number;
  visual?: boolean;
  maxLength?: number;
  options?: QuestionOption[];
  rows?: MatrixRow[];
  /** Para preguntas tipo matrix_scale: etiquetas de los niveles 1-5 */
  scaleLabels?: [string, string, string, string, string];
}

// ProfileDefinition se mantiene por compatibilidad con quiz-container / result-view
export interface ProfileDefinition {
  name: string;
  description: string;
  motivations: string[];
  behavior: string;
  categories: string[];
  advisory: string;
  categorySlugs?: Record<string, string>;
}

export interface DemographicAnswer {
  city?: string;
  age?: string;
  gender?: string;
  income?: string;
}

export type QuizAnswers = Record<string, any>;

export interface QuizRecord {
  id: string;
  appVersion: string;
  completedAt: string;
  startedAt: string;
  route: 'B2B' | 'B2C';
  profileKey: string;
  profileName: string;
  profileScores: Record<string, number>;
  answers: QuizAnswers;
  answerLabels: Record<string, any>;
  contact?: {
    name?: string;
    email?: string;
    whatsapp?: string;
    city?: string;
    dataConsent?: boolean;
    marketingConsent?: boolean;
  } | null;
  contactUpdatedAt?: string;
}

// ─── Etapas ───────────────────────────────────────────────────────────────────

export const stages: Record<string, Stage> = {
  conocimiento: {
    number: 1,
    title: "Relación con Anbar Home",
    description: "Cuéntanos cómo conoces la marca y tus intenciones de compra.",
    quote: "Tu experiencia previa nos ayuda a entender mejor el mercado."
  },
  motivaciones: {
    number: 2,
    title: "Motivaciones y barreras",
    description: "Exploramos qué te impulsa a comprar y qué puede detenerte.",
    quote: "Cada decisión revela qué valoras al decorar tu espacio."
  },
  percepcion: {
    number: 3,
    title: "Percepción de la marca",
    description: "Tu opinión sobre los atributos y propuesta de Anbar Home.",
    quote: "Tu percepción ayuda a construir una marca más relevante."
  },
  productos: {
    number: 4,
    title: "Preferencias de producto",
    description: "¿Qué categorías y factores son más importantes para ti?",
    quote: "La diversidad de preferencias enriquece nuestra oferta."
  },
  canales: {
    number: 5,
    title: "Canales y comportamiento de compra",
    description: "Cómo buscas, compras y recibes asesoría en decoración.",
    quote: "La experiencia ideal combina inspiración, confianza y acompañamiento."
  },
  demografico: {
    number: 6,
    title: "Perfil demográfico",
    description: "Unos datos finales nos permitirán segmentar los resultados.",
    quote: "La diversidad de perspectivas hace más valiosa la investigación."
  }
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const option = (value: string, label: string, extra: Partial<QuestionOption> = {}): QuestionOption => ({
  value,
  label,
  ...extra
});

const LIKERT_5 = [
  option("1", "Totalmente en desacuerdo"),
  option("2", "En desacuerdo"),
  option("3", "Ni de acuerdo ni en desacuerdo"),
  option("4", "De acuerdo"),
  option("5", "Totalmente de acuerdo"),
];

// ─── Preguntas principales ────────────────────────────────────────────────────

export const mainQuestions: Question[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    id: "q1_relacion",
    number: "1",
    stage: "conocimiento",
    type: "single",
    title: "Antes de participar en esta encuesta, ¿qué relación tenías con Anbar Home?",
    help: "Selecciona una opción.",
    required: true,
    options: [
      option("no_conocia", "No conocía la marca."),
      option("escuchado", "Había escuchado hablar de la marca."),
      option("redes", "Seguía la marca en redes sociales."),
      option("web", "Había visitado su página web."),
      option("tienda", "Había visitado una de sus tiendas."),
      option("compra_unica", "Había comprado una vez."),
      option("recurrente", "Soy cliente recurrente."),
      option("proyecto", "He trabajado con Anbar Home en un proyecto profesional."),
    ]
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    id: "q2_probabilidad_compra",
    number: "2",
    stage: "conocimiento",
    type: "single",
    title: "¿Qué tan probable es que compres productos de decoración para tu hogar o espacio durante los próximos seis meses?",
    required: true,
    options: [
      option("nada_probable", "Nada probable."),
      option("poco_probable", "Poco probable."),
      option("neutral", "Ni probable ni improbable."),
      option("probable", "Probable."),
      option("muy_probable", "Muy probable."),
    ]
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    id: "q3_situaciones",
    number: "3",
    stage: "motivaciones",
    type: "multi",
    title: "¿Qué situaciones te llevan principalmente a interesarte por productos de decoración?",
    help: "Selecciona máximo tres.",
    required: true,
    max: 3,
    options: [
      option("renovar", "Renovar o actualizar un espacio."),
      option("pieza_especial", "Encontrar una pieza especial que me guste."),
      option("recibir_invitados", "Recibir invitados o preparar una reunión."),
      option("celebracion", "Celebrar una ocasión o temporada especial."),
      option("reemplazar", "Reemplazar un artículo decorativo."),
      option("tendencia", "Seguir una tendencia o inspiración que vi."),
      option("nueva_vivienda", "Decorar una nueva vivienda."),
      option("proyecto_profesional", "Mejorar un proyecto profesional o comercial."),
      option("regalo", "Comprar un regalo."),
    ]
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    id: "q4_barreras",
    number: "4",
    stage: "motivaciones",
    type: "multi",
    title: "¿Qué factores podrían hacerte aplazar o desistir de una compra de decoración?",
    help: "Selecciona máximo tres.",
    required: true,
    max: 3,
    options: [
      option("precio", "El precio."),
      option("combinar", "No saber si la pieza combina con mi espacio."),
      option("imaginar", "Dificultad para imaginar cómo se vería en mi hogar."),
      option("ver_fisico", "Necesidad de verla físicamente antes de comprar."),
      option("entrega", "Costos o tiempos de entrega."),
      option("dano", "Riesgo de que el producto llegue dañado."),
      option("informacion", "Falta de suficiente información sobre el producto."),
      option("demasiadas_opciones", "Encontrar demasiadas opciones y no saber cuál elegir."),
      option("no_prioridad", "Considerar que decorar no es una prioridad en ese momento."),
    ]
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    id: "q5_asesoria_prob",
    number: "5",
    stage: "motivaciones",
    type: "single",
    title: "Contar con asesoría personalizada de Anbar Home aumentaría mi probabilidad de compra.",
    help: "Selecciona tu nivel de acuerdo.",
    required: true,
    options: LIKERT_5,
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    id: "q6_interes_propuesta",
    number: "6",
    stage: "motivaciones",
    type: "single",
    title: "¿Qué tan interesado(a) estarías en recibir una propuesta personalizada para renovar o complementar un espacio?",
    required: true,
    options: [
      option("1", "Nada interesado(a)."),
      option("2", "Poco interesado(a)."),
      option("3", "Ni interesado(a) ni desinteresado(a)."),
      option("4", "Interesado(a)."),
      option("5", "Muy interesado(a)."),
    ]
  },

  // ── 7 ──────────────────────────────────────────────────────────────────────
  {
    id: "q7_espacios",
    number: "7",
    stage: "motivaciones",
    type: "multi",
    title: "¿Qué espacios te interesaría renovar o complementar?",
    help: "Selecciona máximo dos.",
    required: true,
    max: 2,
    options: [
      option("sala", "Sala."),
      option("comedor", "Comedor."),
      option("entrada", "Entrada o recibidor."),
      option("habitacion", "Habitación."),
      option("estudio", "Estudio u oficina."),
      option("cocina", "Cocina."),
      option("terraza", "Terraza."),
      option("espacio_comercial", "Espacio comercial."),
      option("ambiente_completo", "Un ambiente completo."),
    ]
  },

  // ── 8 ── Matrix Scale ───────────────────────────────────────────────────────
  {
    id: "q8_categorias",
    number: "8",
    stage: "productos",
    type: "matrix",
    title: "¿Qué tan probable es que adquieras las siguientes categorías de productos para decorar un espacio?",
    help: "Escala: 1 = Nada probable · 2 = Poco probable · 3 = Moderadamente probable · 4 = Muy probable · 5 = Totalmente probable.",
    required: true,
    rows: [
      { id: "jarrones", label: "Jarrones y ánforas" },
      { id: "esculturas", label: "Esculturas" },
      { id: "pared", label: "Decoración de pared (espejos, relojes, cuadros, estantes y repisas)" },
      { id: "iluminacion", label: "Iluminación (lámparas y candelabros)" },
      { id: "centros_mesa", label: "Centros de mesa (bandejas, objetos de mesa, servilleteros y libros decorativos)" },
      { id: "gran_formato", label: "Piezas de gran formato" },
      { id: "mesas_consolas", label: "Mesas de centro o consolas" },
      { id: "composiciones", label: "Composiciones completas para un ambiente" },
    ]
  },

  // ── 9 ──────────────────────────────────────────────────────────────────────
  {
    id: "q9_factores_eleccion",
    number: "9",
    stage: "productos",
    type: "multi",
    title: "¿Qué factores son más importantes para ti al elegir una pieza decorativa?",
    help: "Selecciona máximo tres.",
    required: true,
    max: 3,
    options: [
      option("diseno_diferente", "Diseño diferente."),
      option("exclusividad", "Exclusividad."),
      option("calidad", "Calidad de los materiales y durabilidad."),
      option("combinar", "Facilidad para combinarla con mi espacio."),
      option("experto", "Recomendación o asesoría de un experto."),
      option("precio_calidad", "Relación precio-calidad."),
      option("historia", "Historia o procedencia de la pieza."),
      option("ambiente", "Poder visualizarla dentro de un ambiente completo."),
      option("entrega", "Disponibilidad y facilidad de entrega."),
    ]
  },

  // ── 10 ─────────────────────────────────────────────────────────────────────
  {
    id: "q10_marca_ideal",
    number: "10",
    stage: "productos",
    type: "multi",
    title: "¿Qué tendría que ofrecer una marca de decoración para convertirse en una de tus primeras opciones durante todo el año?",
    help: "Selecciona máximo tres.",
    required: true,
    max: 3,
    options: [
      option("productos_exclusivos", "Productos exclusivos y diferentes."),
      option("nuevas_colecciones", "Nuevas colecciones durante todo el año."),
      option("alta_calidad", "Alta calidad y durabilidad."),
      option("precio_calidad", "Buena relación precio-calidad."),
      option("asesoria", "Asesoría personalizada."),
      option("propuestas_completas", "Propuestas completas para decorar espacios."),
      option("contenido", "Contenido e inspiración para decorar."),
      option("online", "Facilidad para comprar online."),
      option("entregas", "Entregas rápidas y confiables."),
      option("experiencia_tienda", "Experiencia diferencial en tienda o showroom."),
      option("beneficios_frecuentes", "Beneficios o ventajas para clientes frecuentes."),
    ]
  },

  // ── 11 ─────────────────────────────────────────────────────────────────────
  {
    id: "q11_inversion",
    number: "11",
    stage: "canales",
    type: "single",
    title: "En una compra de decoración no navideña, ¿cuánto invertirías normalmente?",
    required: true,
    options: [
      option("menos_150", "Menos de $150.000 COP."),
      option("150_399", "Entre $150.000 y $399.999 COP."),
      option("400_999", "Entre $400.000 y $999.999 COP."),
      option("1m_2499", "Entre $1.000.000 y $2.499.999 COP."),
      option("2500_mas", "$2.500.000 COP o más."),
      option("depende", "Depende del proyecto."),
    ]
  },

  // ── 12 ─────────────────────────────────────────────────────────────────────
  {
    id: "q12_momentos_compra",
    number: "12",
    stage: "canales",
    type: "multi",
    title: "¿En qué momentos acostumbras comprar productos de decoración?",
    help: "Selecciona todas las que correspondan.",
    required: true,
    options: [
      option("mudanza", "Cuando me mudo a una nueva vivienda."),
      option("renovacion", "Cuando renuevo o reorganizo un espacio."),
      option("invitados", "Cuando recibo invitados."),
      option("celebracion", "Antes de una celebración o fecha especial."),
      option("pieza_gusto", "Cuando veo una pieza que me gusta."),
      option("promociones", "Durante promociones o descuentos."),
      option("tendencia", "Cuando identifico una tendencia que quiero incorporar."),
      option("reemplazar", "Cuando necesito reemplazar un producto."),
      option("regalo", "Para regalos."),
      option("proyecto", "Por necesidades de un proyecto profesional."),
    ]
  },

  // ── 13 ─────────────────────────────────────────────────────────────────────
  {
    id: "q13_forma_compra",
    number: "13",
    stage: "canales",
    type: "single",
    title: "¿Cuál de las siguientes opciones describe mejor tu forma habitual de comprar productos de decoración?",
    help: "Selecciona una opción.",
    required: true,
    options: [
      option("planifica_compara", "Planifico la compra y comparo varias opciones antes de decidir."),
      option("idea_previa", "Tengo una idea de lo que necesito, pero decido al encontrar la pieza adecuada."),
      option("impulsivo", "Compro principalmente cuando algo llama mi atención."),
      option("recomendaciones", "Suelo dejarme orientar por recomendaciones de expertos."),
      option("conjuntos", "Prefiero comprar conjuntos o propuestas para un espacio completo."),
      option("promocion", "Compro principalmente cuando existe una promoción."),
      option("sin_patron", "No tengo un patrón definido."),
    ]
  },

  // ── 14 ─────────────────────────────────────────────────────────────────────
  {
    id: "q14_calidad_determinante",
    number: "14",
    stage: "percepcion",
    type: "single",
    title: "La calidad de los productos ofrecidos por Anbar Home es un factor determinante al momento de comprar.",
    help: "Selecciona tu nivel de acuerdo.",
    required: true,
    options: LIKERT_5,
  },

  // ── 15 ─────────────────────────────────────────────────────────────────────
  {
    id: "q15_actualizacion",
    number: "15",
    stage: "percepcion",
    type: "single",
    title: "Percibo que los productos ofrecidos por Anbar Home se mantienen actualizados con las necesidades del mercado.",
    help: "Selecciona tu nivel de acuerdo.",
    required: true,
    options: LIKERT_5,
  },

  // ── 16 ─────────────────────────────────────────────────────────────────────
  {
    id: "q16_precio_decision",
    number: "16",
    stage: "percepcion",
    type: "single",
    title: "El precio de los productos ofrecidos por Anbar Home influye directamente en la decisión de compra.",
    help: "Selecciona tu nivel de acuerdo.",
    required: true,
    options: LIKERT_5,
  },

  // ── 17 ─────────────────────────────────────────────────────────────────────
  {
    id: "q17_diseno_exclusividad",
    number: "17",
    stage: "percepcion",
    type: "single",
    title: "Los diseños ofrecidos por Anbar Home transmiten sofisticación, exclusividad y elegancia.",
    help: "Selecciona tu nivel de acuerdo.",
    required: true,
    options: LIKERT_5,
  },

  // ── 18 ─────────────────────────────────────────────────────────────────────
  {
    id: "q18_busqueda_info",
    number: "18",
    stage: "canales",
    type: "multi",
    title: "Antes de comprar una pieza decorativa, ¿dónde sueles buscar información o comparar alternativas?",
    help: "Selecciona máximo tres.",
    required: true,
    max: 3,
    options: [
      option("redes", "Redes sociales."),
      option("google", "Google."),
      option("web_marca", "Página web de la marca."),
      option("whatsapp", "WhatsApp con un asesor."),
      option("tienda", "Tienda física o showroom."),
      option("marketplace", "Marketplaces."),
      option("recomendaciones", "Opiniones o recomendaciones de otras personas."),
      option("interiorista", "Interiorista o decorador."),
      option("sin_comparar", "No suelo comparar antes de comprar."),
    ]
  },

  // ── 19 ── Matrix Scale ───────────────────────────────────────────────────────
  {
    id: "q19_modalidades_compra",
    number: "19",
    stage: "canales",
    type: "matrix",
    title: "¿Qué tan probable es que utilices las siguientes modalidades al realizar una compra importante de decoración?",
    help: "Escala: 1 = Nada probable · 2 = Poco probable · 3 = Moderadamente probable · 4 = Muy probable · 5 = Totalmente probable.",
    required: true,
    rows: [
      { id: "tienda_fisica", label: "Compra directa en tienda física / showroom." },
      { id: "pagina_web", label: "Compra directa en página web." },
      { id: "whatsapp", label: "Compra por WhatsApp con asesoría personalizada." },
      { id: "online_tienda", label: "Modalidad mixta: consultar online y comprar en tienda." },
      { id: "tienda_online", label: "Modalidad mixta: ver en tienda y comprar online." },
      { id: "decorador", label: "Asesoría con un decorador o diseñador de interiores." },
      { id: "propuesta_integral", label: "Propuesta integral de diseño para mi espacio." },
    ]
  },

  // ── 20 ─────────────────────────────────────────────────────────────────────
  {
    id: "q20_canal_asesoria",
    number: "20",
    stage: "canales",
    type: "single",
    title: "¿Por qué canal preferirías recibir asesoría o información personalizada sobre productos de decoración?",
    help: "Selecciona una opción.",
    required: true,
    options: [
      option("whatsapp", "WhatsApp."),
      option("instagram", "Instagram."),
      option("email", "Correo electrónico."),
      option("llamada", "Llamada telefónica."),
      option("videollamada", "Videollamada."),
      option("presencial", "Presencialmente en tienda / showroom."),
      option("sin_asesoria", "No me interesa recibir asesoría personalizada."),
    ]
  },

  // ── 21 ─────────────────────────────────────────────────────────────────────
  {
    id: "q21_ingresos",
    number: "21",
    stage: "demografico",
    type: "single",
    title: "¿En cuál de los siguientes rangos se encuentran aproximadamente los ingresos mensuales de tu hogar?",
    required: true,
    options: [
      option("menos_3m", "Menos de $3.000.000 COP."),
      option("3m_5999", "Entre $3.000.000 y $5.999.999 COP."),
      option("6m_9999", "Entre $6.000.000 y $9.999.999 COP."),
      option("10m_14999", "Entre $10.000.000 y $14.999.999 COP."),
      option("15m_24999", "Entre $15.000.000 y $24.999.999 COP."),
      option("25m_mas", "$25.000.000 COP o más."),
      option("no_responder", "Prefiero no responder."),
    ]
  },

  // ── 22 ─────────────────────────────────────────────────────────────────────
  {
    id: "q22_ciudad",
    number: "22",
    stage: "demografico",
    type: "single",
    title: "¿Dónde resides actualmente?",
    help: "Selecciona una opción.",
    required: true,
    options: [
      option("bogota", "Bogotá D.C."),
      option("bucaramanga", "Bucaramanga."),
      option("area_metro_bga", "Área Metropolitana de Bucaramanga."),
      option("otra_ciudad", "Otra ciudad de Colombia."),
    ]
  },

  // ── 23 ─────────────────────────────────────────────────────────────────────
  {
    id: "q23_edad",
    number: "23",
    stage: "demografico",
    type: "single",
    title: "¿Cuál es tu rango de edad?",
    required: true,
    options: [
      option("18_24", "18–24 años."),
      option("25_34", "25–34 años."),
      option("35_44", "35–44 años."),
      option("45_54", "45–54 años."),
      option("55_64", "55–64 años."),
      option("65_mas", "65 años o más."),
    ]
  },

  // ── 24 ─────────────────────────────────────────────────────────────────────
  {
    id: "q24_genero",
    number: "24",
    stage: "demografico",
    type: "single",
    title: "¿Con cuál género te identificas?",
    help: "Selecciona una opción.",
    required: true,
    options: [
      option("mujer", "Mujer."),
      option("hombre", "Hombre."),
      option("otra", "Otra identidad."),
      option("no_responder", "Prefiero no responder."),
    ]
  },
];

// Sin preguntas B2B en esta encuesta académica
export const b2bQuestions: Question[] = [];

// ─── Perfil único para esta encuesta (participación académica) ─────────────────

export const professionalTypes = new Set<string>([]);

export const profileDefinitions: Record<string, ProfileDefinition> = {
  participante: {
    name: "Participante de la Encuesta",
    description: "Gracias por completar la encuesta del TFM sobre comportamiento de compra en Anbar Home.",
    motivations: [],
    behavior: "",
    categories: [],
    advisory: "Tus respuestas contribuyen a la investigación académica sobre el mercado de decoración en Colombia.",
  }
};

export const CATEGORY_LINKS: Record<string, string> = {};

// ─── Funciones de cálculo (simplificadas para encuesta académica) ─────────────

export function calculateProfile(_answers: QuizAnswers): { key: string; scores: Record<string, number> } {
  return {
    key: "participante",
    scores: { participante: 100 }
  };
}

export function profileTiePriority(_style?: string): string[] {
  return ["participante"];
}

export function getQuestionById(id: string): Question | undefined {
  return [...mainQuestions, ...b2bQuestions].find(q => q.id === id);
}

export function getOptionLabel(questionId: string, value: string): string {
  const question = getQuestionById(questionId);
  return question?.options?.find(item => String(item.value) === String(value))?.label || "";
}

export function deriveMotivations(_answers: QuizAnswers, _profile: ProfileDefinition): string[] {
  return [];
}

export function deriveSpaces(_answers: QuizAnswers): string[] {
  return [];
}

export function buildAnswerLabels(answers: QuizAnswers): Record<string, any> {
  const labels: Record<string, any> = {};
  const questions = [...mainQuestions, ...b2bQuestions];
  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer === undefined) return;
    if (["single", "scale"].includes(question.type)) {
      labels[question.id] = getOptionLabel(question.id, answer) || answer;
    } else if (question.type === "multi") {
      labels[question.id] = (answer || []).map((val: string) => getOptionLabel(question.id, val) || val);
    } else if (question.type === "matrix") {
      labels[question.id] = {};
      question.rows?.forEach(row => {
        if (answer && answer[row.id] !== undefined) {
          labels[question.id][row.label] = answer[row.id];
        }
      });
    } else {
      labels[question.id] = answer;
    }
  });
  return labels;
}
