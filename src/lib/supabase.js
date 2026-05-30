import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use real project ID bgftqligmdevwxqdnjup as default when environment variables are not supplied or are placeholders
export const supabaseUrl = (envUrl && envUrl !== 'undefined' && !envUrl.includes('placeholder'))
  ? envUrl
  : 'https://bgftqligmdevwxqdnjup.supabase.co';

export const supabaseAnonKey = (envAnonKey && envAnonKey !== 'undefined' && !envAnonKey.includes('placeholder'))
  ? envAnonKey
  : 'placeholder';

console.log("[Auth] Initializing Supabase client. Project URL:", supabaseUrl);

export const isSupabaseConfigured = () => {
  const url = supabaseUrl;
  const key = supabaseAnonKey;
  if (!url || !key) return false;
  if (url.includes('placeholder') || key.includes('placeholder')) {
    return false;
  }
  return true;
};

// One single global Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Clean session purger used for clear sign out handshake
export async function clearSessionAndSignOut() {
  console.log("[Auth] Purging client cache...");
  localStorage.removeItem('wallovo_user_session');
  
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
    console.warn("[Auth] Cache sweep warning:", err);
  }

  try {
    await supabase.auth.signOut();
    console.log("[Auth] Signout complete.");
  } catch (err) {
    console.warn("[Auth] Supabase signOut execution warning:", err);
  }
}
