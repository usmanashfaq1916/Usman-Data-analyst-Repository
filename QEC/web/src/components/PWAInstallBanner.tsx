"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("qec-pwa-dismissed")
    setDismissed(!!stored)

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    function handler(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === "accepted") {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem("qec-pwa-dismissed", "true")
  }

  if (isInstalled || !showBanner || dismissed) return null

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Install QEC App</p>
          <p className="text-xs text-muted truncate">Get the best experience with our app</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-all shrink-0"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-border transition-all shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
