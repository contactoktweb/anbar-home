import Image from 'next/image'
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
      <main className="min-h-screen bg-white pt-32 pb-24 selection:bg-camel/20">
      <article className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* Image Gallery Column */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col py-6 lg:py-10">
            
            {/* Breadcrumb / Category */}
            <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
              <span>Inicio</span>
              <span className="mx-1 h-px w-4 bg-neutral-300"></span>
              <span>{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl font-normal leading-tight text-neutral-900 md:text-4xl lg:text-[42px]">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-6 flex items-end gap-4">
              <span className="font-sans text-2xl font-light text-neutral-900">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="mb-0.5 font-sans text-lg font-light text-neutral-400 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="my-10 border-neutral-200" />

            {/* Description / Content (Mock) */}
            <div className="space-y-6 text-[15px] leading-relaxed text-neutral-600 font-light text-justify">
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
            <ProductActions product={product} />

            {/* Accordion / Extra Info (Mock) */}
            <div className="mt-16 flex flex-col gap-6">
              <div className="border-b border-neutral-200 pb-4">
                <h3 className="font-serif text-lg text-neutral-900">Detalles de envío</h3>
                <p className="mt-2 text-sm text-neutral-500 font-light">
                  Envíos estándar de 3 a 5 días hábiles a nivel nacional.
                </p>
              </div>
              <div className="border-b border-neutral-200 pb-4">
                <h3 className="font-serif text-lg text-neutral-900">Cuidados especiales</h3>
                <p className="mt-2 text-sm text-neutral-500 font-light">
                  Limpiar con un paño seco y suave. Evitar el contacto directo con la humedad.
                </p>
              </div>
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
