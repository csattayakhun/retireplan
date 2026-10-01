"use client";

import { useState } from "react";
import { useAuth } from "./auth-context";

const navLinks = [
  { href: "#top", label: "หน้าหลัก" },
  { href: "#how", label: "วิธีใช้งาน" },
  { href: "#calculator", label: "คำนวณเกษียณ" },
];

export function NavBar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-stone-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
            R
          </span>
          <span className="text-lg font-semibold text-stone-800">
            Retire<span className="text-teal-600">Plan</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 text-sm text-stone-500 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-teal-600"
            >
              {l.label}
            </a>
          ))}
          {user && (
            <a href="/plans" className="transition hover:text-teal-600">
              แผนของฉัน
            </a>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm text-stone-600">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-7 w-7 rounded-full"
                  />
                )}
                {user.name ?? user.email}
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-stone-400 transition hover:text-teal-600"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-sm font-medium text-stone-500 transition hover:text-teal-600"
            >
              เข้าสู่ระบบ
            </a>
          )}
          <a
            href="#calculator"
            className="rounded-full bg-teal-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            เริ่มคำนวณ
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden"
          aria-label="เมนู"
        >
          <svg
            className="h-6 w-6 text-stone-700"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              }
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-stone-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2 text-stone-600 hover:bg-stone-50"
              >
                {l.label}
              </a>
            ))}
            {user && (
              <a
                href="/plans"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2 text-stone-600 hover:bg-stone-50"
              >
                แผนของฉัน
              </a>
            )}
            <div className="my-1 border-t border-stone-100" />
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="rounded-lg px-2 py-2 text-left text-stone-600 hover:bg-stone-50"
              >
                ออกจากระบบ
              </button>
            ) : (
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2 text-stone-600 hover:bg-stone-50"
              >
                เข้าสู่ระบบ
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
