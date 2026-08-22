'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { identifyUser } from '@/lib/klaviyo/client'

export function DiscountModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    // Verificar si ya fue visto en esta sesión / navegador
    const alreadySeen = localStorage.getItem('anbar_discount_modal_seen')
    if (!alreadySeen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 4500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('anbar_discount_modal_seen', 'true')
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMsg('Por favor ingresa un correo válido.')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud.')
      }

      // Identify user in Klaviyo
      identifyUser({ email: email.trim().toLowerCase() })

      setIsSubmitted(true)
      localStorage.setItem('anbar_discount_modal_seen', 'true')
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm transition-all duration-300">
      
      {/* Contenedor del Modal */}
      <div 
        className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[760px] lg:max-w-[880px] max-h-[92vh] bg-[#EFECE6] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Botón de Cierre */}
        <button
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 md:top-4 md:right-4 z-30 p-1.5 sm:p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all backdrop-blur-md"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Imagen de Fondo (Horizontal para PC / Vertical para Móvil) */}
        <div className="relative w-full aspect-[9/15.5] sm:aspect-[9/14] md:aspect-[2.15/1]">
          {/* Versión PC */}
          <Image
            src="/banner/Banner horizontal 10_.png"
            alt="10% OFF Primera Compra"
            fill
            className="object-cover object-center hidden md:block"
            priority
            quality={90}
          />
          {/* Versión Móvil */}
          <Image
            src="/banner/Banner Vertical 10_.png"
            alt="10% OFF Primera Compra"
            fill
            className="object-cover object-center md:hidden"
            priority
            quality={90}
          />

          {/* Formulario / Mensaje de Éxito posicionado más arriba y centrado en móvil */}
          <div className="absolute inset-x-6 sm:inset-x-8 bottom-9 sm:bottom-12 max-w-[280px] sm:max-w-[310px] mx-auto md:mx-0 md:max-w-[330px] md:inset-x-auto md:right-8 lg:right-12 md:bottom-3.5 lg:bottom-5 z-20">
            
            {isSubmitted ? (
              /* Vista de Éxito sin mostrar el código */
              <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-camel/30 shadow-lg text-center animate-in fade-in duration-300">
                <div className="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full bg-camel/15 text-camel-dark flex items-center justify-center mb-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-serif text-sm sm:text-base md:text-lg font-semibold text-neutral-900 mb-1">
                  ¡Revisa tu correo!
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 mb-3.5 leading-relaxed">
                  Hemos enviado tu código de <strong>10% OFF</strong> a <strong>{email}</strong>. Ábrelo para descubrir tu código exclusivo y usarlo en tu compra.
                </p>

                <button
                  onClick={handleClose}
                  className="w-full py-2 sm:py-2.5 bg-neutral-900 text-white rounded-lg text-[10.5px] sm:text-xs uppercase tracking-widest font-medium hover:bg-camel-dark transition-colors"
                >
                  Empezar a comprar
                </button>
              </div>
            ) : (
              /* Formulario de Suscripción Compacto */
              <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Ingresa tu correo electrónico..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg bg-white/95 backdrop-blur-md border border-neutral-300/80 shadow-sm text-xs sm:text-xs md:text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-1.5 focus:ring-camel focus:border-camel transition-all disabled:opacity-60"
                  />
                </div>

                {errorMsg && (
                  <p className="text-[10px] sm:text-xs text-red-600 bg-white/90 backdrop-blur-sm p-1 rounded-md text-center font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-camel-dark text-white text-[10.5px] sm:text-xs uppercase tracking-wider font-medium shadow-sm transition-all duration-300 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Enviando código...</span>
                    </>
                  ) : (
                    <>
                      <span>Quiero mi 10% OFF</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <p className="text-[8.5px] sm:text-[9.5px] text-neutral-700/80 text-center drop-shadow-sm leading-tight">
                  * Válido para tu primera compra. Cupón exclusivo para tu correo y no acumulable.
                </p>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
