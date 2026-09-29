import { useCallback, useRef, useState } from 'react'
import { isCancel } from 'axios'
import { useNavigate } from 'react-router-dom'
import { Info, ScanLine } from 'lucide-react'
import { ImageUploader } from '../components/medicine/ImageUploader'
import { CameraScanner } from '../components/medicine/CameraScanner'
import { AnalysisProgress } from '../components/medicine/AnalysisProgress'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Button } from '../components/ui/Button'
import { Disclaimer } from '../components/Disclaimer'
import { useToast } from '../context/ToastContext'
import { useAnalysis } from '../context/AnalysisContext'
import { analyzeImages, FileValidationError, validateImageFile } from '../api/medicineApi'
import { normalizeApiError } from '../api/client'
import type { ApiError } from '../api/client'
import { addHistoryEntry } from '../utils/history'
import type { PendingImage } from '../types/analysis'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const MAX_IMAGES = 10

type Phase = 'select' | 'analyzing'

export function Analyze() {
  useDocumentTitle('Medicine Interaction')
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { setAnalysis } = useAnalysis()

  const [images, setImages] = useState<PendingImage[]>([])
  const [phase, setPhase] = useState<Phase>('select')
  const [error, setError] = useState<ApiError | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const addFiles = useCallback(
    (files: File[]) => {
      setError(null)

      const capacity = Math.max(0, MAX_IMAGES - images.length)
      const prepared: PendingImage[] = []
      let overflowSkipped = 0

      for (const file of files) {
        if (prepared.length >= capacity) {
          overflowSkipped++
          continue
        }
        try {
          // Same rules the backend enforces — instant feedback instead of a failed upload.
          validateImageFile(file)
        } catch (e) {
          if (e instanceof FileValidationError) showToast(e.message, 'error')
          continue
        }
        prepared.push({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          source: file.name.startsWith('scan_') ? 'camera' : 'upload',
        })
      }

      // State updaters stay pure; all side effects (toasts) happen here.
      if (prepared.length > 0) {
        setImages((current) => [...current, ...prepared])
        showToast(
          `${prepared.length} ${prepared.length === 1 ? 'image' : 'images'} added. You can add more or press Analyze.`,
          'success',
        )
      }
      if (overflowSkipped > 0) {
        showToast(
          `${overflowSkipped} ${overflowSkipped === 1 ? 'file was' : 'files were'} skipped — the limit is ${MAX_IMAGES} images per analysis.`,
          'error',
        )
      }
    },
    [images.length, showToast],
  )

  const removeImage = useCallback(
    (id: string) => {
      const target = images.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      setImages((current) => current.filter((img) => img.id !== id))
    },
    [images],
  )

  const startAnalysis = useCallback(async () => {
    if (images.length === 0) {
      showToast('Add at least one medicine image first.', 'error')
      return
    }

    setError(null)
    setIsAnalyzing(true)
    setPhase('analyzing')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await analyzeImages(
        images.map((img) => img.file),
        controller.signal,
      )

      // Guard against an unexpected empty payload.
      if (!response || typeof response.success !== 'boolean') {
        throw normalizeApiError(new Error('The server returned an empty or invalid response.'))
      }

      setAnalysis(
        response,
        images.map((img) => img.file.name || 'Camera capture'),
      )
      void addHistoryEntry(response, images.map((img) => img.file))
      navigate('/results')
    } catch (err) {
      if (isCancel(err)) {
        // User canceled — quietly go back to the selection view.
        setPhase('select')
        return
      }
      const apiError = normalizeApiError(err)
      setError(apiError)
      setPhase('select')
      showToast(apiError.message, 'error')
    } finally {
      setIsAnalyzing(false)
      abortRef.current = null
    }
  }, [images, navigate, setAnalysis, showToast])

  const cancelAnalysis = () => {
    abortRef.current?.abort()
  }

  if (phase === 'analyzing') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <AnalysisProgress imageCount={images.length} />
        <div className="mt-10 text-center">
          <Button variant="ghost" size="sm" onClick={cancelAnalysis}>
            Cancel analysis
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/25">
          <ScanLine className="size-6" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900">
          Medicine Interaction Checker
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
          Upload or scan photos of your medicine packaging. We read the labels, identify the
          medicines, and check every combination for potential interactions.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <ImageUploader
          images={images}
          onFilesSelected={addFiles}
          onRemove={removeImage}
          onOpenCamera={() => setCameraOpen(true)}
          disabled={isAnalyzing}
        />

        {error && (
          <div className="mx-auto max-w-2xl">
            <ErrorMessage error={error} onRetry={startAnalysis} />
          </div>
        )}

        {/* Tips */}
        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-sky-900">
            <Info className="size-4" aria-hidden />
            Tips for best results
          </h3>
          <ul className="mt-3 grid gap-2 text-sm text-sky-900/80 sm:grid-cols-2">
            {[
              'Photograph the side of the box or strip with the generic/ingredient name.',
              'Use good, indirect light — avoid flash glare on foil.',
              'One image per medicine makes detection clearer.',
              'Make sure the printed text fills the frame and is in focus.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Analyze button */}
        <div className="flex flex-col items-center gap-3">
          <Button
            size="lg"
            className="w-full sm:w-auto sm:min-w-72"
            onClick={startAnalysis}
            disabled={images.length === 0}
            loading={isAnalyzing}
          >
            {images.length > 0
              ? `Analyze ${images.length} ${images.length === 1 ? 'image' : 'images'}`
              : 'Analyze'}
          </Button>
          {images.length === 0 && (
            <p className="text-xs text-slate-400">Add at least one image to enable analysis</p>
          )}
        </div>

        <Disclaimer variant="banner" />
      </div>

      {/* Camera modal */}
      {cameraOpen && (
        <CameraScanner open onClose={() => setCameraOpen(false)} onCapture={(file) => addFiles([file])} />
      )}
    </div>
  )
}
