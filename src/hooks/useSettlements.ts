import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Settlement = Database['public']['Tables']['settlements']['Row'] & {
  from_user?: {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  to_user?: {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export function useSettlements(groupId: string) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSettlements = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const { data, error } = await db.settlements.list(groupId);
      if (error) throw error;
      setSettlements(data || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching settlements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, [groupId]);

  const createSettlement = async (
    settlement: Database['public']['Tables']['settlements']['Insert']
  ) => {
    try {
      const { data, error } = await db.settlements.create(settlement);
      if (error) throw error;
      await fetchSettlements(); // Refresh list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const markAsSettled = async (settlementId: string) => {
    try {
      const { data, error } = await db.settlements.markAsSettled(settlementId);
      if (error) throw error;
      await fetchSettlements(); // Refresh list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return {
    settlements,
    loading,
    error,
    refetch: fetchSettlements,
    createSettlement,
    markAsSettled,
  };
}
