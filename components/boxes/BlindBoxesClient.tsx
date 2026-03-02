'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { formatSapphires } from '@/lib/utils/sapphires'
import toast from 'react-hot-toast'
import type { Database } from '@/lib/supabase/types'

type BlindBox = Database['public']['Tables']['blind_boxes']['Row']

interface WonItem {
  name: string
  emoji: string
  rarity: string
}

const GAMES = ['All', 'MM2', 'Grow a Garden', 'Steal a Brainrot', 'Blade Ball']

export function BlindBoxesClient({ boxes }: { boxes: BlindBox[] }) {
  const [game, setGame] = useState('All')
  const [quickOpen, setQuickOpen] = useState(false)
  const [selectedBox, setSelectedBox] = useState<BlindBox | null>(null)
  const [clicks, setClicks] = useState(0)
  const [opening, setOpening] = useState(false)
  const [wonItem, setWonItem] = useState<WonItem | null>(null)
  const { user } = useUser()

  const filtered = game === 'All' ? boxes : boxes.filter((b) => b.game === game)

  const handleBoxClick = (box: BlindBox) => {
    if (!user) { toast.error('Log in to open boxes!'); return }
    setSelectedBox(box)
    setClicks(0)
    setOpening(false)
    setWonItem(null)
  }

  const handleOpenClick = async () => {
    if (opening || !selectedBox) return
    const newClicks = clicks + 1
    setClicks(newClicks)
    if (newClicks < 5) return

    setOpening(true)
    try {
      const res = await fetch('/api/boxes/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boxId: selectedBox.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setTimeout(() => {
        setWonItem({
          name: data.item.name,
          emoji: data.item.emoji ?? '🎁',
          rarity: data.item.rarity ?? 'Common',
        })
      }, quickOpen ? 100 : 1200)
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to open box')
      setOpening(false)
      setClicks(0)
    }
  }

  const closeModal = () => {
    if (!opening || wonItem) {
      setSelectedBox(null)
      setClicks(0)
      setOpening(false)
      setWonItem(null)
    }
  }

  return (
    <>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {GAMES.map((g) => (
            <button key={g} onClick={() => setGame(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${game === g ? 'bg-[rgba(0,242,255,0.1)] border border-[rgba(0,242,255,0.35)] text-[#00f2ff]' : 'glass border border-[rgba(0,242,255,0.1)] text-[#64748b] hover:text-[#e2e8f0]'}`}>
              {g}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto glass border border-[rgba(0,242,255,0.15)] rounded-xl px-3 py-2">
          <span className="text-xs text-[#64748b] font-medium">Quick Open</span>
          <button
            onClick={() => setQuickOpen(!quickOpen)}
            className={`w-10 h-5 rounded-full transition-all relative ${quickOpen ? 'bg-[#00f2ff]' : 'bg-[#1e293b]'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${quickOpen ? 'left-[calc(100%-1.1rem)]' : 'left-0.5'}`} />
          </button>
          <Zap size={13} className={quickOpen ? 'text-[#00f2ff]' : 'text-[#64748b]'} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {filtered.map((box) => (
          <motion.div
            key={box.id}
            whileHover={{ y: -5 }}
            onClick={() => handleBoxClick(box)}
            className="glass rounded-2xl p-6 text-center border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.3)] cursor-pointer group transition-all hover:shadow-[0_8px_40px_rgba(0,242,255,0.1)]"
          >
            <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform duration-300">{box.emoji ?? '🎁'}</span>
            <p className="font-bold text-base text-[#e2e8f0] mb-1">{box.name}</p>
            <p className="text-xs text-[#64748b] uppercase tracking-widest mb-3">{box.game}</p>
            <p className="text-lg font-black text-[#00f2ff]">💎 {formatSapphires(box.price_sapphires)}</p>
          </motion.div>
        ))}
      </div>

      {/* Open Modal */}
      <AnimatePresence>
        {selectedBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020617]/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl border border-[rgba(0,242,255,0.2)] p-8 max-w-sm w-full text-center relative shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-[#64748b] hover:text-[#e2e8f0]">
                <X size={18} />
              </button>

              {/* Box icon */}
              <motion.span
                animate={opening && !wonItem ? { rotate: [-8, 8, -8] } : {}}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="text-7xl block mb-4"
              >
                {wonItem ? wonItem.emoji : selectedBox.emoji ?? '🎁'}
              </motion.span>

              {!wonItem ? (
                <>
                  <h3 className="text-xl font-bold text-[#e2e8f0] mb-1">{selectedBox.name}</h3>
                  <p className="text-sm text-[#64748b] mb-6">{selectedBox.game}</p>

                  {clicks > 0 && clicks < 5 && (
                    <motion.div
                      key={clicks}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-black text-[#00f2ff] mb-4"
                    >
                      {5 - clicks}
                    </motion.div>
                  )}

                  <button
                    onClick={handleOpenClick}
                    disabled={opening}
                    className="w-full py-3.5 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {clicks === 0 ? `Open Box — 💎 ${formatSapphires(selectedBox.price_sapphires)}` :
                      opening ? 'Opening...' : `Click ${5 - clicks} more time${5 - clicks !== 1 ? 's' : ''}...`}
                  </button>
                  <p className="text-xs text-[#64748b] mt-3">Click 5 times to confirm</p>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
                  <h3 className="text-xl font-bold text-[#e2e8f0] mb-1">You won!</h3>
                  <div className={`mt-4 p-4 rounded-xl border rarity-${wonItem.rarity.toLowerCase()}`}>
                    <p className="text-2xl mb-1">{wonItem.emoji}</p>
                    <p className="font-bold text-[#e2e8f0]">{wonItem.name}</p>
                    <p className="text-xs mt-1 uppercase tracking-widest">{wonItem.rarity}</p>
                  </div>
                  <p className="text-xs text-[#64748b] mt-3">Added to your inventory!</p>
                  <button onClick={closeModal} className="mt-4 w-full py-2.5 glass border border-[rgba(0,242,255,0.2)] rounded-xl text-sm font-semibold hover:border-[#00f2ff] transition-colors">
                    Close
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
