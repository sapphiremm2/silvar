# silvar.gg

> Roblox item marketplace — Next.js 14 · Supabase · Stripe · Vercel

## 🚀 Quick Start (in Cursor)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local` and fill in your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://emkquizktyzkwfhvqvvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_rotated_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Never commit `.env.local` to git — it's already in `.gitignore`

### 3. Set up Supabase database
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project → **SQL Editor**
3. Paste and run the entire contents of `supabase/migrations/001_initial.sql`
4. Go to **Authentication → Providers** → Enable **Discord** (and/or Google)
5. Set redirect URL: `https://your-domain.com/api/auth/callback`

### 4. Generate TypeScript types (optional but recommended)
```bash
npm run db:types
```

### 5. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Getting your Supabase keys (after rotating)

1. Supabase Dashboard → Settings → API
2. Copy **Project URL** and **anon (public)** key → `.env.local`
3. Copy **service_role** key → `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`
   > ⚠️ Service role key bypasses RLS — server-only, never expose to client

## 💳 Stripe setup

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
2. Copy publishable + secret keys → `.env.local`
3. Set up webhook:
   - Dashboard → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

For local testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 📁 Project Structure

```
app/
├── page.tsx                # Home
├── shop/                   # Shop + P2P tabs
├── blind-boxes/            # Box opening
├── cart/                   # Cart + checkout + sapphire reload
├── creator/                # Creator program
├── marketplace/            # P2P browse + item detail
├── seller/
│   ├── [username]/         # Public seller profile
│   └── dashboard/          # Private seller dashboard
├── admin/                  # Admin panel (role-gated)
├── wishlist/               # Wishlist (?user=id)
└── api/
    ├── auth/callback/      # Supabase OAuth
    ├── boxes/open/         # Box opening logic
    ├── stripe/checkout/    # Stripe checkout session
    ├── stripe/webhook/     # Stripe webhook handler
    └── sapphires/reload/   # Sapphire purchase

components/
├── layout/   Navbar, Footer
├── ui/       ParticleBackground, RarityBadge
├── shop/     ProductCard, CartPanel, ShopClient
├── boxes/    BoxCard, BlindBoxesClient
├── home/     HeroSection, HomeWidgets
└── support/  SupportChat

lib/
├── supabase/  client.ts, server.ts, types.ts
├── stripe/    client.ts (+ SAPPHIRE_PACKAGES)
└── utils/     sapphires.ts, rarity.ts, cn.ts

stores/
└── cartStore.ts  (Zustand + localStorage persist)
```

---

## 💎 Currency System

- **1 USD = 50 Sapphires**
- All `price_sapphires` values in DB
- Stripe charges are calculated as: `sapphires / 50 * 100` cents
- Helper: `lib/utils/sapphires.ts`

## 🎁 Blind Box Flow

1. User clicks box → 5-click confirmation
2. `POST /api/boxes/open` with `{ boxId }`
3. Server validates balance, runs weighted RNG on `possible_items` JSON
4. `open_blind_box()` RPC atomically deducts sapphires + creates inventory item
5. Client shows shake animation → reveal

## 🔐 Admin Access

Set a user's role to `admin` directly in Supabase:
```sql
update public.profiles set role = 'admin' where username = 'your-username';
```

---

## 🚢 Deploying to Vercel

```bash
git init && git add . && git commit -m "init"
# Push to GitHub, then import in vercel.com
```

Add all env vars in **Vercel → Project → Settings → Environment Variables**
Change `NEXT_PUBLIC_APP_URL` to your production URL before deploying.

---

## 📋 What still needs building

These pages have the server data fetching scaffolded but need client UI:

- [ ] `app/wishlist/page.tsx` — wishlist UI + gifting
- [ ] `app/marketplace/page.tsx` — P2P browse
- [ ] `app/marketplace/[itemId]/page.tsx` — price chart (recharts), listings
- [ ] `app/seller/[username]/page.tsx` — seller profile
- [ ] `app/seller/dashboard/page.tsx` — listings mgmt, sales history
- [ ] `app/admin/products/page.tsx` — CRUD table
- [ ] `app/admin/creator-apps/page.tsx` — approve/reject flow
- [ ] `app/admin/users/page.tsx` — user list

All patterns are already established — just follow the same glass card + Framer Motion approach used in the existing pages.
