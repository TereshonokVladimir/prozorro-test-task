import { memo } from 'react'

interface Example {
  edrpou: string
  label: string
}

interface ExampleBarProps {
  examples: Example[]
  onSelect: (edrpou: string) => void
  disabled?: boolean
}

export const ExampleBar = memo(({ examples, onSelect, disabled }: ExampleBarProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    }}
  >
    <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>Приклади:</span>
    {examples.map((ex) => (
      <button
        key={ex.edrpou}
        disabled={disabled}
        onClick={() => onSelect(ex.edrpou)}
        style={{
          padding: '4px 12px',
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '999px',
          fontSize: '12px',
          color: '#374151',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: 500,
        }}
      >
        {ex.edrpou} · {ex.label}
      </button>
    ))}
  </div>
))
