import Image from 'next/image'
import Link from 'next/link'

export function Blog() {
  return (
    <article id="blog" className="min-h-screen bg-[#fdfbf7] selection:bg-camel/20 pb-24">
      
      {/* Hero Section */}
      <header className="mx-auto max-w-5xl px-6 md:px-10 pt-16 md:pt-24 pb-12 text-center">
        <div className="mb-6 flex items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-camel-dark font-medium">
          <span>Diseño Interior</span>
          <span className="h-px w-6 bg-neutral-300"></span>
          <span>Bienestar</span>
        </div>
        
        <h1 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-light text-neutral-950 leading-[1.15] mb-8 tracking-tight mx-auto max-w-4xl">
          El regreso de los <em className="italic">espacios sensoriales</em>: así se verá el diseño interior del futuro
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-3 text-[0.75rem] text-neutral-500 font-light tracking-wide uppercase">
          <span>Por Andrés Barrientos</span>
          <span>|</span>
          <span>1 Junio 2026</span>
          <span>|</span>
          <span>4 min de lectura</span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="mx-auto max-w-6xl px-4 md:px-8 mb-16 md:mb-24">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-100">
          <Image
            src="/jarrones.webp"
            alt="Espacios sensoriales - Jarrones blancos texturizados"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Main Content (Narrow Reading Column) */}
      <div className="mx-auto max-w-2xl px-6 md:px-0">
        
        {/* Intro */}
        <div className="space-y-6 text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light text-justify">
          <p className="text-lg md:text-xl font-serif text-neutral-800 leading-[1.8] mb-8 text-left">
            El hogar dejó de ser únicamente un lugar funcional. Hoy buscamos
            espacios que nos hagan sentir bien, reducir el estrés y reconectar
            con nosotros mismos.
          </p>
          <p>
            Ahora importan las emociones, la calma y la experiencia sensorial
            que transmite cada ambiente. Y esa nueva manera de habitar los
            espacios está dando origen a una de las corrientes más importantes
            de los próximos años: los espacios sensoriales.
          </p>
        </div>

        {/* Section 1 */}
        <div className="mt-16 space-y-6">
          <h2 className="font-serif text-2xl md:text-[1.75rem] font-light text-neutral-950 mb-6">
            El diseño interior está cambiando
          </h2>
          <div className="space-y-6 text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light text-justify">
            <p>
              Durante años, el diseño interior estuvo dominado por espacios
              extremadamente minimalistas y ambientes pensados más para verse
              bien en fotografías que para disfrutarse diariamente. Pero las
              prioridades han cambiado fundamentalmente.
            </p>
            <p>
              Después de una etapa marcada por el exceso visual, las personas
              comenzaron a valorar hogares más humanos, cálidos y emocionalmente
              conectados. Lugares capaces de transmitir tranquilidad, autenticidad
              y bienestar. Hoy, el verdadero lujo no consiste en tener más objetos, 
              sino en crear espacios que se sientan bien.
            </p>
          </div>
        </div>

      </div>

      {/* Full Width Breakout Image */}
      <div className="mx-auto max-w-5xl px-4 md:px-8 my-20">
        <div className="relative aspect-[21/9] md:aspect-[16/7] w-full overflow-hidden rounded-sm bg-neutral-100">
          <Image
            src="/collage.png"
            alt="Collage de espacios interiores emocionales"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Continuation Content */}
      <div className="mx-auto max-w-2xl px-6 md:px-0">
        
        {/* Section 2 */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl md:text-[1.75rem] font-light text-neutral-950 mb-6">
            El auge de los espacios sensoriales
          </h2>
          <div className="space-y-6 text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light text-justify">
            <p>
              La idea es sencilla: diseñar interiores que no solo se observen,
              sino que también se experimenten emocionalmente. En este nuevo enfoque, 
              el diseño interior deja de ser únicamente decorativo para convertirse en 
              una herramienta de bienestar cotidiano.
            </p>
            
            <p className="pt-4 text-neutral-800 font-medium">Entre las tendencias más importantes destacan:</p>
            <ul className="list-none space-y-4 pt-2">
              <li className="flex items-start gap-4">
                <span className="text-camel-dark font-serif mt-1">—</span>
                <span>Materiales naturales como madera y lino que invitan al tacto.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-camel-dark font-serif mt-1">—</span>
                <span>Iluminación cálida e indirecta que acompaña los ritmos circadianos.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-camel-dark font-serif mt-1">—</span>
                <span>Texturas artesanales y objetos decorativos con intención emocional.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Highlight Section (Materiales naturales) */}
        <div className="my-20 p-10 md:p-14 bg-white border border-neutral-100 shadow-sm rounded-sm">
          <h3 className="font-serif text-2xl md:text-3xl font-light text-neutral-950 mb-6 text-center">
            Materiales <em className="italic text-camel-dark">naturales</em>:<br /> La clave del nuevo lujo
          </h3>
          <div className="space-y-6 text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light text-justify">
            <p>
              La madera natural, la cerámica artesanal, el mármol y las fibras
              textiles están reemplazando acabados excesivamente industriales. 
              Estos materiales conectan perfectamente con el movimiento <span className="italic text-neutral-800">Quiet Luxury</span>, una
              filosofía estética basada en la sofisticación silenciosa, la calidad y
              la elegancia atemporal.
            </p>
          </div>
        </div>

        {/* Section 3 & Quote */}
        <div className="space-y-12">
          <div className="space-y-6 text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light text-justify">
            <p>
              Cada vez más personas buscan hogares que reflejen personalidad y
              bienestar. La sofisticación moderna ya no es fría ni excesiva.
              Ahora busca transmitir autenticidad y conexión humana.
            </p>
          </div>

          <blockquote className="border-l-2 border-camel-dark pl-6 my-12">
            <p className="font-serif text-2xl md:text-3xl font-light text-neutral-950 leading-snug mb-6">
              “El futuro del diseño interior será mucho más humano. La estética seguirá siendo importante, pero dejará de ser suficiente.”
            </p>
            <footer className="text-[0.75rem] uppercase tracking-[0.2em] text-neutral-500">
              Andrés Barrientos — <span className="text-camel-dark">CEO Anbar Home</span>
            </footer>
          </blockquote>
        </div>

      </div>

      {/* Divider */}
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="h-[1px] w-full bg-neutral-200/60"></div>
      </div>

      {/* More Tips Section (Redesigned from the banner) */}
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <h3 className="text-center font-serif text-2xl md:text-3xl font-light text-neutral-950 mb-16 tracking-wide">
          Más tips para <em className="italic text-camel-dark">evolucionar</em> tus espacios
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Tip 1 */}
          <Link href="#" className="group flex flex-col space-y-6 cursor-pointer">
            <h4 className="font-serif text-xl md:text-2xl font-light text-neutral-900 leading-snug group-hover:text-camel-dark transition-colors">
              La casa emocional: habitar el hogar con el corazón
            </h4>
            <div className="h-[1px] w-12 bg-camel-dark transition-all duration-300 group-hover:w-full"></div>
            <p className="text-[0.9rem] leading-[1.8] text-neutral-500 font-light text-justify">
              Durante años, las casas perfectas dominaron las redes sociales. Pero hoy 
              las personas buscan algo diferente: espacios que abracen y cuenten su propia historia.
            </p>
          </Link>

          {/* Tip 2 */}
          <Link href="#" className="group flex flex-col space-y-6 cursor-pointer">
            <h4 className="font-serif text-xl md:text-2xl font-light text-neutral-900 leading-snug group-hover:text-camel-dark transition-colors">
              Esculturas: las protagonistas de los espacios modernos
            </h4>
            <div className="h-[1px] w-12 bg-camel-dark transition-all duration-300 group-hover:w-full"></div>
            <p className="text-[0.9rem] leading-[1.8] text-neutral-500 font-light text-justify">
              Las esculturas dejaron de ser piezas reservadas únicamente para galerías.
              Arquitectos e interioristas las incorporan para crear ambientes mucho más
              emocionales y equilibrados.
            </p>
          </Link>
        </div>
      </div>

    </article>
  )
}
