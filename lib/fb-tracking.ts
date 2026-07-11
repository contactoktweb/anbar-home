export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1605719891129628';
const TEST_EVENT_CODE = process.env.NEXT_PUBLIC_META_TEST_EVENT_CODE;

export const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return undefined;
};

export const trackEvent = async (
  eventName: string,
  eventData: Record<string, any> = {},
  userData: Record<string, any> = {},
  eventSourceUrl: string = typeof window !== 'undefined' ? window.location.href : ''
) => {
  if (typeof window === 'undefined') return;

  // Generate a unique ID for deduplication between Pixel and CAPI
  const eventId = crypto.randomUUID();
  const eventTime = Math.floor(Date.now() / 1000);

  // Capture _fbp and _fbc cookies
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  // 1. Client-Side tracking (Pixel)
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', eventName, eventData, { eventID: eventId });
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
