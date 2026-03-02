'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,242,255,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 30% 60%, rgba(255,0,193,0.05) 0%, transparent 70%)'
        }} />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { icon: '🎁', top: '18%', left: '8%', delay: 0 },
          { icon: '⭐', top: '55%', right: '7%', delay: -2 },
          { icon: '💎', top: '25%', right: '14%', delay: -4 },
          { icon: '🎮', bottom: '22%', left: '13%', delay: -1 },
        ].map((item, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
            className="absolute text-3xl opacity-15"
            style={{ top: item.top, left: item.left, right: (item as any).right, bottom: (item as any).bottom }}
          >
            {item.icon}
          </motion.span>
        ))}
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,242,255,0.25)] text-[#00f2ff] text-xs font-semibold tracking-widest uppercase mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse-dot" />
        12,400+ Traders Online
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[clamp(3rem,9vw,7rem)] font-black leading-none mb-6"
      >
        <span className="block text-white">THE ROBLOX</span>
        <span className="block gradient-full animate-shimmer bg-[size:200%]">MARKETPLACE</span>
      </motion.h1>

      {/* Sub */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[#64748b] text-lg max-w-md mx-auto mb-10 font-normal"
      >
        Trade rare items, open mystery boxes, and connect with the Roblox trading community.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <Link
          href="/shop"
          className="px-8 py-3 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-1 transition-all shadow-[0_4px_24px_rgba(0,242,255,0.3)]"
        >
          Browse Shop
        </Link>
        <Link
          href="/blind-boxes"
          className="px-8 py-3 border border-[rgba(255,0,193,0.4)] text-[#ff00c1] rounded-xl font-bold text-sm hover:bg-[rgba(255,0,193,0.08)] hover:-translate-y-1 transition-all"
        >
          Open Boxes
        </Link>
      </motion.div>
    </section>
  )
}
