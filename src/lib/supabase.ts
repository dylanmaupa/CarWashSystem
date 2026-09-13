import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          role: 'customer' | 'manager';
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      saved_vehicles: {
        Row: {
          id: string;
          user_id: string;
          make: string;
          model: string;
          vehicle_type: string;
          colour: string;
          registration_number: string;
          year: number | null;
          notes: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_vehicles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['saved_vehicles']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: 'wash' | 'detailing';
          duration_minutes: number;
          price_info: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          service_id: string;
          vehicle_make: string;
          vehicle_model: string;
          vehicle_type: string;
          vehicle_colour: string;
          vehicle_registration: string;
          vehicle_year: number | null;
          vehicle_notes: string | null;
          requested_date: string;
          requested_time: string;
          duration_minutes: number;
          status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed';
          manager_notes: string | null;
          decline_reason: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          booking_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
  };
};
