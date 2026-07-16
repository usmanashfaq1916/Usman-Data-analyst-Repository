'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Check, Trash2, RefreshCw, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

const ITEMS_PER_PAGE = 10

export default function AdminContacts() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/contacts')
      if (!res.ok) {
        router.replace('/admin/login')
        return
      }
      const data = await res.json()
      setContacts(data)
    } catch {
      router.replace('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const handleMarkRead = async (id: string) => {
    const res = await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true }),
    })
    if (res.ok) {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, read: true } : c))
      )
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/admin/contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setContacts((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const unreadCount = contacts.filter((c) => !c.read).length
  const totalPages = Math.max(1, Math.ceil(contacts.length / ITEMS_PER_PAGE))
  const paginatedContacts = contacts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

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
          <Mail size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-text font-heading">Contact Messages</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchContacts}
            className="p-2 text-muted hover:text-primary transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
            <Inbox size={28} className="text-muted" />
          </div>
          <h2 className="text-lg font-semibold text-text font-heading">No messages yet</h2>
          <p className="text-sm text-muted mt-1">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Message</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedContacts.map((c) => (
                  <tr key={c.id} className={`hover:bg-card/50 transition-colors ${!c.read ? 'bg-primary/[0.02]' : ''}`}>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          c.read ? 'bg-muted/30' : 'bg-primary'
                        }`}
                        title={c.read ? 'Read' : 'Unread'}
                      />
                    </td>
                    <td className="px-5 py-4 font-medium text-text whitespace-nowrap">{c.name}</td>
                    <td className="px-5 py-4 text-muted">
                      <a href={`mailto:${c.email}`} className="hover:text-primary transition-colors">
                        {c.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-muted max-w-xs">
                      <p className="truncate" title={c.message}>{c.message}</p>
                    </td>
                    <td className="px-5 py-4 text-muted whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {!c.read && (
                          <button
                            onClick={() => handleMarkRead(c.id)}
                            className="p-2 text-muted hover:text-accent transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-muted hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted">
              <p>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(page * ITEMS_PER_PAGE, contacts.length)} of {contacts.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      p === page
                        ? 'bg-primary text-white'
                        : 'text-muted hover:text-primary hover:bg-card'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
