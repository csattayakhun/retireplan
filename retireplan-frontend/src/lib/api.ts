// src/lib/api.ts
// รวม config + การจัดการ token + การเรียก API ไว้ที่เดียว

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// เก็บ JWT ใน localStorage (เช็ค window ก่อน เพราะโค้ดอาจรันฝั่ง server)
export const tokenStore = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  set: (t: string) => localStorage.setItem('token', t),
  clear: () => localStorage.removeItem('token'),
};

// เริ่ม flow Google login — ส่ง browser ไป backend แล้ว backend redirect ไป Google
export function loginWithGoogle() {
  window.location.href = `${API_URL}/auth/google`;
}

// ยิง API ที่ต้อง login (แนบ Bearer token ให้อัตโนมัติ)
async function authedFetch(path: string, options: RequestInit = {}) {
  const token = tokenStore.get();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'เกิดข้อผิดพลาด');
  }
  return res.status === 204 ? null : res.json();
}

// ดึงข้อมูลผู้ใช้ปัจจุบัน
export async function getMe() {
  const token = tokenStore.get();
  if (!token) return null;
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// ข้อมูลสำหรับบันทึกแผน (ชื่อ field ตรงกับ backend CreateRetirementPlanDto)
export interface PlanInput {
  planName?: string;
  currentAge: number;
  retirementAge: number;
  lifeExpectancyAge: number;
  currentSavings: number;
  monthlySaving: number;
  monthlyExpense: number;
  monthlyPension?: number;
  monthlyRental?: number;
  returnBefore?: number;
  returnAfter?: number;
  inflationRate?: number;
}

export function savePlan(data: PlanInput) {
  return authedFetch('/retirement/plans', { method: 'POST', body: JSON.stringify(data) });
}

export function getPlans() {
  return authedFetch('/retirement/plans');
}

export function deletePlan(id: number) {
  return authedFetch(`/retirement/plans/${id}`, { method: 'DELETE' });
}
