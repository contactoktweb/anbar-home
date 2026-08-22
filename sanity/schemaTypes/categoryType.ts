import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {slugify} from '../lib/slugify'

export const categoryType = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => slugify(input),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
    }),
    defineField({
      name: 'imageDesktop',
      title: 'Banner de Categoría (PC / Escritorio)',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen principal del banner para la página de esta categoría en computadores.',
    }),
    defineField({
      name: 'imageMobile',
      title: 'Banner de Categoría (Móvil)',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen del banner adaptada para pantallas móviles (opcional, si no se coloca se adaptará la de PC).',
    }),
  ],
})
