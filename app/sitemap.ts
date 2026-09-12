import type { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@backend/services/product.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zafiroscents.com'

  const products = await getAllProductSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/men`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/women`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/unisex`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), priority: 0.3 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.createdAt,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
