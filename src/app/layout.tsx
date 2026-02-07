import type { Metadata } from "next";
import { Geist, Geist_Mono, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/ui/floating-contact";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { AiChatWidget } from "@/components/ui/ai-chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unifraktur = UnifrakturMaguntia({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-unifraktur',
});

export const metadata: Metadata = {
  title: "JBStarNews",
  description: "Global Summit Reaches Historic Agreement on Renewables + Latest Headlines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unifraktur.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingContact />
        <PageViewTracker />
        <AiChatWidget />
      </body>
    </html>
  );
}
