/**
 * Klaviyo Integration Layer Entry Point
 */

export * from './config';
export * from './types';
export * from './events';
export * from './client';

// Note: Server-only exports should be imported directly from '@/lib/klaviyo/server'
// in server components / route handlers to ensure clean bundle separation.
