'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Code2, Database, BarChart3, LineChart,
  Server, GitBranch, GitFork, Terminal, BookOpen,
  Search, Sigma, MessagesSquare,
} from 'lucide-react'

type Skill = { id: string; name: string; level: number; category_id: string; display_order: number }
type Category = { id: string; title: string; icon: string; display_order: number; skills: Skill[] }

function getIcon(name: string) {
  const icons: Record<string, typeof Code2> = {
    Python: Code2, SQL: Terminal,
    Pandas: BookOpen, NumPy: BarChart3,
    'Data Cleaning': Search,
    'Exploratory Data Analysis': Sigma,
    'Statistical Analysis': Sigma,
    'Power BI': BarChart3, 'Excel Dashboards': BarChart3,
    Matplotlib: LineChart, 'Data Storytelling': MessagesSquare,
    MySQL: Database, 'SQL Server': Server,
    Git: GitBranch, GitHub: GitFork,
    'Jupyter Notebook': BookOpen, 'VS Code': Code2,
  }
  return icons[name] || Code2
}

function SkillCategory({ cat, ci }: { cat: Category; ci: number }) {
  const CatIcon = cat.icon === 'Code2' ? Code2
    : cat.icon === 'Database' ? Database
    : cat.icon === 'BarChart3' ? BarChart3
    : cat.icon === 'LineChart' ? LineChart
    : cat.icon === 'Server' ? Server
    : cat.icon === 'GitBranch' ? GitBranch
    : cat.icon === 'Terminal' ? Terminal
    : cat.icon === 'BookOpen' ? BookOpen
    : cat.icon === 'Search' ? Search
    : cat.icon === 'Sigma' ? Sigma
    : Code2

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: ci * 0.08 }}
      className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <CatIcon size={20} className="text-primary" />
        </div>
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {cat.title}
        </h3>
      </div>
      <div className="space-y-4">
        {cat.skills.map((skill) => {
          const Icon = getIcon(skill.name)
          return (
            <div key={skill.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-muted flex-shrink-0" />
                  <span className="text-sm font-medium text-text">{skill.name}</span>
                </div>
                <span className="text-xs text-muted">{skill.level}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setLoading(false))
      .finally(() => setLoading(false))
  }, [])

  if (loading && categories.length === 0) {
    return (
      <section id="skills" className="py-24 md:py-32 bg-card/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-24 md:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Expertise</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text font-heading">
            Skills &amp; Proficiency
          </h2>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((cat, ci) => (
            <SkillCategory key={cat.id} cat={cat} ci={ci} />
          ))}
        </div>
      </div>
    </section>
  )
}
