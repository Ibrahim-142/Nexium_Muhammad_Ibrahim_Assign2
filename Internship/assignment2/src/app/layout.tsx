import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import FooterDisclosure from "@/components/ui/FooterDisclosure"; 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Blog Summarizer",
  description: "Instantly summarize and translate blogs into Urdu — powered by AI.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#F0FDFA] text-gray-900 min-h-screen flex flex-col`}
      >
        <main className="flex-grow">{children}</main>
        <FooterDisclosure />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
