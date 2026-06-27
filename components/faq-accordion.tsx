'use client'

import { useState } from 'react'

export type FAQItem = {
  question: string
  answer: string
}

export function FaqAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full border-t border-border/60">
      {items.map((item, i) => (
        <div key={i} className="border-b border-border/60">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left text-[15px] font-medium text-neutral-800 transition-colors hover:text-camel-dark md:text-base"
          >
            <span className="pr-8">{item.question}</span>
            <span className="text-2xl font-light leading-none text-neutral-400">
              {openIndex === i ? '−' : '+'}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === i ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-[14px] font-light leading-relaxed text-neutral-600 md:text-[15px]">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
