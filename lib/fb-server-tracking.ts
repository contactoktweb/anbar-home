import {
  hashValue,
  normalizeEmail,
  normalizePhone,
  normalizeName,
  normalizeCity,
  normalizeState,
  normalizeCountry,
} from './fb-normalization';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1068742772254099';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';
const TEST_EVENT_CODE = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_META_TEST_EVENT_CODE : undefined;

export interface CAPIEventPayload {
  eventName: string;
  eventTime: number;
  eventId: string;
  eventSourceUrl: string;
  eventData?: Record<string, any>;
  userData?: Record<string, any>;
  clientIp?: string;
  clientUserAgent?: string;
}

export const sendServerEvent = async (payloadData: CAPIEventPayload) => {
  if (!ACCESS_TOKEN || !PIXEL_ID) {
    console.warn('Meta CAPI Error: META_CAPI_ACCESS_TOKEN o NEXT_PUBLIC_META_PIXEL_ID missing in .env.local');
    return { success: false, message: 'Missing Meta Tokens' };
  }

  const { eventName, eventTime, eventId, eventSourceUrl, eventData = {}, userData = {}, clientIp = '', clientUserAgent = '' } = payloadData;

  const processedUserData: any = {
    client_ip_address: clientIp,
    client_user_agent: clientUserAgent,
  };

  const em = normalizeEmail(userData.em);
  if (em) processedUserData.em = [em];

  const ph = normalizePhone(userData.ph);
  if (ph) processedUserData.ph = [ph];

  const fn = normalizeName(userData.fn);
  if (fn) processedUserData.fn = [fn];

  const ln = normalizeName(userData.ln);
  if (ln) processedUserData.ln = [ln];

  const ct = normalizeCity(userData.ct);
  if (ct) processedUserData.ct = [ct];

  const st = normalizeState(userData.st);
  if (st) processedUserData.st = [st];

  const country = normalizeCountry(userData.country);
  if (country) processedUserData.country = [country];

  if (userData.external_id) {
    processedUserData.external_id = [hashValue(userData.external_id)];
  }

  if (userData.fbp) processedUserData.fbp = userData.fbp;
  if (userData.fbc) processedUserData.fbc = userData.fbc;

  const cleanEventData = Object.fromEntries(
    Object.entries(eventData).filter(([_, v]) => v != null)
  );

  const payload: any = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        action_source: 'website',
        event_id: eventId,
        event_source_url: eventSourceUrl,
        user_data: processedUserData,
        custom_data: cleanEventData,
      }
    ]
  };

  if (TEST_EVENT_CODE) {
    payload.test_event_code = TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI response error:', result);
      return { success: false, error: result };
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error handling Meta CAPI request:', error);
    return { success: false, error: error.message };
  }
};
