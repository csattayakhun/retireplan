# RetirePlan API 💰

> REST API สำหรับ**วางแผนเกษียณ**และ**คำนวณภาษีเงินได้บุคคลธรรมดา** — สร้างด้วย NestJS + Prisma + MySQL พร้อม Unit Test และ API Docs

โปรเจคนี้เน้น **business logic จริง** (สูตรดอกเบี้ยทบต้น, ภาษีขั้นบันได) ไม่ใช่ CRUD ธรรมดา — ออกแบบให้ testable และ maintainable

**🔗 Live Demo:** _(เพิ่มลิงก์เว็บหลัง deploy)_
**📖 API Docs (Swagger):** _(เพิ่มลิงก์ `/docs` หลัง deploy)_

---

## ✨ Features

- 🧮 **คำนวณเกษียณ** — Future/Present Value of Annuity + ดอกเบี้ยทบต้น + ปรับเงินเฟ้อ
- 🧾 **คำนวณภาษี** — ภาษีเงินได้บุคคลธรรมดาแบบขั้นบันได (progressive brackets)
- 🔐 **Authentication** — JWT + Passport, รหัสผ่าน hash ด้วย bcrypt
- 💾 **บันทึกแผน (CRUD)** — พร้อม ownership scoping (ผู้ใช้เห็นเฉพาะแผนตัวเอง กัน IDOR)
- 🧪 **Unit Tests** — ครอบ business logic + edge cases (Vitest)
- 📖 **API Docs** — Swagger UI ที่ลองยิงได้จากเบราว์เซอร์

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | NestJS (TypeScript, ESM) |
| ORM / Database | Prisma + MySQL 8 |
| Auth | JWT, Passport, bcryptjs |
| Validation | class-validator |
| Testing | Vitest |
| API Docs | Swagger (OpenAPI) |
| Dev Infra | Docker Compose (MySQL) |

## 🏛️ Architecture

แยกชั้นชัดเจนตามหลัก **Separation of Concerns**:

```
Controller (จัดการ HTTP)  →  Service (business logic)  →  Prisma (database)
                                     ↓
                    Pure functions (สูตรคำนวณ — testable ไม่ผูกกับ framework)
```

จุดออกแบบสำคัญ:

- **แยกสูตรคำนวณเป็น pure function** (`*.calc.ts`) → unit test ง่าย ไม่ต้อง mock database
- **เก็บตารางภาษีเป็น data** (ไม่ hardcode if) → ปรับอัตราปีใหม่ได้โดยไม่แตะ logic
- **เก็บเงินเป็น `Int` (บาทเต็ม)** → เลี่ยงปัญหาทศนิยม float เพี้ยน

## 📡 API Endpoints

| Method | Path | Auth | คำอธิบาย |
|--------|------|:----:|----------|
| POST | `/auth/register` | ❌ | สมัครสมาชิก |
| POST | `/auth/login` | ❌ | ล็อกอิน → คืน JWT |
| GET | `/auth/me` | ✅ | ดูข้อมูลตัวเอง |
| POST | `/retirement/calculate` | ❌ | คำนวณเกษียณสดๆ (ไม่บันทึก) |
| POST | `/retirement/plans` | ✅ | สร้างแผนเกษียณ (คำนวณ + บันทึก) |
| GET | `/retirement/plans` | ✅ | ดูแผนทั้งหมดของตัวเอง |
| GET | `/retirement/plans/:id` | ✅ | ดูแผนเดียว |
| PATCH | `/retirement/plans/:id` | ✅ | แก้แผน (คำนวณใหม่) |
| DELETE | `/retirement/plans/:id` | ✅ | ลบแผน |
| POST | `/tax/calculate` | ❌ | คำนวณภาษีขั้นบันได |

> ดูรายละเอียด + ลองยิงได้ครบที่ Swagger UI: `/docs`

## 🚀 Getting Started

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. เปิด MySQL ผ่าน Docker
docker compose up -d

# 3. ตั้งค่า .env (ดูตัวอย่างจาก .env.example)
#    DATABASE_URL="mysql://appuser:apppass@localhost:3306/retireplan"
#    JWT_SECRET="<ข้อความสุ่มยาวๆ>"

# 4. สร้างตารางใน database
npx prisma migrate dev

# 5. รัน server (watch mode)
npm run start:dev
# → http://localhost:3000  |  Swagger: http://localhost:3000/docs
```

## 🧪 Testing

```bash
npm test           # รัน unit tests ทั้งหมด
npm run test:cov   # ดู coverage
```

Unit test ครอบสูตรคำนวณเกษียณและภาษี รวมถึง edge cases เช่น อัตราผลตอบแทน 0% (กันหารศูนย์), รอยต่อขั้นบันไดภาษี, และกรณีรายได้ประจำครอบคลุมค่าใช้จ่าย

## 📁 Project Structure

```
src/
├── auth/          # register, login, JWT strategy, guard
├── retirement/    # สูตรเกษียณ (calc) + CRUD แผน
│   └── retirement.calc.ts   # pure functions + unit test
├── tax/           # สูตรภาษีขั้นบันได (calc) + endpoint
├── prisma/        # PrismaService (เชื่อม MySQL)
└── main.ts        # bootstrap + ValidationPipe + Swagger + CORS
prisma/
└── schema.prisma  # User, RetirementPlan, TaxPlan
```

## 👤 Author

**Chirayut** — Backend / Full-Stack Developer (Internship)

- GitHub: [@your-username](https://github.com/your-username) _(แก้เป็น username จริง)_
- Email: _(ใส่อีเมลที่อยากให้ติดต่อ)_

---

_โปรเจคนี้เป็นส่วนหนึ่งของ portfolio สำหรับสมัครฝึกงานสาย Backend / Full-Stack_
