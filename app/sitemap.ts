import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://anbarhome.com'

  const products = await client.fetch(PRODUCTS_QUERY).catch(() => [])
  const categories = await client.fetch(CATEGORIES_QUERY).catch(() => [])

  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug?.current || product._id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls = categories.map((category: any) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Ensure 'summer-sale', 'sale', and 'todas' categories are mapped explicitly
  const staticCategoryUrls = [
    {
      url: `${baseUrl}/category/summer-sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/sale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/todas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ]

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  return [...staticUrls, ...categoryUrls, ...staticCategoryUrls, ...productUrls]
}
