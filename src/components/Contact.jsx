import { useState } from 'react'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { apiRequest } from '../api'
import '../styles/contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ loading: false, message: '', error: false })
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  async function submit(e) {
    e.preventDefault()
    setStatus({ loading: true, message: '', error: false })
    try {
      await apiRequest('/api/contact', { method: 'POST', body: JSON.stringify(form) })
      setStatus({
        loading: false,
        message: 'Message received. The organizing team can follow up with you.',
        error: false,
      })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({
        loading: false,
        message:
          err.message === 'Failed to fetch'
            ? 'Cannot reach the contact server. Please try again later.'
            : err.message,
        error: true,
      })
    }
  }
  return (
    <>
      <section className="section contact-layout">
        <div className="contact-info">
          <p className="kicker">GET IN TOUCH</p>
          <h2>
            We’d love to
            <br />
            <em>hear from you.</em>
          </h2>
          <p>
            Use the contact form or reach out through the official symposium organizers. Update the
            sample details below before launch.
          </p>
          <div className="contact-method">
            <span>
              <Mail />
            </span>
            <div>
              <small>EMAIL</small>
              <b>sparkle@drmgrdu.ac.in</b>
            </div>
          </div>
          <div className="contact-method">
            <span>
              <Phone />
            </span>
            <div>
              <small>PHONE</small>
              <b>+91 94438 48310</b>
            </div>
          </div>
          <div className="contact-method">
            <span>
              <MapPin />
            </span>
            <div>
              <small>VENUE</small>
              <b>
                Dr. M.G.R. Educational and Research Institute
                <br />
                Chennai, Tamil Nadu
              </b>
            </div>
          </div>
        </div>
        <form className="form-card contact-form" onSubmit={submit}>
          <div className="form-heading">
            <h2>
              Send us a <em>message.</em>
            </h2>
            <p>We’ll get back to you through the email you provide.</p>
          </div>
          <label>
            Your name *
            <input
              name="name"
              value={form.name}
              onChange={update}
              required
              maxLength="100"
              placeholder="Your name"
            />
          </label>
          <label>
            Email address *
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              required
              maxLength="150"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Subject *
            <input
              name="subject"
              value={form.subject}
              onChange={update}
              required
              maxLength="150"
              placeholder="What is your message about?"
            />
          </label>
          <label>
            Message *
            <textarea
              name="message"
              value={form.message}
              onChange={update}
              required
              maxLength="2000"
              rows="5"
              placeholder="Tell us how we can help…"
            />
          </label>
          {status.message && (
            <div className={status.error ? 'form-error' : 'form-success'}>{status.message}</div>
          )}
          <button className="btn submit-btn" disabled={status.loading}>
            {status.loading ? 'Sending…' : 'Send message'} <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </>
  )
}
