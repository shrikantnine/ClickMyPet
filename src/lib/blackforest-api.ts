// Black Forest Labs Flux API Integration
// Documentation: https://docs.bfl.ml/

export interface FluxReferenceImage {
  url: string
  weight?: number
}

export interface FluxGenerationRequest {
  prompt: string
  negative_prompt?: string
  width?: number
  height?: number
  num_inference_steps?: number
  guidance_scale?: number
  num_images?: number
  seed?: number
  safety_tolerance?: number
  output_format?: 'jpeg' | 'png'
  model?: string
  character_lock?: boolean
  reference_images?: FluxReferenceImage[]
}

export interface FluxGenerationResponse {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    sample: string // Base64 encoded image or URL
    seed: number
    finish_reason: string
  }[]
  error?: string
}

export interface GenerationJob {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  images?: string[]
  referenceImages?: string[]
  error?: string
  createdAt: Date
  completedAt?: Date
}

export type PlanTier = 'starter' | 'pro' | 'ultra' | 'max'

export interface FluxModelConfig {
  model: string
  width: number
  height: number
  steps: number
  guidance: number
  output: 'jpeg' | 'png'
  characterLock: boolean
  maxImagesPerJob: number
}

// Central map that ties subscription tiers to Flux endpoints, resolutions, and
// whether we should send character-lock metadata (multi-photo references).
const PLAN_MODEL_CONFIG: Record<PlanTier, FluxModelConfig> = {
  starter: {
    model: 'flux-pro-1.1',
    width: 1024,
    height: 1024,
    steps: 32,
    guidance: 6.8,
    output: 'jpeg',
    characterLock: false,
    maxImagesPerJob: 1,
  },
  pro: {
    model: 'flux-pro-1.1-cp',
    width: 1536,
    height: 1536,
    steps: 45,
    guidance: 7.4,
    output: 'jpeg',
    characterLock: true,
    maxImagesPerJob: 2,
  },
  ultra: {
    model: 'flux-ultra-1.1',
    width: 2048,
    height: 2048,
    steps: 60,
    guidance: 8.2,
    output: 'png',
    characterLock: true,
    maxImagesPerJob: 3,
  },
  max: {
    model: 'flux-ultra-1.1',
    width: 2048,
    height: 2048,
    steps: 60,
    guidance: 8.2,
    output: 'png',
    characterLock: true,
    maxImagesPerJob: 3,
  },
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 10,
  maxConcurrentJobs: 5,
}

function resolvePlanTier(planId: string): PlanTier {
  if (planId === 'pro') return 'pro'
  if (planId === 'ultra') return 'ultra'
  if (planId === 'max') return 'max'
  return 'starter'
}

export function getPlanModelConfig(planId: string): FluxModelConfig {
  const tier = resolvePlanTier(planId)
  return PLAN_MODEL_CONFIG[tier]
}

let requestCount = 0
let lastResetTime = Date.now()

/**
 * Check rate limit before making API calls
 */
function checkRateLimit(): boolean {
  const now = Date.now()
  const timeSinceReset = now - lastResetTime
  
  if (timeSinceReset >= 60000) {
    // Reset counter every minute
    requestCount = 0
    lastResetTime = now
  }
  
  if (requestCount >= RATE_LIMIT_CONFIG.maxRequestsPerMinute) {
    return false
  }
  
  requestCount++
  return true
}

/**
 * Generate images using Black Forest Labs Flux API
 * @param request Generation parameters
 * @returns Generation job ID and status
 */
export async function generateImages(
  request: FluxGenerationRequest
): Promise<FluxGenerationResponse> {
  // Check rate limit
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again in a moment.')
  }
  
  const apiKey = process.env.BLACKFOREST_API_KEY
  
  if (!apiKey) {
    throw new Error('Black Forest Labs API key not configured')
  }
  
  // Set defaults for optimal quality
  const params: FluxGenerationRequest = {
    prompt: request.prompt,
    negative_prompt: request.negative_prompt || '',
    width: request.width || 1024,
    height: request.height || 1024,
    num_inference_steps: request.num_inference_steps || 50,
    guidance_scale: request.guidance_scale || 7.5,
    num_images: request.num_images || 1,
    seed: request.seed,
    safety_tolerance: request.safety_tolerance || 2,
    output_format: request.output_format || 'jpeg',
    model: request.model,
    character_lock: request.character_lock,
    reference_images: request.reference_images,
  }
  
  try {
    const { model, reference_images, ...payload } = params
    const endpoint = model || 'flux-pro-1.1'

    if (reference_images && reference_images.length > 0) {
      ;(payload as any).reference_images = reference_images.map(image => ({
        url: image.url,
        weight: image.weight ?? 0.6,
      }))
    }

    // Call Black Forest Labs API with plan-specific endpoint
    const response = await fetch(`https://api.bfl.ml/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key': apiKey,
      },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `API request failed: ${response.status} - ${errorData.error || response.statusText}`
      )
    }
    
    const data = await response.json()
    
    return {
      id: data.id,
      status: 'pending',
      result: data.result,
    }
  } catch (error) {
    console.error('Black Forest Labs API error:', error)
    throw new Error(
      `Failed to generate images: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Check the status of a generation job
 * @param jobId The job ID from initial generation request
 * @returns Current job status and results if completed
 */
export async function checkGenerationStatus(
  jobId: string
): Promise<FluxGenerationResponse> {
  const apiKey = process.env.BLACKFOREST_API_KEY
  
  if (!apiKey) {
    throw new Error('Black Forest Labs API key not configured')
  }
  
  try {
    const response = await fetch(`https://api.bfl.ml/v1/get_result?id=${jobId}`, {
      method: 'GET',
      headers: {
        'X-Key': apiKey,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to check status: ${response.status} - ${errorData.error || response.statusText}`
      )
    }
    
    const data = await response.json()
    
    return {
      id: jobId,
      status: data.status,
      result: data.result,
      error: data.error,
    }
  } catch (error) {
    console.error('Error checking generation status:', error)
    throw new Error(
      `Failed to check generation status: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Poll for job completion with exponential backoff
 * @param jobId The job ID to poll
 * @param maxAttempts Maximum number of polling attempts
 * @returns Completed generation response
 */
export async function waitForCompletion(
  jobId: string,
  maxAttempts: number = 60
): Promise<FluxGenerationResponse> {
  let attempts = 0
  let delay = 2000 // Start with 2 second delay
  
  while (attempts < maxAttempts) {
    const status = await checkGenerationStatus(jobId)
    
    if (status.status === 'completed') {
      return status
    }
    
    if (status.status === 'failed') {
      throw new Error(`Generation failed: ${status.error || 'Unknown error'}`)
    }
    
    // Wait before next poll with exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay))
    
    attempts++
    delay = Math.min(delay * 1.5, 10000) // Max 10 second delay
  }
  
  throw new Error('Generation timed out')
}

/**
 * Generate multiple images in batch
 * @param requests Array of generation requests
 * @returns Array of generation responses
 */
export async function generateBatch(
  requests: FluxGenerationRequest[]
): Promise<FluxGenerationResponse[]> {
  if (requests.length > RATE_LIMIT_CONFIG.maxConcurrentJobs) {
    throw new Error(
      `Batch size exceeds maximum concurrent jobs (${RATE_LIMIT_CONFIG.maxConcurrentJobs})`
    )
  }
  
  try {
    // Generate all images in parallel
    const jobs = await Promise.all(
      requests.map(request => generateImages(request))
    )
    
    // Wait for all jobs to complete
    const results = await Promise.all(
      jobs.map(job => waitForCompletion(job.id))
    )
    
    return results
  } catch (error) {
    console.error('Batch generation error:', error)
    throw error
  }
}

/**
 * Download and save generated image
 * @param imageUrl URL or base64 of generated image
 * @param filename Desired filename
 * @returns Local file path or storage URL
 */
export async function downloadImage(
  imageUrl: string,
  filename: string
): Promise<string> {
  try {
    // If it's a base64 string, handle differently
    if (imageUrl.startsWith('data:image')) {
      return imageUrl // Return base64 for client-side handling
    }
    
    // Otherwise fetch from URL
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    
    // In production, upload to Supabase Storage or S3
    // For now, return the URL
    return imageUrl
  } catch (error) {
    console.error('Error downloading image:', error)
    throw error
  }
}

/**
 * Upload image to Supabase Storage
 * @param imageData Image data (base64 or blob)
 * @param userId User ID for organizing storage
 * @param filename Filename for the image
 * @returns Public URL of uploaded image
 */
export async function uploadToStorage(
  imageData: string | Blob,
  userId: string,
  filename: string
): Promise<string> {
  // This will be implemented with Supabase Storage
  // Placeholder for now
  
  // In production:
  // 1. Convert base64 to blob if needed
  // 2. Upload to Supabase Storage bucket
  // 3. Return public URL
  
  console.log('Upload to storage:', { userId, filename })
  
  // Return mock URL for now
  return `https://storage.supabase.com/clickmypet/${userId}/${filename}`
}

/**
 * Calculate estimated generation time based on parameters
 * @param numImages Number of images to generate
 * @param steps Number of inference steps
 * @returns Estimated time in seconds
 */
export function estimateGenerationTime(
  numImages: number,
  steps: number = 50
): number {
  // Rough estimates: ~30 seconds per image with 50 steps
  const baseTimePerImage = 30
  const stepModifier = steps / 50
  
  return Math.ceil(numImages * baseTimePerImage * stepModifier)
}

/**
 * Get optimal generation parameters based on plan
 * @param planId User's subscription plan
 * @returns Recommended generation parameters
 */
export function getOptimalParameters(planId: string): Partial<FluxGenerationRequest> {
  const config = getPlanModelConfig(planId)

  return {
    width: config.width,
    height: config.height,
    num_inference_steps: config.steps,
    guidance_scale: config.guidance,
    output_format: config.output,
    model: config.model,
    character_lock: config.characterLock,
  }
}
