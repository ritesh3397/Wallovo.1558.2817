import { useState } from 'react';
import { Sliders, Layout, Monitor, Copy, Check, Sparkles, Star, Play, AlertCircle } from 'lucide-react';
import { INITIAL_TESTIMONIALS } from '../data';
import { Testimonial, WidgetConfig } from '../types';

export default function WidgetBuilder() {
  const [config, setConfig] = useState<WidgetConfig>({
    theme: 'minimal-glass',
    columns: 3,
    videoOnly: false
  });

  const [copied, setCopied] = useState(false);

  const filteredTestimonials = INITIAL_TESTIMONIALS.filter(t => {
    if (config.videoOnly && t.source !== 'video') return false;
    return true;
  });

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'carousel':
        return {
          card: 'bg-[#121212]/90 border border-white/5 shadow-xl p-6 rounded-[24px] hover:border-white/10 transition-all duration-300',
          text: 'text-brand-soft text-[13px] leading-relaxed',
          accentText: 'text-white font-serif italic',
          badge: 'bg-white/5 border border-white/10 text-white/70 text-[9px] font-mono px-2 py-0.5 rounded-full'
        };
      case 'midi-contrast':
      case 'midnight-high-contrast':
        return {
          card: 'bg-black border border-pink-500/30 shadow-[0_0_15px_rgba(244,114,182,0.1)] p-6 rounded-none hover:border-pink-400 transition-all duration-300',
          text: 'text-white text-[13px] font-mono leading-relaxed',
          accentText: 'text-[#F472B6] font-mono font-bold',
          badge: 'bg-pink-500/10 border border-pink-400/30 text-[#FFB6C9] text-[9px] font-mono px-2 py-0.5'
        };
      case 'minimal-glass':
      default:
        return {
          card: 'bg-[#0D0D0D]/90 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] hover:border-pink-300/35 hover:shadow-[0_10px_35px_rgba(255,182,201,0.06)] transition-all duration-300 group',
          text: 'text-zinc-300 text-[13px] leading-relaxed group-hover:text-white',
          accentText: 'text-[#FFB6C9] font-medium',
          badge: 'bg-pink-500/5 border border-pink-500/10 text-brand-glow text-[9px] font-mono px-2 py-0.5 rounded-full'
        };
    }
  };

  const currentTheme = getThemeClasses(config.theme);

  const getEmbedSnippet = () => {
    return `<!-- Wallovo Autonomous Testimonial Embed -->
<div id="wallovo-grid" 
  data-id="sterling-co" 
  data-theme="${config.theme}" 
  data-columns="${config.columns}" 
  data-video="${config.videoOnly}"
></div>
<script src="https://wallovo.co/embed.js" async></script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-24 px-4 subsurface-grid border-y border-white/[0.02]">
      {/* Visual top subtle badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-[1px] bg-gradient-to-r from-transparent via-[#FFB6C9]/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono tracking-wider text-brand-glow mb-4">
            <Sliders className="w-3.5 h-3.5" /> INTERACTIVE WIDGET COMPILER
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Embed physical glassmorphism in <em className="italic font-serif text-[#FFB6C9] font-normal">seconds.</em>
          </h2>
          <p className="font-sans text-brand-soft text-sm sm:text-base max-w-2xl mx-auto">
            Our generator compiles production-level CSS grids on-the-fly. Personalize rows, active video overrides, and color blends below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (Left Panel) - lg:col-span-4 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="wallovo-glass rounded-[24px] p-6 border-white/5 relative">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                <Layout className="w-4 h-4 text-[#FFB6C9]" />
                <h3 className="font-display font-bold text-white text-md">Widget Canvas Editor</h3>
              </div>

              {/* Theme Swapper Container */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-white/60 block mb-2 uppercase tracking-wide">
                    Theme Template
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'minimal-glass', name: 'Minimal Glass' },
                      { id: 'carousel', name: 'Obsidian Slab' },
                      { id: 'midnight-high-contrast', name: 'Midnight High' }
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setConfig({ ...config, theme: th.id as any })}
                        className={`text-[10px] font-medium py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          config.theme === th.id
                            ? 'bg-[#FFB6C9] text-black border-[#FFB6C9] font-semibold'
                            : 'bg-black/40 text-brand-soft border-white/5 hover:border-white/10'
                        }`}
                      >
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Columns slider */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-mono text-white/60 uppercase tracking-wide">
                      Grid Columns
                    </label>
                    <span className="text-[11px] font-mono text-[#FFB6C9] font-semibold">
                      {config.columns} {config.columns === 1 ? 'Column' : 'Columns'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={config.columns}
                    onChange={(e) => setConfig({ ...config, columns: parseInt(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFB6C9] focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-white/30 mt-1">
                    <span>1 Column</span>
                    <span>2 Columns</span>
                    <span>3 Columns</span>
                  </div>
                </div>

                {/* Require Video Proof check control */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-semibold text-white block">Video Proof Only</span>
                    <span className="text-[10px] text-white/40">Only display video assets</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.videoOnly}
                      onChange={(e) => setConfig({ ...config, videoOnly: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FFB6C9] peer-checked:to-pink-500 peer-checked:after:bg-black" />
                  </label>
                </div>
              </div>

              {/* Code output module */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white/50">DIRECT INTEGRATION CODE</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-[11px] font-mono text-[#FFB6C9] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-black/70 rounded-xl p-3.5 border border-white/5 relative overflow-hidden">
                  <pre className="text-[10px] font-mono text-brand-soft/85 overflow-x-auto text-left whitespace-pre-wrap leading-relaxed">
                    {getEmbedSnippet()}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Simulator Viewport (Right Panel) - lg:col-span-8 */}
          <div className="lg:col-span-8">
            <div className="bg-[#0D0D0D] border border-white/5 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl relative p-5 sm:p-8 bg-gradient-to-b from-[#0D0D0D] to-black">
              {/* Simulator Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-4 mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                  </div>
                  <span className="text-[11px] font-mono text-white/50 flex items-center gap-1.5 bg-white/3 py-0.5 px-3 rounded-md border border-white/5">
                    <Monitor className="w-3 h-3 text-[#FFB6C9]" /> live_viewport_simulation
                  </span>
                </div>
                <div className="text-[10px] font-mono text-white/40">
                  Showing {filteredTestimonials.length} of {INITIAL_TESTIMONIALS.length} filtered assets
                </div>
              </div>

              {filteredTestimonials.length === 0 ? (
                <div className="py-24 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-white/20 mx-auto" />
                  <p className="text-white/40 text-xs font-mono">No testimonials match the specified filter criteria.</p>
                  <button
                    onClick={() => setConfig({ ...config, videoOnly: false })}
                    className="text-xs text-[#FFB6C9] hover:underline"
                  >
                    Clear video filter
                  </button>
                </div>
              ) : (
                /* Dynamic Grid Renderer based on layout options */
                <div 
                  className={`grid gap-4 transition-all duration-500 ${
                    config.columns === 3 
                      ? 'grid-cols-1 md:grid-cols-3' 
                      : config.columns === 2 
                        ? 'grid-cols-1 md:grid-cols-2' 
                        : 'grid-cols-1'
                  }`}
                >
                  {filteredTestimonials.map((testimonial) => (
                    <div 
                      key={testimonial.id}
                      className={`${currentTheme.card} transition-all duration-300 relative text-left`}
                    >
                      {/* Top Edge Glowing accent */}
                      {config.theme === 'minimal-glass' && (
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={testimonial.avatarUrl} 
                          alt={testimonial.clientName} 
                          className="w-10 h-10 rounded-full object-cover border border-white/5" 
                        />
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{testimonial.clientName}</h4>
                          <span className="text-[10px] text-white/40 truncate block">
                            {testimonial.clientRole} at <span className={currentTheme.accentText}>{testimonial.clientCompany}</span>
                          </span>
                        </div>
                      </div>

                      {/* Display star values based on data */}
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#FFB6C9] stroke-[#FFB6C9]" />
                        ))}
                      </div>

                      <p className={currentTheme.text}>
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      {testimonial.source === 'video' && (
                        <div className="mt-4 bg-[#050505] rounded-xl border border-white/5 p-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-white/55 flex items-center gap-1.5 leading-none">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                            </span>
                            PRO VIDEO VERIFIED
                          </span>
                          <button className="text-[10px] font-mono text-[#FFB6C9] hover:underline flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-[#FFB6C9]" /> Play proof (45s)
                          </button>
                        </div>
                      )}

                      <div className="mt-5 pt-3 border-t border-white/[0.03] flex items-center justify-between">
                        <span className={currentTheme.badge}>
                          {testimonial.category || 'General'}
                        </span>
                        <div className="text-[10px] font-mono text-[#F472B6]">
                          Conversion Lift: <span className="font-bold text-[#FFB6C9]">{testimonial.conversionLift || '+15%'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
