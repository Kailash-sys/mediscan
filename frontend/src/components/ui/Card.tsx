import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover lift — use for clickable/interactive cards only. */
  hover?: boolean
}

export function Card({ hover = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03] ${
        hover ? 'transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/[0.07]' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
