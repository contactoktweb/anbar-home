# Contexto del Proyecto: Anbar Home

## Descripción
E-commerce y tienda online de Anbar Home, marca de decoración artesanal, estética serena y diseño atemporal (con resaltes y acentos de temporada en color borgoña `#7A1A28`, neutros y cálidos).

## Stack Tecnológico
- **Framework:** Next.js 16 (App Router)
- **CMS:** Sanity Studio v5
- **Estilos:** Tailwind CSS v4 + Tailwind Merge
- **Tipografía:** Tipografías serif y sans elegantes
- **Seguimiento:** Meta Pixel Ads, Klaviyo

## Arquitectura y Componentes Clave
- `app/product/[slug]/page.tsx`: Vista detallada de producto con ambientación de temporada navideña (insignias festivas, listón hero y llamado a la acción en borgoña).
- `components/christmas-ribbon.tsx`: Listón diagonal artesanal 3D en terciopelo borgoña noble, moño volumétrico con caídas en V y broche de estrella navideña de 8 puntas con halo luminoso.
- `components/product-card.tsx`: Tarjeta de producto para catálogos y carruseles con listón artesanal navideño, acentos borgoña, oro champán, badges festivos, swipe mobile y vista rápida.
- `components/product-image-zoom.tsx`: Visor con zoom interactivo, listón navideño en tamaño hero (`size="lg"`) y reubicación inteligente de badges.
- `components/sticky-mobile-cta.tsx`: Barra de compra flotante móvil adaptativa con temática y botones festivos en productos de Navidad.
- `components/site-header.tsx`: Cabecera principal en dos niveles: fila superior clara con logotipo y botones de acción (buscar, favoritos, carrito), y fila inferior con la barra de navegación de categorías en fondo borgoña exacto (`#4b0d10`) con tipografía en oro champán (`#E3C58B`).
- `components/hero-wow.tsx` & `components/hero-carousel.tsx`: Carrusel hero principal con videos responsivos HD (PC 1920x818 y Móvil), posters optimizados, gestos táctiles swipe y transiciones suaves.
- `components/category-hero-banner.tsx`: Renderizado del banner subido en Sanity para cada categoría, con fallback elegante en fondo borgoña (`#4b0d10`) y tipografía del sitio cuando no tenga imagen propia.
- `components/discount-modal.tsx`: Modal emergente de 10% OFF para primera compra con imágenes de fondo `/banner/horizontal.png` (PC 1915x821) y `/banner/vertical.png` (móvil 1080x1350), formulario de suscripción alineado y sincronización con Klaviyo.
- `lib/utils.ts`: Utilidades del sistema, incluyendo `isChristmasProduct` para detección centralizada de productos de la temporada navideña.
- `sanity/schemaTypes/product.ts`: Esquema de producto en Sanity con campos para stock, `isLastUnits`, `isBestSeller`, precios y categorías.

