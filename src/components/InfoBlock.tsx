import { memo } from 'react'

export interface InfoBlockProps {
  label: string
  value: string
  accentColor?: string
  extra?: string
}

export const InfoBlock = memo(({ label, value, accentColor, extra }: InfoBlockProps) => (
  <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 14px' }}>
    <div
      style={{
        fontSize: '11px',
        color: '#9ca3af',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: '14px',
        fontWeight: 700,
        color: accentColor ?? '#111827',
        marginTop: '4px',
      }}
    >
      {value}
    </div>
    {extra && (
      <div style={{ fontSize: '11px', color: accentColor ?? '#ef4444', marginTop: '2px', fontWeight: 600 }}>
        {extra}
      </div>
    )}
  </div>
))
