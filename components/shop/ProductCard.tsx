'use client'

import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { formatSapphires, sapphiresToUSD } from '@/lib/utils/sapphires'
import toast from 'react-hot-toast'
import type { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  onSelect?: () => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      emoji: product.emoji ?? '🎮',
      priceSapphires: product.price_sapphires,
      game: product.game,
      type: 'shop',
    })
    toast.success(`${product.emoji} ${product.name} added to cart!`)
    openCart()
  }

  return (
    <Link href={`/shop/${product.id}`} onClick={onSelect} className="block">
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-xl overflow-hidden cursor-pointer group border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.3)] transition-all hover:shadow-[0_8px_40px_rgba(0,242,255,0.1)]"
    >
      {/* Image / emoji area */}
      <div className="relative h-40 bg-gradient-to-br from-[#0a1628] to-[#1e293b] flex items-center justify-center text-5xl overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="group-hover:scale-110 transition-transform duration-300">{product.emoji ?? '🎮'}</span>
        )}
        {/* Quick buy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <button
            onClick={handleQuickBuy}
            className="flex items-center gap-2 px-4 py-2 bg-[#00f2ff] text-[#020617] rounded-lg text-sm font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-200"
          >
            <ShoppingCart size={14} /> Quick Buy
          </button>
        </div>
        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-[#020617]/60 flex items-center justify-center">
            <span className="text-[#64748b] text-sm font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="font-semibold text-sm text-[#e2e8f0] truncate mb-0.5">{product.name}</p>
        <p className="text-xs text-[#64748b] mb-2.5">{product.game}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#00f2ff]">💎 {formatSapphires(product.price_sapphires)}</p>
            <p className="text-xs text-[#64748b]">≈ ${sapphiresToUSD(product.price_sapphires)}</p>
          </div>
          <RarityBadge rarity={product.rarity} />
        </div>
      </div>
    </motion.div>
    </Link>
  )
}
