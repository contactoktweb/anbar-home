'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

interface ProductTabsProps {
  description?: string | null
}

export function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'care'>('description')
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="w-full mt-12">
      {/* Tab Navigation */}
      <div className="flex justify-center border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-8 py-4 font-serif text-[1.1rem] transition-colors relative ${
            activeTab === 'description' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Descripción
          {activeTab === 'description' && (
            <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-neutral-900" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-8 py-4 font-serif text-[1.1rem] transition-colors relative ${
            activeTab === 'shipping' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Envíos
          {activeTab === 'shipping' && (
            <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-neutral-900" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('care')}
          className={`px-8 py-4 font-serif text-[1.1rem] transition-colors relative ${
            activeTab === 'care' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Cuidados
          {activeTab === 'care' && (
            <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-neutral-900" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        {activeTab === 'description' && (() => {
          // Parse literal "\n" strings into real newlines and collapse excessive gaps
          // Also detect list items like ✔, ✅, -, * and ensure they start on a new line
          const formattedDescription = description
            ? description
                .replace(/\\n/g, '\n') // Convert literal \n to actual newline
                .replace(/([^\n])(\s*)([✔✅])/g, '$1\n$3') // Force newline before checkmarks
                .replace(/(?:\n\s*){3,}/g, '\n\n') // Collapse 3+ newlines into 2
                .trim()
            : "Una pieza excepcional que refleja la esencia del diseño interior más humano y orgánico. Elaborado con atención al detalle, este producto añade una capa de sofisticación y calma a cualquier espacio."

          const needsExpand = formattedDescription.length > 300

          return (
            <div className="flex flex-col items-center">
              <div className="relative w-full">
                <div 
                  className={cn(
                    "text-[0.8rem] lg:text-[0.85rem] leading-[1.6] text-neutral-600 font-light text-justify animate-in fade-in duration-500 whitespace-pre-line [&>p]:mb-4 [&>strong]:font-medium [&>span]:block transition-all duration-300",
                    !isExpanded && needsExpand ? "max-h-[160px] overflow-hidden" : ""
                  )}
                  dangerouslySetInnerHTML={{ 
                    __html: formattedDescription
                  }}
                />
                {!isExpanded && needsExpand && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fdfbf7] to-transparent pointer-events-none" />
                )}
              </div>
              {needsExpand && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-6 font-serif text-[0.95rem] font-medium text-camel-dark underline underline-offset-4 hover:text-neutral-900 transition-colors"
                >
                  {isExpanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )
        })()}

        {activeTab === 'shipping' && (
          <div className="text-[0.8rem] lg:text-[0.85rem] leading-[1.6] text-neutral-600 font-light animate-in fade-in duration-500 space-y-2">
            <p><strong className="font-medium text-neutral-900">Entrega rápida:</strong> Entrega en 48 horas en ciudades principales de Colombia.</p>
            <p><strong className="font-medium text-neutral-900">Resto del país:</strong> Envíos estándar de 3 a 5 días hábiles a nivel nacional.</p>
            <p><strong className="font-medium text-neutral-900">Costo de envío:</strong> El valor del flete o envío es asumido directamente por el cliente al momento de recibir su pedido.</p>
            <p>Embalaje seguro y premium para garantizar que su pieza llegue en perfectas condiciones.</p>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="text-[0.8rem] lg:text-[0.85rem] leading-[1.6] text-neutral-600 font-light animate-in fade-in duration-500">
            <p>Limpiar con un paño seco y suave. Evitar el contacto directo con la humedad y productos químicos abrasivos para preservar su acabado original a lo largo del tiempo.</p>
          </div>
        )}
      </div>
    </div>
  )
}
