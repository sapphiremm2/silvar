import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Admin — silvar.gg' }

export default async function AdminPage() {
  const supabase = createClient()
  const [
    { count: productCount },
    { count: userCount },
    { count: pendingApps },
    { count: openTickets },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('creator_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
  ])

  const stats = [
    { label: 'Products', value: productCount ?? 0, icon: '📦', href: '/admin/products', color: 'text-[#00f2ff]' },
    { label: 'Users', value: userCount ?? 0, icon: '👥', href: '/admin/users', color: 'text-[#00ff88]' },
    { label: 'Pending Applications', value: pendingApps ?? 0, icon: '⭐', href: '/admin/creator-apps', color: 'text-[#ff00c1]' },
    { label: 'Open Tickets', value: openTickets ?? 0, icon: '🎫', href: '/admin/tickets', color: 'text-[#ffa500]' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.3)] p-6 transition-all hover:-translate-y-1">
            <span className="text-3xl block mb-3">{s.icon}</span>
            <p className={`text-3xl font-black ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-[#64748b] uppercase tracking-widest mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { href: '/admin/products', icon: '📦', title: 'Manage Products', desc: 'Create, edit, and delete shop items' },
          { href: '/admin/blind-boxes', icon: '🎁', title: 'Manage Blind Boxes', desc: 'Configure box contents and pricing' },
          { href: '/admin/users', icon: '👥', title: 'View Users', desc: 'Browse and manage user accounts' },
          { href: '/admin/creator-apps', icon: '⭐', title: 'Creator Applications', desc: 'Review and approve creator program applicants' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.3)] p-6 flex items-center gap-4 transition-all hover:-translate-y-1">
            <span className="text-4xl">{item.icon}</span>
            <div>
              <p className="font-bold text-[#e2e8f0]">{item.title}</p>
              <p className="text-sm text-[#64748b]">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
