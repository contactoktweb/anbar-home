import { ProductImageZoom } from '@/components/product-image-zoom'
import { notFound } from 'next/navigation'
import { mockProducts } from '@/lib/mock-products'
import { ProductActions } from './product-actions'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

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
      <main className="min-h-screen bg-white pt-10 pb-10 selection:bg-camel/20">
      <article className="mx-auto max-w-5xl px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start lg:pt-8">
          
          {/* Image Gallery Column */}
          <div className="flex flex-col gap-10 lg:sticky lg:top-28">
            <ProductImageZoom src={product.image} alt={product.name} />
            
            {/* Extra Info Horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-neutral-100 px-4 lg:px-8">
              <div className="group">
                <h3 className="font-serif text-[1.05rem] text-neutral-800 group-hover:text-camel transition-colors">Detalles de envío</h3>
                <p className="mt-3 text-[0.85rem] text-neutral-500 font-light leading-relaxed">
                  Envíos estándar de 3 a 5 días hábiles a nivel nacional.
                </p>
              </div>
              <div className="group">
                <h3 className="font-serif text-[1.05rem] text-neutral-800 group-hover:text-camel transition-colors">Cuidados especiales</h3>
                <p className="mt-3 text-[0.85rem] text-neutral-500 font-light leading-relaxed">
                  Limpiar con un paño seco y suave. Evitar el contacto directo con la humedad.
                </p>
              </div>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col">
            
            {/* Breadcrumb / Category */}
            <div className="mb-6 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-neutral-400">
              <span className="hover:text-camel cursor-pointer transition-colors">Inicio</span>
              <span className="h-px w-6 bg-neutral-200"></span>
              <span className="text-camel font-medium">{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-neutral-900 mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-4 mb-8">
              <span className="font-sans text-2xl font-normal tracking-wide text-neutral-800">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="mb-0.5 font-sans text-lg font-light text-neutral-400 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="h-[1px] w-full bg-neutral-100 mb-8" />

            {/* Description / Content */}
            <div className="space-y-5 text-[0.95rem] leading-[1.8] text-neutral-500 font-light text-justify pr-4">
              <p>
                Una pieza excepcional que refleja la esencia del diseño interior más humano y orgánico. 
                Elaborado con atención al detalle, este producto añade una capa de sofisticación y calma a cualquier espacio.
              </p>
              <p>
                Sus texturas y acabados rinden homenaje a las formas clásicas, integrándose de manera fluida 
                tanto en decoraciones contemporáneas como minimalistas.
              </p>
            </div>

            {/* Actions (Add to Cart / Favorites) */}
            <div className="mt-10 mb-4">
              <ProductActions product={product} />
            </div>

          </div>
        </div>
      </article>
    </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
