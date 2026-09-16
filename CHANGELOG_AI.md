# CHANGELOG AI

## [2026-09-16] - Corrección de Insignias: "Más Vendido" y "Últimas unidades"

### Problema
- Anteriormente, en `app/product/[slug]/page.tsx`, la evaluación de `isLastUnits` tenía una condición de fallback (`: true`) que marcaba arbitrariamente a todos los productos sin stock explícito o sin configuración previa como "Últimas unidades".
- En consecuencia, todos los productos de la tienda mostraban erróneamente la insignia "Últimas unidades".

### Cambios Realizados
1. **Esquema de Sanity (`sanity/schemaTypes/product.ts`):**
   - Se añadió el campo booleano `isBestSeller` ("Etiqueta Más Vendido") para que el administrador pueda marcar manualmente cualquier producto como más vendido en Sanity Studio.
   - Se ajustó la descripción de `isLastUnits` para reflejar que únicamente se activa si el stock disponible es bajo (entre 1 y 5 unidades) o si se marca de forma explícita.
2. **Tipos e Interfaces (`types/index.ts`):**
   - Se integró `isBestSeller?: boolean` dentro de la interfaz `Product`.
3. **Consultas GROQ (`sanity/lib/queries.ts`):**
   - Se agregó `isBestSeller` en las proyecciones de `PRODUCTS_QUERY`, `LATEST_PRODUCTS_QUERY`, `PRODUCT_BY_SLUG_QUERY`, `HOME_PAGE_QUERY`.
4. **Página de Detalle de Producto (`app/product/[slug]/page.tsx`):**
   - Se corrigió la condición de `isLastUnits` para evitar valores por defecto en `true` (`sanityProduct.isLastUnits === true || (typeof sanityProduct.stock === 'number' && sanityProduct.stock > 0 && sanityProduct.stock <= 5)`).
   - Se calcula `isBestSeller` según el campo en Sanity o por alta valoración/reseñas.
   - Se muestra la insignia dorada/ámbar "★ Más Vendido" o la insignia "Últimas unidades" únicamente a los productos correspondientes.
5. **Componente de Imagen con Zoom (`components/product-image-zoom.tsx`):**
   - Se añadió soporte para `isBestSeller`, mostrando "★ Más Vendido" en la esquina superior de la imagen.
6. **Tarjetas de Producto y Vista Rápida (`components/product-card.tsx` y `product-quick-view.tsx`):**
   - Se actualizó el renderizado de etiquetas para soportar simultáneamente o de forma prioritaria: Descuento (`-X%`), "★ Más Vendido" y "Últimas unidades".
7. **Páginas de Catálogo, Búsqueda y Home:**
   - Se propagaron correctamente los flags de `isBestSeller` e `isLastUnits` con control estricto de valores por defecto.

## [2026-09-16] - Reducción de Espacio entre Título y Precio en Tarjetas de Producto

### Problema
- En `components/product-card.tsx`, el `<h3>` del nombre del producto tenía un `min-h-[2.4rem] sm:min-h-[2.6rem]` forzado que dejaba un gran espacio vacío en blanco cuando el nombre del producto ocupaba una sola línea.
- Adicionalmente, el formato de moneda agregaba una separación entre el signo `$` y los dígitos (`$ 219.000`).

### Cambios Realizados
1. **Tarjeta de Producto (`components/product-card.tsx`):**
   - Se eliminó la altura mínima artificial `min-h-[2.4rem] sm:min-h-[2.6rem]`, permitiendo que el precio se sitúe inmediatamente debajo del título de manera armónica (`mt-1`).
   - Se compactó la visualización del precio a `$219.000` (eliminando la separación entre el símbolo y los números).
2. **Vista Rápida y Detalle (`product-quick-view.tsx` y `app/product/[slug]/page.tsx`):**
   - Se homologó el formato de precio `$XXX.XXX` y se redujo el margen inferior del título del producto para una composición visual más elegante y consistente.
