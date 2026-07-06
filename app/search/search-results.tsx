'use client'

import { useSearchParams } from 'next/navigation'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { Search } from 'lucide-react'

export default function SearchResults({ products = [] }: { products?: any[] }) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const maxPriceParam = searchParams.get('maxPrice')
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : null
  
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  
  const filteredProducts = products.filter((product) => {
    let match = true

    if (query) {
      const normalizedName = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      match = match && normalizedName.includes(normalizedQuery)
    }

    if (maxPrice !== null) {
      match = match && product.price <= maxPrice
    }

    return match
  })

  return (
    <div>
      <h1 className="mb-8 text-3xl font-serif text-neutral-900 md:text-4xl">
        Resultados para: <span className="text-camel-dark font-medium italic">"{query}"</span>
      </h1>
      
      {filteredProducts.length > 0 ? (
        <CategoryProductGrid products={filteredProducts} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-6 h-16 w-16 text-neutral-200" strokeWidth={1} />
          <h2 className="mb-2 font-serif text-2xl text-neutral-800">No encontramos coincidencias</h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            No hay productos que coincidan con "{query}". Intenta buscar con otros términos o explora nuestras categorías.
          </p>
          <a href="/" className="mt-8 bg-camel-dark px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-900">
            Volver al Inicio
          </a>
        </div>
      )}
    </div>
  )
}
