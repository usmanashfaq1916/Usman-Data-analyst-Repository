'use client'

import { useEffect } from 'react'

export default function TawkChat() {
  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
    if (!propertyId) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://embed.tawk.to/${propertyId}`
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    document.head.appendChild(script)
  }, [])

  return null
}
