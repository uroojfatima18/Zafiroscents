import { z } from 'zod'

export const productQuerySchema = z.object({
  category: z.enum(['men', 'women', 'unisex']).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  search: z.string().min(1).max(100).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest']).optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).default(24),
  page: z.coerce.number().min(1).default(1),
})

export type ProductQueryParams = z.infer<typeof productQuerySchema>
