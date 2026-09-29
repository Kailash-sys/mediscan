import { ArrowRight, Info } from 'lucide-react'
import type { Interaction } from '../../types/analysis'
import { severityStyle } from '../../utils/severity'

interface InteractionCardProps {
  interaction: Interaction
}

export function InteractionCard({ interaction }: InteractionCardProps) {
  const { drug_a, drug_b, result } = interaction
  const style = severityStyle(result.severity)
  const found = result.interaction_found === true

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${style.cardBorder} ${style.cardBg}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Pair */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
            {drug_a}
          </span>
          <ArrowRight className="size-4 text-slate-400" aria-label="combined with" />
          <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
            {drug_b}
          </span>
        </div>

        {/* Severity badge — only backend-provided labels are shown */}
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${style.badge}`}
        >
          <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden />
          {result.severity}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">{result.description}</p>

      <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-500">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {found
          ? 'Discuss this combination with your doctor or pharmacist before taking these medicines together.'
          : 'No interaction was found for this pair — still follow the guidance on your prescription labels.'}
      </p>
    </article>
  )
}
