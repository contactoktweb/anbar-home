import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, data, signature, timestamp } = body
    
    // Webhook validation
    const eventsKey = process.env.WOMPI_EVENTS_KEY
    if (!eventsKey) {
      console.error('WOMPI_EVENTS_KEY no configurado en variables de entorno')
      return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 })
    }

    if (signature && signature.properties && signature.checksum) {
      // Wompi requires concatenating the values in the order specified by signature.properties
      let concatenatedValues = ''
      
      for (const property of signature.properties) {
        // properties are usually like "transaction.id", "transaction.status"
        const keys = property.split('.')
        let value: any = body.data
        for (const k of keys) {
          if (value) value = value[k]
        }
        concatenatedValues += `${value}`
      }
      
      // Append timestamp and eventsKey
      const stringToHash = `${concatenatedValues}${timestamp}${eventsKey}`
      
      // Generate SHA256 hash
      const encondedText = new TextEncoder().encode(stringToHash)
      const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const expectedChecksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      if (expectedChecksum !== signature.checksum) {
        console.error('Firma de webhook de Wompi inválida', { expectedChecksum, receivedChecksum: signature.checksum })
        return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
      }
    }

    // Aquí procesas el evento del webhook (ej: actualizar el estado de la orden en la base de datos)
    if (event === 'transaction.updated') {
      const transaction = data.transaction
      console.log(`Transacción de Wompi actualizada: ${transaction.id} - Estado: ${transaction.status}`)
      
      if (transaction.status === 'APPROVED') {
        // TODO: Marcar la orden como pagada y enviar correo de confirmación
        console.log(`✅ Orden ${transaction.reference} pagada con éxito.`)
      }
    }

    return NextResponse.json({ status: 'success' })
    
  } catch (error) {
    console.error('Error procesando el webhook de Wompi:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
