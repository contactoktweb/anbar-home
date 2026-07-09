import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { XCircle } from 'lucide-react'

export default async function CheckoutErrorPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const status = searchParams.status || 'ERROR'
  const reference = searchParams.ref || 'Desconocida'

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-32 pb-24 bg-white flex items-center justify-center">
        <div className="max-w-xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center mb-8">
            <XCircle className="w-20 h-20 text-red-800/80" strokeWidth={1} />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-neutral-900 leading-tight">
              Hubo un problema
            </h1>
            <p className="text-neutral-500 font-light text-lg">
              Lo sentimos, tu pago no pudo ser procesado o fue declinado por tu entidad bancaria.
            </p>
          </div>

          <div className="bg-neutral-50 p-6 rounded-md border border-neutral-100 mt-8 space-y-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Estado</p>
              <p className="font-medium text-neutral-900">{status}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Referencia</p>
              <p className="font-mono text-neutral-900 text-sm">{reference}</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/checkout"
              className="inline-block bg-camel-dark px-10 py-4 text-[14px] font-medium uppercase tracking-[0.1em] text-white hover:bg-neutral-900 transition-colors rounded-md shadow-sm w-full sm:w-auto"
            >
              Intentar de nuevo
            </Link>
            <Link 
              href="/"
              className="inline-block bg-white border border-neutral-200 px-10 py-4 text-[14px] font-medium uppercase tracking-[0.1em] text-neutral-900 hover:bg-neutral-50 transition-colors rounded-md w-full sm:w-auto"
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
