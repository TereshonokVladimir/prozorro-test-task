import { memo } from 'react'

interface ErrorBannerProps {
  message: string
  onRetry: () => void
}

export const ErrorBanner = memo(({ message, onRetry }: ErrorBannerProps) => (
  <div
    style={{
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '20px 24px',
      color: '#991b1b',
      textAlign: 'center',
    }}
  >
    <div style={{ fontWeight: 700, marginBottom: '6px' }}>Помилка завантаження</div>
    <div style={{ fontSize: '13px' }}>{message}</div>
    <button
      onClick={onRetry}
      style={{
        marginTop: '14px',
        padding: '7px 16px',
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      Спробувати знову
    </button>
  </div>
))
