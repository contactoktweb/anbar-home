import { cn } from '@/lib/utils'

interface ChristmasRibbonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ChristmasRibbon({ className, size = 'sm' }: ChristmasRibbonProps) {
  // Dimensiones escaladas para dar presencia imponente y elegante
  const dimension = size === 'lg' ? 134 : size === 'md' ? 104 : 90

  return (
    <div
      className={cn(
        'pointer-events-none absolute top-0 left-0 z-20 select-none transition-all duration-500 ease-out',
        'drop-shadow-[0_6px_14px_rgba(78,12,23,0.45)] group-hover:scale-[1.04] group-hover:rotate-[0.5deg]',
        className
      )}
      style={{ width: dimension, height: dimension }}
      aria-hidden="true"
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 88 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Terciopelo borgoña noble con iluminación direccional */}
          <linearGradient id="velvet-sash" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#430811" />
            <stop offset="20%" stopColor="#691220" />
            <stop offset="48%" stopColor="#871A2B" />
            <stop offset="58%" stopColor="#9C2237" />
            <stop offset="82%" stopColor="#701322" />
            <stop offset="100%" stopColor="#430811" />
          </linearGradient>

          {/* Sombra de profundidad en pliegues y solapas */}
          <linearGradient id="velvet-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4E0C17" />
            <stop offset="100%" stopColor="#250308" />
          </linearGradient>

          {/* Hilo de oro champán metálico multicapa */}
          <linearGradient id="gold-trim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4D6" />
            <stop offset="25%" stopColor="#E2C167" />
            <stop offset="50%" stopColor="#B38927" />
            <stop offset="75%" stopColor="#EAD084" />
            <stop offset="100%" stopColor="#FFF9EB" />
          </linearGradient>

          {/* Brillo reflectivo para el broche de estrella */}
          <radialGradient id="star-gleam" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF3D4" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7E5F12" />
          </radialGradient>

          {/* Resplandor áurico cálido detrás de la estrella */}
          <radialGradient id="star-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFDE82" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ─── 1. BANDA DIAGONAL DE TERCIOPELO (CORNER SASH) ─── */}
        <g>
          {/* Cuerpo principal del listón envolvente */}
          <path
            d="M 0 58 L 58 0 L 80 0 L 0 80 Z"
            fill="url(#velvet-sash)"
          />

          {/* Borde exterior metálico dorado */}
          <line
            x1="0"
            y1="59"
            x2="59"
            y2="0"
            stroke="url(#gold-trim)"
            strokeWidth="1.3"
          />

          {/* Borde interior metálico dorado */}
          <line
            x1="0"
            y1="78.8"
            x2="78.8"
            y2="0"
            stroke="url(#gold-trim)"
            strokeWidth="1.3"
          />

          {/* Costura central bordada en hilo de oro fino */}
          <line
            x1="0"
            y1="69"
            x2="69"
            y2="0"
            stroke="url(#gold-trim)"
            strokeWidth="0.85"
            strokeDasharray="3 2"
            opacity="0.85"
          />

          {/* Pequeños acentos de filigrana dorada en la banda */}
          <circle cx="16" cy="49" r="0.9" fill="#FFF2D6" opacity="0.8" />
          <circle cx="49" cy="16" r="0.9" fill="#FFF2D6" opacity="0.8" />
        </g>

        {/* ─── 2. MOÑO ESCULPIDO 3D (LUXURY GIFT BOW) ─── */}
        <g transform="translate(4, 4)">
          {/* Caída izquierda (Left Ribbon Tail con corte en V) */}
          <path
            d="M 27 32 C 22 45, 14 56, 8 72 L 15 67 L 22 72 C 24 58, 29 46, 31 33 Z"
            fill="url(#velvet-shadow)"
          />
          <path
            d="M 27 32 C 23 44, 15 55, 9 70 L 15 65 L 21 70 C 23 57, 28 45, 30 33 Z"
            fill="url(#velvet-sash)"
          />
          <path
            d="M 9 70 L 15 65 L 21 70"
            stroke="url(#gold-trim)"
            strokeWidth="0.9"
          />

          {/* Caída derecha (Right Ribbon Tail con corte en V) */}
          <path
            d="M 35 32 C 41 45, 52 56, 62 70 L 56 65 L 51 70 C 46 57, 39 46, 36 33 Z"
            fill="url(#velvet-shadow)"
          />
          <path
            d="M 35 32 C 40 44, 50 55, 60 68 L 55 63 L 50 68 C 45 56, 38 45, 36 33 Z"
            fill="url(#velvet-sash)"
          />
          <path
            d="M 60 68 L 55 63 L 50 68"
            stroke="url(#gold-trim)"
            strokeWidth="0.9"
          />

          {/* Lazo Izquierdo (Left Loop) - Con relieve y ribete dorado */}
          <path
            d="M 32 30 C 21 14, 6 15, 11 31 C 14 38, 26 35, 32 31 Z"
            fill="url(#velvet-sash)"
          />
          <path
            d="M 29 29 C 19 18, 9 18, 12 28 C 14 33, 23 32, 29 29 Z"
            fill="url(#velvet-shadow)"
            opacity="0.45"
          />
          <path
            d="M 32 30 C 21 14, 6 15, 11 31"
            stroke="url(#gold-trim)"
            strokeWidth="1.1"
          />

          {/* Lazo Derecho (Right Loop) - Con relieve y ribete dorado */}
          <path
            d="M 36 30 C 47 14, 62 15, 57 31 C 54 38, 42 35, 36 31 Z"
            fill="url(#velvet-sash)"
          />
          <path
            d="M 39 29 C 49 18, 59 18, 56 28 C 54 33, 45 32, 39 29 Z"
            fill="url(#velvet-shadow)"
            opacity="0.45"
          />
          <path
            d="M 36 30 C 47 14, 62 15, 57 31"
            stroke="url(#gold-trim)"
            strokeWidth="1.1"
          />

          {/* Nudo Central (Knot) */}
          <ellipse cx="34" cy="30.5" rx="5.8" ry="4.8" fill="url(#velvet-shadow)" />
          <ellipse
            cx="34"
            cy="30.5"
            rx="5.2"
            ry="4.2"
            fill="url(#velvet-sash)"
            stroke="url(#gold-trim)"
            strokeWidth="1"
          />

          {/* ─── 3. BROCHE DE ESTRELLA NAVIDEÑA (ANTIQUE GOLD STAR) ─── */}
          {/* Halo áurico brillante */}
          <circle cx="34" cy="30.5" r="9" fill="url(#star-halo)" />

          {/* Estrella de 8 puntas facetada */}
          <g>
            {/* Puntas principales (4) */}
            <path
              d="M 34 23 L 35.8 28.6 L 41.5 30.5 L 35.8 32.4 L 34 38 L 32.2 32.4 L 26.5 30.5 L 32.2 28.6 Z"
              fill="url(#star-gleam)"
            />
            {/* Puntas secundarias diagonales (4) */}
            <path
              d="M 34 26 L 36.5 28 L 38.5 30.5 L 36.5 33 L 34 35 L 31.5 33 L 29.5 30.5 L 31.5 28 Z"
              fill="url(#gold-trim)"
              opacity="0.9"
            />
            {/* Diamante o gema central resplandeciente */}
            <circle cx="34" cy="30.5" r="1.6" fill="#FFFFFF" />
            <circle cx="34" cy="30.5" r="0.8" fill="#FFF8E7" />
          </g>
        </g>
      </svg>
    </div>
  )
}
