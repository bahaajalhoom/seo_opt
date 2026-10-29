// ============================================================================
// 1. IMPORTS
// ============================================================================
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const SITE_CONFIG = {
  domain: 'https://seo-opt.apps.taqat.academy',
  name: 'CRAWLIX PRO',
  architect: 'Ahmad Jalhoom (أحمد جلهوم)',
  architectUrl: 'https://ahmedsaleh.website',
  title: 'CRAWLIX PRO — منصة التدقيق المعياري لمحركات البحث والذكاء الاصطناعي | Ahmad Jalhoom',
  description:
    'محرك التدقيق المستقل فائق الدقة لفحص معايير السيو (SEO)، محركات الذكاء الاصطناعي (GEO)، سرعة الويب، ومُولّد برومبت الإصلاح الشامل 100%. تطوير وإشراف: أحمد جلهوم (Ahmad Jalhoom).',
} as const;

// Structured Schema.org Graph (WebSite + Organization)
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.domain}/#website`,
      url: SITE_CONFIG.domain,
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      inLanguage: ['ar', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.domain}/?audit={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
      logo: `${SITE_CONFIG.domain}/icon.svg`,
      founder: {
        '@type': 'Person',
        name: SITE_CONFIG.architect,
        url: SITE_CONFIG.architectUrl,
        jobTitle: 'Lead Software Architect & AI Systems Engineer',
      },
    },
  ],
};

// ============================================================================
// 3. METADATA SPECIFICATION (SEO, GEO & SOCIAL CARDS)
// ============================================================================
export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.domain),
  alternates: {
    canonical: SITE_CONFIG.domain,
  },
  authors: [{ name: SITE_CONFIG.architect, url: SITE_CONFIG.architectUrl }],
  creator: SITE_CONFIG.architect,
  publisher: `CRAWLIX Systems by ${SITE_CONFIG.architect}`,
  applicationName: SITE_CONFIG.name,
  keywords: [
    'CRAWLIX PRO',
    'Ahmad Jalhoom',
    'أحمد جلهوم',
    'SEO Audit',
    'GEO Audit',
    'Generative Engine Optimization',
    'AI Search Crawler Audit',
    'llms.txt',
    'فحص السيو',
    'تدقيق محركات الذكاء الاصطناعي',
  ],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'CRAWLIX PRO Architecture & Telemetry',
      },
    ],
    locale: 'ar_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Viewport configured for full accessibility (zoom enabled per WCAG 2.1)
export const viewport: Viewport = {
  themeColor: '#06070A',
  width: 'device-width',
  initialScale: 1,
};

// ============================================================================
// 4. ROOT LAYOUT COMPONENT
// ============================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </head>
      <body className="antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
