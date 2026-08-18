import { Metadata } from 'next'
import { MapPin, Navigation, Phone } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { client } from '@/sanity/lib/client'
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries'

import { FounderBanner } from '@/components/founder-banner'

export const metadata: Metadata = {
  title: 'Nosotros | Anbar Home',
  description: 'Conoce la historia de Anbar Home y nuestras tiendas físicas en Bogotá y Bucaramanga. Especialistas en decoración para el hogar y lujo silencioso.',
}

export default async function NosotrosPage() {
  const settings = await client.fetch(GLOBAL_SETTINGS_QUERY).catch(() => null)
  
  const stores = settings?.physicalStores && settings.physicalStores.length > 0
    ? settings.physicalStores.map((s: any) => ({
        city: s.city,
        address: s.address,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.city} ${s.address}`)}`
      }))
    : [
        {
          city: 'Bogotá',
          address: 'Calle 109 #18B-52, Local 101',
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bogota%20Calle%20109%20%2318B-52%20Local%20101',
        },
        {
          city: 'Bucaramanga',
          address: 'Calle 62 #30-99',
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bucaramanga%20Calle%2062%20%2330-99',
        },
        {
          city: 'Cabecera del Llano',
          address: 'Cra 36 #48-141 Local 5',
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cabecera%20del%20Llano%20Cra%2036%20%2348-141%20Local%205',
        },
      ]

  const rawWhatsapp = settings?.whatsappNumber || '3000000000'
  const whatsappNumber = rawWhatsapp.replace(/[^0-9]/g, '')

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white selection:bg-camel/20">
        
        {/* Hero Section */}
        <section className="relative h-[35vh] md:h-[45vh] w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950"></div>
          </div>
          <div className="relative z-10 text-center px-6">
            <h1 className="font-serif text-4xl md:text-6xl text-white font-light tracking-wide mb-4">
              Nuestra Historia
            </h1>
            <p className="text-neutral-300 font-light tracking-widest uppercase text-xs md:text-sm">
              El Arte de Vivir el Diseño
            </p>
          </div>
        </section>

        {/* Andres Barrientos Section (Banner) */}
        <FounderBanner />

        {/* Story Section */}
        <section className="py-16 md:py-24 px-6 md:px-10 lg:px-16 max-w-4xl mx-auto">
          <div className="space-y-16">
            
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 font-semibold tracking-tight">
                Anbar Home
              </h2>
              <p className="font-serif text-neutral-800 text-[15px] sm:text-base md:text-[17px] lg:text-[18.5px] leading-relaxed md:leading-[1.8] font-normal">
                En Anbar Home, creemos que la belleza está en los detalles, y que cada espacio puede convertirse en un reflejo auténtico de quien lo habita. Somos una tienda especializada en decoración para el hogar y la temporada navideña, con una propuesta basada en el lujo, la elegancia, el diseño y el confort.
              </p>
              <p className="font-serif text-neutral-800 text-[15px] sm:text-base md:text-[17px] lg:text-[18.5px] leading-relaxed md:leading-[1.8] font-normal">
                Nuestra historia comienza de la mano de Andrés Barrientos, decorador de Bucaramanga con más de 15 años de experiencia en el diseño de eventos. Impulsado por su pasión por la estética, fundó Anbar Home para traer a los hogares colombianos piezas exclusivas de los mejores destinos de diseño del mundo.
              </p>
            </div>

            <div className="h-px w-full bg-neutral-200" />

            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 font-semibold tracking-tight">
                Nuestra Visión
              </h2>
              <p className="font-serif text-neutral-800 text-[15px] sm:text-base md:text-[17px] lg:text-[18.5px] leading-relaxed md:leading-[1.8] font-normal">
                Proyectamos un crecimiento constante y sostenible guiado por la excelencia. En los próximos 5 años, consolidaremos nuestro liderazgo a través del crecimiento del portafolio premium, showrooms sensoriales y la expansión internacional hacia Miami.
              </p>
            </div>

          </div>
        </section>

        {/* Physical Stores Section */}
        <section className="bg-neutral-50 py-20 px-6 md:px-10 lg:px-16 border-t border-b border-neutral-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 font-semibold tracking-tight mb-4">
                Nuestras Tiendas Físicas
              </h2>
              <p className="font-serif text-neutral-800 text-[15px] sm:text-base md:text-[17px] lg:text-[18.5px] leading-relaxed font-normal">
                Visítanos en nuestras sedes y vive la experiencia Anbar Home en persona. Piezas exclusivas y asesoría personalizada de interiorismo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stores.map((store: any, idx: number) => (
                <div 
                  key={idx} 
                  className="bg-white p-8 rounded-xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-full bg-camel/10 text-camel-dark flex items-center justify-center mb-6">
                      <MapPin className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-neutral-900 font-medium mb-3">
                      {store.city}
                    </h3>
                    <p className="font-serif text-neutral-700 text-sm md:text-base leading-relaxed mb-6 font-normal">
                      {store.address}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 space-y-3">
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-neutral-900 hover:bg-camel-dark text-white text-sm font-medium transition-colors rounded-lg"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Cómo llegar (Google Maps)</span>
                    </a>
                    
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, me gustaría recibir información y asesoría sobre la sede de ${store.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-neutral-300 hover:border-camel text-neutral-700 hover:text-camel-dark text-sm font-medium transition-colors rounded-lg"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contactar tienda</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}

