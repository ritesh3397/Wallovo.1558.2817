import { useState, FormEvent } from 'react';
import { Sparkles, Check, Clock, Shield } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function WaitlistHub() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    if (!fullName.trim()) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    const count = Math.floor(100 + Math.random() * 900);
    const uniqueToken = `WLV-${count}-${email.slice(0, 3).toUpperCase()}`;
    setToken(uniqueToken);

    try {
      if (!isSupabaseConfigured()) {
        // Fallback for demo when keys aren't configured yet
        console.warn('Supabase env vars are not configured yet. Simulating join locally...');
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
        setStatus('success');
        return;
      }

      // 1. Check if email already exists
      const { data: existing, error: checkError } = await (supabase as any)
        .from('waitlist')
        .select('id, email')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (checkError) {
        console.warn('Waitlist check query encountered a warning, proceeding to insert:', checkError);
      }

      if (existing) {
        setStatus('error');
        setErrorMessage("You're already on the list!");
        return;
      }

      // 2. Insert new record
      const { error: insertError } = await (supabase as any)
        .from('waitlist')
        .insert([
          {
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        if (
          insertError.code === '23505' || 
          insertError.message?.toLowerCase().includes('duplicate') || 
          insertError.message?.toLowerCase().includes('already')
        ) {
          setStatus('error');
          setErrorMessage("You're already on the list!");
        } else {
          throw insertError;
        }
        return;
      }

      setStatus('success');
    } catch (err: any) {
      console.error('Waitlist submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Glow effect bottom right */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#22D3EE]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative bg-[#151515] border border-[#262626] rounded-[32px] p-8 sm:p-12 overflow-hidden shadow-2xl">
          {/* Accent lighting edge line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/20 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="md:col-span-12 lg:col-span-7 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[10px] font-mono tracking-wider text-[#22D3EE] uppercase mb-4">
                <Sparkles className="w-3 h-3" /> Exclusive Release
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                Join the Private Waitlist
              </h3>
              <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
                Be the first to hear about new trust widget launches, features updates, and dashboard improvements.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-white/50">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#22D3EE]" /> Secure storage
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#22D3EE]" /> Priority updates
                </span>
              </div>
            </div>

            {/* Right Action/Form Column */}
            <div className="md:col-span-12 lg:col-span-5 relative font-sans">
              {status !== 'success' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-[#0B0B0B] text-white placeholder-white/30 text-xs px-5 py-4 rounded-full border border-[#262626] focus:border-[#22D3EE]/40 focus:outline-none focus:ring-1 focus:ring-[#22D3EE]/20 transition-all duration-300 shadow-inner disabled:opacity-50"
                    />
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-[#0B0B0B] text-white placeholder-white/30 text-xs px-5 py-4 rounded-full border border-[#262626] focus:border-[#22D3EE]/40 focus:outline-none focus:ring-1 focus:ring-[#22D3EE]/20 transition-all duration-300 shadow-inner disabled:opacity-50"
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <div className="text-xs text-rose-400 font-medium px-4 text-center">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#22D3EE] text-black font-bold text-xs py-4 rounded-full hover:opacity-90 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 cursor-pointer text-center disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      'Request Waitlist Spot'
                    )}
                  </button>

                  {!isSupabaseConfigured() && (
                    <div className="text-[9.5px] text-center text-amber-300/80 border border-amber-500/20 bg-amber-500/5 py-1 px-3 rounded-xl font-mono">
                      Demo mode: Simulating waitlist entry.
                    </div>
                  )}

                  <p className="text-[10px] text-center text-white/30 tracking-tight leading-relaxed">
                    Your data is safe with us. We only email you about important, non-spam updates.
                  </p>
                </form>
              ) : (
                <div className="wallovo-glass rounded-[24px] p-6 border-[#22D3EE]/20 text-center animate-fade-in relative overflow-hidden backdrop-blur-2xl bg-black/40">
                  {/* Subtle success pulse background */}
                  <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none -z-10" />
                  
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] mb-1">Subscription Confirmed</h4>
                  <p className="text-xs text-white/95 font-medium mb-4">
                    You're on the list! We'll notify you soon 🎉
                  </p>
                  
                  <div className="bg-[#0B0B0B] border border-[#262626] p-4 rounded-2xl mb-4 text-left">
                    <span className="text-[10px] text-white/40 block font-mono uppercase tracking-wide mb-1">Waitlist ID</span>
                    <div className="font-mono text-xs text-[#22D3EE] font-semibold break-all selection:bg-[#22D3EE] selection:text-black select-all">
                      {token}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStatus('idle');
                      setEmail('');
                      setFullName('');
                    }}
                    className="text-[10px] font-mono text-[#22D3EE] hover:underline cursor-pointer"
                  >
                    Register another user
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
