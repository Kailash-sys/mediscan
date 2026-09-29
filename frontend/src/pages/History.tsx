import { useState } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon, ScanLine, Trash2, Eye } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { HistoryDetailModal } from '../components/history/HistoryDetailModal'
import { clearHistory, deleteHistoryEntry, getHistory } from '../utils/history'
import type { HistoryEntry } from '../utils/history'
import { formatDateTime, highestSeverity } from '../utils/format'
import { severityStyle } from '../utils/severity'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function History() {
  useDocumentTitle('Analysis History')
  // Bump to re-read localStorage after mutations.
  const [version, setVersion] = useState(0)
  const [detail, setDetail] = useState<HistoryEntry | null>(null)

  const history = getHistory()

  const refresh = () => setVersion((v) => v + 1)

  const handleClearAll = () => {
    clearHistory()
    refresh()
  }

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id)
    refresh()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Analysis History
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Your last analyses, stored privately on this device only.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleClearAll}>
            <Trash2 className="size-4" aria-hidden />
            Clear all
          </Button>
        )}
      </div>

      {/* List */}
      {history.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={HistoryIcon}
            title="No analyses yet"
            description="Once you analyze medicine images, they'll appear here so you can revisit the results anytime."
            action={
              <Link to="/analyze" className="focus-ring rounded-xl">
                <Button>
                  <ScanLine className="size-4" aria-hidden />
                  Analyze medicines
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-4" aria-version={version}>
          {history.map((entry) => {
            const overall = highestSeverity(entry.interactionSummaries.map((s) => s.severity))
            const style = severityStyle(overall)
            const foundCount = entry.interactionSummaries.filter((s) => s.interaction_found).length

            return (
              <li
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Thumbnail or icon */}
                  {entry.imagePreviews.filter(Boolean).length > 0 ? (
                    <img
                      src={entry.imagePreviews.filter(Boolean)[0]}
                      alt=""
                      className="size-14 shrink-0 rounded-xl border border-slate-200 object-cover"
                    />
                  ) : (
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                      <FileImageIcon />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {entry.medicines.length > 0
                          ? entry.medicines.slice(0, 3).join(', ') + (entry.medicines.length > 3 ? ` +${entry.medicines.length - 3} more` : '')
                          : 'No medicines detected'}
                      </p>
                      {entry.interactionSummaries.length > 0 && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}
                        >
                          {overall}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDateTime(entry.timestamp)} · {entry.imageCount}{' '}
                      {entry.imageCount === 1 ? 'image' : 'images'} ·{' '}
                      {entry.numberOfMedicines} {entry.numberOfMedicines === 1 ? 'medicine' : 'medicines'}
                      {entry.interactionSummaries.length > 0 &&
                        ` · ${foundCount} interaction${foundCount === 1 ? '' : 's'} found`}
                    </p>
                    {entry.medicines.length === 0 && (
                      <p className="mt-1 text-xs italic text-slate-400">
                        Try retaking photos with clearer label text
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setDetail(entry)}>
                      <Eye className="size-4" aria-hidden />
                      View
                    </Button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="focus-ring rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete analysis from ${formatDateTime(entry.timestamp)}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Detail modal */}
      {detail && <HistoryDetailModal entry={detail} onClose={() => setDetail(null)} />}

      <p className="mt-8 text-xs leading-relaxed text-slate-400">
        History is saved in your browser's local storage and never sent anywhere. Clearing your
        browser data will remove it.{' '}
        <Badge className="bg-slate-100 text-slate-600 ring-1 ring-slate-200">Private</Badge>
      </p>
    </div>
  )
}

function FileImageIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}
