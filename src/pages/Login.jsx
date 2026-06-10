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
      setErrorMsg("Please enter your account email and password.");
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
        setSuccessMsg("Access verified! Forwarding to the dashboard...");
        
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
    <div className="min-h-screen text-neutral-350 flex flex-col justify-between selection:bg-[#22D3EE] selection:text-black relative overflow-x-hidden bg-[#0B0B0B] font-sans">
      {/* Cinematic backgrounds */}
      <div className="absolute inset-0 z-0 subsurface-grid opacity-30 pointer-events-none"></div>
      
      {/* Ambient glowing node */}
      <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>

      {/* Header / Logo section */}
      <header className="relative z-10 px-8 pt-8 flex justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/index.html" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#22D3EE] to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform duration-500 group-hover:rotate-180"></div>
              <span className="text-lg font-bold tracking-tighter text-white font-display group-hover:text-[#22D3EE] transition-colors">Wallovo</span>
            </a>
            <a href="/index.html" className="text-[10px] text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/20 hover:bg-[#22D3EE]/15 hover:border-[#22D3EE]/40 font-mono tracking-widest uppercase px-3 py-1 rounded-full transition-all duration-300">
              ← Home
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full border border-[#22D3EE]/20">Secure Portal</span>
          </div>
        </div>
      </header>

      {/* Main login box container */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-[28px] p-8 sm:p-10 relative overflow-hidden group">
          {/* Top glowing razor accent border */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#22D3EE]/40 to-transparent"></div>
          
          {/* Header texts inside the card */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[9px] font-mono tracking-wider text-[#22D3EE] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> ACCOUNT SIGN IN
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tighter text-white">Welcome back</h2>
            <p className="text-xs text-neutral-400 mt-1.5">Sign in to coordinate your testimonials and display widgets</p>
          </div>

          {/* FORM ENTRY */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#0B0B0B] border border-[#262626] rounded-full px-5 py-4 text-xs font-mono text-white placeholder-white/20 hover:border-white/10 focus:border-[#22D3EE]/50 focus:bg-black focus:ring-1 focus:ring-[#22D3EE]/20 transition-all duration-300 outline-none shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400">Password</label>
                <a href="#" className="text-[9px] text-[#22D3EE] hover:text-cyan-450 transition-colors font-mono hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0B0B] border border-[#262626] rounded-full px-5 py-4 text-xs font-mono text-white placeholder-white/20 hover:border-white/10 focus:border-[#22D3EE]/50 focus:bg-black focus:ring-1 focus:ring-[#22D3EE]/20 transition-all duration-300 outline-none shadow-inner"
              />
            </div>

            {/* STATUS ALERT */}
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
              className="w-full bg-[#22D3EE] text-black font-bold text-xs py-4 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] transition-all duration-300 font-display uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* FOOTER SWAPPER LINER */}
          <div className="text-center mt-6">
            <p className="text-xs text-neutral-400">
              New to Wallovo?{" "}
              <a href="/signup.html" className="text-[#22D3EE] font-medium transition-colors hover:underline">Create an account</a>
            </p>
          </div>
        </div>
      </main>

      {/* Aesthetic Footer */}
      <footer className="relative z-10 px-8 pb-8 flex flex-col sm:flex-row items-center justify-between text-white/20 text-[9px] uppercase tracking-[0.2em] font-medium gap-3">
        <span>&copy; 2026 Wallovo</span>
        <div className="flex gap-4 sm:gap-8">
          <span className="font-mono">Secure Connection</span>
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
