/**
 * Response shape of POST /analysis/analyze-images.
 * Mirrors the dict returned by app/api/routes/analysis.py — do not invent fields.
 */

export interface InteractionResult {
  interaction_found: boolean
  /** "Major" | "Moderate" | "Minor" | "None" | "Unknown" (LLM output) */
  severity: string
  description: string
}

export interface Interaction {
  drug_a: string
  drug_b: string
  result: InteractionResult
}

export type MedicinePair = [string, string]

export interface AnalyzeResponse {
  success: boolean
  files: string[]
  number_of_images: number
  ocr_text: string[]
  cleaned_text: string[]
  medicines: string[]
  number_of_medicines: number
  pairs: MedicinePair[]
  number_of_pairs: number
  interactions: Interaction[]
}

/** A single image queued for analysis, kept in UI state. */
export interface PendingImage {
  id: string
  file: File
  previewUrl: string
  /** "upload" = chosen from disk, "camera" = captured via getUserMedia */
  source: 'upload' | 'camera'
}
