export type Json = any

export interface Database {
  public: {
    Tables: {
      profiles: { Row: any; Insert: any; Update: any }
      products: { Row: any; Insert: any; Update: any }
      blind_boxes: { Row: any; Insert: any; Update: any }
      marketplace_listings: { Row: any; Insert: any; Update: any }
      cart_items: { Row: any; Insert: any; Update: any }
      wishlist_items: { Row: any; Insert: any; Update: any }
      purchases: { Row: any; Insert: any; Update: any }
      reviews: { Row: any; Insert: any; Update: any }
      messages: { Row: any; Insert: any; Update: any }
      support_tickets: { Row: any; Insert: any; Update: any }
      creator_applications: { Row: any; Insert: any; Update: any }
      price_history: { Row: any; Insert: any; Update: any }
      inventory_items: { Row: any; Insert: any; Update: any }
    }
    Views: Record<string, never>
    Functions: {
      open_blind_box: {
        Args: { p_user_id: string; p_box_price: number; p_product_id: string }
        Returns: void
      }
      add_sapphires: {
        Args: { p_user_id: string; p_amount: number }
        Returns: void
      }
    }
    Enums: Record<string, never>
  }
}
