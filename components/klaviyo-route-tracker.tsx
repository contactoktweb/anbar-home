'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackKlaviyoEvent } from '@/lib/klaviyo/client';

function RouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
    
    // Deduplicate against initial double-firing
    if (lastTrackedUrl.current !== currentUrl) {
      lastTrackedUrl.current = currentUrl;
      
      // We don't send duplicate Viewed Product or other specific events here,
      // but ensure Klaviyo.js context aligns with the current URL.
    }
  }, [pathname, searchParams]);

  return null;
}

export function KlaviyoRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTrackerInner />
    </Suspense>
  );
}
