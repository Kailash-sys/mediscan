import { useEffect, useRef, useState } from 'react'
import { FileSearch, Pill, ScanText, ShieldCheck, Sparkles } from 'lucide-react'

const STEPS = [
  { icon: ScanText, title: 'Preparing images…', detail: 'Reading text from your medicine images' },
  { icon: FileSearch, title: 'Detecting medicines…', detail: 'Looking for medicine names in the scanned text' },
  { icon: Pill, title: 'Identifying medicine names…', detail: 'Correcting OCR noise and matching real drugs' },
  { icon: ShieldCheck, title: 'Checking medicine interactions…', detail: 'Comparing each medicine pair against regulatory label data' },
  { icon: Sparkles, title: 'Preparing results…', detail: 'Putting your summary together' },
]

interface AnalysisProgressProps {
  /** Estimated total duration used to pace the staged progress. */
  estimatedMs?: number
  imageCount: number
}

/**
 * Staged loading experience. The backend does not expose progress, so these
 * stages are paced estimates for reassurance — not claims about exact
 * backend processing state.
 */
export function AnalysisProgress({ estimatedMs = 240_000, imageCount }: AnalysisProgressProps) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed(Date.now() - startRef.current)
    }, 100)
    return () => window.clearInterval(timer)
  }, [])

  // Pace stages non-linearly: OCR-ish work early, interaction checks late.
  const cumulative = [8, 20, 40, 82, 100]
  const pct = Math.min(100, (elapsed / estimatedMs) * 100)
  const stageIndex = cumulative.findIndex((c) => pct < c)

  const CurrentIcon = STEPS[stageIndex === -1 ? STEPS.length - 1 : stageIndex].icon

  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="relative mx-auto flex size-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-sky-100" aria-hidden />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/30">
          <CurrentIcon className="size-9" aria-hidden />
        </span>
      </div>

      <h2 className="mt-6 text-center font-display text-xl font-bold text-slate-900">
        {STEPS[stageIndex === -1 ? STEPS.length - 1 : stageIndex].title}
      </h2>
      <p className="mt-1.5 text-center text-sm text-slate-500">
        {STEPS[stageIndex === -1 ? STEPS.length - 1 : stageIndex].detail}
      </p>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>
            {imageCount} {imageCount === 1 ? 'image' : 'images'} submitted
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
      </div>

      {/* Checklist */}
      <ul className="mt-8 space-y-3">
        {STEPS.map((step, i) => {
          const done = stageIndex === -1 || i < stageIndex
          const active = i === stageIndex
          const Icon = step.icon
          return (
            <li key={step.title} className="flex items-center gap-3">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  done
                    ? 'bg-emerald-50 text-emerald-600'
                    : active
                      ? 'bg-sky-50 text-sky-600'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span
                className={`text-sm transition-colors ${
                  done ? 'text-slate-500 line-through decoration-slate-300' : active ? 'font-semibold text-slate-900' : 'text-slate-400'
                }`}
              >
                {step.title.replace('…', '')}
              </span>
            </li>
          )
        })}
      </ul>

      <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
        A full analysis can take a few minutes — OCR and regulatory label lookups run for every
        medicine pair. Please keep this page open.
      </p>
    </div>
  )
}
