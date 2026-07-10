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

interface OrderDeclinedEmailProps {
  customerName: string;
  orderReference: string;
  logoUrl?: string;
}

export const OrderDeclinedEmail = ({
  customerName = 'Cliente',
  orderReference = '#0000',
  logoUrl,
}: OrderDeclinedEmailProps) => {

  return (
    <Html>
      <Head />
      <Preview>Actualización sobre tu pedido en Anbar Home</Preview>
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
            <Heading style={heading}>Hola {customerName},</Heading>
            <Text style={text}>
              Te informamos que tu pago para el pedido con referencia <strong>{orderReference}</strong> ha sido declinado o ha ocurrido un inconveniente durante el procesamiento.
            </Text>
            <Text style={text}>
              Sabemos lo importante que es para ti y queremos ayudarte. Por favor, intenta realizar tu compra nuevamente utilizando otro método de pago, o contacta a tu banco para más información.
            </Text>

            <Hr style={hr} />

            <Text style={text}>
              Si necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte a concretar tu pedido.
            </Text>

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

export default OrderDeclinedEmail;

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
  fontSize: '22px',
  fontWeight: '300',
  color: '#222',
  marginBottom: '20px',
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
