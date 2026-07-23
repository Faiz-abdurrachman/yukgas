# 09. My Profile / Settings Page

## Route
`/profile`

## Purpose
Halaman profil user yang sedang login. Bisa edit info pribadi (nama, bio, foto profil), upload QRIS code untuk pembayaran, melihat statistik, dan logout. Berbeda dengan User Profile (public) — ini punya kemampuan edit.

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
- **Isi:** Title "Profil Saya"

### 3. ProfileHeader (Read-only display)
- **Type:** Card section
- **Isi:**
  - Avatar (foto profil bulat, 80px)
  - Nama lengkap
  - Email UNU (full email, karena ini profil sendiri)
  - Stats:
    - ⭐ Rating: "4.5"
    - 🎯 Diberikan: "15"
    - 💪 Diambil: "5"

### 4. EditForm
- **Type:** Form section
- **Fields:**

#### Field: Foto Profil
- **Type:** Image upload (click to change)
- **Behavior:**
  - Click avatar → open file picker
  - Preview sebelum upload
  - Accept: image/jpeg, image/png
  - Max size: 2MB
  - Upload ke Supabase Storage, dapat URL
- **Action:** Auto-save saat dipilih, atau save saat klik "Simpan"

#### Field: Nama Lengkap
- **Type:** TextInput
- **Validasi:** Min 3 karakter, max 50 karakter
- **Prefilled:** Nama user saat ini

#### Field: Bio
- **Type:** TextArea (multiline)
- **Placeholder:** "Ceritakan sedikit tentang dirimu..."
- **Validasi:** Max 200 karakter
- **Helper:** Character counter "0/200"
- **Prefilled:** Bio user saat ini (atau kosong)

#### Field: QRIS Code
- **Type:** Image upload (sama dengan foto profil)
- **Label:** "💸 QRIS Code untuk Pembayaran"
- **Helper:** "Upload QRIS pribadi kamu. Quest giver akan scan ini untuk bayar."
- **Preview:** Tampilkan QR code yang sudah di-upload (jika ada)
- **Remove button:** "Hapus QRIS" (opsional)

### 5. SaveButton
- **Type:** Primary button (full width)
- **Label:** "Simpan Perubahan"
- **State:**
  - Idle: "Simpan Perubahan"
  - Loading: spinner + "Menyimpan..."
  - Disabled: jika tidak ada perubahan
- **Action:** PUT `/api/v1/profile`

### 6. LogoutButton
- **Type:** Secondary/Danger button (full width, outline red)
- **Label:** "🚪 Keluar"
- **Action:**
  - Konfirmasi dialog: "Yakin ingin keluar?"
  - Clear token dari storage
  - Clear user state
  - Redirect ke `/login`

### 7. AppInfo (Opsional)
- **Type:** Text block kecil di bawah
- **Isi:**
  - "YUKgas.in v1.0.0"
  - "Tim: Nicky, Hilman, Faiz, Esa, Imroatu, Aldo"
  - "© 2026 UNU Yogyakarta"

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Loading | Pertama buka page, fetch profile | Skeleton layout |
| Loaded | Data berhasil di-fetch | Form prefilled dengan data user |
| Editing | User ubah field | SaveButton enable, badge "Belum disimpan" |
| Uploading Image | User pilih foto/QRIS | Progress bar atau spinner di avatar/QRIS |
| Saving | User klik "Simpan" | Button spinner, field disabled |
| Save Success | Backend return 200 | Toast hijau "Profil berhasil diperbarui" |
| Save Error | Backend return 400/500 | Toast merah "Gagal menyimpan. Coba lagi." |
| Logout Confirm | User klik "Keluar" | Modal konfirmasi |

---

## Data Needed

### API Call: GET `/api/v1/auth/me` (untuk initial data)
**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "fullName": "Faiz Abdurrachman",
      "email": "faiz@students.unu.ac.id",
      "bio": "Backend dev. Suka ngoding.",
      "avatarUrl": null,
      "qrisUrl": null,
      "reputation": 4.5,
      "questsGiven": 15,
      "questsTaken": 5
    }
  }
}
```

### API Call: PUT `/api/v1/profile` (untuk save)
**Request Body:**
```json
{
  "fullName": "Faiz Abdurrachman",
  "bio": "Backend dev. Suka ngoding dan kopi.",
  "avatarUrl": "https://supabase.storage.../avatar-faiz.png",
  "qrisUrl": "https://supabase.storage.../qris-faiz.png"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "fullName": "Faiz Abdurrachman",
      ...
    }
  }
}
```

### API Call: Image Upload (Supabase Storage)
- Upload file ke bucket `avatars` atau `qris`
- Dapatkan public URL
- Set URL ke field yang sesuai sebelum PUT profile

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/dashboard` | `/profile` | Klik menu "Profil Saya" atau avatar |
| `/profile` | `/dashboard` | Klik back button |
| `/profile` | `/login` | Klik "Keluar" (logout) |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  ← Profil Saya                       │  ← Header
├──────────────────────────────────────┤
│                                      │
│           ┌──────┐                   │
│           │ (👤) │  📷              │  ← Avatar + edit icon
│           └──────┘                   │
│        Faiz Abdurrachman             │
│        faiz@students.unu.ac.id       │
│                                      │
│  ┌──────────┬──────────┬──────────┐  │  ← StatsCard
│  │   ⭐ 4.5  │  🎯 15   │  💪 5    │  │
│  │  Rating  │ Diberikan│ Diambil  │  │
│  └──────────┴──────────┴──────────┘  │
│                                      │
│  ─── Edit Profil ────────────────  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Nama Lengkap                   │  │
│  │ Faiz Abdurrachman              │  │  ← TextInput
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Bio                             │  │
│  │ Backend dev. Suka ngoding.     │  │  ← TextArea
│  │ 30/200 karakter                │  │
│  └────────────────────────────────┘  │
│                                      │
│  ─── QRIS Code ──────────────────  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     ┌──────────────┐           │  │
│  │     │              │  📷      │  │  ← QRIS upload area
│  │     │  [QR CODE]   │           │  │
│  │     │  (atau kosong)│          │  │
│  │     └──────────────┘           │  │
│  │ Upload QRIS untuk pembayaran   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ╔══════════════════════════════╗  │
│  ║    Simpan Perubahan           ║  │  ← SaveButton
│  ╚══════════════════════════════╝  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │         🚪 Keluar              │  │  ← LogoutButton (danger)
│  └────────────────────────────────┘  │
│                                      │
│  ─────────────────────────────────  │
│  YUKgas.in v1.0.0                   │  ← AppInfo
│  © 2026 UNU Yogyakarta              │
└──────────────────────────────────────┘
```

---

## Logout Confirmation Modal

```
┌──────────────────────────────────────┐
│  (overlay gelap)                     │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │       🚪 Keluar?               │  │
│  │                                │  │
│  │   Yakin ingin keluar dari      │  │
│  │   akun kamu?                   │  │
│  │                                │  │
│  │  ╔═══════════╗  ╔═══════════╗ │  │
│  │  ║  Batal     ║  ║  Keluar   ║ │  │
│  │  ╚══���════════╝  ╚═══════════╝ │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **Image upload gagal:** Toast error "Gagal upload gambar. Coba lagi." Form tetap bisa save field lain
- **Image terlalu besar (>2MB):** Reject sebelum upload, toast "Ukuran gambar maksimal 2MB"
- **Image format tidak didukung:** Reject, toast "Format harus JPG atau PNG"
- **User save tanpa perubahan:** SaveButton disabled atau tidak ada action
- **Network timeout saat save:** Retry button, jangan clear form
- **User logout saat ada perubahan belum disimpan:** Konfirmasi "Ada perubahan belum disimpan. Yakin keluar?"
- **Email tidak bisa diedit:** Email read-only (karena terkait autentikasi), hanya nama/bio/QRIS/avatar yang bisa edit
