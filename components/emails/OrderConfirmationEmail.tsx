import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img,
  Row,
  Column,
  Link,
  Preview,
  Button
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderReference: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  logoUrl?: string;
  shippingAddress?: {
    address: string;
    apartment?: string;
    city: string;
    department: string;
    country?: string;
    postalCode?: string;
  };
  customerPhone?: string;
}

export const OrderConfirmationEmail = ({
  customerName = 'Cliente',
  orderReference = '#0000',
  totalAmount = 0,
  items = [],
  logoUrl,
  shippingAddress,
  customerPhone,
}: OrderConfirmationEmailProps) => {
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <Html>
      <Head />
      <Preview>Tu pedido de Anbar Home ha sido confirmado</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            {logoUrl ? (
              <Img src={logoUrl} width="160" height="auto" alt="Anbar Home Logo" style={logo} />
            ) : (
              <Heading style={brandText}>ANBAR HOME</Heading>
            )}
          </Section>

          <Section style={content}>
            <Heading style={heading}>¡Gracias por tu compra, {customerName}!</Heading>
            <Text style={text}>
              Tu pago ha sido procesado exitosamente y hemos comenzado a preparar tu pedido con dedicación. A continuación encontrarás los detalles de tu compra.
            </Text>

            <Hr style={hr} />

            <Section style={orderInfo}>
              <Row>
                <Column>
                  <Text style={label}>Referencia del Pedido</Text>
                  <Text style={value}>{orderReference}</Text>
                </Column>
                <Column>
                  <Text style={label}>Total Pagado</Text>
                  <Text style={value}>{formatCOP(totalAmount)}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section style={orderInfo}>
              <Heading as="h3" style={subheading}>Datos de Envío</Heading>
              {shippingAddress ? (
                <>
                  <Text style={detailText}>{shippingAddress.address}{shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}</Text>
                  <Text style={detailText}>{shippingAddress.city}, {shippingAddress.department}</Text>
                  {shippingAddress.postalCode && <Text style={detailText}>C.P.: {shippingAddress.postalCode}</Text>}
                </>
              ) : (
                <Text style={detailText}>No especificada</Text>
              )}
              {customerPhone && <Text style={detailText}><strong>Teléfono:</strong> {customerPhone}</Text>}
            </Section>

            <Hr style={hr} />

            <Heading as="h3" style={subheading}>Resumen de Artículos</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={{ width: '70%' }}>
                  <Text style={itemName}>{item.name} <span style={itemQuantity}>(x{item.quantity})</span></Text>
                </Column>
                <Column style={{ width: '30%', textAlign: 'right' }}>
                  <Text style={itemPrice}>{formatCOP(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            

            <Section style={btnContainer}>
              <Button style={button} href="https://anbarhome.com">
                Ir a la tienda
              </Button>
            </Section>

          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Desarrollado por <Link href="https://www.kytcode.lat" style={link}>K&T ♥</Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Anbar Home. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

const main = {
  backgroundColor: '#f9f9f9',
  fontFamily: '"Helvetica Neue", "Inter", Helvetica, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
};

const header = {
  backgroundColor: '#fdfbf7', // Ivory background
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #eaeaea',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const brandText = {
  fontSize: '28px',
  fontWeight: '300',
  letterSpacing: '4px',
  color: '#333',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const content = {
  padding: '40px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '300',
  color: '#222',
  marginBottom: '20px',
};

const subheading = {
  fontSize: '18px',
  fontWeight: '400',
  color: '#333',
  marginTop: '0',
  marginBottom: '15px',
};

const text = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#555',
  margin: '0 0 20px 0',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '25px 0',
};

const orderInfo = {
  padding: '10px 0',
};

const label = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  color: '#999',
  margin: '0 0 5px 0',
};

const value = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#333',
  margin: '0',
};

const detailText = {
  fontSize: '15px',
  color: '#444',
  margin: '5px 0',
};

const itemRow = {
  marginBottom: '15px',
};

const itemName = {
  fontSize: '15px',
  color: '#333',
  margin: '0',
};

const itemQuantity = {
  fontSize: '13px',
  color: '#888',
};

const itemPrice = {
  fontSize: '15px',
  fontWeight: '500',
  color: '#333',
  margin: '0',
};

const footer = {
  backgroundColor: '#111',
  padding: '30px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#888',
  margin: '5px 0',
};

const link = {
  color: '#fff',
  textDecoration: 'none',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '20px',
};

const button = {
  backgroundColor: '#222',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
  fontWeight: '500',
};
