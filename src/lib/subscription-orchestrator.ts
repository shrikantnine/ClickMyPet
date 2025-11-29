import { getPlanById, type PricingPlan } from './pricing'
import { getPlanModelConfig } from './blackforest-api'

export interface PlanSnapshot {
  id: string
  name: string
  price: number
  imageCount: number
  styleOptions: number
  backgroundOptions: number
  resolution: string
  accessories: boolean
  customStyleRequests: boolean
  commercialRights: boolean
  prioritySupport: boolean
}

export interface GenerationAllocation {
  totalImages: number
  maxImagesPerJob: number
  plannedBatches: number
  model: string
  resolution: string
}

export type PaymentMetadata = Record<string, any> | null | undefined

export function requirePlan(planId: string): PricingPlan {
  const plan = getPlanById(planId)
  if (!plan) {
    throw new Error(`Invalid plan: ${planId}`)
  }
  return plan
}

export function buildPlanSnapshot(plan: PricingPlan): PlanSnapshot {
  return {
    id: plan.id,
    name: plan.name,
    price: plan.price,
    imageCount: plan.imageCount,
    styleOptions: plan.styleOptions,
    backgroundOptions: plan.backgroundOptions,
    resolution: plan.resolution,
    accessories: plan.accessories,
    customStyleRequests: plan.customStyleRequests,
    commercialRights: plan.commercialRights,
    prioritySupport: plan.prioritySupport,
  }
}

export function buildGenerationAllocation(plan: PricingPlan): GenerationAllocation {
  const modelConfig = getPlanModelConfig(plan.id)
  const maxImagesPerJob = Math.max(1, modelConfig.maxImagesPerJob || 1)
  const plannedBatches = Math.max(1, Math.ceil(plan.imageCount / maxImagesPerJob))

  return {
    totalImages: plan.imageCount,
    maxImagesPerJob,
    plannedBatches,
    model: modelConfig.model,
    resolution: plan.resolution,
  }
}

export function mergePlanMetadata(metadata: PaymentMetadata, plan: PricingPlan) {
  const base = metadata && typeof metadata === 'object' ? { ...metadata } : {}

  if (!base.planSnapshot) {
    base.planSnapshot = buildPlanSnapshot(plan)
  }

  if (!base.generationAllocation) {
    base.generationAllocation = buildGenerationAllocation(plan)
  }

  return base
}
