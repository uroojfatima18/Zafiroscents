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
    images: ['/products/noir-absolut.jpg'],
    featured: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    variants: [
      { id: 'var-1-1', sizeMl: 50, price: 3800, compareAtPrice: null, stock: 20 },
      { id: 'var-1-2', sizeMl: 100, price: 6500, compareAtPrice: null, stock: 12 },
    ],
  },
  {
    id: 'prod-men-2',
    slug: 'cedar-atlas',
    name: 'Cedar Atlas',
    description:
      'Inspired by the mountain cedar forests of Morocco. A clean, woody fragrance that grounds the spirit — crisp citrus gives way to cedarwood heart and a base of warm sandalwood.',
    notesTop: ['Lemon zest', 'Grapefruit', 'Pink pepper'],
    notesHeart: ['Atlas cedarwood', 'Violet leaf', 'Geranium'],
    notesBase: ['Sandalwood', 'Ambergris', 'White musk'],
    category: 'men',
    images: ['/products/cedar-atlas.jpg'],
    featured: false,
    createdAt: new Date('2025-01-02T00:00:00Z'),
    variants: [
      { id: 'var-2-1', sizeMl: 30, price: 1800, compareAtPrice: null, stock: 30 },
      { id: 'var-2-2', sizeMl: 50, price: 2800, compareAtPrice: null, stock: 18 },
      { id: 'var-2-3', sizeMl: 100, price: 4900, compareAtPrice: null, stock: 8 },
    ],
  },
  {
    id: 'prod-men-3',
    slug: 'labdanum-soir',
    name: 'Labdanum Soir',
    description:
      'An evening fragrance of deliberate restraint. Amber and labdanum form a resinous warmth over a tobacco heart, finished with patchouli and a soft animalic drydown.',
    notesTop: ['Neroli', 'Clary sage', 'Elemi'],
    notesHeart: ['Tobacco leaf', 'Orris butter', 'Cistus'],
    notesBase: ['Labdanum', 'Patchouli', 'Castoreum'],
    category: 'men',
    images: ['/products/labdanum-soir.jpg'],
    featured: true,
    createdAt: new Date('2025-01-03T00:00:00Z'),
    variants: [
      { id: 'var-3-1', sizeMl: 50, price: 4200, compareAtPrice: null, stock: 15 },
      { id: 'var-3-2', sizeMl: 100, price: 7200, compareAtPrice: null, stock: 7 },
    ],
  },
  {
    id: 'prod-men-4',
    slug: 'vetiver-brut',
    name: 'Vétiver Brut',
    description:
      'Earthy and uncompromising. Haitian vetiver drives the composition from opening to drydown, softened only by a whisper of green tobacco and cool incense.',
    notesTop: ['Galbanum', 'Petitgrain', 'Lime'],
    notesHeart: ['Green tobacco', 'Immortelle', 'Violet'],
    notesBase: ['Haitian vetiver', 'Incense', 'Oakmoss'],
    category: 'men',
    images: ['/products/vetiver-brut.jpg'],
    featured: false,
    createdAt: new Date('2025-01-04T00:00:00Z'),
    variants: [
      { id: 'var-4-1', sizeMl: 30, price: 1600, compareAtPrice: null, stock: 25 },
      { id: 'var-4-2', sizeMl: 50, price: 2500, compareAtPrice: null, stock: 14 },
    ],
  },
  {
    id: 'prod-men-5',
    slug: 'amber-legacy',
    name: 'Amber Legacy',
    description:
      'A warm, spiced amber built for longevity. The opening bursts with cinnamon and clove, softening into a heart of rose and oud before the base of amber and vanilla takes over.',
    notesTop: ['Cinnamon', 'Clove', 'Cardamom'],
    notesHeart: ['Turkish rose', 'Oud', 'Nutmeg'],
    notesBase: ['Amber', 'Vanilla', 'Sandalwood'],
    category: 'men',
    images: ['/products/amber-legacy.jpg'],
    featured: false,
    createdAt: new Date('2025-01-05T00:00:00Z'),
    variants: [
      { id: 'var-5-1', sizeMl: 50, price: 3500, compareAtPrice: null, stock: 22 },
      { id: 'var-5-2', sizeMl: 100, price: 6000, compareAtPrice: null, stock: 9 },
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
    images: ['/products/jasmin-de-nuit.jpg'],
    featured: true,
    createdAt: new Date('2025-01-06T00:00:00Z'),
    variants: [
      { id: 'var-6-1', sizeMl: 50, price: 3900, compareAtPrice: null, stock: 18 },
      { id: 'var-6-2', sizeMl: 100, price: 6800, compareAtPrice: null, stock: 10 },
    ],
  },
  {
    id: 'prod-women-2',
    slug: 'saffron-petal',
    name: 'Saffron Petal',
    description:
      'Feminine yet fearless. Saffron and rose intertwine with a velvety iris heart, resting on a base of amber and warm musk — a modern oriental for the confident woman.',
    notesTop: ['Saffron', 'Bergamot', 'Mandarin'],
    notesHeart: ['Damask rose', 'Iris', 'Peony'],
    notesBase: ['Amber', 'White musk', 'Soft wood'],
    category: 'women',
    images: ['/products/saffron-petal.jpg'],
    featured: true,
    createdAt: new Date('2025-01-07T00:00:00Z'),
    variants: [
      { id: 'var-7-1', sizeMl: 30, price: 1900, compareAtPrice: null, stock: 20 },
      { id: 'var-7-2', sizeMl: 50, price: 3200, compareAtPrice: null, stock: 14 },
      { id: 'var-7-3', sizeMl: 100, price: 5600, compareAtPrice: null, stock: 8 },
    ],
  },
  {
    id: 'prod-women-3',
    slug: 'musc-blanc',
    name: 'Musc Blanc',
    description:
      'The quietest fragrance in the collection. White musk and cotton flower create an aura of clean softness — the scent of skin, elevated.',
    notesTop: ['Aldehydes', 'Bergamot', 'Lemon'],
    notesHeart: ['Cotton flower', 'White lily', 'Violet'],
    notesBase: ['White musk', 'Ambrette', 'Cashmere wood'],
    category: 'women',
    images: ['/products/musc-blanc.jpg'],
    featured: false,
    createdAt: new Date('2025-01-08T00:00:00Z'),
    variants: [
      { id: 'var-8-1', sizeMl: 30, price: 1400, compareAtPrice: null, stock: 35 },
      { id: 'var-8-2', sizeMl: 50, price: 2200, compareAtPrice: null, stock: 20 },
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
    images: ['/products/velvet-oud.jpg'],
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
    images: ['/products/lilas-nacre.jpg'],
    featured: false,
    createdAt: new Date('2025-01-10T00:00:00Z'),
    variants: [
      { id: 'var-10-1', sizeMl: 30, price: 1700, compareAtPrice: null, stock: 28 },
      { id: 'var-10-2', sizeMl: 50, price: 2700, compareAtPrice: null, stock: 16 },
    ],
  },

  // ── Unisex ─────────────────────────────────────────────────────────────────
  {
    id: 'prod-unisex-1',
    slug: 'oud-blanche',
    name: 'Oud Blanche',
    description:
      'White oud reimagined. The traditional heaviness of oud is lifted by bright neroli and green cardamom, creating a radiant, airy take on the Middle Eastern classic.',
    notesTop: ['Neroli', 'Cardamom', 'Bergamot'],
    notesHeart: ['White oud', 'Rose', 'Geranium'],
    notesBase: ['Sandalwood', 'Ambergris', 'Musk'],
    category: 'unisex',
    images: ['/products/oud-blanche.jpg'],
    featured: true,
    createdAt: new Date('2025-01-11T00:00:00Z'),
    variants: [
      { id: 'var-11-1', sizeMl: 50, price: 4800, compareAtPrice: null, stock: 14 },
      { id: 'var-11-2', sizeMl: 100, price: 8200, compareAtPrice: null, stock: 6 },
    ],
  },
  {
    id: 'prod-unisex-2',
    slug: 'encens-pur',
    name: 'Encens Pur',
    description:
      'Meditative and austere. Pure frankincense resin rises from a base of grey amber and vetiver — a fragrance for those who require nothing more.',
    notesTop: ['Frankincense', 'Elemi', 'Lemon'],
    notesHeart: ['Incense', 'Cypress', 'Orris'],
    notesBase: ['Grey amber', 'Vetiver', 'Musk'],
    category: 'unisex',
    images: ['/products/encens-pur.jpg'],
    featured: false,
    createdAt: new Date('2025-01-12T00:00:00Z'),
    variants: [
      { id: 'var-12-1', sizeMl: 30, price: 1950, compareAtPrice: null, stock: 22 },
      { id: 'var-12-2', sizeMl: 50, price: 3100, compareAtPrice: null, stock: 15 },
      { id: 'var-12-3', sizeMl: 100, price: 5400, compareAtPrice: null, stock: 9 },
    ],
  },
  {
    id: 'prod-unisex-3',
    slug: 'figuier-sauvage',
    name: 'Figuier Sauvage',
    description:
      'The scent of a fig tree in late summer — green leaves, milky sap, ripe fruit, and warm earth. A Mediterranean memory preserved in glass.',
    notesTop: ['Fig leaves', 'Blackcurrant', 'Galbanum'],
    notesHeart: ['Fig milk', 'Jasmine', 'Coconut'],
    notesBase: ['Sandalwood', 'Cedarwood', 'Vetiver'],
    category: 'unisex',
    images: ['/products/figuier-sauvage.jpg'],
    featured: false,
    createdAt: new Date('2025-01-13T00:00:00Z'),
    variants: [
      { id: 'var-13-1', sizeMl: 30, price: 1500, compareAtPrice: null, stock: 30 },
      { id: 'var-13-2', sizeMl: 50, price: 2400, compareAtPrice: null, stock: 18 },
    ],
  },
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
    images: ['/products/sel-marin.jpg'],
    featured: true,
    createdAt: new Date('2025-01-14T00:00:00Z'),
    variants: [
      { id: 'var-14-1', sizeMl: 50, price: 2900, compareAtPrice: null, stock: 20 },
      { id: 'var-14-2', sizeMl: 100, price: 5000, compareAtPrice: null, stock: 10 },
    ],
  },
  {
    id: 'prod-unisex-5',
    slug: 'bois-sacre',
    name: 'Bois Sacré',
    description:
      'Sacred wood accord — a precise blend of agarwood, sandalwood, and guaiac that reads as simultaneously ancient and contemporary.',
    notesTop: ['Black pepper', 'Coriander', 'Bergamot'],
    notesHeart: ['Agarwood', 'Guaiac wood', 'Orris'],
    notesBase: ['Sandalwood', 'Amber', 'Musk'],
    category: 'unisex',
    images: ['/products/bois-sacre.jpg'],
    featured: false,
    createdAt: new Date('2025-01-15T00:00:00Z'),
    variants: [
      { id: 'var-15-1', sizeMl: 30, price: 1850, compareAtPrice: null, stock: 25 },
      { id: 'var-15-2', sizeMl: 50, price: 3000, compareAtPrice: null, stock: 16 },
      { id: 'var-15-3', sizeMl: 100, price: 5200, compareAtPrice: null, stock: 8 },
    ],
  },
]
