import Image from 'next/image'
import { Reveal } from '@/components/reveal'

export function LogoVariations() {
  return (
    <section id="identidad" className="bg-camel px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-white/80">
            Variaciones del Logo
          </span>
          <h2 className="mt-6 text-balance text-4xl font-light leading-tight tracking-tight text-white md:text-5xl">
            Una identidad versátil
          </h2>
          <p className="mt-8 text-pretty text-base leading-relaxed text-white/90 md:text-lg">
            El logotipo conserva su elegancia sobre fondos claros y cálidos,
            adaptándose con serenidad a cada aplicación.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-72 flex-col items-center justify-center rounded-sm border border-border/60 bg-background md:h-96">
              <Image
                src="/anbar-logo.png"
                alt="Anbar Home — versión oscura sobre fondo blanco"
                width={520}
                height={214}
                className="h-auto w-[62%] max-w-xs object-contain mix-blend-multiply"
              />
            </div>
            <p className="mt-4 text-center text-[0.7rem] uppercase tracking-[0.28em] text-white/80">
              Versión principal · Fondo blanco
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-72 flex-col items-center justify-center rounded-sm bg-camel md:h-96">
              <Image
                src="/anbar-logo.png"
                alt="Anbar Home — versión clara sobre fondo camel"
                width={520}
                height={214}
                className="h-auto w-[62%] max-w-xs object-contain invert mix-blend-screen"
              />
            </div>
            <p className="mt-4 text-center text-[0.7rem] uppercase tracking-[0.28em] text-white/80">
              Versión clara · Fondo camel
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
