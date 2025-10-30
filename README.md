<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Payça - Grup Harcama Takip Uygulaması

Modern, kullanıcı dostu grup harcama paylaşım ve takip uygulaması. Ev arkadaşları, tatil grupları ve etkinlikler için tasarlanmış Progressive Web App (PWA).

## 🚀 **[CANLIYA ALMA REHBERİ →](./CANLIYA_ALMA_REHBERI.md)**

**Uygulamanızı 10 dakikada canlıya alın!** Adım adım Türkçe rehber için [buraya tıklayın](./CANLIYA_ALMA_REHBERI.md).

---

## ✨ Özellikler

- 💰 **Grup Harcama Yönetimi**: Kolayca harcama ekleyin ve grubunuzla paylaşın
- 🔄 **Akıllı Bölüşüm**: Eşit veya özel bölüşüm seçenekleri
- 📊 **Gerçek Zamanlı Bakiyeler**: Kimin kime ne kadar borcu olduğunu anında görün
- 💸 **Ödeme Takibi**: Ödemeleri kaydedin ve hatırlatmalar gönderin
- 📈 **İstatistikler**: Aylık harcama trendleri ve kategori bazlı analiz
- 🔐 **Güvenli Authentication**: Email/Şifre veya Google ile giriş
- ☁️ **Cloud Sync**: Verileriniz güvenle cloud'da saklanır
- 🌙 **Koyu/Açık Tema**: Göz yormayan arayüz
- 📱 **PWA Desteği**: Mobil cihazlara kurulum, offline çalışma
- 🔔 **Real-time Senkronizasyon**: Grup değişiklikleri anında güncellenir

## 🚀 Hızlı Başlangıç

### Ön Koşullar

- **Node.js** (v16 veya üzeri)
- **Supabase hesabı** (ücretsiz): [supabase.com](https://supabase.com)

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd Payca-app
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Supabase Setup

Detaylı adımlar için [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) dosyasına bakın.

**Kısa özet:**
1. [Supabase](https://app.supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. SQL Editor'de `supabase-schema.sql` dosyasını çalıştırın
4. API anahtarlarınızı alın

### 4. Environment Variables

`.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

Dosyayı düzenleyip API anahtarlarınızı ekleyin:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Uygulamayı Çalıştırın

```bash
npm run dev
```

Tarayıcıda açın: http://localhost:5173

## 📦 Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Teknoloji Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email, Google OAuth)
- **Styling**: CSS3 + CSS Variables
- **PWA**: Service Worker + Web App Manifest

## 📁 Proje Yapısı

```
Payca-app/
├── src/
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useGroups.ts    # Groups management
│   │   ├── useExpenses.ts  # Expenses & calculations
│   │   └── useSettlements.ts
│   └── lib/
│       ├── supabase.ts     # Supabase client & helpers
│       └── database.types.ts # TypeScript types
├── index.tsx               # Main React app
├── index.css               # Global styles
├── supabase-schema.sql     # Database schema
└── SUPABASE_SETUP.md       # Setup guide
```

## 🔐 Güvenlik

- Row Level Security (RLS) policies
- Her kullanıcı sadece kendi gruplarını görür
- Supabase Auth ile güvenli kimlik doğrulama
- Environment variables ile API key yönetimi

## 🌐 Deployment (Canlıya Alma)

### 🎯 Hızlı Deploy - 10 Dakikada!

**Detaylı Türkçe rehber**: **[CANLIYA_ALMA_REHBERI.md](./CANLIYA_ALMA_REHBERI.md)** 👈

Bu rehber şunları içerir:
- ✅ Supabase kurulumu (ücretsiz)
- ✅ Environment variables ayarlama
- ✅ Vercel'e deploy (ücretsiz)
- ✅ Production test ve doğrulama

### Vercel (Önerilen)

1. GitHub'a push edin
2. [Vercel](https://vercel.com)'e import edin
3. Environment variables ekleyin:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy edin!

### Netlify

```bash
npm run build
npx netlify deploy --prod
```

### Diğer Platformlar

Build klasörünü (`dist/`) herhangi bir static hosting servisine deploy edebilirsiniz.

**⚠️ Önemli**: Deployment sonrası Supabase'de **Site URL** ve **Redirect URLs** ayarlarını güncellemeyi unutmayın!

## 📚 Dokümantasyon

- [Supabase Setup Rehberi](./SUPABASE_SETUP.md)
- [AI Studio](https://ai.studio/apps/drive/1wyRANGN2atq02crZ9pp9e1bgGt5JkXO7)

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır! Büyük değişiklikler için önce bir issue açarak tartışalım.

## 📄 Lisans

MIT

## 🙏 Teşekkürler

Supabase, React, Vite ve tüm açık kaynak topluluğuna teşekkürler!

---

**🚀 Payça ile grup harcamalarınızı kolayca yönetin!**
