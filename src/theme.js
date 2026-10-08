// Shared design tokens — import these instead of hardcoding colors/shadows
// in each page. Change a value here and it updates everywhere.

export const ACCENT = '#2563eb'
export const ACCENT_HOVER = '#1d4ed8'
export const TEXT_DARK = '#111'
export const TEXT_MUTED = '#555'
export const TEXT_LIGHT = '#888'
export const BORDER = '#d6d6d6'
export const ERROR_BG = '#fdecea'
export const ERROR_TEXT = '#b3261e'
export const SUCCESS_BG = '#e8f5e9'
export const SUCCESS_TEXT = '#2e7d32'

export const CARD_SHADOW = '0 2px 10px rgba(0,0,0,0.08)'
export const CARD_SHADOW_SM = '0 2px 8px rgba(0,0,0,0.06)'

export const pageHeading = {
  textAlign: 'center',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
}

export const sectionLabel = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 12px',
}

export const cardStyle = {
  border: `1px solid ${BORDER}`,
  borderRadius: '10px',
  boxShadow: CARD_SHADOW,
  background: '#fff',
  padding: '16px',
}

export const inputStyle = {
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
}

export const buttonStyle = {
  padding: '9px 20px',
  background: ACCENT,
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

export const linkStyle = {
  color: ACCENT,
  fontWeight: 'bold',
  textDecoration: 'none',
}

export const errorMsgStyle = {
  background: ERROR_BG,
  color: ERROR_TEXT,
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '13px',
}

export const successMsgStyle = {
  background: SUCCESS_BG,
  color: SUCCESS_TEXT,
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '13px',
}