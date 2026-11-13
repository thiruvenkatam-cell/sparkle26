
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Sparkles,
} from 'lucide-react'
import { HERO_IMAGE, EVENT_DATE_LABEL } from '../data'
import Countdown from './Countdown'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero"
        style={{ '--hero-image': `url("${HERO_IMAGE}")` }}
      >
        <div className="hero-shade" />

        <div className="hero-content">
          <div className="eyebrow">
            <span />
            DR. M.G.R. EDUCATIONAL AND RESEARCH INSTITUTE
          </div>

          <h1 className="hero-logo">
            <img src="/sparkle-logo.png" alt="SPARKLE'26" />
          </h1>

          <p className="hero-copy">
            A national level technical symposium bringing together
            bright minds, innovative ideas and future technologies.
          </p>

          {/* Senior and Junior Buttons */}
          <div className="hero-actions">
            <button
              type="button"
              className="btn"
              onClick={() =>
                navigate('/events?level=Senior')
              }
            >
              Senior Event<ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                navigate('/events?level=Junior')
              }
            >
              Junior Event<ArrowRight size={18} />
            </button>
          </div>

          {/* Hero Facts */}
          <div className="hero-facts">
            <div>
              <CalendarDays />
              <span>
                <b>{EVENT_DATE_LABEL}</b>
                <small>Senior 26 · Junior 27</small>
              </span>
            </div>

            <div>
              <MapPin />
              <span>
                <b>Dr. M.G.R. University</b>
                <small>Chennai, Tamil Nadu</small>
              </span>
            </div>

            <div>
              <Users />
              <span>
                <b>Technical Symposium</b>
                <small>Workshops · Talks · Competitions</small>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          SCROLL TO EXPLORE <span />
        </div>
      </section>

      {/* Countdown */}
      <Countdown />

      {/* About Section */}
      <section className="section intro-section" id="about">
        <div className="intro-image">
          <img
            src="/drmgr1.jpg"
            alt="University campus"
          />

          <div className="image-stamp">
            <Sparkles />
            <b>
              Ideas Ignite
              <br />
              Tomorrow
            </b>
          </div>
        </div>

        <div className="intro-copy">
          <p className="kicker">WELCOME TO SPARKLE'26</p>

          <h2>
            Where bright ideas
            <br />
            <em>become bold futures.</em>
          </h2>

          <p>
            SPARKLE'26 is a meeting point for curious minds,
            creative builders, and future-ready technologists.
            Explore new ideas, share your work, and connect with
            a community that loves to build.
          </p>

          <div className="stat-row">
            <div>
              <strong>
                17
              </strong>
              <small>Events</small>
            </div>

            <div>
              <strong>
                2<span> days</span>
              </strong>
              <small>Ideas in action</small>
            </div>

            <div>
              <strong>∞</strong>
              <small>Possibilities</small>
            </div>
          </div>

          <Link className="text-link" to="/about">
            Discover our story <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-band">
        <div>
          <p className="kicker">
            YOUR NEXT BIG IDEA STARTS HERE
          </p>
          <h2>Ready to spark something?</h2>
        </div>

        <Link className="btn" to="/register">
          Get your ticket <ArrowRight size={18} />
        </Link>
      </section>
    </>
  )
}
