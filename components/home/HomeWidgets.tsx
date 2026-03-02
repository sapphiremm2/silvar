'use client'

import Link from 'next/link'

export function StatsBar() {
  const stats = [
    { num: '24K+', label: 'Active Users' },
    { num: '180K', label: 'Items Sold' },
    { num: '🔒 SSL', label: 'Secure' },
    { num: '<60s', label: 'Instant Delivery' },
  ]
  return (
    <div className="glass border-y border-[rgba(0,242,255,0.1)] backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className={`flex flex-col items-center justify-center py-6 px-4 text-center ${i < stats.length - 1 ? 'border-r border-[rgba(0,242,255,0.08)]' : ''}`}>
            <span className="text-2xl font-black gradient-cyan">{s.num}</span>
            <span className="text-xs text-[#64748b] font-medium uppercase tracking-widest mt-1">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CreatorBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,0,193,0.2)] bg-gradient-to-br from-[rgba(0,242,255,0.04)] to-[rgba(255,0,193,0.04)] p-12 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 -top-32 -left-32 rounded-full bg-[rgba(0,242,255,0.04)] blur-3xl" />
        <div className="absolute w-96 h-96 -bottom-32 -right-32 rounded-full bg-[rgba(255,0,193,0.04)] blur-3xl" />
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-black mb-3">
          Join the <span className="gradient-brand">Creator Program</span>
        </h2>
        <p className="text-[#64748b] max-w-sm mx-auto mb-6">Earn commissions promoting silvar.gg to your audience.</p>
        <div className="flex justify-center gap-3 flex-wrap mb-8">
          {[
            { label: '⭐ Starter · 5%', cls: 'border-[rgba(100,116,139,0.4)] text-[#64748b]' },
            { label: '💎 Influencer · 8%', cls: 'border-[rgba(0,242,255,0.35)] text-[#00f2ff]' },
            { label: '👑 Partner · 12%', cls: 'border-[rgba(255,0,193,0.35)] text-[#ff00c1]' },
          ].map((t) => (
            <span key={t.label} className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${t.cls}`}>{t.label}</span>
          ))}
        </div>
        <Link href="/creator" className="inline-block px-8 py-3 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-1 transition-all shadow-[0_4px_24px_rgba(0,242,255,0.3)]">
          Apply Now
        </Link>
      </div>
    </div>
  )
}
