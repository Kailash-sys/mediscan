import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Database,
  Lock,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  Workflow,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Disclaimer } from '../components/Disclaimer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const PIPELINE = [
  {
    icon: ScanLine,
    title: 'Optical character recognition',
    description:
      'An OCR engine reads all visible text from your images: names, strengths, warnings, and packaging details.',
  },
  {
    icon: Workflow,
    title: 'Text cleanup',
    description:
      'Noise from OCR — symbols, numbers, packaging boilerplate — is filtered out before analysis.',
  },
  {
    icon: Stethoscope,
    title: 'Medicine identification',
    description:
      'A language model reviews the cleaned text to identify real medicine names and correct OCR spelling errors.',
  },
  {
    icon: Database,
    title: 'Interaction checking',
    description:
      'Each medicine pair is checked against regulatory drug label data (such as the US FDA label database), with an AI explanation grounded in that sourced text.',
  },
]

export function About() {
  useDocumentTitle('About')

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About MediScan AI"
        title="Medication safety information, one photo at a time"
        subtitle="MediScan AI helps people understand their medicines better. Photograph a medicine label, and the system identifies the medicines and checks them against each other for potential interactions — explained in plain language, grounded in regulatory label data."
      />

      {/* Pipeline */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold text-slate-900">How the analysis works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PIPELINE.map((step, i) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Privacy */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold text-slate-900">Your data</h2>
        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Lock className="size-5" aria-hidden />
            </span>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
              <p>
                <strong className="font-semibold text-slate-900">Images are processed by the analysis service</strong>{' '}
                to extract text and identify medicines. Uploaded images are stored on the server
                only as part of processing.
              </p>
              <p>
                <strong className="font-semibold text-slate-900">Your analysis history stays on your device.</strong>{' '}
                The record of what you checked is saved in your browser's local storage and is
                never transmitted anywhere — clearing your browser data removes it completely.
              </p>
              <p>
                <strong className="font-semibold text-slate-900">No accounts, no tracking profiles.</strong>{' '}
                MediScan AI works without registration, and we don't build advertising or
                profiling systems on top of your data.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Limitations + disclaimer */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold text-slate-900">Limitations</h2>
        <Card className="mt-6 p-6 sm:p-8">
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            {[
              'OCR can misread blurry, glanced, or unusual packaging — detected names should always be double-checked against the box.',
              'Interaction information depends on the availability of regulatory label data; some medicines may return an "Unknown" result.',
              'Severity levels describe interaction potential, not your personal risk — that depends on your health, doses, and other medicines.',
              'The system does not detect supplements, herbal products, or non-standard packaging reliably.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sky-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Disclaimer variant="panel" className="mt-10" />

      <div className="mt-10 text-center">
        <Link to="/analyze" className="focus-ring inline-block rounded-xl">
          <Button size="lg">
            Try the Interaction Checker
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Link>
      </div>
    </div>
  )
}
