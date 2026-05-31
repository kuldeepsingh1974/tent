import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TentPro - Premium Tent House Solutions',
  description: 'Book professional tent house services for weddings, parties, corporate events and more.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${inter.className} bg-white`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
