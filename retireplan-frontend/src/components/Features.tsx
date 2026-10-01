// Server Component — static
// แต่ละการ์ดใช้ไอคอน + โทนต่างกัน (teal/amber สลับ)
const principles = [
  {
    tone: 'teal',
    title: 'คิดจากตัวเลขของคุณเอง',
    desc: 'ไม่ใช่ค่าเฉลี่ยกลางๆ แต่คำนวณจากข้อมูลที่คุณกรอกจริง',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  },
  {
    tone: 'amber',
    title: 'ปรับสมมติฐานได้',
    desc: 'ตั้งผลตอบแทน เงินเฟ้อ และอายุเกษียณได้เองตามที่คาด',
    icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75',
  },
  {
    tone: 'teal',
    title: 'เริ่มได้เลย ไม่ยุ่งยาก',
    desc: 'ใช้ฟรี ไม่ต้องสมัครหรือผูกบัญชีก่อนคำนวณ',
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  },
  {
    tone: 'amber',
    title: 'ไว้ช่วยคิด ไม่ใช่คำสั่ง',
    desc: 'ผลลัพธ์เป็นแนวทางวางแผน ไม่ใช่คำแนะนำการลงทุน',
    icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  },
];

export function Features() {
  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
            ทำไมต้อง RetirePlan
          </p>
          <h2 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
            เข้าใจง่าย และตรงไปตรงมา
          </h2>
          <p className="mt-2 text-stone-500">เราเปลี่ยนตัวเลขให้เป็นภาพที่คุณตัดสินใจต่อได้</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${p.tone === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'}`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-stone-800">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
