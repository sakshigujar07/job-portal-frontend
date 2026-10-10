import Navbar from '../Navbar'

function AboutPage() {
  const card = {
    maxWidth: '680px',
    margin: '20px auto 0',
    background: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '28px 32px',
    textAlign: 'center',
    lineHeight: '1.7',
    color: '#222',
  }

  const paragraph = {
    fontSize: '18px',
    fontWeight: 'bold',
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>About Us</h1>
        <div style={card}>
          <p style={{ ...paragraph, margin: '0 0 14px' }}>
            Job Portal is a platform built to connect job seekers with employers in one place.
            Employers can easily post job openings and manage applications from candidates.
            Job seekers can search for jobs, apply with their resume, and track their
            application status (Pending, Shortlisted, Hired) — all from a single dashboard.
          </p>
          <p style={{ ...paragraph, margin: 0 }}>
            This project is built using Java (Spring Boot) on the backend and React on the
            frontend, with features like secure login, role-based access control, and resume upload.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage