import React from 'react';
import { BalanceCard } from './BalanceCard';
import { GroupCard } from './GroupCard';
import { BottomNav } from './BottomNav';

export interface ModernHomepageProps {
  user: { id: string; name: string };
  groups: any[];
  onSelectGroup: (id: string) => void;
  onCreateGroup: () => void;
  onAddExpense: () => void;
  onShowRecurringExpenses?: () => void;
  onShowAllGroups?: () => void;
  activeTab?: 'home' | 'groups' | 'activity' | 'profile';
  onTabChange?: (tab: 'home' | 'groups' | 'activity' | 'profile') => void;
}

export function ModernHomepage({
  user,
  groups,
  onSelectGroup,
  onCreateGroup,
  onAddExpense,
  onShowRecurringExpenses,
  onShowAllGroups,
  activeTab = 'home',
  onTabChange
}: ModernHomepageProps) {
  // Calculate total balance across all groups
  const calculateUserBalance = () => {
    let totalOwed = 0;
    let totalOwing = 0;

    groups.forEach(group => {
      const userBalance = calculateGroupBalance(group, user.id);
      if (userBalance > 0) {
        totalOwed += userBalance;
      } else if (userBalance < 0) {
        totalOwing += Math.abs(userBalance);
      }
    });

    return { totalOwed, totalOwing };
  };

  // Calculate user's balance in a specific group
  const calculateGroupBalance = (group: any, userId: string) => {
    let balance = 0;

    group.expenses?.forEach((expense: any) => {
      if (expense.paidBy === userId) {
        balance += expense.amount;
      }

      // Subtract user's share
      if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
        const userSplit = expense.splits.find((s: any) => s.memberId === userId);
        if (userSplit) {
          balance -= userSplit.amount || 0;
        }
      } else {
        // Equal split
        balance -= expense.amount / (group.members?.length || 1);
      }
    });

    return balance;
  };

  const { totalOwed, totalOwing } = calculateUserBalance();

  // Get last update time for a group
  const getLastUpdate = (group: any) => {
    if (!group.expenses || group.expenses.length === 0) {
      return 'Henüz harcama yok';
    }
    const lastExpense = group.expenses[group.expenses.length - 1];
    const date = new Date(lastExpense.date);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return 'Dün';
    return `${diffDays} gün önce`;
  };

  // Get total expenses for a group
  const getGroupTotal = (group: any) => {
    return group.expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Main Content */}
      <main className="max-w-[480px] mx-auto px-5">
        {/* Header Greeting */}
        <h1 className="text-[#111827] dark:text-gray-100 text-2xl font-semibold pt-8 pb-4">
          Merhaba, {user.name.split(' ')[0]} 👋
        </h1>

        {/* Balance Overview Card */}
        <BalanceCard
          youOwe={totalOwing}
          owedToYou={totalOwed}
          groupCount={groups.length}
        />

        {/* Quick Actions */}
        <div className="py-8">
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={onAddExpense}
              className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary pl-4 pr-4 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-white text-lg">add</span>
              <p className="text-white text-sm font-medium">Harcama Ekle</p>
            </button>

            <button
              onClick={onCreateGroup}
              className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-4 pr-4 transition-transform hover:scale-105 active:scale-95"
            >
              <p className="text-[#111827] dark:text-gray-200 text-sm font-medium">+ Yeni Grup</p>
            </button>

            {onShowAllGroups && (
              <button
                onClick={onShowAllGroups}
                className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-4 pr-4 transition-transform hover:scale-105 active:scale-95"
              >
                <p className="text-[#111827] dark:text-gray-200 text-sm font-medium">Tüm Bakiyeler</p>
              </button>
            )}
          </div>
        </div>

        {/* Groups Section Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-[#111827] dark:text-gray-100 text-lg font-semibold">Aktif Gruplar</h2>
          {onShowAllGroups && (
            <button
              onClick={onShowAllGroups}
              className="text-primary text-sm font-medium hover:underline"
            >
              Tümü &gt;
            </button>
          )}
        </div>

        {/* Group Cards List */}
        {groups.length > 0 ? (
          <div className="flex flex-col gap-4">
            {groups.map(group => {
              const groupBalance = calculateGroupBalance(group, user.id);
              const groupIcon = group.type === 'Ev Arkadaşları' ? '🏠' :
                               group.type === 'Tatil Grubu' ? '✈️' :
                               group.type === 'Etkinlik' ? '🎉' : '📝';

              return (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  emoji={groupIcon}
                  totalAmount={getGroupTotal(group)}
                  members={group.members || []}
                  balance={groupBalance}
                  location={group.location || undefined}
                  date={group.createdAt ? new Date(group.createdAt).toLocaleDateString('tr-TR') : undefined}
                  lastUpdate={getLastUpdate(group)}
                  onClick={() => onSelectGroup(group.id)}
                />
              );
            })}

            {/* View All Groups Card */}
            {groups.length > 3 && onShowAllGroups && (
              <div
                onClick={onShowAllGroups}
                className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-5 h-[96px] cursor-pointer transition-colors hover:border-primary hover:bg-primary/5"
              >
                <button className="text-primary font-semibold text-sm">
                  Tüm Grupları Gör ({groups.length})
                </button>
              </div>
            )}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Henüz Grup Yok!
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              İlk grubunuzu oluşturarak masraf paylaşımına başlayın.
            </p>
            <button
              onClick={onCreateGroup}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              İlk Grubu Oluştur
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        onAddClick={onAddExpense}
      />
    </div>
  );
}

export default ModernHomepage;
