import type React from "react";
import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";

const geistSans = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// })

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// })

export const metadata: Metadata = {
  title: "SnapSplit - AI-Powered Photo Sorting & Sharing",
  description:
    "Automatically sort and share group photos using AI face detection. Perfect for events, trips, and gatherings.",
  keywords: [
    "photo sharing",
    "AI",
    "face detection",
    "group photos",
    "automatic sorting",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "SnapSplit - Smart Photo Sharing",
    description:
      "AI-powered photo sorting that automatically shares the right photos with the right people.",
    type: "website",
    url: "https://snapsplit.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapSplit - Smart Photo Sharing",
    description: "AI-powered photo sorting for group photos",
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
