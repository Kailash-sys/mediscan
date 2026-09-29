import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CircleAlert, RefreshCcw, ScanLine, SwitchCamera, X } from 'lucide-react'

interface CameraScannerProps {
  open: boolean
  onClose: () => void
  /** Called with the captured JPEG when the user confirms the shot. */
  onCapture: (file: File) => void
}

type CameraState = 'starting' | 'ready' | 'error'

/**
 * Fullscreen mobile-first camera capture using getUserMedia.
 * Requests the rear camera where available and degrades gracefully on
 * desktops without cameras (the file upload path still works).
 */
export function CameraScanner({ open, onClose, onCapture }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<CameraState>('starting')
  const [error, setError] = useState('')
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
  const [facing, setFacing] = useState<'environment' | 'user'>('environment')

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const startStream = useCallback(async () => {
    setState('starting')
    setError('')
    stopStream()
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera is not supported in this browser. You can still upload an image.')
      setState('error')
      return
    }
    try {
      // Guard against cameras whose getUserMedia promise never settles
      // (virtual cameras, hung drivers): fall back to upload after 12s.
      const timeout = new Promise<never>((_, reject) =>
        window.setTimeout(() => reject(new DOMException('Timeout', 'TimeoutError')), 12_000),
      )
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        }),
        timeout,
      ])
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Don't await play() — it can hang on virtual or slow cameras.
        videoRef.current.play().catch(() => undefined)
      }
      setState('ready')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Camera permission was denied. Enable it in your browser settings, or upload an image instead.')
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setError('No camera was found on this device. You can upload an image instead.')
      } else {
        setError('Could not start the camera. You can upload an image instead.')
      }
      setState('error')
    }
  }, [facing, stopStream])

  // Start/stop the stream with the dialog lifecycle.
  useEffect(() => {
    if (open) {
      setState('starting')
      setCapturedUrl(null)
      setCapturedBlob(null)
      void startStream()
    }
    return () => {
      stopStream()
    }
  }, [open, startStream, stopStream])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const capture = () => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Mirror front-camera previews back to normal orientation.
    if (facing === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        setCapturedBlob(blob)
        setCapturedUrl(URL.createObjectURL(blob))
      },
      'image/jpeg',
      0.92,
    )
  }

  const confirm = () => {
    if (!capturedBlob) return
    const file = new File([capturedBlob], `scan_${Date.now()}.jpg`, { type: 'image/jpeg' })
    onCapture(file)
    handleClose()
  }

  const handleClose = () => {
    stopStream()
    if (capturedUrl) URL.revokeObjectURL(capturedUrl)
    onClose()
  }

  const switchCamera = () => {
    setFacing((f) => (f === 'environment' ? 'user' : 'environment'))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950" role="dialog" aria-modal="true" aria-label="Camera scanner">
      {/* Camera feed / capture preview */}
      <div className="absolute inset-0">
        {capturedUrl ? (
          <img src={capturedUrl} alt="Captured medicine" className="size-full object-contain" />
        ) : (
          <video
            ref={videoRef}
            className={`size-full object-cover ${facing === 'user' ? 'scale-x-[-1]' : ''}`}
            muted
            playsInline
            autoPlay
          />
        )}
      </div>

      {/* Framing guides */}
      {state === 'ready' && !capturedUrl && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-72 w-72 rounded-3xl border-2 border-dashed border-white/60 sm:h-96 sm:w-96" />
          <p className="absolute bottom-40 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/70 px-4 py-1.5 text-xs font-medium text-white/90">
            Fill the frame with the medicine label
          </p>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent p-4">
        <button
          onClick={handleClose}
          className="focus-ring rounded-full bg-slate-950/60 p-2.5 text-white transition hover:bg-slate-900"
          aria-label="Close camera"
        >
          <X className="size-5" aria-hidden />
        </button>
        <span className="flex items-center gap-2 rounded-full bg-slate-950/60 px-4 py-2 text-sm font-semibold text-white">
          <ScanLine className="size-4" aria-hidden />
          Scan Medicine
        </span>
        <button
          onClick={switchCamera}
          disabled={state !== 'ready' || capturedUrl !== null}
          className="focus-ring rounded-full bg-slate-950/60 p-2.5 text-white transition hover:bg-slate-900 disabled:opacity-40"
          aria-label="Switch camera"
        >
          <SwitchCamera className="size-5" aria-hidden />
        </button>
      </div>

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 pb-10">
        {state === 'error' && (
          <div className="mx-auto max-w-sm rounded-2xl bg-slate-900/95 p-5 text-center ring-1 ring-slate-700">
            <CircleAlert className="mx-auto size-8 text-amber-400" aria-hidden />
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{error}</p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => void startStream()}
                className="focus-ring rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Try again
              </button>
              <button
                onClick={handleClose}
                className="focus-ring rounded-xl px-4 py-2 text-sm font-semibold text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {state === 'ready' && !capturedUrl && (
          <div className="flex items-center justify-center">
            <button
              onClick={capture}
              className="focus-ring group relative flex size-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition active:scale-95"
              aria-label="Capture photo"
            >
              <Camera className="size-8" aria-hidden />
            </button>
          </div>
        )}

        {capturedUrl && (
          <div className="mx-auto flex max-w-sm items-center justify-between gap-4 rounded-2xl bg-slate-900/95 p-4 ring-1 ring-slate-700">
            <button
              onClick={() => {
                URL.revokeObjectURL(capturedUrl)
                setCapturedUrl(null)
                setCapturedBlob(null)
              }}
              className="focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              <RefreshCcw className="size-4" aria-hidden />
              Retake
            </button>
            <p className="text-xs text-slate-400">Review your capture</p>
            <button
              onClick={confirm}
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Use photo
            </button>
          </div>
        )}

        {state === 'starting' && !capturedUrl && (
          <p className="text-center text-sm text-slate-300">Starting camera…</p>
        )}
      </div>
    </div>
  )
}
