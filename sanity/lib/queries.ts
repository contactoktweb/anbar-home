import { groq } from 'next-sanity'

/**
 * Categorías temporalmente ocultas de la tienda pública (ej. colecciones navideñas de temporada).
 * Para volver a mostrarlas más adelante, simplemente vacía este arreglo: []
 */
export const HIDDEN_CATEGORY_SLUGS: string[] = [
  'navidad-premium',
  'arboles-de-navidad',
]

const hiddenSlugsFilter = HIDDEN_CATEGORY_SLUGS.length > 0
  ? `&& !defined((categories[]->slug.current)[@ in ${JSON.stringify(HIDDEN_CATEGORY_SLUGS)}][0]) && !(category->slug.current in ${JSON.stringify(HIDDEN_CATEGORY_SLUGS)})`
  : ''

const hiddenCategoryDocsFilter = HIDDEN_CATEGORY_SLUGS.length > 0
  ? `&& !(slug.current in ${JSON.stringify(HIDDEN_CATEGORY_SLUGS)})`
  : ''

const hiddenHomeProductsFilter = HIDDEN_CATEGORY_SLUGS.length > 0
  ? `&& !defined((@->categories[]->slug.current)[@ in ${JSON.stringify(HIDDEN_CATEGORY_SLUGS)}][0]) && !(@->category->slug.current in ${JSON.stringify(HIDDEN_CATEGORY_SLUGS)})`
  : ''

export const GLOBAL_SETTINGS_QUERY = groq`
  *[_type == "globalSettings"][0]{
    "logoUrl": logo.asset->url,
    notificationEmail,
    whatsappNumber,
    physicalStores[]{
      _key,
      city,
      address
    }
  }
`

export const HOME_PAGE_QUERY = groq`
  *[_type == "homePage"][0]{
    heroSubtitle,
    heroTagline,
    heroCta,
    heroBanners[]{
      _key,
      "src": imageDesktop.asset->url,
      "srcMobile": imageMobile.asset->url,
      "videoDesktop": videoDesktop.asset->url,
      "videoMobile": videoMobile.asset->url,
      alt,
      "categoryTitle": category->title,
      "categorySlug": category->slug.current
    },
    categoriesSectionTitle,
    categoriesSectionSubtitle,
    homeCategories[]{
      _key,
      title,
      "imageUrl": image.asset->url,
      "categoryTitle": category->title,
      "categorySlug": coalesce(category->slug.current, customSlug),
    },
    conceptTitle,
    conceptSubtitle,
    conceptPillars[]{
      _key,
      iconType,
      title,
      text
    },
    conceptQuoteText,
    conceptQuoteAuthor,
    collectionsTitle,
    collectionsList[]{
      _key,
      title,
      "imageUrl": image.asset->url
    },
    gallerySubtitle,
    galleryImages[]{
      _key,
      "imageUrl": asset->url,
      alt
    },
    featuredProducts[@->isActive != false ${hiddenHomeProductsFilter}]->{
      _id,
      name,
      "slug": slug.current,
      sku,
      price,
      originalPrice,
      "category": coalesce(categories[0]->title, category->title),
      "categories": coalesce(categories[]->title, array::compact([category->title])),
      "categorySlugs": coalesce(categories[]->slug.current, array::compact([category->slug.current])),
      "imageUrl": image.asset->url,
      "images": gallery[].asset->url,
      rating
    },
    newArrivalsProducts[@->isActive != false ${hiddenHomeProductsFilter}]->{
      _id,
      name,
      "slug": slug.current,
      sku,
      price,
      originalPrice,
      "category": coalesce(categories[0]->title, category->title),
      "categories": coalesce(categories[]->title, array::compact([category->title])),
      "categorySlugs": coalesce(categories[]->slug.current, array::compact([category->slug.current])),
      "imageUrl": image.asset->url,
      "images": gallery[].asset->url,
      rating
    }
  }
`

export const PRODUCTS_QUERY = groq`
  *[_type == "product" && isActive != false ${hiddenSlugsFilter}] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    sku,
    price,
    originalPrice,
    "category": coalesce(categories[0]->title, category->title),
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current),
    "categories": coalesce(categories[]->title, array::compact([category->title])),
    "categorySlugs": coalesce(categories[]->slug.current, array::compact([category->slug.current])),
    "imageUrl": image.asset->url,
    "images": gallery[].asset->url,
    rating
  }
`

export const CATEGORIES_QUERY = groq`
  *[_type == "category" ${hiddenCategoryDocsFilter}] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "bannerDesktop": coalesce(imageDesktop.asset->url, image.asset->url),
    "bannerMobile": imageMobile.asset->url,
    description
  }
`

export const LATEST_PRODUCTS_QUERY = groq`
  *[_type == "product" && isActive != false ${hiddenSlugsFilter}] | order(_createdAt desc)[0...16] {
    _id,
    name,
    "slug": slug.current,
    sku,
    price,
    originalPrice,
    "category": coalesce(categories[0]->title, category->title),
    "categories": coalesce(categories[]->title, array::compact([category->title])),
    "categorySlugs": coalesce(categories[]->slug.current, array::compact([category->slug.current])),
    "imageUrl": image.asset->url,
    "images": gallery[].asset->url,
    rating
  }
`

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && (slug.current == $slug || slug.current == $cleanSlug) && isActive != false ${hiddenSlugsFilter}][0] {
    _id,
    name,
    "slug": slug.current,
    sku,
    price,
    originalPrice,
    "category": coalesce(categories[0]->title, category->title),
    "categories": coalesce(categories[]->title, array::compact([category->title])),
    "categorySlugs": coalesce(categories[]->slug.current, array::compact([category->slug.current])),
    "imageUrl": image.asset->url,
    "images": gallery[].asset->url,
    rating,
    ratingCount,
    description,
    stock,
    isLastUnits
  }
`

export const POSTS_QUERY = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    seoTitle,
    metaDescription,
    "slug": slug.current,
    "authorName": author->name,
    "authorImage": author->image.asset->url,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    "imageCaption": mainImage.caption,
    publishedAt,
    "categories": categories[]->title
  }
`

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && (slug.current == $slug || slug.current == $cleanSlug)][0] {
    _id,
    title,
    seoTitle,
    metaDescription,
    "slug": slug.current,
    "authorName": author->name,
    "authorBio": author->bio,
    "authorImage": author->image.asset->url,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    "imageCaption": mainImage.caption,
    publishedAt,
    body,
    "categories": categories[]->title
  }
`

export const REVIEWS_BY_PRODUCT_QUERY = groq`
  *[_type == "review" && product._ref == $productId && status == 'approved'] | order(_createdAt desc) {
    _id,
    userName,
    rating,
    comment,
    "imageUrl": image.asset->url,
    "_createdAt": _createdAt
  }
`

export const FAQ_QUERY = groq`
  *[_type == "faq"] | order(_createdAt asc) {
    _id,
    question,
    answer
  }
`
