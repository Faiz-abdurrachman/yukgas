# YUKgas.in — Software Requirements Specification (SRS)

> **Versi:** 1.0  
> **Tanggal:** Juni 2026  
> **Status:** Draft untuk brainstorming  
> **Tech Lead:** Faiz Abdurrachman (Backend & Database)

---

## 1. System Architecture

### 1.1 Arsitektur Umum
```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│              React.js + Tailwind CSS                 │
│                  Mobile-First PWA                    │
└──────────────────────┬─────────────────────────────���┘
                       │ HTTPS / REST API (JSON)
                       ▼
┌─────────────────────────────────────────────────────┐
│                   SERVER (Backend)                   │
│               Node.js + Express.js                   │
│  ┌─────────┐ ┌──────────┐ ┌────────────────────┐   │
│  │Middleware│ │Controller│ │     Services       │   │
│  │ (auth,  │ │ (routes) │ │ (business logic)   │   │
│  │validate)│ │          │ │                    │   │
│  └─────────┘ └──────────┘ └─────────┬──────────┘   │
│                                   │                │
│                          ┌────────▼─────────┐      │
│                          │   Prisma ORM     │      │
│                          └────────┬─────────┘      │
└───────────────────────────────────┼─────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   PostgreSQL DB     │
                         │    (Supabase)       │
                         └─────────────────────┘
```

### 1.2 Tech Stack Detail

| Lapisan | Teknologi | Fungsi | Hosting |
|---|---|---|---|
| Frontend | React.js 18 + Vite | UI components, SPA | Vercel |
| Styling | Tailwind CSS 3 | Utility-first CSS | - |
| State Mgmt | React Context + useReducer | Global state (auth, theme) | - |
| HTTP Client | Axios / Fetch | API calls | - |
| Routing | React Router v6 | Client-side routing | - |
| Backend | Node.js 18+ + Express.js 4 | REST API server | Railway / Render |
| ORM | Prisma 5 | Database ORM + migration | - |
| Database | PostgreSQL 15 | Relational data storage | Supabase (free tier) |
| Auth | JWT (jsonwebtoken) | Stateless session | - |
| Validation | Zod | Schema validation (FE & BE) | - |
| Password | bcrypt (12 rounds) | Password hashing | - |
| Rate Limit | express-rate-limit | API protection | - |
| Security | helmet, cors | HTTP headers, CORS | - |

---

## 2. Functional Requirements (FR)

### FR-01: User Registration
- **Input:** `fullName` (string, min 3), `email` (string, must end `@unu.ac.id` or `@students.unu.ac.id`), `password` (min 8 chars, must contain letter + number)
- **Proses:** Validate input → check email uniqueness → hash password (bcrypt 12 rounds) → insert to DB → generate JWT → return user + token
- **Output:** `{ user: UserObject, token: string }`
- **Error:** `EMAIL_EXISTS`, `INVALID_DOMAIN`, `WEAK_PASSWORD`, `VALIDATION_ERROR`

### FR-02: User Login
- **Input:** `email`, `password`
- **Proses:** Find user by email → compare password with bcrypt → generate JWT → return user + token
- **Output:** `{ user: UserObject, token: string }`
- **Error:** `INVALID_CREDENTIALS`, `VALIDATION_ERROR`

### FR-03: Get Current User
- **Input:** JWT token (Authorization header)
- **Proses:** Verify JWT → find user by ID → return user object
- **Output:** `{ user: UserObject }`
- **Error:** `UNAUTHORIZED`, `TOKEN_EXPIRED`

### FR-04: Create Quest
- **Input:** `title` (min 10, max 100), `category` (enum), `description` (min 20, max 500), `location` (string), `deadline` (future datetime), `compensation` (min 1000)
- **Guard:** Authenticated user only
- **Proses:** Validate → set `giverId = currentUser`, `status = OPEN` → insert → log to quest_history
- **Output:** `{ quest: QuestObject }`
- **Error:** `VALIDATION_ERROR`, `UNAUTHORIZED`

### FR-05: Get Quest Feed
- **Input:** Query params: `category?`, `status?` (default: OPEN), `minPrice?`, `maxPrice?`, `sort?` (newest, deadline, price_asc, price_desc), `search?`, `page?` (default: 1), `limit?` (default: 10)
- **Proses:** Build Prisma query with filters → paginate → return array + pagination meta
- **Output:** `{ quests: QuestCardObject[], pagination: { page, limit, total, totalPages } }`

### FR-06: Get Quest Detail
- **Input:** `questId` (URL param)
- **Proses:** Find quest by ID → include giver data, taker data (if exists), ratings → return
- **Output:** `{ quest: QuestDetailObject (with giver, taker, ratings) }`
- **Error:** `NOT_FOUND`

### FR-07: Update Quest
- **Input:** `questId` + any of: `title`, `category`, `description`, `location`, `deadline`, `compensation`
- **Guard:** Authenticated, `currentUser.id === quest.giverId`, `quest.status === OPEN`
- **Proses:** Validate → update → return updated quest
- **Error:** `FORBIDDEN`, `QUEST_NOT_EDITABLE`, `NOT_FOUND`

### FR-08: Cancel Quest (Soft Delete)
- **Input:** `questId`
- **Guard:** Authenticated, `currentUser.id === quest.giverId`, `quest.status === OPEN`
- **Proses:** Set `status = CANCELLED` → log to quest_history
- **Output:** `{ success: true }`
- **Error:** `FORBIDDEN`, `QUEST_NOT_CANCELLABLE`

### FR-09: Take Quest
- **Input:** `questId`
- **Guard:** Authenticated, `currentUser.id !== quest.giverId`, `quest.status === OPEN`, user tidak punya quest lain dengan status `IN_PROGRESS` (max 1 active)
- **Proses:** Set `takerId = currentUser.id`, `status = TAKEN` → log to quest_history
- **Output:** `{ quest: QuestObject }`
- **Error:** `CANNOT_TAKE_OWN_QUEST`, `QUEST_ALREADY_TAKEN`, `MAX_ACTIVE_QUEST_REACHED`

### FR-10: Start Quest Progress
- **Input:** `questId`
- **Guard:** Authenticated, `currentUser.id === quest.takerId`, `quest.status === TAKEN`
- **Proses:** Set `status = IN_PROGRESS` → log to quest_history
- **Error:** `FORBIDDEN`, `INVALID_STATE_TRANSITION`

### FR-11: Complete Quest
- **Input:** `questId`
- **Guard:** Authenticated, `currentUser.id === quest.takerId`, `quest.status === IN_PROGRESS`
- **Proses:** Set `status = COMPLETED` → log to quest_history
- **Error:** `FORBIDDEN`, `INVALID_STATE_TRANSITION`

### FR-12: Cancel Take (Release Quest)
- **Input:** `questId`
- **Guard:** Authenticated, `currentUser.id === quest.takerId`, `quest.status === TAKEN`
- **Proses:** Set `takerId = null`, `status = OPEN` → log to quest_history
- **Error:** `FORBIDDEN`, `INVALID_STATE_TRANSITION`

### FR-13: Confirm Payment
- **Input:** `questId`
- **Guard:** Authenticated, `currentUser.id === quest.giverId`, `quest.status === COMPLETED`, `quest.paymentConfirmed === false`
- **Proses:** Set `paymentConfirmed = true` → log to quest_history
- **Output:** `{ quest: QuestObject }`
- **Error:** `FORBIDDEN`, `ALREADY_CONFIRMED`

### FR-14: Submit Rating
- **Input:** `questId`, `score` (1-5), `review?` (string, max 300)
- **Guard:** Authenticated, `quest.status === COMPLETED`, `quest.paymentConfirmed === true`, `currentUser` adalah giver ATAU taker (bukan keduanya), belum pernah rating quest ini sebagai role ini
- **Proses:** Insert rating → recalculate `ratedUser.reputation` (avg all ratings received) → update user
- **Output:** `{ rating: RatingObject }`
- **Error:** `FORBIDDEN`, `ALREADY_RATED`, `QUEST_NOT_ELIGIBLE`

### FR-15: Get User Ratings
- **Input:** `userId` (URL param), `page?`, `limit?`
- **Proses:** Find all ratings where `ratedId = userId` → include rater info + quest info → paginate
- **Output:** `{ ratings: RatingWithUserObject[], pagination: {...} }`

### FR-16: Get User Public Profile
- **Input:** `userId`
- **Proses:** Find user → return public fields (no password) + stats
- **Output:** `{ user: PublicUserObject }`
- **Error:** `NOT_FOUND`

### FR-17: Update Own Profile
- **Input:** `fullName?`, `bio?`, `avatarUrl?`, `qrisUrl?`
- **Guard:** Authenticated
- **Proses:** Validate → update → return updated user
- **Output:** `{ user: UserObject }`

### FR-18: Get My Quests (Given)
- **Input:** `status?` (filter), `page?`, `limit?`
- **Guard:** Authenticated
- **Proses:** Find quests where `giverId = currentUser.id` → paginate
- **Output:** `{ quests: QuestCardObject[], pagination: {...} }`

### FR-19: Get My Quests (Taken)
- **Input:** `status?`, `page?`, `limit?`
- **Guard:** Authenticated
- **Proses:** Find quests where `takerId = currentUser.id` → paginate
- **Output:** `{ quests: QuestCardObject[], pagination: {...} }`

### FR-20: Get Quest History (Timeline)
- **Input:** `questId`
- **Proses:** Find all quest_history where `questId` → order by `changedAt` asc
- **Output:** `{ history: HistoryObject[] }`

---

## 3. Non-Functional Requirements (NFR)

| ID | Kategori | Requirement |
|---|---|---|
| NFR-01 | Performance | API response time < 500ms untuk 95% request |
| NFR-02 | Performance | Page load time (frontend) < 3s pada 3G connection |
| NFR-03 | Scalability | Sistem mendukung hingga 500 concurrent users |
| NFR-04 | Usability | Mobile-first responsive (min width 320px) |
| NFR-05 | Security | Password di-hash dengan bcrypt (12 rounds), tidak pernah disimpan plain text |
| NFR-06 | Security | JWT expiration max 1 jam (access token) |
| NFR-07 | Security | Semua input divalidasi dengan Zod (backend) |
| NFR-08 | Security | Rate limiting: max 100 request/menit per IP |
| NFR-09 | Security | CORS hanya mengizinkan domain frontend yang terdaftar |
| NFR-10 | Reliability | Uptime target 99% (dengan hosting free tier) |
| NFR-11 | Maintainability | Kode mengikuti pattern Controller-Service-Route |
| NFR-12 | Maintainability | Semua endpoint terdokumentasi (README atau Postman collection) |
| NFR-13 | Compatibility | Support browser modern: Chrome, Firefox, Safari, Edge (2 versi terakhir) |

---

## 4. Data Model

### 4.1 ERD (Entity Relationship Diagram)

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│    users     │         │      quests       │         │   ratings    │
├──────────────┤         ├──────────────────┤         ├──────────────┤
│ id (PK)      │◄──┐    │ id (PK)           │    ┌───►│ id (PK)      │
│ email        │   │    │ title             │    │    │ questId (FK) │
│ password     │   │    │ description       │    │    │ raterId (FK) │
│ fullName     │   ├───►│ category          │    │    │ ratedId (FK) │
│ bio          │   │    │ location          │    │    │ score        │
│ avatarUrl    │   │    │ deadline          │    │    │ review       │
│ qrisUrl      │   │    │ compensation      │    │    │ createdAt    │
│ reputation   │   │    │ status            │    │    └──────────────┘
│ questsGiven  │   │    │ giverId (FK) ─────┘    │
│ questsTaken  │   │    │ takerId (FK) ──────┐   │
│ createdAt    │   │    │ paymentConfirmed   │   │
│ updatedAt    │   │    │ createdAt          │   │
└──────────────┘   │    │ updatedAt          │   │
       ▲           │    └──────────────────┘   │
       │           │             │              │
       │           │             │              │
       └───────────┴─────────────┘              │
                   │                            │
                   ▼                            │
         ┌──────────────────┐                   │
         │  quest_history   │                   │
         ├──────────────────┤                   │
         │ id (PK)          │                   │
         │ questId (FK) ────┘                   │
         │ status           │                   │
         │ changedBy (FK) ──┼───────────────────┘
         │ changedAt        │
         └──────────────────┘
```

### 4.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===== ENUMS =====

enum Category {
  TRANSPORT
  FOOD
  ADMIN
  OTHER
}

enum QuestStatus {
  OPEN
  TAKEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// ===== MODELS =====

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  password     String
  fullName     String
  bio          String?  @db.Text
  avatarUrl    String?
  qrisUrl      String?
  reputation   Float    @default(0)
  questsGiven  Int      @default(0)
  questsTaken  Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  questsAsGiver  Quest[]   @relation("QuestGiver")
  questsAsTaker  Quest[]   @relation("QuestTaker")
  ratingsGiven   Rating[]  @relation("Rater")
  ratingsReceived Rating[] @relation("Rated")
  historyChanges QuestHistory[] @relation("HistoryChanger")

  @@map("users")
}

model Quest {
  id               String      @id @default(uuid())
  title            String
  description      String      @db.Text
  category         Category
  location         String
  deadline         DateTime
  compensation     Decimal     @db.Decimal(10, 2)
  status           QuestStatus @default(OPEN)
  giverId          String
  takerId          String?
  paymentConfirmed Boolean     @default(false)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  // Relations
  giver      User           @relation("QuestGiver", fields: [giverId], references: [id])
  taker      User?          @relation("QuestTaker", fields: [takerId], references: [id])
  ratings    Rating[]
  history    QuestHistory[]

  // Indexes
  @@index([status])
  @@index([category])
  @@index([giverId])
  @@index([takerId])
  @@map("quests")
}

model Rating {
  id        String   @id @default(uuid())
  questId   String
  raterId   String
  ratedId   String
  score     Int      // 1-5
  review    String?  @db.Text
  createdAt DateTime @default(now())

  // Relations
  quest Quest @relation(fields: [questId], references: [id], onDelete: Cascade)
  rater User  @relation("Rater", fields: [raterId], references: [id])
  rated User  @relation("Rated", fields: [ratedId], references: [id])

  // Constraints
  @@unique([questId, raterId]) // 1 user = 1 rating per quest
  @@index([ratedId])
  @@map("ratings")
}

model QuestHistory {
  id        String      @id @default(uuid())
  questId   String
  status    QuestStatus
  changedBy String?
  changedAt DateTime    @default(now())

  // Relations
  quest     Quest  @relation(fields: [questId], references: [id], onDelete: Cascade)
  changedBy User?  @relation("HistoryChanger", fields: [changedBy], references: [id])

  @@index([questId])
  @@map("quest_history")
}
```

### 4.3 Field Constraints

| Tabel | Field | Constraint |
|---|---|---|
| users | email | UNIQUE, NOT NULL, format `*@unu.ac.id` or `*@students.unu.ac.id` |
| users | password | NOT NULL, min 8 chars (validated app-level, stored as bcrypt hash) |
| users | reputation | DEFAULT 0, range 0-5 |
| quests | title | NOT NULL, min 10, max 100 chars |
| quests | description | NOT NULL, min 20, max 500 chars |
| quests | compensation | NOT NULL, min 1000 (Rp) |
| quests | deadline | NOT NULL, must be > createdAt |
| ratings | score | NOT NULL, CHECK (score >= 1 AND score <= 5) |
| ratings | | UNIQUE(questId, raterId) — 1 user 1 rating per quest |

---

## 5. API Specification

### 5.1 Konvensi Umum

**Base URL:** `/api/v1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>   (untuk endpoint yang butuh auth)
```

**Response Format — Sukses:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Response Format — Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []  // optional, array of validation errors
  }
}
```

**HTTP Status Codes:**
| Code | Meaning |
|---|---|
| 200 | OK (GET, PUT success) |
| 201 | Created (POST success) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate, state mismatch) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

### 5.2 Auth Endpoints

#### POST `/api/v1/auth/register`
Mendaftarkan user baru.

**Request Body:**
```json
{
  "fullName": "Faiz Abdurrachman",
  "email": "faiz@students.unu.ac.id",
  "password": "Password123"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-xxx",
      "email": "faiz@students.unu.ac.id",
      "fullName": "Faiz Abdurrachman",
      "reputation": 0,
      "questsGiven": 0,
      "questsTaken": 0,
      "createdAt": "2026-06-20T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DOMAIN",
    "message": "Email harus menggunakan domain @unu.ac.id"
  }
}
```

#### POST `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "faiz@students.unu.ac.id",
  "password": "Password123"
}
```

**Response 200:** sama seperti register response.

#### GET `/api/v1/auth/me`
**Header:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

### 5.3 Quest Endpoints

#### GET `/api/v1/quests`
Mengambil feed quest dengan filter.

**Query Params:**
| Param | Type | Default | Description |
|---|---|---|---|
| category | enum | - | TRANSPORT, FOOD, ADMIN, OTHER |
| status | enum | OPEN | OPEN, TAKEN, IN_PROGRESS, COMPLETED, CANCELLED |
| minPrice | number | - | Minimum compensation |
| maxPrice | number | - | Maximum compensation |
| search | string | - | Search in title + description |
| sort | string | newest | newest, deadline, price_asc, price_desc |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 50) |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "quests": [
      {
        "id": "uuid",
        "title": "Jemput barang di pos satpam",
        "category": "TRANSPORT",
        "compensation": 5000,
        "location": "Pos Satpam",
        "deadline": "2026-06-20T14:00:00Z",
        "status": "OPEN",
        "giver": {
          "id": "uuid",
          "fullName": "Faiz Abdurrachman",
          "reputation": 4.5,
          "avatarUrl": null
        },
        "createdAt": "2026-06-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### GET `/api/v1/quests/:id`
**Response 200:**
```json
{
  "success": true,
  "data": {
    "quest": {
      "id": "uuid",
      "title": "...",
      "description": "...",
      "category": "TRANSPORT",
      "location": "...",
      "deadline": "...",
      "compensation": 5000,
      "status": "OPEN",
      "paymentConfirmed": false,
      "giver": { "id": "uuid", "fullName": "...", "reputation": 4.5, ... },
      "taker": null,
      "ratings": [],
      "history": [
        { "status": "OPEN", "changedAt": "...", "changedBy": "uuid" }
      ],
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

#### POST `/api/v1/quests`
**Auth:** Required

**Request Body:**
```json
{
  "title": "Jemput barang di pos satpam kampus",
  "category": "TRANSPORT",
  "description": "Tolong jemput paket saya di pos satpam. Resi: JNE12345678. Nama: Faiz A.",
  "location": "Pos Satpam Kampus UNU",
  "deadline": "2026-06-20T14:00:00Z",
  "compensation": 5000
}
```

#### PUT `/api/v1/quests/:id`
**Auth:** Required (giver only, status must be OPEN)

#### DELETE `/api/v1/quests/:id`
**Auth:** Required (giver only, status must be OPEN) → sets status to CANCELLED

#### POST `/api/v1/quests/:id/take`
**Auth:** Required

#### POST `/api/v1/quests/:id/start`
**Auth:** Required (taker only)

#### POST `/api/v1/quests/:id/complete`
**Auth:** Required (taker only)

#### POST `/api/v1/quests/:id/cancel-take`
**Auth:** Required (taker only, status must be TAKEN)

#### POST `/api/v1/quests/:id/confirm-payment`
**Auth:** Required (giver only, status COMPLETED, paymentConfirmed false)

### 5.4 Rating Endpoints

#### POST `/api/v1/quests/:id/rate`
**Auth:** Required

**Request Body:**
```json
{
  "score": 5,
  "review": "Gercep banget, recommended!"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "rating": {
      "id": "uuid",
      "questId": "uuid",
      "raterId": "uuid",
      "ratedId": "uuid",
      "score": 5,
      "review": "Gercep banget, recommended!",
      "createdAt": "..."
    }
  }
}
```

#### GET `/api/v1/users/:id/ratings`
**Query:** `page`, `limit`

### 5.5 User Endpoints

#### GET `/api/v1/users/:id`
Public profile.

#### PUT `/api/v1/profile`
**Auth:** Required

**Request Body:**
```json
{
  "fullName": "Faiz Abdurrachman",
  "bio": "Mahasiswa Informatika UNU. Suka ngopi.",
  "avatarUrl": "https://...",
  "qrisUrl": "https://..."
}
```

#### GET `/api/v1/quests/my/given`
**Auth:** Required. Query: `status`, `page`, `limit`

#### GET `/api/v1/quests/my/taken`
**Auth:** Required. Query: `status`, `page`, `limit`

---

## 6. State Machine — Quest Lifecycle

### 6.1 State Diagram

```
                          ┌──────────┐
                  ┌───────│ CANCELLED│ (terminal)
                  │       └──────────┘
                  │ (giver cancel, OPEN only)
                  │
                  │       ┌──────┐
            take  │       │ OPEN │◄──────────────────┐
                  │       └──┬───┘                    │
                  │          │ take                   │ cancel-take
                  │          ▼                        │ (taker, TAKEN only)
                  │       ┌──────┐                    │
                  │       │TAKEN │────────────────────┘
                  │       └──┬───┘
                  │          │ start
                  │          ▼
                  │       ┌────────────┐
                  │       │IN_PROGRESS │
                  │       └─────┬──────┘
                  │             │ complete
                  │             ▼
                  │       ┌───────────┐
                  │       │ COMPLETED │
                  │       └─────┬─────┘
                  │             │ confirm-payment
                  │             ▼
                  │       ┌─────────────────┐
                  │       │ COMPLETED       │
                  │       │ + paymentConfirmed│
                  │       │ (rating opens)  │
                  │       └─────────────────┘
                  │             (terminal)
```

### 6.2 Transition Table

| From | To | Trigger | Guard (Syarat) |
|---|---|---|---|
| OPEN | TAKEN | POST /take | currentUser ≠ giver, user has no IN_PROGRESS quest |
| TAKEN | OPEN | POST /cancel-take | currentUser = taker |
| TAKEN | IN_PROGRESS | POST /start | currentUser = taker |
| IN_PROGRESS | COMPLETED | POST /complete | currentUser = taker |
| OPEN | CANCELLED | DELETE /quest | currentUser = giver |
| COMPLETED | COMPLETED+paid | POST /confirm-payment | currentUser = giver, paymentConfirmed = false |

### 6.3 Invalid Transitions (akan return 409 CONFLICT)
- OPEN → IN_PROGRESS (harus lewat TAKEN dulu)
- TAKEN → COMPLETED (harus lewat IN_PROGRESS)
- COMPLETED → OPEN (tidak bisa undo)
- CANCELLED → apapun (terminal state)

---

## 7. Authentication Flow

### 7.1 Registration Flow
```
Client                              Server
  │                                   │
  │── POST /auth/register ───────────►│
  │   { fullName, email, password }   │
  │                                   │
  │                    ┌──────────────┤
  │                    │ 1. Validate (Zod)
  │                    │ 2. Check email domain
  │                    │ 3. Check email uniqueness
  │                    │ 4. Hash password (bcrypt)
  │                    │ 5. Insert user to DB
  │                    │ 6. Generate JWT (exp 1h)
  │                    └──────────────┤
  │                                   │
  │◄─── 201 { user, token } ─────────│
  │                                   │
  │ (client stores token in localStorage
  │  or httpOnly cookie, redirect to /dashboard)
```

### 7.2 Login Flow
```
Client                              Server
  │                                   │
  │── POST /auth/login ──────────────►│
  │   { email, password }             │
  │                                   │
  │                    ┌──────────────┤
  │                    │ 1. Find user by email
  │                    │ 2. Compare password (bcrypt)
  │                    │ 3. Generate JWT
  │                    └──────────────┤
  │                                   │
  │◄─── 200 { user, token } ─────────│
```

### 7.3 JWT Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "uuid-xxx",
    "email": "faiz@students.unu.ac.id",
    "iat": 1718880000,
    "exp": 1718883600
  }
}
```

**JWT Config:**
- Algorithm: HS256
- Secret: `JWT_SECRET` (env variable, min 32 chars)
- Access token expiry: 1 hour
- (Optional) Refresh token expiry: 7 days

### 7.4 Auth Middleware Flow
```
Request masuk
    │
    ▼
Extract "Authorization: Bearer <token>" dari header
    │
    ├── Tidak ada header → 401 UNAUTHORIZED
    │
    ▼
Verify JWT signature + expiration
    │
    ├── Invalid/expired → 401 TOKEN_EXPIRED
    │
    ▼
Extract userId dari payload
    │
    ▼
Find user di DB by userId
    │
    ├── Not found → 401 UNAUTHORIZED
    │
    ▼
Attach user ke req.user
    │
    ▼
next() → lanjut ke controller
```

---

## 8. Error Handling Strategy

### 8.1 Error Code Taxonomy

| Code | HTTP | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Input tidak valid (Zod validation fail) |
| `INVALID_DOMAIN` | 400 | Email bukan @unu.ac.id |
| `WEAK_PASSWORD` | 400 | Password tidak memenuhi requirement |
| `EMAIL_EXISTS` | 409 | Email sudah terdaftar |
| `INVALID_CREDENTIALS` | 401 | Email/password salah saat login |
| `UNAUTHORIZED` | 401 | Tidak ada token atau token invalid |
| `TOKEN_EXPIRED` | 401 | Token sudah expired |
| `FORBIDDEN` | 403 | Tidak punya permission (bukan giver/taker) |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `QUEST_ALREADY_TAKEN` | 409 | Quest sudah diambil orang lain |
| `CANNOT_TAKE_OWN_QUEST` | 403 | Mencoba ambil quest sendiri |
| `MAX_ACTIVE_QUEST_REACHED` | 409 | Sudah punya 1 quest IN_PROGRESS |
| `INVALID_STATE_TRANSITION` | 409 | Status quest tidak memungkinkan action |
| `ALREADY_RATED` | 409 | Sudah pernah rating quest ini |
| `ALREADY_CONFIRMED` | 409 | Payment sudah dikonfirmasi |
| `QUEST_NOT_EDITABLE` | 403 | Quest tidak bisa diedit (status bukan OPEN) |
| `RATE_LIMITED` | 429 | Terlalu banyak request |
| `INTERNAL_ERROR` | 500 | Server error (unhandled) |

### 8.2 Global Error Handler

```javascript
// src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  // Custom AppError (dari business logic)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || undefined
      }
    });
  }

  // Prisma error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // handle unique constraint, foreign key, dll
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input tidak valid',
        details: err.errors
      }
    });
  }

  // Fallback: unknown error
  console.error(err);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Terjadi kesalahan server'
    }
  });
}
```

---

## 9. Security Considerations

| ID | Concern | Mitigation |
|---|---|---|
| SEC-01 | Password exposure | bcrypt hash (12 rounds), never logged, never returned in API response |
| SEC-02 | Token theft | JWT in httpOnly cookie (preferred) atau localStorage dengan XSS protection |
| SEC-03 | Brute force login | Rate limiting: 5 login attempts per 15 menit per IP |
| SEC-04 | SQL injection | Prisma parameterized queries (otomatis) |
| SEC-05 | XSS | React auto-escaping + sanitize user input (DOMPurify untuk review text) |
| SEC-06 | CSRF | Jika pakai cookie, gunakan SameSite=Strict + CSRF token |
| SEC-07 | CORS abuse | Whitelist hanya domain frontend (`vercel.app` + localhost dev) |
| SEC-08 | Sensitive data in URL | Tidak pernah pass password/token di query param |
| SEC-09 | Rate limiting API | express-rate-limit: 100 req/menit per IP |
| SEC-10 | HTTP headers | helmet middleware untuk set security headers |
| SEC-11 | Environment variables | `.env` tidak di-commit, `JWT_SECRET` min 32 chars random |

---

## 10. Project Structure (Backend)

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js               # Data dummy untuk testing
├── src/
│   ├── app.js                # Express app setup + middleware
│   ├── server.js             # Entry point (listen)
│   ├── config/
│   │   ├── env.js            # Environment variables
│   │   └── prisma.js         # Prisma client instance
│   ├── middlewares/
│   │   ├── auth.js           # JWT verification middleware
│   │   ├── validate.js       # Zod validation middleware
│   │   ├── errorHandler.js   # Global error handler
│   │   └── rateLimiter.js    # Rate limiting config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── quest.controller.js
│   │   ├── rating.controller.js
│   │   └── user.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── quest.service.js
│   │   ├── rating.service.js
│   │   └── user.service.js
│   ├── routes/
│   │   ├── index.js          # Router aggregator
│   │   ├── auth.routes.js
│   │   ├── quest.routes.js
│   │   ├── rating.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── jwt.js            # signToken, verifyToken
│   │   ├── errors.js         # AppError class + error codes
│   │   └── validators.js     # Zod schemas
│   └── types/
│       └── index.js          # JSDoc types (opsional)
├── .env                      # Environment variables (tidak di-commit)
├── .env.example              # Template env
├── .gitignore
├── package.json
├── README.md
└── nodemon.json
```

---

## 11. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"

# JWT
JWT_SECRET="your-super-secret-key-min-32-chars-change-this"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
CLIENT_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```
