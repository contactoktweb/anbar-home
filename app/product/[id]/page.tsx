import { ProductImageZoom } from '@/components/product-image-zoom'
import { notFound } from 'next/navigation'
import { mockProducts } from '@/lib/mock-products'
import { ProductActions } from './product-actions'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { FeaturedProducts } from '@/components/featured-products'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const product = mockProducts.find((p) => p.id === resolvedParams.id)

  if (!product) {
    notFound()
  }

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

  return (
    <>
      <SiteHeader />
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
              <div className="h-[1px] w-full bg-neutral-200/60 mb-8" />

              {/* Description / Content */}
              <div className="space-y-6 text-[0.95rem] lg:text-[1rem] leading-[1.9] text-neutral-600 font-light text-justify pr-4">
                <p>
                  Una pieza excepcional que refleja la esencia del diseño interior más humano y orgánico. 
                  Elaborado con atención al detalle, este producto añade una capa de sofisticación y calma a cualquier espacio.
                </p>
                <p>
                  Sus texturas y acabados rinden homenaje a las formas clásicas, integrándose de manera fluida 
                  tanto en decoraciones contemporáneas como minimalistas. Eleva tu entorno con este símbolo de lujo silencioso.
                </p>
              </div>

              {/* Actions (Add to Cart / Favorites) */}
              <div className="mt-12 mb-10">
                <ProductActions product={product} />
              </div>

              {/* Extra Info Horizontal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-200/60">
                <div className="group">
                  <h3 className="font-serif text-[1.1rem] text-neutral-950 group-hover:text-camel-dark transition-colors">Detalles de envío</h3>
                  <p className="mt-3 text-[0.85rem] text-neutral-600 font-light leading-relaxed">
                    Envíos estándar de 3 a 5 días hábiles a nivel nacional. Embalaje seguro y premium.
                  </p>
                </div>
                <div className="group">
                  <h3 className="font-serif text-[1.1rem] text-neutral-950 group-hover:text-camel-dark transition-colors">Cuidados especiales</h3>
                  <p className="mt-3 text-[0.85rem] text-neutral-600 font-light leading-relaxed">
                    Limpiar con un paño seco y suave. Evitar el contacto directo con la humedad.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </article>

        {/* Featured Products */}
        <div className="border-t border-neutral-200/40">
          <FeaturedProducts />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
