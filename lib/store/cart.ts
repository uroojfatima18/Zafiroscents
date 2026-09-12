'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productVariantId: string
  productId: string
  productSlug: string
  productName: string
  productImage: string
  sizeMl: number
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productVariantId: string) => void
  updateQuantity: (productVariantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productVariantId === newItem.productVariantId,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productVariantId === newItem.productVariantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productVariantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productVariantId !== productVariantId),
        }))
      },

      updateQuantity: (productVariantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productVariantId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productVariantId === productVariantId ? { ...i, quantity } : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'zafiro-cart',
    },
  ),
)
