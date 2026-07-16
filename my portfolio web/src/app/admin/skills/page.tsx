'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Plus, Pencil, Trash2, X, Code2 } from 'lucide-react'

interface Skill {
  id: string
  category_id: string
  name: string
  level: number
  display_order: number
}

interface Category {
  id: string
  title: string
  icon: string
  display_order: number
  skills: Skill[]
}

const iconOptions = ['Code2', 'Database', 'BarChart3', 'LineChart', 'Server', 'GitBranch', 'Terminal', 'BookOpen', 'Search', 'Sigma', 'MessagesSquare']

export default function AdminSkills() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null)
  const [editingSkill, setEditingSkill] = useState<Partial<Skill & { category_id: string }> | null>(null)

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/skills')
      if (!res.ok) throw new Error('Unauthorized')
      setCategories(await res.json())
    } catch {
      router.replace('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchSkills() }, [fetchSkills])

  const handleSaveCategory = async () => {
    if (!editingCategory?.title?.trim()) return
    const isNew = !editingCategory.id
    const res = await fetch('/api/admin/skills', {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'category', ...editingCategory }),
    })
    if (res.ok) {
      setEditingCategory(null)
      fetchSkills()
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const res = await fetch('/api/admin/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'category', id }),
    })
    if (res.ok) fetchSkills()
  }

  const handleSaveSkill = async () => {
    if (!editingSkill?.name?.trim()) return
    const isNew = !editingSkill.id
    const res = await fetch('/api/admin/skills', {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'skill', ...editingSkill }),
    })
    if (res.ok) {
      setEditingSkill(null)
      fetchSkills()
    }
  }

  const handleDeleteSkill = async (id: string) => {
    const res = await fetch('/api/admin/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'skill', id }),
    })
    if (res.ok) fetchSkills()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-text font-heading">Skills</h1>
          <span className="text-xs text-muted bg-card px-2 py-0.5 rounded-full">{categories.length} categories</span>
        </div>
        <button
          onClick={() => setEditingCategory({ title: '', icon: 'Code2', display_order: 0 })}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Category edit modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/50">
          <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-2xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-bold text-text font-heading">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Title *</label>
                <input
                  value={editingCategory.title || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Icon</label>
                <select
                  value={editingCategory.icon || 'Code2'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingCategory.display_order ?? 0}
                  onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setEditingCategory(null)} className="px-4 py-2 text-sm text-muted hover:text-text">Cancel</button>
              <button onClick={handleSaveCategory} disabled={!editingCategory.title?.trim()} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50">
                {editingCategory.id ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill edit modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/50">
          <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-2xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-bold text-text font-heading">
                {editingSkill.id ? 'Edit Skill' : 'Add Skill'}
              </h2>
              <button onClick={() => setEditingSkill(null)} className="p-1 text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Name *</label>
                <input
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Level (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editingSkill.level ?? 50}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingSkill.display_order ?? 0}
                  onChange={(e) => setEditingSkill({ ...editingSkill, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setEditingSkill(null)} className="px-4 py-2 text-sm text-muted hover:text-text">Cancel</button>
              <button onClick={handleSaveSkill} disabled={!editingSkill.name?.trim()} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50">
                {editingSkill.id ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <BarChart3 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No skill categories yet.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-surface/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <Code2 size={16} className="text-primary" />
                  <h3 className="text-sm font-bold text-text">{cat.title}</h3>
                  <span className="text-xs text-muted">({cat.skills.length} skills)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingSkill({ category_id: cat.id, name: '', level: 50, display_order: cat.skills.length })}
                    className="p-1.5 text-muted hover:text-accent transition-colors"
                    title="Add skill"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 text-muted hover:text-accent transition-colors"
                    title="Edit category"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-muted hover:text-red-400 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {cat.skills.length > 0 && (
                <div className="divide-y divide-border">
                  {cat.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-surface/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-text">{skill.name}</span>
                        <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{skill.level}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingSkill({ ...skill, category_id: skill.category_id })}
                          className="p-1.5 text-muted hover:text-accent transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1.5 text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
