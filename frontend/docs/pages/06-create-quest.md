# 06. Create Quest Page

## Route
`/quests/create`

## Purpose
Form untuk memposting quest baru. User mengisi detail quest (judul, kategori, deskripsi, lokasi, deadline, kompensasi) dan melihat preview real-time sebelum submit.

## Access
- **Authenticated only** — redirect ke `/login` jika belum login

---

## UI Components

### 1. CloseButton
- **Type:** Icon button (✕)
- **Position:** Top-right
- **Action:** Navigate ke `/dashboard` (dengan konfirmasi jika form sudah diisi: "Yakin batal posting quest?")

### 2. Header
- **Type:** Text block
- **Isi:** Title "Posting Quest Baru", subtitle "Isi detail quest di bawah ini"

### 3. QuestForm
- **Type:** Form dengan multiple inputs

#### Field: Judul Quest
- **Type:** TextInput (single line)
- **Placeholder:** "Misal: Beliin nasi goreng kantin A"
- **Validasi:**
  - Required
  - Min 10 karakter
  - Max 100 karakter
- **Helper:** Character counter "0/100"
- **Error:** "Judul minimal 10 karakter"

#### Field: Kategori
- **Type:** SelectDropdown / Radio cards
- **Options:**
  - 🚗 Transportasi
  - 🍔 Makanan & Belanja
  - 📄 Administrasi
  - 📦 Lainnya
- **Validasi:** Required
- **Error:** "Pilih kategori quest"

#### Field: Deskripsi
- **Type:** TextArea (multiline)
- **Placeholder:** "Jelaskan detail quest. Misal: Beliin nasi goreng spesial 1 porsi, level 3, tanpa terasi."
- **Validasi:**
  - Required
  - Min 20 karakter
  - Max 500 karakter
- **Helper:** Character counter "0/500"
- **Error:** "Deskripsi minimal 20 karakter"

#### Field: Lokasi
- **Type:** TextInput
- **Placeholder:** "Misal: Kantin A, Gedung FTI Lt. 2"
- **Validasi:**
  - Required
  - Max 200 karakter
- **Error:** "Lokasi wajib diisi"

#### Field: Deadline
- **Type:** DateTimePicker (native HTML atau library seperti react-datetime)
- **Placeholder:** "Pilih tanggal dan waktu"
- **Validasi:**
  - Required
  - **Harus di masa depan** (min = now + 1 jam)
- **Error:** "Deadline minimal 1 jam dari sekarang"

#### Field: Kompensasi
- **Type:** NumberInput dengan prefix "Rp"
- **Placeholder:** "5000"
- **Validasi:**
  - Required
  - Min Rp 1.000
  - Max Rp 100.000 (opsional, sesuaikan)
  - Hanya angka
- **Helper:** "Min. Rp 1.000"
- **Error:** "Kompensasi minimal Rp 1.000"

### 4. LivePreviewCard
- **Type:** QuestCard component (sama dengan di dashboard)
- **Behavior:** Update real-time saat user mengisi form
- **Isi:** Render preview dengan data form saat ini:
  - Category badge (dari field kategori)
  - Title (dari field judul)
  - Description (dari field deskripsi, truncate 2 baris)
  - Location (dari field lokasi)
  - Deadline relative (dari field deadline)
  - Compensation (dari field kompensasi, format "Rp X.XXX")
  - Giver info (dari user yang sedang login)

### 5. SubmitButton
- **Type:** Primary button (full width, sticky bottom)
- **Label:** "Posting Quest"
- **State:**
  - Idle: "Posting Quest"
  - Loading: spinner + "Memposting..."
  - Disabled: jika ada field invalid atau belum diisi semua
- **Action:** POST `/api/v1/quests`

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Idle | Halaman pertama dibuka | Form kosong, preview kosong/placeholder |
| Typing | User mengisi field | Preview update real-time |
| Validation Error | User blur dari field invalid | Error message merah di bawah field |
| Submitting | User klik "Posting Quest" | Button spinner, semua field disabled |
| Error - Validation | Backend return 400 VALIDATION_ERROR | Toast error + highlight field bermasalah |
| Error - Network | Request gagal | Toast "Gagal terhubung. Coba lagi." |
| Success | Backend return 201 | Toast "Quest berhasil diposting!" → redirect `/quests/:id` |

---

## Data Needed

### API Call: POST `/api/v1/quests`

**Request Body:**
```json
{
  "title": "Beliin nasi goreng kantin A",
  "category": "FOOD",
  "description": "Beliin nasi goreng spesial 1 porsi, level 3, tanpa terasi. Uangnya nanti aku kasih cash.",
  "location": "Kantin A, Gedung FTI Lt. 1",
  "deadline": "2026-06-20T12:30:00Z",
  "compensation": 10000
}
```

**Response 201 (Success):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-new-quest",
    "title": "Beliin nasi goreng kantin A",
    "status": "OPEN",
    ...
  }
}
```

**Response 400 (Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data tidak valid",
    "details": [
      { "field": "compensation", "message": "Kompensasi minimal Rp 1.000" }
    ]
  }
}
```

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/dashboard` | `/quests/create` | Klik FAB (+) atau menu "Posting Quest" |
| `/quests/create` | `/quests/:id` | Sukses posting (auto-redirect) |
| `/quests/create` | `/dashboard` | Klik ✕ (close) atau back |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  Posting Quest Baru              ✕   │  ← Header + CloseButton
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Judul Quest                    │  │
│  │ Beliin nasi goreng kantin A|   │  │  ← TextInput
│  └────────────────────────────────┘  │
│  28/100 karakter                    │  ← Character counter
│                                      │
│  Kategori                            │
│  ┌──────────┐ ┌──────────┐          │  ← Radio cards (2x2 grid)
│  │ 🚗       │ │ 🍔 ✓     │          │
│  │ Transport│ │ Makanan  │          │
│  └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐          │
│  │ 📄       │ │ 📦       │          │
│  │ Admin    │ │ Lainnya  │          │
│  └──────────┘ └──────────┘          │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Deskripsi                      │  │
│  │ Beliin nasi goreng spesial 1  │  │  ← TextArea
│  │ porsi, level 3, tanpa terasi. │  │
│  │ Uangnya nanti aku kasih cash. │  │
│  └────────────────────────────────┘  │
│  76/500 karakter                    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📍 Lokasi                      │  │
│  │ Kantin A, Gedung FTI Lt. 1     │  │  ← TextInput
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ⏰ Deadline                    │  │
│  │ 20 Jun 2026 │ 12:30          ▼ │  │  ← DateTimePicker
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 💰 Kompensasi                  │  │
│  │ Rp │ 10.000                    │  │  ← NumberInput
│  └────────────────────────────────┘  │
│  Min. Rp 1.000                      │
│                                      │
│  ─── Preview ────────────────────  │
│                                      │
│  ┌────────────────────────────────┐  │  ← LivePreviewCard
│  │ 🍔 Makanan          Rp 10.000  │  │
│  │ Beliin nasi goreng kantin A    │  │
│  │ Beliin nasi goreng spesial...  │  │
│  │ 📍 Kantin A     ⏰ 2 jam lagi  │  │
│  │ (👤) Faiz A.       ⭐ 4.5      │  │
│  └────────────────────────────────┘  │
│                                      │
│  ╔══════════════════════════════╗  │
│  ║       Posting Quest           ║  │  ← SubmitButton (sticky bottom)
│  ╚══════════════════════════════╝  │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **User close dengan form sudah terisi:** Konfirmasi dialog "Yakin batal? Data yang diisi akan hilang"
- **Deadline di masa lalu:** Validasi reject, minta min 1 jam dari sekarang
- **Kompensasi 0 atau negatif:** Validasi reject, min Rp 1.000
- **User submit berkali-kali:** Disable button setelah klik
- **Network timeout saat submit:** Retry button, jangan clear form
- **Token expired saat submit:** Interceptor catch 401 → redirect login, simpan draft form (opsional)
- **Field sangat panjang:** Truncate di preview, full text di backend
- **Draft save (opsional nice-to-have):** Auto-save ke localStorage setiap 30 detik
