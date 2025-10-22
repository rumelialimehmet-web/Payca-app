# Payça - Supabase Setup Guide

Bu rehber, Payça uygulamasını Supabase backend ile production-ready hale getirmek için gerekli adımları içerir.

## 📋 Ön Koşullar

- Node.js (v16 veya üzeri)
- Bir Supabase hesabı (ücretsiz): https://supabase.com

## 🚀 Adım 1: Supabase Projesi Oluşturma

1. **Supabase'e giriş yapın**: https://app.supabase.com
2. **"New Project" butonuna tıklayın**
3. **Proje bilgilerini doldurun**:
   - **Name**: `payca` (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre oluşturun ve **kaydedin** (buna ihtiyacınız olmayacak ama kaydetmek iyi bir pratiktir)
   - **Region**: `Europe (Frankfurt)` veya size en yakın bölge
   - **Pricing Plan**: Free tier yeterli (500MB database, 1GB bandwidth)
4. **"Create new project" butonuna tıklayın**
5. Proje kurulumu **1-2 dakika** sürer ⏳

## 🔑 Adım 2: API Anahtarlarını Alma

Proje hazır olunca:

1. Sol menüden **"Project Settings"** (⚙️) sekmesine gidin
2. **"API"** sekmesini seçin
3. Aşağıdaki bilgileri kopyalayın:
   - **Project URL** (örnek: `https://abcdefgh.supabase.co`)
   - **anon public** key (başlangıcı: `eyJhb...`)

## 📝 Adım 3: Environment Variables Ayarlama

1. Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

2. `.env.local` dosyasını açın ve kopyaladığınız değerleri yapıştırın:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **ÖNEMLİ**: `.env.local` dosyası `.gitignore`'da olmalı ve asla git'e commit edilmemelidir!

## 🗄️ Adım 4: Database Schema Oluşturma

1. Supabase Dashboard'da **"SQL Editor"** sekmesine gidin (sol menüde)
2. **"New query"** butonuna tıklayın
3. `supabase-schema.sql` dosyasının içeriğini kopyalayın:

```bash
cat supabase-schema.sql
```

4. SQL Editor'e yapıştırın
5. **"RUN"** butonuna tıklayın (Ctrl/Cmd + Enter)
6. ✅ Tüm tablolar, policy'ler ve trigger'lar oluşturulacak

### Oluşturulan Tablolar:
- ✅ `profiles` - Kullanıcı profilleri
- ✅ `groups` - Harcama grupları
- ✅ `group_members` - Grup üyelikleri
- ✅ `expenses` - Harcamalar
- ✅ `expense_splits` - Harcama bölüşümleri
- ✅ `settlements` - Ödeme kayıtları

## 🔐 Adım 5: Google OAuth Ayarlama (Opsiyonel)

Google ile giriş özelliğini aktifleştirmek için:

1. **Google Cloud Console**: https://console.cloud.google.com
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. **"APIs & Services" → "Credentials"** gidin
4. **"Create Credentials" → "OAuth 2.0 Client ID"**
5. **Application type**: Web application
6. **Authorized JavaScript origins**:
   - `http://localhost:5173` (development)
   - `https://your-domain.com` (production)
7. **Authorized redirect URIs**:
   - `https://your-project-id.supabase.co/auth/v1/callback`
8. Client ID ve Client Secret'ı kopyalayın

Supabase'de:
1. **"Authentication" → "Providers"** gidin
2. **"Google"** sağlayıcısını aktifleştirin
3. Client ID ve Client Secret'ı yapıştırın
4. **Save** edin

## ✅ Adım 6: Test Etme

1. Uygulamayı çalıştırın:

```bash
npm run dev
```

2. Tarayıcıda açın: `http://localhost:5173`
3. **"Kayıt Ol"** ile yeni bir hesap oluşturun
4. Supabase Dashboard → **"Authentication" → "Users"** sekmesinden kullanıcıyı görebilirsiniz
5. **"Table Editor"** → **"profiles"** tablosunda profilinizi görmelisiniz

## 🔍 Database'i İnceleme

Supabase Dashboard'da:
- **"Table Editor"**: Tablolardaki verileri görüntüleyin ve düzenleyin
- **"SQL Editor"**: SQL sorguları çalıştırın
- **"Database" → "Roles"**: Row Level Security politikalarını inceleyin

## 🛠️ Yaygın Sorunlar ve Çözümler

### Problem: "Missing Supabase environment variables"
**Çözüm**: `.env.local` dosyasının doğru konumda olduğundan ve değerlerin `VITE_` prefix'i ile başladığından emin olun.

### Problem: "Failed to fetch" hataları
**Çözüm**:
- Supabase URL'in doğru olduğunu kontrol edin
- Network bağlantınızı kontrol edin
- Supabase projesinin aktif olduğunu doğrulayın

### Problem: Row Level Security hataları
**Çözüm**:
- Kullanıcının giriş yapmış olduğundan emin olun
- `supabase-schema.sql` dosyasındaki tüm policy'lerin doğru çalıştığını kontrol edin

### Problem: Tablolar oluşturulamadı
**Çözüm**:
- SQL Editor'de hata mesajını okuyun
- Schema'yı tekrar çalıştırmadan önce mevcut tabloları silin
- Her table için DROP IF EXISTS ekleyebilirsiniz

## 📊 Database Backup

Ücretsiz tier'da otomatik backup yok, ama manuel backup alabilirsiniz:

```bash
# Supabase CLI ile (gerekirse kurulum yapın)
npx supabase db dump -f backup.sql
```

## 🎯 Production Checklist

- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] Supabase projesi oluşturuldu
- [ ] Database schema çalıştırıldı
- [ ] Environment variables ayarlandı
- [ ] Google OAuth konfigüre edildi (opsiyonel)
- [ ] Test kullanıcısı ile giriş yapıldı
- [ ] Grup oluşturma test edildi
- [ ] Harcama ekleme test edildi
- [ ] Real-time senkronizasyon çalışıyor

## 🚢 Deployment

Vercel, Netlify veya diğer platformlarda deploy ederken:

1. Environment variables'ı platform dashboard'ına ekleyin:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Supabase'de **"Authentication" → "URL Configuration"** bölümünden:
   - **Site URL**: Production domain'inizi ekleyin
   - **Redirect URLs**: Callback URL'lerini ekleyin

## 📚 Ek Kaynaklar

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

**🎉 Tebrikler!** Payça uygulamanız artık production-ready bir backend'e sahip!
