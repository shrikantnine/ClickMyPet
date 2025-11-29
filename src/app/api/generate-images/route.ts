import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { 
  buildPrompt, 
  buildNegativePrompt, 
  validateSelections,
  generatePromptVariations,
  type UserSelections 
} from '@/lib/ai-prompt-builder'
import { 
  generateImages,
  waitForCompletion,
  getOptimalParameters,
  estimateGenerationTime,
  getPlanModelConfig,
  type FluxGenerationRequest 
} from '@/lib/blackforest-api'
import { trackImageGeneration } from '@/lib/analytics'

export const maxDuration = 300 // 5 minutes for long-running generation

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { selections, numImages, petPhotos } = body as {
      selections: UserSelections
      numImages?: number
      petPhotos?: string[]
    }

    const sanitizedPetPhotos = Array.isArray(petPhotos)
      ? petPhotos.filter(photo => typeof photo === 'string' && photo.trim().length > 0).slice(0, 5)
      : []

    if (sanitizedPetPhotos.length === 0) {
      return NextResponse.json(
        { error: 'Please upload at least one reference photo of your pet.' },
        { status: 400 }
      )
    }

    // Validate selections
    const validation = validateSelections(selections)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid selections', details: validation.errors },
        { status: 400 }
      )
    }

    // Get user's active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*, payments(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found. Please subscribe to generate images.' },
        { status: 403 }
      )
    }

    // Check if user has remaining images in their plan
    if (subscription.images_remaining <= 0) {
      return NextResponse.json(
        { error: 'You have used all images in your plan. Please upgrade or purchase more.' },
        { status: 403 }
      )
    }

    // Determine number of images to generate
    const requestedImages = numImages || 1
    const imagesToGenerate = Math.min(
      requestedImages,
      subscription.images_remaining,
      subscription.plan_id === 'starter' ? 5 : subscription.plan_id === 'pro' ? 10 : 20
    )

    // Build prompts
    const promptVariations = generatePromptVariations(selections, imagesToGenerate, {
      planId: subscription.plan_id,
    })

    // Get optimal parameters based on plan
    const optimalParams = getOptimalParameters(subscription.plan_id)
    const planModelConfig = getPlanModelConfig(subscription.plan_id)

    // Estimate generation time
    const estimatedTime = estimateGenerationTime(
      imagesToGenerate,
      optimalParams.num_inference_steps
    )

    const referenceWindowSize = Math.max(1, Math.min(planModelConfig.maxImagesPerJob, sanitizedPetPhotos.length))
    const pickReferenceImages = (index: number) => {
      const refs: string[] = []
      for (let i = 0; i < referenceWindowSize; i++) {
        const photoIndex = (index * referenceWindowSize + i) % sanitizedPetPhotos.length
        refs.push(sanitizedPetPhotos[photoIndex])
      }
      return refs
    }

    // Start generation jobs
    const generationJobs = []
    
    for (const [idx, variation] of promptVariations.entries()) {
      const referenceImages = pickReferenceImages(idx)
      const generationRequest: FluxGenerationRequest = {
        ...optimalParams,
        prompt: variation.prompt,
        negative_prompt: variation.negativePrompt,
        seed: variation.seed,
        num_images: 1,
        reference_images: referenceImages.map(url => ({ url })),
      }

      try {
        const job = await generateImages(generationRequest)
        generationJobs.push({
          jobId: job.id,
          prompt: variation.prompt,
          status: 'pending',
          referenceImages,
        })
      } catch (error) {
        console.error('Failed to start generation job:', error)
      }
    }

    if (generationJobs.length === 0) {
      return NextResponse.json(
        { error: 'Failed to start image generation. Please try again.' },
        { status: 500 }
      )
    }

    // Create generation record in database
    const { data: generationRecord, error: recordError } = await supabase
      .from('generated_images')
      .insert({
        user_id: user.id,
        subscription_id: subscription.id,
        pet_type: selections.petType,
        pet_breed: selections.petBreed,
        style: selections.style,
        background: selections.background,
        accessories: selections.accessories || [],
        prompt: promptVariations[0].prompt,
        negative_prompt: promptVariations[0].negativePrompt,
        status: 'processing',
        generation_params: {
          ...optimalParams,
          pet_photos: sanitizedPetPhotos,
        },
        jobs_data: generationJobs,
      })
      .select()
      .single()

    if (recordError) {
      console.error('Failed to create generation record:', recordError)
      return NextResponse.json(
        { error: 'Failed to save generation request' },
        { status: 500 }
      )
    }

    // Track analytics
    try {
      await trackImageGeneration({
        userId: user.id,
        planId: subscription.plan_id,
        selections,
        numImages: imagesToGenerate,
        estimatedTime,
      })
    } catch (error) {
      // Non-critical, just log
      console.error('Analytics tracking failed:', error)
    }

    // Return job information (client will poll for completion)
    return NextResponse.json({
      success: true,
      generationId: generationRecord.id,
      jobIds: generationJobs.map(j => j.jobId),
      estimatedTime,
      message: `Generating ${imagesToGenerate} images. This will take approximately ${Math.ceil(estimatedTime / 60)} minutes.`,
    })

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Check status of ongoing generation
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const generationId = searchParams.get('id')

    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get generation record
    const { data: generation, error: genError } = await supabase
      .from('generated_images')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    // If already completed, return results
    if (generation.status === 'completed') {
      return NextResponse.json({
        status: 'completed',
        images: generation.image_urls,
        generationId: generation.id,
      })
    }

    // If failed, return error
    if (generation.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: generation.error_message,
      })
    }

    // Check status of each job
    const jobsData = generation.jobs_data as any[]
    const completedImages: string[] = []
    let allCompleted = true
    let anyFailed = false

    for (const job of jobsData) {
      try {
        const status = await waitForCompletion(job.jobId, 1) // Single check, don't wait
        
        if (status.status === 'completed' && status.result) {
          completedImages.push(status.result[0].sample)
        } else if (status.status === 'failed') {
          anyFailed = true
        } else {
          allCompleted = false
        }
      } catch (error) {
        console.error('Error checking job status:', error)
        allCompleted = false
      }
    }

    // Update database if status changed
    if (allCompleted || anyFailed) {
      const updateData: any = {
        status: anyFailed ? 'failed' : 'completed',
        completed_at: new Date().toISOString(),
      }

      if (allCompleted && completedImages.length > 0) {
        updateData.image_urls = completedImages
        
        // Decrement user's remaining images
        await supabase.rpc('decrement_image_count', {
          p_subscription_id: generation.subscription_id,
          p_count: completedImages.length,
        })
      }

      if (anyFailed) {
        updateData.error_message = 'One or more generation jobs failed'
      }

      await supabase
        .from('generated_images')
        .update(updateData)
        .eq('id', generationId)
    }

    return NextResponse.json({
      status: allCompleted ? 'completed' : anyFailed ? 'failed' : 'processing',
      images: completedImages,
      progress: Math.round((completedImages.length / jobsData.length) * 100),
      generationId: generation.id,
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check generation status' },
      { status: 500 }
    )
  }
}
