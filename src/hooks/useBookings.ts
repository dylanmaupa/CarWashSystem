import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Booking, BookingStatus } from '../types';
import { useAuth } from '../context/AuthContext';

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select('*, service:services(*), customer:profiles!bookings_customer_id_fkey(*)');

      if (user.role === 'customer') {
        query = query.eq('customer_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBookings(data as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();

    // Set up realtime subscription
    const subscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        loadBookings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getCustomerBookings = (customerId: string) =>
    bookings.filter(b => b.customer_id === customerId);

  const getAllBookings = () => bookings;

  const getPendingBookings = () =>
    bookings.filter(b => b.status === 'pending');

  const createBooking = async (data: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'service' | 'customer'>) => {
    try {
      const { data: newBooking, error } = await supabase
        .from('bookings')
        .insert([data])
        .select('*, service:services(*), customer:profiles!bookings_customer_id_fkey(*)')
        .single();
        
      if (error) throw error;
      
      // Update local state optimistically
      if (newBooking) {
        setBookings(prev => [newBooking as Booking, ...prev]);
        return newBooking as Booking;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
    extras?: { manager_notes?: string; decline_reason?: string }
  ) => {
    try {
      const updates = { status, ...extras, updated_at: new Date().toISOString() };
      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Optimistic update
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId
            ? { ...b, ...updates }
            : b
        )
      );
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const checkConflict = (date: string, time: string, excludeId?: string): boolean => {
    return bookings
      .filter(b => b.id !== excludeId && b.status === 'approved')
      .some(b => b.requested_date === date && b.requested_time === time);
  };

  return {
    bookings,
    loading,
    getCustomerBookings,
    getAllBookings,
    getPendingBookings,
    createBooking,
    updateBookingStatus,
    checkConflict,
  };
};
