import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { GridViewToggle } from '@/components/grid-view-toggle'

export function Gallery() {
  return (
    <section id="galeria" className="bg-white px-6 py-10 min-h-[100dvh] flex flex-col justify-center">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-camel-dark">
            Galería
          </span>
        </Reveal>

        <div className="mx-auto mt-12 flex max-w-5xl justify-end">
          <GridViewToggle />
        </div>

        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-6 md:gap-6">
          <Reveal className="md:col-span-4">
            <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-[2/1]">
              <Image
                src="/Blogs-Anbar-1png.webp"
                alt="Interior sereno con arco y mobiliario en tonos camel"
                fill
                className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </figure>
          </Reveal>

          <Reveal delay={120} className="md:col-span-2">
            <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-square">
              <Image
                src="/Blogs-Anbar.png.webp"
                alt="Escultura de la mujer"
                fill
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </figure>
          </Reveal>

          <Reveal className="md:col-span-2">
            <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-square">
              <Image
                src="/anbar-home-deco.png"
                alt="Decoración Anbar"
                fill
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </figure>
          </Reveal>

          <Reveal delay={120} className="md:col-span-4">
            <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-[2/1]">
              <Image
                src="/Blogs-Anbar-2.png.webp"
                alt="Salón con arco de yeso, luz natural y decoración cálida"
                fill
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
