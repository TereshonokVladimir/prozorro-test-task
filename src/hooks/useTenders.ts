import { useCallback, useRef, useState } from 'react'
import { fetchTendersByEdrpou, NotFoundError } from '../api/prozorro'
import type { CountOption } from '../api/prozorro'
import { tenderCache } from '../services/tenderCache'
import type { Tender } from '../types'

export interface TendersState {
  tenders: Tender[]
  loading: boolean
  error: string | null
  notFound: boolean
  found: number
  searched: number
  limit: CountOption
  cachedAt: string | null
  cachedEdrpou: string | null
}

function buildInitialState(): TendersState {
  const cached = tenderCache.load()
  return {
    tenders: cached?.tenders ?? [],
    loading: false,
    error: null,
    notFound: false,
    found: 0,
    searched: 0,
    limit: 5,
    cachedAt: cached?.fetchedAt ?? null,
    cachedEdrpou: cached?.edrpou ?? null,
  }
}

export function useTenders() {
  const [state, setState] = useState<TendersState>(buildInitialState)
  const abortRef = useRef<AbortController | null>(null)

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const load = useCallback(async (edrpou: string, limit: CountOption) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      notFound: false,
      found: 0,
      searched: 0,
      limit,
    }))

    try {
      const tenders = await fetchTendersByEdrpou(
        edrpou,
        limit,
        controller.signal,
        (found, searched) => setState((prev) => ({ ...prev, found, searched })),
      )

      tenderCache.save(edrpou, tenders)

      setState((prev) => ({
        ...prev,
        tenders,
        loading: false,
        found: tenders.length,
        cachedAt: new Date().toISOString(),
        cachedEdrpou: edrpou,
      }))
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setState((prev) => ({ ...prev, loading: false }))
        return
      }
      if (err instanceof NotFoundError) {
        setState((prev) => ({
          ...prev,
          loading: false,
          notFound: true,
          tenders: [],
          searched: err.searched,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Невідома помилка',
        }))
      }
    }
  }, [])

  return { ...state, load, cancel }
}
