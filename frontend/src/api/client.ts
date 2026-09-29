/**
 * Central API client (axios instance + error normalization).
 * The base URL comes from the environment — never hardcode it elsewhere.
 */

import axios, { AxiosError } from 'axios'

/** Normalized error shape every page/component can rely on. */
export interface ApiError {
  /** Short, user-friendly message. */
  message: string
  /** Optional machine-readable reason for branching UI logic. */
  code:
    | 'network'
    | 'server'
    | 'not_found'
    | 'invalid_request'
    | 'unsupported_file'
    | 'no_text_extracted'
    | 'unknown'
}

/** Marker property attached to normalized errors so normalization is idempotent. */
const IS_NORMALIZED = '__mediscanNormalized'

function normalizedError(error: ApiError): ApiError {
  Object.defineProperty(error, IS_NORMALIZED, { value: true, enumerable: false })
  return error
}

/** Type guard: was this error already normalized? */
function isNormalizedError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    IS_NORMALIZED in value &&
    (value as Record<string, unknown>)[IS_NORMALIZED] === true
  )
}

const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '')

if (!baseURL) {
  // Fail loudly in the console during development instead of silently
  // hitting relative URLs that don't exist.
  console.warn(
    '[MediScan] VITE_API_BASE_URL is not set. Copy frontend/.env.example to frontend/.env ' +
      'and point it at your FastAPI backend (e.g. http://localhost:8000).',
  )
}

export const apiClient = axios.create({
  baseURL: baseURL ?? '',
  // Analysis runs OCR + several LLM/label lookups sequentially on the server,
  // which can take several minutes on CPU. Allow up to 10 minutes.
  timeout: 600_000,
})

/**
 * Convert any thrown value (axios error, backend error payload, unknown) into
 * a predictable ApiError with a human-friendly message.
 * Idempotent: already-normalized errors pass through unchanged.
 */
export function normalizeApiError(err: unknown): ApiError {
  // If the error was already normalized (e.g. in the API layer and again in a
  // page), return it unchanged instead of degrading the friendly message.
  if (isNormalizedError(err)) {
    return err
  }

  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError<{ detail?: string | { msg?: string }[] }>

    if (axiosError.code === 'ECONNABORTED') {
      return normalizedError({
        message: 'The analysis took too long and was stopped. Please try again.',
        code: 'network',
      })
    }

    if (!axiosError.response) {
      return normalizedError({
        message:
          'Cannot reach the MediScan server. Make sure the backend is running and reachable.',
        code: 'network',
      })
    }

    const status = axiosError.response.status
    const detail = axiosError.response.data?.detail

    let backendMessage: string | undefined
    if (typeof detail === 'string') {
      backendMessage = detail
    } else if (Array.isArray(detail) && detail.length > 0) {
      backendMessage = detail.map((d) => d.msg).filter(Boolean).join('; ')
    }

    if (status === 400) {
      const msg = backendMessage ?? 'The request was not valid.'
      const code: ApiError['code'] = /unsupported file type/i.test(msg)
        ? 'unsupported_file'
        : /no useful text/i.test(msg)
          ? 'no_text_extracted'
          : 'invalid_request'
      return normalizedError({ message: msg, code })
    }

    if (status === 404) {
      return normalizedError({
        message: 'The requested resource was not found.',
        code: 'not_found',
      })
    }

    if (status >= 500) {
      return normalizedError({
        message: backendMessage ?? 'The MediScan server hit an internal error. Please try again.',
        code: 'server',
      })
    }

    return normalizedError({
      message: backendMessage ?? 'Something went wrong. Please try again.',
      code: 'unknown',
    })
  }

  return normalizedError({
    message: err instanceof Error ? err.message : 'An unexpected error occurred.',
    code: 'unknown',
  })
}
