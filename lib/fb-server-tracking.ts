import crypto from 'crypto';

const hashData = (data: string) => {
  if (!data) return data;
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';
const TEST_EVENT_CODE = process.env.NEXT_PUBLIC_META_TEST_EVENT_CODE;

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

  if (userData.em) processedUserData.em = [hashData(userData.em)];
  if (userData.ph) processedUserData.ph = [hashData(userData.ph)];
  if (userData.fn) processedUserData.fn = [hashData(userData.fn)];
  if (userData.ln) processedUserData.ln = [hashData(userData.ln)];
  if (userData.ct) processedUserData.ct = [hashData(userData.ct)];
  if (userData.st) processedUserData.st = [hashData(userData.st)];
  if (userData.country) processedUserData.country = [hashData(userData.country)];
  if (userData.db) processedUserData.db = [hashData(userData.db)];
  if (userData.ge) processedUserData.ge = [hashData(userData.ge)];
  
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
