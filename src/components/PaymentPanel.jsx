import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle2, Clock3, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react'
import { apiRequest } from '../api'
import { UPI_ID, UPI_NAME, STATIC_QR } from '../data'
import '../styles/payment.css'

const POLL_MS = 10000

// Step 2 of registration: pay on the GPay QR, enter the UTR, wait for the organizers to approve.
export default function PaymentPanel({ reference, amount, eventTitle, onBack }) {
  const navigate = useNavigate()
  const [stage, setStage] = useState('pay') // pay | wait
  const [utr, setUtr] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [rejected, setRejected] = useState('')
  const timer = useRef(null)

  const upiLink = UPI_ID
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(reference)}`
    : ''

  const goToTicket = (code) => navigate(`/ticket/${encodeURIComponent(code)}`)

  const handleStatus = (s) => {
    if (s.status === 'PAID' && s.ticketCode) goToTicket(s.ticketCode)
    else if (s.status === 'REJECTED') {
      setRejected(s.rejectReason || 'We could not verify your payment.')
      setStage('pay')
      setUtr('')
    }
  }

  // while waiting, check every few seconds so the page moves on as soon as it is approved
  useEffect(() => {
    if (stage !== 'wait') return
    const check = () =>
      apiRequest(`/api/payments/status/${encodeURIComponent(reference)}`).then(handleStatus).catch(() => {})
    timer.current = setInterval(check, POLL_MS)
    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, reference])

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const s = await apiRequest('/api/payments/submit', {
        method: 'POST',
        body: JSON.stringify({ reference, utr: utr.replace(/\s/g, '') }),
      })
      setRejected('')
      if (s.status === 'PAID' && s.ticketCode) goToTicket(s.ticketCode)
      else setStage('wait')
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Cannot reach the server. Please try again.' : err.message)
    } finally {
      setBusy(false)
    }
  }

  async function checkNow() {
    setBusy(true)
    setError('')
    try {
      handleStatus(await apiRequest(`/api/payments/status/${encodeURIComponent(reference)}`))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (stage === 'wait') {
    return (
      <div className="form-card pay-card">
        <div className="pay-wait-icon"><Clock3 size={30} /></div>
        <span className="step-label">PAYMENT SUBMITTED</span>
        <h2>Verification <em>in progress</em></h2>
        <p className="pay-muted">
          Thanks! Our team is checking your payment. Once it is approved, your ticket number is
          emailed to you ("Welcome to Sparkle26") and this page will open your ticket automatically.
        </p>
        <div className="pay-ref">
          <small>YOUR REFERENCE</small>
          <b>{reference}</b>
        </div>
        <p className="pay-muted small">You can close this page – the ticket will reach your email. Verification can take a little while.</p>
        {error && <div className="form-error">{error}</div>}
        <button className="btn submit-btn" onClick={checkNow} disabled={busy}>
          {busy ? 'Checking…' : 'Check status now'} <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <form className="form-card pay-card" onSubmit={submit}>
      <span className="step-label">STEP 2 · PAY WITH GPAY / UPI</span>
      <h2>Scan &amp; <em>pay ₹{amount}</em></h2>
      <p className="pay-muted">{eventTitle}</p>

      {rejected && (
        <div className="form-error">
          Payment not verified: {rejected} If you did pay, enter the correct transaction ID below.
        </div>
      )}

      <div className="pay-qr">
        {UPI_ID ? (
          <QRCodeSVG value={upiLink} size={220} level="M" includeMargin bgColor="#ffffff" />
        ) : (
          <img src={STATIC_QR} alt="GPay QR code" width="240" height="240" />
        )}
        <b className="pay-amount">₹{amount}</b>
        {UPI_ID && <small>UPI ID: {UPI_ID}</small>}
        {upiLink && (
          <a className="pay-app-btn" href={upiLink}>
            <Smartphone size={15} /> Pay with UPI app (mobile)
          </a>
        )}
      </div>

      <ol className="pay-steps">
        <li>Scan the QR with GPay / any UPI app and pay <b>exactly ₹{amount}</b>.</li>
        <li>Open the payment details and copy the <b>UPI transaction ID (12 digits)</b>.</li>
        <li>Paste it below and submit. We verify it and email your ticket.</li>
      </ol>

      <div className="pay-ref">
        <small>YOUR REFERENCE</small>
        <b>{reference}</b>
      </div>

      <label className="pay-utr">
        UPI transaction ID (UTR) *
        <input
          value={utr}
          onChange={(e) => setUtr(e.target.value.replace(/[^\d\s]/g, ''))}
          inputMode="numeric"
          required
          pattern="[0-9 ]{12,20}"
          maxLength={20}
          placeholder="12-digit number, e.g. 412345678901"
        />
      </label>

      {error && <div className="form-error">{error}</div>}

      <button className="btn submit-btn" disabled={busy || utr.replace(/\s/g, '').length !== 12}>
        {busy ? 'Submitting…' : 'I have paid – submit'} <CheckCircle2 size={18} />
      </button>
      <button type="button" className="pay-back" onClick={onBack}>
        <ArrowLeft size={14} /> Edit my details
      </button>
    </form>
  )
}
