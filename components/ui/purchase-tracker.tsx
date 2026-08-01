'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/fb-tracking'

interface PurchaseTrackerProps {
  orderData: {
    currency: string
    value: number
    content_ids?: string[]
    contents?: any[]
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
      trackEvent('Purchase', {
        currency: orderData.currency,
        value: orderData.value,
        content_type: 'product',
        ...(orderData.content_ids && orderData.content_ids.length > 0 ? { content_ids: orderData.content_ids } : {}),
        ...(orderData.contents && orderData.contents.length > 0 ? { contents: orderData.contents } : {}),
        ...(orderData.order_id ? { order_id: orderData.order_id } : {})
      }, userData || {}, '', eventId)
      tracked.current = true
    }
  }, [orderData])

  return null
}
