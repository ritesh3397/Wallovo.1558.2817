import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '../../src/index.css';

export function LoginContent() {
  const { session, login, authReady } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto redirect if session exists
  useEffect(() => {
    if (authReady && session) {
      console.log("[Login Page] Active session detected. Redirecting to dashboard...");
      window.location.href = '/dashboard.html';
    }
  }, [session, authReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg("Enter your registration credentials.");
      return;
    }

    setLoading(true);
    console.log("[Login Page] Authenticating email:", trimmedEmail);

    try {
      const { data, error } = await login(trimmedEmail, password);

      if (error) {
        console.error("[Login Page] Authentication failed:", error.message);
        setErrorMsg("Authentication Error: " + error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        console.log("[Login Page] Authentication successful:", data.user.email);
        setSuccessMsg("Access verified! Forwarding to executive dashboard...");
        
        // Wait briefly for smooth visual transition
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
      } else {
        console.error("[Login Page] Empty response payload returned");
        setErrorMsg("Authentication returned empty payload. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("[Login Page] Exception during authentication:", err);
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
        <div class="w-full max-w-5xl flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a href="/index.html" class="flex items-center gap-2 group">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFB6C9] to-[#F472B6] shadow-[0_0_15px_rgba(255,182,201,0.3)] transition-transform duration-500 group-hover:rotate-180"></div>
              <span class="text-lg font-bold tracking-tighter text-white font-display group-hover:text-[#FFB6C9] transition-colors">Wallovo</span>
            </a>
            <a href="/index.html" class="text-[9px] text-[#FFB6C9] bg-pink-500/10 border border-pink-500/20 hover:bg-[#FFB6C9]/15 hover:border-[#FFB6C9]/40 font-mono tracking-widest uppercase px-3 py-1 rounded-full transition-all duration-300">
              ← Home
            </a>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] uppercase font-mono tracking-widest text-[#FFB6C9] bg-pink-500/10 px-3 py-1 rounded-full border border-pink-400/20">Alpha V2.0</span>
          </div>
        </div>
      </header>

      {/* Main login box container */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md wallovo-glass rounded-[28px] p-8 sm:p-10 relative overflow-hidden group">
          {/* Top glowing razor accent border */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9]/40 to-transparent"></div>
          
          {/* Header texts inside the card */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-[9px] font-mono tracking-wider text-[#FFB6C9] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span> SECURED CLIENT TUNNEL
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tighter text-white">Login Console</h2>
            <p className="text-xs text-white/50 mt-1.5 font-medium">Authorize access credentials to coordinate proof and widget layers</p>
          </div>

          {/* FORM ENTRY */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-[9px] font-mono uppercase tracking-widest text-white/40">Security Password</label>
                <a href="#" className="text-[9px] text-[#FFB6C9] hover:text-[#F472B6] transition-colors font-mono hover:underline">Recover Key?</a>
              </div>
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
              <div className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/20 px-4 py-3 rounded-full text-center font-medium animate-fade-in font-mono">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-4 py-3 rounded-full text-center font-medium animate-fade-in font-mono">
                {successMsg}
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FFB6C9] to-[#F472B6] hover:brightness-110 text-black font-semibold text-xs py-4 rounded-full shadow-[0_0_20px_rgba(255,182,201,0.25)] transition-all duration-300 font-display uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Authorize Login'
              )}
            </button>
          </form>

          {/* FOOTER SWAPPER LINER */}
          <div className="text-center mt-6">
            <p className="text-xs text-white/40">
              Deploying with a new startup?{" "}
              <a href="/signup.html" className="text-[#FFB6C9] hover:text-[#F472B6] font-medium transition-colors hover:underline">Claim Access Token</a>
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

export default function Login() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}

createRoot(document.getElementById('login-root')).render(<Login />);
