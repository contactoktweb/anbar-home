export const revalidate = 60

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CategorySidebar } from '@/components/category-sidebar'
import { CategoryProductGrid } from '@/components/category-product-grid'

import { client } from '@/sanity/lib/client'
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug === 'accesorios-decorativos' || resolvedParams.slug === 'accesorios' ? 'acentos-decorativos' : resolvedParams.slug

  let categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  if (slug === 'todos-los-productos' || slug === 'todos') {
    categoryName = 'Todos los productos'
  } else if (slug === 'summer-sale' || slug === 'sale') {
    categoryName = 'SALE'
  }

  const title = `${categoryName} | Colección Exclusiva`
  const description = slug === 'todos-los-productos' || slug === 'todos'
    ? 'Explora nuestro catálogo completo de piezas exclusivas y decoración para el hogar en Anbar Home Colombia.'
    : `Explora nuestra colección de ${categoryName.toLowerCase()} en Anbar Home. Piezas únicas y atemporales para la decoración de tu hogar en Colombia.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://anbarhome.com/category/${slug}`,
    }
  }
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ maxPrice?: string }> }) {
  const { slug } = await params
  const { maxPrice } = await searchParams

  if (slug === 'accesorios-decorativos' || slug === 'accesorios') {
    redirect('/category/acentos-decorativos')
  }

  // Fetch all products and categories from Sanity
  const [sanityProducts, sanityCategories] = await Promise.all([
    client.fetch(PRODUCTS_QUERY).catch(() => []),
    client.fetch(CATEGORIES_QUERY).catch(() => [])
  ])
  
  // Find current category name
  const currentCategory = sanityCategories.find((c: any) => c.slug === slug)
  let categoryName = currentCategory ? currentCategory.title : 'Tienda'
  if (slug === 'todos-los-productos' || slug === 'todos') {
    categoryName = 'Todos los productos'
  } else if (slug === 'summer-sale' || slug === 'sale') {
    categoryName = 'SALE'
  }

  // Format sidebar categories (guaranteeing a single SALE link)
  const sidebarCategories = [
    { name: 'Todos los productos', href: '/category/todos-los-productos' },
    ...sanityCategories
      .filter((c: any) => {
        const titleUpper = (c.title || '').toUpperCase().replace(/\s+/g, '')
        return c.slug !== 'todos-los-productos' && c.slug !== 'uncategorized' && c.slug !== 'summer-sale' && c.slug !== 'sale' && titleUpper !== 'SALE'
      })
      .map((c: any) => ({
        name: c.title,
        href: `/category/${c.slug}`
      })),
    { name: 'SALE', href: '/category/sale' }
  ]

  // Format Sanity products to match our internal Product type
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

  const allProducts = formattedSanityProducts
  
  // Filter products by any of their categorySlugs matching the URL slug
  let filteredProducts = allProducts.filter((product: any) =>
    (product.categorySlugs || []).includes(slug)
  )

  // Override for all products: return all products in the store
  if (slug === 'todos-los-productos' || slug === 'todos') {
    filteredProducts = allProducts
  }

  // Override for Summer Sale & SALE: show all products with discounts
  if (slug === 'summer-sale' || slug === 'sale') {
    filteredProducts = allProducts.filter((product: any) => product.originalPrice && product.originalPrice > product.price)
  }

  // Filter by price if provided
  if (maxPrice) {
    const max = parseInt(maxPrice, 10)
    if (!isNaN(max)) {
      filteredProducts = filteredProducts.filter((product: any) => product.price <= max)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pb-20">
        
        {/* Banner with dynamically fetched category name */}
        <div className="w-full bg-[#C19A6B] py-12 text-center mb-16 shadow-inner">
          <h1 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase">
            {categoryName}
          </h1>
          <p className="text-white/80 mt-2 font-light tracking-wide">
            Encuentra la pieza perfecta para tu espacio
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            <div className="hidden md:block md:col-span-1">
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-100 rounded-lg"></div>}>
                <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-8">
                  <CategorySidebar categories={sidebarCategories} />
                </div>
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

