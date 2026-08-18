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
  Link,
  Preview,
  Button
} from '@react-email/components';
import * as React from 'react';

interface DiscountCouponEmailProps {
  couponCode: string;
  customerEmail: string;
  logoUrl?: string;
}

export const DiscountCouponEmail = ({
  couponCode = 'ANBAR10-XXXX',
  customerEmail = 'cliente@correo.com',
  logoUrl,
}: DiscountCouponEmailProps) => {
  const siteUrl = 'https://anbarhome.com';
  const finalLogoUrl =
    logoUrl ||
    'https://cdn.sanity.io/images/7zsgx3as/production/a5515a08edb40329e834de44cbe25f56bccde56b-826x249.png';

  return (
    <Html>
      <Head />
      <Preview>¡Tu 10% de descuento de bienvenida en Anbar Home está aquí!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header con Logo Oficial */}
          <Section style={header}>
            <Img
              src={finalLogoUrl}
              width="190"
              height="auto"
              alt="Anbar Home"
              style={logo}
            />
          </Section>

          {/* Banner de Bienvenida */}
          <Section style={heroSection}>
            <Text style={badge}>REGALO DE BIENVENIDA</Text>
            <Heading style={heroTitle}>10% OFF EN TU PRIMERA COMPRA</Heading>
            <Text style={heroSubtitle}>
              Gracias por unirte a Anbar Home. Nos apasiona crear espacios atemporales, serenos y llenos de carácter.
            </Text>
          </Section>

          {/* Caja del Código de Descuento */}
          <Section style={couponBox}>
            <Text style={couponLabel}>TU CÓDIGO EXCLUSIVO:</Text>
            <Text style={couponText}>{couponCode}</Text>
            <Text style={couponSubtext}>
              Copia este código e ingrésalo en el checkout para aplicar tu 10% de descuento.
            </Text>
            <Button style={ctaButton} href={siteUrl}>
              Explorar Colecciones y Canjear
            </Button>
          </Section>

          {/* Condiciones y Términos Importantes */}
          <Section style={termsSection}>
            <Text style={termsTitle}>📌 Términos y condiciones del cupón:</Text>
            <Text style={termsText}>
              • <strong>Uso exclusivo:</strong> Este código es válido <u>únicamente</u> para compras realizadas con el correo <strong>{customerEmail}</strong>.
            </Text>
            <Text style={termsText}>
              • <strong>No acumulable:</strong> Este descuento no es acumulable con otras promociones o cupones.
            </Text>
            <Text style={termsText}>
              • <strong>Uso único:</strong> Válido para una única compra por cliente.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Tienes dudas o necesitas asesoría personalizada para tu espacio?
            </Text>
            <Link href="https://wa.me/573227559139" style={whatsappLink}>
              Escríbenos a nuestro WhatsApp Oficial
            </Link>
            <Text style={copyrightText}>
              © {new Date().getFullYear()} Anbar Home. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Estilos en línea para máxima compatibilidad con clientes de correo
const main: React.CSSProperties = {
  backgroundColor: '#f8f8f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0',
  padding: '30px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 30px',
  maxWidth: '580px',
  borderRadius: '12px',
  border: '1px solid #eaeaea',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
};

const header: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const logo: React.CSSProperties = {
  margin: '0 auto',
  display: 'block',
};

const brandTitle: React.CSSProperties = {
  fontFamily: 'serif',
  fontSize: '28px',
  fontWeight: '400',
  color: '#262626',
  letterSpacing: '0.1em',
  margin: '0',
};

const heroSection: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const badge: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.2em',
  color: '#C19A6B',
  textTransform: 'uppercase' as const,
  marginBottom: '8px',
};

const heroTitle: React.CSSProperties = {
  fontFamily: 'serif',
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a1a1a',
  letterSpacing: '0.05em',
  margin: '0 0 12px 0',
  lineHeight: '1.3',
};

const heroSubtitle: React.CSSProperties = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.6',
  margin: '0 auto',
  maxWidth: '460px',
};

const couponBox: React.CSSProperties = {
  backgroundColor: '#FAFAF8',
  border: '2px dashed #C19A6B',
  borderRadius: '10px',
  padding: '28px 20px',
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const couponLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.15em',
  color: '#8A6A3F',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
};

const couponText: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '26px',
  fontWeight: '700',
  color: '#1a1a1a',
  letterSpacing: '0.15em',
  backgroundColor: '#ffffff',
  border: '1px solid #e2d7c5',
  borderRadius: '6px',
  padding: '10px 18px',
  display: 'inline-block',
  margin: '0 0 12px 0',
};

const couponSubtext: React.CSSProperties = {
  fontSize: '13px',
  color: '#777777',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
};

const ctaButton: React.CSSProperties = {
  backgroundColor: '#8A6A3F',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '13px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  textDecoration: 'none',
  display: 'inline-block',
};

const termsSection: React.CSSProperties = {
  backgroundColor: '#fcfcfc',
  border: '1px solid #f0f0f0',
  borderRadius: '8px',
  padding: '18px 20px',
  marginBottom: '30px',
};

const termsTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#333333',
  margin: '0 0 10px 0',
};

const termsText: React.CSSProperties = {
  fontSize: '12px',
  color: '#666666',
  lineHeight: '1.6',
  margin: '4px 0',
};

const divider: React.CSSProperties = {
  borderColor: '#eeeeee',
  margin: '25px 0',
};

const footer: React.CSSProperties = {
  textAlign: 'center' as const,
};

const footerText: React.CSSProperties = {
  fontSize: '13px',
  color: '#777777',
  marginBottom: '8px',
};

const whatsappLink: React.CSSProperties = {
  fontSize: '13px',
  color: '#8A6A3F',
  fontWeight: '600',
  textDecoration: 'none',
};

const copyrightText: React.CSSProperties = {
  fontSize: '11px',
  color: '#aaaaaa',
  marginTop: '20px',
};
