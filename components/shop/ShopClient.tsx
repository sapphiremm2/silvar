'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']
type Listing = any

const GAMES = ['All', 'MM2', 'Grow a Garden', 'Steal a Brainrot', 'Blade Ball', 'Multi-Game']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

interface Props {
  products: Product[]
  listings: Listing[]
}

export function ShopClient({ products, listings }: Props) {
  const [tab, setTab] = useState<'official' | 'p2p'>('official')
  const [search, setSearch] = useState('')
  const [game, setGame] = useState('All')
  const [sort, setSort] = useState('newest')
  const [maxPrice, setMaxPrice] = useState(10000)

  const filtered = useMemo(() => {
    let items = tab === 'official' ? products : listings
    if (search) items = items.filter((i: Product) => i.name.toLowerCase().includes(search.toLowerCase()))
    if (game !== 'All') items = items.filter((i: Product) => i.game === game)
    items = items.filter((i: Product) => i.price_sapphires <= maxPrice)
    if (sort === 'price_asc') items = [...items].sort((a: Product, b: Product) => a.price_sapphires - b.price_sapphires)
    if (sort === 'price_desc') items = [...items].sort((a: Product, b: Product) => b.price_sapphires - a.price_sapphires)
    return items
  }, [tab, products, listings, search, game, sort, maxPrice])

  const activeFilters = [
    search && { key: 'search', label: `"${search}"`, clear: () => setSearch('') },
    game !== 'All' && { key: 'game', label: game, clear: () => setGame('All') },
    maxPrice < 10000 && { key: 'price', label: `≤ 💎${maxPrice.toLocaleString()}`, clear: () => setMaxPrice(10000) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-0 mb-6 border border-[rgba(0,242,255,0.15)] rounded-xl overflow-hidden w-fit">
        {(['official', 'p2p'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 text-sm font-semibold transition-all ${
              tab === t
                ? 'bg-[rgba(0,242,255,0.1)] text-[#00f2ff]'
                : 'text-[#64748b] hover:text-[#e2e8f0]'
            }`}
          >
            {t === 'official' ? '🏪 Sold by Silvar' : '🤝 P2P Marketplace'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm outline-none focus:border-[#00f2ff] transition-colors text-[#e2e8f0] placeholder:text-[#64748b]"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 glass border border-[rgba(0,242,255,0.15)] rounded-xl text-sm text-[#e2e8f0] outline-none focus:border-[#00f2ff] transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Price range */}
        <div className="flex items-center gap-2 glass border border-[rgba(0,242,255,0.15)] rounded-xl px-3 py-2">
          <SlidersHorizontal size={14} className="text-[#64748b]" />
          <span className="text-xs text-[#64748b]">Max:</span>
          <input
            type="range" min={100} max={10000} step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-24 accent-[#00f2ff]"
          />
          <span className="text-xs text-[#00f2ff] font-semibold w-16">💎{maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Game filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {GAMES.map((g) => (
          <button
            key={g}
            onClick={() => setGame(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              game === g
                ? 'bg-[rgba(0,242,255,0.1)] border border-[rgba(0,242,255,0.35)] text-[#00f2ff]'
                : 'glass border border-[rgba(0,242,255,0.1)] text-[#64748b] hover:text-[#e2e8f0]'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {activeFilters.map((f) => (
            <span key={f.key} className="flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(0,242,255,0.08)] border border-[rgba(0,242,255,0.2)] rounded-full text-xs text-[#00f2ff] font-medium">
              {f.label}
              <button onClick={f.clear}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-[#64748b]"
          >
            <span className="text-5xl block mb-4">🔍</span>
            <p className="font-semibold">No items found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((item: Product) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
