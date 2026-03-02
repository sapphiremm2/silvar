import { stripe } from '@/lib/stripe/client'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

// Use service role for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, items, purchaseType } = session.metadata ?? {}

    if (!userId) return NextResponse.json({ error: 'No userId in metadata' }, { status: 400 })

    if (purchaseType === 'sapphires') {
      // Add sapphires to user balance
      const sapphires = parseInt(session.metadata?.sapphires ?? '0')
      await supabaseAdmin.rpc('add_sapphires', { p_user_id: userId, p_amount: sapphires })

      await supabaseAdmin.from('purchases').insert({
        buyer_id: userId,
        amount_usd: (session.amount_total ?? 0) / 100,
        amount_sapphires: sapphires,
        stripe_payment_id: session.id,
        purchase_type: 'sapphires',
      })
    } else if (purchaseType === 'shop' && items) {
      // Add items to inventory
      const parsedItems: { id: string; quantity: number }[] = JSON.parse(items)
      for (const item of parsedItems) {
        for (let q = 0; q < item.quantity; q++) {
          await supabaseAdmin.from('inventory_items').insert({
            user_id: userId,
            product_id: item.id,
            acquired_via: 'purchase',
          })
        }
        await supabaseAdmin.from('purchases').insert({
          buyer_id: userId,
          product_id: item.id,
          stripe_payment_id: session.id,
          purchase_type: 'shop',
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
