# YUKgas.in — Product Requirements Document (PRD)

> **Versi:** 1.0  
> **Tanggal:** Juni 2026  
> **Tim:** Nicky, Hilman, Faiz, Esa, Imroatu, Aldo  
> **Status:** Draft untuk brainstorming

---

## 1. Product Overview

### 1.1 Nama Produk
**YUKgas.in** — Marketplace Micro-Task Kampus UNU

### 1.2 Tagline
"BUTUH BANTUAN? YUK GAS! — Platform jasa micro-task khusus mahasiswa UNU"

### 1.3 Deskripsi Singkat
YUKgas.in adalah platform web berbasis sistem **quest** yang mempertemukan mahasiswa UNU yang membutuhkan bantuan kecil (transportasi, beli makanan, print dokumen, dll) dengan mahasiswa lain yang bersedia mengerjakan dengan kompensasi tertentu. Platform bersifat **closed ecosystem** — hanya dapat diakses oleh civitas akademika UNU melalui verifikasi email institusi.

### 1.4 Value Proposition
- **Bagi Quest Giver:** Kemudahan menemukan bantuan dengan harga transparan, deadline jelas, dan sistem kepercayaan berbasis rating.
- **Bagi Quest Taker:** Peluang penghasilan tambahan yang fleksibel sesuai waktu luang, dengan tugas ringan di lingkungan kampus.
- **Bagi Ekosistem Kampus:** Mendorong budaya saling membantu yang terorganisir dan mempererat koneksi antar mahasiswa.

---

## 2. Problem Statement

### 2.1 Masalah yang Dihadapi
1. **Tidak terstruktur:** Mahasiswa memenuhi kebutuhan kecil via grup WhatsApp atau DM pribadi — tidak ada sistematisasi, tidak ada filter, tidak ada record.
2. **Tidak ada sistem kepercayaan:** Tidak ada mekanisme verifikasi identitas atau reputasi. Siapa saja bisa janji bantuan tapi tidak menepati.
3. **Waktu luang tidak tersalurkan:** Banyak mahasiswa punya waktu senggang dan skill, tapi tidak ada saluran yang match mereka dengan orang yang butuh bantuan.
4. **Transparansi harga:** Tidak ada standar harga, sering terjadi negosiasi tidak nyaman.

### 2.2 Solusi YUKgas.in
| Masalah | Solusi YUKgas.in |
|---|---|
| Kebutuhan tidak terstruktur | Sistem quest dengan judul, deskripsi, kategori, lokasi, deadline, kompensasi |
| Tidak ada kepercayaan | Hanya email @unu.ac.id yang bisa daftar + sistem rating bintang |
| Waktu luang tersia-sia | Feed quest yang bisa di-filter, ambil dengan satu klik |
| Tidak transparan | Kompensasi tampil jelas di setiap quest card |

---

## 3. Target Users

### 3.1 User Persona 1: Quest Giver (Pemberi Quest)
- **Profil:** Mahasiswa UNU, sibuk dengan kuliah/organisasi/kerja
- **Kebutuhan:** Butuh bantuan cepat untuk tugas kecil (beliin makan, jemput barang, print)
- **Pain point:** Susah minta tolong ke teman, gak enak, gak tahu siapa yang bersedia
- **Goal:** Dapat bantuan dengan cepat, harga wajar, orang terpercaya
- **Motivasi:** Efisiensi waktu

### 3.2 User Persona 2: Quest Taker (Pengambil Quest)
- **Profil:** Mahasiswa UNU, punya waktu luang antar jadwal kuliah
- **Kebutuhan:** Penghasilan tambahan kecil tapi rutin
- **Pain point:** Tidak tahu di mana bisa cari kerjaan kecil yang fleksibel
- **Goal:** Dapat uang tambahan tanpa komitmen jangka panjang
- **Motivasi:** Uang saku tambahan, membangun reputasi

### 3.3 Karakteristik User
- Usia: 18-25 tahun
- Lokasi: Sekitar kampus UNU Yogyakarta
- Device: Smartphone Android/iOS (dominan), laptop
- Digital literacy: Tinggi (gen Z, terbiasa dengan app marketplace)
- Behavior: Cari cepat, simple, responsive

---

## 4. Core Features (MVP)

### 4.1 Autentikasi & Keamanan
- Register dengan email @unu.ac.id (validasi domain)
- Login dengan email + password
- JWT-based session management
- Logout

### 4.2 Quest Management (Giver)
- Posting quest baru (judul, kategori, deskripsi, lokasi, deadline, kompensasi)
- Edit quest (hanya jika status OPEN)
- Batalkan quest (hanya jika status OPEN)
- Lihat quest yang saya posting

### 4.3 Quest Discovery (Taker)
- Browse feed quest dengan card view
- Search quest by keyword
- Filter by kategori (Transport, Makanan, Admin, Lainnya)
- Filter by range harga
- Sort by (terbaru, deadline terdekat, harga tertinggi/terendah)
- Pagination / infinite scroll

### 4.4 Quest Execution Flow
- Ambil quest dengan satu klik (hanya jika OPEN)
- Mulai progress (status: TAKEN → IN_PROGRESS)
- Tandai selesai (status: IN_PROGRESS → COMPLETED)
- Batalkan pengambilan (status: TAKEN → OPEN)

### 4.5 Pembayaran
- Pembayaran di luar sistem (cash atau QRIS)
- Taker menampilkan QRIS code di profil
- Giver konfirmasi pembayaran manual di app
- Setelah dikonfirmasi, fase rating terbuka

### 4.6 Rating & Reputasi
- Beri rating bintang 1-5 setelah quest selesai + dibayar
- Tulis ulasan teks (opsional)
- Reputation score = rata-rata semua rating yang diterima
- Rating ditampilkan di profil dan quest card

### 4.7 Profil Pengguna
- Lihat profil sendiri (stats: quests given, quests taken, rating)
- Edit profil (nama, bio, foto profil, QRIS code)
- Lihat profil user lain (public profile + ratings received)
- Lihat riwayat quest (sebagai giver dan taker)

---

## 5. User Stories

Format: **"Sebagai [role], saya ingin [goal], sehingga [benefit]"**

### 5.1 Autentikasi
| ID | User Story |
|---|---|
| US-01 | Sebagai mahasiswa UNU, saya ingin mendaftar menggunakan email kampus, sehingga saya bisa mengakses platform dengan aman. |
| US-02 | Sebagai pengguna terdaftar, saya ingin login dengan email dan password, sehingga saya bisa masuk ke akun saya. |
| US-03 | Sebagai pengguna yang sedang login, saya ingin logout, sehingga akun saya aman saat saya selesai menggunakan app. |

### 5.2 Quest Management (Giver)
| ID | User Story |
|---|---|
| US-04 | Sebagai quest giver, saya ingin memposting quest dengan detail lengkap, sehingga calon taker tahu apa yang harus dikerjakan dan berapa bayarannya. |
| US-05 | Sebagai quest giver, saya ingin mengedit quest yang belum diambil, sehingga saya bisa memperbaiki detail jika ada kesalahan. |
| US-06 | Sebagai quest giver, saya ingin membatalkan quest yang belum diambil, sehingga saya tidak rugi jika sudah tidak butuh. |
| US-07 | Sebagai quest giver, saya ingin melihat semua quest yang saya posting beserta statusnya, sehingga saya bisa melacak progress. |

### 5.3 Quest Discovery (Taker)
| ID | User Story |
|---|---|
| US-08 | Sebagai quest taker, saya ingin melihat feed quest yang tersedia, sehingga saya bisa memilih tugas yang sesuai. |
| US-09 | Sebagai quest taker, saya ingin mencari quest berdasarkan kata kunci, sehingga saya bisa cepat menemukan yang relevan. |
| US-10 | Sebagai quest taker, saya ingin memfilter quest berdasarkan kategori dan harga, sehingga saya bisa fokus pada quest yang sesuai preferensi saya. |
| US-11 | Sebagai quest taker, saya ingin mengambil quest dengan satu klik, sehingga prosesnya cepat dan tidak ribet. |

### 5.4 Quest Execution
| ID | User Story |
|---|---|
| US-12 | Sebagai quest taker, saya ingin memulai progress quest yang sudah saya ambil, sehingga giver tahu saya sedang mengerjakan. |
| US-13 | Sebagai quest taker, saya ingin menandai quest sebagai selesai, sehingga giver bisa konfirmasi dan membayar. |
| US-14 | Sebagai quest giver, saya ingin melihat QRIS code taker untuk pembayaran, sehingga saya bisa bayar tanpa tunai. |
| US-15 | Sebagai quest giver, saya ingin mengkonfirmasi bahwa pembayaran sudah dilakukan, sehingga quest benar-benar selesai dan rating bisa dibuka. |

### 5.5 Rating & Profil
| ID | User Story |
|---|---|
| US-16 | Sebagai pengguna, saya ingin memberi rating dan ulasan setelah quest selesai, sehingga pengguna lain tahu kualitas orang tersebut. |
| US-17 | Sebagai pengguna, saya ingin melihat profil user lain beserta rating dan riwayatnya, sehingga saya bisa menilai kredibilitas sebelum mengambil/memberi quest. |
| US-18 | Sebagai pengguna, saya ingin mengedit profil saya termasuk QRIS code, sehingga pembayaran QRIS bisa berjalan smooth. |
| US-19 | Sebagai pengguna, saya ingin melihat rating yang saya terima, sehingga saya tahu reputasi saya di platform. |

---

## 6. Quest Kategori

| Kategori | Icon | Contoh Quest | Estimasi Harga |
|---|---|---|---|
| 🚗 Transportasi | car | Antar jemput, titip barang, ambil paket di pos | Rp 3.000 - 15.000 |
| 🍔 Makanan & Belanja | utensils | Beliin makanan kantin, beliin kopi, belanja indomart | Rp 2.000 - 20.000 |
| 📄 Administrasi | file-text | Print, fotokopi, antri administrasi, perpanjang buku | Rp 2.000 - 10.000 |
| 📦 Lainnya | package | Bantuan belajar, titip task akhir, dll | Rp 5.000 - 50.000 |

---

## 7. Out of Scope (MVP)

Fitur berikut **TIDAK** termasuk dalam MVP, dicatat untuk pengembangan lanjutan:

| Fitur | Alasan Dikeluarkan |
|---|---|
| Payment gateway (Midtrans/Xendit) + escrow | Kompleksitas tinggi, butuh KYC bisnis |
| In-app chat / messaging | Bisa pakai WhatsApp sementara |
| WebSocket real-time notification | Polling sudah cukup untuk MVP |
| Email notification (Nodemailer/SendGrid) | Butuh setup SMTP, bisa pakai in-app notification |
| OTP/Magic link email verification | Domain check cukup untuk MVP akademik |
| Dark mode | Nice to have, bukan prioritas |
| Multi-language | Indonesia saja |
| Admin dashboard | Manual DB access cukup untuk skala kampus |
| Search user | Fokus ke quest, bukan social |
| Bookmark/favorit quest | Kurang kritis |

---

## 8. Success Metrics

### 8.1 Metrik Akademik (Target Demo)
- [ ] Semua 7 fitur utama berfungsi end-to-end
- [ ] Minimal 5 user terdaftar (anggota tim)
- [ ] Minimal 10 quest di-posting (dummy data)
- [ ] Minimal 5 quest completed dengan rating
- [ ] App bisa di-demo live di presentasi

### 8.2 Metrik Teknis
- [ ] Response time API < 500ms (95th percentile)
- [ ] Mobile-first responsive di semua halaman
- [ ] Zero critical security issues (password hashed, JWT aman)
- [ ] Code terstruktur dan terdokumentasi

### 8.3 Metrik Produk (Jika Launch)
- Quest posting rate: jumlah quest baru per minggu
- Quest completion rate: % quest yang berakhir COMPLETED (>70% target)
- Average rating: rata-rata score rating seluruh user (>4.0 target)
- User retention: % user yang kembali dalam 7 hari (>30% target)

---

## 9. Asumsi & Constraints

### 9.1 Asumsi
- Mahasiswa UNU punya email @unu.ac.id atau @students.unu.ac.id
- Pembayaran cash & QRIS sudah cukup (tidak butuh escrow)
- Pengguna mau memberi rating setelah quest selesai
- Skala pengguna < 500 orang (cukup untuk satu kampus)

### 9.2 Constraints
- Database gratis (Supabase free tier: 500MB storage)
- Backend hosting gratis (Railway/Render free tier: sleep after inactivity)
- Timeline akademik: ~10-12 minggu pengerjaan
- Tim 6 orang dengan peran berbeda

---

## 10. Glossary

| Istilah | Definisi |
|---|---|
| Quest | Permintaan bantuan yang diposting oleh user, berisi detail tugas + kompensasi |
| Quest Giver | User yang memposting quest (pemberi tugas) |
| Quest Taker | User yang mengambil dan mengerjakan quest |
| Reputation Score | Rata-rata rating bintang yang diterima user dari semua quest |
| QRIS | Quick Response Code Indonesian Standard, untuk pembayaran digital |
| JWT | JSON Web Token, untuk autentikasi stateless |
| Open | Status quest yang belum diambil siapa pun |
| Taken | Status quest yang sudah diambil tapi belum dimulai |
| In Progress | Status quest yang sedang dikerjakan |
| Completed | Status quest yang sudah selesai dikerjakan |
| Cancelled | Status quest yang dibatalkan oleh giver |
