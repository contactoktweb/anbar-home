'use client'

import { useState } from 'react'
import { GridViewMode, GridViewToggle } from '@/components/grid-view-toggle'
import { ProductCard } from '@/components/product-card'
import { Product } from '@/lib/mock-products'
import { cn } from '@/lib/utils'

export function CategoryProductGrid({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<GridViewMode>('3')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortOption, setSortOption] = useState('Orden por defecto')

  const sortOptions = [
    'Orden por defecto',
    'Ordenar por popularidad',
    'Ordenar por calificación media',
    'Ordenar por las últimas',
    'Ordenar por precio: bajo a alto',
    'Ordenar por precio: alto a bajo',
  ]

  const gridColsClass = {
    '5': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5',
    '4': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '2': 'grid-cols-1 md:grid-cols-2',
    '1': 'grid-cols-1',
  }[viewMode]

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-6">
          <GridViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        <div className="flex flex-col-reverse items-end md:flex-row md:items-center gap-6">
          <span className="text-sm font-serif italic text-foreground/70">
            Showing 1 - {products.length} of {products.length} products in this category
          </span>
          
          <div className="relative w-64">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="relative z-50 flex w-full items-center justify-between border border-border/60 bg-white py-2.5 pl-4 pr-4 text-[14px] text-foreground/80 transition-colors hover:border-camel/50 focus:outline-none"
            >
              <span className="truncate">{sortOption}</span>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={cn("transition-transform duration-200", isSortOpen ? "rotate-180" : "")}
              >
                <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isSortOpen && (
              <div className="absolute left-0 z-50 mt-[-1px] w-full border border-border/60 bg-white py-1 shadow-lg">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option)
                      setIsSortOpen(false)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-[14px] transition-colors",
                      sortOption === option
                        ? "bg-camel/10 text-camel-dark font-medium"
                        : "text-foreground/80 hover:bg-neutral-50 hover:text-camel"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {isSortOpen && (
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsSortOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={cn("grid gap-8 transition-all duration-500", gridColsClass)}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
