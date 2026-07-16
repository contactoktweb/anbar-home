export const revalidate = 60

import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CategorySidebar } from '@/components/category-sidebar'
import { Search } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'

// Client component that reads search params
import SearchResults from './search-results'

export default async function SearchPage() {
  const [sanityProducts, sanityCategories] = await Promise.all([
    client.fetch(PRODUCTS_QUERY),
    client.fetch(CATEGORIES_QUERY).catch(() => [])
  ])

  const sidebarCategories = [
    { name: 'Todos los productos', href: '/search' },
    ...sanityCategories
      .filter((c: any) => c.slug !== 'todos-los-productos' && c.slug !== 'uncategorized')
      .map((c: any) => ({
        name: c.title,
        href: `/category/${c.slug}`
      }))
  ]

  const formattedSanityProducts = sanityProducts.map((p: any) => ({
    id: p._id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category || '',
    categories: p.categories || [],
    categorySlugs: p.categorySlugs || [],
    image: p.imageUrl,
    images: p.images || [],
    rating: p.rating || 0
  }))

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pb-20">
        
        {/* Store Banner */}
        <div className="w-full bg-[#C19A6B] py-12 text-center mb-16 shadow-inner">
          <h1 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase">
            Tienda
          </h1>
          <p className="text-white/80 mt-2 font-light tracking-wide">
            Encuentra la pieza perfecta para tu espacio
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Sidebar Column */}
            <div className="hidden md:block md:col-span-1">
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-100 rounded-lg"></div>}>
                <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-8">
                  <CategorySidebar categories={sidebarCategories} />
                </div>
              </Suspense>
            </div>

            {/* Main Content Column */}
            <div className="col-span-1 md:col-span-3">
              <Suspense fallback={
                <div className="flex h-64 items-center justify-center">
                  <div className="text-camel-dark font-medium">Buscando productos...</div>
                </div>
              }>
                <SearchResults products={formattedSanityProducts} />
              </Suspense>
            </div>
            
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
