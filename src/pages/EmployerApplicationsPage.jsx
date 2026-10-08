import { useState, useEffect } from 'react'
import api from '../api'
import Navbar from '../Navbar'
import {
  cardStyle,
  pageHeading,
  buttonStyle,
  errorMsgStyle,
  successMsgStyle,
  TEXT_MUTED,
  ERROR_TEXT,
} from '../theme'

const rejectButtonStyle = {
  ...buttonStyle,
  background: '#fff',
  color: ERROR_TEXT,
  border: `1px solid ${ERROR_TEXT}`,
}

function EmployerApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const [updateStatus, setUpdateStatus] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const getErrorText = (errData) => {
    if (typeof errData === 'string') return errData
    if (errData?.message) return errData.message
    if (errData && typeof errData === 'object') {
      const firstKey = Object.keys(errData)[0]
      return firstKey ? `${firstKey}: ${errData[firstKey]}` : 'Unknown error'
    }
    return 'Unknown error'
  }

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/applications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApplications(response.data)
      setError('')
    } catch (err) {
      console.log('Failed to fetch applications:', err.response?.data)
      setError('Failed to load applications: ' + getErrorText(err.response?.data))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleStatusUpdate = async (appId, newStatus) => {
    if (newStatus === 'HIRED' || newStatus === 'REJECTED') {
      const confirmed = window.confirm(`Mark this application as ${newStatus}? This cannot be undone.`)
      if (!confirmed) return
    }
    try {
      const token = localStorage.getItem('token')
      await api.put(
        `/applications/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUpdateStatus((prev) => ({ ...prev, [appId]: `Updated to ${newStatus}!` }))
      fetchApplications()
    } catch (err) {
      console.log('Update failed:', err.response?.data)
      setUpdateStatus((prev) => ({ ...prev, [appId]: 'Update failed: ' + getErrorText(err.response?.data) }))
    }
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto 50px', padding: '0 16px', fontFamily: 'Arial' }}>
        <h1 style={pageHeading}>Applications for My Jobs</h1>
        {error && <p style={errorMsgStyle}>{error}</p>}
        {isLoading && <p style={{ color: TEXT_MUTED }}>Loading...</p>}
        {!isLoading && applications.length === 0 && !error && (
          <p style={{ color: TEXT_MUTED }}>No applications yet.</p>
        )}
        {applications.map((app) => (
          <div key={app.id} style={{ ...cardStyle, marginBottom: '15px' }}>
            <p style={{ margin: '0 0 6px' }}>
              <strong>{app.jobTitle}</strong> — Applicant: {app.applicantName}
            </p>
            <p style={{ margin: '0 0 12px', color: TEXT_MUTED }}>
              Status: <strong>{app.status}</strong>
            </p>
            {app.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')} style={buttonStyle}>Shortlist</button>
                <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} style={rejectButtonStyle}>Reject</button>
              </div>
            )}
            {app.status === 'SHORTLISTED' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleStatusUpdate(app.id, 'HIRED')} style={buttonStyle}>Hire</button>
                <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} style={rejectButtonStyle}>Reject</button>
              </div>
            )}
            {updateStatus[app.id] && (
              <p style={updateStatus[app.id].startsWith('Update failed') ? errorMsgStyle : successMsgStyle}>
                {updateStatus[app.id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmployerApplicationsPage