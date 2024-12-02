import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { inter, poppins } from "./ui/font";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster"

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
  title: "Transal AI - AI Translator",
  description: "Translate text using AI with Transal AI - Transal AI is a free AI Translator that can translate text from one language to another - made with 💖 by HassanRJ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${poppins.className} antialiased`}
        >
          <Navbar />
          <hr className="bg-gray-500" />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

