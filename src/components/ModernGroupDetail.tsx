import React, { useState, useMemo } from 'react';
import { Tabs } from './Tabs';
import { ExpenseCard } from './ExpenseCard';
import { BottomNav } from './BottomNav';

export interface ModernGroupDetailProps {
  group: any;
  currentUser: { id: string; name: string };
  onBack: () => void;
  onSettings?: () => void;
  onAddExpense: () => void;
  onExpenseClick?: (expenseId: string) => void;
  onTabChange?: (tab: 'home' | 'groups' | 'activity' | 'profile') => void;
  activeBottomTab?: 'home' | 'groups' | 'activity' | 'profile';
}

export function ModernGroupDetail({
  group,
  currentUser,
  onBack,
  onSettings,
  onAddExpense,
  onExpenseClick,
  onTabChange,
  activeBottomTab = 'home'
}: ModernGroupDetailProps) {
  const [activeTab, setActiveTab] = useState('expenses');

  // Get group icon based on type
  const getGroupIcon = () => {
    const iconMap: Record<string, string> = {
      'Ev Arkadaşları': '🏠',
      'Tatil Grubu': '🏖️',
      'Etkinlik': '🎉',
      'Genel': '📝'
    };
    return iconMap[group.type] || '📝';
  };

  // Calculate user's balance in this group
  const userBalance = useMemo(() => {
    let balance = 0;

    group.expenses?.forEach((expense: any) => {
      if (expense.paidBy === currentUser.id) {
        balance += expense.amount;
      }

      // Subtract user's share
      if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
        const userSplit = expense.splits.find((s: any) => s.memberId === currentUser.id);
        if (userSplit) {
          balance -= userSplit.amount || 0;
        }
      } else {
        // Equal split
        balance -= expense.amount / (group.members?.length || 1);
      }
    });

    return balance;
  }, [group.expenses, group.members, currentUser.id]);

  // Group expenses by date
  const expensesByDate = useMemo(() => {
    if (!group.expenses || group.expenses.length === 0) {
      return [];
    }

    const grouped: Record<string, any[]> = {};

    group.expenses.forEach((expense: any) => {
      const date = new Date(expense.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateLabel;
      if (date.toDateString() === today.toDateString()) {
        dateLabel = 'Bugün';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = 'Dün';
      } else {
        dateLabel = date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }

      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }
      grouped[dateLabel].push(expense);
    });

    return Object.entries(grouped).map(([date, expenses]) => ({
      date,
      expenses: expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
  }, [group.expenses]);

  // Calculate each member's balance
  const memberBalances = useMemo(() => {
    const balances: Record<string, { name: string; balance: number; avatar?: string }> = {};

    group.members?.forEach((member: any) => {
      balances[member.id] = { name: member.name, balance: 0, avatar: member.avatar };
    });

    group.expenses?.forEach((expense: any) => {
      if (balances[expense.paidBy]) {
        balances[expense.paidBy].balance += expense.amount;
      }

      if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
        expense.splits.forEach((split: any) => {
          if (balances[split.memberId]) {
            balances[split.memberId].balance -= split.amount || 0;
          }
        });
      } else {
        const sharePerMember = expense.amount / (group.members?.length || 1);
        group.members?.forEach((member: any) => {
          if (balances[member.id]) {
            balances[member.id].balance -= sharePerMember;
          }
        });
      }
    });

    return Object.entries(balances).map(([id, data]) => ({
      id,
      ...data
    }));
  }, [group.expenses, group.members]);

  const tabs = [
    { id: 'expenses', label: 'Harcamalar' },
    { id: 'balances', label: 'Bakiyeler' },
    { id: 'statistics', label: 'İstatistikler' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">arrow_back</span>
            </button>
            {onSettings && (
              <button
                onClick={onSettings}
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">settings</span>
              </button>
            )}
          </div>

          {/* Group Name */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">{getGroupIcon()}</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {group.name}
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {group.members?.length || 0} üye
          </p>
        </div>
      </div>

      {/* Simple Balance Card */}
      <div className="max-w-[480px] mx-auto px-4 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Senin bakiyen
              </p>
              <p className={`text-3xl font-bold ${
                userBalance >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {userBalance >= 0 ? '+' : ''}{userBalance.toFixed(0)}₺
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {userBalance >= 0 ? 'Sana borçlular' : 'Sen borçlusun'}
              </p>
            </div>
            {userBalance > 0 && (
              <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Tahsil Et
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[480px] mx-auto px-4 pt-2">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-[480px] mx-auto">
        {activeTab === 'expenses' && (
          <div className="flex flex-col">
            {expensesByDate.length > 0 ? (
              expensesByDate.map(({ date, expenses }) => (
                <div key={date}>
                  {/* Simple Date Header */}
                  <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{date}</p>
                  </div>

                  {/* Expenses for this date */}
                  <div className="px-4 space-y-3 py-3">
                    {expenses.map((expense: any) => {
                      const userPaid = expense.paidBy === currentUser.id;
                      let userShare = 0;

                      if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
                        const split = expense.splits.find((s: any) => s.memberId === currentUser.id);
                        userShare = split?.amount || 0;
                      } else {
                        userShare = expense.amount / (group.members?.length || 1);
                      }

                      const isUserOwed = userPaid && userShare < expense.amount;

                      return (
                        <ExpenseCard
                          key={expense.id}
                          id={expense.id}
                          title={expense.description}
                          amount={expense.amount}
                          paidBy={{
                            id: expense.paidBy,
                            name: group.members?.find((m: any) => m.id === expense.paidBy)?.name || 'Bilinmeyen',
                            avatar: group.members?.find((m: any) => m.id === expense.paidBy)?.avatar
                          }}
                          userShare={userPaid ? (expense.amount - userShare) : userShare}
                          isUserOwed={isUserOwed}
                          category={expense.category}
                          onClick={() => onExpenseClick?.(expense.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              // Simple Empty State
              <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-4xl">receipt_long</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Henüz harcama yok
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  İlk harcamayı ekle
                </p>
                <button
                  onClick={onAddExpense}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Harcama Ekle
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="px-4 py-6 space-y-3">
            {memberBalances.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="size-10 rounded-full"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {member.name}
                  </p>
                </div>
                <p className={`text-lg font-bold ${
                  member.balance >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {member.balance >= 0 ? '+' : ''}{member.balance.toFixed(0)}₺
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="px-4 py-6">
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 mx-auto">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-4xl">bar_chart</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                İstatistikler yakında
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Harcama istatistikleri hazırlanıyor
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeBottomTab}
        onTabChange={onTabChange}
        onAddClick={onAddExpense}
      />
    </div>
  );
}

export default ModernGroupDetail;
