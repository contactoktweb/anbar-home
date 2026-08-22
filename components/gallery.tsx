import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { GridViewToggle } from '@/components/grid-view-toggle'
import { optimizeImageUrl } from '@/lib/utils'

export function Gallery({ data }: { data?: any }) {
  const subtitle = data?.gallerySubtitle || 'Galería'
  
  const defaultImages = [
    {
      src: '/Blogs-Anbar-1png.webp',
      alt: 'Interior sereno con arco y mobiliario en tonos camel',
    },
    {
      src: '/Blogs-Anbar.png.webp',
      alt: 'Escultura de la mujer',
    },
    {
      src: '/anbar-home-deco.png',
      alt: 'Decoración Anbar',
    },
    {
      src: '/Blogs-Anbar-2.png.webp',
      alt: 'Salón con arco de yeso, luz natural y decoración cálida',
    },
  ]

  const images = data?.galleryImages?.length > 0 
    ? data.galleryImages.map((img: any, i: number) => ({
        src: optimizeImageUrl(img.imageUrl, 1200, 75) || defaultImages[i]?.src || '/Blogs-Anbar-1png.webp',
        alt: img.alt || `Galería ${i + 1}`
      }))
    : defaultImages

  return (
    <section id="galeria" className="bg-white px-6 py-10 min-h-[100dvh] flex flex-col justify-center">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-camel-dark">
            {subtitle}
          </span>
        </Reveal>

        <div className="mx-auto mt-12 flex max-w-5xl justify-end">
          <GridViewToggle />
        </div>

        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-6 md:gap-6">
          {images[0] && (
            <Reveal className="md:col-span-4">
              <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-[2/1]">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  quality={75}
                  className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </figure>
            </Reveal>
          )}

          {images[1] && (
            <Reveal delay={120} className="md:col-span-2">
              <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-square">
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={75}
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </figure>
            </Reveal>
          )}

          {images[2] && (
            <Reveal className="md:col-span-2">
              <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-square">
                <Image
                  src={images[2].src}
                  alt={images[2].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={75}
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </figure>
            </Reveal>
          )}

          {images[3] && (
            <Reveal delay={120} className="md:col-span-4">
              <figure className="group relative aspect-[3/2] w-full overflow-hidden rounded-sm md:aspect-[2/1]">
                <Image
                  src={images[3].src}
                  alt={images[3].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  quality={75}
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </figure>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
