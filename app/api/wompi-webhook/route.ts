import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminClient } from '@/sanity/lib/adminClient';
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries';
import { processOrderEmails } from '@/lib/emails';
import { sendServerEvent } from '@/lib/fb-server-tracking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validar la firma del evento (Webhook Signature)
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
    if (eventsSecret && body.signature && body.signature.properties && body.signature.checksum) {
      let stringToHash = '';
      for (const prop of body.signature.properties) {
        const parts = prop.split('.');
        if (parts.length === 2 && parts[0] === 'transaction' && body.data && body.data.transaction) {
          stringToHash += body.data.transaction[parts[1]];
        } else if (parts.length === 1) {
          stringToHash += body[prop];
        }
      }
      stringToHash += eventsSecret;
      
      const hashBuffer = crypto.createHash('sha256').update(stringToHash).digest('hex');
      if (hashBuffer !== body.signature.checksum) {
        console.error('Firma inválida del webhook de Wompi');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const eventName = body.event;
    if (eventName === 'transaction.updated') {
      const transaction = body.data.transaction;
      const status = transaction.status; // 'APPROVED', 'DECLINED', 'ERROR', etc.
      const reference = transaction.reference; // El ID de la orden que enviamos
      const amountInCents = transaction.amount_in_cents;
      const currency = transaction.currency;

      try {
        const order = await adminClient.getDocument(reference);
        
        if (!order) {
          console.warn(`Orden ${reference} no encontrada en Sanity.`);
          return NextResponse.json({ received: true }, { status: 200 }); // Responder 200 para no hacer retry infinito si la orden no existe
        }

        // Actualización general de la orden
        const updateData: any = {
          status: status,
          wompiTransactionId: transaction.id,
          wompiRawStatus: status,
          wompiPaymentMethodType: transaction.payment_method_type,
          updatedAt: new Date().toISOString(),
        };

        if (status === 'APPROVED' && order.status !== 'APPROVED') {
          updateData.paidAt = new Date().toISOString();
        }

        await adminClient.patch(reference).set(updateData).commit();

        // Flujo de Éxito (Emails y Meta CAPI)
        if (status === 'APPROVED') {
          // Emails
          if (!order.emailSent) {
            const settings = await adminClient.fetch(GLOBAL_SETTINGS_QUERY);
            await processOrderEmails(order, settings, status);
            await adminClient.patch(reference).set({ emailSent: true }).commit();
          }

          // Meta CAPI Purchase
          const isPurchaseSent = order.meta?.purchaseSentToMeta === true;
          
          if (!isPurchaseSent && order.meta) {
            // Reconstruir contents del carrito guardado
            const contents = order.items ? order.items.map((item: any) => ({
              id: item.sku || item._key,
              quantity: item.quantity,
              item_price: item.price
            })) : [];

            const contentIds = contents.map((c: any) => c.id);

            const purchaseEventId = order.meta.purchaseEventId || `purchase_${reference}`;

            const capiPayload = {
              eventName: 'Purchase',
              eventTime: Math.floor(Date.now() / 1000),
              eventId: purchaseEventId,
              eventSourceUrl: order.meta.eventSourceUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
              clientIp: order.meta.clientIp,
              clientUserAgent: order.meta.clientUserAgent,
              userData: {
                em: order.customerEmail,
                ph: order.customerPhone,
                fn: order.customerFirstName,
                ln: order.customerLastName,
                ct: order.shippingAddress?.city,
                st: order.shippingAddress?.department,
                country: 'co', // Asumiendo Colombia
                fbp: order.meta.fbp,
                fbc: order.meta.fbc,
              },
              eventData: {
                currency: currency,
                value: amountInCents / 100, // Validar total real del pedido
                content_type: 'product',
                content_ids: contentIds,
                contents: contents,
                order_id: reference,
              }
            };

            const capiResponse = await sendServerEvent(capiPayload);
            
            if (capiResponse.success) {
              await adminClient.patch(reference).set({
                'meta.purchaseSentToMeta': true,
                'meta.purchaseSentToMetaAt': new Date().toISOString(),
                'meta.purchaseEventId': purchaseEventId
              }).commit();
              console.log(`Evento Purchase enviado a Meta para la orden ${reference}`);
            } else {
              console.error(`Error enviando Purchase a Meta para orden ${reference}:`, capiResponse.error);
            }
          }
        }
      } catch (patchError) {
        console.error(`Error procesando orden en Sanity (${reference}):`, patchError);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error procesando el webhook de Wompi:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
