'use client'

import { useState, useEffect } from 'react'
import { GridViewMode, GridViewToggle } from '@/components/grid-view-toggle'
import { ProductCard } from '@/components/product-card'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CategoryProductGrid({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<GridViewMode>('3')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isPerPageOpen, setIsPerPageOpen] = useState(false)
  const [sortOption, setSortOption] = useState('Orden por defecto')
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const sortOptions = [
    'Orden por defecto',
    'Ordenar por precio: bajo a alto',
    'Ordenar por precio: alto a bajo',
  ]

  const perPageOptions = [20, 40, 60, 80, 100]

  useEffect(() => {
    setCurrentPage(1)
  }, [products, sortOption, itemsPerPage])

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'Ordenar por precio: bajo a alto':
        return a.price - b.price
      case 'Ordenar por precio: alto a bajo':
        return b.price - a.price
      default:
        return 0
    }
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)

  const gridColsClass = {
    '5': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5',
    '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    '3': 'grid-cols-2 lg:grid-cols-3',
    '2': 'grid-cols-2',
    '1': 'grid-cols-1',
  }[viewMode]

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-6">
          <GridViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <span className="text-sm font-serif italic text-foreground/70 hidden md:inline-block">
            Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, products.length)} de {products.length}
          </span>
        </div>

        <div className="flex flex-row items-center gap-4">
          {/* Items Per Page */}
          <div className="relative w-32 hidden md:block">
            <button
              onClick={() => {
                setIsPerPageOpen(!isPerPageOpen)
                setIsSortOpen(false)
              }}
              className="relative z-40 flex w-full items-center justify-between border border-border/60 bg-white py-2 pl-4 pr-4 text-[13px] text-foreground/80 transition-colors hover:border-camel/50 focus:outline-none"
            >
              <span>{itemsPerPage} / pág</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn("transition-transform duration-200", isPerPageOpen ? "rotate-180" : "")}>
                <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isPerPageOpen && (
              <div className="absolute left-0 z-50 mt-[-1px] w-full border border-border/60 bg-white py-1 shadow-lg">
                {perPageOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setItemsPerPage(option)
                      setIsPerPageOpen(false)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-[13px] transition-colors",
                      itemsPerPage === option ? "bg-camel/10 text-camel-dark font-medium" : "text-foreground/80 hover:bg-neutral-50 hover:text-camel"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div className="relative w-64">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen)
                setIsPerPageOpen(false)
              }}
              className="relative z-40 flex w-full items-center justify-between border border-border/60 bg-white py-2 pl-4 pr-4 text-[13px] text-foreground/80 transition-colors hover:border-camel/50 focus:outline-none"
            >
              <span className="truncate">{sortOption}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn("transition-transform duration-200", isSortOpen ? "rotate-180" : "")}>
                <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isSortOpen && (
              <div className="absolute right-0 z-50 mt-[-1px] w-full md:w-64 border border-border/60 bg-white py-1 shadow-lg">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option)
                      setIsSortOpen(false)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-[13px] transition-colors",
                      sortOption === option ? "bg-camel/10 text-camel-dark font-medium" : "text-foreground/80 hover:bg-neutral-50 hover:text-camel"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {(isSortOpen || isPerPageOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setIsSortOpen(false); setIsPerPageOpen(false); }} />
      )}

      {/* Grid */}
      <div className={cn("grid gap-8 transition-all duration-500", gridColsClass)}>
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center border border-border/60 bg-white text-foreground/60 transition-colors hover:border-camel hover:text-camel disabled:opacity-50 disabled:hover:border-border/60 disabled:hover:text-foreground/60"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Simple pagination logic to show max 5 buttons (first, last, current, adjacent)
              if (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center border transition-colors text-[14px]",
                      currentPage === page
                        ? "border-camel bg-camel text-white"
                        : "border-border/60 bg-white text-foreground/80 hover:border-camel hover:text-camel"
                    )}
                  >
                    {page}
                  </button>
                )
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-1 text-foreground/40">...</span>
              }
              return null
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center border border-border/60 bg-white text-foreground/60 transition-colors hover:border-camel hover:text-camel disabled:opacity-50 disabled:hover:border-border/60 disabled:hover:text-foreground/60"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  )
}
