import { Reveal } from '@/components/reveal'
import Image from 'next/image'
import { GridViewToggle } from '@/components/grid-view-toggle'

export function LogoMeaning({ data }: { data?: any }) {
  const title = data?.collectionsTitle || 'Colección lujo silencioso'

  const defaultCategories = [
    {
      image: '/jarrones.webp',
      title: 'Jarrones Escultóricos',
    },
    {
      image: '/esculturas.webp',
      title: 'Esculturas',
    },
    {
      image: '/linea-suprema-florero.png',
      title: 'Línea Suprema',
    },
  ]

  const categories = data?.collectionsList?.length > 0
    ? data.collectionsList.map((item: any) => ({
      image: item.imageUrl || defaultCategories.find(c => c.title === item.title)?.image || '/jarrones.webp',
      title: item.title
    }))
    : defaultCategories

  return (
    <section id="colecciones" className="bg-sand px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mb-12 text-center">
          <h2 className="text-balance text-4xl font-light leading-tight tracking-tight md:text-5xl">
            {title}
          </h2>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-3 md:gap-8">
          {categories.map((item: any, i: number) => (
            <Reveal
              key={item.title}
              delay={i * 150}
              className="group flex flex-col items-center"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-8 flex flex-col items-center gap-4">
                <h3 className="font-serif text-2xl font-light tracking-wide text-foreground">
                  {item.title}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
