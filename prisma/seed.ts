import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
    images: ['/products/red-driftwood.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 3800, stock: 20 },
      { sizeMl: 100, price: 6500, stock: 12 },
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
    images: ['/products/green-bottle.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 3900, stock: 18 },
      { sizeMl: 100, price: 6800, stock: 10 },
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
    images: ['/products/red-woodchips.jpg'],
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
    images: ['/products/purple-bottle.jpg'],
    featured: false,
    variants: [
      { sizeMl: 30, price: 1700, stock: 28 },
      { sizeMl: 50, price: 2700, stock: 16 },
    ],
  },

  // ── Unisex ─────────────────────────────────────────────────────────────────

  {
    slug: 'sel-marin',
    name: 'Sel Marin',
    description:
      'Salt air, sea spray, and sun-warmed skin. A rare aquatic that avoids all marine clichés — instead offering an honest portrait of the ocean at dusk.',
    notesTop: ['Sea salt', 'Ozonic notes', 'Lemon'],
    notesHeart: ['Ambrette', 'Driftwood', 'Iris'],
    notesBase: ['Ambergris', 'Musk', 'Cedarwood'],
    category: 'unisex' as const,
    images: ['/products/blue-bottle.jpg'],
    featured: true,
    variants: [
      { sizeMl: 50, price: 2900, stock: 20 },
      { sizeMl: 100, price: 5000, stock: 10 },
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

  // Seed demo customer and admin accounts
  const demoPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.upsert({
    where: { email: 'client@zafiroscents.com' },
    update: {},
    create: {
      name: 'Hamza Malik',
      email: 'client@zafiroscents.com',
      password: demoPassword,
      phone: '03001234567',
      address: 'House 14, Street 9, Sector F-7/2',
      city: 'Islamabad',
      role: 'customer',
    },
  })
  console.log('  ✓ Seeded demo user: client@zafiroscents.com (password: password123)')

  await prisma.user.upsert({
    where: { email: 'admin@zafiroscents.com' },
    update: {},
    create: {
      name: 'Admin Zafiro',
      email: 'admin@zafiroscents.com',
      password: demoPassword,
      phone: '03219876543',
      address: 'Zafiro Atelier, Gulberg III',
      city: 'Lahore',
      role: 'admin',
    },
  })
  console.log('  ✓ Seeded demo admin: admin@zafiroscents.com (password: password123)')

  console.log(`\n✅ Seeded ${products.length} products and demo accounts successfully.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
