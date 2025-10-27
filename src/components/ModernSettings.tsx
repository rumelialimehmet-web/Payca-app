import React, { useState } from 'react';
import { BottomNav } from './BottomNav';

export interface ModernSettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  stats: {
    expenses: number;
    groups: number;
    friends: number;
  };
  theme: string;
  onThemeChange: (theme: string) => void;
  onLogout: () => void;
  onBack: () => void;
  activeBottomTab?: 'home' | 'groups' | 'activity' | 'profile';
  onTabChange?: (tab: 'home' | 'groups' | 'activity' | 'profile') => void;
}

interface SettingsItem {
  icon: string;
  label: string;
  onClick?: () => void;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export function ModernSettings({
  user,
  stats,
  theme,
  onThemeChange,
  onLogout,
  onBack,
  activeBottomTab = 'profile',
  onTabChange
}: ModernSettingsProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const accountSection: SettingsSection = {
    title: 'HESAP',
    items: [
      {
        icon: 'account_circle',
        label: 'Profil Bilgileri',
        onClick: () => alert('Profil düzenleme yakında eklenecek'),
        showChevron: true
      },
      {
        icon: 'lock',
        label: 'Güvenlik & Şifre',
        onClick: () => alert('Güvenlik ayarları yakında eklenecek'),
        showChevron: true
      },
      {
        icon: 'credit_card',
        label: 'Ödeme Yöntemleri',
        onClick: () => alert('Ödeme yöntemleri yakında eklenecek'),
        showChevron: true
      }
    ]
  };

  const applicationSection: SettingsSection = {
    title: 'UYGULAMA',
    items: [
      {
        icon: 'notifications',
        label: 'Bildirim Ayarları',
        onClick: () => alert('Bildirim ayarları yakında eklenecek'),
        showChevron: true
      },
      {
        icon: 'palette',
        label: 'Görünüm',
        onClick: () => setShowThemeModal(true),
        rightContent: (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {theme === 'dark' ? 'Koyu' : theme === 'light' ? 'Açık' : 'Sistem'}
          </span>
        ),
        showChevron: true
      },
      {
        icon: 'language',
        label: 'Dil',
        rightContent: (
          <span className="text-gray-500 dark:text-gray-400 text-sm">Türkçe</span>
        ),
        showChevron: true
      }
    ]
  };

  const supportSection: SettingsSection = {
    title: 'DESTEK',
    items: [
      {
        icon: 'help_center',
        label: 'Yardım Merkezi',
        onClick: () => window.open('https://github.com/rumelialimehmet-web/Payca-app/issues', '_blank'),
        showChevron: true
      },
      {
        icon: 'support_agent',
        label: 'Destekle İletişime Geç',
        onClick: () => window.location.href = 'mailto:support@payca.app',
        showChevron: true
      }
    ]
  };

  const aboutSection: SettingsSection = {
    title: 'HAKKINDA',
    items: [
      {
        icon: 'description',
        label: 'Kullanım Koşulları',
        onClick: () => alert('Kullanım koşulları sayfası yakında eklenecek'),
        showChevron: true
      },
      {
        icon: 'privacy_tip',
        label: 'Gizlilik Politikası',
        onClick: () => alert('Gizlilik politikası sayfası yakında eklenecek'),
        showChevron: true
      },
      {
        icon: 'info',
        label: 'Versiyon',
        rightContent: (
          <span className="text-gray-500 dark:text-gray-400 text-base">1.2.0</span>
        ),
        showChevron: false
      }
    ]
  };

  const renderSettingsSection = (section: SettingsSection) => (
    <div className="flex flex-col gap-2">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase px-2">
        {section.title}
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
        {section.items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`flex items-center gap-4 px-4 min-h-14 justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
              index < section.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                {item.icon}
              </span>
              <p className="text-gray-900 dark:text-white text-base font-medium">
                {item.label}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {item.rightContent}
              {item.showChevron && (
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                  chevron_right
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-24">
        {/* Header Section */}
        <div className="relative w-full h-[240px] bg-gradient-to-b from-primary/10 to-background-light dark:from-primary/20 dark:to-background-dark pt-16 px-4">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-gray-700 dark:text-gray-300 flex size-10 shrink-0 items-center justify-center hover:bg-white/50 dark:hover:bg-black/30 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>

          <div className="relative flex flex-col items-center">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="size-[100px] rounded-full border-4 border-white dark:border-background-dark shadow-md object-cover"
                />
              ) : (
                <div className="size-[100px] rounded-full border-4 border-white dark:border-background-dark shadow-md bg-primary flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(user.name)}
                </div>
              )}
              <button className="absolute bottom-0 right-0 grid place-items-center size-8 bg-primary text-white rounded-full border-2 border-white dark:border-background-dark shadow-sm hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center">
              <p className="text-gray-900 dark:text-white text-2xl font-bold">{user.name}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user.email}</p>
            </div>

            <button className="mt-4 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-primary/10 dark:bg-primary/20 text-primary dark:text-white text-xs font-semibold">
              <span>Ücretsiz Plan</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative -mt-10 px-5 z-10">
          <div className="flex flex-wrap gap-2.5">
            <div className="flex flex-1 items-center gap-3 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
              <div className="grid place-items-center size-9 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400">
                <span className="material-symbols-outlined text-lg">receipt_long</span>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Harcama</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">
                  {stats.expenses}
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
              <div className="grid place-items-center size-9 rounded-full bg-green-100 dark:bg-green-900/40 text-green-500 dark:text-green-400">
                <span className="material-symbols-outlined text-lg">groups</span>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Gruplar</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">
                  {stats.groups}
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700">
              <div className="grid place-items-center size-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400">
                <span className="material-symbols-outlined text-lg">person</span>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Arkadaşlar</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">
                  {stats.friends}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="flex flex-col gap-6 px-5 py-8">
          {renderSettingsSection(accountSection)}
          {renderSettingsSection(applicationSection)}

          {/* Premium Promotion Card */}
          <div className="relative flex flex-col gap-3 rounded-xl p-6 bg-gradient-to-br from-yellow-300 to-orange-400 text-gray-900 shadow-lg shadow-orange-300/30 overflow-hidden">
            <div className="absolute -right-8 -top-8 size-32 bg-white/20 rounded-full"></div>
            <div className="absolute right-12 -top-2 size-12 bg-white/20 rounded-full"></div>
            <div className="relative flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-700">workspace_premium</span>
              <p className="font-bold text-lg">Payça PREMIUM</p>
            </div>
            <p className="text-sm text-gray-800">
              Reklamsız deneyim ve gelişmiş raporlar gibi özel avantajların kilidini açın.
            </p>
            <button className="mt-2 w-full flex items-center justify-center rounded-lg h-11 px-4 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
              <span>Planları İncele</span>
            </button>
          </div>

          {renderSettingsSection(supportSection)}
          {renderSettingsSection(aboutSection)}

          {/* Logout Button */}
          <div className="pt-2 pb-6">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center rounded-xl h-12 px-4 bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 text-base font-semibold border-2 border-red-500/50 dark:border-red-400/50 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeBottomTab} onTabChange={onTabChange} />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-sm flex flex-col items-center gap-4 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-2xl">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold text-center">
              Çıkış Yapmak İstediğinden Emin Misin?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Tekrar giriş yapana kadar hesabına ve verilerine erişemeyeceksin.
            </p>
            <div className="w-full flex gap-3 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 flex items-center justify-center rounded-lg h-11 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>İptal</span>
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="flex-1 flex items-center justify-center rounded-lg h-11 px-4 bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-sm flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-2xl">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold text-center">
              Görünüm Seç
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { value: 'light', label: 'Açık Tema', icon: 'light_mode' },
                { value: 'dark', label: 'Koyu Tema', icon: 'dark_mode' },
                { value: 'system', label: 'Sistem Varsayılanı', icon: 'brightness_auto' }
              ].map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    onThemeChange(themeOption.value);
                    setShowThemeModal(false);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    theme === themeOption.value
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
                    {themeOption.icon}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {themeOption.label}
                  </span>
                  {theme === themeOption.value && (
                    <span className="material-symbols-outlined text-primary ml-auto">
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-2 w-full flex items-center justify-center rounded-lg h-11 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span>Kapat</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ModernSettings;
