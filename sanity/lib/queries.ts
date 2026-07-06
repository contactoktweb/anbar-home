import { groq } from 'next-sanity'

export const GLOBAL_SETTINGS_QUERY = groq`
  *[_type == "globalSettings"][0]{
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
      alt
    },
    conceptTitle,
    conceptSubtitle,
    conceptPillars[]{
      _key,
      iconType,
      title
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
    featuredProducts[]->{
      _id,
      name,
      price,
      originalPrice,
      "category": category->title,
      "imageUrl": image.asset->url,
      rating
    },
    newArrivalsProducts[]->{
      _id,
      name,
      price,
      originalPrice,
      "category": category->title,
      "imageUrl": image.asset->url,
      rating
    }
  }
`

export const PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    originalPrice,
    "category": category->title,
    "categorySlug": category->slug.current,
    "imageUrl": image.asset->url,
    rating
  }
`

export const CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`

export const LATEST_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc)[0...16] {
    _id,
    name,
    price,
    originalPrice,
    "category": category->title,
    "imageUrl": image.asset->url,
    rating
  }
`

export const PRODUCT_BY_ID_QUERY = groq`
  *[_type == "product" && _id == $id][0] {
    _id,
    name,
    price,
    originalPrice,
    "category": category->title,
    "imageUrl": image.asset->url,
    rating,
    description
  }
`
