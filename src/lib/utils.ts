import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Uniform spacing constants
export const SPACING = {
  SECTION_GAP: 10,
  SMALL_GAP: 2,
  MEDIUM_GAP: 4,
  LARGE_GAP: 8,
  IMAGE_GAP: 1,
} as const

// Animation constants
export const ANIMATION = {
  MARQUEE_DURATION: 60,
  IMAGE_TRANSITION: 3,
  SCROLL_REVEAL_DELAY: 0.2,
} as const

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const