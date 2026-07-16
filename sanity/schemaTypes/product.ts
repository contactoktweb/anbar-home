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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU / ID para Meta',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'El ID único que se usará para rastreo en Meta Ads y el feed del catálogo.',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      validation: (rule) => rule.required(),
      description: 'Descripción detallada requerida por Meta Ads',
    }),
    defineField({
      name: 'price',
      title: 'Precio (Rebajado o Actual)',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'currency',
      title: 'Moneda',
      type: 'string',
      initialValue: 'COP',
      validation: (rule) => rule.required(),
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
      title: 'Inventario Numérico',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'availability',
      title: 'Disponibilidad (Para Catálogo)',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'in stock' },
          { title: 'Out of Stock', value: 'out of stock' },
          { title: 'Preorder', value: 'preorder' },
          { title: 'Available for Order', value: 'available for order' },
        ],
      },
      initialValue: 'in stock',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'condition',
      title: 'Condición',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Refurbished', value: 'refurbished' },
          { title: 'Used', value: 'used' },
        ],
      },
      initialValue: 'new',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Marca',
      type: 'string',
      initialValue: 'Anbar Home',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Selecciona una o más categorías para este producto.',
      validation: (rule) => rule.required().min(1),
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
