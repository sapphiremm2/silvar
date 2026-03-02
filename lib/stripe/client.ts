import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const SAPPHIRE_PACKAGES = [
  { id: 'pkg_500',  sapphires: 500,  usd: 10,  label: 'Starter Pack',  bonus: null },
  { id: 'pkg_1250', sapphires: 1250, usd: 25,  label: 'Popular',       bonus: '+50 bonus' },
  { id: 'pkg_2750', sapphires: 2750, usd: 50,  label: 'Value Pack',    bonus: '+250 bonus' },
  { id: 'pkg_6000', sapphires: 6000, usd: 100, label: 'Mega Pack',     bonus: '+1000 bonus' },
] as const
