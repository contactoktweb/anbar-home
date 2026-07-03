import Image from 'next/image'
import Link from 'next/link'

export function QuietLuxuryCollection() {
  const categories = [
    {
      title: 'Jarrones Escultóricos',
      image: '/jarrones.webp',
      href: '/category/jarrones-escultoricos'
    },
    {
      title: 'Esculturas',
      image: '/esculturas.webp',
      href: '/category/esculturas'
    },
    {
      title: 'Línea Suprema',
      image: '/linea-suprema.png',
      href: '/category/linea-suprema'
    }
  ]

  return (
    <section id="lujo-silencioso" className="py-24 bg-[#F5EEDC]">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl md:text-5xl font-serif text-neutral-900 mb-16 text-center tracking-wide">
          Colección lujo silencioso
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.href}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden mb-6 shadow-sm">
                <Image 
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg md:text-xl font-serif text-neutral-800 transition-colors group-hover:text-neutral-600">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
