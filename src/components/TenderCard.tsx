import { memo } from 'react'
import type { Tender } from '../types'
import { formatAmount, formatDate, isDeadlineSoon } from '../utils/format'
import { InfoBlock } from './InfoBlock'
import { StatusBadge } from './StatusBadge'

interface TenderCardProps {
  tender: Tender
}

export const TenderCard = memo(({ tender }: TenderCardProps) => {
  const deadline = tender.tenderPeriod?.endDate
  const deadlineSoon = isDeadlineSoon(deadline)

  return (
    <article
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {tender.tenderID}
          </span>
          <h2 style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: 600, color: '#111827', lineHeight: '1.4' }}>
            {tender.title || 'Без назви'}
          </h2>
        </div>
        <StatusBadge status={tender.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <InfoBlock
          label="Очікувана вартість"
          value={tender.value ? formatAmount(tender.value.amount, tender.value.currency) : '—'}
        />
        <InfoBlock
          label="Дедлайн подачі"
          value={formatDate(deadline)}
          accentColor={deadlineSoon ? '#ef4444' : undefined}
          extra={deadlineSoon ? '⚠ Незабаром' : undefined}
        />
      </div>

      <a
        href={`https://prozorro.gov.ua/tender/${tender.tenderID}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
      >
        Відкрити на ProZorro →
      </a>
    </article>
  )
})
