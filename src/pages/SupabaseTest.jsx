import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Network, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Play, Zap } from 'lucide-react';
import '../../src/index.css';

const DEFAULT_URL = 'https://bgftqligmdevwxqdnjup.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZnRxbGlnbWRldnd4cWRuanVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzczNDcsImV4cCI6MjA5NTAxMzM0N30.DK3hRlsfGIarYITE41RzWrd1Bk7e1ZBITpbewq6fLk8';

// Use env variables if present, fallback to defaults
const activeUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const activeKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export default function SupabaseTestPage() {
  // Test 1: GET /auth/v1/settings
  const [t1Status, setT1Status] = useState('idle'); // 'idle' | 'running' | 'success' | 'failed' | 'hanging'
  const [t1Code, setT1Code] = useState(null);
  const [t1Body, setT1Body] = useState('');
  const [t1Duration, setT1Duration] = useState(null);
  const [t1Timestamp, setT1Timestamp] = useState('');

  // Test 2: SDK signUp()
  const [t2Status, setT2Status] = useState('idle');
  const [t2Code, setT2Code] = useState(null);
  const [t2Body, setT2Body] = useState('');
  const [t2Duration, setT2Duration] = useState(null);
  const [t2Timestamp, setT2Timestamp] = useState('');
  const [t2Payload, setT2Payload] = useState(null);

  // Test 3: Raw POST /auth/v1/signup
  const [t3Status, setT3Status] = useState('idle');
  const [t3Code, setT3Code] = useState(null);
  const [t3Body, setT3Body] = useState('');
  const [t3Duration, setT3Duration] = useState(null);
  const [t3Timestamp, setT3Timestamp] = useState('');
  const [t3Payload, setT3Payload] = useState(null);

  // Generate unique emails to avoid conflicts
  const getNewCredentials = () => {
    const randomId = Math.floor(Math.random() * 10000000);
    return {
      email: `isolated_spec_val_${randomId}@diagnose.example.com`,
      password: `Secure_P@ss_diag_${Math.floor(Math.random() * 9999)}`
    };
  };

  // Run GET /auth/v1/settings Test (Test 1)
  const runTestSettings = async () => {
    setT1Status('running');
    setT1Code(null);
    setT1Body('');
    setT1Duration(null);
    setT1Timestamp(new Date().toLocaleTimeString());

    const startTime = performance.now();
    console.log("[Diagnostic] Initiating Test 1: GET /auth/v1/settings");

    try {
      const response = await fetch(
        `${activeUrl}/auth/v1/settings`,
        {
          headers: {
            'apikey': activeKey
          }
        }
      );

      const endTime = performance.now();
      const elapsed = (endTime - startTime).toFixed(1);
      
      setT1Code(response.status);
      const text = await response.text();
      setT1Body(text);
      setT1Duration(elapsed);
      setT1Status('success');
      console.log("[Diagnostic] Test 1 completed successfully in", elapsed, "ms");
    } catch (err) {
      const endTime = performance.now();
      const elapsed = (endTime - startTime).toFixed(1);
      
      setT1Status('failed');
      setT1Body(`Fetch error: ${err.message || String(err)}`);
      setT1Duration(elapsed);
      console.error("[Diagnostic] Test 1 exception:", err);
    }
  };

  // Run SDK signUp() Test (Test 2)
  const runTestSdkSignup = async () => {
    setT2Status('running');
    setT2Code(null);
    setT2Body('');
    setT2Duration(null);
    setT2Timestamp(new Date().toLocaleTimeString());
    
    const creds = getNewCredentials();
    setT2Payload(creds);

    const startTime = performance.now();
    console.log("[Diagnostic] Initiating Test 2: fresh supabase-js signUp() with:", creds.email);

    try {
      // Direct, isolated creation of fresh supabase client
      const freshClient = createClient(activeUrl, activeKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });

      // Set safety timeout notifier
      const timer = setTimeout(() => {
        setT2Status('hanging');
      }, 5000);

      const { data, error } = await freshClient.auth.signUp({
        email: creds.email,
        password: creds.password
      });

      clearTimeout(timer);
      const endTime = performance.now();
      const elapsed = (endTime - startTime).toFixed(1);

      setT2Duration(elapsed);
      if (error) {
        setT1Timestamp(new Date().toLocaleTimeString());
        setT2Status('failed');
        setT2Code(error.status || 400);
        setT2Body(JSON.stringify(error, null, 2));
        console.error("[Diagnostic] Test 2 error object:", error);
      } else {
        setT2Status('success');
        setT2Code(200);
        setT2Body(JSON.stringify(data, null, 2));
        console.log("[Diagnostic] Test 2 success. response data:", data);
      }
    } catch (err) {
      const endTime = performance.now();
      const elapsed = (endTime - startTime).toFixed(1);
      setT2Status('failed');
      setT2Body(`Catch Exception: ${err?.message || String(err)}`);
      setT2Duration(elapsed);
      console.error("[Diagnostic] Test 2 exception thrown:", err);
    }
  };

  // Run Raw fetch POST /auth/v1/signup (Test 3)
  const runTestRawSignup = async () => {
    setT3Status('running');
    setT3Code(null);
    setT3Body('');
    setT3Duration(null);
    setT3Timestamp(new Date().toLocaleTimeString());

    const creds = getNewCredentials();
    setT3Payload(creds);

    const startTime = performance.now();
    console.log("[Diagnostic] Initiating Test 3: Raw POST /auth/v1/signup with:", creds.email);

    try {
      const timer = setTimeout(() => {
        setT3Status('hanging');
      }, 5000);

      const response = await fetch(
        `${activeUrl}/auth/v1/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': activeKey,
            'Authorization': `Bearer ${activeKey}`
          },
          body: JSON.stringify({
            email: creds.email,
            password: creds.password
          })
        }
      );

      clearTimeout(timer);
      const endTime = performance.now();
      const elapsed = (endTime - startTime).toFixed(1);

      setT3Code(response.status);
      const text = await response.text();
      setT3Body(text);
      setT3Duration(elapsed);
      setT3Status('success');
      console.log("[Diagnostic] Test 3 completed in", elapsed, "ms. Status code:", response.status);
    } catch (err) {
      const endTime = performance.now();
      const elapsed = (endTime - startTime).toFixed(1);
      
      setT3Status('failed');
      setT3Body(`Raw POST failure exception: ${err.message || String(err)}`);
      setT3Duration(elapsed);
      console.error("[Diagnostic] Test 3 exception:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'running':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono animate-pulse">Running</span>;
      case 'success':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono">Success</span>;
      case 'failed':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono">Failed</span>;
      case 'hanging':
        return <span className="bg-orange-500/30 text-orange-400 border border-orange-500/50 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono animate-bounce font-bold">Hanging (?5s)</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono">Idle</span>;
    }
  };

  return (
    <div className="min-h-screen text-slate-300 flex flex-col justify-between selection:bg-[#FFB6C9] selection:text-black relative overflow-x-hidden bg-[#050505]">
      {/* Subsurface linear grids */}
      <div className="absolute inset-0 z-0 subsurface-grid opacity-30 pointer-events-none"></div>

      {/* Decorative absolute ambient items */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-sky-950/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[30%] right-[5%] w-[500px] h-[500px] bg-amber-950/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top Header section */}
      <header className="relative z-10 px-8 pt-8 flex justify-center border-b border-white/5 pb-6">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/index.html" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-300 to-amber-200 shadow-[0_0_15px_rgba(125,211,252,0.2)] transition-transform duration-500 group-hover:rotate-180"></div>
              <span className="text-lg font-bold tracking-tighter text-white font-display group-hover:text-sky-300 transition-colors">Wallovo Diagnostics</span>
            </a>
            <span className="text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 font-mono tracking-widest uppercase px-3 py-1 rounded-full">
              Surgical Auth Tracer
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/signup.html" className="text-xs text-white/50 hover:text-[#FFB6C9] transition-all bg-white/5 border border-white/10 px-4 py-2 rounded-full font-mono">
              ← Back to Signup Portal
            </a>
          </div>
        </div>
      </header>

      {/* Diagnostic Engine Dashboard Controls */}
      <main className="relative z-10 flex-grow w-full max-w-6xl mx-auto px-6 py-12 space-y-8">
        
        {/* Intro Meta Info card */}
        <div className="wallovo-glass rounded-[24px] p-6 relative overflow-hidden border-sky-400/20">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold font-display text-white tracking-tight flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-sky-400" /> Isolated Supabase API Diagnostic Sandbox
              </h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono leading-relaxed">
                A custom playground environment decoupled from active application stores or authentication contexts. Runs raw, performance-instrumented fetch commands and direct local client endpoints.
              </p>
            </div>
            
            <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl font-mono text-[11px] space-y-1 inline-block">
              <div><span className="text-white/30 uppercase">TARGET_URL:</span> <span className="text-mono text-sky-300">{activeUrl}</span></div>
              <div><span className="text-white/30 uppercase">ANON_KEY_PREFIX:</span> <span className="text-mono text-amber-200">{activeKey.substring(0, 15)}...</span></div>
            </div>
          </div>
        </div>

        {/* The 3 Sandbox Tests Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Test 1 Column: Settings GET */}
          <div className="wallovo-glass rounded-2xl p-5 border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-sky-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" /> Test No. 1
                </span>
                {getStatusBadge(t1Status)}
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white">GET Settings Endpoint</h3>
                <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                  GET {activeUrl}/auth/v1/settings
                </p>
              </div>

              {/* Console log outputs */}
              <div className="space-y-2 pt-2">
                <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">Parameters / Headers:</div>
                <pre className="bg-black/50 p-2.5 rounded border border-white/5 text-[10px] font-mono text-zinc-400 overflow-x-auto">
                  apikey: {activeKey.substring(0, 10)}...
                </pre>

                <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">Response Payload:</div>
                <pre className="bg-black/50 p-2.5 rounded border border-white/5 text-[10.5px] font-mono text-slate-300 h-44 overflow-y-auto whitespace-pre-wrap break-all">
                  {t1Body || "— Run test to capture response —"}
                </pre>
              </div>
            </div>

            {/* Metrics footer info */}
            <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-black/30 p-2 rounded">
                  <div className="text-white/30 uppercase">Status Code</div>
                  <div className={`font-bold text-xs mt-0.5 ${t1Code === 200 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t1Code || "N/A"}
                  </div>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <div className="text-white/30 uppercase">Duration / Latency</div>
                  <div className="font-bold text-xs mt-0.5 text-sky-300">
                    {t1Duration ? `${t1Duration} ms` : "N/A"}
                  </div>
                </div>
              </div>

              <button
                onClick={runTestSettings}
                disabled={t1Status === 'running'}
                className="w-full bg-sky-950/30 hover:bg-sky-900/50 text-sky-200 border border-sky-800/40 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Run Settings Test (GET)
              </button>
            </div>
          </div>

          {/* Test 2 Column: SDK signUp */}
          <div className="wallovo-glass rounded-2xl p-5 border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Test No. 2
                </span>
                {getStatusBadge(t2Status)}
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white">SDK signUp() Method</h3>
                <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                  supabase.auth.signUp() fresh instance
                </p>
              </div>

              {/* Console log outputs */}
              <div className="space-y-2 pt-2">
                <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">Test Payload:</div>
                <pre className="bg-black/50 p-2.5 rounded border border-white/5 text-[10px] font-mono text-zinc-400 overflow-x-auto">
                  {t2Payload ? (
                    `Email: ${t2Payload.email}\nPass:  ${t2Payload.password}`
                  ) : (
                    "null (Generated on runtime click)"
                  )}
                </pre>

                <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">Response Payload:</div>
                <pre className="bg-black/50 p-2.5 rounded border border-white/5 text-[10.5px] font-mono text-slate-300 h-44 overflow-y-auto whitespace-pre-wrap break-all">
                  {t2Status === 'running' ? (
                    "Sending credentials using fresh createClient() instance... If response hangs beyond 5.0 seconds we flag it."
                  ) : (
                    t2Body || "— Run test to capture response —"
                  )}
                </pre>
              </div>
            </div>

            {/* Metrics footer info */}
            <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-black/30 p-2 rounded">
                  <div className="text-white/30 uppercase">Status Code</div>
                  <div className={`font-bold text-xs mt-0.5 ${t2Code === 200 || t2Code === 201 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t2Code || "N/A"}
                  </div>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <div className="text-white/30 uppercase">Duration / Latency</div>
                  <div className="font-bold text-xs mt-0.5 text-amber-300">
                    {t2Duration ? `${t2Duration} ms` : "N/A"}
                  </div>
                </div>
              </div>

              <button
                onClick={runTestSdkSignup}
                disabled={t2Status === 'running'}
                className="w-full bg-amber-950/20 hover:bg-amber-900/30 text-amber-200 border border-amber-800/20 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Run SDK Signup (signUp)
              </button>
            </div>
          </div>

          {/* Test 3 Column: Raw Signup POST */}
          <div className="wallovo-glass rounded-2xl p-5 border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Test No. 3
                </span>
                {getStatusBadge(t3Status)}
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white">Raw HTTP POST Signup</h3>
                <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                  POST {activeUrl}/auth/v1/signup
                </p>
              </div>

              {/* Console log outputs */}
              <div className="space-y-2 pt-2">
                <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">Test Payload:</div>
                <pre className="bg-black/50 p-2.5 rounded border border-white/5 text-[10px] font-mono text-zinc-400 overflow-x-auto">
                  {t3Payload ? (
                    `Email: ${t3Payload.email}\nPass:  ${t3Payload.password}`
                  ) : (
                    "null (Generated on runtime click)"
                  )}
                </pre>

                <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">Response Payload:</div>
                <pre className="bg-black/50 p-2.5 rounded border border-white/5 text-[10.5px] font-mono text-slate-300 h-44 overflow-y-auto whitespace-pre-wrap break-all">
                  {t3Body || "— Run test to capture response —"}
                </pre>
              </div>
            </div>

            {/* Metrics footer info */}
            <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-black/30 p-2 rounded">
                  <div className="text-white/30 uppercase">Status Code</div>
                  <div className={`font-bold text-xs mt-0.5 ${t3Code === 200 || t3Code === 201 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t3Code || "N/A"}
                  </div>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <div className="text-white/30 uppercase">Duration / Latency</div>
                  <div className="font-bold text-xs mt-0.5 text-purple-300">
                    {t3Duration ? `${t3Duration} ms` : "N/A"}
                  </div>
                </div>
              </div>

              <button
                onClick={runTestRawSignup}
                disabled={t3Status === 'running'}
                className="w-full bg-purple-950/20 hover:bg-purple-900/30 text-purple-200 border border-purple-800/20 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Run Raw POST Signup
              </button>
            </div>
          </div>

        </div>

        {/* Diagnosis Helper section */}
        <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-6 font-mono text-xs space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> UNDERSTANDING TEST RESULTS (DIAGNOSTIC CRITERIA)
          </h4>
          <ol className="list-decimal pl-5 space-y-2.5 text-zinc-400 leading-relaxed">
            <li>
              <strong className="text-white/70">Test 1 Success & Test 3 Success:</strong> Indicates that the network is responsive, routing to Supabase is healthy, and the URL and Anon Key are correct. It rules out routing/network/IP blockages.
            </li>
            <li>
              <strong className="text-white/70">Test 1 Success but Test 3 Hangs:</strong> If raw POST to <code className="bg-white/5 text-slate-300 px-1 py-0.5 rounded">/auth/v1/signup</code> blocks indefinitely, the issue resides on supersonic/network blockages inside the Supabase email routing setup or user database creation limits on the database engine.
            </li>
            <li>
              <strong className="text-white/70">Test 3 Success but Test 2 Hangs:</strong> If the direct raw fetch POST works, but calling the SDK client signUp() method hangs, then the issue lies directly in the <code className="bg-white/5 text-slate-305 px-1 py-0.5 rounded">@supabase/supabase-js</code> integration inside this runtime. E.g. lock acquisition timeouts, session persistence blocks, or library thread loops.
            </li>
          </ol>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-white/20 text-[9px] uppercase tracking-[0.2em] font-medium gap-3">
        <span>© 2026 Wallovo Diagnostic Suite</span>
        <span>Isolated Service Sandbox</span>
      </footer>

    </div>
  );
}

const container = document.getElementById('test-root');
if (container) {
  const root = createRoot(container);
  root.render(<SupabaseTestPage />);
}
