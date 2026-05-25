import { Star } from 'lucide-react';

interface NavbarProps {
  activeView: 'marketing' | 'dashboard';
  setActiveView: (view: 'marketing' | 'dashboard') => void;
  onSubmitReviewClick: () => void;
  user: { email: string; fullName: string } | null;
  onLogout: () => void;
}

export default function Navbar({ activeView, setActiveView, onSubmitReviewClick, user, onLogout }: NavbarProps) {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="wallovo-glass rounded-full px-6 py-3 flex items-center justify-between gap-4 max-w-5xl mx-auto border-white/5 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Light Strip top center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#FFB6C9]/45 to-transparent" />
          
          {/* Brand/Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveView('marketing')}
          >
            <div className="relative w-8 h-8 rounded-full bg-[#0D0D0D] border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#FFB6C9]/35 transition-all">
              {/* Dual-tone gradient background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F472B6]/20 to-[#FFB6C9]/20 group-hover:scale-110 transition-all duration-300" />
              {/* Minimalist Heartbeat / Sound Vector */}
              <svg className="w-5 h-5 text-[#FFB6C9] relative z-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="font-display font-bold text-white tracking-tight group-hover:text-[#FFB6C9] transition-all duration-300">
              Wallovo
            </span>
          </div>

          {/* Navigation Toggle Option Capsule */}
          <div className="bg-black/40 border border-white/5 rounded-full p-1 flex items-center relative">
            <button
              onClick={() => setActiveView('marketing')}
              className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-500 cursor-pointer ${
                activeView === 'marketing'
                  ? 'text-black font-semibold'
                  : 'text-brand-soft hover:text-white'
              }`}
            >
              {activeView === 'marketing' && (
                <div className="absolute inset-0 bg-[#FFB6C9] rounded-full shadow-[0_0_15px_rgba(255,182,201,0.5)] -z-10" />
              )}
              Wall of Love
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-500 cursor-pointer ${
                activeView === 'dashboard'
                  ? 'text-black font-semibold'
                  : 'text-brand-soft hover:text-white'
              }`}
            >
              {activeView === 'dashboard' && (
                <div className="absolute inset-0 bg-[#FFB6C9] rounded-full shadow-[0_0_15px_rgba(255,182,201,0.5)] -z-10" />
              )}
              AI Dashboard
            </button>
          </div>

          {/* Submit Action Block */}
          <div className="flex items-center gap-2.5">
            {!user ? (
              <>
                <a
                  href="/login.html"
                  className="text-xs text-brand-soft hover:text-[#FFB6C9] font-medium transition-colors px-2.5 py-2 cursor-pointer font-sans"
                >
                  Login
                </a>
                <a
                  href="/signup.html"
                  className="text-xs text-black font-semibold bg-[#FFB6C9] hover:bg-[#FFB6C9]/90 shadow-[0_0_10px_rgba(255,182,201,0.2)] hover:shadow-[0_0_15px_rgba(255,182,201,0.35)] px-4 py-2 rounded-full transition-all duration-300 cursor-pointer font-sans"
                >
                  Signup
                </a>
              </>
            ) : (
              <>
                <a
                  href="/profile.html"
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-[#FFB6C9]/15 text-white/90 hover:text-[#FFB6C9] text-xs px-3 py-1.5 rounded-full border border-white/5 hover:border-[#FFB6C9]/35 transition-all duration-300 cursor-pointer"
                  title="View Profile"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FFB6C9] to-[#F472B6] flex items-center justify-center text-[9px] font-bold text-black uppercase shrink-0">
                    {user.fullName ? user.fullName.substring(0, 2) : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate hidden md:inline text-zinc-300 font-mono text-[10px]/none tracking-wider">{user.fullName || 'User'}</span>
                </a>
                
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-[11px] uppercase tracking-wider text-rose-400 hover:text-rose-300 font-mono transition-colors px-2.5 py-2 cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}

            <button
              onClick={onSubmitReviewClick}
              className="relative group flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white font-medium text-xs px-4 py-2 rounded-full border border-white/5 hover:border-[#FFB6C9]/25 transition-all duration-300 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB6C9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F472B6]"></span>
              </span>
              <span>Submit Review</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
