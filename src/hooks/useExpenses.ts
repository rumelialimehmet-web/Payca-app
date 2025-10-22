import { useState, useEffect } from 'react';
import { db, subscriptions } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  paid_by_profile?: {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  expense_splits?: Array<{
    id: string;
    user_id: string;
    amount: number;
    settled: boolean;
    settled_at: string | null;
    profiles: {
      id: string;
      email: string;
      display_name: string | null;
      avatar_url: string | null;
    };
  }>;
};

export function useExpenses(groupId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchExpenses = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const { data, error } = await db.expenses.list(groupId);
      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    // Subscribe to real-time changes
    const subscription = subscriptions.subscribeToGroup(groupId, () => {
      fetchExpenses();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [groupId]);

  const createExpense = async (
    expense: Database['public']['Tables']['expenses']['Insert'],
    splits: Array<{ user_id: string; amount: number }>
  ) => {
    try {
      const { data, error } = await db.expenses.create(expense, splits);
      if (error) throw error;
      await fetchExpenses(); // Refresh list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      const { error } = await db.expenses.delete(expenseId);
      if (error) throw error;
      await fetchExpenses(); // Refresh list
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  // Calculate balances for group members
  const calculateBalances = () => {
    const balances: Record<string, number> = {};

    expenses.forEach((expense) => {
      // Person who paid should receive money
      if (expense.paid_by) {
        balances[expense.paid_by] = (balances[expense.paid_by] || 0) + expense.amount;
      }

      // People who owe money
      expense.expense_splits?.forEach((split) => {
        if (!split.settled) {
          balances[split.user_id] = (balances[split.user_id] || 0) - split.amount;
        }
      });
    });

    return balances;
  };

  // Calculate who owes whom
  const calculateSettlements = () => {
    const balances = calculateBalances();
    const debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < 0)
      .map(([userId, balance]) => ({ userId, amount: Math.abs(balance) }))
      .sort((a, b) => b.amount - a.amount);

    const creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0)
      .map(([userId, balance]) => ({ userId, amount: balance }))
      .sort((a, b) => b.amount - a.amount);

    const settlements: Array<{
      from: string;
      to: string;
      amount: number;
    }> = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      if (amount > 0.01) {
        // Ignore very small amounts
        settlements.push({
          from: debtor.userId,
          to: creditor.userId,
          amount: Math.round(amount * 100) / 100,
        });
      }

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return settlements;
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    deleteExpense,
    calculateBalances,
    calculateSettlements,
  };
}
