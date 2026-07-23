# Panduan Testing Flow — YUKgas.in Mockup

> URL Production: https://yukgasin.vercel.app
> Local: `python3 -m http.server 8000 --directory public` → akses `localhost:8000/nama-file.html`
> Catatan: Python http.server TIDAK handle clean URLs. Pakai `.html` saat test lokal.

---

## Flow 1: Onboarding (Landing → Register → Dashboard)

```
/  →  /register  →  /dashboard
```

1. Buka `/` (landing page)
2. Klik navbar: **Daftar** → `/register`
3. Isi form bebas (apapun valid, skip auth)
4. Klik **Daftar Sekarang** → loading spinner → confetti → redirect `/dashboard`
5. **Verify**: Dashboard feed quest muncul (5 cards), bottom nav dengan FAB Gas!

**Alt path**: Landing → klik **Masuk** (navbar) → `/login` → isi form → **Masuk** → `/dashboard`

---

## Flow 2: Guest Preview Feed (Landing → Dashboard langsung)

```
/  →  /dashboard
```

1. Buka `/`
2. Klik CTA **Lihat Feed Quest** → `/dashboard`
3. **Verify**: Bisa lihat feed tanpa login (mockup mode, no gate)

---

## Flow 3: Explore Quest Detail (3 scenarios)

```
/dashboard  →  /quest-detail  (default = open)
```

Quest detail punya 3 state via query param `?state=`:

| URL | Scenario | Yang Muncul |
|-----|----------|-------------|
| `/quest-detail` | OPEN (default) | Tombol "Ambil Quest" |
| `/quest-detail?state=progress` | IN_PROGRESS | Progress stepper, tombol "Tandai Selesai" |
| `/quest-detail?state=completed` | COMPLETED | Completed badge, tombol "Beri Rating" |

**Test:**
1. Dari dashboard, klik salah satu quest card → `/quest-detail` (OPEN)
2. Klik **Ambil Quest** → YG.pop() circular animation → toast "Quest diambil!"
3. Ubah URL: tambah `?state=progress` → refresh → verify stepper muncul
4. Klik **Tandai Selesai** → YG.pop() → toast "Quest selesai!"
5. Ubah URL: `?state=completed` → refresh → verify completed state + tombol rating
6. Klik **Beri Rating** → `/rating` → rating modal interaktif (bintang)
7. Klik **Kembali** → balik ke `/quest-detail`

---

## Flow 4: Create Quest

```
/dashboard  →  /quests/create  →  /dashboard
```

1. Dari dashboard, klik **FAB Gas!** (bottom center, gradient sunset) → `/quests/create`
2. Isi form: judul, deskripsi, kategori, reward, lokasi, deadline
3. Watch live preview card update realtime
4. Klik **Gas Posting!** → YG.pop() → confetti → toast "Quest diposting!"
5. Redirect ke `/dashboard`

---

## Flow 5: My Quests (Giver & Taker)

```
/dashboard  →  /my-quests
```

1. Bottom nav → klik **QuestKu** → `/my-quests`
2. **Tab "Diberikan"**: Quest yang user bikin (4 cards)
   - 1 active (golden border), 1 completed, 2 open
3. **Tab "Diambil"**: Quest yang user ambil (3 cards)
4. Klik card → `/quest-detail`
5. Empty state: jika kosong, ada CTA "Bikin Quest Pertama"

---

## Flow 6: Notifications

```
/dashboard  →  /notifications
```

1. Bottom nav → klik **Notif** (ada red badge "3") → `/notifications`
2. **Verify**: 7 notifikasi, 3 sections (Today/Yesterday/Earlier)
3. Filter tabs: Semua / Quest / Rating / Sistem
4. Notif unread: ada dot orange di pojok kanan
5. Klik notif → navigate ke `/quest-detail` atau `/user-profile`

---

## Flow 7: Profile & Logout

```
/dashboard  →  /profile  →  /login
```

1. Bottom nav → klik **Profil** → `/profile`
2. **Verify**: Avatar, nama, rating, stats (15 Diberikan, 5 Diambil)
3. Edit profil (toggle edit mode)
4. Klik **Keluar** → redirect ke `/login`

---

## Flow 8: View Other User Profile

```
/quest-detail  →  /user-profile
```

1. Di quest detail, klik avatar/nama Giver → `/user-profile`
2. **Verify**: Read-only profile (Nicky), rating 4.9, reviews list
3. Klik back → `/quest-detail`

---

## Flow 9: Rating Modal Demo

```
/rating (direct access)
```

1. Buka `/rating`
2. Klik **Beri Rating** → modal muncul
3. Klik bintang 1-5 → highlight berubah
4. Tulis review
5. Submit → YG.pop() → toast "Rating terkirim!"
6. Modal bisa dibuka ulang

---

## Checklist Interaksi Wajib Cek

| Feature | Dimana | Expected |
|---------|--------|----------|
| YG.toast() | Setiap action | Muncul atas, auto-hilang 2.5s |
| YG.confetti() | Register/Login/Create Quest | Burst partikel sunset/golden |
| YG.pop() | Ambil quest, selesai quest | Circular ring → icon pop → fade |
| Page transition | Setiap klik link | Slide exit kanan → slide enter kiri |
| Ripple effect | Setiap button/link | Ripple sunset dari titik klik |
| Bottom nav FAB | Dashboard, My Quests, Notif, Profil | Hover rotate-90, gradient sunset |
| Lucide icons | Semua halaman | Semua icon render (bukan kotak kosong) |

---

## Routes Map (vercel.json)

| Route | File |
|-------|------|
| `/` | index.html |
| `/login` | login.html |
| `/register` | register.html |
| `/dashboard` | dashboard.html |
| `/quests` | dashboard.html |
| `/quests/create` | create-quest.html |
| `/quests/:id` | quest-detail.html |
| `/my-quests` | my-quests.html |
| `/notifications` | notifications.html |
| `/profile` | my-profile.html |
| `/users/:id` | user-profile.html |
| `/rating` | rating-modal.html |

---

## Known Limitations (Mockup)

- Login/register: **skip auth** (apapun input → dashboard)
- Tidak ada backend, data statis
- Bottom nav tidak persistent antara landing & dashboard (by design)
- Quest detail scenario pakai URL param (`?state=`) bukan state management
