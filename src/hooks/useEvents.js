import { useEffect, useState } from 'react'
import { apiRequest } from '../api'

// Single source of truth for events = backend /api/events (id, title, level, category, date, icon, fee).
// Cached for the session so Events, Event details, Registration and Ticket pages share one request.
let cache = null
let inflight = null

function loadEvents() {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = apiRequest('/api/events')
      .then((data) => {
        cache = Array.isArray(data) ? data : []
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export default function useEvents() {
  const [state, setState] = useState({ events: cache || [], loading: !cache, error: '' })

  useEffect(() => {
    if (cache) return undefined
    let active = true
    loadEvents()
      .then((events) => active && setState({ events, loading: false, error: '' }))
      .catch(() =>
        active &&
        setState({
          events: [],
          loading: false,
          error: 'Unable to load events right now. Please try again in a moment.',
        }),
      )
    return () => {
      active = false
    }
  }, [])

  return state
}
