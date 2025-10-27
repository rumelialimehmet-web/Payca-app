# Payça Design System

Payça uygulamasının görsel tasarım sistemi ve component library referansı.

## 🎨 Renk Paleti

### Brand Colors
```css
--brand-gradient: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #f97316);
```
**Kullanım:** Logo, primary buttons, vurgular

### Semantic Colors
```css
--success-color: #22c55e  /* Yeşil - Başarılı işlemler */
--danger-color: #ef4444   /* Kırmızı - Hata, silme */
--warning-color: #f59e0b  /* Turuncu - Uyarılar */
```

### Theme Variables

#### Dark Theme (Default)
```css
--bg-color: #111827          /* Ana arka plan */
--surface-color: #1f2937     /* Kartlar, modals */
--surface-color-light: #374151 /* Hover states */
--text-primary: #f9fafb      /* Ana metin */
--text-secondary: #9ca3af    /* İkincil metin */
--border-color: #374151      /* Kenarlıklar */
```

#### Light Theme
```css
--bg-color: #f9fafb
--surface-color: #ffffff
--surface-color-light: #f3f4f6
--text-primary: #111827
--text-secondary: #6b7281
--border-color: #e5e7eb
```

#### Midnight Theme
```css
--bg-color: #0a0e27
--surface-color: #151b3d
--surface-color-light: #1f2748
--text-primary: #e2e8f0
--text-secondary: #94a3b8
--border-color: #1f2748
```

#### Sepia Theme
```css
--bg-color: #f4f1ea
--surface-color: #faf8f3
--surface-color-light: #f0ebe0
--text-primary: #5c4a3a
--text-secondary: #8b7961
--border-color: #d4c4b0
```

#### Forest Theme
```css
--bg-color: #0f1e0e
--surface-color: #1a2f1a
--surface-color-light: #254025
--text-primary: #e8f5e8
--text-secondary: #a8c5a8
--border-color: #254025
```

---

## 📐 Spacing System

Tüm margin ve padding değerleri 4px base unit kullanır:

```css
4px   → 0.25rem
8px   → 0.5rem
12px  → 0.75rem
16px  → 1rem
20px  → 1.25rem
24px  → 1.5rem
32px  → 2rem
40px  → 2.5rem
48px  → 3rem
64px  → 4rem
```

**Kullanım Örneği:**
```css
padding: 12px 24px;      /* Y: 12px, X: 24px */
margin-bottom: 40px;     /* 40px alt boşluk */
gap: 16px;               /* Flexbox/Grid gap */
```

---

## 🔤 Typography

### Font Family
```css
font-family: 'Inter', sans-serif;
```

### Font Sizes
```css
/* Headings */
h1: 2rem (32px)      font-weight: 700
h2: 1.5rem (24px)    font-weight: 600
h3: 1.25rem (20px)   font-weight: 600
h4: 1.125rem (18px)  font-weight: 600

/* Body */
body: 1rem (16px)    font-weight: 400
small: 0.875rem (14px)

/* Buttons */
button: 1rem (16px)  font-weight: 600
```

### Line Heights
```css
h1-h4: 1.2
body: 1.6
small: 1.4
```

---

## 🧱 Components

### Buttons

#### Primary Button (CTA)
```css
.cta-button, .form-button {
  background: var(--brand-gradient);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}
```

**Kullanım:**
- Ana aksiyonlar (Grup Oluştur, Harcama Ekle)
- Form submit butonları

#### Secondary Button
```css
.secondary-button {
  background: var(--surface-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 12px 24px;
  border-radius: 8px;
}
```

**Kullanım:**
- İkincil aksiyonlar (İptal, Geri)
- Alternatif seçenekler

#### Danger Button
```css
.danger-button {
  background: var(--danger-color);
  color: white;
  /* ... same as primary */
}
```

**Kullanım:**
- Silme işlemleri
- Geri alınamaz aksiyonlar

### Cards

#### Standard Card
```css
.card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

**Varyantlar:**
- `.group-card` - Grup kartları
- `.expense-card` - Harcama kartları
- `.balance-card` - Bakiye kartları

### Forms

#### Input Fields
```css
input[type="text"],
input[type="number"],
input[type="email"],
input[type="date"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--surface-color);
  color: var(--text-primary);
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

#### Validation States
```css
/* Error State */
input[aria-invalid="true"] {
  border-color: var(--danger-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Success State */
input[aria-valid="true"] {
  border-color: var(--success-color);
}
```

#### Field Error Message
```css
.field-error {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 4px;
}

.field-error::before {
  content: "⚠";
}
```

### Modals

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface-color);
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
```

### Badges

```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-success { background: #dcfce7; color: #166534; }
.badge-danger { background: #fee2e2; color: #991b1b; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-info { background: #dbeafe; color: #1e40af; }
```

---

## ⚡ Animations

### Transitions
```css
/* Standard easing */
transition: all 0.2s ease;

/* Hover effects */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* Modal entrance */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Loading States

#### Spinner
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Loading
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-color) 25%,
    var(--surface-color-light) 50%,
    var(--surface-color) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small phones */
@media (max-width: 480px) {
  .app-header { flex-direction: column; }
  .logo h1 { font-size: 1.5rem; }
}

/* Tablets */
@media (min-width: 768px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 1000px; }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .container { max-width: 1200px; }
}
```

---

## 🎯 Icon System

### Kategori İkonları
```javascript
const categoryIcons = {
  food: '🍔',           // Yemek
  transportation: '🚗', // Ulaşım
  bills: '💡',          // Faturalar
  rent: '🏠',           // Kira
  entertainment: '🎬',  // Eğlence
  shopping: '🛍️',      // Alışveriş
  health: '🏥',         // Sağlık
  education: '📚',      // Eğitim
  other: '📦'           // Diğer
};
```

### UI İkonları
```
✓ - Başarı / Tamamlandı
✕ - Kapat / İptal
+ - Ekle
− - Çıkar
⋯ - Daha fazla seçenek
⚠ - Uyarı
ℹ - Bilgi
```

---

## 🔧 Utility Classes

### Display
```css
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.grid { display: grid; }
```

### Spacing
```css
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mb-1 { margin-bottom: 8px; }
.p-1 { padding: 8px; }
.gap-1 { gap: 8px; }
```

### Text
```css
.text-center { text-align: center; }
.text-bold { font-weight: 600; }
.text-muted { color: var(--text-secondary); }
```

---

## 📋 Component Checklist

Design System'e yeni component eklerken:

- [ ] Tüm theme varyantlarında test edildi mi?
- [ ] Mobile responsive mi?
- [ ] Accessibility (a11y) özellikleri var mı?
- [ ] Loading state tasarlandı mı?
- [ ] Error state tasarlandı mı?
- [ ] Hover/Focus states tanımlı mı?
- [ ] Animation smooth mu?
- [ ] Dokümante edildi mi?

---

## 🎨 Figma Design Files (Gelecek)

- [ ] Component library
- [ ] Wireframes
- [ ] User flows
- [ ] Mockups

---

## 📚 Referanslar

- **Tailwind CSS**: Color palette inspiration
- **Material Design**: Component patterns
- **iOS Human Interface Guidelines**: Mobile UX
- **Radix UI**: Accessible components

---

**Son Güncelleme:** 2025-10-25
**Versiyon:** 1.0.0
