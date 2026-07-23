import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
          <span className="text-5xl font-extrabold text-primary font-heading">404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text font-heading">
          Page Not Found
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
