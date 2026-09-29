import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AnalyzeResponse } from '../types/analysis'

/**
 * The last successful analysis, kept in memory (survives in-app navigation).
 * History entries carry their own copy of the full backend response, so the
 * details modal does not depend on this context.
 */
interface AnalysisContextValue {
  analysis: AnalyzeResponse | null
  analyzedFileNames: string[]
  setAnalysis: (analysis: AnalyzeResponse, fileNames: string[]) => void
  clearAnalysis: () => void
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysisState] = useState<AnalyzeResponse | null>(null)
  const [analyzedFileNames, setAnalyzedFileNames] = useState<string[]>([])

  const setAnalysis = useCallback((next: AnalyzeResponse, fileNames: string[]) => {
    setAnalysisState(next)
    setAnalyzedFileNames(fileNames)
  }, [])

  const clearAnalysis = useCallback(() => {
    setAnalysisState(null)
    setAnalyzedFileNames([])
  }, [])

  const value = useMemo(
    () => ({ analysis, analyzedFileNames, setAnalysis, clearAnalysis }),
    [analysis, analyzedFileNames, setAnalysis, clearAnalysis],
  )

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysis must be used inside <AnalysisProvider>')
  return ctx
}
