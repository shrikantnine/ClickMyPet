/**
 * Visitor Tracking SDK
 * Captures comprehensive visitor data for marketing automation and retargeting
 * GDPR compliant - only activates with user consent
 */

interface VisitorData {
  visitorId: string;
  email?: string;
  ipAddress?: string;
  userAgent: string;
  deviceFingerprint: string;
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenResolution: string;
  viewportSize: string;
  colorDepth: number;
  pixelRatio: number;
  touchSupport: boolean;
  timezone: string;
  language: string;
  languages: string[];
  cookies: Record<string, string>;
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  referrer: string;
  landingPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  pageUrl: string;
  pageTitle: string;
}

interface PageView {
  url: string;
  title: string;
  timestamp: string;
  timeOnPage?: number;
  scrollDepth?: number;
}

interface Interaction {
  type: 'click' | 'scroll' | 'form_interaction' | 'cta_click';
  target?: string;
  value?: string | number;
  timestamp: string;
}

class VisitorTracker {
  private visitorId: string | null = null;
  private sessionId: string | null = null;
  private currentPageStartTime: number = Date.now();
  private maxScrollDepth: number = 0;
  private interactions: Interaction[] = [];
  private hasConsent: boolean = false;
  private trackingInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window === 'undefined') return;
    
    // Check if tracking is globally enabled (admin setting)
    this.checkGlobalTrackingStatus().then(isGloballyEnabled => {
      if (!isGloballyEnabled) {
        console.log('[Visitor Tracking] Disabled by admin');
        return;
      }
      
      // Check for user consent (GDPR)
      this.hasConsent = this.checkConsent();
      
      if (this.hasConsent) {
        this.initialize();
      }
    });
  }

  private async checkGlobalTrackingStatus(): Promise<boolean> {
    try {
      const response = await fetch('/api/tracking-status');
      if (!response.ok) return true; // Default to enabled
      const data = await response.json();
      return data.enabled !== false;
    } catch (error) {
      console.error('Error checking tracking status:', error);
      return true; // Default to enabled on error
    }
  }

  private checkConsent(): boolean {
    // Check if user has given consent
    // TODO: Integrate with your cookie consent banner
    const consent = localStorage.getItem('visitor_tracking_consent');
    return consent === 'true';
  }

  public grantConsent(): void {
    localStorage.setItem('visitor_tracking_consent', 'true');
    this.hasConsent = true;
    this.initialize();
  }

  public revokeConsent(): void {
    localStorage.setItem('visitor_tracking_consent', 'false');
    this.hasConsent = false;
    this.stopTracking();
    this.deleteVisitorData();
  }

  private initialize(): void {
    // Get or create visitor ID
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();

    // Track initial page view
    this.trackPageView();

    // Set up event listeners
    this.setupEventListeners();

    // Start periodic sync (every 30 seconds)
    this.trackingInterval = setInterval(() => {
      this.syncVisitorData();
    }, 30000);
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem('visitor_id');
    
    if (!visitorId) {
      // Format: yyyymmddhhmmss_randomstring
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:T.Z]/g, '')
        .slice(0, 14);
      const random = Math.random().toString(36).substring(2, 10);
      visitorId = `${timestamp}_${random}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    
    return visitorId;
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    
    return sessionId;
  }

  private async generateDeviceFingerprint(): Promise<string> {
    // Combine multiple browser characteristics for unique fingerprint
    const components = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      navigator.hardwareConcurrency,
      (navigator as any).deviceMemory || 'unknown',
      navigator.platform,
    ];

    // Add canvas fingerprint
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(0, 0, 140, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Click My Pet 🐾', 2, 2);
        components.push(canvas.toDataURL());
      }
    } catch (e) {
      // Canvas fingerprinting blocked
    }

    // Simple hash function
    const fingerprint = components.join('|');
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  private parseCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.split('=').map(c => c.trim());
      if (key) cookies[key] = value || '';
    });
    return cookies;
  }

  private getLocalStorage(): Record<string, string> {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !this.isSensitiveKey(key)) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    return data;
  }

  private getSessionStorage(): Record<string, string> {
    const data: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && !this.isSensitiveKey(key)) {
        data[key] = sessionStorage.getItem(key) || '';
      }
    }
    return data;
  }

  private isSensitiveKey(key: string): boolean {
    // Don't track sensitive data
    const sensitivePatterns = ['password', 'token', 'secret', 'key', 'auth'];
    return sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern));
  }

  private parseUserAgent(): { browserName: string; browserVersion: string; osName: string; osVersion: string } {
    const ua = navigator.userAgent;
    
    // Browser detection
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (ua.includes('Firefox/')) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Chrome/')) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Safari/')) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Edge/')) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edge\/([0-9.]+)/)?.[1] || 'Unknown';
    }

    // OS detection
    let osName = 'Unknown';
    let osVersion = 'Unknown';
    
    if (ua.includes('Windows NT')) {
      osName = 'Windows';
      osVersion = ua.match(/Windows NT ([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Mac OS X')) {
      osName = 'macOS';
      osVersion = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    } else if (ua.includes('Linux')) {
      osName = 'Linux';
    } else if (ua.includes('Android')) {
      osName = 'Android';
      osVersion = ua.match(/Android ([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('iOS')) {
      osName = 'iOS';
      osVersion = ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    }

    return { browserName, browserVersion, osName, osVersion };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getUTMParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string; utmTerm?: string; utmContent?: string } {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmTerm: params.get('utm_term') || undefined,
      utmContent: params.get('utm_content') || undefined,
    };
  }

  private async collectVisitorData(): Promise<VisitorData> {
    const { browserName, browserVersion, osName, osVersion } = this.parseUserAgent();
    const utmParams = this.getUTMParams();

    return {
      visitorId: this.visitorId!,
      email: localStorage.getItem('user_email') || undefined,
      userAgent: navigator.userAgent,
      deviceFingerprint: await this.generateDeviceFingerprint(),
      browserName,
      browserVersion,
      osName,
      osVersion,
      deviceType: this.getDeviceType(),
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
      cookies: this.parseCookies(),
      localStorage: this.getLocalStorage(),
      sessionStorage: this.getSessionStorage(),
      referrer: document.referrer,
      landingPage: localStorage.getItem('landing_page') || window.location.href,
      ...utmParams,
      pageUrl: window.location.href,
      pageTitle: document.title,
    };
  }

  private setupEventListeners(): void {
    // Track scroll depth
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const height = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrolled / height) * 100);
          
          if (scrollPercent > this.maxScrollDepth) {
            this.maxScrollDepth = scrollPercent;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    });

    // Track CTA clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Check if it's a CTA button
      if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('a[href]')) {
        const button = target.closest('button, a') as HTMLElement;
        const text = button.textContent?.trim() || '';
        const href = button.getAttribute('href');
        
        this.interactions.push({
          type: 'cta_click',
          target: text,
          value: href || undefined,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Track page unload (calculate time on page)
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
    });

    // Track visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.syncVisitorData();
      }
    });
  }

  public async trackPageView(): Promise<void> {
    if (!this.hasConsent || !this.visitorId) return;

    this.currentPageStartTime = Date.now();
    this.maxScrollDepth = 0;
    this.interactions = [];

    // Save landing page on first visit
    if (!localStorage.getItem('landing_page')) {
      localStorage.setItem('landing_page', window.location.href);
    }

    await this.syncVisitorData();
  }

  public async trackPageExit(): Promise<void> {
    if (!this.hasConsent || !this.visitorId) return;

    const timeOnPage = Math.round((Date.now() - this.currentPageStartTime) / 1000);
    
    await this.syncVisitorData({
      timeOnPage,
      scrollDepth: this.maxScrollDepth,
      interactions: this.interactions,
    });
  }

  public async syncVisitorData(additionalData?: any): Promise<void> {
    if (!this.hasConsent || !this.visitorId) return;

    try {
      const visitorData = await this.collectVisitorData();
      
      const response = await fetch('/api/track-visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visitorData,
          sessionId: this.sessionId,
          ...additionalData,
        }),
      });

      if (!response.ok) {
        console.error('Failed to sync visitor data');
      }
    } catch (error) {
      console.error('Error syncing visitor data:', error);
    }
  }

  public setEmail(email: string): void {
    localStorage.setItem('user_email', email);
    this.syncVisitorData({ email });
  }

  public trackEvent(eventType: string, data?: any): void {
    if (!this.hasConsent || !this.visitorId) return;

    this.interactions.push({
      type: eventType as any,
      value: data,
      timestamp: new Date().toISOString(),
    });

    // Optionally sync immediately for important events
    if (['conversion', 'signup', 'purchase'].includes(eventType)) {
      this.syncVisitorData();
    }
  }

  private stopTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  private async deleteVisitorData(): Promise<void> {
    try {
      await fetch('/api/track-visitor', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: this.visitorId }),
      });
      
      localStorage.removeItem('visitor_id');
      localStorage.removeItem('landing_page');
      localStorage.removeItem('user_email');
    } catch (error) {
      console.error('Error deleting visitor data:', error);
    }
  }
}

// Singleton instance
let trackerInstance: VisitorTracker | null = null;

export function getVisitorTracker(): VisitorTracker {
  if (!trackerInstance && typeof window !== 'undefined') {
    trackerInstance = new VisitorTracker();
  }
  return trackerInstance!;
}

export function initVisitorTracking(): VisitorTracker {
  return getVisitorTracker();
}

export function grantTrackingConsent(): void {
  getVisitorTracker().grantConsent();
}

export function revokeTrackingConsent(): void {
  getVisitorTracker().revokeConsent();
}

export function setVisitorEmail(email: string): void {
  getVisitorTracker().setEmail(email);
}

export function trackCustomEvent(eventType: string, data?: any): void {
  getVisitorTracker().trackEvent(eventType, data);
}
