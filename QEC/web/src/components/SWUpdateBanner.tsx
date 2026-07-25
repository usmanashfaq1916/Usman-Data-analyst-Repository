"use client"

import { useState, useEffect } from "react"
import { RefreshCw, X } from "lucide-react"

export function SWUpdateBanner() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing
          if (installing) {
            installing.addEventListener("statechange", () => {
              if (installing.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(installing)
                setShow(true)
              }
            })
          }
        })
      })
    }
  }, [])

  function handleUpdate() {
    if (waitingWorker) {
      waitingWorker.postMessage("SKIP_WAITING")
    }
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => {
      window.location.reload()
    })
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <RefreshCw className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Update Available</p>
          <p className="text-xs text-muted truncate">A new version is ready. Refresh to update.</p>
        </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-all shrink-0"
        >
          Refresh
        </button>
        <button
          onClick={() => setShow(false)}
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-border transition-all shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
