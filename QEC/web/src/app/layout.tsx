import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SessionProvider } from "@/components/SessionProvider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PWAInstallBanner } from "@/components/PWAInstallBanner"
import { SWUpdateBanner } from "@/components/SWUpdateBanner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Quaid Educational Complex | Best Educational Institute Lahore",
    template: "%s | Quaid Educational Complex",
  },
  description:
    "Quaid Educational Complex (QEC) — Building Future Leaders Through Quality Education. Multiple Campuses | Experienced Faculty | Modern Learning Environment.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-152.png",
  },
  appleWebApp: {
    capable: true,
    title: "QEC",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Quaid Educational Complex | Best Educational Institute Lahore",
    description: "Building Future Leaders Through Quality Education. Multiple Campuses across Lahore.",
    type: "website",
    locale: "en_PK",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#1a5c2a" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="QEC" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered:', reg.scope);
                  }, function(err) {
                    console.log('SW failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground">
        <ThemeProvider>
          <SessionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <PWAInstallBanner />
            <SWUpdateBanner />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
