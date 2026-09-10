'use client'

import Link from 'next/link'
import { Heart, Trash2, ArrowRight } from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { ProductCard } from '@/components/product-card'

export function FavoritesClientView() {
  const { favorites, clearFavorites, isInitialized } = useStore()

  // Evitar desajuste de hidratación inicial mostrando skeleton suave
  if (!isInitialized) {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12">
        <div className="h-6 w-48 bg-neutral-200/60 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="aspect-square bg-neutral-200/50 rounded-sm animate-pulse" />
              <div className="h-4 bg-neutral-200/50 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-200/40 rounded w-1/3 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Filtrar de forma segura productos válidos que tengan id o slug
  const validFavorites = favorites.filter((p) => Boolean(p && (p.id || p.slug)))

  // Estado vacío elegante
  if (validFavorites.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-camel/10 text-camel-dark mb-6 shadow-xs">
          <Heart className="h-9 w-9 text-camel-dark" strokeWidth={1.25} />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight">
          Aún no has guardado ninguna pieza
        </h2>

        <p className="mt-3 text-sm sm:text-base text-neutral-500 font-light max-w-md leading-relaxed">
          Explora nuestra colección y guarda tus favoritas para volver a ellas cuando quieras.
        </p>

        <Link
          href="/category/todos-los-productos"
          className="mt-8 inline-flex items-center gap-2.5 rounded-sm bg-neutral-950 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-camel-dark active:scale-[0.99] shadow-sm"
        >
          <span>Explorar productos</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Barra superior de control */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4 mb-8 sm:mb-10">
        <span className="text-xs sm:text-sm font-light text-neutral-500">
          Mostrando{' '}
          <strong className="font-medium text-neutral-800">
            {validFavorites.length}
          </strong>{' '}
          {validFavorites.length === 1 ? 'pieza guardada' : 'piezas guardadas'}
        </span>

        <button
          type="button"
          onClick={clearFavorites}
          className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-red-500 py-1 px-2 rounded-sm active:scale-95"
          title="Eliminar todos los favoritos"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Eliminar todos</span>
        </button>
      </div>

      {/* Grid de productos de favoritos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-6 md:gap-8">
        {validFavorites.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </div>
  )
}
