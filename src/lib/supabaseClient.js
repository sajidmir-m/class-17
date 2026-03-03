import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Lightweight mock client so the frontend doesn't crash if Supabase isn't configured yet.
// This lets the UI load while you set up your .env and Supabase project.
const createMockSupabase = () => {
  console.warn(
    'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file to enable backend features.'
  )

  // Mimic the PostgREST query builder enough for our UI to keep working:
  // - Reads return empty arrays instead of throwing (so public pages can load)
  // - Writes return an explicit "Supabase not configured" error (so admin actions fail clearly)
  const emptyReadResult = { data: [], error: null, count: 0 }

  const makeReadableQuery = () => {
    // A thenable chain so `await supabase.from().select().eq()` works like the real client
    const chain = {
      select: () => chain,
      eq: () => chain,
      in: () => chain,
      order: () => chain,
      limit: () => chain,
      single: async () => ({ data: null, error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
      then: (resolve, reject) => Promise.resolve(emptyReadResult).then(resolve, reject),
      catch: (reject) => Promise.resolve(emptyReadResult).catch(reject),
      finally: (cb) => Promise.resolve(emptyReadResult).finally(cb),
    }
    return chain
  }

  const mockTable = () => ({
    // Read/query methods
    select: () => makeReadableQuery(),

    // Write methods (keep them as explicit errors)
    insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
    update: async () => ({ data: null, error: new Error('Supabase not configured') }),
    delete: async () => ({ data: null, error: new Error('Supabase not configured') }),

    // Some code may start chains from eq/in directly
    eq: () => makeReadableQuery(),
    in: () => makeReadableQuery(),
  })

  return {
    from: () => mockTable(),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({
        data: { user: null },
        error: new Error('Supabase not configured'),
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    channel: () => ({
      on() {
        return this
      },
      subscribe() {
        return {
          unsubscribe() {},
        }
      },
    }),
  }
}

const isValidSupabaseUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

let supabase

if (isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  supabase = createMockSupabase()
}

export { supabase }

