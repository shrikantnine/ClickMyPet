# AI Prompt Generation Logic

## Overview

This document explains the complete correlation between:
- **A)** User selections (styles, backgrounds, accessories + custom inputs)
- **B)** Pictures user uploads (reference images)
- **C)** BFL (Black Forest Labs) Kontext Pro API prompt generation

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [User Selection Flow](#2-user-selection-flow)
3. [Prompt Building Pipeline](#3-prompt-building-pipeline)
4. [BFL API Integration](#4-bfl-api-integration)
5. [Data Correlation Map](#5-data-correlation-map)
6. [Example Workflows](#6-example-workflows)
7. [Improvement Suggestions](#7-improvement-suggestions)

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Sign Up │───▶│  Styles  │───▶│Backgrounds│───▶│Accessories│     │
│  │  Step 1  │    │  Step 2  │    │  Step 3   │    │  Step 4   │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                                      │
│                         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    CHECKOUT & PAYMENT                         │   │
│  │  • Auto-detect package (Starter/Pro/Ultra)                   │   │
│  │  • Save preferences to sessionStorage                         │   │
│  │  • Process Razorpay payment                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    DASHBOARD (Upload Phase)                    │   │
│  │  • Upload 10-20 pet photos                                    │   │
│  │  • Photos stored in Supabase Storage                          │   │
│  │  • Reference images prepared for API                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    GENERATION (AI Phase)                       │   │
│  │  • buildPrompt() constructs text prompt                       │   │
│  │  • Reference images attached with weights                     │   │
│  │  • BFL Kontext Pro API called                                 │   │
│  │  • Results stored & displayed                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. User Selection Flow

### 2.1 Style Selection (Step 2)

**Location**: `src/app/onboarding/page.tsx`

**Available Styles**:

| ID | Name | Custom Allowed |
|----|------|----------------|
| `realistic` | Realistic Portrait | No |
| `superhero` | Superhero | No |
| `royal` | Royal Portrait | No |
| `cool` | Cool & Casual | No |
| `gangster` | Gangster | No |
| `professional` | Professional | No |
| `christmas` | Christmas | No |
| `action` | Action Shot | No |
| `animated` | Animated | No |
| `abstract-art` | Abstract Art | No |
| `monochrome` | Monochrome | No |
| `newspaper` | Newspaper | No |
| `at-work` | At Work | No |
| `sports` | Sports | No |
| `close-up` | Close-Up | No |
| `nature` | Nature | No |
| `dressed` | Dressed To Impress | No |
| `custom-style` | Custom | **Yes (Ultra only)** |

**Storage**: `selectedStyles: string[]` in component state

### 2.2 Background Selection (Step 3)

**Available Backgrounds**:

| ID | Name | Preview Color | Custom Allowed |
|----|------|---------------|----------------|
| `studio-dark` | Studio Dark | #1a1a1a | No |
| `studio-light` | Studio Light | #f5f5f5 | No |
| `nature` | Nature | #228B22 | No |
| `city` | City | #4a5568 | No |
| `beach` | Beach | #F0E68C | No |
| `street` | Street | #696969 | No |
| `luxury` | Luxury Interior | #D4AF37 | No |
| `abstract` | Abstract | #FF6B6B | No |
| `custom-background` | Custom | #9370DB | **Yes (Ultra only)** |

**Storage**: `selectedBackgrounds: string[]` in component state

### 2.3 Accessory Selection (Step 4)

**Available Accessories**:

| ID | Name | Emoji | Custom Allowed |
|----|------|-------|----------------|
| `glasses` | Glasses | 🕶️ | No |
| `hat` | Hat | 🎩 | No |
| `chain` | Gold Chain | ⛓️ | No |
| `bow` | Bow Tie | 🎀 | No |
| `crown` | Crown | 👑 | No |
| `jacket` | Jacket | 🧥 | No |
| `hoodie` | Hoodie | 👕 | No |
| `goggles` | Goggles | 🥽 | No |
| `shirt` | Shirt | 👔 | No |
| `custom-accessory` | Custom | ✨ | **Yes (Ultra only)** |

**Storage**: `selectedAccessories: string[]` in component state

### 2.4 Custom Inputs (Ultra Plan Only)

For Ultra/Max users, custom text inputs are available:

```typescript
customInputs: {
  style: string      // Max 64 characters
  background: string // Max 64 characters
  accessory: string  // Max 64 characters
}
```

---

## 3. Prompt Building Pipeline

### 3.1 Core File: `src/lib/ai-prompt-builder.ts`

### 3.2 Input Interface

```typescript
interface UserSelections {
  petType: 'dog' | 'cat' | 'other'
  petBreed?: string
  petName?: string
  style: string
  background: string
  accessories?: string[]
  customNotes?: string
  customInputs?: {
    style?: string      // Custom style description
    background?: string // Custom background description
    accessory?: string  // Custom accessory description
  }
}
```

### 3.3 Style Definitions

Each style maps to specific prompt modifiers:

```typescript
// Example: Professional Portrait
{
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
}
```

### 3.4 Background Definitions

Each background maps to environment descriptions:

```typescript
// Example: Beach Sunset
{
  id: 'beach-sunset',
  name: 'Beach Sunset',
  description: 'Beach at golden hour',
  environment: 'beautiful beach at sunset, golden hour lighting, ocean waves, sandy shore',
}
```

### 3.5 Accessory Definitions

Simple text mappings:

```typescript
const ACCESSORY_DEFINITIONS = {
  'bow-tie': 'wearing an elegant bow tie',
  'crown': 'wearing a decorative crown',
  'sunglasses': 'wearing stylish sunglasses',
  // ... etc
}
```

### 3.6 Build Prompt Function

**Function**: `buildPrompt(selections: UserSelections): string`

**Logic Flow**:

```
1. Lookup style definition (or use custom)
2. Lookup background definition (or use custom)
3. Build pet description (breed + name if provided)
4. Compile accessories list (including custom)
5. Construct prompt parts array
6. Add quality enhancers
7. Join with commas
```

**Output Example**:

```
photorealistic of a Golden Retriever dog with fluffy golden coat named Max,
wearing an elegant bow tie, in clean white studio backdrop, professional 
photography setup, soft even lighting, professional studio portrait, 
high-end photography, soft professional lighting, shallow depth of field, 
sharp focus on eyes, bokeh background, highly detailed, masterpiece, 
best quality, 8k resolution
```

---

## 4. BFL API Integration

### 4.1 Core File: `src/lib/blackforest-api.ts`

### 4.2 Plan-Based Configuration

| Plan | Model | Resolution | Steps | Character Lock |
|------|-------|------------|-------|----------------|
| Starter | `flux-pro-1.1` | 1024×1024 | 32 | No |
| Pro | `flux-pro-1.1-cp` | 1536×1536 | 45 | **Yes** |
| Ultra | `flux-ultra-1.1` | 2048×2048 | 60 | **Yes** |

### 4.3 API Request Structure

```typescript
interface FluxGenerationRequest {
  prompt: string              // Built by buildPrompt()
  negative_prompt?: string    // Built by buildNegativePrompt()
  width?: number              // Based on plan
  height?: number             // Based on plan
  num_inference_steps?: number // Based on plan
  guidance_scale?: number     // 6.8 - 8.2 based on plan
  num_images?: number         // 1-3 based on plan
  seed?: number               // Random for variation
  safety_tolerance?: number   // Default: 2
  output_format?: 'jpeg' | 'png'
  model?: string              // Based on plan
  character_lock?: boolean    // Pro/Ultra only
  reference_images?: FluxReferenceImage[] // User uploaded photos
}
```

### 4.4 Reference Images (User Uploads)

**Purpose**: Character Lock feature uses uploaded photos as reference

```typescript
interface FluxReferenceImage {
  url: string    // Supabase Storage URL
  weight?: number // Default: 0.6 (60% influence)
}
```

**How it works**:
1. User uploads 10-20 pet photos
2. Photos stored in Supabase `pet-uploads` bucket
3. URLs passed to API as `reference_images`
4. BFL uses these to maintain pet's appearance across generations

---

## 5. Data Correlation Map

### 5.1 Complete Data Flow

```
USER SELECTIONS (Frontend)
├── styles: ['superhero', 'royal']
├── backgrounds: ['studio-dark', 'beach']
├── accessories: ['crown', 'glasses']
└── customInputs: { style: 'vintage film noir' }
          │
          ▼
SESSION STORAGE
├── userPreferences: JSON string
└── selectedPlan: 'ultra'
          │
          ▼
PROMPT BUILDER (ai-prompt-builder.ts)
├── buildPrompt() → main prompt string
├── buildNegativePrompt() → exclusion string
└── generatePromptVariations() → batch prompts
          │
          ▼
BFL API (blackforest-api.ts)
├── Model selection based on plan
├── Resolution scaling
├── Reference images attachment
└── API call to BFL endpoint
          │
          ▼
DATABASE (Supabase)
├── generated_images table
│   ├── prompt: string
│   ├── style: string
│   ├── background: string
│   ├── accessories: string[]
│   ├── image_urls: string[]
│   └── generation_params: JSONB
└── user_preferences table
    ├── preferred_styles: string[]
    ├── preferred_backgrounds: string[]
    └── preferred_accessories: string[]
```

### 5.2 Field Mappings

| Frontend Field | Prompt Builder | API Field | Database Column |
|---------------|----------------|-----------|-----------------|
| `selectedStyles[0]` | `selections.style` | Part of `prompt` | `generated_images.style` |
| `selectedBackgrounds[0]` | `selections.background` | Part of `prompt` | `generated_images.background` |
| `selectedAccessories` | `selections.accessories` | Part of `prompt` | `generated_images.accessories` |
| `customStyleText` | `customInputs.style` | Part of `prompt` | `generation_params.customStyle` |
| Pet photos URLs | `reference_images` | `reference_images[]` | `generated_images.jobs_data` |

---

## 6. Example Workflows

### 6.1 Starter Plan - Simple Generation

**User Selects**:
- Style: Realistic Portrait
- Background: Studio Light
- Accessories: None
- Plan: Starter (auto-detected)

**Generated Prompt**:
```
photorealistic of a beautiful dog in clean white studio backdrop, professional 
photography setup, soft even lighting, professional studio portrait, high-end 
photography, soft professional lighting, shallow depth of field, sharp focus 
on eyes, bokeh background, highly detailed, masterpiece, best quality, 8k resolution
```

**API Call**:
```json
{
  "prompt": "...",
  "model": "flux-pro-1.1",
  "width": 1024,
  "height": 1024,
  "num_inference_steps": 32,
  "character_lock": false,
  "reference_images": []
}
```

### 6.2 Ultra Plan - Full Customization

**User Selects**:
- Style: Custom ("cinematic movie poster style")
- Background: Custom ("neon cyberpunk cityscape at night")
- Accessories: Crown, Custom ("leather jacket with studs")
- Plan: Ultra (auto-detected)

**Generated Prompt**:
```
cinematic movie poster style style of a Golden Retriever dog with fluffy golden 
coat named Max, wearing a decorative crown, leather jacket with studs, in neon 
cyberpunk cityscape at night, highly detailed, masterpiece, best quality, 
8k resolution
```

**API Call**:
```json
{
  "prompt": "...",
  "model": "flux-ultra-1.1",
  "width": 2048,
  "height": 2048,
  "num_inference_steps": 60,
  "character_lock": true,
  "reference_images": [
    { "url": "https://storage.supabase.co/...", "weight": 0.6 },
    { "url": "https://storage.supabase.co/...", "weight": 0.6 }
  ]
}
```

---

## 7. Improvement Suggestions

### 7.1 Prompt Enhancement Ideas

- [ ] **Breed-specific modifiers**: Add more detailed breed characteristics
- [ ] **Pose variations**: Include pose instructions (sitting, running, portrait)
- [ ] **Lighting modifiers**: More control over lighting conditions
- [ ] **Composition guides**: Rule of thirds, centered, dynamic angles

### 7.2 API Optimization Ideas

- [ ] **Batch processing**: Queue multiple generations efficiently
- [ ] **Caching**: Cache similar prompts to reduce API calls
- [ ] **A/B testing**: Test different prompt structures for quality
- [ ] **Seed consistency**: Option to recreate exact same image

### 7.3 User Experience Ideas

- [ ] **Preview prompts**: Show users what prompt will be generated
- [ ] **Edit prompts**: Allow advanced users to modify prompts
- [ ] **Prompt templates**: Save favorite prompt combinations
- [ ] **Style mixing**: Combine multiple styles (e.g., 50% cyberpunk + 50% watercolor)

### 7.4 Data Tracking Ideas

- [ ] **A/B test prompts**: Track which prompt structures get highest ratings
- [ ] **Popular combinations**: Analytics on most used style+background combos
- [ ] **Generation success rate**: Track failures per prompt type
- [ ] **User satisfaction**: Correlate ratings with prompt parameters

---

## File References

| File | Purpose |
|------|---------|
| `src/lib/ai-prompt-builder.ts` | Core prompt building logic |
| `src/lib/blackforest-api.ts` | BFL API integration |
| `src/app/onboarding/page.tsx` | User selection UI |
| `src/app/dashboard/page.tsx` | Photo upload & generation trigger |
| `src/app/api/generate-images/route.ts` | API endpoint for generation |
| `database/schema.sql` | Database tables for storing data |

---

## Contributing

To improve this system:

1. Update style definitions in `ai-prompt-builder.ts`
2. Add new backgrounds/accessories
3. Test with BFL API sandbox
4. Measure quality improvements
5. Update this documentation

---

*Last Updated: December 2025*
