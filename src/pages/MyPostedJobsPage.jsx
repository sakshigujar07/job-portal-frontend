import { useState, useEffect } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar'
import {
  cardStyle,
  pageHeading,
  buttonStyle,
  linkStyle,
  errorMsgStyle,
  TEXT_MUTED,
  ERROR_TEXT,
} from '../theme'

const editLinkStyle = {
  ...buttonStyle,
  textDecoration: 'none',
  display: 'inline-block',
}

const deleteButtonStyle = {
  ...buttonStyle,
  background: '#fff',
  color: ERROR_TEXT,
  border: `1px solid ${ERROR_TEXT}`,
}

function MyPostedJobsPage() {
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState('')
  const [deleteStatus, setDeleteStatus] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10

  const getErrorText = (errData) => {
    if (typeof errData === 'string') return errData
    if (errData?.message) return errData.message
    if (errData && typeof errData === 'object') {
      const firstKey = Object.keys(errData)[0]
      return firstKey ? `${firstKey}: ${errData[firstKey]}` : 'Unknown error'
    }
    return 'Unknown error'
  }

  const fetchJobs = async (targetPage = page) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await api.get('/jobs/my', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: targetPage, size: pageSize }
      })
      setJobs(res.data.content)
      setTotalPages(res.data.totalPages)
      setError('')
    } catch (err) {
      console.log('Failed to fetch jobs:', err.response?.data)
      setError('Failed to load jobs: ' + getErrorText(err.response?.data))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(page)
  }, [page])

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm('Delete this job? This cannot be undone.')
    if (!confirmed) return
    try {
      const token = localStorage.getItem('token')
      await api.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDeleteStatus((prev) => ({ ...prev, [jobId]: 'Deleted!' }))
      fetchJobs(page)
    } catch (err) {
      console.log('Delete failed:', err.response?.data)
      setDeleteStatus((prev) => ({ ...prev, [jobId]: 'Delete failed: ' + getErrorText(err.response?.data) }))
    }
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto 50px', padding: '0 16px', fontFamily: 'Arial' }}>
        <h1 style={pageHeading}>My Posted Jobs</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link to="/post-job" style={linkStyle}>+ Post a New Job</Link>
        </p>
        {error && <p style={errorMsgStyle}>{error}</p>}
        {isLoading && <p style={{ color: TEXT_MUTED }}>Loading...</p>}
        {!isLoading && jobs.length === 0 && !error && (
          <p style={{ color: TEXT_MUTED }}>You haven't posted any jobs yet.</p>
        )}
        {jobs.map((job) => (
          <div key={job.id} style={{ ...cardStyle, marginBottom: '15px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px' }}>{job.title}</h2>
            <p style={{ margin: '0 0 4px' }}>
              <strong>{job.companyName}</strong> — {job.location}
            </p>
            <p style={{ margin: '0 0 12px', color: TEXT_MUTED }}>Salary: {job.salary}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Link to={`/edit-job/${job.id}`} style={editLinkStyle}>Edit</Link>
              <button onClick={() => handleDelete(job.id)} style={deleteButtonStyle}>Delete</button>
            </div>
            {deleteStatus[job.id] && deleteStatus[job.id].startsWith('Delete failed') && (
              <p style={errorMsgStyle}>{deleteStatus[job.id]}</p>
            )}
          </div>
        ))}
        {!isLoading && jobs.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              style={{ ...buttonStyle, opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ color: TEXT_MUTED }}>Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
              style={{ ...buttonStyle, opacity: page + 1 >= totalPages ? 0.5 : 1, cursor: page + 1 >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPostedJobsPage