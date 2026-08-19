'use client'

import React from 'react'

export function ProductPurchaseBenefits() {
  const benefits = [
    {
      id: 'shipping',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 md:w-9 md:h-9 text-neutral-800">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="opacity-40" />
          <path d="M10 28h18V14H10v14z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 19h6l4 4v5h-10v-9z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="30" r="3" />
          <circle cx="33" cy="30" r="3" />
          <path d="M19 30h11" strokeLinecap="round" />
        </svg>
      ),
      text: 'Envío nacional - Disponible',
      subtext: 'Entrega rápida a toda Colombia',
    },
    {
      id: 'discount',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 md:w-9 md:h-9 text-neutral-800">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M24 16.5c-2.4-3.2-6.8-2.4-8.2 0.6-1.8 3.4 1 7.2 8.2 13 7.2-5.8 10-9.6 8.2-13-1.4-3-5.8-3.8-8.2-0.6z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      ),
      text: 'Regístrate y obtén 10% de descuento en tu primera compra',
      highlight: '10% de descuento',
    },
    {
      id: 'secure-payment',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 md:w-9 md:h-9 text-neutral-800">
          <path d="M24 7l14 5v11c0 9.5-6 16.5-14 19-8-2.5-14-9.5-14-19V12l14-5z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="22" r="5.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M21.5 22l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </svg>
      ),
      text: 'Pago 100% Seguro',
      subtext: 'Transacciones protegidas',
    },
    {
      id: 'returns',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 md:w-9 md:h-9 text-neutral-800">
          <path d="M37 21a14 14 0 0 0-24.5-5.5L8 19" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M8 12v7h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M11 27a14 14 0 0 0 24.5 5.5L40 29" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M40 36v-7h-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      ),
      text: 'Devoluciones sin costo',
      subtext: 'Compra 100% protegida',
    },
  ]

  return (
    <div className="w-full my-8 md:my-12 border-y border-neutral-200/80 bg-white/70 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200/80">
        {benefits.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center justify-center text-center p-5 sm:p-6 hover:bg-neutral-50/50 transition-colors duration-300 group"
          >
            <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </div>
            <p className="text-xs sm:text-[13px] text-neutral-800 font-normal leading-snug max-w-[200px]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
