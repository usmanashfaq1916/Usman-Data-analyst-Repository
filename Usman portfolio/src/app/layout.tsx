import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/ChatBot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Usman Ashfaq | Data Analyst for Startups & Remote Teams | SQL • ETL • Business Intelligence",
  description:
    "Helping startups and small businesses turn spreadsheet chaos into Power BI dashboards and Python-automated reports. Data Analyst specializing in Python, SQL, Power BI, and Excel — building end-to-end analytics workflows from raw data to actionable insights.",
  openGraph: {
    title: "Usman Ashfaq | Data Analyst for Startups & Remote Teams | SQL • ETL • Business Intelligence",
    description:
      "Helping startups and small businesses turn spreadsheet chaos into Power BI dashboards and Python-automated reports. Data Analyst specializing in Python, SQL, Power BI, and Excel.",
    type: "website",
    locale: "en_US",
    siteName: "Usman Ashfaq Portfolio",
    url: "https://usmanashfaq.vercel.app",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Usman Ashfaq — Data Analyst for Startups & Remote Teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Usman Ashfaq | Data Analyst for Startups & Remote Teams | SQL • ETL • Business Intelligence",
    description:
      "Helping startups and small businesses turn spreadsheet chaos into Power BI dashboards and Python-automated reports.",
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://usmanashfaq.vercel.app"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Usman Ashfaq",
              givenName: "Usman",
              familyName: "Ashfaq",
              jobTitle: "Data Analyst",
              url: "https://usmanashfaq.vercel.app",
              email: "usman.ashfaq1916@gmail.com",
              sameAs: [
                "https://github.com/usmanashfaq1916",
                "https://www.linkedin.com/in/usman-ashfaq-5329912a2/",
              ],
              knowsAbout: [
                "Data Analytics",
                "Python",
                "SQL",
                "Power BI",
                "Machine Learning",
                "Data Visualization",
                "Business Intelligence",
                "Excel",
              ],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Virtual University of Pakistan",
              },
            }),
          }}
        />
      </head>
      <body className="bg-surface text-text font-sans antialiased">
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
