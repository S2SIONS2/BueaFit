import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Modal from "@/app/components/modal";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeauFit",
  description: "뷰티 전문 원장님들을 위한 핏한 관리 프로그램",
   openGraph: {
    title: 'BeauFit',
    description: '뷰티 전문 원장님들을 위한 핏한 관리 프로그램',
    // images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeauFit',
    description: '뷰티 전문 원장님들을 위한 핏한 관리 프로그램',
    // images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full` }
      >
        {children}
        <Modal />
        <ToastContainer position="top-center" autoClose={2000} />
      </body>
    </html>
  );
}
