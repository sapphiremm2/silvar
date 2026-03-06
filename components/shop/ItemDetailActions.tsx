'use client'

import { ShoppingCart, Gem } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatSapphires, sapphiresToUSD } from '@/lib/utils/sapphires'
import toast from 'react-hot-toast'

interface Props {
  product: {
    id: string
    name: string
    emoji: string | null
    game: string
    price_sapphires: number
    stock: number | null
  }
}

export function ItemDetailActions({ product }: Props) {
  const { addItem, openCart } = useCartStore()
  const outOfStock = product.stock === 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      emoji: product.emoji ?? '🎮',
      priceSapphires: product.price_sapphires,
      game: product.game,
      type: 'shop',
    })
    toast.success(`${product.emoji ?? '🎮'} ${product.name} added to cart!`)
    openCart()
  }

  return (
    <div className="glass rounded-2xl border border-[rgba(0,242,255,0.15)] p-6 space-y-4 h-fit">
      <h3 className="font-bold text-[#e2e8f0]">Buy from Silvar</h3>

      <div className="space-y-1">
        <p className="text-3xl font-black text-[#00f2ff]">
          💎 {formatSapphires(product.price_sapphires)}
        </p>
        <p className="text-sm text-[#64748b]">≈ ${sapphiresToUSD(product.price_sapphires)} USD</p>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,242,255,0.3)]"
      >
        <ShoppingCart size={16} />
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>

      <div className="pt-2 border-t border-[rgba(0,242,255,0.1)]">
        <p className="text-xs text-[#64748b] flex items-center gap-1.5">
          <Gem size={11} className="text-[#00f2ff]" />
          Pay with sapphires at checkout
        </p>
      </div>
    </div>
  )
}
