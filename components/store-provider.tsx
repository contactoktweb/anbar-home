'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, CartItem } from '@/types'
import { trackAddedToCart, trackRemovedFromCart } from '@/lib/klaviyo/client'

interface StoreContextType {
  cart: CartItem[]
  favorites: Product[]
  addToCart: (product: Product, quantityToAdd?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  clearFavorites: () => void
  toggleFavorite: (product: Product) => void
  isFavorite: (productId: string) => boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('anbar_cart')
    const savedFavorites = localStorage.getItem('anbar_favorites')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    setIsInitialized(true)
  }, [])

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('anbar_cart', JSON.stringify(cart))
      localStorage.setItem('anbar_favorites', JSON.stringify(favorites))
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
  }

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      }
      return [...prev, product]
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
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
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
