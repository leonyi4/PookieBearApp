import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase-client";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null;
        setUser(nextUser);

        // Keep the user profile cache in sync
        if (nextUser?.id) {
          queryClient.invalidateQueries({ queryKey: ["userProfile", nextUser.id] });
        } else {
          // user signed out or session cleared
          queryClient.removeQueries({ queryKey: ["userProfile"] });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    setUser(data.user);
    if (data.user?.id) {
      // Refresh any watchers of this user's profile
      queryClient.invalidateQueries({ queryKey: ["userProfile", data.user.id] });
    }
    return data.user;
  };

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    // Note: with email confirmation ON, data.user may be null here.
    if (data.user?.id) {
      queryClient.invalidateQueries({ queryKey: ["userProfile", data.user.id] });
    }
    setUser(data.user ?? null);
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut({ scope: "local" });
    setUser(null);
    // Clear any cached profile data so the next user won't see old data
    queryClient.removeQueries({ queryKey: ["userProfile"] });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
