import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  FileImage,
  FileText,
  Pill,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { MedicineCard } from '../components/medicine/MedicineCard'
import { InteractionCard } from '../components/medicine/InteractionCard'
import { Disclaimer } from '../components/Disclaimer'
import { useAnalysis } from '../context/AnalysisContext'
import { highestSeverity } from '../utils/format'
import { severityStyle } from '../utils/severity'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type Tab = 'interactions' | 'medicines' | 'text'

export function Results() {
  useDocumentTitle('Analysis Results')
  const navigate = useNavigate()
  const { analysis, analyzedFileNames, clearAnalysis } = useAnalysis()
  const [tab, setTab] = useState<Tab>('interactions')

  const stats = useMemo(() => {
    if (!analysis) return null
    const found = analysis.interactions.filter((i) => i.result.interaction_found === true)
    return {
      found: found.length,
      clean: analysis.interactions.length - found.length,
      overall: highestSeverity(analysis.interactions.map((i) => i.result.severity)),
    }
  }, [analysis])

  if (!analysis) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShieldAlert}
          title="No analysis to display"
          description="Run a medicine analysis first — upload or scan photos of your medicine packaging and we'll check them for interactions."
          action={
            <Link to="/analyze" className="focus-ring rounded-xl">
              <Button>
                <ArrowLeft className="size-4" aria-hidden />
                Go to Medicine Interaction
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const overallStyle = severityStyle(stats!.overall)
  const hasInteractions = analysis.interactions.length > 0

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'interactions', label: 'Interactions', count: analysis.number_of_pairs },
    { id: 'medicines', label: 'Medicines', count: analysis.number_of_medicines },
    { id: 'text', label: 'Extracted text' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Analysis Results
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <FileImage className="size-4" aria-hidden />
              {analysis.number_of_images} {analysis.number_of_images === 1 ? 'image' : 'images'}
              {analyzedFileNames.length > 0 && ` · ${analyzedFileNames[0]}${analyzedFileNames.length > 1 ? ` +${analyzedFileNames.length - 1} more` : ''}`}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/analyze')}>
            New analysis
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAnalysis}>
            Clear
          </Button>
        </div>
      </div>

      {/* Overall summary banner */}
      <Card className={`mt-6 border ${hasInteractions ? overallStyle.cardBorder : 'border-slate-200'} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                hasInteractions ? overallStyle.cardBg : 'bg-emerald-50 text-emerald-600'
              } ${hasInteractions ? overallStyle.icon : ''}`}
            >
              {hasInteractions ? <ShieldAlert className="size-5" aria-hidden /> : <ShieldCheck className="size-5" aria-hidden />}
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {analysis.number_of_medicines === 0
                  ? 'No medicines detected'
                  : !hasInteractions
                    ? 'Nothing to compare yet'
                    : stats!.found > 0
                      ? `${stats!.found} interaction${stats!.found === 1 ? '' : 's'} found across ${analysis.number_of_pairs} ${analysis.number_of_pairs === 1 ? 'pair' : 'pairs'}`
                      : `No interactions found across ${analysis.number_of_pairs} ${analysis.number_of_pairs === 1 ? 'pair' : 'pairs'}`}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {analysis.number_of_medicines} {analysis.number_of_medicines === 1 ? 'medicine' : 'medicines'} detected ·{' '}
                {analysis.number_of_pairs} {analysis.number_of_pairs === 1 ? 'pair' : 'pairs'} checked
                {hasInteractions && stats!.found > 0 && (
                  <>
                    {' '}· highest severity{' '}
                    <span className={`ml-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${overallStyle.badge}`}>
                      {stats!.overall}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {analysis.number_of_medicines === 0 && (
          <p className="mt-4 rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
            No medicine names could be identified from your images. Try again with sharper photos
            where the printed label text is clearly visible — the side of the box with the
            ingredient name works best.
          </p>
        )}
      </Card>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Result sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`focus-ring flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
            {typeof t.count === 'number' && (
              <span className="ml-1.5 rounded-full bg-slate-200/80 px-1.5 py-0.5 text-[11px] text-slate-600">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-5">
        {tab === 'interactions' && (
          <div className="space-y-4">
            {hasInteractions ? (
              analysis.interactions.map((interaction, idx) => (
                <InteractionCard key={`${interaction.drug_a}-${interaction.drug_b}-${idx}`} interaction={interaction} />
              ))
            ) : (
              <EmptyState
                icon={ShieldCheck}
                title={analysis.number_of_medicines <= 1 ? 'At least two medicines are needed' : 'No pairs were formed'}
                description={
                  analysis.number_of_medicines <= 1
                    ? 'Interaction checking compares pairs of medicines. Add images of another medicine to compare against what was already detected.'
                    : 'The detected medicines could not be paired. Try adding clearer images.'
                }
                action={
                  <Link to="/analyze" className="focus-ring rounded-xl">
                    <Button>Add another medicine</Button>
                  </Link>
                }
              />
            )}
          </div>
        )}

        {tab === 'medicines' && (
          <div className="space-y-3">
            {analysis.medicines.length > 0 ? (
              <>
                <p className="text-sm text-slate-500">
                  Medicine names identified from the images. The checker compares the active
                  ingredients, so brand and generic names may appear differently than on the box.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {analysis.medicines.map((medicine, i) => (
                    <MedicineCard key={medicine} name={medicine} index={i} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={Pill}
                title="No medicines detected"
                description="We couldn't identify medicine names in the uploaded images. See the tips on the analysis page for better photos."
              />
            )}
          </div>
        )}

        {tab === 'text' && (
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FileText className="size-4 text-slate-400" aria-hidden />
                Raw OCR text ({analysis.ocr_text.length} fragments)
              </h3>
              {analysis.ocr_text.length > 0 ? (
                <p className="scrollbar-thin mt-3 max-h-60 overflow-y-auto rounded-xl bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-600">
                  {analysis.ocr_text.join(' | ')}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No OCR text was extracted.</p>
              )}
            </Card>
            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CheckCircle2 className="size-4 text-emerald-500" aria-hidden />
                Cleaned text (after processing)
              </h3>
              {analysis.cleaned_text.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {analysis.cleaned_text.map((word) => (
                    <span key={word} className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No cleaned text available.</p>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Stored files note */}
      <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-400">
        <ChevronDown className="size-3.5" aria-hidden />
        Processed on the server: {analysis.files.length} image{analysis.files.length === 1 ? '' : 's'} received ·
        analysis identifier not persisted beyond your browser history
      </p>

      <Disclaimer variant="panel" className="mt-6" />
    </div>
  )
}
