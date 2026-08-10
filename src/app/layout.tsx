import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Providers } from "./providers";
import { LiquidFilters } from "@/components/glass/LiquidFilters";
import { LiquidBackdrop } from "@/components/glass/LiquidBackdrop";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tutor AI",
  description: "ติวเตอร์ AI ส่วนตัวของคุณ — แชทถามตอบ สรุปเนื้อหา และสร้างข้อสอบ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LiquidFilters />
        <LiquidBackdrop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
