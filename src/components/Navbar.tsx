import { useState, useRef, useEffect } from 'react';
import { Star, Shield, Layout, Settings, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeView: 'marketing' | 'dashboard';
  setActiveView: (view: 'marketing' | 'dashboard') => void;
  onSubmitReviewClick: () => void;
  user: { email: string; fullName: string } | null;
  onLogout: () => void;
}

export default function Navbar({ activeView, setActiveView, onSubmitReviewClick, user, onLogout }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-[#0D0D0D]/65 hover:bg-[#FFB6C9]/15 text-white/90 hover:text-[#FFB6C9] text-xs px-3 py-1.5 rounded-full border border-white/5 hover:border-[#FFB6C9]/35 transition-all duration-300 cursor-pointer outline-none select-none relative group"
                  title="Operator Session"
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFB6C9] to-[#F472B6] flex items-center justify-center text-[10px] font-bold text-black uppercase shrink-0">
                      {user.fullName ? user.fullName.substring(0, 1).toUpperCase() : 'U'}
                    </div>
                    {/* Pulsing Active Online Glow Dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-[#0D0D0D] shadow-[0_0_8px_#34D399]">
                      <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"></span>
                    </div>
                  </div>
                  <span className="max-w-[90px] truncate hidden sm:inline text-zinc-300 font-mono text-[10.5px] tracking-wider font-semibold group-hover:text-[#FFB6C9] transition-colors">{user.fullName || 'Operator'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 group-hover:text-[#FFB6C9] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#FFB6C9]' : ''}`} />
                </button>

                {/* Dropdown Menu Container */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-11 mt-2 w-56 wallovo-glass rounded-2xl bg-[#0D0D0D]/95 border border-white/5 py-2 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(255,182,201,0.06)] overflow-hidden z-50 divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-4 py-3 bg-white/[0.01]">
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-mono uppercase tracking-widest text-[#FFB6C9] bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                        SLA Online
                      </span>
                      <p className="text-xs font-bold text-white truncate mt-2 font-display">{user.fullName || 'User'}</p>
                      <p className="text-[10px] text-white/40 truncate font-mono mt-0.5">{user.email}</p>
                    </div>
                    
                    <div className="py-1.5">
                      <a
                        href="/profile.html"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-[#FFB6C9] hover:bg-white/[0.02] transition-colors font-sans group/drill"
                      >
                        <Shield className="w-3.5 h-3.5 text-white/40 group-hover/drill:text-[#FFB6C9] transition-colors" />
                        <span>My Profile</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('dashboard');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-[#FFB6C9] hover:bg-white/[0.02] transition-colors font-sans group/drill cursor-pointer"
                      >
                        <Layout className="w-3.5 h-3.5 text-white/40 group-hover/drill:text-[#FFB6C9] transition-colors" />
                        <span>Dashboard</span>
                      </button>
                      <a
                        href="/profile.html"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-[#FFB6C9] hover:bg-white/[0.02] transition-colors font-sans group/drill"
                      >
                        <Settings className="w-3.5 h-3.5 text-white/40 group-hover/drill:text-[#FFB6C9] transition-colors" />
                        <span>Settings</span>
                      </a>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-colors font-sans cursor-pointer font-medium group/drill"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400/70 group-hover/drill:text-rose-300 transition-colors" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
