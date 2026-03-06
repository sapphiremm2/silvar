import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { SellerDashboardClient } from '@/components/seller/SellerDashboardClient'

export const metadata = { title: 'Seller Dashboard — silvar.gg' }

export default async function SellerDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const [{ data: profile }, { data: listings }, { data: sales }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('marketplace_listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('purchases')
      .select('*, products(name, emoji, game)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-1">
          Seller <span className="gradient-cyan">Dashboard</span>
        </h1>
        <p className="text-[#64748b] mb-8">Manage your listings and profile</p>
        <SellerDashboardClient
          initialListings={listings ?? []}
          initialSales={sales ?? []}
          profile={profile}
          userId={user.id}
        />
      </div>
    </>
  )
}
