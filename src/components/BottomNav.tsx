import React from 'react';

export interface BottomNavProps {
  activeTab?: 'home' | 'groups' | 'activity' | 'profile';
  onTabChange?: (tab: 'home' | 'groups' | 'activity' | 'profile') => void;
  onAddClick?: () => void;
}

export function BottomNav({ activeTab = 'home', onTabChange, onAddClick }: BottomNavProps) {
  const handleTabClick = (tab: 'home' | 'groups' | 'activity' | 'profile') => {
    onTabChange?.(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-[480px] border-t border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-background-dark/80">
      <div className="flex h-20 items-center justify-around px-2">
        {/* Home Tab */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
            activeTab === 'home'
              ? 'text-primary dark:text-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'home' ? 'filled' : ''}`}>
            home
          </span>
          <span className="text-xs font-medium">Ana Sayfa</span>
        </button>

        {/* Groups Tab */}
        <button
          onClick={() => handleTabClick('groups')}
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
            activeTab === 'groups'
              ? 'text-primary dark:text-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'groups' ? 'filled' : ''}`}>
            group
          </span>
          <span className="text-xs font-medium">Gruplar</span>
        </button>

        {/* Center FAB */}
        <button
          onClick={onAddClick}
          className="flex h-16 w-16 -translate-y-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Harcama Ekle"
        >
          <span className="material-symbols-outlined text-4xl">add</span>
        </button>

        {/* Activity Tab */}
        <button
          onClick={() => handleTabClick('activity')}
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
            activeTab === 'activity'
              ? 'text-primary dark:text-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'activity' ? 'filled' : ''}`}>
            notifications
          </span>
          <span className="text-xs font-medium">Aktivite</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
            activeTab === 'profile'
              ? 'text-primary dark:text-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'profile' ? 'filled' : ''}`}>
            person
          </span>
          <span className="text-xs font-medium">Profil</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;
