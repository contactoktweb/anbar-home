import { Reveal } from '@/components/reveal'
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
    <section id="concepto" className="bg-camel px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-white/80">
            El Concepto
          </span>
          <h2 className="mt-6 text-balance text-4xl font-light leading-tight tracking-tight text-white md:text-5xl">
            Una marca inspirada en la calma de Oriente
          </h2>
          <p className="mt-8 text-pretty text-base leading-relaxed text-white/90 md:text-lg">
            Anbar Home nace del encuentro entre la herencia decorativa de Medio
            Oriente y Egipto y una sensibilidad contemporánea minimalista.
            Creamos objetos atemporales en tonos camel, arena y marfil, pensados
            para llenar el hogar de luz, textura y quietud.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-sm border border-border/20 bg-border/20 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 120}
              className="flex flex-col items-center bg-sand px-8 py-14 text-center"
            >
              <pillar.icon className="h-12 w-12 text-camel-dark" />
              <h3 className="mt-8 text-2xl font-normal tracking-wide">
                {pillar.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {pillar.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
