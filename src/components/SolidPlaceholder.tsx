'use client'

interface SolidPlaceholderProps {
  width: number
  height: number
  color: string
  text?: string
  className?: string
  alt: string
}

export default function SolidPlaceholder({ 
  width, 
  height, 
  color, 
  text, 
  className = '',
  alt 
}: SolidPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center text-white font-medium text-center ${className}`}
      style={{ 
        backgroundColor: color,
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`
      }}
      role="img"
      aria-label={alt}
    >
      {text && <span className="px-2 text-shadow">{text}</span>}
    </div>
  )
}