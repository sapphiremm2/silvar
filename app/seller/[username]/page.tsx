import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { formatSapphires, sapphiresToUSD } from '@/lib/utils/sapphires'
import { Twitter, Youtube, MessageCircle, Calendar, Package } from 'lucide-react'

export async function generateMetadata({ params }: { params: { username: string } }) {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('display_name, username')
    .eq('username', params.username)
    .single()
  const row = data as any
  const name = row ? (row.display_name ?? row.username ?? params.username) : params.username
  return { title: `${name} — silvar.gg` }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'text-yellow-400' : 'text-[#334155]'}>
          ★
        </span>
      ))}
    </span>
  )
}

export default async function SellerProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient()

  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  const profile = rawProfile as any
  if (!profile) notFound()

  const [{ data: rawListings }, { data: rawReviews }] = await Promise.all([
    supabase
      .from('marketplace_listings')
      .select('*')
      .eq('seller_id', profile.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('*, profiles!reviewer_id(username, display_name, avatar_url)')
      .eq('seller_id', profile.id)
      .order('created_at', { ascending: false }),
  ])

  const listings = (rawListings ?? []) as any[]
  const reviews = (rawReviews ?? []) as any[]

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : null

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const themeColor = profile.theme_color ?? '#00f2ff'

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10">
        {/* Banner */}
        <div
          className="h-48 w-full"
          style={{
            background: profile.banner_url
              ? `url(${profile.banner_url}) center/cover no-repeat`
              : `linear-gradient(135deg, ${themeColor}22, #020617 80%)`,
            borderBottom: `1px solid ${themeColor}33`,
          }}
        />

        <div className="max-w-6xl mx-auto px-6">
          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-8 relative z-10">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-3xl font-black shrink-0 overflow-hidden"
              style={{ borderColor: themeColor, background: '#0a1628' }}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name ?? profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span style={{ color: themeColor }}>
                  {(profile.display_name ?? profile.username ?? '?')[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Name & info */}
            <div className="flex-1">
              <h1 className="text-2xl font-black text-[#e2e8f0]">
                {profile.display_name ?? profile.username}
              </h1>
              <p className="text-[#64748b] text-sm">@{profile.username}</p>
              {profile.roblox_username && (
                <p className="text-xs text-[#64748b] mt-0.5">
                  🎮 Roblox: <span className="text-[#e2e8f0]">{profile.roblox_username}</span>
                </p>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass rounded-lg border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.35)] text-[#64748b] hover:text-[#00f2ff] transition-all"
                >
                  <Twitter size={16} />
                </a>
              )}
              {profile.youtube_url && (
                <a
                  href={profile.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass rounded-lg border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.35)] text-[#64748b] hover:text-red-400 transition-all"
                >
                  <Youtube size={16} />
                </a>
              )}
              {profile.discord_url && (
                <a
                  href={profile.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass rounded-lg border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.35)] text-[#64748b] hover:text-[#5865F2] transition-all"
                >
                  <MessageCircle size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-[#94a3b8] text-sm mb-6 max-w-2xl leading-relaxed">{profile.bio}</p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="glass rounded-xl border border-[rgba(0,242,255,0.1)] px-5 py-3 flex items-center gap-2">
              <Package size={15} className="text-[#64748b]" />
              <div>
                <p className="text-lg font-black" style={{ color: themeColor }}>
                  {listings.length}
                </p>
                <p className="text-xs text-[#64748b]">Active Listings</p>
              </div>
            </div>
            <div className="glass rounded-xl border border-[rgba(0,242,255,0.1)] px-5 py-3 flex items-center gap-2">
              <span className="text-yellow-400 text-lg">★</span>
              <div>
                <p className="text-lg font-black text-yellow-400">
                  {avgRating !== null ? avgRating.toFixed(1) : '—'}
                </p>
                <p className="text-xs text-[#64748b]">{reviews.length} Reviews</p>
              </div>
            </div>
            <div className="glass rounded-xl border border-[rgba(0,242,255,0.1)] px-5 py-3 flex items-center gap-2">
              <Calendar size={15} className="text-[#64748b]" />
              <div>
                <p className="text-sm font-bold text-[#e2e8f0]">{memberSince}</p>
                <p className="text-xs text-[#64748b]">Member since</p>
              </div>
            </div>
          </div>

          {/* Active Listings */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#e2e8f0] mb-5">
              Active <span className="gradient-cyan">Listings</span>
            </h2>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing: any) => (
                  <div
                    key={listing.id}
                    className="glass rounded-xl border border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.25)] p-4 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,242,255,0.07)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{listing.emoji ?? '🎮'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#e2e8f0] truncate">{listing.title}</p>
                        <p className="text-xs text-[#64748b]">{listing.game}</p>
                        {listing.description && (
                          <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
                            {listing.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[rgba(0,242,255,0.08)] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#00f2ff] text-sm">
                          💎 {formatSapphires(listing.price_sapphires)}
                        </p>
                        <p className="text-xs text-[#64748b]">≈ ${sapphiresToUSD(listing.price_sapphires)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-10 text-center">
                <span className="text-4xl block mb-3">📋</span>
                <p className="text-[#64748b]">No active listings</p>
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-[#e2e8f0] mb-5">
              Reviews
              {reviews.length > 0 && (
                <span className="ml-2 text-sm text-[#64748b] font-normal">({reviews.length})</span>
              )}
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="glass rounded-xl border border-[rgba(0,242,255,0.1)] p-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#0a1628] border border-[rgba(0,242,255,0.15)] flex items-center justify-center text-xs font-bold text-[#00f2ff]">
                        {(
                          review.profiles?.display_name ??
                          review.profiles?.username ??
                          '?'
                        )[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#e2e8f0]">
                          {review.profiles?.display_name ?? review.profiles?.username ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-[#94a3b8] leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-10 text-center">
                <span className="text-4xl block mb-3">⭐</span>
                <p className="text-[#64748b]">No reviews yet</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
