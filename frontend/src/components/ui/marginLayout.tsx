import type { ReactNode } from 'react'

interface MarginLayoutProps {
  children: ReactNode
  className?: string
}

export const MarginLayout = ({ children, className = '' }: MarginLayoutProps) => {
  return (
      <div className={`max-w-[1440px] h-full mx-auto py-2 ${className}`}>
        {children}
      </div>
  )
}