import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { adminClient } from '@/sanity/lib/adminClient'
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { processOrderEmails } from '@/lib/emails'
import { PurchaseTracker } from '@/components/ui/purchase-tracker'
import { trackServerPlacedOrder, trackServerOrderedProducts } from '@/lib/klaviyo/server'
import { optimizeImageUrl } from '@/lib/utils'
// Restaurado PurchaseTracker con eventId para deduplicación con el webhook

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const transactionId = (searchParams.id || searchParams.ref) as string | undefined

  let orderValue = 0
  let orderContentIds: string[] = []
  let orderContents: any[] = []
  let orderId = ''
  let purchaseEventId = ''
  let purchasedItems: any[] = []
  let userData: any = {}
  let customerInfo: any = null
  let shippingInfo: any = null

  if (transactionId) {
    try {
      // Validar la transacción con Wompi para mayor seguridad y obtener la referencia de Sanity
      const isTest = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY?.startsWith('pub_test_')
      const wompiUrl = isTest ? 'https://sandbox.wompi.co/v1' : 'https://production.wompi.co/v1'
      const wompiKey = process.env.WOMPI_PRIVATE_KEY || process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY

      const headers: Record<string, string> = {}
      if (wompiKey) {
        headers['Authorization'] = `Bearer ${wompiKey.trim()}`
      }

      const response = await fetch(`${wompiUrl}/transactions/${transactionId}`, { 
        cache: 'no-store',
        headers
      })

      if (response.ok) {
        const result = await response.json()
        const transaction = result.data
        if (transaction && transaction.status && transaction.reference) {
          if (transaction.status === 'APPROVED') {
            orderValue = transaction.amount_in_cents ? transaction.amount_in_cents / 100 : 0
          }

          // Obtener orden desde Sanity
          let order = await adminClient.getDocument(transaction.reference)
          if (!order) {
            // Fallback: si por alguna razón no se encontró por ID directo, buscar por reference
            order = await adminClient.fetch(
              `*[_type == "order" && (_id == $ref || wompiReference == $txId || wompiTransactionId == $txId)][0]`,
              { ref: transaction.reference, txId: transactionId }
            )
          }

          if (order) {
            orderId = order._id
            if (!orderValue && order.totalAmount) {
              orderValue = order.totalAmount
            }

            if (order.meta && order.meta.purchaseEventId) {
              purchaseEventId = order.meta.purchaseEventId
            } else {
              purchaseEventId = `purchase_${transaction.reference}`
            }

            userData = {
              em: order.customerEmail,
              ph: order.customerPhone,
              fn: order.customerFirstName,
              ln: order.customerLastName,
              ct: order.shippingAddress?.city,
              st: order.shippingAddress?.department,
              country: 'co'
            }

            customerInfo = {
              name: `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim(),
              email: order.customerEmail,
              phone: order.customerPhone
            }

            shippingInfo = order.shippingAddress

            if (order.items) {
              purchasedItems = order.items
              orderContentIds = (order.items as any[]).map((item: any) => item.sku || item._key)
              orderContents = (order.items as any[]).map((item: any) => ({
                id: item.sku || item._key,
                quantity: item.quantity,
                item_price: item.price
              }))
            }

            let shouldSendEmail = false

            // Determinar si debemos enviar correo basado en el estado final
            if (transaction.status === 'APPROVED' || transaction.status === 'DECLINED' || transaction.status === 'ERROR') {
              shouldSendEmail = !order.emailSent
            }

            // Actualizar Sanity con el estado más reciente
            const updateData: any = {
              status: transaction.status,
              wompiReference: transaction.id,
              wompiTransactionId: transaction.id,
              wompiRawStatus: transaction.status,
              wompiPaymentMethodType: transaction.payment_method_type,
            }
            
            if (shouldSendEmail && transaction.status === 'APPROVED') {
              updateData.emailSent = true
            }

            if (transaction.status === 'APPROVED' && order.status !== 'APPROVED') {
              updateData.paidAt = new Date().toISOString()
            }

            await adminClient.patch(order._id).set(updateData).commit()
            console.log(`Orden ${order._id} actualizada a ${transaction.status} en success page`)

            if (shouldSendEmail) {
              // Obtener configuración global (logo y email admin)
              const settings = await adminClient.fetch(GLOBAL_SETTINGS_QUERY)
              // Procesar envío de correos
              await processOrderEmails(order, settings, transaction.status)
              console.log(`Correo enviado para la orden ${order._id}`)
            }

            // Klaviyo Placed Order (Fallback en caso de que el webhook tarde en llegar)
            if (transaction.status === 'APPROVED' && !order.meta?.klaviyoPlacedOrderSent) {
              try {
                const klaviyoRes = await trackServerPlacedOrder(order)
                await trackServerOrderedProducts(order)
                if (klaviyoRes.success) {
                  await adminClient.patch(order._id).set({
                    'meta.klaviyoPlacedOrderSent': true,
                    'meta.klaviyoPlacedOrderSentAt': new Date().toISOString(),
                  }).commit()
                }
              } catch (klaviyoErr) {
                console.error(`Error enviando orden ${order._id} a Klaviyo en success page:`, klaviyoErr)
              }
            }
          }
        }
      } else {
        console.error('Error fetching Wompi transaction:', response.status, await response.text())
        // Fallback en caso de que la API de Wompi falle temporalmente pero el ID sea una referencia de Sanity
        const order = await adminClient.fetch(
          `*[_type == "order" && (_id == $id || wompiReference == $id || wompiTransactionId == $id)][0]`,
          { id: transactionId }
        )
        if (order) {
          orderId = order._id
          orderValue = order.totalAmount || 0
          purchaseEventId = order.meta?.purchaseEventId || `purchase_${order._id}`
          userData = {
            em: order.customerEmail,
            ph: order.customerPhone,
            fn: order.customerFirstName,
            ln: order.customerLastName,
            ct: order.shippingAddress?.city,
            st: order.shippingAddress?.department,
            country: 'co'
          }
          customerInfo = {
            name: `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim(),
            email: order.customerEmail,
            phone: order.customerPhone
          }
          shippingInfo = order.shippingAddress
          if (order.items) {
            purchasedItems = order.items
            orderContentIds = (order.items as any[]).map((item: any) => item.sku || item._key)
            orderContents = (order.items as any[]).map((item: any) => ({
              id: item.sku || item._key,
              quantity: item.quantity,
              item_price: item.price
            }))
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
      {orderValue > 0 && (
        <PurchaseTracker
          eventId={purchaseEventId}
          orderData={{
            currency: 'COP',
            value: orderValue,
            content_ids: orderContentIds,
            contents: orderContents,
            order_id: transactionId
          }}
          userData={userData}
        />
      )}
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

        <div className="bg-neutral-50 p-6 rounded-md border border-neutral-100 mt-8 space-y-6 text-left max-w-md mx-auto">
          <div className="text-center border-b border-neutral-200 pb-4">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Referencia de transacción</p>
            <p className="font-mono text-neutral-900 font-medium">{displayReference}</p>
          </div>

          {customerInfo && (customerInfo.name || customerInfo.email) && (
            <div className="space-y-2 text-sm border-b border-neutral-200 pb-4">
              <h3 className="font-serif text-base text-neutral-900 font-medium">Información de contacto</h3>
              <div className="text-neutral-600 space-y-1">
                {customerInfo.name && <p><span className="font-medium text-neutral-800">Cliente:</span> {customerInfo.name}</p>}
                {customerInfo.email && <p><span className="font-medium text-neutral-800">Email:</span> {customerInfo.email}</p>}
                {customerInfo.phone && <p><span className="font-medium text-neutral-800">Teléfono:</span> {customerInfo.phone}</p>}
              </div>
            </div>
          )}

          {shippingInfo && shippingInfo.address && (
            <div className="space-y-2 text-sm border-b border-neutral-200 pb-4">
              <h3 className="font-serif text-base text-neutral-900 font-medium">Dirección de envío</h3>
              <p className="text-neutral-600 leading-relaxed">
                {shippingInfo.address}{shippingInfo.apartment ? `, ${shippingInfo.apartment}` : ''}<br />
                {shippingInfo.city}, {shippingInfo.department}<br />
                {shippingInfo.country || 'Colombia'}
              </p>
            </div>
          )}

          {purchasedItems.length > 0 && (
            <div>
              <h3 className="font-serif text-base text-neutral-900 font-medium mb-3">Detalle del pedido</h3>
              <div className="space-y-4">
                {purchasedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-sm">
                    {item.image && (
                      <div className="relative h-14 w-14 flex-shrink-0 bg-white border border-neutral-200 rounded-md overflow-hidden">
                        <Image
                          src={optimizeImageUrl(item.image, 140, 75)}
                          alt={item.name || 'Producto'}
                          fill
                          sizes="56px"
                          quality={75}
                          className="object-cover object-center p-1 mix-blend-multiply"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-sans text-neutral-900 font-medium line-clamp-2">{item.name}</p>
                      <p className="text-neutral-500 mt-0.5 text-xs">Cant: {item.quantity} x {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.price)}</p>
                    </div>
                    <p className="text-neutral-900 font-medium whitespace-nowrap">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t border-neutral-200 pt-4 mt-4">
                <p className="font-medium text-neutral-900 uppercase tracking-widest text-xs">Total Pagado</p>
                <p className="font-medium text-lg text-neutral-900">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(orderValue)}
                </p>
              </div>
            </div>
          )}
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
