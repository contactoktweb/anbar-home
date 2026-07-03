'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const categories = [
  { name: 'Todos los productos', href: '/search' },
  { name: 'Línea Suprema', href: '/category/linea-suprema' },
  { name: 'Esculturas', href: '/category/esculturas' },
  { name: 'Summer Sale', href: '/category/summer-sale' },
  { name: 'Accesorios Hogar', href: '/category/accesorios-hogar' },
  { name: 'Jarrones Escultóricos', href: '/category/jarrones-escultoricos' },
]

export function CategorySidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Default max price for the slider (7M COP)
  const MAX_PRICE_LIMIT = 7000000
  
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT)

  useEffect(() => {
    const urlMaxPrice = searchParams.get('maxPrice')
    if (urlMaxPrice) {
      setMaxPrice(parseInt(urlMaxPrice, 10))
    }
  }, [searchParams])

  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (maxPrice < MAX_PRICE_LIMIT) {
      params.set('maxPrice', maxPrice.toString())
    } else {
      params.delete('maxPrice')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <aside className="w-full flex-col pr-8 md:flex">
      <div className="mb-10">
        <h2 className="mb-6 font-serif text-2xl font-medium tracking-wide text-foreground">
          Categorías
        </h2>
        <ul className="flex flex-col space-y-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={category.href}
                className="text-[15px] font-light text-foreground/70 transition-colors hover:text-camel"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 h-px w-full bg-border/40" />

      {/* Price */}
      <div className="mb-6">
        <h2 className="mb-6 font-serif text-xl font-medium tracking-wide text-foreground">
          Precio Máximo
        </h2>
        
        {/* Real Range Slider */}
        <div className="relative mb-6 mt-2 flex items-center h-4">
          <input 
            type="range" 
            min={0} 
            max={MAX_PRICE_LIMIT} 
            step={50000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
            className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-camel/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-camel [&::-webkit-slider-thumb]:bg-ivory [&::-webkit-slider-thumb]:-mt-1.5 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] font-light text-foreground/70">
            $ 0 - {formatCOP(maxPrice)}
          </span>
          <button 
            onClick={handleApply}
            className="bg-camel-dark px-5 py-2 text-[13px] text-white transition-colors hover:bg-camel"
          >
            Aplicar
          </button>
        </div>
      </div>
    </aside>
  )
}
