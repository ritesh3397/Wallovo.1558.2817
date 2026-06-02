import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// Absolute clean configuration using standard environment variables with static fallback
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bgftqligmdevwxqdnjup.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZnRxbGlnbWRldnd4cWRuanVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzczNDcsImV4cCI6MjA5NTAxMzM0N30.DK3hRlsfGIarYITE41RzWrd1Bk7e1ZBITpbewq6fLk8';

// Pristine creation of a fresh, isolated Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export default function MinimalAuthTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [result, setResult] = useState(null);
  
  // Timings
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill out email and password.');
      return;
    }
    
    setLoading(true);
    setResult(null);
    setEndTime(null);
    setDuration(null);

    const now = new Date();
    setStartTime(now.toLocaleTimeString() + '.' + String(now.getMilliseconds()).padStart(3, '0'));
    const t0 = performance.now();

    try {
      // Direct, untouched standard SDK call as requested
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      const t1 = performance.now();
      const endNow = new Date();
      setEndTime(endNow.toLocaleTimeString() + '.' + String(endNow.getMilliseconds()).padStart(3, '0'));
      setDuration(Math.round(t1 - t0));
      setResult({ data, error });
    } catch (err) {
      const t1 = performance.now();
      const endNow = new Date();
      setEndTime(endNow.toLocaleTimeString() + '.' + String(endNow.getMilliseconds()).padStart(3, '0'));
      setDuration(Math.round(t1 - t0));
      setResult({ 
        catchException: err.message || String(err)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 bg-zinc-950 border border-zinc-800 rounded-xl space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold text-white font-mono">/minimal-auth-test</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Completely isolated test to diagnose if Supabase Auth works outside of any Wallovo state, configuration or providers.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1 font-mono">Email</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-zinc-700 font-mono"
            placeholder="test@example.com"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1 font-mono">Password</label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-zinc-700 font-mono"
            placeholder="••••••••"
            disabled={loading}
            required
          />
        </div>

        <button
          id="signup-btn"
          type="submit"
          disabled={loading}
          className="w-full bg-white hover:bg-zinc-200 text-black font-semibold font-mono text-sm py-2.5 rounded transition cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Executing signUp()...' : 'Run supabase.auth.signUp()'}
        </button>
      </form>

      {/* Timing Stats Output */}
      <div className="bg-zinc-900/50 p-4 border border-zinc-800/80 rounded space-y-2 text-xs font-mono">
        <div className="flex justify-between border-b border-zinc-800/50 pb-1">
          <span className="text-zinc-500">Request Start Time</span>
          <span className="text-zinc-300">{startTime || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-zinc-800/50 pb-1">
          <span className="text-zinc-500">Request End Time</span>
          <span className="text-zinc-300">{endTime || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Total Duration</span>
          <span className="text-zinc-300">{duration !== null ? `${duration} ms` : '—'}</span>
        </div>
      </div>

      {/* JSON Output Display */}
      <div>
        <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1 font-mono">JSON.stringify(&#123; data, error &#125;, null, 2)</label>
        <pre className="bg-black border border-zinc-800 rounded p-4 text-[11.5px] font-mono text-slate-300 overflow-x-auto min-h-[160px] whitespace-pre-wrap break-all">
          {result ? JSON.stringify(result, null, 2) : '— Awaiting test execution —'}
        </pre>
      </div>
    </div>
  );
}

const container = document.getElementById('test-root');
if (container) {
  const root = createRoot(container);
  root.render(<MinimalAuthTest />);
}
