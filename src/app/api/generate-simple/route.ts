import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const blackforestApiKey = process.env.BLACKFOREST_API_KEY

// Simulated job store (in production, use database)
const jobs = new Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  imageUrls?: string[]
  error?: string
}>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, petPhotoUrl, style, background, accessory, planId, isFreeTrail, email } = body

    if (!userId || !petPhotoUrl || !style) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle FREE TRIAL generation
    if (isFreeTrail === true || planId === 'free-trial') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email required for free trial' },
          { status: 400 }
        )
      }

      // Check if email or IP already used free trial
      const { data: existingTrials, error: checkError } = await supabase
        .from('user_trials')
        .select('*')
        .or(`email.eq.${email},ip_address.eq.${ip}`)
        .limit(1)

      if (checkError) {
        console.error('Error checking free trial:', checkError)
      }

      if (existingTrials && existingTrials.length > 0) {
        return NextResponse.json(
          { 
            error: 'Free trial already used from this email or device. Please choose a paid plan.',
            hasUsedFreeTrial: true 
          },
          { status: 403 }
        )
      }

      // Generate unique job ID
      const jobId = `free_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Build prompt
      const prompt = buildPrompt(style, background, accessory, petPhotoUrl)

      // Initialize job status
      jobs.set(jobId, { status: 'pending' })

      // Simulate generation (or use real API)
      if (!blackforestApiKey || blackforestApiKey === 'your_api_key_here') {
        console.log('⚠️ FREE TRIAL - SIMULATION MODE')
        
        setTimeout(() => {
          jobs.set(jobId, {
            status: 'completed',
            imageUrls: [petPhotoUrl]
          })
        }, 5000)

        // Record free trial usage
        await supabase.from('user_trials').insert({
          email: email,
          ip_address: ip,
          user_id: userId.startsWith('test_') ? null : userId,
          email_verified: true, // Set to true for now, should be false until email verified
          job_id: jobId,
          style: style,
          background: background,
          accessory: accessory,
          used_at: new Date().toISOString()
        })

        // Track event
        await supabase.from('user_events').insert({
          event_type: 'free_trial_generation_started',
          user_id: userId.startsWith('test_') ? null : userId,
          email: email,
          ip_address: ip,
          metadata: { jobId, style, background, accessory }
        })

        return NextResponse.json({
          success: true,
          jobId,
          message: '⚠️ FREE TRIAL - SIMULATION MODE: Generation queued',
          estimatedTime: 5,
          isFreeTrail: true
        })
      }

      // Real API call would go here...
      // For now, return simulation response
      return NextResponse.json({
        success: true,
        jobId,
        message: 'Free trial generation started',
        estimatedTime: 120,
        isFreeTrail: true
      })
    }

    // PAID SUBSCRIPTION generation
    // Check user's subscription and credits
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 403 }
      )
    }

    if (subscription.images_remaining <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Build prompt based on selections
    const prompt = buildPrompt(style, background, accessory, petPhotoUrl)
    
    // Generate unique job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Initialize job status
    jobs.set(jobId, { status: 'pending' })

    // For testing without API key, simulate generation
    if (!blackforestApiKey || blackforestApiKey === 'your_api_key_here') {
      console.log('⚠️ No valid API key found - running in SIMULATION mode')
      
      // Simulate async generation
      setTimeout(() => {
        // Use the uploaded image as the "generated" result for testing
        jobs.set(jobId, {
          status: 'completed',
          imageUrls: [petPhotoUrl] // In testing, just return the uploaded image
        })
      }, 5000) // Complete after 5 seconds

      return NextResponse.json({
        success: true,
        jobId,
        message: '⚠️ SIMULATION MODE: Image generation queued (no API key configured)',
        estimatedTime: 5
      })
    }

    // Real API call to Black Forest Labs
    try {
      const response = await fetch('https://api.bfl.ml/v1/flux-pro-1.1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Key': blackforestApiKey
        },
        body: JSON.stringify({
          prompt,
          width: 1024,
          height: 1024,
          prompt_upsampling: false,
          safety_tolerance: 2,
          image_prompt: petPhotoUrl,
          image_prompt_weight: 0.2
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'API request failed')
      }

      // Update job with API job ID
      jobs.set(jobId, { 
        status: 'processing'
      })

      // Decrement user's credits
      await supabase
        .from('subscriptions')
        .update({ images_remaining: subscription.images_remaining - 1 })
        .eq('id', subscription.id)

      return NextResponse.json({
        success: true,
        jobId,
        apiJobId: result.id,
        estimatedTime: 120
      })

    } catch (apiError) {
      console.error('Black Forest API error:', apiError)
      jobs.set(jobId, { 
        status: 'failed',
        error: apiError instanceof Error ? apiError.message : 'API request failed'
      })
      
      return NextResponse.json(
        { error: 'Failed to start generation: ' + (apiError instanceof Error ? apiError.message : 'Unknown error') },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check job status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json(
      { error: 'jobId is required' },
      { status: 400 }
    )
  }

  const job = jobs.get(jobId)

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    jobId,
    status: job.status,
    imageUrls: job.imageUrls,
    error: job.error
  })
}

function buildPrompt(style: string, background: string, accessory: string, petPhotoUrl: string): string {
  const styleDescriptions: Record<string, string> = {
    'professional-portrait': 'professional studio portrait photography with perfect lighting',
    'watercolor-art': 'beautiful watercolor painting with soft brush strokes',
    'vintage-film': 'vintage film photography with nostalgic grain',
    'disney-pixar': 'Disney Pixar 3D animation style, vibrant and charming',
    'cyberpunk': 'cyberpunk futuristic neon style with dramatic lighting',
    'renaissance': 'classical Renaissance oil painting, masterful technique',
    'minimalist': 'clean minimalist modern design, simple and elegant',
    'oil-painting': 'rich oil painting with textured brush strokes'
  }

  const backgroundDescriptions: Record<string, string> = {
    'studio-white': 'clean white studio background',
    'nature-garden': 'lush garden with flowers and greenery',
    'beach-sunset': 'beautiful beach at golden hour sunset',
    'urban-city': 'modern urban cityscape',
    'cozy-home': 'cozy home interior with warm lighting',
    'mountain-landscape': 'majestic mountain landscape',
    'fantasy-magical': 'magical fantasy world with sparkles',
    'autumn-forest': 'colorful autumn forest'
  }

  const accessoryDescriptions: Record<string, string> = {
    'none': '',
    'bow-tie': 'wearing an elegant bow tie',
    'crown': 'wearing a royal crown',
    'bandana': 'wearing a colorful bandana',
    'flower-crown': 'wearing a beautiful flower crown',
    'sunglasses': 'wearing stylish sunglasses',
    'hat': 'wearing a fashionable hat',
    'scarf': 'wearing a cozy scarf'
  }

  const parts = [
    'A portrait of this pet',
    styleDescriptions[style] || style,
    backgroundDescriptions[background] || background,
    accessoryDescriptions[accessory] || ''
  ].filter(Boolean)

  return parts.join(', ') + ', high quality, detailed, professional'
}
