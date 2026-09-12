import { z } from 'zod'

export const orderItemSchema = z.object({
  productVariantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99),
  priceAtPurchase: z.number().int().positive(),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Cart cannot be empty'),
  shippingName: z.string().min(2, 'Name is required').max(100),
  shippingPhone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, 'Enter a valid Pakistani phone number'),
  shippingAddress: z.string().min(5, 'Address is required').max(300),
  shippingCity: z.string().min(2, 'City is required').max(100),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
