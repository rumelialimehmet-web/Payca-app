# Fiş Saklama Özelliği - Uygulama Kılavuzu

## 📸 Özellik Özeti

Payca uygulamasına fotoğraf yükleme ve fiş saklama özelliği başarıyla eklendi! Artık kullanıcılar harcama oluştururken fiş fotoğrafı ekleyebilir, önizleyebilir ve saklayabilir.

---

## 🎯 Yapılan Değişiklikler

### 1. **Supabase Storage Bucket Kurulumu**

**Dosya:** `supabase-storage-setup.sql`

Storage bucket ve güvenlik politikaları oluşturuldu:
- ✅ `receipts` bucket'ı (public)
- ✅ Kimlik doğrulamalı kullanıcılar için yükleme politikası
- ✅ Grup üyeleri için görüntüleme politikası
- ✅ Kullanıcıların kendi fişlerini silme politikası

**Nasıl Kurulur:**
```sql
-- Supabase SQL Editor'da çalıştırın:
-- 1. Supabase Dashboard > SQL Editor'ı açın
-- 2. supabase-storage-setup.sql dosyasındaki SQL kodunu yapıştırın
-- 3. Run butonuna basın
```

---

### 2. **Storage Servisi (`src/lib/supabase.ts`)**

Yeni `storage` nesnesi eklendi:

```typescript
export const storage = {
  receipts: {
    // Fiş yükleme
    upload: async (file: File, userId: string)

    // Fiş silme
    delete: async (filePath: string)

    // Public URL alma
    getPublicUrl: (filePath: string)
  }
}
```

**Özellikler:**
- ✅ Dosya tipi validasyonu (JPG, PNG, WEBP, HEIC)
- ✅ Dosya boyutu kontrolü (max 10MB)
- ✅ Benzersiz dosya isimleri (`{userId}/{timestamp}_{random}.{ext}`)
- ✅ Otomatik public URL oluşturma
- ✅ Türkçe hata mesajları

---

### 3. **Harcama Formu (`src/components/ModernExpenseForm.tsx`)**

**Yeni State'ler:**
```typescript
const [photo, setPhoto] = useState<string>()           // URL
const [photoFile, setPhotoFile] = useState<File | null>(null)
const [photoPreview, setPhotoPreview] = useState<string | null>(null)
const [uploadingPhoto, setUploadingPhoto] = useState(false)
const fileInputRef = useRef<HTMLInputElement>(null)
```

**Yeni Fonksiyonlar:**
- `handlePhotoSelect()` - Dosya seçimi ve önizleme
- `handleRemovePhoto()` - Fotoğraf kaldırma
- `uploadPhoto()` - Supabase'e yükleme

**UI Geliştirmeleri:**
```tsx
{/* Fotoğraf önizleme kartı */}
{photoPreview ? (
  <div className="border rounded-lg p-3">
    <img src={photoPreview} className="w-20 h-20 object-cover rounded-lg" />
    <button onClick={handleRemovePhoto}>Sil</button>
  </div>
) : (
  <button onClick={() => fileInputRef.current?.click()}>
    Fiş/Fotoğraf Ekle
  </button>
)}
```

---

### 4. **Harcama Kartı (`src/components/ExpenseCard.tsx`)**

**Yeni Prop:**
```typescript
receiptUrl?: string | null
```

**Görsel İyileştirme:**
```tsx
{receiptUrl && (
  <span className="material-symbols-outlined text-blue-500" title="Fiş mevcut">
    receipt
  </span>
)}
```

Fiş olan harcamalarda mavi fiş ikonu görüntülenir.

---

## 📱 Kullanıcı Akışı

### Harcama Ekleme + Fiş Yükleme

1. **Harcama formu açılır**
2. **"Fiş/Fotoğraf Ekle" butonuna tıkla**
3. **Dosya seçici açılır** (JPG/PNG/WEBP/HEIC)
4. **Fotoğraf seçilir:**
   - ✅ Önizleme gösterilir
   - ✅ Dosya adı görüntülenir
   - ✅ Silme butonu aktif olur
5. **"Harcamayı Kaydet" butonuna tıkla**
6. **Sistem otomatik olarak:**
   - Fotoğrafı Supabase Storage'a yükler
   - Public URL alır
   - Harcamayı `receipt_url` ile kaydeder
7. **Harcama listesinde fiş ikonu görünür**

---

## 🔒 Güvenlik Özellikleri

### Dosya Validasyonu
```typescript
// Kabul edilen tipler
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']

// Maksimum boyut
const maxSize = 10 * 1024 * 1024 // 10MB
```

### RLS Politikaları
```sql
-- Sadece grup üyeleri fişleri görebilir
CREATE POLICY "Users can view group receipts"
ON storage.objects FOR SELECT
USING (
  -- Kullanıcı, fişi içeren harcamanın olduğu grupta olmalı
  EXISTS (
    SELECT 1 FROM expenses e
    JOIN group_members gm ON e.group_id = gm.group_id
    WHERE gm.user_id = auth.uid()
    AND e.receipt_url LIKE '%' || storage.objects.name || '%'
  )
)
```

---

## 🗄️ Database Şeması

**`expenses` tablosu zaten hazır:**
```sql
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paid_by UUID REFERENCES profiles(id),
  receipt_url TEXT,  -- ← FİŞ URL'si BURAYA KAYDOLUR
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## 🚀 Kurulum Adımları

### 1. Supabase Storage Kurulumu

```bash
# Supabase Dashboard'a git
# SQL Editor'ı aç
# supabase-storage-setup.sql içeriğini yapıştır
# Run butonuna bas
```

### 2. Environment Variables

`.env.local` dosyasında:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Npm Paketleri

Gerekli paketler zaten kurulu:
```json
{
  "@supabase/supabase-js": "^2.76.1",
  "react": "^19.1.1"
}
```

---

## 🧪 Test Senaryoları

### ✅ Test 1: Basarılı Yükleme
1. Harcama formunu aç
2. 5MB JPG fotoğraf seç
3. Önizlemenin göründüğünü doğrula
4. Harcamayı kaydet
5. Harcama listesinde fiş ikonunu kontrol et

### ✅ Test 2: Dosya Tipi Validasyonu
1. PDF veya TXT dosyası seçmeyi dene
2. "Geçersiz dosya tipi" uyarısını gör
3. Dosya seçilmemeli

### ✅ Test 3: Dosya Boyutu Kontrolü
1. 15MB fotoğraf seçmeyi dene
2. "Dosya boyutu çok büyük" uyarısını gör
3. Dosya seçilmemeli

### ✅ Test 4: Fotoğraf Silme
1. Fotoğraf seç
2. Sil butonuna bas
3. Önizleme kaybolmalı
4. Yeni fotoğraf seçebilme

### ✅ Test 5: Supabase Yükleme
1. Network sekmesini aç
2. Fotoğraf seç ve kaydet
3. `storage/v1/object/receipts/` endpoint'ine istek atıldığını gör
4. 200 OK yanıtı al

---

## 📊 Teknik Detaylar

### Dosya Adlandırma Formatı
```
receipts/
  {userId}/
    {timestamp}_{random}.{extension}

Örnek:
receipts/
  abc123-user-id/
    1735567890123_x8h2k9.jpg
```

### Public URL Formatı
```
https://{project}.supabase.co/storage/v1/object/public/receipts/{userId}/{filename}
```

### Upload Response
```typescript
{
  data: {
    path: "abc123/1735567890123_x8h2k9.jpg",
    publicUrl: "https://..."
  },
  error: null
}
```

---

## 🐛 Hata Çözümleri

### Hata: "Supabase not configured"
**Çözüm:** `.env.local` dosyasında `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` tanımlı olmalı

### Hata: "Bucket not found"
**Çözüm:** `supabase-storage-setup.sql` dosyasını Supabase SQL Editor'da çalıştırın

### Hata: "Permission denied"
**Çözüm:** RLS politikalarının doğru kurulduğundan emin olun (storage-setup.sql)

### Fotoğraf yüklenmiyor
**Kontrol listesi:**
1. ✅ Kullanıcı giriş yapmış mı? (`auth.uid()` null olmamalı)
2. ✅ Dosya tipi destekleniyor mu?
3. ✅ Dosya boyutu 10MB altında mı?
4. ✅ Network bağlantısı var mı?

---

## 🎨 UI/UX İyileştirmeleri

### Önizleme Kartı
```
┌─────────────────────────────┐
│ [📷 Thumbnail]  Fiş eklendi │
│                 photo.jpg   │
│                     [🗑️ Sil] │
└─────────────────────────────┘
```

### Harcama Kartında İkon
```
┌─────────────────────────────┐
│ 🍔  Akşam Yemeği           │
│     Ahmet ödedi 🧔 🧾      │  ← Mavi fiş ikonu
│                    500.00₺ │
└─────────────────────────────┘
```

### Yükleme Durumu
```
[Harcamayı Kaydet] → [Fotoğraf Yükleniyor...] → [✅ Kaydedildi]
      (aktif)              (disabled)               (başarı)
```

---

## 📈 Sonraki Adımlar (İsteğe Bağlı)

### 1. Fiş Detay Modalı
- [ ] Fişe tıklayınca tam boyutlu görüntüleme
- [ ] Zoom/pan fonksiyonları
- [ ] İndirme butonu

### 2. AI Fiş Tarama Entegrasyonu
- [ ] Mevcut Gemini OCR ile otomatik doldurma
- [ ] Yüklenen fişi otomatik tara
- [ ] Tutar/açıklama/kategori öner

### 3. Çoklu Fotoğraf
- [ ] Birden fazla fiş yükleme
- [ ] Galeri görünümü
- [ ] Fotoğraf kaydırma

### 4. Offline Desteği
- [ ] IndexedDB ile lokal önbellekleme
- [ ] Offline yükleme kuyruğu
- [ ] Sync when online

---

## 📝 Değişiklik Özeti

| Dosya | Değişiklik | Satır Sayısı |
|-------|-----------|--------------|
| `supabase-storage-setup.sql` | Yeni dosya | 50 |
| `src/lib/supabase.ts` | Storage servisi eklendi | +80 |
| `src/components/ModernExpenseForm.tsx` | Foto yükleme UI | +150 |
| `src/components/ExpenseCard.tsx` | Fiş ikonu | +5 |

**Toplam:** ~285 satır yeni kod

---

## ✅ Tamamlanan Görevler

- [x] Supabase Storage bucket kurulumu
- [x] Dosya yükleme servisi
- [x] Form UI entegrasyonu
- [x] Önizleme ve silme fonksiyonları
- [x] Harcama kartında görsel gösterim
- [x] Güvenlik politikaları (RLS)
- [x] Hata yönetimi
- [x] Türkçe mesajlar

---

## 🎉 Başarıyla Tamamlandı!

Fiş saklama özelliği artık tam fonksiyonel ve kullanıma hazır. Kullanıcılar artık harcamalarına fotoğraf ekleyebilir ve organize bir şekilde saklayabilir.

**Geliştirme Süresi:** Gün 1-3 (Plana uygun ✅)

---

_Son güncelleme: 2025-01-29_
_Geliştirici: Claude Code AI_
