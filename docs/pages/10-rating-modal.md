# 10. Rating Modal (Component)

## Route
Bukan page tersendiri, tapi **modal component** yang dipanggil dari Quest Detail Page (`/quests/:id`)

## Purpose
Modal untuk memberi rating bintang (1-5) dan ulasan teks (opsional) setelah quest selesai dan pembayaran dikonfirmasi. Giver memberi rating ke Taker, Taker memberi rating ke Giver.

## Access
- **Authenticated only**
- **Trigger:** Hanya muncul jika:
  - Status quest = `COMPLETED`
  - `paymentConfirmed = true`
  - User belum memberi rating (`hasRated = false`)
  - User adalah giver atau taker dari quest tersebut

---

## Trigger Conditions (Detail)

| Role | Kapan Modal Bisa Muncul |
|---|---|
| **Giver** | Status COMPLETED + paymentConfirmed=true + giver belum rating taker |
| **Taker** | Status COMPLETED + paymentConfirmed=true + taker belum rating giver |

Modal bisa muncul dalam 2 cara:
1. **User klik button "Beri Rating"** di Quest Detail Page
2. **Auto-prompt** setelah konfirmasi pembayaran (opsional, UX decision)

---

## UI Components

### 1. ModalOverlay
- **Type:** Full-screen overlay (background gelap, opacity 50%)
- **Behavior:** Click di area overlay (di luar modal content) → close modal

### 2. ModalContent
- **Type:** Card dialog (centered, max-width 400px, rounded corners)
- **Isi:** Header, ratee info, star input, review input, action buttons

### 3. Header
- **Type:** Text block
- **Isi:**
  - Close button (✕) di pojok kanan atas
  - Title: "⭐ Beri Penilaian"

### 4. RateeInfo
- **Type:** Horizontal card
- **Isi:**
  - Avatar orang yang akan dirating (bulat, 48px)
  - Nama lengkap
  - Label role: "Sebagai Quest Taker" atau "Sebagai Quest Giver"
  - Quest reference: "untuk quest: [Judul Quest]"

### 5. StarInput
- **Type:** Interactive star rating (5 bintang)
- **Behavior:**
  - Default: 5 bintang kosong (outline)
  - Hover: Preview bintang yang akan dipilih (fill saat hover)
  - Click: Set rating value (1-5)
  - Visual: Bintang terisi warna kuning/emas, yang kosong outline abu-abu
- **Label per rating:**
  - ⭐ (1): "Sangat Buruk"
  - ⭐⭐ (2): "Buruk"
  - ⭐⭐⭐ (3): "Cukup"
  - ⭐⭐⭐⭐ (4): "Baik"
  - ⭐⭐⭐⭐⭐ (5): "Sangat Baik"
- **Validasi:** Required (min 1 bintang)

### 6. ReviewInput
- **Type:** TextArea (multiline)
- **Placeholder:** "Bagikan pengalamanmu... (opsional)"
- **Validasi:**
  - Opsional (boleh kosong)
  - Max 300 karakter jika diisi
- **Helper:** Character counter "0/300"

### 7. SubmitButton
- **Type:** Primary button (full width)
- **Label:** "Kirim Penilaian"
- **State:**
  - Idle: "Kirim Penilaian"
  - Disabled: jika belum pilih bintang
  - Loading: spinner + "Mengirim..."
- **Action:** POST `/api/v1/quests/:id/rate`

### 8. SkipButton (Opsional)
- **Type:** Text link (abu-abu, kecil)
- **Label:** "Lewati untuk sekarang"
- **Action:** Close modal tanpa submit (user bisa rate nanti)

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Open | User klik "Beri Rating" | Modal muncul dengan animasi slide-up/fade-in |
| Selecting Star | User hover/click bintang | Bintang terisi, label update |
| Typing Review | User ketik di textarea | Character counter update |
| Submitting | User klik "Kirim Penilaian" | Button spinner, semua input disabled |
| Error - Already Rated | Backend return 409 | Toast "Kamu sudah memberi rating" → close modal |
| Error - Network | Request gagal | Toast "Gagal mengirim. Coba lagi." (modal tetap terbuka) |
| Success | Backend return 201 | Toast hijau "Terima kasih atas penilaianmu!" → close modal → re-render Quest Detail |

---

## Data Needed

### API Call: POST `/api/v1/quests/:id/rate`

**Request Body:**
```json
{
  "score": 5,
  "review": "Gercep banget, recommended! Fast response dan amanah."
}
```

**Response 201 (Success):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-rating",
    "score": 5,
    "review": "Gercep banget, recommended!",
    "createdAt": "2026-06-20T15:00:00Z"
  }
}
```

**Response 400 (Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Score harus antara 1-5"
  }
}
```

**Response 403 (Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Quest belum selesai atau pembayaran belum dikonfirmasi"
  }
}
```

**Response 409 (Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_RATED",
    "message": "Kamu sudah memberi rating untuk quest ini"
  }
}
```

---

## Backend Side Effects (Post-Rating)
Setelah rating berhasil disimpan, backend harus:
1. **Insert ke tabel `ratings`** dengan `raterId`, `ratedId`, `questId`, `score`, `review`
2. **Recalculate reputation** user yang dirating:
   - Query semua rating yang `ratedId = [user yang dirating]`
   - Hitung rata-rata `score`
   - Update kolom `reputation` di tabel `users`
3. **Update `hasRated` flag** (atau check via query) supaya user gak bisa rating 2x

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| Quest Detail Page | Modal terbuka | Klik "Beri Rating" |
| Modal | Quest Detail Page (re-rendered) | Sukses submit atau close modal |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  (overlay gelap, klik tutup)         │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                        ✕       │  │  ← Close button
│  │                                │  │
│  │     ⭐ Beri Penilaian          │  │  ← Header
│  │                                │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │ (👤) Hilman Al Hakim     │  │  │  ← RateeInfo
│  │  │ Sebagai Quest Taker       │  │  │
│  │  │ untuk: Beliin nasi goreng│  │  │
│  │  └──────────────────────────┘  │  │
│  │                                │  │
│  │  Bagaimana pengalamanmu?       │  │
│  │                                │  │
│  │      ★ ★ ★ ★ ★                │  │  ← StarInput (interaktif)
│  │      (klik untuk pilih)        │  │
│  │                                │  │
│  │      Sangat Baik               │  │  ← Label dynamic
│  │                                │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │ Bagikan pengalamanmu...  │  │  │  ← ReviewInput
│  │  │ (opsional)               │  │  │
│  │  │                          │  │  │
│  │  │ 0/300 karakter           │  │  │
│  │  └──────────────────────────┘  │  │
│  │                                │  │
│  │  ╔══════════════════════════╗ │  │
│  │  ║   Kirim Penilaian         ║ │  │  ← SubmitButton
│  │  ╚══════════════════════════╝ │  │
│  │                                │  │
│  │     Lewati untuk sekarang      │  │  ← SkipButton
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## Interaction States (Star Input Detail)

### Default (belum pilih)
```
      ☆ ☆ ☆ ☆ ☆      ← semua kosong (outline)
      (klik untuk pilih)
```

### Hover di bintang ke-3
```
      ★ ★ ★ ☆ ☆      ← 3 bintang terisi (hover preview)
      Cukup
```

### Click bintang ke-4 (selected)
```
      ★ ★ ★ ★ ☆      ← 4 bintang terisi permanen
      Baik
```

### Hover di bintang ke-2 (setelah select 4)
```
      ★ ★ ☆ ☆ ☆      ← preview 2 (tapi selected tetap 4 saat mouse leave)
      Buruk
```

### Mouse leave (kembali ke selected)
```
      ★ ★ ★ ★ ☆      ← kembali ke 4 (selected value)
      Baik
```

---

## Edge Cases
- **User coba buka modal padahal belum completed/payment:** Button "Beri Rating" tidak muncul di Quest Detail (di-hide)
- **User coba rate 2x:** Backend return 409, modal close dengan toast "Sudah memberi rating"
- **User close modal tanpa submit:** Data hilang (tidak disimpan draft), user harus buka ulang
- **User skip rating:** Quest tetap bisa dianggap selesai, tapi reputation user tidak ter-update (karena gak ada rating baru)
- **Rating tanpa review:** Valid, `review` boleh null di backend
- **Auto-prompt setelah payment confirm:** Setelah giver konfirmasi pembayaran, auto-open modal "Beri rating ke [Taker]?" (UX decision — bisa ganggu jika user belum siap)
- **Reputation recalculation:** Backend harus transactional — insert rating + update reputation dalam satu transaction
