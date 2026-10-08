import { useState } from 'react'
import api from '../api'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Navbar from '../Navbar'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('location.state:', location.state)
    try {
      const response = await api.post('/users/login', {
        email: email,
        password: password
      })
      const token = response.data
      localStorage.setItem('token', token)
      setMessage('Login successful!')
      const returnTo = location.state?.returnTo || '/dashboard'
      navigate(returnTo)
    } catch (error) {
      console.log('Login failed:', error.response?.data)
      setMessage('Login failed: ' + (error.response?.data || 'Unknown error'))
    }
  }

  // ---- styles (matching RegisterPage) ----
  const pageWrap = {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '20px',
    paddingBottom: '20px',
  }

  const card = {
    width: '380px',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px 28px',
  }

  const pageHeading = {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '30px 0 20px',
  }

  const fieldGroup = { marginBottom: '9px' }

  const label = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  }

  const inputStyle = {
    width: '100%',
    padding: '7px 10px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  }

  const buttonStyle = {
    width: '100%',
    padding: '9px',
    marginTop: '14px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
  }

  const footerText = {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '13px',
    color: '#555',
  }

  return (
    <div>
      <Navbar />
      <div style={pageWrap}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1 style={pageHeading}>Job Portal Login</h1>
          <div style={card}>
            <form onSubmit={handleSubmit}>
              <div style={fieldGroup}>
                <label style={label}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={fieldGroup}>
                <label style={label}>Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {message && (
                <p
                  style={{
                    color: message.startsWith('Login successful') ? 'green' : 'red',
                    fontSize: '13px',
                  }}
                >
                  {message}
                </p>
              )}

              <button style={buttonStyle} type="submit">
                Login
              </button>
            </form>
            <p style={footerText}>
              Don't have an account?{' '}
              <Link to="/register" state={{ returnTo: location.state?.returnTo }}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage