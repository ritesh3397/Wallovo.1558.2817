import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log("[Auth] Supabase URL configured:", !!supabaseUrl);
console.log("[Auth] Supabase Anon Key configured:", !!supabaseAnonKey);

export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  
  const urlStr = String(supabaseUrl).trim();
  const keyStr = String(supabaseAnonKey).trim();
  
  if (urlStr === '' || keyStr === '' || urlStr === 'undefined' || keyStr === 'undefined' || urlStr === 'null' || keyStr === 'null') {
    return false;
  }
  
  const invalidKeywords = [
    'placeholder',
    'your-project',
    'insert-your',
    'url-here',
    'anon-key',
    'your-supabase',
    'example.co'
  ];
  
  return !invalidKeywords.some(kw => 
    urlStr.toLowerCase().includes(kw) || keyStr.toLowerCase().includes(kw)
  );
};

// Exclusively instantiate the real Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Clear session helper
export async function clearSessionAndSignOut() {
  console.log("[Auth] Synchronously purging client cached credentials...");
  
  const localKeys = [
    'wallovo_user_session',
    'supabase.auth.token'
  ];
  localKeys.forEach(k => localStorage.removeItem(k));
  
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('auth-token') || key.includes('supabase.auth'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn("[Auth] Storage sweep warning:", err);
  }

  try {
    console.log("[Auth] Calling supabase.auth.signOut()...");
    await supabase.auth.signOut();
    console.log("[Auth] Signout complete.");
  } catch (err) {
    console.warn("[Auth] Supabase signOut execution warning:", err);
  }
}
