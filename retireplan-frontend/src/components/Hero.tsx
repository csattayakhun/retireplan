const checklist = [
  "ใช้ฟรี เริ่มได้โดยไม่ต้องสมัคร",
  "คิดดอกเบี้ยทบต้นและเงินเฟ้อให้ครบ",
  "แก้ตัวเลขแล้วเห็นผลใหม่ทันที",
];

const sampleRows: [string, string][] = [
  ["ควรมีตอนเกษียณ", "8,011,044"],
  ["คาดว่าจะมี", "5,624,838"],
  ["ยังขาดอีก", "2,386,206"],
];

export function Hero() {
  return (
    <header
      id="top"
      className="bg-gradient-to-b from-teal-50 via-amber-50/30 to-white"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-teal-700 shadow-sm ring-1 ring-teal-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{" "}
            วางแผนเกษียณได้เองในไม่กี่นาที
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            เกษียณสบายใจ
            <br />
            เริ่มจาก<span className="text-teal-600">ตัวเลขที่ใช่</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-500">
            กรอกข้อมูลการเงินของคุณ แล้วรู้ทันทีว่าต้องเตรียมเงินเท่าไหร่
            จะมีพอไหม และควรออมเพิ่มแค่ไหน — ใช้ฟรี เริ่มได้โดยไม่ต้องสมัคร
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a
              href="#calculator"
              className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
            >
              <p className="font-semibold text-stone-800">ลองคำนวณเลย</p>
              <p className="mt-1 text-xs text-stone-500">
                ใส่ตัวเลขของคุณ แล้วดูเป้าหมายเงินเกษียณทันที
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-teal-600 transition group-hover:translate-x-1">
                เริ่มเลย →
              </span>
            </a>
            <a
              href="/login"
              className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
            >
              <p className="font-semibold text-stone-800">เก็บแผนไว้กับตัว</p>
              <p className="mt-1 text-xs text-stone-500">
                ล็อกอินด้วย Google เพื่อบันทึกและกลับมาปรับทีหลัง
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-teal-600 transition group-hover:translate-x-1">
                เข้าสู่ระบบ →
              </span>
            </a>
          </div>

          <ul className="mt-6 space-y-2.5 text-sm text-stone-600">
            {checklist.map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-200/40 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative rounded-3xl border border-stone-100 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400">ตัวอย่างผลลัพธ์</p>
                <p className="font-semibold text-stone-700">
                  แผนของคุณจะหน้าตาแบบนี้
                </p>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs text-teal-600">
                ตัวอย่าง
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {sampleRows.map(([k, v], i) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3"
                >
                  <span className="text-sm text-stone-500">{k}</span>
                  <span
                    className={`font-semibold ${i === 1 ? "text-teal-600" : i === 2 ? "text-amber-600" : "text-stone-800"}`}
                  >
                    {v} ฿
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-stone-500">ความคืบหน้าสู่เป้าหมาย</span>
                <span className="font-semibold text-teal-600">70%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-teal-500"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-stone-50 p-3 text-xs text-stone-400">
              เป็นเพียงตัวอย่าง ตัวเลขจริงขึ้นกับข้อมูลที่คุณกรอก
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
