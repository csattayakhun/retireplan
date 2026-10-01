import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "./globals.css";

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anuphan",
});

export const metadata: Metadata = {
  title: "RetirePlan — วางแผนเกษียณอย่างมั่นใจ",
  description: "คำนวณเงินที่ต้องมีตอนเกษียณ พร้อมเปรียบเทียบกับเงินที่คาดว่าจะมี ใช้ฟรี ไม่ต้องสมัคร",
  openGraph: {
    title: "RetirePlan — วางแผนเกษียณอย่างมั่นใจ",
    description: "คำนวณเงินเกษียณของคุณได้ทันที ฟรี ไม่ต้องสมัคร",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${anuphan.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
