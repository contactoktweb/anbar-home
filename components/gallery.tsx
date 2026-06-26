import Image from 'next/image'
import { Reveal } from '@/components/reveal'

export function Gallery() {
  return (
    <section id="galeria" className="bg-white px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-camel-dark">
            Galería
          </span>
          <h2 className="mt-6 text-balance text-4xl font-light leading-tight tracking-tight md:text-5xl">
            Atmósferas de luz y textura
          </h2>
          <p className="mt-8 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Cerámica, textiles naturales y arcos bañados por luz cálida. Un
            catálogo de calma en tonos camel.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-6 md:gap-6">
          <Reveal className="md:col-span-4">
            <figure className="group overflow-hidden rounded-sm">
              <Image
                src="/gallery-interior.png"
                alt="Interior sereno con arco y mobiliario en tonos camel"
                width={1200}
                height={800}
                className="h-[280px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 md:h-[460px]"
              />
            </figure>
          </Reveal>

          <Reveal delay={120} className="md:col-span-2">
            <figure className="group h-full overflow-hidden rounded-sm">
              <Image
                src="/gallery-ceramics.png"
                alt="Jarrones de cerámica artesanal en tonos arena"
                width={800}
                height={800}
                className="h-[280px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 md:h-[460px]"
              />
            </figure>
          </Reveal>

          <Reveal className="md:col-span-2">
            <figure className="group h-full overflow-hidden rounded-sm">
              <Image
                src="/gallery-textiles.png"
                alt="Textiles de lino y algodón doblados en tonos beige"
                width={800}
                height={800}
                className="h-[280px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 md:h-[420px]"
              />
            </figure>
          </Reveal>

          <Reveal delay={120} className="md:col-span-4">
            <figure className="group overflow-hidden rounded-sm">
              <Image
                src="/gallery-arch.png"
                alt="Salón con arco de yeso, luz natural y decoración cálida"
                width={1200}
                height={800}
                className="h-[280px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 md:h-[420px]"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
