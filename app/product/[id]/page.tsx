import type { Metadata, ResolvingMetadata } from 'next'
import { ProductImageZoom } from '@/components/product-image-zoom'
import { notFound } from 'next/navigation'
import { ProductActions } from './product-actions'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { FeaturedProducts } from '@/components/featured-products'
import { ProductTabs } from '@/components/product-tabs'
import { ProductReviews } from '@/components/product-reviews'
import { client } from '@/sanity/lib/client'
import { PRODUCT_BY_ID_QUERY, LATEST_PRODUCTS_QUERY, REVIEWS_BY_PRODUCT_QUERY } from '@/sanity/lib/queries'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const sanityProduct = await client.fetch(PRODUCT_BY_ID_QUERY, { id: resolvedParams.id }).catch(() => null)
  
  if (!sanityProduct) {
    return {
      title: 'Producto no encontrado'
    }
  }

  const plainDescription = sanityProduct.description 
    ? sanityProduct.description.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160) 
    : `Compra ${sanityProduct.name} en Anbar Home.`

  return {
    title: sanityProduct.name,
    description: plainDescription,
    openGraph: {
      title: sanityProduct.name,
      description: plainDescription,
      images: [
        {
          url: sanityProduct.imageUrl || '',
        },
      ],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const sanityProduct = await client.fetch(PRODUCT_BY_ID_QUERY, { id: resolvedParams.id })

  if (!sanityProduct) {
    notFound()
  }

  const product = {
    id: sanityProduct._id,
    name: sanityProduct.name,
    price: sanityProduct.price,
    originalPrice: sanityProduct.originalPrice,
    category: sanityProduct.category,
    image: sanityProduct.imageUrl,
    rating: sanityProduct.rating || 0,
    ratingCount: sanityProduct.ratingCount || 0,
    description: sanityProduct.description
  }

  const reviews = await client.fetch(REVIEWS_BY_PRODUCT_QUERY, { productId: sanityProduct._id })

  // Format currency
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price)

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(product.originalPrice)
    : null

  const rawLatestProducts = await client.fetch(LATEST_PRODUCTS_QUERY).catch(() => [])
  
  const latestProducts = rawLatestProducts.map((p: any) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category,
    image: p.imageUrl,
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
            '@type': 'Product',
            name: product.name,
            image: product.image,
            description: product.description ? product.description.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim() : product.name,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'COP',
              price: product.price,
              availability: 'https://schema.org/InStock',
              url: `https://anbarhome.com/product/${product.id}`,
            }
          })
        }}
      />
      <main className="min-h-screen bg-[#fdfbf7] pt-12 selection:bg-camel/20">
        <article className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20 items-start lg:pt-8">
            
            {/* Image Gallery Column (Seamless open) */}
            <div className="flex flex-col lg:sticky lg:top-28">
              <ProductImageZoom src={product.image} alt={product.name} />
            </div>

            {/* Product Details Column (Open & Luxurious) */}
            <div className="flex flex-col lg:py-10 pr-0 lg:pr-10">
              
              {/* Breadcrumb / Category */}
              <div className="mb-8 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-neutral-500 font-medium">
                <span className="hover:text-neutral-950 cursor-pointer transition-colors">Inicio</span>
                <span className="h-px w-6 bg-neutral-300"></span>
                <span className="text-camel-dark">{product.category}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] text-neutral-950 mb-8 tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-end gap-5 mb-10">
                <span className="font-sans text-2xl lg:text-3xl font-normal tracking-wide text-camel-dark">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="mb-0.5 font-sans text-lg font-light text-neutral-400 line-through">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="h-[1px] w-full bg-neutral-200/60 mb-4" />

              {/* Actions (Add to Cart / Favorites) */}
              <div className="mb-6">
                <ProductActions product={product} />
              </div>

            </div>
          </div>

          {/* Product Tabs (Description & Info) */}
          <ProductTabs description={product.description} />

          {/* Product Reviews */}
          <ProductReviews 
            productId={product.id}
            reviews={reviews}
            initialRating={product.rating}
            ratingCount={product.ratingCount}
          />
        </article>

        {/* Featured Products */}
        <div className="border-t border-neutral-200/40">
          <FeaturedProducts products={latestProducts} />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
