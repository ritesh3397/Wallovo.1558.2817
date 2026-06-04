import { Play, Sparkles, Star, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onSubmitReviewClick: () => void;
}

export default function Hero({ onExploreClick, onSubmitReviewClick }: HeroProps) {
  return (
    <section className="relative pt-36 pb-20 px-4 overflow-hidden">
      {/* Absolute background spotlight grid decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFB6C9]/8 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[20%] w-[250px] h-[250px] bg-pink-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Cinematic Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] font-mono tracking-wider text-brand-glow backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin-slow" />
          <span>AUTONOMOUS TESTIMONIAL PLATFORM v2.4</span>
        </div>

        {/* Master Display Heading with tight text, mixed grotest & serif pairings */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] max-w-4xl mx-auto mb-6">
          Turn customer appreciation <br />
          into direct <em className="font-serif italic text-[#FFB6C9] font-normal pr-1">conversions.</em>
        </h1>

        {/* Elegant subhead */}
        <p className="font-sans text-brand-soft text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Wallovo captures your high-ticket clients' authentic delight automatically, 
          polishes long-form quotes in one click, and embeds responsive trust grids that close prospects for you.
        </p>

        {/* Action button pills */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => { window.location.href = '/collect/testuser'; }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500 text-black font-bold text-sm hover:opacity-90 shadow-[0_0_25px_rgba(34,208,244,0.25)] hover:shadow-[0_0_35px_rgba(34,208,244,0.4)] transition-all duration-300 cursor-pointer"
          >
            Submit Testimonial
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#FFB6C9] to-pink-500 text-black font-semibold text-sm hover:opacity-90 shadow-[0_0_25px_rgba(255,182,201,0.25)] hover:shadow-[0_0_35px_rgba(255,182,201,0.4)] transition-all duration-300 cursor-pointer"
          >
            Go to Dashboard →
          </button>
          <button
            onClick={onSubmitReviewClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-2.5 border border-white/10 hover:border-[#FFB6C9]/35 transition-all duration-300 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Submit Demo Review</span>
          </button>
        </div>        {/* Visual Product Mock Canvas styled as a masterpiece Bento Grid */}
        <div className="relative max-w-5xl mx-auto mt-6 px-4">
          <div className="wallovo-glass rounded-[28px] sm:rounded-[36px] border-white/5 overflow-hidden shadow-2xl relative p-4 sm:p-8 bg-[#0D0D0D]/95 backdrop-blur-3xl transition-all duration-500 hover:border-white/10 group">
            {/* Glossy overlay layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/3 to-transparent pointer-events-none" />
            
            {/* Interactive Browser Top Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <div className="text-[11px] font-mono text-white/40 bg-white/3 px-4 py-1 rounded-full border border-white/5">
                wallovo.co/embed/sterling-co
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono tracking-wider text-emerald-500/85 uppercase">Active Bento Pipeline</span>
              </div>
            </div>

            {/* Master Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left items-stretch">
              {/* Left Column (col-span-8): Live Stream Reviews */}
              <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-white border-b-2 border-[#FFB6C9] pb-1">Live Trust Stream</span>
                    <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer">Dynamic Grid</span>
                    <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer">Carousel Slider</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50 animate-ping"></div>
                    <span className="text-[9px] font-mono uppercase text-white/40 tracking-widest">Real-time Pipeline</span>
                  </div>
                </div>

                {/* Reviews sub-grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Review Card 1 */}
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl md:hover:border-[#FFB6C9]/25 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <div>
                        <span className="text-xs font-bold text-white block">Chloe Mercer</span>
                        <span className="text-[9px] text-white/40 block">CEO, Bloom Software</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-brand-soft/75 leading-relaxed italic">
                      &ldquo;The automatic capture rate is unreal. We collected 18 beautiful video testimonials in our first week without chasing.&rdquo;
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[8.5px] font-mono">
                      <span className="text-[#FFB6C9]">+41% Growth</span>
                      <span className="text-white/30">ID: WLV-9488</span>
                    </div>
                  </div>

                  {/* Review Card 2 */}
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl md:hover:border-[#FFB6C9]/25 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <div>
                        <span className="text-xs font-bold text-white block">Sarah Miller</span>
                        <span className="text-[9px] text-white/40 block">Founder, Blossom Co.</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-brand-soft/75 leading-relaxed italic">
                      &ldquo;Captured our third testimonial automatically while we were sleeping. Conversion lift is already highly visible on our checkout page.&rdquo;
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[8.5px] font-mono">
                      <span className="text-[#FFB6C9]">+32% Conversion</span>
                      <span className="text-white/30">ID: WLV-1122</span>
                    </div>
                  </div>
                </div>

                {/* Main high emphasis review */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-pink-400/15 shadow-[0_0_20px_rgba(244,114,182,0.03)] relative">
                  <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#FFB6C9] to-pink-500 text-black text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Featured High-Ticket Proof
                  </span>
                  <div className="flex items-center gap-3 mb-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop" className="w-8 h-8 rounded-full object-cover border border-pink-400/20" />
                    <div>
                      <span className="text-xs font-bold text-white block">Alex Sterling</span>
                      <span className="text-[9px] text-pink-300 block">Founding Partner, Sterling & Co.</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white leading-relaxed font-normal">
                    &ldquo;Wallovo transformed our static proofs into a dynamic converting machine. It is an absolute game-changer for commanding premium agency retainers.&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-white/40 pt-2 font-mono">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] text-white/60 uppercase">Widget Active</span>
                  </div>
                  <span>REF: 0X4F-229-LB</span>
                </div>
              </div>

              {/* Right Column (col-span-4): High Fidelity Bento Blocks */}
              <div className="md:col-span-4 space-y-4 flex flex-col justify-between">
                {/* 1. Conversion Lift Card */}
                <div className="bg-[#0D0D0D]/90 border border-white/5 rounded-2xl p-5 hover:border-[#FFB6C9]/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Conversion Lift</span>
                    <span className="px-2 py-0.5 bg-[#FFB6C9]/15 text-[#FFB6C9] text-[9.5px] font-bold rounded">+32.4%</span>
                  </div>
                  <div className="text-4xl font-bold tracking-tighter text-white mb-1">$1.2M</div>
                  <div className="text-[10px] text-white/40 leading-snug">Attributed revenue via Wallovo widgets this quarter.</div>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FFB6C9] to-pink-500 w-[78%]"></div>
                  </div>
                </div>

                {/* 2. Assets Captured Card */}
                <div className="bg-[#0D0D0D]/90 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-[#FFB6C9]/20 transition-all">
                  <div>
                    <div className="text-2xl font-bold tracking-tighter text-white">482</div>
                    <div className="text-[9.5px] font-mono text-white/40 uppercase tracking-wide">Assets Captured</div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative">
                    <div className="w-2 h-2 rounded-full bg-[#FFB6C9] shadow-[0_0_10px_#FFB6C9] animate-ping" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFB6C9] shadow-[0_0_10px_#FFB6C9]" />
                  </div>
                </div>

                {/* 3. AI Polish Rewrite Card */}
                <div className="bg-[#0D0D0D]/90 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-3 hover:border-[#FFB6C9]/20 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-[#FFB6C9] font-bold text-xs">✦</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">AI Polish Rewrite</div>
                      <div className="text-[9.5px] text-white/40 font-mono">Semantic Optimization</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl italic text-[10px] text-white/70 leading-relaxed">
                    "Wallovo didn't just organize my reviews; it completely changed how we pitch..."
                  </div>
                  
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[8.5px] font-bold uppercase tracking-widest text-[#FFB6C9] transition-all">
                    Optimize Copy v2.0
                  </button>
                </div>
              </div>
            </div>

            {/* Visual bottom subtle badge: conversion count */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/40">AUTOGENERATE LIVE ANALYTICS EMBED CODE</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-white/40">Real-time validation tracking:</span>
                <span className="text-brand-glow font-bold animate-pulse">● 42,912 Live Interactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
