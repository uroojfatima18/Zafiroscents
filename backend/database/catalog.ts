export interface CatalogVariant {
  id: string
  sizeMl: number
  price: number
  compareAtPrice: number | null
  stock: number
}

export interface CatalogProduct {
  id: string
  slug: string
  name: string
  description: string
  notesTop: string[]
  notesHeart: string[]
  notesBase: string[]
  category: 'men' | 'women' | 'unisex'
  images: string[]
  featured: boolean
  createdAt: Date
  variants: CatalogVariant[]
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  // ── Men ────────────────────────────────────────────────────────────────────
  {
    id: 'prod-men-1',
    slug: 'noir-absolut',
    name: 'Noir Absolut',
    description:
      'A commanding presence in a bottle. Dark woods and smoky resins open the composition, revealing a heart of aged leather and spiced saffron before settling into a cocoon of benzoin and vetiver.',
    notesTop: ['Black pepper', 'Cardamom', 'Bergamot'],
    notesHeart: ['Aged leather', 'Saffron', 'Smoky oud'],
    notesBase: ['Benzoin', 'Vetiver', 'Musk'],
    category: 'men',
    images: ['/products/red-driftwood.jpg'],
    featured: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    variants: [
      { id: 'var-1-1', sizeMl: 50, price: 3800, compareAtPrice: null, stock: 20 },
      { id: 'var-1-2', sizeMl: 100, price: 6500, compareAtPrice: null, stock: 12 },
    ],
  },


  // ── Women ──────────────────────────────────────────────────────────────────
  {
    id: 'prod-women-1',
    slug: 'jasmin-de-nuit',
    name: 'Jasmin de Nuit',
    description:
      'Night-blooming jasmine captured at its most opulent. A rich floral composition grounded by sandalwood and musk — intimate, warm, and impossible to ignore.',
    notesTop: ['Bergamot', 'Pink pepper', 'Green leaves'],
    notesHeart: ['Night jasmine', 'Ylang-ylang', 'Rose de mai'],
    notesBase: ['Sandalwood', 'Musk', 'Benzoin'],
    category: 'women',
    images: ['/products/green-bottle.jpg'],
    featured: true,
    createdAt: new Date('2025-01-06T00:00:00Z'),
    variants: [
      { id: 'var-6-1', sizeMl: 50, price: 3900, compareAtPrice: null, stock: 18 },
      { id: 'var-6-2', sizeMl: 100, price: 6800, compareAtPrice: null, stock: 10 },
    ],
  },

  {
    id: 'prod-women-4',
    slug: 'velvet-oud',
    name: 'Velvet Oud',
    description:
      'Sensual and deeply feminine. Oud is tempered by rose and patchouli, creating a velvety richness that is equal parts oriental tradition and modern elegance.',
    notesTop: ['Rose absolute', 'Saffron', 'Black pepper'],
    notesHeart: ['Oud', 'Patchouli', 'Iris'],
    notesBase: ['Labdanum', 'Vanilla', 'Sandalwood'],
    category: 'women',
    images: ['/products/red-woodchips.jpg'],
    featured: false,
    createdAt: new Date('2025-01-09T00:00:00Z'),
    variants: [
      { id: 'var-9-1', sizeMl: 50, price: 4500, compareAtPrice: null, stock: 12 },
      { id: 'var-9-2', sizeMl: 100, price: 7800, compareAtPrice: null, stock: 6 },
    ],
  },
  {
    id: 'prod-women-5',
    slug: 'lilas-nacre',
    name: 'Lilas Nacré',
    description:
      'A springtime meditation. Lilac and peony dance above a base of warm musk and cedarwood in a fragrance that feels as light as morning air.',
    notesTop: ['Lilac', 'Green leaves', 'Peach'],
    notesHeart: ['Peony', 'Rose', 'Lily of the valley'],
    notesBase: ['Musk', 'Cedarwood', 'Amber'],
    category: 'women',
    images: ['/products/purple-bottle.jpg'],
    featured: false,
    createdAt: new Date('2025-01-10T00:00:00Z'),
    variants: [
      { id: 'var-10-1', sizeMl: 30, price: 1700, compareAtPrice: null, stock: 28 },
      { id: 'var-10-2', sizeMl: 50, price: 2700, compareAtPrice: null, stock: 16 },
    ],
  },

  // ── Unisex ─────────────────────────────────────────────────────────────────

  {
    id: 'prod-unisex-4',
    slug: 'sel-marin',
    name: 'Sel Marin',
    description:
      'Salt air, sea spray, and sun-warmed skin. A rare aquatic that avoids all marine clichés — instead offering an honest portrait of the ocean at dusk.',
    notesTop: ['Sea salt', 'Ozonic notes', 'Lemon'],
    notesHeart: ['Ambrette', 'Driftwood', 'Iris'],
    notesBase: ['Ambergris', 'Musk', 'Cedarwood'],
    category: 'unisex',
    images: ['/products/blue-bottle.jpg'],
    featured: true,
    createdAt: new Date('2025-01-14T00:00:00Z'),
    variants: [
      { id: 'var-14-1', sizeMl: 50, price: 2900, compareAtPrice: null, stock: 20 },
      { id: 'var-14-2', sizeMl: 100, price: 5000, compareAtPrice: null, stock: 10 },
    ],
  },

]
