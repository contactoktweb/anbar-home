'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/fb-tracking'
import { trackGAPurchase } from '@/lib/gtag'

interface PurchaseTrackerProps {
  orderData: {
    currency: string
    value: number
    content_ids?: string[]
    contents?: any[]
    items?: any[]
    coupon?: string
    order_id?: string
  }
  userData?: {
    em?: string
    ph?: string
    fn?: string
    ln?: string
    ct?: string
    st?: string
    country?: string
  }
  eventId?: string
}

export function PurchaseTracker({ orderData, userData, eventId }: PurchaseTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current && orderData.value > 0) {
      const trackingKey = `purchase_tracked_${eventId || orderData.order_id || 'done'}`
      if (typeof window !== 'undefined' && sessionStorage.getItem(trackingKey)) {
        tracked.current = true
        return
      }

      // 1. Meta Pixel & CAPI Purchase
      trackEvent('Purchase', {
        currency: orderData.currency,
        value: orderData.value,
        content_type: 'product',
        ...(orderData.content_ids && orderData.content_ids.length > 0 ? { content_ids: orderData.content_ids } : {}),
        ...(orderData.contents && orderData.contents.length > 0 ? { contents: orderData.contents } : {}),
        ...(orderData.order_id ? { order_id: orderData.order_id } : {})
      }, userData || {}, '', eventId)

      // 2. Google Analytics 4 (gtag.js) E-commerce Purchase
      trackGAPurchase({
        transaction_id: orderData.order_id || eventId || 'unknown',
        value: orderData.value,
        currency: orderData.currency || 'COP',
        coupon: orderData.coupon,
        items: (orderData.items && orderData.items.length > 0
          ? orderData.items
          : (orderData.contents || []).map((c: any) => ({
              item_id: c.id || c.sku || 'item',
              item_name: c.name || c.item_name || 'Producto',
              price: c.price ?? c.item_price ?? 0,
              quantity: c.quantity || 1,
            }))
        )
      })

      tracked.current = true
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(trackingKey, 'true')
        } catch {}
      }
    }
  }, [orderData, userData, eventId])

  return null
}
