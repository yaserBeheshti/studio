import type { Metadata } from 'next';
// Removed Geist font import
import './globals.css';
import { Toaster } from "@/components/ui/toaster" // Import Toaster

// Removed font loading setup

export const metadata: Metadata = {
  title: 'یابنده خودکار تلگرام', // Updated title to Persian
  description: 'جستجوی معاملات خودرو از پیام‌های تلگرام', // Updated description to Persian
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set lang to "fa" for Persian
    <html lang="fa" dir="rtl">
      {/* Removed font variable application */}
      <body className={`antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
