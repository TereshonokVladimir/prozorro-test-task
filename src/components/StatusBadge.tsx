import { memo } from 'react'
import { DEFAULT_STATUS_STYLE, STATUS_LABELS, STATUS_STYLES } from '../constants/status'

interface StatusBadgeProps {
  status: string
}

export const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const label = STATUS_LABELS[status] ?? status
  const { bg, text } = STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE

  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
})
