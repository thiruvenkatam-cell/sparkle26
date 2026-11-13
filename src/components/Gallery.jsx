
import { Sparkles, ArrowDown } from 'lucide-react'
import '../styles/gallery.css'

export default function Gallery() {
  const pics = [
    ['Campus & community', '/drmgr1.jpg'],
    ['Ideas in action', '/drmgr6.jpg'],
    ['Technology & teamwork', '/drmgr4.jpeg'],
    ['Learning together', '/drmgr5.jpg'],
    ['Build your future', '/hero.png'],
    ['The big moment', '/drmgr2.jpeg'],
  ]

  return (
    <>
      {/* HERO SECTION */}
      <section className="gallery-hero">
        <video
          className="gallery-hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/event-bg.mp4" type="video/mp4" />
        </video>

        <div className="gallery-hero-overlay"></div>
        <div className="gallery-hero-glow"></div>

        <div className="gallery-hero-content">
          <p className="gallery-kicker">
            <Sparkles size={14} />
            SPARKLE'26 · OUR GALLERY
          </p>

          <h1>
            Moments that
            <br />
            <em>last forever.</em>
          </h1>

          <p>
            Explore the moments, memories, creativity and experiences
            that bring the SPARKLE'26 community together.
          </p>

          <div className="gallery-hero-meta">
            <span>EXPLORE</span>
            <i></i>
            <span>EXPERIENCE</span>
            <i></i>
            <span>REMEMBER</span>
          </div>
        </div>

        <div className="gallery-hero-mark">
          S<span>26</span>
        </div>

        <div className="gallery-scroll">
          <ArrowDown size={15} />
          <span>EXPLORE OUR MOMENTS</span>
        </div>
      </section>

      {/* GALLERY IMAGES */}
      <section className="section gallery-grid">
        {pics.map(([label, image], i) => (
          <figure
            className={`gallery-item gallery-${i + 1}`}
            key={image}
          >
            <img
              src={image}
              alt={label}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />

            <figcaption>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {label}
            </figcaption>
          </figure>
        ))}
      </section>

      <p className="gallery-note">
        SPARKLE'26 — Moments that matter.
      </p>
    </>
  )
}
