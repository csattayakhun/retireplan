// Server Component — static
const steps = [
  {
    no: '1',
    title: 'ใส่ตัวเลขของคุณ',
    desc: 'บอกอายุ เงินเก็บ เงินออมต่อเดือน และค่าใช้จ่ายที่คาดไว้หลังเกษียณ',
  },
  {
    no: '2',
    title: 'เห็นผลทันที',
    desc: 'รู้เป้าหมายเงินเกษียณ เงินที่คาดว่าจะมี และส่วนที่ยังขาด',
  },
  {
    no: '3',
    title: 'ลองปรับจนพอใจ',
    desc: 'เพิ่มเงินออมหรือเลื่อนอายุเกษียณ แล้วดูตัวเลขเปลี่ยนทันที',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">วิธีใช้งาน</p>
        <h2 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">ง่ายใน 3 ขั้นตอน</h2>
        <p className="mt-2 text-stone-500">ไม่ต้องเชี่ยวชาญการเงิน ก็วางแผนเองได้</p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.no} className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-xl font-bold text-white ring-4 ring-teal-100">
              {s.no}
            </div>
            <h3 className="mt-4 font-semibold text-stone-800">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
