import { resend } from './resend';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail';
import { NewOrderAdminEmail } from '@/components/emails/NewOrderAdminEmail';
import { OrderDeclinedEmail } from '@/components/emails/OrderDeclinedEmail';
import { DiscountCouponEmail } from '@/components/emails/DiscountCouponEmail';

export async function sendDiscountCouponEmail({
  email,
  couponCode,
  logoUrl,
}: {
  email: string;
  couponCode: string;
  logoUrl?: string;
}) {
  try {
    const result = await resend.emails.send({
      from: 'Anbar Home <ventas@anbarhome.com>',
      to: email,
      subject: '✨ Tu 10% de descuento en Anbar Home',
      react: DiscountCouponEmail({
        couponCode,
        customerEmail: email,
        logoUrl,
      }),
    });
    console.log(`Correo de cupón enviado a ${email}`, result);
    return true;
  } catch (error) {
    console.error('Error al enviar correo de cupón de descuento:', error);
    return false;
  }
}

export async function processOrderEmails(order: any, settings: any, transactionStatus: string) {
  const customerEmail = order.customerEmail;
  const adminEmail = settings?.notificationEmail || 'anbarhomesas@gmail.com';
  const logoUrl = settings?.logoUrl;
  
  const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim() || 'Cliente';

  try {
    if (transactionStatus === 'APPROVED') {
      // 1. Enviar correo al cliente
      await resend.emails.send({
        from: 'Anbar Home <ventas@anbarhome.com>',
        to: customerEmail,
        subject: 'Confirmación de tu pedido en Anbar Home',
        react: OrderConfirmationEmail({
          customerName,
          orderReference: order._id,
          totalAmount: order.totalAmount,
          items: order.items || [],
          logoUrl,
          shippingAddress: order.shippingAddress,
          customerPhone: order.customerPhone,
        }),
      });

      // 2. Enviar correo al administrador
      await resend.emails.send({
        from: 'Anbar Home Notificaciones <ventas@anbarhome.com>',
        to: adminEmail,
        subject: `Nueva orden recibida - ${order._id}`,
        react: NewOrderAdminEmail({
          customerName,
          customerEmail,
          customerPhone: order.customerPhone || 'N/A',
          orderReference: order._id,
          totalAmount: order.totalAmount,
          items: order.items || [],
          logoUrl,
          shippingAddress: order.shippingAddress,
        }),
      });

      console.log(`Correos de aprobación enviados para la orden ${order._id}`);
      return true;

    } else if (transactionStatus === 'DECLINED' || transactionStatus === 'ERROR') {
      // 3. Enviar correo de orden declinada/error al cliente
      await resend.emails.send({
        from: 'Anbar Home <ventas@anbarhome.com>',
        to: customerEmail,
        subject: 'Actualización sobre tu pedido en Anbar Home',
        react: OrderDeclinedEmail({
          customerName,
          orderReference: order._id,
          logoUrl,
        }),
      });

      console.log(`Correo de declinación enviado para la orden ${order._id}`);
      return true;
    }
  } catch (error) {
    console.error('Error enviando correos de orden:', error);
    return false;
  }
}
