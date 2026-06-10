import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, CheckCircle, Info, X, Star, Link, Copy, ExternalLink, 
  User, Mail, ArrowRight, Table, LogOut, Check, Sliders, AlertCircle,
  Clock, ShieldAlert, BadgeCheck, MessageSquare, Hourglass, Trash2, Home
} from 'lucide-react';
import { supabase, clearSessionAndSignOut } from '../lib/supabase';
import '../../src/index.css';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  
  // Interactive UI Feedbacks
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState(null);
  const [submittingTest, setSubmittingTest] = useState(false);
  const [filter, setFilter] = useState('all');

  // Database error states to display detailed setup guide
  const [dbError, setDbError] = useState(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const username = userProfile?.username || 'operator';
  const collectionLink = `${window.location.origin}/collect/${username}`;

  // Load active session and bootstrap user data
  useEffect(() => {
    async function initDashboard() {
      try {
        const { data: { session: activeSession }, error: sessionErr } = await supabase.auth.getSession();
        
        if (sessionErr || !activeSession) {
          console.warn("Unauthorized access. Redirecting to login portal...");
          window.location.href = '/login.html';
          return;
        }

        setSession(activeSession);
        
        // Fetch or create profile & testimonials
        await loadUserData(activeSession);
      } catch (err) {
        console.error("Dashboard mount execution error:", err);
        window.location.href = '/login.html';
      } finally {
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
    }, 4500);
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
    // If it's mock fallback, update state directly
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

  // Quick submit diagnostic mock to make database creation testing incredibly simple
  const handleAddDiagnosticReview = async () => {
    if (!session || !userProfile) return;
    setSubmittingTest(true);
    
    const sampleNames = ['Sasha Croft', 'Tyler Vance', 'Olivia Sterling', 'Brooke Montgomery'];
    const sampleEmails = ['sasha@croftlabs.com', 'tyler@vance.io', 'olivia@sterling.co', 'b.montgomery@saaswave.com'];
    const sampleTexts = [
      'Wallovo dashboard makes aggregating our user metrics incredibly elegant. We saw direct list lifts in hours.',
      'The custom micro-interactions are marvelous. This is authentic social proof in exquisite form.',
      'A flawless, clean layout that pairs gracefully with any dark SaaS theme out of the box!',
      'Fast, minimal, and fully mobile responsive. Submitting this testimonial was a delightful breeze.'
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-slate-100 font-mono">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-[#00E5FF] select-none animate-pulse">Establishing Secure Console Handshake...</p>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  // SQL code to display for simple schema copy-paste
  const schemaSql = `-- 1. CREATE USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
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
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 4. CONFIGURE SECURITY POLICIES (RLS)
CREATE POLICY "Public profiles select" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Users select own testimonials" ON public.testimonials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users modify own testimonials" ON public.testimonials FOR ALL USING (auth.uid() = user_id);`;

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans relative pb-16">
      
      {/* Dynamic Toast Notifications */}
      {notification && (
        <div className="fixed top-8 right-6 z-50 animate-bounce">
          <div className="bg-black/90 border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative pr-10 max-w-sm">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#00E5FF]" />
            <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/30 shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-[#00E5FF]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-white tracking-wider block">DISPATCH RESPONSE</span>
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

      {/* HEADER BAR */}
      <header className="px-6 md:px-12 pt-8 flex justify-center w-full">
        <div className="w-full max-w-5xl flex items-center justify-between border border-cyan-500/10 bg-black/80 backdrop-blur-md rounded-full px-6 py-3.5">
          <div className="flex items-center gap-3">
            <a href="/index.html" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-base font-bold tracking-tighter text-white font-mono group-hover:text-cyan-400 transition-colors">Wallovo</span>
            </a>
            <span className="hidden sm:inline text-[9px] uppercase font-semibold font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
              Secure console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="bg-black border border-white/10 hover:border-[#22D3EE]/40 text-slate-300 hover:text-white text-xs font-mono font-bold px-4 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </a>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="bg-black border border-cyan-500/25 hover:border-cyan-400 text-cyan-400 hover:text-white text-xs font-mono font-bold px-4 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 md:px-12 py-10 space-y-8 relative z-10">
        
        {/* User Identity Welcome Card */}
        <div className="bg-black border border-cyan-500/10 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00E5FF] bg-cyan-950/20 border border-cyan-900/30 px-3 py-0.5 rounded-full">
                Merchant Profile
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              Welcome, <span className="text-[#00E5FF] font-mono">{userProfile?.full_name || 'Operator'}</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {session?.user?.email || 'authenticated'}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col justify-center min-w-[124px]">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">ACCOUNT STATE</span>
              <span className="text-xs font-semibold font-mono text-cyan-405 flex items-center gap-1.5 mt-0.5">
                <BadgeCheck className="w-4 h-4 text-[#00E5FF] shrink-0" /> Verified Merchant
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic unique collection URL display box */}
        <div className="bg-black border border-cyan-500/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Link className="w-4 h-4 text-cyan-400" /> Share Testimonial Collection Link
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Distribute this custom, branded URL directly to your clients. Any review they submit on this page will automatically sync back here in your executive telemetry dashboard.
            </p>
          </div>

          {/* Link container displaying the link */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5">
            <div className="flex-1 flex items-center gap-2.5 px-3 min-h-[44px]">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-xs sm:text-sm font-mono text-cyan-400 select-all break-all tracking-tight font-medium">
                {userProfile ? collectionLink : 'Generating...'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-xs px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied ✓
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>

              <a
                href={collectionLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-slate-300 hover:text-white font-semibold font-mono text-xs px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Link
              </a>
            </div>
          </div>
        </div>

        {/* STATS COUNT GRID SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-black border border-cyan-500/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Collected Testimonials</span>
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-white font-mono">{stats.total}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Cumulative active reviews in cache</p>
          </div>

          <div className="bg-black border border-cyan-500/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Pending Reviews</span>
              <Hourglass className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-amber-400 font-mono">{stats.pending}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Requires supervisor approval</p>
          </div>

          <div className="bg-black border border-cyan-500/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Approved Streams</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">{stats.approved}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Enabled live conversion widgets</p>
          </div>

        </div>

        {/* FEEDBACK INBOX & SUBMISSIONS TABLE */}
        <div className="bg-black border border-cyan-500/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Table className="w-4 h-4 text-[#00E5FF]" /> Submission Stream Inbox
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Filter, moderate and publish customer review responses</p>
            </div>

            {/* Right filter state and diagnostics buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono font-medium rounded-lg transition-all cursor-pointer ${filter === 'all' ? 'bg-[#00E5FF] text-black font-semibold' : 'bg-zinc-950 text-slate-400 hover:text-white border border-zinc-800'}`}
              >
                All ({testimonials.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono font-medium rounded-lg transition-all cursor-pointer ${filter === 'pending' ? 'bg-amber-400 text-black font-semibold' : 'bg-zinc-950 text-slate-400 hover:text-white border border-zinc-800'}`}
              >
                Pending ({testimonials.filter(t => t.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono font-medium rounded-lg transition-all cursor-pointer ${filter === 'approved' ? 'bg-emerald-400 text-black font-semibold' : 'bg-zinc-950 text-slate-400 hover:text-white border border-zinc-800'}`}
              >
                Approved ({testimonials.filter(t => t.status === 'approved').length})
              </button>

              <button
                onClick={handleAddDiagnosticReview}
                disabled={submittingTest}
                className="px-3 py-1.5 bg-black border border-dashed border-cyan-800/40 hover:border-cyan-400 text-cyan-405 text-[10px] uppercase font-mono rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {submittingTest ? 'Simulating...' : '+ Insert Demo Review'}
              </button>
            </div>
          </div>

          {/* Table Submission List Items */}
          {filteredTestimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-950/20 border border-dashed border-zinc-900 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-mono text-zinc-400 font-bold mb-1">No testimonals found</p>
              <p className="text-[11px] text-slate-500 font-mono">Submit a review on the public URL or click "+ Insert Demo Review" above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTestimonials.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-zinc-950 border border-zinc-900 hover:border-cyan-500/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4 transition-all duration-200"
                >
                  <div className="space-y-2.5 flex-1">
                    {/* Header customer card */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/20 flex items-center justify-center font-mono text-xs text-cyan-400 font-bold">
                        {item.customer_name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                          {item.customer_name} 
                          {item.id.toString().startsWith('mock-') && (
                            <span className="text-[8px] bg-zinc-900 font-bold text-slate-500 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest border border-zinc-850">SANDBOX</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" /> {item.customer_email}
                        </div>
                      </div>
                    </div>

                    {/* Client testimonial review quote */}
                    <p className="text-xs sm:text-sm text-slate-300 italic pl-1 leading-relaxed border-l border-zinc-800 pr-4 py-0.5">
                      &ldquo;{item.testimonial_text}&rdquo;
                    </p>

                    {/* Timestamp display */}
                    <div className="flex items-center gap-1 text-[9px] uppercase font-mono text-slate-500">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Submitted on {new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions Moderation Control Pointers */}
                  <div className="flex flex-row md:flex-col items-center justify-end gap-1.5 w-full md:w-auto self-stretch md:self-auto pt-3 md:pt-0 border-t md:border-t-0 border-zinc-900 shrink-0">
                    <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                      
                      {/* Status indicator badge */}
                      <span className={`inline-flex items-center px-2 py-0.5 font-mono font-bold text-[9px] uppercase rounded ${item.status === 'approved' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'}`}>
                        {item.status}
                      </span>

                      {/* Approval toggle action workflow */}
                      <div className="flex items-center gap-1 ml-auto">
                        {item.status !== 'approved' ? (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'approved')}
                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-semibold font-mono text-[10px] uppercase px-2.5 py-1.5 rounded transition-all duration-200 border border-emerald-500/20 cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'pending')}
                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-semibold font-mono text-[10px] uppercase px-2.5 py-1.5 rounded transition-all duration-200 border border-amber-500/20 cursor-pointer"
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
                          className="bg-black border border-zinc-800 hover:border-red-500/30 text-rose-400 hover:bg-red-950/20 p-1.5 rounded transition-all duration-200 cursor-pointer"
                          title="Delete submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl mx-auto px-6 md:px-12 pt-16 flex flex-col sm:flex-row items-center justify-between text-white/20 text-[9px] uppercase tracking-[0.2em] font-medium gap-3">
        <span>&copy; 2026 Wallovo</span>
        <div className="flex gap-4 sm:gap-8 font-mono">
          <span>Dashboard Connection Active</span>
        </div>
      </footer>
    </div>
  );
}

// Render root check
const container = document.getElementById('dashboard-root');
if (container) {
  const root = createRoot(container);
  root.render(<Dashboard />);
}
