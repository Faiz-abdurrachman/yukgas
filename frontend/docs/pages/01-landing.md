# 01. Landing Page

## Route
`/`

## Purpose
Halaman pembuka yang memperkenalkan YUKgas.in ke pengunjung baru. Menjelaskan value proposition, cara kerja, dan kategori quest. Menjadi gerbang menuju login/register.

## Access
- **Public** — tidak perlu login
- Redirect ke `/dashboard` jika user sudah login

---

## UI Components

### 1. HeroSection
- **Type:** Section container
- **Isi:**
  - Logo YUKgas.in (ikon roket/🚀 + text "YUKgas.in")
  - Tagline: "Marketplace Micro-Task Kampus UNU"
  - Sub-tagline: "Butuh bantuan? Yuk gas! Ada teman siap bantu."
  - CTA Button primary: "Login dengan Email UNU" → `/login`
  - CTA link secondary: "Belum punya akun? Daftar" → `/register`

### 2. HowItWorks (3 Step Cards)
- **Type:** Horizontal card list (scrollable di mobile)
- **Isi 3 kartu:**
  - Kartu 1: 📝 "Post Quest" — "Butuh bantuan? Posting quest dengan kompensasi"
  - Kartu 2: 🤝 "Seseorang Ambil" — "Mahasiswa lain melihat dan mengambil quest kamu"
  - Kartu 3: ✅ "Quest Selesai!" — "Konfirmasi selesai, bayar, dan kasih rating"

### 3. CategoryShowcase
- **Type:** Grid 2x2 atau horizontal scroll
- **Isi 4 kategori:**
  - 🚗 Transportasi — "Antar jemput, titip barang"
  - 🍔 Makanan & Belanja — "Beliin makanan, belanja"
  - 📄 Administrasi — "Print, fotokopi, antri"
  - 📦 Lainnya — "Bantuan belajar, dll"

### 4. Footer
- **Type:** Footer bar
- **Isi:** Copyright "© 2026 YUKgas.in", link "Tim Pengembang", link "Kebijakan Privasi"

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Default | Halaman dibuka | Semua section tampil normal |
| Logged In | User sudah punya token JWT | Redirect ke `/dashboard` (useEffect check) |

---

## Data Needed
- **API calls:** Tidak ada (semua konten static)
- **Static data:** Logo, tagline, step cards, kategori (hardcoded di komponen)

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| - | `/login` | Klik "Login dengan Email UNU" |
| - | `/register` | Klik "Belum punya akun? Daftar" |
| `/dashboard` | Redirect otomatis | Jika sudah login |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│                                      │
│              🚀                      │
│           YUKgas.in                  │
│   Marketplace Micro-Task Kampus      │
│                                      │
│    "Butuh bantuan? Yuk gas!          │
│     Ada teman siap bantu."           │
│                                      │
│  ┌────────────────────────────────┐  │
│  │   Login dengan Email UNU  →    │  │
│  └────────────────────────────────┘  │
│                                      │
│  Belum punya akun? Daftar di sini   │
│                                      │
├──────────────────────────────────────┤
│         CARA KERJA                   │
│                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │  📝    │ │  🤝    │ │  ✅    │   │
│  │  Post  │ │ Diambil│ │ Selesai│   │
│  │ Quest  │ │        │ │        │   │
│  └────────┘ └────────┘ └────────┘   │
│                                      │
├──────────────────────────────────────┤
│         KATEGORI QUEST               │
│                                      │
│  ┌──────────┐  ┌──────────┐         │
│  │ 🚗       │  │ 🍔       │         │
│  │ Transport│  │ Makanan  │         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │ 📄       │  │ 📦       │         │
│  │ Admin    │  │ Lainnya  │         │
│  └──────────┘  └──────────┘         │
│                                      │
├──────────────────────────────────────┤
│  © 2026 YUKgas.in · UNU Yogyakarta  │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **User sudah login:** Redirect ke `/dashboard` jangan tampilkan landing lagi
- **Slow load:** Logo dan tagline render dulu, section lain lazy load
- **Desktop view:** Layout center max-width 480px atau grid full (responsive)
