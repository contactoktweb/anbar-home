import { defineField, defineType } from 'sanity'
import { HomeIcon, ImageIcon, TextIcon, BlockElementIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Página de Inicio',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero (Principal)' },
    { name: 'concept', title: 'Concepto' },
    { name: 'collections', title: 'Colecciones' },
    { name: 'featured', title: 'Productos Destacados' },
    { name: 'gallery', title: 'Galería' },
  ],
  fields: [
    // --- HERO ---
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo',
      type: 'string',
      group: 'hero',
      initialValue: '',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Lema / Tagline',
      type: 'string',
      group: 'hero',
      initialValue: 'El arte de habitar con calma',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroCta',
      title: 'Texto del Botón',
      type: 'string',
      group: 'hero',
      initialValue: 'Descubrir',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroBanners',
      title: 'Banners del Hero',
      type: 'array',
      group: 'hero',
      description: 'Agrega las imágenes para el carrusel principal. Por cada banner, puedes subir la versión para PC y para Móvil.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'imageDesktop',
              title: 'Imagen de Fondo (PC)',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'imageMobile',
              title: 'Imagen de Fondo (Móvil)',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Texto Alternativo (SEO)',
              type: 'string',
              description: 'Descripción breve de la imagen',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'imageDesktop',
            },
          },
        },
      ],
    }),

    defineField({
      name: 'conceptTitle',
      title: 'Título Principal',
      type: 'string',
      group: 'concept',
      initialValue: 'Refleja quién eres en tus espacios',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'conceptSubtitle',
      title: 'Subtítulo',
      type: 'string',
      group: 'concept',
      initialValue: 'Visítanos hoy',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'conceptPillars',
      title: 'Pilares',
      type: 'array',
      group: 'concept',
      of: [
        {
          type: 'object',
          icon: BlockElementIcon,
          fields: [
            defineField({
              name: 'iconType',
              title: 'Ícono',
              type: 'string',
              options: {
                list: [
                  { title: 'Arco', value: 'arch' },
                  { title: 'Palma', value: 'palm' },
                  { title: 'Jarrón', value: 'vase' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      initialValue: [
        { _key: 'pillar-1', iconType: 'arch', title: 'Arquitectura' },
        { _key: 'pillar-2', iconType: 'palm', title: 'Naturaleza' },
        { _key: 'pillar-3', iconType: 'vase', title: 'Artesanía' },
      ]
    }),
    defineField({
      name: 'conceptQuoteText',
      title: 'Frase Destacada (Cita)',
      type: 'string',
      group: 'concept',
      initialValue: '“El futuro del diseño interior será más humano”',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'conceptQuoteAuthor',
      title: 'Autor de la Frase',
      type: 'string',
      group: 'concept',
      initialValue: 'Andrés Barrientos - CEO Anbar Home',
      validation: (rule) => rule.required(),
    }),

    // --- FEATURED PRODUCTS ---
    defineField({
      name: 'featuredProducts',
      title: 'Productos Destacados',
      type: 'array',
      group: 'featured',
      description: 'Selecciona los productos que quieres destacar en la página de inicio. Si lo dejas vacío, el sistema mostrará automáticamente los últimos productos.',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),

    // --- NEW ARRIVALS ---
    defineField({
      name: 'newArrivalsProducts',
      title: 'Nueva Colección',
      type: 'array',
      group: 'featured',
      description: 'Selecciona los productos para la sección Nueva Colección. Si está vacío, se muestran los productos más recientes.',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),

    // --- COLLECTIONS ---
    defineField({
      name: 'collectionsTitle',
      title: 'Título de Colecciones',
      type: 'string',
      group: 'collections',
      initialValue: 'Colección lujo silencioso',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'collectionsList',
      title: 'Colecciones Destacadas',
      type: 'array',
      group: 'collections',
      of: [
        {
          type: 'object',
          icon: ImageIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Título de Colección',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),

    // --- GALLERY ---
    defineField({
      name: 'gallerySubtitle',
      title: 'Subtítulo (Ej. Galería)',
      type: 'string',
      group: 'gallery',
      initialValue: 'Galería',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Imágenes de la Galería',
      type: 'array',
      group: 'gallery',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Texto Alternativo',
              description: 'Importante para accesibilidad y SEO.',
            })
          ]
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Página de Inicio',
        subtitle: 'Administra todo el contenido del Home',
      }
    },
  },
})
