'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { grantTrackingConsent, revokeTrackingConsent } from '@/lib/visitor-tracking';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  useEffect(() => {
    // Check if tracking is globally enabled by admin
    const checkGlobalStatus = async () => {
      try {
        const response = await fetch('/api/tracking-status');
        if (response.ok) {
          const data = await response.json();
          setTrackingEnabled(data.enabled);
          
          // Only show banner if tracking is enabled globally
          if (!data.enabled) {
            setShowBanner(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking tracking status:', error);
      }

      // Check if user has already made a choice
      const consent = localStorage.getItem('visitor_tracking_consent');
      const consentTimestamp = localStorage.getItem('consent_timestamp');
      
      // Show banner if no consent or consent is older than 1 year
      if (!consent || !consentTimestamp) {
        setShowBanner(true);
      } else {
        const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
        if (parseInt(consentTimestamp) < oneYearAgo) {
          setShowBanner(true);
        }
      }
    };

    checkGlobalStatus();
  }, []);

  const handleAccept = () => {
    localStorage.setItem('consent_timestamp', Date.now().toString());
    grantTrackingConsent();
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('consent_timestamp', Date.now().toString());
    revokeTrackingConsent();
    setShowBanner(false);
  };

  // Don't show banner if tracking is disabled globally
  if (!showBanner || !trackingEnabled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              🍪 We value your privacy
            </h3>
            <p className="text-sm text-gray-600">
              We use cookies and similar technologies to enhance your browsing experience, 
              analyze site traffic, and understand where our visitors are coming from. 
              By clicking "Accept", you consent to our use of cookies.{' '}
              <a 
                href="/privacy-policy" 
                className="text-black/90 hover:text-black/80 underline"
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              Accept Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
