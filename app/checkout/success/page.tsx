import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { adminClient } from '@/sanity/lib/adminClient'
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { processOrderEmails } from '@/lib/emails'
// Eliminado el PurchaseTracker del frontend porque ahora se hace en el webhook

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const transactionId = searchParams.ref as string | undefined

  let orderValue = 0
  let orderContentIds: string[] = []
  let orderContents: any[] = []
  let orderId = ''

  if (transactionId) {
    try {
      // Validar la transacción con Wompi para mayor seguridad y obtener la referencia de Sanity
      const isTest = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY?.startsWith('pub_test_')
      const wompiUrl = isTest ? 'https://sandbox.wompi.co/v1' : 'https://production.wompi.co/v1'
      
      const response = await fetch(`${wompiUrl}/transactions/${transactionId}`, { cache: 'no-store' })
      if (response.ok) {
        const result = await response.json()
        const transaction = result.data
        if (transaction && transaction.status && transaction.reference) {
          orderValue = transaction.amount_in_cents / 100
          
          // Obtener orden
          const order = await adminClient.getDocument(transaction.reference)
          
          if (order) {
            orderId = order._id
            if (order.cart) {
              orderContentIds = (order.cart as any[]).map((item: any) => item.id)
              orderContents = (order.cart as any[]).map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                item_price: item.price
              }))
            }

            if (!order.emailSent) {
              // Actualizar Sanity
              await adminClient.patch(transaction.reference).set({ 
                status: transaction.status, 
                wompiReference: transaction.id,
                emailSent: true
              }).commit()
              
              // Obtener configuración global (logo y email admin)
              const settings = await adminClient.fetch(GLOBAL_SETTINGS_QUERY)
              
              // Procesar envío de correos
              await processOrderEmails(order, settings, transaction.status)
            }
          }
        }
      }
    } catch (e) {
      console.error('Error sincronizando la orden en la página de éxito:', e)
    }
  }

  const displayReference = transactionId || 'Desconocida'

  return (
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
            <p className="font-mono text-neutral-900 font-medium">{displayReference}</p>
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
  )
}
