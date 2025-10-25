# 🤖 Google Gemini AI Kurulum Rehberi

## Gemini API Key Alma

### ADIM 1: Google AI Studio'ya Gidin

1. https://aistudio.google.com/ adresine gidin
2. Google hesabınızla giriş yapın

---

### ADIM 2: API Key Oluşturun

1. Sol menüden **"Get API key"** butonuna tıklayın
2. **"Create API key"** butonuna tıklayın
3. Bir Google Cloud projesi seçin veya yeni proje oluşturun
4. API key'iniz oluşturulacak - **Kopyalayın**!

---

### ADIM 3: API Key'i .env.local'e Ekleyin

1. Projenizde `.env.local` dosyasını açın
2. `VITE_GEMINI_API_KEY=your-gemini-api-key-here` satırını bulun
3. `your-gemini-api-key-here` kısmını kopyaladığınız API key ile değiştirin

**Örnek:**
```bash
VITE_GEMINI_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

### ADIM 4: Uygulamayı Yeniden Başlatın

Development server çalışıyorsa:

```bash
# Ctrl+C ile durdurun, sonra yeniden başlatın
npm run dev
```

---

## ✅ Test Edin

### Fatura Tarama
1. Uygulamayı açın
2. Bir gruba gidin
3. **"Fatura Tara"** butonuna tıklayın
4. Bir fatura fotoğrafı yükleyin
5. **"🤖 AI ile Tara"** butonuna tıklayın

Console'da (F12) şu mesajı görmelisiniz:
```
[Gemini] Scanning receipt with gemini-2.0-flash-exp...
[Gemini] Parsed receipt data: {...}
```

### AI Danışman
1. Ana sayfada **"AI Danışman"** butonuna tıklayın
2. Hızlı sorulardan birini seçin veya kendi sorunuzu yazın
3. AI size finansal tavsiye verecek

Console'da (F12) şu mesajı görmelisiniz:
```
[Gemini] Getting financial advice with gemini-2.0-flash-exp...
[Gemini] Financial advice generated
```

---

## 🆓 Gemini API Ücretsiz mi?

**EVET!** Google Gemini API ücretsiz kullanım limitleri sunuyor:

- **gemini-2.0-flash-exp**: Ücretsiz (deneysel model)
- **15 requests per minute** (dakikada 15 istek)
- **1,500 requests per day** (günde 1,500 istek)
- **1 million tokens per minute** (dakikada 1 milyon token)

Bu limitler normal kullanım için yeterlidir!

Kaynak: https://ai.google.dev/pricing

---

## 🔄 OpenAI'dan Gemini'ye Geçiş

### Değişiklikler:

✅ **ReceiptScanner**: Artık Gemini kullanıyor
✅ **AIAdvisor**: Artık Gemini kullanıyor
✅ **Model**: `gemini-2.0-flash-exp` (ücretsiz)
✅ **Bundle**: +31KB lazy-loaded chunk (7.77KB gzipped)

### OpenAI Hala Kullanılabilir mi?

Evet! OpenAI kodu hala projededir (`src/lib/openai-client.ts`).

**Gelecekte:**
- Supabase Edge Function ile OpenAI'ı ikinci seçenek olarak ekleyebiliriz
- Kullanıcı tercihine göre AI provider seçimi yapabiliriz

---

## 🐛 Sorun Giderme

### "API key not configured" hatası:
- `.env.local` dosyasında `VITE_GEMINI_API_KEY` değerini kontrol edin
- API key'in doğru kopyalandığından emin olun
- Development server'ı yeniden başlatın

### "429 Resource has been exhausted" hatası:
- Ücretsiz limit aşıldı
- 1 dakika bekleyin ve tekrar deneyin
- Veya Google Cloud'da ödeme yöntemi ekleyin

### Fatura taranmıyor:
- Console (F12) log'larını kontrol edin
- Fatura resminin net olduğundan emin olun
- API key'in aktif olduğunu doğrulayın

---

## 📊 Karşılaştırma: Gemini vs OpenAI

| Özellik | Gemini | OpenAI |
|---------|--------|--------|
| **Ücretsiz Limit** | ✅ 1,500/gün | ❌ Kredi gerekli |
| **Fatura Tarama** | ✅ gemini-2.0-flash-exp | ✅ gpt-4o |
| **Finansal Tavsiye** | ✅ gemini-2.0-flash-exp | ✅ gpt-4o-mini |
| **Türkçe Desteği** | ✅ Mükemmel | ✅ Mükemmel |
| **Hız** | ⚡ Hızlı | ⚡ Hızlı |
| **API Key Güvenliği** | ⚠️ Client-side | ✅ Edge Function |

---

## 🎯 Sonraki Adımlar

### Tamamlandı:
- ✅ Gemini SDK kurulumu
- ✅ Receipt scanning with vision
- ✅ Financial advice generation
- ✅ Component updates

### Beklemede:
- ⏸️ Supabase Edge Function (OpenAI için)
- ⏸️ Sidebar Financial Advisor
- ⏸️ AI provider seçimi (user preference)

---

**Hazır mısınız?** `.env.local` dosyasına API key'inizi ekleyin ve test edin! 🚀
