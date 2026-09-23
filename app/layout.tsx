import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://retro-market-rho.vercel.app"),
  title: {
    default: "RETROMART｜Everything You Want.",
    template: "%s｜RETROMART",
  },
  description:
    "RETROMART 虛擬購物體驗：探索手機、電腦、電玩、顯卡、電視、精品、汽車等熱門商品。",
  applicationName: "RETROMART",
  keywords: [
    "RETROMART",
    "購物網站",
    "虛擬購物",
    "3C",
    "手機",
    "電玩",
    "顯卡",
    "精品",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://retro-market-rho.vercel.app",
    siteName: "RETROMART",
    title: "RETROMART｜Everything You Want.",
    description: "探索你想買的，也找到你原本不知道自己想要的東西。",
  },
  twitter: {
    card: "summary_large_image",
    title: "RETROMART｜Everything You Want.",
    description: "RETROMART 虛擬購物體驗。",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
