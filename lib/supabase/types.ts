// Run `npm run db:types` to auto-generate this file from your Supabase schema.
// This is a stub so TypeScript doesn't complain before you run the command.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          roblox_username: string | null
          bio: string | null
          avatar_url: string | null
          banner_url: string | null
          theme_color: string | null
          twitter_url: string | null
          youtube_url: string | null
          discord_url: string | null
          role: 'user' | 'seller' | 'admin'
          sapphire_balance: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          emoji: string | null
          image_url: string | null
          game: 'MM2' | 'Grow a Garden' | 'Steal a Brainrot' | 'Blade Ball' | 'Multi-Game'
          rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Godly' | null
          price_sapphires: number
          stock: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      blind_boxes: {
        Row: {
          id: string
          name: string
          emoji: string | null
          image_url: string | null
          game: string
          price_sapphires: number
          possible_items: Json
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blind_boxes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['blind_boxes']['Insert']>
      }
      marketplace_listings: {
        Row: {
          id: string
          seller_id: string
          product_id: string | null
          title: string
          description: string | null
          price_sapphires: number
          game: string
          emoji: string | null
          is_active: boolean
          views: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['marketplace_listings']['Row'], 'id' | 'created_at' | 'views'>
        Update: Partial<Database['public']['Tables']['marketplace_listings']['Insert']>
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          listing_id: string | null
          quantity: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          gifted_by: string | null
          gifted_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wishlist_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>
      }
      purchases: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string | null
          product_id: string | null
          listing_id: string | null
          amount_sapphires: number | null
          amount_usd: number | null
          stripe_payment_id: string | null
          purchase_type: 'shop' | 'p2p' | 'box' | 'sapphires'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['purchases']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['purchases']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          seller_id: string
          purchase_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          subject: string | null
          message: string
          status: 'open' | 'in_progress' | 'resolved'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['support_tickets']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>
      }
      creator_applications: {
        Row: {
          id: string
          user_id: string
          platform: string
          channel_url: string
          follower_count: number | null
          content_type: string | null
          status: 'pending' | 'approved' | 'rejected'
          tier: 'starter' | 'influencer' | 'partner' | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['creator_applications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['creator_applications']['Insert']>
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          price_sapphires: number
          sale_date: string
        }
        Insert: Omit<Database['public']['Tables']['price_history']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['price_history']['Insert']>
      }
      inventory_items: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          acquired_via: 'purchase' | 'box' | 'gift' | 'trade' | null
          acquired_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['inventory_items']['Insert']>
      }
    }
    Views: {}
    Functions: {
      open_blind_box: {
        Args: { p_user_id: string; p_box_price: number; p_product_id: string }
        Returns: void
      }
    }
    Enums: {}
  }
}
