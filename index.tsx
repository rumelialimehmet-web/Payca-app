import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// Auth Modal Component
const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? 'Login' : 'Sign up', { email, password, name });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-xl sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
        </button>

        {/* Modal Content */}
        <div className="p-8 pt-12">
          {/* Title */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Giriş Yap' : 'Kaydol'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input (Only for Sign Up) */}
            {!isLogin && (
              <label className="flex flex-col">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Ad Soyad</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg h-12 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Adınız Soyadınız"
                  required={!isLogin}
                />
              </label>
            )}

            {/* Email Input */}
            <label className="flex flex-col">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">E-posta</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg h-12 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="eposta@adresiniz.com"
                required
              />
            </label>

            {/* Password Input */}
            <label className="flex flex-col">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Şifre</p>
              <div className="relative flex w-full items-stretch">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg h-12 pr-12 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Şifrenizi girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            {/* Forgot Password Link (Only for Login) */}
            {isLogin && (
              <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">key</span>
                  Şifremi Unuttum?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-lg text-white font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(to right, #6366F1, #4F46E5)' }}
            >
              {isLogin ? 'Giriş Yap' : 'Kaydol'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                veya
              </span>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.879 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"/>
                <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9465L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
                <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
                <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Google ile Devam Et</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.3408 10.7251C16.3306 8.97632 17.6141 8.13816 17.6754 8.09868C16.859 6.92763 15.5959 6.77303 15.1367 6.76316C13.9998 6.63816 12.9037 7.44737 12.3265 7.44737C11.7391 7.44737 10.8322 6.77303 9.87755 6.79276C8.64898 6.81249 7.50347 7.54276 6.87245 8.68421C5.57959 11.0039 6.54408 14.4868 7.79694 16.3987C8.42347 17.3355 9.16327 18.3816 10.1281 18.3454C11.0623 18.3092 11.4193 17.7382 12.5357 17.7382C13.6419 17.7382 13.9692 18.3454 14.9442 18.3257C15.949 18.3092 16.5876 17.3849 17.1938 16.4382C17.9031 15.3618 18.199 14.3059 18.2092 14.2467C18.1887 14.2368 16.3509 13.5263 16.3408 10.7251Z" fill="currentColor"/>
                <path d="M14.3061 5.42763C14.8119 4.80921 15.1597 3.97105 15.0678 3.125C14.3382 3.15461 13.4312 3.60526 12.9051 4.21382C12.4398 4.74342 12.0103 5.60526 12.1125 6.42763C12.9254 6.48684 13.7893 6.04605 14.3061 5.42763Z" fill="currentColor"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Apple ile Devam Et</span>
            </button>
          </div>

          {/* Toggle Login/Signup */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
            {' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? 'Kaydol' : 'Giriş Yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Landing Page Component
const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
            >
              <span className="truncate">Giriş Yap</span>
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
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/40 transition-transform hover:scale-105"
              >
                <span className="truncate">Uygulamayı İndir</span>
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary/10 dark:bg-primary/20 text-primary text-base font-bold leading-normal tracking-wide transition-transform hover:scale-105"
              >
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
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white text-primary text-base font-bold leading-normal tracking-wide shadow-lg transition-transform hover:scale-105"
            >
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

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
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
