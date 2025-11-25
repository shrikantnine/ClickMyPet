// Solid color placeholder utility for images
export const solidColorPlaceholders = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Light Yellow
  '#BB8FCE', // Purple
  '#85C1E9', // Light Blue
  '#F8C471', // Orange
  '#82E0AA', // Light Green
  '#F1948A', // Pink
  '#85C1E9', // Sky Blue
  '#D5A6BD', // Rose
]

// Generate a solid color data URL for placeholder images
export function generateSolidColorPlaceholder(
  width: number, 
  height: number, 
  colorIndex: number = 0,
  text?: string
): string {
  const color = solidColorPlaceholders[colorIndex % solidColorPlaceholders.length]
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Fill background
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
  
  // Add text if provided
  if (text) {
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `${Math.min(width, height) / 8}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2)
  }
  
  return canvas.toDataURL('image/png')
}

// Server-side safe version using CSS background
export function generateSolidColorCSS(
  colorIndex: number = 0,
  text?: string
): { backgroundColor: string; color: string; content?: string } {
  const color = solidColorPlaceholders[colorIndex % solidColorPlaceholders.length]
  return {
    backgroundColor: color,
    color: '#FFFFFF',
    content: text
  }
}

// Generate placeholder data for different components
export const galleryPlaceholders = Array.from({ length: 24 }, (_, i) => ({
  id: `gallery-${i + 1}`,
  colorIndex: i % solidColorPlaceholders.length,
  color: solidColorPlaceholders[i % solidColorPlaceholders.length],
  alt: `Gallery image ${i + 1}`
}))

export const heroPlaceholders = Array.from({ length: 10 }, (_, i) => ({
  id: `hero-${i + 1}`,
  colorIndex: i % solidColorPlaceholders.length,
  color: solidColorPlaceholders[i % solidColorPlaceholders.length],
  alt: `Hero image ${i + 1}`
}))

export const stepPlaceholders = [
  { id: 'step1', colorIndex: 0, color: solidColorPlaceholders[0], alt: 'Upload your pet photo' },
  { id: 'step2', colorIndex: 3, color: solidColorPlaceholders[3], alt: 'AI processes your image' },
  { id: 'step3', colorIndex: 6, color: solidColorPlaceholders[6], alt: 'Choose your style' },
  { id: 'step4', colorIndex: 9, color: solidColorPlaceholders[9], alt: 'Download your results' }
]

export const showcasePlaceholders = Array.from({ length: 6 }, (_, i) => ({
  id: `showcase-${i + 1}`,
  colorIndex: (i + 2) % solidColorPlaceholders.length,
  color: solidColorPlaceholders[(i + 2) % solidColorPlaceholders.length],
  alt: `Showcase image ${i + 1}`
}))

export const blogPlaceholders = Array.from({ length: 8 }, (_, i) => ({
  id: `blog-${i + 1}`,
  colorIndex: (i + 5) % solidColorPlaceholders.length,
  color: solidColorPlaceholders[(i + 5) % solidColorPlaceholders.length],
  alt: `Blog image ${i + 1}`
}))

export const styleShowcasePlaceholders = Array.from({ length: 10 }, (_, i) => ({
  id: `trusted-${i + 1}`,
  colorIndex: (i + 1) % solidColorPlaceholders.length,
  color: solidColorPlaceholders[(i + 1) % solidColorPlaceholders.length],
  heading: [
    'Vintage Portraits',
    'Royalty', 
    'Dressed to Impress',
    'Natural Outdoor',
    'Corporate',
    'Halloween',
    'Pet & Me',
    'Artistic',
    'Animated',
    'Christmas'
  ][i] || `Use Case ${i + 1}`
}))