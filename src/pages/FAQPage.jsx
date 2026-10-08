import { useState } from 'react'
import Navbar from '../Navbar'

function FAQPage() {
  const faqs = [
    {
      question: 'How do I apply for a job?',
      answer: 'Browse jobs on the "Explore Jobs" page, click on a job to view its details, optionally attach your resume, and click Apply.'
    },
    {
      question: 'Can I apply to the same job twice?',
      answer: 'No, once you have applied to a job, you cannot apply again — your existing application will be shown as already submitted.'
    },
    {
      question: 'How do I know if my application status changed?',
      answer: 'You will receive a notification whenever an employer updates your application status (Shortlisted, Hired, or Rejected). Check the Notifications page.'
    },
    {
      question: 'Do I need to upload a resume to apply?',
      answer: 'Resume upload is optional, but attaching one improves your chances of being shortlisted by employers.'
    },
    {
      question: 'How do I post a job as an employer?',
      answer: 'Register with an Employer account, log in, and use the "Post a New Job" option from your dashboard.'
    }
  ]

  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '0 20px' }}>
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ddd', padding: '15px 0' }}>
            <div
              onClick={() => toggle(index)}
              style={{ cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}
            >
              <span>{faq.question}</span>
              <span>{openIndex === index ? '−' : '+'}</span>
            </div>
            {openIndex === index && (
              <p style={{ marginTop: '10px', color: '#555' }}>{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQPage