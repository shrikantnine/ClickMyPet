import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const files = formData
      .getAll('files')
      .filter((file): file is File => file instanceof File)
    const singleFile = formData.get('file')

    // Backwards compatibility: support legacy `file` field if `files` not provided
    if (!files.length && singleFile instanceof File) {
      files.push(singleFile)
    }

    if (!userId || !files.length) {
      return NextResponse.json(
        { error: 'At least one file and userId are required' },
        { status: 400 }
      )
    }

    const limitedFiles = files.slice(0, 5)

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const uploads = []

    for (const file of limitedFiles) {
      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      // Generate unique filename with per-user folder and timestamp
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error } = await supabase.storage
        .from('pet-photos')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
          { error: 'Failed to upload file: ' + error.message },
          { status: 500 }
        )
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(fileName)

      uploads.push({
        url: publicUrl,
        fileName,
        size: file.size,
        type: file.type,
      })
    }

    return NextResponse.json({
      success: true,
      uploads,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
