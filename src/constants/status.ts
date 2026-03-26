export interface StatusStyle {
  bg: string
  text: string
}

export const STATUS_LABELS: Record<string, string> = {
  'active.tendering': 'Прийом пропозицій',
  'active.enquiries': 'Уточнення',
  'active.auction': 'Аукціон',
  'active.qualification': 'Кваліфікація',
  'active.awarded': 'Очікування договору',
  active: 'Активний',
  complete: 'Завершено',
  cancelled: 'Скасовано',
  unsuccessful: 'Не відбувся',
  draft: 'Чернетка',
}

export const STATUS_STYLES: Record<string, StatusStyle> = {
  'active.tendering': { bg: '#dcfce7', text: '#166534' },
  'active.enquiries': { bg: '#dbeafe', text: '#1e40af' },
  'active.auction': { bg: '#fef9c3', text: '#854d0e' },
  'active.qualification': { bg: '#ede9fe', text: '#5b21b6' },
  'active.awarded': { bg: '#fce7f3', text: '#9d174d' },
  active: { bg: '#dcfce7', text: '#166534' },
  complete: { bg: '#f3f4f6', text: '#374151' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
  unsuccessful: { bg: '#ffedd5', text: '#9a3412' },
  draft: { bg: '#f3f4f6', text: '#6b7280' },
}

export const DEFAULT_STATUS_STYLE: StatusStyle = { bg: '#f3f4f6', text: '#374151' }
