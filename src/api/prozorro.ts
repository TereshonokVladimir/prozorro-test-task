import type { ApiListResponse, ApiTenderResponse, Tender, TenderListItem } from '../types'

const BASE_URL = '/prozorro-api/api/2.5'
export const COUNT_OPTIONS = [5, 10, 20] as const
export type CountOption = (typeof COUNT_OPTIONS)[number]

const PAGE_SIZE = 100

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class NotFoundError extends Error {
  readonly edrpou: string
  readonly searched: number

  constructor(edrpou: string, searched: number) {
    super(`ЄДРПОУ ${edrpou} не знайдено серед ${searched} останніх тендерів`)
    this.name = 'NotFoundError'
    this.edrpou = edrpou
    this.searched = searched
  }
}

async function getTenderDetails(id: string, signal: AbortSignal): Promise<Tender> {
  const res = await fetch(`${BASE_URL}/tenders/${id}`, { signal })
  if (!res.ok) throw new Error(`Помилка завантаження тендера ${id}: ${res.status}`)
  const json: ApiTenderResponse = await res.json()
  return json.data
}

async function getTenderPage(signal: AbortSignal, offset?: string): Promise<ApiListResponse> {
  const params = new URLSearchParams({
    opt_fields: 'status,tenderID,tenderPeriod,procuringEntity',
    descending: '1',
    limit: String(PAGE_SIZE),
  })
  if (offset) params.set('offset', offset)

  const res = await fetch(`${BASE_URL}/tenders?${params}`, { signal })
  if (!res.ok) throw new Error(`Помилка API: ${res.status}`)
  return res.json()
}

export type ProgressCallback = (found: number, searched: number) => void

export async function fetchTendersByEdrpou(
  edrpou: string,
  limit: CountOption,
  signal: AbortSignal,
  onProgress?: ProgressCallback,
): Promise<Tender[]> {
  const matched: TenderListItem[] = []
  let offset: string | undefined
  let totalSearched = 0

  while (matched.length < limit) {
    const response = await getTenderPage(signal, offset)
    totalSearched += response.data.length

    for (const item of response.data) {
      if (item.procuringEntity?.identifier?.id === edrpou) {
        matched.push(item)
        if (matched.length >= limit) break
      }
    }

    onProgress?.(matched.length, totalSearched)

    if (!response.next_page?.offset || response.data.length === 0) break
    offset = response.next_page.offset

    await delay(80)
  }

  if (matched.length === 0) throw new NotFoundError(edrpou, totalSearched)

  return Promise.all(
    matched.slice(0, limit).map((item) => getTenderDetails(item.id, signal)),
  )
}
