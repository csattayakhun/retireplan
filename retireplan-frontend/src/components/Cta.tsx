export function Cta() {
  return (
    <section className="bg-teal-600">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          พร้อมวางแผนอนาคตหรือยัง?
        </h2>
        <p className="mt-3 text-teal-50">
          ใช้เวลาไม่ถึงนาที ก็รู้ว่าเกษียณของคุณต้องเตรียมอะไรบ้าง
        </p>
        <a
          href="#calculator"
          className="mt-7 inline-block rounded-full bg-white px-8 py-3.5 font-semibold text-teal-700 shadow-md transition hover:bg-teal-50"
        >
          คำนวณแผนของฉัน
        </a>
      </div>
    </section>
  );
}
