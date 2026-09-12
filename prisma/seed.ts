import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // ── Men ────────────────────────────────────────────────────────────────────
  {
    slug: 'noir-absolut',
    name: 'Noir Absolut',
    description:
      'A commanding presence in a bottle. Dark woods and smoky resins open the composition, revealing a heart of aged leather and spiced saffron before settling into a cocoon of benzoin and vetiver.',
    notesTop: ['Black pepper', 'Cardamom', 'Bergamot'],
    notesHeart: ['Aged leather', 'Saffron', 'Smoky oud'],
    notesBase: ['Benzoin', 'Vetiver', 'Musk'],
    category: 'men' as const,
    images: ['/products/noir-absolut.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 3800, stock: 20 },
      { sizeMl: 100, price: 6500, stock: 12 },
    ],
  },
  {
    slug: 'cedar-atlas',
    name: 'Cedar Atlas',
    description:
      'Inspired by the mountain cedar forests of Morocco. A clean, woody fragrance that grounds the spirit — crisp citrus gives way to cedarwood heart and a base of warm sandalwood.',
    notesTop: ['Lemon zest', 'Grapefruit', 'Pink pepper'],
    notesHeart: ['Atlas cedarwood', 'Violet leaf', 'Geranium'],
    notesBase: ['Sandalwood', 'Ambergris', 'White musk'],
    category: 'men' as const,
    images: ['/products/cedar-atlas.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1800, stock: 30 },
      { sizeMl: 50, price: 2800, stock: 18 },
      { sizeMl: 100, price: 4900, stock: 8 },
    ],
  },
  {
    slug: 'labdanum-soir',
    name: 'Labdanum Soir',
    description:
      'An evening fragrance of deliberate restraint. Amber and labdanum form a resinous warmth over a tobacco heart, finished with patchouli and a soft animalic drydown.',
    notesTop: ['Neroli', 'Clary sage', 'Elemi'],
    notesHeart: ['Tobacco leaf', 'Orris butter', 'Cistus'],
    notesBase: ['Labdanum', 'Patchouli', 'Castoreum'],
    category: 'men' as const,
    images: ['/products/labdanum-soir.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 4200, stock: 15 },
      { sizeMl: 100, price: 7200, stock: 7 },
    ],
  },
  {
    slug: 'vetiver-brut',
    name: 'Vétiver Brut',
    description:
      'Earthy and uncompromising. Haitian vetiver drives the composition from opening to drydown, softened only by a whisper of green tobacco and cool incense.',
    notesTop: ['Galbanum', 'Petitgrain', 'Lime'],
    notesHeart: ['Green tobacco', 'Immortelle', 'Violet'],
    notesBase: ['Haitian vetiver', 'Incense', 'Oakmoss'],
    category: 'men' as const,
    images: ['/products/vetiver-brut.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1600, stock: 25 },
      { sizeMl: 50, price: 2500, stock: 14 },
    ],
  },
  {
    slug: 'amber-legacy',
    name: 'Amber Legacy',
    description:
      'A warm, spiced amber built for longevity. The opening bursts with cinnamon and clove, softening into a heart of rose and oud before the base of amber and vanilla takes over.',
    notesTop: ['Cinnamon', 'Clove', 'Cardamom'],
    notesHeart: ['Turkish rose', 'Oud', 'Nutmeg'],
    notesBase: ['Amber', 'Vanilla', 'Sandalwood'],
    category: 'men' as const,
    images: ['/products/amber-legacy.jpg'],
    featured: false,
    variants: [
      { sizeMl: 50, price: 3500, stock: 22 },
      { sizeMl: 100, price: 6000, stock: 9 },
    ],
  },

  // ── Women ──────────────────────────────────────────────────────────────────
  {
    slug: 'jasmin-de-nuit',
    name: 'Jasmin de Nuit',
    description:
      'Night-blooming jasmine captured at its most opulent. A rich floral composition grounded by sandalwood and musk — intimate, warm, and impossible to ignore.',
    notesTop: ['Bergamot', 'Pink pepper', 'Green leaves'],
    notesHeart: ['Night jasmine', 'Ylang-ylang', 'Rose de mai'],
    notesBase: ['Sandalwood', 'Musk', 'Benzoin'],
    category: 'women' as const,
    images: ['/products/jasmin-de-nuit.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 3900, stock: 18 },
      { sizeMl: 100, price: 6800, stock: 10 },
    ],
  },
  {
    slug: 'saffron-petal',
    name: 'Saffron Petal',
    description:
      'Feminine yet fearless. Saffron and rose intertwine with a velvety iris heart, resting on a base of amber and warm musk — a modern oriental for the confident woman.',
    notesTop: ['Saffron', 'Bergamot', 'Mandarin'],
    notesHeart: ['Damask rose', 'Iris', 'Peony'],
    notesBase: ['Amber', 'White musk', 'Soft wood'],
    category: 'women' as const,
    images: ['/products/saffron-petal.jpg'],
    featured: true,
    variants: [
      { sizeMl: 30, price: 1900, stock: 20 },
      { sizeMl: 50, price: 3200, stock: 14 },
      { sizeMl: 100, price: 5600, stock: 8 },
    ],
  },
  {
    slug: 'musc-blanc',
    name: 'Musc Blanc',
    description:
      'The quietest fragrance in the collection. White musk and cotton flower create an aura of clean softness — the scent of skin, elevated.',
    notesTop: ['Aldehydes', 'Bergamot', 'Lemon'],
    notesHeart: ['Cotton flower', 'White lily', 'Violet'],
    notesBase: ['White musk', 'Ambrette', 'Cashmere wood'],
    category: 'women' as const,
    images: ['/products/musc-blanc.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1400, stock: 35 },
      { sizeMl: 50, price: 2200, stock: 20 },
    ],
  },
  {
    slug: 'velvet-oud',
    name: 'Velvet Oud',
    description:
      'Sensual and deeply feminine. Oud is tempered by rose and patchouli, creating a velvety richness that is equal parts oriental tradition and modern elegance.',
    notesTop: ['Rose absolute', 'Saffron', 'Black pepper'],
    notesHeart: ['Oud', 'Patchouli', 'Iris'],
    notesBase: ['Labdanum', 'Vanilla', 'Sandalwood'],
    category: 'women' as const,
    images: ['/products/velvet-oud.jpg'],
    featured: false,
    variants: [
      { sizeMl: 50, price: 4500, stock: 12 },
      { sizeMl: 100, price: 7800, stock: 6 },
    ],
  },
  {
    slug: 'lilas-nacre',
    name: 'Lilas Nacré',
    description:
      'A springtime meditation. Lilac and peony dance above a base of warm musk and cedarwood in a fragrance that feels as light as morning air.',
    notesTop: ['Lilac', 'Green leaves', 'Peach'],
    notesHeart: ['Peony', 'Rose', 'Lily of the valley'],
    notesBase: ['Musk', 'Cedarwood', 'Amber'],
    category: 'women' as const,
    images: ['/products/lilas-nacre.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1700, stock: 28 },
      { sizeMl: 50, price: 2700, stock: 16 },
    ],
  },

  // ── Unisex ─────────────────────────────────────────────────────────────────
  {
    slug: 'oud-blanche',
    name: 'Oud Blanche',
    description:
      'White oud reimagined. The traditional heaviness of oud is lifted by bright neroli and green cardamom, creating a radiant, airy take on the Middle Eastern classic.',
    notesTop: ['Neroli', 'Cardamom', 'Bergamot'],
    notesHeart: ['White oud', 'Rose', 'Geranium'],
    notesBase: ['Sandalwood', 'Ambergris', 'Musk'],
    category: 'unisex' as const,
    images: ['/products/oud-blanche.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 4800, stock: 14 },
      { sizeMl: 100, price: 8200, stock: 6 },
    ],
  },
  {
    slug: 'encens-pur',
    name: 'Encens Pur',
    description:
      'Meditative and austere. Pure frankincense resin rises from a base of grey amber and vetiver — a fragrance for those who require nothing more.',
    notesTop: ['Frankincense', 'Elemi', 'Lemon'],
    notesHeart: ['Incense', 'Cypress', 'Orris'],
    notesBase: ['Grey amber', 'Vetiver', 'Musk'],
    category: 'unisex' as const,
    images: ['/products/encens-pur.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1950, stock: 22 },
      { sizeMl: 50, price: 3100, stock: 15 },
      { sizeMl: 100, price: 5400, stock: 9 },
    ],
  },
  {
    slug: 'figuier-sauvage',
    name: 'Figuier Sauvage',
    description:
      'The scent of a fig tree in late summer — green leaves, milky sap, ripe fruit, and warm earth. A Mediterranean memory preserved in glass.',
    notesTop: ['Fig leaves', 'Blackcurrant', 'Galbanum'],
    notesHeart: ['Fig milk', 'Jasmine', 'Coconut'],
    notesBase: ['Sandalwood', 'Cedarwood', 'Vetiver'],
    category: 'unisex' as const,
    images: ['/products/figuier-sauvage.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1500, stock: 30 },
      { sizeMl: 50, price: 2400, stock: 18 },
    ],
  },
  {
    slug: 'sel-marin',
    name: 'Sel Marin',
    description:
      'Salt air, sea spray, and sun-warmed skin. A rare aquatic that avoids all marine clichés — instead offering an honest portrait of the ocean at dusk.',
    notesTop: ['Sea salt', 'Ozonic notes', 'Lemon'],
    notesHeart: ['Ambrette', 'Driftwood', 'Iris'],
    notesBase: ['Ambergris', 'Musk', 'Cedarwood'],
    category: 'unisex' as const,
    images: ['/products/sel-marin.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 2900, stock: 20 },
      { sizeMl: 100, price: 5000, stock: 10 },
    ],
  },
  {
    slug: 'bois-sacre',
    name: 'Bois Sacré',
    description:
      'Sacred wood accord — a precise blend of agarwood, sandalwood, and guaiac that reads as simultaneously ancient and contemporary.',
    notesTop: ['Black pepper', 'Coriander', 'Bergamot'],
    notesHeart: ['Agarwood', 'Guaiac wood', 'Orris'],
    notesBase: ['Sandalwood', 'Amber', 'Musk'],
    category: 'unisex' as const,
    images: ['/products/bois-sacre.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1850, stock: 25 },
      { sizeMl: 50, price: 3000, stock: 16 },
      { sizeMl: 100, price: 5200, stock: 8 },
    ],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data in proper order
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.newsletterSignup.deleteMany()

  for (const p of products) {
    const { variants, ...productData } = p
    await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
      },
    })
    console.log(`  ✓ Created: ${p.name}`)
  }

  console.log(`\n✅ Seeded ${products.length} products successfully.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
