import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'
import useEvents from '../hooks/useEvents'
import '../styles/eventdetail.css'

function formatDate(date) {
  if (!date) return 'To be announced'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
}

export default function EventDetails() {
  const { eventId } = useParams()
  const { events, loading, error } = useEvents()

  let wanted = eventId
  try {
    wanted = decodeURIComponent(eventId)
  } catch {
    /* keep raw id */
  }
  const event = events.find((item) => String(item.id) === wanted)

  if (loading) {
    return (
      <section className="event-detail-state">
        <span className="event-detail-spinner" />
        <p>Preparing event details...</p>
      </section>
    )
  }

  if (error || !event) {
    return (
      <section className="event-detail-state event-detail-error">
        <h2>Event unavailable</h2>
        <p>{error || 'Event not found. Please return to the events page.'}</p>
        <Link className="event-detail-button" to="/events">
          <ArrowLeft size={17} /> Back to events
        </Link>
      </section>
    )
  }

  const fee = Number.isFinite(event.fee) ? event.fee : null
  const registrationUrl = `/register?eventId=${encodeURIComponent(event.id)}`

  return (
    <>
      <section className="event-detail-hero">
        <div className="event-detail-orb" />
        <div className="event-detail-orb event-detail-orb-two" />

        <div className="event-detail-hero-inner">
          <Link className="event-detail-back" to="/events">
            <ArrowLeft size={16} /> ALL EVENTS
          </Link>

          <div className="event-detail-tags">
            <span>{event.level || 'SPARKLE EVENT'}</span>
            <span>{(event.category || 'Symposium').replace('-', ' ')}</span>
          </div>

          <div className="event-detail-title-row">
            <div>
              <p className="event-detail-kicker">SPARKLE'26 / EVENT PROFILE</p>
              <h1>{event.title}<span>.</span></h1>
            </div>
            <div className="event-detail-symbol">{event.icon || '✳'}</div>
          </div>

          <p className="event-detail-lead">
            {event.description || 'Bring your curiosity, creativity and skills. Full event brief will be announced by the organizers.'}
          </p>

          <div className="event-detail-hero-foot">
            <span>DR. M.G.R. EDUCATIONAL AND RESEARCH INSTITUTE</span>
            <span>CHENNAI · TAMIL NADU</span>
          </div>
        </div>
      </section>

      <section className="event-detail-content">
        <main className="event-detail-main">
          <p className="event-detail-kicker">THE BRIEF</p>
          <h2>Make your <em>mark.</em></h2>
          <p className="event-detail-body">
            {event.description || `Join ${event.title} at SPARKLE'26 and take part in an engaging campus event. The detailed brief and official instructions will be shared by the organizers.`}
          </p>

          <div className="event-detail-rules">
            <div className="event-detail-section-title">
              <ShieldCheck size={19} />
              <h3>Rules & guidelines</h3>
            </div>
            <div className="event-rule-row">
              <CheckCircle2 size={17} />
              <p>Official rules and eligibility will be confirmed by the organizers.</p>
            </div>
            <div className="event-rule-row">
              <CheckCircle2 size={17} />
              <p>Team size and participation format are yet to be announced.</p>
            </div>
            <div className="event-rule-row">
              <CheckCircle2 size={17} />
              <p>Please follow the final instructions shared before the event.</p>
            </div>
          </div>
        </main>

        <aside className="event-detail-sidebar">
          <div className="event-fee-card">
            <p className="event-detail-kicker">REGISTRATION FEE</p>
            <div className="event-fee-amount">
              {fee === null ? (
                <span className="event-fee-tba">To be announced</span>
              ) : fee === 0 ? (
                <span className="event-fee-tba">Free</span>
              ) : (
                <>
                  <span>₹</span>
                  {fee}
                </>
              )}
            </div>
            <p className="event-fee-note">
              {fee > 0 ? 'Per participant · pay by GPay / UPI QR while registering' : 'No payment needed to register'}
            </p>
            <div className="event-fee-divider" />

            <div className="event-info-row">
              <CalendarDays size={18} />
              <div><small>DATE</small><b>{formatDate(event.date)}</b></div>
            </div>
            <div className="event-info-row">
              <MapPin size={18} />
              <div><small>VENUE</small><b>Dr. M.G.R. University</b></div>
            </div>
            <div className="event-info-row">
              <Users size={18} />
              <div><small>TEAM SIZE</small><b>To be confirmed</b></div>
            </div>

            <Link className="event-detail-button event-detail-register" to={registrationUrl}>
              Register now <ArrowRight size={18} />
            </Link>
            <p className="event-fee-disclaimer">
              <IndianRupee size={13} /> Pay via GPay QR · ticket emailed after verification.
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}
