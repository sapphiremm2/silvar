import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import '../styles/globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartPanel } from '@/components/shop/CartPanel'
import { SupportChat } from '@/components/support/SupportChat'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'silvar.gg — Roblox Marketplace',
  description: 'Trade rare Roblox items, open mystery boxes, and connect with the community.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'silvar.gg',
    description: 'The premier Roblox item marketplace',
    url: 'https://silvar.gg',
    siteName: 'silvar.gg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
        <CartPanel />
        <SupportChat />
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: 'rgba(15,30,60,0.95)',
              border: '1px solid rgba(0,242,255,0.2)',
              color: '#e2e8f0',
              fontFamily: 'var(--font-geist-sans)',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </body>
    </html>
  )
}
