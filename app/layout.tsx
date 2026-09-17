import './globals.css';
import type { Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';

// Locks the max zoom to 1x. This isn't just about preventing pinch-zoom --
// on iOS Safari it's specifically what stops the browser from auto-
// zooming the whole page in whenever an input/textarea is focused (a
// built-in iOS behaviour whenever a focused field's font-size is under
// 16px), and it also stops fast swipe/drag gestures on things like the
// product gallery from occasionally being misread as a pinch-zoom.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-serif',
  display: 'swap'
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="bg-ivory text-charcoal">{children}</body>
    </html>
  );
}
