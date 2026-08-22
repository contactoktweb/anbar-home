'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { ensureKlaviyo } from '@/lib/klaviyo/client';
import { KLAVIYO_JS_BASE_URL, getKlaviyoPublicKey } from '@/lib/klaviyo/config';

export function KlaviyoScript() {
  const publicKey = getKlaviyoPublicKey();

  useEffect(() => {
    // Initialize the in-memory Klaviyo queue right away so early calls are never dropped
    ensureKlaviyo();
  }, []);

  if (!publicKey) {
    return null;
  }

  return (
    <Script
      id="klaviyo-onsite-js"
      src={`${KLAVIYO_JS_BASE_URL}?company_id=${publicKey}`}
      strategy="afterInteractive"
    />
  );
}
