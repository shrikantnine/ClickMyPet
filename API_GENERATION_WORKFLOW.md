# Black Forest Labs API Generation Workflow

## Overview
This guide explains how to handle 80 simultaneous AI portrait generations using the Black Forest Labs API, with proper error handling, progress tracking, and result display.

---

## Current Implementation Status

### ✅ What's Already Working
- Single API call to Black Forest Labs
- Image upload to Supabase storage
- Basic error handling
- Result display on dashboard

### ❌ What Needs Implementation
- Batch processing of 80 generation requests
- Real-time progress tracking
- Polling for generation completion
- Error recovery and retry logic
- Handling rate limits

---

## API Architecture

### Black Forest Labs API Details

**Endpoint:** `https://api.blackforestlabs.ai/v1/generations`

**Model:** `FLUX.1-schnell` (fastest model for real-time generation)

**Request Format:**
```typescript
POST https://api.blackforestlabs.ai/v1/generations
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "model": "FLUX.1-schnell",
  "prompt": "A professional portrait of a golden retriever in disney pixar style with studio background",
  "width": 1024,
  "height": 1024,
  "num_images": 1,
  "safety_tolerance": 2
}
```

**Response Format:**
```json
{
  "id": "gen_abc123",
  "status": "pending",
  "result": null
}
```

**Polling for Results:**
```typescript
GET https://api.blackforestlabs.ai/v1/generations/{id}

Response when complete:
{
  "id": "gen_abc123",
  "status": "completed",
  "result": {
    "images": [
      {
        "url": "https://cdn.blackforestlabs.ai/...",
        "width": 1024,
        "height": 1024
      }
    ]
  }
}
```

---

## Implementation Strategy

### Step 1: Generate 80 Unique Prompts

```typescript
// lib/prompt-generator.ts

interface GenerationRequest {
  style: string
  background: string
  accessory?: string
  petType: string
  petBreed?: string
}

export function generatePrompts(config: GenerationRequest): string[] {
  const prompts: string[] = []
  
  // Create variations for each style/background/accessory combination
  // This should generate exactly 80 unique prompts
  
  const basePrompt = `A professional portrait of a ${config.petType}`
  const styleModifier = getStylePrompt(config.style)
  const backgroundModifier = getBackgroundPrompt(config.background)
  const accessoryModifier = config.accessory ? getAccessoryPrompt(config.accessory) : ''
  
  // Generate variations
  for (let i = 0; i < 80; i++) {
    const variation = getVariation(i) // Different angles, expressions, etc.
    prompts.push(
      `${basePrompt} ${variation} in ${styleModifier} with ${backgroundModifier} ${accessoryModifier}`.trim()
    )
  }
  
  return prompts
}

function getVariation(index: number): string {
  const variations = [
    'looking at camera',
    'profile view',
    'three-quarter view',
    'sitting pose',
    'standing pose',
    'playful expression',
    'serious expression',
    'happy expression',
    // ... add more variations
  ]
  
  return variations[index % variations.length]
}
```

### Step 2: Batch API Requests with Rate Limiting

```typescript
// lib/batch-generator.ts

import pLimit from 'p-limit'

interface GenerationJob {
  id: string
  prompt: string
  status: 'pending' | 'generating' | 'completed' | 'error'
  result?: string
  error?: string
}

export class BatchGenerator {
  private apiKey: string
  private baseUrl = 'https://api.blackforestlabs.ai/v1'
  private limit = pLimit(10) // Max 10 concurrent requests
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  
  async generateBatch(
    prompts: string[],
    onProgress: (completed: number, total: number) => void
  ): Promise<GenerationJob[]> {
    const jobs: GenerationJob[] = prompts.map((prompt, i) => ({
      id: `job_${i}`,
      prompt,
      status: 'pending'
    }))
    
    // Start all requests with rate limiting
    const requests = jobs.map((job, index) =>
      this.limit(() => this.generateOne(job, index, prompts.length, onProgress))
    )
    
    const results = await Promise.allSettled(requests)
    
    // Update job statuses
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        jobs[index] = result.value
      } else {
        jobs[index].status = 'error'
        jobs[index].error = result.reason.message
      }
    })
    
    return jobs
  }
  
  private async generateOne(
    job: GenerationJob,
    index: number,
    total: number,
    onProgress: (completed: number, total: number) => void
  ): Promise<GenerationJob> {
    try {
      job.status = 'generating'
      
      // Step 1: Start generation
      const startResponse = await fetch(`${this.baseUrl}/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'FLUX.1-schnell',
          prompt: job.prompt,
          width: 1024,
          height: 1024,
          num_images: 1,
          safety_tolerance: 2,
        }),
      })
      
      if (!startResponse.ok) {
        throw new Error(`API error: ${startResponse.statusText}`)
      }
      
      const startData = await startResponse.json()
      const generationId = startData.id
      
      // Step 2: Poll for completion
      const imageUrl = await this.pollForCompletion(generationId)
      
      job.status = 'completed'
      job.result = imageUrl
      
      // Update progress
      onProgress(index + 1, total)
      
      return job
    } catch (error: any) {
      job.status = 'error'
      job.error = error.message
      onProgress(index + 1, total)
      return job
    }
  }
  
  private async pollForCompletion(generationId: string): Promise<string> {
    const maxAttempts = 60 // 60 attempts = 2 minutes max
    const pollInterval = 2000 // 2 seconds
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))
      
      const response = await fetch(`${this.baseUrl}/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })
      
      if (!response.ok) {
        throw new Error(`Poll error: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'completed') {
        return data.result.images[0].url
      }
      
      if (data.status === 'failed') {
        throw new Error('Generation failed')
      }
      
      // Status is still 'pending', continue polling
    }
    
    throw new Error('Generation timeout')
  }
}
```

### Step 3: API Route Handler

```typescript
// app/api/generate-batch/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { BatchGenerator } from '@/lib/batch-generator'
import { generatePrompts } from '@/lib/prompt-generator'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, style, background, accessory, petType, planId } = await request.json()
    
    // Validate plan limits
    const limits = {
      starter: 20,
      pro: 50,
      ultra: 80,
    }
    
    const numGenerations = limits[planId as keyof typeof limits] || 20
    
    // Generate prompts
    const prompts = generatePrompts({
      style,
      background,
      accessory,
      petType,
    }).slice(0, numGenerations)
    
    // Initialize batch generator
    const generator = new BatchGenerator(process.env.BLACKFOREST_API_KEY!)
    
    // Track progress via Server-Sent Events
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const jobs = await generator.generateBatch(prompts, (completed, total) => {
          // Send progress update
          const progress = Math.round((completed / total) * 100)
          const data = JSON.stringify({ completed, total, progress })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        })
        
        // Save completed jobs to database
        const successfulJobs = jobs.filter(j => j.status === 'completed')
        
        await supabase
          .from('generations')
          .insert({
            user_id: userId,
            plan_id: planId,
            style,
            background,
            accessory,
            image_urls: successfulJobs.map(j => j.result),
            total_generated: successfulJobs.length,
            created_at: new Date().toISOString(),
          })
        
        // Send completion
        const result = JSON.stringify({ 
          completed: true, 
          success: successfulJobs.length,
          failed: jobs.length - successfulJobs.length,
          imageUrls: successfulJobs.map(j => j.result)
        })
        controller.enqueue(encoder.encode(`data: ${result}\n\n`))
        controller.close()
      },
    })
    
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Batch generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### Step 4: Frontend Progress Tracking

```typescript
// components/GenerationProgress.tsx

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface GenerationProgressProps {
  userId: string
  style: string
  background: string
  accessory?: string
  petType: string
  planId: string
  onComplete: (imageUrls: string[]) => void
}

export default function GenerationProgress(props: GenerationProgressProps) {
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [total, setTotal] = useState(0)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    startGeneration()
  }, [])

  const startGeneration = async () => {
    try {
      const response = await fetch('/api/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))

            if (data.completed) {
              // Generation complete
              setIsGenerating(false)
              toast.success(`Generated ${data.success} portraits!`)
              props.onComplete(data.imageUrls)
            } else {
              // Progress update
              setCompleted(data.completed)
              setTotal(data.total)
              setProgress(data.progress)
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate portraits')
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Creating Your Portraits</h2>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{progress}%</p>
            <p className="text-gray-600 mt-2">
              {completed} of {total} portraits generated
            </p>
          </div>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/50 animate-pulse-glow"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 text-center">
            This may take a few minutes. Please don't close this page.
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## Database Schema Addition

Add to `database/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  style TEXT NOT NULL,
  background TEXT NOT NULL,
  accessory TEXT,
  image_urls TEXT[] NOT NULL,
  total_generated INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generations_user_id ON public.generations(user_id);
CREATE INDEX idx_generations_created_at ON public.generations(created_at DESC);
```

---

## Environment Variables Needed

Add to `.env.local`:
```bash
BLACKFOREST_API_KEY=your_api_key_here
```

---

## Error Handling

### Retry Logic
```typescript
async retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
  throw new Error('Max retries exceeded')
}
```

### Rate Limit Handling
```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After')
  await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter || '60') * 1000))
  return this.retryWithBackoff(() => this.makeRequest(url, options))
}
```

---

## Testing Strategy

1. **Test with small batches first** (5-10 images)
2. **Monitor API rate limits** and adjust concurrency
3. **Test error scenarios**: network failures, API errors, timeouts
4. **Verify database saves** all generated URLs correctly
5. **Test progress tracking** shows accurate percentages

---

## Cost Optimization

**Black Forest Labs Pricing:**
- FLUX.1-schnell: ~$0.003 per image
- 80 images = ~$0.24 per generation set

**Recommendations:**
- Cache successful generations
- Implement webhook for async processing (better than polling)
- Use FLUX.1-dev for higher quality if budget allows
- Consider batch discounts from Black Forest Labs

---

## Next Steps

1. Install dependencies: `npm install p-limit`
2. Add BLACKFOREST_API_KEY to environment
3. Create batch-generator.ts and prompt-generator.ts
4. Create /api/generate-batch route
5. Add GenerationProgress component
6. Test with small batch (10 images)
7. Scale up to full 80 images
8. Add database schema
9. Monitor and optimize

---

## Support Resources

- Black Forest Labs Docs: https://docs.blackforestlabs.ai
- Rate Limits: Check API docs for current limits
- Webhooks: Consider using webhooks instead of polling for production
