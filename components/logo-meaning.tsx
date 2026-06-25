import { Reveal } from '@/components/reveal'
import { ArchIcon, PalmIcon, VaseIcon } from '@/components/icons'

const meanings = [
  {
    number: '01',
    icon: ArchIcon,
    title: 'El Arco',
    subtitle: 'Refugio · Hogar · Arquitectura',
    text: 'El arco es la puerta al hogar. Símbolo de protección y umbral, representa la arquitectura ancestral que da forma a espacios donde habitar con serenidad.',
  },
  {
    number: '02',
    icon: PalmIcon,
    title: 'La Palmera',
    subtitle: 'Vida · Calma · Conexión natural',
    text: 'La palmera evoca la vida que florece en el desierto. Es calma, resiliencia y la conexión profunda con la naturaleza que respira en cada rincón del hogar.',
  },
  {
    number: '03',
    icon: VaseIcon,
    title: 'El Jarrón',
    subtitle: 'Artesanía · Tradición',
    text: 'El jarrón celebra la mano del artesano. Recipiente de cultura y tradición, guarda la memoria de oficios transmitidos durante generaciones.',
  },
]

export function LogoMeaning() {
  return (
    <section id="logo" className="bg-ivory px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-camel-dark">
            Significado del Logo
          </span>
          <h2 className="mt-6 text-balance text-4xl font-light leading-tight tracking-tight md:text-5xl">
            Tres símbolos, una historia
          </h2>
        </Reveal>

        <div className="mt-20 flex flex-col gap-px overflow-hidden rounded-sm border border-border/60 bg-border/60">
          {meanings.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 100}
              className="grid items-center gap-8 bg-background px-8 py-12 md:grid-cols-[auto_1fr_auto] md:gap-12 md:px-14"
            >
              <div className="flex items-center gap-8">
                <span className="font-serif text-3xl font-light text-camel">
                  {item.number}
                </span>
                <item.icon className="h-16 w-16 shrink-0 text-camel-dark" />
              </div>
              <div>
                <h3 className="text-3xl font-normal tracking-wide">
                  {item.title}
                </h3>
                <span className="mt-2 block text-[0.7rem] uppercase tracking-[0.28em] text-camel-dark">
                  {item.subtitle}
                </span>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
