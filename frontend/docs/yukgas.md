# LAPORAN

# PROYEK PENGEMBANGAN APLIKASI BERBASIS WEB

```
Disusun Oleh:
```
## Nicky Marlika Ismaya [241111011]

## Mohammad Hilman Al Hakim [241111017]

## Faiz Abdurrachman [241111021]

## Esa Maulidia Al Faruq [241111023]

## Imroatu Zakiyah [241111032]

## Aldo Yulian Widyadewangga [241111037]

# PROGRAM STUDI INFORMATIKA

# FAKULTAS TEKNOLOGI INFORMASI

# UNIVERSITAS NAHDLATUL ULAMA YOGYAKARTA

# 2026


## BAB I

## PENDAHULUAN

**1.1 Latar Belakang**
Mahasiswa dalam kehidupan sehari-hari di kampus kerap memiliki kebutuhan
kecil yang memerlukan bantuan orang lain, mulai dari keperluan transportasi, pembelian
makanan, pencetakan dokumen, hingga bantuan belajar. Selama ini kebutuhan tersebut
dipenuhi secara informal melalui grup WhatsApp atau pesan pribadi yang tidak
terstruktur dan tidak memiliki sistem kepercayaan yang jelas.
Disisi lain, banyak mahasiswa yang memiliki waktu luang dan keahlian tertentu
namun tidak memiliki saluran yang mempertemukan mereka dengan sesama mahasiswa
yang membutuhkan bantuan. YUKgas.in hadir sebagai platform web marketplace
micro-task khusus kampus yang menjembatani kedua pihak tersebut dalam satu ekosistem
yang terstruktur, aman, dan terbatas hanya untuk civitas akademika UNU.
**1.2 Rumusan Masalah**

1. Bagaimana menyediakan platform yang mempertemukan mahasiswa yang
    membutuhkan bantuan dengan mahasiswa yang bersedia menawarkan jasa secara
    terstruktur dalam lingkungan kampus UNU?
2. Bagaimana membangun sistem kepercayaan yang memastikan seluruh pengguna
    merupakan bagian dari civitas akademika UNU?


**1.3 Tujuan**

1. Membangun platform web marketplace micro-task yang menghubungkan
    mahasiswa UNU sebagai pemberi quest dan pengambil quest.
2. Mengimplementasikan autentikasi berbasis akun institusi UNU untuk keamanan
    dan kepercayaan pengguna.
3. Menyediakan sistem rating dan reputasi sebagai mekanisme akuntabilitas antar
    pengguna.
**1.4 Manfaat**
Bagi mahasiswa sebagai pemberi quest, mereka memperoleh kemudahan
menemukan bantuan dengan harga yang transparan. Bagi mahasiswa sebagai pengambil
quest, mereka mendapatkan peluang penghasilan tambahan yang fleksibel sesuai waktu
luang. Bagi ekosistem kampus, platform ini mendorong budaya saling membantu yang
lebih terorganisir dan mempererat koneksi antar mahasiswa.


## BAB II

# DESKRIPSI APLIKASI

**2.1 Gambaran Umum**
YUKgas.in adalah platform web berbasis sistem quest, dimana pengguna dapat
memposting permintaan bantuan beserta kompensasi yang ditawarkan, dan pengguna lain
dapat mengambil serta menyelesaikan quest tersebut untuk mendapatkan bayaran.
Seluruh pengguna diwajibkan login menggunakan akun email resmi UNU, sehingga
ekosistem platform terbatas pada civitas akademika kampus.
**2.2 Kategori Quest
Kategori Contoh Quest**
Transportasi Antar jemput ,titip barang,ambil paket di pos
kampus
Makanan dan Belanja Beliin makanan di kantin atau warung sekitar
kampus
Administrasi Print, fotokopi, perpanjang pinjaman buku, antri
administrasi


**2.3 Fitur Utama**

- Login dengan email UNU — hanya civitas akademika yang dapat mengakses
    platform.
- Posting quest — isi judul, deskripsi, kategori, lokasi, deadline, dan kompensasi.
- Feed quest — daftar quest tersedia dengan filter kategori dan harga.
- Ambil quest — pengguna yang berminat mengambil quest dengan satu klik.
- Manajemen status — alur quest dari Open, Taken, In Progress, hingga Completed.
- Rating & ulasan — kedua pihak saling memberi penilaian setelah quest selesai.
- Profil pengguna — menampilkan reputasi, riwayat quest, dan ulasan yang
    diterima.
**2.4 Sistem Pembayaran**
Pembayaran dilakukan secara langsung antara pemberi quest dan pengambil quest
di luar sistem aplikasi, dengan dua metode yang didukung. Pertama, pembayaran tunai
(cash) yang diserahkan secara langsung setelah quest selesai. Kedua, QRIS dimana setiap
pengguna dapat mencantumkan kode QRIS pribadi mereka di halaman profil, sehingga
pemberi quest dapat melakukan pembayaran melalui aplikasi perbankan masing-masing.
Konfirmasi pembayaran dilakukan secara manual oleh pemberi quest di dalam aplikasi.


## BAB III

## RENCANA PENGEMBANGAN TEKNIS

**3.1 Arsitektur Sistem**
Aplikasi YUKgas.in dibangun menggunakan arsitektur client-server dengan
pemisahan antara frontend dan backend. Keduanya berkomunikasi melalui REST API.
Frontend menangani tampilan dan interaksi pengguna, sementara backend mengelola
logika bisnis, autentikasi, dan akses ke basis data.
**3.2 Tech Stack
Lapisan Teknologi Fungsi**
Frontend React.js + Tailwind CSS Antarmuka pengguna berbasis
komponen
Backend Node.js + Express.js REST API dan logika bisnis
Basis Data PostgreSQL + Prisma ORM Penyimpanan data relasional
Autentikasi JWT (JSON Web Token) Manajemen sesi dan validasi email
UNU
Hosting Frontend Vercel Deployment aplikasi React
Hosting Backend Railway / Render Deployment server Node.js
Hosting Database Supabase Managed PostgreSQL gratis
**3.3 Skema Basis Data**
Basis data terdiri dari empat tabel utama. Tabel users menyimpan data pengguna
termasuk email UNU, profil, dan skor reputasi. Tabel quests menyimpan detail setiap
quest beserta relasi ke pengguna sebagai giver dan taker. Tabel ratings menyimpan
penilaian bintang dan ulasan antar pengguna setelah quest selesai. Tabel quest_history
mencatat log perubahan status quest untuk keperluan transparansi dan audit.


## BAB IV

## TIM DAN PEMBAGIAN TUGAS

**No Nama NIM Peran & Tanggung Jawab**

1. Nicky^ Marlika^ Ismaya^ [241111011]^ Project Manager—Koordinasi tim dan
    memastikan timeline berjalan sesuai rencana
    ,dan menjadi representasi tim dalam
    presentasi.
2. Mohammad^ Hilman^ Al^
    Hakim

[241111017] (^) Frontend Developer—Membangun semua
halaman UI menggunakkan React.js dan
Tailwind CSS,dan integritas tampilan REST
API backend

3. Faiz Abdurrachman [241111021] Backend & Database—Membangun REST
    API dan logika bisnis menggunakkan Node.js
    +Express.js dan merancang skema
    database,setup supabase,dan migrasi prisma.
4. Esa^ Maulidia^ Al^ Faruq^ [241111023]^ Technical Writer—Menyusun dan merapikan
    laporan proyek,dan membuat materi slide
    presentasi dan dokumentasi fitur aplikasi.
5. Imroatu^ Zakiyah^ [241111032]^ QA/tester—Melakukan testing manual seluruh
    fitur aplikasi,dan mencatat dan melaporkan
    bug kepada tim pengembang
6’ Aldo^ Yulian^
    Widyadewangga

[241111037] (^) UI/UX Designer—Membuat wireframe dan
desain antarmuka di Figma,dan menyusun
design system sebagai acuan frontend.


## BAB V

# TIMELINE PENGERJAAN

**Periode Tahap Kegiatan**
Minggu 1-2 Penentuan ide &
deskripsi Proyek
Menentukan ide aplikasi ,
membuat deskripsi proyek ,
dan pengumpulan judul..
Minggu 3-4 Desain Sistem & UI/UX Membuat wireframe(Figma),
merancang tampilan
aplikasi,dan alur sistem.
Minggu 5-6 Core Development Pembuatan backend ( database
& API ) dan frontend dasar.
Minggu 7-9 Advanced Development Menyelesaikan fitur utama
dan persiapan progress check
Minggu 10 Finalisasi & presentasi Testing,perbaikan,dan
persiapan presentasi
(Pertemuan 14-15 & UAS)


### BAB VI

### PENUTUP

**6.1 Kesimpulan**
YUKgas.in dirancang sebagai solusi nyata atas ketiadaan platform terstruktur
yang mempertemukan mahasiswa yang membutuhkan bantuan dengan mahasiswa yang
ingin menawarkan jasa di lingkungan kampus UNU. Dengan pembatasan akses berbasis
akun institusi, sistem quest yang jelas, serta dukungan pembayaran cash dan QRIS,
platform ini berpotensi memberikan manfaat langsung bagi ekosistem kampus sekaligus
menjadi sarana bagi tim untuk mengaplikasikan konsep rekayasa web secara menyeluruh.
**6.2 Rencana Pengembangan Lanjutan**

- Integrasi payment gateway (Midtrans/Xendit) dengan mekanisme escrow untuk
    keamanan transaksi yang lebih baik.
- Fitur in-app chat agar komunikasi antara pemberi dan pengambil quest tidak perlu
    keluar dari platform.
- Notifikasi real-time berbasis WebSocket untuk pemberitahuan instan perubahan
    status quest.


