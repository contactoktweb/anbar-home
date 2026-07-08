import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const reference = searchParams.ref || 'Desconocida'

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-32 pb-24 bg-white flex items-center justify-center">
        <div className="max-w-xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center mb-8">
            <CheckCircle className="w-20 h-20 text-camel-dark" strokeWidth={1} />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-neutral-900 leading-tight">
              ¡Gracias por tu compra!
            </h1>
            <p className="text-neutral-500 font-light text-lg">
              Tu pago ha sido aprobado exitosamente. Estamos preparando tu pedido con mucho cuidado.
            </p>
          </div>

          <div className="bg-neutral-50 p-6 rounded-md border border-neutral-100 mt-8">
            <p className="text-sm text-neutral-500 uppercase tracking-widest mb-2">Referencia de transacción</p>
            <p className="font-mono text-neutral-900 font-medium">{reference}</p>
          </div>

          <div className="pt-8">
            <Link 
              href="/"
              className="inline-block bg-camel-dark px-10 py-4 text-[14px] font-medium uppercase tracking-[0.1em] text-white hover:bg-neutral-900 transition-colors rounded-md shadow-sm"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
