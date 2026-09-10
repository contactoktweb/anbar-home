'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Product, CartItem } from '@/types'
import { trackAddedToCart, trackRemovedFromCart } from '@/lib/klaviyo/client'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreContextType {
  cart: CartItem[]
  favorites: Product[]
  favoritesCount: number
  isInitialized: boolean
  addToCart: (product: Product, quantityToAdd?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  clearFavorites: () => void
  toggleFavorite: (product: Product) => void
  addFavorite: (product: Product) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  // Sidecart drawer control
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  openCart: () => void
  closeCart: () => void
  // Quick View control
  quickViewProduct: Product | null
  openQuickView: (product: Product) => void
  closeQuickView: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Toast feedback state
  const [toast, setToast] = useState<{
    message: string
    type: 'add' | 'remove'
    visible: boolean
  } | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((message: string, type: 'add' | 'remove') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToast({ message, type, visible: true })
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null))
    }, 2500)
  }, [])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const openQuickView = (product: Product) => setQuickViewProduct(product)
  const closeQuickView = () => setQuickViewProduct(null)

  // Carga inicial desde localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('anbar_cart')
      const savedFavorites = localStorage.getItem('anbar_favorites')
      if (savedCart) setCart(JSON.parse(savedCart))
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites)
        if (Array.isArray(parsed)) {
          // Filtrar elementos corruptos o sin ID
          setFavorites(parsed.filter((p) => p && (p.id || p.slug)))
        }
      }
    } catch (e) {
      console.error('Error loading store from localStorage', e)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Sincronización multi-pestaña mediante evento 'storage'
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anbar_favorites') {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue)
            if (Array.isArray(parsed)) {
              setFavorites(parsed.filter((p) => p && (p.id || p.slug)))
            }
          } catch {}
        } else {
          setFavorites([])
        }
      }
      if (e.key === 'anbar_cart') {
        if (e.newValue) {
          try {
            setCart(JSON.parse(e.newValue))
          } catch {}
        } else {
          setCart([])
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Guardar en localStorage al cambiar estado tras la inicialización
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('anbar_cart', JSON.stringify(cart))
        localStorage.setItem('anbar_favorites', JSON.stringify(favorites))
      } catch (e) {
        console.error('Error saving store to localStorage', e)
      }
    }
  }, [cart, favorites, isInitialized])

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      let nextCart: CartItem[]
      if (existing) {
        nextCart = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        )
      } else {
        nextCart = [...prev, { ...product, quantity: quantityToAdd }]
      }

      // Track Added to Cart in Klaviyo
      trackAddedToCart(product, quantityToAdd, nextCart)

      return nextCart
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const itemToRemove = prev.find((item) => item.id === productId)
      const nextCart = prev.filter((item) => item.id !== productId)

      if (itemToRemove) {
        trackRemovedFromCart(itemToRemove, itemToRemove.quantity, nextCart)
      }

      return nextCart
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      const nextCart = prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )

      if (existing) {
        const delta = quantity - existing.quantity
        if (delta > 0) {
          trackAddedToCart(existing, delta, nextCart)
        } else if (delta < 0) {
          trackRemovedFromCart(existing, Math.abs(delta), nextCart)
        }
      }

      return nextCart
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const clearFavorites = () => {
    setFavorites([])
    showToast('Lista de favoritos vaciada', 'remove')
  }

  const addFavorite = (product: Product) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev
      showToast(`Añadido a favoritos`, 'add')
      return [...prev, product]
    })
  }

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => {
      const item = prev.find((p) => p.id === productId)
      const filtered = prev.filter((p) => p.id !== productId)
      showToast(`Eliminado de favoritos`, 'remove')
      return filtered
    })
  }

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        showToast(`Eliminado de favoritos`, 'remove')
        return prev.filter((item) => item.id !== product.id)
      }
      showToast(`Añadido a favoritos`, 'add')
      // Prevenir duplicados estrictamente
      const filtered = prev.filter((item) => item.id !== product.id)
      return [...filtered, product]
    })
  }

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId)
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        favorites,
        favoritesCount: favorites.length,
        isInitialized,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearFavorites,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        isFavorite,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        quickViewProduct,
        openQuickView,
        closeQuickView,
      }}
    >
      {children}

      {/* Toast no invasivo para feedback inmediato de favoritos */}
      {toast?.visible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[160] flex items-center gap-3 rounded-xl bg-neutral-900/95 text-white px-4 py-3 shadow-2xl backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[90vw] sm:max-w-md"
        >
          <Heart
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200',
              toast.type === 'add'
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-neutral-400'
            )}
          />
          <span className="text-xs font-light text-neutral-100 truncate">
            {toast.message}
          </span>
          <Link
            href="/favoritos"
            className="text-xs font-medium text-camel-light hover:text-white transition-colors underline underline-offset-2 ml-auto shrink-0"
          >
            Ver lista
          </Link>
        </div>
      )}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
