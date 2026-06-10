import { useState, useRef, useEffect } from 'react';
import { Star, Shield, Layout, Settings, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeView: 'marketing' | 'dashboard';
  setActiveView: (view: 'marketing' | 'dashboard') => void;
  user: { email: string; fullName: string } | null;
  onLogout: () => void;
}

export default function Navbar({ activeView, setActiveView, user, onLogout }: NavbarProps) {
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
        <div className="wallovo-glass rounded-full px-6 py-3 flex items-center justify-between gap-4 max-w-5xl mx-auto border-[#262626] shadow-xl relative overflow-hidden">
          {/* Subtle Accent Light Strip top center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/45 to-transparent" />
          
          {/* Brand/Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveView('marketing')}
          >
            <div className="relative w-8 h-8 rounded-full bg-[#151515] border border-[#262626] flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#22D3EE]/60 transition-all">
              {/* Dual-tone gradient background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#22D3EE]/20 to-[#22D3EE]/20 group-hover:scale-110 transition-all duration-300" />
              {/* Sound / Testimonial Vector */}
              <svg className="w-5 h-5 text-[#22D3EE] relative z-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="font-display font-bold text-white tracking-tight group-hover:text-[#22D3EE] transition-all duration-300">
              Wallovo
            </span>
          </div>

          {/* Navigation Toggle Option Capsule */}
          <div className="bg-black/40 border border-[#262626] rounded-full p-1 flex items-center relative">
            <button
              onClick={() => {
                setActiveView('marketing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-500 cursor-pointer ${
                activeView === 'marketing'
                  ? 'text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {activeView === 'marketing' && (
                <div className="absolute inset-0 bg-[#22D3EE] rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] -z-10" />
              )}
              Home
            </button>
            <button
              onClick={() => {
                if (user) {
                  window.location.href = '/dashboard.html';
                } else {
                  window.location.href = '/login.html';
                }
              }}
              className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-500 cursor-pointer ${
                activeView === 'dashboard'
                  ? 'text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {activeView === 'dashboard' && (
                <div className="absolute inset-0 bg-[#22D3EE] rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] -z-10" />
              )}
              Dashboard
            </button>
          </div>

          {/* Submit Action Block */}
          <div className="flex items-center gap-2.5">
            {!user ? (
              <>
                <a
                  href="/login.html"
                  className="text-xs text-neutral-400 hover:text-[#22D3EE] font-medium transition-colors px-2.5 py-2 cursor-pointer font-sans"
                >
                  Login
                </a>
                <a
                  href="/signup.html"
                  className="text-xs text-black font-semibold bg-[#22D3EE] hover:bg-[#22D3EE]/95 shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] px-4 py-2 rounded-full transition-all duration-300 cursor-pointer font-sans"
                >
                  Signup
                </a>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <a
                  href="/profile.html"
                  className="text-xs text-neutral-400 hover:text-[#22D3EE] font-semibold transition-colors px-3 py-2 cursor-pointer font-sans"
                >
                  Profile
                </a>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs text-rose-400 font-bold bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/35 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer font-sans"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
