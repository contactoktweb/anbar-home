'use client'

import { useEffect } from 'react'
import { Product } from '@/types'

const STORAGE_KEY = 'anbar_recently_viewed'
const MAX_ITEMS = 12

export function RecentlyViewedTracker({ product }: { product: Product }) {
  useEffect(() => {
    if (!product || !product.id) return

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const existing: Product[] = raw ? JSON.parse(raw) : []

      // Normalize array
      const filtered = Array.isArray(existing)
        ? existing.filter((item) => item && item.id !== product.id && item.slug !== product.slug)
        : []

      // Store a clean product summary object
      const itemToSave: Product = {
        id: product.id,
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category || '',
        categories: product.categories || [],
        categorySlugs: product.categorySlugs || [],
        image: product.image,
        images: product.images || [],
        rating: product.rating || 0,
        ratingCount: product.ratingCount || 0,
        description: product.description,
        isLastUnits: product.isLastUnits,
      }

      const updated = [itemToSave, ...filtered].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('anbar_recently_viewed_updated'))
    } catch (e) {
      console.error('Error saving recently viewed product', e)
    }
  }, [product])

  return null
}
