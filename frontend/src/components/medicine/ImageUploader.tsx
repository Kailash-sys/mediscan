import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { Camera, ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { Button } from '../ui/Button'
import type { PendingImage } from '../../types/analysis'

interface ImageUploaderProps {
  images: PendingImage[]
  onFilesSelected: (files: File[]) => void
  onRemove: (id: string) => void
  onOpenCamera: () => void
  disabled?: boolean
}

export function ImageUploader({
  images,
  onFilesSelected,
  onRemove,
  onOpenCamera,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files ?? [])
    if (files.length > 0) onFilesSelected(files)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onFilesSelected(files)
    // Reset so selecting the same file again re-triggers onChange.
    e.target.value = ''
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors sm:py-14 ${
          dragging
            ? 'border-sky-500 bg-sky-50/80'
            : 'border-slate-300 bg-slate-50/60 hover:border-sky-400 hover:bg-sky-50/40'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          <UploadCloud className="size-7" aria-hidden />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
          Upload medicine images
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-slate-500">
          Drag &amp; drop your medicine images here, or browse files. You can add multiple images
          — one for each medicine works best.
        </p>
        <p className="mt-1 text-xs text-slate-400">JPG or PNG · up to 10 MB per image</p>

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button onClick={() => inputRef.current?.click()} size="lg">
            <ImagePlus className="size-5" aria-hidden />
            Browse files
          </Button>
          <Button onClick={onOpenCamera} variant="secondary" size="lg">
            <Camera className="size-5" aria-hidden />
            Scan Medicine
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          className="sr-only"
          onChange={handleInputChange}
          aria-label="Select medicine images"
        />
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              {images.length} {images.length === 1 ? 'image' : 'images'} ready
            </h4>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <li
                key={image.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={image.previewUrl}
                    alt={image.file.name || 'Medicine capture'}
                    className="size-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(image.id)}
                  className="focus-ring absolute top-2 right-2 rounded-full bg-white/95 p-1.5 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${image.file.name || 'image'}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
                <div className="border-t border-slate-100 px-2.5 py-2">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {image.file.name || 'Camera capture'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {image.source === 'camera' ? 'Camera' : 'Upload'} ·{' '}
                    {(image.file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
