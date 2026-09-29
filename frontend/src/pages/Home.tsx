import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenCheck,
  Camera,
  CheckCircle2,
  FileImage,
  Layers,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  Upload,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { SectionHeading } from '../components/ui/SectionHeading'
import { BlogCard } from '../components/blog/BlogCard'
import { Disclaimer } from '../components/Disclaimer'
import { getAllPosts } from '../api/blogApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const FEATURES = [
  {
    icon: ScanLine,
    title: 'Scan medicine labels',
    description:
      'Point your camera at any medicine strip or box. Our OCR engine reads the label — even tricky foil packaging.',
  },
  {
    icon: Layers,
    title: 'Identify multiple medicines',
    description:
      'Add images for every medicine in question. The system extracts the actual drug names, correcting OCR noise along the way.',
  },
  {
    icon: ShieldCheck,
    title: 'Check interactions with sources',
    description:
      'Each medicine pair is compared against regulatory drug label data, with a plain-language explanation of what was found.',
  },
  {
    icon: BookOpenCheck,
    title: 'Learn as you go',
    description:
      'A growing library of practical guides on medication safety, generics, and working with your pharmacist.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Camera,
    title: 'Capture or upload',
    description:
      'Use your phone camera to scan medicine packaging, or drop in photos you already have. Multiple images are welcome.',
  },
  {
    step: '02',
    icon: FileImage,
    title: 'AI reads the label',
    description:
      'Text is extracted from the images, cleaned up, and reviewed to identify the real medicine names.',
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'Get interaction results',
    description:
      'Every medicine pair is checked and explained with a severity level and a source-grounded description.',
  },
]

export function Home() {
  useDocumentTitle('Medicine Interaction Checker')
  const posts = getAllPosts()
  const blogPreview = posts.slice(0, 3)

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="bg-mesh relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
          <div className="animate-fade-up">
            <Badge className="bg-teal-50 text-teal-700 ring-1 ring-teal-200">
              <Stethoscope className="size-3.5" aria-hidden />
              AI-powered medication safety assistant
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Check your medicines for{' '}
              <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
                risky interactions
              </span>{' '}
              — with a photo
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              MediScan AI reads medicine labels from images, identifies the actual drugs, and
              checks every combination against regulatory label data — so you get clear,
              source-grounded answers in seconds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/analyze" className="focus-ring rounded-xl">
                <Button size="lg" className="w-full sm:w-auto">
                  <ScanLine className="size-5" aria-hidden />
                  Check Medicine Interactions
                </Button>
              </Link>
              <Link to="/blogs" className="focus-ring rounded-xl">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Explore Health Guides
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {['No account needed', 'Works on mobile', 'Results in a few minutes'].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero visual */}
          <div className="animate-fade-up relative hidden lg:block" style={{ animationDelay: '120ms' }}>
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-sky-100 via-white to-teal-50" aria-hidden />
            <div className="relative space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Analysis result</span>
                <Badge className="bg-red-100 text-red-800 ring-1 ring-red-200">Major risk</Badge>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">Warfarin</span>
                  <ArrowRight className="size-3.5 text-slate-400" aria-hidden />
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">Aspirin</span>
                </div>
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  Both medicines affect blood clotting. Taking them together can increase the risk of
                  serious bleeding…
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">Paracetamol</span>
                  <ArrowRight className="size-3.5 text-slate-400" aria-hidden />
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">Amoxicillin</span>
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">NONE</span>
                </div>
                <p className="mt-2.5 line-clamp-1 text-xs text-slate-600">
                  No interaction was found for this pair…
                </p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                <span className="text-xs text-slate-500">3 medicines · 3 pairs checked</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-sky-700">
                  <Zap className="size-3.5" aria-hidden />
                  ~45s
                </span>
              </div>
              <p className="text-center text-[10px] text-slate-400">
                Illustration of the results view
              </p>
            </div>
            {/* floating card */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg xl:block">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <CheckCircle2 className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">Label data grounded</p>
                  <p className="text-[10px] text-slate-500">Regulatory sources only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="border-t border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need for a quick medicine safety check"
            subtitle="Built around one simple flow: photograph your medicines, get an understandable interaction summary."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} hover className="p-6">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon className="size-5.5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ UPLOAD TEASER / CAMERA ============ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-sky-600 to-teal-600 shadow-xl shadow-sky-900/20">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Start with a photo of your medicine
                </h2>
                <p className="mt-3 max-w-lg text-sky-50/90">
                  Upload images from your gallery or scan directly with your camera on mobile. Add
                  one image per medicine — the more complete the label, the better the detection.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link to="/analyze" className="focus-ring rounded-xl">
                    <Button size="lg" className="w-full bg-white text-sky-700 shadow-none hover:bg-sky-50 sm:w-auto">
                      <Upload className="size-5" aria-hidden />
                      Upload Medicine Images
                    </Button>
                  </Link>
                  <Link to="/analyze" className="focus-ring rounded-xl">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="w-full text-white ring-1 ring-white/40 hover:bg-white/10 sm:w-auto"
                    >
                      <Camera className="size-5" aria-hidden />
                      Open Camera Scanner
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden justify-center lg:flex">
                <div className="relative">
                  <div className="flex size-40 items-center justify-center rounded-[2rem] bg-white/10 backdrop-blur-sm ring-1 ring-white/25">
                    <ScanLine className="size-20 text-white/90" aria-hidden />
                  </div>
                  <span className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-full bg-teal-300 text-teal-900 shadow-lg">
                    <Camera className="size-5" aria-hidden />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-y border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="From photo to answers in three steps"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative rounded-2xl border border-slate-200 p-6">
                  <span className="absolute top-5 right-6 font-display text-4xl font-extrabold text-slate-100">
                    {step.step}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="absolute top-1/2 -right-3.5 hidden size-6 -translate-y-1/2 text-slate-300 md:block" aria-hidden />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Why MediScan"
                title="Designed for real medicine cabinets"
                subtitle="People juggle prescriptions, over-the-counter painkillers, and supplements — often without anyone reviewing the combination."
              />
              <ul className="mt-8 space-y-4">
                {[
                  'Understand what is actually inside each box — generic names, not just brands',
                  'Catch combinations worth discussing with your doctor before they become problems',
                  'Keep a private, on-device history of what you have checked',
                  'Plain-language explanations grounded in regulatory label data',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden />
                    <span className="text-sm leading-relaxed text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link to="/analyze" className="focus-ring mt-8 inline-block rounded-xl">
                <Button>
                  Try the Interaction Checker
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </Link>
            </div>
            <Card className="p-8 lg:p-10">
              <div className="space-y-5">
                {[
                  { label: 'Medicines detected per scan', value: '1–10+', note: 'multiple images supported' },
                  { label: 'Interaction pairs checked', value: 'All', note: 'every unique combination' },
                  { label: 'Typical analysis time', value: '2–5 min', note: 'OCR + label lookups + AI' },
                  { label: 'Data stored on your device', value: '100%', note: 'history never leaves your browser' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{stat.label}</p>
                      <p className="text-xs text-slate-500">{stat.note}</p>
                    </div>
                    <span className="font-display text-xl font-extrabold text-sky-600">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ BLOG PREVIEW ============ */}
      <section className="border-t border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="From the blog"
              title="Practical health guides"
            />
            <Link to="/blogs" className="focus-ring rounded-xl">
              <Button variant="secondary" size="sm">
                View all articles
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {blogPreview.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ SAFETY / DISCLAIMER ============ */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Disclaimer variant="panel" />
        </div>
      </section>
    </>
  )
}
