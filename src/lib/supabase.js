import { createClient } from '@supabase/supabase-js'

console.log("VITE_SUPABASE_URL: ", import.meta.env.VITE_SUPABASE_URL)
console.log("VITE_SUPABASE_ANON_KEY: ", import.meta.env.VITE_SUPABASE_ANON_KEY)

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error("Developer notice: Supabase URL or Anon Key is undefined. Please verify environment variable configuration.")
}

export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) return false;
  
  const urlStr = String(url).trim();
  const keyStr = String(key).trim();
  
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
  
  const isInvalid = invalidKeywords.some(kw => 
    urlStr.toLowerCase().includes(kw) || keyStr.toLowerCase().includes(kw)
  );
  
  if (isInvalid) return false;
  if (!urlStr.startsWith('https://')) return false;
  
  return true;
};

// Global indicator to track if Supabase REST endpoint is unresponsive
let isSupabaseOffline = false;

const realSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project-id.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// Live heartbeat check to instantly fallback to mock database if CORS or network block is active
if (isSupabaseConfigured()) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  const checkUrl = import.meta.env.VITE_SUPABASE_URL;
  
  fetch(checkUrl, { method: 'GET', mode: 'no-cors', signal: controller.signal })
    .then(() => {
      clearTimeout(timeoutId);
      console.log("[Auth] Connection heartbeat check: SUCCESS. Using live integration.");
    })
    .catch((err) => {
      clearTimeout(timeoutId);
      console.warn("[Auth] Connection heartbeat check: FAIL. Switching to local mock engine.", err);
      isSupabaseOffline = true;
    });
}

export async function clearSessionAndSignOut() {
  console.log("[Auth] Synchronously purging all client-side authentication states...");
  
  // 1. Instantly clear mock and standard storage keys to bypass stale states
  const localKeys = [
    'mock_supabase_session',
    'mock_auth_user',
    'wallovo_user_session',
    'supabase.auth.token'
  ];
  localKeys.forEach(k => localStorage.removeItem(k));
  
  // 2. Clear all dynamic Supabase keys starting with sb- or containing auth-token
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
    console.warn("Storage search/clear exception encountered during purge:", err);
  }

  // 3. Attempt non-blocking signOut or force timeout within 1 second if network hangs
  try {
    const targetAuth = isSupabaseConfigured() && !isSupabaseOffline ? realSupabase.auth : mockAuth;
    const signOutPromise = targetAuth.signOut();
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ error: null }), 1000));
    
    await Promise.race([signOutPromise, timeoutPromise]);
    console.log("[Auth] Purge complete.");
  } catch (err) {
    console.warn("SignOut request generated non-blocking exception during purge:", err);
  }
}

let authListeners = []

function notifyAuthChange(event, session) {
  authListeners.forEach(listener => {
    try {
      listener(event, session)
    } catch (err) {
      console.error("Error in mock auth listener:", err)
    }
  })
}

class MockQueryBuilder {
  constructor(table) {
    this.table = table
    this.filters = []
  }

  select(columns) {
    const builder = {
      eq: (field, value) => {
        this.filters.push({ field, value })
        return builder
      },
      maybeSingle: () => {
        return this.execute().then(res => {
          const item = res.data && res.data.length > 0 ? res.data[0] : null
          return { data: item, error: null }
        })
      },
      then: (onfulfilled, onrejected) => {
        return this.execute().then(onfulfilled, onrejected)
      }
    }
    return builder
  }

  execute() {
    const listKey = `wallovo_mock_table_${this.table}`
    const list = JSON.parse(localStorage.getItem(listKey) || '[]')
    let filtered = [...list]
    this.filters.forEach(filter => {
      filtered = filtered.filter(item => item[filter.field] === filter.value)
    })
    return Promise.resolve({ data: filtered, error: null })
  }

  insert(dataArray) {
    const listKey = `wallovo_mock_table_${this.table}`
    let list = JSON.parse(localStorage.getItem(listKey) || '[]')
    const newItems = dataArray.map(item => ({
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString(),
      ...item
    }))
    list = [...list, ...newItems]
    localStorage.setItem(listKey, JSON.stringify(list))
    
    // Return a thenable for async await compatibility
    const builder = {
      then: (onfulfilled, onrejected) => {
        return Promise.resolve({ data: newItems, error: null }).then(onfulfilled, onrejected)
      }
    }
    return builder
  }
}

const mockAuth = {
  async getSession() {
    const sessionStr = localStorage.getItem('mock_supabase_session')
    const session = sessionStr ? JSON.parse(sessionStr) : null
    return { data: { session }, error: null }
  },

  onAuthStateChange(callback) {
    authListeners.push(callback)
    const sessionStr = localStorage.getItem('mock_supabase_session')
    const session = sessionStr ? JSON.parse(sessionStr) : null
    
    setTimeout(() => {
      try {
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session)
      } catch (err) {
        console.error("onAuthStateChange initial trigger failed:", err)
      }
    }, 0)

    return {
      data: {
        subscription: {
          unsubscribe() {
            authListeners = authListeners.filter(l => l !== callback)
          }
        }
      }
    }
  },

  async signUp({ email, password, options }) {
    const accounts = JSON.parse(localStorage.getItem('wallovo_mock_accounts') || '[]')
    if (accounts.some(acc => acc.email === email)) {
      return {
        data: { user: null },
        error: { message: "An account with this email already exists." }
      }
    }

    const fullName = options?.data?.full_name || email.split('@')[0]
    const newAccount = {
      email,
      password,
      fullName,
      createdAt: new Date().toISOString()
    }
    accounts.push(newAccount)
    localStorage.setItem('wallovo_mock_accounts', JSON.stringify(accounts))

    const mockUser = {
      id: "mock-user-" + email,
      email,
      user_metadata: { full_name: fullName },
      identities: [{ id: email, provider: "email" }],
      created_at: newAccount.createdAt
    }

    return { data: { user: mockUser }, error: null }
  },

  async signInWithPassword({ email, password }) {
    const accounts = JSON.parse(localStorage.getItem('wallovo_mock_accounts') || '[]')
    const found = accounts.find(acc => acc.email === email && acc.password === password)
    
    if (!found) {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid email or password." }
      }
    }

    const mockUser = {
      id: "mock-user-" + email,
      email,
      user_metadata: { full_name: found.fullName },
      aud: "authenticated",
      role: "authenticated",
      created_at: found.createdAt || new Date().toISOString()
    }

    const mockSession = {
      access_token: "mock-access-token-" + email,
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token-" + email,
      user: mockUser
    }

    localStorage.setItem('mock_supabase_session', JSON.stringify(mockSession))
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser))
    localStorage.setItem('wallovo_user_session', JSON.stringify({
      email: mockUser.email,
      fullName: found.fullName
    }))

    notifyAuthChange('SIGNED_IN', mockSession)

    return { data: { user: mockUser, session: mockSession }, error: null }
  },

  async signOut() {
    localStorage.removeItem('mock_supabase_session')
    localStorage.removeItem('mock_auth_user')
    localStorage.removeItem('wallovo_user_session')
    
    notifyAuthChange('SIGNED_OUT', null)
    
    return { error: null }
  },

  async updateUser(payload) {
    const sessionStr = localStorage.getItem('mock_supabase_session')
    if (!sessionStr) {
      return { data: { user: null }, error: { message: "No active session." } }
    }
    const session = JSON.parse(sessionStr)
    const updatedName = payload.data?.full_name || session.user.user_metadata?.full_name

    session.user.user_metadata.full_name = updatedName
    localStorage.setItem('mock_supabase_session', JSON.stringify(session))
    localStorage.setItem('mock_auth_user', JSON.stringify(session.user))
    localStorage.setItem('wallovo_user_session', JSON.stringify({
      email: session.user.email,
      fullName: updatedName
    }))

    const accounts = JSON.parse(localStorage.getItem('wallovo_mock_accounts') || '[]')
    const idx = accounts.findIndex(acc => acc.email === session.user.email)
    if (idx !== -1) {
      accounts[idx].fullName = updatedName
      localStorage.setItem('wallovo_mock_accounts', JSON.stringify(accounts))
    }

    notifyAuthChange('USER_UPDATED', session)

    return { data: { user: session.user }, error: null }
  }
}

export const supabase = {
  get auth() {
    const activeClient = isSupabaseConfigured() && !isSupabaseOffline ? realSupabase.auth : mockAuth;
    return {
      async getSession() {
        console.log("[Auth] session restore request initiated...");
        try {
          const result = await activeClient.getSession();
          console.log("[Auth] session restore complete:", result?.data?.session ? "Active Session" : "No Session");
          return result;
        } catch (err) {
          console.error("[Auth] session restore exception:", err);
          return { data: { session: null }, error: err };
        }
      },
      onAuthStateChange(callback) {
        console.log("[Auth] registering state change listener...");
        return activeClient.onAuthStateChange(callback);
      },
      async signUp(payload) {
        console.log("[Auth] executing signUp payload...");
        try {
          const result = await activeClient.signUp(payload);
          return result;
        } catch (err) {
          console.error("[Auth] signUp error:", err);
          return { data: { user: null }, error: err };
        }
      },
      async signInWithPassword(payload) {
        console.log("[Auth] executing signInWithPassword payload...");
        try {
          const result = await activeClient.signInWithPassword(payload);
          return result;
        } catch (err) {
          console.error("[Auth] signInWithPassword error:", err);
          return { data: { session: null, user: null }, error: err };
        }
      },
      async signOut() {
        console.log("[Auth] executing signOut...");
        try {
          const result = await activeClient.signOut();
          return result;
        } catch (err) {
          console.error("[Auth] signOut error:", err);
          return { error: err };
        }
      },
      async updateUser(payload) {
        console.log("[Auth] executing updateUser payload...");
        try {
          const result = await activeClient.updateUser(payload);
          return result;
        } catch (err) {
          console.error("[Auth] updateUser error:", err);
          return { data: { user: null }, error: err };
        }
      }
    };
  },

  from(table) {
    if (isSupabaseConfigured() && !isSupabaseOffline) {
      return realSupabase.from(table)
    }
    return new MockQueryBuilder(table)
  }
}
