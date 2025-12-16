'use client'

import { useEffect, useState } from 'react'
import SignupPopup from './SignupPopup'

export default function SignupPopupManager() {
  const [showPopup, setShowPopup] = useState(false)
  const [triggerSource, setTriggerSource] = useState<'faq' | 'exit'>('exit')
  const [hasShownFooterPopup, setHasShownFooterPopup] = useState(false)

  useEffect(() => {
    // Footer Section Scroll Trigger
    const observerOptions = {
      threshold: 0.3 // Trigger when 30% of footer is visible
    }

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasShownFooterPopup) {
          // Only show footer popup if user hasn't already signed up
          const userSignedUp = sessionStorage.getItem('userSignedUp')
          if (!userSignedUp) {
            setShowPopup(true)
            setTriggerSource('faq')
            setHasShownFooterPopup(true)
            sessionStorage.setItem('footerPopupShown', 'true')
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
      if (e.clientY <= 0 && !showPopup) {
        setShowPopup(true)
        setTriggerSource('exit')
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
