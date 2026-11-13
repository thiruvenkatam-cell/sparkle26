
import { Sparkles, CheckCircle2, ArrowDown } from 'lucide-react'
import '../styles/about.css'

export default function About() {
  return (
    <>
      {/* ABOUT HERO */}
      <section className="about-hero">

        <video
          className="about-hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/event-bg.mp4" type="video/mp4" />
        </video>

        <div className="about-hero-overlay" />
        <div className="about-hero-glow" />

        <div className="about-hero-content">
          <p className="about-kicker">
            <Sparkles size={14} />
            SPARKLE'26 · ABOUT US
          </p>

          <h1>
            More than an event.
            <br />
            <em>A movement of ideas.</em>
          </h1>

          <p>
            A platform where creativity meets technology,
            ideas become reality, and the next generation
            of innovators finds its spark.
          </p>

          <div className="about-hero-meta">
            <span>CREATE</span>
            <i />
            <span>CONNECT</span>
            <i />
            <span>INSPIRE</span>
          </div>
        </div>

        <div className="about-hero-mark">
          S<span>26</span>
        </div>

        <div className="about-scroll">
          <ArrowDown size={15} />
          <span>DISCOVER OUR STORY</span>
        </div>

      </section>

      {/* ABOUT CONTENT */}
      <section className="section about-layout">
        <div className="about-photo">
          <img src="/drmgr2.jpeg" alt="Campus building" />
          <span>BUILD · SHARE · INSPIRE</span>
        </div>

        <div>
          <p className="kicker">MORE THAN AN EVENT</p>

          <h2>
            Fueling the next
            <br />
            <em>wave of innovation.</em>
          </h2>

          <p>
            SPARKLE'26 brings students together to explore technology,
            challenge assumptions, and learn from one another. From
            technical competitions to creative activities, every
            session is an opportunity to discover what you can do.
          </p>

          <p>
            Our goal is simple: create an energetic environment where
            collaboration is encouraged, experimentation is celebrated,
            and every participant leaves with a new idea.
          </p>

          <div className="value-list">
            <div>
              <CheckCircle2 />
              <span>
                <b>Learn by doing</b>
                <small>Hands-on activities and practical challenges.</small>
              </span>
            </div>

            <div>
              <CheckCircle2 />
              <span>
                <b>Connect with creators</b>
                <small>Meet peers who share your curiosity.</small>
              </span>
            </div>

            <div>
              <CheckCircle2 />
              <span>
                <b>Show your spark</b>
                <small>Share projects, skills, and fresh perspectives.</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-band">
        <Sparkles size={28} />
        <blockquote>
          “The future belongs to those who turn curiosity into creation.”
        </blockquote>
        <span>THE SPARKLE'26 SPIRIT</span>
      </section>
    </>
  )
}
