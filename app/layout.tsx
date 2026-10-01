import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLang } from '@/lib/i18n-server';

const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: '7Gen — Kyrgyzstan',
  description: 'Interactive travel map of Kyrgyzstan: regions, hotels, cafés and sights.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();

  return (
    <html lang={lang} className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header lang={lang} />
        <div className="flex-1">{children}</div>
        <Footer lang={lang} />
      </body>
    </html>
  );
}