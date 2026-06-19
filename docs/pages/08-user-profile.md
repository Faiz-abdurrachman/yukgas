# 08. User Profile Page (Public)

## Route
`/users/:id`

## Purpose
Menampilkan profil publik user lain. User bisa melihat reputasi, statistik quest, QRIS code (untuk pembayaran), dan daftar rating/ulasan yang diterima user tersebut. Berguna untuk menilai kredibilitas sebelum mengambil/memberi quest.

## Access
- **Authenticated only** — redirect ke `/login` jika belum login
- **User must exist** — 404 page jika user tidak ditemukan

---

## UI Components

### 1. BackButton
- **Type:** Icon button (← arrow)
- **Position:** Top-left
- **Action:** Navigate ke page sebelumnya

### 2. ProfileHeader
- **Type:** Card section
- **Isi:**
  - Avatar (foto profil bulat, 80px, jika null tampilkan inisial nama dalam circle)
  - Nama lengkap (bold, font besar)
  - Email UNU (hanya domain visible, misal "@students.unu.ac.id" — privacy)
  - Bio (jika ada, text abu-abu)

### 3. StatsCard
- **Type:** Horizontal stat row (3 columns)
- **Isi:**
  - ⭐ **Rating:** "4.5" (dengan bintang di bawah)
  - 🎯 **Diberikan:** "15" quest
  - 💪 **Diambil:** "5" quest
- **Style:** Angka besar bold, label kecil di bawah

### 4. QRISCard (Opsional)
- **Type:** Card section
- **Condition:** Hanya muncul jika user memiliki `qrisUrl`
- **Isi:**
  - Label: "💸 Pembayaran QRIS"
  - QR code image (dari `qrisUrl`)
  - Helper text: "Scan QR di atas untuk pembayaran"
- **Action (opsional):** Button "Download QR" atau "Open full screen"

### 5. RatingList
- **Type:** List of rating cards
- **Header:** "⭐ Ulasan (20)"
- **Each RatingCard:**
  - Rater info: Avatar kecil + Nama rater (clickable → `/users/:raterId`)
  - Rating: ⭐⭐⭐⭐⭐ (bintang visual)
  - Review text (jika ada)
  - Quest reference: "Quest: [Judul]" (clickable → `/quests/:questId`)
  - Timestamp: "2 hari yang lalu"
- **Empty:** "Belum ada ulasan" (jika user belum punya rating)

### 6. LoadMore (Pagination)
- **Type:** Button atau infinite scroll
- **Behavior:** Load 5-10 rating per page

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Loading | Pertama buka page | Skeleton (avatar placeholder + stat blocks) |
| Not Found | Backend return 404 | "User tidak ditemukan" + button kembali |
| Error | Gagal fetch | "Gagal memuat profil" + retry |
| Loaded | Data berhasil di-fetch | Full profile + ratings |
| Loading Ratings | Scroll ke bawah | Skeleton card di bawah list |

---

## Data Needed

### API Call: GET `/api/v1/users/:id`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "fullName": "Hilman Al Hakim",
    "bio": "Mahasiswa Informatika UNU. Suka bantu-bantu teman.",
    "avatarUrl": null,
    "qrisUrl": "https://supabase.storage.../qris-hilman.png",
    "reputation": 4.8,
    "questsGiven": 3,
    "questsTaken": 12,
    "emailDomain": "@students.unu.ac.id"
  }
}
```

### API Call: GET `/api/v1/users/:id/ratings?page=1&limit=5`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "id": "uuid-rating",
        "score": 5,
        "review": "Gercep banget, recommended!",
        "createdAt": "2026-06-19T10:00:00Z",
        "rater": {
          "id": "uuid-rater",
          "fullName": "Faiz Abdurrachman",
          "avatarUrl": null
        },
        "quest": {
          "id": "uuid-quest",
          "title": "Beliin nasi goreng kantin A"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 12,
      "totalPages": 3
    }
  }
}
```

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/quests/:id` | `/users/:id` | Klik nama/avatar giver atau taker |
| `/users/:id` | `/quests/:questId` | Klik quest reference di rating |
| `/users/:id` | `/users/:raterId` | Klik nama rater di rating list |
| `/users/:id` | back | Klik back button |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  ←                                   │  ← BackButton
├──────────────────────────────────────┤
│                                      │
│           ┌──────┐                   │
│           │ (👤) │                   │  ← Avatar (80px)
│           └──────┘                   │
│        Hilman Al Hakim               │  ← Nama
│        @students.unu.ac.id           │  ← Email domain
│                                      │
│  "Mahasiswa Informatika UNU.        │  ← Bio
│   Suka bantu-bantu teman."           │
│                                      │
│  ┌──────────┬──────────┬──────────┐  │  ← StatsCard
│  │   ⭐ 4.8  │  🎯 3    │  💪 12   │  │
│  │  Rating  │ Diberikan│ Diambil  │  │
│  └──────────┴──────────┴──────────┘  │
│                                      │
│  ─── Pembayaran QRIS ───────────   │  ← QRISCard
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │       ┌──────────────┐         │  │
│  │       │              │         │  │
│  │       │  [QR CODE]   │         │  │
│  │       │              │         │  │
│  │       └──────────────┘         │  │
│  │   Scan untuk pembayaran        │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  ─── Ulasan (12) ────────────────  │  ← RatingList
│                                      │
│  ┌────────────────────────────────┐  │  ← RatingCard
│  │ (👤) Faiz Abdurrachman         │  │
│  │ ⭐⭐⭐⭐⭐                        │  │
│  │ "Gercep banget, recommended!"  │  │
│  │ Quest: Beliin nasi goreng     │  │
│  │ 2 hari yang lalu               │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ (👤) Esa Maulidia              │  │
│  │ ⭐⭐⭐⭐                         │  │
│  │ "Cepet dan amanah"             │  │
│  │ Quest: Antar barang ke lab    │  │
│  │ 5 hari yang lalu               │  │
│  └────────────────────────────────┘  │
│                                      │
│        Muat lebih banyak...          │
│                                      │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **User view profil sendiri:** Redirect ke `/profile` (My Profile page) atau tampilkan dengan button "Edit Profil"
- **User belum punya rating:** Tampilkan EmptyState "Belum ada ulasan. Selesaikan quest dulu untuk dapat rating!"
- **User belum set QRIS:** Sembunyikan QRISCard, atau tampilkan "User belum mengatur QRIS"
- **Avatar null:** Tampilkan inisial nama (misal "HA" untuk Hilman Al Hakim) dalam colored circle
- **Rating tanpa review text:** Tampilkan bintang doang tanpa kutipan text
- **Pagination:** Infinite scroll, load 5 rating per page
- **User deleted/deactivated:** 404 "User tidak ditemukan"
