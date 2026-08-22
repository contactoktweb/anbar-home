/**
 * TypeScript Type Definitions for Klaviyo Integration
 */

import { Product, CartItem } from '@/types';

// Global Klaviyo window object definitions
export interface KlaviyoWindowObject {
  push: (item: unknown[]) => void;
  identify: (profile: KlaviyoProfileProperties, callback?: () => void) => Promise<void> | void;
  track: (
    eventName: string,
    properties?: Record<string, unknown>,
    callback?: () => void
  ) => Promise<void> | void;
  trackViewedItem: (item: KlaviyoViewedProductPayload) => void;
  isIdentified?: () => boolean;
}

declare global {
  interface Window {
    _learnq?: unknown[][];
    klaviyo?: KlaviyoWindowObject;
  }
}

/**
 * Standard Klaviyo Profile Properties for identification
 */
export interface KlaviyoProfileProperties {
  email?: string;
  phone_number?: string;
  external_id?: string;
  first_name?: string;
  last_name?: string;
  organization?: string;
  title?: string;
  image?: string;
  city?: string;
  region?: string;
  country?: string;
  zip?: string;
  custom_properties?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Standard Klaviyo Item Schema for cart, checkout, and order events
 */
export interface KlaviyoItem {
  ProductID: string;
  SKU?: string;
  ProductName: string;
  Quantity: number;
  ItemPrice: number;
  RowTotal?: number;
  ImageURL?: string;
  URL?: string;
  Categories?: string[];
  Brand?: string;
  Price?: number;
  CompareAtPrice?: number | null;
}

/**
 * Event: Viewed Product
 */
export interface KlaviyoViewedProductPayload {
  ProductID: string;
  SKU?: string;
  ProductName: string;
  Categories: string[];
  ImageURL: string;
  URL: string;
  Price: number;
  CompareAtPrice?: number | null;
  Brand: string;
  Currency: string;
  description?: string;
}

/**
 * Event: Added to Cart
 */
export interface KlaviyoAddToCartPayload {
  ProductID: string;
  SKU?: string;
  ProductName: string;
  Quantity: number;
  Price: number;
  ItemPrice: number;
  RowTotal: number;
  ImageURL: string;
  URL: string;
  Categories: string[];
  Brand: string;
  Value: number;
  Currency: string;
  CartID?: string;
  Items?: KlaviyoItem[];
}

/**
 * Event: Removed from Cart
 */
export interface KlaviyoRemovedFromCartPayload {
  ProductID: string;
  SKU?: string;
  ProductName: string;
  Quantity: number;
  Price: number;
  ItemPrice: number;
  ImageURL: string;
  URL: string;
  Categories: string[];
  Brand: string;
  Value: number;
  Currency: string;
  CartID?: string;
  Items?: KlaviyoItem[];
}

/**
 * Event: Started Checkout
 */
export interface KlaviyoStartedCheckoutPayload {
  CheckoutID?: string;
  Value: number;
  Currency: string;
  Items: KlaviyoItem[];
  ItemNames: string[];
  Categories: string[];
  DiscountCode?: string;
  DiscountValue?: number;
  email?: string;
  phone?: string;
  CheckoutURL?: string;
}

/**
 * Event: Placed Order
 */
export interface KlaviyoPlacedOrderPayload {
  OrderId: string;
  Value: number;
  Currency: string;
  Items: KlaviyoItem[];
  ItemNames: string[];
  Categories: string[];
  DiscountCode?: string;
  DiscountValue?: number;
  Subtotal?: number;
  Shipping?: number;
  Tax?: number;
  email?: string;
  phone?: string;
  CustomerName?: string;
  BillingAddress?: {
    FirstName?: string;
    LastName?: string;
    Address1?: string;
    Address2?: string;
    City?: string;
    Region?: string;
    Country?: string;
    Zip?: string;
    Phone?: string;
  };
  ShippingAddress?: {
    FirstName?: string;
    LastName?: string;
    Address1?: string;
    Address2?: string;
    City?: string;
    Region?: string;
    Country?: string;
    Zip?: string;
    Phone?: string;
  };
}

/**
 * Event: Ordered Product
 */
export interface KlaviyoOrderedProductPayload {
  OrderId: string;
  ProductID: string;
  SKU?: string;
  ProductName: string;
  Quantity: number;
  Price: number;
  ItemPrice: number;
  RowTotal: number;
  Value: number;
  Currency: string;
  Categories: string[];
  ImageURL?: string;
  ProductURL?: string;
}

/**
 * Event: Search
 */
export interface KlaviyoSearchPayload {
  Query: string;
  ResultsCount?: number;
  URL?: string;
}

/**
 * Server Event creation parameters
 */
export interface KlaviyoServerEventParams {
  eventName: string;
  customer: {
    email?: string;
    phone_number?: string;
    external_id?: string;
    first_name?: string;
    last_name?: string;
    properties?: Record<string, unknown>;
  };
  properties: Record<string, unknown>;
  value?: number;
  uniqueId?: string;
  time?: string;
}

/**
 * Klaviyo Subscription payload params
 */
export interface KlaviyoSubscriptionParams {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  customProperties?: Record<string, unknown>;
}

/**
 * Response format for server actions / API helpers
 */
export interface KlaviyoApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
