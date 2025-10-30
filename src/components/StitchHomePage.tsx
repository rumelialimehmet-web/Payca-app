import React, { useState } from 'react';

// Group interface
interface Group {
  id: number;
  name: string;
  total: number;
  status: 'debt' | 'credit' | 'settled';
  amount: number;
  location: string;
  date: string;
  lastUpdate: string;
  members: string[];
}

export default function StitchHomePage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "🏖️ Tatil Gezisi",
      total: 1250,
      status: "debt",
      amount: 50,
      location: "İstanbul, TR",
      date: "15.10.2023",
      lastUpdate: "2s önce",
      members: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBpf7skRHjWiYb5qsWiD54-5aSwgTXS3KB-_A-85rzW_bG58-kgvm39bpAGdWl5moyWqq4SbrgryYF5y88DN_W2Qi8j4RoYh3u3mCrLNJUV51w2d8jMXpZhhBpD5aAl6LjtuKrez9AdVIv_PpvSA2Eas3SNpqm3Jf1LJkKwObBz8uZqtSu1nyBHQamMgC0ZZaEg93JVmL6kbJeMMArClub4dixZgJfq_bQEFXikdpOx3sPPfQI4lcF7gmqlDt9hBmY3ljV-9HUSamJQ",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA59tSNSA3RVlLSqDi-5YVnISMotkljGyYEmGSetfnRIwQlU9fcU0y1J7Q3S8cV32gvJ9f8PG3QxUMhIWtTshjKwUOWBbZHSEcnL9I6ZlMef5plqavwyGcR6-L3eLoWAPYkJND9qr4fEoJemg5lU73LY4m9bviyF9FaRIOFBQOvx3k-8kmsVww0wN-iUuM4-omIkxrFhK_lN6Vw7YqpUfSb5gLWuLatKVBL3BjBPITOoiRBcdFP2agFoZVoxUoVhC5OtEjr6uUwIx4M",
      ],
    },
    {
      id: 2,
      name: "🍕 Pizza Akşamı",
      total: 380,
      status: "credit",
      amount: 120,
      location: "Ankara, TR",
      date: "13.10.2023",
      lastUpdate: "1g önce",
      members: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCbihSvs3AR_mNClqAmU0DGu1Xh32VIOUaF1Wj4cK6Nu12koH3tjOwUcpVSq7irLCRfj9R0znF6LSUKr7HTjZQjl1__mIGw51oaiuUhklhJUceCEpjc3XQBGLUQuUscxTJ0oZeFAyA5cEQxkCLiNfTJ1yd4Ug-whmWP8EPEVu6jeo1uAkd4FjuDgLDexNmx2tWfFUsuTAncJkI1uNt1guwfsUoJkNt7OInxx_S2hq-sB-7uHwZ4N-IW1ECu8vD9Pj4MwEPyRJBffEsG",
      ],
    },
    {
      id: 3,
      name: "🏠 Ev Kirası",
      total: 4500,
      status: "settled",
      amount: 0,
      location: "İzmir, TR",
      date: "10.10.2023",
      lastUpdate: "5g önce",
      members: [],
    },
  ]);

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl rounded-xl overflow-hidden flex flex-col font-display">
      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-5">
          {/* Header Greeting */}
          <h1 className="text-gray-900 dark:text-gray-100 text-2xl font-semibold pt-8 pb-4">
            Merhaba, Ahmet 👋
          </h1>

          {/* Balance Overview Card */}
          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="flex justify-around items-center text-center">
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Alacaklısın</p>
                <p className="text-green-500 text-2xl font-bold mt-1">+425₺</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Borçlusun</p>
                <p className="text-red-500 text-2xl font-bold mt-1">-150₺</p>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
              3 grup
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
                      {group.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Toplam: {group.total}₺
                    </p>
                  </div>
                  {group.members.length > 0 && (
                    <div className="flex -space-x-2">
                      {group.members.map((avatar, idx) => (
                        <img
                          key={idx}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800"
                          src={avatar}
                          alt={`Member ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center justify-center rounded-full h-7 px-3 ${
                      group.status === "debt"
                        ? "bg-red-100 dark:bg-red-500/20"
                        : group.status === "credit"
                        ? "bg-green-100 dark:bg-green-500/20"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        group.status === "debt"
                          ? "text-red-600 dark:text-red-400"
                          : group.status === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {group.status === "debt"
                        ? `Borçlusun: ${group.amount}₺`
                        : group.status === "credit"
                        ? `Alacaklısın: ${group.amount}₺`
                        : "Ödeşildi"}
                    </span>
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    Son güncelleme: {group.lastUpdate}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{group.location}</span>
                  <span>{group.date}</span>
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
