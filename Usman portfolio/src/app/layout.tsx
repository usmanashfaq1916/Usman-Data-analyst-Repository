import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import TawkChat from "@/components/TawkChat";

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
  title: "Usman Ashfaq | Data Analyst | Python Developer | SQL | Power BI Specialist",
  description:
    "Data Analyst specializing in Python, SQL, Power BI, and Excel. I specialize in analyzing complex datasets, building automated data solutions, creating interactive dashboards, and delivering meaningful insights using Python, SQL, Power BI, and Excel.",
  openGraph: {
    title: "Usman Ashfaq | Data Analyst | Python Developer | SQL | Power BI Specialist",
    description:
      "Data Analyst specializing in Python, SQL, Power BI, and Excel. I specialize in analyzing complex datasets, building automated data solutions, creating interactive dashboards, and delivering meaningful insights using Python, SQL, Power BI, and Excel.",
    type: "website",
    locale: "en_US",
    siteName: "Usman Ashfaq Portfolio",
    url: "https://usmanashfaq.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Usman Ashfaq | Data Analyst | Python Developer | SQL | Power BI Specialist",
    description:
      "Data Analyst specializing in Python, SQL, Power BI, and Excel. I specialize in analyzing complex datasets, building automated data solutions, creating interactive dashboards, and delivering meaningful insights using Python, SQL, Power BI, and Excel.",
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
        <TawkChat />
      </body>
    </html>
  );
}
