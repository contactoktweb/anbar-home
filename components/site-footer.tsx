import Image from 'next/image'
import Link from 'next/link'

const topGroup = {
  title: 'Enlaces Rápidos',
  links: [
    { label: 'Aviso de privacidad', href: '/aviso-de-privacidad' },
    { label: 'Políticas de tratamiento de datos', href: '/politicas-de-tratamiento-de-datos' },
    { label: 'Política integral de retractos, cambios, devoluciones y garantía', href: '/politicas-de-retractos-y-garantias' },
  ],
}

import { client } from '@/sanity/lib/client'
import { GLOBAL_SETTINGS_QUERY, CATEGORIES_QUERY, POSTS_QUERY } from '@/sanity/lib/queries'

export async function SiteFooter() {
  const [settings, categories, posts] = await Promise.all([
    client.fetch(GLOBAL_SETTINGS_QUERY).catch(() => null),
    client.fetch(CATEGORIES_QUERY).catch(() => []),
    client.fetch(POSTS_QUERY).catch(() => [])
  ])
  
  const storesLinks = settings?.physicalStores?.map((s: any) => ({
    label: `${s.city}: ${s.address}`,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.city} ${s.address}`)}`
  })) || [
    { label: 'Bogotá: Calle 109 #18B-52, Local 101', href: 'https://www.google.com/maps/search/?api=1&query=Bogota%20Calle%20109%20%2318B-52%20Local%20101' },
    { label: 'Bucaramanga: Calle 62 #30-99', href: 'https://www.google.com/maps/search/?api=1&query=Bucaramanga%20Calle%2062%20%2330-99' },
    { label: 'Cabecera del Llano: Cra 36 #48-141 Local 5', href: 'https://www.google.com/maps/search/?api=1&query=Cabecera%20del%20Llano%20Cra%2036%20%2348-141%20Local%205' },
  ]

  const isSaleCategory = (c: any) => {
    const slug = (c.slug || '').toLowerCase().trim()
    const cleanTitle = (c.title || '').toUpperCase().replace(/\s+/g, '')
    return slug === 'sale' || slug === 's-a-l-e' || slug === 'summer-sale' || cleanTitle === 'SALE'
  }

  // Filter out system or unwanted categories, and exclude any variant of SALE to guarantee a single canonical link
  const activeCategories = (categories || []).filter(
    (c: any) => c.slug && c.slug !== 'todos-los-productos' && c.slug !== 'uncategorized' && !isSaleCategory(c)
  )

  const rawCollectionsLinks = activeCategories.length > 0
    ? [
        ...activeCategories.map((c: any) => ({
          label: (c.title || '').trim(),
          href: `/category/${c.slug}`
        })),
        { label: 'SALE', href: '/category/sale' }
      ]
    : [
        { label: 'Línea Suprema', href: '/category/linea-suprema' },
        { label: 'Esculturas', href: '/category/esculturas' },
        { label: 'Acentos Decorativos', href: '/category/acentos-decorativos' },
        { label: 'Jarrones', href: '/category/jarrones' },
        { label: 'SALE', href: '/category/sale' }
      ]

  const collectionsLinks = rawCollectionsLinks.filter(
    (link, index, self) => index === self.findIndex((l) => l.label.toLowerCase() === link.label.toLowerCase())
  )

  const rawWhatsapp = settings?.whatsappNumber || '573123087918'
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '')
  const whatsappHref = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hola Anbar Home, me gustaría recibir asesoría sobre sus productos.')}`

  const bottomGroups = [
    {
      title: 'Nuestra Empresa',
      links: [
        { label: 'Nosotros', href: '/nosotros' },
        { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
        { label: 'Quiz de Estilo', href: '/quiz' },
        { label: 'WhatsApp', href: whatsappHref }
      ],
    },
    {
      title: 'Tiendas',
      links: storesLinks,
    },
    {
      title: 'Colecciones',
      links: collectionsLinks,
    },
    {
      title: 'Últimos Blogs',
      links: posts && posts.length > 0
        ? posts.slice(0, 4).map((p: any) => ({
            label: p.title,
            href: `/blog/${p.slug}`
          }))
        : [
            { label: 'El Regreso de los Espacios Sensoriales', href: '/blog' }
          ],
    },
  ]

  return (
    <footer className="relative border-t border-[#E3C58B]/25 bg-gradient-to-b from-[#4b0d10] via-[#410b0e] to-[#32070a] px-6 py-12 md:px-10 text-[#F5E2BE] shadow-[0_-4px_30px_rgba(75,13,16,0.35)]">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Row */}
        <div className="flex flex-col items-center gap-12 border-b border-[#E3C58B]/20 pb-16 md:flex-row md:justify-between md:gap-10">
          <div className="flex items-center justify-start">
            <Image
              src="/LOGO ANBAR.png"
              alt="Anbar Home"
              width={280}
              height={112}
              quality={75}
              className="h-14 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:h-16"
            />
          </div>

          <div className="flex flex-col justify-center text-center md:items-end md:text-right">
            <h3 className="font-serif text-[19px] font-medium tracking-wide text-[#E3C58B] md:text-[23px]">
              {topGroup.title}
            </h3>
            <ul className="mt-6 space-y-4">
              {topGroup.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] md:text-[17px] font-light text-[#F5E2BE]/80 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-12 pt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {bottomGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-6">
              <h3 className="font-serif text-[19px] font-medium tracking-wide text-[#E3C58B]">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-3.5">
                {group.links.map((link: string | { label: string; href: string }) => {
                  const isString = typeof link === 'string';
                  const name = isString ? link : link.label;
                  const href = isString ? '#' : link.href;
                  const isExternal = href.startsWith('http://') || href.startsWith('https://');
                  return (
                    <li key={name}>
                      <Link
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="inline-block text-[15px] font-light leading-relaxed text-[#F5E2BE]/80 transition-all duration-300 hover:text-white hover:translate-x-1"
                      >
                        {name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright & K&T Mark */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[#E3C58B]/20 pt-10 text-[14px] text-[#E3C58B]/75 md:flex-row">
          <span>
            Anbar Home {new Date().getFullYear()} © Todos los derechos reservados
          </span>
          <a
            href="https://www.kytcode.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 font-medium text-[#E3C58B]/90 transition-colors duration-300 hover:text-white"
          >
            Desarrollado por K&amp;T <span className="not-italic text-white transition-transform duration-300 group-hover:scale-110">🤍</span>
          </a>
        </div>
        
      </div>
    </footer>
  )
}
