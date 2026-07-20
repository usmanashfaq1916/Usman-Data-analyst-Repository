import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { href: "/universities", label: "Universities" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/compare", label: "Compare" },
    { href: "/merit-calculator", label: "Merit Calculator" },
    { href: "/admission-alerts", label: "Admission Alerts" },
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/faqs", label: "FAQs" },
  ],
  Account: [
    { href: "/login", label: "Log in" },
    { href: "/register", label: "Sign up" },
    { href: "/dashboard", label: "Dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-white dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-white">
                U
              </div>
              <span className="text-xl font-bold text-primary">UniConnect</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              One Portal. Every Pakistani University.
              <br />
              Search, compare, and apply — all from one place.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground space-y-1">
          <p>Data verified against HEC recognized institutions list as of July 2026.</p>
          <p>&copy; {new Date().getFullYear()} UniConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
