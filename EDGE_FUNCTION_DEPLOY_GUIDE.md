# 🚀 Supabase Edge Function Deployment Guide

## ADIM 1: Supabase Dashboard'a Gidin

1. https://supabase.com/dashboard adresine gidin
2. Projenize tıklayın: **dgvwrmnxvkqbywusztnj**
3. Sol menüden **Edge Functions** sekmesine gidin

---

## ADIM 2: Yeni Edge Function Oluşturun

1. **"Create a new function"** butonuna tıklayın
2. Function adını girin: **`openai-proxy`**
3. Template olarak **"HTTP Request"** seçin (veya boş bırakın)
4. **Create function** butonuna tıklayın

---

## ADIM 3: Kodu Yapıştırın

1. Açılan kod editörünü temizleyin (tüm mevcut kodu silin)
2. Şu dosyayı açın: **`supabase/functions/openai-proxy/DEPLOY_THIS.ts`**
3. **Tüm içeriği kopyalayın** (Ctrl+A, Ctrl+C)
4. Dashboard'daki editöre **yapıştırın** (Ctrl+V)
5. **Deploy** butonuna tıklayın

### ✅ Kod Dosyası Konumu:
```
/home/user/Payca-app/supabase/functions/openai-proxy/DEPLOY_THIS.ts
```

---

## ADIM 4: OpenAI API Key Secret'ı Ekleyin

1. Supabase Dashboard'da **Settings** → **Edge Functions** → **Secrets** sayfasına gidin
   (Veya doğrudan: Project Settings → Edge Functions)

2. **Add a new secret** butonuna tıklayın

3. Şu bilgileri girin:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `.env.local` dosyasındaki OpenAI API key değerini buraya kopyalayın

4. **Save** butonuna tıklayın

⚠️ **ÖNEMLİ:** Secret eklendikten sonra Edge Function'ı **yeniden deploy** etmeniz gerekebilir.

---

## ADIM 5: Test Edin

### Option A: Dashboard'dan Test

1. Edge Functions sayfasında **openai-proxy** function'ına tıklayın
2. **Invoke** sekmesine geçin
3. Test isteği gönderin:

**Body:**
```json
{
  "type": "financial-advice",
  "groups": [
    {
      "name": "Test Grup",
      "members": [{"id": 1, "name": "Test"}],
      "expenses": [
        {"amount": 100, "category": "food"}
      ]
    }
  ],
  "userId": "test-user"
}
```

4. **Send** butonuna tıklayın
5. Response'da `{"success": true, "advice": "..."}` görmelisiniz

### Option B: Koddan Test

Uygulamanızı açın ve:
1. **AI Danışman** butonuna tıklayın
2. Console'da (F12) log'ları kontrol edin
3. `[OpenAI Proxy] Getting financial advice...` mesajını görmelisiniz

---

## ADIM 6: Deployment Durumunu Kontrol Edin

1. Edge Functions sayfasında **openai-proxy** function'ını bulun
2. Status'un **"Deployed"** olduğunu doğrulayın
3. Yeşil tik işareti görmelisiniz ✅

### URL'iniz:
```
https://dgvwrmnxvkqbywusztnj.supabase.co/functions/v1/openai-proxy
```

---

## 🐛 Sorun Giderme

### "Function not found" hatası:
- Function adının tam olarak **`openai-proxy`** olduğundan emin olun (tire ile)
- Deploy işleminin tamamlandığını kontrol edin

### "Missing authorization header" hatası:
- Normal! Bu, auth gerektirdiğini gösterir
- Uygulamadan test edin (otomatik auth header gönderir)

### "OpenAI API key not configured" hatası:
- Secrets'ta `OPENAI_API_KEY` adının doğru olduğundan emin olun
- Edge Function'ı yeniden deploy edin

### "429 You exceeded your quota" hatası:
- OpenAI API kotanızı kontrol edin: https://platform.openai.com/usage
- Ödeme yöntemi ekleyin veya kredi yükleyin

---

## ✅ Başarı Kontrolü

Edge Function başarıyla deploy edildiyse:

1. ✅ Edge Functions sayfasında "Deployed" status
2. ✅ Secrets'ta OPENAI_API_KEY mevcut
3. ✅ Test isteği success response döndürüyor
4. ✅ Uygulamada AI Danışman çalışıyor

---

## 📝 Sonraki Adımlar

Edge Function deploy edildikten sonra:

1. Uygulamanızı test edin (AI Danışman ve Fatura Tara)
2. Console log'larını kontrol edin (F12)
3. Eğer çalışıyorsa, `.env.local`'den `VITE_OPENAI_API_KEY` satırını silebilirsiniz (artık gerekli değil)

---

## 🎯 Özet

```bash
✅ Function Name: openai-proxy
✅ URL: https://dgvwrmnxvkqbywusztnj.supabase.co/functions/v1/openai-proxy
✅ Secret: OPENAI_API_KEY (set in dashboard)
✅ Code: Copied from DEPLOY_THIS.ts
```

---

## 📞 Destek

Sorun yaşarsanız:
1. Supabase Dashboard → Edge Functions → openai-proxy → **Logs** sekmesini kontrol edin
2. Browser console (F12) log'larını kontrol edin
3. Error mesajını bana gönderin

---

**Hazır mısınız?** Yukarıdaki adımları takip edin ve bana "Deployed!" yazın! 🚀
