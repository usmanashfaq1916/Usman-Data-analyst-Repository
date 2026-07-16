'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FolderKanban, Plus, Pencil, Trash2, GripVertical, X, ExternalLink, GitFork } from 'lucide-react'

interface Project {
  id: string
  title: string
  problem: string
  dataset: string
  tools: string[]
  solution: string
  insights: string[]
  results: string
  code: string
  demo: string
  locallink: string
  screenshot: string
  display_order: number
}

const emptyProject: Partial<Project> = {
  title: '',
  problem: '',
  dataset: '',
  tools: [],
  solution: '',
  insights: [],
  results: '',
  code: '',
  demo: '',
  locallink: '',
  screenshot: '',
  display_order: 0,
}

export default function AdminProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Project> | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects')
      if (!res.ok) throw new Error('Unauthorized')
      setProjects(await res.json())
    } catch {
      router.replace('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleSave = async () => {
    if (!editing?.title?.trim()) return
    setSaving(true)
    const isNew = !editing.id
    const res = await fetch('/api/admin/projects', {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      setEditing(null)
      fetchProjects()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/admin/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) fetchProjects()
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
          <FolderKanban size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-text font-heading">Projects</h1>
          <span className="text-xs text-muted bg-card px-2 py-0.5 rounded-full">{projects.length} total</span>
        </div>
        <button
          onClick={() => setEditing({ ...emptyProject })}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50">
          <div className="w-full max-w-2xl bg-card rounded-xl border border-border shadow-2xl max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-bold text-text font-heading">
                {editing.id ? 'Edit Project' : 'Add Project'}
              </h2>
              <button onClick={() => setEditing(null)} className="p-1 text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Title *</label>
                  <input
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Problem</label>
                  <textarea
                    value={editing.problem || ''}
                    onChange={(e) => setEditing({ ...editing, problem: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Dataset</label>
                  <input
                    value={editing.dataset || ''}
                    onChange={(e) => setEditing({ ...editing, dataset: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Tools (comma separated)</label>
                  <input
                    value={(editing.tools || []).join(', ')}
                    onChange={(e) => setEditing({ ...editing, tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Solution</label>
                  <textarea
                    value={editing.solution || ''}
                    onChange={(e) => setEditing({ ...editing, solution: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Insights (one per line)</label>
                  <textarea
                    value={(editing.insights || []).join('\n')}
                    onChange={(e) => setEditing({ ...editing, insights: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                    rows={3}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Results</label>
                  <textarea
                    value={editing.results || ''}
                    onChange={(e) => setEditing({ ...editing, results: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Code URL</label>
                  <input
                    value={editing.code || ''}
                    onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Demo URL</label>
                  <input
                    value={editing.demo || ''}
                    onChange={(e) => setEditing({ ...editing, demo: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Local Link</label>
                  <input
                    value={editing.locallink || ''}
                    onChange={(e) => setEditing({ ...editing, locallink: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Screenshot Path</label>
                  <input
                    value={editing.screenshot || ''}
                    onChange={(e) => setEditing({ ...editing, screenshot: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editing.display_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.title?.trim()}
                className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing.id ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project list */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <FolderKanban size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No projects yet. Click &quot;Add Project&quot; to create one.</p>
          </div>
        ) : (
          projects.map((p, i) => (
            <div key={p.id} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-xs font-bold text-primary flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text">{p.title}</h3>
                <p className="text-xs text-muted mt-0.5 line-clamp-1">{p.problem}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(p.tools || []).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {p.code && (
                  <a href={p.code} target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary transition-colors" title="View code">
                    <GitFork size={15} />
                  </a>
                )}
                <button
                  onClick={() => setEditing({ ...p })}
                  className="p-2 text-muted hover:text-accent transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-muted hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
