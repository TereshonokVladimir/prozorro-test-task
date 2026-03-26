import { memo } from 'react'

interface NotFoundBannerProps {
  edrpou: string
  searched: number
}

export const NotFoundBanner = memo(({ edrpou, searched }: NotFoundBannerProps) => (
  <div
    style={{
      background: '#fffbeb',
      border: '1px solid #fde68a',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
    <div style={{ fontWeight: 700, fontSize: '15px', color: '#92400e' }}>Тендери не знайдено</div>
    <div style={{ fontSize: '13px', color: '#78350f', marginTop: '6px', lineHeight: 1.6 }}>
      ЄДРПОУ <strong>{edrpou}</strong> не знайдено серед останніх{' '}
      <strong>{searched.toLocaleString('uk-UA')}</strong> тендерів ProZorro.
      <br />
      Можливо, ця організація не розміщує тендери. Спробуйте один з прикладів вище.
    </div>
  </div>
))
