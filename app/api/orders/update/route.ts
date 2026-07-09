import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reference, status, wompiReference } = body

    if (!reference || !status) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Actualizar el estado de la orden en Sanity
    await adminClient.patch(reference).set({ 
      status: status, 
      wompiReference: wompiReference 
    }).commit()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error al actualizar el pedido desde el cliente:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
