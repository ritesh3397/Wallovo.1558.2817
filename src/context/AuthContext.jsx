import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

console.log("SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [signupData, setSignupData] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  // Initialize and check current session
  useEffect(() => {
    let active = true;

    async function initAuth() {
      console.log("[AuthContext] Running getSession()...");
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AuthContext] Error getting initial session:", error.message);
        }
        
        if (active) {
          const currentSession = data?.session || null;
          console.log("[AuthContext] session value loaded:", currentSession ? currentSession.user?.email : "no session");
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
      } catch (err) {
        console.error("[AuthContext] Failed checking auth session on init:", err);
      } finally {
        if (active) {
          console.log("[AuthContext] setting authReady = true");
          setAuthReady(true);
        }
      }
    }

    initAuth();

    // Register ONE global listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("[AuthContext] onAuthStateChange event received:", event, currentSession ? currentSession.user?.email : "no session");
      if (active) {
        setSession(currentSession);
        setUser(currentSession?.user || null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    console.log("[AuthContext] login starting for:", email);
    setLoginError(null);
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      console.error("[AuthContext] login error:", result.error.message);
      setLoginError(result.error);
    } else {
      console.log("[AuthContext] login success");
    }
    return result;
  };

  const signup = async (email, password, fullName) => {
    setSignupData(null);
    setSignupError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      setSignupData(data);
      setSignupError(error);
      return { data, error };
    } catch (err) {
      setSignupError(err);
      return { data: null, error: err };
    }
  };

  const logout = async () => {
    console.log("[AuthContext] logout starting");
    const result = await supabase.auth.signOut();
    console.log("[AuthContext] logout finished");
    return result;
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      authReady, 
      login, 
      signup, 
      logout,
      signupData, 
      signupError, 
      loginError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
