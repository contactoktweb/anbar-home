'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const categories = [
  'Todos los productos',
  'Accesorios decorativos',
  'Animales',
  'Bandeja',
  'Bandejas',
  'Candelabros',
  'Esculturas',
  'Eslabones',
  'Figuras de Personas',
  'Figuras Decorativas',
]

export function SidebarFilters() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Trigger Tab */}
      <button
        onClick={() => setIsOpen(true)}
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        className={cn(
          "fixed left-0 top-1/2 z-40 flex -translate-y-1/2 items-center justify-center rounded-r-md bg-camel-dark px-2 py-6 font-serif text-sm uppercase tracking-widest text-white shadow-md transition-all duration-300 hover:bg-camel hover:pr-4",
          isOpen ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        )}
      >
        Categorías
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-80 flex-col overflow-y-auto bg-white p-8 shadow-2xl transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-medium tracking-wide text-foreground">
            Categorías
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-foreground/50 hover:text-foreground"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <ul className="flex flex-col space-y-2.5">
            {categories.map((category, index) => (
              <li key={category}>
                <button
                  className={cn(
                    'text-left text-[14px] font-light transition-colors hover:text-camel-dark',
                    index === 0 ? 'text-foreground' : 'text-foreground/70',
                  )}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="my-4 h-px w-full bg-border/40" />

        {/* Price */}
        <div className="mb-6 mt-4">
          <h2 className="mb-4 font-serif text-xl font-medium tracking-wide text-foreground">
            Precio
          </h2>
          
          {/* Mock Slider */}
          <div className="relative mb-4 mt-2 h-1 w-full rounded-full bg-border/60">
            <div className="absolute left-0 right-0 h-full bg-[#2d2d2d]" />
            <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#2d2d2d] bg-white" />
            <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#2d2d2d] bg-white" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[14px] font-light text-foreground/70">
              $ 0 - $ 6.900.000
            </span>
            <button className="bg-[#2d2d2d] px-4 py-1.5 text-[12px] text-white transition-colors hover:bg-black">
              Aplicar
            </button>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-border/40" />

        {/* Stock Checkbox */}
        <div className="mt-4 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center border border-foreground/30 bg-transparent transition-colors hover:border-foreground/60">
              {/* Checkmark icon would go here */}
            </div>
            <span className="text-[14px] font-light text-foreground/80">
              Hay existencias
            </span>
          </label>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand/50 text-xs font-medium text-foreground/60">
            273
          </span>
        </div>
      </aside>
    </>
  )
}
