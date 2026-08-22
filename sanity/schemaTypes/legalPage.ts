import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { slugify } from '../lib/slugify'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Páginas Legales',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Ejemplo: Aviso de Privacidad, Términos y Condiciones, etc.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Ruta)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => slugify(input),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'text',
      description: 'Contenido de la página legal (puedes usar saltos de línea para separar párrafos)',
      validation: (rule) => rule.required(),
    }),
  ],
})
