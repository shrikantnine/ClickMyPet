import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export default function ProgressBar({ currentStep, totalSteps, labels = [] }: ProgressBarProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Frosted Glass Container */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
        {/* Progress Bar Track */}
        <div className="relative">
          {/* Background Track */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-white/20 rounded-full">
            {/* Active Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-400/50"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="relative flex justify-between">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const stepNumber = index + 1
              const isCompleted = stepNumber < currentStep
              const isCurrent = stepNumber === currentStep
              const label = labels[index]

              return (
                <div key={stepNumber} className="flex flex-col items-center">
                  {/* Circle Indicator */}
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm
                      transition-all duration-300 backdrop-blur-sm
                      ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-400/50 scale-100'
                          : isCurrent
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50 scale-110 ring-4 ring-white/30'
                          : 'bg-white/30 text-gray-500 border-2 border-white/40'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      stepNumber
                    )}
                  </div>

                  {/* Label (if provided) */}
                  {label && (
                    <span
                      className={`
                        mt-2 text-xs font-medium transition-all duration-300
                        ${
                          isCurrent
                            ? 'text-white scale-105'
                            : isCompleted
                            ? 'text-white/80'
                            : 'text-white/50'
                        }
                      `}
                    >
                      {label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Step Text (Minimal) */}
        <div className="text-center mt-4">
          <span className="text-white/60 text-sm font-medium">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  )
}
