import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Geist } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Clínica',
  description: 'Sistema de gestão para clínicas estéticas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn('font-sans', geist.variable)}
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}

        <Toaster
          position="top-right"
          closeButton
        />
      </body>
    </html>
  );
}