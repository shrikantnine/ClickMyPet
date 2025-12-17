'use client'

import { useEffect, useState } from 'react'
import SignupPopup from './SignupPopup'

export default function SignupPopupManager() {
  const [showPopup, setShowPopup] = useState(false)
  const [triggerSource, setTriggerSource] = useState<'faq' | 'exit'>('exit')
  const [hasShownFooterPopup, setHasShownFooterPopup] = useState(false)

  const POPUP_COOLDOWN_MS = 30 * 60 * 1000

  const hasRecentPopup = () => {
    if (typeof window === 'undefined') return true

    const sessionShown = sessionStorage.getItem('signupPopupShown') === 'true'
    if (sessionShown) return true

    const lastShownAt = localStorage.getItem('signupPopupShownAt')
    if (!lastShownAt) return false

    const last = Number(lastShownAt)
    if (!Number.isFinite(last)) return false

    return Date.now() - last < POPUP_COOLDOWN_MS
  }

  const markPopupShown = () => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('signupPopupShown', 'true')
    localStorage.setItem('signupPopupShownAt', String(Date.now()))
  }

  const openPopup = (source: 'faq' | 'exit') => {
    if (showPopup) return
    if (hasRecentPopup()) return

    markPopupShown()
    setShowPopup(true)
    setTriggerSource(source)
  }

  useEffect(() => {
    // If already shown recently, prevent footer trigger state churn
    if (hasRecentPopup()) {
      setHasShownFooterPopup(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Footer Section Scroll Trigger
    const observerOptions = {
      threshold: 0.2 // Trigger when 30% of footer is visible
    }

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasShownFooterPopup) {
          // Only show footer popup if user hasn't already signed up
          const userSignedUp = sessionStorage.getItem('userSignedUp')
          if (!userSignedUp) {
            openPopup('faq')
            setHasShownFooterPopup(true)
          }
        }
      })
    }, observerOptions)

    // Find footer and observe it
    const footer = document.querySelector('footer')
    if (footer) {
      footerObserver.observe(footer)
    }

    return () => {
      if (footer) {
        footerObserver.unobserve(footer)
      }
    }
  }, [hasShownFooterPopup])

  useEffect(() => {
    // Exit Intent Trigger - detect mouse leaving from top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        openPopup('exit')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [showPopup])

  const handleClose = () => {
    setShowPopup(false)
  }

  return (
    <SignupPopup 
      isOpen={showPopup} 
      onClose={handleClose}
      trigger={triggerSource}
    />
  )
}
