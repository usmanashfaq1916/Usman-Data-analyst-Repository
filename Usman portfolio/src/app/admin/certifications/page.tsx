'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Award, Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react'

interface Certification {
  id: string
  name: string
  org: string
  date: string
  verify_url: string
  display_order: number
}

const emptyCert: Partial<Certification> = {
  name: '',
  org: '',
  date: '',
  verify_url: '',
  display_order: 0,
}

export default function AdminCertifications() {
  const router = useRouter()
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Certification> | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchCerts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/certifications')
      if (!res.ok) throw new Error('Unauthorized')
      setCerts(await res.json())
    } catch {
      router.replace('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchCerts() }, [fetchCerts])

  const handleSave = async () => {
    if (!editing?.name?.trim()) return
    setSaving(true)
    const isNew = !editing.id
    const res = await fetch('/api/admin/certifications', {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      setEditing(null)
      fetchCerts()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/admin/certifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) fetchCerts()
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
          <Award size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-text font-heading">Certifications</h1>
          <span className="text-xs text-muted bg-card px-2 py-0.5 rounded-full">{certs.length} total</span>
        </div>
        <button
          onClick={() => setEditing({ ...emptyCert })}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/50">
          <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-2xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-bold text-text font-heading">
                {editing.id ? 'Edit Certification' : 'Add Certification'}
              </h2>
              <button onClick={() => setEditing(null)} className="p-1 text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Name *</label>
                <input
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Organization</label>
                <input
                  value={editing.org || ''}
                  onChange={(e) => setEditing({ ...editing, org: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Date</label>
                <input
                  value={editing.date || ''}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  placeholder="2025"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Verify URL</label>
                <input
                  value={editing.verify_url || ''}
                  onChange={(e) => setEditing({ ...editing, verify_url: e.target.value })}
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
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-muted hover:text-text">Cancel</button>
              <button onClick={handleSave} disabled={saving || !editing.name?.trim()} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50">
                {saving ? 'Saving...' : editing.id ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certification list */}
      <div className="space-y-3">
        {certs.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <Award size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No certifications yet.</p>
          </div>
        ) : (
          certs.map((c, i) => (
            <div key={c.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Award size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text">{c.name}</h3>
                <p className="text-xs text-muted">{c.org} &middot; {c.date}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {c.verify_url && (
                  <a href={c.verify_url} target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary transition-colors" title="Verify">
                    <ExternalLink size={15} />
                  </a>
                )}
                <button onClick={() => setEditing({ ...c })} className="p-2 text-muted hover:text-accent transition-colors" title="Edit">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-muted hover:text-red-400 transition-colors" title="Delete">
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
