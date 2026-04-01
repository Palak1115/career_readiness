import 'antd/dist/reset.css'
import '../styles/global.css'

import { ReactNode } from 'react'
import { Inter, Poppins, Roboto, Source_Sans_3 } from 'next/font/google'
import Script from 'next/script'
import Providers from './providers'   // <-- client wrapper
import InstallPrompt from '@/components/features/pwa/InstallPrompt'
import ServiceWorkerRegistration from '@/components/features/pwa/ServiceWorkerRegistration'
import VersionUpdateNotification from '@/components/features/version/VersionUpdateNotification'
import OnlineStatusManager from '@/components/features/pwa/OnlineStatusManager'
import TopLoadingBar from '@/components/ui/feedback/TopLoadingBar'
import WakeLockProvider from '@/components/providers/WakeLockProvider'

// ---------- SEO METADATA ----------
export const metadata = {
  metadataBase: new URL("https://performancecore.app"),
  title: {
    default: "PerformanceCore | Career Readiness Assessment",
    template: "%s | PerformanceCore",
  },
  description:
    "PerformanceCore provides the elite diagnostic for early-career professionals, career switchers, and college students.",
  robots: "index, follow",
  alternates: { canonical: "https://performancecore.app" },
  openGraph: {
    title: "PerformanceCore",
    description: "The scientific framework for executive excellence and career momentum.",
    url: "https://performancecore.app",
    siteName: "PerformanceCore",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PerformanceCore",
    description: "Build your professional trajectory with precision.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PerformanceCore",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

// ---------- FONTS ----------
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-roboto',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-source-sans',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`html { data-scroll-behavior: smooth; }`}</style>
        {/* EXTERNAL ERROR SHIELD - Suppresses extension-injected SyntaxErrors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  var handleExternalError = function(msg) {
                    if (msg && (
                      msg.includes('input:not[type=hidden]') || 
                      (msg.includes('querySelector') && msg.includes('not a valid selector'))
                    )) {
                      console.warn('🛡️ Dev Shield: Suppressed external error:', msg);
                      return true;
                    }
                    return false;
                  };

                  var originalError = window.onerror;
                  window.onerror = function(m, s, l, c, e) {
                    if (handleExternalError(m)) return true;
                    if (originalError) return originalError.apply(window, arguments);
                  };

                  window.addEventListener('unhandledrejection', function(event) {
                    var m = event.reason ? (event.reason.message || event.reason.toString()) : '';
                    if (handleExternalError(m)) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }, true);
                }
              })();
            `
          }}
        />
        {/* JSON-LD STRUCTURED DATA */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PerformanceCore",
              url: "https://performancecore.app",
            }),
          }}
        />
      </head>

      <body id="app" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${sourceSans.variable} font-body text-on-background bg-background`}>
        <Providers>
          <ServiceWorkerRegistration />
          <OnlineStatusManager />
          <TopLoadingBar />
          <WakeLockProvider />
          <InstallPrompt />
          {children}
          <VersionUpdateNotification />
        </Providers>
      </body>
    </html>
  )
}
