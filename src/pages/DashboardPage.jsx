import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Navbar from '../Navbar'
import {
  ACCENT,
  BORDER,
  pageHeading,
  sectionLabel,
  cardStyle as themeCardStyle,
  linkStyle,
  errorMsgStyle,
} from '../theme'

function getRoleFromToken(token) {
  if (!token) return null
  try {
    const payloadBase64 = token.split('.')[1]
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    return payload.role || null
  } catch (err) {
    return null
  }
}

const cardStyle = {
  border: `1px solid ${BORDER}`,
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  background: '#fff',
  padding: '16px',
  textAlign: 'center',
  flex: '1',
}

const numberStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '4px 0',
  color: ACCENT,
}

const labelStyle = {
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#555',
}

const jobCardBase = {
  display: 'block',
  borderRadius: '10px',
  padding: '12px 16px',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

function DashboardPage() {
  const token = localStorage.getItem('token')
  const role = getRoleFromToken(token)

  const [jobseekerStats, setJobseekerStats] = useState(null)
  const [employerStats, setEmployerStats] = useState(null)
  const [latestJobs, setLatestJobs] = useState(null)
  const [mySkills, setMySkills] = useState([])
  const [statsError, setStatsError] = useState('')

  useEffect(() => {
    const loadJobseekerStats = async () => {
      try {
        const response = await api.get('/applications', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const apps = response.data
        setJobseekerStats({
          total: apps.length,
          pending: apps.filter((a) => a.status === 'PENDING').length,
          shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
          hired: apps.filter((a) => a.status === 'HIRED').length,
        })
      } catch (err) {
        setStatsError('Could not load your application stats.')
      }
    }

    const loadMySkills = async () => {
      try {
        const response = await api.get('/profiles/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const skillsList = (response.data.skills || '')
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
        setMySkills(skillsList)
      } catch (err) {
        setMySkills([])
      }
    }

    const loadLatestJobs = async () => {
      try {
        const response = await api.get('/jobs', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 0, size: 20 },
        })
        const jobs = [...response.data.content].sort((a, b) => b.id - a.id).slice(0, 4)
        setLatestJobs(jobs)
      } catch (err) {
        setLatestJobs([])
      }
    }

    const loadEmployerStats = async () => {
      try {
        const [jobsCountRes, applicationsRes] = await Promise.allSettled([
          api.get('/jobs/my/count', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/applications', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const jobsPosted = jobsCountRes.status === 'fulfilled' ? jobsCountRes.value.data : null
        const applicationsReceived =
          applicationsRes.status === 'fulfilled' ? applicationsRes.value.data.length : null

        setEmployerStats({ jobsPosted, applicationsReceived })
      } catch (err) {
        setStatsError('Could not load your stats.')
      }
    }

    if (role === 'jobseeker') {
      loadJobseekerStats()
      loadMySkills()
      loadLatestJobs()
    } else if (role === 'employer') {
      loadEmployerStats()
    }
  }, [role, token])

  const jobMatchesSkills = (job) => {
    if (mySkills.length === 0) return false
    const text = `${job.title || ''} ${job.description || ''}`.toLowerCase()
    return mySkills.some((skill) => text.includes(skill))
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial', padding: '0 16px' }}>
        <h1 style={pageHeading}>Dashboard</h1>

        {statsError && <p style={errorMsgStyle}>{statsError}</p>}

        {role === 'jobseeker' && (
          <>
            {jobseekerStats && jobseekerStats.total === 0 && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: '#555' }}>You haven't applied to any jobs yet.</p>
                <p>
                  <Link style={linkStyle} to="/jobs">Browse Jobs</Link>
                  <span style={{ color: '#aaa' }}> · </span>
                  <Link style={linkStyle} to="/profile">Complete Your Profile</Link>
                </p>
              </div>
            )}

            {jobseekerStats && jobseekerStats.total > 0 && (
              <>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <div style={cardStyle}>
                    <div style={labelStyle}>Total Applied</div>
                    <div style={numberStyle}>{jobseekerStats.total}</div>
                  </div>
                  <div style={cardStyle}>
                    <div style={labelStyle}>Pending</div>
                    <div style={numberStyle}>{jobseekerStats.pending}</div>
                  </div>
                  <div style={cardStyle}>
                    <div style={labelStyle}>Shortlisted</div>
                    <div style={numberStyle}>{jobseekerStats.shortlisted}</div>
                  </div>
                  <div style={cardStyle}>
                    <div style={labelStyle}>Hired</div>
                    <div style={numberStyle}>{jobseekerStats.hired}</div>
                  </div>
                </div>
                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                  <Link style={linkStyle} to="/my-applications">View My Applications</Link>
                </p>
              </>
            )}

            {!jobseekerStats && !statsError && <p style={{ color: '#555' }}>Loading your stats...</p>}

            {latestJobs && latestJobs.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={sectionLabel}>Latest Jobs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {latestJobs.map((job) => {
                    const matches = jobMatchesSkills(job)
                    return (
                      <Link
                        key={job.id}
                        to={`/jobs/${job.id}`}
                        style={{
                          ...jobCardBase,
                          border: matches ? '1px solid #4caf50' : `1px solid ${BORDER}`,
                          background: matches ? '#f4fbf4' : '#fff',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: '#111' }}>{job.title}</strong>
                          {matches && (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#2e7d32',
                                border: '1px solid #4caf50',
                                borderRadius: '10px',
                                padding: '2px 8px',
                              }}
                            >
                              Matches your skills
                            </span>
                          )}
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          {job.companyName} — {job.location}
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <p style={{ marginTop: '10px', textAlign: 'center' }}>
                  <Link style={linkStyle} to="/jobs">View All Jobs</Link>
                </p>
              </div>
            )}
          </>
        )}

        {role === 'employer' && (
          <>
            {employerStats ? (
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <div style={cardStyle}>
                  <div style={labelStyle}>Jobs Posted</div>
                  <div style={numberStyle}>
                    {employerStats.jobsPosted === null ? '—' : employerStats.jobsPosted}
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={labelStyle}>Applications Received</div>
                  <div style={numberStyle}>
                    {employerStats.applicationsReceived === null
                      ? '—'
                      : employerStats.applicationsReceived}
                  </div>
                </div>
              </div>
            ) : (
              !statsError && <p style={{ color: '#555' }}>Loading your stats...</p>
            )}
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link style={linkStyle} to="/my-jobs">Manage Jobs</Link>
              <span style={{ color: '#aaa' }}> · </span>
              <Link style={linkStyle} to="/employer-applications">View Applications</Link>
            </p>
          </>
        )}

        {role !== 'jobseeker' && role !== 'employer' && (
          <p style={{ color: '#888', textAlign: 'center' }}>Could not determine your role.</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage