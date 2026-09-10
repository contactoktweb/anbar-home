'use client'

import { useState } from 'react'
import { ShieldCheck, CreditCard, Lock, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react'

import Image from 'next/image'

export function ProductPaymentMethods() {
  const [showDetails, setShowDetails] = useState(false)

  const paymentMethods = [
    {
      name: 'Visa',
      type: 'card',
      image: '/payments/visa.svg',
      width: 44,
      height: 16,
      className: 'h-3.5 sm:h-4 w-auto object-contain',
    },
    {
      name: 'Mastercard',
      type: 'card',
      image: '/payments/mastercard.svg',
      width: 38,
      height: 24,
      className: 'h-5 sm:h-5.5 w-auto object-contain',
    },
    {
      name: 'American Express',
      type: 'card',
      image: '/payments/amex.svg',
      width: 30,
      height: 30,
      className: 'h-6 sm:h-6.5 w-auto object-contain rounded-[2px]',
    },
    {
      name: 'PSE',
      type: 'bank',
      image: '/payments/pse.png',
      width: 32,
      height: 32,
      className: 'h-6 sm:h-6.5 w-auto object-contain',
    },
    {
      name: 'Bancolombia',
      type: 'bank',
      image: '/payments/bancolombia.png',
      width: 60,
      height: 14,
      className: 'h-3 sm:h-3.5 w-auto object-contain',
    },
    {
      name: 'Nequi',
      type: 'wallet',
      image: '/payments/nequi.svg',
      width: 48,
      height: 16,
      className: 'h-3.5 sm:h-4 w-auto object-contain',
    },
    {
      name: 'Daviplata',
      type: 'wallet',
      image: '/payments/daviplata.png',
      width: 36,
      height: 30,
      className: 'h-5.5 sm:h-6 w-auto object-contain',
    },
  ]

  return (
    <div className="mt-6 rounded-lg border border-neutral-200/90 bg-white/60 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-neutral-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200/70 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-camel/15 text-camel-dark">
            <CreditCard className="h-4 w-4" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-sans text-[13px] font-medium uppercase tracking-[0.15em] text-neutral-900">
              Medios de pago
            </h3>
            <p className="text-[11px] font-light text-neutral-500">
              Aceptamos todas las tarjetas y transferencias
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>Pago 100% Seguro</span>
        </div>
      </div>

      {/* Payment Badges Grid */}
      <div className="pt-3.5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {paymentMethods.map((m) => (
            <div
              key={m.name}
              title={m.name}
              className="flex h-9 w-14 sm:h-10 sm:w-16 items-center justify-center rounded-md border border-neutral-200/90 bg-white px-2 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm"
            >
              <Image
                src={m.image}
                alt={m.name}
                width={m.width}
                height={m.height}
                unoptimized
                className={m.className}
              />
            </div>
          ))}
        </div>

        {/* Info & Installment Note */}
        <div className="mt-3.5 flex flex-col gap-1.5 text-[11.5px] leading-relaxed text-neutral-600">
          <div className="flex items-center gap-1.5 font-normal text-neutral-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-camel-dark shrink-0" />
            <span>Paga hasta en <strong>12 cuotas</strong> con tu tarjeta de crédito.</span>
          </div>
          <div className="flex items-center gap-1.5 font-light text-neutral-500">
            <Lock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span>Procesado de forma segura con cifrado SSL a través de <strong>Wompi Bancolombia</strong>.</span>
          </div>
        </div>

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-camel-dark hover:text-neutral-900 transition-colors"
        >
          <span>{showDetails ? 'Ocultar opciones de pago' : 'Ver cómo pagar paso a paso'}</span>
          {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {/* Accordion Content */}
        {showDetails && (
          <div className="mt-3.5 space-y-2.5 rounded-md bg-[#f9f8f5] p-3.5 text-[11.5px] text-neutral-700 border border-neutral-200/60 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 shrink-0">· Tarjetas:</span>
              <span className="font-light">Visa, Mastercard y American Express de cualquier entidad financiera nacional o internacional.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 shrink-0">· PSE:</span>
              <span className="font-light">Débito directo en línea desde cuentas de ahorros o corriente de todos los bancos en Colombia.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 shrink-0">· Bancolombia:</span>
              <span className="font-light">Transferencia directa con Botón Bancolombia sin costo adicional.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 shrink-0">· Billeteras:</span>
              <span className="font-light">Nequi y Daviplata de forma rápida escaneando código QR o por confirmación push en tu móvil.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
