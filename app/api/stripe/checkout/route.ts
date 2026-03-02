import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sapphiresToCents } from '@/lib/utils/sapphires'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items, promoCode } = await req.json()
  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item: { name: string; emoji: string; priceSapphires: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.emoji} ${item.name}`,
          description: `silvar.gg item`,
        },
        unit_amount: sapphiresToCents(item.priceSapphires),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${origin}/cart?success=true`,
    cancel_url: `${origin}/cart`,
    metadata: {
      userId: user.id,
      items: JSON.stringify(items.map((i: any) => ({ id: i.id, quantity: i.quantity }))),
      purchaseType: 'shop',
    },
    ...(promoCode && { discounts: [] }),
  })

  return NextResponse.json({ url: session.url })
}
