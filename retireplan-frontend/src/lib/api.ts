export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const tokenStore = {
  get: () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null,
  set: (t: string) => localStorage.setItem("token", t),
  clear: () => localStorage.removeItem("token"),
};

export function loginWithGoogle() {
  window.location.href = `${API_URL}/auth/google`;
}

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = tokenStore.get();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "เกิดข้อผิดพลาด");
  }
  return res.status === 204 ? null : res.json();
}

export async function getMe() {
  const token = tokenStore.get();
  if (!token) return null;
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

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
  return authedFetch("/retirement/plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getPlans() {
  return authedFetch("/retirement/plans");
}

export function deletePlan(id: number) {
  return authedFetch(`/retirement/plans/${id}`, { method: "DELETE" });
}
