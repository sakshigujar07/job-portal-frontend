import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from './api'

function getInitials(name) {
  if (!name) return null
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch (err) {
    return null
  }
}

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [initials, setInitials] = useState(null)
  const [isEmployer, setIsEmployer] = useState(false)

  useEffect(() => {
    if (!token) {
      setInitials(null)
      setIsEmployer(false)
      return
    }
    api
      .get('/profiles/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInitials(getInitials(response.data.fullName))
      })
      .catch(() => {
        setInitials(null)
      })

    const decoded = decodeJwt(token)
    // NOTE: assuming the role claim key is "role" - if this doesn't work,
    // check the actual JWT payload and adjust the key below.
    const role = decoded?.role
    setIsEmployer(role === 'employer')
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#333',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        <h3 style={{ margin: 0 }}>Job Portal</h3>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {token ? (
          <>
            <Link to="/dashboard" title="Back to Dashboard" style={{ color: 'white', fontSize: '18px', textDecoration: 'none' }}>←</Link>
            <Link to="/jobs" style={{ color: 'white' }}>Jobs</Link>
            {isEmployer && (
              <Link to="/company-profile" style={{ color: 'white' }}>My Company</Link>
            )}
            <Link to="/profile" style={{ color: 'white' }}>Profile</Link>
            <Link to="/notifications" style={{ color: 'white' }}>Notifications</Link>
            <button onClick={handleLogout} style={{ padding: '6px 16px' }}>Logout</button>
            <Link
              to="/profile"
              title="View profile"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#dbe4ff',
                color: '#1a3a8f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              {initials || '?'}
            </Link>
          </>
        ) : (
          <>
            <Link to="/" style={{ color: 'white' }}>Home</Link>
            <Link to="/about" style={{ color: 'white' }}>About</Link>
            <Link to="/contact" style={{ color: 'white' }}>Contact</Link>
            <Link to="/faq" style={{ color: 'white' }}>FAQ</Link>
            <Link to="/login" style={{ color: 'white' }}>Log In</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar