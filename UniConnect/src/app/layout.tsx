import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniConnect — One Portal. Every Pakistani University.",
  description:
    "Search universities and programs, calculate admission merit, and track deadlines — all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 border-b border-border bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-white">
                U
              </div>
              <span className="text-xl font-bold text-primary">UniConnect</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link
                href="/universities"
                className="transition-colors hover:text-secondary"
              >
                Universities
              </Link>
              <Link
                href="/merit-calculator"
                className="transition-colors hover:text-secondary"
              >
                Merit Calculator
              </Link>
              <Link
                href="/admission-alerts"
                className="transition-colors hover:text-secondary"
              >
                Admission Alerts
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-border bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} UniConnect. One Portal. Every
            Pakistani University.
          </div>
        </footer>
      </body>
    </html>
  );
}
