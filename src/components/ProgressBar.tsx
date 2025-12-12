import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export default function ProgressBar({ currentStep, totalSteps, labels = [] }: ProgressBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Arrow Progress Bar Container */}
      <div className="relative flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isLast = stepNumber === totalSteps
          const isFirst = stepNumber === 1
          const label = labels[index] || `Step ${stepNumber}`

          return (
            <div
              key={stepNumber}
              className="flex-1 relative"
            >
              {/* Arrow Shape */}
              <div
                className={`
                  relative flex items-center justify-center h-12 
                  ${isFirst ? 'rounded-l-lg' : ''} 
                  ${isLast ? 'rounded-r-lg' : ''}
                  ${isCompleted || isCurrent 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                  transition-all duration-300
                `}
                style={{
                  clipPath: isLast 
                    ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)'
                    : isFirst
                    ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
                  marginLeft: isFirst ? '0' : '-12px',
                }}
              >
                <div className="flex items-center gap-2 px-4">
                  {/* Step indicator */}
                  <span
                    className={`
                      flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                      ${isCompleted
                        ? 'bg-white text-blue-500'
                        : isCurrent
                        ? 'bg-white/20 text-white border-2 border-white'
                        : 'bg-gray-300 text-gray-600'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      stepNumber
                    )}
                  </span>
                  
                  {/* Label */}
                  <span className={`
                    font-medium text-sm hidden sm:inline whitespace-nowrap
                    ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}
                  `}>
                    {label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Mobile: Show current step label */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-white text-sm font-medium">
          Step {currentStep}: {labels[currentStep - 1] || ''}
        </span>
      </div>
    </div>
  )
}
