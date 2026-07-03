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
    <section id="concepto" className="bg-[#fdfbf7] px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-balance text-3xl font-serif font-light leading-tight tracking-tight text-neutral-900 md:text-4xl">
            {title}
          </h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {pillarsData.map((pillar: any, i: number) => {
            const Icon = getIcon(pillar.iconType)
            return (
              <Reveal
                key={pillar.title}
                delay={i * 120}
                className="flex flex-col items-center bg-white px-8 py-10 text-center shadow-sm border border-neutral-100 rounded-sm"
              >
                <Icon className="h-8 w-8 text-camel-dark" />
                <h3 className="mt-6 font-serif text-xl font-light tracking-wide text-neutral-950">
                  {pillar.title}
                </h3>
                <p className="mt-4 text-[0.9rem] font-light leading-[1.8] text-neutral-500">
                  {pillar.text}
                </p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
