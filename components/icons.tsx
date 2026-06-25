import type { SVGProps } from 'react'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 48 48',
}

export function ArchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M10 42V22a14 14 0 0 1 28 0v20" />
      <path d="M16 42V23a8 8 0 0 1 16 0v19" />
      <path d="M6 42h36" />
      <path d="M24 9V5" />
    </svg>
  )
}

export function PalmIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M24 42V18" />
      <path d="M24 18c-2-7-8-10-15-9 5-4 12-3 15 2" />
      <path d="M24 18c2-7 8-10 15-9-5-4-12-3-15 2" />
      <path d="M24 18c-5-5-13-5-18 0 7-2 13 0 18 4" />
      <path d="M24 18c5-5 13-5 18 0-7-2-13 0-18 4" />
      <path d="M20 42h8" />
    </svg>
  )
}

export function VaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M18 7h12" />
      <path d="M20 7c0 4-7 7-7 16s5 13 11 13 11-4 11-13-7-12-7-16" />
      <path d="M15 21h18" />
    </svg>
  )
}
