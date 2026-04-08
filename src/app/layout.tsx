import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eye-Guard | AI-Powered Digital Eye Strain Detection",
  description:
    "Research-grade real-time eye fatigue detection using computer vision and personalized temporal modeling. Protecting your eyes with science.",
  keywords: [
    "eye strain",
    "digital fatigue",
    "computer vision",
    "eye tracking",
    "blink detection",
    "EAR",
    "machine learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col grid-bg">{children}</body>
      </html>
    </ClerkProvider>
  );
}
