'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'
import { formatSapphires } from '@/lib/utils/sapphires'

export function CartPanel() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalSapphires, totalUSD, itemCount } = useCartStore()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#020617]/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col bg-[rgba(2,6,23,0.98)] border-l border-[rgba(0,242,255,0.12)] backdrop-blur-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,242,255,0.1)]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-[#00f2ff]" />
            <span className="font-bold text-base">Cart</span>
            {itemCount() > 0 && (
              <span className="bg-[rgba(0,242,255,0.15)] text-[#00f2ff] text-xs px-2 py-0.5 rounded-full font-semibold">
                {itemCount()}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="text-[#64748b] hover:text-[#e2e8f0] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-48 text-center"
              >
                <span className="text-4xl mb-3">🛒</span>
                <p className="text-[#64748b] text-sm">Your cart is empty</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-3 text-[#00f2ff] text-sm font-medium hover:underline"
                >
                  Browse the shop →
                </Link>
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 glass rounded-xl border border-[rgba(0,242,255,0.08)]"
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-xs text-[#64748b]">{item.game}</p>
                    <p className="text-sm font-bold text-[#00f2ff] mt-0.5">
                      💎 {formatSapphires(item.priceSapphires * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg glass border border-[rgba(0,242,255,0.15)] flex items-center justify-center hover:border-[#00f2ff] transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg glass border border-[rgba(0,242,255,0.15)] flex items-center justify-center hover:border-[#00f2ff] transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#64748b] hover:text-red-400 transition-colors ml-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-[rgba(0,242,255,0.1)] space-y-3">
            {/* Promo code */}
            <div className="flex gap-2">
              <input
                placeholder="Promo code"
                className="flex-1 bg-[rgba(15,30,60,0.6)] border border-[rgba(0,242,255,0.15)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00f2ff] transition-colors font-[var(--font-geist-sans)] text-[#e2e8f0] placeholder:text-[#64748b]"
              />
              <button className="px-3 py-2 glass border border-[rgba(0,242,255,0.25)] rounded-lg text-sm font-semibold text-[#00f2ff] hover:bg-[rgba(0,242,255,0.08)] transition-colors">
                Apply
              </button>
            </div>

            {/* Subtotal */}
            <div className="flex items-end justify-between">
              <span className="text-sm text-[#64748b] font-medium">Subtotal</span>
              <div className="text-right">
                <p className="text-lg font-bold text-[#00f2ff]">💎 {formatSapphires(totalSapphires())}</p>
                <p className="text-xs text-[#64748b]">≈ ${totalUSD()} USD</p>
              </div>
            </div>

            {/* Checkout */}
            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full block text-center py-3 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(0,242,255,0.3)]"
            >
              Checkout
            </Link>

            <div className="flex justify-center gap-4 text-xs text-[#64748b]">
              <span>💳 Stripe</span>
              <span>·</span>
              <span>💎 Sapphires</span>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
