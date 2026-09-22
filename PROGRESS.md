# 📘 RetirePlan — คู่มือความคืบหน้า & Handoff (อ่านไฟล์นี้ก่อนทำต่อ)

> ไฟล์นี้สรุปทุกอย่างตั้งแต่เริ่มโปรเจค เพื่อให้กลับมาทำต่อได้ทันทีหลัง clear context
> **อัปเดตล่าสุด:** จบ Lesson 4 (ระบบ Auth ครบ) — กำลังจะเริ่ม Lesson 5

---

## 🎯 1. โปรเจคนี้คืออะไร

**RetirePlan** = เว็บ/API วางแผนเกษียณ + คำนวณภาษีเงินได้บุคคลธรรมดา (แรงบันดาลใจจาก planndee.com)

- **จุดประสงค์:** เป็น **Portfolio ชิ้นแรก** ของนักศึกษา เพื่อสมัคร **ฝึกงาน (internship) สาย Backend / Full-Stack**
- **จุดขาย:** ไม่ใช่แค่ CRUD ธรรมดา — มี **business logic ซับซ้อน** (สูตรเกษียณ + ภาษีขั้นบันได) + **Unit Test** (สิ่งที่นักศึกษาส่วนใหญ่ไม่ทำ)

---

## 👤 2. โปรไฟล์เจ้าของโปรเจค

- นักศึกษา กำลังเตรียมตัวฝึกงาน
- ทักษะเดิม: React, Node, MySQL, Docker
- ตำแหน่งเป้าหมาย: Backend / Full-Stack

---

## ⚠️ 3. กฎการทำงาน (สำคัญมาก — ต้องปฏิบัติตาม)

> **สอนทีละขั้น — ห้ามทำแทน user**
>
> - **ห้าม**ใช้ Write/Edit/Bash สร้างไฟล์หรือรันคำสั่งแทน user
> - หน้าที่ของผู้สอน = **อธิบาย + บอกให้พิมพ์อะไร + ตรวจงาน (อ่านไฟล์เพื่อ debug ได้)** เท่านั้น
> - สอนทีละ step เล็กๆ แล้ว**หยุดรอ user รายงานผล**ก่อนไปต่อ
> - **เหตุผล:** user ต้องพิมพ์เอง/รันเอง เพื่อเข้าใจจริงและตอบสัมภาษณ์ได้
> - **ข้อยกเว้น:** ถ้า user สั่งตรงๆ ว่า "commit ให้" หรือ "เขียนไฟล์สรุปให้" แบบนี้ทำให้ได้

---

## 🛠️ 4. Tech Stack (ล็อกแล้ว ห้ามเปลี่ยน)

| ส่วน | เทคโนโลยี | เวอร์ชัน/หมายเหตุ |
|------|-----------|------------------|
| Backend | **NestJS** | ESM (`"type": "module"`) |
| ORM | **Prisma** | **6.19.3** (pin ไว้ — ห้ามใช้ 8.x rc!) |
| Database | **MySQL 8.0** | รันผ่าน Docker Compose |
| Auth | **JWT** + Passport | `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` |
| Password | **bcryptjs** | (ไม่ใช่ `bcrypt` — เลี่ยงปัญหา compile บน Windows) |
| Validation | class-validator, class-transformer | |
| Config | @nestjs/config | อ่าน `.env` |
| Test | **Jest/Vitest** | ยังไม่เริ่ม (Lesson 5) |
| Frontend | Next.js + TS + Tailwind | ยังไม่เริ่ม (Lesson 9) |
| Deploy | Vercel/Railway | ยังไม่เริ่ม (Lesson 10) |

**Scope = MVP:** คำนวณเกษียณ + คำนวณภาษี + Auth + บันทึกแผน (CRUD)

---

## 💻 5. ข้อมูลสภาพแวดล้อม (Environment)

- **OS:** Windows 11, terminal: Git Bash + PowerShell
- **โฟลเดอร์โปรเจค:** `D:\retireplan-api` (เป็น git repo, branch `master`)
- **Server รันที่:** `http://localhost:3000`
- **MySQL:** container ชื่อ `retireplan-db`, port `3306`

**ค่าเชื่อมต่อ database (local dev เท่านั้น):**
```
user: appuser | password: apppass | database: retireplan | root password: rootpass
```

**ไฟล์ `.env`** (ถูก gitignore ไว้ — ไม่ขึ้น GitHub):
```
DATABASE_URL="mysql://appuser:apppass@localhost:3306/retireplan"
JWT_SECRET="<ข้อความสุ่มยาวๆ>"
```

---

## 🚀 6. คำสั่งที่ใช้บ่อย (Cheat Sheet)

```bash
# 1. เปิด MySQL (ต้องเปิด Docker Desktop ก่อน)
docker compose up -d
docker ps                         # เช็คว่า retireplan-db ขึ้น Up

# 2. รัน server (watch mode — แก้โค้ดแล้ว reload เอง)
npm run start:dev

# 3. ดู/แก้ข้อมูลใน database แบบเห็นภาพ
npx prisma studio

# 4. เมื่อแก้ schema.prisma แล้ว สร้าง migration ใหม่
npx prisma migrate dev --name <ชื่อ>

# 5. git
git add -A
git commit -m "type: message"     # เช่น feat:, fix:, chore:
```

> **กฎทอง:** พิมพ์ `pwd` ก่อนรันคำสั่งสำคัญเสมอ (ต้องอยู่ `D:\retireplan-api`)

---

## 📁 7. โครงสร้างไฟล์ปัจจุบัน

```
retireplan-api/
├── prisma/
│   ├── schema.prisma            # พิมพ์เขียว database (User, RetirementPlan, TaxPlan)
│   └── migrations/              # ประวัติการเปลี่ยน database
├── src/
│   ├── prisma/
│   │   ├── prisma.service.ts    # ตัวเชื่อม NestJS <-> MySQL ($connect ตอนสตาร์ท)
│   │   └── prisma.module.ts     # @Global — แชร์ PrismaService ทั้งแอป
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts  # กติกา input สมัคร (email, password, name?)
│   │   │   └── login.dto.ts     # กติกา input login (email, password)
│   │   ├── auth.controller.ts   # POST /auth/register, POST /auth/login, GET /auth/me
│   │   ├── auth.service.ts      # logic: register (bcrypt hash), login (compare + sign JWT)
│   │   ├── auth.module.ts       # ตั้งค่า JwtModule + PassportModule.register
│   │   ├── jwt.strategy.ts      # ตรวจ JWT จาก header → หา user → แนบ req.user
│   │   └── jwt-auth.guard.ts    # ยามเฝ้า route (extends AuthGuard('jwt'))
│   ├── app.module.ts            # ConfigModule(global) + PrismaModule + AuthModule
│   └── main.ts                  # bootstrap + ValidationPipe(whitelist)
├── docker-compose.yml           # นิยาม MySQL container
├── .env                         # ความลับ (gitignore)
└── PROGRESS.md                  # ไฟล์นี้
```

---

## 🗄️ 8. Database Schema (สรุป)

```
User (1) ──< (หลาย) RetirementPlan
User (1) ──< (หลาย) TaxPlan
* onDelete: Cascade (ลบ user → แผนถูกลบตาม)
* เงินทุกช่องเก็บเป็น Int (บาทเต็ม) กันปัญหาทศนิยมเพี้ยน
* % (ผลตอบแทน/เงินเฟ้อ) เก็บเป็น Float
```

**User:** id, email(unique), password(hashed), name?, createdAt, updatedAt
**RetirementPlan:** อายุปัจจุบัน/เกษียณ/คาดหวัง, เงินเก็บ, ออมต่อเดือน, ค่าใช้จ่ายหลังเกษียณ, บำนาญ, ค่าเช่า, สมมติฐาน(returnBefore/returnAfter/inflation), ผลลัพธ์(targetAmount/projectedAmount/gap — nullable)
**TaxPlan:** taxYear, maritalStatus, totalIncome, deductions, withholdingTax, estimatedTax(nullable)

> รายละเอียดเต็มดูใน `prisma/schema.prisma`

---

## 🔌 9. API Endpoints ที่มีแล้ว

| Method | Path | ต้อง login? | ทำอะไร |
|--------|------|:-----------:|--------|
| POST | `/auth/register` | ❌ | สมัครสมาชิก (hash รหัสด้วย bcrypt, ไม่คืน password) |
| POST | `/auth/login` | ❌ | ล็อกอิน → คืน `{ accessToken }` (JWT) |
| GET | `/auth/me` | ✅ | ดูข้อมูลตัวเอง (ต้องแนบ `Authorization: Bearer <token>`) |

**ตัวอย่างทดสอบ:**
```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"123456\",\"name\":\"Test User\"}"
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"123456\"}"
curl http://localhost:3000/auth/me -H "Authorization: Bearer <token เปล่าๆ ไม่มี < > >"
```

---

## 🐞 10. ปัญหาที่เคยเจอ + วิธีแก้ (กันพลาดซ้ำ)

| ปัญหา | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| หา `prisma/schema.prisma` ไม่เจอ | Prisma 8-rc ไม่ scaffold ให้ | ใช้ Prisma 6.19.3 เสถียร |
| `nest new` สร้างโปรเจคผิดที่ | รันคำสั่งผิดโฟลเดอร์ | `pwd` ก่อนเสมอ |
| Migrate error P3014 (shadow db) | appuser ไม่มีสิทธิ์สร้าง db | `docker exec retireplan-db mysql -uroot -prootpass -e "GRANT ALL PRIVILEGES ON *.* TO 'appuser'@'%'; FLUSH PRIVILEGES;"` |
| server crash: casing `DTO` vs `dto` | import ตัวพิมพ์ไม่ตรงชื่อโฟลเดอร์ | ใช้ตัวเล็ก `dto` ให้ตรงกัน |
| `name must be a number string` | ใช้ `@IsNumberString` แทน `@IsString` | เปลี่ยนเป็น `@IsString()` |
| ObserveAgentWorker telemetry 401 | package `@nestjs/observe` ค่า default | ลบ ObserveModule ออกจาก app.module + `npm uninstall @nestjs/observe` |
| JWT `undefined` / DI error ConfigService | ลืมใส่ `ConfigModule.forRoot({isGlobal:true})` ใน app.module | เพิ่มเข้าไป + **กด Ctrl+S save!** |
| Guard error: resolve `AuthModuleOptions` | ใช้ `PassportModule` เปล่าๆ | ต้อง `PassportModule.register({ defaultStrategy: 'jwt' })` |
| curl /auth/me = 401 | ก๊อป token พร้อม `< > "` เกินมา | ใส่ token เปล่าๆ ติด `Bearer ` (เว้นวรรค 1) |

**กฎทั่วไปของโปรเจคนี้:**
- ESM: import ไฟล์ตัวเองต้องลงท้าย `.js` เสมอ (เช่น `'./dto/login.dto.js'`) — แต่ import จาก package ไม่ต้อง
- server ต่อไม่ได้ (curl (7)) = ไปดู error ที่ **terminal ที่รัน `npm run start:dev`** ก่อนเสมอ

---

## 🗺️ 11. Roadmap — เหลืออีก 6 Lessons

| Lesson | หัวข้อ | สถานะ |
|--------|--------|-------|
| 1 | สร้างโปรเจค NestJS | ✅ |
| 2 | Docker + MySQL + Prisma | ✅ |
| 3 | Database Schema + migration | ✅ |
| 4 | Auth (Register/Login/JWT/Guard) | ✅ |
| **5** | **สูตรคำนวณเกษียณ + Unit Test** | 🔜 **ทำต่อจากตรงนี้** |
| 6 | สูตรคำนวณภาษีขั้นบันได + Test | ⬜ |
| 7 | CRUD บันทึก/ดู/แก้/ลบ แผน | ⬜ |
| 8 | Swagger API Docs | ⬜ |
| 9 | Frontend เชื่อม API (Next.js) | ⬜ |
| 10 | README + Deploy + จัด GitHub | ⬜ |

**ความคืบหน้า: 4/10 (40%)** — ส่วนยาก (setup + database + auth) ผ่านแล้ว

---

## ▶️ 12. เริ่ม Lesson 5 ยังไง (สิ่งที่จะทำต่อ)

**เป้าหมาย Lesson 5:** เขียนสูตรคำนวณเงินเกษียณ + Unit Test

**แนวทาง (hands-on ทีละ step):**
1. สร้าง module `retirement` (`nest g module retirement`, `service`, `controller`)
2. เขียน `RetirementService` — สูตรหลัก:
   - **เงินที่ควรมีตอนเกษียณ (target):** คำนวณค่าใช้จ่ายหลังเกษียณ (ปรับเงินเฟ้อ) × จำนวนปีหลังเกษียณ หัก รายได้ประจำ (บำนาญ+ค่าเช่า)
   - **เงินที่คาดว่าจะมี (projected):** ดอกเบี้ยทบต้นจากเงินต้น + เงินออมรายเดือน (future value of annuity) ด้วย returnBefore
   - **gap:** target − projected
3. แยก logic การคำนวณเป็นฟังก์ชัน pure (รับ input → คืนตัวเลข) เพื่อ **test ง่าย**
4. เขียน **Unit Test** (`*.spec.ts`) ครอบหลายเคส — จุดขาย Portfolio!
5. ทำ endpoint `POST /retirement/calculate` (ยังไม่ต้อง login ก็คำนวณได้)

> **เริ่มด้วยประโยค:** "ไป Lesson 5" แล้วผู้สอนจะพาทำทีละ step ตามกฎข้อ 3

---

## ✅ Checklist ก่อนทำต่อ (หลัง clear context)
- [ ] เปิด Docker Desktop → `docker compose up -d` → `docker ps` เห็น `retireplan-db` Up
- [ ] `npm run start:dev` ขึ้น `Nest application successfully started` ไม่มีแดง
- [ ] ทดสอบ `curl` register/login/me ผ่าน (ยืนยันของเดิมยังใช้ได้)
- [ ] อ่านกฎข้อ 3 (สอนทีละขั้น ห้ามทำแทน) แล้วเริ่ม Lesson 5
