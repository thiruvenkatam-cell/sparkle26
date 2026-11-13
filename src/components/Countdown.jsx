import { useEffect, useState } from 'react'
import { Timer, Radio, CheckCircle2 } from 'lucide-react'
import {
  SENIOR_START,
  SENIOR_END,
  JUNIOR_START,
  JUNIOR_END,
  SENIOR_DATE_LABEL,
  JUNIOR_DATE_LABEL,
} from '../data'
import '../styles/countdown.css'

const pad = (n) => String(n).padStart(2, '0')

function parts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    hoursTotal: Math.floor(total / 3600),
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

function DayCard({ label, dateLabel, start, end, now }) {
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()

  let state = 'upcoming'
  let left = startMs - now
  if (now >= endMs) {
    state = 'over'
    left = 0
  } else if (now >= startMs) {
    state = 'live'
    left = endMs - now
  }
  const t = parts(left)

  return (
    <article className={`cd-card cd-${state}`}>
      <div className="cd-top">
        <span className="cd-level">{label}</span>
        <span className="cd-date">{dateLabel}</span>
      </div>

      {state === 'over' ? (
        <div className="cd-over">
          <CheckCircle2 size={26} />
          <b>Event completed</b>
        </div>
      ) : (
        <>
          <p className="cd-status">
            {state === 'live' ? (
              <>
                <Radio size={14} /> HAPPENING NOW · ends in
              </>
            ) : (
              <>
                <Timer size={14} /> STARTS IN
              </>
            )}
          </p>

          <div className="cd-hours">
            <b>{t.hoursTotal}</b>
            <span>hours left</span>
          </div>

          <div className="cd-grid">
            <div><b>{pad(t.days)}</b><small>DAYS</small></div>
            <div><b>{pad(t.hours)}</b><small>HRS</small></div>
            <div><b>{pad(t.minutes)}</b><small>MIN</small></div>
            <div><b>{pad(t.seconds)}</b><small>SEC</small></div>
          </div>
        </>
      )}
    </article>
  )
}

export default function Countdown() {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="section countdown-section" id="countdown">
      <p className="kicker">COUNTDOWN</p>
      <h2>
        Time left for <em>SPARKLE'26.</em>
      </h2>
      <div className="cd-wrap">
        <DayCard label="SENIOR EVENTS" dateLabel={SENIOR_DATE_LABEL} start={SENIOR_START} end={SENIOR_END} now={now} />
        <DayCard label="JUNIOR EVENTS" dateLabel={JUNIOR_DATE_LABEL} start={JUNIOR_START} end={JUNIOR_END} now={now} />
      </div>
    </section>
  )
}
