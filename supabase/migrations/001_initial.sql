-- ============================================================
-- silvar.gg — Full Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  roblox_username text,
  bio text,
  avatar_url text,
  banner_url text,
  theme_color text default '#00f2ff',
  twitter_url text,
  youtube_url text,
  discord_url text,
  role text default 'user' check (role in ('user', 'seller', 'admin')),
  sapphire_balance integer default 0 check (sapphire_balance >= 0),
  created_at timestamptz default now()
);

-- ─── PRODUCTS ────────────────────────────────────────────────
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  emoji text,
  image_url text,
  game text not null check (game in ('MM2', 'Grow a Garden', 'Steal a Brainrot', 'Blade Ball', 'Multi-Game')),
  rarity text check (rarity in ('Common', 'Rare', 'Epic', 'Legendary', 'Godly')),
  price_sapphires integer not null check (price_sapphires > 0),
  stock integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ─── BLIND BOXES ─────────────────────────────────────────────
create table public.blind_boxes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  emoji text,
  image_url text,
  game text not null,
  price_sapphires integer not null check (price_sapphires > 0),
  possible_items jsonb not null default '[]',
  -- Format: [{"item_id": "uuid", "weight": 10, "rarity": "Rare"}, ...]
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ─── MARKETPLACE LISTINGS ────────────────────────────────────
create table public.marketplace_listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles not null,
  product_id uuid references public.products,
  title text not null,
  description text,
  price_sapphires integer not null check (price_sapphires > 0),
  game text not null,
  emoji text,
  is_active boolean default true,
  views integer default 0,
  created_at timestamptz default now()
);

-- ─── INVENTORY ITEMS ─────────────────────────────────────────
create table public.inventory_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  product_id uuid references public.products,
  acquired_via text check (acquired_via in ('purchase', 'box', 'gift', 'trade')),
  acquired_at timestamptz default now()
);

-- ─── CART ITEMS ──────────────────────────────────────────────
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  product_id uuid references public.products,
  listing_id uuid references public.marketplace_listings,
  quantity integer default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ─── WISHLIST ITEMS ──────────────────────────────────────────
create table public.wishlist_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  product_id uuid references public.products not null,
  gifted_by uuid references public.profiles,
  gifted_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ─── PURCHASES ───────────────────────────────────────────────
create table public.purchases (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles not null,
  seller_id uuid references public.profiles,
  product_id uuid references public.products,
  listing_id uuid references public.marketplace_listings,
  amount_sapphires integer,
  amount_usd numeric(10,2),
  stripe_payment_id text,
  purchase_type text check (purchase_type in ('shop', 'p2p', 'box', 'sapphires')),
  created_at timestamptz default now()
);

-- ─── REVIEWS ─────────────────────────────────────────────────
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references public.profiles not null,
  seller_id uuid references public.profiles not null,
  purchase_id uuid references public.purchases,
  rating integer check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz default now()
);

-- ─── MESSAGES ────────────────────────────────────────────────
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles not null,
  recipient_id uuid references public.profiles not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ─── SUPPORT TICKETS ─────────────────────────────────────────
create table public.support_tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles,
  email text,
  subject text,
  message text not null,
  status text default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz default now()
);

-- ─── CREATOR APPLICATIONS ────────────────────────────────────
create table public.creator_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  platform text not null,
  channel_url text not null,
  follower_count integer,
  content_type text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  tier text check (tier in ('starter', 'influencer', 'partner')),
  reviewed_by uuid references public.profiles,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- ─── PRICE HISTORY ───────────────────────────────────────────
create table public.price_history (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products not null,
  price_sapphires integer not null,
  sale_date timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.inventory_items enable row level security;
alter table public.messages enable row level security;
alter table public.purchases enable row level security;
alter table public.marketplace_listings enable row level security;
alter table public.reviews enable row level security;
alter table public.support_tickets enable row level security;
alter table public.creator_applications enable row level security;

-- Profiles
create policy "Profiles are public" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Cart items
create policy "Cart is private" on public.cart_items for all using (auth.uid() = user_id);

-- Wishlist
create policy "Wishlist is public" on public.wishlist_items for select using (true);
create policy "Wishlist managed by owner" on public.wishlist_items for insert using (auth.uid() = user_id);
create policy "Wishlist delete by owner" on public.wishlist_items for delete using (auth.uid() = user_id);

-- Inventory
create policy "Inventory is private" on public.inventory_items for select using (auth.uid() = user_id);

-- Messages
create policy "Messages to/from self" on public.messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Send messages" on public.messages for insert with check (auth.uid() = sender_id);

-- Purchases
create policy "View own purchases" on public.purchases for select using (auth.uid() = buyer_id);

-- Marketplace listings
create policy "Listings are public" on public.marketplace_listings for select using (true);
create policy "Sellers manage own listings" on public.marketplace_listings for all using (auth.uid() = seller_id);

-- Reviews
create policy "Reviews are public" on public.reviews for select using (true);
create policy "Reviewers manage own reviews" on public.reviews for insert with check (auth.uid() = reviewer_id);

-- Support tickets
create policy "Users see own tickets" on public.support_tickets for select using (auth.uid() = user_id);
create policy "Anyone can create tickets" on public.support_tickets for insert with check (true);

-- Creator applications
create policy "Users see own applications" on public.creator_applications for select using (auth.uid() = user_id);
create policy "Users submit applications" on public.creator_applications for insert with check (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'preferred_username', split_part(new.email, '@', 1), new.id::text),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic box opening (deduct sapphires + add item in one transaction)
create or replace function open_blind_box(
  p_user_id uuid,
  p_box_price integer,
  p_product_id uuid
) returns void as $$
begin
  update public.profiles
  set sapphire_balance = sapphire_balance - p_box_price
  where id = p_user_id and sapphire_balance >= p_box_price;

  if not found then
    raise exception 'Insufficient sapphires';
  end if;

  insert into public.inventory_items (user_id, product_id, acquired_via)
  values (p_user_id, p_product_id, 'box');
end;
$$ language plpgsql security definer;

-- Add sapphires (called by Stripe webhook via service role)
create or replace function add_sapphires(
  p_user_id uuid,
  p_amount integer
) returns void as $$
begin
  update public.profiles
  set sapphire_balance = sapphire_balance + p_amount
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- ============================================================
-- SEED DATA (optional — remove for production)
-- ============================================================

insert into public.products (name, emoji, game, rarity, price_sapphires, stock, is_active) values
  ('Godly Blade', '🗡️', 'MM2', 'Godly', 2500, 12, true),
  ('Unicorn Pet', '🦄', 'MM2', 'Legendary', 4500, 3, true),
  ('Mystic Orb', '🔮', 'MM2', 'Legendary', 3200, 5, true),
  ('Rainbow Rose', '🌸', 'Grow a Garden', 'Epic', 1200, 8, true),
  ('Venus Trap', '🌿', 'Grow a Garden', 'Rare', 500, 20, true),
  ('Thunder Blade', '⚡', 'Blade Ball', 'Rare', 850, 15, true),
  ('Blast Ball', '💥', 'Blade Ball', 'Rare', 420, 25, true),
  ('Ultra Brainrot', '🧠', 'Steal a Brainrot', 'Rare', 650, 10, true);
