import { defineField, defineType } from 'sanity'
import { EarthGlobeIcon, PinIcon, MobileDeviceIcon, TagIcon } from '@sanity/icons'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Configuración Global',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    { name: 'general', title: 'General' },
    { name: 'discountModal', title: 'Modal de Descuento 10%', icon: TagIcon },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo de la Empresa (Para web y correos)',
      type: 'image',
      options: { hotspot: true },
      group: 'general',
    }),
    defineField({
      name: 'notificationEmail',
      title: 'Correo de Notificaciones (Órdenes)',
      type: 'string',
      group: 'general',
      initialValue: 'anbarhomesas@gmail.com',
      description: 'El correo del administrador al que llegarán los avisos de nuevas compras.',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'Número de WhatsApp',
      type: 'string',
      group: 'general',
      description: 'Número para el botón flotante de WhatsApp (ej: 573001234567, sin el símbolo +)',
      validation: (rule) => rule.required(),
      icon: MobileDeviceIcon,
      initialValue: '3000000000'
    }),
    defineField({
      name: 'physicalStores',
      title: 'Tiendas Físicas',
      group: 'general',
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

    // --- MODAL DE DESCUENTO 10% ---
    defineField({
      name: 'discountModalEnabled',
      title: '¿Activar Modal de 10% OFF?',
      type: 'boolean',
      group: 'discountModal',
      initialValue: true,
      description: 'Activa o desactiva el modal emergente de descuento en toda la tienda.',
    }),
    defineField({
      name: 'discountModalImageDesktop',
      title: 'Imagen de Fondo — Escritorio (PC)',
      type: 'image',
      group: 'discountModal',
      options: { hotspot: true },
      description: 'Imagen horizontal para el modal en computadores. Proporción recomendada: 1915×821 px.',
    }),
    defineField({
      name: 'discountModalImageMobile',
      title: 'Imagen de Fondo — Móvil',
      type: 'image',
      group: 'discountModal',
      options: { hotspot: true },
      description: 'Imagen vertical para el modal en dispositivos móviles. Proporción recomendada: 1080×1350 px.',
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
