import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isManager: boolean;
  isCustomer: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ---- MOCK USERS (for demo without Supabase configured) ----
const MOCK_USERS: UserProfile[] = [
  {
    id: 'customer-1',
    first_name: 'Alex',
    last_name: 'Carter',
    email: 'alex.carter@email.com',
    phone: '(555) 123-4567',
    role: 'customer',
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'manager-1',
    first_name: 'Mike',
    last_name: 'Chen',
    email: 'mike.chen@shinewash.com',
    phone: '(555) 987-6543',
    role: 'manager',
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('shinewash_demo_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setUser(data as UserProfile);
  };

  useEffect(() => {
    setLoading(false);

    // Also try Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    }).catch(() => { /* Supabase not configured — use demo mode */ });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id);
      else if (!localStorage.getItem('shinewash_demo_user')) setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);



  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    // Demo mode login
    const demo = MOCK_USERS.find(u => u.email === email);
    if (demo && password === 'demo123') {
      setUser(demo);
      localStorage.setItem('shinewash_demo_user', JSON.stringify(demo));
      return { error: null };
    }

    // Supabase login
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'Login failed. Use demo credentials or configure Supabase.' };
    }
  };

  const register = async (data: RegisterData): Promise<{ error: string | null }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (!error && authData.user) {
        const newProfile: UserProfile = {
          id: authData.user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || null,
          role: 'customer',
          avatar_url: null,
          created_at: new Date().toISOString(),
        };
        try {
          await supabase.from('profiles').insert(newProfile);
        } catch {
          // ignore profile insert error
        }
        setUser(newProfile);
        localStorage.setItem('shinewash_demo_user', JSON.stringify(newProfile));
        return { error: null };
      }
    } catch {
      /* Supabase not configured — fallback to demo registration */
    }

    const newDemoUser: UserProfile = {
      id: `customer-${Date.now()}`,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone || null,
      role: 'customer',
      avatar_url: null,
      created_at: new Date().toISOString(),
    };
    setUser(newDemoUser);
    localStorage.setItem('shinewash_demo_user', JSON.stringify(newDemoUser));
    return { error: null };
  };

  const logout = async () => {
    localStorage.removeItem('shinewash_demo_user');
    setUser(null);
    await supabase.auth.signOut().catch(() => { /* ignore */ });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isManager: user?.role === 'manager',
      isCustomer: user?.role === 'customer',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
