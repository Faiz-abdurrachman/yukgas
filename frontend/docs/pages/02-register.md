# 02. Register Page

## Route
`/register`

## Purpose
Form pendaftaran akun baru. Hanya menerima email dengan domain UNU (@unu.ac.id atau @students.unu.ac.id). Setelah sukses, redirect ke login page.

## Access
- **Public** — tidak perlu login
- Redirect ke `/dashboard` jika user sudah login

---

## UI Components

### 1. BackButton
- **Type:** Icon button (← arrow)
- **Position:** Top-left
- **Action:** Navigate ke `/` (landing)

### 2. Header
- **Type:** Text block
- **Isi:**
  - Title: "Buat Akun Baru"
  - Subtitle: "Daftar dengan email UNU untuk mulai"

### 3. RegisterForm
- **Type:** Form dengan multiple inputs

#### Field: Nama Lengkap
- **Type:** TextInput
- **Placeholder:** "Masukkan nama lengkap"
- **Validasi:**
  - Required
  - Min 3 karakter
  - Max 50 karakter
  - Hanya huruf dan spasi
- **Error message:** "Nama minimal 3 karakter"

#### Field: Email UNU
- **Type:** EmailInput
- **Placeholder:** "nama@unu.ac.id"
- **Validasi:**
  - Required
  - Format email valid
  - **Harus berakhir dengan** `@unu.ac.id` atau `@students.unu.ac.id`
- **Helper text:** "Hanya email institusi UNU yang diperbolehkan"
- **Error message:** "Email harus menggunakan domain UNU (@unu.ac.id)"

#### Field: Password
- **Type:** PasswordInput (with show/hide toggle 👁)
- **Placeholder:** "••••••••"
- **Validasi:**
  - Required
  - Min 8 karakter
  - Harus mengandung minimal 1 huruf DAN 1 angka
- **Helper text:** "Min. 8 karakter, kombinasi huruf dan angka"
- **Error message:** "Password minimal 8 karakter dengan huruf dan angka"

#### Field: Konfirmasi Password
- **Type:** PasswordInput (with show/hide toggle 👁)
- **Placeholder:** "••••••••"
- **Validasi:**
  - Required
  - **Harus sama** dengan field Password
- **Error message:** "Konfirmasi password tidak cocok"

### 4. SubmitButton
- **Type:** Primary button (full width)
- **Label:** "Daftar"
- **State:**
  - Idle: "Daftar"
  - Loading: spinner + "Mendaftarkan..."
  - Disabled: jika ada field yang invalid
- **Action:** POST `/api/v1/auth/register`

### 5. LoginLink
- **Type:** Text link
- **Isi:** "Sudah punya akun? Masuk di sini"
- **Action:** Navigate ke `/login`

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Idle | Halaman pertama dibuka | Form kosong, button "Daftar" |
| Validating | User blur dari field | Error message muncul di bawah field jika invalid |
| Submitting | User klik "Daftar", request dikirim | Button jadi spinner, semua field disabled |
| Error - Email Exists | Backend return 400 EMAIL_EXISTS | Toast/snackbar merah: "Email sudah terdaftar" |
| Error - Invalid Domain | Backend return 400 INVALID_DOMAIN | Error di field email: "Domain tidak valid" |
| Error - Network | Request gagal | Toast: "Gagal terhubung ke server. Coba lagi." |
| Success | Backend return 201 | Toast hijau: "Akun berhasil dibuat!" → redirect `/login` setelah 2 detik |

---

## Data Needed

### API Call: POST `/api/v1/auth/register`

**Request Body:**
```json
{
  "fullName": "Faiz Abdurrachman",
  "email": "faiz@students.unu.ac.id",
  "password": "password123"
}
```

**Response 201 (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "email": "faiz@students.unu.ac.id",
      "fullName": "Faiz Abdurrachman"
    }
  }
}
```

**Response 400 (Error):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email sudah terdaftar"
  }
}
```

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/` (landing) | `/register` | Klik "Daftar" |
| `/register` | `/login` | Sukses register (auto-redirect) |
| `/register` | `/login` | Klik "Sudah punya akun?" |
| `/register` | `/` | Klik back button |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  ←                                   │
├──────────────────────────────────────┤
│                                      │
│         Buat Akun Baru               │
│   Daftar dengan email UNU untuk      │
│   mulai menggunakan YUKgas.in        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Nama Lengkap                   │  │
│  │ Faiz Abdurrachman              │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Email UNU                      │  │
│  │ faiz@students.unu.ac.id        │  │
│  └────────────────────────────────┘  │
│  Hanya email @unu.ac.id yang        │
│  diperbolehkan                       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Password                 👁    │  │
│  │ ••••••••                       │  │
│  └────────────────────────────────┘  │
│  Min. 8 karakter, huruf & angka     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Konfirmasi Password     👁     │  │
│  │ ••••••••                       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ╔══════════════════════════════╗  │
│  ║          Daftar              ║  │
│  ╚══════════════════════════════╝  │
│                                      │
│  Sudah punya akun? Masuk di sini    │
│                                      │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **Email domain lain (gmail, yahoo):** Tolak dengan error "Domain tidak valid"
- **Password lemah (huruf doang):** Tolak, minta kombinasi huruf + angka
- **Konfirmasi password beda:** Highlight kedua field merah
- **User submit berkali-kali:** Disable button setelah klik (prevent double submit)
- **Network timeout:** Retry button atau auto-retry setelah 3 detik
- **User sudah login akses /register:** Redirect ke `/dashboard`
