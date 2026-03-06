import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { PriceHistoryChart } from '@/components/shop/PriceHistoryChart'
import { ItemDetailActions } from '@/components/shop/ItemDetailActions'
import { formatSapphires, sapphiresToUSD } from '@/lib/utils/sapphires'
import Link from 'next/link'
import { ChevronLeft, User, ExternalLink } from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('name').eq('id', params.id).single()
  const row = data as any
  return { title: row ? `${row.name} — silvar.gg` : 'Item — silvar.gg' }
}

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: rawProduct }, { data: rawListings }, { data: rawHistory }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase
      .from('marketplace_listings')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('product_id', params.id)
      .eq('is_active', true)
      .order('price_sapphires', { ascending: true }),
    supabase
      .from('price_history')
      .select('sale_date, price_sapphires')
      .eq('product_id', params.id)
      .order('sale_date', { ascending: true })
      .limit(30),
  ])

  const product = rawProduct as any
  const listings = (rawListings ?? []) as any[]
  const priceHistory = (rawHistory ?? []) as any[]

  if (!product) notFound()

  const lowestP2P = listings.length > 0 ? listings[0].price_sapphires : null

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#00f2ff] transition-colors mb-8"
        >
          <ChevronLeft size={15} /> Back to Shop
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Image / emoji */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl border border-[rgba(0,242,255,0.15)] overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-[#0a1628] to-[#1e293b] flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                  />
                ) : (
                  <span className="text-8xl">{product.emoji ?? '🎮'}</span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] uppercase tracking-widest font-semibold">
                    {product.game}
                  </span>
                  <RarityBadge rarity={product.rarity} size="md" />
                </div>
                {product.stock !== null && (
                  <p className="text-xs text-[#64748b]">
                    {product.stock > 0 ? (
                      <span className="text-[#00ff88]">✓ {product.stock} in stock</span>
                    ) : (
                      <span className="text-red-400">Out of stock</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center: Info */}
          <div className="lg:col-span-1 space-y-5">
            <div>
              <h1 className="text-3xl font-black text-[#e2e8f0] mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-[#64748b] text-sm leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Price */}
            <div className="glass rounded-xl border border-[rgba(0,242,255,0.15)] p-4">
              <p className="text-xs text-[#64748b] mb-1 uppercase tracking-widest">Silvar Price</p>
              <p className="text-2xl font-black text-[#00f2ff]">
                💎 {formatSapphires(product.price_sapphires)}
              </p>
              <p className="text-sm text-[#64748b]">≈ ${sapphiresToUSD(product.price_sapphires)} USD</p>
            </div>

            {lowestP2P && (
              <div className="glass rounded-xl border border-[rgba(0,255,136,0.15)] p-4">
                <p className="text-xs text-[#64748b] mb-1 uppercase tracking-widest">Lowest P2P</p>
                <p className="text-2xl font-black text-[#00ff88]">
                  💎 {formatSapphires(lowestP2P)}
                </p>
                <p className="text-sm text-[#64748b]">≈ ${sapphiresToUSD(lowestP2P)} USD</p>
              </div>
            )}
          </div>

          {/* Right: Buy panel */}
          <div className="lg:col-span-1">
            <ItemDetailActions product={product} />
          </div>
        </div>

        {/* Price History */}
        <section className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#e2e8f0] mb-4">
            Price <span className="gradient-cyan">History</span>
          </h2>
          <PriceHistoryChart data={priceHistory} />
        </section>

        {/* P2P Listings */}
        {listings.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[#e2e8f0] mb-4">
              P2P <span className="gradient-cyan">Listings</span>
              <span className="ml-2 text-sm text-[#64748b] font-normal">
                {listings.length} available
              </span>
            </h2>
            <div className="space-y-3">
              {listings.map((listing: any) => (
                <div
                  key={listing.id}
                  className="glass rounded-xl border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.25)] p-4 flex items-center gap-4 transition-all"
                >
                  <span className="text-2xl">{listing.emoji ?? product.emoji ?? '🎮'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#e2e8f0] truncate">{listing.title}</p>
                    {listing.description && (
                      <p className="text-xs text-[#64748b] truncate">{listing.description}</p>
                    )}
                    <Link
                      href={`/seller/${listing.profiles?.username}`}
                      className="text-xs text-[#64748b] hover:text-[#00f2ff] transition-colors flex items-center gap-1 mt-0.5"
                    >
                      <User size={11} />
                      {listing.profiles?.display_name ?? listing.profiles?.username ?? 'Unknown'}
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#00f2ff]">
                      💎 {formatSapphires(listing.price_sapphires)}
                    </p>
                    <p className="text-xs text-[#64748b]">≈ ${sapphiresToUSD(listing.price_sapphires)}</p>
                  </div>
                  <Link
                    href={`/seller/${listing.profiles?.username}`}
                    className="ml-2 p-2 glass rounded-lg border border-[rgba(0,242,255,0.15)] hover:border-[rgba(0,242,255,0.35)] transition-all text-[#64748b] hover:text-[#00f2ff]"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {listings.length === 0 && (
          <section className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-12 text-center">
            <span className="text-4xl block mb-3">🤝</span>
            <p className="text-[#64748b] font-semibold">No P2P listings yet</p>
            <p className="text-sm text-[#64748b] mt-1">Be the first to list this item</p>
          </section>
        )}
      </div>
    </>
  )
}
