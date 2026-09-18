import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './utils/supabase';

// Landing
import { Welcome } from './pages/Welcome';
import { Services } from './pages/Services';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Customer Pages
import { Dashboard } from './pages/customer/Dashboard';
import { BookService } from './pages/customer/BookService';
import { BookingConfirmation } from './pages/customer/BookingConfirmation';
import { MyBookings } from './pages/customer/MyBookings';
import { BookingDetail } from './pages/customer/BookingDetail';
import { CustomerCalendar } from './pages/customer/Calendar';
import { Vehicles } from './pages/customer/Vehicles';
import { Notifications } from './pages/customer/Notifications';
import { Support } from './pages/customer/Support';
import { Account } from './pages/customer/Account';

// Manager Pages
import { ManagerOverview } from './pages/manager/Overview';
import { BookingRequests } from './pages/manager/BookingRequests';
import { ManagerCalendar } from './pages/manager/Calendar';
import { Customers } from './pages/manager/Customers';
import { Services as ManagerServices } from './pages/manager/Services';
import { Reports } from './pages/manager/Reports';
import { ManagerSettings } from './pages/manager/Settings';

import { NotFound } from './pages/NotFound';

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'customer' | 'manager';
}> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)', flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <Droplets size={24} color="white" />
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 500 }}>
          Loading ShineWash...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

// Root redirect based on role
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/welcome" replace />;
  return <Navigate to={user.role === 'manager' ? '/manager' : '/dashboard'} replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public landing */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/services" element={<Services />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ============== CUSTOMER ROUTES ============== */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="customer"><Dashboard /></ProtectedRoute>
      } />
      <Route path="/book" element={
        <ProtectedRoute requiredRole="customer"><BookService /></ProtectedRoute>
      } />
      <Route path="/booking-confirmation" element={
        <ProtectedRoute requiredRole="customer"><BookingConfirmation /></ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute requiredRole="customer"><MyBookings /></ProtectedRoute>
      } />
      <Route path="/bookings/:id" element={
        <ProtectedRoute requiredRole="customer"><BookingDetail /></ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute requiredRole="customer"><CustomerCalendar /></ProtectedRoute>
      } />
      <Route path="/vehicles" element={
        <ProtectedRoute requiredRole="customer"><Vehicles /></ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute requiredRole="customer"><Notifications /></ProtectedRoute>
      } />
      <Route path="/support" element={
        <ProtectedRoute requiredRole="customer"><Support /></ProtectedRoute>
      } />
      <Route path="/account" element={
        <ProtectedRoute requiredRole="customer"><Account /></ProtectedRoute>
      } />

      {/* ============== MANAGER ROUTES ============== */}
      <Route path="/manager" element={
        <ProtectedRoute requiredRole="manager"><ManagerOverview /></ProtectedRoute>
      } />
      <Route path="/manager/requests" element={
        <ProtectedRoute requiredRole="manager"><BookingRequests /></ProtectedRoute>
      } />
      <Route path="/manager/calendar" element={
        <ProtectedRoute requiredRole="manager"><ManagerCalendar /></ProtectedRoute>
      } />
      <Route path="/manager/customers" element={
        <ProtectedRoute requiredRole="manager"><Customers /></ProtectedRoute>
      } />
      <Route path="/manager/services" element={
        <ProtectedRoute requiredRole="manager"><ManagerServices /></ProtectedRoute>
      } />
      <Route path="/manager/reports" element={
        <ProtectedRoute requiredRole="manager"><Reports /></ProtectedRoute>
      } />
      <Route path="/manager/settings" element={
        <ProtectedRoute requiredRole="manager"><ManagerSettings /></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
