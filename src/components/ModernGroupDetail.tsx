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
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Gradient Header */}
      <div className="relative h-[240px] w-full overflow-hidden bg-gradient-to-br from-indigo-400 to-primary p-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex h-full flex-col">
          {/* Header Buttons */}
          <div className="flex items-center h-12 justify-between">
            <button
              onClick={onBack}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            {onSettings && (
              <button
                onClick={onSettings}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>
            )}
          </div>

          {/* Group Info */}
          <div className="flex flex-1 flex-col items-start justify-end pb-12">
            <p className="text-[80px] leading-none -ml-2">{getGroupIcon()}</p>
            <p className="text-white tracking-tight text-[28px] font-bold leading-tight">
              {group.name}
            </p>
            <p className="text-white/80 text-sm font-normal leading-normal">
              {group.members?.length || 0} Üye
            </p>
          </div>
        </div>
      </div>

      {/* Balance Card (Glassmorphism) */}
      <div className="relative z-20 -mt-16 px-4 max-w-[480px] mx-auto">
        <div className="w-full rounded-2xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-lg dark:border-white/10 dark:bg-slate-800/70">
          <div className="flex flex-col items-stretch justify-center gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Senin Bakiyen
            </p>
            <p className={`text-[40px] font-bold leading-tight tracking-tighter ${
              userBalance >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {userBalance >= 0 ? '+' : ''}{userBalance.toFixed(0)}₺
            </p>
            <div className="flex items-end justify-between gap-3">
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                {userBalance >= 0 ? 'Sana borçlular' : 'Sen borçlusun'}
              </p>
              {userBalance > 0 && (
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-amber-500 text-white text-sm font-bold leading-normal shadow-md transition-transform hover:scale-105 active:scale-95">
                  <span className="truncate">Tahsil Et</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[480px] mx-auto pt-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sticky
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-[480px] mx-auto">
        {activeTab === 'expenses' && (
          <div className="flex flex-col">
            {expensesByDate.length > 0 ? (
              expensesByDate.map(({ date, expenses }) => (
                <div key={date}>
                  {/* Sticky Date Header */}
                  <div className="sticky top-[53px] z-10 border-b border-slate-200 bg-slate-50/95 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/95">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{date}</p>
                  </div>

                  {/* Expenses for this date */}
                  <div className="px-4 space-y-4 pt-4">
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
              // Empty State
              <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
                <div className="text-6xl">🧾</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Henüz Harcama Yok!
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  İlk harcamayı ekleyen sen ol. Burası çok sessiz.
                </p>
                <button
                  onClick={onAddExpense}
                  className="mt-2 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined">add</span>
                  İlk Harcamayı Ekle
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
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                İstatistikler Yakında!
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Harcama istatistikleri ve grafikler hazırlanıyor.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onAddExpense}
        className="fixed bottom-24 right-6 z-30 flex size-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <span className="material-symbols-outlined text-4xl">add</span>
      </button>

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
