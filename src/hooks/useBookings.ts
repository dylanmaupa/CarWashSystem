import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Booking, BookingStatus } from '../types';

// ---- MOCK DATA ----
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    customer_id: 'customer-1',
    service_id: 'svc-1',
    vehicle_make: 'Toyota',
    vehicle_model: 'Fortuner',
    vehicle_type: 'suv',
    vehicle_colour: 'White',
    vehicle_registration: 'ABC 1234',
    vehicle_year: 2022,
    vehicle_notes: null,
    requested_date: '2026-09-18',
    requested_time: '09:00 AM',
    duration_minutes: 45,
    status: 'pending',
    manager_notes: null,
    decline_reason: null,
    location: 'ShineWash Main Branch',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    service: {
      id: 'svc-1', name: 'Standard Car Wash', description: 'Full exterior wash',
      category: 'wash', duration_minutes: 45, price_info: 'From R150', is_active: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'bk-002',
    customer_id: 'customer-1',
    service_id: 'svc-4',
    vehicle_make: 'BMW',
    vehicle_model: '3 Series',
    vehicle_type: 'sedan',
    vehicle_colour: 'Black',
    vehicle_registration: 'XYZ 5678',
    vehicle_year: 2021,
    vehicle_notes: 'Focus on interior leather conditioning',
    requested_date: '2026-09-20',
    requested_time: '10:00 AM',
    duration_minutes: 240,
    status: 'approved',
    manager_notes: null,
    decline_reason: null,
    location: 'ShineWash Main Branch',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 82800000).toISOString(),
    service: {
      id: 'svc-4', name: 'Full Detail Package', description: 'Interior + exterior',
      category: 'detailing', duration_minutes: 240, price_info: 'From R900', is_active: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'bk-003',
    customer_id: 'customer-1',
    service_id: 'svc-2',
    vehicle_make: 'Ford',
    vehicle_model: 'Ranger',
    vehicle_type: 'pickup',
    vehicle_colour: 'Silver',
    vehicle_registration: 'DEF 9012',
    vehicle_year: 2020,
    vehicle_notes: null,
    requested_date: '2026-09-10',
    requested_time: '02:00 PM',
    duration_minutes: 45,
    status: 'completed',
    manager_notes: null,
    decline_reason: null,
    location: 'ShineWash Main Branch',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    service: {
      id: 'svc-2', name: 'Premium Car Wash', description: 'Exterior + vacuum',
      category: 'wash', duration_minutes: 45, price_info: 'From R250', is_active: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'bk-004',
    customer_id: 'customer-2',
    service_id: 'svc-1',
    vehicle_make: 'Honda',
    vehicle_model: 'Civic',
    vehicle_type: 'sedan',
    vehicle_colour: 'Gray',
    vehicle_registration: 'GHI 3456',
    vehicle_year: 2023,
    vehicle_notes: null,
    requested_date: '2026-09-18',
    requested_time: '11:00 AM',
    duration_minutes: 30,
    status: 'pending',
    manager_notes: null,
    decline_reason: null,
    location: 'ShineWash Main Branch',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    customer: {
      id: 'customer-2', first_name: 'Sarah', last_name: 'Johnson',
      email: 'sarah.j@email.com', phone: '(555) 234-5678',
      role: 'customer', avatar_url: null, created_at: new Date().toISOString(),
    },
    service: {
      id: 'svc-1', name: 'Standard Car Wash', description: '',
      category: 'wash', duration_minutes: 30, price_info: 'From R150', is_active: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'bk-005',
    customer_id: 'customer-3',
    service_id: 'svc-4',
    vehicle_make: 'Tesla',
    vehicle_model: 'Model 3',
    vehicle_type: 'sedan',
    vehicle_colour: 'Blue',
    vehicle_registration: 'JKL 7890',
    vehicle_year: 2024,
    vehicle_notes: 'Electric vehicle — no engine degreasing',
    requested_date: '2026-09-18',
    requested_time: '09:00 AM',
    duration_minutes: 240,
    status: 'pending',
    manager_notes: null,
    decline_reason: null,
    location: 'ShineWash Main Branch',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    customer: {
      id: 'customer-3', first_name: 'David', last_name: 'Lee',
      email: 'david.lee@email.com', phone: '(555) 345-6789',
      role: 'customer', avatar_url: null, created_at: new Date().toISOString(),
    },
    service: {
      id: 'svc-4', name: 'Full Detail Package', description: '',
      category: 'detailing', duration_minutes: 240, price_info: 'From R900', is_active: true,
      created_at: new Date().toISOString(),
    },
  },
];

export const useMockBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const getCustomerBookings = (customerId: string) =>
    bookings.filter(b => b.customer_id === customerId);

  const getAllBookings = () => bookings;

  const getPendingBookings = () =>
    bookings.filter(b => b.status === 'pending');

  const createBooking = (data: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    const newBooking: Booking = {
      ...data,
      id: `bk-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (
    bookingId: string,
    status: BookingStatus,
    extras?: { manager_notes?: string; decline_reason?: string }
  ) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? { ...b, status, ...extras, updated_at: new Date().toISOString() }
          : b
      )
    );
  };

  const checkConflict = (date: string, time: string, excludeId?: string): boolean => {
    return bookings
      .filter(b => b.id !== excludeId && b.status === 'approved')
      .some(b => b.requested_date === date && b.requested_time === time);
  };

  return {
    bookings,
    getCustomerBookings,
    getAllBookings,
    getPendingBookings,
    createBooking,
    updateBookingStatus,
    checkConflict,
  };
};

// Supabase-backed hook (used when Supabase is configured)
export const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('bookings')
          .select('*, service:services(*), customer:profiles!bookings_customer_id_fkey(*)')
          .eq('customer_id', userId)
          .order('created_at', { ascending: false });
        if (data) setBookings(data as Booking[]);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return { bookings, loading };
};
