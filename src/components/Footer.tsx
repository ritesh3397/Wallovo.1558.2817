import { Sparkles, ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  onBackToTop: () => void;
  onExploreClick: () => void;
}

export default function Footer({ onBackToTop, onExploreClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0B0B0B] border-t border-[#262626] pt-20 pb-12 px-4 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#22D3EE]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16 text-left">
          {/* Logo Column */}
          <div className="col-span-1 md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              </div>
              <span className="font-display font-bold text-white tracking-tight">
                Wallovo
              </span>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              A simple, privacy-friendly testimonial collection platform for professional builders and creators. Empower your business with social proof.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
              <Shield className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Secure Cloud Infrastructure</span>
            </div>
          </div>

          {/* Product links */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h5 className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Product</h5>
            <ul className="space-y-2 text-xs">
              {['Embedded widgets', 'Approved curation', 'Video capture forms', 'Public pages', 'Layout grid'].map((lnk) => (
                <li key={lnk}>
                  <a href="#widget" onClick={(e) => { e.preventDefault(); onExploreClick(); }} className="text-white/60 hover:text-[#22D3EE] transition-all">
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
              {['Design Philosophy', 'Changelog', 'Brand assets', 'Security', 'About'].map((lnk) => (
                <li key={lnk}>
                  <a href="#" className="text-white/60 hover:text-[#22D3EE] transition-all">
                    {lnk}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource links */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h5 className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold">Support</h5>
            <ul className="space-y-2 text-xs">
              {['Documentation Hub', 'Platform Status', 'Integrations', 'Contact'].map((lnk) => (
                <li key={lnk}>
                  <a href="#" className="text-white/60 hover:text-[#22D3EE] transition-all">
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
              {['Twitter / X', 'LinkedIn', 'Discord', 'Email Support'].map((social) => (
                <span key={social} className="text-white/60 hover:text-[#22D3EE] transition-all cursor-pointer">
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-[1px] bg-white/5 mb-8 flex justify-between items-center relative">
          <button
            onClick={onBackToTop}
            className="absolute right-4 -translate-y-1/2 bg-black/80 border border-[#262626] hover:border-[#22D3EE]/40 text-[#A3A3A3] hover:text-white rounded-full p-2 text-xs flex items-center gap-1 cursor-pointer transition-all animate-bounce"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="font-mono text-[9px] uppercase tracking-wider pr-1">top</span>
          </button>
        </div>

        {/* Bottom footer bar attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/40">
          <p>© {currentYear} Wallovo Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Terms</span>
            <span className="hover:underline cursor-pointer">Privacy Charter</span>
            <span className="hover:text-emerald-400 cursor-pointer">● Platform Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
