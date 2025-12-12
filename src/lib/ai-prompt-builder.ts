// AI Prompt Builder for Black Forest Labs Flux API
// Generates optimized prompts based on user selections

export interface UserSelections {
  petType: 'dog' | 'cat' | 'other'
  petBreed?: string
  petName?: string
  style: string
  background: string
  accessories?: string[]
  customNotes?: string
  // Custom inputs for Max (Ultra) users
  customInputs?: {
    style?: string  // Custom style description (max 64 chars)
    background?: string  // Custom background description (max 64 chars)
    accessory?: string  // Custom accessory description (max 64 chars)
  }
}

export interface StyleDefinition {
  id: string
  name: string
  promptModifiers: string[]
  negativePrompt: string[]
  artisticStyle: string
}

export interface BackgroundDefinition {
  id: string
  name: string
  description: string
  environment: string
}

type DiversityPlan = 'pro' | 'ultra' | 'max'

interface DiversityPreset {
  frequency: number // Inject diversity every Nth prompt
  stylePool: string[]
  backgroundPool: string[]
  accessoryPool: string[]
}

// Comprehensive style definitions for different artistic approaches
export const STYLE_DEFINITIONS: Record<string, StyleDefinition> = {
  'professional-portrait': {
    id: 'professional-portrait',
    name: 'Professional Portrait',
    promptModifiers: [
      'professional studio portrait',
      'high-end photography',
      'soft professional lighting',
      'shallow depth of field',
      'sharp focus on eyes',
      'bokeh background',
    ],
    negativePrompt: ['cartoon', 'illustration', 'painting', 'low quality', 'blurry'],
    artisticStyle: 'photorealistic',
  },
  'watercolor-art': {
    id: 'watercolor-art',
    name: 'Watercolor Art',
    promptModifiers: [
      'beautiful watercolor painting',
      'soft watercolor brushstrokes',
      'delicate colors',
      'artistic interpretation',
      'dreamy atmosphere',
      'hand-painted quality',
    ],
    negativePrompt: ['photograph', 'realistic', 'digital art', 'harsh edges'],
    artisticStyle: 'watercolor painting',
  },
  'vintage-film': {
    id: 'vintage-film',
    name: 'Vintage Film',
    promptModifiers: [
      'vintage film photography',
      'analog film aesthetic',
      'film grain texture',
      'warm nostalgic tones',
      'classic camera look',
      'timeless quality',
    ],
    negativePrompt: ['modern', 'digital', 'sharp', 'high contrast'],
    artisticStyle: 'vintage photograph',
  },
  'disney-pixar': {
    id: 'disney-pixar',
    name: 'Disney Pixar',
    promptModifiers: [
      'Disney Pixar style',
      '3D animated character',
      'expressive big eyes',
      'smooth cartoon rendering',
      'vibrant colors',
      'lovable character design',
    ],
    negativePrompt: ['realistic', 'photograph', 'dark', 'scary'],
    artisticStyle: '3D animated character',
  },
  'oil-painting': {
    id: 'oil-painting',
    name: 'Oil Painting',
    promptModifiers: [
      'classical oil painting',
      'rich oil paint texture',
      'masterful brushwork',
      'museum quality',
      'artistic composition',
      'traditional art style',
    ],
    negativePrompt: ['photograph', 'digital', 'cartoon', 'flat colors'],
    artisticStyle: 'oil painting',
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    promptModifiers: [
      'cyberpunk style',
      'neon lights',
      'futuristic aesthetic',
      'high-tech atmosphere',
      'vibrant neon colors',
      'sci-fi environment',
    ],
    negativePrompt: ['natural', 'traditional', 'rustic', 'vintage'],
    artisticStyle: 'cyberpunk art',
  },
  'renaissance': {
    id: 'renaissance',
    name: 'Renaissance',
    promptModifiers: [
      'Renaissance art style',
      'classical painting technique',
      'dramatic chiaroscuro lighting',
      'baroque composition',
      'old master quality',
      'historical art piece',
    ],
    negativePrompt: ['modern', 'digital', 'cartoon', 'bright colors'],
    artisticStyle: 'Renaissance painting',
  },
  'minimalist': {
    id: 'minimalist',
    name: 'Minimalist',
    promptModifiers: [
      'minimalist art style',
      'clean simple composition',
      'limited color palette',
      'essential elements only',
      'elegant simplicity',
      'modern minimal aesthetic',
    ],
    negativePrompt: ['detailed', 'complex', 'busy', 'cluttered'],
    artisticStyle: 'minimalist art',
  },
}

// Background environment definitions
export const BACKGROUND_DEFINITIONS: Record<string, BackgroundDefinition> = {
  'studio-white': {
    id: 'studio-white',
    name: 'Studio White',
    description: 'Clean white studio background',
    environment: 'clean white studio backdrop, professional photography setup, soft even lighting',
  },
  'nature-garden': {
    id: 'nature-garden',
    name: 'Garden',
    description: 'Beautiful garden setting',
    environment: 'lush garden setting, colorful flowers, green foliage, natural outdoor light',
  },
  'beach-sunset': {
    id: 'beach-sunset',
    name: 'Beach Sunset',
    description: 'Beach at golden hour',
    environment: 'beautiful beach at sunset, golden hour lighting, ocean waves, sandy shore',
  },
  'urban-city': {
    id: 'urban-city',
    name: 'Urban City',
    description: 'Modern city environment',
    environment: 'modern urban cityscape, contemporary architecture, city streets, urban atmosphere',
  },
  'cozy-home': {
    id: 'cozy-home',
    name: 'Cozy Home',
    description: 'Warm home interior',
    environment: 'cozy home interior, warm lighting, comfortable living space, inviting atmosphere',
  },
  'mountain-landscape': {
    id: 'mountain-landscape',
    name: 'Mountains',
    description: 'Majestic mountain scenery',
    environment: 'majestic mountain landscape, alpine scenery, dramatic peaks, natural wilderness',
  },
  'fantasy-magical': {
    id: 'fantasy-magical',
    name: 'Magical Fantasy',
    description: 'Enchanted fantasy world',
    environment: 'magical fantasy environment, enchanted forest, mystical atmosphere, dreamy lighting',
  },
  'autumn-forest': {
    id: 'autumn-forest',
    name: 'Autumn Forest',
    description: 'Fall foliage setting',
    environment: 'autumn forest, golden fall colors, fallen leaves, warm seasonal atmosphere',
  },
}

// Accessory definitions and how they integrate into prompts
export const ACCESSORY_DEFINITIONS: Record<string, string> = {
  'bow-tie': 'wearing an elegant bow tie',
  'crown': 'wearing a decorative crown',
  'bandana': 'wearing a colorful bandana',
  'flower-crown': 'wearing a beautiful flower crown',
  'sunglasses': 'wearing stylish sunglasses',
  'hat': 'wearing a fashionable hat',
  'scarf': 'wearing a cozy scarf',
  'collar': 'wearing a decorative collar',
}

// Inject extra creative directions for higher-tier plans to ensure users get
// noticeably different looks without having to tweak every knob manually.
const DIVERSITY_PRESETS: Record<DiversityPlan, DiversityPreset> = {
  pro: {
    frequency: 3,
    stylePool: ['professional-portrait', 'watercolor-art', 'vintage-film', 'oil-painting'],
    backgroundPool: ['nature-garden', 'mountain-landscape', 'urban-city', 'autumn-forest'],
    accessoryPool: ['bow-tie', 'flower-crown', 'sunglasses'],
  },
  ultra: {
    frequency: 2,
    stylePool: ['professional-portrait', 'watercolor-art', 'cyberpunk', 'renaissance', 'minimalist', 'disney-pixar'],
    backgroundPool: ['fantasy-magical', 'beach-sunset', 'mountain-landscape', 'cozy-home'],
    accessoryPool: ['crown', 'bandana', 'hat', 'scarf'],
  },
  max: {
    frequency: 2,
    stylePool: ['professional-portrait', 'watercolor-art', 'cyberpunk', 'renaissance', 'minimalist', 'disney-pixar'],
    backgroundPool: ['fantasy-magical', 'beach-sunset', 'mountain-landscape', 'cozy-home'],
    accessoryPool: ['crown', 'bandana', 'hat', 'scarf'],
  },
}

// Pet breed specific characteristics for better accuracy
export const BREED_CHARACTERISTICS: Record<string, string> = {
  // Dogs
  'golden-retriever': 'Golden Retriever dog with fluffy golden coat and friendly expression',
  'labrador': 'Labrador Retriever with athletic build and kind eyes',
  'german-shepherd': 'German Shepherd with alert expression and noble appearance',
  'bulldog': 'Bulldog with distinctive wrinkled face and muscular build',
  'poodle': 'Poodle with curly coat and elegant posture',
  'husky': 'Siberian Husky with striking blue eyes and wolf-like features',
  'beagle': 'Beagle with floppy ears and curious expression',
  'corgi': 'Corgi with short legs and fox-like face',
  
  // Cats
  'persian': 'Persian cat with long luxurious fur and flat face',
  'siamese': 'Siamese cat with sleek body and striking blue eyes',
  'maine-coon': 'Maine Coon cat with large size and tufted ears',
  'british-shorthair': 'British Shorthair cat with round face and dense coat',
  'bengal': 'Bengal cat with leopard-like spots and athletic build',
  'ragdoll': 'Ragdoll cat with blue eyes and semi-long coat',
  'sphynx': 'Sphynx cat with hairless body and large ears',
}

/**
 * Build a comprehensive prompt for Black Forest Labs Flux API
 * @param selections User's style, background, and accessory selections
 * @returns Optimized prompt string for AI image generation
 */
export function buildPrompt(selections: UserSelections): string {
  const style = STYLE_DEFINITIONS[selections.style] || STYLE_DEFINITIONS['professional-portrait']
  const background = BACKGROUND_DEFINITIONS[selections.background] || BACKGROUND_DEFINITIONS['studio-white']
  
  // Check for custom inputs (Max/Ultra users)
  const hasCustomStyle = selections.style === 'custom-style' && selections.customInputs?.style
  const hasCustomBackground = selections.background === 'custom-background' && selections.customInputs?.background
  const hasCustomAccessory = selections.accessories?.includes('custom-accessory') && selections.customInputs?.accessory
  
  // Build pet description
  let petDescription = ''
  
  if (selections.petBreed && BREED_CHARACTERISTICS[selections.petBreed]) {
    petDescription = BREED_CHARACTERISTICS[selections.petBreed]
  } else {
    petDescription = `beautiful ${selections.petType}`
  }
  
  // Add pet name if provided
  if (selections.petName) {
    petDescription = `${petDescription} named ${selections.petName}`
  }
  
  // Build accessories string (including custom accessory for Max users)
  let accessoriesText = ''
  if (selections.accessories && selections.accessories.length > 0) {
    const accessoryDescriptions = selections.accessories
      .filter(acc => acc !== 'custom-accessory') // Handle custom separately
      .map(acc => ACCESSORY_DEFINITIONS[acc])
      .filter(Boolean)
    
    // Add custom accessory description if provided (Max exclusive)
    if (hasCustomAccessory) {
      accessoryDescriptions.push(selections.customInputs!.accessory!.slice(0, 64))
    }
    
    if (accessoryDescriptions.length > 0) {
      accessoriesText = accessoryDescriptions.join(', ')
    }
  }
  
  // Determine style to use (custom or predefined)
  const styleArtistic = hasCustomStyle 
    ? selections.customInputs!.style!.slice(0, 64) + ' style'
    : style.artisticStyle
  
  // Determine background/environment to use (custom or predefined)
  const environmentText = hasCustomBackground
    ? selections.customInputs!.background!.slice(0, 64)
    : background.environment
  
  // Construct the main prompt with proper structure
  const promptParts = [
    styleArtistic,
    'of a',
    petDescription,
  ]
  
  if (accessoriesText) {
    promptParts.push(accessoriesText)
  }
  
  promptParts.push(
    'in',
    environmentText
  )
  
  // Add style modifiers (skip for custom styles)
  if (!hasCustomStyle) {
    promptParts.push(...style.promptModifiers)
  }
  
  // Add quality enhancers
  promptParts.push(
    'highly detailed',
    'masterpiece',
    'best quality',
    '8k resolution'
  )
  
  // Add custom notes if provided
  if (selections.customNotes) {
    promptParts.push(selections.customNotes)
  }
  
  const finalPrompt = promptParts.join(', ')
  
  return finalPrompt
}

/**
 * Build negative prompt to exclude unwanted elements
 * @param selections User's style selections
 * @returns Negative prompt string
 */
export function buildNegativePrompt(selections: UserSelections): string {
  const style = STYLE_DEFINITIONS[selections.style] || STYLE_DEFINITIONS['professional-portrait']
  
  const negativeElements = [
    ...style.negativePrompt,
    'deformed',
    'disfigured',
    'bad anatomy',
    'bad proportions',
    'extra limbs',
    'cloned face',
    'malformed limbs',
    'missing arms',
    'missing legs',
    'extra arms',
    'extra legs',
    'fused fingers',
    'too many fingers',
    'unclear eyes',
    'ugly',
    'duplicate',
    'morbid',
    'mutilated',
    'mutation',
    'poorly drawn',
    'bad quality',
    'worst quality',
    'low quality',
    'normal quality',
    'lowres',
    'watermark',
    'signature',
    'text',
    'error',
  ]
  
  return negativeElements.join(', ')
}

/**
 * Generate multiple prompt variations for batch generation
 * @param selections Base user selections
 * @param count Number of variations to generate
 * @returns Array of prompt objects
 */
export interface PromptVariationOptions {
  planId?: string
}

export function generatePromptVariations(
  selections: UserSelections,
  count: number,
  options: PromptVariationOptions = {}
): Array<{ prompt: string; negativePrompt: string; seed?: number }> {
  const variations = []
  
  // Quality descriptors for variation
  const qualityVariations = [
    'professional photography',
    'award winning photography',
    'stunning composition',
    'cinematic lighting',
    'perfect composition',
  ]
  
  // Mood variations
  const moodVariations = [
    'happy and playful expression',
    'calm and peaceful demeanor',
    'alert and attentive pose',
    'majestic and noble presence',
    'adorable and charming look',
  ]
  
  for (let i = 0; i < count; i++) {
    const diversifiedSelections = applyAutomaticDiversity(selections, options.planId, i)
    const basePrompt = buildPrompt(diversifiedSelections)
    const negativePrompt = buildNegativePrompt(diversifiedSelections)
    
    // Add variation elements
    const qualityMod = qualityVariations[i % qualityVariations.length]
    const moodMod = moodVariations[i % moodVariations.length]
    
    const variedPrompt = `${basePrompt}, ${qualityMod}, ${moodMod}`
    
    variations.push({
      prompt: variedPrompt,
      negativePrompt,
      seed: Math.floor(Math.random() * 1000000), // Random seed for variation
    })
  }
  
  return variations
}

function applyAutomaticDiversity(
  selections: UserSelections,
  planId: string | undefined,
  iteration: number
): UserSelections {
  const preset = getDiversityPreset(planId)
  if (!preset || preset.frequency <= 0) {
    return selections
  }

  const shouldInject = ((iteration + 1) % preset.frequency) === 0
  if (!shouldInject) {
    return selections
  }

  const variant: UserSelections = {
    ...selections,
    accessories: selections.accessories ? [...selections.accessories] : [],
  }

  const styleCandidate = pickFromPool(preset.stylePool, iteration)
  if (styleCandidate && STYLE_DEFINITIONS[styleCandidate]) {
    variant.style = styleCandidate
  }

  const backgroundCandidate = pickFromPool(preset.backgroundPool, iteration + 1)
  if (backgroundCandidate && BACKGROUND_DEFINITIONS[backgroundCandidate]) {
    variant.background = backgroundCandidate
  }

  const accessoryCandidate = pickFromPool(preset.accessoryPool, iteration + 2)
  if (accessoryCandidate && ACCESSORY_DEFINITIONS[accessoryCandidate]) {
    const accessoriesSet = new Set(variant.accessories || [])
    accessoriesSet.add(accessoryCandidate)
    variant.accessories = Array.from(accessoriesSet)
  }

  return variant
}

function getDiversityPreset(planId?: string): DiversityPreset | null {
  if (!planId) return null
  if (planId === 'pro' || planId === 'ultra' || planId === 'max') {
    return DIVERSITY_PRESETS[planId]
  }
  return null
}

function pickFromPool(pool: string[], index: number): string | null {
  if (!pool.length) return null
  const normalizedIndex = Math.abs(index) % pool.length
  return pool[normalizedIndex]
}

/**
 * Validate user selections before prompt generation
 * @param selections User selections object
 * @returns Validation result with errors if any
 */
export function validateSelections(selections: UserSelections): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!selections.petType) {
    errors.push('Pet type is required')
  }
  
  if (!selections.style) {
    errors.push('Style selection is required')
  }
  
  if (!selections.background) {
    errors.push('Background selection is required')
  }
  
  if (selections.style && !STYLE_DEFINITIONS[selections.style]) {
    errors.push('Invalid style selection')
  }
  
  if (selections.background && !BACKGROUND_DEFINITIONS[selections.background]) {
    errors.push('Invalid background selection')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
