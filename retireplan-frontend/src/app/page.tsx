'use client'; // ต้องมี — เพราะใช้ useState + event (client component)

import { useState } from 'react';

// อ่าน URL ของ API จาก env (prod) ถ้าไม่มีใช้ localhost (dev)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// โครงข้อมูลฟอร์ม — ชื่อ field ตรงกับ CalculateRetirementDto ของ backend
interface FormState {
  currentAge: number;
  retireAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlySaving: number;
  monthlyExpenseAfterRetire: number;
  monthlyPension: number;
  monthlyRentIncome: number;
  returnBefore: number;
  returnAfter: number;
  inflation: number;
}

interface Result {
  targetAmount: number;
  projectedAmount: number;
  gap: number;
}

const initialForm: FormState = {
  currentAge: 30, retireAge: 60, lifeExpectancy: 80,
  currentSavings: 100000, monthlySaving: 5000, monthlyExpenseAfterRetire: 20000,
  monthlyPension: 0, monthlyRentIncome: 0,
  returnBefore: 6, returnAfter: 4, inflation: 3,
};

const fields: { key: keyof FormState; label: string }[] = [
  { key: 'currentAge', label: 'อายุปัจจุบัน (ปี)' },
  { key: 'retireAge', label: 'อายุที่จะเกษียณ' },
  { key: 'lifeExpectancy', label: 'คาดว่าจะอยู่ถึงอายุ' },
  { key: 'currentSavings', label: 'เงินเก็บปัจจุบัน (บาท)' },
  { key: 'monthlySaving', label: 'ออมต่อเดือน (บาท)' },
  { key: 'monthlyExpenseAfterRetire', label: 'ค่าใช้จ่าย/เดือน หลังเกษียณ' },
  { key: 'monthlyPension', label: 'บำนาญ/เดือน' },
  { key: 'monthlyRentIncome', label: 'ค่าเช่า/เดือน' },
  { key: 'returnBefore', label: '% ผลตอบแทนก่อนเกษียณ' },
  { key: 'returnAfter', label: '% ผลตอบแทนหลังเกษียณ' },
  { key: 'inflation', label: '% เงินเฟ้อ' },
];

const baht = (n: number) => n.toLocaleString('th-TH');

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: Number(value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/retirement/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`คำนวณไม่สำเร็จ (${res.status})`);
      setResult((await res.json()) as Result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-800">RetirePlan 💰</h1>
        <p className="mt-1 text-slate-500">เครื่องคำนวณวางแผนเกษียณ</p>

        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map(({ key, label }) => (
              <label key={key} className="flex flex-col text-sm">
                <span className="mb-1 text-slate-600">{label}</span>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'กำลังคำนวณ...' : 'คำนวณ'}
          </button>
        </form>

        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">{error}</p>}

        {result && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ResultCard label="ควรมีตอนเกษียณ" value={result.targetAmount} color="text-slate-800" />
            <ResultCard label="คาดว่าจะมี" value={result.projectedAmount} color="text-blue-600" />
            <ResultCard
              label={result.gap > 0 ? 'ยังขาดอีก' : 'เกินเป้า'}
              value={Math.abs(result.gap)}
              color={result.gap > 0 ? 'text-red-600' : 'text-green-600'}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function ResultCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{baht(value)} ฿</p>
    </div>
  );
}