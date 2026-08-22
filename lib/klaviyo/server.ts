/**
 * Server-Only Klaviyo Module
 * Communicates directly with Klaviyo REST API using KLAVIYO_PRIVATE_API_KEY.
 * Never runs in client-side bundles.
 */

import 'server-only';

import {
  KLAVIYO_API_REVISION,
  KLAVIYO_EVENTS_ENDPOINT,
  KLAVIYO_SUBSCRIPTIONS_ENDPOINT,
  getKlaviyoPrivateKey,
  logKlaviyo,
  logKlaviyoError,
} from './config';
import {
  KlaviyoServerEventParams,
  KlaviyoSubscriptionParams,
  KlaviyoApiResponse,
} from './types';
import {
  buildPlacedOrderPayloadFromSanity,
  buildOrderedProductPayloadsFromSanity,
} from './events';

/**
 * Builds the standard headers required for all Klaviyo REST API requests
 */
function getKlaviyoServerHeaders(privateKey: string): HeadersInit {
  return {
    'Authorization': `Klaviyo-API-Key ${privateKey}`,
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
    'revision': KLAVIYO_API_REVISION,
  };
}

/**
 * Sends a server-side event to Klaviyo via POST /api/events/
 */
export async function sendServerKlaviyoEvent(
  params: KlaviyoServerEventParams
): Promise<KlaviyoApiResponse> {
  const privateKey = getKlaviyoPrivateKey();

  if (!privateKey) {
    logKlaviyo(
      `[Mock/Skipped] Server event "${params.eventName}" skipped - KLAVIYO_PRIVATE_API_KEY not configured.`
    );
    return {
      success: false,
      error: 'KLAVIYO_PRIVATE_API_KEY is not configured',
    };
  }

  const { eventName, customer, properties, value, uniqueId, time } = params;

  if (!customer.email && !customer.phone_number && !customer.external_id) {
    return {
      success: false,
      error: 'Missing customer identifier (email, phone_number, or external_id is required)',
    };
  }

  try {
    // Build JSON:API event body
    const profileAttributes: Record<string, unknown> = {};
    if (customer.email) profileAttributes.email = customer.email;
    if (customer.phone_number) profileAttributes.phone_number = customer.phone_number;
    if (customer.external_id) profileAttributes.external_id = customer.external_id;
    if (customer.first_name) profileAttributes.first_name = customer.first_name;
    if (customer.last_name) profileAttributes.last_name = customer.last_name;
    if (customer.properties) profileAttributes.properties = customer.properties;

    const eventAttributes: Record<string, unknown> = {
      properties: properties,
      metric: {
        data: {
          type: 'metric',
          attributes: {
            name: eventName,
          },
        },
      },
      profile: {
        data: {
          type: 'profile',
          attributes: profileAttributes,
        },
      },
    };

    if (value !== undefined) {
      eventAttributes.value = value;
    }
    if (uniqueId) {
      eventAttributes.unique_id = uniqueId;
    }
    if (time) {
      eventAttributes.time = time;
    }

    const payload = {
      data: {
        type: 'event',
        attributes: eventAttributes,
      },
    };

    const res = await fetch(KLAVIYO_EVENTS_ENDPOINT, {
      method: 'POST',
      headers: getKlaviyoServerHeaders(privateKey),
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    // Klaviyo returns 202 Accepted on success
    if (res.status === 202 || res.status === 200 || res.status === 201) {
      logKlaviyo(`Server event "${eventName}" sent successfully (status ${res.status})`, {
        customer: customer.email,
        uniqueId,
      });
      return { success: true, statusCode: res.status };
    }

    const errorBody = await res.text().catch(() => '');
    logKlaviyoError(
      `Failed to send server event "${eventName}" (status ${res.status}): ${errorBody}`
    );

    return {
      success: false,
      statusCode: res.status,
      error: `Klaviyo responded with status ${res.status}: ${errorBody}`,
    };
  } catch (error) {
    logKlaviyoError(`Exception in sendServerKlaviyoEvent for "${eventName}"`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown network error',
    };
  }
}

/**
 * Subscribes a user profile to marketing communication using the official bulk subscription endpoint
 * POST /api/profile-subscription-bulk-create-jobs/
 */
export async function subscribeProfileToKlaviyo(
  params: KlaviyoSubscriptionParams
): Promise<KlaviyoApiResponse> {
  const privateKey = getKlaviyoPrivateKey();

  if (!privateKey) {
    logKlaviyo(
      `[Mock/Skipped] Newsletter subscription for ${params.email} skipped - KLAVIYO_PRIVATE_API_KEY not configured.`
    );
    return {
      success: false,
      error: 'KLAVIYO_PRIVATE_API_KEY is not configured',
    };
  }

  const normalizedEmail = params.email.trim().toLowerCase();

  try {
    // 1. Bulk subscription job with strict schema (email, phone_number, subscriptions)
    const profileAttributes: Record<string, unknown> = {
      email: normalizedEmail,
      subscriptions: {
        email: {
          marketing: {
            consent: 'SUBSCRIBED',
          },
        },
      },
    };

    if (params.phone) {
      profileAttributes.phone_number = params.phone;
    }

    const payload = {
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: profileAttributes,
              },
            ],
          },
        },
      },
    };

    const res = await fetch(KLAVIYO_SUBSCRIPTIONS_ENDPOINT, {
      method: 'POST',
      headers: getKlaviyoServerHeaders(privateKey),
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (res.status === 202 || res.status === 200 || res.status === 201) {
      logKlaviyo(`Profile subscription accepted for ${normalizedEmail} (status ${res.status})`);

      // 2. Track "Newsletter Signup" event with custom properties to enrich profile data
      if (params.customProperties || params.firstName || params.lastName) {
        await sendServerKlaviyoEvent({
          eventName: 'Newsletter Signup',
          customer: {
            email: normalizedEmail,
            first_name: params.firstName,
            last_name: params.lastName,
            phone_number: params.phone,
            properties: params.customProperties,
          },
          properties: params.customProperties || {},
        }).catch((err) => {
          logKlaviyoError('Error sending newsletter signup event', err);
        });
      }

      return { success: true, statusCode: res.status };
    }

    const errorBody = await res.text().catch(() => '');
    logKlaviyoError(
      `Failed to subscribe profile ${normalizedEmail} (status ${res.status}): ${errorBody}`
    );

    return {
      success: false,
      statusCode: res.status,
      error: `Klaviyo responded with status ${res.status}: ${errorBody}`,
    };
  } catch (error) {
    logKlaviyoError(`Exception in subscribeProfileToKlaviyo for ${normalizedEmail}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown network error',
    };
  }
}

/**
 * Tracks the critical "Placed Order" event from server-side (Wompi webhook or success page reconciliation)
 * Uses order ID as unique_id to ensure idempotency.
 */
export async function trackServerPlacedOrder(order: any): Promise<KlaviyoApiResponse> {
  try {
    if (!order || !order._id || !order.customerEmail) {
      return { success: false, error: 'Invalid order data for Klaviyo Placed Order' };
    }

    const payload = buildPlacedOrderPayloadFromSanity(order);
    const uniqueId = `klaviyo_order_${order._id}`;

    return await sendServerKlaviyoEvent({
      eventName: 'Placed Order',
      customer: {
        email: order.customerEmail,
        phone_number: order.customerPhone,
        first_name: order.customerFirstName,
        last_name: order.customerLastName,
        properties: {
          city: order.shippingAddress?.city,
          region: order.shippingAddress?.department,
          country: order.shippingAddress?.country || 'Colombia',
        },
      },
      properties: payload as unknown as Record<string, unknown>,
      value: payload.Value,
      uniqueId: uniqueId,
      time: order.paidAt || new Date().toISOString(),
    });
  } catch (error) {
    logKlaviyoError(`Error tracking server Placed Order for ${order?._id}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Tracks individual "Ordered Product" events for each item in a confirmed order
 */
export async function trackServerOrderedProducts(
  order: any
): Promise<KlaviyoApiResponse[]> {
  try {
    if (!order || !order._id || !order.customerEmail) {
      return [];
    }

    const productPayloads = buildOrderedProductPayloadsFromSanity(order);
    const results: KlaviyoApiResponse[] = [];

    for (const itemPayload of productPayloads) {
      const itemUniqueId = `klaviyo_ordered_item_${order._id}_${itemPayload.ProductID}_${itemPayload.SKU || 'default'}`;

      const res = await sendServerKlaviyoEvent({
        eventName: 'Ordered Product',
        customer: {
          email: order.customerEmail,
          phone_number: order.customerPhone,
          first_name: order.customerFirstName,
          last_name: order.customerLastName,
        },
        properties: itemPayload as unknown as Record<string, unknown>,
        value: itemPayload.Value,
        uniqueId: itemUniqueId,
        time: order.paidAt || new Date().toISOString(),
      });

      results.push(res);
    }

    return results;
  } catch (error) {
    logKlaviyoError(`Error tracking server Ordered Products for ${order?._id}`, error);
    return [];
  }
}
