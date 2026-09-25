'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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
  status: string
  paymentMethod: string
  shippingAddress: string
  shippingCity: string
  createdAt: string
  items: OrderItem[]
}

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  role: string
  createdAt: string
  orders: Order[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit profile state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile')
    } else if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data.user)
        setName(data.user.name || '')
        setPhone(data.user.phone || '')
        setAddress(data.user.address || '')
        setCity(data.user.city || '')
      }
    } catch (err) {
      console.error('Failed to load profile', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg(null)
    setSavingProfile(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, city }),
      })

      const data = await res.json()
      if (res.ok) {
        setProfileMsg({ text: 'Profile updated successfully!', type: 'success' })
        setProfile((prev) => (prev ? { ...prev, ...data.user } : null))
      } else {
        setProfileMsg({ text: data.error || 'Failed to update profile', type: 'error' })
      }
    } catch {
      setProfileMsg({ text: 'Error connecting to server', type: 'error' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg(null)

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', type: 'error' })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters', type: 'error' })
      return
    }

    setSavingPassword(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()
      if (res.ok) {
        setPasswordMsg({ text: 'Password updated successfully!', type: 'success' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMsg({ text: data.error || 'Failed to change password', type: 'error' })
      }
    } catch {
      setPasswordMsg({ text: 'Error connecting to server', type: 'error' })
    } finally {
      setSavingPassword(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const getStatusColor = (status: string) => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[var(--border)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-1 font-medium">
            Client Account
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--text)]">
            Welcome, {profile.name}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {profile.email} • Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium text-[var(--text-muted)] hover:text-red-600 border border-[var(--border)] hover:border-red-500/30 rounded-lg transition-colors self-start sm:self-auto"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] my-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-xs uppercase tracking-widest font-medium transition-colors relative whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-[var(--accent)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Personal Details & Address
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 text-xs uppercase tracking-widest font-medium transition-colors relative whitespace-nowrap ${
            activeTab === 'orders'
              ? 'text-[var(--accent)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Order History ({profile.orders?.length || 0})
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-3 text-xs uppercase tracking-widest font-medium transition-colors relative whitespace-nowrap ${
            activeTab === 'security'
              ? 'text-[var(--accent)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Security & Password
          {activeTab === 'security' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
          )}
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#FAF2EB]/70 border border-[var(--border)] rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-xl text-[var(--text)] mb-2">
            Update Profile Information
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-6">
            Keep your shipping address updated for 1-click checkout on future purchases.
          </p>

          {profileMsg && (
            <div
              className={`mb-6 p-3 rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
              }`}
            >
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-4 py-2.5 text-sm bg-[var(--bg)]/60 border border-[var(--border)] rounded-lg text-[var(--text-muted)] cursor-not-allowed"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                Email cannot be modified directly.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Islamabad"
                  className="w-full px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                Default Delivery Address
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, Apartment / House No., Landmark"
                className="w-full px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 bg-[#2D1F17] hover:bg-[#C36F43] text-[#FDFBF7] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div>
          {(!profile.orders || profile.orders.length === 0) ? (
            <div className="text-center py-16 px-4 bg-[#FAF2EB]/40 border border-[var(--border)] rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-[var(--text)] mb-2">No Orders Yet</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-6">
                Your fragrance journey with Zafiro has just begun. Explore our artisanal collection today.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D1F17] hover:bg-[#C36F43] text-[#FDFBF7] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors"
              >
                Explore Fragrances →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {profile.orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FAF2EB]/70 border border-[var(--border)] rounded-2xl p-6 sm:p-7 shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-semibold text-[var(--text)]">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })} • Cash on Delivery (COD)
                      </p>
                    </div>

                    <div className="text-right sm:text-right">
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Total</p>
                      <p className="font-display text-lg font-bold text-[var(--accent)]">
                        Rs. {order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="py-4 divide-y divide-[var(--border)]/60">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {item.productVariant?.product?.images?.[0] ? (
                            <div className="relative w-12 h-12 rounded-lg bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex-shrink-0">
                              <Image
                                src={item.productVariant.product.images[0]}
                                alt={item.productVariant.product.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-display text-xs">
                              ZS
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium text-[var(--text)]">
                              {item.productVariant?.product?.name || 'Artisanal Perfume'}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {item.productVariant?.sizeMl}ml • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs font-semibold text-[var(--text)]">
                          Rs. {(item.priceAtPurchase * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address footer */}
                  <div className="pt-3 border-t border-[var(--border)]/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>
                      Shipping to: {order.shippingAddress}, {order.shippingCity}
                    </span>
                    <Link
                      href={`/order-confirmation/${order.orderNumber}`}
                      className="text-[var(--accent)] font-medium hover:underline mt-2 sm:mt-0"
                    >
                      View Receipt & Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 'security' && (
        <div className="max-w-md bg-[#FAF2EB]/70 border border-[var(--border)] rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-xl text-[var(--text)] mb-2">
            Change Password
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-6">
            Ensure your account is using a secure, confidential password.
          </p>

          {passwordMsg && (
            <div
              className={`mb-6 p-3 rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
              }`}
            >
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-3 bg-[#2D1F17] hover:bg-[#C36F43] text-[#FDFBF7] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {savingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
