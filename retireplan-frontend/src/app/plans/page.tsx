"use client";

import { useEffect, useState } from "react";
import { getPlans, deletePlan } from "../../lib/api";

interface Plan {
  id: number;
  planName: string;
  retirementAge: number;
  targetAmount: number | null;
  projectedAmount: number | null;
  gap: number | null;
  createdAt: string;
}

const baht = (n: number | null) => (n ?? 0).toLocaleString("th-TH");

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => setError("กรุณาเข้าสู่ระบบก่อนดูแผนของคุณ"));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("ลบแผนนี้ใช่ไหม?")) return;
    try {
      await deletePlan(id);
      setPlans((prev) => prev?.filter((p) => p.id !== id) ?? null);
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">แผนของฉัน</h1>
          <a
            href="/"
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            ← หน้าแรก
          </a>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
            <p className="text-slate-500">{error}</p>
            <a
              href="/login"
              className="mt-3 inline-block rounded-xl bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-700"
            >
              เข้าสู่ระบบ
            </a>
          </div>
        )}

        {!error && plans === null && (
          <div className="mt-6 space-y-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-1/3 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="h-16 rounded-xl bg-slate-50" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && plans?.length === 0 && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">ยังไม่มีแผนที่บันทึกไว้</p>
            <a
              href="/#calculator"
              className="mt-3 inline-block rounded-xl bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-700"
            >
              ไปคำนวณแผนแรก
            </a>
          </div>
        )}

        {plans && plans.length > 0 && (
          <div className="mt-6 space-y-4">
            {plans.map((p) => {
              const onTrack = (p.gap ?? 0) <= 0;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {p.planName}
                      </p>
                      <p className="text-xs text-slate-400">
                        เกษียณอายุ {p.retirementAge} · บันทึกเมื่อ{" "}
                        {new Date(p.createdAt).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-sm text-slate-400 transition hover:text-red-500"
                    >
                      ลบ
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-slate-50 py-3">
                      <p className="text-xs text-slate-500">ควรมี</p>
                      <p className="mt-1 font-bold text-slate-800">
                        {baht(p.targetAmount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 py-3">
                      <p className="text-xs text-slate-500">คาดว่าจะมี</p>
                      <p className="mt-1 font-bold text-teal-600">
                        {baht(p.projectedAmount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 py-3">
                      <p className="text-xs text-slate-500">
                        {onTrack ? "เกินเป้า" : "ยังขาด"}
                      </p>
                      <p
                        className={`mt-1 font-bold ${onTrack ? "text-green-600" : "text-red-500"}`}
                      >
                        {baht(Math.abs(p.gap ?? 0))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
