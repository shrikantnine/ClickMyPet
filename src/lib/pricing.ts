// Secure pricing configuration - server-side only
// This file contains the source of truth for pricing and features
// Never expose actual prices to client-side code

export interface PricingPlan {
  id: string
  name: string
  price: number // in USD
  description: string
  features: string[]
  imageCount: number
  styleOptions: number
  backgroundOptions: number
  resolution: string
  accessories: boolean
  customStyleRequests: boolean
  commercialRights: boolean
  prioritySupport: boolean
  popular: boolean
  buttonText: string
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 15, // $15
    description: 'Perfect for a tryout',
    features: [
      '20 AI generated images',
      '2 style options',
      '2 background choices',
      'HD resolution',
    ],
    imageCount: 20,
    styleOptions: 2,
    backgroundOptions: 2,
    resolution: 'HD',
    accessories: false,
    customStyleRequests: false,
    commercialRights: false,
    prioritySupport: false,
    popular: false,
    buttonText: 'Try Now',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29, // $29
    description: 'Most popular choice',
    features: [
      '40 AI generated images',
      '8 style options',
      'All background choices',
      '2K resolution',
      'Premium accessories',
      'Priority support',
    ],
    imageCount: 40,
    styleOptions: 8,
    backgroundOptions: 25,
    resolution: '2K',
    accessories: true,
    customStyleRequests: false,
    commercialRights: false,
    prioritySupport: true,
    popular: true,
    buttonText: 'Go Pro',
  },
  max: {
    id: 'max',
    name: 'Max',
    price: 49, // $49
    description: 'Best value package',
    features: [
      '100 AI generated images',
      'All style options (15+)',
      'All backgrounds (25+)',
      '4K resolution',
      'All premium accessories',
      'Custom style requests',
      'Commercial usage rights',
      'Priority support',
    ],
    imageCount: 100,
    styleOptions: 15,
    backgroundOptions: 25,
    resolution: '4K',
    accessories: true,
    customStyleRequests: true,
    commercialRights: true,
    prioritySupport: true,
    popular: false,
    buttonText: 'Go Max',
  },
}

// Helper function to get plan by ID with validation
export function getPlanById(planId: string): PricingPlan | null {
  return PRICING_PLANS[planId] || null
}

// Get all plans for display (without sensitive data if needed)
export function getAllPlans(): PricingPlan[] {
  return Object.values(PRICING_PLANS)
}

// Validate plan exists and return price (server-side only)
export function validateAndGetPrice(planId: string): number | null {
  const plan = getPlanById(planId)
  return plan ? plan.price : null
}
