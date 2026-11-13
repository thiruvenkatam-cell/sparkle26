import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, Mail, MapPin, ArrowRight } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import useEvents from '../hooks/useEvents'
import { EVENT_DATE_LABEL, SENIOR_DATE_LABEL, JUNIOR_DATE_LABEL } from '../data'
import '../styles/ticket.css'
import { apiRequest } from '../api'

export default function TicketPage() {
  const { ticketCode } = useParams()
  const location = useLocation()
  const [ticket, setTicket] = useState(location.state?.ticket || null)
  const [error, setError] = useState('')
  const { events } = useEvents()
  useEffect(() => {
    if (ticket) return
    apiRequest(`/api/registrations/${encodeURIComponent(ticketCode)}`)
      .then(setTicket)
      .catch((e) => setError(e.message))
  }, [ticket, ticketCode])
  if (error)
    return (
      <section className="section ticket-result">
        <h2>Ticket unavailable</h2>
        <p>{error}</p>
        <Link className="btn" to="/register">
          Register again
        </Link>
      </section>
    )
  if (!ticket)
    return (
      <section className="section ticket-result">
        <div className="spinner" />
        <p>Loading your ticket…</p>
      </section>
    )
  const qrValue = ticket.ticketCode
  const ticketEvent = events.find((e) => e.id === ticket.eventId)
  const dateLabel = ticketEvent ? (ticketEvent.level === 'junior' ? JUNIOR_DATE_LABEL : SENIOR_DATE_LABEL) : EVENT_DATE_LABEL
  return (
    <section className="ticket-page">
      <div className="ticket-success">
        <span className="success-icon">
          <CheckCircle2 />
        </span>
        <p className="kicker">REGISTRATION CONFIRMED</p>
        <h1>
          You’re on the <em>list.</em>
        </h1>
        <p>Your SPARKLE'26 ticket is ready. Save this screen or take a screenshot for event day.</p>
      </div>
      <div className="digital-ticket">
        <div className="digital-ticket-top">
        <Link to="/" className="ticket-brand-logo" aria-label="SPARKLE'26 home">
        <img src="/sparkle-logo.png" alt="SPARKLE'26 - Ideas Ignite Tomorrow" />
        </Link>
          <span className="confirmed-pill">● CONFIRMED</span>
        </div>
        <div className="ticket-main">
          <div>
            <p className="kicker">DIGITAL ENTRY PASS</p>
            <h2>{ticket.fullName}</h2>
            <p>{ticket.college}</p>
            <div className="ticket-detail-grid">
              <div>
                <small>TICKET CODE</small>
                <b>{ticket.ticketCode}</b>
              </div>
              <div>
                <small>EVENT</small>
                <b>
                  {events.find((e) => e.id === ticket.eventId)?.title || 'General registration'}
                </b>
              </div>
              <div>
                <small>DEPARTMENT</small>
                <b>{ticket.department}</b>
              </div>
              <div>
                <small>DATE</small>
                <b>{dateLabel}</b>
              </div>
            </div>
          </div>
          <div className="qr-panel">
            <QRCodeSVG value={qrValue} size={180} level="H" includeMargin />
            <small>SCAN TO VERIFY TICKET</small>
          </div>
        </div>
        <div className="ticket-perforation">
          <span />
          <span />
        </div>
        <div className="ticket-bottom">
          <span>
            <Mail size={15} /> {ticket.email}
          </span>
          <span>
            <MapPin size={15} /> Chennai, Tamil Nadu
          </span>
        </div>
      </div>
      <p className="ticket-disclaimer">
        Show this QR at the registration desk on event day. Senior events: 26 Nov 2026 · Junior events: 27 Nov 2026.
      </p>
      <div className="ticket-actions">
        <button className="btn" onClick={() => window.print()}>
          Print / Save as PDF <ArrowRight size={17} />
        </button>
        <Link className="btn btn-ghost light-ghost" to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}
