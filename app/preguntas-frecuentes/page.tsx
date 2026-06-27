import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { FaqAccordion } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Anbar Home',
  description: 'Todo lo que necesitas saber sobre nuestras tiendas, productos y métodos de compra.',
}

const faqs = [
  {
    question: '¿Dónde están ubicados?',
    answer: 'Contamos con tiendas en Bogotá y Bucaramanga, y también puedes comprar todos nuestros productos a través de nuestra tienda online.',
  },
  {
    question: '¿Los productos son nacionales o importados?',
    answer: 'Nuestra curaduría incluye piezas de lujo importadas desde países reconocidos por su excelencia en diseño, así como productos nacionales de alta gama.',
  },
  {
    question: '¿Puedo comprar desde cualquier ciudad de Colombia?',
    answer: 'Sí. Hacemos envíos a todo el país con transportadoras confiables, y el tiempo de entrega varía según tu ciudad.',
  },
  {
    question: '¿Tienen showroom físico o solo venden online?',
    answer: 'Tenemos tiendas físicas en Bogotá y Bucaramanga, y también una plataforma de e-commerce disponible 24/7.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito, débito y transferencias bancarias a través de plataformas seguras.',
  },
  {
    question: '¿Qué hace especial su colección navideña?',
    answer: 'Nuestra colección navideña se distingue por su elegancia, detalles refinados y piezas exclusivas que elevan cualquier ambiente.',
  },
  {
    question: '¿Puedo hacer pedidos personalizados o por encargo?',
    answer: 'Sí, ofrecemos atención personalizada para ayudarte a encontrar o encargar piezas que se ajusten a tu estilo.',
  }
]

export default function FaqPage() {
  return (
    <LegalLayout title="Faq's" breadcrumb="Faq's">
      <div className="mb-10 text-left">
        <h2 className="font-serif text-2xl font-medium tracking-wide text-neutral-900 md:text-3xl">
          Todo lo que necesitas saber
        </h2>
      </div>
      <FaqAccordion items={faqs} />
    </LegalLayout>
  )
}
