import { createClient } from '@/lib/supabase/server'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { ProductCard } from '@/components/shop/ProductCard'
import { BoxCard } from '@/components/boxes/BoxCard'
import { HeroSection } from '@/components/home/HeroSection'
import { StatsBar, CreatorBanner } from '@/components/home/HomeWidgets'

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: products }, { data: boxes }] = await Promise.all([
    supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
    supabase.from('blind_boxes').select('*').eq('is_active', true).limit(6),
  ])

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10">
        <HeroSection />
        <StatsBar />

        {/* Blind Boxes */}
        {boxes && boxes.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                Blind <span className="gradient-cyan">Boxes</span>
              </h2>
              <a href="/blind-boxes" className="text-sm text-[#64748b] hover:text-[#00f2ff] transition-colors font-medium tracking-wide uppercase">
                View All →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {boxes.map((box) => <BoxCard key={box.id} box={box} />)}
            </div>
          </section>
        )}

        {/* Featured Items */}
        {products && products.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                Featured <span className="gradient-cyan">Items</span>
              </h2>
              <a href="/shop" className="text-sm text-[#64748b] hover:text-[#00f2ff] transition-colors font-medium tracking-wide uppercase">
                View Shop →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-6 py-16">
          <CreatorBanner />
        </section>
      </div>
    </>
  )
}
