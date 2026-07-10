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
  Preview
} from '@react-email/components';
import * as React from 'react';

interface NewOrderAdminEmailProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
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
}

export const NewOrderAdminEmail = ({
  customerName = 'Cliente',
  customerEmail = 'correo@cliente.com',
  customerPhone = '00000000',
  orderReference = '#0000',
  totalAmount = 0,
  items = [],
  logoUrl,
  shippingAddress,
}: NewOrderAdminEmailProps) => {
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <Html>
      <Head />
      <Preview>¡Nueva Orden Recibida! Ref: {orderReference}</Preview>
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
            <Heading style={heading}>Nueva Orden Aprobada</Heading>
            <Text style={text}>
              Se ha recibido y confirmado una nueva compra. A continuación encontrarás los detalles del pedido para proceder con su despacho.
            </Text>

            <Hr style={hr} />

            <Section style={infoBlock}>
              <Heading as="h3" style={subheading}>Datos del Cliente</Heading>
              <Text style={detailText}><strong>Nombre:</strong> {customerName}</Text>
              <Text style={detailText}><strong>Email:</strong> {customerEmail}</Text>
              <Text style={detailText}><strong>Teléfono:</strong> {customerPhone}</Text>
            </Section>

            <Hr style={hr} />

            <Section style={infoBlock}>
              <Heading as="h3" style={subheading}>Datos del Pedido y Envío</Heading>
              <Text style={detailText}><strong>Referencia:</strong> {orderReference}</Text>
              <Text style={detailText}><strong>Monto Pagado:</strong> {formatCOP(totalAmount)}</Text>
              
              <Hr style={hr} />
              
              <Heading as="h4" style={subheading}>Dirección de Envío</Heading>
              {shippingAddress ? (
                <>
                  <Text style={detailText}>{shippingAddress.address}{shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}</Text>
                  <Text style={detailText}>{shippingAddress.city}, {shippingAddress.department}</Text>
                  {shippingAddress.postalCode && <Text style={detailText}>C.P.: {shippingAddress.postalCode}</Text>}
                </>
              ) : (
                <Text style={detailText}>No especificada</Text>
              )}
            </Section>

            <Hr style={hr} />

            <Heading as="h3" style={subheading}>Artículos Comprados</Heading>
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
            <Text style={text}>
              Por favor revisa el panel de Sanity para ver la dirección de envío completa y gestionar el estado del pedido.
            </Text>

          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Desarrollado por <Link href="https://www.kytcode.lat" style={link}>K&T ♥</Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Anbar Home. Panel de Administración.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewOrderAdminEmail;

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
  backgroundColor: '#fdfbf7',
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
  fontWeight: '500',
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

const detailText = {
  fontSize: '15px',
  color: '#444',
  margin: '5px 0',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '25px 0',
};

const infoBlock = {
  padding: '10px 0',
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
