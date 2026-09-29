import { TriangleAlert } from 'lucide-react'

interface DisclaimerProps {
  /** "banner" = slim amber strip; "panel" = full card for results pages. */
  variant?: 'banner' | 'panel'
  className?: string
}

export function Disclaimer({ variant = 'banner', className = '' }: DisclaimerProps) {
  if (variant === 'panel') {
    return (
      <section
        className={`rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 ${className}`}
        aria-label="Medical disclaimer"
      >
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <TriangleAlert className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-bold text-amber-900">Important medical disclaimer</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-amber-900/85">
              This analysis provides informational support only and is not a substitute for
              professional medical advice, diagnosis, or treatment. Detection and interaction
              results can be incomplete or wrong. Always consult a qualified healthcare
              professional before starting, stopping, or changing any medication.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 ${className}`}
      aria-label="Medical disclaimer"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
      <p className="text-xs leading-relaxed text-amber-900/90">
        <strong className="font-semibold">Informational use only.</strong> This tool does not
        provide medical advice or diagnosis. Always consult a qualified healthcare professional
        before making decisions about your medication.
      </p>
    </div>
  )
}
