import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api'
import Navbar from '../Navbar'
import {
  ACCENT,
  TEXT_MUTED,
  BORDER,
  pageHeading,
  cardStyle,
  inputStyle,
  buttonStyle,
  errorMsgStyle,
} from '../theme'

const PAGE_SIZE = 10

function JobListPage() {
  const [jobs, setJobs] = useState([])
  const [companiesById, setCompaniesById] = useState({})
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const initialPage = parseInt(searchParams.get('page') || '0', 10)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token')
        const activeSearch = searchParams.get('search') || ''
        const activePage = parseInt(searchParams.get('page') || '0', 10)

        const response = await api.get('/jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            page: activePage,
            size: PAGE_SIZE,
            ...(activeSearch ? { search: activeSearch } : {})
          }
        })
        setJobs(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
        setCurrentPage(response.data.number)
      } catch (err) {
        console.log('Failed to fetch jobs:', err.response?.data)
        setError('Failed to load jobs')
      }
    }

    fetchJobs()
  }, [searchParams])

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await api.get('/companies', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const map = {}
        response.data.forEach((c) => {
          map[c.id] = c
        })
        setCompaniesById(map)
      } catch (err) {
        // Non-fatal - jobs will just show their raw companyName instead
        console.log('Failed to fetch companies:', err.response?.data)
      }
    }

    fetchCompanies()
  }, [])

  const getCompanyDisplayName = (job) => {
    if (job.companyId && companiesById[job.companyId]) {
      return companiesById[job.companyId].name
    }
    return job.companyName
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = { page: '0' }
    if (searchTerm) params.search = searchTerm
    setSearchParams(params)
  }

  const goToPage = (pageNum) => {
    const params = {}
    const activeSearch = searchParams.get('search') || ''
    if (activeSearch) params.search = activeSearch
    params.page = String(pageNum)
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial', padding: '0 16px' }}>
        <h1 style={pageHeading}>Available Jobs</h1>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search by title, company, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="submit" style={buttonStyle}>Search</button>
        </form>

        {error && <p style={errorMsgStyle}>{error}</p>}
        {jobs.length === 0 && !error && (
          <p style={{ color: TEXT_MUTED, textAlign: 'center' }}>No jobs found.</p>
        )}

        {!error && totalElements > 0 && (
          <p style={{ color: TEXT_MUTED, fontSize: '13px', marginBottom: '10px' }}>
            {totalElements} job{totalElements === 1 ? '' : 's'} found
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {jobs.map((job) => (
            <div key={job.id} style={cardStyle}>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px', color: '#111' }}>{job.title}</h2>
              <p style={{ margin: '0 0 8px', color: TEXT_MUTED }}>
                <strong style={{ color: '#111' }}>{getCompanyDisplayName(job)}</strong> — {job.location}
              </p>
              <p style={{ margin: '0 0 8px', color: '#333' }}>{job.description}</p>
              <p style={{ margin: '0 0 12px', color: TEXT_MUTED }}>Salary: {job.salary}</p>
              <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                <button style={buttonStyle}>View Details & Apply</button>
              </Link>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', margin: '24px 0' }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              style={{ ...buttonStyle, opacity: currentPage === 0 ? 0.5 : 1, cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ color: TEXT_MUTED, fontSize: '14px' }}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              style={{ ...buttonStyle, opacity: currentPage >= totalPages - 1 ? 0.5 : 1, cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobListPage