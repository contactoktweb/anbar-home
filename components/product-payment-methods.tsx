'use client'

import { useState } from 'react'
import { ShieldCheck, CreditCard, Lock, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react'

export function ProductPaymentMethods() {
  const [showDetails, setShowDetails] = useState(false)

  const paymentMethods = [
    {
      name: 'Visa',
      type: 'card',
      svg: (
        <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
          <path d="M19.6 21H16.8L18.6 11H21.4L19.6 21ZM15.4 11L12.8 17.8L12.5 16.3C12.1 14.8 10.7 13.2 9.2 12.4L11.7 21H14.5L18.8 11H15.4ZM27.8 17.8C27.8 14.4 23.2 14.2 23.2 12.7C23.2 12.2 23.7 11.7 24.7 11.6C25.2 11.5 26.6 11.5 28.1 12.2L28.6 9.8C27.9 9.5 26.9 9.3 25.7 9.3C22.6 9.3 20.4 11 20.4 13.4C20.4 17.2 25.6 17 25.6 19.3C25.6 20 24.8 20.5 23.8 20.5C22.2 20.5 20.6 19.8 19.8 19.4L19.3 21.8C20.2 22.2 21.9 22.6 23.5 22.6C26.9 22.7 27.8 20.8 27.8 17.8ZM36 21H38.5L36.3 11H34C33.3 11 32.7 11.4 32.5 12L28.8 21H31.6L32.2 19.4H35.6L36 21ZM33 17.2L34.4 13.3L35.2 17.2H33Z" fill="#1A1F71" />
        </svg>
      )
    },
    {
      name: 'Mastercard',
      type: 'card',
      svg: (
        <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
          <circle cx="19" cy="16" r="8" fill="#EB001B" />
          <circle cx="29" cy="16" r="8" fill="#F79E1B" fillOpacity="0.85" />
        </svg>
      )
    },
    {
      name: 'American Express',
      type: 'card',
      svg: (
        <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="32" rx="4" fill="#006FCF" />
          <path d="M7 13.2H10.8L12.2 16.4L13.6 13.2H17.4V19.8H15.2V15.6L13.2 19.8H11.2L9.2 15.6V19.8H7V13.2ZM19 13.2H25.4V14.8H21.2V15.8H25V17.2H21.2V18.2H25.4V19.8H19V13.2ZM27 13.2H29.4L31.6 16.6L33.8 13.2H36.2L32.8 18.2V19.8H30.4V18.2L27 13.2ZM37.6 13.2H41.4V19.8H39.2V15.6H37.6V13.2Z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'PSE',
      type: 'bank',
      svg: (
        <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="32" rx="4" fill="#0C2340" />
          <circle cx="24" cy="16" r="9" fill="#FFFFFF" />
          <text x="24" y="19" textAnchor="middle" fill="#0C2340" fontSize="7" fontWeight="bold" fontFamily="sans-serif">PSE</text>
        </svg>
      )
    },
    {
      name: 'Bancolombia',
      type: 'bank',
      svg: (
        <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
          <path d="M12 21C12 15 17 11 24 11C31 11 36 15 36 21H32C32 17 28 14 24 14C20 14 16 17 16 21H12Z" fill="#FDDA24" />
          <rect x="22" y="14" width="4" height="7" fill="#000000" />
        </svg>
      )
    },
    {
      name: 'Nequi',
      type: 'wallet',
      svg: (
        <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="32" rx="4" fill="#1F0338" />
          <rect x="14" y="9" width="5" height="14" rx="2" fill="#E6007E" />
          <rect x="22" y="9" width="5" height="14" rx="2" fill="#FFFFFF" />
          <circle cx="32" cy="16" r="3" fill="#E6007E" />
        </svg>
      )
    },
    {
      name: 'Daviplata',
      type: 'wallet',
      svg: (
        <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="32" rx="4" fill="#ED1C24" />
          <path d="M16 10H24C28 10 30 12.5 30 16C30 19.5 28 22 24 22H16V10ZM20 19H23.5C26 19 27 17.8 27 16C27 14.2 26 13 23.5 13H20V19Z" fill="#FFFFFF" />
        </svg>
      )
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
              className="flex items-center justify-center rounded-md border border-neutral-200/80 bg-white px-2.5 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-neutral-300"
            >
              {m.svg}
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
