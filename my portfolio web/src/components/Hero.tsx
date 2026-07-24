'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Download, Send } from 'lucide-react'
import Image from 'next/image'
import { GitHubIcon, LinkedInIcon, EmailIcon, WhatsAppIcon } from './OfficialIcons'

const socials = [
  { icon: GitHubIcon, href: 'https://github.com/usmanashfaq1916' },
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/usman-ashfaq-5329912a2/' },
  { icon: EmailIcon, href: 'mailto:usman.ashfaq1916@gmail.com' },
  { icon: WhatsAppIcon, href: 'https://wa.me/9203244776493' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Animated data viz background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2563EB" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>

        {/* Chart-like elements */}
        <div className="absolute top-20 right-[10%] opacity-[0.06]">
          <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,100 30,80 60,90 90,50 120,60 150,30 180,40" fill="none" stroke="#2563EB" strokeWidth="2" />
            <polyline points="0,110 30,95 60,100 90,70 120,75 150,50 180,55" fill="none" stroke="#10B981" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-[8%] opacity-[0.05]">
          <svg width="160" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="40" width="20" height="60" rx="2" fill="#2563EB" />
            <rect x="25" y="20" width="20" height="80" rx="2" fill="#10B981" />
            <rect x="50" y="50" width="20" height="50" rx="2" fill="#2563EB" />
            <rect x="75" y="10" width="20" height="90" rx="2" fill="#10B981" />
            <rect x="100" y="30" width="20" height="70" rx="2" fill="#2563EB" />
            <rect x="125" y="0" width="20" height="100" rx="2" fill="#10B981" />
          </svg>
        </div>

        {/* Floating dots / nodes */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent/20 rounded-full animate-ping [animation-delay:0.5s]" />
        <div className="absolute top-1/2 left-[12%] w-1.5 h-1.5 bg-primary/20 rounded-full animate-ping [animation-delay:1s]" />
        <div className="absolute bottom-1/3 right-[15%] w-1 h-1 bg-accent/20 rounded-full animate-ping [animation-delay:1.5s]" />
        <div className="absolute top-[15%] left-1/3 w-1 h-1 bg-primary/20 rounded-full animate-ping [animation-delay:0.8s]" />
        <div className="absolute bottom-[25%] right-1/3 w-1.5 h-1.5 bg-accent/15 rounded-full animate-ping [animation-delay:1.2s]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex-shrink-0"
          >
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl shadow-primary/5">
              <Image
                src="/usman-pic.jpg"
                alt="Usman Ashfaq"
                width={256}
                height={256}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-semibold text-accent bg-accent/5 border border-accent/20 rounded-full mb-5 tracking-wide uppercase">
                Data Analyst | Python Developer | SQL | Power BI Specialist
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text font-heading leading-tight"
            >
              Transforming Raw Data Into{' '}
              <span className="text-primary">Actionable Business Decisions.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg md:text-xl text-muted leading-relaxed max-w-2xl"
            >
              I specialize in analyzing complex datasets, building automated data solutions, creating
              interactive dashboards, and delivering meaningful insights using Python, SQL, Power BI, and Excel.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
                View Projects <ArrowDown size={18} />
              </a>
              <a href="#resume" className="inline-flex items-center gap-2 px-6 py-3 bg-card text-text font-semibold rounded-lg border border-border hover:border-primary hover:text-primary transition-all">
                Download Resume <Download size={18} />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 bg-card text-text font-semibold rounded-lg border border-border hover:border-primary hover:text-primary transition-all">
                Contact Me <Send size={18} />
              </a>
            </motion.div>
            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex items-center gap-4 justify-center md:justify-start"
            >
              <span className="text-xs text-muted uppercase tracking-wider">Find me on</span>
              <div className="h-px w-8 bg-border" />
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
