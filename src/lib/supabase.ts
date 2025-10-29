import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key');

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase not configured. App will use localStorage only.\n' +
    'To enable cloud sync and multi-user features, add Supabase credentials to .env.local'
  );
}

// Create Supabase client with TypeScript types (or null if not configured)
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  : null;

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, displayName?: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    if (!supabase) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    if (!supabase) {
      return { data: { session: null }, error: null };
    }
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  getUser: async () => {
    if (!supabase) {
      return { data: { user: null }, error: null };
    }
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const db = {
  // Profile operations
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    },

    update: async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    },
  },

  // Group operations
  groups: {
    list: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members (
            id,
            user_id,
            profiles (
              id,
              email,
              display_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    get: async (groupId: string) => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members (
            id,
            user_id,
            profiles (
              id,
              email,
              display_name,
              avatar_url
            )
          )
        `)
        .eq('id', groupId)
        .single();
      return { data, error };
    },

    create: async (group: Database['public']['Tables']['groups']['Insert']) => {
      const { data, error } = await supabase
        .from('groups')
        .insert(group)
        .select()
        .single();
      return { data, error };
    },

    update: async (groupId: string, updates: Database['public']['Tables']['groups']['Update']) => {
      const { data, error } = await supabase
        .from('groups')
        .update(updates)
        .eq('id', groupId)
        .select()
        .single();
      return { data, error };
    },

    delete: async (groupId: string) => {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);
      return { error };
    },
  },

  // Group members operations
  groupMembers: {
    add: async (groupId: string, userId: string) => {
      const { data, error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: userId })
        .select()
        .single();
      return { data, error };
    },

    remove: async (groupId: string, userId: string) => {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
      return { error };
    },
  },

  // Expense operations
  expenses: {
    list: async (groupId: string) => {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          paid_by_profile:profiles!expenses_paid_by_fkey (
            id,
            email,
            display_name,
            avatar_url
          ),
          expense_splits (
            id,
            user_id,
            amount,
            settled,
            settled_at,
            profiles (
              id,
              email,
              display_name,
              avatar_url
            )
          )
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    create: async (
      expense: Database['public']['Tables']['expenses']['Insert'],
      splits: Array<{ user_id: string; amount: number }>
    ) => {
      // Create expense
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .insert(expense)
        .select()
        .single();

      if (expenseError || !expenseData) {
        return { data: null, error: expenseError };
      }

      // Create splits
      const splitsWithExpenseId = splits.map(split => ({
        expense_id: expenseData.id,
        user_id: split.user_id,
        amount: split.amount,
      }));

      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(splitsWithExpenseId);

      if (splitsError) {
        return { data: null, error: splitsError };
      }

      return { data: expenseData, error: null };
    },

    delete: async (expenseId: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);
      return { error };
    },
  },

  // Settlement operations
  settlements: {
    list: async (groupId: string) => {
      const { data, error } = await supabase
        .from('settlements')
        .select(`
          *,
          from_user:profiles!settlements_from_user_id_fkey (
            id,
            email,
            display_name,
            avatar_url
          ),
          to_user:profiles!settlements_to_user_id_fkey (
            id,
            email,
            display_name,
            avatar_url
          )
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    create: async (settlement: Database['public']['Tables']['settlements']['Insert']) => {
      const { data, error } = await supabase
        .from('settlements')
        .insert(settlement)
        .select()
        .single();
      return { data, error };
    },

    markAsSettled: async (settlementId: string) => {
      const { data, error } = await supabase
        .from('settlements')
        .update({ settled: true, settled_at: new Date().toISOString() })
        .eq('id', settlementId)
        .select()
        .single();
      return { data, error };
    },
  },
};

// Storage operations for receipts
export const storage = {
  receipts: {
    // Upload a receipt image
    upload: async (file: File, userId: string) => {
      if (!supabase) {
        return { data: null, error: new Error('Supabase not configured') };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
      if (!allowedTypes.includes(file.type)) {
        return {
          data: null,
          error: new Error('Geçersiz dosya tipi. Sadece JPG, PNG, WEBP ve HEIC desteklenmektedir.')
        };
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          data: null,
          error: new Error('Dosya boyutu çok büyük. Maksimum 10MB yüklenebilir.')
        };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        return { data: null, error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      return { data: { path: fileName, publicUrl }, error: null };
    },

    // Delete a receipt image
    delete: async (filePath: string) => {
      if (!supabase) {
        return { error: new Error('Supabase not configured') };
      }

      const { error } = await supabase.storage
        .from('receipts')
        .remove([filePath]);

      return { error };
    },

    // Get public URL for a receipt
    getPublicUrl: (filePath: string) => {
      if (!supabase) {
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      return publicUrl;
    },
  },
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to group changes
  subscribeToGroup: (groupId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`group:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `group_id=eq.${groupId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to group members changes
  subscribeToGroupMembers: (groupId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`group-members:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`,
        },
        callback
      )
      .subscribe();
  },
};
