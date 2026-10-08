import { useState, useEffect } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import {
  cardStyle,
  pageHeading,
  inputStyle,
  buttonStyle,
  errorMsgStyle,
  successMsgStyle,
  TEXT_MUTED,
} from '../theme'

const fieldStyle = { ...inputStyle, width: '100%' }
const rowStyle = { marginBottom: '15px' }
const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }

function EditJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyId, setCompanyId] = useState(null)
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [vacancy, setVacancy] = useState('')
  const [employmentType, setEmploymentType] = useState('Full Time')
  const [workArrangement, setWorkArrangement] = useState('')
  const [applicationDeadline, setApplicationDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const today = new Date().toISOString().split('T')[0]
  // If the saved deadline is already in the past, allow it to stay (otherwise the browser blocks saving)
  const minDeadline = applicationDeadline && applicationDeadline < today ? applicationDeadline : today

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await api.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const job = response.data
        setTitle(job.title || '')
        setDescription(job.description || '')
        setCompanyName(job.companyName || '')
        setCompanyId(job.companyId ?? null)
        setLocation(job.location || '')
        setSalary(job.salary || '')
        setVacancy(job.vacancy ?? '')
        setEmploymentType(job.employmentType || 'Full Time')
        setWorkArrangement(job.workArrangement || '')
        setApplicationDeadline(job.applicationDeadline || '')
        setNotes(job.notes || '')
        setCompanyDescription(job.companyDescription || '')
      } catch (err) {
        console.log('Failed to load job:', err.response?.data)
        setLoadError('Failed to load job details.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await api.put(
        `/jobs/${id}`,
        {
          title: title,
          description: description,
          companyName: companyName,
          companyId: companyId,
          location: location,
          salary: salary,
          vacancy: vacancy ? Number(vacancy) : null,
          employmentType: employmentType,
          workArrangement: workArrangement,
          applicationDeadline: applicationDeadline || null,
          notes: notes,
          companyDescription: companyDescription
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Job updated successfully!')
      setTimeout(() => navigate('/my-jobs'), 1000)
    } catch (err) {
      console.log('Update job failed:', err.response?.data)
      const errData = err.response?.data
      let errText = 'Unknown error'
      if (typeof errData === 'string') {
        errText = errData
      } else if (errData?.message) {
        errText = errData.message
      } else if (errData && typeof errData === 'object') {
        const firstKey = Object.keys(errData)[0]
        errText = firstKey ? `${firstKey}: ${errData[firstKey]}` : errText
      }
      setMessage('Failed: ' + errText)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <p style={{ textAlign: 'center', marginTop: '30px', color: TEXT_MUTED }}>Loading...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div>
        <Navbar />
        <div style={{ maxWidth: '500px', margin: '30px auto', padding: '0 16px' }}>
          <p style={errorMsgStyle}>{loadError}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '0 auto 50px', padding: '0 16px', fontFamily: 'Arial' }}>
        <h1 style={pageHeading}>Edit Job</h1>
        <form onSubmit={handleSubmit} style={cardStyle}>
          <div style={rowStyle}>
            <label style={labelStyle}>Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} style={fieldStyle} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Description *</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} style={fieldStyle} rows="4" />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Company Name *</label>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={companyId !== null}
              style={{ ...fieldStyle, background: companyId !== null ? '#f2f2f2' : '#fff' }}
            />
            {companyId !== null && (
              <small style={{ color: TEXT_MUTED }}>Linked to your Company profile — edit it from "My Company".</small>
            )}
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Company Description (about the company, optional)</label>
            <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} style={fieldStyle} rows="3" />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} style={fieldStyle} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Salary</label>
            <input type="number" min="0" value={salary} onChange={(e) => setSalary(e.target.value)} style={fieldStyle} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Vacancy (number of openings)</label>
            <input type="number" min="1" value={vacancy} onChange={(e) => setVacancy(e.target.value)} style={fieldStyle} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Employment Type</label>
            <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} style={fieldStyle}>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Work Arrangement</label>
            <select value={workArrangement} onChange={(e) => setWorkArrangement(e.target.value)} style={fieldStyle}>
              <option value="">Select</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Application Deadline</label>
            <input type="date" min={minDeadline} value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} style={fieldStyle} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={fieldStyle} rows="2" />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ ...buttonStyle, opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          {message && (
            <p style={message.startsWith('Failed') ? errorMsgStyle : successMsgStyle}>{message}</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default EditJobPage