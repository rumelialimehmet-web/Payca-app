import React from 'react';
import ReactDOM from 'react-dom/client';

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="container mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="text-primary h-7 w-7"
                fill="none"
                height="28"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="28"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <span className="text-2xl font-bold text-text-light dark:text-text-dark">Payça</span>
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-lg shadow-primary/30">
              <span className="truncate">İndir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto">
        <div className="relative flex min-h-[90vh] w-full flex-col justify-center items-center px-5 py-10 text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(79,70,229,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(79,70,229,0.4),rgba(17,24,39,0))]"></div>
          <div className="flex flex-col gap-8 items-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-tighter md:text-6xl">
                Masrafları Kolayca Paylaş, Keyfini Çıkar!
              </h1>
              <h2 className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal md:text-lg">
                Grup gezileri, akşam yemekleri ve etkinlikler artık stressiz.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/40 transition-transform hover:scale-105">
                <span className="truncate">Uygulamayı İndir</span>
              </button>
              <button className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary/10 dark:bg-primary/20 text-primary text-base font-bold leading-normal tracking-wide transition-transform hover:scale-105">
                <span className="truncate">Hemen Başla</span>
              </button>
            </div>
            <div className="w-full max-w-lg pt-8">
              <img
                className="rounded-xl shadow-2xl"
                alt="Friends managing finances together on phones, with charts and icons floating around them representing shared expenses."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtTesyPgZY79sLkmS5z3sOiCjAVnzrVg-YfhJQGfzTds-jSPulbaFAxWusuh2fvMUE_Nz9cfUZzqZJXQcJdAP1RLSRQZRrvj7ky7Dr2CywSH5VPAIvEElLwmrs_usenZMrsRCi7TTNC689nQ9cI9WAq1NHslJgCWKICN_y1XVKFQfJW6ZXgszUl3eiEAobH7nM4fE1GDoymHAjFMkK7opuTMBQbecAxOqEQnK_DzdTUzmtPIqA9PRbPzQiGu_sJ8SE69iKFRG5irhI"
              />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="px-5 py-16 sm:py-24">
          <h2 className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-tight text-center mb-12">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4 rounded-xl p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">group_add</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight">Grup Oluştur</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">
                  Saniyeler içinde bir grup oluşturun ve arkadaşlarınızı davet edin.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4 rounded-xl p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight">Masraf Ekle</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">
                  Tüm ortak harcamaları kolayca uygulamaya ekleyin.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4 rounded-xl p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">swap_horiz</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight">Bölüş & Öde</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">
                  Kim kime ne kadar borçlu anında görün ve ödeyin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="px-5 py-16 sm:py-24 bg-white dark:bg-background-dark/50 rounded-xl">
          <h2 className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-tight text-center mb-12">
            Öne Çıkan Özellikler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-6">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl">notifications_active</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">Anlık Bildirimler</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                  Gruptaki her hareketten anında haberdar olun.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-6">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl">language</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">Farklı Para Birimleri</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                  Yurt dışı seyahatleriniz için para birimi desteği.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-6">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl">shield</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">Güvenli Ödemeler</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                  Tüm işlemleriniz en yüksek güvenlik standartlarıyla korunur.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-6">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl">monitoring</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">Harcama Geçmişi</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                  Tüm geçmiş harcamalarınızı ve özetleri görüntüleyin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="px-5 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <figure>
              <blockquote className="text-xl font-medium text-text-light dark:text-text-dark">
                <p>"Payça sayesinde tatil masraflarımızı bölüşmek kabus olmaktan çıktı. Her şey o kadar basit ve şeffaf ki, herkese tavsiye ederim!"</p>
              </blockquote>
              <figcaption className="mt-6">
                <div className="flex items-center justify-center gap-2 text-base text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="font-semibold text-text-light dark:text-text-dark">Ayşe Yılmaz</span> - Aktif Kullanıcı
                </div>
              </figcaption>
            </figure>
            <div className="mt-12 flex justify-center items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <img
                  className="h-8"
                  alt="Apple App Store logo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlNurevuYdNmAall8oTRjQzYM-7pK8I0sCG97bfXAC0y9gP2gWjjy76cURxq8TuJryMhMo1ixp3PU5tUIhmZXzTaOlUER7kqjnuBuJQEIu3-GI2SmHvojAPv4M15RSAKT7Dl1G86lgTnUg9KwTalcNfcj_i1rP5qVZgv170JvCRcUU9iP2geRt19bSGBO-WaJixu5UfkTDuzM1k5e3P-krpSDGqTw_vZnKudYE-Y53JnxSn1rppTT3Tga9OFhL1_wiMn1AHsS0xkA5"
                />
                <div className="flex flex-col items-start">
                  <div className="flex text-amber-400">
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star_half</span>
                  </div>
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">4.8 Derecelendirme</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img
                  className="h-8"
                  alt="Google Play Store logo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuJwP09RQ6BMaFAO-DxfAjtb1krGCoU5xHSkB7RDjTJR5RwTWkLXOXtV8ZiD88Ahf9Bwi-VaQTitPC6cUfhy7bDtbkagpSdfUCkKAMfHMg4WrnUrQQ7MKvkHAcSqK71YEMSFDci0fm2dmZkHl-QMOetJ8A-8ZHmyOdqkTyLA-gEP__cKrDEXuHJqFF3NZZkO41C89lI1E7ltZOdB79CRAdSJRo7CWygJXYJ4sPHBqUV7m8FpCbpGzBdwOtM_Jm0HajuOFZIpkIXhJW"
                />
                <div className="flex flex-col items-start">
                  <div className="flex text-amber-400">
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star</span>
                    <span className="material-symbols-outlined text-lg">star</span>
                  </div>
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">4.9 Derecelendirme</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="px-5 py-16 sm:py-24">
          <div className="bg-primary/90 dark:bg-primary/80 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center gap-6">
            <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">
              Harcamaları Yönetmeye Hazır mısınız?
            </h2>
            <p className="text-lg text-white/80 max-w-xl">
              Hemen Payça'yı indirin ve grup harcamalarınızı kolayca yönetin. Stresi bırakın, anın tadını çıkarın!
            </p>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white text-primary text-base font-bold leading-normal tracking-wide shadow-lg transition-transform hover:scale-105">
              <span className="truncate">Uygulamayı Şimdi İndir</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-5 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              © 2024 Payça. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-sm">
              <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary" href="#">
                Gizlilik Politikası
              </a>
              <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary" href="#">
                Kullanım Şartları
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>
);
