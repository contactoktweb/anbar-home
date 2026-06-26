import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

const applications = [
  {
    src: '/mockup-bag.png',
    alt: 'Bolsa de papel camel con el logotipo Anbar Home',
    caption: 'Bolsas',
    logoClass: 'w-[46%] mix-blend-multiply opacity-90',
  },
  {
    src: '/mockup-label.png',
    alt: 'Etiquetas de papel con el logotipo Anbar Home',
    caption: 'Etiquetas',
    logoClass: 'w-[34%] mix-blend-multiply opacity-90',
  },
  {
    src: '/mockup-box.png',
    alt: 'Caja de regalo camel con el logotipo Anbar Home',
    caption: 'Packaging',
    logoClass: 'w-[44%] invert mix-blend-screen opacity-95',
  },
]

export function BrandApplications() {
  return (
    <section className="bg-sand px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-camel-dark">
            Aplicaciones de Marca
          </span>
          <h2 className="mt-6 text-balance text-4xl font-light leading-tight tracking-tight md:text-5xl">
            La identidad cobra vida
          </h2>
          <p className="mt-8 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Del empaque a la etiqueta, el logotipo permanece siempre como
            protagonista sereno de la experiencia Anbar Home.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {applications.map((app, i) => (
            <Reveal key={app.caption} delay={i * 120}>
              <figure className="group relative overflow-hidden rounded-sm">
                <Image
                  src={app.src || '/placeholder.svg'}
                  alt={app.alt}
                  width={800}
                  height={800}
                  className="h-[360px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/anbar-logo.png"
                    alt=""
                    aria-hidden="true"
                    width={400}
                    height={164}
                    className={cn('h-auto object-contain', app.logoClass)}
                  />
                </span>
              </figure>
              <p className="mt-4 text-center text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
                {app.caption}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
