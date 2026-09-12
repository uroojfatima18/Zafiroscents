import { prisma } from '@backend/database/db'
import { CATALOG_PRODUCTS, type CatalogProduct } from '@backend/database/catalog'

export interface GetProductsParams {
  category?: string
  maxPrice?: number
  search?: string
  sort?: string
  featured?: boolean
  limit?: number
  page?: number
}

export interface ProductsResponse {
  products: CatalogProduct[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const {
    category,
    maxPrice,
    search,
    sort = 'newest',
    featured,
    limit = 24,
    page = 1,
  } = params

  // 1. Attempt database query if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: Record<string, any> = {}

      if (category) where.category = category
      if (featured !== undefined) where.featured = featured
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }
      if (maxPrice) {
        where.variants = { some: { price: { lte: maxPrice } } }
      }

      const [dbProducts, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            variants: {
              orderBy: { price: sort === 'price_desc' ? 'desc' : 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: (page - 1) * limit,
        }),
        prisma.product.count({ where }),
      ])

      if (dbProducts && dbProducts.length > 0) {
        const sorted =
          sort === 'price_asc' || sort === 'price_desc'
            ? [...dbProducts].sort((a, b) => {
                const aMin = Math.min(...a.variants.map((v) => v.price))
                const bMin = Math.min(...b.variants.map((v) => v.price))
                return sort === 'price_asc' ? aMin - bMin : bMin - aMin
              })
            : dbProducts

        return {
          products: sorted as unknown as CatalogProduct[],
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        }
      }
    } catch {
      // Fall through to catalog if DB is unreachable
    }
  }

  // 2. Fallback to rich catalog data
  let filtered = [...CATALOG_PRODUCTS]

  if (category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  }
  if (featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === featured)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.notesTop.some((n) => n.toLowerCase().includes(q)) ||
        p.notesHeart.some((n) => n.toLowerCase().includes(q)) ||
        p.notesBase.some((n) => n.toLowerCase().includes(q)),
    )
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.price <= maxPrice))
  }

  // Sorting
  if (sort === 'price_asc') {
    filtered.sort((a, b) => {
      const aMin = Math.min(...a.variants.map((v) => v.price))
      const bMin = Math.min(...b.variants.map((v) => v.price))
      return aMin - bMin
    })
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => {
      const aMin = Math.min(...a.variants.map((v) => v.price))
      const bMin = Math.min(...b.variants.map((v) => v.price))
      return bMin - aMin
    })
  } else {
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const total = filtered.length
  const paginated = filtered.slice((page - 1) * limit, page * limit)

  return {
    products: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getProductBySlug(slug: string): Promise<{
  product: CatalogProduct | null
  related: CatalogProduct[]
}> {
  if (process.env.DATABASE_URL) {
    try {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          variants: { orderBy: { sizeMl: 'asc' } },
        },
      })

      if (product) {
        const related = await prisma.product.findMany({
          where: { category: product.category, id: { not: product.id } },
          include: { variants: { orderBy: { price: 'asc' }, take: 1 } },
          take: 4,
          orderBy: { createdAt: 'desc' },
        })

        return {
          product: product as unknown as CatalogProduct,
          related: related as unknown as CatalogProduct[],
        }
      }
    } catch {
      // Database not reachable, fall through
    }
  }

  // Catalog fallback
  const product = CATALOG_PRODUCTS.find((p) => p.slug === slug) ?? null
  if (!product) {
    return { product: null, related: [] }
  }

  const related = CATALOG_PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, 4)

  return { product, related }
}

export async function getAllProductSlugs(): Promise<Array<{ slug: string; createdAt: Date }>> {
  if (process.env.DATABASE_URL) {
    try {
      const slugs = await prisma.product.findMany({
        select: { slug: true, createdAt: true },
      })
      if (slugs && slugs.length > 0) return slugs
    } catch {
      // Fall through to catalog
    }
  }

  return CATALOG_PRODUCTS.map((p) => ({
    slug: p.slug,
    createdAt: p.createdAt,
  }))
}
