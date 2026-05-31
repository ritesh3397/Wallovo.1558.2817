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

  // New debugging states to track detailed execution
  const [signUpCallState, setSignUpCallState] = useState('idle');
  const [finallyBlockExecuted, setFinallyBlockExecuted] = useState('no');
  const [exactResponse, setExactResponse] = useState(null);
  const [exactError, setExactError] = useState(null);
  const [beforeSignUpTime, setBeforeSignUpTime] = useState(null);
  const [afterSignUpTime, setAfterSignUpTime] = useState(null);
  const [finallyExecutedTime, setFinallyExecutedTime] = useState(null);
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
    console.log("Signup started");
    setSignupData(null);
    setSignupError(null);
    setSignUpCallState('before_signUp');
    setFinallyBlockExecuted('no');
    setExactResponse(null);
    setExactError(null);
    setBeforeSignUpTime(new Date().toLocaleTimeString());
    setAfterSignUpTime(null);
    setFinallyExecutedTime(null);

    console.log("BEFORE signUp()");

    let result;
    try {
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      console.log("AFTER signUp()");
      console.log(result);
      setSignUpCallState('after_signUp_success');
      setAfterSignUpTime(new Date().toLocaleTimeString());
      setExactResponse(result?.data || null);
      setExactError(result?.error || null);
    } catch (err) {
      console.error("signUp exception occurred:", err);
      result = { 
        data: { user: null, session: null }, 
        error: err 
      };
      setSignUpCallState('after_signUp_exception');
      setAfterSignUpTime(new Date().toLocaleTimeString());
      setExactError(err);
    } finally {
      console.log("signUp function finally{} block executed");
      setFinallyBlockExecuted('yes');
      setFinallyExecutedTime(new Date().toLocaleTimeString());
    }

    const { data, error } = result;

    console.log("SIGNUP DATA", data);
    console.log("SIGNUP ERROR", error);

    setSignupData(data);
    setSignupError(error);

    return { data, error };
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
      loginError,
      signUpCallState,
      finallyBlockExecuted,
      exactResponse,
      exactError,
      beforeSignUpTime,
      afterSignUpTime,
      finallyExecutedTime
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
