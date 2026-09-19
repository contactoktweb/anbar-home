'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn, optimizeImageUrl } from '@/lib/utils'
import { Search, Heart, ShoppingBag, X, Trash2, Plus, Minus, ChevronDown } from 'lucide-react'
import { useStore } from '@/components/store-provider'

const christmasLinks = [
  { label: 'Árboles de Navidad', href: '/category/arboles-de-navidad' },
  { label: 'Villas navideñas', href: '/category/villas-navidenas' },
  { label: 'Navidad Premium', href: '/category/navidad-premium' },
  { label: 'Pesebres y nacimientos', href: '/category/pesebres-y-nacimientos' },
  { label: 'Navidad en la mesa', href: '/category/navidad-en-la-mesa' },
]

const homeDropdownLinks = [
  { label: 'Línea suprema', href: '/category/linea-suprema' },
  { label: 'Jarrones escultóricos', href: '/category/jarrones-escultoricos' },
  { label: 'Esculturas', href: '/category/esculturas' },
  { label: 'Acentos Decorativos', href: '/category/acentos-decorativos' },
]

const secondaryLinks = [
  { label: 'SALE', href: '/category/sale' },
  { label: 'Blogs', href: '/blog' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isHogarDropdownOpen, setIsHogarDropdownOpen] = useState(false)
  const [isMobileHogarOpen, setIsMobileHogarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  
  const isHogarActive = homeDropdownLinks.some((item) => pathname === item.href)

  const {
    cart,
    favorites,
    isInitialized,
    removeFromCart,
    toggleFavorite,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  } = useStore()
  
  // Format prices in COP
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquear scroll cuando el carrito está abierto
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isCartOpen])

  // Cerrar menús automáticamente al cambiar de ruta
  useEffect(() => {
    setIsCartOpen(false)
    setOpen(false)
    setIsSearchOpen(false)
    setIsHogarDropdownOpen(false)
    setIsMobileHogarOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header
        className={cn(
          'sticky inset-x-0 top-0 z-50 transition-all duration-200 ease-in-out',
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md border-b border-border/60'
            : 'bg-ivory',
        )}
      >
        {/* Fila Superior: Logo y Acciones (Buscar, Favoritos, Carrito) */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 md:py-4 md:px-10">
        <Link href="/" className="flex items-center flex-shrink-0" aria-label="Anbar Home">
          <Image
            src="/LOGO ANBAR.png"
            alt="Anbar Home"
            width={180}
            height={74}
            priority
            fetchPriority="high"
            className="h-9 w-auto object-contain md:h-11 xl:h-12"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 md:gap-5 flex-shrink-0">
          <button onClick={() => setIsSearchOpen(true)} className="transition-colors hover:text-[#7A1A28] p-1.5" aria-label="Buscar">
            <Search className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
          </button>
          
          <Link
            href="/favoritos"
            className="relative flex items-center transition-colors hover:text-[#7A1A28] p-1.5"
            aria-label={`Mis Favoritos${isInitialized && favorites.length > 0 ? ` (${favorites.length})` : ''}`}
          >
            <Heart className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
            {isInitialized && favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#7A1A28] text-[10px] font-medium text-white shadow-xs">
                {favorites.length}
              </span>
            )}
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="relative flex items-center transition-colors hover:text-[#7A1A28] p-1.5" aria-label="Carrito">
            <ShoppingBag className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#7A1A28] border-[1.5px] border-ivory" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-2 lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <span
              className={cn(
                'h-px w-6 bg-[#7A1A28] transition-transform duration-300',
                open && 'translate-y-[6px] rotate-45',
              )}
            />
            <span
              className={cn(
                'h-px w-6 bg-[#7A1A28] transition-opacity duration-300',
                open && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'h-px w-6 bg-[#7A1A28] transition-transform duration-300',
                open && '-translate-y-[6px] -rotate-45',
              )}
            />
          </button>
        </div>
      </div>

      {/* Fila Inferior (Desktop): Navegación de Categorías con tonalidad Borgoña #4b0d10 & Oro Champán */}
      <div className="hidden border-t border-[#3b090c] lg:block bg-[#4b0d10] shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6 py-2.5 md:px-10">
          <nav className="flex items-center justify-center gap-5 xl:gap-8 2xl:gap-10">
            {christmasLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative whitespace-nowrap text-[13px] xl:text-[13.5px] 2xl:text-[14.5px] font-medium tracking-wide transition-all duration-300 py-1",
                    isActive ? "text-[#F5E2BE] font-semibold" : "text-[#E3C58B]/90 hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[2px] bg-[#E3C58B] transition-all duration-300 shadow-[0_0_8px_rgba(227,197,139,0.6)]",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              )
            })}

            {/* Hogar Dropdown */}
            <div
              className="relative group/hogar"
              onMouseEnter={() => setIsHogarDropdownOpen(true)}
              onMouseLeave={() => setIsHogarDropdownOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  "group relative inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] xl:text-[13.5px] 2xl:text-[14.5px] font-medium tracking-wide transition-all duration-300 focus:outline-none py-1",
                  isHogarActive ? "text-[#F5E2BE] font-semibold" : "text-[#E3C58B]/90 hover:text-white"
                )}
                aria-expanded={isHogarDropdownOpen}
                aria-haspopup="true"
                onClick={() => setIsHogarDropdownOpen((prev) => !prev)}
              >
                <span>Hogar</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    isHogarDropdownOpen ? "rotate-180 text-[#F5E2BE]" : "text-[#E3C58B]/70 group-hover/hogar:rotate-180 group-hover/hogar:text-white"
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-[#E3C58B] transition-all duration-300 shadow-[0_0_8px_rgba(227,197,139,0.6)]",
                    isHogarActive ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </button>

              {/* Dropdown Panel */}
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 transition-all duration-200 ease-out",
                  isHogarDropdownOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none group-hover/hogar:opacity-100 group-hover/hogar:visible group-hover/hogar:translate-y-0 group-hover/hogar:pointer-events-auto"
                )}
              >
                <div className="w-56 overflow-hidden rounded-xl border border-[#5d1216] bg-[#4b0d10] p-1.5 shadow-2xl backdrop-blur-md">
                  <div className="py-1">
                    {homeDropdownLinks.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsHogarDropdownOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200",
                            isActive
                              ? "bg-white/15 text-[#F5E2BE] font-semibold"
                              : "text-[#E3C58B]/90 hover:bg-white/10 hover:text-white hover:translate-x-0.5"
                          )}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E3C58B] shadow-[0_0_6px_#E3C58B]" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Links: SALE & Blogs */}
            {secondaryLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative whitespace-nowrap text-[13px] xl:text-[13.5px] 2xl:text-[14.5px] font-medium tracking-wide transition-all duration-300 py-1",
                    link.label === 'SALE'
                      ? isActive ? "text-[#FFD1D6] font-bold" : "text-[#FFA8B2] font-semibold hover:text-white"
                      : isActive ? "text-[#F5E2BE] font-semibold" : "text-[#E3C58B]/90 hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[2px] transition-all duration-300",
                      link.label === 'SALE' ? "bg-[#FFA8B2]" : "bg-[#E3C58B] shadow-[0_0_8px_rgba(227,197,139,0.6)]",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md transition-all duration-500 lg:hidden',
          open ? 'max-h-[85vh] overflow-y-auto' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col px-6 py-3">
          {/* Christmas Categories */}
          {christmasLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-border/40 py-3 text-[14px] font-medium transition-colors",
                  isActive ? "text-[#7A1A28] font-semibold" : "text-neutral-800 hover:text-[#7A1A28]"
                )}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Hogar Accordion in Mobile */}
          <div className="border-b border-border/40 py-1">
            <button
              type="button"
              onClick={() => setIsMobileHogarOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-2.5 text-[14px] font-medium text-neutral-800 hover:text-[#7A1A28] transition-colors"
              aria-expanded={isMobileHogarOpen}
            >
              <span className={cn(isHogarActive && "text-[#7A1A28] font-semibold")}>Hogar</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-neutral-500 transition-transform duration-300",
                  isMobileHogarOpen && "rotate-180 text-[#7A1A28]"
                )}
              />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out pl-3 flex flex-col space-y-1",
                isMobileHogarOpen ? "max-h-60 pb-2 pt-1 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              {homeDropdownLinks.map((subLink) => {
                const isSubActive = pathname === subLink.href
                return (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    onClick={() => {
                      setOpen(false)
                      setIsMobileHogarOpen(false)
                    }}
                    className={cn(
                      "py-2 text-[13px] transition-colors border-l-2 pl-3",
                      isSubActive
                        ? "border-[#7A1A28] font-semibold text-[#7A1A28]"
                        : "border-neutral-200 font-normal text-neutral-600 hover:text-[#7A1A28] hover:border-[#7A1A28]"
                    )}
                  >
                    {subLink.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Secondary Links: SALE & Blogs */}
          {secondaryLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-border/40 py-3 text-[14px] font-medium transition-colors last:border-b-0",
                  link.label === 'SALE'
                    ? "text-red-600 font-semibold"
                    : isActive
                    ? "text-[#7A1A28] font-semibold"
                    : "text-neutral-800 hover:text-[#7A1A28]"
                )}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Mis Favoritos */}
          <Link
            href="/favoritos"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between py-3 text-[14px] font-medium text-neutral-800 hover:text-[#7A1A28]"
          >
            <span>Mis Favoritos</span>
            {isInitialized && favorites.length > 0 && (
              <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-[#7A1A28] text-[11px] font-medium text-white">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>
      </div>

      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-ivory/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">
            <div className="flex justify-end">
              <button onClick={() => setIsSearchOpen(false)} className="p-2 text-neutral-500 transition-transform hover:rotate-90 hover:text-camel">
                <X className="h-8 w-8" strokeWidth={1.5} />
              </button>
            </div>
            <div className="mx-auto mt-16 max-w-3xl px-4 md:mt-24">
              <h2 className="mb-8 font-serif text-3xl text-neutral-800 md:text-4xl">¿Qué estás buscando?</h2>
              <form onSubmit={handleSearch} className="relative border-b border-neutral-300 pb-3 transition-colors focus-within:border-camel">
                <input 
                  type="text" 
                  placeholder="Buscar producto..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent pr-12 text-xl outline-none placeholder:text-neutral-400 md:text-2xl"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-camel">
                  <Search className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Cart Sidebar Placeholder */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 z-[140] bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-[150] w-full max-w-md border-l border-border/50 bg-ivory p-6 shadow-2xl animate-in slide-in-from-right-full duration-300 md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="font-serif text-2xl text-neutral-900">Carrito de Compras</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-neutral-500 hover:text-camel"><X className="h-6 w-6" strokeWidth={1.5} /></button>
            </div>
            <div className="flex flex-col h-[calc(100vh-140px)]">
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag className="mb-4 h-12 w-12 text-neutral-200" strokeWidth={1} />
                    <p className="text-neutral-500">Tu carrito está vacío por ahora.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pb-4">
                    <div className="flex justify-end pb-2">
                      <button 
                        onClick={clearCart} 
                        className="flex items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Eliminar todos</span>
                      </button>
                    </div>
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-white">
                          <Image
                            src={optimizeImageUrl(item.image, 160, 75)}
                            alt={item.name}
                            fill
                            sizes="80px"
                            quality={75}
                            className="object-cover object-center mix-blend-multiply"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <h3 className="font-sans text-sm font-medium text-neutral-900">{item.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm font-serif text-camel-dark">{formatCOP(item.price)}</p>
                            <div className="flex items-center gap-2 rounded border border-neutral-200 px-2 py-1 bg-neutral-50/50">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-neutral-400 transition-colors hover:text-camel p-0.5"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="h-3 w-3" strokeWidth={2} />
                              </button>
                              <span className="text-xs font-medium w-3 text-center text-neutral-700">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-neutral-400 transition-colors hover:text-camel p-0.5"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="h-3 w-3" strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 self-start mt-1">
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="mt-auto pt-6 border-t border-border/50 bg-ivory">
                  <div className="mb-4 flex justify-between text-lg font-medium text-neutral-900">
                    <span>Subtotal</span>
                    <span className="font-serif text-camel-dark">{formatCOP(cartTotal)}</span>
                  </div>
                  <Link 
                    href="/checkout"
                    className="flex w-full items-center justify-center bg-camel-dark px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-neutral-900"
                  >
                    Ir al pago
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
