'use client'

import { useEffect, useRef } from 'react'
import { Product } from '@/types'
import { trackEvent } from '@/lib/fb-tracking'
import { trackViewedProduct } from '@/lib/klaviyo/client'

interface ProductTrackerProps {
  product: Product | {
    id: string
    sku?: string
    slug?: string
    name: string
    price: number
    originalPrice?: number
    category?: string
    categories?: string[]
    image?: string
    images?: string[]
    description?: string
    rating?: number
    ratingCount?: number
  }
}

export function ProductTracker({ product }: ProductTrackerProps) {
  const lastTrackedId = useRef<string | null>(null)

  useEffect(() => {
    if (product && product.id && lastTrackedId.current !== product.id) {
      lastTrackedId.current = product.id

      // 1. Meta Pixel & CAPI ViewContent
      trackEvent('ViewContent', {
        content_name: product.name,
        content_ids: [product.sku || product.id],
        content_type: 'product',
        value: product.price,
        currency: 'COP',
        contents: [
          {
            id: product.sku || product.id,
            quantity: 1,
            item_price: product.price
          }
        ]
      })

      // 2. Klaviyo Viewed Product
      trackViewedProduct(product as Product)
    }
  }, [product])

  return null
}

