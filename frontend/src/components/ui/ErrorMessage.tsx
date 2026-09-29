import { CircleAlert, WifiOff } from 'lucide-react'
import { Button } from './Button'
import type { ApiError } from '../../api/client'

interface ErrorMessageProps {
  error: ApiError
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const isNetwork = error.code === 'network'
  const Icon = isNetwork ? WifiOff : CircleAlert

  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50/70 px-6 py-10 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <Icon className="size-6" aria-hidden />
      </div>
      <h3 className="mt-4 text-base font-semibold text-red-900">
        {isNetwork ? 'Cannot reach the server' : 'Something went wrong'}
      </h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-red-800/80">{error.message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
