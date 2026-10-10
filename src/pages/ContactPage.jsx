import Navbar from '../Navbar'

function ContactPage() {
  const label = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
    textAlign: 'center',
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    background: '#ffffff',
    marginBottom: '12px',
  }

  const buttonStyle = {
    width: '100%',
    padding: '9px',
    marginTop: '6px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Get in Touch</h1>
        <p style={{ fontSize: '17px', color: '#444', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 20px' }}>
          Have questions or feedback? Send us a message using the form below.
        </p>

        <div
          style={{
            maxWidth: '420px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '20px 28px',
          }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <label style={label}>Name</label>
            <input style={inputStyle} type="text" />

            <label style={label}>Email</label>
            <input style={inputStyle} type="email" />

            <label style={label}>Message</label>
            <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} />

            <button style={buttonStyle} type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactPage