import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { PRODUCTS_QUERY, CATEGORIES_QUERY, POSTS_QUERY } from '@/sanity/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.anbarhome.co'

  const products = await client.fetch(PRODUCTS_QUERY).catch(() => [])
  const categories = await client.fetch(CATEGORIES_QUERY).catch(() => [])
  const posts = await client.fetch(POSTS_QUERY).catch(() => [])

  const blogUrls = (posts || []).map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug?.current || product._id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls = categories
    .filter((category: any) => category.slug !== 'summer-sale' && category.slug !== 'sale')
    .map((category: any) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

  const staticCategoryUrls = [
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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politicas-de-tratamiento-de-datos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politicas-de-retractos-y-garantias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/aviso-de-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...categoryUrls, ...staticCategoryUrls, ...blogUrls, ...productUrls]
}
