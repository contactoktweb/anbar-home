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
      name: 'price',
      title: 'Precio',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Precio Original (Antes)',
      type: 'number',
      description: 'Si el producto está en descuento, pon el precio anterior aquí.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Línea Suprema', value: 'Línea Suprema' },
          { title: 'Esculturas', value: 'Esculturas' },
          { title: 'Summer Sale', value: 'Summer Sale' },
          { title: 'Accesorios Hogar', value: 'Accesorios Hogar' },
          { title: 'Jarrones Escultóricos', value: 'Jarrones Escultóricos' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen del Producto',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
