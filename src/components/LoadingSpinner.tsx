import { memo } from 'react'

interface LoadingSpinnerProps {
  edrpou: string
  found: number
  searched: number
  limit: number
}

export const LoadingSpinner = memo(({ edrpou, found, searched, limit }: LoadingSpinnerProps) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    <div
      style={{
        width: '44px',
        height: '44px',
        border: '3px solid #e5e7eb',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 20px',
      }}
    />
    <p style={{ color: '#374151', fontSize: '15px', fontWeight: 600, margin: 0 }}>
      Пошук тендерів…
    </p>
    <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '6px' }}>
      ЄДРПОУ: <strong>{edrpou}</strong>
    </p>
    <div
      style={{
        marginTop: '16px',
        display: 'inline-flex',
        gap: '20px',
        background: '#f3f4f6',
        borderRadius: '10px',
        padding: '10px 20px',
        fontSize: '13px',
      }}
    >
      <span>
        Знайдено: <strong style={{ color: '#2563eb' }}>{found} / {limit}</strong>
      </span>
      <span style={{ color: '#d1d5db' }}>|</span>
      <span style={{ color: '#6b7280' }}>
        Перевірено: <strong>{searched.toLocaleString('uk-UA')}</strong>
      </span>
    </div>
  </div>
))
