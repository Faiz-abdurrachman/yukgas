# 07. My Quests Page

## Route
`/my-quests`

## Purpose
Menampilkan daftar quest yang berkaitan dengan user — quest yang dia posting (sebagai Giver) dan quest yang dia ambil (sebagai Taker). Dipisah dalam 2 tab untuk navigasi mudah.

## Access
- **Authenticated only** — redirect ke `/login` jika belum login

---

## UI Components

### 1. BackButton
- **Type:** Icon button (← arrow)
- **Position:** Top-left
- **Action:** Navigate ke `/dashboard`

### 2. Header
- **Type:** Text block
- **Isi:** Title "Quest Saya"

### 3. TabBar
- **Type:** Segmented control / tab bar (2 tabs)
- **Tabs:**
  - **Tab 1:** "🎯 Diberikan" — Quest yang user posting (sebagai Giver)
  - **Tab 2:** "💪 Diambil" — Quest yang user ambil (sebagai Taker)
- **Behavior:**
  - Active tab: underline atau background highlight
  - Click tab → switch content, fetch data sesuai tab
  - Badge count (opsional): jumlah quest per tab di pojok kanan tab

### 4. FilterChip (Opsional per tab)
- **Type:** Dropdown filter
- **Isi:** Filter by status
  - Tab "Diberikan": Semua, Open, Taken, In Progress, Completed, Cancelled
  - Tab "Diambil": Semua, Taken, In Progress, Completed

### 5. QuestListItem
- **Type:** Compact card (lebih simple dari QuestCard di dashboard)
- **Props:** `{ id, title, status, compensation, deadline, counterpartName, counterpartRating }`
- **Isi:**
  - **Row 1:** StatusBadge (kecil) + Kompensasi (kanan)
  - **Row 2:** Judul quest (bold, truncate)
  - **Row 3:** Info counterpart:
    - Tab "Diberikan": "👤 Taker: [Nama]" atau "Belum diambil" (jika OPEN)
    - Tab "Diambil": "👤 Giver: [Nama]"
  - **Row 4:** ⏰ Deadline relative (kanan)
- **Action:** Click → navigate ke `/quests/:id`

### 6. EmptyState (per tab)
- **Tab "Diberikan" Empty:**
  ```
  📭
  Belum ada quest yang kamu posting
  + Posting Quest Baru
  ```
- **Tab "Diambil" Empty:**
  ```
  📭
  Belum ada quest yang kamu ambil
  Cari Quest di Feed
  ```

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Loading | Switch tab / pertama buka | Skeleton list 3-4 item |
| Populated | Data berhasil di-fetch | List of QuestListItem |
| Empty (Diberikan) | User belum pernah posting | EmptyState Diberikan + CTA ke create |
| Empty (Diambil) | User belum pernah ambil | EmptyState Diambil + CTA ke dashboard |
| Error | Gagal fetch | ErrorState "Gagal memuat" + retry |

---

## Data Needed

### API Call (Tab Diberikan): GET `/api/v1/quests/my/given`

**Query:** `?status=&page=&limit=`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "quests": [
      {
        "id": "uuid-xxx",
        "title": "Jemput barang di pos satpam",
        "status": "TAKEN",
        "compensation": 5000,
        "deadline": "2026-06-20T14:00:00Z",
        "category": "TRANSPORT",
        "taker": {
          "id": "uuid-taker",
          "fullName": "Hilman Al Hakim",
          "reputation": 4.8
        }
      }
    ]
  }
}
```

### API Call (Tab Diambil): GET `/api/v1/quests/my/taken`

**Response:** Sama format, tapi `taker` ganti `giver`

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/dashboard` | `/my-quests` | Klik menu "Quest Saya" atau BottomNav "QuestKu" |
| `/my-quests` | `/quests/:id` | Klik QuestListItem |
| `/my-quests` | `/quests/create` | Klik CTA "Posting Quest Baru" (dari empty state Diberikan) |
| `/my-quests` | `/dashboard` | Klik back atau CTA "Cari Quest di Feed" (dari empty state Diambil) |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  ← Quest Saya                        │  ← Header
├──────────────────────────────────────┤
│  ┌──────────────┬──────────────┐     │
│  │ 🎯 Diberikan │ 💪 Diambil   │     │  ← TabBar
│  │   (active)   │              │     │
│  └──────────────┴──────────────┘     │
│  [Semua Status ▼]                    │  ← FilterChip
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │  ← QuestListItem
│  │ 🟢 OPEN               Rp 2.000 │  │
│  │ Print dokumen 5 lembar         │  │
│  │ 👤 Belum diambil               │  │
│  │                    ⏰ 4 jam    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🔵 TAKEN             Rp 5.000  │  │
│  │ Jemput barang di pos satpam    │  │
│  │ 👤 Hilman Al Hakim  ⭐ 4.8     │  │
│  │                    ⏰ 2 jam    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🟣 COMPLETED          Rp 10.000│  │
│  │ Beliin nasi goreng kantin A    │  │
│  │ 👤 Esa Maulidia     ⭐ 4.2     │  │
│  │                    ⏰ selesai  │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

### Tab "Diambil" view:

```
┌──────────────────────────────────────┐
│  ┌──────────────┬──────────────┐     │
│  │ 🎯 Diberikan │ 💪 Diambil   │     │
│  │              │   (active)   │     │
│  └──────────────┴──────────────┘     │
│  [Semua Status ▼]                    │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🟡 IN PROGRESS        Rp 8.000 │  │
│  │ Bantu belajar PBW             │  │
│  │ 👤 Imroatu Zakiyah  ⭐ 4.6     │  │
│  │                    ⏰ besok    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🟣 COMPLETED          Rp 3.000 │  │
│  │ Antar barang ke lab           │  │
│  │ 👤 Faiz Abdurrachman ⭐ 4.5    │  │
│  │                    ⏰ selesai  │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **User switch tab cepat:** Cancel request sebelumnya, hanya tampilkan response tab terakhir yang aktif (race condition)
- **Quest diambil/diselesaikan orang lain saat user lihat list:** Data stale, perlu refresh (pull-to-refresh atau auto-refetch saat tab active)
- **Pagination:** Jika user punya banyak quest (>10), infinite scroll atau "Muat lebih banyak"
- **Status filter:** Jika filter return kosong, tampilkan "Tidak ada quest dengan status [X]"
