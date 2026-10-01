'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { API_URL, savePlan } from '../lib/api';
import { useAuth } from './auth-context';

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
  currentAge: 30,
  retireAge: 60,
  lifeExpectancy: 80,
  currentSavings: 100000,
  monthlySaving: 5000,
  monthlyExpenseAfterRetire: 20000,
  monthlyPension: 0,
  monthlyRentIncome: 0,
  returnBefore: 6,
  returnAfter: 4,
  inflation: 3,
};

// ช่องที่เป็น "เงิน" → แสดง ฿ + คอมมา
const moneyFields = new Set<keyof FormState>([
  'currentSavings',
  'monthlySaving',
  'monthlyExpenseAfterRetire',
  'monthlyPension',
  'monthlyRentIncome',
]);

const sections: {
  title: string;
  fields: { key: keyof FormState; label: string }[];
}[] = [
  {
    title: 'ข้อมูลอายุ',
    fields: [
      { key: 'currentAge', label: 'อายุปัจจุบัน' },
      { key: 'retireAge', label: 'อายุที่จะเกษียณ' },
      { key: 'lifeExpectancy', label: 'คาดว่าอยู่ถึงอายุ' },
    ],
  },
  {
    title: 'เงินและค่าใช้จ่าย',
    fields: [
      { key: 'currentSavings', label: 'เงินเก็บปัจจุบัน' },
      { key: 'monthlySaving', label: 'ออมต่อเดือน' },
      { key: 'monthlyExpenseAfterRetire', label: 'ค่าใช้จ่าย/เดือน หลังเกษียณ' },
      { key: 'monthlyPension', label: 'บำนาญ/เดือน' },
      { key: 'monthlyRentIncome', label: 'ค่าเช่า/เดือน' },
    ],
  },
  {
    title: 'สมมติฐาน (% ต่อปี)',
    fields: [
      { key: 'returnBefore', label: 'ผลตอบแทนก่อนเกษียณ' },
      { key: 'returnAfter', label: 'ผลตอบแทนหลังเกษียณ' },
      { key: 'inflation', label: 'เงินเฟ้อ' },
    ],
  },
];

const baht = (n: number) => n.toLocaleString('th-TH');

export function Calculator() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // map ชื่อ field จากฟอร์ม → ให้ตรงกับ backend DTO
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
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      const res = await fetch(`${API_URL}/retirement/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`คำนวณไม่สำเร็จ (${res.status})`);
      setResult((await res.json()) as Result);
      setTimeout(
        () =>
          document
            .getElementById('result')
            ?.scrollIntoView({ behavior: 'smooth' }),
        50,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  const percent =
    result && result.targetAmount > 0
      ? Math.min(
          100,
          Math.round((result.projectedAmount / result.targetAmount) * 100),
        )
      : 0;
  const onTrack = result ? result.gap <= 0 : false;
  const chartData = result
    ? [
        { name: 'ควรมี', value: result.targetAmount, fill: '#44403c' },
        { name: 'คาดว่าจะมี', value: result.projectedAmount, fill: '#0d9488' },
      ]
    : [];

  return (
    <>
      <section id="calculator" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
              เครื่องคำนวณ
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
              ลองคำนวณแผนเกษียณของคุณ
            </h2>
            <p className="mt-2 text-stone-500">ใส่ตัวเลขด้านล่าง แล้วกดคำนวณได้เลย</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-3xl border border-stone-100 bg-white p-6 shadow-lg sm:p-8"
          >
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-semibold text-teal-700">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map(({ key, label }) => {
                    const isMoney = moneyFields.has(key);
                    return (
                      <label key={key} className="flex flex-col text-sm">
                        <span className="mb-1 text-stone-500">{label}</span>
                        <div className="relative">
                          {isMoney && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                              ฿
                            </span>
                          )}
                          {isMoney ? (
                            <input
                              type="text"
                              inputMode="numeric"
                              value={baht(form[key])}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/[^\d]/g, '');
                                handleChange(key, digits === '' ? '0' : digits);
                              }}
                              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-7 pr-3 text-stone-800 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                            />
                          ) : (
                            <input
                              type="number"
                              min={0}
                              value={form[key]}
                              onChange={(e) => handleChange(key, e.target.value)}
                              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-stone-800 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                            />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-teal-600 py-3.5 font-semibold text-white shadow-md transition hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'กำลังคำนวณ…' : 'คำนวณแผนเกษียณ'}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-red-600">
              {error}
            </p>
          )}

          {result && (
            <div id="result" className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="ควรมีตอนเกษียณ" value={result.targetAmount} accent="text-stone-800" />
                <StatCard label="คาดว่าจะมี" value={result.projectedAmount} accent="text-teal-600" />
                <StatCard
                  label={onTrack ? 'เกินเป้า' : 'ยังขาดอีก'}
                  value={Math.abs(result.gap)}
                  accent={onTrack ? 'text-green-600' : 'text-amber-600'}
                />
              </div>

              <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-lg">
                <p className="mb-4 text-sm font-medium text-stone-600">
                  เปรียบเทียบ เป้าหมาย vs เงินที่คาดว่าจะมี
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#78716c' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                      tick={{ fontSize: 12, fill: '#a8a29e' }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip formatter={(v) => [`${baht(Number(v))} ฿`, '']} cursor={{ fill: '#f5f5f4' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-lg">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-600">ความคืบหน้าสู่เป้าหมาย</span>
                  <span className={`font-bold ${onTrack ? 'text-green-600' : 'text-teal-600'}`}>
                    {percent}%
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${onTrack ? 'bg-green-500' : 'bg-teal-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-stone-500">
                  {onTrack
                    ? 'เยี่ยม! แผนนี้มีเงินพอสำหรับเกษียณของคุณแล้ว'
                    : `ตอนนี้มีประมาณ ${percent}% ของเป้าหมาย — ลองเพิ่มเงินออมต่อเดือนดู`}
                </p>
              </div>

              {user ? (
                <div className="rounded-3xl border border-stone-100 bg-white p-6 text-center shadow-lg">
                  <p className="mb-3 text-sm text-stone-500">อยากเก็บแผนนี้ไว้ดูภายหลังไหม?</p>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    {saving ? 'กำลังบันทึก…' : saved ? 'บันทึกแล้ว ✓' : 'บันทึกแผนนี้'}
                  </button>
                  {saved && (
                    <p className="mt-3 text-sm text-stone-600">
                      <a href="/plans" className="font-medium text-teal-600 hover:underline">
                        ดูแผนของฉัน →
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-stone-100 bg-white p-6 text-center shadow-lg">
                  <p className="text-sm text-stone-500">
                    <a href="/login" className="font-medium text-teal-600 hover:underline">
                      เข้าสู่ระบบ
                    </a>{' '}
                    เพื่อบันทึกแผนนี้ไว้ดูภายหลัง
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-stone-100 bg-white p-5 text-center shadow-lg">
      <p className="text-xs text-stone-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{baht(value)}</p>
      <p className="text-xs text-stone-400">บาท</p>
    </div>
  );
}
