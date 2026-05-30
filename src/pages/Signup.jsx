import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '../../src/index.css';

export function SignupContent() {
  const { session, signup, authReady } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-redirect if there is a valid active session
  useEffect(() => {
    if (authReady && session) {
      console.log("[Signup Page] Active session detected. Redirecting to dashboard...");
      window.location.href = '/dashboard.html';
    }
  }, [session, authReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Weak password — must be at least 6 characters.");
      return;
    }

    setLoading(true);
    console.log("[Signup Page] Commencing user registration for:", trimmedEmail);

    try {
      const { data, error } = await signup(trimmedEmail, password, trimmedName);

      if (error) {
        console.error("[Signup Page] Registration failed:", error.message);
        setErrorMsg("Signup Failed: " + error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        console.log("[Signup Page] Registration successful for user ID:", data.user.id);
        setSuccessMsg("Account created successfully! Forwarding to executive login...");
        
        // Wait a short duration, then transition to login portal
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1200);
      } else {
        console.warn("[Signup Page] Registration returned empty payload");
        setErrorMsg("Signup returned empty payload. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("[Signup Page] Exception during registration:", err);
      setErrorMsg(err.message || "An authentication server exception occurred. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-300 flex flex-col justify-between selection:bg-[#FFB6C9] selection:text-black relative overflow-x-hidden bg-[#050505]">
      {/* Cinematic backgrounds */}
      <div className="absolute inset-0 z-0 subsurface-grid opacity-30 pointer-events-none"></div>

      {/* Ambient glowing nodes */}
      <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] bg-[#F472B6]/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-[#FFB6C9]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }}></div>

      {/* Header / Logo section */}
      <header className="relative z-10 px-8 pt-8 flex justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/index.html" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFB6C9] to-[#F472B6] shadow-[0_0_15px_rgba(255,182,201,0.3)] transition-transform duration-500 group-hover:rotate-180"></div>
              <span className="text-lg font-bold tracking-tighter text-white font-display group-hover:text-[#FFB6C9] transition-colors">Wallovo</span>
            </a>
            <a href="/index.html" className="text-[9px] text-[#FFB6C9] bg-pink-500/10 border border-pink-500/20 hover:bg-[#FFB6C9]/15 hover:border-[#FFB6C9]/40 font-mono tracking-widest uppercase px-3 py-1 rounded-full transition-all duration-300">
              ← Home
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB6C9] bg-pink-500/10 px-3 py-1 rounded-full border border-pink-400/20">Alpha V2.0</span>
          </div>
        </div>
      </header>

      {/* Main signup box container */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md wallovo-glass rounded-[28px] p-8 sm:p-10 relative overflow-hidden group">
          {/* Top glowing razor accent border */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9]/40 to-transparent"></div>
          
          {/* Header texts inside the card */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-[9px] font-mono tracking-wider text-[#FFB6C9] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span> SECURED CLIENT TUNNEL
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tighter text-white">Create Account</h2>
            <p className="text-xs text-white/50 mt-1.5 font-medium">Sign up to claim your corporate test suite and widgets</p>
          </div>

          {/* FORM ENTRY */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="full-name" className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1.5">Full Name</label>
              <input
                type="text"
                id="full-name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Mitchell"
                className="w-full bg-[#0D0D0D] border border-white/5 rounded-full px-5 py-4 text-xs font-mono text-white placeholder-white/20 hover:border-white/10 focus:border-[#FFB6C9]/50 focus:bg-black focus:ring-1 focus:ring-[#FFB6C9]/20 transition-all duration-300 outline-none shadow-inner"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1.5">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@yourbrand.com"
                className="w-full bg-[#0D0D0D] border border-white/5 rounded-full px-5 py-4 text-xs font-mono text-white placeholder-white/20 hover:border-white/10 focus:border-[#FFB6C9]/50 focus:bg-black focus:ring-1 focus:ring-[#FFB6C9]/20 transition-all duration-300 outline-none shadow-inner"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1.5">Security Password</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0D0D0D] border border-white/5 rounded-full px-5 py-4 text-xs font-mono text-white placeholder-white/20 hover:border-white/10 focus:border-[#FFB6C9]/50 focus:bg-black focus:ring-1 focus:ring-[#FFB6C9]/20 transition-all duration-300 outline-none shadow-inner"
              />
            </div>

            {/* STATUS & DISPATCH ALERTS */}
            {errorMsg && (
              <div className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/20 px-4 py-3 rounded-full text-center font-medium animate-fade-in font-mono animate-fade-in">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-4 py-3 rounded-full text-center font-medium animate-fade-in font-mono animate-fade-in">
                {successMsg}
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FFB6C9] to-[#F472B6] hover:brightness-110 text-black font-semibold text-xs py-4 rounded-full shadow-[0_0_20px_rgba(255,182,201,0.25)] transition-all duration-300 font-display uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER SWAPPER LINER */}
          <div className="text-center mt-6">
            <p className="text-xs text-white/40">
              Already registered?{" "}
              <a href="/login.html" className="text-[#FFB6C9] hover:text-[#F472B6] font-medium transition-colors hover:underline">Log in to Console</a>
            </p>
          </div>
        </div>
      </main>

      {/* Aesthetic Footer info banner */}
      <footer className="relative z-10 px-8 pb-8 flex flex-col sm:flex-row items-center justify-between text-white/20 text-[9px] uppercase tracking-[0.2em] font-medium gap-3">
        <span>&copy; 2026 Wallovo AI Labs</span>
        <div className="flex gap-4 sm:gap-8">
          <span className="font-mono">Secure Direct Node</span>
        </div>
      </footer>
    </div>
  );
}

export default function Signup() {
  return (
    <AuthProvider>
      <SignupContent />
    </AuthProvider>
  );
}

createRoot(document.getElementById('signup-root')).render(<Signup />);
