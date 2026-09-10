'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname } from 'next/navigation'

/**
 * Prefijos de rutas internas o administrativas que no deben registrar
 * visitas ni métricas en Vercel Analytics para no distorsionar bounce rate,
 * sesiones ni analítica comercial.
 */
const EXCLUDED_PREFIXES = [
  '/admin',
  '/studio',
  '/api',
  '/supabase-test',
]

function isInternalRoute(path: string | null): boolean {
  if (!path) return false
  return EXCLUDED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
}

export function PublicAnalytics() {
  const pathname = usePathname()

  // Si la ruta cliente activa es interna, no renderizar el script de Analytics
  if (isInternalRoute(pathname)) {
    return null
  }

  return (
    <Analytics
      beforeSend={(event) => {
        try {
          const url = new URL(event.url, window.location.origin)
          if (isInternalRoute(url.pathname)) {
            return null // Descartar evento
          }
        } catch {
          if (EXCLUDED_PREFIXES.some((prefix) => event.url.includes(prefix))) {
            return null
          }
        }
        return event
      }}
    />
  )
}
