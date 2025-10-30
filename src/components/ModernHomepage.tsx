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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Main Content */}
      <main className="max-w-[480px] mx-auto px-4">
        {/* Simple Header */}
        <div className="pt-6 pb-4">
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">
            Gruplar
          </h1>
        </div>

        {/* Balance Overview Card - Simpler */}
        <BalanceCard
          youOwe={totalOwing}
          owedToYou={totalOwed}
          groupCount={groups.length}
        />

        {/* Single Primary Action */}
        <div className="py-4">
          <button
            onClick={onCreateGroup}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-semibold transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Yeni Grup Oluştur
          </button>
        </div>

        {/* Groups Section Header */}
        <div className="flex justify-between items-center pb-3 pt-2">
          <h2 className="text-gray-900 dark:text-white text-base font-semibold">Tüm Gruplar</h2>
          <span className="text-gray-500 text-sm">{groups.length}</span>
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
          // Simple Empty State
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Simple Icon */}
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-5xl">groups</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz grup yok
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[280px]">
              İlk grubunu oluştur ve harcamalarını paylaşmaya başla
            </p>

            {/* Simple CTA */}
            <button
              onClick={onCreateGroup}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Grup Oluştur
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
