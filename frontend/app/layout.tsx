import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ThemeScript } from '@/components/ThemeScript';

// Display face — warm, slightly wonky serif for headlines and the wordmark.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
});

// UI face — high legibility at the small sizes the task list lives at.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Otter — a calmer way to decide what matters',
  description:
    'A lightweight todo app with an Eisenhower matrix. Sort tasks by what is urgent and what is important. No account, no sync, no noise — everything stays in your browser.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eef4f3' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1615' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior is required in Next 16 for the router to manage
    // scroll correctly alongside the global `scroll-behavior: smooth`.
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <ThemeScript />
        {/* Scroll-reveal starts at opacity 0 and is released by JS. Without
            scripting there is no observer, so neutralise it entirely. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        {/* Ambient water field, shared by every route */}
        <div className="water" aria-hidden="true">
          <div className="water-lines" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
