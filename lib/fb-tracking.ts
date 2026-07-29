export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1068742772254099';
const TEST_EVENT_CODE = process.env.NEXT_PUBLIC_META_TEST_EVENT_CODE;

export const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return undefined;
};

const ensureFbq = () => {
  if (typeof window === 'undefined') return null;
  if (typeof (window as any).fbq === 'function') {
    return (window as any).fbq;
  }
  // Initialize fbq stub if not loaded yet so events are queued and never dropped
  const fbq: any = function () {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, arguments);
    } else {
      fbq.queue.push(arguments);
    }
  };
  if (!(window as any)._fbq) (window as any)._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = (window as any).fbq?.queue || [];
  (window as any).fbq = fbq;
  return fbq;
};

export const trackEvent = async (
  eventName: string,
  eventData: Record<string, any> = {},
  userData: Record<string, any> = {},
  eventSourceUrl: string = typeof window !== 'undefined' ? window.location.href : '',
  customEventId?: string
) => {
  if (typeof window === 'undefined') return;

  // Generate a unique ID for deduplication between Pixel and CAPI
  const eventId = customEventId || crypto.randomUUID();
  const eventTime = Math.floor(Date.now() / 1000);

  // Capture _fbp and _fbc cookies
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  // 1. Client-Side tracking (Pixel)
  const fbq = ensureFbq();
  if (fbq) {
    fbq('track', eventName, eventData, { eventID: eventId });
  }

  // 2. Server-Side tracking (CAPI)
  try {
    const body: any = {
      eventName,
      eventTime,
      eventId,
      eventSourceUrl,
      eventData,
      userData,
    };
    
    if (TEST_EVENT_CODE) {
      body.testEventCode = TEST_EVENT_CODE;
    }

    await fetch('/api/fb-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch (error) {
    console.error('Error sending FB CAPI event', error);
  }
};
