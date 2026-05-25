import { Sparkles, ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  onBackToTop: () => void;
  onExploreClick: () => void;
}

export default function Footer({ onBackToTop, onExploreClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-20 pb-12 px-4 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-pink-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16 text-left">
          {/* Logo & Manifesto Column */}
          <div className="col-span-1 md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FFB6C9]/20 to-[#F472B6]/20 border border-pink-400/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-300" />
              </div>
              <span className="font-display font-extrabold text-white tracking-tight">
                Wallovo
              </span>
            </div>
            <p className="font-sans text-white/50 text-xs sm:text-sm leading-relaxed max-w-sm">
              Elevating conversion intelligence through soft dark luxury. We craft the high-status validation grids that convert passive visitors into high-ticket clients automatically.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
              <Shield className="w-3.5 h-3.5 text-pink-300" />
              <span>AES-256 Cloud Infrastructure</span>
            </div>
          </div>

          {/* Product links */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h5 className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Product</h5>
            <ul className="space-y-2 text-xs">
              {['Embedded widgets', 'AI Copy Engine v2', 'Video capture forms', 'Custom DNS mappers', 'Sub-surface grids'].map((lnk) => (
                <li key={lnk}>
                  <a href="#widget" onClick={(e) => { e.preventDefault(); onExploreClick(); }} className="text-white/60 hover:text-[#FFB6C9] transition-all">
                    {lnk}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h5 className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Company</h5>
            <ul className="space-y-2 text-xs">
              {['Design Philosophy', 'Changelog logs', 'Brand assets', 'Enterprise SLA', 'Press & Funding'].map((lnk) => (
                <li key={lnk}>
                  <a href="#" className="text-white/60 hover:text-[#FFB6C9] transition-all">
                    {lnk}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource links */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h5 className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Developer Support</h5>
            <ul className="space-y-2 text-xs">
              {['Documentation Hub', 'API Status Ledger', 'Webhook sandbox', 'Support ticket systems'].map((lnk) => (
                <li key={lnk}>
                  <a href="#" className="text-white/60 hover:text-[#FFB6C9] transition-all">
                    {lnk}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social connections */}
          <div className="col-span-1 md:col-span-2 space-y-4 text-left">
            <h5 className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Connections</h5>
            <div className="space-y-2 text-xs flex flex-col">
              {['Twitter / X', 'LinkedIn Network', 'Elite Discord Server', 'High-status email digest'].map((social) => (
                <span key={social} className="text-white/60 hover:text-[#FFB6C9] transition-all cursor-pointer">
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Separator block lines */}
        <div className="w-full h-[1px] bg-white/5 mb-8 flex justify-between items-center relative">
          {/* Back to top capsule button floating */}
          <button
            onClick={onBackToTop}
            className="absolute right-4 -translate-y-1/2 bg-black/80 border border-white/5 hover:border-[#FFB6C9]/40 text-brand-soft/70 hover:text-white rounded-full p-2 text-xs flex items-center gap-1 cursor-pointer transition-all"
            title="Slide to top header"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="font-mono text-[9px] uppercase tracking-wider pr-1">top</span>
          </button>
        </div>

        {/* Bottom footer bar attribution details */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/40">
          <p>© {currentYear} Wallovo Inc. All rights reserved globally.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Security SLA</span>
            <span className="hover:underline cursor-pointer">Privacy Charter</span>
            <span className="hover:text-emerald-400 cursor-pointer">● API Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
