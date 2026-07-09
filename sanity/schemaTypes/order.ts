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
            { name: 'quantity', type: 'number', title: 'Cantidad' },
            { name: 'price', type: 'number', title: 'Precio' },
          ]
        }
      ]
    }),
    defineField({
      name: 'totalAmount',
      title: 'Monto Total',
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
