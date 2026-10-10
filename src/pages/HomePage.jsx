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
    maxWidth: '720px',
    margin: '30px auto 0',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
    padding: '36px 40px',
  }

  const inputStyle = {
    flex: 1,
    padding: '14px 14px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    background: '#ffffff',
  }

  const searchButton = {
    padding: '14px 28px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
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
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Job title or keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={searchButton}>Find Jobs</button>
          </form>

          <div style={{ marginTop: '28px' }}>
            <p style={{ color: '#999', marginBottom: '14px', fontSize: '15px' }}>TRENDING</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => goToSearch(tag)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f5f5f5',
                    fontSize: '14px',
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