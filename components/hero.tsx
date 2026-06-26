import Image from 'next/image'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-ivory to-white px-6 pt-28 pb-20 text-center"
    >
      {/* Subtle architectural arch outline */}
      <svg
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[78vh] w-auto -translate-x-1/2 -translate-y-[54%] text-camel/25"
        viewBox="0 0 400 520"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="arch-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M40 520V220a160 160 0 0 1 320 0v300"
          stroke="url(#arch-gradient)"
          strokeWidth="1.5"
        />
        <path
          d="M90 520V224a110 110 0 0 1 220 0v296"
          stroke="url(#arch-gradient)"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center mix-blend-multiply">
        <span className="animate-fade-in mb-16 -translate-y-6 text-[0.75rem] font-medium uppercase tracking-[0.4em] text-camel-dark [animation-delay:200ms]">
          Decoración lujosa
        </span>

        <Image
          src="/Anbar_Home_Logo_Black.png.webp"
          alt="Anbar Home"
          width={760}
          height={312}
          priority
          className="animate-fade-up h-auto w-[78vw] max-w-2xl object-contain contrast-[1.2] brightness-[1.1] [animation-delay:400ms]"
        />

        <p className="animate-fade-up mt-10 max-w-xl text-balance font-serif text-2xl font-light leading-relaxed text-foreground/75 md:text-3xl [animation-delay:800ms]">
          El arte de habitar con calma.
        </p>

        <div className="animate-fade-up mt-12 flex flex-col items-center gap-6 [animation-delay:1100ms]">
          <a
            href="#concepto"
            className="group text-xs uppercase tracking-[0.3em] text-foreground/70"
          >
            Descubrir
            <span className="mx-auto mt-3 block h-10 w-px origin-top scale-y-100 bg-camel transition-transform duration-500 group-hover:scale-y-75" />
          </a>
        </div>
      </div>
    </section>
  )
}
