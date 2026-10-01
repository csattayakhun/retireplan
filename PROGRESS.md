# 📘 RetirePlan — Project Context & Handoff

> **อ่านไฟล์นี้ก่อนทำงานต่อเสมอ** — สรุปทุกอย่างของโปรเจกต์ (สถานะ, สถาปัตยกรรม, วิธีรัน, สิ่งที่เหลือ) ให้ทำต่อได้ทันทีหลัง clear context
>
> **อัปเดตล่าสุด:** หลังทำ code-quality pass + cleanup Git history เสร็จ — **เหลือขั้นตอนเดียวคือ Deploy**
> ไฟล์เก่า `retireplan-backend/PROGRESS.md` **ล้าสมัยแล้ว** (เขียนตอนยังเป็น Lesson-based) ให้ยึดไฟล์นี้แทน

---

## 1. 🎯 โปรเจกต์นี้คืออะไร

**RetirePlan** = เว็บแอป **Full-Stack วางแผนเกษียณ** — กรอกข้อมูลการเงิน → คำนวณว่าต้องมีเงินเท่าไหร่ตอนเกษียณ, จะมีพอไหม, ควรออมเพิ่มแค่ไหน + บันทึกแผนไว้ดูภายหลังได้

- **จุดประสงค์:** Portfolio ชิ้นหลักของนักศึกษา เพื่อสมัคร **ฝึกงาน (internship) สาย Backend / Full-Stack**
- **จุดขาย:** ไม่ใช่ CRUD ธรรมดา — มี **business logic จริง** (สูตรดอกเบี้ยทบต้น + present/future value of annuity), **Unit Test**, **Google OAuth**, และ **architecture ที่ production-ready**
- **แรงบันดาลใจ UX:** planndee.com (ลอกแนว layout แต่เนื้อหา/แบรนด์เป็นของเราเอง)

---

## 2. 👤 เจ้าของโปรเจกต์

- นักศึกษา กำลังเตรียมฝึกงาน (เป้าหมาย Backend / Full-Stack)
- ทักษะเดิม: React, Node, MySQL, Docker → เพิ่ม NestJS, Prisma, JWT, OAuth, Next.js, Testing
- **Git identity:** `csattayakhun <kapookkingner991@gmail.com>` (GitHub: **csattayakhun**)

---

## 3. ⚠️ กฎการทำงานกับ AI (สำคัญ)

1. **ห้ามใส่ `Co-Authored-By: Claude`** หรือ attribution ใดๆ ใน commit (เจ้าของไม่ต้องการให้ขึ้นบน GitHub)
2. **ยึด [`CODING_PRINCIPLES.md`](./CODING_PRINCIPLES.md)** ทุกครั้งที่เขียน/แก้โค้ด (KISS, DRY, SRP, self-documenting)
3. **คอมเมนต์ให้น้อยที่สุด** — โค้ด production อ่านรู้เรื่องจากชื่อตัวแปร/ฟังก์ชันเอง (ทั้งโปรเจกต์ตอนนี้แทบไม่มีคอมเมนต์โดยตั้งใจ)
4. **commit แบบ atomic + Conventional Commits** (`feat/fix/refactor/style/docs/chore` + scope) — 1 commit = 1 เรื่อง
5. **destructive git** (history rewrite / force push) — AI รันเองไม่ได้ (auto-guard บล็อก) ต้องให้เจ้าของรันเอง
6. เดิมเคยสอนแบบ "ทีละ step ให้ user พิมพ์เอง" แต่ตอนหลังเปลี่ยนเป็น **AI ลงมือแก้ให้ได้** (เจ้าของสั่งตรงๆ)

---

## 4. 📊 สถานะปัจจุบัน

| ส่วน | สถานะ |
|------|:-----:|
| Backend API (NestJS) | ✅ เสร็จ |
| Business logic + Unit Tests | ✅ เสร็จ |
| Google OAuth (login) | ✅ เสร็จ |
| CRUD บันทึกแผน + ownership scoping | ✅ เสร็จ |
| Swagger API Docs (`/docs`) | ✅ เสร็จ |
| Frontend (Next.js + Tailwind) | ✅ เสร็จ |
| Architecture hardening | ✅ เสร็จ |
| Code quality (split component, naming, cleanup) | ✅ เสร็จ |
| Push ขึ้น GitHub (csattayakhun/retireplan) | ✅ เสร็จ |
| **Deploy (Railway + Vercel)** | 🚧 **ยังไม่ทำ — ขั้นตอนถัดไป** |
| Test auth/CRUD (e2e) | ⬜ ยังไม่ทำ (nice-to-have) |

---

## 5. 📁 โครงสร้าง Monorepo

```
D:\retireplan\                      ← monorepo root (git repo เดียว, push → github.com/csattayakhun/retireplan)
├── PROGRESS.md                     ← ไฟล์นี้
├── CODING_PRINCIPLES.md            ← หลักการเขียนโค้ดที่ต้องยึด
├── README.md                       ← README หลัก (ยังต้องเติมลิงก์ Live Demo หลัง deploy)
├── retireplan-backend/             ← NestJS API
│   ├── prisma/
│   │   ├── schema.prisma           ← User, RetirementPlan (TaxPlan ถูกลบแล้ว)
│   │   └── migrations/
│   ├── src/
│   │   ├── main.ts                 ← bootstrap: ValidationPipe + ClassSerializerInterceptor + CORS + Swagger
│   │   ├── app.module.ts           ← ConfigModule(validate env) + modules
│   │   ├── app.controller.ts       ← GET /health
│   │   ├── config/env.validation.ts ← ตรวจ env ตอน boot (fail fast)
│   │   ├── prisma/                 ← PrismaService (@Global, connect/disconnect)
│   │   ├── auth/                   ← Google OAuth + JWT
│   │   │   ├── auth.controller.ts  ← /auth/google, /auth/google/callback, /auth/me
│   │   │   ├── auth.service.ts     ← signToken()
│   │   │   ├── google.strategy.ts  ← verify Google → upsert user
│   │   │   ├── jwt.strategy.ts     ← verify JWT → attach req.user
│   │   │   ├── google-auth.guard.ts / jwt-auth.guard.ts
│   │   │   ├── current-user.decorator.ts ← @CurrentUser() + type AuthUser
│   │   │   └── entities/user.entity.ts   ← @Exclude field ภายใน
│   │   ├── retirement/
│   │   │   ├── retirement.calc.ts        ← สูตร (pure functions) + unit test
│   │   │   ├── retirement.service.ts     ← CRUD + ownership scoping
│   │   │   ├── retirement.controller.ts  ← /retirement/calculate + /retirement/plans CRUD
│   │   │   ├── dto/                       ← Calculate/Create/Update DTO
│   │   │   └── entities/retirement-plan.entity.ts ← @Exclude userId
│   │   └── tax/                    ← /tax/calculate (ภาษีขั้นบันได) + test (ไม่มี persistence)
│   └── package.json
└── retireplan-frontend/            ← Next.js (App Router)
    └── src/
        ├── app/
        │   ├── layout.tsx          ← ฟอนต์ Anuphan (Thai), metadata
        │   ├── page.tsx            ← Server Component ประกอบ section (สั้น ~20 บรรทัด)
        │   ├── login/page.tsx      ← ปุ่ม "Sign in with Google"
        │   ├── auth/callback/page.tsx ← รับ ?token= → เก็บ → redirect
        │   └── plans/page.tsx      ← "แผนของฉัน" (list + delete)
        ├── components/             ← แยก component (ดู §8)
        │   ├── auth-context.tsx    ← AuthProvider (client) — แชร์ user
        │   ├── NavBar.tsx          ← client
        │   ├── Calculator.tsx      ← client (form + fetch + chart + save)
        │   ├── Hero/HowItWorks/Features/Cta/Footer.tsx ← server (static)
        └── lib/api.ts              ← API_URL, tokenStore, getMe, loginWithGoogle, savePlan/getPlans/deletePlan
```

---

## 6. 🛠️ Tech Stack

| ส่วน | เทคโนโลยี | หมายเหตุสำคัญ |
|------|-----------|----------------|
| Backend | **NestJS 12** | ESM (`"type": "module"`) — **import ไฟล์ตัวเองต้องลงท้าย `.js`** |
| ORM/DB | **Prisma 6.19.3** + **MySQL 8** | Prisma **pin 6.19.3** ห้ามใช้ 8.x rc; MySQL รันผ่าน Docker Compose |
| Auth | **Google OAuth** (passport-google-oauth20) + **JWT** | เอา email/password ออกแล้ว (Google อย่างเดียว) |
| Validation | class-validator + class-transformer | ValidationPipe: whitelist + forbidNonWhitelisted + transform |
| Serialization | ClassSerializerInterceptor + Entity `@Exclude` | กัน field ภายใน (password, googleId, userId) หลุด |
| Config | @nestjs/config + env validation | validate env ตอน boot (fail fast) |
| Test | **Vitest** | unit test ที่ `*.spec.ts` (ไม่ใช่ Jest) |
| API Docs | Swagger (`@nestjs/swagger`) | เปิดที่ `/docs` (dev-facing เท่านั้น ไม่ลิงก์จากหน้าเว็บ) |
| Frontend | **Next.js (App Router, เวอร์ชันใหม่)** + TS | ⚠️ เวอร์ชันนี้ต่างจาก training data — ดู `retireplan-frontend/AGENTS.md` |
| Styling | **Tailwind CSS v4** | โทน warm: teal (หลัก) + amber (รอง) + stone (neutral) |
| Font | **Anuphan** (Thai, Google Fonts via next/font) | ตั้งที่ layout.tsx |
| Chart | **Recharts** | ⚠️ `Tooltip formatter` ต้องรับ `ValueType` ไม่ใช่ `number` |

---

## 7. 🏛️ สถาปัตยกรรม Backend

**แยกชั้นชัด (Separation of Concerns):**
```
Controller (HTTP) → Service (business logic) → Prisma (DB)
                          ↓
              retirement.calc.ts (pure functions — testable ไม่ผูก framework)
```

**Google OAuth flow:**
```
กดปุ่ม → GET /auth/google → redirect ไป Google
  → Google verify → GET /auth/google/callback
  → GoogleStrategy.validate() upsert user (by email, เก็บ googleId/avatarUrl)
  → AuthService.signToken() ออก JWT ของระบบเราเอง
  → redirect ไป ${FRONTEND_URL}/auth/callback?token=<JWT>
  → frontend เก็บ token (localStorage) → ใช้แนบ Bearer ทุก request ที่ต้อง login
```

**Architecture hardening ที่ทำแล้ว:**
- env validation ตอน boot (ขาด env → ไม่ยอม start)
- ValidationPipe: `forbidNonWhitelisted` + `transform` + implicit conversion
- ClassSerializerInterceptor + Entities (`@Exclude` password/googleId/userId)
- `@CurrentUser()` custom decorator (แทน `@Req()` ซ้ำๆ)
- PrismaService: `onModuleDestroy` → `$disconnect` (graceful shutdown)
- `GET /health` (health check)

---

## 8. 🎨 สถาปัตยกรรม Frontend (สำคัญ)

**ดัน `'use client'` ให้แคบที่สุด:**
```
page.tsx (Server Component)
  └─ <AuthProvider> (client — แชร์ user ผ่าน Context, โหลด getMe ครั้งเดียว)
       ├─ <NavBar/>      🟡 client (auth state + เมนูมือถือ)
       ├─ <Hero/>        🟢 server (static)
       ├─ <HowItWorks/>  🟢 server
       ├─ <Features/>    🟢 server
       ├─ <Calculator/>  🟡 client (form + fetch + chart + save)
       ├─ <Cta/>         🟢 server
       └─ <Footer/>      🟢 server
```
- Static section = Server Component (ไม่ส่ง JS) · Interactive = Client Component
- auth state แชร์ผ่าน `useAuth()` (Context) — ไม่ fetch ซ้ำ

---

## 9. 🗄️ Data Model (prisma/schema.prisma)

```
User (1) ──< (หลาย) RetirementPlan   [onDelete: Cascade]
* เงินเก็บเป็น Int (บาทเต็ม) กันทศนิยม float เพี้ยน · % เก็บเป็น Float
* TaxPlan ถูกลบแล้ว (เคยเป็น dead code — มี /tax/calculate แต่ไม่เคยบันทึก DB)
```

**User:** id, email(unique), **password String? (nullable — ไม่ใช้แล้ว)**, **googleId String? @unique**, name?, **avatarUrl?**, createdAt, updatedAt

**RetirementPlan:** id, planName, currentAge, **retirementAge**, **lifeExpectancyAge**, currentSavings, monthlySaving, **monthlyExpense**, monthlyPension, **monthlyRental**, returnBefore, returnAfter, **inflationRate**, targetAmount?, projectedAmount?, gap?, timestamps, userId

> 🔑 **Naming unified แล้ว:** ชื่อ field ใช้ **ชุดเดียวกันทุกเลเยอร์** (DB = DTO = calc = frontend) → ไม่มี mapping ข้ามเลเยอร์อีก ใช้ชื่อตาม schema (`retirementAge`, `lifeExpectancyAge`, `monthlyExpense`, `monthlyRental`, `inflationRate`)

---

## 10. 🔌 API Endpoints

| Method | Path | Auth | ทำอะไร |
|--------|------|:----:|--------|
| GET | `/health` | ❌ | `{ status: 'ok' }` |
| GET | `/auth/google` | ❌ | เริ่ม Google OAuth (redirect ไป Google) |
| GET | `/auth/google/callback` | ❌ | callback → ออก JWT → redirect กลับ frontend |
| GET | `/auth/me` | ✅ | ข้อมูล user ปัจจุบัน (id, email, name, avatarUrl) |
| POST | `/retirement/calculate` | ❌ | คำนวณสดๆ ไม่บันทึก |
| POST | `/retirement/plans` | ✅ | สร้างแผน (คำนวณ + บันทึก) |
| GET | `/retirement/plans` | ✅ | แผนทั้งหมดของ user |
| GET | `/retirement/plans/:id` | ✅ | แผนเดียว (ต้องเป็นเจ้าของ) |
| PATCH | `/retirement/plans/:id` | ✅ | แก้แผน (คำนวณใหม่) |
| DELETE | `/retirement/plans/:id` | ✅ | ลบแผน |
| POST | `/tax/calculate` | ❌ | คำนวณภาษีขั้นบันได |

---

## 11. 🧮 Business Logic

**Retirement (`retirement.calc.ts` — pure functions, มี unit test):**
- `calcTargetAmount` = เงินที่ควรมี ณ วันเกษียณ → Present Value of Annuity (ค่าใช้จ่ายปรับเงินเฟ้อ − รายได้ประจำ, discount ด้วยผลตอบแทนหลังเกษียณ)
- `calcProjectedAmount` = เงินที่คาดว่าจะมี → เงินก้อนโตทบต้น + เงินออมรายเดือน (Future Value of Annuity)
- `gap` = target − projected (บวก = ขาด, ลบ = เกิน)
- จัดการ edge case: `r === 0` (กันหารศูนย์), `Math.max(0, ...)` กันเลขติดลบ

**Tax (`tax.calc.ts`):** ภาษีเงินได้บุคคลธรรมดาแบบ **ขั้นบันได** — เก็บตารางเป็น data (`TAX_BRACKETS`) ไม่ hardcode if

---

## 12. 💻 รันโปรเจกต์ (Local)

**ต้องมี:** Node, Docker Desktop (สำหรับ MySQL)

```bash
# ===== Backend (port 3000) =====
cd D:\retireplan\retireplan-backend
npm install
docker compose up -d                 # เปิด MySQL (container: retireplan-db)
cp .env.example .env                  # แล้วใส่ค่าจริง (ดู §13)
npx prisma migrate dev                # สร้างตาราง
npm run start:dev                     # http://localhost:3000 | Swagger: /docs
npm test                             # รัน unit tests (Vitest)

# ===== Frontend (port 3001) — อีก terminal =====
cd D:\retireplan\retireplan-frontend
npm install
npm run dev -- -p 3001                # http://localhost:3001
```

---

## 13. 🔐 Environment Variables (backend/.env — gitignored)

```
DATABASE_URL="mysql://appuser:apppass@localhost:3306/retireplan"
JWT_SECRET="<สุ่มยาวๆ>"
GOOGLE_CLIENT_ID="<จาก Google Cloud Console>"
GOOGLE_CLIENT_SECRET="<จาก Google Cloud Console>"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
FRONTEND_URL="http://localhost:3001"
```
(frontend ใช้ `NEXT_PUBLIC_API_URL` ถ้าไม่ตั้ง default = `http://localhost:3000`)

**Google Cloud Console (ตั้งไว้แล้ว):** OAuth client (Web application) ที่ account ของเจ้าของ, Authorized redirect URI = `http://localhost:3000/auth/google/callback`, Audience = External + เพิ่มอีเมลตัวเองใน Test users (ปล่อยสถานะ Testing ได้)

---

## 14. 🪵 Decisions Log (สรุปที่ทำมา)

1. เริ่มเป็น NestJS + Prisma + MySQL, Auth แบบ email/password (JWT) + CRUD แผนเกษียณ + สูตร + test + Swagger
2. ทำ Frontend Next.js — landing + calculator เชื่อม API (public /calculate)
3. ย้ายเป็น **Monorepo** (git subtree เก็บ history ทั้ง 2 repo) → push GitHub account ใหม่ (csattayakhun)
4. รื้อ UI ตามแนว planndee → **warm & friendly redesign** (ฟอนต์ Anuphan, teal/amber/stone, chart, mobile menu)
5. **เปลี่ยน auth เป็น Google OAuth อย่างเดียว** (ลบ email/password + หน้า register)
6. **Architecture hardening:** env validation, ValidationPipe harden, response serialization (entities)
7. ลบ **TaxPlan model** (dead code) ผ่าน migration
8. **Code quality:** `@CurrentUser` decorator, graceful shutdown, /health, named constants, prettier, แยก `page.tsx` เป็น components, **unify naming ทุกเลเยอร์**, **ลบคอมเมนต์ทั้งหมด**
9. ทำความสะอาด **Git history** → ทุก commit เป็น `csattayakhun`, ไม่มี Claude/Chirayut001 attribution

---

## 15. ⚠️ Gotchas / บทเรียน

- **ESM:** import ไฟล์ในโปรเจกต์ต้องลงท้าย `.js` (เช่น `'./auth.service.js'`) — import จาก package ไม่ต้อง
- **Prisma pin 6.19.3** — อย่าอัปเป็น 8.x
- **แก้ schema ต้องรัน migration เสมอ** (`npx prisma migrate dev --name xxx`) ไม่งั้น schema/DB drift — และ **ห้าม commit schema โดยไม่มี migration**
- **Windows ล็อกไฟล์:** ย้าย/ลบโฟลเดอร์ที่ Claude Code app หรือ dev server เปิดอยู่ไม่ได้ ("Device or resource busy") → ปิดโปรแกรมก่อน
- **destructive git** (filter-branch, force push) → AI รันไม่ได้ ให้เจ้าของรันเอง
- **server พฤติกรรมแปลก** → ดู terminal ที่รัน `start:dev` ก่อน (404 = server ไม่โหลด route ใหม่/ไม่ได้ restart; connection refused = server ไม่รัน)
- รันหลัง clear context: เปิด Docker → `docker compose up -d` → ลำดับ Docker ก่อน server เสมอ

---

## 16. ▶️ Next Steps (สิ่งที่เหลือ)

### 🚀 1. Deploy (สำคัญสุด — ให้มีลิงก์จริงก่อนยื่นสมัคร)
- **Backend + MySQL → Railway:** New project from GitHub repo `retireplan`, Root Directory = `retireplan-backend`, เพิ่ม MySQL service, ตั้ง env (`DATABASE_URL` ref MySQL, `JWT_SECRET`, `GOOGLE_*`, `FRONTEND_URL`), Build = `npx prisma generate && npm run build`, Start = `npx prisma migrate deploy && node dist/main`
- **Google OAuth:** เพิ่ม **Authorized redirect URI ของ production** (`https://<backend-domain>/auth/google/callback`) ใน Google Cloud Console
- **Frontend → Vercel:** import repo, Root Directory = `retireplan-frontend`, ตั้ง `NEXT_PUBLIC_API_URL` = URL ของ backend prod
- อัปเดต `FRONTEND_URL` บน Railway = URL ของ frontend prod (สำหรับ redirect หลัง login)
- **เติมลิงก์ Live Demo + Swagger ใน README**

### 📋 2. (Nice-to-have) เพิ่ม test
- auth/CRUD service tests + e2e (ตอนนี้มีแค่ calc + health)

---

## ✅ Checklist ก่อนทำต่อ (หลัง clear context)
- [ ] อ่านไฟล์นี้ + `CODING_PRINCIPLES.md`
- [ ] `docker compose up -d` → `docker ps` เห็น `retireplan-db` Up
- [ ] backend `npm run start:dev` เขียว + `npm test` ผ่าน
- [ ] frontend `npm run dev -- -p 3001` เปิด localhost:3001 ได้
- [ ] จำไว้: commit แบบ atomic, ไม่มี Claude attribution, คอมเมนต์น้อย
