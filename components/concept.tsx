import { Reveal } from '@/components/reveal'
import Image from 'next/image'
import { ArchIcon, PalmIcon, VaseIcon } from '@/components/icons'

const pillars = [
  {
    icon: ArchIcon,
    title: 'Arquitectura',
    text: 'Arcos, simetría y espacios que respiran, evocando la serenidad de la arquitectura del desierto.',
  },
  {
    icon: PalmIcon,
    title: 'Naturaleza',
    text: 'Materiales nobles, fibras vegetales y una conexión cálida con lo orgánico y lo vivo.',
  },
  {
    icon: VaseIcon,
    title: 'Artesanía',
    text: 'Cada pieza nace del trabajo manual, honrando tradiciones de Medio Oriente y Egipto.',
  },
]

export function Concept() {
  return (
    <section id="concepto" className="bg-camel px-6 py-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-light leading-tight tracking-tight text-white md:text-5xl">
            Refleja quién eres en tus espacios.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-white/90 md:text-xl">
            Visítanos hoy
          </p>
        </Reveal>

        <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-border/20 bg-border/20 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 120}
              className="flex flex-col items-center bg-sand px-8 py-6 text-center"
            >
              <pillar.icon className="h-8 w-8 text-camel-dark" />
              <h3 className="mt-4 text-xl font-normal tracking-wide">
                {pillar.title}
              </h3>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Reveal>
            <p className="font-serif text-3xl font-light italic leading-relaxed text-white md:text-4xl lg:text-5xl">
              “El futuro del diseño interior será más humano.”
            </p>

            <p className="mt-6 font-sans text-lg font-normal text-white/90 md:text-xl">
              Andrés Barrientos - CEO Anbar Home
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
