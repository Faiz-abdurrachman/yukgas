# Prompt Templates — Untuk Brainstorming UI dengan Gemini

> Copy-paste prompt di bawah ke Gemini/AI lain. Ganti `[PASTE FILE]` dengan isi file `.md` yang sesuai.

---

## DESIGN PHILOSOPHY GLOBAL (Baca dulu sebelum prompt apapun)

```
DESIGN PHILOSOPHY YUKGAS.IN:

VIBE: Clean, warm, cheerful, tapi profesional. Bayangkan vibe-nya kayak Linear/Stripe/Vercel tapi versi yang lebih hangat dan friendly untuk mahasiswa Indonesia. Bukan overdesigned, bukan penuh gradasi norak, bukan card melayang-melayang.

PRINSIP UTAMA:
1. CLEAN OVER DECORATED — Sedikit dekorasi tapi maksimal fungsi. Whitespace adalah teman.
2. WARM COLORS — Pakai palet hangat (orange, amber, warm yellow) sebagai primary, bukan biru/ungu yang generic AI.
3. NO GRADASI NORAK — Gradasi boleh tapi SUBTLE. Maksimal untuk 1-2 elemen accent (button primary, hero badge). Jangan gradasi di mana-mana.
4. NO FLOATING CARDS GAJELAS — Card harus punya konteks, jangan melayang random dengan shadow berlebihan.
5. FLAT DENGAN DEPTH — Flat design tapi dengan depth halus (border subtle, shadow lembut, bukan glassmorphism berlebihan).
6. TIPOGRAFI STRONG — Plus Jakarta Sans, heading bold, hierarchy jelas.
7. INDONESIAN FRIENDLY — Teks Bahasa Indonesia, format Rupiah, vibe lokal kampus.

COLOR PALETTE (FIXED, PAKAI INI):
- Primary: #F97316 (Orange-500) — warm, energetic, cheerful
- Primary Dark: #EA580C (Orange-600) — untuk hover
- Primary Light: #FFF7ED (Orange-50) — untuk background accent halus
- Secondary: #0F172A (Slate-900) — untuk text dan dark section
- Accent: #FBBF24 (Amber-400) — untuk highlight kecil, badge
- Success: #10B981 (Emerald-500) — untuk status positif
- Background: #FAFAF9 (Stone-50) — warm white, BUKAN pure white
- Card: #FFFFFF — pure white untuk card
- Border: #F1F5F9 (Slate-100) — border subtle
- Text Primary: #0F172A (Slate-900)
- Text Secondary: #64748B (Slate-500)
- Text Muted: #94A3B8 (Slate-400)

FONT:
- Plus Jakarta Sans (wajib, load dari Google Fonts)
- Weight: 400 (body), 500 (label), 600 (semibold), 700 (bold), 800 (extrabold heading)

RULES:
- DILARANG emoji Unicode (🚀🍔🚗). Pakai Lucide Icons via CDN.
- DILARANG glassmorphism berlebihan (backdrop-blur di mana-mana).
- DILARANG floating card random tanpa konteks.
- DILARANG gradasi di setiap elemen. Gradasi MAX untuk button primary dan 1 hero accent.
- DILARANG blob shape abstract yang ga jelas.
- BOLEH: shadow lembut (shadow-sm, shadow-md), border subtle, rounded-xl/2xl, micro-interaction hover.
- BOLEH: icon dengan background circle berwarna lembut (bg-orange-50, icon orange).
- BOLEH: 1 ilustrasi/hero image yang relevant (bukan abstract blob).
```

---

## PROMPT 1: KONTEKS GLOBAL (Share sekali di awal conversation)

```
Hai, aku lagi bikin web app bernama YUKgas.in — marketplace micro-task khusus kampus UNU (Universitas Nahdlatul Ulama Yogyakarta). Mahasiswa posting "quest" (permintaan bantuan kecil seperti beliin makanan, jemput barang, print dokumen) dengan kompensasi, dan mahasiswa lain bisa ambil quest itu untuk dikerjakan dan dibayar.

Tech stack: React.js + Tailwind CSS, mobile-first design.

Ini dokumen PRD dan SRS project-nya:

[PASTE ISI prd.md]

[PASTE ISI srs.md]

Dan ini DESIGN PHILOSOPHY yang harus diikuti di semua halaman:

[PASTE ISI DESIGN PHILOSOPHY GLOBAL di atas]

Tolong baca dan pahami dulu. Nanti aku akan minta tolong design UI per halaman satu per satu. Konfirmasi kalau kamu udah paham.
```

---

## PROMPT 2: DESIGN LANDING PAGE

```
Aku mau mulai design Landing Page (halaman pertama yang dilihat user sebelum login).

Ini detail spec halamannya:

[PASTE ISI docs/pages/01-landing.md]

REQUIREMENT DESIGN (sudah ada Design Philosophy di atas, ini tambahan spesifik):

LAYOUT:
- Mobile-first 375px, responsive ke tablet/desktop
- Navbar minimal: logo kiri, tombol "Login" + "Daftar" kanan
- Hero section: heading bold + subtext + CTA button. SIMPLE. Jangan berlebihan dekorasi.
  - Bisa pakai 1 ilustrasi di samping (kalau desktop) atau di atas (kalau mobile)
  - Background: warm white (#FAFAF9) atau subtle pattern dots, BUKAN gradasi norak
- How It Works: 3 langkah horizontal (desktop) / vertical (mobile), icon + judul + deskripsi pendek
- Category Showcase: 4 kategori, grid 2x2 (mobile) / 4 kolom (desktop). Icon di circle berwarna lembut.
- CTA Section: section dengan background primary (orange) ATAU slate-900, teks putih, 1 tombol
- Footer: minimal, copyright + links

COMPONENT STYLE:
- Button primary: background orange (#F97316), text putih, rounded-xl, hover:bg-orange-600, shadow-sm. JANGAN gradasi.
- Button secondary: outline border slate-200, text slate-700, hover:bg-slate-50
- Card: bg-white, border border-slate-100, rounded-2xl, shadow-sm. Jangan shadow-lg berlebihan.
- Icon: Lucide Icons, ukuran 24px, warna orange untuk primary, slate untuk neutral
- Category icon: background circle bg-orange-50/bg-amber-50/bg-emerald-50, icon 24px di tengah

OUTPUT:
- Full HTML file, Tailwind CSS via CDN (https://cdn.tailwindcss.com)
- Plus Jakarta Sans via Google Fonts
- Lucide Icons via CDN (https://unpkg.com/lucide@latest)
- Bisa langsung dibuka di browser
- Comment HTML di section penting

Bikin CLEAN dan ELEGAN. Target: mahasiswa lihat ini mikir "rapi, friendly, terpercaya" — bukan "wow banyak efek" tapi berantakan.
```

---

## PROMPT 3: DESIGN REGISTER PAGE

```
Sekarang design Register Page.

Detail spec:

[PASTE ISI docs/pages/02-register.md]

REQUIREMENT:
- Mobile-first (375px), center form di desktop (max-width 400px)
- Layout SPLIT kalo desktop: kiri ilustrasi/branding, kanan form. Kalo mobile: form doang.
- Form clean: label di atas input, input border slate-200 rounded-xl, focus:border-orange-500 focus:ring-2 focus:ring-orange-100
- Validasi error: text merah text-red-500 text-sm di bawah field, border field jadi red
- Show/hide password toggle (icon eye/eye-off dari Lucide)
- Button primary: orange, full width, loading state dengan spinner
- Snackbar/toast error: fixed top, slide down, bg-red-50 border-red-200 text-red-700
- Helper text: text-xs text-slate-400 di bawah field
- Character counter: text-xs text-slate-400, berubah orange kalo mendekati limit

Consistent dengan Landing Page (font, color, spacing). JANGAN tambah dekorasi berlebihan. Form harus fokus dan gampang diisi.

Output: HTML + Tailwind CSS, langsung jalan.
```

---

## PROMPT 4: DESIGN LOGIN PAGE

```
Design Login Page.

Detail spec:

[PASTE ISI docs/pages/03-login.md]

REQUIREMENT:
- Consistent dengan Register Page (split layout di desktop, form center di mobile)
- Autofocus di email field (autofocus attribute)
- Show/hide password toggle
- Button primary orange, loading spinner
- Error toast untuk invalid credentials
- Link ke register

Sama persis struktur-nya dengan Register, cuma 2 field (email + password). Jangan overdesain.

Output: HTML + Tailwind CSS, mobile-first.
```

---

## PROMPT 5: DESIGN DASHBOARD / QUEST FEED

```
Design halaman Dashboard / Quest Feed. Ini home base setelah login.

Detail spec:

[PASTE ISI docs/pages/04-dashboard.md]

REQUIREMENT:
- Mobile-first, layout yang rapi dan scalable

KOMPONEN (bikin CLEAN, jangan berlebihan):
1. TopBar: bg-white border-b border-slate-100, sticky top-0. Kiri: hamburger (Lucide menu). Tengah: logo text "YUKgas" bold. Kanan: icon lonceng (Lucide bell) + avatar circle.
2. SearchBar: input dengan icon search Lucide di kiri, bg-slate-50 rounded-xl. Sticky di bawah topbar.
3. FilterBar: horizontal scroll. Chip-style: bg-slate-100 text-slate-600 rounded-full px-4 py-2. Active chip: bg-orange-500 text-white.
4. QuestCard (PALING PENTING):
   - bg-white, border border-slate-100, rounded-2xl, p-4
   - Row 1: badge kategori (kecil, rounded-full, bg warna kategori light + text warna kategori dark) + harga di kanan (font-bold text-slate-900)
   - Row 2: judul font-semibold text-slate-900 (truncate 1 baris)
   - Row 3: deskripsi text-sm text-slate-500 (line-clamp-2)
   - Row 4: icon map-pin + lokasi text-xs text-slate-400 (kiri), icon clock + deadline text-xs (kanan)
   - Row 5: avatar kecil 24px + nama text-xs text-slate-600 (kiri), bintang rating text-xs (kanan)
   - Hover: shadow-md, border-slate-200. Active: scale-[0.98].
   - KATEGORI BADGE COLOR:
     - Transport: bg-blue-50 text-blue-600
     - Makanan: bg-orange-50 text-orange-600
     - Admin: bg-emerald-50 text-emerald-600
     - Lainnya: bg-violet-50 text-violet-600
5. FAB: posisi fixed bottom-right, bg-orange-500 text-white rounded-full w-14 h-14 shadow-lg. Icon plus Lucide. Hover: bg-orange-600 scale-105.
6. BottomNav: fixed bottom, bg-white border-t border-slate-100. 3 item: Feed (home icon), QuestKu (list icon), Profil (user icon). Active: text-orange-500. Inactive: text-slate-400.
7. SkeletonCard: bg-slate-100 rounded-2xl, animate-pulse. Bentuk menyerupai QuestCard.
8. EmptyState: icon besar (Lucide inbox, slate-300), text "Belum ada quest", button orange.

Bikin 4 QuestCard dengan data dummy realistic (Bahasa Indonesia, harga Rupiah).

Output: HTML + Tailwind CSS, langsung jalan. Fokus ke QuestCard — itu jantung halaman ini.
```

---

## PROMPT 6: DESIGN QUEST DETAIL PAGE

```
Design halaman Quest Detail (paling kompleks karena context-dependent action).

Detail spec:

[PASTE ISI docs/pages/05-quest-detail.md]

REQUIREMENT:
- Layout: scrollable content, action button STICKY di bottom (fixed)

KOMPONEN:
1. TopBar: back button (icon arrow-left), bg-white border-b
2. StatusBadge: rounded-full px-3 py-1 text-xs font-medium
   - Open: bg-emerald-50 text-emerald-600
   - Taken: bg-blue-50 text-blue-600
   - In Progress: bg-amber-50 text-amber-600
   - Completed: bg-violet-50 text-violet-600
   - Cancelled: bg-red-50 text-red-600
3. QuestHeader: judul text-2xl font-bold text-slate-900, category badge di bawah
4. InfoCard: bg-white border rounded-2xl p-4. Setiap info (deskripsi, kompensasi, lokasi, deadline) dalam row dengan icon Lucide di kiri.
   - Kompensasi: text-xl font-bold text-orange-600
   - Deadline warning: text-red-500 kalau < 1 jam
5. GiverCard/TakerCard: horizontal, avatar 48px circle + info di kanan. Clickable, hover:bg-slate-50.
6. ProgressStepper: horizontal 4 step. Garis penghubung. Step done: bg-orange-500. Current: bg-orange-500 + ring. Future: bg-slate-200. Label text-xs di bawah.
7. ActionButton: sticky bottom, full width, bg-orange-500 text-white rounded-xl py-3 font-semibold. Variant:
   - Primary action (Ambil, Mulai, Selesai): bg-orange-500
   - Secondary (Edit): bg-white border text-slate-700
   - Danger (Batalkan): bg-white border-red-200 text-red-600
8. PaymentModal: overlay bg-black/50, modal card bg-white rounded-2xl p-6 max-w-sm center. QR code placeholder (div bg-slate-100 w-48 h-48). Radio button Cash/QRIS.
9. RatingSection: card per rating. Avatar + nama rater, bintang (Lucide star filled/unfilled), review text italic, timestamp text-xs text-slate-400.

Bikin 3 SKENARIO terpisah (bisa 3 section di 1 file, atau 3 file):
1. OPEN sebagai pihak ketiga → tombol "Ambil Quest"
2. IN_PROGRESS sebagai TAKER → tombol "Tandai Selesai"
3. COMPLETED belum bayar sebagai GIVER → tombol "Konfirmasi Pembayaran" + modal

Output: HTML + Tailwind CSS, mobile-first, langsung jalan.
```

---

## PROMPT 7: DESIGN CREATE QUEST PAGE

```
Design halaman Create Quest (form posting quest baru).

Detail spec:

[PASTE ISI docs/pages/06-create-quest.md]

REQUIREMENT:
- Mobile-first, form yang clean dan mudah diisi

LAYOUT:
- TopBar: close button (X) kiri, judul "Posting Quest" tengah
- Form scrollable, SubmitButton sticky di bottom (fixed, bg-orange-500)

FORM FIELD STYLE:
- Label: text-sm font-medium text-slate-700, mb-1.5
- Input: w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900. focus:border-orange-500 focus:ring-2 focus:ring-orange-100. placeholder text-slate-400.
- Error: border-red-300, text-red-500 text-xs mt-1
- Helper text: text-xs text-slate-400 mt-1
- Character counter: text-xs text-slate-400, float right

KATEGORI SELECTOR:
- Radio cards 2x2 grid, bukan dropdown
- Setiap card: border border-slate-200 rounded-xl p-3, icon Lucide + label
- Selected: border-orange-500 bg-orange-50

LIVE PREVIEW:
- Section "Preview Quest" dengan label
- Render QuestCard (sama style dengan Dashboard) dengan data real-time dari form
- Kalau form kosong, tampilkan placeholder "Lengkapi form untuk melihat preview"

KOMPENSASI INPUT:
- Prefix "Rp" di kiri input (input group)
- Format ribuan otomatis (optional, bisa JS)

DEADLINE PICKER:
- Native HTML datetime-local input, style dengan Tailwind
- Atau 2 input: date + time

Output: HTML + Tailwind CSS. Fokus ke UX form yang enak diisi di HP.
```

---

## PROMPT 8: DESIGN MY QUESTS PAGE

```
Design halaman My Quests (quest yang berkaitan dengan user).

Detail spec:

[PASTE ISI docs/pages/07-my-quests.md]

REQUIREMENT:
- Mobile-first, clean list view

LAYOUT:
- TopBar: back button + judul "Quest Saya"
- TabBar: 2 tab side by side, full width. Active: text-orange-500, border-b-2 border-orange-500. Inactive: text-slate-500. Background bg-white border-b border-slate-100.
- Filter dropdown (opsional): chip style
- List of QuestListItem

QUESTLISTITEM (lebih compact dari QuestCard dashboard):
- bg-white border border-slate-100 rounded-xl p-3
- Row 1: StatusBadge (kecil) di kiri, harga di kanan
- Row 2: judul font-medium text-slate-900 truncate
- Row 3: info counterpart (icon user + nama) text-xs text-slate-500
- Row 4: deadline text-xs text-slate-400
- Hover: bg-slate-50

EMPTY STATE per tab:
- Diberikan: icon (Lucide package-open), "Belum ada quest yang kamu posting", button "Posting Quest"
- Diambil: icon (Lucide hand-helping), "Belum ada quest yang kamu ambil", button "Cari Quest"

Bikin 4-5 QuestListItem dengan data dummy per tab.

Output: HTML + Tailwind CSS, mobile-first.
```

---

## PROMPT 9: DESIGN USER PROFILE PAGE

```
Design halaman User Profile (profil publik user lain).

Detail spec:

[PASTE ISI docs/pages/08-user-profile.md]

REQUIREMENT:
- Mobile-first, layout yang trustworthy dan informatif

LAYOUT:
- TopBar: back button + judul "Profil"
- ProfileHeader: center atau left-align. Avatar 80px circle (kalau null, inisial nama di circle bg-orange-100 text-orange-600 font-bold). Nama text-xl font-bold. Bio text-sm text-slate-500.
- StatsCard: 3 kolom (rating, diberikan, diambil). bg-white border rounded-2xl p-4. Angka text-2xl font-bold text-slate-900, label text-xs text-slate-400.
- QRISCard: bg-white border rounded-2xl p-4. Label "Pembayaran QRIS". QR placeholder (div bg-slate-100 w-40 h-40 center, atau pakai QR code generator library). Caption text-xs text-slate-400.
- RatingList: section "Ulasan" dengan count. Tiap RatingCard:
  - bg-white border rounded-xl p-3
  - Header: avatar 32px + nama rater text-sm font-medium
  - Bintang: Lucide star (filled orange, unfilled slate-200), size 16px
  - Review: text-sm text-slate-600 italic (kalau ada)
  - Quest ref: text-xs text-orange-600 (clickable)
  - Timestamp: text-xs text-slate-400

Bikin dengan data dummy realistic (3-4 rating).

Output: HTML + Tailwind CSS, mobile-first.
```

---

## PROMPT 10: DESIGN MY PROFILE / SETTINGS PAGE

```
Design halaman My Profile (profil sendiri + edit).

Detail spec:

[PASTE ISI docs/pages/09-my-profile.md]

REQUIREMENT:
- Mobile-first, form yang user-friendly

LAYOUT:
- TopBar: back button + judul "Profil Saya"
- ProfileHeader (read-only): avatar + nama + email + stats (sama dengan User Profile)
- EditForm section:
  - Avatar upload: avatar circle 80px + icon camera overlay (click to upload)
  - Input nama: style standar form
  - Textarea bio: style standar, dengan character counter
  - QRIS upload: dashed border area (border-dashed border-slate-300 rounded-2xl p-6), icon upload + text "Klik untuk upload QRIS". Kalau sudah ada, tampilkan preview + tombol "Ganti" / "Hapus".
- SaveButton: bg-orange-500 text-white full width rounded-xl py-3, sticky bottom atau di akhir form
- LogoutButton: bg-white border border-red-200 text-red-600 full width rounded-xl py-3
- AppInfo: text-center text-xs text-slate-400 mt-8

Logout modal: overlay bg-black/50, modal card kecil. Button "Batal" (slate) + "Keluar" (red).

Output: HTML + Tailwind CSS. Form yang clean dan gampang dipakai.
```

---

## PROMPT 11: DESIGN RATING MODAL

```
Design Rating Modal (muncul di atas Quest Detail Page).

Detail spec:

[PASTE ISI docs/pages/10-rating-modal.md]

REQUIREMENT:
- Modal overlay: fixed inset-0 bg-black/50, flex center
- Modal card: bg-white rounded-2xl p-6, max-w-sm w-[90%], shadow-xl
- Close button: icon X di pojok kanan atas, text-slate-400 hover:text-slate-600
- Header: "Beri Penilaian" text-lg font-bold
- RateeInfo: avatar 40px + nama + role label text-xs text-slate-500
- StarRating: 5 bintang Lucide (star), size 32px. Interaktif dengan vanilla JS:
  - Hover: preview fill sampai index hover
  - Click: set value
  - Filled: text-orange-500 fill-orange-500 (pakai SVG fill)
  - Empty: text-slate-200
  - Label dynamic di bawah: "Sangat Buruk" / "Buruk" / "Cukup" / "Baik" / "Sangat Baik"
- ReviewInput: textarea, placeholder "Bagikan pengalamanmu... (opsional)", max 300 char + counter
- SubmitButton: bg-orange-500, disabled kalau belum pilih bintang (bg-slate-200 text-slate-400)
- SkipLink: text-xs text-slate-400 text-center, "Lewati untuk sekarang"

Bikin interaktif dengan vanilla JS (star hover, click, label update).

Output: HTML + Tailwind CSS + vanilla JS. Mobile-first, langsung jalan.
```

---

## TIPS PENGGUNAAN

### Urutan recommended:
1. **Design Philosophy Global** + **Prompt 1** — share konteks dulu
2. **Prompt 2** (Landing) — halaman pertama
3. **Prompt 5** (Dashboard) — halaman utama
4. **Prompt 6** (Quest Detail) — paling kompleks
5. Sisanya urutan bebas

### Kalau hasil masih terlalu AI / norak:
```
Hasilnya masih kurang pas. Tolong revisi:
- KURANGI dekorasi. Buang [sebutkan: gradasi/floating card/blob/shadow berlebihan]
- Lebih CLEAN dan MINIMAL. Referensi: [Linear / Stripe / Vercel docs vibe]
- Warna harus hangat (orange/amber), bukan [sebutkan warna yang dipakai]
- Pastikan whitespace cukup, jangan padat
- Font Plus Jakarta Sans, heading pakai font-extrabold
```

### Kalau mau iterasi komponen spesifik:
```
Pada halaman [nama], ubah komponen [nama komponen]:
[deskripsi perubahan spesifik]
Update hanya bagian itu, jangan ubah yang lain.
```
