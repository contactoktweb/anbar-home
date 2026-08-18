import { defineField, defineType } from 'sanity'
import { ShoppingBag } from 'lucide-react'

export const order = defineType({
  name: 'order',
  title: 'Pedidos',
  type: 'document',
  icon: ShoppingBag,
  fields: [
    defineField({
      name: 'customerFirstName',
      title: 'Nombre del Cliente',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerLastName',
      title: 'Apellidos del Cliente',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email del Cliente',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerPhone',
      title: 'Teléfono',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Dirección de Envío',
      type: 'object',
      readOnly: true,
      fields: [
        { name: 'address', type: 'string', title: 'Dirección' },
        { name: 'apartment', type: 'string', title: 'Apartamento' },
        { name: 'city', type: 'string', title: 'Ciudad' },
        { name: 'department', type: 'string', title: 'Departamento' },
        { name: 'country', type: 'string', title: 'País' },
        { name: 'postalCode', type: 'string', title: 'Código Postal' },
      ]
    }),
    defineField({
      name: 'items',
      title: 'Productos',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Nombre' },
            { name: 'sku', type: 'string', title: 'SKU' },
            { name: 'quantity', type: 'number', title: 'Cantidad' },
            { name: 'price', type: 'number', title: 'Precio' },
            { name: 'image', type: 'string', title: 'Imagen URL' },
          ]
        }
      ]
    }),
    defineField({
      name: 'subtotalAmount',
      title: 'Subtotal (Antes de descuento)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'discountAmount',
      title: 'Descuento Aplicado',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'discountCode',
      title: 'Código de Descuento Usado',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'totalAmount',
      title: 'Monto Total Final',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Estado del Pedido',
      type: 'string',
      options: {
        list: [
          { title: 'Pendiente', value: 'PENDING' },
          { title: 'Aprobado', value: 'APPROVED' },
          { title: 'Declinado', value: 'DECLINED' },
          { title: 'Error', value: 'ERROR' },
        ],
      },
      initialValue: 'PENDING',
    }),
    defineField({
      name: 'wompiReference',
      title: 'Referencia Wompi',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'emailSent',
      title: 'Correo Enviado',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: 'paidAt',
      title: 'Fecha de Pago',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'wompiTransactionId',
      title: 'ID Transacción Wompi (Interno)',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'wompiRawStatus',
      title: 'Estado Crudo Wompi',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'wompiPaymentMethodType',
      title: 'Método de Pago',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'meta',
      title: 'Meta Tracking Data',
      type: 'object',
      readOnly: true,
      fields: [
        { name: 'fbp', type: 'string', title: '_fbp Cookie' },
        { name: 'fbc', type: 'string', title: '_fbc Cookie' },
        { name: 'clientIp', type: 'string', title: 'IP del Cliente' },
        { name: 'clientUserAgent', type: 'string', title: 'User Agent' },
        { name: 'eventSourceUrl', type: 'string', title: 'Source URL' },
        { name: 'purchaseEventId', type: 'string', title: 'Purchase Event ID' },
        { name: 'purchaseSentToMeta', type: 'boolean', title: 'Enviado a Meta CAPI', initialValue: false },
        { name: 'purchaseSentToMetaAt', type: 'datetime', title: 'Fecha de Envío a CAPI' },
      ]
    }),
  ],
  preview: {
    select: {
      title: 'customerEmail',
      firstName: 'customerFirstName',
      lastName: 'customerLastName',
      status: 'status',
      amount: 'totalAmount',
    },
    prepare(selection) {
      const { title, firstName, lastName, status, amount } = selection
      return {
        title: `${firstName || ''} ${lastName || ''} (${title})`.trim(),
        subtitle: `${status} - COP ${amount}`,
      }
    }
  }
})
