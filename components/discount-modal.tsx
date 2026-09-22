'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { identifyUser } from '@/lib/klaviyo/client'
import { optimizeImageUrl } from '@/lib/utils'

interface DiscountModalProps {
  /** Si es false, el modal nunca se muestra (controlado desde Sanity). */
  enabled?: boolean
  /** URL de la imagen de fondo para escritorio (desde Sanity). Fallback a /banner/horizontal.png */
  imageDesktopUrl?: string | null
  /** URL de la imagen de fondo para móvil (desde Sanity). Fallback a /banner/vertical.png */
  imageMobileUrl?: string | null
}

export function DiscountModal({
  enabled = true,
  imageDesktopUrl,
  imageMobileUrl,
}: DiscountModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Imágenes con optimización WebP desde Sanity CDN (fallback a archivos locales)
  const desktopSrc = optimizeImageUrl(imageDesktopUrl, 1920, 82) || '/banner/horizontal.png'
  const mobileSrc  = optimizeImageUrl(imageMobileUrl,  1080, 82) || '/banner/vertical.png'

  useEffect(() => {
    if (!enabled) return
    const alreadySeen = localStorage.getItem('anbar_discount_modal_seen')
    if (!alreadySeen) {
      const timer = setTimeout(() => setIsOpen(true), 4500)
      return () => clearTimeout(timer)
    }
  }, [enabled])

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
      if (!res.ok) throw new Error(data.error || 'Error al procesar la solicitud.')
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

  /* ── Formulario / Éxito ────────────────────────────────────────────────── */
  const formContent = isSubmitted ? (
    <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-camel/30 shadow-lg text-center animate-in fade-in duration-300">
      <div className="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full bg-camel/15 text-camel-dark flex items-center justify-center mb-2">
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 mb-1">
        ¡Revisa tu correo!
      </h3>
      <p className="text-[11px] sm:text-xs text-neutral-600 mb-3.5 leading-relaxed">
        Hemos enviado tu código de <strong>10% OFF</strong> a <strong>{email}</strong>.
        Ábrelo para descubrir tu código exclusivo y usarlo en tu compra.
      </p>
      <button
        onClick={handleClose}
        className="w-full py-2 sm:py-2.5 bg-neutral-900 text-white rounded-lg text-[10.5px] sm:text-xs uppercase tracking-widest font-medium hover:bg-camel-dark transition-colors"
      >
        Empezar a comprar
      </button>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">
      <input
        type="email"
        required
        placeholder="Ingresa tu correo electrónico..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg bg-white/95 backdrop-blur-md border border-neutral-300/80 shadow-sm text-xs md:text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-1.5 focus:ring-camel focus:border-camel transition-all disabled:opacity-60"
      />
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
          <><Loader2 className="w-3 h-3 animate-spin" /><span>Enviando código...</span></>
        ) : (
          <><span>Quiero mi 10% OFF</span><ArrowRight className="w-3.5 h-3.5" /></>
        )}
      </button>
      <p className="text-[8.5px] sm:text-[9.5px] text-neutral-700/80 text-center drop-shadow-sm leading-tight">
        * Válido para tu primera compra. Cupón exclusivo para tu correo y no acumulable.
      </p>
    </form>
  )

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      {/* ── Contenedor del Modal — sin overflow-hidden para respetar la imagen ── */}
      <div className="relative w-full animate-in fade-in zoom-in-95 duration-300 shadow-2xl rounded-2xl md:rounded-3xl border border-white/20
        /* Móvil: máx 420 px de ancho */
        max-w-[420px]
        /* Desktop: sube hasta 880 px */
        md:max-w-[880px]
      ">
        {/* Botón de Cierre */}
        <button
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 md:top-4 md:right-4 z-30 p-1.5 sm:p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all backdrop-blur-md"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* ── Imagen Móvil (< md): se muestra a su proporción natural ── */}
        <div className="md:hidden relative w-full rounded-2xl overflow-hidden">
          <Image
            src={mobileSrc}
            alt="10% OFF Primera Compra – Anbar Home"
            width={1080}
            height={1350}
            className="w-full h-auto block"
            priority
            quality={82}
          />
          {/* Formulario superpuesto en móvil */}
          <div className="absolute inset-x-3 bottom-2 sm:inset-x-5 sm:bottom-3 z-20
            max-w-[280px] sm:max-w-[310px] mx-auto">
            {formContent}
          </div>
        </div>

        {/* ── Imagen Desktop (≥ md): proporción natural de la imagen horizontal ── */}
        <div className="hidden md:block relative w-full rounded-3xl overflow-hidden">
          <Image
            src={desktopSrc}
            alt="10% OFF Primera Compra – Anbar Home"
            width={1915}
            height={821}
            className="w-full h-auto block"
            priority
            quality={82}
          />
          {/* Formulario superpuesto en desktop — posicionado sobre la mitad derecha */}
          <div className="absolute inset-y-0 right-0 w-[38%] flex items-end pb-5 lg:pb-7 pr-8 lg:pr-12 z-20">
            <div className="w-full max-w-[340px] lg:max-w-[380px] mx-auto">
              {formContent}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
