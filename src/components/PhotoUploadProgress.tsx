'use client'

import { useState, useRef } from 'react'
import { Upload, X, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

interface PhotoUploadProgressProps {
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
  minFiles?: number
}

export default function PhotoUploadProgress({
  onUploadComplete,
  maxFiles = 20,
  minFiles = 10,
}: PhotoUploadProgressProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File, index: number) => {
    try {
      // Update status to uploading
      setUploads(prev => prev.map((upload, i) =>
        i === index ? { ...upload, status: 'uploading' as const, progress: 0 } : upload
      ))

      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploads(prev => prev.map((upload, i) =>
            i === index ? { ...upload, progress } : upload
          ))
        }
      })

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          setUploads(prev => prev.map((upload, i) =>
            i === index ? { 
              ...upload, 
              progress: 100, 
              status: 'success' as const,
              url: response.url 
            } : upload
          ))
        } else {
          throw new Error(xhr.responseText || 'Upload failed')
        }
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploads(prev => prev.map((upload, i) =>
          i === index ? { 
            ...upload, 
            status: 'error' as const,
            error: 'Network error'
          } : upload
        ))
      })

      xhr.open('POST', '/api/upload-image')
      xhr.send(formData)

    } catch (error: any) {
      setUploads(prev => prev.map((upload, i) =>
        i === index ? { 
          ...upload, 
          status: 'error' as const,
          error: error.message 
        } : upload
      ))
      toast.error(`Failed to upload ${file.name}`)
    }
  }

  const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image`)
        continue
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} is too large (max 10MB)`)
        continue
      }

      valid.push(file)
    }

    return { valid, errors }
  }

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // Validate file count
    if (fileArray.length + uploads.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} photos allowed`, {
        description: `You selected ${fileArray.length} files but already have ${uploads.length}`
      })
      return
    }

    // Validate files
    const { valid, errors } = validateFiles(fileArray)

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
    }

    if (valid.length === 0) return

    // Initialize upload states
    const newUploads: UploadProgress[] = valid.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }))

    setUploads(prev => [...prev, ...newUploads])

    // Start uploads
    const startIndex = uploads.length
    valid.forEach((file, index) => {
      uploadFile(file, startIndex + index)
    })

    toast.success(`Uploading ${valid.length} photo${valid.length > 1 ? 's' : ''}...`)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFilesSelected(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index))
  }

  const retryUpload = (index: number) => {
    const upload = uploads[index]
    if (upload.status === 'error') {
      uploadFile(upload.file, index)
    }
  }

  const handleComplete = () => {
    const successfulUploads = uploads.filter(u => u.status === 'success')
    
    if (successfulUploads.length < minFiles) {
      toast.warning(`Please upload at least ${minFiles} photos`, {
        description: `You have ${successfulUploads.length} successful uploads`
      })
      return
    }

    const urls = successfulUploads.map(u => u.url!).filter(Boolean)
    onUploadComplete?.(urls)
  }

  const overallProgress = uploads.length > 0
    ? Math.round(uploads.reduce((sum, u) => sum + u.progress, 0) / uploads.length)
    : 0

  const successCount = uploads.filter(u => u.status === 'success').length
  const errorCount = uploads.filter(u => u.status === 'error').length
  const uploadingCount = uploads.filter(u => u.status === 'uploading').length

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="text-lg font-medium mb-2">
          {isDragging ? 'Drop your photos here' : 'Click to upload or drag & drop'}
        </p>
        <p className="text-sm text-gray-500">
          Upload {minFiles}-{maxFiles} photos of your pet (max 10MB each)
        </p>
        <p className="text-xs text-gray-400 mt-2">
          PNG, JPG, JPEG, WEBP supported
        </p>
      </div>

      {/* Upload Stats */}
      {uploads.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">{uploads.length} files</span>
              {successCount > 0 && (
                <span className="text-green-600">{successCount} uploaded</span>
              )}
              {uploadingCount > 0 && (
                <span className="text-blue-600">{uploadingCount} uploading</span>
              )}
              {errorCount > 0 && (
                <span className="text-red-600">{errorCount} failed</span>
              )}
            </div>
            <span className="text-sm font-medium">{overallProgress}%</span>
          </div>

          {/* Overall Progress Bar with Glowing Effect */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out shadow-lg shadow-blue-500/50 animate-pulse-glow"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Individual File Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {uploads.map((upload, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {upload.status === 'success' ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                ) : upload.status === 'error' ? (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{upload.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {upload.status === 'uploading' && (
                    <div className="flex-1 max-w-[200px]">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-200"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {upload.error && (
                  <p className="text-xs text-red-600 mt-1">{upload.error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {upload.status === 'success' && (
                  <span className="text-xs text-green-600 font-medium">
                    {upload.progress}%
                  </span>
                )}
                {upload.status === 'uploading' && (
                  <span className="text-xs text-blue-600 font-medium">
                    {upload.progress}%
                  </span>
                )}
                {upload.status === 'error' && (
                  <button
                    onClick={() => retryUpload(index)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {uploads.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={handleComplete}
            disabled={successCount < minFiles}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              successCount >= minFiles
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue with {successCount} photo{successCount !== 1 ? 's' : ''}
          </button>
          <button
            onClick={() => setUploads([])}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 4px 20px 0 rgba(59, 130, 246, 0.8);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
