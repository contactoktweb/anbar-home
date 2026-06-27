import { defineField, defineType } from 'sanity'
import { EarthGlobeIcon, PinIcon, MobileDeviceIcon } from '@sanity/icons'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Configuración Global',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'whatsappNumber',
      title: 'Número de WhatsApp',
      type: 'string',
      description: 'Número para el botón flotante de WhatsApp (ej: 573001234567, sin el símbolo +)',
      validation: (rule) => rule.required(),
      icon: MobileDeviceIcon,
      initialValue: '3000000000'
    }),
    defineField({
      name: 'physicalStores',
      title: 'Tiendas Físicas',
      description: 'Agrega las sedes o tiendas físicas que aparecerán en el pie de página (Footer)',
      type: 'array',
      initialValue: [
        {
          _type: 'object',
          city: 'Bogotá',
          address: 'Calle 109 #18B-52, Local 101'
        },
        {
          _type: 'object',
          city: 'Bucaramanga',
          address: 'Calle 62 #30-99'
        },
        {
          _type: 'object',
          city: 'Cabecera del Llano',
          address: 'Cra 36 #48-141 Local 5'
        }
      ],
      of: [
        {
          type: 'object',
          icon: PinIcon,
          fields: [
            defineField({
              name: 'city',
              title: 'Ciudad o Nombre Corto',
              type: 'string',
              description: 'Ejemplo: Bogotá o Cabecera del Llano',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'address',
              title: 'Dirección Completa',
              type: 'string',
              description: 'Ejemplo: Calle 109 #18B-52, Local 101',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'city',
              subtitle: 'address',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuración Global',
        subtitle: 'Información de contacto y sedes físicas',
      }
    },
  },
})
