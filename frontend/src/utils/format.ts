/** Small shared formatting helpers. */

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Maximum severity label from a list of backend severity strings (for history summary). */
export function highestSeverity(severities: string[]): string {
  const rank: Record<string, number> = { Major: 4, Moderate: 3, Minor: 2, None: 1, Unknown: 0 }
  return severities.reduce(
    (max, s) => ((rank[s] ?? 0) > (rank[max] ?? 0) ? s : max),
    'Unknown',
  )
}
