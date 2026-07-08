import { Metadata } from 'next'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export const metadata: Metadata = {
  title: 'Nosotros | Anbar Home',
  description: 'Conoce la historia de Anbar Home, fundada por Andrés Barrientos. Una tienda especializada en decoración para el hogar y la temporada navideña.',
}

export default function NosotrosPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white selection:bg-camel/20">
        
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[60vh] w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            {/* Si tienes una imagen de portada para "Nosotros", la puedes colocar aquí. Por ahora usamos un color sólido con un patrón sutil. */}
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950"></div>
          </div>
          <div className="relative z-10 text-center px-6">
            <h1 className="font-serif text-4xl md:text-6xl text-white font-light tracking-wide mb-4">
              Nuestra Historia
            </h1>
            <p className="text-neutral-300 font-light tracking-widest uppercase text-sm md:text-base">
              El Arte de Vivir el Diseño
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 md:py-32 px-6 md:px-10 lg:px-16 max-w-4xl mx-auto">
          <div className="space-y-16">
            
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 font-light">
                Anbar Home
              </h2>
              <p className="text-base md:text-lg text-neutral-600 font-light leading-relaxed text-justify">
                En Anbar Home, creemos que la belleza está en los detalles, y que cada espacio puede convertirse en un reflejo auténtico de quien lo habita. Somos una tienda especializada en decoración para el hogar y la temporada navideña, con una propuesta basada en el lujo, la elegancia, el diseño y el confort.
              </p>
              <p className="text-base md:text-lg text-neutral-600 font-light leading-relaxed text-justify">
                Nuestra historia comienza de la mano de Andrés Barrientos, decorador de Bucaramanga con más de 15 años de experiencia en el diseño de eventos. Impulsado por su pasión por la estética, fundó Anbar Home para traer a los hogares colombianos piezas exclusivas de los mejores destinos de diseño del mundo.
              </p>
            </div>

            <div className="h-px w-full bg-neutral-200" />

            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 font-light">
                Nuestra Visión
              </h2>
              <p className="text-base md:text-lg text-neutral-600 font-light leading-relaxed text-justify">
                Proyectamos un crecimiento constante y sostenible guiado por la excelencia. En los próximos 5 años, consolidaremos nuestro liderazgo a través del crecimiento del portafolio premium, showrooms sensoriales y la expansión internacional hacia Miami.
              </p>
            </div>

          </div>
        </section>

      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
