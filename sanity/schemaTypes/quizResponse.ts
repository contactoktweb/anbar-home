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
    defineField({
      name: 'q1Intent',
      title: 'Q1 · ¿Qué te trae hoy?',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q2Spaces',
      title: 'Q2 · Espacios a transformar',
      type: 'array',
      readOnly: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'q3Timing',
      title: 'Q3 · Momento del cambio',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q4Style',
      title: 'Q4 · Estilo decorativo elegido',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q5Feelings',
      title: 'Q5 · Sensaciones deseadas',
      type: 'array',
      readOnly: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'q6Category',
      title: 'Q6 · Pieza de mayor interés',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q7Attributes',
      title: 'Q7 · Atributos más valorados',
      type: 'array',
      readOnly: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'q8Frequency',
      title: 'Q8 · Frecuencia de compra',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q9Budget',
      title: 'Q9 · Presupuesto habitual',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q10Motivations',
      title: 'Q10 · Motivaciones para renovar',
      type: 'array',
      readOnly: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'q11Barrier',
      title: 'Q11 · Freno principal de compra',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q12Discovery',
      title: 'Q12 · Fuentes de inspiración',
      type: 'array',
      readOnly: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'q13PurchaseChannel',
      title: 'Q13 · Canal de compra preferido',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q14Help',
      title: 'Q14 · Tipo de ayuda preferida',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q15AdvisoryInterest',
      title: 'Q15 · Interés en asesoría (1-5)',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q16Relationship',
      title: 'Q16 · Relación previa con Anbar Home',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q17Association',
      title: 'Q17 · Asociación con Anbar Home',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q19ProfileType',
      title: 'Q19 · Tipo de participante',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q20DemographicsCity',
      title: 'Q20 · Ciudad (demográfico)',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q20DemographicsAge',
      title: 'Q20 · Rango de edad (demográfico)',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'q21Open',
      title: 'Q21 · Reflexión abierta',
      type: 'text',
      readOnly: true,
    }),

    // ── Respuestas B2B (si aplica) ────────────────────────
    defineField({
      name: 'b2bProjects',
      title: 'B2B · Tipo de proyectos',
      type: 'array',
      readOnly: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'b2bPurchase',
      title: 'B2B · Modalidad de compra',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'b2bBenefits',
      title: 'B2B · Beneficios más valorados',
      type: 'array',
      readOnly: true,
      of: [{ type: 'string' }],
    }),
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
