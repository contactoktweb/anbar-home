import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { processOrderEmails } from './lib/emails';
import { adminClient } from './sanity/lib/adminClient';
import { GLOBAL_SETTINGS_QUERY } from './sanity/lib/queries';

async function run() {
  try {
    console.log('Fetching settings from Sanity...');
    const realSettings = await adminClient.fetch(GLOBAL_SETTINGS_QUERY);
    const adminEmail = realSettings?.notificationEmail || 'anbarhomesas@gmail.com';

    const mockOrder = {
      _id: 'TEST_ORDER_999',
      customerFirstName: 'Usuario',
      customerLastName: 'Prueba',
      customerEmail: adminEmail, // We send both to admin email to avoid spamming real customers
      customerPhone: '3001234567',
      totalAmount: 150000,
      shippingAddress: {
        address: 'Calle de Prueba 123',
        apartment: 'Apto 4B',
        city: 'Bogotá',
        department: 'Cundinamarca',
        postalCode: '110111',
        country: 'Colombia'
      },
      items: [
        { name: 'Producto de Prueba 1', quantity: 1, price: 100000 },
        { name: 'Producto de Prueba 2', quantity: 1, price: 50000 }
      ]
    };

    console.log('Sending APPROVED emails...');
    await processOrderEmails(mockOrder, realSettings, 'APPROVED');
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
