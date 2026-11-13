import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import useEvents from '../hooks/useEvents'
import '../styles/event.css'

const LEVELS = [
  { value: 'all', label: 'All events' },
  { value: 'senior', label: 'Senior' },
  { value: 'junior', label: 'Junior' },
]

const CATEGORIES = [
  { value: 'all', label: 'All categories' },
  { value: 'technical', label: 'Technical' },
  { value: 'non-technical', label: 'Non-technical' },
]

function formatDate(date) {
  if (!date) return 'Date to be announced'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? 'Date to be announced'
    : parsed.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
}

export default function Event() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialLevel = searchParams.get('level')?.toLowerCase()
  const [level, setLevel] = useState(
    ['senior', 'junior'].includes(initialLevel) ? initialLevel : 'all',
  )
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const { events, loading, error } = useEvents()

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return events.filter((event) => {
      const matchesLevel = level === 'all' || event.level?.toLowerCase() === level
      const matchesCategory =
        category === 'all' || event.category?.toLowerCase() === category
      const matchesSearch =
        !query ||
        `${event.title || ''} ${event.description || ''}`.toLowerCase().includes(query)

      return matchesLevel && matchesCategory && matchesSearch
    })
  }, [events, level, category, search])

  function changeLevel(value) {
    setLevel(value)
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('level')
    else next.set('level', value)
    setSearchParams(next, { replace: true })
  }

  return (
    <>
     <section className="events-hero">

  {/* Background Video */}
  <video
    className="events-hero-video"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="/event-bg.mp4" type="video/mp4" />
  </video>

  {/* Video Overlay */}
  <div className="events-hero-overlay" />

  <div className="events-hero-glow" />

  <div className="events-hero-content">
    <p className="events-kicker">
      <Sparkles size={14} /> SPARKLE'26 · EVENT DIRECTORY
    </p>

    <h1>
      Find your next <em>big moment.</em>
    </h1>

    <p>
      Ideas, innovation and competition — find the event that fits your spark.
    </p>
    

    <div className="events-hero-meta">
      <span>
        <b>{String(events.length).padStart(2, '0')}</b> EVENTS
      </span>
      <i />
      <span>ONE CAMPUS. MANY POSSIBILITIES.</span>
    </div>
  </div>

  <div className="events-hero-mark">
    S<span>26</span>
  </div>

</section>

      <section className="section events-directory">
        <div className="directory-heading">
          <div>
            <p className="events-kicker">CHOOSE YOUR CHALLENGE</p>
            <h2>Explore the <em>line-up.</em></h2>
          </div>
          <p className="directory-count">
            SHOWING <b>{String(visibleEvents.length).padStart(2, '0')}</b> / {String(events.length).padStart(2, '0')}
          </p>
        </div>

        <div className="event-controls">
          <label className="event-search">
            <Search size={17} />
            <input
              aria-label="Search events"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events..."
            />
          </label>

          <div className="event-filter-group" aria-label="Filter by participant level">
            <span className="filter-caption"><SlidersHorizontal size={14} /> LEVEL</span>
            {LEVELS.map((item) => (
              <button
                type="button"
                className={level === item.value ? 'event-filter active' : 'event-filter'}
                onClick={() => changeLevel(item.value)}
                key={item.value}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="event-filter-group" aria-label="Filter by category">
            <span className="filter-caption">TYPE</span>
            {CATEGORIES.map((item) => (
              <button
                type="button"
                className={category === item.value ? 'event-filter active' : 'event-filter'}
                onClick={() => setCategory(item.value)}
                key={item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="events-state"><span className="events-spinner" /><p>Loading the line-up...</p></div>
        )}
        {!loading && error && <div className="events-state events-error"><p>{error}</p></div>}

        {!loading && !error && (
          <>
            <div className="events-card-grid">
              {visibleEvents.map((event, index) => (
                <article className="events-card" key={event.id}>
                  <div className="events-card-top">
                    <div className="events-card-icon">{event.icon || '✳'}</div>
                    <span className="events-card-number">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="events-card-tags">
                    <span>{event.level || 'Event'}</span>
                    <span>{(event.category || 'Symposium').replace('-', ' ')}</span>
                  </div>
                  <h3>{event.title || 'Untitled event'}</h3>
                  <p className="events-card-description">
                    {event.description || 'Event description will be announced by the organizers.'}
                  </p>
                  <div className="events-card-footer">
                    <span><CalendarDays size={15} /> {formatDate(event.date)}</span>
                    <Link
                      to={`/events/details/${encodeURIComponent(event.id)}`}
                      aria-label={`View details for ${event.title}`}
                      title="View event details"
                    >
                      Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {visibleEvents.length === 0 && (
              <div className="events-empty">
                <Search size={24} />
                <h3>No matching events</h3>
                <p>Try a different search or clear your filters.</p>
                <button
                  type="button"
                  className="event-filter active"
                  onClick={() => {
                    setSearch('')
                    setCategory('all')
                    changeLevel('all')
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        <div className="events-note">
          <div className="events-note-icon"><Clock3 size={19} /></div>
          <p><b>Schedule & participation details</b><br />Final timings, rules, team size and eligibility will be confirmed by the organizers.</p>
          <ArrowDownRight size={20} />
        </div>
      </section>
    </>
  )
}
