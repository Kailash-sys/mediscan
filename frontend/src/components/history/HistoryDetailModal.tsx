import { useEffect } from 'react'
import { Clock, FileImage, Pill, ShieldAlert } from 'lucide-react'
import type { HistoryEntry } from '../../utils/history'
import { InteractionCard } from '../medicine/InteractionCard'
import { Disclaimer } from '../Disclaimer'
import { formatDateTime, highestSeverity } from '../../utils/format'
import { severityStyle } from '../../utils/severity'

interface HistoryDetailModalProps {
  entry: HistoryEntry
  onClose: () => void
}

/** Full-screen scrollable modal with the complete backend response of a past analysis. */
export function HistoryDetailModal({ entry, onClose }: HistoryDetailModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const { response } = entry
  const overall = highestSeverity(response.interactions.map((i) => i.result.severity))

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Analysis details">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="absolute inset-x-0 bottom-0 top-10 mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:inset-y-6 sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Analysis details</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5" aria-hidden />
              {formatDateTime(entry.timestamp)} · {entry.imageCount}{' '}
              {entry.imageCount === 1 ? 'image' : 'images'} · stored on this device
            </p>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close details"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Summary chips */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: FileImage, label: 'Images', value: response.number_of_images },
              { icon: Pill, label: 'Medicines', value: response.number_of_medicines },
              { icon: ShieldAlert, label: 'Pairs checked', value: response.number_of_pairs },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-center">
                <Icon className="mx-auto size-4 text-slate-400" aria-hidden />
                <p className="mt-1.5 text-lg font-bold text-slate-900">{value}</p>
                <p className="text-[11px] font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {response.interactions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Interaction results</h3>
              <p className="mt-1 text-xs text-slate-500">
                Highest severity in this analysis:{' '}
                <span className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${severityStyle(overall).badge}`}>
                  {overall}
                </span>
              </p>
              <div className="mt-3 space-y-3">
                {response.interactions.map((i, idx) => (
                  <InteractionCard key={`${i.drug_a}-${i.drug_b}-${idx}`} interaction={i} />
                ))}
              </div>
            </div>
          )}

          {/* Medicines */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Detected medicines</h3>
            {response.medicines.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {response.medicines.map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No medicines were detected.</p>
            )}
          </div>

          {/* Thumbnails */}
          {entry.imagePreviews.some(Boolean) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Analyzed images</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.imagePreviews.filter(Boolean).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Analyzed image ${i + 1}`}
                    className="size-16 rounded-lg border border-slate-200 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Raw OCR text (collapsible) */}
          <details className="group rounded-xl border border-slate-200">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <span className="text-slate-400 transition group-open:rotate-90">▸</span>
                View extracted text (OCR)
              </span>
            </summary>
            <div className="border-t border-slate-100 px-4 py-3">
              {response.ocr_text.length > 0 ? (
                <p className="scrollbar-thin max-h-48 overflow-y-auto font-mono text-xs leading-relaxed text-slate-600">
                  {response.ocr_text.join(' | ')}
                </p>
              ) : (
                <p className="text-sm text-slate-500">No OCR text available.</p>
              )}
            </div>
          </details>

          <Disclaimer variant="panel" />
        </div>
      </div>
    </div>
  )
}
