export const APP_VERSION = "1.0.0";
export const DRAFT_STORAGE_KEY = "anbarQuizDraftV1";
export const RECORDS_STORAGE_KEY = "anbarQuizRecordsV1";
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

export type QuestionType = 'single' | 'multi' | 'scale' | 'matrix' | 'demographics' | 'textarea';

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
}

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

export const stages: Record<string, Stage> = {
  context: {
    number: 1,
    title: "Contexto del participante",
    description: "Empecemos por entender qué te inspira a pensar en decoración hoy.",
    quote: "Tu intención inicial nos ayuda a recomendar una experiencia más relevante."
  },
  identity: {
    number: 2,
    title: "Identidad y estilo decorativo",
    description: "Explora los ambientes, emociones y piezas que más conectan contigo.",
    quote: "El estilo no es una regla: es la forma en que un espacio expresa quién eres."
  },
  behavior: {
    number: 3,
    title: "Comportamiento de compra",
    description: "Cuéntanos cómo decides, cuánto inviertes y qué puede frenar una elección.",
    quote: "Cada decisión revela qué valoras cuando una pieza entra a tu espacio."
  },
  channels: {
    number: 4,
    title: "Canales y experiencia de compra",
    description: "Queremos entender cómo descubres, evalúas y prefieres comprar decoración.",
    quote: "La experiencia ideal combina inspiración, confianza y acompañamiento."
  },
  perception: {
    number: 5,
    title: "Percepción de Anbar Home",
    description: "Comparte la imagen que tienes hoy de la marca y de su propuesta para todo el año.",
    quote: "Tu percepción ayuda a construir una marca más relevante y cercana."
  },
  demographic: {
    number: 6,
    title: "Perfil demográfico",
    description: "Unos últimos datos nos permitirán segmentar los resultados de forma útil.",
    quote: "La diversidad de perspectivas hace más valiosa la investigación."
  },
  b2b: {
    number: 7,
    title: "Ruta adicional B2B",
    description: "Profundicemos en las necesidades de tus proyectos profesionales.",
    quote: "Para un proyecto, la estética debe ir acompañada de disponibilidad y eficiencia."
  }
};

const option = (value: string, label: string, extra: Partial<QuestionOption> = {}): QuestionOption => ({
  value,
  label,
  ...extra
});


export const mainQuestions: Question[] = [
      {
        id: "q1_intent",
        number: "1",
        stage: "context",
        type: "single",
        title: "¿Qué te trae hoy a pensar en decoración?",
        help: "Elige la opción que mejor representa tu intención actual.",
        required: true,
        options: [
          option("renovar_hogar", "Quiero renovar un espacio de mi hogar."),
          option("pieza_especial", "Estoy buscando una pieza especial."),
          option("proyecto_cliente", "Necesito decorar un proyecto para un cliente."),
          option("ambientar_negocio", "Quiero ambientar un negocio, oficina o espacio comercial."),
          option("regalo", "Estoy buscando un regalo."),
          option("inspiracion", "Solo estoy explorando e inspirándome.")
        ]
      },
      {
        id: "q2_spaces",
        number: "2",
        stage: "context",
        type: "multi",
        title: "¿Qué espacio te gustaría transformar?",
        help: "Selecciona hasta dos opciones.",
        required: true,
        max: 2,
        visual: true,
        options: [
          option("sala", "Sala", { visualLabel: "Imagen sala", theme: "space", image: '/quiz/sala.jpg' }),
          option("comedor", "Comedor", { visualLabel: "Imagen comedor", theme: "space", image: '/quiz/comedor.jpg' }),
          option("entrada", "Entrada o recibidor", { visualLabel: "Imagen entrada", theme: "space", image: '/quiz/entrada.jpg' }),
          option("habitacion", "Habitación", { visualLabel: "Imagen habitación", theme: "space", image: '/quiz/habitacion.jpg' }),
          option("estudio", "Estudio u oficina", { visualLabel: "Imagen estudio u oficina", theme: "space", image: '/quiz/estudio.jpg' }),
          option("cocina", "Cocina", { visualLabel: "Imagen cocina", theme: "space", image: '/quiz/cocina.jpg' }),
          option("terraza", "Terraza", { visualLabel: "Imagen terraza", theme: "space", image: '/quiz/terraza.jpg' }),
          option("espacio_comercial", "Espacio comercial", { visualLabel: "Imagen espacio comercial", theme: "space", image: '/quiz/espacio_comercial.jpg' }),
          option("ambiente_completo", "Todo un ambiente", { visualLabel: "Imagen ambiente completo", theme: "space", image: '/quiz/ambiente_completo.jpg' })
        ]
      },
      {
        id: "q3_timing",
        number: "3",
        stage: "context",
        type: "single",
        title: "¿Cuándo te gustaría hacer este cambio?",
        help: "Elige el horizonte que más se acerca a tu momento actual.",
        required: true,
        options: [
          option("ahora", "En este momento."),
          option("proximo_mes", "Durante el próximo mes."),
          option("tres_meses", "En los próximos tres meses."),
          option("seis_meses", "En los próximos seis meses."),
          option("sin_fecha", "Todavía no tengo una fecha."),
          option("solo_inspiracion", "Solo estoy buscando inspiración.")
        ]
      },
      {
        id: "q4_style",
        number: "4",
        stage: "identity",
        type: "single",
        title: "Elige el ambiente que más se parece a ti.",
        help: "No busques la opción perfecta: elige la que te produzca una conexión más inmediata.",
        required: true,
        visual: true,
        options: [
          option("contemporaneo", "Sofisticación contemporánea", { description: "Líneas limpias, tonos neutros y detalles refinados.", visualLabel: "Imagen estilo contemporáneo", theme: "contemporary", image: '/quiz/contemporaneo.jpg' }),
          option("clasico", "Elegancia clásica", { description: "Piezas atemporales, formas tradicionales y acabados de lujo.", visualLabel: "Imagen elegancia clásica", theme: "classic", image: '/quiz/clasico.jpg' }),
          option("organico", "Calidez orgánica", { description: "Texturas naturales, colores tierra y ambientes acogedores.", visualLabel: "Imagen calidez orgánica", theme: "organic", image: '/quiz/organico.jpg' }),
          option("artistico", "Expresión artística", { description: "Contrastes, esculturas y piezas protagonistas.", visualLabel: "Imagen expresión artística", theme: "artistic", image: '/quiz/artistico.jpg' })
        ]
      },
      {
        id: "q5_feelings",
        number: "5",
        stage: "identity",
        type: "multi",
        title: "¿Qué te gustaría sentir al entrar a ese espacio?",
        help: "Selecciona hasta dos sensaciones.",
        required: true,
        max: 2,
        options: [
          option("tranquilidad", "Tranquilidad"),
          option("sofisticacion", "Sofisticación"),
          option("calidez", "Calidez"),
          option("admiracion", "Admiración"),
          option("inspiracion", "Inspiración"),
          option("orden", "Orden y armonía"),
          option("orgullo_invitados", "Orgullo al recibir invitados"),
          option("personal_autentica", "Una sensación más personal y auténtica")
        ]
      },
      {
        id: "q6_category",
        number: "6",
        stage: "identity",
        type: "single",
        title: "¿Qué tipo de pieza suele llamar primero tu atención?",
        help: "Elige la categoría que normalmente captura tu mirada.",
        required: true,
        visual: true,
        options: [
          option("jarrones", "Jarrones y ánforas", { visualLabel: "Imagen jarrones y ánforas", theme: "category", image: '/quiz/jarrones.jpg' }),
          option("esculturas", "Esculturas", { visualLabel: "Imagen esculturas", theme: "category", image: '/quiz/esculturas.jpg' }),
          option("espejos_relojes", "Espejos y relojes", { visualLabel: "Imagen espejos y relojes", theme: "category", image: '/quiz/espejos_relojes.jpg' }),
          option("candelabros_mesa", "Candelabros y objetos de mesa", { visualLabel: "Imagen objetos de mesa", theme: "category", image: '/quiz/candelabros_mesa.jpg' }),
          option("bandejas_accesorios", "Bandejas y accesorios decorativos", { visualLabel: "Imagen accesorios decorativos", theme: "category", image: '/quiz/bandejas_accesorios.jpg' }),
          option("mesas_consolas", "Mesas de centro o consolas", { visualLabel: "Imagen mesas y consolas", theme: "category", image: '/quiz/mesas_consolas.jpg' }),
          option("composiciones", "Composiciones completas para un ambiente", { visualLabel: "Imagen composición completa", theme: "category", image: '/quiz/composiciones.jpg' }),
          option("orientacion", "No tengo una categoría favorita; necesito orientación", { visualLabel: "Imagen asesoría decorativa", theme: "category", image: '/quiz/orientacion.jpg' })
        ]
      },
      {
        id: "q7_attributes",
        number: "7",
        stage: "identity",
        type: "multi",
        title: "Cuando eliges una pieza decorativa, ¿qué es lo más importante para ti?",
        help: "Selecciona máximo tres opciones.",
        required: true,
        max: 3,
        options: [
          option("diseno_diferente", "Que tenga un diseño diferente."),
          option("exclusiva", "Que se sienta exclusiva."),
          option("calidad", "La calidad y durabilidad."),
          option("combine", "Que combine fácilmente con mi espacio."),
          option("experto", "La recomendación de un experto."),
          option("precio_calidad", "La relación entre precio y calidad."),
          option("historia_material", "La historia, material o procedencia de la pieza."),
          option("ambiente_completo", "Que pueda verla dentro de un ambiente completo."),
          option("entrega", "La disponibilidad y facilidad de entrega.")
        ]
      },
      {
        id: "q8_frequency",
        number: "8",
        stage: "behavior",
        type: "single",
        title: "¿Con qué frecuencia compras objetos para renovar o complementar tus espacios?",
        help: "Piensa en un año habitual, no solo en temporadas especiales.",
        required: true,
        options: [
          option("mensual", "Una vez al mes o con mayor frecuencia."),
          option("bimestral", "Cada dos o tres meses."),
          option("varias_ano", "Dos o tres veces al año."),
          option("temporadas", "Solamente para temporadas o celebraciones."),
          option("pieza_especial", "Cuando encuentro una pieza realmente especial."),
          option("casi_nunca", "Casi nunca compro decoración.")
        ]
      },
      {
        id: "q9_budget",
        number: "9",
        stage: "behavior",
        type: "single",
        title: "En una compra de decoración no navideña, ¿cuánto invertirías normalmente?",
        help: "Considera una compra individual o una pequeña renovación.",
        required: true,
        options: [
          option("menos_150", "Menos de $150.000 COP."),
          option("150_399", "Entre $150.000 y $399.999 COP."),
          option("400_999", "Entre $400.000 y $999.999 COP."),
          option("1m_2499", "Entre $1.000.000 y $2.499.999 COP."),
          option("2500_mas", "$2.500.000 COP o más."),
          option("depende_proyecto", "Depende del proyecto y de las piezas seleccionadas.")
        ]
      },
      {
        id: "q10_motivations",
        number: "10",
        stage: "behavior",
        type: "multi",
        title: "¿Qué suele motivarte a renovar un espacio?",
        help: "Selecciona hasta dos opciones.",
        required: true,
        max: 2,
        options: [
          option("personalidad", "Sentir que mi casa refleja mejor mi personalidad."),
          option("sin_remodelar", "Actualizar el espacio sin hacer una remodelación."),
          option("recibir_celebrar", "Recibir invitados o celebrar una ocasión."),
          option("reemplazar", "Reemplazar piezas antiguas."),
          option("tendencia", "Seguir una tendencia que me inspira."),
          option("incompleto", "Mejorar un espacio que se siente incompleto."),
          option("valor_negocio", "Aumentar el valor percibido de un negocio o proyecto."),
          option("pieza_enamora", "Encontrar una pieza que me enamora.")
        ]
      },
      {
        id: "q11_barrier",
        number: "11",
        stage: "behavior",
        type: "single",
        title: "¿Qué suele detenerte antes de comprar una pieza decorativa?",
        help: "Selecciona la principal barrera.",
        required: true,
        options: [
          option("combinar", "No estoy seguro de que combine con mi espacio."),
          option("imaginar", "Me cuesta imaginar cómo se verá en mi hogar."),
          option("precio", "El precio."),
          option("ver_fisico", "Prefiero verla físicamente antes de comprar."),
          option("dano", "Me preocupa que llegue dañada."),
          option("informacion", "No encuentro las medidas o información que necesito."),
          option("demasiadas_opciones", "Tengo demasiadas opciones y no sé cuál elegir."),
          option("no_prioritaria", "No considero que sea una compra prioritaria."),
          option("ninguna", "Normalmente nada me detiene cuando encuentro la pieza correcta.")
        ]
      },
      {
        id: "q12_discovery",
        number: "12",
        stage: "channels",
        type: "multi",
        title: "¿Dónde buscas inspiración o descubres nuevas piezas para tu hogar?",
        help: "Selecciona hasta tres opciones.",
        required: true,
        max: 3,
        options: [
          option("instagram", "Instagram"),
          option("pinterest", "Pinterest"),
          option("tiktok", "TikTok"),
          option("web_marcas", "Página web de las marcas"),
          option("tiendas", "Tiendas físicas o showrooms"),
          option("amigos", "Recomendaciones de amigos"),
          option("profesionales", "Interioristas, arquitectos o decoradores"),
          option("marketplaces", "Marketplaces"),
          option("revistas", "Revistas o medios de diseño"),
          option("eventos", "Eventos y exhibiciones")
        ]
      },
      {
        id: "q13_purchase_channel",
        number: "13",
        stage: "channels",
        type: "single",
        title: "¿Cómo preferirías realizar una compra importante de decoración?",
        help: "Elige la experiencia que te daría mayor confianza.",
        required: true,
        options: [
          option("tienda", "Directamente en una tienda física."),
          option("web", "En la página web."),
          option("whatsapp", "Por WhatsApp con ayuda de un asesor."),
          option("online_tienda", "Primero online y después en una tienda."),
          option("tienda_online", "Primero en una tienda y después online."),
          option("profesional", "A través de un interiorista o decorador."),
          option("propuesta", "Mediante una propuesta completa para mi espacio.")
        ]
      },
      {
        id: "q14_help",
        number: "14",
        stage: "channels",
        type: "single",
        title: "¿Qué tipo de ayuda te haría sentir más seguro al comprar?",
        help: "Elige la alternativa que más reduciría tus dudas.",
        required: true,
        options: [
          option("foto_recomendaciones", "Enviar una foto de mi espacio y recibir recomendaciones."),
          option("whatsapp", "Una asesoría rápida por WhatsApp."),
          option("showroom", "Una cita personalizada en el showroom."),
          option("videollamada", "Una asesoría virtual por videollamada."),
          option("seleccion_presupuesto", "Recibir una selección completa según mi presupuesto."),
          option("simulaciones", "Ver fotografías o simulaciones del producto dentro de un ambiente."),
          option("sin_asesoria", "Prefiero elegir sin asesoría.")
        ]
      },
      {
        id: "q15_advisory_interest",
        number: "15",
        stage: "channels",
        type: "scale",
        title: "¿Qué tan interesado estarías en recibir una propuesta personalizada para renovar un espacio?",
        help: "Marca una opción de 1 a 5.",
        required: true,
        options: [
          option("1", "Nada interesado"),
          option("2", "Poco interesado"),
          option("3", "Neutral"),
          option("4", "Interesado"),
          option("5", "Muy interesado")
        ]
      },
      {
        id: "q16_relationship",
        number: "16",
        stage: "perception",
        type: "single",
        title: "Antes de comenzar esta experiencia, ¿qué relación tenías con Anbar Home?",
        help: "Selecciona la opción que mejor describe tu experiencia previa.",
        required: true,
        options: [
          option("no_conocia", "No conocía la marca."),
          option("nombre", "Había escuchado el nombre."),
          option("redes", "Sigo la marca en redes sociales."),
          option("tienda", "He visitado una de sus tiendas."),
          option("web", "He visitado la página web."),
          option("compra_unica", "He comprado una vez."),
          option("recurrente", "Soy cliente recurrente."),
          option("proyecto", "He trabajado con Anbar Home en un proyecto profesional.")
        ]
      },
      {
        id: "q17_association",
        number: "17",
        stage: "perception",
        type: "single",
        title: "Cuando piensas en Anbar Home, ¿qué es lo primero que viene a tu mente?",
        help: "Elige la asociación más inmediata, aunque todavía no conozcas bien la marca.",
        required: true,
        options: [
          option("navidad", "Decoración navideña."),
          option("todo_ano", "Decoración premium para todo el año."),
          option("exclusivas", "Piezas exclusivas."),
          option("ambientes", "Ambientes completos."),
          option("jarrones_esculturas", "Jarrones y esculturas."),
          option("asesoria", "Asesoría decorativa."),
          option("articulos_hogar", "Una tienda de artículos para el hogar."),
          option("sin_percepcion", "Todavía no tengo una percepción clara.")
        ]
      },
      {
        id: "q18_brand_matrix",
        number: "18",
        stage: "perception",
        type: "matrix",
        title: "Indica cuánto estás de acuerdo con cada afirmación.",
        help: "Escala: 1 = totalmente en desacuerdo; 5 = totalmente de acuerdo.",
        required: true,
        rows: [
          { id: "christmas", label: "Anbar Home es principalmente una marca de decoración navideña." },
          { id: "year_round", label: "Anbar Home ofrece piezas atractivas para decorar durante todo el año." },
          { id: "exclusive", label: "Los productos de Anbar Home se sienten exclusivos y diferentes." },
          { id: "web_trust", label: "Confiaría en comprar una pieza de decoración de alto valor en su página web." },
          { id: "advisory_purchase", label: "La asesoría personalizada aumentaría mi intención de compra." },
          { id: "complete_rooms", label: "Me gustaría ver más ambientes completos y menos productos individuales." },
          { id: "renew_without_remodel", label: "Consideraría Anbar Home para renovar un espacio sin realizar una remodelación." }
        ]
      },
      {
        id: "q19_profile_type",
        number: "19",
        stage: "demographic",
        type: "single",
        title: "¿Cuál de estas opciones te describe mejor?",
        help: "Esta respuesta nos permitirá mostrar una ruta adicional cuando participas como profesional.",
        required: true,
        options: [
          option("home_consumer", "Compro decoración para mi hogar."),
          option("gift_consumer", "Compro decoración para regalar."),
          option("interiorista", "Soy interiorista."),
          option("decorador", "Soy decorador."),
          option("arquitecto", "Soy arquitecto."),
          option("construccion", "Trabajo en construcción o desarrollo inmobiliario."),
          option("administrador_comercial", "Administro un hotel, restaurante, oficina o espacio comercial."),
          option("eventos", "Trabajo en eventos."),
          option("otro", "Otro.")
        ]
      },
      {
        id: "q20_demographics",
        number: "20",
        stage: "demographic",
        type: "demographics",
        title: "Cuéntanos un poco sobre ti.",
        help: "La información se utilizará únicamente para segmentar los resultados.",
        required: true
      },
      {
        id: "q21_open",
        number: "21",
        stage: "demographic",
        type: "textarea",
        title: "¿Qué tendría que ofrecer una marca de decoración para convertirse en tu primera opción durante todo el año?",
        help: "Pregunta abierta opcional. Puedes compartir una idea, servicio o experiencia que consideres decisiva.",
        required: false,
        maxLength: 1200
      }
    ];

export const b2bQuestions: Question[] = [
      {
        id: "b2b1_projects",
        number: "B2B 1",
        stage: "b2b",
        type: "multi",
        title: "¿Para qué tipo de proyectos compras decoración?",
        help: "Selecciona todas las opciones que correspondan.",
        required: true,
        options: [
          option("viviendas", "Viviendas"),
          option("inmobiliarios", "Proyectos inmobiliarios"),
          option("restaurantes", "Restaurantes"),
          option("hoteles", "Hoteles"),
          option("oficinas", "Oficinas"),
          option("locales", "Locales comerciales"),
          option("eventos", "Eventos"),
          option("styling", "Proyectos de puesta en escena o styling"),
          option("varios", "Varios de los anteriores")
        ]
      },
      {
        id: "b2b2_purchase",
        number: "B2B 2",
        stage: "b2b",
        type: "single",
        title: "¿Cómo prefieres comprar para tus proyectos?",
        help: "Elige la modalidad que mejor representa tu forma de trabajo.",
        required: true,
        options: [
          option("piezas", "Piezas individuales."),
          option("ambiente", "Selecciones por ambiente."),
          option("paquetes", "Paquetes completos."),
          option("recurrentes", "Compras recurrentes."),
          option("mayor", "Compras al por mayor."),
          option("exclusivos", "Productos exclusivos para cada proyecto.")
        ]
      },
      {
        id: "b2b3_benefits",
        number: "B2B 3",
        stage: "b2b",
        type: "multi",
        title: "¿Qué beneficio tendría mayor valor para ti?",
        help: "Selecciona hasta dos opciones.",
        required: true,
        max: 2,
        options: [
          option("tarifas", "Tarifas profesionales."),
          option("inventario", "Catálogo con inventario actualizado."),
          option("asesoria", "Asesoría para cada proyecto."),
          option("logistica", "Entregas y logística especializada."),
          option("whatsapp", "Atención prioritaria por WhatsApp."),
          option("cotizaciones", "Facturación y cotizaciones rápidas."),
          option("anticipado", "Acceso anticipado a nuevas colecciones."),
          option("exclusivas", "Piezas exclusivas o difíciles de encontrar.")
        ]
      }
    ];

export const professionalTypes = new Set<string>([
  "arquitecto_disenador",
  "inmobiliario_remodelador",
  "hotelero_restaurante",
  "empresa_corporativo"
]);

export const profileDefinitions: Record<string, ProfileDefinition> = {
      statement: {
        name: "El Curador de Piezas Statement",
        description: "Te atraen los objetos con carácter, diseño artístico y alto impacto visual. Buscas piezas capaces de transformar la conversación de un ambiente y expresar una mirada personal.",
        motivations: ["Impacto visual", "Exclusividad", "Expresión personal"],
        behavior: "Prefieres elegir menos piezas, pero con una presencia clara, una forma memorable o un lenguaje artístico propio.",
        categories: ["Esculturas", "Jarrones premium", "Espejos", "Piezas de gran formato"],
        advisory: "Explora una curaduría de piezas protagonistas y recibe orientación para equilibrar escala, contraste y ubicación dentro de tu ambiente."
      },
      sophistication: {
        name: "El Amante de la Sofisticación Atemporal",
        description: "Prefieres ambientes elegantes, equilibrados y construidos con piezas duraderas. Valoras los acabados refinados y una estética capaz de mantenerse vigente más allá de las tendencias.",
        motivations: ["Calidad y durabilidad", "Armonía", "Elegancia"],
        behavior: "Buscas coherencia visual, materiales que se sientan premium y objetos que complementen el espacio sin perder protagonismo.",
        categories: ["Jarrones", "Candelabros", "Espejos", "Consolas", "Composiciones neutras"],
        advisory: "Una selección por paleta, material y proporción puede ayudarte a construir un ambiente sofisticado y coherente para todo el año."
      },
      host: {
        name: "El Anfitrión de los Detalles",
        description: "Ves el hogar como un espacio para compartir y crear momentos especiales. Te importan los detalles que hacen sentir bienvenidos a tus invitados y elevan cada ocasión.",
        motivations: ["Recibir y celebrar", "Calidez", "Detalles memorables"],
        behavior: "Tu atención suele ir a la mesa, el comedor y los acentos que aportan una atmósfera acogedora y cuidada.",
        categories: ["Objetos de mesa", "Bandejas", "Candelabros", "Accesorios", "Decoración de comedor"],
        advisory: "Recibe una propuesta de detalles coordinados para comedor y áreas sociales, pensada según el tipo de encuentros que disfrutas."
      },
      renovator: {
        name: "El Renovador de Impacto",
        description: "Quieres transformar tus espacios sin realizar una remodelación completa. Buscas decisiones estratégicas que renueven la percepción del ambiente con una inversión y un alcance definidos.",
        motivations: ["Cambio visible", "Practicidad", "Mejorar espacios incompletos"],
        behavior: "Te resultan valiosas las propuestas integrales, la visualización previa y las selecciones ajustadas a un presupuesto.",
        categories: ["Accesorios", "Esculturas", "Jarrones", "Paquetes de micro-renovación"],
        advisory: "Comparte una foto del espacio o agenda una asesoría para recibir una micro-renovación por ambiente y presupuesto."
      },
      professional: {
        name: "El Profesional de Espacios",
        description: "Buscas soluciones estéticas, disponibilidad, asesoría y eficiencia para proyectos de clientes o negocios. La propuesta visual debe estar respaldada por inventario, logística y atención ágil.",
        motivations: ["Eficiencia para proyectos", "Disponibilidad", "Diferenciación"],
        behavior: "Evalúas las piezas como parte de una solución mayor: necesitas cotizar, coordinar y ejecutar con claridad.",
        categories: ["Paquetes por ambiente", "Selecciones B2B", "Piezas statement", "Asesoría profesional"],
        advisory: "Accede a un flujo de atención profesional con selección por proyecto, inventario actualizado, cotización y soporte logístico."
      }
    };


export const CATEGORY_LINKS: Record<string, string> = {
  "Esculturas": "/category/esculturas",
  "Jarrones": "/category/jarrones-escultoricos",
  "Jarrones premium": "/category/jarrones-escultoricos",
  "Espejos": "/category/todos-los-productos",
  "Piezas de gran formato": "/category/linea-suprema",
  "Candelabros": "/category/candelabros",
  "Consolas": "/category/linea-suprema",
  "Composiciones neutras": "/category/acentos-decorativos",
  "Objetos de mesa": "/category/acentos-decorativos",
  "Bandejas": "/category/acentos-decorativos",
  "Accesorios": "/category/acentos-decorativos",
  "Decoración de comedor": "/category/acentos-decorativos",
  "Paquetes de micro-renovación": "/category/linea-suprema",
  "Paquetes por ambiente": "/category/linea-suprema",
  "Selecciones B2B": "/category/todos-los-productos",
  "Piezas statement": "/category/linea-suprema",
  "Asesoría profesional": "/nosotros"
};



export function calculateProfile(answers: QuizAnswers): { key: string; scores: Record<string, number> } {
  if (answers.q19_profile_type && professionalTypes.has(answers.q19_profile_type)) {
    return {
      key: "professional",
      scores: { statement: 0, sophistication: 0, host: 0, renovator: 0, professional: 100 }
    };
  }

  const scores: Record<string, number> = { statement: 0, sophistication: 0, host: 0, renovator: 0 };
  const add = (profile: string, points: number) => {
    if (profile in scores) scores[profile] += points;
  };
  const includes = (id: string, value: string) => Array.isArray(answers[id]) && answers[id].includes(value);

  const styleMap: Record<string, [string, number]> = {
    contemporaneo: ["sophistication", 4],
    clasico: ["sophistication", 5],
    organico: ["host", 3],
    artistico: ["statement", 5]
  };
  if (answers.q4_style && styleMap[answers.q4_style]) {
    add(...styleMap[answers.q4_style]);
  }

  const feelingRules: [string, string, number][] = [
    ["admiracion", "statement", 3],
    ["inspiracion", "statement", 2],
    ["personal_autentica", "statement", 2],
    ["sofisticacion", "sophistication", 3],
    ["orden", "sophistication", 3],
    ["tranquilidad", "sophistication", 1],
    ["calidez", "host", 3],
    ["orgullo_invitados", "host", 4]
  ];
  feelingRules.forEach(([value, profile, points]) => {
    if (includes("q5_feelings", value)) add(profile, points);
  });

  const categoryMap: Record<string, [string, number]> = {
    esculturas: ["statement", 4],
    espejos_relojes: ["statement", 2],
    jarrones: ["sophistication", 3],
    mesas_consolas: ["sophistication", 3],
    candelabros_mesa: ["host", 4],
    bandejas_accesorios: ["host", 3],
    composiciones: ["renovator", 5],
    orientacion: ["renovator", 4]
  };
  if (answers.q6_category && categoryMap[answers.q6_category]) {
    add(...categoryMap[answers.q6_category]);
  }

  const attributeRules: [string, string, number][] = [
    ["diseno_diferente", "statement", 3],
    ["exclusiva", "statement", 4],
    ["historia_material", "statement", 2],
    ["calidad", "sophistication", 4],
    ["combine", "sophistication", 2],
    ["ambiente_completo", "renovator", 4],
    ["experto", "renovator", 3],
    ["precio_calidad", "renovator", 1],
    ["entrega", "renovator", 1]
  ];
  attributeRules.forEach(([value, profile, points]) => {
    if (includes("q7_attributes", value)) add(profile, points);
  });

  const motivationRules: [string, string, number][] = [
    ["pieza_enamora", "statement", 4],
    ["personalidad", "statement", 2],
    ["tendencia", "statement", 1],
    ["reemplazar", "sophistication", 2],
    ["recibir_celebrar", "host", 5],
    ["sin_remodelar", "renovator", 5],
    ["incompleto", "renovator", 4]
  ];
  motivationRules.forEach(([value, profile, points]) => {
    if (includes("q10_motivations", value)) add(profile, points);
  });

  if (answers.q1_intent === "pieza_especial") add("statement", 2);
  if (answers.q1_intent === "regalo") add("host", 2);
  if (answers.q1_intent === "renovar_hogar") add("renovator", 2);
  if (answers.q8_frequency === "pieza_especial") add("statement", 2);
  if (answers.q8_frequency === "temporadas") add("host", 2);
  if (["propuesta", "online_tienda", "tienda_online"].includes(answers.q13_purchase_channel)) add("renovator", 2);
  if (["foto_recomendaciones", "seleccion_presupuesto", "simulaciones"].includes(answers.q14_help)) add("renovator", 3);
  if (Number(answers.q15_advisory_interest || 0) >= 4) add("renovator", 2);
  if (includes("q2_spaces", "comedor")) add("host", 1);
  if (includes("q2_spaces", "ambiente_completo")) add("renovator", 2);

  const tiePriority = profileTiePriority(answers.q4_style);
  const key = Object.keys(scores).sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return tiePriority.indexOf(a) - tiePriority.indexOf(b);
  })[0];

  return { key, scores };
}

export function profileTiePriority(style?: string): string[] {
  if (style === "artistico") return ["statement", "sophistication", "renovator", "host"];
  if (["clasico", "contemporaneo"].includes(style || "")) return ["sophistication", "statement", "renovator", "host"];
  if (style === "organico") return ["host", "renovator", "sophistication", "statement"];
  return ["renovator", "sophistication", "statement", "host"];
}

export function getQuestionById(id: string): Question | undefined {
  return [...mainQuestions, ...b2bQuestions].find(q => q.id === id);
}

export function getOptionLabel(questionId: string, value: string): string {
  const question = getQuestionById(questionId);
  return question?.options?.find(item => String(item.value) === String(value))?.label || "";
}

export function deriveMotivations(answers: QuizAnswers, profile: ProfileDefinition): string[] {
  const selected = answers.q10_motivations || [];
  const labels = selected.map((value: string) => getOptionLabel("q10_motivations", value)).filter(Boolean);
  return labels.length ? labels : profile.motivations;
}

export function deriveSpaces(answers: QuizAnswers): string[] {
  const selected = answers.q2_spaces || [];
  const labels = selected.map((value: string) => getOptionLabel("q2_spaces", value)).filter(Boolean);
  return labels.length ? labels : ["Un ambiente que refleje tu estilo"];
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

