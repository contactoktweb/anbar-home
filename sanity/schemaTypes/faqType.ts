import { defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

export const faqType = defineType({
  name: 'faq',
  title: 'Preguntas Frecuentes',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
  ],
})
