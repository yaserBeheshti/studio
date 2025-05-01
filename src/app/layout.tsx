import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Assuming Geist is the chosen font
import './globals.css';
import { Toaster } from "@/components/ui/toaster" // Import Toaster

const geistSans = Geist({
  variable: '--font-geist-sans', // Make sure variable names match font setup
  subsets: ['latin'],
});

// If you have a mono font, include it similarly
// const geistMono = Geist_Mono({...});

export const metadata: Metadata = {
  title: 'Telegram Auto Finder', // Updated title
  description: 'Search for car deals from Telegram messages', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply font variables to the body */}
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
