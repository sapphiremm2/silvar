import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { boxId } = await req.json()
  if (!boxId) return NextResponse.json({ error: 'Missing boxId' }, { status: 400 })

  // Fetch box
  const { data: box, error: boxErr } = await supabase
    .from('blind_boxes')
    .select('*')
    .eq('id', boxId)
    .eq('is_active', true)
    .single()

  if (boxErr || !box) return NextResponse.json({ error: 'Box not found' }, { status: 404 })

  // Check balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('sapphire_balance')
    .eq('id', user.id)
    .single()

  if ((profile?.sapphire_balance ?? 0) < box.price_sapphires) {
    return NextResponse.json({ error: 'Insufficient sapphires' }, { status: 400 })
  }

  // Weighted random item selection
  const possibleItems = box.possible_items as { item_id: string; weight: number; rarity: string }[]
  const totalWeight = possibleItems.reduce((s, i) => s + i.weight, 0)
  let rand = Math.random() * totalWeight
  let wonItem = possibleItems[0]
  for (const item of possibleItems) {
    rand -= item.weight
    if (rand <= 0) { wonItem = item; break }
  }

  // Atomic: deduct sapphires + add to inventory
  const { error: rpcErr } = await supabase.rpc('open_blind_box', {
    p_user_id: user.id,
    p_box_price: box.price_sapphires,
    p_product_id: wonItem.item_id,
  })

  if (rpcErr) return NextResponse.json({ error: rpcErr.message }, { status: 500 })

  // Fetch won product details
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', wonItem.item_id)
    .single()

  // Log purchase
  await supabase.from('purchases').insert({
    buyer_id: user.id,
    product_id: wonItem.item_id,
    amount_sapphires: box.price_sapphires,
    purchase_type: 'box',
  })

  return NextResponse.json({ item: product, rarity: wonItem.rarity })
}
