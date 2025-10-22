import { useState, useEffect } from 'react';
import { db, subscriptions } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Group = Database['public']['Tables']['groups']['Row'] & {
  group_members?: Array<{
    id: string;
    user_id: string;
    profiles: {
      id: string;
      email: string;
      display_name: string | null;
      avatar_url: string | null;
    };
  }>;
};

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.groups.list();
      if (error) throw error;
      setGroups(data || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const createGroup = async (group: Database['public']['Tables']['groups']['Insert']) => {
    try {
      const { data, error } = await db.groups.create(group);
      if (error) throw error;
      await fetchGroups(); // Refresh list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const updateGroup = async (
    groupId: string,
    updates: Database['public']['Tables']['groups']['Update']
  ) => {
    try {
      const { data, error } = await db.groups.update(groupId, updates);
      if (error) throw error;
      await fetchGroups(); // Refresh list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await db.groups.delete(groupId);
      if (error) throw error;
      await fetchGroups(); // Refresh list
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const addMember = async (groupId: string, userId: string) => {
    try {
      const { data, error } = await db.groupMembers.add(groupId, userId);
      if (error) throw error;
      await fetchGroups(); // Refresh list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const removeMember = async (groupId: string, userId: string) => {
    try {
      const { error } = await db.groupMembers.remove(groupId, userId);
      if (error) throw error;
      await fetchGroups(); // Refresh list
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  return {
    groups,
    loading,
    error,
    refetch: fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
  };
}

export function useGroup(groupId: string) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchGroup = async () => {
      try {
        setLoading(true);
        const { data, error } = await db.groups.get(groupId);
        if (error) throw error;
        setGroup(data as Group);
      } catch (err) {
        setError(err);
        console.error('Error fetching group:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();

    // Subscribe to group members changes
    const subscription = subscriptions.subscribeToGroupMembers(groupId, () => {
      fetchGroup(); // Refresh on changes
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [groupId]);

  return { group, loading, error };
}
