/**
 * Klaviyo Event Formatters and Mappers
 * Transforms real domain objects (Product, CartItem, Sanity Order) into standard Klaviyo event payloads.
 */

import { Product, CartItem } from '@/types';
import {
  KlaviyoItem,
  KlaviyoViewedProductPayload,
  KlaviyoAddToCartPayload,
  KlaviyoRemovedFromCartPayload,
  KlaviyoStartedCheckoutPayload,
  KlaviyoPlacedOrderPayload,
  KlaviyoOrderedProductPayload,
  KlaviyoSearchPayload,
} from './types';
import { BRAND_NAME, DEFAULT_CURRENCY } from './config';

/**
 * Helper to build an absolute URL for a product
 */
export function getProductUrl(slugOrId?: string): string {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.com';
  return slugOrId ? `${origin}/product/${slugOrId}` : origin;
}

/**
 * Normalizes categories array from a product
 */
export function getProductCategories(product: Product): string[] {
  if (product.categories && product.categories.length > 0) {
    return product.categories.filter(Boolean);
  }
  if (product.category) {
    return [product.category];
  }
  return [];
}

/**
 * Transforms a real Product into a standard Klaviyo Item object
 */
export function mapProductToKlaviyoItem(
  product: Product,
  quantity: number = 1
): KlaviyoItem {
  const categories = getProductCategories(product);
  const itemPrice = typeof product.price === 'number' ? product.price : 0;
  const productUrl = getProductUrl(product.slug || product.id);

  return {
    ProductID: product.id,
    SKU: product.sku || product.id,
    ProductName: product.name,
    Quantity: quantity,
    ItemPrice: itemPrice,
    Price: itemPrice,
    RowTotal: itemPrice * quantity,
    ImageURL: product.image || '',
    URL: productUrl,
    Categories: categories,
    Brand: BRAND_NAME,
    CompareAtPrice: product.originalPrice ?? null,
  };
}

/**
 * Transforms a CartItem into a standard Klaviyo Item object
 */
export function mapCartItemToKlaviyoItem(item: CartItem): KlaviyoItem {
  return mapProductToKlaviyoItem(item, item.quantity);
}

/**
 * Builds the payload for "Viewed Product"
 */
export function buildViewedProductPayload(product: Product): KlaviyoViewedProductPayload {
  const categories = getProductCategories(product);
  const price = typeof product.price === 'number' ? product.price : 0;
  const productUrl = getProductUrl(product.slug || product.id);

  return {
    ProductID: product.id,
    SKU: product.sku || product.id,
    ProductName: product.name,
    Categories: categories,
    ImageURL: product.image || '',
    URL: productUrl,
    Price: price,
    CompareAtPrice: product.originalPrice ?? null,
    Brand: BRAND_NAME,
    Currency: DEFAULT_CURRENCY,
    description: product.description,
  };
}

/**
 * Builds the payload for "Added to Cart"
 */
export function buildAddToCartPayload(
  product: Product,
  quantity: number = 1,
  currentCart: CartItem[] = []
): KlaviyoAddToCartPayload {
  const categories = getProductCategories(product);
  const price = typeof product.price === 'number' ? product.price : 0;
  const rowTotal = price * quantity;
  const productUrl = getProductUrl(product.slug || product.id);

  // Map full cart items if provided
  const items = currentCart.map(mapCartItemToKlaviyoItem);
  const totalCartValue = currentCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return {
    ProductID: product.id,
    SKU: product.sku || product.id,
    ProductName: product.name,
    Quantity: quantity,
    Price: price,
    ItemPrice: price,
    RowTotal: rowTotal,
    ImageURL: product.image || '',
    URL: productUrl,
    Categories: categories,
    Brand: BRAND_NAME,
    Value: totalCartValue > 0 ? totalCartValue : rowTotal,
    Currency: DEFAULT_CURRENCY,
    Items: items.length > 0 ? items : undefined,
  };
}

/**
 * Builds the payload for "Removed from Cart"
 */
export function buildRemovedFromCartPayload(
  product: Product,
  quantity: number = 1,
  updatedCart: CartItem[] = []
): KlaviyoRemovedFromCartPayload {
  const categories = getProductCategories(product);
  const price = typeof product.price === 'number' ? product.price : 0;
  const productUrl = getProductUrl(product.slug || product.id);

  const updatedCartValue = updatedCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return {
    ProductID: product.id,
    SKU: product.sku || product.id,
    ProductName: product.name,
    Quantity: quantity,
    Price: price,
    ItemPrice: price,
    ImageURL: product.image || '',
    URL: productUrl,
    Categories: categories,
    Brand: BRAND_NAME,
    Value: updatedCartValue,
    Currency: DEFAULT_CURRENCY,
    Items: updatedCart.map(mapCartItemToKlaviyoItem),
  };
}

/**
 * Builds the payload for "Started Checkout"
 */
export function buildStartedCheckoutPayload(
  cart: CartItem[],
  totalAmount: number,
  customerEmail?: string,
  customerPhone?: string
): KlaviyoStartedCheckoutPayload {
  const items = cart.map(mapCartItemToKlaviyoItem);
  const itemNames = cart.map((item) => item.name);
  const allCategories = Array.from(
    new Set(cart.flatMap(getProductCategories))
  );

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.com';

  return {
    Value: totalAmount,
    Currency: DEFAULT_CURRENCY,
    Items: items,
    ItemNames: itemNames,
    Categories: allCategories,
    email: customerEmail,
    phone: customerPhone,
    CheckoutURL: `${origin}/checkout`,
  };
}

/**
 * Builds the payload for "Search"
 */
export function buildSearchPayload(
  query: string,
  resultsCount?: number
): KlaviyoSearchPayload {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.com';

  return {
    Query: query,
    ResultsCount: resultsCount,
    URL: `${origin}/search?q=${encodeURIComponent(query)}`,
  };
}

/**
 * Builds the server payload for "Placed Order" from a Sanity Order document
 */
export function buildPlacedOrderPayloadFromSanity(order: any): KlaviyoPlacedOrderPayload {
  const items: KlaviyoItem[] = (order.items || []).map((item: any) => ({
    ProductID: item._key || item.id || item.sku || '',
    SKU: item.sku || item._key || '',
    ProductName: item.name || 'Producto',
    Quantity: Number(item.quantity) || 1,
    ItemPrice: Number(item.price) || 0,
    Price: Number(item.price) || 0,
    RowTotal: (Number(item.price) || 0) * (Number(item.quantity) || 1),
    ImageURL: item.image || '',
    Brand: BRAND_NAME,
  }));

  const itemNames = items.map((i) => i.ProductName);
  const totalValue = Number(order.totalAmount) || items.reduce((s, i) => s + (i.RowTotal || 0), 0);

  const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim();
  const shipping = order.shippingAddress || {};

  return {
    OrderId: order._id,
    Value: totalValue,
    Currency: DEFAULT_CURRENCY,
    Items: items,
    ItemNames: itemNames,
    Categories: [],
    DiscountCode: order.discountCode || undefined,
    DiscountValue: order.discountAmount || 0,
    Subtotal: order.subtotalAmount || totalValue,
    email: order.customerEmail,
    phone: order.customerPhone,
    CustomerName: customerName || undefined,
    ShippingAddress: {
      FirstName: order.customerFirstName,
      LastName: order.customerLastName,
      Address1: shipping.address,
      Address2: shipping.apartment || undefined,
      City: shipping.city,
      Region: shipping.department,
      Country: shipping.country || 'Colombia',
      Zip: shipping.postalCode || undefined,
      Phone: order.customerPhone,
    },
  };
}

/**
 * Builds server payloads for individual "Ordered Product" events from a Sanity Order
 */
export function buildOrderedProductPayloadsFromSanity(
  order: any
): KlaviyoOrderedProductPayload[] {
  const orderId = order._id;
  const items = order.items || [];

  return items.map((item: any) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    const rowTotal = price * qty;

    return {
      OrderId: orderId,
      ProductID: item._key || item.id || item.sku || '',
      SKU: item.sku || item._key || '',
      ProductName: item.name || 'Producto',
      Quantity: qty,
      Price: price,
      ItemPrice: price,
      RowTotal: rowTotal,
      Value: rowTotal,
      Currency: DEFAULT_CURRENCY,
      Categories: [],
      ImageURL: item.image || undefined,
    };
  });
}
