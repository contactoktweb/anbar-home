import { Reveal } from '@/components/reveal'
import Image from 'next/image'
import { ArchIcon, PalmIcon, VaseIcon } from '@/components/icons'

export function Concept({ data }: { data?: any }) {
  const title = data?.conceptTitle || 'Refleja quién eres en tus espacios'
  const quoteText = data?.conceptQuoteText || '“El futuro del diseño interior será más humano”'
  const quoteAuthor = data?.conceptQuoteAuthor || 'Andrés Barrientos - CEO Anbar Home'

  const defaultPillars = [
    {
      iconType: 'arch',
      title: 'Arquitectura',
      text: 'Arcos, simetría y espacios que respiran, evocando la serenidad de la arquitectura del desierto.',
    },
    {
      iconType: 'palm',
      title: 'Naturaleza',
      text: 'Materiales nobles, fibras vegetales y una conexión cálida con lo orgánico y lo vivo.',
    },
    {
      iconType: 'vase',
      title: 'Artesanía',
      text: 'Cada pieza nace del trabajo manual, honrando tradiciones de Medio Oriente y Egipto.',
    },
  ]

  const pillarsData = data?.conceptPillars || defaultPillars

  const getIcon = (type: string) => {
    switch (type) {
      case 'arch': return ArchIcon
      case 'palm': return PalmIcon
      case 'vase': return VaseIcon
      default: return ArchIcon
    }
  }

  return (
    <section id="concepto" className="bg-sand px-6 py-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-light leading-tight tracking-tight text-neutral-900 md:text-5xl">
            {title}
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-border/20 bg-border/20 md:grid-cols-3">
          {pillarsData.map((pillar: any, i: number) => {
            const Icon = getIcon(pillar.iconType)
            return (
              <Reveal
                key={pillar.title}
                delay={i * 120}
                className="flex flex-col items-center bg-ivory px-8 py-6 text-center"
              >
                <Icon className="h-8 w-8 text-camel-dark" />
                <h3 className="mt-4 text-xl font-normal tracking-wide">
                  {pillar.title}
                </h3>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Reveal>
            <p className="font-serif text-3xl font-light italic leading-relaxed text-neutral-900 md:text-4xl lg:text-5xl">
              {quoteText}
            </p>

            <p className="mt-6 font-sans text-lg font-normal text-neutral-700 md:text-xl">
              {quoteAuthor}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
