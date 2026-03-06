'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  LayoutList,
  History,
  UserCog,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatSapphires, sapphiresToUSD } from '@/lib/utils/sapphires'
import toast from 'react-hot-toast'

const GAMES = ['MM2', 'Grow a Garden', 'Steal a Brainrot', 'Blade Ball', 'Multi-Game']
const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary', 'Godly']

interface Listing {
  id: string
  title: string
  description: string | null
  price_sapphires: number
  game: string
  emoji: string | null
  is_active: boolean
  created_at: string
}

interface Sale {
  id: string
  created_at: string
  amount_sapphires: number | null
  amount_usd: number | null
  purchase_type: string | null
  products: { name: string; emoji: string | null; game: string } | null
}

interface Profile {
  display_name: string | null
  roblox_username: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  theme_color: string | null
  twitter_url: string | null
  youtube_url: string | null
  discord_url: string | null
}

interface Props {
  initialListings: Listing[]
  initialSales: Sale[]
  profile: Profile | null
  userId: string
}

type Tab = 'listings' | 'sales' | 'settings'

const EMPTY_FORM = { title: '', description: '', price_sapphires: '', game: GAMES[0], emoji: '' }

export function SellerDashboardClient({ initialListings, initialSales, profile, userId }: Props) {
  const [tab, setTab] = useState<Tab>('listings')
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [profileForm, setProfileForm] = useState({
    display_name: profile?.display_name ?? '',
    roblox_username: profile?.roblox_username ?? '',
    bio: profile?.bio ?? '',
    avatar_url: profile?.avatar_url ?? '',
    banner_url: profile?.banner_url ?? '',
    theme_color: profile?.theme_color ?? '#00f2ff',
    twitter_url: profile?.twitter_url ?? '',
    youtube_url: profile?.youtube_url ?? '',
    discord_url: profile?.discord_url ?? '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const supabase = createClient()

  // ── Listings CRUD ───────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (listing: Listing) => {
    setEditingId(listing.id)
    setForm({
      title: listing.title,
      description: listing.description ?? '',
      price_sapphires: String(listing.price_sapphires),
      game: listing.game,
      emoji: listing.emoji ?? '',
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleSaveListing = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    const price = parseInt(form.price_sapphires)
    if (!price || price <= 0) return toast.error('Enter a valid price')
    setSaving(true)
    try {
      if (editingId) {
        const { error } = await (supabase as any)
          .from('marketplace_listings')
          .update({
            title: form.title.trim(),
            description: form.description.trim() || null,
            price_sapphires: price,
            game: form.game,
            emoji: form.emoji.trim() || null,
          })
          .eq('id', editingId)
        if (error) throw error
        setListings((prev) =>
          prev.map((l) =>
            l.id === editingId
              ? { ...l, title: form.title, description: form.description || null, price_sapphires: price, game: form.game, emoji: form.emoji || null }
              : l
          )
        )
        toast.success('Listing updated!')
      } else {
        const { data, error } = await (supabase as any)
          .from('marketplace_listings')
          .insert({
            seller_id: userId,
            title: form.title.trim(),
            description: form.description.trim() || null,
            price_sapphires: price,
            game: form.game,
            emoji: form.emoji.trim() || null,
            is_active: true,
          })
          .select()
          .single()
        if (error) throw error
        setListings((prev) => [data as any, ...prev])
        toast.success('Listing created!')
      }
      closeForm()
    } catch (e: any) {
      toast.error(e.message ?? 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (listing: Listing) => {
    const { error } = await (supabase as any)
      .from('marketplace_listings')
      .update({ is_active: !listing.is_active })
      .eq('id', listing.id)
    if (error) return toast.error('Failed to update listing')
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, is_active: !l.is_active } : l))
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    const { error } = await supabase.from('marketplace_listings').delete().eq('id', id)
    if (error) return toast.error('Failed to delete listing')
    setListings((prev) => prev.filter((l) => l.id !== id))
    toast.success('Listing deleted')
  }

  // ── Profile save ───────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setProfileSaving(true)
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          display_name: profileForm.display_name.trim() || null,
          roblox_username: profileForm.roblox_username.trim() || null,
          bio: profileForm.bio.trim() || null,
          avatar_url: profileForm.avatar_url.trim() || null,
          banner_url: profileForm.banner_url.trim() || null,
          theme_color: profileForm.theme_color || '#00f2ff',
          twitter_url: profileForm.twitter_url.trim() || null,
          youtube_url: profileForm.youtube_url.trim() || null,
          discord_url: profileForm.discord_url.trim() || null,
        })
        .eq('id', userId)
      if (error) throw error
      toast.success('Profile saved!')
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'listings', label: 'My Listings', icon: <LayoutList size={15} /> },
    { key: 'sales', label: 'Sales History', icon: <History size={15} /> },
    { key: 'settings', label: 'Profile Settings', icon: <UserCog size={15} /> },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-0 mb-8 border border-[rgba(0,242,255,0.15)] rounded-xl overflow-hidden w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === t.key
                ? 'bg-[rgba(0,242,255,0.1)] text-[#00f2ff]'
                : 'text-[#64748b] hover:text-[#e2e8f0]'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── MY LISTINGS TAB ─────────────────────────────────── */}
        {tab === 'listings' && (
          <motion.div key="listings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#64748b]">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(0,242,255,0.25)]"
              >
                <Plus size={15} /> New Listing
              </button>
            </div>

            {/* Form modal */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="glass rounded-2xl border border-[rgba(0,242,255,0.2)] p-6 space-y-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-[#e2e8f0]">
                        {editingId ? 'Edit Listing' : 'Create Listing'}
                      </h3>
                      <button onClick={closeForm} className="text-[#64748b] hover:text-[#e2e8f0] transition-colors">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#64748b] font-medium block mb-1">Title *</label>
                        <input
                          value={form.title}
                          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="e.g. Godly Blade — MM2"
                          className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#64748b] font-medium block mb-1">Emoji</label>
                        <input
                          value={form.emoji}
                          onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                          placeholder="🗡️"
                          maxLength={4}
                          className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#64748b] font-medium block mb-1">Game *</label>
                        <select
                          value={form.game}
                          onChange={(e) => setForm((f) => ({ ...f, game: e.target.value }))}
                          className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] outline-none focus:border-[#00f2ff] transition-colors cursor-pointer"
                        >
                          {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#64748b] font-medium block mb-1">Price (Sapphires) *</label>
                        <input
                          type="number"
                          min={1}
                          value={form.price_sapphires}
                          onChange={(e) => setForm((f) => ({ ...f, price_sapphires: e.target.value }))}
                          placeholder="1000"
                          className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                        />
                        {form.price_sapphires && (
                          <p className="text-xs text-[#64748b] mt-1">
                            ≈ ${sapphiresToUSD(parseInt(form.price_sapphires) || 0)} USD
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-[#64748b] font-medium block mb-1">Description</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Describe your item..."
                          rows={2}
                          className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={handleSaveListing}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_4px_16px_rgba(0,242,255,0.25)]"
                      >
                        <Save size={14} /> {saving ? 'Saving…' : 'Save Listing'}
                      </button>
                      <button
                        onClick={closeForm}
                        className="px-5 py-2.5 glass border border-[rgba(0,242,255,0.15)] text-[#64748b] hover:text-[#e2e8f0] rounded-xl text-sm font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {listings.length === 0 ? (
              <div className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-16 text-center">
                <span className="text-5xl block mb-4">📋</span>
                <p className="font-semibold text-[#e2e8f0]">No listings yet</p>
                <p className="text-sm text-[#64748b] mt-1">Create your first listing to start selling</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className={`glass rounded-xl border p-4 flex items-center gap-4 transition-all ${
                      listing.is_active
                        ? 'border-[rgba(0,242,255,0.1)]'
                        : 'border-[rgba(0,242,255,0.05)] opacity-60'
                    }`}
                  >
                    <span className="text-2xl">{listing.emoji ?? '🎮'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#e2e8f0] truncate">{listing.title}</p>
                      <p className="text-xs text-[#64748b]">{listing.game}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-bold text-[#00f2ff] text-sm">
                        💎 {formatSapphires(listing.price_sapphires)}
                      </p>
                      <p className="text-xs text-[#64748b]">≈ ${sapphiresToUSD(listing.price_sapphires)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(listing)}
                        className={`transition-colors ${listing.is_active ? 'text-[#00ff88]' : 'text-[#64748b]'}`}
                        title={listing.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {listing.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                      <button
                        onClick={() => openEdit(listing)}
                        className="p-1.5 glass rounded-lg border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.3)] text-[#64748b] hover:text-[#00f2ff] transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-1.5 glass rounded-lg border border-[rgba(255,0,0,0.1)] hover:border-[rgba(255,0,0,0.3)] text-[#64748b] hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── SALES HISTORY TAB ────────────────────────────────── */}
        {tab === 'sales' && (
          <motion.div key="sales" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {initialSales.length === 0 ? (
              <div className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-16 text-center">
                <span className="text-5xl block mb-4">📊</span>
                <p className="font-semibold text-[#e2e8f0]">No sales yet</p>
                <p className="text-sm text-[#64748b] mt-1">Your completed sales will appear here</p>
              </div>
            ) : (
              <div className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] overflow-hidden">
                <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-[rgba(0,242,255,0.08)] text-xs text-[#64748b] uppercase tracking-widest font-semibold">
                  <span>Item</span>
                  <span>Date</span>
                  <span>Type</span>
                  <span className="text-right">Amount</span>
                </div>
                {initialSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="grid grid-cols-4 gap-4 px-5 py-4 border-b border-[rgba(0,242,255,0.05)] last:border-0 items-center"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{sale.products?.emoji ?? '🎮'}</span>
                      <span className="text-sm text-[#e2e8f0] truncate">
                        {sale.products?.name ?? 'Unknown'}
                      </span>
                    </div>
                    <span className="text-sm text-[#64748b]">
                      {new Date(sale.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-xs font-semibold capitalize text-[#64748b]">
                      {sale.purchase_type ?? '—'}
                    </span>
                    <div className="text-right">
                      {sale.amount_sapphires ? (
                        <>
                          <p className="text-sm font-bold text-[#00f2ff]">
                            💎 {formatSapphires(sale.amount_sapphires)}
                          </p>
                          <p className="text-xs text-[#64748b]">≈ ${sapphiresToUSD(sale.amount_sapphires)}</p>
                        </>
                      ) : sale.amount_usd ? (
                        <p className="text-sm font-bold text-[#00ff88]">${sale.amount_usd.toFixed(2)}</p>
                      ) : (
                        <span className="text-[#64748b] text-xs">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── PROFILE SETTINGS TAB ─────────────────────────────── */}
        {tab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass rounded-2xl border border-[rgba(0,242,255,0.15)] p-6 max-w-2xl space-y-6">
              <h3 className="font-bold text-[#e2e8f0]">Profile Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display name */}
                <div>
                  <label className="text-xs text-[#64748b] font-medium block mb-1">Display Name</label>
                  <input
                    value={profileForm.display_name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, display_name: e.target.value }))}
                    placeholder="Your display name"
                    className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                  />
                </div>

                {/* Roblox username */}
                <div>
                  <label className="text-xs text-[#64748b] font-medium block mb-1">Roblox Username</label>
                  <input
                    value={profileForm.roblox_username}
                    onChange={(e) => setProfileForm((f) => ({ ...f, roblox_username: e.target.value }))}
                    placeholder="YourRobloxName"
                    className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                  />
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#64748b] font-medium block mb-1">Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                    placeholder="Tell buyers about yourself..."
                    rows={3}
                    className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors resize-none"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="text-xs text-[#64748b] font-medium block mb-1">Avatar URL</label>
                  <input
                    value={profileForm.avatar_url}
                    onChange={(e) => setProfileForm((f) => ({ ...f, avatar_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                  />
                </div>

                {/* Banner URL */}
                <div>
                  <label className="text-xs text-[#64748b] font-medium block mb-1">Banner URL</label>
                  <input
                    value={profileForm.banner_url}
                    onChange={(e) => setProfileForm((f) => ({ ...f, banner_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                  />
                </div>

                {/* Theme color */}
                <div>
                  <label className="text-xs text-[#64748b] font-medium block mb-1">Theme Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={profileForm.theme_color}
                      onChange={(e) => setProfileForm((f) => ({ ...f, theme_color: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-[rgba(0,242,255,0.15)] cursor-pointer bg-transparent"
                    />
                    <input
                      value={profileForm.theme_color}
                      onChange={(e) => setProfileForm((f) => ({ ...f, theme_color: e.target.value }))}
                      placeholder="#00f2ff"
                      className="flex-1 px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs text-[#64748b] font-semibold uppercase tracking-widest mb-3">
                  Social Links
                </p>
                <div className="space-y-3">
                  {[
                    { key: 'twitter_url' as const, label: 'Twitter / X', placeholder: 'https://x.com/you' },
                    { key: 'youtube_url' as const, label: 'YouTube', placeholder: 'https://youtube.com/@you' },
                    { key: 'discord_url' as const, label: 'Discord Server', placeholder: 'https://discord.gg/...' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-[#64748b] font-medium block mb-1">{label}</label>
                      <input
                        value={profileForm[key]}
                        onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none focus:border-[#00f2ff] transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_4px_16px_rgba(0,242,255,0.25)]"
              >
                <Save size={15} /> {profileSaving ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
