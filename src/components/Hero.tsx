import { Sparkles, Star, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <section className="relative pt-36 pb-20 px-4 overflow-hidden bg-[#0B0B0B]">
      {/* Absolute background spotlight decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Cinematic Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] border border-[#262626] text-[11px] font-mono tracking-wider text-[#22D3EE] backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>VERIFIED CUSTOMER PROOF PLATFORM</span>
        </div>

        {/* Master Display Heading */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] max-w-4xl mx-auto mb-6">
          Turn customer praise <br />
          into direct <em className="font-sans italic text-[#22D3EE] font-normal pr-1">results.</em>
        </h1>

        {/* Elegant subhead */}
        <p className="font-sans text-[#A3A3A3] text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Wallovo lets you collect high-value user praise, organize recent reviews on a central dashboard, and embed beautiful trust layouts onto your landing page instantly.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => { window.location.href = '/collect/testuser'; }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#22D3EE] text-[#0B0B0B] font-bold text-sm hover:opacity-90 transition-all duration-300 cursor-pointer"
          >
            Submit Testimonial
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#151515] text-white border border-[#262626] font-semibold text-sm hover:bg-[#262626] transition-all duration-300 cursor-pointer"
          >
            Go to Dashboard →
          </button>
        </div>

        {/* Visual Product Mock Canvas styled as a masterpiece Bento Grid */}
        <div className="relative max-w-5xl mx-auto mt-6 px-4">
          <div className="wallovo-glass rounded-[28px] sm:rounded-[36px] border-[#262626] overflow-hidden shadow-2xl relative p-4 sm:p-8 bg-[#151515] transition-all duration-500 hover:border-[#22D3EE]/30 group">
            
            {/* Interactive Browser Top Bar */}
            <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <div className="text-[11px] font-mono text-[#A3A3A3] bg-black/40 px-4 py-1 rounded-full border border-[#262626]">
                wallovo.co/embed/sterling-co
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                <span className="text-[9px] font-mono tracking-wider text-[#22D3EE] uppercase">Active Embed Widget</span>
              </div>
            </div>

            {/* Master Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left items-stretch">
              {/* Left Column (col-span-8): Live Stream Reviews */}
              <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-white border-b-2 border-[#22D3EE] pb-1">Recent Reviews</span>
                    <span className="text-xs text-white/30">Layout Grid</span>
                    <span className="text-xs text-white/30">Carousel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono uppercase text-white/40 tracking-widest">Verified Feed</span>
                  </div>
                </div>

                {/* Reviews sub-grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Review Card 1 */}
                  <div className="p-5 bg-black/20 border border-[#262626] rounded-2xl md:hover:border-[#22D3EE]/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop" className="w-8 h-8 rounded-full object-cover border border-[#262626]" />
                      <div>
                        <span className="text-xs font-bold text-white block">Chloe Mercer</span>
                        <span className="text-[9px] text-[#A3A3A3] block">CEO, Bloom Software</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#A3A3A3] leading-relaxed italic">
                      &ldquo;The capture process is completely seamless. We collected beautiful client testimonials in our first week without chasing anybody.&rdquo;
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[8.5px] font-mono">
                      <span className="text-[#22D3EE]">Verified Client</span>
                      <span className="text-white/20">WLV-2051</span>
                    </div>
                  </div>

                  {/* Review Card 2 */}
                  <div className="p-5 bg-black/20 border border-[#262626] rounded-2xl md:hover:border-[#22D3EE]/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" className="w-8 h-8 rounded-full object-cover border border-[#262626]" />
                      <div>
                        <span className="text-xs font-bold text-white block">Sarah Miller</span>
                        <span className="text-[9px] text-[#A3A3A3] block">Founder, Blossom Co.</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#A3A3A3] leading-relaxed italic">
                      &ldquo;Submitting a review on our public collection page was remarkably fast. It has given our landing page an immediate professional lift.&rdquo;
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[8.5px] font-mono">
                      <span className="text-[#22D3EE]">Verified Client</span>
                      <span className="text-white/20">WLV-1122</span>
                    </div>
                  </div>
                </div>

                {/* Main high emphasis review */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-[#262626] hover:border-[#22D3EE]/30 transition-all relative">
                  <span className="absolute -top-2.5 right-4 bg-[#22D3EE] text-black text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Featured Retainer Review
                  </span>
                  <div className="flex items-center gap-3 mb-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop" className="w-8 h-8 rounded-full object-cover border border-[#262626]" />
                    <div>
                      <span className="text-xs font-bold text-white block">Alex Sterling</span>
                      <span className="text-[9px] text-[#22D3EE] block">Founding Partner, Sterling & Co.</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white leading-relaxed font-normal">
                    &ldquo;Wallovo transformed how we compile our professional design reviews. It is incredibly user-friendly and keeps everything looking highly professional.&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-white/40 pt-2 font-mono">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-[#262626] rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] text-[#A3A3A3]">Active Widget Link</span>
                  </div>
                  <span>REF: ST-992-B</span>
                </div>
              </div>

              {/* Right Column (col-span-4): High Fidelity Bento Blocks */}
              <div className="md:col-span-4 space-y-4 flex flex-col justify-between">
                {/* 1. Statistics Summary Card */}
                <div className="bg-black/30 border border-[#262626] rounded-2xl p-5 hover:border-[#22D3EE]/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-semibold text-xs">Total Responses</span>
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-[#22D3EE] text-[9.5px] font-bold rounded">100% Rate</span>
                  </div>
                  <div className="text-4xl font-bold tracking-tighter text-white mb-1">Satisfied</div>
                  <div className="text-[10px] text-neutral-400 leading-snug">Clients find our minimal review workflow simple to interact with.</div>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#22D3EE] to-cyan-500 w-[100%]"></div>
                  </div>
                </div>

                {/* 2. Customer Feedback Box */}
                <div className="bg-black/30 border border-[#262626] rounded-2xl p-4 flex items-center justify-between hover:border-[#22D3EE]/30 transition-all">
                  <div>
                    <div className="text-2xl font-bold tracking-tighter text-white">Verified</div>
                    <div className="text-[9.5px] font-mono text-white/40 uppercase tracking-wide">Client Submissions</div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-[#262626] flex items-center justify-center relative">
                    <div className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" />
                  </div>
                </div>

                {/* 3. Manual Curation Card */}
                <div className="bg-black/30 border border-[#262626] rounded-2xl p-5 flex flex-col justify-between gap-3 hover:border-[#22D3EE]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#151515] border border-[#262626] flex items-center justify-center">
                      <span className="text-[#22D3EE] font-bold text-xs">✦</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Easy Curation</div>
                      <div className="text-[9.5px] text-white/40 font-mono">Approve with 1-click</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 border border-[#262626] p-3 rounded-xl italic text-[10px] text-zinc-300 leading-relaxed">
                    "Wallovo didn't just organize my feedback; it made our branding completely consistent."
                  </div>
                  
                  <button className="w-full py-2 bg-black/40 hover:bg-black/60 border border-[#262626] rounded-full text-[8.5px] font-bold uppercase tracking-widest text-[#22D3EE] transition-all">
                    Approved Testimonials Only
                  </button>
                </div>
              </div>
            </div>

            {/* Visual bottom subtle badge: count */}
            <div className="mt-6 pt-4 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/40">GENERATE TESTIMONIAL DISPLAY WIDGETS</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-white/40">Real-time approved status:</span>
                <span className="text-[#22D3EE] font-bold">● Clean UI Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
