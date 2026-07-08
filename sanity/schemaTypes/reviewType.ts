import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const reviewType = defineType({
  name: 'review',
  title: 'Reseña de Producto',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'product',
      title: 'Producto',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'userName',
      title: 'Nombre del Usuario',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Calificación (Estrellas)',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'comment',
      title: 'Comentario',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen Adjunta',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Aprobado', value: 'approved' },
          { title: 'Pendiente', value: 'pending' },
          { title: 'Rechazado', value: 'rejected' },
        ],
      },
      initialValue: 'approved',
    }),
  ],
  preview: {
    select: {
      title: 'userName',
      subtitle: 'product.name',
      rating: 'rating',
      media: 'image',
    },
    prepare({ title, subtitle, rating, media }) {
      return {
        title: `${title} - ${rating} ⭐`,
        subtitle: `Producto: ${subtitle}`,
        media,
      }
    },
  },
})
