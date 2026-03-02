'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { useCartStore } from '@/stores/cartStore'
import { formatSapphires, sapphiresToUSD } from '@/lib/utils/sapphires'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/blind-boxes', label: 'Blind Boxes' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/creator', label: 'Creator Program' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [sapphireOpen, setSapphireOpen] = useState(false)
  const pathname = usePathname()
  const { user, profile, isAdmin, signOut } = useUser()
  const { itemCount, toggleCart } = useCartStore()
  const supabase = createClient()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#020617]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,242,255,0.06)]'
            : 'bg-[#020617]/80 backdrop-blur-md'
        } border-b border-[rgba(0,242,255,0.1)]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="gradient-brand text-xl font-black tracking-tight">
            SILVAR.GG
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium transition-colors relative group ${
                    pathname === href ? 'text-[#00f2ff]' : 'text-[#64748b] hover:text-[#e2e8f0]'
                  }`}
                >
                  {label}
                  <span className={`absolute -bottom-1 left-0 right-0 h-px bg-[#00f2ff] transition-transform origin-left ${
                    pathname === href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Sapphire balance */}
            {user && profile && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setSapphireOpen(!sapphireOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[rgba(0,242,255,0.2)] text-[#00f2ff] text-sm font-semibold hover:border-[rgba(0,242,255,0.4)] transition-all"
                >
                  <span>💎</span>
                  <span>{formatSapphires(profile.sapphire_balance)}</span>
                  <span className="text-[#64748b] text-xs">≈${sapphiresToUSD(profile.sapphire_balance)}</span>
                  <ChevronDown size={12} className="text-[#64748b]" />
                </button>
                <AnimatePresence>
                  {sapphireOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 glass rounded-xl border border-[rgba(0,242,255,0.15)] p-3 shadow-xl"
                    >
                      <p className="text-xs text-[#64748b] mb-3 font-medium">Your Balance</p>
                      <p className="text-2xl font-bold text-[#00f2ff] mb-0.5">💎 {formatSapphires(profile.sapphire_balance)}</p>
                      <p className="text-xs text-[#64748b] mb-3">≈ ${sapphiresToUSD(profile.sapphire_balance)} USD</p>
                      <Link
                        href="/cart?reload=true"
                        onClick={() => setSapphireOpen(false)}
                        className="w-full block text-center py-2 px-3 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        Reload Sapphires
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 glass rounded-lg border border-[rgba(0,242,255,0.15)] hover:border-[rgba(0,242,255,0.35)] transition-all"
            >
              <ShoppingCart size={18} />
              {itemCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff00c1] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount()}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-[rgba(0,242,255,0.15)] hover:border-[rgba(0,242,255,0.35)] transition-all text-sm font-medium"
                >
                  <User size={15} />
                  <span className="hidden sm:inline max-w-24 truncate">{profile?.display_name ?? profile?.username}</span>
                  <ChevronDown size={12} className="text-[#64748b]" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-[rgba(0,242,255,0.15)] overflow-hidden shadow-xl"
                    >
                      <Link href={`/seller/${profile?.username}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[rgba(0,242,255,0.06)] transition-colors" onClick={() => setProfileOpen(false)}>
                        <User size={15} className="text-[#64748b]" /> My Profile
                      </Link>
                      <Link href="/seller/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[rgba(0,242,255,0.06)] transition-colors" onClick={() => setProfileOpen(false)}>
                        <Settings size={15} className="text-[#64748b]" /> Seller Dashboard
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-[#ff00c1] hover:bg-[rgba(255,0,193,0.06)] transition-colors" onClick={() => setProfileOpen(false)}>
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-[rgba(0,242,255,0.1)]" />
                      <button onClick={() => { signOut(); setProfileOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#64748b] hover:text-red-400 hover:bg-[rgba(255,0,0,0.06)] transition-colors">
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-1.5 bg-gradient-to-r from-[#00f2ff] to-[#006fff] text-[#020617] rounded-lg text-sm font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(0,242,255,0.25)]"
              >
                Login
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 glass rounded-lg border border-[rgba(0,242,255,0.15)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[rgba(0,242,255,0.1)] bg-[#020617]/98 backdrop-blur-xl"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === href
                        ? 'bg-[rgba(0,242,255,0.1)] text-[#00f2ff]'
                        : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.04)]'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {user && profile && (
                  <div className="mt-2 pt-2 border-t border-[rgba(0,242,255,0.1)] flex items-center justify-between px-3 py-2">
                    <span className="text-[#00f2ff] text-sm font-semibold">💎 {formatSapphires(profile.sapphire_balance)}</span>
                    <Link href="/cart?reload=true" onClick={() => setMobileOpen(false)} className="text-xs text-[#64748b] underline">Reload</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Click-away for dropdowns */}
      {(profileOpen || sapphireOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setProfileOpen(false); setSapphireOpen(false) }} />
      )}
    </>
  )
}
