/**
 * Medicine analysis API — talks to the real FastAPI backend.
 * Endpoint discovered from app/api/routes/analysis.py: POST /analysis/analyze-images
 * (multipart/form-data, repeated "files" parts, images: jpeg/png/jpg only).
 */

import { apiClient, normalizeApiError } from './client'
import type { AnalyzeResponse } from '../types/analysis'

/** Keep in sync with the backend's allowed_types list. */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'] as const
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB per image

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileValidationError'
  }
}

/** Validate a file against the same rules the backend enforces (fast feedback). */
export function validateImageFile(file: File): void {
  const mime = (file.type || '').toLowerCase()
  if (!ALLOWED_MIME_TYPES.includes(mime as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new FileValidationError(
      `"${file.name || 'Camera capture'}" is not supported. Please use a JPG or PNG image.`,
    )
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new FileValidationError(
      `"${file.name || 'Camera capture'}" is larger than 10 MB. Please use a smaller image.`,
    )
  }
}

/**
 * Upload one or more medicine images to POST /analysis/analyze-images.
 * Returns the full analysis payload produced by the backend.
 */
export async function analyzeImages(files: File[], signal?: AbortSignal): Promise<AnalyzeResponse> {
  if (files.length === 0) {
    throw new FileValidationError('Please add at least one medicine image before analyzing.')
  }

  for (const file of files) {
    validateImageFile(file)
  }

  const formData = new FormData()
  for (const file of files) {
    // The backend declares `files: list[UploadFile]`, so each file is a
    // separate "files" form part.
    formData.append('files', file, file.name || 'capture.jpg')
  }

  try {
    const { data } = await apiClient.post<AnalyzeResponse>('/analysis/analyze-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
    })
    return data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/** GET /health/ — cheap connectivity probe used on the dashboard. */
export async function checkBackendHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const { data } = await apiClient.get<{ status: string }>('/health/', { signal })
    return data?.status === 'healthy'
  } catch {
    return false
  }
}
