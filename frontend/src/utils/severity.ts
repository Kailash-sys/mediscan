/**
 * Visual mapping for interaction severities returned by the backend.
 * The LLM produces: "Major" | "Moderate" | "Minor" | "None" | "Unknown".
 * Anything else falls back to the "Unknown" style.
 */

export interface SeverityStyle {
  badge: string
  cardBorder: string
  cardBg: string
  icon: string
  dot: string
  label: string
}

const STYLES: Record<string, SeverityStyle> = {
  major: {
    badge: 'bg-red-100 text-red-800 ring-1 ring-red-200',
    cardBorder: 'border-red-200',
    cardBg: 'bg-red-50/60',
    icon: 'text-red-600',
    dot: 'bg-red-500',
    label: 'Major risk',
  },
  moderate: {
    badge: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    cardBorder: 'border-amber-200',
    cardBg: 'bg-amber-50/60',
    icon: 'text-amber-600',
    dot: 'bg-amber-500',
    label: 'Moderate risk',
  },
  minor: {
    badge: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
    cardBorder: 'border-sky-200',
    cardBg: 'bg-sky-50/60',
    icon: 'text-sky-600',
    dot: 'bg-sky-500',
    label: 'Minor risk',
  },
  none: {
    badge: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
    cardBorder: 'border-emerald-200',
    cardBg: 'bg-emerald-50/60',
    icon: 'text-emerald-600',
    dot: 'bg-emerald-500',
    label: 'No interaction found',
  },
  unknown: {
    badge: 'bg-slate-200 text-slate-700 ring-1 ring-slate-300',
    cardBorder: 'border-slate-200',
    cardBg: 'bg-slate-50',
    icon: 'text-slate-500',
    dot: 'bg-slate-400',
    label: 'Unknown — needs review',
  },
}

export function severityStyle(severity: string): SeverityStyle {
  const key = (severity || '').toLowerCase().trim()
  return STYLES[key] ?? STYLES.unknown
}
