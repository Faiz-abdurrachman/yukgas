# 04. Dashboard / Quest Feed

## Route
`/dashboard`

## Purpose
Halaman utama setelah login. Menampilkan feed quest yang tersedia dengan kemampuan search, filter, dan sort. User bisa langsung melihat quest yang relevan dan mengambilnya. Ini adalah "home base" aplikasi.

## Access
- **Authenticated only** — redirect ke `/login` jika belum login

---

## UI Components

### 1. TopBar (Header)
- **Type:** Sticky header bar (fixed di atas saat scroll)
- **Position:** Top, height ~56px
- **Isi:**
  - **Left:** Hamburger menu button (☰) → buka SidebarDrawer
  - **Center:** Logo "YUKgas.in" (text kecil)
  - **Right:** Notification icon (🔔) + Avatar (foto profil kecil, clickable → `/profile`)

### 2. SidebarDrawer
- **Type:** Slide-in panel dari kiri (overlay)
- **Trigger:** Klik hamburger menu (☰)
- **Isi:**
  - User info: Avatar, Nama, Rating ⭐
  - Menu items:
    - 🏠 Dashboard → `/dashboard`
    - 📋 Quest Saya → `/my-quests`
    - ➕ Posting Quest → `/quests/create`
    - 👤 Profil Saya → `/profile`
  - Divider
  - 🚪 Keluar → logout (clear token → `/login`)
- **Close:** Klik overlay di luar drawer atau tombol ✕

### 3. SearchBar
- **Type:** Text input dengan search icon
- **Position:** Di bawah TopBar
- **Placeholder:** "Cari quest..."
- **Behavior:**
  - Debounce 300ms setelah user berhenti ngetik
  - Trigger GET `/api/v1/quests?search=keyword`
  - Clear button (✕) muncul jika ada text

### 4. FilterBar (Horizontal Scroll Chips)
- **Type:** Horizontal scrollable row of filter chips
- **Isi:**
  - **Kategori Dropdown:** [Semua ▼] → Transport, Makanan, Admin, Lainnya
  - **Harga Dropdown:** [Harga ▼] → Range slider (min - max)
  - **Urutkan Dropdown:** [Terbaru ▼] → Terbaru, Deadline Terdekat, Harga Tertinggi, Harga Terendah
- **Behavior:** Setiap perubahan filter trigger refetch quest

### 5. QuestCard (per quest)
- **Type:** Card component
- **Props:** `{ id, title, description, category, location, deadline, compensation, giverName, giverRating, status }`
- **Isi:**
  - **Row 1:** Category badge (icon + text, warna sesuai kategori) + Kompensasi (kanan, bold, "Rp 5.000")
  - **Row 2:** Judul quest (bold, 1 baris, truncate dengan ellipsis)
  - **Row 3:** Deskripsi (2 baris, truncate)
  - **Row 4:** 📍 Lokasi (kiri) + ⏰ Deadline relative (kanan, misal "2 jam lagi")
  - **Row 5:** Avatar giver kecil + Nama (kiri) + ⭐ Rating (kanan)
- **Action:** Click card → navigate ke `/quests/:id`
- **Badge warna per kategori:**
  - Transport: 🟦 Biru
  - Makanan: 🟧 Oranye
  - Admin: 🟩 Hijau
  - Lainnya: 🟪 Ungu

### 6. SkeletonCard
- **Type:** Loading placeholder (pulse animation)
- **Isi:** Grey boxes yang match layout QuestCard
- **Jumlah:** 3-4 skeleton saat loading awal

### 7. EmptyState
- **Type:** Centered content block
- **Isi:**
  - Icon besar 📭
  - Text: "Belum ada quest nih"
  - Subtext: "Coba ubah filter, atau jadi yang pertama posting!"
  - CTA Button: "+ Posting Quest Baru" → `/quests/create`

### 8. ErrorState
- **Type:** Centered content block
- **Isi:**
  - Icon ⚠️
  - Text: "Gagal memuat quest"
  - Button: "Coba Lagi" → refetch

### 9. FAB (Floating Action Button)
- **Type:** Circular floating button
- **Position:** Bottom-right, fixed
- **Icon:** ➕ (plus)
- **Action:** Navigate ke `/quests/create`
- **Label (opsional):** Tooltip "Posting Quest Baru"

### 10. BottomNav (Alternative Navigation)
- **Type:** Fixed bottom navigation bar (tab bar)
- **Position:** Bottom, height ~56px
- **Items (3 tabs):**
  - 🏠 Feed → `/dashboard` (active)
  - 📋 QuestKu → `/my-quests`
  - 👤 Profil → `/profile`
- **Active state:** Icon ter-highlight (warna primary)

### 11. LoadMore / InfiniteScroll
- **Type:** Button atau auto-load
- **Behavior:**
  - Setelah scroll ke bawah, auto-fetch halaman berikutnya
  - Atau button "Muat lebih banyak..." di akhir list
  - Loading spinner saat fetching page berikutnya
  - "Tidak ada quest lagi" jika sudah habis

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Loading (initial) | Pertama buka dashboard | 3-4 SkeletonCard |
| Populated | Data quest berhasil di-fetch | List of QuestCard |
| Empty (no quest at all) | Backend return array kosong | EmptyState component |
| Empty (filter no result) | Filter tidak match quest apapun | EmptyState dengan text "Tidak ada quest yang cocok dengan filter" |
| Error | Gagal fetch (network/server) | ErrorState dengan retry button |
| Loading more | Scroll ke bawah, fetch page 2 | SkeletonCard di bawah list existing |
| End of list | Semua quest sudah di-load | Text "Itu saja quest yang tersedia" |

---

## Data Needed

### API Call: GET `/api/v1/quests`

**Query Parameters:**
```
?page=1
&limit=10
&search=keyword
&category=TRANSPORT|FOOD|ADMIN|OTHER
&minPrice=1000
&maxPrice=50000
&sort=newest|deadline|price_high|price_low
&status=OPEN (default, hanya tampilkan yang available)
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "quests": [
      {
        "id": "uuid-xxx",
        "title": "Jemput barang di pos satpam",
        "description": "Tolong jemput paket saya...",
        "category": "TRANSPORT",
        "location": "Pos Satpam UNU",
        "deadline": "2026-06-20T14:00:00Z",
        "compensation": 5000,
        "status": "OPEN",
        "giver": {
          "id": "uuid-yyy",
          "fullName": "Faiz Abdurrachman",
          "reputation": 4.5
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/login` | `/dashboard` | Sukses login |
| `/dashboard` | `/quests/:id` | Klik QuestCard |
| `/dashboard` | `/quests/create` | Klik FAB (+) |
| `/dashboard` | `/my-quests` | Klik menu "Quest Saya" |
| `/dashboard` | `/profile` | Klik menu "Profil Saya" atau avatar |
| `/dashboard` | `/login` | Klik "Keluar" (logout) |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  ☰    YUKgas.in          🔔   (👤)   │  ← TopBar (sticky)
├──────────────────────────────────────┤
│  🔍 Cari quest...               ✕   │  ← SearchBar
├──────────────────────────────────────┤
│ [Semua ▼] [Harga ▼] [Terbaru ▼]  →  │  ← FilterBar (horizontal scroll)
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🚗 Transport         Rp 5.000  │  │  ← QuestCard
│  │ Jemput barang di pos satpam    │  │
│  │ Tolong jemput paket saya...    │  │
│  │ 📍 Pos Satpam    ⏰ 2 jam lagi │  │
│  │ (👤) Faiz A.        ⭐ 4.5     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🍔 Makanan          Rp 10.000  │  │  ← QuestCard
│  │ Beliin nasi goreng kantin A    │  │
│  │ Lagi laper banget tapi...      │  │
│  │ 📍 Kantin A      ⏰ 30 mnt lgi │  │
│  │ (👤) Hilman        ⭐ 4.8      │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📄 Admin             Rp 2.000  │  │  ← QuestCard
│  │ Print dokumen 5 lembar         │  │
│  │ Print tugas PBW, A4, hitam...  │  │
│  │ 📍 Lab Komputer   ⏰ 4 jam lgi │  │
│  │ (👤) Esa           ⭐ 4.2      │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📦 Lainnya           Rp 8.000  │  │
│  │ Bantu belajar PBW             │  │
│  │ Aku bingung bab React...      │  │
│  │ 📍 Perpustakaan   ⏰ besok    │  │
│  │ (👤) Imroatu       ⭐ 4.6      │  │
│  └────────────────────────────────┘  │
│                                      │
│        Muat lebih banyak...          │
│                                      │
│                                 ╭──╮ │
│                                 │ + │ │  ← FAB
│                                 ╰──╯ │
├──────────────────────────────────────┤
│  🏠        🔍        📋       👤     │  ← BottomNav
│  Feed     Cari     QuestKu  Profil   │
└──────────────────────────────────────┘
```

---

## Sidebar Drawer (Overlay saat hamburger di-klik)

```
┌──────────────────┐┌─────────────────┐
│                  ││ (👤) Faiz A.    │
│   (overlay       ││      ⭐ 4.5     │
│    gelap,        ││ ─────────────── │
│    klik tutup)   ││ 🏠 Dashboard    │
│                  ││ 📋 Quest Saya   │
│                  ││ ➕ Posting Quest│
│                  ││ 👤 Profil Saya  │
│                  ││ ─────────────── │
│                  ││ 🚪 Keluar       │
│                  ││                 │
└──────────────────┘└─────────────────┘
```

---

## Empty State

```
┌──────────────────────────────────────┐
│                                      │
│              📭                      │
│        Belum ada quest nih           │
│                                      │
│   Jadi yang pertama posting quest!   │
│                                      │
│   ╔══════════════════════════════╗  │
│   ║   + Posting Quest Baru       ║  │
│   ╚══════════════════════════════╝  │
│                                      │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **Token expired saat di dashboard:** Interceptor axios catch 401 → redirect `/login` dengan toast "Sesi habis"
- **User scroll cepat banget:** Debounce infinite scroll, jangan trigger berkali-kali
- **Filter return 0 quest:** Tampilkan EmptyState dengan context "Tidak ada quest [Transport] di range harga [Rp 1.000 - 5.000]"
- **Deadline sudah lewat:** Quest dengan deadline < now tetap tampil tapi di-mark "EXPIRED" atau di-hide (sesuai business logic)
- **Quest yang user ambil:** Bisa tetap tampil di feed dengan badge "Sudah kamu ambil" atau di-hide (prefer di-hide untuk avoid confusion)
- **Quest yang user post sendiri:** Tampilkan dengan badge "Quest kamu" atau di-hide (prefer di-hide, ada di My Quests)
- **Pull to refresh:** Swipe down untuk refresh feed (mobile UX)
- **Slow network:** Tampilkan skeleton, jangan block UI
