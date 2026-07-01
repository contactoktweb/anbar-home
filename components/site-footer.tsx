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
    <footer className="border-t border-neutral-800 bg-neutral-950 px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Row */}
        <div className="grid gap-12 border-b border-white/10 pb-16 md:grid-cols-3 md:gap-10">
          <div className="flex items-center justify-start">
            <Image
              src="/LOGO ANBAR.png"
              alt="Anbar Home"
              width={240}
              height={96}
              className="ml-6 h-10 w-auto object-contain brightness-0 invert md:ml-10 md:h-14"
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
            <div className="flex flex-col items-center gap-6 md:items-start">
              <h2 className="font-serif text-3xl font-light tracking-wide text-white md:text-5xl">
                Suscríbete
              </h2>
              <div className="flex w-full max-w-md items-center gap-2 border-b border-white/30 pb-2">
                <input
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  className="w-full bg-transparent text-sm tracking-[0.2em] text-white outline-none placeholder:text-white/50"
                />
                <button
                  type="button"
                  className="text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                >
                  Enviar
                </button>
              </div>
              <p className="max-w-sm text-center text-xs font-light leading-relaxed text-white/50 md:text-left">
                Regístrese para recibir actualizaciones sobre nuevas llegadas,
                ofertas especiales y otra información de descuento.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center md:items-end md:text-right">
            <h3 className="font-serif text-lg font-medium text-white md:text-xl">
              {topGroup.title}
            </h3>
            <ul className="mt-6 space-y-4">
              {topGroup.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-neutral-400 transition-colors duration-300 hover:text-camel"
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
              <h3 className="font-serif text-[17px] font-medium text-white">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-light leading-relaxed text-neutral-400 transition-colors duration-300 hover:text-camel"
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
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 text-[13px] text-neutral-400 md:flex-row">
          <span>
            Anbar Home {new Date().getFullYear()} © Todos los derechos reservados
          </span>
          <a
            href="https://www.kytcode.lat/"
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
