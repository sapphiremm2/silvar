import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[rgba(0,242,255,0.08)] bg-[rgba(2,6,23,0.9)] backdrop-blur-xl mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="gradient-brand text-2xl font-black block mb-3">SILVAR.GG</span>
          <p className="text-[#64748b] text-sm leading-relaxed max-w-xs">
            The premier Roblox item marketplace. Trade rare items, open mystery boxes, and connect with the community.
          </p>
        </div>
        <div>
          <h4 className="text-[#00f2ff] text-xs font-bold uppercase tracking-widest mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-[#64748b]">
            <li><Link href="/shop" className="hover:text-[#e2e8f0] transition-colors">All Items</Link></li>
            <li><Link href="/blind-boxes" className="hover:text-[#e2e8f0] transition-colors">Blind Boxes</Link></li>
            <li><Link href="/marketplace" className="hover:text-[#e2e8f0] transition-colors">P2P Marketplace</Link></li>
            <li><Link href="/wishlist" className="hover:text-[#e2e8f0] transition-colors">My Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#00f2ff] text-xs font-bold uppercase tracking-widest mb-4">Games</h4>
          <ul className="space-y-2.5 text-sm text-[#64748b]">
            <li><Link href="/shop?game=MM2" className="hover:text-[#e2e8f0] transition-colors">Murder Mystery 2</Link></li>
            <li><Link href="/shop?game=Grow+a+Garden" className="hover:text-[#e2e8f0] transition-colors">Grow a Garden</Link></li>
            <li><Link href="/shop?game=Steal+a+Brainrot" className="hover:text-[#e2e8f0] transition-colors">Steal a Brainrot</Link></li>
            <li><Link href="/shop?game=Blade+Ball" className="hover:text-[#e2e8f0] transition-colors">Blade Ball</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#00f2ff] text-xs font-bold uppercase tracking-widest mb-4">Support</h4>
          <ul className="space-y-2.5 text-sm text-[#64748b]">
            <li><Link href="/creator" className="hover:text-[#e2e8f0] transition-colors">Creator Program</Link></li>
            <li><a href="mailto:support@silvar.gg" className="hover:text-[#e2e8f0] transition-colors">Contact Us</a></li>
            <li><Link href="/terms" className="hover:text-[#e2e8f0] transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-[#e2e8f0] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/admin" className="hover:text-[#ff00c1] transition-colors">Admin Panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[rgba(30,41,59,0.6)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748b]">
          <span>© 2025 silvar.gg — All rights reserved</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#e2e8f0] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[#e2e8f0] transition-colors">Privacy</Link>
            <span>Built with 💎 Sapphires · $1 = 50💎</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
