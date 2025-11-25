'use client';

import { useEffect } from 'react';
import { initVisitorTracking } from '@/lib/visitor-tracking';

export function VisitorTrackingProvider() {
  useEffect(() => {
    // Initialize visitor tracking on mount
    const tracker = initVisitorTracking();
    
    // Track page views on route changes
    const handleRouteChange = () => {
      tracker.trackPageView();
    };

    // Listen for route changes (Next.js app router)
    window.addEventListener('popstate', handleRouteChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
