import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { sendDiscountCouponEmail } from '@/lib/emails'
import { subscribeProfileToKlaviyo } from '@/lib/klaviyo/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Por favor ingresa un correo electrónico válido.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // 1. Verificar si ya existe un cupón para este correo
    const existingCoupons = await adminClient.fetch(
      `*[_type == "discountCoupon" && lower(email) == $email] | order(createdAt desc)`,
      { email: normalizedEmail }
    )

    let couponCode = ''

    if (existingCoupons && existingCoupons.length > 0) {
      const activeCoupon = existingCoupons.find((c: any) => !c.isUsed)
      if (activeCoupon) {
        couponCode = activeCoupon.code
      }
    }

    // 2. Si no tiene cupón activo, generar uno nuevo
    if (!couponCode) {
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase()
      couponCode = `ANBAR10-${randomSuffix}`

      await adminClient.create({
        _type: 'discountCoupon',
        email: normalizedEmail,
        code: couponCode,
        discountPercentage: 10,
        isUsed: false,
        createdAt: new Date().toISOString(),
      })
    }

    // 3. Obtener logo de configuración global y enviar correo
    const settings = await adminClient.fetch(GLOBAL_SETTINGS_QUERY).catch(() => null)
    const logoUrl = settings?.logoUrl

    await sendDiscountCouponEmail({
      email: normalizedEmail,
      couponCode,
      logoUrl,
    })

    // 4. Suscribir y registrar consentimiento de marketing en Klaviyo
    try {
      await subscribeProfileToKlaviyo({
        email: normalizedEmail,
        customProperties: {
          signup_source: 'discount_modal_10_percent',
          discount_coupon: couponCode,
        },
      })
    } catch (klaviyoErr) {
      console.error('Aviso: Error no crítico al suscribir en Klaviyo:', klaviyoErr)
    }

    return NextResponse.json({
      success: true,
      code: couponCode,
      message: '¡Cupón enviado con éxito a tu correo electrónico!',
    })
  } catch (error) {
    console.error('Error al suscribir y generar cupón de descuento:', error)
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.' },
      { status: 500 }
    )
  }
}
