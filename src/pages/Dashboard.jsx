import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, CheckCircle, Info, X, Star, Link as LinkIcon, Copy, ExternalLink, 
  User, Mail, ArrowRight, Table, LogOut, Check, Sliders, AlertCircle,
  Clock, ShieldAlert, BadgeCheck, MessageSquare, Hourglass, Trash2, Home,
  Search, BarChart3, Inbox, Layers, Settings, Globe, RefreshCw, Send, Plus, Filter, Menu
} from 'lucide-react';
import { supabase, clearSessionAndSignOut } from '../lib/supabase';
import '../../src/index.css';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  
  // Navigation
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Interactive UI Feedbacks
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Settings State Form
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Database error states to display detailed setup guide
  const [dbError, setDbError] = useState(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  console.log("[Dashboard.jsx] Hook initialization - States:", {
    session,
    loading,
    userProfile,
    testimonialsCount: testimonials.length,
    filter,
    dbError,
    showSqlGuide
  });

  const username = userProfile?.username || 'operator';
  const collectionLink = `${window.location.origin}/collect/${username}`;

  // Load active session and bootstrap user data
  useEffect(() => {
    console.log("[Dashboard.jsx] Mount useEffect triggered");
    async function initDashboard() {
      console.log("[Dashboard.jsx] initDashboard started");
      try {
        const { data: { session: activeSession }, error: sessionErr } = await supabase.auth.getSession();
        console.log("[Dashboard.jsx] getSession response received:", { activeSession, sessionErr });
        
        if (sessionErr || !activeSession) {
          console.warn("[Dashboard.jsx] Unauthorized access. Redirecting to login portal...");
          window.location.href = '/login.html';
          return;
        }

        setSession(activeSession);
        
        // Fetch or create profile & testimonials
        console.log("[Dashboard.jsx] Fetching user profile & testimonials...");
        await loadUserData(activeSession);
      } catch (err) {
        console.error("[Dashboard.jsx] Dashboard mount execution error:", err);
        window.location.href = '/login.html';
      } finally {
        console.log("[Dashboard.jsx] Setting loading to false");
        setLoading(false);
      }
    }

    initDashboard();

    // Setup listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_OUT' || !currentSession) {
        window.location.href = '/login.html';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (activeSession) => {
    const user = activeSession.user;
    const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
    
    try {
      // 1. Fetch user profile from custom profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      let profile = data;

      // 2. Generate and save if missing
      if (!profile) {
        const baseUsername = fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client';
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        let finalUsername = `${baseUsername}${randomSuffix}`;

        // Verify uniqueness
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', finalUsername)
          .maybeSingle();

        if (existingUser) {
          finalUsername = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const link = `${window.location.origin}/collect/${finalUsername}`;
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            username: finalUsername,
            collection_link: link
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }
        profile = newProfile;
        triggerNotification("Your unique collection URL was generated and stored securely.");
      }

      setUserProfile(profile);
      setEditFullName(profile?.full_name || '');
      setEditUsername(profile?.username || '');

      // 3. Fetch user's testimonials
      const { data: tList, error: tErr } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tErr) {
        throw tErr;
      }

      setTestimonials(tList || []);
      setDbError(null);
    } catch (err) {
      console.error("[Database Connection Issue]", err);
      setDbError(err.message || String(err));
      triggerNotification("Database synchronisation failure: " + (err.message || String(err)), "error");
    }
  };

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4550);
  };

  const handleCopyLink = () => {
    if (!collectionLink) return;
    navigator.clipboard.writeText(collectionLink);
    setCopied(true);
    triggerNotification("Copied collection link to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await clearSessionAndSignOut();
      window.location.href = '/index.html';
    } catch (err) {
      window.location.href = '/index.html';
    }
  };

  // Manage testimonial status
  const handleUpdateStatus = async (id, newStatus) => {
    if (id.startsWith('mock-')) {
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      triggerNotification(`Testimonial status updated to ${newStatus}!`);
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      triggerNotification(`Testimonial status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Status update failed:", err);
      triggerNotification("Failed to update status. Please try again.", "error");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (id.startsWith('mock-')) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      triggerNotification("Testimonial removed.");
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTestimonials(prev => prev.filter(t => t.id !== id));
      triggerNotification("Testimonial successfully deleted.");
    } catch (err) {
      console.error("Deletion failed:", err);
      triggerNotification("Failed to delete testimonial.", "error");
    }
  };

  // Quick submit diagnostic mock
  const handleAddDiagnosticReview = async () => {
    if (!session || !userProfile) return;
    setSubmittingTest(true);
    
    const sampleNames = ['Sasha Croft', 'Tyler Vance', 'Olivia Sterling', 'Brooke Montgomery', 'Elijah Vance', 'Amara Patel'];
    const sampleEmails = ['sasha@croftlabs.com', 'tyler@vance.io', 'olivia@sterling.co', 'b.montgomery@saaswave.com', 'elijah@vance.io', 'amara@patel.co'];
    const sampleTexts = [
      'Wallovo dashboard makes aggregating our user metrics incredibly elegant. We saw direct list lifts in hours.',
      'The custom micro-interactions are marvelous. This is authentic social proof in exquisite form.',
      'A flawless, clean layout that pairs gracefully with any dark SaaS theme out of the box!',
      'Fast, minimal, and fully mobile responsive. Submitting this testimonial was a delightful breeze.',
      'Incredible performance and beautiful typography throughout. Setup took literally seconds.',
      'We replaced our legacy reviews provider and immediately boosted checkout page confidence. Beautiful layout!'
    ];

    const idx = Math.floor(Math.random() * sampleNames.length);

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          user_id: session.user.id,
          customer_name: sampleNames[idx],
          customer_email: sampleEmails[idx],
          testimonial_text: sampleTexts[idx],
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setTestimonials(prev => [data, ...prev]);
      triggerNotification(`Success! Real review from ${sampleNames[idx]} created.`);
    } catch (err) {
      console.warn("Database save failed. Saving to reactive state instead:", err);
      
      // Offline fallback creation in case table is missing
      const dummyReview = {
        id: `mock-${Date.now()}`,
        customer_name: sampleNames[idx],
        customer_email: sampleEmails[idx],
        testimonial_text: sampleTexts[idx],
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setTestimonials(prev => [dummyReview, ...prev]);
      triggerNotification(`Mock review submitted for ${sampleNames[idx]} successfully!`);
    } finally {
      setSubmittingTest(false);
    }
  };

  // Update business profile
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!editFullName.trim() || !editUsername.trim()) {
      triggerNotification("Fields cannot be blank.", "error");
      return;
    }

    setIsSavingSettings(true);
    try {
      const updatedUsername = editUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dynamicLink = `${window.location.origin}/collect/${updatedUsername}`;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editFullName.trim(),
          username: updatedUsername,
          collection_link: dynamicLink
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setUserProfile({
        ...userProfile,
        full_name: editFullName.trim(),
        username: updatedUsername,
        collection_link: dynamicLink
      });

      triggerNotification("Workspace configuration saved successfully.");
    } catch (err) {
      console.error("Failed to update profile settings:", err);
      triggerNotification("Failed to update settings: " + (err.message || String(err)), "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-slate-100 font-sans">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-[#00E5FF] select-none animate-pulse font-mono">Establishing Secure Console Handshake...</p>
      </div>
    );
  }

  // Calculate statistics using real Supabase data
  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
  };

  // Apply search query first and then render list
  const filteredTestimonials = testimonials.filter(t => {
    const isMatchingStatus = filter === 'all' || t.status === filter;
    const bodyStr = `${t.customer_name} ${t.customer_email} ${t.testimonial_text}`.toLowerCase();
    const isMatchingSearch = bodyStr.includes(searchQuery.toLowerCase());
    return isMatchingStatus && isMatchingSearch;
  });

  const recentTestimonials = testimonials.slice(0, 5);

  const sidebarItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Testimonials', icon: Inbox, count: stats.pending > 0 ? stats.pending : null },
    { name: 'Collections', icon: Layers },
    { name: 'Widgets', icon: Sliders },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings }
  ];

  const userInitials = (userProfile?.full_name || 'Operator').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const schemaSql = `-- 1. CREATE USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE NOT NULL,
  collection_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CREATE TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  testimonial_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans flex flex-col md:flex-row relative">
      
      {/* Dynamic Toast Notifications */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className="bg-zinc-950/95 border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.25)] relative pr-10 max-w-sm">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#00E5FF]" />
            <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/20 shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-[#00E5FF]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] font-bold text-white tracking-wider block uppercase">SYSTEM MESSAGE</span>
              <p className="text-[11px] text-slate-300 pr-2">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MOBILE HEADER BUTTON BAR */}
      <div className="md:hidden flex items-center justify-between border-b border-zinc-900 bg-zinc-950 p-4 h-16 w-full shrink-0 z-30">
        <a href="/index.html" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
          <span className="text-sm font-bold tracking-tighter text-white font-mono">Wallovo AI</span>
        </a>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-zinc-900 rounded-lg text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT SIDEBAR - Collapsible on Mobile, Persistent on Desktop */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:static inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out h-full shrink-0
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Logo & Headline */}
          <div className="p-6 border-b border-zinc-900/60 hidden md:block">
            <a href="/index.html" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:rotate-180 transition-transform duration-500" />
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white font-mono leading-none">Wallovo</span>
                <span className="text-[9px] text-[#00E5FF] font-semibold tracking-widest uppercase mt-1 font-mono">SOCIAL PROOF OS</span>
              </div>
            </a>
          </div>

          <div className="p-6 border-b border-zinc-900/60 md:hidden flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">CONSOLES NAVIGATION</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-grow">
            {sidebarItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-900 text-[#00E5FF] font-semibold border-l-2 border-cyan-400 pl-3.5 shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-[#00E5FF]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono rounded-md font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Connected User Summary Block */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-950/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/20 text-[#00E5FF] flex items-center justify-center text-xs font-bold font-mono">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white block truncate">{userProfile?.full_name || 'Operator'}</span>
                <span className="text-[10px] text-zinc-500 block truncate font-mono">{session?.user?.email || 'authenticated'}</span>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-zinc-900/60 hover:bg-red-950/20 text-slate-400 hover:text-red-400 border border-zinc-800/80 hover:border-red-500/25 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Console</span>
            </button>
          </div>

        </div>
      </aside>

      {/* MAIN DATA STREAM STREAMING CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-black">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-zinc-900 px-6 flex items-center justify-between bg-zinc-950/30 backdrop-blur-sm sticky top-0 z-20 shrink-0">
          
          {/* Search bar inputs */}
          <div className="relative w-72 max-w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Filter customer names, emails, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-1.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500/40 rounded-full text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0 transition-all font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User Profile + Plan badge elements */}
          <div className="flex items-center gap-4">
            {/* Plan Badge */}
            <span className="bg-cyan-950/60 border border-cyan-500/30 text-[#00E5FF] text-[10px] font-bold font-mono px-3 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.15)] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00E5FF] animate-pulse" />
              <span>PRO MERCHANT</span>
            </span>

            {/* Profile widget bar */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-zinc-800">
              <div className="text-right">
                <span className="text-xs font-bold text-white block leading-none">{userProfile?.full_name || 'Operator'}</span>
                <span className="text-[9px] text-[#00E5FF] font-mono block mt-1 uppercase">verified host</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-950 to-zinc-900 border border-cyan-500/20 text-xs font-bold font-mono text-cyan-400 flex items-center justify-center">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* CONTAINER CONTENT WRAPPER */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* DATABASE MISALIGNMENT FLOATING ALERT */}
          {dbError && (
            <div className="bg-zinc-950 border border-cyan-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00E5FF]" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold font-mono uppercase tracking-widest">Local Sandbox Cache Online</span>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl font-mono">
                  Your profiles/testimonials custom tables are currently run on sandbox. Execute the SQL command schema layout inside the Supabase Console dashboard to establish live persistent schema storage pools.
                </p>
              </div>
              <button
                onClick={() => setShowSqlGuide(!showSqlGuide)}
                className="bg-[#00E5FF] hover:bg-cyan-400 text-black font-semibold font-mono text-xs px-4 py-2 rounded-xl transition duration-200 shrink-0 select-none cursor-pointer"
              >
                {showSqlGuide ? "Hide Setup Document" : "Show Setup Document"}
              </button>
            </div>
          )}

          {/* DETAILED SQL SCHEMA GUIDE */}
          {showSqlGuide && (
            <div className="bg-zinc-950 border border-[#00E5FF]/20 rounded-2xl p-6 space-y-4 animate-fade-in text-left">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00E5FF]" /> SQL Schema Setup Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Execute the following layout structure in the SQL Editor section of your Supabase dashboard workspace directly:
              </p>
              <pre className="p-4 bg-black border border-zinc-900 rounded-xl text-[10.5px] text-emerald-400 font-mono overflow-x-auto whitespace-pre leading-relaxed select-all">
                {schemaSql}
              </pre>
            </div>
          )}

          {/* ACTIVE TAB VIEWS */}

          {/* VIEW: DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* COMPACT COLLECTION LINK CARD */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />
                <div className="space-y-1 max-w-xl">
                  <span className="text-[9px] font-bold font-mono tracking-widest text-[#00E5FF] bg-cyan-950/40 border border-cyan-500/25 px-2.5 py-0.5 rounded-full uppercase">
                    ACTIVE SOURCE CHANNEL
                  </span>
                  <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mt-2">
                    <LinkIcon className="w-4 h-4 text-cyan-400" /> Share Testimonial Collection Link
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Any feedback clients record on this public channel automatically synchronizes right here in your active social proof dashboard telemetry instantly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black border border-zinc-900 p-2 rounded-xl lg:min-w-[450px]">
                  <div className="flex-1 flex items-center px-3 py-2 min-h-[38px] truncate">
                    <span className="text-xs font-mono text-cyan-400 select-all truncate font-medium">
                      {userProfile ? collectionLink : 'Generating link...'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 sm:flex-initial bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-[11px] px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={collectionLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/30 text-white font-bold font-mono text-[11px] px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Link</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* KPI CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Total Testimonials */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 pt-full h-full bg-[#00E5FF] opacity-35" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Total Testimonials</span>
                    <div className="w-7 h-7 rounded-lg bg-cyan-950/40 flex items-center justify-center border border-cyan-500/10">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-white font-mono mt-3">{stats.total}</div>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">Real-time cumulative review logs</p>
                </div>

                {/* Pending Approval */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 pt-full h-full bg-amber-500 opacity-35" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Pending Approval</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-950/40 flex items-center justify-center border border-amber-500/10">
                      <Hourglass className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-amber-400 font-mono mt-3">{stats.pending}</div>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">Awaiting administrative validation</p>
                </div>

                {/* Approved Streams */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 pt-full h-full bg-emerald-500 opacity-35" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Approved & Published</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-950/40 flex items-center justify-center border border-emerald-500/10">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-emerald-400 font-mono mt-3">{stats.approved}</div>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">Live on widgets & conversion embeds</p>
                </div>

              </div>

              {/* RECENT TESTIMONIALS TABLE */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6">
                
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Table className="w-4 h-4 text-cyan-400" /> Recent Testimonial Submissions
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">Most recent logs synchronized from collectors</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('Testimonials')}
                      className="px-3.5 py-1.5 border border-zinc-800 hover:border-cyan-500/30 rounded-lg text-[10px] font-mono text-slate-400 hover:text-white transition duration-200 cursor-pointer"
                    >
                      View All Logs
                    </button>
                    <button
                      onClick={handleAddDiagnosticReview}
                      disabled={submittingTest}
                      className="px-3.5 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-mono text-[10px] font-bold rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{submittingTest ? 'Adding...' : 'Demo Review'}</span>
                    </button>
                  </div>
                </div>

                {recentTestimonials.length === 0 ? (
                  <div className="text-center py-12 bg-black/40 rounded-xl border border-dashed border-zinc-900">
                    <MessageSquare className="w-7 h-7 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-mono text-slate-500 font-bold mb-1">No testimonals submitted yet</p>
                    <p className="text-[10px] text-slate-600 font-mono">Click the "+ Insert Demo Review" buttons to inspect layout behavior</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Message</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold">Date</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {recentTestimonials.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-900/10 transition duration-150 group">
                            
                            {/* CUSTOMER */}
                            <td className="py-4 pr-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/25 text-[#00E5FF] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                  {item.customer_name?.charAt(0).toUpperCase() || 'C'}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-semibold text-white block truncate max-w-[150px]">{item.customer_name}</span>
                                  <span className="text-[10px] text-slate-400 block truncate font-mono max-w-[150px]">{item.customer_email}</span>
                                </div>
                              </div>
                            </td>

                            {/* TESTIMONIAL TEXT */}
                            <td className="py-4 px-3 max-w-sm">
                              <p className="text-xs text-slate-300 line-clamp-2 italic font-sans leading-relaxed">
                                &ldquo;{item.testimonial_text}&rdquo;
                              </p>
                            </td>

                            {/* STATUS */}
                            <td className="py-4 px-3">
                              <span className={`inline-flex items-center px-2 py-0.5 font-mono text-[9px] uppercase font-bold rounded-md ${
                                item.status === 'approved' 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                              }`}>
                                {item.status}
                              </span>
                            </td>

                            {/* DATE */}
                            <td className="py-4 px-3">
                              <span className="text-[10px] font-mono text-slate-500">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </td>

                            {/* ACTIONS */}
                            <td className="py-4 pl-3 text-right">
                              <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition duration-150">
                                {item.status !== 'approved' ? (
                                  <button
                                    onClick={() => handleUpdateStatus(item.id, 'approved')}
                                    className="bg-emerald-500/10 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_10px_rgba(16,185,129,0.25)] text-emerald-450 border border-emerald-500/20 text-[10px] font-mono font-bold px-2 py-1 rounded"
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateStatus(item.id, 'pending')}
                                    className="bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-450 border border-amber-500/20 text-[10px] font-mono font-bold px-2 py-1 rounded"
                                  >
                                    Set Pending
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    if (confirm("Permanently archive this submission?")) {
                                      handleDeleteTestimonial(item.id);
                                    }
                                  }}
                                  className="p-1 px-1.5 bg-zinc-900 hover:bg-red-950/20 hover:border-red-500/30 text-rose-400 rounded-md border border-zinc-805 transition duration-150"
                                  title="Delete review"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* VIEW: TESTIMONIALS (DETAILED INBOX MODERATION) */}
          {activeTab === 'Testimonials' && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6 animate-fade-in text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div>
                  <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Table className="w-4.5 h-4.5 text-[#00E5FF]" /> Submission Stream Moderation Inbox
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Search, toggle status, or wipe customer experiences</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 text-[10px] uppercase font-mono font-bold rounded-lg transition-all cursor-pointer ${filter === 'all' ? 'bg-[#00E5FF] text-black' : 'bg-black text-slate-400 border border-zinc-800 hover:text-white'}`}
                  >
                    All ({testimonials.length})
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1.5 text-[10px] uppercase font-mono font-bold rounded-lg transition-all cursor-pointer ${filter === 'pending' ? 'bg-amber-400 text-black' : 'bg-black text-slate-400 border border-zinc-800 hover:text-white'}`}
                  >
                    Pending ({testimonials.filter(t => t.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setFilter('approved')}
                    className={`px-3 py-1.5 text-[10px] uppercase font-mono font-bold rounded-lg transition-all cursor-pointer ${filter === 'approved' ? 'bg-emerald-400 text-black' : 'bg-black text-slate-400 border border-zinc-800 hover:text-white'}`}
                  >
                    Approved ({testimonials.filter(t => t.status === 'approved').length})
                  </button>

                  <button
                    onClick={handleAddDiagnosticReview}
                    disabled={submittingTest}
                    className="px-3 py-1.5 bg-zinc-900 border border-dashed border-cyan-800/60 hover:border-cyan-400 text-[#00E5FF] text-[10px] font-mono rounded-lg transition-all duration-205 cursor-pointer disabled:opacity-55 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{submittingTest ? 'Simulating...' : 'Insert Demo'}</span>
                  </button>
                </div>
              </div>

              {/* LIST RESPONSE */}
              {filteredTestimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-black/40 rounded-xl border border-dashed border-zinc-900">
                  <MessageSquare className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-xs font-mono text-slate-400 font-bold mb-1">No testimonals match search filters</p>
                  <p className="text-[11px] text-slate-500 font-mono">Submit reviews on your public capture page or add random ones above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTestimonials.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-black/40 border border-zinc-900 hover:border-cyan-500/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4 transition-all duration-200"
                    >
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500/20 flex items-center justify-center font-mono text-xs text-cyan-400 font-bold shrink-0">
                            {item.customer_name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                              {item.customer_name} 
                              {item.id.toString().startsWith('mock-') && (
                                <span className="text-[8px] bg-zinc-900 font-bold text-[#00E5FF] px-1.5 py-0.5 rounded border border-zinc-800 font-mono">SANDBOX</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" /> {item.customer_email}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 italic pl-3 leading-relaxed border-l-2 border-cyan-500/40 pr-4 py-0.5">
                          &ldquo;{item.testimonial_text}&rdquo;
                        </p>

                        <div className="flex items-center gap-2.5 text-[9px] uppercase font-mono text-slate-500">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>Submitted UTC {new Date(item.created_at).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Control Panel Actions */}
                      <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 w-full md:w-auto self-stretch md:self-auto pt-3 md:pt-0 border-t md:border-t-0 border-zinc-900 shrink-0">
                        
                        <span className={`px-2 py-0.5 font-mono font-bold text-[9px] uppercase rounded-md ${
                          item.status === 'approved' 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                        }`}>
                          {item.status}
                        </span>

                        <div className="flex items-center gap-2">
                          {item.status !== 'approved' ? (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'approved')}
                              className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-semibold font-mono text-[10px] uppercase px-2.5 py-1.5 rounded-lg border border-emerald-500/20 transition duration-150 cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'pending')}
                              className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-semibold font-mono text-[10px] uppercase px-2.5 py-1.5 rounded-lg border border-amber-500/20 transition duration-150 cursor-pointer"
                            >
                              Set Pending
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm("Delete this submission permanently?")) {
                                handleDeleteTestimonial(item.id);
                              }
                            }}
                            className="bg-zinc-900 border border-zinc-800 hover:border-red-500/30 text-rose-400 hover:bg-red-950/20 p-2 rounded-lg transition"
                            title="Delete submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* VIEW: COLLECTIONS */}
          {activeTab === 'Collections' && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Layers className="w-4.5 h-4.5 text-[#00E5FF]" /> Public Landing Collections
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Secure, lightweight public landing templates representing client entry gates</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Visual template mock 1 */}
                <div className="bg-black/40 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00E5FF] font-bold block bg-cyan-950/40 p-1.5 rounded">MODE: CLASSIC GRAPHITE</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white font-mono">Standard Collection Gateway</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Includes verification validation checks, customer avatar initial generation, custom email records, and real-time backend updates.
                  </p>
                  <a
                    href={collectionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-zinc-900 px-3.5 py-1.5 text-xs font-mono text-cyan-400 hover:bg-zinc-800 rounded-lg transition"
                  >
                    View active page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Video / Rich media collector description */}
                <div className="bg-black/40 border border-zinc-950 rounded-xl p-5 space-y-4 relative opacity-85">
                  <span className="absolute top-2 right-2 text-[9px] font-mono bg-zinc-900 text-slate-500 px-2 py-0.5 rounded uppercase font-semibold">Enterprise</span>
                  <div className="flex items-center gap-2 text-amber-500">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Video Proof Gates</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-mono">Async Video Recorder Widget</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Allow buyers to directly record camera testimonies directly within client web browser environments seamlessly. Supports stream transcript parsing.
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 italic block">Available soon on Growth and Enterprise tiers</span>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: WIDGETS */}
          {activeTab === 'Widgets' && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-[#00E5FF]" /> Web Widgets Builder
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Generate beautiful responsive layout frame containers for your website landing page</p>
              </div>

              <div className="bg-black/40 border border-zinc-900 rounded-xl p-6 space-y-4">
                <span className="text-[9px] font-bold font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded">HTML EMBED SOURCE SNIPPET</span>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Embed custom client testimonial grids or tickers into your landing pages or CRM workflows by copying the sandbox template iframe block directly:
                </p>

                <div className="bg-black p-4 rounded-xl border border-zinc-900 relative">
                  <pre className="text-[10.5px] text-emerald-400 font-mono overflow-x-auto select-all p-1 leading-relaxed">
                    {`<iframe 
  src="${window.location.origin}" 
  width="100%" 
  height="700px" 
  style="border: none; background: transparent;"
  referrerpolicy="no-referrer"
></iframe>`}
                  </pre>
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Configured to automatically query approved submissions under your account ID seamlessly</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ANALYTICS */}
          {activeTab === 'Analytics' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Simulated engagement indexes */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">Trust Clickthrough Index (7d)</h3>
                      <p className="text-[11px] text-slate-500 font-mono">Measured as interactive plays, clicks, and page viewport intersections</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#00E5FF] bg-cyan-950/40 p-1.5 border border-cyan-500/20 rounded">Telemetry Live</span>
                  </div>

                  <div className="h-44 w-full flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 500 150">
                      <defs>
                        <linearGradient id="an-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#000" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,150 L0,90 C50,110 100,50 150,65 C200,80 250,120 300,100 C350,80 400,20 450,30 C480,35 490,20 500,10 L500,150 Z"
                        fill="url(#an-grad)"
                      />
                      <path
                        d="M0,90 C50,110 100,50 150,65 C200,80 250,120 300,100 C350,80 400,20 450,30 C480,35 490,20 500,10"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="2.5"
                      />
                      <circle cx="150" cy="65" r="4" fill="#000" stroke="#00E5FF" strokeWidth="2" />
                      <circle cx="300" cy="100" r="4" fill="#000" stroke="#00E5FF" strokeWidth="2" />
                      <circle cx="450" cy="30" r="4" fill="#000" stroke="#00E5FF" strokeWidth="2" />
                    </svg>
                  </div>
                  
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Monday</span>
                    <span>Wednesday</span>
                    <span>Friday</span>
                    <span>Sunday (Active)</span>
                  </div>
                </div>

                {/* Distribution ratios */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white font-mono">Submission Rating Spread</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Distribution profile of collected customer feedback scores</p>

                  <div className="space-y-4 pt-2">
                    {[
                      { stars: 5, score: 92 },
                      { stars: 4, score: 8 },
                      { stars: 3, score: 0 },
                      { stars: 2, score: 0 },
                      { stars: 1, score: 0 }
                    ].map((item) => (
                      <div key={item.stars} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="flex items-center gap-1 text-slate-200">
                            {item.stars} <Star className="w-3.5 h-3.5 fill-[#00E5FF] stroke-[#00E5FF]" />
                          </span>
                          <span className="text-slate-400">
                            {item.score}% of assets ({testimonials.length ? Math.round((stats.total * item.score)/100) : 0})
                          </span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#00E5FF] h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6 animate-fade-in text-left">
              
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Settings className="w-4.5 h-4.5 text-[#00E5FF]" /> Workspace Settings
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Customize your profile metadata information, username route segment, and details</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 max-w-xl">
                
                {/* Account details email */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1 uppercase tracking-wider font-bold">Secure Account Email</label>
                  <input
                    type="text"
                    value={session?.user?.email || 'N/A'}
                    disabled
                    className="w-full bg-black/40 border border-zinc-900/60 rounded-xl px-4 py-3 text-xs text-slate-400 font-mono cursor-not-allowed opacity-80"
                  />
                </div>

                {/* Display Full Name */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1 uppercase tracking-wider font-bold">Business / Merchant Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 focus:border-cyan-500/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-0 transition"
                    placeholder="E.g. Croft Labs Co"
                  />
                </div>

                {/* Business Username segment */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1 uppercase tracking-wider font-bold">Collector Username Path Segment</label>
                  <div className="flex items-stretch gap-2">
                    <span className="bg-zinc-900 border border-zinc-800 text-slate-500 flex items-center px-4 rounded-xl text-xs font-mono select-none">
                      /collect/
                    </span>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full bg-black border border-zinc-800 focus:border-cyan-500/40 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:ring-0 transition"
                      placeholder="operator"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed">
                    Updates your unique landing collection link endpoint immediately. Do not use special characters or spaces.
                  </p>
                </div>

                {/* Domain mapping descriptor informational card */}
                <div className="bg-black/40 border border-zinc-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Custom Domain Setup (CNAME)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    Map reviews to your own domain (e.g. <code className="text-cyan-400 font-mono">reviews.yourdomain.com</code>) by creating a CNAME record on yourDNS provider pointing to <code className="text-cyan-400 font-mono">wallovo.ingress.run</code>. Contact business support to secure SSL key handshakes.
                  </p>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold font-mono text-xs px-6 py-3 rounded-xl transition duration-200 cursor-pointer active:scale-95"
                >
                  {isSavingSettings ? "Syncing configs..." : "Save Configuration Update"}
                </button>

              </form>
            </div>
          )}

        </main>

        {/* CONTAINER FOOTER ELEMENT */}
        <footer className="w-full px-6 py-6 border-t border-zinc-900 text-white/25 text-[9px] uppercase tracking-[0.2em] font-mono flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/20 shrink-0">
          <span>&copy; 2026 Wallovo AI Labs</span>
          <div className="flex gap-4 sm:gap-6">
            <span>Terminal: Node-Active</span>
            <span>Auth: Sync</span>
          </div>
        </footer>

      </div>

    </div>
  );
}

// Render root check
const container = document.getElementById('dashboard-root');
if (container) {
  const root = createRoot(container);
  root.render(<Dashboard />);
}
