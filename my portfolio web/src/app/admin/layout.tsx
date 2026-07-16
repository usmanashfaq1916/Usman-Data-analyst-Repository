'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Mail, FolderKanban, BarChart3, Award, LogOut,
  ExternalLink, Menu, X, ChevronLeft,
} from 'lucide-react'
const tabs = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/skills', label: 'Skills', icon: BarChart3 },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const sidebarWidth = collapsed ? 'w-16' : 'w-60'

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-card border-r border-border flex flex-col transition-all duration-200 ${sidebarWidth}`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">U</span>
            </div>
            {!collapsed && (
              <span className="text-sm font-bold text-text font-heading truncate">Admin Panel</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex ml-auto p-1 text-muted hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav tabs */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(tab.href)
            return (
              <a
                key={tab.href}
                href={tab.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:text-text hover:bg-card/80'
                }`}
                title={collapsed ? tab.label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{tab.label}</span>}
              </a>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="py-4 px-2 border-t border-border space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-text hover:bg-card/80 transition-all"
            title={collapsed ? 'View Site' : undefined}
          >
            <ExternalLink size={18} className="flex-shrink-0" />
            {!collapsed && <span>View Site</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-red-400 hover:bg-red-400/5 transition-all"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden h-16 border-b border-border bg-card flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-text p-1">
            <Menu size={22} />
          </button>
          <span className="text-sm font-bold text-text font-heading">Admin Panel</span>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
