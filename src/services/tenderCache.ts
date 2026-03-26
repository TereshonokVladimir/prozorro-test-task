import type { Tender } from '../types'

const STORAGE_KEY = 'prozorro_last_result'

export interface CachedResult {
  edrpou: string
  tenders: Tender[]
  fetchedAt: string
}

export const tenderCache = {
  load(): CachedResult | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CachedResult) : null
    } catch {
      return null
    }
  },

  save(edrpou: string, tenders: Tender[]): void {
    try {
      const payload: CachedResult = {
        edrpou,
        tenders,
        fetchedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // quota exceeded or private browsing — silently skip
    }
  },
}
