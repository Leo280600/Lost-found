import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Lost & Found Hub — ระบบประกาศของหายในมหาวิทยาลัย",
  description: "แพลตฟอร์มแจ้งของหายและของที่พบภายในมหาวิทยาลัย ค้นหา แจ้งเตือน และขอรับของคืนได้อย่างปลอดภัย",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-[var(--font-body)] antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">{children}</main>
            <Footer />
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
