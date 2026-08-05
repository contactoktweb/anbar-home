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

  // Filter out system or unwanted categories
  const activeCategories = (categories || []).filter(
    (c: any) => c.slug && c.slug !== 'todos-los-productos' && c.slug !== 'uncategorized'
  )

  const rawCollectionsLinks = activeCategories.length > 0
    ? [
        ...activeCategories.map((c: any) => ({
          label: c.title === 'Summer Sale' || c.title === 'sale' ? 'SALE' : c.title,
          href: `/category/${c.slug}`
        })),
        ...(activeCategories.some((c: any) => c.slug === 'summer-sale' || c.slug === 'sale') ? [] : [{ label: 'SALE', href: '/category/sale' }])
      ]
    : [
        { label: 'Línea Suprema', href: '/category/linea-suprema' },
        { label: 'Esculturas', href: '/category/esculturas' },
        { label: 'SALE', href: '/category/sale' },
        { label: 'Acentos Decorativos', href: '/category/acentos-decorativos' },
        { label: 'Jarrones', href: '/category/jarrones' }
      ]

  const collectionsLinks = rawCollectionsLinks.filter(
    (link, index, self) => index === self.findIndex((l) => l.label.toLowerCase() === link.label.toLowerCase())
  )

  const bottomGroups = [
    {
      title: 'Nuestra Empresa',
      links: [
        { label: 'Nosotros', href: '/nosotros' },
        { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' }
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
    <footer className="border-t border-neutral-800 bg-neutral-950 px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Row */}
        <div className="flex flex-col items-center gap-12 border-b border-white/10 pb-16 md:flex-row md:justify-between md:gap-10">
          <div className="flex items-center justify-start">
            <Image
              src="/LOGO ANBAR.png"
              alt="Anbar Home"
              width={280}
              height={112}
              className="h-14 w-auto object-contain brightness-0 invert md:h-16"
            />
          </div>

          <div className="flex flex-col justify-center text-center md:items-end md:text-right">
            <h3 className="font-serif text-[19px] font-medium text-white md:text-[23px]">
              {topGroup.title}
            </h3>
            <ul className="mt-6 space-y-4">
              {topGroup.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] md:text-[17px] font-light text-neutral-400 transition-colors duration-300 hover:text-camel"
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
              <h3 className="font-serif text-[19px] font-medium text-white">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-4">
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
                        className="text-[15px] font-light leading-relaxed text-neutral-400 transition-colors duration-300 hover:text-camel"
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
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 text-[14px] text-neutral-400 md:flex-row">
          <span>
            Anbar Home {new Date().getFullYear()} © Todos los derechos reservados
          </span>
          <a
            href="https://www.kytcode.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors duration-300 hover:text-camel"
          >
            Desarrollado por K&amp;T <span className="not-italic text-white">🤍</span>
          </a>
        </div>
        
      </div>
    </footer>
  )
}
