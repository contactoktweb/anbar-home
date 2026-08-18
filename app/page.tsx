export const revalidate = 60

import { SiteHeader } from '@/components/site-header'
import { HeroWow } from '@/components/hero-wow'
import { CategoryGridSection } from '@/components/category-grid-section'
import { FeaturedProducts } from '@/components/featured-products'
import { NewArrivals } from '@/components/new-arrivals'
import { LogoMeaning } from '@/components/logo-meaning'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { client } from '@/sanity/lib/client'
import { HOME_PAGE_QUERY, LATEST_PRODUCTS_QUERY } from '@/sanity/lib/queries'

export default async function Page() {
  const data = await client.fetch(HOME_PAGE_QUERY).catch(() => null)
  
  const latestProducts = await client.fetch(LATEST_PRODUCTS_QUERY).catch(() => [])

  // Si no hay productos destacados seleccionados, obtenemos los últimos del 0 al 8
  const rawFeaturedProducts = data?.featuredProducts?.length > 0 
    ? [...data.featuredProducts].reverse() 
    : latestProducts.slice(0, 8)

  const featuredProducts = rawFeaturedProducts.map((p: any) => ({
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

  // Si no hay nueva colección, obtenemos los últimos del 8 al 16 para que no sean los mismos
  const rawNewArrivals = data?.newArrivalsProducts?.length > 0 
    ? [...data.newArrivalsProducts].reverse() 
    : latestProducts.slice(8, 16)

  const newArrivals = rawNewArrivals.map((p: any) => ({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'Anbar Home',
                url: 'https://anbarhome.com',
                logo: 'https://anbarhome.com/logo-A.png',
                description: 'Anbar Home es una marca de decoración para el hogar. Piezas artesanales, atemporales y serenas en tonos camel y blanco.',
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+57 322 7559139',
                  contactType: 'customer service',
                  areaServed: 'CO',
                  availableLanguage: 'es'
                },
                sameAs: [
                  'https://www.instagram.com/anbar.home/'
                ]
              },
              {
                '@type': 'WebSite',
                name: 'Anbar Home',
                url: 'https://anbarhome.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://anbarhome.com/search?q={search_term_string}',
                  'query-input': 'required name=search_term_string'
                }
              }
            ]
          })
        }}
      />
      <main>
        <HeroWow data={data} />
        <CategoryGridSection data={data} />
        <FeaturedProducts products={featuredProducts} />
        <NewArrivals products={newArrivals} />
        <LogoMeaning data={data} />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
