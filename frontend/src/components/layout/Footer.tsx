import { Link } from 'react-router-dom'
import { ScanLine } from 'lucide-react'

const PRODUCT_LINKS = [
  { to: '/analyze', label: 'Medicine Interaction' },
  { to: '/history', label: 'Analysis History' },
  { to: '/blogs', label: 'Health Blog' },
  { to: '/about', label: 'About' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5 focus-ring rounded-xl">
              <span className="flex size-9 items-center justify-center rounded-xl bg-sky-600 text-white">
                <ScanLine className="size-5" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                MediScan<span className="text-sky-600">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Scan medicine images, identify medicines, and check for potential interactions —
              powered by OCR and AI analysis against regulatory drug label data.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 transition hover:text-sky-700 focus-ring rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Medical Disclaimer</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              MediScan AI provides informational support only and is{' '}
              <strong className="font-semibold text-slate-600">
                not a substitute for professional medical advice, diagnosis, or treatment
              </strong>
              . Always consult a qualified healthcare professional before starting, stopping, or
              changing any medication.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} MediScan AI. For informational purposes only.
          </p>
          <p className="text-xs text-slate-400">
            Interaction data sourced from public regulatory drug label databases.
          </p>
        </div>
      </div>
    </footer>
  )
}
