import Image from 'next/image'

export function Blog() {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6 md:px-10">

        {/* Title */}
        <h2 className="mb-6 font-serif text-4xl font-normal text-neutral-900 md:text-5xl lg:text-6xl leading-tight">
          El regreso de los <em className="italic">espacios sensoriales</em>: así se vera<br className="hidden md:block" /> el diseño interior del futuro
        </h2>

        {/* Meta data */}
        <div className="mb-12 flex flex-wrap items-center gap-2 text-sm text-neutral-500 font-light">
          <span>1 Junio 2026</span>
          <span>•</span>
          <span>4 min de lectura</span>
          <span>•</span>
          <span>Diseño interior</span>
          <span>•</span>
          <span>Bienestar</span>
          <span>•</span>
          <span>Autor: Andrés Barrientos Decorador</span>
        </div>

        {/* Content & Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text Content */}
          <div className="flex flex-col space-y-6">
            <p className="text-[17px] leading-relaxed text-neutral-800">
              El hogar dejó de ser únicamente un lugar funcional. Hoy buscamos
              espacios que nos hagan sentir bien, reducir el estrés y reconectar
              con nosotros mismos. Las tendencias ya no giran exclusivamente
              alrededor de la estética.
            </p>
            <p className="text-[17px] leading-relaxed text-neutral-800">
              Ahora importan las emociones, la calma y la experiencia sensorial
              que transmite cada ambiente. Y esa nueva manera de habitar los
              espacios está dando origen a una de las corrientes más importantes
              de los próximos años: los espacios sensoriales.
            </p>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/jarrones.webp"
              alt="Espacios sensoriales - Jarrones blancos texturizados"
              fill
              className="object-cover"
            />
          </div>

        </div>

        {/* Continuation Content */}
        <div className="mt-16 space-y-16">
          {/* Section 1 */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-medium text-neutral-900 md:text-3xl">
              El diseño interior está cambiando
            </h3>
            <div className="space-y-6 text-[17px] leading-relaxed text-neutral-800 text-justify">
              <p>
                Durante años, el diseño interior estuvo dominado por espacios
                extremadamente minimalistas y ambientes pensados más para verse
                bien en fotografías que para disfrutarse diariamente. Pero las
                prioridades cambiaron.
              </p>
              <p>
                Después de una etapa marcada por el exceso visual, las personas
                comenzaron a valorar hogares más humanos, cálidos y emocionalmente
                conectados. Lugares capaces de transmitir tranquilidad, autenticidad
                y bienestar. Por eso, el diseño interior moderno está evolucionando
                hacia ambientes mucho más sensoriales y acogedores. Hoy, el
                verdadero lujo no consiste en tener más objetos, sino en crear
                espacios que se sientan bien.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-medium text-neutral-900 md:text-3xl">
              El auge de los espacios sensoriales
            </h3>
            <div className="space-y-6 text-[17px] leading-relaxed text-neutral-800 text-justify">
              <p>
                La idea es sencilla: diseñar interiores que no solo se observen,
                sino que también se experimenten emocionalmente.
              </p>

              <p>
                Entre las tendencias más importantes destacan:
              </p>

              <ul className="list-disc space-y-3 pl-6 text-left">
                <li>Materiales naturales como madera y lino.</li>
                <li>Iluminación cálida e indirecta.</li>
                <li>Texturas artesanales.</li>
                <li>Elementos decorativos con intención emocional.</li>
              </ul>

              <p>
                En este nuevo enfoque, el diseño interior deja de ser únicamente
                decorativo para convertirse en una herramienta de bienestar
                cotidiano.
              </p>
            </div>
          </div>

          {/* Image 2 */}
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image
              src="/collage.png"
              alt="Collage de espacios interiores emocionales y minimalistas"
              fill
              className="object-cover"
            />
          </div>

          {/* Section 3 - Wide Container */}
          <div className="mt-20 mb-20 space-y-10">
            <h3 className="font-serif text-3xl md:text-4xl lg:text-[42px] font-normal text-neutral-900 text-center">
              Materiales <em className="italic">naturales</em>: La clave del nuevo lujo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start text-[17px] leading-relaxed text-neutral-800 text-justify">
              {/* Left Column */}
              <div className="space-y-6">
                <p>
                  Uno de los grandes protagonistas de las tendencias actuales es el uso
                  de materiales nobles y orgánicos.
                </p>
                <p>
                  La madera natural, la cerámica artesanal, el mármol y las fibras
                  textiles están reemplazando acabados excesivamente industriales o
                  artificiales. ¿Por qué? Porque generan una sensación inmediata de
                  calma y autenticidad.
                </p>
                <p>
                  Además, conectan perfectamente con el movimiento “Quiet Luxury”, una
                  filosofía estética basada en la sofisticación silenciosa, la calidad y
                  la elegancia atemporal.
                </p>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <p>
                  Actualmente, los espacios más sofisticados priorizan:
                </p>

                <ul className="list-disc space-y-3 pl-6 marker:text-neutral-900 text-left">
                  <li className="pl-1">Texturas suaves.</li>
                  <li className="pl-1">Tonos tierra y neutros.</li>
                  <li className="pl-1">Piezas artesanales.</li>
                  <li className="pl-1">Objetos decorativos orgánicos.</li>
                  <li className="pl-1">Ambientes visualmente ligeros.</li>
                </ul>

                <p>
                  El objetivo es construir hogares mucho más emocionales y menos rígidos.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-medium text-neutral-900 md:text-3xl">
              El diseño interior emocional será la gran tendencia
            </h3>
            <p className="text-[17px] leading-relaxed text-neutral-800 text-justify">
              Cada vez más personas buscan hogares que reflejen personalidad y
              bienestar. La sofisticación moderna ya no es fría ni excesiva.
              Ahora busca transmitir autenticidad y conexión humana. Por eso,
              hoteles boutique, marcas premium y proyectos residenciales están
              adoptando un diseño interior mucho más cálido y sensorial.
            </p>
          </div>

          {/* Quote (now normal text) */}
          <div className="my-12 space-y-6">
            <p className="text-[17px] leading-relaxed text-neutral-800 text-justify">
              “El futuro del diseño interior será más humano”
            </p>
            <p className="text-[17px] leading-relaxed text-neutral-800 font-medium">
              — Andrés Barrientos. CEO Anbar Home
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-[17px] leading-relaxed text-neutral-800 font-medium text-justify">
              La estética seguirá siendo importante, pero dejará de ser suficiente.
              Consiste en sentirnos bien dentro de los espacios que habitamos.
            </p>
          </div>

        </div>
      </div>

      {/* More Tips Banner */}
      <div className="w-full bg-[#A5998B] py-14 mt-20">
        <h2 className="text-center font-serif text-3xl text-white md:text-4xl font-medium tracking-wide">
          Más tips para <em className="italic">evolucionar</em> tus espacios
        </h2>
      </div>

      {/* More Tips Content */}
      <div className="mx-auto max-w-5xl px-6 md:px-10 py-16">
        <div className="flex flex-col space-y-20">
          {/* Tip 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-start">
            <div className="flex flex-col">
              <h3 className="font-serif text-[28px] md:text-[34px] font-normal text-neutral-900 leading-tight">
                La casa emocional: habitar<br className="hidden md:block" /> el hogar con el corazón
              </h3>
              <div className="mt-8 flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-900"></span>
                <div className="h-[1px] w-32 bg-neutral-900 ml-1"></div>
                <div className="h-[1px] w-full bg-gradient-to-r from-neutral-900 to-transparent opacity-30"></div>
              </div>
            </div>
            <div className="text-[15px] leading-relaxed text-neutral-500 font-light pt-2">
              <p>
                Durante años, las casas perfectas dominaron las redes sociales:
                espacios minimalistas, colores neutros y ambientes diseñados para
                verse impecables en fotografías. Pero hoy las personas buscan algo diferente.
              </p>
            </div>
          </div>

          {/* Tip 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-start">
            <div className="flex flex-col">
              <h3 className="font-serif text-[28px] md:text-[34px] font-normal text-neutral-900 leading-tight">
                Esculturas: las protagonistas<br className="hidden md:block" /> de los espacios modernos
              </h3>
              <div className="mt-8 flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-900"></span>
                <div className="h-[1px] w-32 bg-neutral-900 ml-1"></div>
                <div className="h-[1px] w-full bg-gradient-to-r from-neutral-900 to-transparent opacity-30"></div>
              </div>
            </div>
            <div className="text-[15px] leading-relaxed text-neutral-500 font-light pt-2">
              <p>
                Las esculturas dejaron de ser piezas reservadas únicamente para galerías
                o palacios. Arquitectos, interioristas y amantes de la decoración están
                incorporando esculturas en sus espacios para crear ambientes mucho más
                sofisticados, emocionales y visualmente equilibrados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
