'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

interface CategoryItem {
  _key?: string
  title: string
  imageUrl: string
  categoryTitle?: string
  categorySlug?: string
}

interface CategoryGridSectionProps {
  data?: {
    categoriesSectionTitle?: string
    categoriesSectionSubtitle?: string
    homeCategories?: CategoryItem[]
  }
}

export function CategoryGridSection({ data }: CategoryGridSectionProps) {
  const categories = data?.homeCategories || []

  if (!categories || categories.length === 0) return null

  const title = data?.categoriesSectionTitle || 'Categorías Destacadas'
  const subtitle = data?.categoriesSectionSubtitle || 'Explora nuestras colecciones exclusivas'

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#FAFAF8] border-b border-neutral-200/60 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-camel font-semibold">
              Colecciones
            </span>
            <h2 className="mt-1 sm:mt-2 font-serif text-2xl sm:text-3xl md:text-4xl text-neutral-900 font-normal tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 sm:mt-2 text-neutral-500 font-light text-xs sm:text-sm md:text-base">
                {subtitle}
              </p>
            )}
            <div className="w-10 sm:w-12 h-0.5 bg-camel/40 mx-auto mt-3 sm:mt-4" />
          </div>
        </Reveal>

        {/* Mobile Swipeable (Peek effect) / Desktop 5-Column Grid */}
        <div className="flex md:grid md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
          {categories.map((cat, idx) => {
            const href = cat.categorySlug ? `/category/${cat.categorySlug}` : '/category/todos-los-productos'

            return (
              <Reveal key={cat._key || idx} delay={idx * 0.06}>
                <Link
                  href={href}
                  className="group flex-shrink-0 w-[150px] sm:w-[190px] md:w-auto snap-start block relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-200/80"
                >
                  {/* Square Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      quality={90}
                    />
                    
                    {/* Subtle Overlay gradient on hover/tap */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Arrow badge on hover */}
                    <div className="absolute bottom-2.5 right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-800 opacity-0 group-hover:opacity-100 group-hover:bg-camel group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>

                  {/* Card Title Bar */}
                  <div className="p-3 sm:p-4 text-center bg-white">
                    <h3 className="font-serif text-xs sm:text-sm md:text-base text-neutral-900 font-medium tracking-wide group-hover:text-camel transition-colors duration-300 line-clamp-1">
                      {cat.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
