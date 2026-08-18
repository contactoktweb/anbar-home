import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const discountCoupon = defineType({
  name: 'discountCoupon',
  title: 'Cupones de Descuento',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'code',
      title: 'Código de Descuento',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Porcentaje de Descuento (%)',
      type: 'number',
      initialValue: 10,
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'isUsed',
      title: '¿Ya fue utilizado?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'usedAt',
      title: 'Fecha de Canje',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'orderReference',
      title: 'Orden en la que se aplicó',
      type: 'reference',
      to: [{ type: 'order' }],
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de Creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'email',
      isUsed: 'isUsed',
    },
    prepare({ title, subtitle, isUsed }) {
      return {
        title: `${title} (${isUsed ? 'Canjeado ❌' : 'Activo ✅'})`,
        subtitle: subtitle || 'Sin correo',
      }
    },
  },
})
