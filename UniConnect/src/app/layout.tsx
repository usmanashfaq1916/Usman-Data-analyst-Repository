import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { AiChatbot } from "@/components/ai-chatbot";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "UniConnect Pakistan — Largest University Admission Platform",
    template: "%s — UniConnect Pakistan",
  },
  description:
    "Search hundreds of Pakistani universities, compare degree programs, calculate merit, discover scholarships, and get AI-powered admission guidance — all in one place.",
  keywords: ["Pakistani universities", "admission", "merit calculator", "scholarships Pakistan", "degree programs", "university comparison", "NUST", "LUMS", "UET", "HEC"],
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "UniConnect Pakistan",
    title: "UniConnect Pakistan — Largest University Admission Platform",
    description: "Search hundreds of universities, compare programs, calculate merit, discover scholarships.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniConnect Pakistan",
    description: "Pakistan's largest university admission platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <PageTransition>
            <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
          </PageTransition>
          <Footer />
          <AiChatbot />
        </Providers>
      </body>
    </html>
  );
}
