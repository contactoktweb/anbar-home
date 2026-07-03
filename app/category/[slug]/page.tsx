import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CategorySidebar } from '@/components/category-sidebar'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { mockProducts } from '@/lib/mock-products'

import { client } from '@/sanity/lib/client'
import { PRODUCTS_QUERY } from '@/sanity/lib/queries'

// Map slugs to category names used in the data
const slugCategoryMap: Record<string, string> = {
  'linea-suprema': 'Línea Suprema',
  'esculturas': 'Esculturas',
  'summer-sale': 'Summer Sale',
  'accesorios-hogar': 'Accesorios Hogar',
  'jarrones-escultoricos': 'Jarrones Escultóricos',
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categoryName = slugCategoryMap[slug] ?? 'Categoría'

  const sanityProducts = await client.fetch(PRODUCTS_QUERY).catch(() => [])
  
  // Format Sanity products to match the mock product structure
  const formattedSanityProducts = sanityProducts.map((p: any) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category,
    image: p.imageUrl,
    rating: p.rating || 0
  }))

  const allProducts = formattedSanityProducts.length > 0 ? formattedSanityProducts : mockProducts

  // Filter: only show products that belong to this category
  const filteredProducts = allProducts.filter(
    (p: any) => p.category === categoryName
  )

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pb-24">
        
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
                <CategorySidebar />
              </Suspense>
            </div>

            {/* Main Content Column */}
            <div className="col-span-1 md:col-span-3">
              <CategoryProductGrid products={filteredProducts} />
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}

