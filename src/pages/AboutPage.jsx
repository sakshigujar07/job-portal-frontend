import Navbar from '../Navbar'

function AboutPage() {
  return (
    <div style={{ fontFamily: 'Arial' }}>
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '0 20px' }}>
        <h1>About Us</h1>
        <p style={{ lineHeight: '1.7', color: '#444' }}>
          Job Portal is a platform built to connect job seekers with employers
          in one place. Employers can easily post job openings and manage
          applications from candidates. Job seekers can search for jobs, apply
          with their resume, and track their application status (Pending,
          Shortlisted, Hired) — all from a single dashboard.
        </p>
        <p style={{ lineHeight: '1.7', color: '#444' }}>
          This project is built using Java (Spring Boot) on the backend and
          React on the frontend, with features like secure login, role-based
          access control, and resume upload.
        </p>
      </div>
    </div>
  )
}

export default AboutPage