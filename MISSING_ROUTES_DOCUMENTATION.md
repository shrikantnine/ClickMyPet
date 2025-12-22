# Missing Routes Documentation

## Overview
This document details missing route pages identified in the codebase and recommendations for handling them.

---

## 1. Missing Routes Identified

### `/try-free` Route
**Status:** 🔴 REMOVED (per user request)

**References Found:**
- `src/lib/metadata.ts` - Line 10-28 (metadata export)
- `src/app/sitemap.ts` - Line 40 (sitemap entry)
- `src/app/robots.ts` - Line 36 (robots allow list)
- `src/app/result/page.tsx` - Line 226 (Link component)
- `src/app/api/auth/magic-link/route.ts` - Line 45 (email redirect)

**Action Taken:**
All references have been removed. Users must now pay for all services. Redirects from old links will go to `/onboarding` instead.

---

### `/reset-password` Route
**Status:** 🟡 MISSING

**Reference Found:**
- Referenced in password recovery flows (email templates, potential UI)

**Recommended Implementation:**
Create password reset page for users who forget their passwords.

**Location to Create:**
`src/app/reset-password/page.tsx`

**Required Functionality:**
```typescript
// Page should:
1. Accept token from email link (?token=xxx)
2. Display new password form
3. Call Supabase updateUser with new password
4. Show success message and redirect to login
5. Handle expired/invalid tokens gracefully
```

**Example Implementation:**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Supabase automatically handles the token from URL
    // Check if we have a valid session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Invalid or expired reset link')
        router.push('/login')
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      toast.success('Password updated successfully!')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

---

## 2. Error Handling & User Feedback

### Current Issues

#### Alert Usage (Poor UX)
**Problem:** Multiple places use `alert()` which blocks the UI and looks unprofessional.

**Locations:**
- `src/app/onboarding/page.tsx`
- `src/app/checkout/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/result/page.tsx`

**Solution:** Replace all with toast notifications using Sonner library.

---

#### Silent Errors
**Problem:** Many errors only log to console without user feedback.

**Examples:**
```typescript
// Bad - user has no idea something failed
catch (error) {
  console.error('Upload failed:', error)
}

// Good - user gets feedback
catch (error) {
  console.error('Upload failed:', error)
  toast.error('Failed to upload images. Please try again.')
}
```

---

#### Missing Loading States
**Problem:** No visual feedback during async operations.

**Affected Areas:**
- Image uploads
- Payment processing
- AI generation
- Dashboard loading

**Solution:** Add loading spinners and progress indicators.

---

### Recommended Toast Implementation

#### Step 1: Setup Toaster Provider

Add to `src/app/layout.tsx`:
```typescript
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  )
}
```

#### Step 2: Usage Patterns

```typescript
import { toast } from 'sonner'

// Success messages
toast.success('Images uploaded successfully!')
toast.success('Payment completed', {
  description: 'You can now download your portraits'
})

// Error messages
toast.error('Upload failed', {
  description: 'Please check your internet connection'
})

// Loading states
const toastId = toast.loading('Processing payment...')
// ... do async work
toast.success('Payment successful!', { id: toastId })

// Info messages
toast.info('Processing your images')
toast.warning('Only 2 images uploaded, need 10-20 for best results')

// Promise-based (auto handles loading/success/error)
toast.promise(uploadImages(), {
  loading: 'Uploading images...',
  success: 'Images uploaded successfully!',
  error: 'Failed to upload images'
})
```

---

### Error Handling Best Practices

#### 1. User-Facing Errors
```typescript
try {
  await riskyOperation()
} catch (error) {
  // Log for debugging
  console.error('Operation failed:', error)
  
  // Show user-friendly message
  toast.error('Something went wrong', {
    description: 'Please try again or contact support'
  })
}
```

#### 2. Network Errors
```typescript
try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) {
    throw new Error('Network request failed')
  }
} catch (error) {
  if (error.message.includes('fetch failed')) {
    toast.error('Connection error', {
      description: 'Please check your internet connection'
    })
  } else {
    toast.error('Request failed', {
      description: 'Please try again'
    })
  }
}
```

#### 3. Validation Errors
```typescript
if (images.length < 10) {
  toast.warning('Not enough images', {
    description: 'Please upload at least 10 photos for best results'
  })
  return
}

if (images.length > 20) {
  toast.warning('Too many images', {
    description: 'Maximum 20 images allowed'
  })
  return
}
```

#### 4. Timeout Handling
```typescript
const timeout = setTimeout(() => {
  toast.error('Request timeout', {
    description: 'The server is taking too long to respond'
  })
}, 30000) // 30 seconds

try {
  await apiCall()
  clearTimeout(timeout)
} catch (error) {
  clearTimeout(timeout)
  throw error
}
```

---

## 3. Loading Progress Implementation

### Photo Upload Progress Bar

**Location:** `src/app/onboarding/page.tsx` and `src/app/dashboard/page.tsx`

**Requirements:**
- Show individual file upload progress
- Use glowing blue color from homepage CTA buttons
- Display file names and sizes
- Show overall progress percentage
- Allow cancellation

**Implementation:**

```typescript
'use client'

import { useState } from 'react'
import { Upload, X, Check } from 'lucide-react'
import { toast } from 'sonner'

interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
}

export default function PhotoUploadProgress() {
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const uploadFile = async (file: File, index: number) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploads(prev => prev.map((upload, i) =>
            i === index ? { ...upload, progress, status: 'uploading' } : upload
          ))
        }
      })

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setUploads(prev => prev.map((upload, i) =>
            i === index ? { ...upload, progress: 100, status: 'success' } : upload
          ))
        } else {
          throw new Error('Upload failed')
        }
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploads(prev => prev.map((upload, i) =>
          i === index ? { ...upload, status: 'error' } : upload
        ))
        toast.error(`Failed to upload ${file.name}`)
      })

      xhr.open('POST', '/api/upload-image')
      xhr.send(formData)

    } catch (error) {
      setUploads(prev => prev.map((upload, i) =>
        i === index ? { ...upload, status: 'error' } : upload
      ))
    }
  }

  const handleFilesSelected = (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Initialize upload states
    setUploads(fileArray.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    })))

    // Start uploads
    fileArray.forEach((file, index) => {
      uploadFile(file, index)
    })
  }

  const overallProgress = uploads.length > 0
    ? Math.round(uploads.reduce((sum, u) => sum + u.progress, 0) / uploads.length)
    : 0

  return (
    <div className="space-y-4">
      {/* File Input */}
      <label className="cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
          className="hidden"
        />
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">Click to upload photos</p>
          <p className="text-sm text-gray-500 mt-2">Upload 10-20 photos of your pet</p>
        </div>
      </label>

      {/* Overall Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading {uploads.length} files</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/50"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Individual File Progress */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {uploads.map((upload, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            {/* Status Icon */}
            {upload.status === 'success' ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : upload.status === 'error' ? (
              <X className="w-5 h-5 text-red-500 flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            )}

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{upload.file.name}</p>
              <p className="text-xs text-gray-500">
                {(upload.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Progress */}
            <span className="text-sm text-gray-600 flex-shrink-0">
              {upload.progress}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**CSS for Glowing Blue Effect:**
```css
.progress-bar-glow {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.5);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 4px 20px 0 rgba(59, 130, 246, 0.8);
  }
}
```

---

## 4. Implementation Priority

### Critical (Implement First)
1. ✅ Install Sonner: `npm install sonner`
2. ✅ Add Toaster to layout
3. 🔄 Replace all alert() calls with toast
4. 🔄 Add error toast to all catch blocks
5. 🔄 Create reset-password page

### High Priority
1. 🔄 Implement upload progress bar
2. 🔄 Add loading states to all buttons
3. 🔄 Add validation toasts
4. 🔄 Handle network errors gracefully

### Medium Priority
1. Add retry logic for failed uploads
2. Add file validation (size, type)
3. Add upload cancellation
4. Improve error messages

---

## Summary

**Missing Routes:** `/try-free` removed, `/reset-password` needs implementation

**Error Handling:** Need to replace alert() with toasts and add user feedback for all errors

**Loading States:** Add progress indicators for uploads and async operations

**Next Steps:**
1. Implement toast notifications throughout app
2. Create reset-password page
3. Add upload progress tracking
4. Test all error scenarios
