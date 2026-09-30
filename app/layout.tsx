import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const viewport: Viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://form-himadifa-uad.vercel.app"),
  title: {
    default: "Form Biodata Pengurus HimaDifa UAD",
    template: "%s | HimaDifa UAD",
  },
  description:
    "Formulir pendataan dan registrasi resmi biodata pengurus HimaDifa Universitas Ahmad Dahlan (UAD) Yogyakarta.",
  keywords: [
    "HimaDifa",
    "HimaDifa UAD",
    "Universitas Ahmad Dahlan",
    "Biodata Pengurus",
    "Form Pengurus HIMA",
    "UAD Yogyakarta",
    "Informatika UAD",
    "DIFA3",
    "DIFA4",
    "DIFA5",
  ],
  authors: [{ name: "HimaDifa UAD" }],
  creator: "HimaDifa UAD",
  publisher: "Universitas Ahmad Dahlan",
  icons: {
    icon: [
      { url: "/logo himadifa.jpeg", type: "image/jpeg" },
      { url: "/logo uad.png", type: "image/png" },
    ],
    shortcut: "/logo himadifa.jpeg",
    apple: "/logo himadifa.jpeg",
  },
  openGraph: {
    title: "Form Biodata Pengurus HimaDifa UAD",
    description:
      "Formulir pendataan dan registrasi resmi biodata pengurus HimaDifa Universitas Ahmad Dahlan.",
    url: "https://form-himadifa-uad.vercel.app",
    siteName: "HimaDifa UAD",
    images: [
      {
        url: "/logo himadifa.jpeg",
        width: 800,
        height: 800,
        alt: "Logo HimaDifa UAD",
      },
      {
        url: "/logo uad.png",
        width: 800,
        height: 800,
        alt: "Logo UAD",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Form Biodata Pengurus HimaDifa UAD",
    description:
      "Formulir pendataan dan registrasi resmi biodata pengurus HimaDifa Universitas Ahmad Dahlan.",
    images: ["/logo himadifa.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
