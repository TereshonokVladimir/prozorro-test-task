import { useCallback, useEffect, useState } from 'react'
import { COUNT_OPTIONS } from './api/prozorro'
import type { CountOption } from './api/prozorro'
import { ErrorBanner } from './components/ErrorBanner'
import { ExampleBar } from './components/ExampleBar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { NotFoundBanner } from './components/NotFoundBanner'
import { TenderCard } from './components/TenderCard'
import { useTenders } from './hooks/useTenders'
import { formatDateTime } from './utils/format'

const DEFAULT_EDRPOU = '41447959'
const DEFAULT_LIMIT: CountOption = 5

const EXAMPLES = [
  { edrpou: '40108646', label: 'Департамент патрульної поліції' },
  { edrpou: '04364199', label: 'Петрівська селищна рада' },
  { edrpou: '07747966', label: 'Військова частина А2077' },
]

export default function App() {
  const { tenders, loading, error, notFound, found, searched, cachedAt, cachedEdrpou, load, cancel } =
    useTenders()

  const [inputValue, setInputValue] = useState(DEFAULT_EDRPOU)
  const [limit, setLimit] = useState<CountOption>(DEFAULT_LIMIT)

  const handleSearch = useCallback(
    (edrpou: string, overrideLimit?: CountOption) => {
      const trimmed = edrpou.trim()
      if (!trimmed || loading) return
      setInputValue(trimmed)
      load(trimmed, overrideLimit ?? limit)
    },
    [load, loading, limit],
  )

  const handleLimitChange = useCallback(
    (next: CountOption) => {
      setLimit(next)
      if (inputValue.trim()) load(inputValue.trim(), next)
    },
    [load, inputValue],
  )

  useEffect(() => {
    if (!cachedAt) load(DEFAULT_EDRPOU, DEFAULT_LIMIT)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hasTenders = !loading && tenders.length > 0

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #f9fafb 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Header
        inputValue={inputValue}
        limit={limit}
        loading={loading}
        onInputChange={setInputValue}
        onSearch={() => handleSearch(inputValue)}
        onCancel={cancel}
        onLimitChange={handleLimitChange}
      />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 24px 48px' }}>
        <ExampleBar examples={EXAMPLES} onSelect={handleSearch} disabled={loading} />

        {loading && <LoadingSpinner edrpou={inputValue} found={found} searched={searched} limit={limit} />}
        {error && <ErrorBanner message={error} onRetry={() => handleSearch(inputValue)} />}
        {notFound && <NotFoundBanner edrpou={inputValue} searched={searched} />}

        {hasTenders && (
          <>
            <ResultsHeader
              edrpou={cachedEdrpou ?? inputValue}
              count={tenders.length}
              cachedAt={cachedAt}
              onRefresh={() => handleSearch(cachedEdrpou ?? inputValue)}
              loading={loading}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

interface HeaderProps {
  inputValue: string
  limit: CountOption
  loading: boolean
  onInputChange: (value: string) => void
  onSearch: () => void
  onCancel: () => void
  onLimitChange: (limit: CountOption) => void
}

function Header({ inputValue, limit, loading, onInputChange, onSearch, onCancel, onLimitChange }: HeaderProps) {
  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          height: '64px',
        }}
      >
        <Logo />
        <SearchForm
          value={inputValue}
          loading={loading}
          onChange={onInputChange}
          onSubmit={onSearch}
          onCancel={onCancel}
        />
        <CountSelector value={limit} disabled={loading} onChange={onLimitChange} />
      </div>
    </header>
  )
}

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
      <div
        style={{
          width: '34px',
          height: '34px',
          background: '#2563eb',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: '15px', color: '#111827', whiteSpace: 'nowrap' }}>
        ProZorro
      </span>
    </div>
  )
}

interface SearchFormProps {
  value: string
  loading: boolean
  onChange: (v: string) => void
  onSubmit: () => void
  onCancel: () => void
}

function SearchForm({ value, loading, onChange, onSubmit, onCancel }: SearchFormProps) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit() }}
      style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '420px' }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ЄДРПОУ організації…"
        maxLength={10}
        disabled={loading}
        style={{
          flex: 1,
          padding: '8px 14px',
          border: '1.5px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none',
          fontFamily: 'inherit',
          color: '#111827',
          background: loading ? '#f9fafb' : '#fff',
        }}
      />
      {loading ? (
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            background: '#fef2f2',
            color: '#dc2626',
            border: '1.5px solid #fca5a5',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          Зупинити
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          style={{
            padding: '8px 16px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: !value.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Знайти
        </button>
      )}
    </form>
  )
}

interface CountSelectorProps {
  value: CountOption
  disabled?: boolean
  onChange: (value: CountOption) => void
}

function CountSelector({ value, disabled, onChange }: CountSelectorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      <span style={{ fontSize: '11px', color: '#9ca3af', marginRight: '4px', whiteSpace: 'nowrap' }}>
        Результатів:
      </span>
      {COUNT_OPTIONS.map((n) => (
        <button
          key={n}
          disabled={disabled}
          onClick={() => onChange(n)}
          style={{
            width: '34px',
            height: '30px',
            border: '1.5px solid',
            borderColor: value === n ? '#2563eb' : '#e5e7eb',
            borderRadius: '6px',
            background: value === n ? '#eff6ff' : '#fff',
            color: value === n ? '#2563eb' : '#6b7280',
            fontSize: '13px',
            fontWeight: value === n ? 700 : 400,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

interface ResultsHeaderProps {
  edrpou: string
  count: number
  cachedAt: string | null
  loading: boolean
  onRefresh: () => void
}

function ResultsHeader({ edrpou, count, cachedAt, loading, onRefresh }: ResultsHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111827' }}>
          Тендери ЄДРПОУ {edrpou}
        </h1>
        {cachedAt && (
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
            Оновлено: {formatDateTime(cachedAt)} · {count} результатів
          </p>
        )}
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          padding: '7px 14px',
          background: 'transparent',
          color: '#2563eb',
          border: '1.5px solid #2563eb',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Оновити
      </button>
    </div>
  )
}
