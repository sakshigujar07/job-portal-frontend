import { useState } from 'react'
import Navbar from '../Navbar'

function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <Navbar />

      <div style={{ maxWidth: '500px', margin: '50px auto', padding: '0 20px' }}>
        <h1>Get in Touch</h1>
        <p style={{ color: '#666' }}>
          Have questions or feedback? Send us a message using the form below.
        </p>

        {submitted ? (
          <p style={{ color: 'green', marginTop: '20px' }}>
            Thanks! Your message has been noted — we'll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>Name</label><br />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Email</label><br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Message</label><br />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                rows="4"
                required
              />
            </div>
            <button type="submit" style={{ padding: '8px 20px' }}>Send Message</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ContactPage