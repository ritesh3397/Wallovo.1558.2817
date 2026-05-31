import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from '../lib/supabase';

export default function DebugPanel({ localLoading }) {
  const { 
    session, 
    signupData, 
    signupError, 
    loginError,
    authReady,
    signUpCallState,
    finallyBlockExecuted,
    exactResponse,
    exactError,
    beforeSignUpTime,
    afterSignUpTime,
    finallyExecutedTime
  } = useAuth();
  
  const [collapsed, setCollapsed] = useState(false);
  
  // Direct Fetch Settings Diagnostics State
  const [fetchStatus, setFetchStatus] = useState('idle'); // 'idle' | 'fetching' | 'success' | 'error'
  const [fetchStatusCode, setFetchStatusCode] = useState(null);
  const [fetchResponseBody, setFetchResponseBody] = useState('');
  const [fetchErrorMsg, setFetchErrorMsg] = useState('');
  const [fetchTime, setFetchTime] = useState(null);

  // Direct Fetch Signup Diagnostics State (Bypassing SDK completely)
  const [signupTestEmail] = useState('diag_test_' + Math.floor(Math.random() * 1000000) + '@example.com');
  const [signupTestPassword] = useState('DiagP@ss123_' + Math.floor(Math.random() * 1000));
  const [directSignupStatus, setDirectSignupStatus] = useState('idle'); // 'idle' | 'fetching' | 'success' | 'error'
  const [directSignupStatusCode, setDirectSignupStatusCode] = useState(null);
  const [directSignupResponseBody, setDirectSignupResponseBody] = useState('');
  const [directSignupErrorMsg, setDirectSignupErrorMsg] = useState('');
  const [directSignupTime, setDirectSignupTime] = useState(null);

  const envAnonKeyVal = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const envAnonKeyType = typeof envAnonKeyVal;
  const envAnonKeyLength = envAnonKeyVal ? envAnonKeyVal.length : 0;
  const envAnonKeyPrefix = envAnonKeyVal ? envAnonKeyVal.substring(0, 10) : 'undefined';

  const usedAnonKeyLength = supabaseAnonKey ? supabaseAnonKey.length : 0;
  const usedAnonKeyPrefix = supabaseAnonKey ? supabaseAnonKey.substring(0, 10) : 'undefined';

  // Run GET /settings probe
  const runDirectFetchTest = async () => {
    setFetchStatus('fetching');
    setFetchStatusCode(null);
    setFetchResponseBody('');
    setFetchErrorMsg('');
    setFetchTime(new Date().toLocaleTimeString());

    const targetKey = envAnonKeyVal || supabaseAnonKey;
    console.log("[Diagnostic] Launching direct fetch test to /auth/v1/settings");

    try {
      const response = await fetch(
        "https://bgftqligmdevwxqdnjup.supabase.co/auth/v1/settings",
        {
          headers: {
            apikey: targetKey
          }
        }
      );
      
      setFetchStatusCode(response.status);
      const text = await response.text();
      setFetchResponseBody(text);
      setFetchStatus('success');
    } catch (err) {
      console.error("[Diagnostic] Direct GET fetch settings error:", err);
      setFetchErrorMsg(err.message || String(err));
      setFetchStatus('error');
    }
  };

  // Run POST /signup probe (bypassing supabase-js completely)
  const runDirectSignupTest = async () => {
    setDirectSignupStatus('fetching');
    setDirectSignupStatusCode(null);
    setDirectSignupResponseBody('');
    setDirectSignupErrorMsg('');
    setDirectSignupTime(new Date().toLocaleTimeString());

    const targetKey = envAnonKeyVal || supabaseAnonKey;
    const bodyPayload = {
      email: signupTestEmail,
      password: signupTestPassword
    };

    console.log("[Diagnostic] Launching direct POST signup test to /auth/v1/signup with:", signupTestEmail);

    try {
      const response = await fetch(
        "https://bgftqligmdevwxqdnjup.supabase.co/auth/v1/signup",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': targetKey,
            'Authorization': `Bearer ${targetKey}`
          },
          body: JSON.stringify(bodyPayload)
        }
      );
      
      setDirectSignupStatusCode(response.status);
      const text = await response.text();
      setDirectSignupResponseBody(text);
      setDirectSignupStatus('success');
    } catch (err) {
      console.error("[Diagnostic] Direct POST signup fetch error:", err);
      setDirectSignupErrorMsg(err.message || String(err));
      setDirectSignupStatus('error');
    }
  };

  // Run on mount
  useEffect(() => {
    runDirectFetchTest();
    runDirectSignupTest();
  }, []);

  // Read current configuration
  const connected = isSupabaseConfigured();

  // Helper code to help find where execution hangs
  const getExecutionStatus = () => {
    if (signUpCallState === 'idle') {
      return { text: "IDLE (No signup attempted yet)", color: "text-slate-400" };
    }
    if (signUpCallState === 'before_signUp' && finallyBlockExecuted === 'no') {
      return { 
        text: `HANGING / IN PROGRESS (Stopped AT supabase.auth.signUp). Request sent at ${beforeSignUpTime || "unrecorded time"}, but awaiting promise resolution...`, 
        color: "text-amber-400 animate-pulse font-bold" 
      };
    }
    if (signUpCallState === 'after_signUp_success') {
      return { 
        text: `COMPLETED successfully at ${afterSignUpTime || "unrecorded time"}. Finally block executed: ${finallyBlockExecuted} at ${finallyExecutedTime || "unrecorded"}.`, 
        color: "text-emerald-400 font-bold" 
      };
    }
    if (signUpCallState === 'after_signUp_exception') {
      return { 
        text: `FAILED with exception at ${afterSignUpTime || "unrecorded time"}. Finally block executed: ${finallyBlockExecuted} at ${finallyExecutedTime || "unrecorded"}.`, 
        color: "text-rose-400 font-bold" 
      };
    }
    return { text: signUpCallState, color: "text-sky-400" };
  };

  const statusInfo = getExecutionStatus();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-8 relative z-10">
      <div className="bg-[#0f0f11] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-white">
        {/* Banner header with collapse button */}
        <div 
          onClick={() => setCollapsed(!collapsed)} 
          className="bg-[#16161a] border-b border-white/5 px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#1f1f25] transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-pink-400 animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-wider text-pink-300 font-bold">
              🛠️ SYSTEM AUTH DIAGNOSTIC INSTRUMENT (LIVE METRICS)
            </span>
          </div>
          <button className="text-[10px] text-white/50 hover:text-white px-2 py-0.5 rounded bg-white/5">
            {collapsed ? "[ EXPAND ]" : "[ COLLAPSE ]"}
          </button>
        </div>

        {/* Console stats layout */}
        {!collapsed && (
          <div className="p-5 space-y-4 text-white/70">
            
            {/* Real-time Loading and Authentication States */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">PAGE LOADING STATE</div>
                <div className={`font-bold text-sm ${localLoading ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
                  {localLoading ? 'TRUE (LOADING ACTIVE)' : 'FALSE (IDLE)'}
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">AUTH SYSTEM READY</div>
                <div className={`font-bold text-sm ${authReady ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                  {authReady ? 'TRUE (INITIALIZED)' : 'FALSE (INITIALIZING)'}
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">CURRENT SESSION STATUS</div>
                <div className={`font-bold text-sm ${session ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                  {session ? 'SESSION FOUND (AUTHENTICATED)' : 'NULL (UNAUTHENTICATED)'}
                </div>
              </div>
            </div>

            {/* API KEY RUNTIME CREDENTIALS */}
            <div className="bg-[#121216] border border-white/5 rounded-lg p-4 space-y-3">
              <div className="text-[10.5px] text-pink-300 font-bold uppercase tracking-wider">
                🔑 API KEY RUNTIME CREDENTIALS & METRICS
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-black/30 p-2.5 rounded border border-white/5">
                  <span className="text-white/40 block text-[9px] uppercase">VITE_SUPABASE_ANON_KEY TYPE</span>
                  <span className="text-pink-100 font-semibold">{envAnonKeyType}</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded border border-white/5">
                  <span className="text-white/40 block text-[9px] uppercase">VITE_SUPABASE_ANON_KEY PREFIX</span>
                  <span className="text-pink-100 font-semibold select-all break-all">{envAnonKeyPrefix}</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded border border-white/5">
                  <span className="text-white/40 block text-[9px] uppercase">VITE_SUPABASE_ANON_KEY LENGTH</span>
                  <span className="text-pink-100 font-semibold">{envAnonKeyLength} chars</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 border-t border-white/5">
                <div className="bg-black/30 p-2 rounded">
                  <span className="text-white/40 block text-[9px] uppercase">ACTIVE CLIENT ANON_KEY PREFIX</span>
                  <span className="text-emerald-400 font-semibold select-all break-all">{usedAnonKeyPrefix}</span>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <span className="text-white/40 block text-[9px] uppercase">ACTIVE CLIENT ANON_KEY LENGTH</span>
                  <span className="text-emerald-400 font-semibold">{usedAnonKeyLength} chars</span>
                </div>
              </div>
            </div>

            {/* DIRECT FETCH DIAGNOSTIC SUITE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Probe 1: GET settings */}
              <div className="bg-[#0b131a] border border-sky-950/40 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10.5px] text-sky-300 font-bold uppercase tracking-wider">
                    🌐 DIRECT NETWORK FETCH GET (auth/v1/settings)
                  </div>
                  <button 
                    onClick={runDirectFetchTest}
                    disabled={fetchStatus === 'fetching'}
                    className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-sky-900/30 hover:bg-sky-800/40 border border-sky-800/50 rounded text-sky-200 transition-all disabled:opacity-30"
                  >
                    {fetchStatus === 'fetching' ? "📡 Probing..." : "🔄 Run Settings GET"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">STATUS</span>
                    <span className={`font-bold ${
                      fetchStatus === 'success' ? 'text-emerald-400' :
                      fetchStatus === 'fetching' ? 'text-amber-400 animate-pulse' :
                      fetchStatus === 'error' ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {fetchStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">HTTP CODE</span>
                    <span className={`font-bold text-sm ${fetchStatusCode === 200 ? 'text-emerald-400' : fetchStatusCode ? 'text-rose-400' : 'text-white/30'}`}>
                      {fetchStatusCode || "—"}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">RUNTIME</span>
                    <span className="text-slate-200 block truncate text-[10px]">{fetchTime || "Never run"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-white/40 block text-[9px] uppercase">GET RESPONSE BODY</span>
                  <pre className={`w-full overflow-auto text-[10.5px] leading-relaxed p-2.5 rounded max-h-40 ${
                    fetchStatus === 'error' ? 'bg-rose-950/30 border border-rose-900/30 text-rose-300' : 'bg-black/50 border border-white/5 text-slate-200'
                  }`}>
                    {fetchErrorMsg ? `FETCH_EXCEPTION: ${fetchErrorMsg}` : fetchResponseBody || "No response captured."}
                  </pre>
                </div>
              </div>

              {/* Probe 2: POST signup (Fully bypassed SDK) */}
              <div className="bg-[#1b1c11] border border-yellow-950/40 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10.5px] text-yellow-300 font-bold uppercase tracking-wider">
                      🚀 DIRECT NETWORK FETCH POST (auth/v1/signup)
                    </div>
                    <div className="text-[8px] text-white/40 italic">Bypasses supabase-js client entirely</div>
                  </div>
                  <button 
                    onClick={runDirectSignupTest}
                    disabled={directSignupStatus === 'fetching'}
                    className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-yellow-900/10 hover:bg-yellow-900/30 border border-yellow-800/30 rounded text-yellow-200 transition-all disabled:opacity-30"
                  >
                    {directSignupStatus === 'fetching' ? "📡 En Route..." : "🚀 Test Direct POST"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">POST STATUS</span>
                    <span className={`font-bold ${
                      directSignupStatus === 'success' ? 'text-emerald-400' :
                      directSignupStatus === 'fetching' ? 'text-amber-400 animate-pulse' :
                      directSignupStatus === 'error' ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {directSignupStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">HTTP CODE</span>
                    <span className={`font-bold text-sm ${directSignupStatusCode === 200 || directSignupStatusCode === 201 ? 'text-emerald-400' : directSignupStatusCode ? 'text-rose-400' : 'text-white/30'}`}>
                      {directSignupStatusCode || "—"}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-white/40 block text-[8px] uppercase">POST RUNTIME</span>
                    <span className="text-slate-200 block truncate text-[10px]">{directSignupTime || "Never run"}</span>
                  </div>
                </div>

                <div className="text-[9px] bg-black/40 p-2 rounded text-white/50 space-y-0.5">
                  <div><strong className="text-yellow-400">Payload Email:</strong> {signupTestEmail}</div>
                  <div><strong className="text-yellow-400">Payload Pass:</strong> {signupTestPassword}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-white/40 block text-[9px] uppercase">POST RESPONSE BODY</span>
                  <pre className={`w-full overflow-auto text-[10.5px] leading-relaxed p-2.5 rounded max-h-40 ${
                    directSignupStatus === 'error' ? 'bg-rose-950/30 border border-rose-900/30 text-rose-300' : 'bg-black/50 border border-white/5 text-slate-200'
                  }`}>
                    {directSignupErrorMsg ? `FETCH_EXCEPTION: ${directSignupErrorMsg}` : directSignupResponseBody || "No response captured."}
                  </pre>
                </div>
              </div>
            </div>

            {/* EXECUTION STEP-TRACER (FIND EXACT HANG LINE) */}
            <div className="bg-[#1b1215]/50 p-4 rounded-lg border border-rose-950/40 space-y-2">
              <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">
                📍 EXECUTION STEP-TRACER (FIND EXACT HANG LINE)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-black/30 p-2 rounded border border-white/5">
                  <span className="text-white/40 block text-[9px] uppercase">1. BEFORE SIGNUP TRACE:</span>
                  <span className={beforeSignUpTime ? "text-emerald-400 font-bold" : "text-white/30"}>
                    {beforeSignUpTime ? `✔ REACHED (at ${beforeSignUpTime})` : "○ pending"}
                  </span>
                </div>
                <div className="bg-black/30 p-2 rounded border border-white/5">
                  <span className="text-white/40 block text-[9px] uppercase">2. AFTER SIGNUP TRACE:</span>
                  <span className={afterSignUpTime ? "text-emerald-400 font-bold" : "text-white/30"}>
                    {afterSignUpTime ? `✔ REACHED (at ${afterSignUpTime})` : "○ pending (If loading stays active here, promise is locked)"}
                  </span>
                </div>
                <div className="bg-black/30 p-2 rounded border border-white/5">
                  <span className="text-white/40 block text-[9px] uppercase">3. FINALLY{} BLOCK EXECUTION:</span>
                  <span className={finallyBlockExecuted === 'yes' ? "text-orange-400 font-bold" : "text-white/30"}>
                    {finallyBlockExecuted === 'yes' ? `✔ EXECUTED (at ${finallyExecutedTime})` : "○ pending"}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs bg-black/40 p-2.5 rounded border border-white/5">
                <span className="text-white/40 block text-[9px] uppercase mb-1">CURRENT DIAGNOSTIC STATE INFERENCE:</span>
                <span className={statusInfo.color}>{statusInfo.text}</span>
              </div>
            </div>

            {/* Live Payloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Signup Response Data */}
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex flex-col h-48">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>SIGNUP_DATA</span>
                  {signupData && <span className="text-emerald-400 text-[9px] font-bold">● ACTIVATED</span>}
                </div>
                <pre className="flex-grow overflow-auto text-[10.5px] leading-relaxed text-slate-300 bg-black/20 p-2 rounded max-h-40">
                  {signupData ? JSON.stringify(signupData, null, 2) : "null (No signup attempt registered yet)"}
                </pre>
              </div>

              {/* Signup Response Error */}
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex flex-col h-48">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>SIGNUP_ERROR</span>
                  {signupError && <span className="text-rose-400 text-[9px] font-bold">● FAILED</span>}
                </div>
                <pre className={`flex-grow overflow-auto text-[10.5px] leading-relaxed p-2 rounded max-h-40 ${signupError ? 'text-rose-300 bg-rose-950/20 border border-rose-900/20' : 'text-slate-500 bg-black/20'}`}>
                  {signupError ? JSON.stringify(signupError, null, 2) : "null (No signup error)"}
                </pre>
              </div>

              {/* Exact raw response payload (or exceptions) */}
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex flex-col h-48">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>EXACT_SUPABASE_RESPONSE</span>
                  {exactResponse && <span className="text-emerald-400 text-[9px] font-bold">● CAPTURED</span>}
                </div>
                <pre className="flex-grow overflow-auto text-[10.5px] leading-relaxed text-slate-300 bg-black/20 p-2 rounded max-h-40">
                  {exactResponse ? JSON.stringify(exactResponse, null, 2) : "null (Awaiting first response...)"}
                </pre>
              </div>

              {/* Exact raw error payload */}
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex flex-col h-48">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>EXACT_SUPABASE_ERROR</span>
                  {exactError && <span className="text-rose-400 text-[9px] font-bold">● CAPTURED</span>}
                </div>
                <pre className={`flex-grow overflow-auto text-[10.5px] leading-relaxed p-2 rounded max-h-40 ${exactError ? 'text-rose-300 bg-rose-950/20 border border-rose-900/20' : 'text-slate-500 bg-black/20'}`}>
                  {exactError ? JSON.stringify(exactError, null, 2) : "null (Awaiting error payload...)"}
                </pre>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-white/30 text-right flex items-center justify-between">
              <span>Client Sandbox Instance bgftqligmdevwxqdnjup</span>
              <span>All authentication procedures run via the direct Supabase SDK API endpoint.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
