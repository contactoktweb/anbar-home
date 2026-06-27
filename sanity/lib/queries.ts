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
    }
  }
`

export const PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    originalPrice,
    category,
    "imageUrl": image.asset->url,
    rating
  }
`
