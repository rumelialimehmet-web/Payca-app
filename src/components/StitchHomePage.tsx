import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { db } from '../lib/supabase';

// Group interface
interface Group {
  id: string;
  name: string;
  emoji: string;
  total_amount: number;
  user_balance: number;
  user_debt_status: 'debt' | 'credit' | 'settled';
  member_count: number;
  location?: string;
  created_at: string;
  last_update: string;
  members: Array<{
    id: string;
    avatar_url?: string;
  }>;
}

interface StitchHomePageProps {
  user: User;
  onLogout: () => void;
}

export default function StitchHomePage({ user, onLogout }: StitchHomePageProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    loadGroups();
  }, [user.id]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.groups.list();

      if (error) {
        console.error('Gruplar yüklenirken hata:', error);
        // Fallback to mock data
        loadMockGroups();
        return;
      }

      if (data && data.length > 0) {
        // Transform Supabase data to Group interface
        const transformedGroups = data.map((group: any) => ({
          id: group.id,
          name: group.name || 'Grup',
          emoji: group.emoji || '🎉',
          total_amount: group.total_amount || 0,
          user_balance: calculateUserBalance(group, user.id),
          user_debt_status: calculateDebtStatus(group, user.id),
          member_count: group.group_members?.length || 0,
          location: group.location || '',
          created_at: formatDate(group.created_at),
          last_update: formatRelativeTime(group.updated_at || group.created_at),
          members: group.group_members?.map((member: any) => ({
            id: member.user_id,
            avatar_url: member.profiles?.avatar_url
          })) || []
        }));

        setGroups(transformedGroups);
        calculateTotals(transformedGroups);
      } else {
        // No groups found, use mock data
        loadMockGroups();
      }
    } catch (error) {
      console.error('Gruplar yüklenirken hata:', error);
      loadMockGroups();
    } finally {
      setLoading(false);
    }
  };

  const loadMockGroups = () => {
    const mockGroups: Group[] = [
      {
        id: '1',
        name: 'Tatil Gezisi',
        emoji: '🏖️',
        total_amount: 1250,
        user_balance: -50,
        user_debt_status: 'debt',
        member_count: 3,
        location: 'İstanbul, TR',
        created_at: '15.10.2024',
        last_update: '2s önce',
        members: []
      },
      {
        id: '2',
        name: 'Pizza Akşamı',
        emoji: '🍕',
        total_amount: 380,
        user_balance: 120,
        user_debt_status: 'credit',
        member_count: 2,
        location: 'Ankara, TR',
        created_at: '13.10.2024',
        last_update: '1g önce',
        members: []
      }
    ];
    setGroups(mockGroups);
    calculateTotals(mockGroups);
  };

  const calculateUserBalance = (group: any, userId: string): number => {
    // TODO: Calculate actual balance from expenses
    return 0;
  };

  const calculateDebtStatus = (group: any, userId: string): 'debt' | 'credit' | 'settled' => {
    const balance = calculateUserBalance(group, userId);
    if (balance < 0) return 'debt';
    if (balance > 0) return 'credit';
    return 'settled';
  };

  const calculateTotals = (groupsList: Group[]) => {
    let credit = 0;
    let debt = 0;

    groupsList.forEach(group => {
      if (group.user_debt_status === 'credit') {
        credit += Math.abs(group.user_balance);
      } else if (group.user_debt_status === 'debt') {
        debt += Math.abs(group.user_balance);
      }
    });

    setTotalCredit(credit);
    setTotalDebt(debt);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins}dk önce`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}s önce`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}g önce`;
  };

  const getUserDisplayName = (): string => {
    if (user.user_metadata?.display_name) {
      return user.user_metadata.display_name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Kullanıcı';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl rounded-xl overflow-hidden flex flex-col font-display">
      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-5">
          {/* Header Greeting with Logout */}
          <div className="flex items-center justify-between pt-8 pb-4">
            <h1 className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              Merhaba, {getUserDisplayName()} 👋
            </h1>
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Çıkış
            </button>
          </div>

          {/* Balance Overview Card */}
          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="flex justify-around items-center text-center">
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Alacaklısın</p>
                <p className="text-green-500 text-2xl font-bold mt-1">+{totalCredit}₺</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Borçlusun</p>
                <p className="text-red-500 text-2xl font-bold mt-1">-{totalDebt}₺</p>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
              {groups.length} grup
            </p>
          </div>

          {/* Quick Actions */}
          <div className="py-8">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary pl-4 pr-4 hover:opacity-90 transition">
                <span className="text-white text-lg">➕</span>
                <p className="text-white text-sm font-medium">Harcama Ekle</p>
              </button>
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-4 pr-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <p className="text-gray-900 dark:text-gray-200 text-sm font-medium">+ Yeni Grup</p>
              </button>
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-4 pr-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <p className="text-gray-900 dark:text-gray-200 text-sm font-medium">Tüm Bakiyeler</p>
              </button>
            </div>
          </div>

          {/* Groups Section Header */}
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
              Aktif Gruplar
            </h2>
            <a className="text-primary text-sm font-medium cursor-pointer hover:opacity-80">
              Tümü &gt;
            </a>
          </div>

          {/* Group Cards List */}
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex flex-col gap-4 rounded-lg bg-white dark:bg-gray-800 dark:border dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-900 dark:text-gray-100 text-base font-semibold">
                      {group.emoji} {group.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Toplam: {group.total_amount}₺
                    </p>
                  </div>
                  {group.members.length > 0 && (
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 3).map((member, idx) => (
                        member.avatar_url ? (
                          <img
                            key={member.id}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800"
                            src={member.avatar_url}
                            alt={`Member ${idx + 1}`}
                          />
                        ) : (
                          <div
                            key={member.id}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-primary/20 flex items-center justify-center text-xs"
                          >
                            👤
                          </div>
                        )
                      ))}
                      {group.member_count > 3 && (
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-600 dark:text-gray-400">
                          +{group.member_count - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center justify-center rounded-full h-7 px-3 ${
                      group.user_debt_status === "debt"
                        ? "bg-red-100 dark:bg-red-500/20"
                        : group.user_debt_status === "credit"
                        ? "bg-green-100 dark:bg-green-500/20"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        group.user_debt_status === "debt"
                          ? "text-red-600 dark:text-red-400"
                          : group.user_debt_status === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {group.user_debt_status === "debt"
                        ? `Borçlusun: ${Math.abs(group.user_balance)}₺`
                        : group.user_debt_status === "credit"
                        ? `Alacaklısın: ${group.user_balance}₺`
                        : "Ödeşildi"}
                    </span>
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    {group.last_update}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{group.location || 'Konum belirtilmemiş'}</span>
                  <span>{group.created_at}</span>
                </div>
              </div>
            ))}

            {/* View All Groups Card */}
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-5 h-24 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
              <button className="text-primary font-semibold text-sm">
                Tüm Grupları Gör
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 flex justify-around items-center pt-2 pb-6">
        <NavItem icon="🏠" label="Ana Sayfa" active />
        <NavItem icon="👥" label="Gruplar" />
        <FloatingActionButton />
        <NavItem icon="🔔" label="Aktivite" />
        <NavItem icon="👤" label="Profil" />
      </nav>
    </div>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <a
      href="#"
      className={`flex flex-col items-center gap-1 ${
        active
          ? "text-primary"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      } transition`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}

function FloatingActionButton() {
  return (
    <button className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-700 text-white shadow-lg -translate-y-6 flex items-center justify-center hover:shadow-xl transition active:scale-95">
      <span className="text-4xl">➕</span>
    </button>
  );
}
