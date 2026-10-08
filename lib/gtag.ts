export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-TFMWCDEYWX'

// Ensure TypeScript recognizes window.gtag and window.dataLayer
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

/**
 * Safe gtag invoker that queues events into dataLayer if gtag hasn't loaded yet.
 */
export const gtag = (...args: any[]) => {
  if (typeof window === 'undefined') return

  if (typeof window.gtag === 'function') {
    window.gtag(...args)
  } else {
    window.dataLayer = window.dataLayer || []
    if (typeof (window as any).gtag !== 'function') {
      (window as any).gtag = function () {
        window.dataLayer.push(arguments)
      }
    }
    (window as any).gtag(...args)
  }
}

/**
 * Generic GA4 custom event tracking helper
 */
export const trackGAEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    gtag('event', eventName, params)
  } catch (error) {
    console.error(`[GA4] Error tracking event "${eventName}":`, error)
  }
}

export interface GAItem {
  item_id: string
  item_name: string
  price: number
  quantity: number
  currency?: string
  item_category?: string
}

/**
 * Normalizes item objects to GA4 standard e-commerce item schema
 */
export const formatGAItem = (item: any, quantity: number = 1): GAItem => {
  return {
    item_id: String(item.sku || item.id || item._key || 'unknown'),
    item_name: item.name || item.item_name || 'Producto',
    price: Number(item.price ?? item.item_price ?? 0),
    quantity: Number(item.quantity ?? quantity ?? 1),
    currency: 'COP',
    ...(item.category || item.item_category ? { item_category: item.category || item.item_category } : {}),
  }
}

/**
 * GA4 view_item event: Triggered when viewing a product details page or quick view modal
 */
export const trackGAViewItem = (product: any) => {
  if (!product) return

  const item = formatGAItem(product, 1)
  trackGAEvent('view_item', {
    currency: 'COP',
    value: item.price,
    items: [item],
  })
}

/**
 * GA4 add_to_cart event: Triggered when an item is added to the shopping cart
 */
export const trackGAAddToCart = (product: any, quantity: number = 1) => {
  if (!product || quantity <= 0) return

  const item = formatGAItem(product, quantity)
  trackGAEvent('add_to_cart', {
    currency: 'COP',
    value: item.price * quantity,
    items: [item],
  })
}

/**
 * GA4 remove_from_cart event: Triggered when an item is removed from the shopping cart
 */
export const trackGARemoveFromCart = (product: any, quantity: number = 1) => {
  if (!product || quantity <= 0) return

  const item = formatGAItem(product, quantity)
  trackGAEvent('remove_from_cart', {
    currency: 'COP',
    value: item.price * quantity,
    items: [item],
  })
}

/**
 * GA4 view_cart event: Triggered when opening or viewing the shopping cart
 */
export const trackGAViewCart = (cart: any[], totalValue: number) => {
  if (!cart || cart.length === 0) return

  const items = cart.map((item) => formatGAItem(item, item.quantity))
  trackGAEvent('view_cart', {
    currency: 'COP',
    value: totalValue,
    items,
  })
}

/**
 * GA4 begin_checkout event: Triggered when the user enters the checkout flow
 */
export const trackGABeginCheckout = (cart: any[], totalValue: number, coupon?: string) => {
  if (!cart || cart.length === 0) return

  const items = cart.map((item) => formatGAItem(item, item.quantity))
  trackGAEvent('begin_checkout', {
    currency: 'COP',
    value: totalValue,
    ...(coupon ? { coupon } : {}),
    items,
  })
}

/**
 * GA4 add_payment_info event: Triggered when the user submits payment details to proceed
 */
export const trackGAAddPaymentInfo = (
  cart: any[],
  totalValue: number,
  coupon?: string,
  paymentType: string = 'Wompi'
) => {
  if (!cart || cart.length === 0) return

  const items = cart.map((item) => formatGAItem(item, item.quantity))
  trackGAEvent('add_payment_info', {
    currency: 'COP',
    value: totalValue,
    payment_type: paymentType,
    ...(coupon ? { coupon } : {}),
    items,
  })
}

export interface GAPurchasePayload {
  transaction_id: string
  value: number
  currency?: string
  coupon?: string
  tax?: number
  shipping?: number
  items: any[]
}

/**
 * GA4 purchase event: Triggered on checkout success page with transaction confirmation
 */
export const trackGAPurchase = ({
  transaction_id,
  value,
  currency = 'COP',
  coupon,
  tax = 0,
  shipping = 0,
  items = [],
}: GAPurchasePayload) => {
  if (!transaction_id || value <= 0) return

  const formattedItems = items.map((item) => formatGAItem(item, item.quantity || 1))

  trackGAEvent('purchase', {
    transaction_id,
    value,
    currency,
    ...(coupon ? { coupon } : {}),
    ...(tax > 0 ? { tax } : {}),
    ...(shipping > 0 ? { shipping } : {}),
    items: formattedItems,
  })
}

/**
 * GA4 search event: Triggered when a user performs a search
 */
export const trackGASearch = (searchTerm: string) => {
  if (!searchTerm) return
  trackGAEvent('search', {
    search_term: searchTerm,
  })
}
