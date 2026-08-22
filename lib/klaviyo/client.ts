/**
 * Client-Side Klaviyo Abstraction Layer
 * Safe for browser execution, SSR resilient, and handles queue buffering.
 */

'use client';

import { Product, CartItem } from '@/types';
import {
  KlaviyoProfileProperties,
  KlaviyoWindowObject,
} from './types';
import {
  buildViewedProductPayload,
  buildAddToCartPayload,
  buildRemovedFromCartPayload,
  buildStartedCheckoutPayload,
  buildSearchPayload,
} from './events';
import { logKlaviyo, logKlaviyoError, getKlaviyoPublicKey } from './config';

/**
 * Ensures the Klaviyo global objects (_learnq and window.klaviyo) are initialized
 * even before the external klaviyo.js script has completely loaded.
 */
export function ensureKlaviyo(): KlaviyoWindowObject | null {
  if (typeof window === 'undefined') return null;

  // Initialize _learnq array if missing
  if (!window._learnq) {
    window._learnq = [];
  }

  // If window.klaviyo already has full implementation, return it
  if (window.klaviyo && typeof window.klaviyo.identify === 'function') {
    return window.klaviyo;
  }

  // Define stub so calls are buffered into _learnq
  const klaviyoStub: KlaviyoWindowObject = {
    push: (...args: unknown[]) => {
      window._learnq?.push(args as unknown[]);
    },
    identify: (profile: KlaviyoProfileProperties, callback?: () => void) => {
      window._learnq?.push(['identify', profile, callback]);
      if (callback) {
        setTimeout(callback, 0);
      }
    },
    track: (
      eventName: string,
      properties?: Record<string, unknown>,
      callback?: () => void
    ) => {
      window._learnq?.push(['track', eventName, properties, callback]);
      if (callback) {
        setTimeout(callback, 0);
      }
    },
    trackViewedItem: (item: unknown) => {
      window._learnq?.push(['trackViewedItem', item]);
    },
  };

  window.klaviyo = klaviyoStub;
  return klaviyoStub;
}

/**
 * Identifies a user in Klaviyo using real profile data (email, phone, name, etc.)
 */
export function identifyUser(profile: KlaviyoProfileProperties): void {
  try {
    if (typeof window === 'undefined') return;
    if (!profile || (!profile.email && !profile.phone_number && !profile.external_id)) {
      return;
    }

    const klaviyo = ensureKlaviyo();
    if (!klaviyo) return;

    // Filter out undefined or empty values
    const cleanProfile: KlaviyoProfileProperties = {};
    for (const [key, value] of Object.entries(profile)) {
      if (value !== undefined && value !== null && value !== '') {
        cleanProfile[key] = value;
      }
    }

    logKlaviyo('identifyUser called', cleanProfile.email || cleanProfile.phone_number);
    klaviyo.identify(cleanProfile);
  } catch (error) {
    logKlaviyoError('Error in identifyUser', error);
  }
}

/**
 * Generic event tracker for custom client-side events
 */
export function trackKlaviyoEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
): void {
  try {
    if (typeof window === 'undefined') return;
    const klaviyo = ensureKlaviyo();
    if (!klaviyo) return;

    logKlaviyo(`Event [${eventName}] queued`, properties);
    klaviyo.track(eventName, properties);
  } catch (error) {
    logKlaviyoError(`Error tracking event ${eventName}`, error);
  }
}

/**
 * Tracks the "Viewed Product" event when a visitor views a product page
 */
export function trackViewedProduct(product: Product): void {
  try {
    if (typeof window === 'undefined' || !product) return;
    const klaviyo = ensureKlaviyo();
    if (!klaviyo) return;

    const payload = buildViewedProductPayload(product);

    // Klaviyo recommends both trackViewedItem for native web feed & track('Viewed Product')
    klaviyo.trackViewedItem(payload);
    klaviyo.track('Viewed Product', payload as unknown as Record<string, unknown>);

    logKlaviyo('Viewed Product sent', product.name);
  } catch (error) {
    logKlaviyoError('Error in trackViewedProduct', error);
  }
}

/**
 * Tracks the "Added to Cart" event when a product is added to the cart
 */
export function trackAddedToCart(
  product: Product,
  quantity: number = 1,
  currentCart: CartItem[] = []
): void {
  try {
    if (typeof window === 'undefined' || !product) return;
    const klaviyo = ensureKlaviyo();
    if (!klaviyo) return;

    const payload = buildAddToCartPayload(product, quantity, currentCart);
    klaviyo.track('Added to Cart', payload as unknown as Record<string, unknown>);

    logKlaviyo('Added to Cart sent', `${product.name} (qty: ${quantity})`);
  } catch (error) {
    logKlaviyoError('Error in trackAddedToCart', error);
  }
}

/**
 * Tracks the "Removed from Cart" event when a product is removed
 */
export function trackRemovedFromCart(
  product: Product,
  quantity: number = 1,
  updatedCart: CartItem[] = []
): void {
  try {
    if (typeof window === 'undefined' || !product) return;
    const klaviyo = ensureKlaviyo();
    if (!klaviyo) return;

    const payload = buildRemovedFromCartPayload(product, quantity, updatedCart);
    klaviyo.track('Removed from Cart', payload as unknown as Record<string, unknown>);

    logKlaviyo('Removed from Cart sent', product.name);
  } catch (error) {
    logKlaviyoError('Error in trackRemovedFromCart', error);
  }
}

/**
 * Tracks the "Started Checkout" event when a user enters the checkout flow
 */
export function trackStartedCheckout(
  cart: CartItem[],
  totalAmount: number,
  customerEmail?: string,
  customerPhone?: string
): void {
  try {
    if (typeof window === 'undefined' || !cart || cart.length === 0) return;
    const klaviyo = ensureKlaviyo();
    if (!klaviyo) return;

    if (customerEmail) {
      identifyUser({ email: customerEmail, phone_number: customerPhone });
    }

    const payload = buildStartedCheckoutPayload(
      cart,
      totalAmount,
      customerEmail,
      customerPhone
    );
    klaviyo.track('Started Checkout', payload as unknown as Record<string, unknown>);

    logKlaviyo('Started Checkout sent', { items: cart.length, total: totalAmount });
  } catch (error) {
    logKlaviyoError('Error in trackStartedCheckout', error);
  }
}

/**
 * Tracks the "Search" event when a user performs a search
 */
export function trackSearch(query: string, resultsCount?: number): void {
  try {
    if (typeof window === 'undefined' || !query.trim()) return;
    const klaviyo = ensureKlaviyo();
    if (!klaviyo) return;

    const payload = buildSearchPayload(query.trim(), resultsCount);
    klaviyo.track('Search', payload as unknown as Record<string, unknown>);

    logKlaviyo('Search sent', { query, resultsCount });
  } catch (error) {
    logKlaviyoError('Error in trackSearch', error);
  }
}
