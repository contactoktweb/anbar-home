import { NextResponse } from 'next/server';
import {
  hashValue,
  normalizeEmail,
  normalizePhone,
  normalizeName,
  normalizeCity,
  normalizeState,
  normalizeCountry,
} from '@/lib/fb-normalization';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1068742772254099';
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

    // Parse cookies from headers as a fallback
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
      }
    });
    
    // Asignar fbp y fbc sin cifrar (ya están generados por Meta)
    if (userData.fbp) processedUserData.fbp = userData.fbp;
    else if (cookies['_fbp']) processedUserData.fbp = cookies['_fbp'];

    if (userData.fbc) processedUserData.fbc = userData.fbc;
    else if (cookies['_fbc']) processedUserData.fbc = cookies['_fbc'];

    // Asignar external_id cifrado
    if (userData.external_id) processedUserData.external_id = [hashValue(userData.external_id)];
    else if (cookies['_anbar_ext_id']) processedUserData.external_id = [hashValue(cookies['_anbar_ext_id'])];

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

    // Agregar test_event_code si existe y solo en entorno de desarrollo
    if (testEventCode && process.env.NODE_ENV === 'development') {
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
