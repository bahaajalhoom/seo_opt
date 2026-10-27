import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CRAWLIX PRO — منصة التدقيق المعياري لمحركات البحث والذكاء الاصطناعي | Ahmad Jalhoom',
  description:
    'محرك التدقيق المستقل فائق الدقة لفحص معايير السيو (SEO)، محركات الذكاء الاصطناعي (GEO)، سرعة الويب، ومُولّد برومبت الإصلاح الشامل 100%. تطوير وإشراف: أحمد جلهوم (Ahmad Jalhoom).',
  authors: [{ name: 'Ahmad Jalhoom (أحمد جلهوم)', url: 'https://ahmedsaleh.website' }],
  creator: 'Ahmad Jalhoom (أحمد جلهوم)',
  publisher: 'CRAWLIX Systems by Ahmad Jalhoom',
  applicationName: 'CRAWLIX PRO',
  keywords: [
    'CRAWLIX',
    'SEO Audit',
    'GEO Audit',
    'Generative Engine Optimization',
    'AI Crawler Audit',
    'llms.txt',
    'Ahmad Jalhoom',
    'أحمد جلهوم',
    'فحص السيو',
    'تدقيق محركات البحث',
  ],
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#08090C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
