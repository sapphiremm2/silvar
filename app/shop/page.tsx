import { createClient } from '@/lib/supabase/server'
import { ShopClient } from '@/components/shop/ShopClient'
import { ParticleBackground } from '@/components/ui/ParticleBackground'

export const metadata = { title: 'Shop — silvar.gg' }

export default async function ShopPage() {
  const supabase = createClient()
  const [{ data: products }, { data: listings }] = await Promise.all([
    supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    supabase
      .from('marketplace_listings')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ])

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-2">
          The <span className="gradient-cyan">Shop</span>
        </h1>
        <p className="text-[#64748b] mb-8">Official items and peer-to-peer listings</p>
        <ShopClient products={products ?? []} listings={listings ?? []} />
      </div>
    </>
  )
}
