'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { formatSapphires } from '@/lib/utils/sapphires'
import { SAPPHIRE_PACKAGES } from '@/lib/stripe/client'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Minus, Plus, Trash2, CreditCard, Gem } from 'lucide-react'

function CartPageInner() {
  const { items, removeItem, updateQty, totalSapphires, totalUSD, clearCart } = useCartStore()
  const [payMethod, setPayMethod] = useState<'stripe' | 'sapphires'>('stripe')
  const [loading, setLoading] = useState(false)
  const [promo, setPromo] = useState('')
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const reloadSap = searchParams.get('reload')

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    try {
      if (payMethod === 'stripe') {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, promoCode: promo }),
        })
        const { url } = await res.json()
        if (url) window.location.href = url
      } else {
        toast.error('Sapphire checkout coming soon!')
      }
    } catch {
      toast.error('Checkout failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReload = async (pkgId: string) => {
    const res = await fetch('/api/sapphires/reload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: pkgId }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <span className="text-7xl block mb-6">🎉</span>
          <h1 className="text-3xl font-black mb-3 text-[#00ff88]">Order Complete!</h1>
          <p className="text-[#64748b]">Your items have been added to your inventory.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black mb-8">
        {reloadSap ? <>Reload <span className="gradient-cyan">Sapphires</span></> : <>Your <span className="gradient-cyan">Cart</span></>}
      </h1>

      {reloadSap ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAPPHIRE_PACKAGES.map((pkg) => (
            <motion.button
              key={pkg.id}
              whileHover={{ y: -3 }}
              onClick={() => handleReload(pkg.id)}
              className="glass rounded-2xl border border-[rgba(0,242,255,0.15)] hover:border-[rgba(0,242,255,0.4)] p-6 text-left transition-all hover:shadow-[0_8px_30px_rgba(0,242,255,0.1)]"
            >
              <p className="text-2xl font-black text-[#00f2ff] mb-1">💎 {pkg.sapphires.toLocaleString()}</p>
              {pkg.bonus && <p className="text-xs text-[#00ff88] font-semibold mb-2">{pkg.bonus}</p>}
              <p className="text-[#64748b] text-sm">{pkg.label}</p>
              <p className="text-xl font-black text-[#e2e8f0] mt-3">${pkg.usd}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.length === 0 ? (
              <div className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-16 text-center">
                <span className="text-5xl block mb-4">🛒</span>
                <p className="text-[#64748b]">Your cart is empty</p>
              </div>
            ) : items.map((item) => (
              <motion.div key={item.id} layout className="glass rounded-xl border border-[rgba(0,242,255,0.1)] p-4 flex items-center gap-4">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-[#64748b]">{item.game}</p>
                  <p className="text-sm font-bold text-[#00f2ff] mt-0.5">💎 {formatSapphires(item.priceSapphires * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 glass rounded-lg border border-[rgba(0,242,255,0.15)] flex items-center justify-center"><Minus size={12} /></button>
                  <span className="w-6 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 glass rounded-lg border border-[rgba(0,242,255,0.15)] flex items-center justify-center"><Plus size={12} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-[#64748b] hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass rounded-2xl border border-[rgba(0,242,255,0.15)] p-6 h-fit space-y-4">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="flex justify-between text-sm text-[#64748b]">
              <span>Items ({items.length})</span>
              <span className="text-[#e2e8f0]">💎 {formatSapphires(totalSapphires())}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-[rgba(0,242,255,0.1)] pt-3">
              <span>Total</span>
              <div className="text-right">
                <p className="text-[#00f2ff]">💎 {formatSapphires(totalSapphires())}</p>
                <p className="text-xs text-[#64748b] font-normal">≈ ${totalUSD()}</p>
              </div>
            </div>

            {/* Promo */}
            <div className="flex gap-2">
              <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code"
                className="flex-1 glass border border-[rgba(0,242,255,0.15)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00f2ff] text-[#e2e8f0] placeholder:text-[#64748b]" />
              <button className="px-3 text-sm font-semibold text-[#00f2ff] glass border border-[rgba(0,242,255,0.2)] rounded-lg hover:bg-[rgba(0,242,255,0.06)]">Apply</button>
            </div>

            {/* Pay toggle */}
            <div className="flex gap-2">
              {(['stripe', 'sapphires'] as const).map((m) => (
                <button key={m} onClick={() => setPayMethod(m)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${payMethod === m ? 'bg-[rgba(0,242,255,0.12)] border border-[rgba(0,242,255,0.3)] text-[#00f2ff]' : 'glass border border-[rgba(0,242,255,0.1)] text-[#64748b]'}`}>
                  {m === 'stripe' ? <><CreditCard size={13} /> Card</> : <><Gem size={13} /> Sapphires</>}
                </button>
              ))}
            </div>

            <button onClick={handleCheckout} disabled={loading || items.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-40 shadow-[0_4px_20px_rgba(0,242,255,0.3)]">
              {loading ? 'Redirecting...' : 'Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-10 text-[#64748b]">Loading cart...</div>}>
      <CartPageInner />
    </Suspense>
  )
}
