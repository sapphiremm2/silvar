'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatSapphires } from '@/lib/utils/sapphires'
import type { Database } from '@/lib/supabase/types'

type BlindBox = Database['public']['Tables']['blind_boxes']['Row']

export function BoxCard({ box }: { box: BlindBox }) {
  return (
    <Link href={`/blind-boxes`}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="glass rounded-xl p-4 text-center border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.3)] transition-all cursor-pointer group hover:shadow-[0_8px_30px_rgba(0,242,255,0.12)]"
      >
        <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform duration-300">
          {box.emoji ?? '🎁'}
        </span>
        <p className="font-bold text-xs text-[#e2e8f0] mb-0.5 truncate">{box.name}</p>
        <p className="text-[10px] text-[#64748b] mb-2 uppercase tracking-wide">{box.game}</p>
        <p className="text-xs font-bold text-[#00f2ff]">💎 {formatSapphires(box.price_sapphires)}</p>
      </motion.div>
    </Link>
  )
}
