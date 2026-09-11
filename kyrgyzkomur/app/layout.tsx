import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import ChatWidget from "@/src/components/pages/chat/ChatWidget";
import LayoutClient from "./layout.client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "КыргызКомур",
  description:
    "ОАО «КыргызКомур» — официальная информационная платформа о деятельности компании, добыче угля, производстве, цифровизации и развитии угольной отрасли Кыргызской Республики.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutClient>
          {children}

          <ChatWidget />
        </LayoutClient>
      </body>
    </html>
  );
}
