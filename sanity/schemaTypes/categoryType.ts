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
      name: 'image',
      title: 'Imagen de Portada / Miniatura (Home y Cuadros)',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen cuadrada o representativa para los cuadros de categorías destacadas en la página de inicio.',
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
    defineField({
      name: 'isFeatured',
      title: '¿Destacar en la Página de Inicio?',
      type: 'boolean',
      description: 'Si se activa, esta categoría puede mostrarse automáticamente en la sección de Categorías Destacadas del Home.',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Orden en Destacados del Home',
      type: 'number',
      description: 'Número para ordenar la categoría en el Home (ej. 1, 2, 3...). Los números menores aparecen primero.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'image',
      banner: 'imageDesktop',
      isFeatured: 'isFeatured',
      order: 'featuredOrder',
    },
    prepare({ title, slug, media, banner, isFeatured, order }) {
      const featuredBadge = isFeatured ? ` ★ [Orden: ${order ?? '-'}]` : ''
      return {
        title: title || 'Categoría sin título',
        subtitle: `/${slug || ''}${featuredBadge}`,
        media: media || banner,
      }
    },
  },
})
