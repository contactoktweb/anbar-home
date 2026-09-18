export const revalidate = 60

import type { Metadata, ResolvingMetadata } from 'next'
import { ProductImageZoom } from '@/components/product-image-zoom'
import { notFound } from 'next/navigation'
import { ProductActions } from './product-actions'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { ProductTabs } from '@/components/product-tabs'
import { ProductReviews } from '@/components/product-reviews'
import { ProductPurchaseBenefits } from '@/components/product-purchase-benefits'
import { ProductPaymentMethods } from '@/components/product-payment-methods'
import { ProductTracker } from '@/components/ui/product-tracker'
import { RecentlyViewedTracker } from '@/components/recently-viewed-tracker'
import { RecentlyViewedProducts } from '@/components/recently-viewed-products'
import { StickyMobileCta } from '@/components/sticky-mobile-cta'
import { ProductRecommendationCarousels } from '@/components/product-recommendation-carousels'
import { getProductRecommendations } from '@/lib/recommendations'
import { ShareButtons } from '@/components/share-buttons'
import { isChristmasProduct } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { PRODUCT_BY_SLUG_QUERY, PRODUCTS_QUERY, REVIEWS_BY_PRODUCT_QUERY } from '@/sanity/lib/queries'
import { slugify } from '@/sanity/lib/slugify'

function getSlugVariations(rawSlug: string) {
  let decoded = rawSlug || ''
  try {
    decoded = decodeURIComponent(rawSlug)
  } catch {}
  return {
    slug: rawSlug,
    cleanSlug: slugify(decoded),
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const { slug, cleanSlug } = getSlugVariations(resolvedParams.slug)
  const sanityProduct = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug, cleanSlug }).catch(() => null)
  
  if (!sanityProduct) {
    return {
      title: 'Producto no encontrado'
    }
  }

  const plainDescription = sanityProduct.description 
    ? sanityProduct.description.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160) 
    : `Compra ${sanityProduct.name} en Anbar Home.`

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.com'
  const productUrl = `${siteUrl}/product/${sanityProduct.slug}`

  return {
    title: sanityProduct.name,
    description: plainDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: sanityProduct.name,
      description: plainDescription,
      url: productUrl,
      images: [
        {
          url: sanityProduct.imageUrl || '',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: sanityProduct.name,
      description: plainDescription,
      images: [sanityProduct.imageUrl || ''],
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug, cleanSlug } = getSlugVariations(resolvedParams.slug)
  
  const sanityProduct = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug, cleanSlug })

  if (!sanityProduct) {
    notFound()
  }

  const isLastUnits = Boolean(
    sanityProduct.isLastUnits === true ||
    (typeof sanityProduct.stock === 'number' && sanityProduct.stock > 0 && sanityProduct.stock <= 5)
  )

  const isBestSeller = Boolean(
    sanityProduct.isBestSeller === true ||
    (!isLastUnits && (sanityProduct.ratingCount >= 3 || sanityProduct.rating >= 4.8))
  )

  const product = {
    id: sanityProduct._id,
    sku: sanityProduct.sku,
    slug: sanityProduct.slug,
    name: sanityProduct.name,
    price: sanityProduct.price,
    originalPrice: sanityProduct.originalPrice,
    category: sanityProduct.category || '',
    categories: sanityProduct.categories || [],
    categorySlugs: sanityProduct.categorySlugs || [],
    image: sanityProduct.imageUrl,
    images: sanityProduct.images || [],
    rating: sanityProduct.rating || 0,
    ratingCount: sanityProduct.ratingCount || 0,
    description: sanityProduct.description,
    stock: sanityProduct.stock,
    isLastUnits,
    isBestSeller
  }

  const isChristmas = isChristmasProduct(product)

  const reviews = await client.fetch(REVIEWS_BY_PRODUCT_QUERY, { productId: sanityProduct._id })

  // Format currency
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })
    .format(product.price)
    .replace(/\s+/g, '')

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      })
        .format(product.originalPrice)
        .replace(/\s+/g, '')
    : null

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const rawAllProducts = await client.fetch(PRODUCTS_QUERY).catch(() => [])
  
  const allProducts = rawAllProducts.map((p: any) => ({
    id: p._id,
    sku: p.sku,
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
    isBestSeller: Boolean(p.isBestSeller)
  }))

  const { similarProducts, complementaryProducts } = getProductRecommendations(product, allProducts)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.com'
  const productUrl = `${siteUrl}/product/${product.slug}`

  return (
    <>
      <ProductTracker product={product} />
      <RecentlyViewedTracker product={product} />
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
              url: `https://anbarhome.com/product/${product.slug}`,
            }
          })
        }}
      />
      <main className="min-h-screen bg-[#fdfbf7] pt-12 selection:bg-camel/20">
        <article className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20 items-start lg:pt-8">
            
            {/* Image Gallery Column (Seamless open) */}
            <div className="flex flex-col lg:sticky lg:top-28">
              <ProductImageZoom 
                src={product.image} 
                images={product.images} 
                alt={product.name} 
                isLastUnits={isLastUnits}
                isBestSeller={isBestSeller}
                isChristmas={isChristmas}
              />
            </div>

            {/* Product Details Column (Open & Luxurious) */}
            <div className="flex flex-col lg:py-10 pr-0 lg:pr-10">
              
              {/* Breadcrumb / Category & Badges */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-neutral-500 font-medium">
                  <span className="hover:text-neutral-950 cursor-pointer transition-colors">Inicio</span>
                  <span className="h-px w-6 bg-neutral-300"></span>
                  <span className="text-camel-dark">{product.category}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {isChristmas && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#7A1A28]/25 bg-gradient-to-r from-[#7A1A28]/10 via-[#7A1A28]/5 to-transparent px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase text-[#7A1A28] shadow-xs">
                      <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                      Edición Navideña
                    </div>
                  )}

                  {isBestSeller ? (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase text-amber-900 shadow-xs">
                      <span className="text-amber-600 font-bold">★</span>
                      Más Vendido
                    </div>
                  ) : isLastUnits ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-camel/35 bg-camel/10 px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase text-camel-dark shadow-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-camel opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-camel-dark"></span>
                      </span>
                      Últimas unidades
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Title */}
              <h1 
                title={product.name}
                className="font-sans text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.2] text-neutral-950 mb-3 tracking-tight line-clamp-2"
              >
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="font-sans text-2xl lg:text-3xl font-normal tracking-wide text-camel-dark">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <div className="flex items-center gap-2.5">
                    <span className="font-sans text-lg font-light text-neutral-400 line-through">
                      {formattedOriginalPrice}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="bg-camel-dark px-2 py-0.5 text-[11px] font-semibold tracking-wider text-white">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-[1px] w-full bg-neutral-200/60 mb-4" />

              {/* Actions (Add to Cart / Favorites) */}
              <div className="mb-2">
                <ProductActions product={product} isChristmas={isChristmas} />
              </div>

              {/* Medios de Pago */}
              <div className="mb-6">
                <ProductPaymentMethods />
              </div>

              {/* Share Buttons */}
              <ShareButtons url={productUrl} title={product.name} />

            </div>
          </div>

          {/* Proceso de Compra y Beneficios de Confianza */}
          <ProductPurchaseBenefits />

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

        {/* Recommended Products: También te pueden gustar & Combínalo con */}
        <ProductRecommendationCarousels
          similarProducts={similarProducts}
          complementaryProducts={complementaryProducts}
        />

        {/* Recently Viewed Products */}
        <RecentlyViewedProducts excludeId={product.id} />
      </main>
      <StickyMobileCta product={product} />
      <SiteFooter />
      <WhatsAppButton className="bottom-20 md:bottom-7" />
    </>
  )
}
