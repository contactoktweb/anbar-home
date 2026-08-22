/**
 * Klaviyo Configuration Module
 * Centralizes API revisions, base URLs, and environment variables.
 */

// Klaviyo API Revision pinned to the current stable version
export const KLAVIYO_API_REVISION = '2024-10-15';

// API Endpoints
export const KLAVIYO_BASE_URL = 'https://a.klaviyo.com/api';
export const KLAVIYO_EVENTS_ENDPOINT = `${KLAVIYO_BASE_URL}/events/`;
export const KLAVIYO_SUBSCRIPTIONS_ENDPOINT = `${KLAVIYO_BASE_URL}/profile-subscription-bulk-create-jobs/`;
export const KLAVIYO_PROFILES_ENDPOINT = `${KLAVIYO_BASE_URL}/profiles/`;
export const KLAVIYO_JS_BASE_URL = 'https://static.klaviyo.com/onsite/js/klaviyo.js';

// Default currency for Anbar Home
export const DEFAULT_CURRENCY = 'COP';
export const BRAND_NAME = 'Anbar Home';

/**
 * Retrieves the Klaviyo Public API Key / Site ID for client and server tracking.
 */
export function getKlaviyoPublicKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY;
  if (!key && process.env.NODE_ENV === 'development') {
    // Only warn once in development if not configured
    if (typeof window !== 'undefined' && !(window as any).__klaviyo_warned_public) {
      console.warn('[Klaviyo] Advertencia: NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY no está configurada en .env.local');
      (window as any).__klaviyo_warned_public = true;
    }
  }
  return key?.trim() || undefined;
}

/**
 * Retrieves the Klaviyo Private API Key (Server-Only).
 * Never expose this value to the browser.
 */
export function getKlaviyoPrivateKey(): string | undefined {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!key && process.env.NODE_ENV === 'development') {
    if (!(global as any).__klaviyo_warned_private) {
      console.warn('[Klaviyo Server] Advertencia: KLAVIYO_PRIVATE_API_KEY no está configurada en .env.local');
      (global as any).__klaviyo_warned_private = true;
    }
  }
  return key?.trim() || undefined;
}

/**
 * Helper logger for Klaviyo activity that suppresses excessive logs in production
 * and prevents leaking sensitive information.
 */
export function logKlaviyo(message: string, data?: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    if (data !== undefined) {
      console.log(`[Klaviyo] ${message}`, data);
    } else {
      console.log(`[Klaviyo] ${message}`);
    }
  }
}

export function logKlaviyoError(message: string, error?: unknown): void {
  // Always log errors but sanitize messages
  console.error(`[Klaviyo Error] ${message}`, error instanceof Error ? error.message : error);
}
