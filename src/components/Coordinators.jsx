import { useMemo, useState } from 'react'
import { Phone, Search, UserRound, Users } from 'lucide-react'
import { COORDINATORS } from '../coordinators'
import '../styles/coordinators.css'

const LEVELS = [
  { value: 'all', label: 'All' },
  { value: 'senior', label: 'Senior' },
  { value: 'junior', label: 'Junior' },
]

// "9962692893/9790707156" -> two separate tap-to-call links
function PhoneLinks({ phone }) {
  const numbers = String(phone || '')
    .split('/')
    .map((n) => n.trim())
    .filter(Boolean)
  if (numbers.length === 0) return <span className="coord-nophone">—</span>
  return (
    <span className="coord-phone">
      {numbers.map((n, i) => (
        <a key={n + i} href={`tel:${n.replace(/\s/g, '')}`}>
          <Phone size={13} /> {n}
        </a>
      ))}
    </span>
  )
}

export default function Coordinators() {
  const [level, setLevel] = useState('all')
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return COORDINATORS.filter((e) => {
      if (level !== 'all' && e.level !== level) return false
      if (!q) return true
      const haystack = [e.title, e.staff?.name, ...e.students.map((s) => s.name)].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [level, search])

  return (
    <>
      <section className="coord-hero">
        <p className="kicker">DEPARTMENT OF INFORMATION TECHNOLOGY</p>
        <h1>
          Event <em>coordinators.</em>
        </h1>
        <p>Need help with an event? Contact the student coordinators or the staff coordinator directly.</p>
      </section>

      <section className="section coord-section">
        <div className="coord-controls">
          <label className="coord-search">
            <Search size={17} />
            <input
              aria-label="Search coordinators"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event or coordinator name..."
            />
          </label>
          <div className="coord-filter">
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l.value}
                className={level === l.value ? 'event-filter active' : 'event-filter'}
                onClick={() => setLevel(l.value)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="coord-grid">
          {visible.map((e) => (
            <article className="coord-card" key={e.id}>
              <header>
                <span className="coord-icon">{e.icon}</span>
                <div>
                  <h3>{e.title}</h3>
                  <small>
                    {e.level.toUpperCase()} · {e.category.replace('-', ' ').toUpperCase()}
                  </small>
                </div>
              </header>

              {e.staff && (
                <div className="coord-staff">
                  <small>STAFF COORDINATOR</small>
                  <div className="coord-row">
                    <b><UserRound size={14} /> {e.staff.name}</b>
                    <PhoneLinks phone={e.staff.phone} />
                  </div>
                </div>
              )}

              {e.students.length > 0 && (
                <div className="coord-students">
                  <small><Users size={13} /> STUDENT COORDINATORS</small>
                  {e.students.map((s, i) => (
                    <div className="coord-row" key={s.name + i}>
                      <b>{s.name}</b>
                      <PhoneLinks phone={s.phone} />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="events-empty">
            <Search size={24} />
            <h3>No coordinators found</h3>
            <p>Try a different search.</p>
          </div>
        )}
      </section>
    </>
  )
}
