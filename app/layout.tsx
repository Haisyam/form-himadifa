import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Biodata Pengurus HimaDifa UAD",
  description: "Formulir Registrasi & Data Pengurus HimaDifa Universitas Ahmad Dahlan",
  icons: {
    icon: "/logo himadifa.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#06101E] text-slate-100 selection:bg-orange-500 selection:text-white font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
