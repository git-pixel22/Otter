import type { Metadata } from 'next';
import { Comfortaa } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ThemeScript } from '@/components/ThemeScript';

const comfortaa = Comfortaa({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Otter',
  description: 'Your todo app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
      </head>
      <body className={`${comfortaa.className} min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
