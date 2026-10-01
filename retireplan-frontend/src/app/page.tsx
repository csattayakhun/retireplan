// Server Component — ประกอบ section เข้าด้วยกัน (ไม่มี 'use client' → ไม่ส่ง JS)
// AuthProvider (client) ครอบไว้เพื่อแชร์สถานะ login ให้ NavBar + Calculator
import { AuthProvider } from '../components/auth-context';
import { NavBar } from '../components/NavBar';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { Calculator } from '../components/Calculator';
import { Cta } from '../components/Cta';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-stone-700">
        <NavBar />
        <Hero />
        <HowItWorks />
        <Features />
        <Calculator />
        <Cta />
        <Footer />
      </div>
    </AuthProvider>
  );
}
