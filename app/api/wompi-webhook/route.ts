import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Webhook de Wompi recibido:', body)

    const eventName = body.event
    if (eventName === 'transaction.updated') {
      const transaction = body.data.transaction
      const status = transaction.status // 'APPROVED', 'DECLINED', 'ERROR', etc.
      const reference = transaction.reference // El ID de la orden que enviamos
      
      console.log(`Transacción ${transaction.id} para referencia ${reference} está en estado: ${status}`)

      // ==========================================
      // TODO: INTEGRACIÓN CON SANITY
      // ==========================================
      // 1. Buscar la orden en Sanity usando el 'reference'.
      // 2. Actualizar el estado de la orden (ej. de 'PENDING' a 'PAID' si status es 'APPROVED').
      // 
      // const sanityToken = process.env.SANITY_API_TOKEN
      // const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      // if (status === 'APPROVED') {
      //   await sanityClient.patch(orderDocumentId).set({ status: 'PAID' }).commit()
      // }

      // ==========================================
      // TODO: INTEGRACIÓN CON RESEND
      // ==========================================
      // 1. Obtener el email del cliente (posiblemente de Sanity o de Wompi si lo incluye).
      // 2. Si el pago fue aprobado, enviar un email de "Confirmación de Pedido".
      // 
      // const resendApiKey = process.env.RESEND_API_KEY
      // if (status === 'APPROVED') {
      //   await resend.emails.send({
      //     from: 'ventas@anbarhome.com',
      //     to: customerEmail,
      //     subject: 'Confirmación de tu pedido',
      //     html: '<p>Gracias por tu compra...</p>'
      //   })
      // }
    }

    // Wompi requiere un HTTP 200 OK para confirmar recepción
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Error procesando el webhook de Wompi:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
