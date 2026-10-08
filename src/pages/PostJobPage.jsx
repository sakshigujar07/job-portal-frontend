import { useState, useEffect } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import {
  BORDER,
  TEXT_MUTED,
  pageHeading,
  inputStyle,
  buttonStyle,
  errorMsgStyle,
  successMsgStyle,
} from '../theme'

function PostJobPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyId, setCompanyId] = useState(null)
  const [myCompany, setMyCompany] = useState(null)
  const [useCustomName, setUseCustomName] = useState(false)
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [vacancy, setVacancy] = useState('')
  const [employmentType, setEmploymentType] = useState('Full Time')
  const [workArrangement, setWorkArrangement] = useState('')
  const [applicationDeadline, setApplicationDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const token = localStorage.getItem('token')
    api
      .get('/companies/my', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setMyCompany(res.data)
        setCompanyName(res.data.name || '')
        setCompanyId(res.data.id)
      })
      .catch(() => {
        setMyCompany(null)
      })
  }, [])

  const handleUseCustomToggle = (e) => {
    const checked = e.target.checked
    setUseCustomName(checked)
    if (checked) {
      setCompanyId(null)
      setCompanyName('')
    } else if (myCompany) {
      setCompanyId(myCompany.id)
      setCompanyName(myCompany.name || '')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setMessage('')
    setIsError(false)
    try {
      const token = localStorage.getItem('token')
      await api.post(
        '/jobs',
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
      setMessage('Job posted successfully!')
      setTimeout(() => navigate('/my-jobs'), 1000)
    } catch (err) {
      console.log('Post job failed:', err.response?.data)
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
      setIsError(true)
      setIsSubmitting(false)
    }
  }

  const labelStyle = { fontWeight: 'bold', fontSize: '14px' }
  const fieldWrapStyle = { marginBottom: '15px' }
  const fullWidthInput = { ...inputStyle, width: '100%' }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial', padding: '0 16px' }}>
        <h1 style={pageHeading}>Post a New Job</h1>
        <form onSubmit={handleSubmit}>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Title *</label><br />
            <input required value={title} onChange={(e) => setTitle(e.target.value)} style={fullWidthInput} />
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Description *</label><br />
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} style={fullWidthInput} rows="4" />
          </div>

          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Company Name *</label><br />
            {myCompany && !useCustomName ? (
              <div style={{ padding: '8px 10px', background: '#f0f4ff', borderRadius: '6px', border: `1px solid ${BORDER}` }}>
                {companyName} <span style={{ color: TEXT_MUTED, fontSize: '13px' }}>(from your Company Profile)</span>
              </div>
            ) : (
              <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={fullWidthInput} />
            )}
            {myCompany && (
              <label style={{ display: 'block', marginTop: '6px', fontSize: '13px', fontWeight: 'normal', color: TEXT_MUTED }}>
                <input type="checkbox" checked={useCustomName} onChange={handleUseCustomToggle} style={{ marginRight: '6px' }} />
                Use a different company name for this job
              </label>
            )}
          </div>

          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Company Description (about the company, optional)</label><br />
            <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} style={fullWidthInput} rows="3" />
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Location</label><br />
            <input value={location} onChange={(e) => setLocation(e.target.value)} style={fullWidthInput} />
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Salary</label><br />
            <input type="number" min="0" value={salary} onChange={(e) => setSalary(e.target.value)} style={fullWidthInput} />
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Vacancy (number of openings)</label><br />
            <input type="number" min="1" value={vacancy} onChange={(e) => setVacancy(e.target.value)} style={fullWidthInput} />
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Employment Type</label><br />
            <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} style={fullWidthInput}>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Work Arrangement</label><br />
            <select value={workArrangement} onChange={(e) => setWorkArrangement(e.target.value)} style={fullWidthInput}>
              <option value="">Select</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Application Deadline</label><br />
            <input type="date" min={today} value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} style={fullWidthInput} />
          </div>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Notes (optional)</label><br />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={fullWidthInput} rows="2" />
          </div>
          <button type="submit" disabled={isSubmitting} style={{ ...buttonStyle, opacity: isSubmitting ? 0.6 : 1 }}>
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </form>
        {message && <p style={isError ? errorMsgStyle : successMsgStyle}>{message}</p>}
      </div>
    </div>
  )
}

export default PostJobPage