import { useState, useEffect } from 'react'
import api from '../api'
import Navbar from '../Navbar'
import { TEXT_MUTED, pageHeading, cardStyle, errorMsgStyle } from '../theme'

const STATUS_COLORS = {
  PENDING: { bg: '#f0ad4e', text: '#fff' },
  SHORTLISTED: { bg: '#4a90d9', text: '#fff' },
  HIRED: { bg: '#5cb85c', text: '#fff' },
  REJECTED: { bg: '#d9636c', text: '#fff' },
}

function StatusChip({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#f0f0f0', text: '#555' }
  return (
    <span
      style={{
        display: 'inline-block',
        background: colors.bg,
        color: colors.text,
        fontWeight: 'bold',
        fontSize: '12px',
        padding: '4px 10px',
        borderRadius: '12px',
      }}
    >
      {status}
    </span>
  )
}

function MyApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await api.get('/applications', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setApplications(response.data)
      } catch (err) {
        console.log('Failed to fetch applications:', err.response?.data)
        setError('Failed to load applications')
      }
    }

    fetchApplications()
  }, [])

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial', padding: '0 16px' }}>
        <h1 style={pageHeading}>My Applications</h1>
        {error && <p style={errorMsgStyle}>{error}</p>}
        {applications.length === 0 && !error && (
          <p style={{ color: TEXT_MUTED, textAlign: 'center' }}>You haven't applied to any jobs yet.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                ...cardStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
              }}
            >
              <p style={{ margin: 0, color: '#333' }}>{app.jobTitle}</p>
              <StatusChip status={app.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyApplicationsPage