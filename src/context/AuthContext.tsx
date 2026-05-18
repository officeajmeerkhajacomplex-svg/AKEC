import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  ustad_name: string;
  department: string;
  phone_number: string;
  role: "usthad" | "parent";
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginUsthad: (name: string, password: string, isFirstLogin: boolean, department?: string) => Promise<void>;
  loginParent: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to restore session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id).catch(console.error);
      } else {
        checkLocalParentSession();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id).catch(console.error);
      } else {
        // If auth state changes to null, but we are a parent, we don't automatically clear parent session
        const localUser = localStorage.getItem('currentUser');
        if (localUser) {
           const parsed = JSON.parse(localUser);
           if (parsed.role !== 'parent') {
              setUser(null);
           }
        } else {
           setUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkLocalParentSession = () => {
    const localUser = localStorage.getItem('currentUser');
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        if (parsed.role === 'parent') {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  };

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("fetchUserProfile error:", error);
      throw new Error(`Failed to load profile: ${error.message}`);
    }

    if (data) {
      const profile: UserProfile = {
        id: data.id,
        ustad_name: data.name,
        department: data.department || '',
        phone_number: data.phone_number || '',
        role: data.role as any
      };
      localStorage.setItem('currentUser', JSON.stringify(profile));
      setUser(profile);
    } else {
      console.warn("No profile found for userId:", userId);
      // Auto-repair missing profile for usthad
      // The name logic here is a fallback
      const { data: newProfile, error: insertError } = await supabase.from('profiles').insert([{
        id: userId,
        name: "Restored User",
        department: "Usthad",
        role: 'usthad'
      }]).select().single();
      
      if (newProfile) {
        const profile: UserProfile = {
          id: newProfile.id,
          ustad_name: newProfile.name,
          department: newProfile.department || '',
          phone_number: newProfile.phone_number || '',
          role: newProfile.role as any
        };
        localStorage.setItem('currentUser', JSON.stringify(profile));
        setUser(profile);
      } else {
        throw new Error("Your account data is missing. Please contact support or run the database schema.");
      }
    }
    setLoading(false);
  };
  
  const generateEmail = (name: string) => {
    return `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@usthad.akec.app`;
  };

  const loginUsthad = async (name: string, password: string, isFirstLogin: boolean, department?: string) => {
    setLoading(true);
    const email = generateEmail(name);
    try {
      if (isFirstLogin) {
        // First login -> Create account
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw new Error(signUpError.message);
        if (!authData.user) throw new Error("Could not create user account.");

        // Create the user profile
        const { error: insertError } = await supabase.from('profiles').insert([{
          id: authData.user.id,
          name: name,
          department: department || "Usthad",
          role: 'usthad'
        }]);

        if (insertError) throw new Error('Failed to create profile: ' + insertError.message);
        
        await fetchUserProfile(authData.user.id);
      } else {
        // Returning login
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw new Error("Invalid name or password.");
        if (authData.user) {
          await fetchUserProfile(authData.user.id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loginParent = async (phone: string) => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phone)
        .eq('role', 'parent')
        .limit(1)
        .maybeSingle();

      if (error && error.code === 'PGRST116') {
        // Parent not found, auto-create one for simplicity since real OTP isn't fully set up without twilio
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ phone_number: phone, role: 'parent' }])
          .select()
          .single();
          
        if (insertError) throw new Error('Failed to create parent profile: ' + insertError.message);
        data = newProfile;
      } else if (error) {
        throw new Error('Login failed: ' + error.message);
      }

      const profile: UserProfile = {
          id: data.id,
          ustad_name: data.name || "Parent",
          department: data.department || '',
          phone_number: data.phone_number,
          role: data.role
      };

      localStorage.setItem('currentUser', JSON.stringify(profile));
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, loginUsthad, loginParent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

