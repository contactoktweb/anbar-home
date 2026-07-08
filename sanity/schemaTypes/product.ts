import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del Producto',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'Descripción corta o larga del producto',
    }),
    defineField({
      name: 'price',
      title: 'Precio (Rebajado o Actual)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Precio Normal',
      type: 'number',
      description: 'Precio original si el producto está rebajado.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Inventario',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen Principal',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Imágenes adicionales del producto',
    }),
    defineField({
      name: 'rating',
      title: 'Promedio de Calificación',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Promedio general calculado a partir de las valoraciones de usuarios.',
    }),
    defineField({
      name: 'ratingCount',
      title: 'Total de Valoraciones',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Cantidad total de reseñas recibidas.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'image',
    },
  },
})
