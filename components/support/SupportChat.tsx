'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Minus, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  role: 'user' | 'agent'
  text: string
}

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'agent', text: 'Hey! 👋 How can we help you today?' },
  ])
  const [submitted, setSubmitted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, minimized])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])

    // Save ticket to Supabase
    if (!submitted) {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('support_tickets').insert({
        user_id: user?.id ?? null,
        message: text,
        subject: 'Support Chat',
        status: 'open',
      })
      setSubmitted(true)
    }

    // Auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'agent', text: "Thanks! A support agent will review your ticket shortly. We typically respond within 24 hours." },
      ])
    }, 900)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="w-80 glass rounded-2xl border border-[rgba(0,242,255,0.15)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[rgba(0,242,255,0.08)] to-[rgba(255,0,193,0.08)] border-b border-[rgba(0,242,255,0.1)]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse-dot" />
                <span className="font-semibold text-sm">Support Chat</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setMinimized(true)} className="text-[#64748b] hover:text-[#e2e8f0]">
                  <Minus size={16} />
                </button>
                <button onClick={() => setOpen(false)} className="text-[#64748b] hover:text-[#e2e8f0]">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-52 overflow-y-auto px-4 py-3 space-y-2.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.role === 'agent'
                      ? 'bg-[rgba(0,242,255,0.08)] border border-[rgba(0,242,255,0.12)] self-start mr-auto'
                      : 'bg-[rgba(255,0,193,0.08)] border border-[rgba(255,0,193,0.12)] self-end ml-auto'
                  } ${msg.role === 'user' ? 'ml-auto' : ''}`}
                  style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-[rgba(0,242,255,0.1)] flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-[rgba(15,30,60,0.6)] border border-[rgba(0,242,255,0.15)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00f2ff] transition-colors text-[#e2e8f0] placeholder:text-[#64748b]"
              />
              <button
                onClick={sendMessage}
                className="w-9 h-9 bg-gradient-to-r from-[#00f2ff] to-[#006fff] rounded-lg flex items-center justify-center text-[#020617] hover:opacity-90 transition-opacity flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => { setOpen(true); setMinimized(false) }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00f2ff] to-[#ff00c1] flex items-center justify-center shadow-[0_4px_24px_rgba(0,242,255,0.4)] text-[#020617]"
      >
        {open && !minimized ? <X size={22} onClick={(e) => { e.stopPropagation(); setOpen(false) }} /> : <MessageCircle size={22} />}
      </motion.button>
    </div>
  )
}
