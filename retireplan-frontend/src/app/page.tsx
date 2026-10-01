'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getMe, tokenStore, savePlan } from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface FormState {
  currentAge: number; retireAge: number; lifeExpectancy: number;
  currentSavings: number; monthlySaving: number; monthlyExpenseAfterRetire: number;
  monthlyPension: number; monthlyRentIncome: number;
  returnBefore: number; returnAfter: number; inflation: number;
}
interface Result { targetAmount: number; projectedAmount: number; gap: number; }

const initialForm: FormState = {
  currentAge: 30, retireAge: 60, lifeExpectancy: 80,
  currentSavings: 100000, monthlySaving: 5000, monthlyExpenseAfterRetire: 20000,
  monthlyPension: 0, monthlyRentIncome: 0,
  returnBefore: 6, returnAfter: 4, inflation: 3,
};

// ช่องที่เป็น "เงิน" → แสดง ฿ + คอมมา
const moneyFields = new Set<keyof FormState>([
  'currentSavings', 'monthlySaving', 'monthlyExpenseAfterRetire', 'monthlyPension', 'monthlyRentIncome',
]);

const sections: { title: string; fields: { key: keyof FormState; label: string }[] }[] = [
  { title: 'ข้อมูลอายุ', fields: [
    { key: 'currentAge', label: 'อายุปัจจุบัน' },
    { key: 'retireAge', label: 'อายุที่จะเกษียณ' },
    { key: 'lifeExpectancy', label: 'คาดว่าอยู่ถึงอายุ' },
  ]},
  { title: 'เงินและค่าใช้จ่าย', fields: [
    { key: 'currentSavings', label: 'เงินเก็บปัจจุบัน' },
    { key: 'monthlySaving', label: 'ออมต่อเดือน' },
    { key: 'monthlyExpenseAfterRetire', label: 'ค่าใช้จ่าย/เดือน หลังเกษียณ' },
    { key: 'monthlyPension', label: 'บำนาญ/เดือน' },
    { key: 'monthlyRentIncome', label: 'ค่าเช่า/เดือน' },
  ]},
  { title: 'สมมติฐาน (% ต่อปี)', fields: [
    { key: 'returnBefore', label: 'ผลตอบแทนก่อนเกษียณ' },
    { key: 'returnAfter', label: 'ผลตอบแทนหลังเกษียณ' },
    { key: 'inflation', label: 'เงินเฟ้อ' },
  ]},
];

const navLinks = [
  { href: '#top', label: 'หน้าหลัก' },
  { href: '#how', label: 'วิธีใช้งาน' },
  { href: '#calculator', label: 'คำนวณเกษียณ' },
];

const steps = [
  { no: '1', title: 'ใส่ตัวเลขของคุณ', desc: 'บอกอายุ เงินเก็บ เงินออมต่อเดือน และค่าใช้จ่ายที่คาดไว้หลังเกษียณ' },
  { no: '2', title: 'เห็นผลทันที', desc: 'รู้เป้าหมายเงินเกษียณ เงินที่คาดว่าจะมี และส่วนที่ยังขาด' },
  { no: '3', title: 'ลองปรับจนพอใจ', desc: 'เพิ่มเงินออมหรือเลื่อนอายุเกษียณ แล้วดูตัวเลขเปลี่ยนทันที' },
];

const principles = [
  { title: 'คิดจากตัวเลขของคุณเอง', desc: 'ไม่ใช่ค่าเฉลี่ยกลางๆ แต่คำนวณจากข้อมูลที่คุณกรอกจริง' },
  { title: 'ปรับสมมติฐานได้', desc: 'ตั้งผลตอบแทน เงินเฟ้อ และอายุเกษียณได้เองตามที่คาด' },
  { title: 'เริ่มได้เลย ไม่ยุ่งยาก', desc: 'ใช้ฟรี ไม่ต้องสมัครหรือผูกบัญชีก่อนคำนวณ' },
  { title: 'ไว้ช่วยคิด ไม่ใช่คำสั่ง', desc: 'ผลลัพธ์เป็นแนวทางวางแผน ไม่ใช่คำแนะนำการลงทุน' },
];

const baht = (n: number) => n.toLocaleString('th-TH');

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email: string; avatarUrl?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function logout() {
    tokenStore.clear();
    setUser(null);
    showToast('ออกจากระบบแล้ว');
  }

  async function handleSave() {
    setSaving(true);
    try {
      await savePlan({
        currentAge: form.currentAge,
        retirementAge: form.retireAge,
        lifeExpectancyAge: form.lifeExpectancy,
        currentSavings: form.currentSavings,
        monthlySaving: form.monthlySaving,
        monthlyExpense: form.monthlyExpenseAfterRetire,
        monthlyPension: form.monthlyPension,
        monthlyRental: form.monthlyRentIncome,
        returnBefore: form.returnBefore,
        returnAfter: form.returnAfter,
        inflationRate: form.inflation,
      });
      setSaved(true);
      showToast('บันทึกแผนเรียบร้อย ✓');
    } catch {
      showToast('บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง');
    } finally {
      setSaving(false);
    }
  }

  function handleChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: Number(value) }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setSaved(false);
    try {
      const res = await fetch(`${API_URL}/retirement/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`คำนวณไม่สำเร็จ (${res.status})`);
      setResult((await res.json()) as Result);
      setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  const percent = result && result.targetAmount > 0
    ? Math.min(100, Math.round((result.projectedAmount / result.targetAmount) * 100)) : 0;
  const onTrack = result ? result.gap <= 0 : false;
  const chartData = result
    ? [
        { name: 'ควรมี', value: result.targetAmount, fill: '#334155' },
        { name: 'คาดว่าจะมี', value: result.projectedAmount, fill: '#0d9488' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* ---------- Nav ---------- */}
      <nav className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 font-bold text-white">R</span>
            <span className="text-lg font-bold text-slate-800">Retire<span className="text-teal-600">Plan</span></span>
          </a>

          {/* desktop links */}
          <div className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="transition hover:text-teal-600">{l.label}</a>)}
            {user && <a href="/plans" className="transition hover:text-teal-600">แผนของฉัน</a>}
          </div>

          {/* desktop auth + cta */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  {user.avatarUrl && <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full" />}
                  {user.name ?? user.email}
                </span>
                <button onClick={logout} className="text-sm font-medium text-slate-500 transition hover:text-teal-600">ออกจากระบบ</button>
              </>
            ) : (
              <a href="/login" className="text-sm font-medium text-slate-600 transition hover:text-teal-600">เข้าสู่ระบบ</a>
            )}
            <a href="#calculator" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700">เริ่มคำนวณ</a>
          </div>

          {/* mobile hamburger */}
          <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden" aria-label="เมนู">
            <svg className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'} />
            </svg>
          </button>
        </div>

        {/* mobile panel */}
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2 text-slate-600 hover:bg-slate-50">{l.label}</a>
              ))}
              {user && <a href="/plans" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2 text-slate-600 hover:bg-slate-50">แผนของฉัน</a>}
              <div className="my-1 border-t border-slate-100" />
              {user ? (
                <button onClick={() => { setMenuOpen(false); logout(); }} className="rounded-lg px-2 py-2 text-left text-slate-600 hover:bg-slate-50">ออกจากระบบ</button>
              ) : (
                <a href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2 text-slate-600 hover:bg-slate-50">เข้าสู่ระบบ</a>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ---------- Hero ---------- */}
      <header id="top" className="bg-gradient-to-b from-teal-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> วางแผนเกษียณได้เองในไม่กี่นาที
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              เกษียณสบายใจ<br />เริ่มจาก<span className="text-teal-600">ตัวเลขที่ใช่</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate-500">
              กรอกข้อมูลการเงินของคุณ แล้วรู้ทันทีว่าต้องเตรียมเงินเท่าไหร่ จะมีพอไหม และควรออมเพิ่มแค่ไหน — ใช้ฟรี เริ่มได้โดยไม่ต้องสมัคร
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a href="#calculator" className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md">
                <p className="font-semibold text-slate-800">ลองคำนวณเลย</p>
                <p className="mt-1 text-xs text-slate-500">ใส่ตัวเลขของคุณ แล้วดูเป้าหมายเงินเกษียณทันที</p>
                <span className="mt-2 inline-block text-sm text-teal-600 transition group-hover:translate-x-1">เริ่มเลย →</span>
              </a>
              <a href="/login" className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md">
                <p className="font-semibold text-slate-800">เก็บแผนไว้กับตัว</p>
                <p className="mt-1 text-xs text-slate-500">ล็อกอินด้วย Google เพื่อบันทึกและกลับมาปรับทีหลัง</p>
                <span className="mt-2 inline-block text-sm text-teal-600 transition group-hover:translate-x-1">เข้าสู่ระบบ →</span>
              </a>
            </div>

            <ul className="mt-6 space-y-2.5 text-sm text-slate-600">
              {['ใช้ฟรี เริ่มได้โดยไม่ต้องสมัคร', 'คิดดอกเบี้ยทบต้นและเงินเฟ้อให้ครบ', 'แก้ตัวเลขแล้วเห็นผลใหม่ทันที'].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <svg className="h-5 w-5 flex-shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">ตัวอย่างผลลัพธ์</p>
                <p className="font-semibold text-slate-700">แผนของคุณจะหน้าตาแบบนี้</p>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs text-teal-600">ตัวอย่าง</span>
            </div>
            <div className="mt-5 space-y-3">
              {[['ควรมีตอนเกษียณ', '8,011,044'], ['คาดว่าจะมี', '5,624,838'], ['ยังขาดอีก', '2,386,206']].map(([k, v], i) => (
                <div key={k} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">{k}</span>
                  <span className={`font-bold ${i === 1 ? 'text-teal-600' : i === 2 ? 'text-red-500' : 'text-slate-800'}`}>{v} ฿</span>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-slate-500">ความคืบหน้าสู่เป้าหมาย</span>
                <span className="font-bold text-teal-600">70%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-500" style={{ width: '70%' }} />
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-400">
              เป็นเพียงตัวอย่าง ตัวเลขจริงขึ้นกับข้อมูลที่คุณกรอก
            </p>
          </div>
        </div>
      </header>

      {/* ---------- How it works ---------- */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">ใช้งานง่ายใน 3 ขั้นตอน</h2>
          <p className="mt-2 text-slate-500">ไม่ต้องเชี่ยวชาญการเงิน ก็วางแผนเองได้</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.no} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">{s.no}</div>
              <h3 className="mt-4 font-semibold text-slate-800">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Principles ---------- */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">เข้าใจง่าย และตรงไปตรงมา</h2>
            <p className="mt-2 text-slate-500">เราเปลี่ยนตัวเลขให้เป็นภาพที่คุณตัดสินใจต่อได้</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <div key={p.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Calculator ---------- */}
      <section id="calculator" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">ลองคำนวณแผนเกษียณของคุณ</h2>
            <p className="mt-2 text-slate-500">ใส่ตัวเลขด้านล่าง แล้วกดคำนวณได้เลย</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-semibold text-teal-700">{section.title}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map(({ key, label }) => {
                    const isMoney = moneyFields.has(key);
                    return (
                      <label key={key} className="flex flex-col text-sm">
                        <span className="mb-1 text-slate-500">{label}</span>
                        <div className="relative">
                          {isMoney && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">฿</span>}
                          {isMoney ? (
                            <input
                              type="text"
                              inputMode="numeric"
                              value={baht(form[key])}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/[^\d]/g, '');
                                handleChange(key, digits === '' ? '0' : digits);
                              }}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-slate-800 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                            />
                          ) : (
                            <input
                              type="number"
                              min={0}
                              value={form[key]}
                              onChange={(e) => handleChange(key, e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                            />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-md transition hover:bg-teal-700 disabled:opacity-50">
              {loading ? 'กำลังคำนวณ…' : 'คำนวณแผนเกษียณ'}
            </button>
          </form>

          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-red-600">{error}</p>}

          {result && (
            <div id="result" className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="ควรมีตอนเกษียณ" value={result.targetAmount} accent="text-slate-800" />
                <StatCard label="คาดว่าจะมี" value={result.projectedAmount} accent="text-teal-600" />
                <StatCard label={onTrack ? 'เกินเป้า' : 'ยังขาดอีก'} value={Math.abs(result.gap)} accent={onTrack ? 'text-green-600' : 'text-red-500'} />
              </div>

              {/* chart */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <p className="mb-4 text-sm font-medium text-slate-600">เปรียบเทียบ เป้าหมาย vs เงินที่คาดว่าจะมี</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip formatter={(v: number) => [`${baht(v)} ฿`, '']} cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* progress */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">ความคืบหน้าสู่เป้าหมาย</span>
                  <span className={`font-bold ${onTrack ? 'text-green-600' : 'text-teal-600'}`}>{percent}%</span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full transition-all duration-700 ${onTrack ? 'bg-green-500' : 'bg-teal-500'}`} style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  {onTrack ? 'เยี่ยม! แผนนี้มีเงินพอสำหรับเกษียณของคุณแล้ว' : `ตอนนี้มีประมาณ ${percent}% ของเป้าหมาย — ลองเพิ่มเงินออมต่อเดือนดู`}
                </p>
              </div>

              {/* save */}
              {user ? (
                <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-lg">
                  <p className="mb-3 text-sm text-slate-500">อยากเก็บแผนนี้ไว้ดูภายหลังไหม?</p>
                  <button onClick={handleSave} disabled={saving}
                    className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50">
                    {saving ? 'กำลังบันทึก…' : saved ? 'บันทึกแล้ว ✓' : 'บันทึกแผนนี้'}
                  </button>
                  {saved && (
                    <p className="mt-3 text-sm text-slate-600">
                      <a href="/plans" className="font-medium text-teal-600 hover:underline">ดูแผนของฉัน →</a>
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-lg">
                  <p className="text-sm text-slate-500">
                    <a href="/login" className="font-medium text-teal-600 hover:underline">เข้าสู่ระบบ</a> เพื่อบันทึกแผนนี้ไว้ดูภายหลัง
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-teal-600">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">พร้อมวางแผนอนาคตหรือยัง?</h2>
          <p className="mt-3 text-teal-50">ใช้เวลาไม่ถึงนาที ก็รู้ว่าเกษียณของคุณต้องเตรียมอะไรบ้าง</p>
          <a href="#calculator" className="mt-7 inline-block rounded-xl bg-white px-8 py-3.5 font-semibold text-teal-700 shadow-md transition hover:bg-teal-50">คำนวณแผนของฉัน</a>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center text-sm text-slate-400">
        RetirePlan — Full-Stack Portfolio Project ·
        <a href="https://github.com/csattayakhun/retireplan" target="_blank" className="ml-1 text-slate-500 hover:text-teal-600">GitHub</a>
      </footer>

      {/* ---------- Toast ---------- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{baht(value)}</p>
      <p className="text-xs text-slate-400">บาท</p>
    </div>
  );
}
