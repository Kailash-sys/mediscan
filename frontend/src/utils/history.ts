/**
 * Local analysis history.
 *
 * The backend does not provide a history API, so analyses are remembered in
 * localStorage only (per browser). No backend endpoint is invented.
 */

import type { AnalyzeResponse } from '../types/analysis'

export interface HistoryEntry {
  id: string
  timestamp: number
  imageCount: number
  fileNames: string[]
  medicines: string[]
  numberOfMedicines: number
  numberOfPairs: number
  interactionSummaries: {
    drug_a: string
    drug_b: string
    severity: string
    interaction_found: boolean
  }[]
  /** Full backend response so details can be re-opened. */
  response: AnalyzeResponse
  /** Data URLs of the analyzed images so history can show thumbnails. */
  imagePreviews: string[]
}

const STORAGE_KEY = 'mediscan_history_v1'
const MAX_ENTRIES = 25

function safeParse(raw: string | null): unknown {
  try {
    return JSON.parse(raw ?? '[]')
  } catch {
    return []
  }
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY))
  return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : []
}

/** Downscale an image file to a small JPEG data URL for history thumbnails. */
function fileToThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const max = 96
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      } else {
        resolve('')
      }
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      resolve('')
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

export async function addHistoryEntry(
  response: AnalyzeResponse,
  files: File[],
): Promise<HistoryEntry> {
  const thumbnails = await Promise.all(files.slice(0, 4).map(fileToThumbnail))

  const entry: HistoryEntry = {
    id: `an_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    imageCount: files.length,
    fileNames: files.map((f) => f.name || 'Camera capture'),
    medicines: response.medicines,
    numberOfMedicines: response.number_of_medicines,
    numberOfPairs: response.number_of_pairs,
    interactionSummaries: response.interactions.map((i) => ({
      drug_a: i.drug_a,
      drug_b: i.drug_b,
      severity: i.result.severity,
      interaction_found: i.result.interaction_found,
    })),
    response,
    imagePreviews: thumbnails,
  }

  try {
    const history = [entry, ...getHistory()].slice(0, MAX_ENTRIES)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    // Storage full or unavailable — keep the session usable, drop oldest entries.
    console.warn('[MediScan] Could not persist history:', e)
  }

  return entry
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('[MediScan] Could not update history:', e)
  }
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('[MediScan] Could not clear history:', e)
  }
}
