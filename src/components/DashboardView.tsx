import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Inbox, Layers, Settings, Search, Trash2, Sparkles, 
  Download, Globe, CheckCircle2, RefreshCw, Send, Slack, 
  Star, Eye, AlertCircle, Check, Pencil, ShieldCheck
} from 'lucide-react';
import { Testimonial, FormConfig } from '../types';

interface DashboardViewProps {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

export default function DashboardView({ testimonials, setTestimonials }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'inbox' | 'form' | 'integrations'>('analytics');
  
  // Tab B: Moderation & Search/AI states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRewriteId, setSelectedRewriteId] = useState<string | null>(null);
  const [rewriteArchetype, setRewriteArchetype] = useState<'agency' | 'saas' | 'minimal'>('agency');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedResult, setPolishedResult] = useState('');
  const [tempDraftText, setTempDraftText] = useState('');

  // Tab C: Form Builder states
  const [formConfig, setFormConfig] = useState<FormConfig>({
    welcomeMessage: 'Submit Your Experience',
    starGoal: 5,
    brandLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=128&auto=format&fit=crop'
  });
  const [captureFormSubmitted, setCaptureFormSubmitted] = useState(false);
  const [livePreviewResponse, setLivePreviewResponse] = useState({
    name: '',
    role: '',
    company: '',
    text: '',
    rating: 5
  });

  // Tab D: Domain & Slack states
  const [cnameHost, setCnameHost] = useState('reviews.myagency.com');
  const [domainVerified, setDomainVerified] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/X00');
  const [slackConnected, setSlackConnected] = useState(false);
  const [sendingSlackTest, setSendingSlackTest] = useState(false);
  const [showSlackNotice, setShowSlackNotice] = useState(false);

  // CSV Export simulator
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Role,Company,Star Rating,Source,Date,Message"].join(",") + "\n"
      + testimonials.map(t => `"${t.clientName}","${t.clientRole}","${t.clientCompany}",${t.stars},"${t.source}","${t.date}","${t.text.replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wallovo_testimonials_backup_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete dynamic testimonial
  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // Trigger AI Polish rewrite modal / interface
  const handleOpenRewrite = (id: string) => {
    const t = testimonials.find(item => item.id === id);
    if (!t) return;
    setSelectedRewriteId(id);
    setTempDraftText(t.text);
    
    // Generate initial recommendation depending on current text
    setPolishedResult('');
  };

  const handleSimulatePolish = () => {
    setIsPolishing(true);
    setTimeout(() => {
      let polished = '';
      if (rewriteArchetype === 'agency') {
        polished = `Wallovo transformed our social proof paradigm completely. For any high-ticket agency looking to command premium retainers, embedding their responsive review grids is easily the highest-ROI decision you'll make this year. An absolute no-brainer.`;
      } else if (rewriteArchetype === 'saas') {
        polished = `Our product sign-ups immediately spiked after integrating Wallovo. Authentic customer voices are now front and center, handling objections automatically. Highly recommended dashboard for modern, self-serve software models.`;
      } else {
        polished = `We value design integrity over everything. Wallovo fits our layout perfectly—clean, fast, interactive, and premium. Authentic user feedback, polished beautifully.`;
      }
      setPolishedResult(polished);
      setIsPolishing(false);
    }, 1200);
  };

  const handleApplyPolish = () => {
    if (!selectedRewriteId || !polishedResult) return;
    setTestimonials(prev => prev.map(t => {
      if (t.id === selectedRewriteId) {
        return { ...t, text: polishedResult, category: 'AI Optimized' };
      }
      return t;
    }));
    setSelectedRewriteId(null);
    setPolishedResult('');
  };

  // Perform domain validation simulation
  const handleVerifyDomain = () => {
    setVerifyingDomain(true);
    setTimeout(() => {
      setVerifyingDomain(false);
      setDomainVerified(true);
    }, 1500);
  };

  // Test Slack integration
  const handleTestSlack = () => {
    setSendingSlackTest(true);
    setTimeout(() => {
      setSendingSlackTest(false);
      setSlackConnected(true);
      setShowSlackNotice(true);
      setTimeout(() => setShowSlackNotice(false), 3500);
    }, 1200);
  };

  // Filter and search computation
  const filteredInbox = useMemo(() => {
    return testimonials.filter(t => {
      const searchStr = `${t.clientName} ${t.clientRole} ${t.clientCompany} ${t.text} ${t.category || ''}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });
  }, [testimonials, searchQuery]);

  // Compute stats in real-time based on active testimonials state
  const computedStats = useMemo(() => {
    const total = testimonials.length;
    const isVideo = testimonials.filter(t => t.source === 'video').length;
    const avgStars = total ? (testimonials.reduce((acc, curr) => acc + curr.stars, 0) / total).toFixed(1) : '5.0';
    
    // Custom dynamic lift
    const baseLift = total * 6.4;
    const conversionLift = total ? `+${Math.min(baseLift, 45).toFixed(0)}%` : '+0%';

    return {
      total,
      isVideo,
      avgStars,
      conversionLift
    };
  }, [testimonials]);

  // Handle client-side mock submission
  const handleLivePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!livePreviewResponse.name || !livePreviewResponse.text) return;

    const newFeedback: Testimonial = {
      id: `custom-${Date.now()}`,
      clientName: livePreviewResponse.name,
      clientRole: livePreviewResponse.role || 'Partner',
      clientCompany: livePreviewResponse.company || 'Modern Brand',
      text: livePreviewResponse.text,
      avatarUrl: formConfig.brandLogoUrl,
      stars: livePreviewResponse.rating,
      verified: true,
      source: 'custom',
      date: new Date().toISOString().slice(0, 10),
      category: 'Inbound Capture'
    };

    setTestimonials(prev => [newFeedback, ...prev]);
    setCaptureFormSubmitted(true);
    setLivePreviewResponse({
      name: '',
      role: '',
      company: '',
      text: '',
      rating: 5
    });
    setTimeout(() => setCaptureFormSubmitted(false), 4000);
  };

  return (
    <section className="relative py-24 px-4 min-h-screen">
      {/* Background spotlights */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-pink-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-pink-500/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto pt-16">
        {/* Dynamic header summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono tracking-wider text-[#FFB6C9] bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase">
                PRO ACCOUNT SUITE
              </span>
              <a
                href="/dashboard.html"
                className="text-[9px] font-mono tracking-wider text-[#FFB6C9] hover:text-white bg-pink-500/10 hover:bg-[#F472B6]/20 px-2.5 py-1 rounded-full border border-pink-500/25 uppercase transition-all duration-300"
              >
                Go to Standalone Console →
              </a>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
              AI Command Console
            </h1>
            <p className="font-sans text-white/50 text-xs sm:text-sm mt-1">
              Configure domains, approve inbound customer logs, and authorize copywriting updates.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-[#0D0D0D]/90 border border-white/5 p-1 rounded-full px-4 py-2.5">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 3).map((t) => (
                <img 
                  key={t.id} 
                  src={t.avatarUrl} 
                  className="w-6 h-6 rounded-full border border-black object-cover" 
                />
              ))}
            </div>
            <div className="text-left font-mono text-[10px]">
              <span className="text-emerald-400 font-bold">● ONLINE MONITOR</span>
              <p className="text-white/40">{testimonials.length} reviews synchronized</p>
            </div>
          </div>
        </div>

        {/* Floating Switcher Bar */}
        <div className="inline-flex bg-black/40 border border-white/5 rounded-full p-1.5 mb-10 overflow-x-auto max-w-full scrollbar-none">
          {[
            { id: 'analytics', label: 'Analytics Insights', icon: BarChart3 },
            { id: 'inbox', label: 'Inbox Moderation', icon: Inbox },
            { id: 'form', label: 'Live Form Capture', icon: Layers },
            { id: 'integrations', label: 'Bridges & Domains', icon: Settings }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-black bg-[#FFB6C9] shadow-inner font-bold'
                    : 'text-brand-soft/60 hover:text-white'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-black' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        
        {/* TAB A: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="wallovo-glass rounded-[24px] p-6 border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase">Total Love Assets</span>
                  <h3 className="text-3xl font-display font-bold text-white mt-2 mb-1">{computedStats.total}</h3>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-4">
                  ↑ 100% active status
                </div>
              </div>

              {/* Stat 2 */}
              <div className="wallovo-glass rounded-[24px] p-6 border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase">Video Proof Elements</span>
                  <h3 className="text-3xl font-display font-bold text-white mt-2 mb-1">{computedStats.isVideo}</h3>
                </div>
                <div className="text-[10px] font-mono text-[#FFB6C9] mt-4">
                  {computedStats.isVideo > 0 ? 'Verified inline widgets' : 'Awaiting custom upload'}
                </div>
              </div>

              {/* Stat 3 */}
              <div className="wallovo-glass rounded-[24px] p-6 border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase">Average Stars rating</span>
                  <h3 className="text-3xl font-display font-bold text-white mt-2 mb-1">
                    {computedStats.avgStars} <span className="text-sm font-semibold text-white/40">/ 5.0</span>
                  </h3>
                </div>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFB6C9] stroke-[#FFB6C9]" />
                  ))}
                </div>
              </div>

              {/* Stat 4 */}
              <div className="wallovo-glass rounded-[24px] p-6 border-[#FFB6C9]/25 flex flex-col justify-between bg-gradient-to-br from-[#0D0D0D] to-pink-950/20 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#FFB6C9]/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <span className="text-[10px] font-mono text-[#FFB6C9] uppercase font-semibold">COGNITIVE CONVERSION LIFT</span>
                  <h3 className="text-3xl font-display font-bold text-white mt-2 mb-1">{computedStats.conversionLift}</h3>
                </div>
                <div className="text-[10px] font-mono text-pink-300 mt-4">
                  Calculated landing page ROI boost
                </div>
              </div>
            </div>

            {/* Custom Interactive SVG Graph & Distribution Grid details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Graphic Chart Left: Col span-8 */}
              <div className="lg:col-span-8 wallovo-glass rounded-[24px] p-6 border-white/5 relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white">Trust Engagement Index</h4>
                    <span className="text-[10px] text-white/40">Measured as organic scrolls and plays over 7 days</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#FFB6C9] bg-white/3 py-1 px-3 border border-white/5 rounded">
                    REALTIME VISITS TRACKING
                  </span>
                </div>

                {/* Micro clean SVG Chart */}
                <div className="h-44 w-full flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFB6C9" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#F472B6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,150 L0,84 C40,90 80,45 120,55 C160,65 200,105 240,95 C280,85 320,30 360,25 C400,20 440,55 500,10 L500,150 Z"
                      fill="url(#chart-grad)"
                    />
                    <path
                      d="M0,84 C40,90 80,45 120,55 C160,65 200,105 240,95 C280,85 320,30 360,25 C400,20 440,55 500,10"
                      fill="none"
                      stroke="#FFB6C9"
                      strokeWidth="2.5"
                    />
                    {/* Visual coordinates dots */}
                    <circle cx="120" cy="55" r="4" fill="#000" stroke="#FFB6C9" strokeWidth="2" />
                    <circle cx="240" cy="95" r="4" fill="#000" stroke="#FFB6C9" strokeWidth="2" />
                    <circle cx="360" cy="25" r="4" fill="#000" stroke="#FFB6C9" strokeWidth="2" />
                    <circle cx="500" cy="10" r="4" fill="#000" stroke="#FFB6C9" strokeWidth="2" />
                  </svg>
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-mono text-white/40 pt-4 border-t border-white/5">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun (Active today)</span>
                </div>
              </div>

              {/* Star Rating Spread right column: Col span-4 */}
              <div className="lg:col-span-4 wallovo-glass rounded-[24px] p-6 border-white/5">
                <h4 className="text-sm font-bold text-white mb-6">Star Rating Spread</h4>
                
                <div className="space-y-4">
                  {[
                    { stars: 5, pct: 85, count: testimonials.filter(t => t.stars === 5).length },
                    { stars: 4, pct: 15, count: testimonials.filter(t => t.stars === 4).length },
                    { stars: 3, pct: 0, count: testimonials.filter(t => t.stars === 3).length },
                    { stars: 2, pct: 0, count: testimonials.filter(t => t.stars === 2).length },
                    { stars: 1, pct: 0, count: testimonials.filter(t => t.stars === 1).length }
                  ].map((item) => (
                    <div key={item.stars} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="flex items-center gap-1 text-white">
                          {item.stars} <Star className="w-3 h-3 fill-[#FFB6C9] stroke-[#FFB6C9]" />
                        </span>
                        <span className="text-white/50">
                          {item.count} assets ({item.count ? Math.round((item.count / testimonials.length) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#FFB6C9] h-full rounded-full transition-all duration-500"
                          style={{ width: `${testimonials.length ? (item.count / testimonials.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB B: INBOX MODERATION FEED */}
        {activeTab === 'inbox' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Search, Filter & Actions bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-[#0D0D0D]/40 p-4 border border-white/5 rounded-2xl">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search feedback sender context or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/60 text-xs text-white pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:border-[#FFB6C9]/40 focus:outline-none focus:ring-1 focus:ring-[#FFB6C9]/10"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Safe CSV
                </button>
              </div>
            </div>

            {/* Moderation table or cards grid */}
            {filteredInbox.length === 0 ? (
              <div className="wallovo-glass rounded-[24px] py-16 text-center space-y-4">
                <Inbox className="w-12 h-12 text-white/20 mx-auto" />
                <div className="space-y-1">
                  <p className="text-white font-medium text-sm">No testimonies found</p>
                  <p className="text-white/40 text-xs font-mono">Try adjusting your active search filter context</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredInbox.map((item) => (
                  <div 
                    key={item.id} 
                    className="wallovo-glass rounded-[24px] p-6 border-white/5 hover:border-[#FFB6C9]/25 transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Highlight glowing bar */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
                      {/* Left: customer profile */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={item.avatarUrl} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-semibold flex items-center justify-center rounded-full bg-emerald-500 border border-black">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{item.clientName}</h4>
                            <span className="text-[9px] font-mono tracking-wider bg-white/5 border border-white/5 text-white/60 px-2 py-0.5 rounded uppercase">
                              {item.source}
                            </span>
                          </div>
                          <span className="text-xs text-white/50">{item.clientRole} at <span className="text-[#FFB6C9]">{item.clientCompany}</span></span>
                          <span className="text-[10px] font-mono text-white/30 block mt-0.5">Logged: {item.date}</span>
                        </div>
                      </div>

                      {/* Right: Stars, action operations */}
                      <div className="flex items-center gap-2.5 self-end md:self-auto">
                        {/* Star review representation */}
                        <div className="flex gap-0.5 bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${
                                i < item.stars 
                                  ? 'fill-[#FFB6C9] stroke-[#FFB6C9]' 
                                  : 'stroke-white/10 fill-transparent'
                              }`} 
                            />
                          ))}
                        </div>

                        {/* Signature AI polish rewrite trigger */}
                        <button
                          onClick={() => handleOpenRewrite(item.id)}
                          className="p-2 px-3.5 bg-pink-500/10 hover:bg-pink-500/20 text-[#FFB6C9] text-xs font-semibold rounded-xl border border-pink-400/25 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                          <span>AI Polish Rewrite</span>
                        </button>

                        {/* Delete asset */}
                        <button
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all hover:border-red-500/40 cursor-pointer"
                          title="Purge review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Review text content block */}
                    <p className="text-zinc-300 text-sm leading-relaxed pl-1 sm:pl-16 font-sans italic pr-4">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    {/* Display indicators if AI optimized already */}
                    {item.category === 'AI Optimized' && (
                      <div className="mt-4 sm:ml-16 bg-pink-500/5 border border-[#FFB6C9]/15 rounded-xl px-4 py-2.5 text-[11px] font-mono text-[#FFB6C9] flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" /> AI REWRITE REVISION ACTIVE
                        </span>
                        <span>Converted for higher objection-handling</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* MODAL / SUBSECTION: AI POLISH DRAWER PANEL */}
            {selectedRewriteId && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="wallovo-glass rounded-[32px] max-w-2xl w-full border-[#FFB6C9]/25 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                  {/* Glowing header light line */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9] to-transparent" />
                  
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FFB6C9] animate-pulse" />
                      <h4 className="font-display font-extrabold text-white text-md">Wallovo Copy Optimizer</h4>
                    </div>
                    <button
                      onClick={() => setSelectedRewriteId(null)}
                      className="text-white/40 hover:text-white text-xs font-mono cursor-pointer"
                    >
                      [Close Window]
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-6 text-left">
                    <div>
                      <span className="text-[10px] font-mono text-white/50 block mb-2 uppercase">Input Draft (Client-originated)</span>
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-sans text-white/70 italic leading-relaxed">
                        &ldquo;{tempDraftText}&rdquo;
                      </div>
                    </div>

                    {/* Choose translation structure */}
                    <div>
                      <span className="text-[10px] font-mono text-white/50 block mb-2 uppercase">Copywriting Paradigm Conversion</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'agency', title: 'Agency closer', desc: 'Focuses on ROI & high-ticket authority' },
                          { id: 'saas', title: 'SaaS Builder', desc: 'Optimized for self-serve sign-ups' },
                          { id: 'minimal', title: 'Minimalist Clean', desc: 'Sleek, direct, elegant focus' }
                        ].map((choice) => (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() => setRewriteArchetype(choice.id as any)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              rewriteArchetype === choice.id
                                ? 'bg-[#FFB6C9]/10 border-[#FFB6C9] text-white'
                                : 'bg-white/2 border-white/5 text-brand-soft/60 hover:border-white/10'
                            }`}
                          >
                            <span className="text-xs font-bold block">{choice.title}</span>
                            <span className="text-[9px] text-white/40 leading-tight block mt-1">{choice.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action rewrite and showcase polished outcome */}
                    <div className="space-y-4">
                      <button
                        onClick={handleSimulatePolish}
                        disabled={isPolishing}
                        className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                      >
                        {isPolishing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Recalculating ROI copy structures...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Polish Draft Now</span>
                          </>
                        )}
                      </button>

                      {polishedResult && (
                        <div className="space-y-2 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-pink-300 uppercase">Conversion-optimized Output</span>
                            <span className="text-[9px] font-mono bg-pink-500/10 text-[#FFB6C9] px-2 py-0.5 rounded uppercase">89% confidence</span>
                          </div>
                          <div className="bg-gradient-to-br from-pink-950/20 to-[#0D0D0D] border border-[#FFB6C9]/25 rounded-2xl p-4 text-xs text-white leading-relaxed italic relative">
                            {/* Confetti element glow */}
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFB6C9] animate-ping" />
                            &ldquo;{polishedResult}&rdquo;
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer block */}
                  <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 bg-black/40">
                    <button
                      onClick={() => setSelectedRewriteId(null)}
                      className="text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-white/5 text-white/70 hover:text-white transition-all cursor-pointer"
                    >
                      Dismiss Draft
                    </button>
                    <button
                      onClick={handleApplyPolish}
                      disabled={!polishedResult}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FFB6C9] to-pink-500 text-black font-bold text-xs disabled:opacity-30 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,182,201,0.2)]"
                    >
                      Apply Polish & Render Grid
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB C: FORM DESIGNER */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
            {/* Form Editor configuration (Left) - lg:col-span-4 */}
            <div className="lg:col-span-5 space-y-6">
              <div className="wallovo-glass rounded-[24px] p-6 border-white/5 space-y-5">
                <div className="pb-3 border-b border-white/5">
                  <h4 className="text-sm font-bold text-white">Capture Page Customizer</h4>
                  <p className="text-[11px] text-white/40">Modify client Welcoming values</p>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Welcome Heading Text</label>
                    <input
                      type="text"
                      value={formConfig.welcomeMessage}
                      onChange={(e) => setFormConfig({ ...formConfig, welcomeMessage: e.target.value })}
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FFB6C9]/45 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Target Rating Milestone</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formConfig.starGoal}
                      onChange={(e) => setFormConfig({ ...formConfig, starGoal: parseInt(e.target.value) || 5 })}
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FFB6C9]/45 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Studio Logo Mock URL</label>
                    <input
                      type="text"
                      value={formConfig.brandLogoUrl}
                      onChange={(e) => setFormConfig({ ...formConfig, brandLogoUrl: e.target.value })}
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-mono focus:border-[#FFB6C9]/45 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-white/3 border border-white/5 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Changes here represent active configuration files stored securely in your private cluster cache. Submissions update instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Viewport Live Preview (Right) - lg:col-span-7 */}
            <div className="lg:col-span-7">
              <div className="text-center mb-4">
                <span className="text-[10px] font-mono text-white/40">CUSTOMER-FACING MOBILE SCREEN SIMULATION</span>
              </div>
              
              <div className="bg-black/90 max-w-[340px] mx-auto rounded-[44px] h-[640px] border-[6px] border-white/10 relative p-6 flex flex-col justify-between overflow-y-auto overflow-x-hidden shadow-2xl relative">
                {/* Speaker pill top mock */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-white/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-1 bg-white/20 rounded-full" />
                </div>

                {captureFormSubmitted ? (
                  <div className="my-auto text-center space-y-4 animate-fade-in py-16">
                    <div className="w-12 h-12 bg-pink-500/15 border border-[#FFB6C9]/20 flex items-center justify-center rounded-full mx-auto">
                      <Check className="w-6 h-6 text-[#FFB6C9]" />
                    </div>
                    <div className="space-y-1.5 px-4">
                      <h4 className="text-white font-bold text-sm">Review Submitted!</h4>
                      <p className="text-[11px] text-white/50">Your client love is now processing inside the analytics engine.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLivePreviewSubmit} className="space-y-5 flex flex-col h-full justify-between pt-6 text-left">
                    <div>
                      {/* Logo header */}
                      <div className="text-center mb-6">
                        <img 
                          src={formConfig.brandLogoUrl} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=128&auto=format&fit=crop';
                          }}
                          className="w-10 h-10 rounded-full object-cover mx-auto border border-white/10 mb-2 shadow-md" 
                        />
                        <h5 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Share Your Story</h5>
                        <h4 className="text-sm font-bold text-white mt-1">{formConfig.welcomeMessage}</h4>
                      </div>

                      {/* Name input */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-mono text-white/40 block mb-0.5 uppercase">Full name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Sarah Jenkins"
                            value={livePreviewResponse.name}
                            onChange={(e) => setLivePreviewResponse({ ...livePreviewResponse, name: e.target.value })}
                            className="w-full bg-[#0D0D0D] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-300"
                          />
                        </div>

                        {/* Role and Company */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-mono text-white/40 block mb-0.5 uppercase">Designation</label>
                            <input
                              type="text"
                              placeholder="Product Designer"
                              value={livePreviewResponse.role}
                              onChange={(e) => setLivePreviewResponse({ ...livePreviewResponse, role: e.target.value })}
                              className="w-full bg-[#0D0D0D] border border-[#FFB6C9]/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFB6C9]"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-white/40 block mb-0.5 uppercase">Company</label>
                            <input
                              type="text"
                              placeholder="Stripe"
                              value={livePreviewResponse.company}
                              onChange={(e) => setLivePreviewResponse({ ...livePreviewResponse, company: e.target.value })}
                              className="w-full bg-[#0D0D0D] border border-[#FFB6C9]/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFB6C9]"
                            />
                          </div>
                        </div>

                        {/* Stars */}
                        <div>
                          <label className="text-[9px] font-mono text-white/40 block mb-1 uppercase">Star rating *</label>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <button
                                type="button"
                                key={st}
                                onClick={() => setLivePreviewResponse({ ...livePreviewResponse, rating: st })}
                                className="focus:outline-none"
                              >
                                <Star 
                                  className={`w-4 h-4 cursor-pointer ${
                                    st <= livePreviewResponse.rating 
                                      ? 'fill-[#FFB6C9] stroke-[#FFB6C9]' 
                                      : 'stroke-white/20 fill-transparent'
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Testimony text */}
                        <div>
                          <label className="text-[9px] font-mono text-white/40 block mb-0.5 uppercase">Your Experience *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="We enjoyed the custom widgets..."
                            value={livePreviewResponse.text}
                            onChange={(e) => setLivePreviewResponse({ ...livePreviewResponse, text: e.target.value })}
                            className="w-full bg-[#0D0D0D] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-300 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FFB6C9] to-pink-500 text-black font-bold text-xs shadow-lg"
                      >
                        Submit Testimonial
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB D: PROFILE & INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in text-left">
            {/* Custom Domain setup */}
            <div className="wallovo-glass rounded-[24px] p-8 border-white/5 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Globe className="w-5 h-5 text-[#FFB6C9]" />
                <h4 className="font-display font-extrabold text-white text-md">Brand Custom Subdomain</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-white/50 block mb-1.5 uppercase">Your CNAME target endpoint</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cnameHost}
                      onChange={(e) => setCnameHost(e.target.value)}
                      className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-mono flex-1 focus:outline-none"
                    />
                    <button
                      onClick={handleVerifyDomain}
                      disabled={verifyingDomain || domainVerified}
                      className="px-5 py-3 rounded-xl bg-[#FFB6C9] text-black text-xs font-bold hover:bg-[#FFB6C9]/90 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                    >
                      {verifyingDomain ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Map & Secure'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 bg-black/40 border border-white/5 p-4 rounded-xl text-left font-mono">
                  <span className="text-[9px] text-white/30 uppercase block">RECOMMENDED CLOUD DNS ENTRIES:</span>
                  <div className="grid grid-cols-12 gap-1 text-[10px] text-brand-soft/80">
                    <span className="col-span-3 text-white/40">Record Type</span>
                    <span className="col-span-3 text-white">CNAME</span>
                    <span className="col-span-6" />

                    <span className="col-span-3 text-white/40">Host record</span>
                    <span className="col-span-3 text-white">reviews</span>
                    <span className="col-span-6" />

                    <span className="col-span-3 text-white/40">Target Value</span>
                    <span className="col-span-9 text-[#FFB6C9]">cname.wallovo.com</span>
                  </div>
                </div>

                {/* Verification result visual feedback */}
                {domainVerified ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">Subdomain active!</span>
                      <span className="text-[10px] font-mono text-emerald-400">STATUS: ● SECURED & CONNECTED</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/3 border border-white/5 p-4 rounded-xl flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-white/20" />
                    <span className="text-[11px] text-white/50">Configure DNS to active. SSL certification takes under 60 seconds.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Slack integration module */}
            <div className="wallovo-glass rounded-[24px] p-8 border-white/5 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Slack className="w-5 h-5 text-[#FFB6C9]" />
                <h4 className="font-display font-extrabold text-white text-md">Team Slack Sync</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-white/50 block mb-1.5 uppercase">Slack Webhook endpoint</label>
                  <input
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleTestSlack}
                  disabled={sendingSlackTest}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-3.5 rounded-xl border border-white/5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {sendingSlackTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending notification payload...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#FFB6C9]" />
                      <span>Test Slack Notification payload</span>
                    </>
                  )}
                </button>

                {slackConnected && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">Slack Link operational</span>
                      <span className="text-[10px] font-mono text-emerald-400">Dispatched 1 test webhook</span>
                    </div>
                  </div>
                )}

                {/* Animated Floating Notification Overlay Simulation */}
                {showSlackNotice && (
                  <div className="bg-neutral-900 border border-white/10 rounded-xl p-3 shadow-2xl flex items-start gap-3 animate-bounce">
                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#36C5F0] to-[#E01E5A] flex items-center justify-center text-white font-mono text-xs shrink-0">
                      S
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white/90">Slack App Notification Sandbox</span>
                      <p className="text-[10px] text-white/60 mt-0.5 leading-tight">
                        💬 <span className="text-pink-300 font-semibold font-mono">#testimonials-channel</span> : New 5-star review submitted by <span className="font-bold">Alex Sterling</span> mapped successfully.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
