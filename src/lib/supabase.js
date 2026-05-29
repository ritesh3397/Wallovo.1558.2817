import { createClient } from '@supabase/supabase-js'

console.log("[Auth] VITE_SUPABASE_URL: ", import.meta.env.VITE_SUPABASE_URL)
console.log("[Auth] VITE_SUPABASE_ANON_KEY: ", import.meta.env.VITE_SUPABASE_ANON_KEY)

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

// Synchronously determine which backend deployment client to use
const useRealSupabase = isSupabaseConfigured();

console.log(`[Auth] Selecting Auth Backend: ${useRealSupabase ? 'REAL SUPABASE LIVE INSTANCE' : 'LOCAL MOCK AUTONOMOUS ENGINE'}`);

const realSupabase = useRealSupabase
  ? createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
  : null;

// Mock database and authentication client implementation
let authListeners = [];

function notifyAuthChange(event, session) {
  authListeners.forEach(listener => {
    try {
      listener(event, session);
    } catch (err) {
      console.error("[MockAuth] Listener callback exception:", err);
    }
  });
}

class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
  }

  select(columns) {
    const builder = {
      eq: (field, value) => {
        this.filters.push({ field, value });
        return builder;
      },
      maybeSingle: () => {
        return this.execute().then(res => {
          const item = res.data && res.data.length > 0 ? res.data[0] : null;
          return { data: item, error: null };
        });
      },
      then: (onfulfilled, onrejected) => {
        return this.execute().then(onfulfilled, onrejected);
      }
    };
    return builder;
  }

  execute() {
    const listKey = `wallovo_mock_table_${this.table}`;
    const list = JSON.parse(localStorage.getItem(listKey) || '[]');
    let filtered = [...list];
    this.filters.forEach(filter => {
      filtered = filtered.filter(item => item[filter.field] === filter.value);
    });
    return Promise.resolve({ data: filtered, error: null });
  }

  insert(dataArray) {
    const listKey = `wallovo_mock_table_${this.table}`;
    let list = JSON.parse(localStorage.getItem(listKey) || '[]');
    const newItems = dataArray.map(item => ({
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString(),
      ...item
    }));
    list = [...list, ...newItems];
    localStorage.setItem(listKey, JSON.stringify(list));
    
    return {
      then: (onfulfilled, onrejected) => {
        return Promise.resolve({ data: newItems, error: null }).then(onfulfilled, onrejected);
      }
    };
  }
}

const mockAuth = {
  async getSession() {
    const sessionStr = localStorage.getItem('mock_supabase_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    return { data: { session }, error: null };
  },

  onAuthStateChange(callback) {
    authListeners.push(callback);
    const sessionStr = localStorage.getItem('mock_supabase_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    // Defer initial delivery to guarantee callbacks register beforehand
    setTimeout(() => {
      try {
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      } catch (err) {
        console.error("[MockAuth] Initial State Delivery Failure:", err);
      }
    }, 0);

    return {
      data: {
        subscription: {
          unsubscribe() {
            authListeners = authListeners.filter(l => l !== callback);
          }
        }
      }
    };
  },

  async signUp({ email, password, options }) {
    const accounts = JSON.parse(localStorage.getItem('wallovo_mock_accounts') || '[]');
    if (accounts.some(acc => acc.email === email)) {
      return {
        data: { user: null },
        error: { message: "An account with this email already exists." }
      };
    }

    const fullName = options?.data?.full_name || email.split('@')[0];
    const newAccount = {
      email,
      password,
      fullName,
      createdAt: new Date().toISOString()
    };
    accounts.push(newAccount);
    localStorage.setItem('wallovo_mock_accounts', JSON.stringify(accounts));

    const mockUser = {
      id: "mock-user-" + email,
      email,
      user_metadata: { full_name: fullName },
      identities: [{ id: email, provider: "email" }],
      created_at: newAccount.createdAt
    };

    return { data: { user: mockUser }, error: null };
  },

  async signInWithPassword({ email, password }) {
    const accounts = JSON.parse(localStorage.getItem('wallovo_mock_accounts') || '[]');
    const found = accounts.find(acc => acc.email === email && acc.password === password);
    
    if (!found) {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid email or password." }
      };
    }

    const mockUser = {
      id: "mock-user-" + email,
      email,
      user_metadata: { full_name: found.fullName },
      aud: "authenticated",
      role: "authenticated",
      created_at: found.createdAt || new Date().toISOString()
    };

    const mockSession = {
      access_token: "mock-access-token-" + email,
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token-" + email,
      user: mockUser
    };

    localStorage.setItem('mock_supabase_session', JSON.stringify(mockSession));
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    localStorage.setItem('wallovo_user_session', JSON.stringify({
      email: mockUser.email,
      fullName: found.fullName
    }));

    notifyAuthChange('SIGNED_IN', mockSession);

    return { data: { user: mockUser, session: mockSession }, error: null };
  },

  async signOut() {
    localStorage.removeItem('mock_supabase_session');
    localStorage.removeItem('mock_auth_user');
    localStorage.removeItem('wallovo_user_session');
    
    notifyAuthChange('SIGNED_OUT', null);
    
    return { error: null };
  },

  async updateUser(payload) {
    const sessionStr = localStorage.getItem('mock_supabase_session');
    if (!sessionStr) {
      return { data: { user: null }, error: { message: "No active session." } };
    }
    const session = JSON.parse(sessionStr);
    const updatedName = payload.data?.full_name || session.user.user_metadata?.full_name;

    session.user.user_metadata.full_name = updatedName;
    localStorage.setItem('mock_supabase_session', JSON.stringify(session));
    localStorage.setItem('mock_auth_user', JSON.stringify(session.user));
    localStorage.setItem('wallovo_user_session', JSON.stringify({
      email: session.user.email,
      fullName: updatedName
    }));

    const accounts = JSON.parse(localStorage.getItem('wallovo_mock_accounts') || '[]');
    const idx = accounts.findIndex(acc => acc.email === session.user.email);
    if (idx !== -1) {
      accounts[idx].fullName = updatedName;
      localStorage.setItem('wallovo_mock_accounts', JSON.stringify(accounts));
    }

    notifyAuthChange('USER_UPDATED', session);

    return { data: { user: session.user }, error: null };
  }
};

export const activeAuthClient = useRealSupabase ? realSupabase.auth : mockAuth;

export const supabase = {
  auth: activeAuthClient,
  from(table) {
    if (useRealSupabase) {
      return realSupabase.from(table);
    }
    return new MockQueryBuilder(table);
  }
};

export async function clearSessionAndSignOut() {
  console.log("[Auth] Synchronously purging client cached credentials...");
  
  const localKeys = [
    'mock_supabase_session',
    'mock_auth_user',
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
    await activeAuthClient.signOut();
  } catch (err) {
    console.warn("[Auth] Signout execution warning:", err);
  }
}
