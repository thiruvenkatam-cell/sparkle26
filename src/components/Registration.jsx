import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Ticket, Sparkles } from 'lucide-react'
import useEvents from '../hooks/useEvents'
import { EVENT_DATE_LABEL } from '../data'
import { apiRequest } from '../api'
import PaymentPanel from './PaymentPanel'
import '../styles/registration.css'

const feeLabel = (fee) => (fee > 0 ? `₹${fee}` : 'Free')

export default function Registration() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { events, loading: eventsLoading, error: eventsError } = useEvents()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    eventId: searchParams.get('eventId') || '',
    agree: false,
  })
  const [status, setStatus] = useState({ loading: false, error: '' })
  const [pay, setPay] = useState(null) // { reference, amount } once the QR step is shown

  // Drop a pre-selected event id (from ?eventId=) that does not exist
  useEffect(() => {
    if (!eventsLoading && form.eventId && !events.some((ev) => ev.id === form.eventId)) {
      setForm((f) => ({ ...f, eventId: '' }))
    }
  }, [eventsLoading, events, form.eventId])

  const selected = events.find((ev) => ev.id === form.eventId)
  const seniorEvents = events.filter((ev) => ev.level === 'senior')
  const juniorEvents = events.filter((ev) => ev.level === 'junior')

  const update = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const goToTicket = (ticket) =>
    navigate(`/ticket/${encodeURIComponent(ticket.ticketCode)}`, { state: { ticket } })

  const fail = (err) =>
    setStatus({
      loading: false,
      error:
        err.message === 'Failed to fetch'
          ? 'Cannot reach the registration server. Please try again later.'
          : err.message,
    })

  async function submit(e) {
    e.preventDefault()
    if (status.loading) return
    setStatus({ loading: true, error: '' })

    try {
      const { agree, ...payload } = form
      const res = await apiRequest('/api/payments/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (res.free) {
        goToTicket(res.registration)
        return
      }

      // paid event -> show the GPay QR step
      setPay({ reference: res.reference, amount: res.amount })
      setStatus({ loading: false, error: '' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      fail(err)
    }
  }

  const buttonLabel = status.loading
    ? 'Please wait…'
    : selected?.fee > 0
      ? `Continue to pay ₹${selected.fee}`
      : 'Complete registration'

  return (
    <>
      {/* REGISTRATION HERO */}

      <section className="registration-hero">

        <video
          className="registration-hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/event-bg.mp4" type="video/mp4" />
        </video>

        <div className="registration-hero-overlay" />
        <div className="registration-hero-glow" />

        <div className="registration-hero-content">
          <p className="registration-kicker">
            <Sparkles size={14} />
            SPARKLE'26 · JOIN THE EXPERIENCE
          </p>

          <h1>
            Your journey
            <br />
            starts <em>right here.</em>
          </h1>

          <p>
            One step closer to new ideas, exciting challenges,
            and unforgettable experiences. Secure your place
            at SPARKLE'26.
          </p>

          <div className="registration-hero-meta">
            <span>REGISTER</span>
            <i />
            <span>PARTICIPATE</span>
            <i />
            <span>CREATE</span>
          </div>
        </div>

        <div className="registration-hero-mark">
          S<span>26</span>
        </div>

        <div className="registration-scroll">
          <ArrowRight size={15} />
          <span>COMPLETE YOUR REGISTRATION</span>
        </div>

      </section>

      {/* REGISTRATION FORM */}

      <section className="section register-layout">

        <div className="register-aside">
          <div className="ticket-preview">
            <div className="ticket-glow" />

            <span className="ticket-label">YOUR NEXT CHAPTER</span>

            <img
              className="ticket-logo"
              src="/sparkle-logo.png"
              alt="SPARKLE'26 - Ideas Ignite Tomorrow"
            />

            <div className="ticket-line" />

            <div className="ticket-meta">
              <span>
                {EVENT_DATE_LABEL.toUpperCase()}
                <small>EVENT DATE</small>
              </span>

              <span>
                CHENNAI
                <small>TAMIL NADU</small>
              </span>
            </div>
          </div>

          <h3>
            One registration.
            <br />
            <em>A world of possibilities.</em>
          </h3>

          <p>
            Keep your QR ticket safe. Organizers will verify it at
            the venue on event day. Once your GPay payment is verified, your
            ticket number is emailed to you.
          </p>

          <div className="secure-note">
            <CheckCircle2 />
            Pay by GPay / any UPI app. Ticket is issued after the organizers verify your payment.
          </div>
        </div>

        {pay ? (
          <PaymentPanel
            reference={pay.reference}
            amount={pay.amount}
            eventTitle={selected?.title || ''}
            onBack={() => setPay(null)}
          />
        ) : (
        <form className="form-card" onSubmit={submit}>

          <div className="form-heading">
            <span className="step-label">PARTICIPANT REGISTRATION</span>

            <h2>
              Let’s get you <em>registered.</em>
            </h2>

            <p>Fields marked * are required.</p>
          </div>

          <div className="form-grid">

            <label>
              Full name *
              <input
                name="fullName"
                value={form.fullName}
                onChange={update}
                required
                minLength="2"
                maxLength="100"
                placeholder="Enter your full name"
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
              Phone number *
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={update}
                required
                pattern="[0-9+\(\)\- ]{8,20}"
                title="8–20 characters: digits, spaces, + ( ) -"
                placeholder="+91 98765 43210"
              />
            </label>

            <label>
              College / Institution *
              <input
                name="college"
                value={form.college}
                onChange={update}
                required
                maxLength="150"
                placeholder="Your college name"
              />
            </label>

            <label>
              Department *
              <input
                name="department"
                value={form.department}
                onChange={update}
                required
                maxLength="100"
                placeholder="e.g. Information Technology"
              />
            </label>

            <label>
              Year of study *
              <select
                name="year"
                value={form.year}
                onChange={update}
                required
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="full-field">
              Event *
              <select
                name="eventId"
                value={form.eventId}
                onChange={update}
                required
                disabled={eventsLoading || !!eventsError}
              >
                <option value="">
                  {eventsLoading ? 'Loading events…' : 'Select an event'}
                </option>

                {seniorEvents.length > 0 && (
                  <optgroup label="Senior events">
                    {seniorEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} · {feeLabel(ev.fee)}
                      </option>
                    ))}
                  </optgroup>
                )}

                {juniorEvents.length > 0 && (
                  <optgroup label="Junior events">
                    {juniorEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} · {feeLabel(ev.fee)}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </label>

          </div>

          {selected && (
            <p className="fee-summary">
              <b>{selected.title}</b> · Registration fee: <b>{feeLabel(selected.fee)}</b>
            </p>
          )}

          <label className="check-label">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={update}
              required
            />
            I confirm the details above are accurate.
          </label>

          {(status.error || eventsError) && (
            <div className="form-error">{status.error || eventsError}</div>
          )}

          <button
            className="btn submit-btn"
            disabled={status.loading || eventsLoading || !!eventsError}
          >
            {buttonLabel}

            <ArrowRight size={18} />
          </button>

          <p className="form-footnote">
            <Ticket size={14} />
            Your unique ticket code and QR will be generated after successful
            registration{selected?.fee > 0 ? ' and payment verification' : ''}.
          </p>

        </form>
        )}
      </section>
    </>
  )
}
