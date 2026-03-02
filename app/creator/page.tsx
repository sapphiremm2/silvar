'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import { ParticleBackground } from '@/components/ui/ParticleBackground'

const TIERS = [
  {
    id: 'starter', name: 'Starter', icon: '⭐', commission: '5%',
    color: 'border-[rgba(100,116,139,0.3)] text-[#94a3b8]',
    commColor: 'text-[#94a3b8]',
    perks: ['Custom affiliate link', 'Monthly payouts', 'Basic analytics', 'Community access'],
    req: '1K+ followers',
  },
  {
    id: 'influencer', name: 'Influencer', icon: '💎', commission: '8%',
    color: 'border-[rgba(0,242,255,0.3)] text-[#00f2ff]',
    commColor: 'text-[#00f2ff]',
    perks: ['Everything in Starter', 'Priority support', 'Exclusive item access', 'Weekly payouts', 'Advanced analytics'],
    req: '10K+ followers', featured: true,
  },
  {
    id: 'partner', name: 'Partner', icon: '👑', commission: '12%',
    color: 'border-[rgba(255,0,193,0.3)] text-[#ff00c1]',
    commColor: 'text-[#ff00c1]',
    perks: ['Everything in Influencer', 'Dedicated manager', 'Custom box branding', 'Daily payouts', 'Co-marketing deals', 'Revenue share events'],
    req: '100K+ followers',
  },
]

export default function CreatorPage() {
  const { user } = useUser()
  const [form, setForm] = useState({ platform: '', channel_url: '', follower_count: '', content_type: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { toast.error('Please log in first'); return }
    setLoading(true)
    const { error } = await supabase.from('creator_applications').insert({
      user_id: user.id,
      platform: form.platform,
      channel_url: form.channel_url,
      follower_count: parseInt(form.follower_count) || null,
      content_type: form.content_type,
      status: 'pending',
    })
    if (error) { toast.error('Submission failed'); setLoading(false); return }
    setSubmitted(true)
    toast.success('Application submitted!')
    setLoading(false)
  }

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black mb-3">
            Creator <span className="gradient-brand">Program</span>
          </h1>
          <p className="text-[#64748b] max-w-md mx-auto">Earn commissions promoting silvar.gg. Three tiers for every creator size.</p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-2xl border p-7 ${tier.color} ${tier.featured ? 'shadow-[0_0_40px_rgba(0,242,255,0.1)]' : ''}`}
            >
              {tier.featured && (
                <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[rgba(0,242,255,0.1)] border border-[rgba(0,242,255,0.25)] text-[#00f2ff] text-xs font-bold uppercase tracking-widest">Most Popular</span>
              )}
              <p className="text-xl font-black mb-1">{tier.icon} {tier.name}</p>
              <p className={`text-4xl font-black mb-1 ${tier.commColor}`}>{tier.commission}</p>
              <p className="text-xs text-[#64748b] mb-5 uppercase tracking-widest">Commission · {tier.req}</p>
              <ul className="space-y-2">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span className="text-[#00ff88] mt-0.5 font-bold">✓</span> {perk}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Apply form */}
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-black mb-6 text-center">Apply Now</h2>
          {submitted ? (
            <div className="glass rounded-2xl border border-[rgba(0,255,136,0.2)] p-10 text-center">
              <span className="text-5xl block mb-4">🎉</span>
              <h3 className="text-xl font-bold text-[#00ff88] mb-2">Application Submitted!</h3>
              <p className="text-[#64748b] text-sm">We'll review your application and get back to you within 3-5 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl border border-[rgba(0,242,255,0.15)] p-7 space-y-4">
              {[
                { key: 'platform', placeholder: 'Platform (YouTube, TikTok, Twitter...)', type: 'text', required: true },
                { key: 'channel_url', placeholder: 'Channel / Profile URL', type: 'url', required: true },
                { key: 'follower_count', placeholder: 'Follower count', type: 'number', required: false },
              ].map(({ key, placeholder, type, required }) => (
                <input
                  key={key}
                  type={type}
                  required={required}
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full glass border border-[rgba(0,242,255,0.15)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00f2ff] transition-colors text-[#e2e8f0] placeholder:text-[#64748b]"
                />
              ))}
              <select
                value={form.content_type}
                onChange={(e) => setForm({ ...form, content_type: e.target.value })}
                className="w-full glass border border-[rgba(0,242,255,0.15)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00f2ff] transition-colors text-[#64748b]"
              >
                <option value="">Content type...</option>
                <option>Trading Guides</option>
                <option>Unboxing / Opening</option>
                <option>Game Reviews</option>
                <option>Entertainment</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(0,242,255,0.25)]"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
