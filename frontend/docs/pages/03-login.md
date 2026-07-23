# 03. Login Page

## Route
`/login`

## Purpose
Form login untuk user yang sudah terdaftar. Setelah sukses, redirect ke dashboard. User harus menggunakan email UNU yang sudah terdaftar.

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
- **Type:** Text block + logo
- **Isi:**
  - Logo: 🚀
  - Title: "Masuk ke YUKgas.in"
  - Subtitle: "Selamat datang kembali!"

### 3. LoginForm
- **Type:** Form dengan 2 inputs

#### Field: Email UNU
- **Type:** EmailInput
- **Placeholder:** "nama@unu.ac.id"
- **Validasi:**
  - Required
  - Format email valid
- **Autofocus:** Yes (cursor langsung di sini saat buka page)
- **Error message:** "Email tidak valid"

#### Field: Password
- **Type:** PasswordInput (with show/hide toggle 👁)
- **Placeholder:** "••••••••"
- **Validasi:**
  - Required
  - Min 1 karakter (validasi detail di backend)
- **Error message:** "Password wajib diisi"

### 4. SubmitButton
- **Type:** Primary button (full width)
- **Label:** "Masuk"
- **State:**
  - Idle: "Masuk"
  - Loading: spinner + "Memproses..."
  - Disabled: jika email atau password kosong
- **Action:** POST `/api/v1/auth/login`

### 5. RegisterLink
- **Type:** Text link
- **Isi:** "Belum punya akun? Daftar di sini"
- **Action:** Navigate ke `/register`

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Idle | Halaman pertama dibuka | Form kosong, autofocus di email |
| Submitting | User klik "Masuk" | Button jadi spinner, field disabled |
| Error - Invalid Credentials | Backend return 401 | Snackbar merah: "Email atau password salah" |
| Error - Network | Request gagal | Snackbar: "Gagal terhubung. Coba lagi." |
| Success | Backend return 200 + token | Simpan token → redirect `/dashboard` |

---

## Data Needed

### API Call: POST `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "faiz@students.unu.ac.id",
  "password": "password123"
}
```

**Response 200 (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "email": "faiz@students.unu.ac.id",
      "fullName": "Faiz Abdurrachman",
      "reputation": 4.5,
      "questsGiven": 15,
      "questsTaken": 5
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response 401 (Error):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email atau password salah"
  }
}
```

---

## Post-Login Actions (Client Side)
Setelah dapat token dari response:
1. **Simpan token** di localStorage atau httpOnly cookie
2. **Simpan user data** di global state (Context/Redux/Zustand)
3. **Set Authorization header** untuk semua request berikutnya
4. **Redirect** ke `/dashboard`

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/` (landing) | `/login` | Klik "Login dengan Email UNU" |
| `/register` | `/login` | Klik "Sudah punya akun?" |
| `/login` | `/dashboard` | Sukses login (auto-redirect) |
| `/login` | `/register` | Klik "Belum punya akun?" |
| `/login` | `/` | Klik back button |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  ←                                   │
├──────────────────────────────────────┤
│                                      │
│              🚀                      │
│       Masuk ke YUKgas.in            │
│      Selamat datang kembali!         │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Email UNU                      │  │
│  │ faiz@students.unu.ac.id|       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Password                 👁    │  │
│  │ ••••••••                       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ╔══════════════════════════════╗  │
│  ║           Masuk              ║  │
│  ╚══════════════════════════════╝  │
│                                      │
│  Belum punya akun? Daftar di sini   │
│                                      │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **Email tidak terdaftar:** Backend return 401, tampilkan "Email belum terdaftar"
- **Password salah:** Backend return 401, tampilkan "Email atau password salah"
- **Token expired saat session:** Redirect ke `/login` dengan toast "Sesi habis, silakan login lagi"
- **User submit berkali-kali:** Disable button setelah klik
- **Remember me (opsional):** Checkbox untuk persist token longer (7 hari vs 1 jam)
- **User sudah login akses /login:** Redirect ke `/dashboard`
