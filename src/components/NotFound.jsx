import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import '../styles/ticket.css'

export default function NotFound() {
  return (
    <section className="section ticket-result">
      <p className="kicker">404 · PAGE NOT FOUND</p>
      <h2>This page wandered off.</h2>
      <Link className="btn" to="/">
        Back to home <ArrowRight />
      </Link>
    </section>
  )
}
