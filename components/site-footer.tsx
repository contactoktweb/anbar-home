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
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries'

export async function SiteFooter() {
  const settings = await client.fetch(GLOBAL_SETTINGS_QUERY).catch(() => null)
  
  const storesLinks = settings?.physicalStores?.map((s: any) => ({
    label: `${s.city}: ${s.address}`,
    href: '#'
  })) || [
    { label: 'Bogotá: Calle 109 #18B-52, Local 101', href: '#' },
    { label: 'Bucaramanga: Calle 62 #30-99', href: '#' },
    { label: 'Cabecera del Llano: Cra 36 #48-141 Local 5', href: '#' },
  ]

  const bottomGroups = [
    {
      title: 'Nuestra Empresa',
      links: [
        { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' }
      ],
    },
    {
      title: 'Tiendas',
      links: storesLinks,
    },
    {
      title: 'Colecciones',
      links: [
        { label: 'Esculturas', href: '#' },
        { label: 'Jarrones', href: '#' },
        { label: 'Espejos', href: '#' }
      ],
    },
    {
      title: 'Blog Diseño Interior',
      links: [
        { label: 'El Regreso de los Espacios Sensoriales', href: '#' }
      ],
    },
  ]

  return (
    <footer className="border-t border-border/60 bg-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Row */}
        <div className="grid gap-12 border-b border-border/40 pb-16 md:grid-cols-3 md:gap-10">
          <div className="flex items-center justify-start">
            <Image
              src="/Anbar_Home_Logo_Black.png.webp"
              alt="Anbar Home"
              width={300}
              height={120}
              className="ml-6 h-14 w-auto object-contain md:ml-10 md:h-20"
            />
          </div>

          <div className="flex items-end justify-center gap-6 opacity-40 md:-translate-x-10">
            {/* Pitcher with handle */}
            <svg viewBox="0 0 100 150" fill="currentColor" className="h-16 w-auto text-camel md:h-24" aria-hidden="true">
              <path d="M 40 10 L 60 10 C 55 20, 50 30, 55 45 C 55 50, 75 70, 75 100 C 75 125, 65 135, 55 137 C 55 140, 60 140, 60 142 L 40 142 C 40 140, 45 140, 45 137 C 35 135, 25 125, 25 100 C 25 70, 45 50, 45 45 C 50 30, 45 20, 40 10 Z" />
              <path d="M 72 65 C 90 65, 95 85, 80 105 L 75 100 C 85 85, 85 70, 70 70 Z" />
            </svg>

            {/* Wide bowl */}
            <svg viewBox="0 0 120 100" fill="currentColor" className="h-12 w-auto text-camel md:h-16" aria-hidden="true">
              <path d="M 40 10 L 80 10 C 75 15, 70 20, 70 25 C 70 40, 110 45, 110 65 C 110 85, 80 92, 65 95 C 65 98, 70 98, 70 100 L 50 100 C 50 98, 55 98, 55 95 C 40 92, 10 85, 10 65 C 10 45, 50 40, 50 25 C 50 20, 45 15, 40 10 Z" />
            </svg>
            
            {/* Tall amphora (original) */}
            <svg viewBox="0 0 100 160" fill="currentColor" className="h-20 w-auto text-camel md:h-28" aria-hidden="true">
              <path d="M 35 15 L 65 15 C 60 25, 55 35, 55 50 C 55 75, 85 90, 85 120 C 85 140, 70 145, 60 147 C 60 150, 65 150, 65 153 L 35 153 C 35 150, 40 150, 40 147 C 30 145, 15 140, 15 120 C 15 90, 45 75, 45 50 C 45 35, 40 25, 35 15 Z" />
            </svg>

            {/* Slender cylinder vase */}
            <svg viewBox="0 0 100 150" fill="currentColor" className="h-16 w-auto text-camel md:h-24" aria-hidden="true">
              <path d="M 25 10 L 75 10 C 60 20, 60 30, 60 40 L 65 135 C 65 140, 65 145, 60 150 L 40 150 C 35 145, 35 140, 35 135 L 40 40 C 40 30, 40 20, 25 10 Z" />
            </svg>

            {/* Small squat pot */}
            <svg viewBox="0 0 100 100" fill="currentColor" className="h-10 w-auto text-camel md:h-14" aria-hidden="true">
              <path d="M 40 10 L 60 10 C 55 15, 55 20, 55 25 C 55 30, 85 40, 85 60 C 85 80, 65 95, 55 95 L 45 95 C 35 95, 15 80, 15 60 C 15 40, 45 30, 45 25 C 45 20, 45 15, 40 10 Z" />
            </svg>
          </div>

          <div className="flex flex-col justify-center md:items-end md:text-right">
            <h3 className="font-serif text-lg font-medium text-neutral-900 md:text-xl">
              {topGroup.title}
            </h3>
            <ul className="mt-6 space-y-4">
              {topGroup.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-neutral-600 transition-colors duration-300 hover:text-camel-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-12 pt-16 sm:grid-cols-2 lg:flex lg:justify-between lg:gap-8">
          {bottomGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-serif text-[17px] font-medium text-neutral-900">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-light leading-relaxed text-neutral-600 transition-colors duration-300 hover:text-camel-dark"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright & K&T Mark */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-10 text-[13px] text-neutral-500 md:flex-row">
          <span>
            Anbar Home {new Date().getFullYear()} © Todos los derechos reservados
          </span>
          <a
            href="https://www.kytcode.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors duration-300 hover:text-camel-dark"
          >
            Desarrollado por K&amp;T <span className="not-italic text-black">🖤</span>
          </a>
        </div>
        
      </div>
    </footer>
  )
}
