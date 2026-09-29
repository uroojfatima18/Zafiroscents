'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type TabType = 'overview' | 'orders' | 'inventory' | 'customers'

interface StatsData {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  shippedOrders: number
  deliveredOrders: number
  totalCustomers: number
  productsCount: number
  lowStockCount: number
}

interface OrderItem {
  id: string
  quantity: number
  priceAtPurchase: number
  productVariant?: {
    sizeMl: number
    product?: {
      name: string
      slug: string
      images: string[]
    }
  }
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  paymentMethod: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  createdAt: string
  user?: {
    name: string
    email: string
  } | null
  items: OrderItem[]
}

interface ProductVariant {
  id: string
  sizeMl: number
  price: number
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  featured: boolean
  images: string[]
  variants: ProductVariant[]
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  city: string | null
  createdAt: string
  totalOrders: number
  totalSpent: number
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Data states
  const [stats, setStats] = useState<StatsData | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockVariants, setLowStockVariants] = useState<any[]>([])

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersFilter, setOrdersFilter] = useState('all')
  const [ordersSearch, setOrdersSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  // Load Overview Data
  useEffect(() => {
    fetchStats()
  }, [])

  // Load Tab-specific data on switch
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'inventory') fetchProducts()
    if (activeTab === 'customers') fetchCustomers()
  }, [activeTab])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
        setLowStockVariants(data.lowStockVariants || [])
      }
    } catch {
      setFeedback({ text: 'Failed to load dashboard metrics', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch {
      setFeedback({ text: 'Failed to load orders', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch {
      setFeedback({ text: 'Failed to load products', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/customers')
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers || [])
      }
    } catch {
      setFeedback({ text: 'Failed to load customers', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Action: Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId)
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setFeedback({ text: `Order updated to ${newStatus.toUpperCase()}`, type: 'success' })
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        )
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null))
        }
        // Also refresh stats
        fetchStats()
      } else {
        setFeedback({ text: 'Failed to update order status', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Connection error while updating status', type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  // Action: Toggle Featured Product
  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      setUpdatingId(productId)
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, featured: !currentFeatured } : p))
        )
        setFeedback({
          text: !currentFeatured ? 'Product set as Featured' : 'Product removed from Featured',
          type: 'success',
        })
      }
    } catch {
      setFeedback({ text: 'Failed to update featured flag', type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  // Action: Update Variant Stock
  const handleUpdateStock = async (productId: string, variantId: string, newStock: number) => {
    try {
      setUpdatingId(variantId)
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantUpdates: [{ id: variantId, stock: Number(newStock) }],
        }),
      })

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== productId) return p
            return {
              ...p,
              variants: p.variants.map((v) =>
                v.id === variantId ? { ...v, stock: Number(newStock) } : v
              ),
            }
          })
        )
        setFeedback({ text: 'Stock level updated', type: 'success' })
      }
    } catch {
      setFeedback({ text: 'Failed to update stock', type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'shipped':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
      case 'confirmed':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
      default:
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
    }
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = ordersFilter === 'all' || o.status === ordersFilter
    const matchesSearch =
      ordersSearch === '' ||
      o.orderNumber.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.shippingName.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.shippingPhone.includes(ordersSearch) ||
      o.shippingCity.toLowerCase().includes(ordersSearch.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            feedback.type === 'success'
              ? 'bg-green-950 text-green-200 border-green-800'
              : 'bg-red-950 text-red-200 border-red-800'
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header with Title and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] font-semibold mb-1">
            Maison Management
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--text)]">
            Atelier Command Center
          </h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF2EB] dark:bg-[#1A1310] border border-[var(--border)] rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#2D1F17] text-[#FDFBF7] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#2D1F17] text-[#FDFBF7] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <span>Orders</span>
            {stats && stats.pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center font-bold">
                {stats.pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
              activeTab === 'inventory'
                ? 'bg-[#2D1F17] text-[#FDFBF7] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Catalog & Stock
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
              activeTab === 'customers'
                ? 'bg-[#2D1F17] text-[#FDFBF7] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Clients
          </button>
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-6 backdrop-blur-xs shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-medium">
                  Total Gross Revenue
                </span>
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  Rs
                </div>
              </div>
              <p className="font-display text-3xl font-bold text-[var(--text)]">
                Rs. {(stats?.totalRevenue || 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                COD Pakistan • Across {stats?.totalOrders || 0} orders
              </p>
            </div>

            <div className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-6 backdrop-blur-xs shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-medium">
                  Active Orders
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <p className="font-display text-3xl font-bold text-amber-600 dark:text-amber-500">
                {stats?.pendingOrders || 0}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Pending dispatch or phone confirmation
              </p>
            </div>

            <div className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-6 backdrop-blur-xs shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-medium">
                  Registered Clients
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              <p className="font-display text-3xl font-bold text-[var(--text)]">
                {stats?.totalCustomers || 0}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Verified customer profiles in database
              </p>
            </div>

            <div className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-6 backdrop-blur-xs shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-medium">
                  Fragrance Catalog
                </span>
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                  </svg>
                </div>
              </div>
              <p className="font-display text-3xl font-bold text-[var(--text)]">
                {stats?.productsCount || 0}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Artisanal creations (Men, Women, Unisex)
              </p>
            </div>
          </div>

          {/* Quick Actions & Low Stock Warnings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders List */}
            <div className="lg:col-span-2 bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl text-[var(--text)]">Recent Dispatches</h3>
                  <p className="text-xs text-[var(--text-muted)]">Latest customer purchases</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[var(--accent)] font-semibold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12 text-xs text-[var(--text-muted)]">
                  No orders placed yet. Orders placed by customers will appear here in real time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Order</th>
                        <th className="pb-3 font-semibold">Recipient</th>
                        <th className="pb-3 font-semibold">Destination</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]/60">
                      {recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[var(--accent)]/5 transition-colors">
                          <td className="py-3 font-mono font-medium text-[var(--text)]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 text-[var(--text)] font-medium">
                            {ord.shippingName}
                          </td>
                          <td className="py-3 text-[var(--text-muted)]">
                            {ord.shippingCity}
                          </td>
                          <td className="py-3 font-semibold text-[var(--text)]">
                            Rs. {ord.total.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getStatusBadge(
                                ord.status
                              )}`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Low Stock Watch */}
            <div className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl text-[var(--text)]">Inventory Watch</h3>
                  <p className="text-xs text-[var(--text-muted)]">Stock levels requiring restock</p>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs text-[var(--accent)] font-semibold hover:underline"
                >
                  Manage →
                </button>
              </div>

              {lowStockVariants.length === 0 ? (
                <div className="text-center py-12 text-xs text-green-600 dark:text-green-400">
                  ✓ All fragrance variants have healthy stock levels.
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockVariants.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-medium text-[var(--text)] truncate max-w-[140px]">
                          {item.product?.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)]">{item.sizeMl}ml bottle</p>
                      </div>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          item.stock === 0
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                      >
                        {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ORDERS FULFILLMENT ──────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls: Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((s) => (
                <button
                  key={s}
                  onClick={() => setOrdersFilter(s)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    ordersFilter === s
                      ? 'bg-[#2D1F17] text-[#FDFBF7]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                value={ordersSearch}
                onChange={(e) => setOrdersSearch(e.target.value)}
                placeholder="Search Order #, Name, Phone..."
                className="w-full px-3.5 py-2 text-xs bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="font-display text-xl text-[var(--text)] mb-1">No Orders Found</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {ordersSearch ? 'Try a different search query' : 'No orders in this status category.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Order #</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Customer Details</th>
                      <th className="py-3 px-4 font-semibold">City & Address</th>
                      <th className="py-3 px-4 font-semibold">Total (PKR)</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/60">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[var(--accent)]/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[var(--accent)]">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 text-[var(--text-muted)] whitespace-nowrap">
                          {new Date(ord.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[var(--text)]">{ord.shippingName}</p>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">{ord.shippingPhone}</p>
                          {ord.user?.email && (
                            <p className="text-[10px] text-[var(--accent)]">{ord.user.email}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="font-medium text-[var(--text)]">{ord.shippingCity}</span>
                          <p className="text-[11px] text-[var(--text-muted)] truncate">{ord.shippingAddress}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-sm text-[var(--text)]">
                          Rs. {ord.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            disabled={updatingId === ord.id}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className={`text-xs uppercase font-bold tracking-wider py-1 px-2.5 rounded-lg border outline-none cursor-pointer bg-[var(--bg)] ${getStatusBadge(
                              ord.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-md font-medium"
                          >
                            Inspect Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Details Drawer / Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-[#FAF2EB] dark:bg-[#1E1714] border border-[var(--border)] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] p-1"
                >
                  ✕
                </button>

                <div className="pb-4 border-b border-[var(--border)] mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-2xl text-[var(--text)]">
                      Order {selectedOrder.orderNumber}
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-3">
                    Purchased Fragrances
                  </p>
                  <div className="space-y-3 divide-y divide-[var(--border)]/60">
                    {selectedOrder.items.map((it) => (
                      <div key={it.id} className="pt-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-[var(--text)]">
                            {it.productVariant?.product?.name || 'Perfume'}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {it.productVariant?.sizeMl}ml • Qty: {it.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-[var(--text)]">
                          Rs. {(it.priceAtPurchase * it.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 mt-4 border-t border-[var(--border)] flex justify-between font-bold text-sm">
                    <span>Total Amount</span>
                    <span className="text-[var(--accent)]">
                      Rs. {selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Shipping & Recipient */}
                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 text-xs space-y-1 mb-6">
                  <p className="font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                    Shipping & Contact
                  </p>
                  <p>
                    <strong className="text-[var(--text)]">Name:</strong> {selectedOrder.shippingName}
                  </p>
                  <p>
                    <strong className="text-[var(--text)]">Phone:</strong> {selectedOrder.shippingPhone}
                  </p>
                  <p>
                    <strong className="text-[var(--text)]">City:</strong> {selectedOrder.shippingCity}
                  </p>
                  <p>
                    <strong className="text-[var(--text)]">Delivery Address:</strong>{' '}
                    {selectedOrder.shippingAddress}
                  </p>
                  <p>
                    <strong className="text-[var(--text)]">Payment:</strong> Cash on Delivery (COD)
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-2.5 bg-[#2D1F17] hover:bg-[#C36F43] text-[#FDFBF7] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: INVENTORY & CATALOG ────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-[var(--text)]">Fragrance Inventory</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Manage live bottle stocks, bottle sizes, and home page featured statuses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  {p.images?.[0] ? (
                    <div className="relative w-16 h-16 rounded-xl bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex-shrink-0">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] font-display text-sm flex items-center justify-center flex-shrink-0">
                      ZS
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg text-[var(--text)]">{p.name}</h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Slug: /{p.slug}</p>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => handleToggleFeatured(p.id, p.featured)}
                        disabled={updatingId === p.id}
                        className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border transition-colors ${
                          p.featured
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                            : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)]'
                        }`}
                      >
                        {p.featured ? '★ Featured on Home' : '☆ Not Featured'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Variants & Stock Counters */}
                <div className="flex flex-wrap items-center gap-3">
                  {p.variants.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-xs space-y-1.5 min-w-[130px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--text)]">{v.sizeMl} ml</span>
                        <span className="text-[11px] text-[var(--accent)] font-bold">
                          Rs. {v.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-[var(--text-muted)]">Stock:</span>
                        <input
                          type="number"
                          min={0}
                          defaultValue={v.stock}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value)
                            if (!isNaN(val) && val !== v.stock) {
                              handleUpdateStock(p.id, v.id, val)
                            }
                          }}
                          className="w-16 px-2 py-1 text-xs text-center font-bold bg-[var(--bg-surface)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: CLIENT DIRECTORY ───────────────────────────────── */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-display text-2xl text-[var(--text)]">Client Directory</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Registered customers and purchase records in PostgreSQL.
            </p>
          </div>

          <div className="bg-[#FAF2EB]/70 dark:bg-[#1E1714]/70 border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Client Name</th>
                    <th className="py-3 px-4 font-semibold">Contact Email</th>
                    <th className="py-3 px-4 font-semibold">Phone</th>
                    <th className="py-3 px-4 font-semibold">City</th>
                    <th className="py-3 px-4 font-semibold">Joined Date</th>
                    <th className="py-3 px-4 font-semibold">Orders Placed</th>
                    <th className="py-3 px-4 font-semibold text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--accent)]/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[var(--text)]">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">
                        {c.email}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[var(--text)]">
                        {c.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text)]">
                        {c.city || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">
                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)]">
                          {c.totalOrders}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[var(--accent)]">
                        Rs. {c.totalSpent.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
