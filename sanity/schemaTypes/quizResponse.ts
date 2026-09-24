import { defineField, defineType } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export const quizResponse = defineType({
  name: 'quizResponse',
  title: 'Respuestas del Quiz de Estilo',
  type: 'document',
  icon: SparklesIcon,
  readOnly: true,
  fields: [
    // ── Identificación ────────────────────────────────────
    defineField({
      name: 'recordId',
      title: 'ID de Registro',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'completedAt',
      title: 'Fecha de Completado',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'startedAt',
      title: 'Fecha de Inicio',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'route',
      title: 'Ruta',
      type: 'string',
      description: 'B2C (hogar) o B2B (profesional)',
      options: {
        list: [
          { title: 'B2C — Hogar personal', value: 'B2C' },
          { title: 'B2B — Proyecto profesional', value: 'B2B' },
        ],
      },
      readOnly: true,
    }),

    // ── Perfil Calculado ──────────────────────────────────
    defineField({
      name: 'profileKey',
      title: 'Clave del Perfil',
      type: 'string',
      options: {
        list: [
          { title: 'El Curador de Piezas Statement', value: 'statement' },
          { title: 'El Amante de la Sofisticación Atemporal', value: 'sophistication' },
          { title: 'El Anfitrión de los Detalles', value: 'host' },
          { title: 'El Renovador de Impacto', value: 'renovator' },
          { title: 'El Profesional de Espacios', value: 'professional' },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: 'profileName',
      title: 'Nombre del Perfil',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'profileScores',
      title: 'Puntajes del Perfil',
      type: 'object',
      readOnly: true,
      fields: [
        { name: 'statement', type: 'number', title: 'Statement' },
        { name: 'sophistication', type: 'number', title: 'Sophistication' },
        { name: 'host', type: 'number', title: 'Host' },
        { name: 'renovator', type: 'number', title: 'Renovator' },
        { name: 'professional', type: 'number', title: 'Professional' },
      ],
    }),

    // ── Datos de Contacto (opcional) ──────────────────────
    defineField({
      name: 'contactName',
      title: 'Nombre del Participante',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Correo Electrónico',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'contactWhatsapp',
      title: 'WhatsApp',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'contactCity',
      title: 'Ciudad de Residencia',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'dataConsent',
      title: 'Autorización de Tratamiento de Datos',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({
      name: 'marketingConsent',
      title: 'Consentimiento Comercial',
      type: 'boolean',
      readOnly: true,
    }),

    // ── Respuestas Clave del Quiz ─────────────────────────
    defineField({ name: 'q1_relacion', title: 'Q1 · Relación con Anbar Home', type: 'string', readOnly: true }),
    defineField({ name: 'q2_probabilidad_compra', title: 'Q2 · Probabilidad de compra', type: 'string', readOnly: true }),
    defineField({ name: 'q3_situaciones', title: 'Q3 · Situaciones de compra', type: 'array', readOnly: true, of: [{ type: 'string' }] }),
    defineField({ name: 'q4_barreras', title: 'Q4 · Barreras de compra', type: 'array', readOnly: true, of: [{ type: 'string' }] }),
    defineField({ name: 'q5_asesoria_prob', title: 'Q5 · Probabilidad de uso de asesoría', type: 'string', readOnly: true }),
    defineField({ name: 'q6_interes_propuesta', title: 'Q6 · Interés en propuesta de valor', type: 'string', readOnly: true }),
    defineField({ name: 'q7_espacios', title: 'Q7 · Espacios a decorar', type: 'array', readOnly: true, of: [{ type: 'string' }] }),
    defineField({ name: 'q8_categorias', title: 'Q8 · Categorías (Matriz)', type: 'text', readOnly: true }),
    defineField({ name: 'q9_factores_eleccion', title: 'Q9 · Factores de elección', type: 'array', readOnly: true, of: [{ type: 'string' }] }),
    defineField({ name: 'q10_marca_ideal', title: 'Q10 · Atributos de marca ideal', type: 'array', readOnly: true, of: [{ type: 'string' }] }),
    defineField({ name: 'q11_inversion', title: 'Q11 · Nivel de inversión', type: 'string', readOnly: true }),
    defineField({ name: 'q12_momentos_compra', title: 'Q12 · Momentos de compra', type: 'array', readOnly: true, of: [{ type: 'string' }] }),
    defineField({ name: 'q13_forma_compra', title: 'Q13 · Forma de compra preferida', type: 'string', readOnly: true }),
    defineField({ name: 'q14_calidad_determinante', title: 'Q14 · Importancia de calidad', type: 'string', readOnly: true }),
    defineField({ name: 'q15_actualizacion', title: 'Q15 · Frecuencia de actualización', type: 'string', readOnly: true }),
    defineField({ name: 'q16_precio_decision', title: 'Q16 · Peso del precio', type: 'string', readOnly: true }),
    defineField({ name: 'q17_diseno_exclusividad', title: 'Q17 · Importancia del diseño', type: 'string', readOnly: true }),
    defineField({ name: 'q18_busqueda_info', title: 'Q18 · Fuentes de información', type: 'array', readOnly: true, of: [{ type: 'string' }] }),
    defineField({ name: 'q19_modalidades_compra', title: 'Q19 · Modalidades de compra (Matriz)', type: 'text', readOnly: true }),
    defineField({ name: 'q20_canal_asesoria', title: 'Q20 · Canal para asesoría', type: 'string', readOnly: true }),
    defineField({ name: 'q21_ingresos', title: 'Q21 · Nivel de ingresos', type: 'string', readOnly: true }),
    defineField({ name: 'q22_ciudad', title: 'Q22 · Ciudad', type: 'string', readOnly: true }),
    defineField({ name: 'q23_edad', title: 'Q23 · Edad', type: 'string', readOnly: true }),
    defineField({ name: 'q24_genero', title: 'Q24 · Género', type: 'string', readOnly: true }),
  ],
  preview: {
    select: {
      email: 'contactEmail',
      name: 'contactName',
      profile: 'profileName',
      route: 'route',
      city: 'contactCity',
      date: 'completedAt',
    },
    prepare(s) {
      const label = s.name || s.email || 'Anónimo'
      const date = s.date
        ? new Date(s.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
        : ''
      return {
        title: `${label}${s.city ? ` · ${s.city}` : ''}`,
        subtitle: `${s.route || '?'} · ${s.profile || 'Sin perfil'} · ${date}`,
      }
    },
  },
})
