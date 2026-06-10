import { useState } from 'react';
import { Sliders, Layout, Monitor, Copy, Check, Star, Play, AlertCircle } from 'lucide-react';
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
          card: 'bg-[#151515] border border-[#262626] p-6 rounded-2xl hover:border-[#22D3EE]/30 transition-all duration-300',
          text: 'text-neutral-400 text-[13px] leading-relaxed',
          accentText: 'text-white font-medium',
          badge: 'bg-white/5 border border-[#262626] text-white/70 text-[9px] font-mono px-2 py-0.5 rounded-full'
        };
      case 'midi-contrast':
      case 'midnight-high-contrast':
        return {
          card: 'bg-black border border-[#262626] p-6 hover:border-[#22D3EE] transition-all duration-300',
          text: 'text-neutral-400 text-[13px] font-mono leading-relaxed',
          accentText: 'text-[#22D3EE] font-mono',
          badge: 'bg-[#22D3EE]/10 border border-[#262626] text-[#22D3EE] text-[9px] font-mono px-2 py-0.5'
        };
      case 'minimal-glass':
      default:
        return {
          card: 'bg-[#151515] border border-[#262626] p-6 rounded-3xl hover:border-[#22D3EE]/30 hover:shadow-[0_10px_35px_rgba(34,211,238,0.06)] transition-all duration-300 group',
          text: 'text-neutral-400 text-[13px] leading-relaxed group-hover:text-white',
          accentText: 'text-[#22D3EE] font-medium',
          badge: 'bg-[#22D3EE]/5 border border-[#262626] text-[#22D3EE] text-[9px] font-mono px-2 py-0.5 rounded-full'
        };
    }
  };

  const currentTheme = getThemeClasses(config.theme);

  const getEmbedSnippet = () => {
    return `<!-- Wallovo Testimonial Embed -->
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
    <section className="relative py-24 px-4 subsurface-grid border-y border-[#262626]">
      {/* Visual top subtle badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#262626] text-[10px] font-mono tracking-wider text-[#22D3EE] mb-4">
            <Sliders className="w-3.5 h-3.5" /> INTERACTIVE DISPLAY OPTIONS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Embed responsive trust grids in <em className="italic font-sans text-[#22D3EE] font-normal">seconds.</em>
          </h2>
          <p className="font-sans text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
            Our generator lets you customize the responsive columns, filter for specific feedback sources, and render an elegant card design.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (Left Panel) - lg:col-span-4 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="wallovo-glass rounded-[24px] p-6 border-[#262626] relative">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#262626]">
                <Layout className="w-4 h-4 text-[#22D3EE]" />
                <h3 className="font-display font-semibold text-white text-md">Widget Theme Options</h3>
              </div>

              {/* Theme Template Options */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-white/60 block mb-2 uppercase tracking-wide">
                    Theme Design
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'minimal-glass', name: 'Minimal Glass' },
                      { id: 'carousel', name: 'Obsidian' },
                      { id: 'midnight-high-contrast', name: 'High Contrast' }
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setConfig({ ...config, theme: th.id as any })}
                        className={`text-[10px] py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          config.theme === th.id
                            ? 'bg-[#22D3EE] text-black border-[#22D3EE] font-bold'
                            : 'bg-black/40 text-[#A3A3A3] border-[#262626] hover:border-[#22D3EE]/30'
                        }`}
                      >
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Columns */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-mono text-white/60 uppercase tracking-wide">
                      Grid Columns
                    </label>
                    <span className="text-[11px] font-mono text-[#22D3EE] font-semibold">
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
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#22D3EE] focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-white/30 mt-1">
                    <span>1 Column</span>
                    <span>2 Columns</span>
                    <span>3 Columns</span>
                  </div>
                </div>

                {/* Video Checkbox */}
                <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-semibold text-white block">Video Testimonials Only</span>
                    <span className="text-[10px] text-white/40 font-mono">Filter by video response format</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.videoOnly}
                      onChange={(e) => setConfig({ ...config, videoOnly: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22D3EE] peer-checked:after:bg-black" />
                  </label>
                </div>
              </div>

              {/* Code output */}
              <div className="mt-8 pt-6 border-t border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white/50">HTML EMBED SNIPPET</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-[11px] font-mono text-[#22D3EE] flex items-center gap-1 hover:underline cursor-pointer"
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
                <div className="bg-black/70 rounded-xl p-3.5 border border-[#262626] relative overflow-hidden">
                  <pre className="text-[10px] font-mono text-white/80 overflow-x-auto text-left whitespace-pre-wrap leading-relaxed">
                    {getEmbedSnippet()}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Simulator Viewport (Right Panel) - lg:col-span-8 */}
          <div className="lg:col-span-8">
            <div className="bg-[#151515] border border-[#262626] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl relative p-5 sm:p-8 bg-gradient-to-b from-[#151515] to-[#0D0D0D]">
              {/* Simulator Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#262626] pb-4 mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                  </div>
                  <span className="text-[11px] font-mono text-white/50 flex items-center gap-1.5 bg-black/40 py-0.5 px-3 rounded-md border border-[#262626]">
                    <Monitor className="w-3 h-3 text-[#22D3EE]" /> viewport_preview
                  </span>
                </div>
                <div className="text-[10px] font-mono text-white/40">
                  Showing {filteredTestimonials.length} of {INITIAL_TESTIMONIALS.length} assets
                </div>
              </div>

              {filteredTestimonials.length === 0 ? (
                <div className="py-24 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-white/20 mx-auto" />
                  <p className="text-white/40 text-xs font-mono">No testimonials found for this filter combination.</p>
                  <button
                    onClick={() => setConfig({ ...config, videoOnly: false })}
                    className="text-xs text-[#22D3EE] hover:underline"
                  >
                    Clear filter
                  </button>
                </div>
              ) : (
                /* Dynamic Grid Renderer */
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
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#22D3EE]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={testimonial.avatarUrl} 
                          alt={testimonial.clientName} 
                          className="w-10 h-10 rounded-full object-cover border border-[#262626]" 
                        />
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{testimonial.clientName}</h4>
                          <span className="text-[10px] text-white/40 truncate block">
                            {testimonial.clientRole} at <span className={currentTheme.accentText}>{testimonial.clientCompany}</span>
                          </span>
                        </div>
                      </div>

                      {/* Display stars */}
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#22D3EE] stroke-[#22D3EE]" />
                        ))}
                      </div>

                      <p className={currentTheme.text}>
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      {testimonial.source === 'video' && (
                        <div className="mt-4 bg-black/40 rounded-xl border border-[#262626] p-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-white/55 flex items-center gap-1.5 leading-none">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
                            </span>
                            VIDEO SUBMISSION
                          </span>
                          <button className="text-[10px] font-mono text-[#22D3EE] hover:underline flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-[#22D3EE]" /> Play testimonial
                          </button>
                        </div>
                      )}

                      <div className="mt-5 pt-3 border-t border-[#262626] flex items-center justify-between">
                        <span className={currentTheme.badge}>
                          {testimonial.category || 'General'}
                        </span>
                        <div className="text-[10px] font-mono text-neutral-500">
                          Verified proof
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
