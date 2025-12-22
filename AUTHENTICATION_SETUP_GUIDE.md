# Authentication Setup Guide - Google & Facebook OAuth

## Prerequisites
- Supabase project already set up
- Access to Google Cloud Console
- Access to Facebook for Developers

---

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API

### Step 2: Configure OAuth Consent Screen
1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: **Click My Pet**
   - User support email: **support@clickmypet.com**
   - App logo: Upload your logo
   - App domain: **clickmypet.com**
   - Authorized domains: Add `clickmypet.com`
   - Developer contact: **support@clickmypet.com**
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Save and continue

### Step 3: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: **Click My Pet Web Client**
5. Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://clickmypet.com
   https://<your-supabase-project>.supabase.co
   ```
6. Authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://clickmypet.com/auth/callback
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```
7. Click **Create** and save your:
   - Client ID
   - Client Secret

---

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App
1. Go to [Facebook for Developers](https://developers.facebook.com)
2. Click **My Apps** > **Create App**
3. Choose **Consumer** use case
4. App name: **Click My Pet**
5. App contact email: **support@clickmypet.com**
6. Click **Create App**

### Step 2: Add Facebook Login
1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Enter site URL: `https://clickmypet.com`

### Step 3: Configure OAuth Settings
1. Go to **Facebook Login** > **Settings**
2. Valid OAuth Redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://clickmypet.com/auth/callback
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```
3. Save changes

### Step 4: Get App Credentials
1. Go to **Settings** > **Basic**
2. Copy your:
   - App ID
   - App Secret
3. Add domains:
   - App Domains: `clickmypet.com`
   - Privacy Policy URL: `https://clickmypet.com/privacy-policy`
   - Terms of Service URL: `https://clickmypet.com/terms-conditions`

### Step 5: Enable App
1. Toggle your app from **Development** to **Live** mode
2. This requires completing Business Verification if you haven't already

---

## 3. Configure Supabase

### Step 1: Add Google Provider
1. Go to Supabase Dashboard > **Authentication** > **Providers**
2. Enable **Google**
3. Enter credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
4. Save

### Step 2: Add Facebook Provider
1. In Supabase Dashboard > **Authentication** > **Providers**
2. Enable **Facebook**
3. Enter credentials:
   - App ID: (from Facebook Developer)
   - App Secret: (from Facebook Developer)
4. Save

### Step 3: Configure Redirect URLs
1. Go to **Authentication** > **URL Configuration**
2. Site URL: `https://clickmypet.com`
3. Redirect URLs (add all):
   ```
   http://localhost:3000/onboarding
   https://clickmypet.com/onboarding
   http://localhost:3000/dashboard
   https://clickmypet.com/dashboard
   ```

---

## 4. Update Environment Variables

Add to your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://clickmypet.com
```

---

## 5. Implementation Code

The onboarding page already has the UI. Update the handlers:

```typescript
// src/app/onboarding/page.tsx

const handleGoogleSignUp = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    
    if (error) throw error
  } catch (error) {
    console.error('Google sign up error:', error)
    setError('Failed to sign in with Google. Please try again.')
  }
}

const handleFacebookSignUp = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
        scopes: 'email',
      },
    })
    
    if (error) throw error
  } catch (error) {
    console.error('Facebook sign up error:', error)
    setError('Failed to sign in with Facebook. Please try again.')
  }
}

const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: {
          name: formData.name,
        },
      },
    })
    
    if (error) throw error
    
    // Show success message
    setAuthMode('email-sent')
    setError(null)
  } catch (error) {
    console.error('Email auth error:', error)
    setError('Failed to send magic link. Please try again.')
  }
}
```

---

## 6. Handle Authentication State

Add listener in onboarding:

```typescript
useEffect(() => {
  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      setIsAuthenticated(true)
      setStep(2)
    }
  })

  // Listen for auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setIsAuthenticated(true)
      setStep(2)
    }
  })

  return () => subscription.unsubscribe()
}, [])
```

---

## 7. Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/onboarding`
3. Test each auth method:
   - Google sign-in
   - Facebook sign-in
   - Email magic link

### Common Issues

**"Redirect URI mismatch"**
- Double-check all redirect URIs match exactly
- Include both `http://localhost:3000` and production URLs
- Clear browser cache

**"App not verified"**
- Google: Submit app for verification (optional for testing)
- Facebook: Switch app to Live mode

**"Email not verified"**
- Check Supabase email templates
- Ensure SMTP is configured correctly

---

## 8. Production Checklist

- [ ] Google OAuth app verified
- [ ] Facebook app in Live mode
- [ ] All redirect URIs include production domain
- [ ] Environment variables set in production
- [ ] Test all auth flows in production
- [ ] Privacy policy and terms links working
- [ ] Email templates customized with Click My Pet branding

---

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard > Logs
2. Check browser console for errors
3. Verify all credentials are correct
4. Test in incognito mode to avoid cache issues
