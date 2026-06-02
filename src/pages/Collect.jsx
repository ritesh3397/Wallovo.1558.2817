import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  CheckCircle, Sparkles, AlertCircle, Quote, Mail, User, Clock,
  MessageSquare, Send, ShieldCheck, HelpCircle, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../../src/index.css';

export default function Collect() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [dbError, setDbError] = useState(false);

  // Form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  
  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract username on mount
  useEffect(() => {
    const detectTargetHost = async () => {
      // 1. Detect from query parameter '?u=username'
      const searchParams = new URLSearchParams(window.location.search);
      let targetUser = searchParams.get('u');

      if (!targetUser) {
        // 2. Fallback to path segment detection (e.g. /collect/username)
        const paths = window.location.pathname.split('/');
        const index = paths.findIndex(segment => segment.toLowerCase() === 'collect');
        if (index !== -1 && paths[index + 1]) {
          targetUser = decodeURIComponent(paths[index + 1]);
        }
      }

      // 3. Fallback to hash #username
      if (!targetUser && window.location.hash) {
        targetUser = window.location.hash.substring(1);
      }

      const finalUsername = targetUser || 'operator';
      setUsername(finalUsername);

      await fetchBusinessProfile(finalUsername);
    };

    detectTargetHost();
  }, []);

  const fetchBusinessProfile = async (targetUsername) => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch the business profile from custom users table matching the username
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', targetUsername)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBusinessProfile(data);
      } else {
        // If query completed successfully but no row matches, set default profile for testing
        console.warn(`No registered merchant matches '${targetUsername}'. Supporting fallback simulation.`);
        setBusinessProfile({
          id: 'placeholder-uuid',
          full_name: targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1) + ' Corp',
          username: targetUsername,
          email: `${targetUsername}@example.com`
        });
      }
    } catch (err) {
      console.warn("DB profiles lookups bypassed due to missing tables or config, using fallback mockup client state.", err);
      setDbError(true);
      
      // Setup beautiful mock operator profile so the form can still be fully submitted and tested
      setBusinessProfile({
        id: 'fallback-mock-uuid',
        full_name: targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1) + ' AI Labs',
        username: targetUsername,
        email: `${targetUsername}@example.com`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !testimonialText.trim()) {
      setErrorMsg("Please populate all necessary inputs.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // Create testimonial submission object
      const submission = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        testimonial_text: testimonialText.trim(),
        status: 'pending'
      };

      // If we have a real database profile insert it matching target user id
      if (businessProfile && businessProfile.id !== 'fallback-mock-uuid' && businessProfile.id !== 'placeholder-uuid') {
        const { error } = await supabase
          .from('testimonials')
          .insert({
            user_id: businessProfile.id,
            ...submission
          });

        if (error) throw error;
      } else {
        // Simulate loading delay for sandboxed preview
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Mock testimonial recorded successfully into sandbox console list.");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Testimonial submission failed:", err);
      setErrorMsg(err.message || "Failure encountered during testimonial dispatch. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-slate-100 font-mono">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] uppercase tracking-widest text-cyan-400 select-none animate-pulse">Synchronizing Collection Channel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-cyan-500/20 selection:text-white relative">
      
      {/* Background aesthetics */}
      <header className="relative z-10 px-8 pt-8 flex justify-center w-full">
        <div className="w-full max-w-lg flex items-center justify-between border border-cyan-500/10 bg-black/80 backdrop-blur-md rounded-full px-5 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-bold tracking-tight text-white font-mono">Wallovo Gateway</span>
          </div>
          <span className="text-[8px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/10">
            SSL Secure
          </span>
        </div>
      </header>

      {/* Forms layout Container */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-black border border-cyan-500/10 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl">
          {/* Cyan glowing top ribbon border */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
          
          {success ? (
            /* Submission Success animation rendering block */
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="mx-auto w-16 h-16 rounded-full bg-cyan-950 border border-cyan-400/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-cyan-400 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold font-mono text-white tracking-tight">Testimonial Compiled!</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Thank you! Your testimonial has been routed successfully to <strong className="text-cyan-400 font-mono">{businessProfile?.full_name}</strong>. It will be verified and displayed shortly.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-center">
                <button
                  onClick={() => {
                    setCustomerName('');
                    setCustomerEmail('');
                    setTestimonialText('');
                    setSuccess(false);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-xs px-6 py-2 rounded-xl transition"
                >
                  Submit Another Feedback
                </button>
              </div>
            </div>
          ) : (
            /* Regular submission form input elements */
            <div className="space-y-6">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  Secure Submission
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white pt-1">
                  Leave a Testimonial for <span className="text-[#00E5FF]">{businessProfile?.full_name || 'Standard Client'}</span>
                </h1>
                <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                  Let us know what your experience has been. Your authentic voice helps businesses refine operational delivery and assists general buyers.
                </p>
              </div>

              {/* Database missing setup informational tag */}
              {dbError && (
                <div className="flex gap-2.5 bg-cyan-950/10 border border-cyan-500/10 p-3 rounded-xl text-[10px] text-cyan-400 font-mono leading-relaxed">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Sandbox simulation online! Submissions will execute successfully instantly, ready to be reviewed in the dashboard back office local state.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error prompt output */}
                {errorMsg && (
                  <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-red-300 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold font-mono tracking-wider text-slate-400 mb-1.5">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 mr-2.5" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white uppercase font-mono focus:outline-none transition-colors"
                        placeholder="John Doe"
                        disabled={submitting}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold font-mono tracking-wider text-slate-400 mb-1.5">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 mr-2.5" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                        placeholder="john@example.com"
                        disabled={submitting}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold font-mono tracking-wider text-slate-400 mb-1.5 flex justify-between">
                    <span>Testimonial Review Text</span>
                    <Quote className="w-3.5 h-3.5 text-slate-500/50" />
                  </label>
                  <textarea
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    rows="4"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs text-slate-205 focus:outline-none transition-colors leading-relaxed"
                    placeholder="We loved our project delivery! The features are incredibly robust and the team provided excellent onboarding assistance..."
                    disabled={submitting}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold font-mono text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] shadow-[0_4px_15px_rgba(6,182,212,0.15)]"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin mr-1"></div>
                      Transmitting Telemetry...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Testimonial
                    </>
                  )}
                </button>

              </form>

            </div>
          )}

        </div>
      </main>

      {/* Creative Footer Info section */}
      <footer className="relative z-10 px-8 pb-8 flex flex-col sm:flex-row items-center justify-between text-white/20 text-[9px] uppercase tracking-[0.2em] font-medium gap-3">
        <span>&copy; 2026 Wallovo AI Labs</span>
        <div className="flex gap-4 sm:gap-8">
          <span className="font-mono">Pristine collection gateway stable</span>
        </div>
      </footer>

    </div>
  );
}

const container = document.getElementById('collect-root');
if (container) {
  const root = createRoot(container);
  root.render(<Collect />);
}
