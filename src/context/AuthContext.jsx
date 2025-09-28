import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // supabase.auth user
  const [profile, setProfile] = useState(null);   // row from public.users
  const [loading, setLoading] = useState(true);

  // Fetch user + profile
  const loadProfile = async (supabaseUser) => {
    if (!supabaseUser) {
      setProfile(null);
      return;
    }

    const { data: profileRow, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    if (error && error.code === "PGRST116") {
      // No row found, create minimal one
      const { data: newProfile } = await supabase
        .from("users")
        .insert({
          id: supabaseUser.id,
          email: supabaseUser.email,
          profile_complete: false,
        })
        .select()
        .single();
      setProfile(newProfile);
    } else {
      setProfile(profileRow);
    }
  };

  useEffect(() => {
    // 1. Load session on initial mount
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const supabaseUser = session?.user ?? null;
      setUser(supabaseUser);
      await loadProfile(supabaseUser);
      setLoading(false);
    };

    getSession();

    // 2. Listen for changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const supabaseUser = session?.user ?? null;
        setUser(supabaseUser);
        await loadProfile(supabaseUser);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    await loadProfile(data.user);
    return data.user;
  };

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    await loadProfile(data.user);
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, login, signup, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
