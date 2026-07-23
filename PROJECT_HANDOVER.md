# YUKgas.in
## Project Handover Documentation

> **Tanggal Dokumen:** 23 Juli 2026  
> **Versi Project:** 1.0.0  
> **Status:** Aktif dalam pengembangan

---

# 1. Tentang Project

**YUKgas.in** adalah aplikasi web **peer-to-peer quest marketplace** khusus untuk lingkungan kampus **Universitas Nahdlatul Ulama (UNU) Yogyakarta**. Aplikasi ini memfasilitasi mahasiswa untuk saling membantu melalui sistem "Quest" — tugas atau jasa kecil yang dapat dipublikasikan oleh satu mahasiswa dan dikerjakan oleh mahasiswa lain dengan imbalan kompensasi finansial.

### Konsep Utama

1. **Quest Giver** (Pemberi Quest) — Mahasiswa yang membutuhkan bantuan membuat sebuah "Quest" lengkap dengan deskripsi, kategori, lokasi, deadline, dan kompensasi.
2. **Quest Taker** (Pengambil Quest) — Mahasiswa lain yang melihat quest di feed, lalu mengambil dan mengerjakannya.
3. **Lifecycle Quest** — Setiap quest memiliki siklus hidup bertahap: `OPEN` → `TAKEN` → `IN_PROGRESS` → `COMPLETED` (+ konfirmasi pembayaran).
4. **Sistem Rating** — Setelah quest selesai dan pembayaran dikonfirmasi, kedua pihak (Giver & Taker) dapat saling memberi rating (1-5 bintang) beserta ulasan.
5. **Notifikasi** — Sistem notifikasi real-time (berbasis polling) yang menginformasikan setiap perubahan status quest kepada pihak terkait.
6. **Reputasi** — Skor reputasi dihitung otomatis dari rata-rata seluruh rating yang diterima user.

### Target Pengguna

- Mahasiswa dan civitas akademika UNU Yogyakarta (email `@unu-jogja.ac.id` atau `@student.unu-jogja.ac.id`).

---

# 2. Tech Stack

## Frontend

| Teknologi | Versi | Fungsi |
|---|---|---|
| HTML5 | — | Struktur halaman (Multi-Page Application) |
| Tailwind CSS | CDN (`cdn.tailwindcss.com`) | Utility-first CSS framework |
| Vanilla CSS | Custom (`style.css`) | Design system kustom (variabel, animasi, komponen) |
| Vanilla JavaScript | ES6+ | Logic aplikasi (inline `<script>` di tiap halaman) |
| Lucide Icons | v0.460.0 (CDN) | Icon library |
| Plus Jakarta Sans | Google Fonts | Primary font |
| JetBrains Mono | Google Fonts | Monospace font (angka, badge) |
| Express.js | ^4.19.2 | Local development server untuk clean URL |

## Backend

| Teknologi | Versi | Fungsi |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express.js | ^4.19.2 | Web framework REST API |
| Prisma ORM | ^5.10.0 | Object-Relational Mapper untuk database |
| MySQL | — | Database relasional (via Laragon) |
| JSON Web Token (JWT) | ^9.0.2 | Autentikasi token-based |
| bcryptjs | ^2.4.3 | Hashing password |
| Zod | ^3.22.4 | Validasi schema request body |
| Helmet | ^7.1.0 | HTTP security headers |
| express-rate-limit | ^7.2.0 | Rate limiting API |
| CORS | ^2.8.5 | Cross-Origin Resource Sharing |
| dotenv | ^16.4.5 | Environment variable loader |
| Nodemon | ^3.1.0 (dev) | Auto-restart server saat development |

## Deployment

| Teknologi | Fungsi |
|---|---|
| Vercel | Hosting frontend (konfigurasi via `vercel.json`) |

## Arsitektur

- **Multi-Page Application (MPA)** — Bukan SPA. Setiap halaman adalah file `.html` independen.
- **Monorepo** — Backend dan frontend berada dalam satu repository dengan folder terpisah.
- **REST API** — Backend menyediakan REST API yang dikonsumsi oleh frontend melalui `fetch()`.
- **Tidak menggunakan**: React, Vue, Angular, Next.js, Vite, Redux, Zustand, Axios, atau framework SPA lainnya.

---

# 3. Struktur Folder

```
yukgas/
├── .git/                          # Git repository
├── backend/                       # Backend API (Express + Prisma)
│   ├── .env                       # Environment variables (JANGAN di-commit)
│   ├── .env.example               # Template environment variables
│   ├── .gitignore                 # Git ignore rules
│   ├── package.json               # Dependencies & scripts backend
│   ├── package-lock.json          # Lockfile
│   ├── test-register.js           # Script test registrasi manual
│   ├── prisma/
│   │   ├── schema.prisma          # ⭐ Database schema & model definitions
│   │   └── migrations/            # Prisma migration history
│   │       ├── 20260723105259_init/
│   │       └── 20260723120610_add_notifications/
│   └── src/
│       ├── app.js                 # ⭐ Entry point Express server
│       ├── controllers/           # Business logic handlers
│       │   ├── authController.js      # Register, Login, GetMe
│       │   ├── questController.js     # CRUD Quest + Lifecycle
│       │   ├── userController.js      # Profile & Quest History
│       │   ├── ratingController.js    # Submit & Get Ratings
│       │   └── notificationController.js  # Get & Mark Notifications
│       ├── middlewares/
│       │   └── authMiddleware.js      # JWT verification middleware
│       ├── routes/                # Express route definitions
│       │   ├── authRoutes.js
│       │   ├── questRoutes.js
│       │   ├── userRoutes.js
│       │   ├── ratingRoutes.js
│       │   └── notificationRoutes.js
│       └── utils/
│           ├── db.js                  # Prisma client instance
│           ├── validation.js          # Zod validation schemas
│           └── notificationHelper.js  # Helper: create notification
│
└── frontend/                      # Frontend (Static HTML + JS)
    ├── .gitignore
    ├── package.json               # Dependencies frontend (Express dev server)
    ├── package-lock.json
    ├── server.js                  # ⭐ Local dev server (clean URL rewrites)
    ├── vercel.json                # ⭐ Vercel deployment config & rewrites
    ├── PROJECT_ANALYSIS.md        # Analisis project internal
    ├── README.md                  # Readme (minimal)
    ├── docs/                      # Dokumentasi internal
    │   ├── prd.md                     # Product Requirements Document
    │   ├── srs.md                     # Software Requirements Specification
    │   ├── yukgas.md                  # Deskripsi umum project
    │   ├── prompts.md                 # Prompt development notes
    │   ├── flow-testing.md            # Flow testing documentation
    │   ├── pages/                     # (Halaman dokumentasi)
    │   └── source/                    # Source HTML dokumentasi per halaman
    │       ├── 1-landing.html
    │       ├── 2-register.html
    │       ├── 3-login.html
    │       ├── 4-dashboard.html
    │       ├── 5-quest-detail.html
    │       ├── 6-create quest.html
    │       ├── 7-my-quest.html
    │       ├── 8-user-profile.html
    │       ├── 9-my-profile.html
    │       └── 10-rating-modal.html
    └── public/                    # Static files served ke browser
        ├── assets/
        │   ├── app.js             # ⭐ Global JS: YG helpers + YG_AUTH + API config
        │   ├── notif-badge.js     # ⭐ Auto-fetch unread notification badge
        │   └── style.css          # ⭐ Custom design system CSS
        ├── index.html             # Landing page (publik)
        ├── register.html          # Halaman registrasi
        ├── login.html             # Halaman login
        ├── dashboard.html         # Feed quest utama
        ├── create-quest.html      # Form buat quest baru
        ├── quest-detail.html      # Detail quest + lifecycle actions
        ├── my-quests.html         # Riwayat quest user (Given & Taken)
        ├── my-profile.html        # Edit profil user
        ├── user-profile.html      # Profil publik user lain
        ├── notifications.html     # Daftar notifikasi
        └── rating-modal.html      # Demo/preview komponen rating modal
```

---

# 4. Alur Aplikasi

```
┌──────────────┐
│ Landing Page │  (index.html — publik, tanpa login)
│  yukgas.in/  │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│   Register   │────▶│    Login     │
│ /register    │     │   /login     │
└──────────────┘     └──────┬───────┘
                            │ (JWT token disimpan di localStorage)
                            ▼
                   ┌────────────────┐
                   │   Dashboard    │  (Feed quest berstatus OPEN)
                   │  /dashboard    │
                   └───┬────────┬───┘
                       │        │
          ┌────────────┘        └────────────┐
          ▼                                  ▼
┌──────────────────┐              ┌──────────────────┐
│  Create Quest    │              │  Quest Detail     │
│ /quests/create   │              │  /quests/:id      │
│ (Giver membuat)  │              │ (Lihat, Ambil,    │
└──────────────────┘              │  Mulai, Selesai,  │
                                  │  Bayar, Rating)   │
                                  └────────┬──────────┘
                                           │
                          ┌────────────────┤
                          ▼                ▼
                ┌──────────────┐  ┌──────────────────┐
                │   QuestKu    │  │   Notifications   │
                │ /my-quests   │  │  /notifications    │
                │ (Given/Taken)│  └──────────────────┘
                └──────────────┘
                          │
            ┌─────────────┴──────────────┐
            ▼                            ▼
   ┌──────────────────┐       ┌──────────────────┐
   │   My Profile     │       │  User Profile     │
   │   /profile       │       │  /users/:id       │
   │ (Edit profil)    │       │ (Lihat profil     │
   └──────────────────┘       │  user lain)       │
                              └──────────────────┘
```

### Detail Alur Quest Lifecycle

```
User A membuat Quest (POST /api/v1/quests)
    │
    ▼  Status: OPEN
User B melihat di Feed → klik detail → "Ambil Quest" (POST /quests/:id/take)
    │
    ▼  Status: TAKEN
User B klik "Mulai Kerjakan" (POST /quests/:id/start)
    │
    ▼  Status: IN_PROGRESS
User B klik "Tandai Selesai" (POST /quests/:id/complete)
    │
    ▼  Status: COMPLETED
User A klik "Konfirmasi Pembayaran" (POST /quests/:id/pay)
    │
    ▼  paymentConfirmed: true
User A & B dapat saling memberi Rating (POST /api/v1/ratings/:questId)
```

---

# 5. Sistem Status Quest

| Status | Arti | Siapa yang Mengubah | Transisi Selanjutnya |
|---|---|---|---|
| `OPEN` | Quest baru dipublikasikan, tersedia untuk diambil oleh siapa saja | Giver (saat create) | → `TAKEN` (diambil) / → `CANCELLED` (dibatalkan Giver) |
| `TAKEN` | Quest sudah diambil oleh seorang Taker, belum mulai dikerjakan | Taker (saat take) | → `IN_PROGRESS` (mulai dikerjakan) / → `OPEN` (Taker melepas/release) |
| `IN_PROGRESS` | Quest sedang aktif dikerjakan oleh Taker | Taker (saat start) | → `COMPLETED` (selesai) |
| `COMPLETED` | Quest sudah selesai dikerjakan, menunggu/sudah konfirmasi pembayaran | Taker (saat complete) | → Rating phase (setelah payment confirmed) |
| `CANCELLED` | Quest dibatalkan oleh Giver (hanya bisa dari status `OPEN`) | Giver (saat cancel) | Terminal state — tidak bisa diubah lagi |

### Aturan Bisnis Penting

- Taker **tidak boleh** mengambil quest buatannya sendiri.
- Taker hanya boleh memiliki **maksimal 1 quest aktif** (status `TAKEN` atau `IN_PROGRESS`) pada satu waktu.
- Giver hanya bisa **membatalkan quest** yang masih berstatus `OPEN`.
- Giver hanya bisa **mengedit quest** yang masih berstatus `OPEN`.
- Rating hanya bisa diberikan jika quest berstatus `COMPLETED` **DAN** `paymentConfirmed = true`.
- Setiap user hanya boleh memberikan **1 rating per quest**.

---

# 6. Hubungan Antar Halaman

```
                    ┌─────────────────────────────────────┐
                    │            app.js (Global)          │
                    │  • YG (toast, popup, confetti, etc) │
                    │  • YG_AUTH (token, user, headers)   │
                    │  • API_BASE_URL config              │
                    └──────────────┬──────────────────────┘
                                   │ Dipakai oleh SEMUA halaman
        ┌──────────┬───────────┬───┴────┬──────────┬──────────┐
        ▼          ▼           ▼        ▼          ▼          ▼
   dashboard   quest-detail  my-quests  my-profile  user-profile  notifications
        │          │           │         │           │            │
        │          │           │         │           │            │
        └──────────┴─────┬─────┴─────────┴───────────┘            │
                         │                                        │
                         ▼                                        │
                  notif-badge.js  ◄────────────────────────────────┘
                  (badge counter di semua halaman)
```

### Data Dependencies Antar Halaman

| Halaman | Sumber Data API | Data yang Sama dengan Halaman Lain |
|---|---|---|
| `dashboard.html` | `GET /quests?status=OPEN` | Quest data → sama dengan `quest-detail.html` |
| `quest-detail.html` | `GET /quests/:id` | Quest + Giver/Taker profile → sama dengan `user-profile.html` |
| `my-quests.html` | `GET /users/quests/given`, `GET /users/quests/taken` | Quest data (milik user login) |
| `my-profile.html` | `GET /users/:id`, `PUT /users/profile` | User data → sama dengan `user-profile.html` |
| `user-profile.html` | `GET /users/:id`, `GET /ratings/user/:id` | User + Ratings data |
| `notifications.html` | `GET /notifications`, `PUT /notifications/:id/read` | Notifikasi terkait quest & user |

---

# 7. Source of Truth

Seluruh data pada aplikasi berasal dari **backend API + database MySQL**. Tidak ada data yang di-hardcode atau disimpan permanen di frontend.

| Jenis Data | Sumber | Penyimpanan Client |
|---|---|---|
| **Data Quest** | `GET /api/v1/quests` dan turunannya | Tidak disimpan — di-fetch setiap halaman dimuat |
| **Data User (profil)** | `GET /api/v1/users/:id` | Cache minimal di `localStorage` key `yg_user` (diupdate saat login & edit profil) |
| **Data Notifikasi** | `GET /api/v1/notifications` | Tidak disimpan — di-fetch setiap halaman dimuat |
| **Data Rating** | `GET /api/v1/ratings/user/:userId` | Tidak disimpan — di-fetch on-demand |
| **Token Autentikasi** | `POST /api/v1/auth/login` | `localStorage` key `yg_token` (JWT) |
| **Sesi User Login** | `POST /api/v1/auth/login` | `localStorage` key `yg_user` (JSON object) |

### Tidak Ada Data Dummy di Alur Utama

Semua endpoint sudah terhubung langsung ke database MySQL melalui Prisma ORM. Tidak ada mock data, fake API, atau JSON file statis yang digunakan untuk menampilkan data quest, user, rating, atau notifikasi.

---

# 8. Yang Sudah Dikerjakan

### Fitur yang Sudah Selesai dan Terhubung ke Backend

- ✅ **Landing Page** — Halaman publik dengan hero section, statistik, dan CTA
- ✅ **Registrasi** — Form register dengan validasi email domain UNU, password strength, dan integrasi `POST /auth/register`
- ✅ **Login** — Form login dengan validasi Zod dan JWT token generation via `POST /auth/login`
- ✅ **Dashboard/Feed** — Menampilkan quest `OPEN` dari API dengan filter kategori, search, sorting, dan pagination
- ✅ **Create Quest** — Form pembuatan quest lengkap dengan validasi frontend + backend (Zod schema)
- ✅ **Quest Detail** — Halaman detail quest dengan state machine UI yang menampilkan tombol aksi berbeda sesuai status quest dan peran user (Giver/Taker/Visitor)
- ✅ **Ambil Quest** (Take) — Taker dapat mengambil quest `OPEN` via `POST /quests/:id/take`
- ✅ **Mulai Quest** (Start) — Taker memulai pengerjaan via `POST /quests/:id/start`
- ✅ **Selesai Quest** (Complete) — Taker menandai selesai via `POST /quests/:id/complete`
- ✅ **Konfirmasi Pembayaran** — Giver mengonfirmasi pembayaran via `POST /quests/:id/pay`
- ✅ **Batalkan Quest** — Giver membatalkan quest `OPEN` via `DELETE /quests/:id`
- ✅ **Lepas Quest** (Release) — Taker melepas quest `TAKEN` kembali ke `OPEN` via `POST /quests/:id/release`
- ✅ **Submit Rating** — Rating 1-5 bintang + review text setelah pembayaran dikonfirmasi via `POST /ratings/:questId`
- ✅ **QuestKu (My Quests)** — Tab "Diberikan" dan "Diambil" dengan filter status (All, Open, Taken, In Progress, Completed)
- ✅ **My Profile (Edit)** — Edit nama, bio, dan QRIS; simpan via `PUT /users/profile`
- ✅ **User Profile (Public)** — Lihat profil user lain + daftar rating yang diterima
- ✅ **Notifikasi** — Daftar notifikasi dari API, mark-as-read, dan badge count otomatis
- ✅ **Responsive Design** — Layout mobile-first dengan breakpoint desktop (`md:`) pada semua halaman
- ✅ **Navigation** — Bottom nav (mobile) + header nav (desktop) pada semua halaman terproteksi
- ✅ **Toast & Popup** — Sistem notifikasi UI (toast, popup bulat, confetti) via objek global `YG`
- ✅ **Page Transitions** — Animasi masuk/keluar halaman via `YG.navigate()` dan `YG.transitionOut()`
- ✅ **JWT Auth Middleware** — Proteksi endpoint backend dengan verifikasi token + attach user ke `req.user`
- ✅ **Rate Limiting** — 100 request per menit per IP pada prefix `/api`
- ✅ **Security Headers** — Helmet middleware untuk X-Content-Type-Options, X-Frame-Options, dll
- ✅ **Prisma Migrations** — 2 migration sudah dijalankan (`init` + `add_notifications`)
- ✅ **Zod Validation** — Schema validasi untuk register, login, create/update quest, update profile, dan rating
- ✅ **Notification System** — Notifikasi otomatis dibuat saat: quest dipublikasikan, quest diambil, quest selesai, quest dibatalkan, rating diterima
- ✅ **Reputation Calculation** — Skor reputasi dihitung ulang otomatis setiap kali rating baru diterima (rata-rata)

---

# 9. Yang Belum Selesai

### Fitur yang Belum Diimplementasi

- ☐ **Upload File (Avatar)** — UI upload avatar sudah ada di `my-profile.html`, namun belum ada endpoint backend untuk menerima file (Multer/S3/Cloudinary). Saat ini hanya preview lokal.
- ☐ **Upload File (QRIS)** — UI upload QRIS sudah ada di `my-profile.html`, namun menggunakan URL fallback hardcoded (`https://yukgas.in/mock-qris-uploaded.png`) karena belum ada file storage backend.
- ☐ **Realtime Notifications** — Notifikasi saat ini menggunakan polling (fetch saat halaman dimuat). Belum ada WebSocket/SSE untuk push notification realtime.
- ☐ **Chat/Messaging** — Belum ada fitur chat antara Giver dan Taker untuk koordinasi quest.
- ☐ **Edit Quest** — Backend `PUT /quests/:id` sudah tersedia, namun belum ada halaman/form frontend untuk mengedit quest yang sudah dipublikasikan.
- ☐ **Pagination UI** — Backend mendukung pagination (page, limit, totalPages), namun frontend seluruh halaman memanggil dengan `limit=50` tanpa tombol "Load More" atau page navigation.
- ☐ **Forgot Password / Reset Password** — Belum diimplementasi.
- ☐ **Email Verification** — Registrasi langsung aktif tanpa verifikasi email.
- ☐ **Search di My Quests** — Filter status sudah ada, namun search teks belum tersedia di halaman QuestKu.
- ☐ **Admin Dashboard** — Belum ada panel admin untuk monitoring quest, user, atau laporan.
- ☐ **Dark Mode** — Belum diimplementasi.
- ☐ **PWA / Offline Support** — Belum ada Service Worker atau manifest untuk Progressive Web App.
- ☐ **Production Build** — Frontend menggunakan Tailwind CDN (development mode). Untuk production perlu migrasi ke build pipeline (PostCSS/Vite) untuk optimasi ukuran CSS.

---

# 10. Bug yang Diketahui

### Bug Aktif

1. **Duplikasi fungsi `toast()` di `app.js`**  
   File `frontend/public/assets/app.js` memiliki **dua definisi** fungsi `toast()` di dalam objek `YG` (baris 17-42 dan baris 144-169). Karena JavaScript object literal mengambil definisi terakhir, fungsi toast pertama (duration default 2500ms) di-override oleh yang kedua (duration default 3500ms). Tidak menyebabkan error, tetapi merupakan kode mubazir.

2. **QRIS URL Fallback Hardcoded**  
   Di `my-profile.html`, saat user mengupload file QRIS secara lokal, variabel `uploadedQrisUrl` di-set ke `'https://yukgas.in/mock-qris-uploaded.png'` — sebuah URL yang tidak benar-benar ada. Ini diperlukan agar lolos validasi Zod backend (`z.string().url()`), tetapi data QRIS yang tersimpan di database tidak merujuk ke file sesungguhnya.

3. **JWT Token Expiry Tidak Ada Auto-Refresh**  
   Token JWT dikonfigurasi expired dalam 1 jam (`JWT_EXPIRES_IN="1h"`). Saat token expired, request API akan mengembalikan 401. Frontend belum memiliki mekanisme auto-refresh token atau redirect otomatis ke halaman login saat token expired.

4. **Hardcoded Desktop Avatar Initial**  
   Beberapa halaman memiliki huruf inisial avatar desktop yang di-hardcode (misalnya `F` di `my-profile.html` baris 77). Inisial ini diperbarui secara dinamis oleh JavaScript setelah halaman dimuat, tetapi bisa muncul sekilas ("flash") sebelum JavaScript menggantinya.

5. **`rating-modal.html` — File Demo Terpisah**  
   File `rating-modal.html` adalah halaman demo/preview komponen UI modal rating yang berdiri sendiri. Halaman ini memiliki data sampel hardcoded (nama user "Hilman Al Hakim", quest "Beliin Kopi Senja") dan tidak terhubung ke backend. Fitur rating sesungguhnya sudah terintegrasi di `quest-detail.html`.

---

# 11. Dummy Data Audit

### Dummy Data yang SUDAH Dihapus

| File | Data yang Dihapus |
|---|---|
| `my-profile.html` | Nama hardcoded `"Faiz Abdurrachman"` di heading, email, form input, dan bio textarea |
| `my-profile.html` | Stats hardcoded: Rating `4.5`, Diberikan `15`, Diambil `5` → diganti `0.0`, `0`, `0` |
| `my-profile.html` | Bio counter hardcoded `37/200` → diganti `0/200` |
| `my-profile.html` | Avatar initial hardcoded `F` → diganti `-` |
| `my-profile.html` | Bug `YG_AUTH.saveUser()` → diperbaiki ke `YG_AUTH.setUser()` |
| `my-profile.html` | Bug `YG_AUTH.clearSession()` → diperbaiki ke `YG_AUTH.logout()` |
| `my-quests.html` | Badge tab hardcoded `4` (Diberikan) dan `3` (Diambil) → diganti `0` dengan update dinamis dari API |
| `user-profile.html` | Nama placeholder `"User Name"`, email `"email@student.unu-jogja.ac.id"`, bio `"Cerita singkat..."` → diganti `-` dan `...` |

### Dummy Data yang MASIH ADA

| File | Data | Alasan Dipertahankan |
|---|---|---|
| `my-profile.html` | URL fallback `'https://yukgas.in/mock-qris-uploaded.png'` saat preview QRIS lokal | Backend Zod schema memerlukan format URL valid (`z.string().url()`). Tanpa file storage server (Cloudinary/S3), string ini diperlukan agar request `PUT /users/profile` tidak di-reject. Akan dihapus setelah fitur upload file diimplementasi. |
| `rating-modal.html` | Seluruh konten halaman (sampel user, quest, rating) | File ini adalah halaman demo UI terpisah, bukan bagian dari flow aplikasi utama. Rating sesungguhnya sudah berjalan via `quest-detail.html`. |
| `index.html` | Teks statistik marketing: `"50+ Quest Aktif"`, `"200+ Mahasiswa"`, `"4.8★ Rating"` | Ini adalah copywriting promosi pada landing page publik, bukan data transaksional. Angka-angka ini adalah bagian dari desain UI marketing. |
| `my-profile.html` | Hardcoded initial `F` di desktop nav avatar (baris 77) | Diperbarui dinamis oleh JavaScript saat halaman dimuat. Termasuk bagian template navigasi. |

---

# 12. API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

## Authentication (`/api/v1/auth`)

| Method | Endpoint | Access | Fungsi |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Registrasi user baru (validasi email domain UNU) |
| `POST` | `/auth/login` | Public | Login user, return JWT token + user data |
| `GET` | `/auth/me` | Private | Ambil data user yang sedang login dari token |

## Quest (`/api/v1/quests`)

| Method | Endpoint | Access | Fungsi |
|---|---|---|---|
| `GET` | `/quests` | Public | Feed quest dengan filter (category, status, price, search, sort, pagination) |
| `GET` | `/quests/:id` | Public | Detail quest lengkap (include giver, taker, ratings, history) |
| `POST` | `/quests` | Private | Buat quest baru |
| `PUT` | `/quests/:id` | Private (Giver) | Edit quest (hanya status `OPEN`) |
| `DELETE` | `/quests/:id` | Private (Giver) | Batalkan quest (soft-cancel, ubah ke `CANCELLED`) |
| `POST` | `/quests/:id/take` | Private | Ambil quest (OPEN → TAKEN) |
| `POST` | `/quests/:id/start` | Private (Taker) | Mulai kerjakan (TAKEN → IN_PROGRESS) |
| `POST` | `/quests/:id/complete` | Private (Taker) | Tandai selesai (IN_PROGRESS → COMPLETED) |
| `POST` | `/quests/:id/release` | Private (Taker) | Lepas quest (TAKEN → OPEN) |
| `POST` | `/quests/:id/pay` | Private (Giver) | Konfirmasi pembayaran (set `paymentConfirmed = true`) |

## User (`/api/v1/users`)

| Method | Endpoint | Access | Fungsi |
|---|---|---|---|
| `PUT` | `/users/profile` | Private | Update profil user (fullName, bio, avatarUrl, qrisUrl) |
| `GET` | `/users/quests/given` | Private | Riwayat quest yang dipublikasikan user (dengan filter status & pagination) |
| `GET` | `/users/quests/taken` | Private | Riwayat quest yang diambil user (dengan filter status & pagination) |
| `GET` | `/users/:id` | Public | Profil publik user berdasarkan ID |

> **⚠️ Catatan Penting Urutan Route:** Route `/users/quests/given` dan `/users/quests/taken` **HARUS** dideklarasikan di `userRoutes.js` **SEBELUM** route wildcard `/users/:id`. Jika terbalik, Express akan mencocokkan `/users/quests` sebagai `/:id` dengan value `"quests"`.

## Rating (`/api/v1/ratings`)

| Method | Endpoint | Access | Fungsi |
|---|---|---|---|
| `POST` | `/ratings/:questId` | Private | Submit rating (1-5) + review untuk quest yang sudah completed & paid |
| `GET` | `/ratings/user/:userId` | Public | Daftar rating yang diterima user (dengan pagination) |

## Notification (`/api/v1/notifications`)

| Method | Endpoint | Access | Fungsi |
|---|---|---|---|
| `GET` | `/notifications` | Private | Semua notifikasi user (sorted descending by createdAt) |
| `GET` | `/notifications/unread-count` | Private | Jumlah notifikasi belum dibaca |
| `PUT` | `/notifications/:id/read` | Private | Tandai notifikasi sebagai sudah dibaca |

## Health Check

| Method | Endpoint | Access | Fungsi |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | Status kesehatan API server |

### Format Response Standard

Semua endpoint mengembalikan JSON dengan struktur konsisten:

```json
{
  "success": true,
  "message": "Pesan opsional",
  "data": {
    // Data payload
  }
}
```

Untuk response error:

```json
{
  "success": false,
  "message": "Deskripsi error",
  "errors": {
    // Opsional: field-level validation errors dari Zod
  }
}
```

---

# 13. State Management

### Tidak Menggunakan Framework State Management

Project ini **TIDAK** menggunakan React Context, Redux, Zustand, atau state management library apapun. Ini adalah Multi-Page Application (MPA) dengan Vanilla JavaScript.

### Mekanisme State

| Mekanisme | Key | Fungsi |
|---|---|---|
| `localStorage` | `yg_token` | Menyimpan JWT token untuk autentikasi |
| `localStorage` | `yg_user` | Menyimpan object user yang sedang login (cache) |
| URL Parameter | `?id=` atau path `/:id` | Mengidentifikasi quest/user yang sedang dilihat |
| JavaScript Variable | Inline `<script>` di tiap halaman | State lokal per halaman (form data, tab aktif, filter aktif) |

### Global Objects (Didefinisikan di `app.js`)

#### `window.YG` — UI Interaction Helper

| Method | Fungsi |
|---|---|
| `YG.toast(message, type, duration)` | Menampilkan toast notification (success/error/info/warning) |
| `YG.pop(message, type, duration)` | Menampilkan popup bulat animasi (circle + checkmark) |
| `YG.confetti(x, y)` | Burst efek confetti di koordinat tertentu |
| `YG.navigate(url)` | Navigasi halaman dengan animasi transisi |
| `YG.transitionOut(callback)` | Animasi fade-out sebelum pindah halaman |
| `YG.ripple(element, event)` | Efek ripple pada klik elemen |
| `YG.haptic(pattern)` | Feedback getaran (mobile) |
| `YG.initLucide(retries)` | Inisialisasi ikon Lucide dengan retry mechanism |

#### `window.YG_AUTH` — Authentication Helper

| Method | Fungsi |
|---|---|
| `YG_AUTH.getToken()` | Ambil JWT token dari localStorage |
| `YG_AUTH.setToken(token)` | Simpan JWT token ke localStorage |
| `YG_AUTH.removeToken()` | Hapus JWT token |
| `YG_AUTH.getUser()` | Ambil object user dari localStorage (JSON parse) |
| `YG_AUTH.setUser(user)` | Simpan object user ke localStorage (JSON stringify) |
| `YG_AUTH.removeUser()` | Hapus data user |
| `YG_AUTH.logout()` | Hapus token + user, redirect ke `/login` |
| `YG_AUTH.getHeaders()` | Return object headers standar: `{ 'Content-Type': 'application/json', 'Authorization': 'Bearer <token>' }` |

#### `window.YG_NOTIF` — Notification Badge Helper (dari `notif-badge.js`)

| Method | Fungsi |
|---|---|
| `YG_NOTIF.refreshBadge()` | Manual refresh badge count dari API |

#### `window.API_BASE_URL`

```javascript
window.API_BASE_URL = 'http://localhost:5000/api/v1';
```

### Data Flow Per Halaman

Setiap halaman HTML melakukan:
1. Load `app.js` → global objects tersedia.
2. Load `notif-badge.js` → badge otomatis di-fetch.
3. Inline `<script>` di `<body>`:
   - Cek `YG_AUTH.getToken()` → redirect ke `/login` jika null.
   - `fetch()` ke endpoint API yang relevan dengan `YG_AUTH.getHeaders()`.
   - Render data ke DOM secara imperatif (innerHTML / textContent).

---

# 14. Cara Menjalankan Project

### Prasyarat

- **Node.js** v18 atau lebih baru
- **MySQL** (disarankan via Laragon untuk Windows)
- **Git**

### Langkah 1: Clone Repository

```bash
git clone <repository-url>
cd yukgas
```

### Langkah 2: Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Salin file environment
cp .env.example .env

# Edit .env sesuai konfigurasi lokal Anda (lihat bagian #15 Environment)

# Jalankan migrasi database
npx prisma migrate dev

# (Opsional) Buka Prisma Studio untuk inspeksi database
npx prisma studio

# Jalankan backend server
npm run dev
```

Backend akan berjalan di `http://localhost:5000`.

### Langkah 3: Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan frontend dev server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`.

### Langkah 4: Buka Aplikasi

Buka browser dan akses `http://localhost:3000`.

### Perintah Berguna

| Perintah | Lokasi | Fungsi |
|---|---|---|
| `npm run dev` | `backend/` | Jalankan backend dengan nodemon (auto-restart) |
| `npm start` | `backend/` | Jalankan backend tanpa nodemon (production) |
| `npm run db:migrate` | `backend/` | Jalankan Prisma migration |
| `npm run db:studio` | `backend/` | Buka Prisma Studio (GUI database) |
| `npm run dev` | `frontend/` | Jalankan frontend Express dev server |
| `node test-register.js` | `backend/` | Test endpoint registrasi secara manual |

---

# 15. Environment

### File `.env` (Backend)

Lokasi: `backend/.env`

```env
PORT=5000
NODE_ENV=development

# MySQL Connection String (Laragon)
# Ganti password sesuai konfigurasi MySQL Laragon Anda (default Laragon: kosong)
DATABASE_URL="mysql://root:@localhost:3306/yukgas"

# JWT Configuration
JWT_SECRET="super_secret_key_change_me_in_production_12345"
JWT_EXPIRES_IN="1h"

# CORS configuration
FRONTEND_URL="http://localhost:3000"
```

| Variable | Wajib | Default | Deskripsi |
|---|---|---|---|
| `PORT` | Tidak | `5000` | Port server backend |
| `NODE_ENV` | Tidak | `development` | Mode environment (`development` / `production`) |
| `DATABASE_URL` | **Ya** | — | Connection string MySQL (format Prisma) |
| `JWT_SECRET` | **Ya** | `super_secret_key` | Secret key untuk signing JWT. **WAJIB diganti di production!** |
| `JWT_EXPIRES_IN` | Tidak | `1h` | Durasi validitas JWT token |
| `FRONTEND_URL` | Tidak | `http://localhost:3000` | URL frontend untuk CORS whitelist |

### Frontend

Frontend **tidak memiliki file `.env`**. Konfigurasi API URL di-hardcode di `app.js`:

```javascript
window.API_BASE_URL = 'http://localhost:5000/api/v1';
```

> **⚠️ Untuk deployment production**, value ini harus diubah ke URL backend production.

---

# 16. Konvensi Coding

### Penamaan File

| Jenis | Konvensi | Contoh |
|---|---|---|
| HTML Pages | `kebab-case.html` | `quest-detail.html`, `my-quests.html` |
| JS Assets | `kebab-case.js` | `app.js`, `notif-badge.js` |
| CSS Assets | `kebab-case.css` | `style.css` |
| Controllers | `camelCaseController.js` | `questController.js`, `authController.js` |
| Routes | `camelCaseRoutes.js` | `questRoutes.js`, `userRoutes.js` |
| Middleware | `camelCaseMiddleware.js` | `authMiddleware.js` |
| Utils | `camelCase.js` | `validation.js`, `notificationHelper.js` |

### Penamaan Fungsi & Variabel

- **Backend Controller:** `export const namaAksi = async (req, res) => {}`
- **Frontend Functions:** `function namaFungsi()` atau `async function namaFungsi()`
- **DOM IDs:** `kebab-case` (contoh: `my-rating`, `content-given`, `tab-given-desktop`)
- **CSS Classes:** Mengikuti Tailwind utilities + custom classes dari `style.css`

### Struktur Controller Backend

Setiap controller mengikuti pola konsisten:

```javascript
export const namaAksi = async (req, res) => {
  try {
    // 1. Validasi input (Zod)
    // 2. Guard checks (ownership, status)
    // 3. Database operation (Prisma, sering dalam $transaction)
    // 4. Create notification (jika perlu)
    // 5. Return success response
  } catch (error) {
    console.error('Nama aksi error:', error);
    return res.status(500).json({
      success: false,
      message: 'Pesan error dalam Bahasa Indonesia'
    });
  }
};
```

### Styling

- **Primary:** Tailwind CSS via CDN dengan konfigurasi custom `tailwind.config` di setiap halaman HTML.
- **Design System:** Custom CSS variables & classes didefinisikan di `style.css` (warna, shadow, gradient, animasi, komponen seperti `.warm-card`, `.btn-sunset`, `.warm-input`, `.toast-pop`, dll).
- **Font:** Plus Jakarta Sans (body) + JetBrains Mono (angka/monospace).
- **Warna:** Warm palette — sunset (#FF6B35), golden (#FFB627), teal (#0CA789), cream (#FFF8F0), espresso (#2D1B12).
- **Icon:** Lucide Icons v0.460.0 via CDN.

### Bahasa

- **UI Text:** Bahasa Indonesia
- **Komentar kode:** Campuran Bahasa Indonesia dan Inggris
- **Pesan error API:** Bahasa Indonesia

---

# 17. Catatan Penting

> **WAJIB DIBACA** sebelum menambah fitur atau memodifikasi project.

### Aturan Utama

1. **JANGAN menambahkan data dummy baru.** Semua data harus berasal dari backend API yang terhubung ke database.
2. **JANGAN mengubah flow status quest** (`OPEN → TAKEN → IN_PROGRESS → COMPLETED`). Lifecycle ini sudah divalidasi di backend dan frontend.
3. **Pertahankan desain UI** ("Warm Campus Vibe"). Jangan mengubah color palette, typography, atau layout secara signifikan tanpa konsultasi.
4. **Semua endpoint baru harus mengikuti format response standar** (`{ success, message, data }`).
5. **Semua input user harus divalidasi** dengan Zod schema di backend.
6. **Setiap perubahan status quest harus dicatat** di `QuestHistory` melalui Prisma transaction.
7. **Perhatikan urutan route** di Express! Route spesifik (seperti `/quests/given`) harus didefinisikan **SEBELUM** route wildcard (`/:id`). Bug ini sudah pernah terjadi dan diperbaiki.
8. **`app.js` dan `notif-badge.js` di-load di SEMUA halaman.** Modifikasi pada file ini berdampak global.
9. **JWT token expired dalam 1 jam.** User harus login ulang setelah itu. Belum ada refresh token mechanism.
10. **Tailwind CSS menggunakan CDN** (bukan build). Untuk production, perlu migrasi ke build pipeline.
11. **Database menggunakan MySQL via Laragon.** Pastikan MySQL service aktif sebelum menjalankan backend.
12. **Backend menggunakan ES Modules** (`"type": "module"` di `package.json`). Gunakan `import/export`, bukan `require()`.

---

# 18. Dependency Map

### Backend Dependencies

```
app.js (Entry Point)
├── express, cors, helmet, express-rate-limit, dotenv
├── routes/
│   ├── authRoutes.js
│   │   ├── authController.js
│   │   │   ├── bcryptjs, jsonwebtoken
│   │   │   ├── utils/db.js (Prisma Client)
│   │   │   └── utils/validation.js (registerSchema, loginSchema)
│   │   └── authMiddleware.js
│   │       ├── jsonwebtoken
│   │       └── utils/db.js
│   ├── questRoutes.js
│   │   ├── questController.js
│   │   │   ├── utils/db.js
│   │   │   ├── utils/validation.js (createQuestSchema, updateQuestSchema)
│   │   │   └── utils/notificationHelper.js
│   │   └── authMiddleware.js
│   ├── userRoutes.js
│   │   ├── userController.js
│   │   │   ├── utils/db.js
│   │   │   └── utils/validation.js (updateProfileSchema)
│   │   └── authMiddleware.js
│   ├── ratingRoutes.js
│   │   ├── ratingController.js
│   │   │   ├── utils/db.js
│   │   │   ├── utils/validation.js (ratingSchema)
│   │   │   └── utils/notificationHelper.js
│   │   └── authMiddleware.js
│   └── notificationRoutes.js
│       ├── notificationController.js
│       │   └── utils/db.js
│       └── authMiddleware.js
└── utils/
    ├── db.js ← @prisma/client (shared singleton)
    ├── validation.js ← zod
    └── notificationHelper.js ← utils/db.js
```

### Frontend Dependencies

```
Setiap halaman HTML:
├── Google Fonts CDN (Plus Jakarta Sans, JetBrains Mono)
├── Tailwind CSS CDN
├── Lucide Icons CDN (v0.460.0)
├── assets/style.css (custom design system)
├── assets/app.js (YG + YG_AUTH + API_BASE_URL)
├── assets/notif-badge.js (YG_NOTIF badge auto-loader)
└── Inline <script> (page-specific logic)
    └── Depends on: window.YG, window.YG_AUTH, window.API_BASE_URL, window.lucide
```

### Hubungan Halaman → API

```
index.html         → (tidak ada API call)
register.html      → POST /auth/register
login.html         → POST /auth/login
dashboard.html     → GET /quests?status=OPEN
create-quest.html  → POST /quests
quest-detail.html  → GET /quests/:id
                   → POST /quests/:id/take
                   → POST /quests/:id/start
                   → POST /quests/:id/complete
                   → DELETE /quests/:id
                   → POST /quests/:id/pay
                   → POST /ratings/:questId
my-quests.html     → GET /users/quests/given
                   → GET /users/quests/taken
my-profile.html    → GET /users/:id
                   → PUT /users/profile
user-profile.html  → GET /users/:id
                   → GET /ratings/user/:id
notifications.html → GET /notifications
                   → GET /notifications/unread-count
                   → PUT /notifications/:id/read
```

---

# 19. File Penting

### Backend

| File | Fungsi |
|---|---|
| `backend/src/app.js` | Entry point server Express, konfigurasi middleware dan mounting routes |
| `backend/prisma/schema.prisma` | Definisi seluruh model database (User, Quest, Rating, QuestHistory, Notification) |
| `backend/src/controllers/questController.js` | Logic inti: CRUD quest + seluruh lifecycle transitions (take, start, complete, release, pay) |
| `backend/src/controllers/authController.js` | Register, Login, GetMe — JWT token generation |
| `backend/src/controllers/userController.js` | Profile CRUD + riwayat quest (given/taken) |
| `backend/src/controllers/ratingController.js` | Submit rating + recalculate reputation |
| `backend/src/controllers/notificationController.js` | Get, count, mark-as-read notifikasi |
| `backend/src/middlewares/authMiddleware.js` | JWT token verification, attach user ke `req.user` |
| `backend/src/routes/userRoutes.js` | ⚠️ **Urutan route kritis** — route spesifik harus di atas wildcard `:id` |
| `backend/src/utils/validation.js` | Semua Zod schema (register, login, quest, profile, rating) |
| `backend/src/utils/db.js` | Prisma client singleton instance |
| `backend/src/utils/notificationHelper.js` | Utility function `createNotification()` |
| `backend/.env` | Environment variables (**JANGAN di-commit**) |
| `backend/.env.example` | Template environment variables untuk developer baru |
| `backend/test-register.js` | Script test manual registrasi user via `fetch()` |

### Frontend

| File | Fungsi |
|---|---|
| `frontend/public/assets/app.js` | ⭐ **File terpenting frontend** — Global helpers (YG, YG_AUTH, API_BASE_URL) digunakan di SEMUA halaman |
| `frontend/public/assets/notif-badge.js` | Auto-fetch dan update badge notifikasi di semua halaman |
| `frontend/public/assets/style.css` | Custom design system: CSS variables, animasi, komponen (warm-card, btn-sunset, toast, dll) |
| `frontend/server.js` | Express dev server lokal yang membaca `vercel.json` untuk clean URL rewrites |
| `frontend/vercel.json` | Konfigurasi deployment Vercel: clean URL rewrites + security headers |
| `frontend/public/dashboard.html` | Halaman utama feed quest — titik masuk setelah login |
| `frontend/public/quest-detail.html` | Halaman terkompleks — state machine UI untuk seluruh lifecycle quest |
| `frontend/public/my-quests.html` | Tracker riwayat quest user (Given/Taken) dengan tab dan filter |
| `frontend/public/my-profile.html` | Edit profil user — form lengkap + QRIS upload |
| `frontend/docs/prd.md` | Product Requirements Document |
| `frontend/docs/srs.md` | Software Requirements Specification |

---

# 20. Rekomendasi Refactor

> **⚠️ Bagian ini hanya berisi rekomendasi. JANGAN langsung mengubah kode tanpa diskusi tim.**

### Prioritas Tinggi

1. **Migrasi Tailwind CSS dari CDN ke Build Pipeline**  
   Saat ini setiap halaman memuat `cdn.tailwindcss.com` (~300KB+ uncompressed). Untuk production, gunakan PostCSS + Tailwind CLI atau Vite agar CSS di-purge dan di-minify. Ini akan mengurangi ukuran drastis.

2. **Implementasi File Upload Service**  
   Untuk avatar dan QRIS, integrasikan layanan penyimpanan file (Cloudinary, AWS S3, atau Multer + static serving). Ini akan menghilangkan kebutuhan URL fallback hardcoded.

3. **Ekstraksi Template Navigation**  
   Saat ini kode header, bottom nav, dan Tailwind config **di-copy-paste identik** di setiap file HTML. Pertimbangkan menggunakan server-side includes, Web Components, atau template engine (EJS/Pug) untuk menghindari duplikasi masif.

4. **Implementasi Token Refresh Mechanism**  
   Saat ini JWT expired dalam 1 jam tanpa mekanisme refresh. Tambahkan:
   - Endpoint `POST /auth/refresh` untuk menghasilkan token baru.
   - Interceptor di frontend yang mendeteksi response 401 dan mencoba refresh sebelum redirect ke login.

### Prioritas Sedang

5. **Konsolidasi Inline JavaScript ke File Terpisah**  
   Setiap halaman memiliki `<script>` inline yang besar (200-500 baris). Pertimbangkan memecah logic ke file `.js` terpisah per halaman untuk maintainability yang lebih baik.

6. **Hapus Duplikasi Fungsi `toast()` di `app.js`**  
   Fungsi `toast()` didefinisikan dua kali di objek `YG` (baris 17-42 dan 144-169). Hapus salah satu.

7. **Tambahkan Pagination UI**  
   Backend sudah mendukung pagination (`page`, `limit`, `totalPages`), tetapi frontend selalu memanggil `limit=50`. Implementasikan tombol "Load More" atau numbered pagination.

8. **Tambahkan Loading Skeleton**  
   Saat data sedang di-fetch dari API, tampilkan skeleton placeholder (bukan hanya spinner) untuk UX yang lebih baik.

### Prioritas Rendah

9. **Unified Error Handler di Frontend**  
   Buat helper function global di `app.js` untuk menangani error API secara konsisten (misalnya redirect ke login saat 401, tampilkan toast untuk 400/500).

10. **Tambahkan Unit & Integration Tests**  
    Backend belum memiliki test suite otomatis. Pertimbangkan Jest + Supertest untuk controller dan endpoint testing.

11. **Implementasi Rate Limiting per User**  
    Saat ini rate limit hanya per IP. Untuk mencegah abuse, tambahkan rate limiting per user ID.

12. **Environment-Based API URL di Frontend**  
    Ganti hardcoded `API_BASE_URL` dengan mekanisme yang membaca dari environment (misalnya meta tag yang di-inject server, atau konfigurasi di `vercel.json`).

---

> **Dokumen ini dibuat berdasarkan audit menyeluruh terhadap kondisi source code project per tanggal 23 Juli 2026. Jika ada perubahan signifikan pada project setelah tanggal ini, dokumen perlu diperbarui.**
