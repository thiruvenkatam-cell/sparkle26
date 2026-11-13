// Events now come from the backend (/api/events) via hooks/useEvents.js.
// Only shared static values live here.
export const HERO_IMAGE = '/hero.png'

// ---- Event dates (backend dates live in events/EventController.java SENIOR_DATE / JUNIOR_DATE) ----
export const SENIOR_DATE_LABEL = '26 Nov 2026'
export const JUNIOR_DATE_LABEL = '27 Nov 2026'
export const EVENT_DATE_LABEL = '26 & 27 Nov 2026'

// ---- Countdown timings (IST). CHANGE the start/end times here when the schedule is final. ----
export const SENIOR_START = '2026-11-26T09:00:00+05:30'
export const SENIOR_END = '2026-11-26T17:00:00+05:30'
export const JUNIOR_START = '2026-11-27T09:00:00+05:30'
export const JUNIOR_END = '2026-11-27T17:00:00+05:30'

// ---- GPay / UPI payment (set in frontend/.env, see .env.example) ----
// Option A (recommended): set VITE_UPI_ID -> a QR with the exact amount + reference is generated per registration.
// Option B: leave VITE_UPI_ID empty -> the static image /public/gpay-qr.jpeg (your own GPay QR) is shown.
export const UPI_ID = (import.meta.env.VITE_UPI_ID || '').trim()
export const UPI_NAME = (import.meta.env.VITE_UPI_NAME || "SPARKLE'26").trim()
export const STATIC_QR = '/gpay-qr.jpeg'
