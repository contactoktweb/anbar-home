import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, cart, cartTotal, meta } = body
    
    // Extract IP and User-Agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    if (!formData || !cart || cart.length === 0) {
      return NextResponse.json({ error: 'Faltan datos del pedido o el carrito está vacío' }, { status: 400 })
    }

    // Crear el documento de la orden en Sanity
    const orderDoc = {
      _type: 'order',
      customerFirstName: formData.firstName,
      customerLastName: formData.lastName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: {
        address: formData.address,
        apartment: formData.apartment || '',
        city: formData.city,
        department: formData.department,
        country: formData.country,
        postalCode: formData.postalCode || '',
      },
      items: cart.map((item: any) => ({
        _key: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cartTotal,
      status: 'PENDING',
      meta: {
        fbp: meta?.fbp || '',
        fbc: meta?.fbc || '',
        clientIp: ip.split(',')[0].trim(),
        clientUserAgent: userAgent,
        eventSourceUrl: meta?.eventSourceUrl || '',
        purchaseSentToMeta: false
      }
    }

    const createdOrder = await adminClient.create(orderDoc)

    return NextResponse.json({ orderId: createdOrder._id }, { status: 201 })
  } catch (error) {
    console.error('Error al crear el pedido en Sanity:', error)
    return NextResponse.json({ error: 'Error interno del servidor al crear el pedido' }, { status: 500 })
  }
}
