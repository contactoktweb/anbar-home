const WHATSAPP_NUMBER = "3000000000"
const WHATSAPP_MESSAGE = "Hola Anbar Home, me gustaría conocer más sobre sus piezas de decoración."

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 md:bottom-7 md:right-7"
    >
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-foreground/90 px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
        Escríbenos
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-foreground/15 ring-1 ring-foreground/5 transition-transform duration-300 ease-out hover:scale-105">
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7"
          fill="#FFFFFF"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.744 3.052 9.376L1.054 31.3l6.13-1.96A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0Zm9.318 22.594c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.604-1.204-4.702-1.948-7.73-6.726-7.966-7.036-.226-.31-1.9-2.53-1.9-4.826 0-2.296 1.166-3.424 1.636-3.904.386-.394.836-.574 1.314-.574.154 0 .294.008.42.014.376.016.564.038.812.63.308.742 1.058 2.638 1.148 2.826.092.188.184.444.058.754-.118.32-.222.45-.41.668-.188.218-.366.386-.554.62-.172.204-.366.422-.15.794.216.366.96 1.582 2.066 2.566 1.426 1.27 2.582 1.664 2.994 1.836.308.128.674.098.9-.146.286-.31.638-.822.996-1.328.252-.362.572-.408.91-.282.342.118 2.23 1.052 2.606 1.24.376.188.624.278.716.434.092.158.092.904-.294 1.994Z" />
        </svg>
      </span>
    </a>
  )
}
