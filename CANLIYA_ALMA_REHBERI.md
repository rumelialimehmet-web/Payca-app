# 🚀 Payça - Canlıya Alma Rehberi (Production Deployment)

Bu rehber, Payça uygulamasını **canlıya almanız** için gereken TÜM adımları içerir.

## 📋 İÇİNDEKİLER

1. [Ön Hazırlık](#1-ön-hazırlık)
2. [Supabase Kurulumu](#2-supabase-kurulumu)
3. [Yerel Test](#3-yerel-test)
4. [Vercel'e Deploy](#4-vercele-deploy)
5. [Son Kontroller](#5-son-kontroller)

---

## 1. ÖN HAZIRLIK

### Gerekli Hesaplar

✅ **GitHub Hesabı** - Kodunuz zaten GitHub'da
✅ **Supabase Hesabı** - https://supabase.com (ÜCRETSİZ)
✅ **Vercel Hesabı** - https://vercel.com (ÜCRETSİZ)

### Yerel Gereksinimler

```bash
# Node.js versiyonunu kontrol edin
node --version  # v16+ olmalı

# Bağımlılıkları yükleyin (henüz yapmadıysanız)
npm install
```

---

## 2. SUPABASE KURULUMU

### Adım 2.1: Supabase Projesi Oluştur

1. **https://app.supabase.com** adresine gidin
2. **"New Project"** butonuna tıklayın
3. Bilgileri doldurun:
   - **Name**: `payca`
   - **Database Password**: Güçlü bir şifre (kaydedin!)
   - **Region**: `Europe (Frankfurt)` (Türkiye için en yakın)
   - **Pricing Plan**: Free
4. **"Create new project"** tıklayın
5. ⏳ 1-2 dakika bekleyin

### Adım 2.2: API Anahtarlarını Al

Proje hazır olunca:

1. Sol menüden **⚙️ Project Settings** → **API** gidin
2. Bu bilgileri kopyalayın:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhb...` (uzun bir key)

### Adım 2.3: Database Schema'yı Oluştur

1. Supabase Dashboard'da sol menüden **SQL Editor** sekmesine gidin
2. **"New query"** butonuna tıklayın
3. Aşağıdaki dosyanın içeriğini kopyalayın:
   ```bash
   cat supabase-schema-fixed.sql
   ```
4. SQL Editor'e yapıştırın ve **RUN** (veya Ctrl+Enter) basın
5. ✅ "Success" mesajı görmeli ve şu tablolar oluşmuş olmalı:
   - `profiles` (kullanıcı profilleri)
   - `groups` (gruplar)
   - `group_members` (grup üyeleri)
   - `expenses` (harcamalar)
   - `expense_splits` (harcama paylaşımları)
   - `settlements` (ödeme kayıtları)

### Adım 2.4: Storage Bucket Oluştur (Fişler için)

1. Sol menüden **Storage** sekmesine gidin
2. **"New bucket"** butonuna tıklayın
3. Bilgileri doldurun:
   - **Name**: `receipts`
   - **Public bucket**: ✅ İşaretleyin
4. **"Create bucket"** tıklayın

### Adım 2.5: Environment Variables'ı Ayarla

Proje kök dizininde `.env` dosyası zaten oluşturuldu. Şimdi düzenleyin:

```bash
# .env dosyasını açın ve değerleri güncelleyin
nano .env
```

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...

# Google Gemini API (Opsiyonel - şimdilik boş bırakabilirsiniz)
GEMINI_API_KEY=
```

**⚠️ ÖNEMLİ**:
- `xxxxx` yerine kendi Supabase bilgilerinizi yazın
- `.env` dosyası asla GitHub'a yüklenmez (`.gitignore`'da var)

---

## 3. YEREL TEST

Supabase bağlantısını test edelim:

```bash
# Development server'ı başlatın
npm run dev
```

Tarayıcıda **http://localhost:3000** açın:

### Test Adımları:

1. ✅ **Kayıt Ol** ile yeni hesap oluşturun
2. ✅ Email ve şifre girin
3. ✅ Giriş yapın
4. ✅ Yeni bir grup oluşturun
5. ✅ Gruba bir harcama ekleyin

### Doğrulama:

Supabase Dashboard'da kontrol edin:
- **Authentication → Users**: Kullanıcınızı görmelisiniz
- **Table Editor → profiles**: Profiliniz olmalı
- **Table Editor → groups**: Grubunuz olmalı
- **Table Editor → expenses**: Harcamanız olmalı

✅ **HER ŞEY ÇALIŞIYORSA → Vercel'e deploy edebilirsiniz!**

---

## 4. VERCEL'E DEPLOY

### Adım 4.1: Vercel Hesabı Oluştur

1. **https://vercel.com** adresine gidin
2. **"Sign Up"** ile GitHub hesabınızla giriş yapın

### Adım 4.2: Projeyi İmport Et

1. Vercel Dashboard'da **"Add New..." → "Project"**
2. GitHub repository'nizi seçin: `Payca-app`
3. **"Import"** tıklayın

### Adım 4.3: Environment Variables Ekle

**ÖNEMLİ**: Deploy etmeden önce!

1. **"Environment Variables"** bölümünü genişletin
2. Aşağıdaki değişkenleri ekleyin:

```
Name: VITE_SUPABASE_URL
Value: https://xxxxx.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

(Opsiyonel - AI özellikleri için)
```
Name: GEMINI_API_KEY
Value: your-gemini-api-key
```

3. **"Deploy"** butonuna tıklayın

### Adım 4.4: Deploy Bekleyin

⏳ 2-3 dakika içinde deploy tamamlanır.

✅ Deploy başarılı olunca **"Visit"** butonuna tıklayın!

---

## 5. SON KONTROLLER

### Adım 5.1: Production URL'i Test Et

Vercel size bir URL verecek: `https://payca-app.vercel.app` (veya benzeri)

Test edin:
- ✅ Sayfa açılıyor mu?
- ✅ Kayıt ol çalışıyor mu?
- ✅ Giriş yap çalışıyor mu?
- ✅ Grup oluşturma çalışıyor mu?
- ✅ Harcama ekleme çalışıyor mu?

### Adım 5.2: Supabase URL Configuration

Supabase Dashboard'da:

1. **Authentication → URL Configuration** gidin
2. **Site URL** ekleyin: `https://payca-app.vercel.app`
3. **Redirect URLs** ekleyin:
   - `https://payca-app.vercel.app/**`
   - `http://localhost:3000/**` (local development için)

### Adım 5.3: Google OAuth (Opsiyonel)

Eğer Google ile giriş istiyorsanız:

1. **Google Cloud Console**: https://console.cloud.google.com
2. OAuth 2.0 Client ID oluşturun
3. **Authorized redirect URIs** ekleyin:
   - `https://xxxxx.supabase.co/auth/v1/callback`
4. Supabase'de **Authentication → Providers → Google** ile aktifleştirin

---

## 🎉 TEBRİKLER!

✅ **Uygulamanız artık canlıda!**

**Production URL'iniz**: `https://payca-app.vercel.app`

---

## 🔧 YAYGIN SORUNLAR VE ÇÖZÜMLER

### Sorun 1: "Supabase not configured" Uyarısı

**Çözüm**:
- Vercel Dashboard → Settings → Environment Variables kontrol edin
- `VITE_` prefix'i olmalı
- Deploy'dan sonra değişiklik yaptıysanız **"Redeploy"** edin

### Sorun 2: "Failed to fetch" Hatası

**Çözüm**:
- Supabase URL doğru mu kontrol edin
- Supabase projesi aktif mi?
- Network bağlantınız var mı?

### Sorun 3: Kayıt Ol Çalışmıyor

**Çözüm**:
- Supabase Dashboard → Authentication → Email Auth aktif mi?
- Supabase → Authentication → URL Configuration doğru mu?

### Sorun 4: Deploy Başarısız

**Çözüm**:
```bash
# Önce local build test edin
npm run build

# Hata varsa düzeltin, yoksa tekrar deploy edin
```

---

## 📊 PERFORMANS VE İZLEME

### Vercel Analytics (Ücretsiz)

Vercel Dashboard → Analytics → Enable

### Google Analytics (Opsiyonel)

1. Google Analytics hesabı oluşturun
2. Tracking ID alın
3. `index.html` dosyasına ekleyin

---

## 🚀 SONRAKI ADIMLAR

✅ Tamamlandı: Uygulama canlıda!

**İyileştirmeler (Opsiyonel)**:

1. **Custom Domain**: Vercel → Settings → Domains
2. **SEO Optimization**: Meta tags, sitemap
3. **Email Bildirimler**: Supabase Edge Functions
4. **Push Notifications**: PWA features
5. **Analytics**: Google Analytics, Mixpanel

---

## 📞 DESTEK

**Sorun mu yaşıyorsunuz?**

1. **Logları kontrol edin**:
   - Vercel: Dashboard → Deployments → Logs
   - Supabase: Dashboard → Logs
   - Browser: F12 → Console

2. **Documentation**:
   - Supabase Docs: https://supabase.com/docs
   - Vercel Docs: https://vercel.com/docs

---

## 📝 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [x] Local build başarılı (`npm run build`)
- [x] Supabase konfigürasyonu tamamlandı
- [x] Environment variables hazır
- [x] `.env` dosyası `.gitignore`'da

### Deployment
- [ ] Vercel'e import edildi
- [ ] Environment variables eklendi
- [ ] Deploy başarılı
- [ ] Production URL test edildi

### Post-Deployment
- [ ] Supabase URL configuration güncellendi
- [ ] Tüm özellikler test edildi
- [ ] Analytics kuruldu (opsiyonel)
- [ ] Custom domain bağlandı (opsiyonel)

---

## ⚡ HIZLI BAŞLANGIÇ ÖZETİ

```bash
# 1. Supabase projesi oluştur (1-2 dk)
# 2. SQL schema çalıştır (30 sn)
# 3. .env dosyasını doldur (1 dk)
# 4. Yerel test (npm run dev)
# 5. Vercel'e deploy (2-3 dk)
# 6. Production test

# TOPLAM: ~10 dakika
```

---

**🎉 Artık uygulamanız canlıda ve kullanıma hazır!**
