import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

function HomePage() {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const trendingTags = ['Java', 'React', 'Spring Boot', 'Backend', 'Full Stack']

  const goToSearch = (term) => {
    navigate(`/jobs?search=${encodeURIComponent(term)}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    goToSearch(keyword)
  }

  // ---- styles (matching Login and Register) ----
  const card = {
    maxWidth: '560px',
    margin: '30px auto 0',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '24px 28px',
  }

  const inputStyle = {
    flex: 1,
    padding: '9px 10px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    background: '#ffffff',
  }

  const searchButton = {
    padding: '9px 20px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
  }

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <Navbar />

      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1>Connecting Careers, Creating Futures</h1>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Who understands it's personal? We do. To us, it's about you.
        </p>

        <div style={card}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Job title or keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={searchButton}>Find Jobs</button>
          </form>

          <div style={{ marginTop: '22px' }}>
            <p style={{ color: '#999', marginBottom: '10px', fontSize: '14px' }}>TRENDING</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => goToSearch(tag)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage