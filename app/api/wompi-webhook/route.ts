import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminClient } from '@/sanity/lib/adminClient';
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries';
import { processOrderEmails } from '@/lib/emails';
import { sendServerEvent } from '@/lib/fb-server-tracking';

function extractPropertyValue(body: any, prop: string): string {
  const parts = prop.split('.');
  
  // 1. Caso estándar de Wompi: "transaction.id", "transaction.status", etc.
  if (parts[0] === 'transaction' && body?.data?.transaction) {
    let curr: any = body.data.transaction;
    for (let i = 1; i < parts.length; i++) {
      curr = curr?.[parts[i]];
    }
    if (curr !== undefined && curr !== null) return String(curr);
  }

  // 2. Si la ruta incluye "data." ej: "data.transaction.id"
  if (parts[0] === 'data' && body?.data) {
    let curr: any = body.data;
    for (let i = 1; i < parts.length; i++) {
      curr = curr?.[parts[i]];
    }
    if (curr !== undefined && curr !== null) return String(curr);
  }

  // 3. Búsqueda directa en la raíz
  let curr: any = body;
  for (const part of parts) {
    curr = curr?.[part];
  }
  if (curr !== undefined && curr !== null) return String(curr);

  return '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validar la firma del evento (Webhook Signature)
    const eventsSecret = (process.env.WOMPI_EVENTS_SECRET || process.env.WOMPI_EVENTS_KEY || '').trim();
    if (eventsSecret && body.signature && body.signature.properties && body.signature.checksum) {
      let stringToHash = '';
      for (const prop of body.signature.properties) {
        stringToHash += extractPropertyValue(body, prop);
      }
      
      // Wompi exige concatenar: propiedades + timestamp + secreto de eventos
      const timestamp = body.timestamp ?? body.signature?.timestamp ?? '';
      stringToHash += timestamp;
      stringToHash += eventsSecret;
      
      const hashBuffer = crypto.createHash('sha256').update(stringToHash).digest('hex');
      const receivedChecksum = body.signature.checksum;
      
      if (hashBuffer.toLowerCase() !== receivedChecksum.toLowerCase()) {
        console.error('Firma inválida del webhook de Wompi', {
          calculated: hashBuffer,
          received: receivedChecksum,
        });
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else if (!eventsSecret) {
      console.warn('Aviso: WOMPI_EVENTS_SECRET no está configurada en las variables de entorno. Se recomienda configurarla.');
    }

    const eventName = body.event;
    if (eventName === 'transaction.updated') {
      const transaction = body.data.transaction;
      const status = transaction.status; // 'APPROVED', 'DECLINED', 'ERROR', etc.
      const reference = transaction.reference; // El ID de la orden que enviamos
      const amountInCents = transaction.amount_in_cents;
      const currency = transaction.currency;

      try {
        let order = await adminClient.getDocument(reference);
        if (!order) {
          order = await adminClient.fetch(
            `*[_type == "order" && (_id == $ref || wompiReference == $txId || wompiTransactionId == $txId)][0]`,
            { ref: reference, txId: transaction.id }
          );
        }
        
        if (!order) {
          console.warn(`Orden ${reference} (tx: ${transaction.id}) no encontrada en Sanity.`);
          return NextResponse.json({ received: true }, { status: 200 }); // Responder 200 para no hacer retry infinito si la orden no existe
        }

        const targetOrderId = order._id;

        // Actualización general de la orden
        const updateData: any = {
          status: status,
          wompiReference: transaction.id,
          wompiTransactionId: transaction.id,
          wompiRawStatus: status,
          wompiPaymentMethodType: transaction.payment_method_type,
          updatedAt: new Date().toISOString(),
        };

        if (status === 'APPROVED' && order.status !== 'APPROVED') {
          updateData.paidAt = new Date().toISOString();
        }

        await adminClient.patch(targetOrderId).set(updateData).commit();

        // Flujo de Éxito (Emails y Meta CAPI)
        if (status === 'APPROVED') {
          // Marcar cupón de descuento como usado si aplica
          if (order.discountCode) {
            try {
              const coupon = await adminClient.fetch(
                `*[_type == "discountCoupon" && upper(code) == $code][0]`,
                { code: order.discountCode.toUpperCase().trim() }
              );
              if (coupon?._id && !coupon.isUsed) {
                await adminClient
                  .patch(coupon._id)
                  .set({
                    isUsed: true,
                    usedAt: new Date().toISOString(),
                    orderReference: {
                      _type: 'reference',
                      _ref: targetOrderId,
                    },
                  })
                  .commit();
                console.log(`Cupón ${order.discountCode} marcado como utilizado para la orden ${targetOrderId}`);
              }
            } catch (couponErr) {
              console.error('Error al actualizar estado del cupón en Sanity:', couponErr);
            }
          }

          // Emails
          if (!order.emailSent) {
            const settings = await adminClient.fetch(GLOBAL_SETTINGS_QUERY);
            await processOrderEmails(order, settings, status);
            await adminClient.patch(targetOrderId).set({ emailSent: true }).commit();
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

            const purchaseEventId = order.meta.purchaseEventId || `purchase_${targetOrderId}`;

            const capiPayload = {
              eventName: 'Purchase',
              eventTime: Math.floor(Date.now() / 1000),
              eventId: purchaseEventId,
              eventSourceUrl: order.meta.eventSourceUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://anbarhome.co'}/checkout`,
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
                order_id: targetOrderId,
              }
            };

            const capiResponse = await sendServerEvent(capiPayload);
            
            if (capiResponse.success) {
              await adminClient.patch(targetOrderId).set({
                'meta.purchaseSentToMeta': true,
                'meta.purchaseSentToMetaAt': new Date().toISOString(),
                'meta.purchaseEventId': purchaseEventId
              }).commit();
              console.log(`Evento Purchase enviado a Meta para la orden ${targetOrderId}`);
            } else {
              console.error(`Error enviando Purchase a Meta para orden ${targetOrderId}:`, capiResponse.error);
            }
          }
        } else if (status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED') {
          if (!order.declinedEmailSent && !order.emailSent) {
            const settings = await adminClient.fetch(GLOBAL_SETTINGS_QUERY);
            await processOrderEmails(order, settings, status);
            await adminClient.patch(targetOrderId).set({ declinedEmailSent: true }).commit();
            console.log(`Correo de orden declinada enviado para ${targetOrderId}`);
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
