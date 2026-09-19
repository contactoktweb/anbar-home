export const revalidate = 60

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { CategoryHeroBanner } from '@/components/category-hero-banner'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CategorySidebar } from '@/components/category-sidebar'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { RecentlyViewedProducts } from '@/components/recently-viewed-products'

import { client } from '@/sanity/lib/client'
import { PRODUCTS_QUERY, CATEGORIES_QUERY, HOME_PAGE_QUERY, HIDDEN_CATEGORY_SLUGS } from '@/sanity/lib/queries'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug === 'accesorios-decorativos' || resolvedParams.slug === 'accesorios' ? 'acentos-decorativos' : resolvedParams.slug

  if (HIDDEN_CATEGORY_SLUGS.includes(slug)) {
    return {
      title: 'Colección Exclusiva | Anbar Home',
      robots: { index: false, follow: false },
    }
  }

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

  if (HIDDEN_CATEGORY_SLUGS.includes(slug)) {
    redirect('/category/todos-los-productos')
  }

  // Fetch all products, categories and homepage data from Sanity
  const [sanityProducts, sanityCategories, homeData] = await Promise.all([
    client.fetch(PRODUCTS_QUERY).catch(() => []),
    client.fetch(CATEGORIES_QUERY).catch(() => []),
    client.fetch(HOME_PAGE_QUERY).catch(() => null)
  ])
  
  // Find current category name
  const currentCategory = sanityCategories.find((c: any) => c.slug === slug)
  let categoryName = currentCategory ? currentCategory.title : 'Tienda'
  if (slug === 'todos-los-productos' || slug === 'todos') {
    categoryName = 'Todos los productos'
  } else if (slug === 'summer-sale' || slug === 'sale') {
    categoryName = 'SALE'
  } else if (slug === 'esferas-navidenas') {
    categoryName = 'Esferas Navideñas'
  } else if (slug === 'animales') {
    categoryName = 'Animales'
  } else if (slug === 'piezas-grandes-premium') {
    categoryName = 'Piezas Grandes Premium'
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
    rating: p.rating || 0,
    description: p.description,
    stock: p.stock,
    isLastUnits: p.isLastUnits === true || (typeof p.stock === 'number' && p.stock > 0 && p.stock <= 5),
    isBestSeller: Boolean(p.isBestSeller),
    availability: p.availability
  }))

  const allProducts = formattedSanityProducts
  
  // Filter products by any of their categorySlugs matching the URL slug
  let filteredProducts = allProducts.filter((product: any) => {
    if ((product.categorySlugs || []).includes(slug)) return true

    // Fallbacks inteligentes para colecciones de temporada destacadas
    const text = `${product.name} ${product.description || ''}`.toLowerCase()
    if (slug === 'esferas-navidenas') {
      return text.includes('esfera') || text.includes('burbuja') || text.includes('bola')
    }
    if (slug === 'animales') {
      return /animal|reno|oso|caballo|ciervo|ave|ardilla|venado|pajaro|conejo/i.test(text)
    }
    if (slug === 'piezas-grandes-premium') {
      return (product.categorySlugs || []).includes('navidad-premium') || /grande|majestuoso|gigante|xxl|versalles|imperial/i.test(text)
    }
    return false
  })

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

  // Category banner from Sanity category document
  const categoryBanner = currentCategory?.bannerDesktop
    ? {
        src: currentCategory.bannerDesktop,
        srcMobile: currentCategory.bannerMobile,
      }
    : null

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pb-20">
        <CategoryHeroBanner
          data={homeData}
          currentSlug={slug}
          categoryName={categoryName}
          categoryBanner={categoryBanner}
        />

        <div className="mx-auto max-w-7xl px-6 md:px-10 mt-10 md:mt-14">
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

        {/* Recently Viewed Products */}
        <div className="mt-16 md:mt-24">
          <RecentlyViewedProducts />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}

