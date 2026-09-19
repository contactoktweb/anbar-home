# CHANGELOG AI

## [2026-09-19] - Centrado del Logo en el Header

### Requerimiento
- Centrar el logo de Anbar Home horizontalmente en la fila superior de la cabecera tanto en desktop como en mobile, en lugar de mantenerlo a la izquierda.

### Cambios Realizados
1. **Cabecera (`components/site-header.tsx`):**
   - Posicionamiento absoluto y centrado geométrico perfecto (`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`) para el logo dentro de la barra superior.
   - Acciones a la derecha y distribución equilibrada en todos los viewports.

## [2026-09-19] - Rediseño de Cabecera en Dos Niveles (Logo y Acciones Arriba / Categorías Abajo)

### Requerimiento
- Desahogar la cabecera eliminando la agrupación de todos los elementos en una sola línea.
- Subir el logo de Anbar Home y los botones de acción (búsqueda, favoritos y carrito de compras) a una fila superior espaciosa.
- Bajar la barra de navegación de categorías a una segunda fila independiente, centrada y distinguida.

### Cambios Realizados
1. **Cabecera (`components/site-header.tsx`):**
   - **Nivel Superior:** Contenedor con mayor altura y presencia para el logo (`h-11 md:h-12`), alineado con las acciones de búsqueda, favoritos y carrito con micro-interacciones pulidas.
   - **Nivel Inferior:** Franja horizontal en tonalidad borgoña exacta (`#4b0d10`) con borde superior `#3b090c`, tipografía en oro champán resplandeciente (`#E3C58B`), efecto hover en blanco radiante, subrayado dorado con halo luminoso y desplegable Hogar en `#4b0d10`.
   - Conservación completa de la experiencia en móvil (menú lateral drawer con acordeón interactivo).

## [2026-09-19] - Actualización de Banners Principales (PC y Móvil)

### Requerimiento
- Configurar y actualizar el banner principal del Home utilizando las imágenes de `public/banner/`:
  - `horizontal.png` (1915x821) para computadores (PC / Desktop).
  - `vertical.png` (1080x1350) para dispositivos móviles (Celular).

### Cambios Realizados
1. **Sanity CMS:**
   - Se subieron las dos imágenes en alta resolución a Sanity (`banner-horizontal-navidad.png` y `banner-vertical-navidad.png`).
   - Se actualizó el campo `heroBanners` en el documento `homePage` asociando `imageDesktop` e `imageMobile`.
2. **Componente Hero (`components/hero-wow.tsx`):**
   - Se estableció la resolución y prioridad de carga óptima de las imágenes.
   - Se incluyó fallback directo a `/banner/horizontal.png` y `/banner/vertical.png`.
3. **Carrusel Hero (`components/hero-carousel.tsx`):**
   - Se calibró la relación de aspecto (`aspectRatio`) predeterminada: `1915 / 821` en escritorio y `1080 / 1350` (proporción 4:5) en móvil para evitar cortes de imagen o deformaciones visuales.

## [2026-09-19] - Actualización de Categorías Destacadas con Imágenes de Temporada

### Requerimiento
- Analizar las imágenes de la carpeta `public/CATEGORIAS`, colocarlas en la sección de "Categorías Destacadas" del home y conectarlas con su redireccionamiento correspondiente a cada categoría.

### Imágenes y Categorías Procesadas
1. `ARBOLES.png` -> **Árboles de Navidad** (`/category/arboles-de-navidad`)
2. `VILLAS.png` -> **Villas Navideñas** (`/category/villas-navidenas`)
3. `NACIMIENTOS .png` -> **Pesebres y Nacimientos** (`/category/pesebres-y-nacimientos`)
4. `NAVIDAD EN LA MESA.png` -> **Navidad en la Mesa** (`/category/navidad-en-la-mesa`)
5. `PIEZAS GRANDES PREMIUM.png` -> **Piezas Grandes Premium** (`/category/piezas-grandes-premium` y vinculada a `navidad-premium`)
6. `ESFERAS NAVIDEÑAS.png` -> **Esferas Navideñas** (`/category/esferas-navidenas`)
7. `ANIMALES.png` -> **Animales** (`/category/animales`)

### Cambios Realizados
1. **Sanity CMS:**
   - Se subieron los 7 assets de imagen directamente a Sanity y se vinculó `homePage.homeCategories` con sus títulos, referencias a categorías y `customSlug`.
2. **Página de Catálogo Dinámico (`app/category/[slug]/page.tsx`):**
   - Soporte y títulos SEO para los slugs `/category/esferas-navidenas`, `/category/animales` y `/category/piezas-grandes-premium`.
   - Filtrado inteligente de productos basado en categorías asignadas y términos clave (ej. esferas, adornos de mesa, animales decorativos, renos, osos, piezas grandes/majestuosas).
3. **Componente de Cuadros de Categoría (`components/category-grid-section.tsx`):**
   - Distribución responsive optimizada para 7 tarjetas (`sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7`).
   - Soporte nativo de swipe/touch fluido en dispositivos móviles con efecto peek y sin desbordamiento horizontal global.
   - Resaltes hover y flecha indicadora con la paleta borgoña festiva `#7A1A28`.


### Requerimiento
- Transformar todos los resaltes de la web al color borgoña / gorgoña (`#7A1A28`), incluyendo categorías activas, subrayados, deslizadores, botones de acción, selecciones de texto y enlaces.

### Cambios Realizados
1. **Variables Globales de Estilo (`app/globals.css`):**
   - Se redefinieron `--camel`, `--primary`, `--ring`, `--sidebar-primary` y `--sidebar-ring` al tono borgoña festivo `#7A1A28`, y `--camel-dark`, `--chart-2` a `#5E121E`.
   - Se configuró la selección global de texto (`::selection`) con fondo borgoña translúcido (`rgba(122, 26, 40, 0.2)`) y texto `#7A1A28`.
2. **Barra Lateral de Categorías (`components/category-sidebar.tsx`):**
   - Se actualizó el enlace de la categoría activa a `text-[#7A1A28]` con subrayado `decoration-[#7A1A28]/80`.
   - Efecto hover actualizado a `hover:text-[#7A1A28]`.
   - Control deslizante de rango de precios con pista en `#7A1A28`/25 y tirador con borde `#7A1A28`.
   - Botón "Aplicar" de filtro estilizado con fondo borgoña `#7A1A28` y hover `#5E121E`.
3. **Pestaña Flotante de Categorías (`components/sidebar-filters.tsx`):**
   - Pestaña lateral vertical "Categorías" actualizada con fondo `#7A1A28` y hover `#5E121E`.
4. **Banners de Cabecera en Tienda y Favoritos:**
   - En `app/search/page.tsx` y `app/favoritos/page.tsx`, se sustituyó el fondo `#C19A6B` por `#7A1A28`.
5. **Tarjetas de Producto y Grillas:**
   - En `components/product-card.tsx`, se cambió el borde hover a `group-hover:border-[#7A1A28]/40`.

## [2026-09-17] - Realce del Listón Navideño y Vista de Producto Temática

### Requerimiento
- Hacer el elemento decorativo navideño de la tarjeta de producto más llamativo (sin usar etiquetas de texto "Navidad").
- Trasladar la atmósfera y temática navideña a la vista individual del producto (`/product/[slug]`).

### Cambios Realizados
1. **Listón Navideño Artesanal 3D (`components/christmas-ribbon.tsx`):**
   - **Mayor Presencia y Escala:** Se aumentó el tamaño a 90px en tarjetas y 134px en vista de producto (hero image), cubriendo la esquina con un corte diagonal de terciopelo envolvente de alta visibilidad.
   - **Iluminación y Relieve:** Degradado de terciopelo borgoña con luces y sombras profundas (`#430811` a `#9C2237`), doble ribete perimetral en oro champán metálico y costura central en pespunte bordado en hilo de oro.
   - **Moño Navideño Esculpido:** Lazo volumétrico con pliegues interiores sombreados, ribetes dorados a lo largo de las alas y caídas fluidas con corte en V (cola de milano) ribeteadas en oro.
   - **Broche Joya de Temporada:** Estrella navideña facetada de 8 puntas con halo resplandeciente áurico y gema de diamante central.
2. **Tarjeta de Producto (`components/product-card.tsx`):**
   - Integración del nuevo listón escalado con micro-interacción de hover (sutil inclinación y escala suave).
   - Reubicación de las etiquetas de descuento (`-X%`), Más Vendido y Últimas Unidades a `top-[94px]` para garantizar separación visual armónica sin superposiciones.
3. **Vista de Detalle de Producto (`app/product/[slug]/page.tsx` & `components/product-image-zoom.tsx`):**
   - **Listón Hero en la Galería:** Incorporación del listón en tamaño grande (`size="lg"`, 134px) sobre la imagen principal de productos navideños.
   - **Reubicación Inteligente de Badges:** Las insignias de *Más Vendido* y *Últimas Unidades* se reubican limpiamente en la esquina superior derecha (`top-4 right-4`) evitando colisiones con el listón.
   - **Llamado a la Acción Temático (`app/product/[slug]/product-actions.tsx`):** Botón principal *"Comprar Ahora"* vestido en el tono borgoña festivo (`#7A1A28`) con sombras cálidas de temporada.
   - **Barra Flotante Móvil (`components/sticky-mobile-cta.tsx`):** Resalte temático con indicador *"Colección Navidad"* y botón borgoña de temporada para una experiencia inmersiva continua en dispositivos táctiles.
4. **Utilidad de Detección Navideña Centralizada (`lib/utils.ts`):**
   - Función `isChristmasProduct` que unifica la identificación precisa de artículos de temporada a través de slugs de categoría, nombres y atributos.

## [2026-09-17] - Categorías Navideñas en Navegación y Desplegable 'Hogar'

### Requerimiento
- Reemplazar las categorías principales de la barra de navegación con las colecciones navideñas.
- Crear un menú desplegable interactivo para "Hogar" que contenga las categorías anteriores (Línea Suprema, Jarrones escultóricos, Esculturas, Acentos Decorativos).
- Habilitar el acceso y visualización de productos en las colecciones navideñas.

### Cambios Realizados
1. **Rediseño Navideño de Tarjeta de Producto (`components/product-card.tsx`):**
   - **Listón Navideño Artesanal (Sin Texto):** Se sustituyó la etiqueta que decía "Navidad" por un distinguido **listón navideño de regalo** (`ChristmasRibbon`) en terciopelo borgoña con vivos en hilo metálico dorado, lazo superior con broche de estrella y caída con corte en V (fishtail).
   - **Marco y Resplandor:** Contenedor de imagen refinado con esquinas suaves (`rounded-xl`), borde en transición a oro champán (`#C5A059`/60) y sutil resplandor ambiental navideño en borgoña/oro al pasar el cursor.
   - **Insignias de Descuento y Ventas:** Etiqueta de descuento en tono borgoña festivo (`#7A1A28`), y badges refinados con detalles dorados para *Más Vendido* y *Últimas unidades*, posicionados ordenadamente debajo del listón cuando apliquen.
   - **Detalles Festivos Sutiles:** Destello `✦` sutil en la esquina superior al hacer hover y separador festivo `✦` en las especificaciones de medidas y material.
   - **Tipografía y Acciones:** Título del producto en serif elegante con hover a borgoña (`#7A1A28`), botón de *Vista Rápida* en borgoña con tipografía serif, botones de favoritos y carrito estilizados con micro-interacciones de temporada.
2. **Barra de Navegación (`components/site-header.tsx`):**
   - Se configuraron como enlaces directos prioritarios las colecciones navideñas: *Árboles de Navidad*, *Villas navideñas*, *Navidad Premium*, *Pesebres y nacimientos*, *Navidad en la mesa*.
   - Se implementó el menú desplegable "Hogar" para escritorio con diseño glassmorphism, indicador activo cuando se visita alguna de sus categorías hijas, soporte hover con puente invisible contra cierres accidentales y accesibilidad con teclado.
   - Contenido del desplegable Hogar: *Línea suprema*, *Jarrones escultóricos*, *Esculturas*, *Acentos Decorativos*.
   - Se implementó un acordeón interactivo y fluido para "Hogar" en el menú lateral móvil (drawer) con scroll optimizado (`max-h-[85vh] overflow-y-auto`).
   - Se conservaron los accesos directos a *SALE* y *Blogs*.
   - **Color de Resalte:** Se actualizó el color del subrayado, estados activos y efectos hover de los enlaces de navegación al tono **borgoña** (`#7A1A28`), aportando una estética navideña y de lujo atemporal acorde a la paleta de Anbar Home.
2. **Estilos Globales (`app/globals.css`):**
   - Se incorporó la variable temática `--burgundy: #7A1A28;` y sus utilidades en `@theme inline` (`--color-burgundy`, `--color-borgona`).
3. **Consultas GROQ (`sanity/lib/queries.ts`):**
   - Se vació `HIDDEN_CATEGORY_SLUGS` (`[]`), desbloqueando las categorías `navidad-premium` y `arboles-de-navidad` para que sus productos aparezcan normalmente en la tienda, catálogos y búsquedas.
4. **Recomendaciones Cruzadas (`lib/recommendations.ts`):**
   - Se añadieron las afinidades entre colecciones navideñas (`arboles-de-navidad`, `villas-navidenas`, `navidad-premium`, `pesebres-y-nacimientos`, `navidad-en-la-mesa`) en `COMPLEMENTARY_CATEGORY_SLUGS`.


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
