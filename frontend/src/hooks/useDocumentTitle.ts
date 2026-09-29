import { useEffect } from 'react'

/** Sets the browser tab title for the current page and restores nothing on unmount. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · MediScan AI`
  }, [title])
}
