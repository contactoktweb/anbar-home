import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'

export async function POST(request: Request) {
  try {
    const { code, email } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Por favor ingresa un código de descuento.' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { valid: false, error: 'Por favor ingresa tu correo electrónico en los datos de contacto antes de aplicar el cupón.' },
        { status: 400 }
      )
    }

    const cleanCode = code.trim().toUpperCase()
    const cleanEmail = email.trim().toLowerCase()

    // Buscar cupón en Sanity
    const coupon = await adminClient.fetch(
      `*[_type == "discountCoupon" && upper(code) == $code][0]`,
      { code: cleanCode }
    )

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: 'El código de descuento no es válido o no existe.' },
        { status: 404 }
      )
    }

    if (coupon.isUsed) {
      return NextResponse.json(
        { valid: false, error: 'Este código de descuento ya fue canjeado en una compra anterior.' },
        { status: 400 }
      )
    }

    // Verificar si el correo coincide exactamente
    if (coupon.email && coupon.email.toLowerCase() !== cleanEmail) {
      return NextResponse.json(
        {
          valid: false,
          error: `Este código de descuento es de uso exclusivo para el correo ${coupon.email}. Asegúrate de ingresar ese correo en la información de contacto.`,
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage || 10,
      message: `¡Cupón del ${coupon.discountPercentage || 10}% aplicado con éxito!`,
    })
  } catch (error) {
    console.error('Error al validar cupón:', error)
    return NextResponse.json(
      { valid: false, error: 'Error al verificar el cupón. Intenta nuevamente.' },
      { status: 500 }
    )
  }
}
