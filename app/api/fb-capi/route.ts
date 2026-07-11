import { NextResponse } from 'next/server';
import crypto from 'crypto';

const hashData = (data: string) => {
  if (!data) return data;
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventTime, eventId, eventSourceUrl, eventData = {}, userData = {}, testEventCode } = body;

    // Obtener IP y User Agent de los headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (req.headers.get('x-real-ip') || '');
    const userAgent = req.headers.get('user-agent') || '';

    // Preparar User Data, cifrando campos sensibles con SHA256 según indicaciones de Meta
    const processedUserData: any = {
      client_ip_address: clientIp, // No cifrar con hash
      client_user_agent: userAgent, // No cifrar con hash
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
    
    // Asignar fbp y fbc sin cifrar (ya están generados por Meta)
    if (userData.fbp) processedUserData.fbp = userData.fbp;
    if (userData.fbc) processedUserData.fbc = userData.fbc;

    // Eliminar propiedades nulas o vacías del custom_data
    const cleanEventData = Object.fromEntries(
      Object.entries(eventData).filter(([_, v]) => v != null)
    );

    // Construir Payload para CAPI
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

    // Agregar test_event_code si existe (usualmente solo en desarrollo)
    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    if (!ACCESS_TOKEN || !PIXEL_ID) {
      console.warn('Meta CAPI Error: META_CAPI_ACCESS_TOKEN o NEXT_PUBLIC_META_PIXEL_ID missing in .env.local');
      // No devolvemos error 500 para no romper el flujo del cliente, pero sí un warning
      return NextResponse.json({ success: false, message: 'Missing Meta Tokens' }, { status: 200 });
    }

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
      return NextResponse.json({ success: false, error: result }, { status: response.status });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error handling Meta CAPI request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
