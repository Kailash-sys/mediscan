import { Pill } from 'lucide-react'

interface MedicineCardProps {
  name: string
  index: number
}

export function MedicineCard({ name, index }: MedicineCardProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
        <Pill className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-base font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">Detected medicine #{index + 1}</p>
      </div>
    </div>
  )
}
