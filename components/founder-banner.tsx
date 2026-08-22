import Image from 'next/image'
import { Reveal } from '@/components/reveal'

export function FounderBanner() {
  return (
    <section className="w-full bg-white border-y border-neutral-200/80 overflow-hidden">
      <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[460px] lg:min-h-[520px] items-stretch">
            {/* Image Column */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:aspect-auto md:min-h-[500px] lg:min-h-[580px] bg-neutral-100 overflow-hidden">
              <Image
                src="/andres.jpeg"
                alt="Andres Barrientos | Anbar Home"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                className="object-cover object-top md:object-center grayscale hover:grayscale-0 transition-all duration-700 ease-out"
              />
            </div>

            {/* Content Column */}
            <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-10 lg:p-14 xl:p-20 bg-white">
              <div className="w-full max-w-xl mx-auto space-y-6">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-[36px] xl:text-[40px] font-semibold text-neutral-900 tracking-tight leading-snug whitespace-nowrap">
                  Andres Barrientos | Anbar Home
                </h2>
                
                <p className="font-serif text-neutral-800 text-[15px] sm:text-base md:text-[17px] lg:text-[18.5px] leading-relaxed md:leading-[1.8] font-normal max-w-lg mx-auto">
                  Con 9 años de experiencia como importador directo, Andrés Barrientos ha desarrollado una propuesta de decoración basada en la búsqueda de piezas únicas y la relación directa con fabricantes internacionales. Una selección diversa y exclusiva, pensada para crear espacios con carácter e identidad propia.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
    </section>
  )
}
