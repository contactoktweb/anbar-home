'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/fb-tracking'

interface ProductTrackerProps {
  product: {
    id: string
    sku?: string
    name: string
    price: number
  }
}

export function ProductTracker({ product }: ProductTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current) {
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
      tracked.current = true
    }
  }, [product])

  return null
}
