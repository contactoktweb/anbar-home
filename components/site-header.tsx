'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Concepto', href: '#concepto' },
  { label: 'El Logo', href: '#logo' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Identidad', href: '#identidad' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border/60'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#inicio" className="flex items-center" aria-label="Anbar Home">
          <Image
            src="/anbar-logo.png"
            alt="Anbar Home"
            width={150}
            height={62}
            priority
            className="h-8 w-auto object-contain md:h-9"
          />
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.22em] text-foreground/70 transition-colors duration-300 hover:text-camel-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-[5px] p-2 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <span
            className={cn(
              'h-px w-6 bg-foreground transition-transform duration-300',
              open && 'translate-y-[6px] rotate-45',
            )}
          />
          <span
            className={cn(
              'h-px w-6 bg-foreground transition-opacity duration-300',
              open && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'h-px w-6 bg-foreground transition-transform duration-300',
              open && '-translate-y-[6px] -rotate-45',
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md transition-[max-height] duration-500 md:hidden',
          open ? 'max-h-72' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col px-6 py-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border/40 py-4 text-xs uppercase tracking-[0.22em] text-foreground/75 last:border-b-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
