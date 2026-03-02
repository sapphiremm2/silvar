import { stripe, SAPPHIRE_PACKAGES } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { packageId } = await req.json()
  const pkg = SAPPHIRE_PACKAGES.find((p) => p.id === packageId)
  if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 })

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `💎 ${pkg.sapphires.toLocaleString()} Sapphires`,
          description: pkg.bonus ? `Includes ${pkg.bonus}!` : 'silvar.gg in-app currency',
        },
        unit_amount: pkg.usd * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${origin}/?sapphires=success`,
    cancel_url: `${origin}/cart`,
    metadata: {
      userId: user.id,
      sapphires: pkg.sapphires.toString(),
      purchaseType: 'sapphires',
    },
  })

  return NextResponse.json({ url: session.url })
}
