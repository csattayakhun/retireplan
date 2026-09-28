# RetirePlan 💰 — Full-Stack Retirement Planning App

แอปวางแผนเกษียณ + คำนวณภาษีเงินได้บุคคลธรรมดา สร้างครบทั้ง **Backend API** และ **Frontend** พร้อม Unit Test, Auth และ API Docs

> โปรเจคนี้เน้น **business logic จริง** (สูตรดอกเบี้ยทบต้น, ภาษีขั้นบันได) + **การทดสอบ** — ไม่ใช่ CRUD ธรรมดา

**🔗 Live Demo:** _(เพิ่มลิงก์เว็บหลัง deploy)_
**📖 API Docs (Swagger):** _(เพิ่มลิงก์ `/docs` หลัง deploy)_

---

## 📦 โครงสร้าง (Monorepo)

| โฟลเดอร์ | คืออะไร | Stack |
|----------|---------|-------|
| [`retireplan-backend/`](./retireplan-backend) | REST API + business logic | NestJS, Prisma, MySQL, JWT, Vitest, Swagger |
| [`retireplan-frontend/`](./retireplan-frontend) | หน้าเว็บคำนวณเกษียณ | Next.js, TypeScript, Tailwind CSS |

> รายละเอียดแต่ละส่วน + วิธีรัน ดูได้ใน README ของแต่ละโฟลเดอร์

## ✨ Highlights

- 🧮 **คำนวณเกษียณ** — Future/Present Value of Annuity + ดอกเบี้ยทบต้น + ปรับเงินเฟ้อ
- 🧾 **คำนวณภาษี** — ขั้นบันได (progressive brackets) แบบ data-driven
- 🔐 **Auth** — JWT + Passport + ownership scoping (กัน IDOR)
- 🧪 **Unit Tests** — ครอบ business logic + edge cases (Vitest)
- 📖 **Swagger UI** — API docs ที่ลองยิงได้จากเบราว์เซอร์
- 🎨 **Frontend** — ฟอร์มคำนวณ responsive เชื่อม API จริง

## 🚀 รันเร็วๆ (local)

```bash
# Backend (port 3000)
cd retireplan-backend
npm install
docker compose up -d          # เปิด MySQL
cp .env.example .env          # แล้วใส่ค่าจริง
npx prisma migrate dev
npm run start:dev

# Frontend (port 3001) — อีก terminal
cd retireplan-frontend
npm install
npm run dev -- -p 3001
```

## 👤 Author

**Chirayut** — Backend / Full-Stack Developer (Internship)

- GitHub: [@your-username](https://github.com/your-username) _(แก้เป็น username จริง)_

---

_โปรเจคนี้เป็นส่วนหนึ่งของ portfolio สำหรับสมัครฝึกงาน_
