// Mock Supabase client for testing
export const supabase = {
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
      order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      range: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ error: null })),
      in: jest.fn(() => Promise.resolve({ error: null })),
    })),
  })),
};

