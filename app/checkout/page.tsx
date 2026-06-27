'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { useStore } from '@/components/store-provider'

declare global {
  interface Window {
    WidgetCheckout: any
  }
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { cart, clearCart } = useStore()
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  
  // Format prices in COP
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // TODO: Aquí podrías guardar el esquema inicial en Sanity con estado "PENDING"
    // y obtener el ID de la orden real.
    const mockOrderId = `order-${Date.now()}`
    const realAmountInCents = cartTotal * 100
    const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY

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

    const checkout = new window.WidgetCheckout({
      currency: 'COP',
      amountInCents: realAmountInCents,
      reference: mockOrderId,
      publicKey: wompiPublicKey,
      // Opcional: url a donde Wompi redirige tras pago (si no usas el modo modal puro)
      // redirectUrl: 'https://tudominio.com/success', 
    })

    checkout.open((result: any) => {
      var transaction = result.transaction
      console.log('Transaction:', transaction)
      
      if (transaction.status === 'APPROVED') {
        alert("¡Pago aprobado! Referencia: " + transaction.id)
        clearCart() // Solo limpiamos el carrito si el pago es exitoso
        // TODO: Enviar email de confirmación (Resend) o redirigir a success.
      } else {
        // No se elimina el producto del carrito si el pago falla o es declinado
        alert("El pago no fue aprobado. Estado: " + transaction.status)
      }
      setIsProcessing(false)
    })
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h1 className="mb-8 text-3xl font-serif text-neutral-900 md:text-4xl">Checkout</h1>
          
          <div className="bg-white p-6 shadow-sm border border-neutral-200">
            <h2 className="mb-6 text-xl font-serif text-camel-dark">Datos de Envío y Contacto</h2>
            
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="name" className="text-sm font-medium text-neutral-700">Nombre Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-neutral-300 px-3 py-2 outline-none focus:border-camel transition-colors"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-neutral-700">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-neutral-300 px-3 py-2 outline-none focus:border-camel transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="phone" className="text-sm font-medium text-neutral-700">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-neutral-300 px-3 py-2 outline-none focus:border-camel transition-colors"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="city" className="text-sm font-medium text-neutral-700">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="border border-neutral-300 px-3 py-2 outline-none focus:border-camel transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1 pb-4">
                <label htmlFor="address" className="text-sm font-medium text-neutral-700">Dirección de Entrega</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-neutral-300 px-3 py-2 outline-none focus:border-camel transition-colors"
                />
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <div className="mb-6 flex justify-between items-center text-lg font-medium text-neutral-900">
                  <span>Total a pagar</span>
                  <span className="font-serif text-camel-dark">{formatCOP(cartTotal)}</span>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-camel-dark py-4 text-white font-medium hover:bg-neutral-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Procesando...' : 'Pagar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
