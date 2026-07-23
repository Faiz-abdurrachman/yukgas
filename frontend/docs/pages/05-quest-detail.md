# 05. Quest Detail Page

## Route
`/quests/:id`

## Purpose
Menampilkan detail lengkap satu quest beserta info giver, taker (jika ada), progress status, dan action button yang **context-dependent** berdasarkan role user dan status quest. Ini halaman paling kompleks karena banyak kombinasi state.

## Access
- **Authenticated only** — redirect ke `/login` jika belum login
- **Quest must exist** — 404 page jika quest tidak ditemukan

---

## UI Components

### 1. BackButton
- **Type:** Icon button (← arrow)
- **Position:** Top-left
- **Action:** Navigate ke page sebelumnya (`/dashboard` atau `/my-quests`)

### 2. StatusBadge
- **Type:** Pill/badge dengan warna sesuai status
- **Position:** Top, di bawah back button
- **Variants:**
  - 🟢 OPEN — warna hijau
  - 🔵 TAKEN — warna biru
  - 🟡 IN PROGRESS — warna kuning
  - 🟣 COMPLETED — warna ungu
  - 🔴 CANCELLED — warna merah

### 3. QuestHeader
- **Type:** Section block
- **Isi:**
  - Judul quest (font besar, bold)
  - CategoryBadge (icon + text kategori)

### 4. QuestInfo (Section Cards)
- **DescriptionCard:**
  - Label: "📝 Deskripsi"
  - Content: Full text deskripsi quest
- **CompensationCard:**
  - Label: "💰 Kompensasi"
  - Value: "Rp 5.000" (besar, bold, warna primary)
- **LocationCard:**
  - Label: "📍 Lokasi"
  - Value: Text lokasi (misal "Pos Satpam Kampus UNU")
- **DeadlineCard:**
  - Label: "⏰ Deadline"
  - Value: "20 Juni 2026, 14:00 WIB" + relative time "(2 jam lagi)"
  - **Warning color** jika deadline < 1 jam (merah)

### 5. GiverCard (Pemberi Quest)
- **Type:** Horizontal card dengan avatar
- **Isi:**
  - Avatar (foto profil bulat, 48px)
  - Nama lengkap giver (bold, clickable → `/users/:giverId`)
  - Rating: ⭐ 4.5 (dari 20 ulasan)
  - Stats: "🎯 15 Diberikan · 💪 5 Diambil"
- **Action:** Click nama/avatar → navigate ke `/users/:giverId`

### 6. TakerCard (Pengambil Quest)
- **Type:** Sama dengan GiverCard, tapi untuk taker
- **Condition:** Hanya muncul jika `takerId !== null` (quest sudah diambil)
- **Isi:** Avatar, nama, rating, stats
- **Action:** Click → navigate ke `/users/:takerId`

### 7. ProgressStepper
- **Type:** Horizontal step indicator
- **Isi 4 steps:**
  - ● Open → ● Taken → ● In Progress → ● Completed
- **Visual:**
  - Step yang sudah lewat: filled (✅ dengan warna primary)
  - Step saat ini: filled + pulse animation
  - Step belum capai: outline kosong
  - Garis penghubung antar step (solid jika lewat, dashed jika belum)
- **Contoh visual:**
  ```
  ●━━━━━━●━━━━━━○━━━━━━○
  Open  Taken  Prog  Done
   ✅    ✅
  ```

### 8. ActionButton (Context-Dependent) — LIHAT TABEL DI BAWAH
- **Type:** Primary/Secondary button (full width)
- **Position:** Sticky bottom atau di bawah content
- **Behavior:** Berubah berdasarkan role user + status quest + payment status

### 9. PaymentConfirmModal
- **Trigger:** Giver klik "Konfirmasi Pembayaran" (status COMPLETED, payment=false)
- **Type:** Modal dialog (overlay)
- **Isi:**
  - Title: "Konfirmasi Pembayaran"
  - Total: "Rp 5.000"
  - Metode pembayaran (radio):
    - ○ Cash — "Bayar tunai langsung"
    - ● QRIS — "Scan QR code taker"
  - **Jika QRIS dipilih:** Tampilkan gambar QRIS code taker (dari taker profile)
  - Checkbox: "✓ Saya sudah membayar"
  - Button "Konfirmasi Dibayar" → POST `/api/v1/quests/:id/confirm-payment`

### 10. RatingSection
- **Type:** Section block
- **Condition:** Hanya muncul jika ada rating yang sudah diberikan
- **Isi:**
  - Title: "⭐ Ulasan"
  - Rating cards:
    - "Dari [Giver] ke [Taker]" + bintang + review text + timestamp
    - "Dari [Taker] ke [Giver]" + bintang + review text + timestamp
- **Empty:** "Belum ada ulasan" (jika belum ada yang rating)

### 11. ReportButton (Opsional)
- **Type:** Text link (kecil, warna abu-abu)
- **Isi:** "⚠️ Laporkan Quest"
- **Action:** Modal dengan alasan report (spam, inappropriate, dll)

---

## Context-Dependent Action Button

**Ini bagian paling penting.** Tombol yang muncul tergantung:
1. **Role user:** Apakah dia giver, taker, atau pihak ketiga?
2. **Status quest:** OPEN, TAKEN, IN_PROGRESS, COMPLETED, CANCELLED?
3. **Payment status:** Sudah dikonfirmasi atau belum?
4. **Rating status:** Sudah memberi rating atau belum?

### Tabel Action Button

| Role User | Status | Payment | Rated? | Button yang Tampil |
|---|---|---|---|---|
| **Pihak Ketiga** (bukan giver/taker) | OPEN | - | - | 🟢 **[Ambil Quest]** |
| **Pihak Ketiga** | TAKEN/IN_PROGRESS/COMPLETED | - | - | *(no button, read-only)* |
| **Giver** | OPEN | - | - | 🔵 **[Edit Quest]** · 🔴 **[Batalkan Quest]** |
| **Giver** | TAKEN | - | - | ⏳ *"Menunggu taker memulai..."* |
| **Giver** | IN_PROGRESS | - | - | ⏳ *"Menunggu taker menyelesaikan..."* |
| **Giver** | COMPLETED | `false` | - | 🟡 **[Konfirmasi Pembayaran]** |
| **Giver** | COMPLETED | `true` | `false` | 🟢 **[Beri Rating ke Taker]** |
| **Giver** | COMPLETED | `true` | `true` | ✅ *"Quest selesai. Terima kasih!"* |
| **Taker** | TAKEN | - | - | 🟢 **[Mulai Progress]** · 🔴 **[Batalkan Pengambilan]** |
| **Taker** | IN_PROGRESS | - | - | 🟢 **[Tandai Selesai]** |
| **Taker** | COMPLETED | `false` | - | ⏳ *"Menunggu pembayaran dari giver..."* |
| **Taker** | COMPLETED | `true` | `false` | 🟢 **[Beri Rating ke Giver]** |
| **Taker** | COMPLETED | `true` | `true` | ✅ *"Quest selesai. Terima kasih!"* |
| **Siapa pun** | CANCELLED | - | - | 🔴 *"Quest ini telah dibatalkan"* |

---

## States

| State | Trigger | Tampilan |
|---|---|---|
| Loading | Pertama buka page, fetch quest detail | Skeleton layout (placeholder blocks) |
| Not Found | Backend return 404 | "Quest tidak ditemukan" + button kembali |
| Error | Gagal fetch | "Gagal memuat quest" + retry |
| Loaded | Data quest berhasil di-fetch | Full content + action button sesuai context |
| Taking Quest | User klik "Ambil Quest" | Button jadi spinner "Mengambil..." |
| Take Success | Backend return 200 | Toast "Quest berhasil diambil!" + re-render (status jadi TAKEN, muncul TakerCard) |
| Take Error | Backend return 403/409 | Toast error "Quest sudah diambil orang lain" / "Kamu tidak bisa ambil quest sendiri" |

---

## Data Needed

### API Call: GET `/api/v1/quests/:id`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "title": "Jemput Barang di Pos Satpam",
    "description": "Tolong jemput paket saya...",
    "category": "TRANSPORT",
    "location": "Pos Satpam Kampus UNU",
    "deadline": "2026-06-20T14:00:00Z",
    "compensation": 5000,
    "status": "OPEN",
    "paymentConfirmed": false,
    "giver": {
      "id": "uuid-giver",
      "fullName": "Faiz Abdurrachman",
      "avatarUrl": null,
      "reputation": 4.5,
      "questsGiven": 15,
      "questsTaken": 5
    },
    "taker": null,
    "ratings": [],
    "myRole": null,
    "hasRated": false
  }
}
```

**Catatan:** Backend harus return `myRole` (null | "giver" | "taker") dan `hasRated` (boolean) supaya frontend gampang tentukan action button mana yang muncul.

### API Calls lain (berdasarkan action):
- `POST /api/v1/quests/:id/take` — ambil quest
- `POST /api/v1/quests/:id/start` — mulai progress
- `POST /api/v1/quests/:id/complete` — tandai selesai
- `POST /api/v1/quests/:id/confirm-payment` — konfirmasi bayar
- `POST /api/v1/quests/:id/rate` — kasih rating
- `PUT /api/v1/quests/:id` — edit quest (giver only)
- `DELETE /api/v1/quests/:id` — batalkan quest (giver only)

---

## Navigation

| Dari | Ke | Trigger |
|---|---|---|
| `/dashboard` | `/quests/:id` | Klik QuestCard |
| `/my-quests` | `/quests/:id` | Klik quest di list |
| `/quests/:id` | `/dashboard` atau back | Klik back button |
| `/quests/:id` | `/users/:giverId` | Klik nama/avatar giver |
| `/quests/:id` | `/users/:takerId` | Klik nama/avatar taker |
| `/quests/:id` | `/quests/edit/:id` | Klik "Edit Quest" (giver only) |

---

## Layout Sketch (Mobile 375px)

```
┌──────────────────────────────────────┐
│  ← Quest Detail                      │  ← BackButton
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────┐                    │
│  │ 🟢 OPEN      │                    │  ← StatusBadge
│  └──────────────┘                    │
│                                      │
│  Jemput Barang di Pos Satpam        │  ← QuestHeader (judul)
│  🚗 Transportasi                     │  ← CategoryBadge
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📝 Deskripsi                   │  │  ← DescriptionCard
│  │                                │  │
│  │ Tolong jemput paket saya di    │  │
│  │ pos satpam kampus. Nama        │  │
│  │ penerima: Faiz A.              │  │
│  │ Nomor resi: JNE12345678        │  │
│  └────────────────────────────────┘  │
│                                      │
│  💰 Kompensasi                       │
│  Rp 5.000                            │  ← CompensationCard
│                                      │
│  📍 Lokasi                           │
│  Pos Satpam Kampus UNU               │  ← LocationCard
│                                      │
│  ⏰ Deadline                         │
│  20 Juni 2026, 14:00 WIB             │  ← DeadlineCard
│  (2 jam lagi)                        │
│                                      │
│  ─── Pemberi Quest ─────────────    │
│  ┌────────────────────────────────┐  │
│  │ (👤) Faiz Abdurrachman         │  │  ← GiverCard
│  │      ⭐ 4.5 (20 ulasan)        │  │
│  │  🎯 15 Diberikan  💪 5 Diambil │  │
│  └────────────────────────────────┘  │
│                                      │
│  ─── Progress Quest ─────────────   │
│                                      │
│  ●━━━━━━●━━━━━━○━━━━━━○              │  ← ProgressStepper
│  Open  Taken  Prog  Done             │
│   ✅                                 │
│                                      │
│  ─── Ulasan ────────────────────    │  ← RatingSection
│  Belum ada ulasan                    │
│                                      │
│  ⚠️  Laporkan Quest                  │  ← ReportButton
│                                      │
├──────────────────────────────────────┤
│  ╔══════════════════════════════╗  │
│  ║       🟢 Ambil Quest          ║  │  ← ActionButton (context)
│  ╚══════════════════════════════╝  │
└──────────────────────────────────────┘
```

---

## Payment Confirm Modal (saat giver klik "Konfirmasi Pembayaran")

```
┌──────────────────────────────────────┐
│  (overlay gelap)                     │
│  ┌────────────────────────────────┐  │
│  │                      ✕         │  │
│  │   Konfirmasi Pembayaran        │  │
│  │                                │  │
│  │   Total: Rp 5.000              │  │
│  │                                │  │
│  │   Metode Pembayaran:           │  │
│  │   ○ Cash (tunai langsung)      │  │
│  │   ● QRIS                       │  │
│  │                                │  │
│  │   ┌────────────────────────┐   │  │
│  │   │                        │   │  │
│  │   │     [QRIS CODE]        │   │  │
│  │   │     (gambar QR)        │   │  │
│  │   │                        │   │  │
│  │   └────────────────────────┘   │  │
│  │   Scan QR di atas untuk bayar │  │
│  │                                │  │
│  │   [✓] Saya sudah membayar      │  │
│  │                                │  │
│  │  ╔═══════════════════════╗    │  │
│  │  ║ Konfirmasi Dibayar     ║    │  │
│  │  ╚═══════════════════════╝    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## Edge Cases
- **Quest diambil orang lain saat user sedang lihat:** Saat klik "Ambil Quest", backend return 409 → toast "Maaf, quest sudah diambil orang lain" → re-fetch data
- **User coba ambil quest sendiri:** Backend return 403 → toast "Kamu tidak bisa ambil quest sendiri"
- **Deadline lewat saat status OPEN:** Tampilkan warning "Quest ini sudah melewati deadline" (opsional: auto-cancel atau biarkan)
- **Taker cancel setelah IN_PROGRESS:** Tidak boleh (hanya bisa cancel di TAKEN). Tombol cancel hidden di IN_PROGRESS.
- **Giver coba konfirmasi payment 2x:** Backend return 409 "Pembayaran sudah dikonfirmasi"
- **User coba rating sebelum payment confirmed:** Tombol rating hidden, baru muncul setelah payment=true
- **User coba rating 2x:** Backend return 409 "Kamu sudah memberi rating"
- **Quest deleted/cancelled saat user sedang di page:** Re-fetch, tampilkan status CANCELLED
- **Real-time update (future):** WebSocket push update status (tanpa refresh) — untuk MVP pakai polling atau manual refresh
