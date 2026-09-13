// ===== SHARED TYPES =====

export type UserRole = 'customer' | 'manager';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface SavedVehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  vehicle_type: VehicleType;
  colour: string;
  registration_number: string;
  year: number | null;
  notes: string | null;
  is_default: boolean;
  created_at: string;
}

export type VehicleType = 'sedan' | 'suv' | 'hatchback' | 'pickup' | 'van' | 'other';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'wash' | 'detailing';
  duration_minutes: number;
  price_info: string | null;
  is_active: boolean;
  created_at: string;
}

export type BookingStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_type: VehicleType;
  vehicle_colour: string;
  vehicle_registration: string;
  vehicle_year: number | null;
  vehicle_notes: string | null;
  requested_date: string;
  requested_time: string;
  duration_minutes: number;
  status: BookingStatus;
  manager_notes: string | null;
  decline_reason: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: UserProfile;
  service?: Service;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  booking_id: string | null;
  created_at: string;
}

export type NotificationType =
  | 'booking_submitted'
  | 'booking_approved'
  | 'booking_declined'
  | 'booking_cancelled'
  | 'booking_rescheduled'
  | 'appointment_reminder'
  | 'service_completed'
  | 'promotion'
  | 'system';

export interface BookingFormData {
  service_id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_type: VehicleType;
  vehicle_colour: string;
  vehicle_registration: string;
  vehicle_year: string;
  vehicle_notes: string;
  requested_date: string;
  requested_time: string;
  special_instructions: string;
  save_vehicle: boolean;
}

export interface DeclineReason {
  value: string;
  label: string;
}

export const DECLINE_REASONS: DeclineReason[] = [
  { value: 'slot_unavailable', label: 'Time slot unavailable' },
  { value: 'fully_booked', label: 'Fully booked on that day' },
  { value: 'service_unavailable', label: 'Service temporarily unavailable' },
  { value: 'operational_issue', label: 'Operational issue' },
  { value: 'other', label: 'Other reason' },
];

export const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'van', label: 'Van' },
  { value: 'other', label: 'Other' },
];

export const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '12:00 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM',
];

export const MOCK_SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'Standard Car Wash',
    description: 'Full exterior wash with rinse, soap, and dry.',
    category: 'wash',
    duration_minutes: 30,
    price_info: 'From R150',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'svc-2',
    name: 'Premium Car Wash',
    description: 'Exterior wash + wheel clean, tyre shine, and interior vacuum.',
    category: 'wash',
    duration_minutes: 45,
    price_info: 'From R250',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'svc-3',
    name: 'Interior Detailing',
    description: 'Deep interior clean: vacuum, wipe-down, glass, and odour treatment.',
    category: 'detailing',
    duration_minutes: 120,
    price_info: 'From R400',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'svc-4',
    name: 'Full Detail Package',
    description: 'Complete interior + exterior detail. Paint decontamination, clay bar, polish.',
    category: 'detailing',
    duration_minutes: 240,
    price_info: 'From R900',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];
