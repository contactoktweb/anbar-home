'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/store-provider'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { generateWompiSignature } from './actions'
import { trackEvent, getCookie } from '@/lib/fb-tracking'
import React from 'react'

declare global {
  interface Window {
    WidgetCheckout: any
  }
}

const COLOMBIA_LOCATIONS: Record<string, string[]> = {
  'Bogotá D.C.': ['Bogotá'],
  'Antioquia': ['Medellín', 'Envigado', 'Bello', 'Itagüí', 'Sabaneta', 'Rionegro'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Yumbo', 'Buga'],
  'Cundinamarca': ['Soacha', 'Chía', 'Zipaquirá', 'Mosquera', 'Madrid', 'Facatativá'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia'],
  'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Villa del Rosario', 'Los Patios'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'],
  'Caldas': ['Manizales', 'La Dorada', 'Villamaría', 'Chinchiná'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
  'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'Tebaida'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación'],
  'Cesar': ['Valledupar', 'Aguachica', 'Agustín Codazzi'],
  'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada'],
  'Nariño': ['Pasto', 'Tumaco', 'Ipiales'],
  'Cauca': ['Popayán', 'Santander de Quilichao'],
  'Sucre': ['Sincelejo', 'Corozal', 'San Marcos'],
  'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún']
}

export default function CheckoutPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    country: 'Colombia',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    department: 'Bogotá D.C.',
    city: 'Bogotá',
    postalCode: '',
    phone: '',
    sameAsBilling: true
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Estados para cupón de descuento
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discountPercentage: number
  } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const { cart, clearCart, updateQuantity, removeFromCart } = useStore()

  const checkoutTracked = React.useRef(false)

  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discountAmount = appliedCoupon ? Math.round(cartSubtotal * (appliedCoupon.discountPercentage / 100)) : 0
  const cartTotal = Math.max(0, cartSubtotal - discountAmount)

  useEffect(() => {
    setIsMounted(true)
    if (cart.length > 0 && !checkoutTracked.current) {
      trackEvent('InitiateCheckout', {
        currency: 'COP',
        value: cartTotal,
        num_items: cart.reduce((total, item) => total + item.quantity, 0),
        content_ids: cart.map(item => item.sku || item.id),
        contents: cart.map(item => ({
          id: item.sku || item.id,
          quantity: item.quantity,
          item_price: item.price
        }))
      })
      checkoutTracked.current = true
    }
  }, [cart, cartTotal])

  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  const handleApplyCoupon = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) {
      setCouponError('Por favor ingresa un código de descuento.')
      return
    }
    if (!formData.email || !formData.email.includes('@')) {
      setCouponError('Por favor ingresa tu correo en la información de contacto antes de aplicar el cupón.')
      return
    }

    setIsValidatingCoupon(true)
    setCouponError(null)
    setCouponSuccess(null)

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          email: formData.email.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.valid) {
        throw new Error(data.error || 'Código no válido.')
      }

      setAppliedCoupon({
        code: data.code,
        discountPercentage: data.discountPercentage,
      })
      setCouponSuccess(data.message || `¡Descuento del ${data.discountPercentage}% aplicado!`)
    } catch (err: any) {
      setAppliedCoupon(null)
      setCouponError(err.message || 'Código de descuento no válido.')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponSuccess(null)
    setCouponError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val }
      // If department changes, automatically select the first city of that department
      if (name === 'department') {
        const availableCities = COLOMBIA_LOCATIONS[value as keyof typeof COLOMBIA_LOCATIONS] || []
        newData.city = availableCities.length > 0 ? availableCities[0] : ''
      }
      return newData
    })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY
    const currency = 'COP'

    if (cart.length === 0) {
      alert("Tu carrito está vacío.")
      setIsProcessing(false)
      return
    }

    if (!wompiPublicKey) {
      alert("Error: Falta la llave pública de Wompi.")
      setIsProcessing(false)
      return
    }

    try {
      trackEvent('AddPaymentInfo', {
        currency: 'COP',
        value: cartTotal,
        content_ids: cart.map(item => item.sku || item.id),
        contents: cart.map(item => ({
          id: item.sku || item.id,
          quantity: item.quantity,
          item_price: item.price
        }))
      }, {
        em: formData.email,
        ph: formData.phone,
        fn: formData.firstName,
        ln: formData.lastName,
        ct: formData.city,
        st: formData.department,
        country: 'co' // FB ISO format usually 2 letters
      })

      // Extraer meta fields
      const fbp = getCookie('_fbp')
      const fbc = getCookie('_fbc')
      const eventSourceUrl = window.location.href

      // 1. Crear el pedido en Sanity primero
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formData, 
          cart, 
          cartTotal,
          subtotalAmount: cartSubtotal,
          discountAmount: discountAmount,
          discountCode: appliedCoupon?.code || '',
          meta: { fbp, fbc, eventSourceUrl }
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear el pedido en la base de datos')
      }

      const data = await response.json()
      const sanityOrderId = data.orderId

      // 2. Generar la firma de Wompi usando el ID del pedido de Sanity como referencia
      const realAmountInCents = cartTotal * 100
      const signature = await generateWompiSignature(sanityOrderId, realAmountInCents, currency)

      // 3. Redirigir al Web Checkout de Wompi
      // IMPORTANTE: Wompi bloquea localhost en redirect-url via WAF (CloudFront).
      // En desarrollo, usar NEXT_PUBLIC_SITE_URL apuntando al dominio de produccion.
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectUrl = `${siteUrl}/checkout/success`
      
      const wompiWebCheckoutUrl = "https://checkout.wompi.co/p/" +
        "?public-key=" + wompiPublicKey +
        "&currency=" + currency +
        "&amount-in-cents=" + realAmountInCents +
        "&reference=" + sanityOrderId +
        "&signature%3Aintegrity=" + signature + 
        "&redirect-url=" + encodeURIComponent(redirectUrl);

      // Limpiar el carrito antes de redirigir
      clearCart()
      
      window.location.href = wompiWebCheckoutUrl
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      router.push('/checkout/error?status=ERROR')
      setIsProcessing(false)
    }
  }

  const isTestEmail = formData.email.toLowerCase() === 'prueba@gmail.com'

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white selection:bg-camel/20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          
        <form onSubmit={handlePayment} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Columna Izquierda: Información de Facturación / Envío */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Contacto */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-neutral-900">Información de contacto</h2>
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Dirección de correo electrónico *"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                />
              </div>
            </div>

            {/* Envío */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-neutral-900">Dirección de envío</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="absolute left-4 top-2 text-[10px] text-neutral-500">País/Región</label>
                  <select 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange}
                    className="w-full border border-neutral-300 rounded-md px-4 pt-6 pb-2 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all appearance-none text-neutral-900 bg-white"
                  >
                    <option value="Colombia">Colombia</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    required={!isTestEmail}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Apellidos"
                    required={!isTestEmail}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                  />
                </div>

                <input
                  type="text"
                  name="company"
                  placeholder="Empresa (opcional)"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  required={!isTestEmail}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                />

                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartamento, habitación, etc. (opcional)"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  
                  {/* Selector de Ciudad */}
                  <div className="relative">
                    <label className="absolute left-4 top-2 text-[10px] text-neutral-500">Ciudad</label>
                    <select 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange}
                      required={!isTestEmail}
                      className="w-full border border-neutral-300 rounded-md px-4 pt-6 pb-2 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all appearance-none text-neutral-900 bg-white"
                    >
                      {COLOMBIA_LOCATIONS[formData.department]?.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                  </div>

                  {/* Selector de Departamento */}
                  <div className="relative">
                    <label className="absolute left-4 top-2 text-[10px] text-neutral-500">Departamento</label>
                    <select 
                      name="department" 
                      value={formData.department} 
                      onChange={handleChange}
                      required={!isTestEmail}
                      className="w-full border border-neutral-300 rounded-md px-4 pt-6 pb-2 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all appearance-none text-neutral-900 bg-white"
                    >
                      {Object.keys(COLOMBIA_LOCATIONS).sort().map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Código postal (opcional)"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Teléfono"
                    required={!isTestEmail}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm outline-none focus:border-camel focus:ring-1 focus:ring-camel transition-all text-neutral-900"
                  />
                </div>

                <label className="flex items-center gap-3 py-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="sameAsBilling"
                    checked={formData.sameAsBilling}
                    onChange={handleChange}
                    className="w-4 h-4 text-camel rounded border-neutral-300 focus:ring-camel accent-camel"
                  />
                  <span className="text-sm text-neutral-600">Usar la misma dirección para facturación</span>
                </label>
              </div>
            </div>


            
          </div>

          {/* Columna Derecha: Resumen del Carrito */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-50 p-6 md:p-8 border border-neutral-200 sticky top-32 rounded-md">
              <h2 className="mb-6 text-xl font-serif text-neutral-900 border-b border-neutral-200 pb-4">
                Resumen de tu pedido
              </h2>
              
              {!isMounted ? (
                <p className="text-neutral-500 py-4 text-center">Cargando carrito...</p>
              ) : cart.length === 0 ? (
                <p className="text-neutral-500 py-4 text-center">No hay productos en el carrito.</p>
              ) : (
                <div className="space-y-6 max-h-[40vh] overflow-y-auto p-2 -m-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 bg-white border border-neutral-200 rounded-md overflow-visible">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover object-center mix-blend-multiply p-1 rounded-md" 
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h3 className="text-[14px] font-medium text-neutral-900 line-clamp-2 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[12px] text-neutral-500 mt-0.5">{item.category}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 rounded border border-neutral-200 px-2 py-0.5 bg-neutral-50/50 w-fit">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-neutral-400 transition-colors hover:text-camel p-0.5"
                              type="button"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-3 w-3" strokeWidth={2} />
                            </button>
                            <span className="text-xs font-medium w-4 text-center text-neutral-700">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-neutral-400 transition-colors hover:text-camel p-0.5"
                              type="button"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3 w-3" strokeWidth={2} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            type="button"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex items-center">
                        <p className="font-serif text-[15px] text-neutral-900">
                          {formatCOP(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cupón de descuento */}
              <div className="border-t border-neutral-200 mt-6 pt-6">
                <label className="block text-xs uppercase tracking-wider text-neutral-600 font-medium mb-2">
                  ¿Tienes un código de descuento?
                </label>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-md text-sm text-emerald-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold tracking-wide">{appliedCoupon.code}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                        -{appliedCoupon.discountPercentage}% OFF
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:text-red-800 font-medium underline transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ingresa tu código (ej. ANBAR10-...)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        disabled={isValidatingCoupon}
                        className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-sm uppercase tracking-wide outline-none focus:border-camel focus:ring-1 focus:ring-camel text-neutral-900 placeholder:normal-case placeholder:text-neutral-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-neutral-900 hover:bg-camel-dark text-white rounded-md text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        {isValidatingCoupon ? 'Validando...' : 'Aplicar'}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        {couponError}
                      </p>
                    )}

                    {couponSuccess && (
                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        {couponSuccess}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatCOP(cartSubtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-emerald-700 font-medium">
                    <span>Descuento ({appliedCoupon.discountPercentage}%)</span>
                    <span>-{formatCOP(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-lg md:text-xl font-medium text-neutral-900 border-t border-neutral-200 pt-4 mt-2">
                  <span>Total</span>
                  <span className="font-serif text-camel-dark">{formatCOP(cartTotal)}</span>
                </div>
                <p className="text-[11px] text-neutral-500 text-right mt-2 leading-tight">
                  * Entrega en 48 horas en ciudades principales de Colombia.
                  <br />
                  * El envío es asumido por el cliente y pagado en el momento de recibir el producto a la transportadora.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  type="submit"
                  disabled={!isMounted || isProcessing || cart.length === 0}
                  className="w-full bg-camel-dark px-8 py-4 text-[14px] font-medium uppercase tracking-[0.1em] text-white hover:bg-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center justify-center gap-2 shadow-sm"
                >
                  {isProcessing ? 'Procesando...' : 'Pagar con Wompi'}
                </button>
                <div className="text-center">
                  <p className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pagos 100% seguros
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
