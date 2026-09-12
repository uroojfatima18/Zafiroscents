import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from './ProductDetailClient'
import { getProductBySlug, getAllProductSlugs } from '@backend/services/product.service'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { product } = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Zafiro Scents`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const { product, related } = await getProductBySlug(slug)

  if (!product) notFound()

  return <ProductDetailClient product={product} related={related} />
}
