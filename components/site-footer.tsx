import Image from 'next/image'

const groups = [
  {
    title: 'Explorar',
    links: ['Concepto', 'El Logo', 'Galería', 'Identidad'],
  },
  {
    title: 'Contacto',
    links: ['hola@anbarhome.com', 'Atelier', 'Showroom'],
  },
  {
    title: 'Social',
    links: ['Instagram', 'Pinterest', 'Behance'],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-ivory px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/anbar-logo.png"
              alt="Anbar Home"
              width={220}
              height={90}
              className="h-9 w-auto object-contain"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Decoración para el hogar inspirada en Medio Oriente y Egipto.
              Calma, artesanía y luz.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[0.7rem] uppercase tracking-[0.28em] text-camel-dark">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-foreground/70 transition-colors duration-300 hover:text-camel-dark"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Anbar Home</span>
          <a
            href="https://www.kytcode.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-camel-dark"
          >
            Desarrollado por K&amp;T <span className="not-italic">🤍</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
