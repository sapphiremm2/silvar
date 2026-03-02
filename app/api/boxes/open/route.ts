import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { boxId } = await req.json()
  if (!boxId) return NextResponse.json({ error: 'Missing boxId' }, { status: 400 })

  const { data: box } = await supabase
    .from('blind_boxes')
    .select('*')
    .eq('id', boxId)
    .eq('is_active', true)
    .single()

  if (!box) return NextResponse.json({ error: 'Box not found' }, { status: 404 })

  const boxData = box as any

  const { data: profile } = await supabase
    .from('profiles')
    .select('sapphire_balance')
    .eq('id', user.id)
    .single()

  const profileData = profile as any
  const balance = profileData?.sapphire_balance ?? 0

  if (balance < boxData.price_sapphires) {
    return NextResponse.json({ error: 'Insufficient sapphires' }, { status: 400 })
  }

  const possibleItems = boxData.possible_items as { item_id: string; weight: number; rarity: string }[]
  const totalWeight = possibleItems.reduce((s: number, i: any) => s + i.weight, 0)
  let rand = Math.random() * totalWeight
  let wonItem = possibleItems[0]
  for (const item of possibleItems) {
    rand -= item.weight
    if (rand <= 0) { wonItem = item; break }
  }

  await (supabase as any).rpc('open_blind_box', {
    p_user_id: user.id,
    p_box_price: boxData.price_sapphires,
    p_product_id: wonItem.item_id,
  })

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', wonItem.item_id)
    .single()

  await (supabase as any).from('purchases').insert({
    buyer_id: user.id,
    product_id: wonItem.item_id,
    amount_sapphires: boxData.price_sapphires,
    purchase_type: 'box',
  })

  return NextResponse.json({ item: product, rarity: wonItem.rarity })
}
