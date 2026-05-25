import { Star } from 'lucide-react';

interface NavbarProps {
  activeView: 'marketing' | 'dashboard';
  setActiveView: (view: 'marketing' | 'dashboard') => void;
  onSubmitReviewClick: () => void;
}

export default function Navbar({ activeView, setActiveView, onSubmitReviewClick }: NavbarProps) {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="wallovo-glass rounded-full px-6 py-3 flex items-center justify-between gap-4 max-w-4xl mx-auto border-white/5 shadow-2xl relative overflow-hidden">
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
          <div>
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
