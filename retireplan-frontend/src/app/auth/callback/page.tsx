'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStore } from '../../../lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('กำลังเข้าสู่ระบบ…');

  useEffect(() => {
    // backend ส่ง token กลับมาทาง query string: /auth/callback?token=xxx
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      tokenStore.set(token); // เก็บ token ไว้ใช้เรียก API ที่ต้อง login
      router.replace('/'); // กลับหน้าแรก (replace = ไม่ให้กด back กลับมาหน้านี้)
    } else {
      setMessage('เข้าสู่ระบบไม่สำเร็จ กำลังพากลับ…');
      setTimeout(() => router.replace('/login'), 1500);
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-50 to-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
        <p className="text-slate-500">{message}</p>
      </div>
    </main>
  );
}
