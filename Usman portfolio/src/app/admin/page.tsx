'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, FolderKanban, BarChart3, Award, TrendingUp, MessageSquare, ExternalLink } from 'lucide-react'

interface Stats {
  totalContacts: number
  unreadContacts: number
  totalProjects: number
  totalCertifications: number
  totalSkillCategories: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then(setStats)
      .catch(() => router.replace('/admin/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    {
      label: 'Contact Messages',
      value: stats?.totalContacts ?? 0,
      sub: `${stats?.unreadContacts ?? 0} unread`,
      icon: Mail,
      color: 'text-blue-400 bg-blue-400/10',
      href: '/admin/contacts',
    },
    {
      label: 'Projects',
      value: stats?.totalProjects ?? 0,
      sub: 'Portfolio projects',
      icon: FolderKanban,
      color: 'text-emerald-400 bg-emerald-400/10',
      href: '/admin/projects',
    },
    {
      label: 'Skill Categories',
      value: stats?.totalSkillCategories ?? 0,
      sub: 'Skill groups',
      icon: BarChart3,
      color: 'text-purple-400 bg-purple-400/10',
      href: '/admin/skills',
    },
    {
      label: 'Certifications',
      value: stats?.totalCertifications ?? 0,
      sub: 'Credentials',
      icon: Award,
      color: 'text-amber-400 bg-amber-400/10',
      href: '/admin/certifications',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text font-heading">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Overview of your portfolio content</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <a
              key={card.label}
              href={card.href}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <ExternalLink size={16} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-text">{card.value}</p>
              <p className="text-xs text-muted mt-1">{card.label}</p>
              <p className="text-[11px] text-muted/60 mt-0.5">{card.sub}</p>
            </a>
          )
        })}
      </div>

      {/* Quick links */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="/admin/contacts"
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
              <MessageSquare size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">View Messages</p>
              <p className="text-xs text-muted">{stats?.unreadContacts} unread messages</p>
            </div>
          </a>
          <a
            href="/admin/projects"
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Manage Projects</p>
              <p className="text-xs text-muted">{stats?.totalProjects} projects listed</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
